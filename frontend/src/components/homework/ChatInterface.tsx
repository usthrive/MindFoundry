/**
 * Chat Interface Component
 *
 * Interactive chat with Ms. Guide for follow-up questions.
 * Maintains context about the current problem being discussed.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, ProblemContext } from '../../types/homework';
import { AudioButton } from './AudioButton';
import { SpeechToTextButton, isSpeechRecognitionSupported } from './SpeechToTextButton';

interface ChatInterfaceProps {
  /** Chat history */
  messages: ChatMessage[];
  /** Callback when user sends a message */
  onSendMessage: (message: string) => Promise<void>;
  /** Whether AI is currently responding */
  isLoading?: boolean;
  /** Maximum messages allowed (for limit display) */
  maxMessages?: number;
  /** Callback for audio playback tracking */
  onAudioPlayed?: () => void;
  /** Placeholder text for input */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Problem context to display in banner */
  context?: ProblemContext;
  /** Whether to show the context banner */
  showContextBanner?: boolean;
  /** Whether to show voice input button (Speech-to-Text) */
  showVoiceInput?: boolean;
}

/**
 * Quick reply suggestions
 */
const QUICK_REPLIES = [
  "Why do we do that?",
  "Can you explain again?",
  "Show me another example",
  "I don't understand",
  "Can I try a similar problem?",
];

/**
 * Context banner showing the problem being discussed
 */
function ContextBanner({ context }: { context: ProblemContext }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine the context type (Kumon practice or School homework)
  const isKumonContext = !!context.kumon_level;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-purple-600 flex-shrink-0">📝</span>
          <span className="text-sm text-gray-700 truncate">
            {isKumonContext
              ? `Level ${context.kumon_level}${context.kumon_skill_set ? ` - ${context.kumon_skill_set}` : ''}`
              : `Grade ${context.grade_level} Problem`
            }
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 space-y-2">
          {/* Problem text */}
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Discussing:</p>
            <p className="text-sm text-gray-900 break-words">
              {context.problem_text || 'No problem context available'}
            </p>
          </div>

          {/* Additional context info */}
          <div className="flex flex-wrap gap-2 text-xs">
            {isKumonContext ? (
              <>
                {context.kumon_level && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    Level {context.kumon_level}
                  </span>
                )}
                {context.kumon_worksheet && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Worksheet {context.kumon_worksheet}
                  </span>
                )}
              </>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Grade {context.grade_level}
              </span>
            )}

            {context.student_answer && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                Your answer: {context.student_answer}
              </span>
            )}

            {context.correct_answer && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Correct: {context.correct_answer}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  maxMessages = 20,
  onAudioPlayed,
  placeholder = "Ask Ms. Guide a question...",
  disabled = false,
  context,
  showContextBanner = true,
  showVoiceInput = true,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if voice input is available
  const voiceInputAvailable = showVoiceInput && isSpeechRecognitionSupported();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hide quick replies after first message
  useEffect(() => {
    if (messages.length > 0) {
      setShowQuickReplies(false);
    }
  }, [messages.length]);

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim()) {
      // Set the input and optionally auto-send
      setInput(transcript);
      // Focus the input so user can review/edit before sending
      inputRef.current?.focus();
    }
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  // Handle quick reply click
  const handleQuickReply = async (reply: string) => {
    if (isLoading || disabled) return;
    setShowQuickReplies(false);
    await onSendMessage(reply);
  };

  const remainingMessages = maxMessages - messages.length;
  const nearLimit = remainingMessages <= 5;
  const atLimit = remainingMessages <= 0;

  return (
    <div className="flex flex-col h-full">
      {/* Context Banner - shows what problem is being discussed */}
      {showContextBanner && context && context.problem_text && (
        <ContextBanner context={context} />
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-600">
              Have questions? Ask Ms. Guide anything about this problem!
            </p>
          </div>
        )}

        {/* Message list */}
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            showAudio={message.role === 'ms_guide'}
            onAudioPlayed={onAudioPlayed}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              👩‍🏫
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && !isLoading && !atLimit && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.slice(0, 3).map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                disabled={disabled}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Limit Warning */}
      {nearLimit && !atLimit && (
        <div className="px-4 pb-2">
          <p className="text-xs text-amber-600 text-center">
            {remainingMessages} messages remaining in this session
          </p>
        </div>
      )}

      {/* At Limit Message */}
      {atLimit && (
        <div className="px-4 pb-2">
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">
              You've reached the message limit for this problem.
              <br />
              Try a similar problem or move to the next one!
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          {/* Voice Input Button */}
          {voiceInputAvailable && (
            <SpeechToTextButton
              onTranscript={handleVoiceTranscript}
              onListening={setIsListening}
              disabled={isLoading || disabled || atLimit}
              size="medium"
            />
          )}

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? "Listening..."
                : atLimit
                  ? "Message limit reached"
                  : placeholder
            }
            disabled={isLoading || disabled || atLimit || isListening}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled || atLimit}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Individual message bubble
 */
function MessageBubble({
  message,
  showAudio,
  onAudioPlayed,
}: {
  message: ChatMessage;
  showAudio?: boolean;
  onAudioPlayed?: () => void;
}) {
  const isStudent = message.role === 'student';

  return (
    <div className={`flex items-start gap-3 ${isStudent ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
          ${isStudent
            ? 'bg-green-100'
            : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
          }`}
      >
        {isStudent ? '🧒' : '👩‍🏫'}
      </div>

      {/* Message */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isStudent
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Audio button for Ms. Guide messages */}
        {showAudio && !isStudent && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <AudioButton
              text={message.content}
              size="small"
              onPlay={onAudioPlayed}
              label="Listen"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;
