/**
 * Text-to-Speech Service
 *
 * Provides high-quality TTS using Google Cloud TTS API via Supabase Edge Function.
 * Falls back to browser Web Speech API if Google TTS is unavailable.
 *
 * Features:
 * - Google Cloud TTS with child-friendly voices (primary)
 * - Browser speech synthesis fallback
 * - Audio caching to reduce API calls
 * - Play/pause/stop controls
 */

import { supabase } from '../lib/supabase';

// Voice configuration optimized for children
export interface TTSConfig {
  voice?: string;          // Google TTS voice name
  speakingRate?: number;   // 0.25 to 4.0 (default 0.9 for children)
  pitch?: number;          // -20.0 to 20.0 (default 0)
  languageCode?: string;   // BCP-47 code (default 'en-US')
}

// Voice type selection for A/B testing
export type VoiceType = 'google' | 'browser' | 'auto';

// Default configuration for Ms. Guide
const DEFAULT_CONFIG: Required<TTSConfig> = {
  voice: 'en-US-Neural2-C',  // Child-friendly female voice
  speakingRate: 0.9,          // Slightly slower for clarity
  pitch: 0,
  languageCode: 'en-US',
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

/**
 * Detect if running on mobile device
 * Mobile browsers have stricter autoplay policies that can block audio.play()
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

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
 * Generate speech using Google Cloud TTS via Edge Function
 */
async function generateGoogleTTS(text: string, config: TTSConfig): Promise<string> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const { data, error } = await supabase.functions.invoke('generate-speech', {
    body: {
      text,
      voice: mergedConfig.voice,
      speakingRate: mergedConfig.speakingRate,
      pitch: mergedConfig.pitch,
      languageCode: mergedConfig.languageCode,
    },
  });

  if (error) {
    lastError = `Google TTS error: ${error.message}`;
    throw new Error(lastError);
  }

  if (!data?.success || !data?.audioContent) {
    const errorMsg = data?.error || 'Failed to generate speech from Google TTS';
    lastError = errorMsg;
    throw new Error(errorMsg);
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
 * @param voiceType - 'google' for HD Neural2 voice, 'browser' for free browser TTS, 'auto' for smart selection
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

  // If explicitly google, try Google TTS only (no auto-fallback to browser)
  if (voiceType === 'google') {
    console.log('[TTS] Using Google TTS (explicit)');
    await speakWithGoogle(text, config, onEnd, onError, false);
    return;
  }

  // 'auto' mode: Try Google first, fall back to browser if needed
  // On mobile, prefer browser TTS first to avoid autoplay policy issues
  if (isMobileDevice()) {
    console.log('[TTS] Mobile device detected, using browser TTS (auto mode)');
    await speakWithBrowser(text, config, onEnd, onError);
    return;
  }

  // Desktop: try Google TTS with browser fallback
  await speakWithGoogle(text, config, onEnd, onError, true);
}

/**
 * Speak text using Google Cloud TTS
 * @param allowFallback - If true, falls back to browser TTS on error
 */
async function speakWithGoogle(
  text: string,
  config: Partial<TTSConfig>,
  onEnd?: () => void,
  onError?: (error: Error) => void,
  allowFallback: boolean = true
): Promise<void> {
  const cacheKey = hashText(text, config);

  try {
    // Check cache first
    let audioUrl = audioCache.get(cacheKey);

    if (!audioUrl) {
      // Try Google Cloud TTS
      try {
        audioUrl = await generateGoogleTTS(text, config);
        pruneCache();
        audioCache.set(cacheKey, audioUrl);
        isUsingGoogleTTS = true;
        console.log('[TTS] Using Google Cloud TTS');
      } catch (googleError) {
        console.warn('[TTS] Google TTS failed:', googleError);
        if (allowFallback) {
          await speakWithBrowser(text, config, onEnd, onError);
        } else {
          const error = googleError instanceof Error ? googleError : new Error('Google TTS failed');
          lastError = error.message;
          onError?.(error);
        }
        return;
      }
    } else {
      isUsingGoogleTTS = true;
      console.log('[TTS] Using cached Google TTS audio');
    }

    // Play the audio
    currentAudio = new Audio(audioUrl);
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
        console.warn('[TTS] Autoplay blocked');
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

  // Wait for voices to be available
  await preloadBrowserVoices();

  // Cancel any ongoing speech to avoid queue buildup
  window.speechSynthesis.cancel();

  // Check if voices are available after loading
  const voices = window.speechSynthesis.getVoices();
  console.log('[TTS] Available browser voices:', voices.length);

  if (voices.length === 0) {
    console.warn('[TTS] No voices available in browser');
    const error = new Error('No voices available for speech synthesis');
    lastError = error.message;
    onError?.(error);
    return;
  }

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
    currentUtterance.pitch = 1 + ((config.pitch ?? DEFAULT_CONFIG.pitch) / 20);  // Normalize pitch
    currentUtterance.lang = config.languageCode ?? DEFAULT_CONFIG.languageCode;

    // Priority order for voice selection (prefer female voices for Ms. Guide)
    const femaleVoice = voices.find(v =>
      v.lang.startsWith('en') &&
      (v.name.toLowerCase().includes('samantha') ||  // macOS
       v.name.toLowerCase().includes('victoria') ||   // iOS
       v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('zira') ||       // Windows
       v.name.toLowerCase().includes('google us english'))
    ) || voices.find(v => v.lang.startsWith('en'));  // Any English voice as fallback

    if (femaleVoice) {
      currentUtterance.voice = femaleVoice;
      console.log('[TTS] Using voice:', femaleVoice.name);
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
  });
}

/**
 * Stop any current speech playback
 */
export function stop(): void {
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
    const audioUrl = await generateGoogleTTS(text, config);
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
 * Get available Google TTS voices for Ms. Guide
 * These are pre-selected child-friendly voices
 */
export function getAvailableVoices(): Array<{ id: string; name: string; description: string }> {
  return [
    {
      id: 'en-US-Neural2-C',
      name: 'Ms. Guide (Default)',
      description: 'Warm, friendly female voice - best for younger children',
    },
    {
      id: 'en-US-Neural2-F',
      name: 'Ms. Guide (Alternative)',
      description: 'Clear, professional female voice',
    },
    {
      id: 'en-US-Wavenet-C',
      name: 'Ms. Guide (Economy)',
      description: 'Good quality at lower cost',
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

  // Test Google TTS availability with a short text
  try {
    const { data, error } = await supabase.functions.invoke('generate-speech', {
      body: { text: 'test', voice: DEFAULT_CONFIG.voice },
    });

    if (!error && data?.success) {
      googleTTSAvailable = true;
    } else {
      console.log('[TTS] Google TTS not available:', error?.message || data?.error);
    }
  } catch (e) {
    console.log('[TTS] Google TTS check failed:', e);
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
