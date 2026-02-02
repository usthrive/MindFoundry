/**
 * Problem Extraction Component
 *
 * Displays extracted problems from homework images.
 * Allows selection of problems for help (Homework Helper) or shows all (Exam Prep).
 */

import type { ExtractedProblem } from '../../types/homework';

interface ProblemExtractionProps {
  /** List of extracted problems */
  problems: ExtractedProblem[];
  /** Selected problem indices (for Homework Helper) */
  selectedIndices?: number[];
  /** Callback when selection changes */
  onSelectionChange?: (indices: number[]) => void;
  /** Whether selection is enabled */
  selectionEnabled?: boolean;
  /** Maximum problems that can be selected */
  maxSelection?: number;
  /** Is loading state */
  isLoading?: boolean;
  /** Callback when clicking a problem */
  onProblemClick?: (index: number) => void;
  /** Current active problem index */
  activeProblemIndex?: number;
}

/**
 * Difficulty badge colors
 */
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

/**
 * Problem type icons
 */
const TYPE_ICONS: Record<string, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
  fractions: '½',
  decimals: '.',
  percentages: '%',
  algebra: 'x',
  geometry: '△',
  word_problem: '📝',
  order_of_operations: '()',
  other: '?',
};

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No problems found
      </h3>
      <p className="text-gray-600">
        We couldn't find any math problems in the uploaded images.
        <br />
        Try uploading clearer photos of your homework.
      </p>
    </div>
  );
}

export function ProblemExtraction({
  problems,
  selectedIndices = [],
  onSelectionChange,
  selectionEnabled = false,
  maxSelection = 10,
  isLoading = false,
  onProblemClick,
  activeProblemIndex,
}: ProblemExtractionProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (problems.length === 0) {
    return <EmptyState />;
  }

  const handleToggleSelect = (index: number) => {
    if (!onSelectionChange) return;

    const isSelected = selectedIndices.includes(index);
    if (isSelected) {
      onSelectionChange(selectedIndices.filter((i) => i !== index));
    } else if (selectedIndices.length < maxSelection) {
      onSelectionChange([...selectedIndices, index]);
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    const allIndices = problems.map((_, i) => i).slice(0, maxSelection);
    onSelectionChange(allIndices);
  };

  const handleClearAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Header with selection controls */}
      {selectionEnabled && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedIndices.length} of {Math.min(problems.length, maxSelection)} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              disabled={selectedIndices.length === 0}
              className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Clear
            </button>
            <button
              onClick={handleSelectAll}
              disabled={selectedIndices.length >= Math.min(problems.length, maxSelection)}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              Select all
            </button>
          </div>
        </div>
      )}

      {/* Problem List */}
      <div className="space-y-3">
        {problems.map((problem, index) => {
          const isSelected = selectedIndices.includes(index);
          const isActive = activeProblemIndex === index;
          const isLowConfidence = problem.confidence < 0.7;

          return (
            <div
              key={index}
              onClick={() => {
                if (selectionEnabled) {
                  handleToggleSelect(index);
                } else if (onProblemClick) {
                  onProblemClick(index);
                }
              }}
              className={`
                relative bg-white rounded-xl p-4 border-2 transition-all cursor-pointer
                ${isActive
                  ? 'border-blue-500 bg-blue-50'
                  : isSelected
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Selection checkbox or number */}
                {selectionEnabled ? (
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300'
                      }`}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {TYPE_ICONS[problem.problem_type] || '?'}
                  </div>
                )}

                {/* Problem content */}
                <div className="flex-1 min-w-0">
                  {/* Problem number if available */}
                  {problem.problem_number && (
                    <span className="text-xs text-gray-500 mb-1 block">
                      Problem {problem.problem_number}
                    </span>
                  )}

                  {/* Problem text */}
                  <p className="text-gray-900 font-medium break-words">
                    {problem.problem_text}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        DIFFICULTY_COLORS[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {problem.problem_type.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      Grade {problem.grade_level}
                    </span>
                  </div>

                  {/* Low confidence warning */}
                  {isLowConfidence && (
                    <div className="mt-2 flex items-center text-xs text-amber-600">
                      <span className="mr-1">⚠️</span>
                      This problem may have been read incorrectly
                    </div>
                  )}
                </div>

                {/* Confidence indicator */}
                <div
                  className={`w-2 h-full min-h-[40px] rounded-full flex-shrink-0 ${
                    problem.confidence >= 0.9
                      ? 'bg-green-400'
                      : problem.confidence >= 0.7
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                  }`}
                  title={`Confidence: ${Math.round(problem.confidence * 100)}%`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{problems.length}</span> math problems
        </p>
        {selectionEnabled && selectedIndices.length > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            {selectedIndices.length} selected for help
          </p>
        )}
      </div>
    </div>
  );
}

export default ProblemExtraction;
