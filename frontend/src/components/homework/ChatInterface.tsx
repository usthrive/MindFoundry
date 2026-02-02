/**
 * Chat Interface Component
 *
 * Interactive chat with Ms. Guide for follow-up questions.
 * Maintains context about the current problem being discussed.
 */

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/homework';
import { AudioButton } from './AudioButton';

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

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  maxMessages = 20,
  onAudioPlayed,
  placeholder = "Ask Ms. Guide a question...",
  disabled = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={atLimit ? "Message limit reached" : placeholder}
            disabled={isLoading || disabled || atLimit}
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
