/**
 * Text-to-Speech Service
 *
 * Provides high-quality TTS using OpenAI TTS API (gpt-4o-mini-tts) via Supabase Edge Function.
 * Falls back to browser Web Speech API if OpenAI TTS is unavailable.
 *
 * Features:
 * - OpenAI TTS with child-friendly 'nova' voice and custom instructions (primary)
 * - Browser speech synthesis fallback
 * - Audio caching to reduce API calls
 * - Play/pause/stop controls
 */

import { supabase } from '../lib/supabase';

// Voice configuration optimized for children
export interface TTSConfig {
  voice?: string;          // OpenAI voice name: nova, shimmer, coral, alloy, echo, etc.
  speakingRate?: number;   // 0.25 to 4.0 (default 0.9 for children)
  instructions?: string;   // Custom tone instructions for gpt-4o-mini-tts
}

// Voice type selection for A/B testing
export type VoiceType = 'google' | 'browser' | 'auto';

// Default configuration for Ms. Guide
const DEFAULT_CONFIG: Required<TTSConfig> = {
  voice: 'nova',              // Warm, friendly female voice (OpenAI)
  speakingRate: 0.9,          // Slightly slower for clarity
  instructions: 'Speak in a warm, encouraging, slightly playful tone for a young child learning math. Be clear and enunciate well.',
};

// Cache for generated audio (in-memory, keyed by text hash)
const audioCache = new Map<string, string>();
const CACHE_MAX_SIZE = 50;

// Current audio state
let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let isUsingGoogleTTS = false;

// Browser voices state
let browserVoicesLoaded = false;
let browserVoicesPromise: Promise<void> | null = null;

// Last error for diagnostics
let lastError: string | null = null;

// Stop generation counter — incremented on stop() to cancel in-flight requests
let stopGeneration = 0;

// Pending request deduplication — prevents duplicate calls for the same text
const pendingRequests = new Map<string, Promise<string>>();

// --- Client-side throttle to prevent burst traffic ---
const THROTTLE_MIN_GAP_MS = 800;
let lastEdgeInvocationTime = 0;

// --- Retry configuration for 429 rate-limit recovery ---
const RETRY_MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 800;
const RETRY_JITTER_FACTOR = 0.2;

/**
 * Sleep helper with cancellation awareness.
 * Returns true if the generation was cancelled during the wait.
 */
function retrySleep(ms: number, genSnapshot: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(genSnapshot !== stopGeneration);
    }, ms);
  });
}

/**
 * Compute backoff delay with jitter.
 * attempt is 0-indexed: 0 => ~800ms, 1 => ~1600ms, 2 => ~3200ms
 */
function computeBackoff(attempt: number): number {
  const base = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = base * RETRY_JITTER_FACTOR * (Math.random() * 2 - 1);
  return Math.round(base + jitter);
}

/**
 * Detect if running on mobile device
 * Mobile browsers have stricter autoplay policies that can block audio.play()
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Detect if running on iOS (iPhone, iPad, iPod)
 * iOS Safari has stricter audio policies than Android:
 * - speechSynthesis.speak() and audio.play() must be called synchronously
 *   within a user gesture (no awaits before the call)
 * - The gesture context is lost after any async operation
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    // iPad with desktop Safari UA (iPadOS 13+)
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Pre-created Audio element for iOS to unlock audio context within user gesture
let iosAudioElement: HTMLAudioElement | null = null;

/**
 * Preload browser voices (they may not be available immediately)
 */
function preloadBrowserVoices(): Promise<void> {
  if (browserVoicesLoaded) {
    return Promise.resolve();
  }

  if (browserVoicesPromise) {
    return browserVoicesPromise;
  }

  browserVoicesPromise = new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      browserVoicesLoaded = true;
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      browserVoicesLoaded = true;
      console.log('[TTS] Browser voices loaded:', voices.length, 'voices available');
      resolve();
      return;
    }

    // Wait for voices to load
    const handleVoicesChanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      if (loadedVoices.length > 0) {
        browserVoicesLoaded = true;
        console.log('[TTS] Browser voices loaded:', loadedVoices.length, 'voices available');
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve();
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Timeout after 3 seconds
    setTimeout(() => {
      if (!browserVoicesLoaded) {
        browserVoicesLoaded = true;
        console.warn('[TTS] Browser voices did not load within timeout');
        resolve();
      }
    }, 3000);
  });

  return browserVoicesPromise;
}

