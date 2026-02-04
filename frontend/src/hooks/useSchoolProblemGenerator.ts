/**
 * useSchoolProblemGenerator Hook
 *
 * Provides easy integration for generating similar practice problems
 * using the algorithmic school problem generator.
 *
 * Uses LLM ONCE to extract template, then generates problems FREE.
 */

import { useState, useCallback } from 'react';
import {
  generatePracticeProblems,
  findOrCreateTemplate,
} from '../services/schoolProblemService';
import type { GeneratedSchoolProblem, SchoolProblemTemplate } from '../services/generators/school/types';

interface UseSchoolProblemGeneratorOptions {
  /** Child ID for personalized templates */
  childId?: string;
  /** Number of problems to generate */
  count?: number;
  /** Callback when problems are generated */
  onGenerated?: (problems: GeneratedSchoolProblem[]) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

interface UseSchoolProblemGeneratorReturn {
  /** Generated practice problems */
  problems: GeneratedSchoolProblem[];
  /** Current template being used */
  template: SchoolProblemTemplate | null;
  /** Whether generation is in progress */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Generate similar problems from a source problem */
  generateSimilar: (problemText: string, gradeLevel: string) => Promise<void>;
  /** Clear generated problems */
  clearProblems: () => void;
  /** Get the current problem (for practice mode) */
  currentProblem: GeneratedSchoolProblem | null;
  /** Move to next problem */
  nextProblem: () => void;
  /** Current problem index */
  currentIndex: number;
}

/**
 * Hook for generating similar practice problems algorithmically
 *
 * @example
 * ```tsx
 * const { generateSimilar, problems, isLoading } = useSchoolProblemGenerator({
 *   childId: 'child-123',
 *   count: 2,
 * });
 *
 * // In ReviewWithMsGuide:
 * <ReviewWithMsGuide
 *   onRequestSimilar={() => generateSimilar(problem.problem_text, '3')}
 *   isSimilarLoading={isLoading}
 * />
 * ```
 */
export function useSchoolProblemGenerator(
  options: UseSchoolProblemGeneratorOptions = {}
): UseSchoolProblemGeneratorReturn {
  const { childId, count = 2, onGenerated, onError } = options;

  const [problems, setProblems] = useState<GeneratedSchoolProblem[]>([]);
  const [template, setTemplate] = useState<SchoolProblemTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Generate similar problems from a source problem
   */
  const generateSimilar = useCallback(
    async (problemText: string, gradeLevel: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // First, find or create a template (LLM cost only if no matching template exists)
        const foundTemplate = await findOrCreateTemplate(problemText, gradeLevel, childId);

        if (foundTemplate) {
          setTemplate(foundTemplate);
        }

        // Generate problems algorithmically (FREE!)
        const generatedProblems = await generatePracticeProblems(
          problemText,
          gradeLevel,
          count,
          childId
        );

        if (generatedProblems.length > 0) {
          setProblems(generatedProblems);
          setCurrentIndex(0);
          onGenerated?.(generatedProblems);
        } else {
          const err = new Error('No problems could be generated');
          setError(err.message);
          onError?.(err);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error.message);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [childId, count, onGenerated, onError]
  );

  /**
   * Clear generated problems
   */
  const clearProblems = useCallback(() => {
    setProblems([]);
    setTemplate(null);
    setCurrentIndex(0);
    setError(null);
  }, []);

  /**
   * Move to next problem
   */
  const nextProblem = useCallback(() => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, problems.length]);

  /**
   * Get current problem
   */
  const currentProblem = problems[currentIndex] || null;

  return {
    problems,
    template,
    isLoading,
    error,
    generateSimilar,
    clearProblems,
    currentProblem,
    nextProblem,
    currentIndex,
  };
}

export default useSchoolProblemGenerator;
