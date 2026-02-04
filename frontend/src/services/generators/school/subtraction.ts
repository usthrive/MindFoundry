/**
 * School Subtraction Problem Generator
 */

import type { SchoolProblemTemplate, GeneratedSchoolProblem } from './types';
import {
  generateId,
  generateOperands,
  generateHints,
  formatProblemText,
  applyConstraints,
} from './utils';

/**
 * Generate a subtraction problem from template
 */
export function generateSubtractionProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const pattern = template.template_pattern;

  // Generate operands
  let operands = generateOperands(pattern);

  // Apply constraints
  operands = applyConstraints(operands, '-', pattern.constraints);

  // Ensure first operand is larger (no negative results for school problems)
  if (operands.length >= 2 && operands[0] < operands[1]) {
    [operands[0], operands[1]] = [operands[1], operands[0]];
  }

  // Calculate answer
  const answer = operands.reduce((diff, n, i) => (i === 0 ? n : diff - n), 0);

  // Generate hints
  const hints = generateHints(template.hint_templates, operands, '-');

  // Generate solution steps
  const solutionSteps = template.solution_step_templates.length > 0
    ? template.solution_step_templates.map(step =>
        step
          .replace(/\{\{num1\}\}/g, String(operands[0]))
          .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
          .replace(/\{\{answer\}\}/g, String(answer))
      )
    : generateDefaultSubtractionSteps(operands, answer);

  // Format problem text
  const problem_text = formatProblemText(operands, '-', pattern.format);

  return {
    id: generateId(),
    template_id: template.id,
    problem_text,
    correct_answer: answer,
    problem_data: {
      operands,
      operator: '-',
      format: pattern.format,
      hints,
      solution_steps: solutionSteps,
    },
    difficulty,
  };
}

/**
 * Generate default solution steps for subtraction
 */
function generateDefaultSubtractionSteps(operands: number[], answer: number): string[] {
  const [a, b] = operands;

  // Check if borrowing is needed
  const needsBorrowing = (a % 10) < (b % 10);

  if (needsBorrowing && a > 9 && b > 9) {
    const onesA = a % 10;
    const onesB = b % 10;
    const tensA = Math.floor(a / 10);
    const tensB = Math.floor(b / 10);

    return [
      `Look at the ones place: ${onesA} - ${onesB}`,
      `Since ${onesA} < ${onesB}, we need to borrow from the tens`,
      `Borrow 1 ten: ${tensA} becomes ${tensA - 1}, and ${onesA} becomes ${onesA + 10}`,
      `Now subtract ones: ${onesA + 10} - ${onesB} = ${onesA + 10 - onesB}`,
      `Subtract tens: ${tensA - 1} - ${tensB} = ${tensA - 1 - tensB}`,
      `The answer is ${answer}`,
    ];
  }

  return [
    `Start with ${a}`,
    `Take away ${b}`,
    `Count back ${b} from ${a} to get ${answer}`,
  ];
}