// Start preloading voices immediately
if (typeof window !== 'undefined') {
  preloadBrowserVoices();
}

/**
 * Generate a simple hash for cache keys
 */
function hashText(text: string, config: TTSConfig): string {
  const configStr = JSON.stringify(config);
  let hash = 0;
  const str = text + configStr;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Clean old cache entries when cache is full
 */
function pruneCache(): void {
  if (audioCache.size >= CACHE_MAX_SIZE) {
    const firstKey = audioCache.keys().next().value;
    if (firstKey) {
      // Revoke the blob URL to free memory
      const url = audioCache.get(firstKey);
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
      audioCache.delete(firstKey);
    }
  }
}

/**
 * Generate speech using OpenAI TTS via Edge Function.
 * Deduplicates concurrent requests for the same text to prevent 429 rate limiting.
 */
async function generateTTS(text: string, config: TTSConfig): Promise<string> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const dedupeKey = `${text}|${mergedConfig.voice}|${mergedConfig.speakingRate}`;

  // Return existing in-flight request if same text is already being generated
  const pending = pendingRequests.get(dedupeKey);
  if (pending) {
    console.log('[TTS] Reusing in-flight request (deduplication)');
    return pending;
  }

  const request = generateTTSInternal(text, mergedConfig);
  pendingRequests.set(dedupeKey, request);

  try {
    return await request;
  } finally {
    pendingRequests.delete(dedupeKey);
  }
}

