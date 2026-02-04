/**
 * Speech-to-Text Button Component
 *
 * Voice input button for younger students who can't type well.
 * Uses browser Web Speech API (SpeechRecognition) - FREE, no server cost.
 *
 * Supported browsers: Chrome, Edge, Safari (iOS 14.5+)
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechToTextButtonProps {
  /** Called when speech is transcribed */
  onTranscript: (text: string) => void;
  /** Called when listening state changes */
  onListening?: (isListening: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Additional CSS classes */
  className?: string;
  /** Language for recognition (default: en-US) */
  language?: string;
  /** Placeholder text shown when available */
  placeholder?: string;
}

type ListeningState = 'idle' | 'listening' | 'processing';

/**
 * Check if Speech Recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

export function SpeechToTextButton({
  onTranscript,
  onListening,
  disabled = false,
  size = 'medium',
  className = '',
  language = 'en-US',
  placeholder,
}: SpeechToTextButtonProps) {
  const [state, setState] = useState<ListeningState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = isSpeechRecognitionSupported();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Single utterance mode
    recognition.interimResults = true; // Show interim results while speaking
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState('listening');
      setError(null);
      setInterimText('');
      onListening?.(true);
      console.log('[STT] Started listening');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
      }

      if (finalTranscript) {
        console.log('[STT] Final transcript:', finalTranscript);
        setState('processing');
        setInterimText('');
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[STT] Error:', event.error, event.message);

      let errorMessage = 'Voice input failed';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found';
          break;
        case 'aborted':
          // User cancelled - not an error
          errorMessage = '';
          break;
      }

      if (errorMessage) {
        setError(errorMessage);
      }
      setState('idle');
      onListening?.(false);
    };

    recognition.onend = () => {
      console.log('[STT] Ended');
      setState('idle');
      setInterimText('');
      onListening?.(false);
    };

    return recognition;
  }, [isSupported, language, onListening, onTranscript]);

  // Toggle listening
  const handleClick = useCallback(() => {
    if (disabled || !isSupported) return;

    if (state === 'listening') {
      // Stop listening
      recognitionRef.current?.stop();
      setState('idle');
      onListening?.(false);
    } else {
      // Start listening
      setError(null);

      // Initialize new recognition instance each time
      recognitionRef.current = initRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('[STT] Failed to start:', err);
          setError('Could not start voice input');
        }
      }
    }
  }, [disabled, isSupported, state, initRecognition, onListening]);

  // Size classes
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-10 h-10 text-xl',
    large: 'w-12 h-12 text-2xl',
  };

  // Not supported message
  if (!isSupported) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          disabled
          className={`
            ${sizeClasses[size]}
            rounded-full flex items-center justify-center
            bg-gray-100 text-gray-400 cursor-not-allowed
          `}
          title="Voice input not supported in this browser"
        >
          🎤
        </button>
        {placeholder && (
          <span className="text-xs text-gray-400">Not supported</span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          transition-all duration-200 relative
          ${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : state === 'listening'
              ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-300'
              : state === 'processing'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
        aria-label={state === 'listening' ? 'Stop recording' : 'Start voice input'}
      >
        {state === 'listening' ? (
          <span className="relative">
            🎤
            {/* Pulsing ring indicator */}
            <span className="absolute -inset-1 rounded-full bg-red-400 opacity-25 animate-ping" />
          </span>
        ) : state === 'processing' ? (
          <span className="animate-spin">⏳</span>
        ) : (
          '🎤'
        )}
      </button>

      {/* Interim text while speaking */}
      {interimText && state === 'listening' && (
        <span className="text-sm text-gray-500 italic max-w-32 truncate">
          {interimText}...
        </span>
      )}

      {/* Placeholder text */}
      {placeholder && state === 'idle' && !error && (
        <span className="text-sm text-gray-500">{placeholder}</span>
      )}

      {/* Error message */}
      {error && state === 'idle' && (
        <span className="text-sm text-red-500">{error}</span>
      )}

      {/* Listening indicator */}
      {state === 'listening' && !interimText && (
        <span className="text-sm text-red-600">Listening...</span>
      )}
    </div>
  );
}

export default SpeechToTextButton;
