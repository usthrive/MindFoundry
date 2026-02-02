/**
 * Practice Test Component
 *
 * Test-taking interface for Exam Prep mode.
 * Displays one problem at a time with optional timer.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GeneratedProblem, ExamPrepTest } from '../../types/homework';

interface PracticeTestProps {
  /** The practice test data */
  test: ExamPrepTest;
  /** Current answers (keyed by problem index) */
  answers: Record<number, string>;
  /** Called when an answer is submitted */
  onAnswerChange: (problemIndex: number, answer: string) => void;
  /** Called when test is submitted */
  onSubmit: () => void;
  /** Called when user wants to go back */
  onBack?: () => void;
  /** Whether submission is in progress */
  isSubmitting?: boolean;
}

/**
 * Format time as MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Progress bar component
 */
function ProgressBar({
  current,
  total,
  answeredCount,
}: {
  current: number;
  total: number;
  answeredCount: number;
}) {
  const progressPercent = (answeredCount / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          Question {current + 1} of {total}
        </span>
        <span>
          {answeredCount} answered
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {/* Problem dots */}
      <div className="flex gap-1 mt-2 flex-wrap">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            className={`w-6 h-6 rounded-full text-xs font-medium transition-all
              ${idx === current
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : answeredCount > 0 && Object.keys({})[idx]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            onClick={() => {}}
            aria-label={`Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Timer component
 */
function Timer({
  timeRemaining,
  isWarning,
}: {
  timeRemaining: number;
  isWarning: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg
        ${isWarning
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-gray-100 text-gray-700'
        }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}

/**
 * Number pad for entering answers
 */
function NumberPad({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const handleKey = (key: string) => {
    if (disabled) return;
    if (key === 'backspace') {
      onChange(value.slice(0, -1));
    } else if (key === 'clear') {
      onChange('');
    } else {
      onChange(value + key);
    }
  };

  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', '-'],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
      {keys.map((row, rowIdx) => (
        <React.Fragment key={rowIdx}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              disabled={disabled}
              className="h-12 rounded-xl bg-gray-100 text-xl font-semibold text-gray-800
                hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              {key}
            </button>
          ))}
          {rowIdx === 0 && (
            <button
              onClick={() => handleKey('backspace')}
              disabled={disabled}
              className="h-12 rounded-xl bg-amber-100 text-amber-700
                hover:bg-amber-200 active:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors flex items-center justify-center"
              aria-label="Backspace"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            </button>
          )}
          {rowIdx === 1 && (
            <button
              onClick={() => handleKey('/')}
              disabled={disabled}
              className="h-12 rounded-xl bg-gray-100 text-xl font-semibold text-gray-800
                hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              /
            </button>
          )}
          {rowIdx === 2 && (
            <button
              onClick={() => handleKey('clear')}
              disabled={disabled}
              className="h-12 rounded-xl bg-red-100 text-red-700 text-sm font-medium
                hover:bg-red-200 active:bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              Clear
            </button>
          )}
          {rowIdx === 3 && (
            <button
              onClick={() => handleKey(' ')}
              disabled={disabled}
              className="h-12 rounded-xl bg-gray-100 text-gray-500 text-sm
                hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              Space
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Problem card component
 */
function ProblemCard({
  problem,
  answer,
  onAnswerChange,
  showNumberPad,
  disabled,
}: {
  problem: GeneratedProblem;
  answer: string;
  onAnswerChange: (answer: string) => void;
  showNumberPad: boolean;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [problem.index]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* Problem type badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
          {problem.problem_type.replace('_', ' ')}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${problem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            problem.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'}`}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Problem text */}
      <div className="text-2xl font-semibold text-gray-900 mb-6 text-center py-4">
        {problem.problem_text}
      </div>

      {/* Answer input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={disabled}
          className="w-full text-center text-2xl font-bold py-4 px-6 border-2 border-gray-200
            rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          placeholder="Enter your answer..."
          autoComplete="off"
        />
      </div>

      {/* Number pad (optional) */}
      {showNumberPad && (
        <div className="mt-4">
          <NumberPad
            value={answer}
            onChange={onAnswerChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

export function PracticeTest({
  test,
  answers,
  onAnswerChange,
  onSubmit,
  onBack,
  isSubmitting = false,
}: PracticeTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    test.timer_enabled && test.time_limit_minutes
      ? test.time_limit_minutes * 60
      : null
  );
  const [showNumberPad, setShowNumberPad] = useState(true);

  const problems = test.generated_problems;
  const currentProblem = problems[currentIndex];
  const answeredCount = Object.keys(answers).filter((key) => answers[parseInt(key)]?.trim()).length;
  const allAnswered = answeredCount === problems.length;

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) return prev;
        if (prev === 1) {
          // Time's up - auto submit
          onSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onSubmit]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, problems.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < problems.length) {
      setCurrentIndex(index);
    }
  }, [problems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Tab') {
        if (!e.shiftKey) {
          e.preventDefault();
          goToNext();
        }
      } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onSubmit]);

  const isWarningTime = timeRemaining !== null && timeRemaining <= 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {timeRemaining !== null && (
            <Timer timeRemaining={timeRemaining} isWarning={isWarningTime} />
          )}
        </div>

        {/* Progress */}
        <ProgressBar
          current={currentIndex}
          total={problems.length}
          answeredCount={answeredCount}
        />

        {/* Question dots for quick navigation */}
        <div className="flex gap-1 mb-6 flex-wrap justify-center">
          {problems.map((_, idx) => {
            const isAnswered = !!answers[idx]?.trim();
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all
                  ${isCurrent
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300 scale-110'
                    : isAnswered
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                aria-label={`Go to question ${idx + 1}${isAnswered ? ' (answered)' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Current problem */}
        {currentProblem && (
          <ProblemCard
            problem={currentProblem}
            answer={answers[currentIndex] || ''}
            onAnswerChange={(answer) => onAnswerChange(currentIndex, answer)}
            showNumberPad={showNumberPad}
            disabled={isSubmitting}
          />
        )}

        {/* Toggle number pad */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowNumberPad(!showNumberPad)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showNumberPad ? 'Hide number pad' : 'Show number pad'}
          </button>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0 || isSubmitting}
            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium
              hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentIndex < problems.length - 1 ? (
            <button
              onClick={goToNext}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-xl font-medium
                hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors
                ${allAnswered
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : allAnswered ? (
                'Submit Test'
              ) : (
                `Submit (${problems.length - answeredCount} unanswered)`
              )}
            </button>
          )}
        </div>

        {/* Submit warning */}
        {!allAnswered && currentIndex === problems.length - 1 && (
          <p className="text-center text-amber-600 text-sm mt-3">
            You have {problems.length - answeredCount} unanswered question(s).
            You can still submit, but they will be marked as incorrect.
          </p>
        )}

        {/* Keyboard shortcuts hint */}
        <p className="text-center text-gray-400 text-xs mt-4">
          Use ← → keys to navigate • Ctrl+Enter to submit
        </p>
      </div>
    </div>
  );
}

export default PracticeTest;