async function generateTTSInternal(text: string, mergedConfig: Required<TTSConfig>): Promise<string> {
  // --- Session acquisition (no forced refresh) ---
  // The Supabase client with autoRefreshToken: true handles token refresh
  // automatically in the background, so a forced refreshSession() is redundant
  // and doubles the request count to Supabase on every TTS call.
  const { data: sessionData, error: getError } = await supabase.auth.getSession();
  let session = sessionData.session;

  if (getError || !session) {
    // Only attempt refresh if getSession returned nothing — likely a cold start
    // or localStorage was cleared.
    console.warn('[TTS] No cached session, attempting one-time refresh');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    session = refreshData.session;

    if (refreshError || !session) {
      console.error('[TTS] Session unavailable:', refreshError?.message ?? 'no session');
      // DO NOT sign out — a transient network failure should not boot the user.
      lastError = 'Unable to verify your session — please check your connection and try again';
      throw new Error(lastError);
    }
  }
  console.log('[TTS] Session acquired');

  // --- Throttle: minimum gap between edge function calls ---
  // Prevents bursts from preload + click sequences or rapid retaps.
  const now = Date.now();
  const elapsed = now - lastEdgeInvocationTime;
  if (elapsed < THROTTLE_MIN_GAP_MS) {
    const waitMs = THROTTLE_MIN_GAP_MS - elapsed;
    console.log(`[TTS] Throttling: waiting ${waitMs}ms`);
    const cancelled = await retrySleep(waitMs, stopGeneration);
    if (cancelled) {
      throw new Error('TTS generation cancelled');
    }
  }
  lastEdgeInvocationTime = Date.now();

  // --- Edge function invocation with retry on 429 ---
  console.log('[TTS] Calling generate-speech edge function...');

  let data: { success?: boolean; audioContent?: string; error?: string } | null = null;
  let lastInvokeError: Error | null = null;
  const gen = stopGeneration;

  for (let attempt = 0; attempt < RETRY_MAX_ATTEMPTS; attempt++) {
    if (gen !== stopGeneration) {
      console.log('[TTS] Cancelled before attempt', attempt + 1);
      throw new Error('TTS generation cancelled');
    }

    const result = await supabase.functions.invoke('generate-speech', {
      body: {
        text,
        voice: mergedConfig.voice,
        speed: mergedConfig.speakingRate,
        instructions: mergedConfig.instructions,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    // Get actual HTTP status from the Response object.
    // supabase.functions.invoke() returns { data, error, response } where
    // response is the raw Response. On non-2xx, error.message is always the
    // generic "Edge Function returned a non-2xx status code" — useless for
    // detecting specific status codes like 429.
    const httpStatus = (result as { response?: Response }).response?.status;
    const errMsg = result.error?.message || '';
    const dataError = result.data?.error || '';

    console.log('[TTS] Attempt', attempt + 1, ':', {
      httpStatus,
      success: result.data?.success,
      hasAudio: !!result.data?.audioContent,
      error: errMsg,
      dataError,
    });

    // Success — break out of retry loop
    if (!result.error && result.data?.success && result.data?.audioContent) {
      data = result.data;
      lastInvokeError = null;
      break;
    }

    // Detect specific HTTP status codes from the actual response
    const is429 = httpStatus === 429 || errMsg.includes('429') || errMsg.includes('Too Many');
    const is401 = httpStatus === 401 || errMsg.includes('401') || errMsg.includes('Unauthorized') || errMsg.includes('JWT');

    if (!is429) {
      // Non-retryable error — fail immediately
      if (is401) {
        lastError = 'Your session needs refreshing — please try again or re-login';
        throw new Error(lastError);
      }
      if (result.error) {
        lastError = `TTS error (${httpStatus || 'unknown'}): ${dataError || errMsg}`;
        throw new Error(lastError);
      }
      const errorMsg = dataError || 'Failed to generate speech';
      lastError = errorMsg;
      throw new Error(errorMsg);
    }

    // 429 — retryable
    lastInvokeError = new Error(errMsg);

    if (attempt < RETRY_MAX_ATTEMPTS - 1) {
      const delay = computeBackoff(attempt);
      console.log(`[TTS] 429 rate limited. Retry in ${delay}ms (${attempt + 2}/${RETRY_MAX_ATTEMPTS})`);
      const cancelled = await retrySleep(delay, gen);
      if (cancelled) {
        console.log('[TTS] Cancelled during retry backoff');
        throw new Error('TTS generation cancelled');
      }
    }
  }

  // All retries exhausted on 429
  if (lastInvokeError || !data?.success || !data?.audioContent) {
    lastError = 'HD audio is temporarily busy — please wait a moment and try again';
    throw new Error(lastError);
  }

  // Success - clear any previous error
  lastError = null;

  // Convert base64 to blob URL
  const binaryString = atob(data.audioContent);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/mp3' });
  return URL.createObjectURL(blob);
}

/**
 * Speak text using the specified voice type
 * @param voiceType - 'google' for HD OpenAI voice, 'browser' for free browser TTS, 'auto' for smart selection
 */
export async function speak(
  text: string,
  config: Partial<TTSConfig> = {},
  onEnd?: () => void,
  onError?: (error: Error) => void,
  voiceType: VoiceType = 'auto'
): Promise<void> {
  // Stop any current playback
  stop();

  if (!text || text.trim().length === 0) {
    onEnd?.();
    return;
  }

  // If explicitly browser, use browser TTS directly
  if (voiceType === 'browser') {
    console.log('[TTS] Using browser TTS (explicit)');
    await speakWithBrowser(text, config, onEnd, onError);
    return;
  }

  // If explicitly google, try OpenAI TTS only (no auto-fallback to browser)
  if (voiceType === 'google') {
    console.log('[TTS] Using OpenAI TTS (explicit)');
    await speakWithHD(text, config, onEnd, onError, false);
    return;
  }

  // 'auto' mode: Try HD first, fall back to browser if needed (all devices)
  if (isMobileDevice()) {
    console.log('[TTS] Mobile auto mode: trying HD with browser fallback', isIOSDevice() ? '(iOS)' : '');
    await speakWithHD(text, config, onEnd, onError, true);
    return;
  }

  // Desktop: try OpenAI TTS with browser fallback
  await speakWithHD(text, config, onEnd, onError, true);
}

/**
 * Speak text using OpenAI TTS (HD quality)
 * @param allowFallback - If true, falls back to browser TTS on error
 *
 * iOS Safari fix: On iOS, Audio.play() must be called within a user gesture.
 * We pre-create the Audio element synchronously (within the gesture), then
 * set its src after the async network call completes. This preserves the
 * audio context that was unlocked by the initial user gesture.
 */
async function speakWithHD(
  text: string,
  config: Partial<TTSConfig>,
  onEnd?: () => void,
  onError?: (error: Error) => void,
  allowFallback: boolean = true
): Promise<void> {
  const cacheKey = hashText(text, config);
  const onIOS = isIOSDevice();
  const gen = stopGeneration;  // Capture before async work

  // iOS: Pre-create Audio element within user gesture to unlock audio context.
  // IMPORTANT: Do NOT await play() — that breaks the gesture chain on iOS Safari.
  // Fire-and-forget: the play() call itself unlocks the audio context.
  if (onIOS && !audioCache.has(cacheKey)) {
    iosAudioElement = new Audio();
    iosAudioElement.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwSHAAAAAAD/+1DEAAAGAAGn9AAAIgAANP8AAABM//tQxBUAAADSAAAAAAAAANIAAAAA';
    iosAudioElement.muted = true;
    // Fire-and-forget — preserves gesture chain by not awaiting
    iosAudioElement.play().catch(() => {
      // Silent fail OK — still unlocks audio context
    });
    // Don't pause — keep playing to maintain unlocked context
    console.log('[TTS] iOS: Audio context unlock initiated (no await)');
  }

  try {
    // Check cache first
    let audioUrl = audioCache.get(cacheKey);

    if (!audioUrl) {
      // Try OpenAI TTS
      try {
        audioUrl = await generateTTS(text, config);
        // Check if stop() was called during the async generation
        if (gen !== stopGeneration) {
          console.log('[TTS] Playback cancelled during generation');
          return;
        }
        pruneCache();
        audioCache.set(cacheKey, audioUrl);
        isUsingGoogleTTS = true;
        console.log('[TTS] Using OpenAI TTS (HD)');
      } catch (googleError) {
        console.warn('[TTS] OpenAI TTS failed:', googleError);
        if (gen !== stopGeneration) return;  // Cancelled
        if (allowFallback) {
          await speakWithBrowser(text, config, onEnd, onError);
        } else {
          const error = googleError instanceof Error ? googleError : new Error('OpenAI TTS failed');
          lastError = error.message;
          onError?.(error);
        }
        return;
      }
    } else {
      isUsingGoogleTTS = true;
      console.log('[TTS] Using cached HD TTS audio');
    }

    // Check again before playing
    if (gen !== stopGeneration) {
      console.log('[TTS] Playback cancelled before audio play');
      return;
    }

    // Play the audio - reuse iOS pre-created element if available
    if (onIOS && iosAudioElement) {
      currentAudio = iosAudioElement;
      iosAudioElement = null;
      currentAudio.src = audioUrl;
    } else {
      currentAudio = new Audio(audioUrl);
    }

    currentAudio.onended = () => {
      currentAudio = null;
      onEnd?.();
    };
    currentAudio.onerror = (e) => {
      console.error('[TTS] Audio playback error:', e);
      currentAudio = null;
      if (allowFallback) {
        speakWithBrowser(text, config, onEnd, onError);
      } else {
        const error = new Error('Audio playback failed');
        lastError = error.message;
        onError?.(error);
      }
    };

    // Handle play() promise rejection (can happen with autoplay policies)
    try {
      await currentAudio.play();
    } catch (playError) {
      console.error('[TTS] Audio play() failed:', playError);
      currentAudio = null;

      // Check if it's an autoplay policy error
      if (playError instanceof Error && playError.name === 'NotAllowedError') {
        console.warn('[TTS] Autoplay blocked', onIOS ? '(iOS)' : '');
        lastError = 'Autoplay blocked - tap again to play';
      }

      if (allowFallback) {
        await speakWithBrowser(text, config, onEnd, onError);
      } else {
        const error = playError instanceof Error ? playError : new Error('Playback failed');
        lastError = error.message;
        onError?.(error);
      }
    }
  } catch (error) {
    console.error('[TTS] Error:', error);
    if (allowFallback) {
      await speakWithBrowser(text, config, onEnd, onError);
    } else {
      const err = error instanceof Error ? error : new Error('TTS failed');
      lastError = err.message;
      onError?.(err);
    }
  }
}

/**
 * Speak text using browser Web Speech API (fallback)
 *
 * IMPORTANT iOS Safari fix: On iOS, speechSynthesis.speak() must be called
 * synchronously within the user gesture call stack. Any `await` before the
 * speak() call breaks the gesture chain and iOS silently ignores the request.
 * We skip the async voice preload on iOS since voices are preloaded on import.
 */
async function speakWithBrowser(
  text: string,
  config: Partial<TTSConfig>,
  onEnd?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  if (!('speechSynthesis' in window)) {
    const error = new Error('Speech synthesis not supported in this browser');
    lastError = error.message;
    onError?.(error);
    return;
  }

  isUsingGoogleTTS = false;
  console.log('[TTS] Using browser speech synthesis');

  // On iOS, we MUST NOT await anything before calling speechSynthesis.speak()
  // because it breaks the user gesture chain. Voices should already be loaded
  // from the module-level preloadBrowserVoices() call.
  const onIOS = isIOSDevice();

  const gen = stopGeneration;  // Capture before async work

  if (!onIOS) {
    // Non-iOS: safe to await voice loading
    await preloadBrowserVoices();
    if (gen !== stopGeneration) return;  // Cancelled during voice load
  }

  // Only cancel if actively speaking (prevents iOS cancel/speak race condition)
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  // Get voices synchronously (critical for iOS gesture chain)
  const voices = window.speechSynthesis.getVoices();
  console.log('[TTS] Available browser voices:', voices.length, onIOS ? '(iOS)' : '');

  if (voices.length === 0) {
    if (onIOS) {
      // iOS: voices may not be loaded on first use. Use warm-up pattern:
      // speak a single space to wake up the engine, then immediately enqueue
      // the real utterance in the same call stack (no cancel between them).
      console.log('[TTS] iOS: No voices yet, using warm-up utterance');
      const warmup = new SpeechSynthesisUtterance(' ');
      window.speechSynthesis.speak(warmup);
      // Don't cancel — let warm-up finish, real utterance queues behind it
    } else {
      console.warn('[TTS] No voices available in browser');
      const error = new Error('No voices available for speech synthesis');
      lastError = error.message;
      onError?.(error);
      return;
    }
  }

  // Re-fetch voices (may now be available after warm-up)
  const availableVoices = window.speechSynthesis.getVoices();

  return new Promise((resolve) => {
    // Timeout protection: ensure promise resolves even if speech events don't fire
    // This prevents infinite loading state on some mobile browsers
    const timeoutId = setTimeout(() => {
      console.warn('[TTS] Speech timeout - events did not fire');
      if (currentUtterance) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
      }
      const error = new Error('Speech synthesis timed out');
      lastError = error.message;
      onError?.(error);
      resolve();
    }, 30000); // 30 second timeout for long text

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = config.speakingRate ?? DEFAULT_CONFIG.speakingRate;
    currentUtterance.pitch = 1;  // Neutral pitch
    currentUtterance.lang = 'en-US';

    // Priority order for voice selection (prefer female voices for Ms. Guide)
    // On iOS first use, voices may be empty — skip voice assignment and let iOS use its default
    if (availableVoices.length > 0) {
      const femaleVoice = availableVoices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('samantha') ||  // macOS
         v.name.toLowerCase().includes('victoria') ||   // iOS
         v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('zira') ||       // Windows
         v.name.toLowerCase().includes('google us english'))
      ) || availableVoices.find(v => v.lang.startsWith('en'));  // Any English voice as fallback

      if (femaleVoice) {
        currentUtterance.voice = femaleVoice;
        console.log('[TTS] Using voice:', femaleVoice.name);
      }
    } else {
      console.log('[TTS] No voices available, using system default', onIOS ? '(iOS)' : '');
    }

    currentUtterance.onend = () => {
      clearTimeout(timeoutId);
      currentUtterance = null;
      lastError = null;
      onEnd?.();
      resolve();
    };

    currentUtterance.onerror = (e) => {
      clearTimeout(timeoutId);
      currentUtterance = null;
      const errorMsg = `Speech synthesis error: ${e.error || 'unknown'}`;
      lastError = errorMsg;
      const error = new Error(errorMsg);
      console.error('[TTS] Browser synthesis error:', e);
      onError?.(error);
      resolve();
    };

    // iOS Safari fix: Resume speechSynthesis if it's paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(currentUtterance);
    console.log('[TTS] speechSynthesis.speak() called', onIOS ? '(iOS synchronous path)' : '');
  });
}

