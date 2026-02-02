/**
 * Test Results Component
 *
 * Displays the results of a completed practice test.
 * Shows score, topic breakdown, and allows review of wrong answers.
 */

import { useState, useMemo } from 'react';
import type {
  ExamPrepTest,
  BatchEvaluationResult,
  EvaluationResult,
  GeneratedProblem,
  HomeworkProblemType,
} from '../../types/homework';

interface TestResultsProps {
  /** The completed test */
  test: ExamPrepTest;
  /** Evaluation results */
  results: BatchEvaluationResult;
  /** Student's answers */
  answers: Record<number, string>;
  /** Called when user wants to review a wrong answer */
  onReviewProblem: (problemIndex: number) => void;
  /** Called when user wants to retry the test */
  onRetry?: () => void;
  /** Called when user wants to go back home */
  onDone: () => void;
}

/**
 * Get display name for problem type
 */
function getProblemTypeDisplay(type: HomeworkProblemType): string {
  const displayNames: Record<HomeworkProblemType, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    fractions: 'Fractions',
    decimals: 'Decimals',
    percentages: 'Percentages',
    algebra: 'Algebra',
    geometry: 'Geometry',
    word_problem: 'Word Problems',
    order_of_operations: 'Order of Operations',
    other: 'Other',
  };
  return displayNames[type] || type;
}

/**
 * Celebration animation component
 */
