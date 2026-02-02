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
    throw new Error(`TTS function error: ${error.message}`);
  }

  if (!data?.success || !data?.audioContent) {
    throw new Error(data?.error || 'Failed to generate speech');
  }

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
 * Speak text using Google Cloud TTS with browser fallback
 */
export async function speak(
  text: string,
  config: Partial<TTSConfig> = {},
  onEnd?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  // Stop any current playback
  stop();

  if (!text || text.trim().length === 0) {
    onEnd?.();
    return;
  }

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
        console.warn('[TTS] Google TTS failed, falling back to browser:', googleError);
        // Fall back to browser TTS
        await speakWithBrowser(text, config, onEnd, onError);
        return;
      }
    } else {
      console.log('[TTS] Using cached audio');
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
      // Fall back to browser TTS
      speakWithBrowser(text, config, onEnd, onError);
    };

    await currentAudio.play();
  } catch (error) {
    console.error('[TTS] Error:', error);
    // Fall back to browser TTS
    await speakWithBrowser(text, config, onEnd, onError);
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
    const error = new Error('Speech synthesis not supported');
    onError?.(error);
    return;
  }

  isUsingGoogleTTS = false;
  console.log('[TTS] Using browser speech synthesis');

  return new Promise((resolve) => {
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = config.speakingRate ?? DEFAULT_CONFIG.speakingRate;
    currentUtterance.pitch = 1 + ((config.pitch ?? DEFAULT_CONFIG.pitch) / 20);  // Normalize pitch
    currentUtterance.lang = config.languageCode ?? DEFAULT_CONFIG.languageCode;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.lang.startsWith('en') &&
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('samantha') ||
       v.name.toLowerCase().includes('victoria'))
    );
    if (femaleVoice) {
      currentUtterance.voice = femaleVoice;
    }

    currentUtterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
      resolve();
    };

    currentUtterance.onerror = (e) => {
      currentUtterance = null;
      const error = new Error(`Speech synthesis error: ${e.error}`);
      onError?.(error);
      resolve();
    };

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