/**
 * Stop any current speech playback
 */
export function stop(): void {
  stopGeneration++;  // Cancel any in-flight TTS generation

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

/**
 * Pause current audio playback (Google TTS only)
 */
export function pause(): void {
  if (currentAudio) {
    currentAudio.pause();
  } else if (currentUtterance) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resume paused audio playback
 */
export function resume(): void {
  if (currentAudio) {
    currentAudio.play();
  } else if (currentUtterance) {
    window.speechSynthesis.resume();
  }
}

/**
 * Check if audio is currently playing
 */
export function isPlaying(): boolean {
  if (currentAudio) {
    return !currentAudio.paused;
  }
  return window.speechSynthesis.speaking && !window.speechSynthesis.paused;
}

/**
 * Check if audio is paused
 */
export function isPaused(): boolean {
  if (currentAudio) {
    return currentAudio.paused && currentAudio.currentTime > 0;
  }
  return window.speechSynthesis.paused;
}

/**
 * Check if currently using Google Cloud TTS (vs browser fallback)
 */
export function isUsingGoogleVoice(): boolean {
  return isUsingGoogleTTS;
}

/**
 * Check if audio for given text is already cached
 * Useful for determining if mobile playback will work immediately
 */
export function isCached(text: string, config: Partial<TTSConfig> = {}): boolean {
  const cacheKey = hashText(text, config);
  return audioCache.has(cacheKey);
}

/**
 * Pre-generate and cache audio for text (useful for preloading)
 */
export async function preload(text: string, config: Partial<TTSConfig> = {}): Promise<boolean> {
  const cacheKey = hashText(text, config);

  if (audioCache.has(cacheKey)) {
    return true;  // Already cached
  }

  try {
    const audioUrl = await generateTTS(text, config);
    pruneCache();
    audioCache.set(cacheKey, audioUrl);
    console.log('[TTS] Preloaded audio');
    return true;
  } catch (error) {
    console.warn('[TTS] Preload failed:', error);
    return false;
  }
}

/**
 * Clear the audio cache
 */
export function clearCache(): void {
  // Revoke all blob URLs
  for (const url of audioCache.values()) {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
  audioCache.clear();
  console.log('[TTS] Cache cleared');
}

/**
 * Get available OpenAI TTS voices for Ms. Guide
 * These are pre-selected child-friendly voices
 */
export function getAvailableVoices(): Array<{ id: string; name: string; description: string }> {
  return [
    {
      id: 'nova',
      name: 'Ms. Guide (Default)',
      description: 'Warm, friendly voice - best for younger children',
    },
    {
      id: 'shimmer',
      name: 'Ms. Guide (Gentle)',
      description: 'Soft, soothing voice',
    },
    {
      id: 'coral',
      name: 'Ms. Guide (Energetic)',
      description: 'Lively, enthusiastic voice',
    },
    {
      id: 'alloy',
      name: 'Ms. Guide (Neutral)',
      description: 'Clear, balanced voice',
    },
  ];
}

/**
 * Check TTS availability and get diagnostic info
 */
export async function checkTTSAvailability(): Promise<{
  browserSupported: boolean;
  browserVoicesAvailable: number;
  googleTTSAvailable: boolean;
  lastError: string | null;
}> {
  const browserSupported = 'speechSynthesis' in window;
  let browserVoicesAvailable = 0;
  let googleTTSAvailable = false;

  if (browserSupported) {
    await preloadBrowserVoices();
    browserVoicesAvailable = window.speechSynthesis.getVoices().length;
  }

  // Test OpenAI TTS availability with a short text
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase.functions.invoke('generate-speech', {
        body: { text: 'test', voice: DEFAULT_CONFIG.voice },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!error && data?.success) {
        googleTTSAvailable = true;
      } else {
        console.log('[TTS] HD TTS not available:', error?.message || data?.error);
      }
    } else {
      console.log('[TTS] HD TTS check skipped: no session');
    }
  } catch (e) {
    console.log('[TTS] HD TTS check failed:', e);
  }

  return {
    browserSupported,
    browserVoicesAvailable,
    googleTTSAvailable,
    lastError,
  };
}

/**
 * Get the last TTS error (for debugging)
 */
export function getLastError(): string | null {
  return lastError;
}
