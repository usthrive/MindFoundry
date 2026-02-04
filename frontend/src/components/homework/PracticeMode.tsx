/**
 * Practice Mode Component
 *
 * Displays algorithmically generated practice problems.
 * Used after "Try a Similar Problem" in ReviewWithMsGuide.
 */

import { useState, useCallback } from 'react';
import type { GeneratedSchoolProblem } from '../../services/generators/school/types';

interface PracticeModeProps {
  /** The practice problem to display */
  problem: GeneratedSchoolProblem;
  /** Current problem index (1-based for display) */
  problemNumber: number;
  /** Total number of practice problems */
  totalProblems: number;
  /** Called when user submits an answer */
  onSubmitAnswer: (answer: string, isCorrect: boolean) => void;
  /** Called when user wants to see a hint */
  onRequestHint?: () => void;
  /** Called when user is done with practice */
  onDone: () => void;
  /** Called when moving to next problem */
  onNext?: () => void;
}

type PracticeState = 'answering' | 'correct' | 'incorrect';

export function PracticeMode({
  problem,
  problemNumber,
  totalProblems,
  onSubmitAnswer,
  onRequestHint,
  onDone,
  onNext,
}: PracticeModeProps) {
  const [answer, setAnswer] = useState('');
  const [state, setState] = useState<PracticeState>('answering');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const hints = problem.problem_data?.hints || [];
  const solutionSteps = problem.problem_data?.solution_steps || [];

  /**
   * Check if answer is correct
   */
  const checkAnswer = useCallback(() => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = String(problem.correct_answer).trim().toLowerCase();

    // Normalize for comparison (remove spaces, handle fractions)
    const normalizeAnswer = (a: string) =>
      a.replace(/\s+/g, '').replace(/,/g, '');

    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

    setState(isCorrect ? 'correct' : 'incorrect');
    onSubmitAnswer(answer, isCorrect);
  }, [answer, problem.correct_answer, onSubmitAnswer]);

  /**
   * Show next hint
   */
  const handleShowHint = useCallback(() => {
    if (!showHint) {
      setShowHint(true);
      onRequestHint?.();
    } else if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  }, [showHint, hintIndex, hints.length, onRequestHint]);

  /**
   * Try again after incorrect
   */
  const handleTryAgain = useCallback(() => {
    setAnswer('');
    setState('answering');
    setShowSolution(false);
  }, []);

  /**
   * Move to next problem
   */
  const handleNext = useCallback(() => {
    setAnswer('');
    setState('answering');
    setShowHint(false);
    setHintIndex(0);
    setShowSolution(false);
    onNext?.();
  }, [onNext]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Practice Time!</h1>
            <p className="text-sm text-gray-500">
              Problem {problemNumber} of {totalProblems}
            </p>
          </div>
          <button
            onClick={onDone}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Problem card */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
            <div className="text-center mb-6">
              <span className="text-4xl">📝</span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 whitespace-pre-wrap">
                {problem.problem_text}
              </h2>
            </div>

            {/* Answer input */}
            {state === 'answering' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answer.trim()) {
                      checkAnswer();
                    }
                  }}
                />

                <button
                  onClick={checkAnswer}
                  disabled={!answer.trim()}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Check Answer
                </button>

                {/* Hint button */}
                {hints.length > 0 && (
                  <button
                    onClick={handleShowHint}
                    className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showHint ? 'Show Another Hint' : 'Need a Hint?'}
                  </button>
                )}
              </div>
            )}

            {/* Correct answer feedback */}
            {state === 'correct' && (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🎉</div>
                <h3 className="text-2xl font-bold text-green-600">Correct!</h3>
                <p className="text-gray-600">Great job! You got it right!</p>
              </div>
            )}

            {/* Incorrect answer feedback */}
            {state === 'incorrect' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">🤔</div>
                  <h3 className="text-xl font-bold text-amber-600">Not quite!</h3>
                  <p className="text-gray-600 mt-2">
                    Your answer: <span className="font-medium text-red-600">{answer}</span>
                  </p>
                </div>

                {/* Show solution option */}
                {!showSolution ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleTryAgain}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setShowSolution(true)}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                    >
                      Show Answer
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-center text-green-700 font-medium mb-3">
                      The correct answer is: <span className="text-xl">{problem.correct_answer}</span>
                    </p>
                    {solutionSteps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-sm text-green-700 font-medium mb-2">Solution steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                          {solutionSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hints display */}
          {showHint && hints.length > 0 && state === 'answering' && (
            <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-medium text-amber-800">Hint {hintIndex + 1}:</p>
                  <p className="text-amber-700">{hints[hintIndex]}</p>
                  {hintIndex < hints.length - 1 && (
                    <button
                      onClick={handleShowHint}
                      className="text-amber-600 hover:text-amber-700 text-sm mt-2"
                    >
                      Need another hint? ({hints.length - hintIndex - 1} remaining)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {state === 'correct' && problemNumber < totalProblems && onNext ? (
            <>
              <button
                onClick={onDone}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Next Problem →
              </button>
            </>
          ) : state === 'correct' || (state === 'incorrect' && showSolution) ? (
            <button
              onClick={onDone}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Done Practicing ✓
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default PracticeMode;
