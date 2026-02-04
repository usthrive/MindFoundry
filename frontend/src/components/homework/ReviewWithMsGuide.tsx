/**
 * Review With Ms. Guide Component
 *
 * Combines MsGuideCard and ChatInterface for reviewing wrong answers.
 * Allows navigation between multiple wrong answers.
 */

import { useState, useCallback } from 'react';
import type {
  GeneratedProblem,
  EvaluationResult,
  MsGuideExplanation,
  ChatMessage,
  ProblemContext,
} from '../../types/homework';
import { MsGuideCard } from './MsGuideCard';
import { ChatInterface } from './ChatInterface';

interface WrongAnswer {
  problemIndex: number;
  problem: GeneratedProblem;
  evaluation: EvaluationResult;
  studentAnswer: string;
}

interface ReviewWithMsGuideProps {
  /** List of wrong answers to review */
  wrongAnswers: WrongAnswer[];
  /** Currently selected wrong answer index */
  currentIndex: number;
  /** Called when navigation changes */
  onNavigate: (index: number) => void;
  /** The explanation for the current problem */
  explanation: MsGuideExplanation | null;
  /** Whether explanation is loading */
  isExplanationLoading: boolean;
  /** Chat history for current problem */
  chatMessages: ChatMessage[];
  /** Called when user sends a chat message */
  onSendMessage: (message: string) => Promise<void>;
  /** Whether chat is loading */
  isChatLoading: boolean;
  /** Called when user requests a similar problem */
  onRequestSimilar?: () => void;
  /** Whether similar problem is loading */
  isSimilarLoading?: boolean;
  /** Called when user is done reviewing */
  onDone: () => void;
  /** Called when audio is played */
  onAudioPlayed?: () => void;
  /** Max chat messages allowed */
  maxChatMessages?: number;
}

/**
 * Problem context header
 */
function ProblemHeader({
  problem,
  evaluation,
  studentAnswer,
}: {
  problem: GeneratedProblem;
  evaluation: EvaluationResult;
  studentAnswer: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-lg">✗</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            {problem.problem_text}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-gray-500">Your answer:</span>{' '}
              <span className="font-medium text-red-600">
                {studentAnswer || '(no answer)'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Correct answer:</span>{' '}
              <span className="font-medium text-green-600">
                {evaluation.correct_answer}
              </span>
            </div>
          </div>
          {evaluation.error_type && (
            <div className="mt-2">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                {evaluation.error_type.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Navigation between wrong answers
 */
function ReviewNavigation({
  currentIndex,
  totalCount,
  onNavigate,
}: {
  currentIndex: number;
  totalCount: number;
  onNavigate: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex === 0}
        className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-all
              ${idx === currentIndex
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex === totalCount - 1}
        className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Tab buttons for switching between explanation and chat
 */
function TabButtons({
  activeTab,
  onTabChange,
  chatMessageCount,
}: {
  activeTab: 'explanation' | 'chat';
  onTabChange: (tab: 'explanation' | 'chat') => void;
  chatMessageCount: number;
}) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onTabChange('explanation')}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors
          ${activeTab === 'explanation'
            ? 'bg-purple-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        Explanation
      </button>
      <button
        onClick={() => onTabChange('chat')}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors
          ${activeTab === 'chat'
            ? 'bg-purple-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        Ask Questions
        {chatMessageCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {chatMessageCount}
          </span>
        )}
      </button>
    </div>
  );
}

export function ReviewWithMsGuide({
  wrongAnswers,
  currentIndex,
  onNavigate,
  explanation,
  isExplanationLoading,
  chatMessages,
  onSendMessage,
  isChatLoading,
  onRequestSimilar,
  isSimilarLoading = false,
  onDone,
  onAudioPlayed,
  maxChatMessages = 20,
}: ReviewWithMsGuideProps) {
  const [activeTab, setActiveTab] = useState<'explanation' | 'chat'>('explanation');

  const currentWrongAnswer = wrongAnswers[currentIndex];
  const { problem, evaluation, studentAnswer } = currentWrongAnswer;

  // Build problem context for chat
  // Note: GeneratedProblem doesn't have grade_level, so we default to '3'
  const problemContext: ProblemContext = {
    problem_text: problem.problem_text,
    student_answer: studentAnswer || '',
    correct_answer: evaluation.correct_answer || problem.answer || '',
    grade_level: '3',
    previous_explanation: explanation || undefined,
  };

  // Handle sending message - switch to chat tab if on explanation
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (activeTab === 'explanation') {
        setActiveTab('chat');
      }
      await onSendMessage(message);
    },
    [activeTab, onSendMessage]
  );

  // Handle navigation - reset to explanation tab
  const handleNavigate = useCallback(
    (index: number) => {
      setActiveTab('explanation');
      onNavigate(index);
    },
    [onNavigate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-gray-900">
              Review with Ms. Guide
            </h1>
            <button
              onClick={onDone}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation (if multiple wrong answers) */}
          {wrongAnswers.length > 1 && (
            <ReviewNavigation
              currentIndex={currentIndex}
              totalCount={wrongAnswers.length}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-2xl mx-auto p-4 h-full flex flex-col">
          {/* Problem header */}
          <ProblemHeader
            problem={problem}
            evaluation={evaluation}
            studentAnswer={studentAnswer}
          />

          {/* Tab buttons */}
          <TabButtons
            activeTab={activeTab}
            onTabChange={setActiveTab}
            chatMessageCount={chatMessages.length}
          />

          {/* Tab content */}
          <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-lg">
            {activeTab === 'explanation' ? (
              <div className="h-full overflow-y-auto p-4">
                {explanation ? (
                  <>
                    <MsGuideCard
                      explanation={explanation}
                      showAudio={true}
                      onAudioPlayed={onAudioPlayed}
                      isLoading={isExplanationLoading}
                    />

                    {/* Similar problem button */}
                    {onRequestSimilar && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={onRequestSimilar}
                          disabled={isSimilarLoading}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                          {isSimilarLoading ? (
                            <>
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Try a Similar Problem
                            </>
                          )}
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Practice with a new problem just like this one
                        </p>
                      </div>
                    )}

                    {/* Prompt to ask questions */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-600 mb-2">Still confused?</p>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ask Ms. Guide a question →
                      </button>
                    </div>
                  </>
                ) : isExplanationLoading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
                      👩‍🏫
                    </div>
                    <p className="text-gray-600">Ms. Guide is preparing your explanation...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-500">No explanation available</p>
                  </div>
                )}
              </div>
            ) : (
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                maxMessages={maxChatMessages}
                onAudioPlayed={onAudioPlayed}
                placeholder="Ask Ms. Guide about this problem..."
                context={problemContext}
                showContextBanner={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentIndex < wrongAnswers.length - 1 ? (
            <>
              <button
                onClick={onDone}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Done Reviewing
              </button>
              <button
                onClick={() => handleNavigate(currentIndex + 1)}
                className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Next Problem →
              </button>
            </>
          ) : (
            <button
              onClick={onDone}
              className="w-full py-3 px-6 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Finish Review ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewWithMsGuide;
