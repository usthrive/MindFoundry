/**
 * School Addition Problem Generator
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
 * Generate an addition problem from template
 */
export function generateAdditionProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const pattern = template.template_pattern;

  // Generate operands
  let operands = generateOperands(pattern);

  // Apply constraints
  operands = applyConstraints(operands, '+', pattern.constraints);

  // Calculate answer
  const answer = operands.reduce((sum, n) => sum + n, 0);

  // Generate hints
  const hints = generateHints(template.hint_templates, operands, '+');

  // Generate solution steps
  const solutionSteps = template.solution_step_templates.length > 0
    ? template.solution_step_templates.map(step =>
        step
          .replace(/\{\{num1\}\}/g, String(operands[0]))
          .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
          .replace(/\{\{answer\}\}/g, String(answer))
      )
    : generateDefaultAdditionSteps(operands, answer);

  // Format problem text
  const problem_text = formatProblemText(operands, '+', pattern.format);

  return {
    id: generateId(),
    template_id: template.id,
    problem_text,
    correct_answer: answer,
    problem_data: {
      operands,
      operator: '+',
      format: pattern.format,
      hints,
      solution_steps: solutionSteps,
    },
    difficulty,
  };
}

/**
 * Generate default solution steps for addition
 */
function generateDefaultAdditionSteps(operands: number[], answer: number): string[] {
  const [a, b] = operands;

  // Check if carrying is needed
  const needsCarrying = (a % 10) + (b % 10) >= 10;

  if (needsCarrying && a > 9 && b > 9) {
    const onesA = a % 10;
    const onesB = b % 10;
    const onesSum = onesA + onesB;
    const carry = Math.floor(onesSum / 10);
    const tensA = Math.floor(a / 10);
    const tensB = Math.floor(b / 10);

    return [
      `Add the ones place: ${onesA} + ${onesB} = ${onesSum}`,
      `Write ${onesSum % 10}, carry the ${carry}`,
      `Add the tens place with carry: ${tensA} + ${tensB} + ${carry} = ${tensA + tensB + carry}`,
      `The answer is ${answer}`,
    ];
  }

  return [
    `Start with ${a}`,
    `Add ${b} to get ${answer}`,
  ];
}