function Celebration({ score }: { score: number }) {
  const emojis = score >= 90 ? ['🏆', '⭐', '🎉', '🌟', '✨'] :
                 score >= 80 ? ['🎉', '⭐', '👏', '🌟'] :
                 score >= 70 ? ['👍', '⭐', '👏'] :
                 ['💪', '📚'];

  return (
    <div className="text-center py-6">
      <div className="text-6xl mb-4 animate-bounce">
        {score >= 90 ? '🏆' : score >= 70 ? '⭐' : '💪'}
      </div>
      <div className="flex justify-center gap-2 text-2xl">
        {emojis.map((emoji, idx) => (
          <span
            key={idx}
            className="animate-pulse"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Score display component
 */
function ScoreDisplay({ correct, total }: { correct: number; total: number }) {
  const percentage = Math.round((correct / total) * 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const scoreColor = percentage >= 80 ? 'text-green-500' :
                     percentage >= 60 ? 'text-amber-500' :
                     'text-red-500';

  const strokeColor = percentage >= 80 ? '#22c55e' :
                      percentage >= 60 ? '#f59e0b' :
                      '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor}`}>{percentage}%</span>
        </div>
      </div>
      <p className="mt-2 text-gray-600">
        {correct} of {total} correct
      </p>
    </div>
  );
}

/**
 * Topic breakdown bar
 */
function TopicBar({
  topic,
  correct,
  total,
}: {
  topic: string;
  correct: number;
  total: number;
}) {
  const percentage = Math.round((correct / total) * 100);
  const barColor = percentage >= 80 ? 'bg-green-500' :
                   percentage >= 60 ? 'bg-amber-500' :
                   'bg-red-500';

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{topic}</span>
        <span className="text-gray-500">{correct}/{total}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Problem result row
 */
function ProblemRow({
  problem,
  evaluation,
  studentAnswer,
  onReview,
}: {
  problem: GeneratedProblem;
  evaluation: EvaluationResult;
  studentAnswer: string;
  onReview: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-xl mb-2 border
        ${evaluation.is_correct
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-lg ${evaluation.is_correct ? 'text-green-500' : 'text-red-500'}`}>
              {evaluation.is_correct ? '✓' : '✗'}
            </span>
            <span className="font-medium text-gray-900">
              {problem.problem_text}
            </span>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Your answer:</span>{' '}
              <span className={evaluation.is_correct ? 'text-green-700' : 'text-red-700'}>
                {studentAnswer || '(no answer)'}
              </span>
            </p>
            {!evaluation.is_correct && (
              <p>
                <span className="font-medium">Correct answer:</span>{' '}
                <span className="text-green-700">{evaluation.correct_answer}</span>
              </p>
            )}
          </div>
        </div>

        {!evaluation.is_correct && (
          <button
            onClick={onReview}
            className="flex-shrink-0 px-4 py-2 bg-blue-500 text-white rounded-lg
              hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
}

export function TestResults({
  test,
  results,
  answers,
  onReviewProblem,
  onRetry,
  onDone,
}: TestResultsProps) {
  const [showAllProblems, setShowAllProblems] = useState(false);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const { correct, total } = results.summary;
  const percentage = Math.round((correct / total) * 100);
  const problems = test.generated_problems;

  // Calculate topic breakdown
  const topicBreakdown = useMemo(() => {
    const breakdown: Record<string, { correct: number; total: number }> = {};

    problems.forEach((problem, idx) => {
      const evaluation = results.evaluations.find((e) => e.problem_index === idx);
      const topic = getProblemTypeDisplay(problem.problem_type);

      if (!breakdown[topic]) {
        breakdown[topic] = { correct: 0, total: 0 };
      }
      breakdown[topic].total++;
      if (evaluation?.is_correct) {
        breakdown[topic].correct++;
      }
    });

    return Object.entries(breakdown)
      .sort((a, b) => {
        // Sort by percentage (lowest first to highlight weak areas)
        const pctA = a[1].correct / a[1].total;
        const pctB = b[1].correct / b[1].total;
        return pctA - pctB;
      });
  }, [problems, results.evaluations]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((_, idx) => {
      const evaluation = results.evaluations.find((e) => e.problem_index === idx);
      if (filter === 'correct') return evaluation?.is_correct;
      if (filter === 'incorrect') return !evaluation?.is_correct;
      return true;
    });
  }, [problems, results.evaluations, filter]);

  // Wrong answers for quick review
  const wrongAnswers = useMemo(() => {
    return results.evaluations
      .filter((e) => !e.is_correct)
      .map((e) => ({
        evaluation: e,
        problem: problems[e.problem_index],
        studentAnswer: answers[e.problem_index] || '',
      }));
  }, [results.evaluations, problems, answers]);

  // Encouragement message based on score
  const getMessage = () => {
    if (percentage >= 90) return "Outstanding work! You really mastered this!";
    if (percentage >= 80) return "Great job! You're doing really well!";
    if (percentage >= 70) return "Good effort! Let's review a few things.";
    if (percentage >= 60) return "Nice try! Practice makes perfect.";
    return "Keep practicing! You'll get better with time.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Complete!</h1>
          <p className="text-gray-600">{getMessage()}</p>
        </div>

        {/* Celebration for good scores */}
        {percentage >= 70 && <Celebration score={percentage} />}

        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <ScoreDisplay correct={correct} total={total} />

          {/* Time taken (if applicable) */}
          {test.started_at && test.completed_at && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Completed in{' '}
              {Math.round(
                (new Date(test.completed_at).getTime() -
                  new Date(test.started_at).getTime()) /
                  60000
              )}{' '}
              minutes
            </p>
          )}
        </div>

        {/* Topic breakdown */}
        {topicBreakdown.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Performance by Topic
            </h2>
            {topicBreakdown.map(([topic, stats]) => (
              <TopicBar
                key={topic}
                topic={topic}
                correct={stats.correct}
                total={stats.total}
              />
            ))}
          </div>
        )}

        {/* Quick review section for wrong answers */}
        {wrongAnswers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Review Mistakes ({wrongAnswers.length})
              </h2>
              <span className="text-sm text-gray-500">
                Click to learn with Ms. Guide
              </span>
            </div>

            {wrongAnswers.slice(0, showAllProblems ? undefined : 3).map(
              ({ evaluation, problem, studentAnswer }) => (
                <ProblemRow
                  key={evaluation.problem_index}
                  problem={problem}
                  evaluation={evaluation}
                  studentAnswer={studentAnswer}
                  onReview={() => onReviewProblem(evaluation.problem_index)}
                />
              )
            )}

            {wrongAnswers.length > 3 && !showAllProblems && (
              <button
                onClick={() => setShowAllProblems(true)}
                className="w-full py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Show {wrongAnswers.length - 3} more
              </button>
            )}
          </div>
        )}

        {/* All problems (collapsible) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Problems</h2>
            <div className="flex gap-2">
              {(['all', 'correct', 'incorrect'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${filter === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {f === 'all' ? 'All' : f === 'correct' ? '✓ Correct' : '✗ Incorrect'}
                </button>
              ))}
            </div>
          </div>

          {filteredProblems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No problems match this filter
            </p>
          ) : (
            filteredProblems.map((problem) => {
              const evaluation = results.evaluations.find(
                (e) => e.problem_index === problem.index
              );
              if (!evaluation) return null;

              return (
                <ProblemRow
                  key={problem.index}
                  problem={problem}
                  evaluation={evaluation}
                  studentAnswer={answers[problem.index] || ''}
                  onReview={() => onReviewProblem(problem.index)}
                />
              );
            })
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-6 bg-purple-500 text-white rounded-xl font-medium
                hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onDone}
            className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-xl font-medium
              hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>

        {/* Encouragement */}
        <div className="text-center mt-6 mb-4">
          <p className="text-gray-500 text-sm">
            {percentage < 70
              ? "Remember: Every mistake is a chance to learn! 📚"
              : percentage < 90
                ? "Great progress! Keep up the good work! 🌟"
                : "You're a math superstar! 🏆"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestResults;
