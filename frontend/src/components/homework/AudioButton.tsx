/**
 * Audio Button Component
 *
 * Text-to-speech button for playing explanations aloud.
 * Uses Google Cloud TTS for high-quality child-friendly voices,
 * with browser speech synthesis as fallback.
 */

import React, { useState, useEffect, useCallback } from 'react';
import * as ttsService from '../../services/ttsService';
import type { VoiceType } from '../../services/ttsService';

interface AudioButtonProps {
  /** Text to convert to speech */
  text: string;
  /** Callback when audio starts playing */
  onPlay?: () => void;
  /** Callback when audio finishes */
  onEnd?: () => void;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Label text (optional) */
  label?: string;
  /** Preload audio when component mounts */
  preload?: boolean;
  /** Voice type: 'google' for HD Neural2, 'browser' for free browser TTS, 'auto' for smart selection */
  voiceType?: VoiceType;
}

type PlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'preparing';

export function AudioButton({
  text,
  onPlay,
  onEnd,
  size = 'medium',
  className = '',
  disabled = false,
  label,
  preload = false,
  voiceType = 'auto',
}: AudioButtonProps) {
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isMobile] = useState(() => ttsService.isMobileDevice());

  // Preload audio if requested (only for Google TTS)
  useEffect(() => {
    if (preload && text && voiceType !== 'browser') {
      const optimizedText = optimizeForSpeech(text);
      ttsService.preload(optimizedText).catch(() => {
        // Silently fail preload - will generate on demand
      });
    }
  }, [preload, text, voiceType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  // Check if we need the "prepare" flow on mobile for Google TTS
  const needsMobilePrepare = useCallback(() => {
    if (voiceType !== 'google') return false;
    if (!isMobile) return false;
    const optimizedText = optimizeForSpeech(text);
    return !ttsService.isCached(optimizedText);
  }, [voiceType, isMobile, text]);

  // Handle play/pause
  const handleClick = useCallback(async () => {
    if (disabled) return;

    setError(null);

    if (playState === 'playing') {
      // Pause
      ttsService.pause();
      setPlayState('paused');
    } else if (playState === 'paused') {
      // Resume
      ttsService.resume();
      setPlayState('playing');
    } else if (playState === 'preparing') {
      // Audio was prepared, now play it
      await startSpeech();
    } else {
      // Check if we need to prepare first (mobile + Google TTS + not cached)
      if (needsMobilePrepare()) {
        await prepareAudio();
      } else {
        // Start new speech directly
        await startSpeech();
      }
    }
  }, [disabled, playState, text, needsMobilePrepare]);

  // Prepare audio (preload for mobile Google TTS)
  const prepareAudio = async () => {
    setPlayState('loading');
    const optimizedText = optimizeForSpeech(text);

    try {
      const success = await ttsService.preload(optimizedText);
      if (success) {
        setPlayState('preparing');
        setError(null);
      } else {
        setError('Failed to prepare');
        setPlayState('idle');
      }
    } catch (err) {
      console.error('Failed to prepare audio:', err);
      setError('Failed to prepare');
      setPlayState('idle');
    }
  };

  // Start speech
  const startSpeech = async () => {
    // Cancel any existing speech
    ttsService.stop();

    // Optimize text for speech
    const optimizedText = optimizeForSpeech(text);

    setPlayState('loading');
    onPlay?.();

    // Track if speech has ended via callback (to prevent race conditions)
    let speechEnded = false;

    try {
      await ttsService.speak(
        optimizedText,
        {
          speakingRate: 0.9,  // Slightly slower for children
        },
        // onEnd callback
        () => {
          speechEnded = true;
          setPlayState('idle');
          onEnd?.();
        },
        // onError callback
        (err) => {
          speechEnded = true;
          console.error('Speech error:', err);
          const lastError = ttsService.getLastError();
          // Show user-friendly error message
          if (lastError?.includes('not supported')) {
            setError('Audio not supported');
          } else if (lastError?.includes('No voices')) {
            setError('No voices available');
          } else if (lastError?.includes('timed out')) {
            setError('Audio timed out');
          } else if (lastError?.includes('Autoplay') || lastError?.includes('tap again')) {
            setError('Tap again to play');
          } else {
            setError('Tap to retry');
          }
          setPlayState('idle');
        },
        // voiceType parameter
        voiceType
      );

      // speak() returned successfully - if speech hasn't ended yet, we're playing
      // (For Google TTS, speak returns quickly; for browser TTS, it returns after speech ends)
      if (!speechEnded && ttsService.isPlaying()) {
        setPlayState('playing');
      }
    } catch (err) {
      console.error('Failed to start speech:', err);
      const lastError = ttsService.getLastError();
      if (lastError) {
        console.log('[AudioButton] Last TTS error:', lastError);
      }
      setError('Tap to retry');
      setPlayState('idle');
    }
  };

  // Stop speech
  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    ttsService.stop();
    setPlayState('idle');
  };

  // Optimize text for speech synthesis
  const optimizeForSpeech = (text: string): string => {
    return text
      // Replace math symbols with words
      .replace(/\+/g, ' plus ')
      .replace(/-/g, ' minus ')
      .replace(/×/g, ' times ')
      .replace(/÷/g, ' divided by ')
      .replace(/=/g, ' equals ')
      .replace(/\//g, ' divided by ')
      // Handle common patterns
      .replace(/(\d+)\/(\d+)/g, '$1 over $2') // fractions
      .replace(/\^(\d+)/g, ' to the power of $1')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Size classes
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-10 h-10 text-xl',
    large: 'w-12 h-12 text-2xl',
  };

  // Get icon based on state
  const getIcon = () => {
    switch (playState) {
      case 'loading':
        return (
          <span className="animate-pulse">
            <LoadingSpinner />
          </span>
        );
      case 'preparing':
        return '▶️';
      case 'playing':
        return '⏸️';
      case 'paused':
        return '▶️';
      default:
        return '🔊';
    }
  };

  // Get aria label
  const getAriaLabel = () => {
    switch (playState) {
      case 'loading':
        return 'Loading audio...';
      case 'preparing':
        return 'Audio ready - tap to play';
      case 'playing':
        return 'Pause audio';
      case 'paused':
        return 'Resume audio';
      default:
        return 'Play audio';
    }
  };

  // Get dynamic label based on state
  const getDynamicLabel = () => {
    if (error) return null; // Error message takes precedence
    if (playState === 'preparing') return 'Tap to play';
    if (playState === 'loading' && voiceType === 'google' && isMobile) return 'Preparing HD...';
    return label;
  };

  const dynamicLabel = getDynamicLabel();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled || playState === 'loading'}
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          transition-all duration-200
          ${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : playState === 'playing'
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm'
              : playState === 'preparing'
                ? 'bg-green-100 text-green-600 hover:bg-green-200 shadow-sm animate-pulse'
                : playState === 'loading'
                  ? 'bg-blue-50 text-blue-400 cursor-wait'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
        aria-label={getAriaLabel()}
      >
        {getIcon()}
      </button>

      {/* Stop button when playing */}
      {(playState === 'playing' || playState === 'paused') && (
        <button
          onClick={handleStop}
          className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-sm flex items-center justify-center hover:bg-red-200 transition-colors"
          aria-label="Stop audio"
        >
          ⏹️
        </button>
      )}

      {/* Dynamic label (includes "Tap to play" for preparing state) */}
      {dynamicLabel && !error && (
        <span className={`text-sm ${playState === 'preparing' ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
          {dynamicLabel}
        </span>
      )}

      {/* Error message */}
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}

      {/* Voice indicator */}
      {playState === 'playing' && ttsService.isUsingGoogleVoice() && (
        <span className="text-xs text-blue-500 hidden sm:inline">HD</span>
      )}
    </div>
  );
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <svg
      className="w-5 h-5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Hook for managing audio playback state
 */
export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const speak = useCallback(async (text: string) => {
    ttsService.stop();
    setIsLoading(true);

    try {
      await ttsService.speak(
        text,
        { speakingRate: 0.9 },
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        }
      );
      setIsPlaying(true);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const pause = useCallback(() => {
    ttsService.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    ttsService.resume();
    setIsPlaying(true);
  }, []);

  return { isPlaying, isLoading, speak, stop, pause, resume };
}

export default AudioButton;
