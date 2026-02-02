/**
 * Batch Evaluation Prompt
 *
 * Used with Haiku 4.5 for evaluating multiple answers at once (cost-efficient).
 */

import type { GeneratedProblem } from '../../../types/homework';

/**
 * Build batch evaluation prompt
 */
export function buildBatchEvaluationPrompt(
  problems: GeneratedProblem[],
  answers: string[]
): string {
  const problemsAndAnswers = problems.map((p, i) => ({
    index: i,
    problem: p.problem_text,
    correct_answer: p.answer,
    student_answer: answers[i] || '',
  }));

  return `Evaluate these student answers for a practice test.

Problems and answers:
${JSON.stringify(problemsAndAnswers, null, 2)}

For each problem, determine:
1. Is the answer correct? (consider equivalent forms, e.g., "1/2" = "0.5" = "50%")
2. If wrong, what type of error?

Error types:
- calculation_error: Right approach, arithmetic mistake
- conceptual_error: Misunderstood the concept
- wrong_operation: Used wrong operation (added instead of subtracted, etc.)
- incomplete: Partial answer, didn't finish
- misread_problem: Seems to have solved a different problem
- other: Doesn't fit other categories

Return JSON:
{
  "evaluations": [
    {
      "problem_index": 0,
      "is_correct": false,
      "student_answer": "45",
      "correct_answer": "54",
      "error_type": "calculation_error",
      "brief_note": "Reversed the digits"
    }
  ],
  "summary": {
    "total": 10,
    "correct": 7,
    "incorrect": 3
  }
}`;
}

/**
 * Build single answer evaluation prompt (for homework helper mode)
 */
export function buildSingleEvaluationPrompt(
  problemText: string,
  correctAnswer: string,
  studentAnswer: string
): string {
  return `Evaluate this student's answer.

Problem: ${problemText}
Correct answer: ${correctAnswer}
Student's answer: ${studentAnswer}

Consider equivalent forms (e.g., "1/2" = "0.5", "3" = "3.0", etc.)

Return JSON:
{
  "is_correct": true/false,
  "error_type": "calculation_error" | "conceptual_error" | "wrong_operation" | "incomplete" | "misread_problem" | "other" | null,
  "brief_note": "Brief explanation of the error (or null if correct)"
}`;
}
