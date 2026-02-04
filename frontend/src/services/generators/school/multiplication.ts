/**
 * School Multiplication Problem Generator
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
 * Generate a multiplication problem from template
 */
export function generateMultiplicationProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const pattern = template.template_pattern;

  // Generate operands
  let operands = generateOperands(pattern);

  // Apply constraints
  operands = applyConstraints(operands, '*', pattern.constraints);

  // Calculate answer
  const answer = operands.reduce((product, n) => product * n, 1);

  // Generate hints
  const hints = generateHints(template.hint_templates, operands, '*');

  // Generate solution steps
  const solutionSteps = template.solution_step_templates.length > 0
    ? template.solution_step_templates.map(step =>
        step
          .replace(/\{\{num1\}\}/g, String(operands[0]))
          .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
          .replace(/\{\{answer\}\}/g, String(answer))
      )
    : generateDefaultMultiplicationSteps(operands, answer);

  // Format problem text
  const problem_text = formatProblemText(operands, '×', pattern.format);

  return {
    id: generateId(),
    template_id: template.id,
    problem_text,
    correct_answer: answer,
    problem_data: {
      operands,
      operator: '×',
      format: pattern.format,
      hints,
      solution_steps: solutionSteps,
    },
    difficulty,
  };
}

/**
 * Generate default solution steps for multiplication
 */
function generateDefaultMultiplicationSteps(operands: number[], answer: number): string[] {
  const [a, b] = operands;

  // Simple multiplication (small numbers)
  if (a <= 10 && b <= 10) {
    return [
      `We need to find ${a} × ${b}`,
      `This means ${a} groups of ${b}`,
      `${Array(a).fill(b).join(' + ')} = ${answer}`,
      `So ${a} × ${b} = ${answer}`,
    ];
  }

  // Two-digit by one-digit
  if (a > 10 && b <= 10) {
    const tens = Math.floor(a / 10) * 10;
    const ones = a % 10;

    return [
      `Break ${a} into ${tens} + ${ones}`,
      `Multiply each part by ${b}:`,
      `${tens} × ${b} = ${tens * b}`,
      `${ones} × ${b} = ${ones * b}`,
      `Add the parts: ${tens * b} + ${ones * b} = ${answer}`,
    ];
  }

  // Two-digit by two-digit
  if (a > 10 && b > 10) {
    const tensA = Math.floor(a / 10);
    const onesA = a % 10;

    return [
      `Multiply ${a} × ${b} using place value`,
      `First, ${a} × ${b % 10} = ${a * (b % 10)} (ones)`,
      `Next, ${a} × ${Math.floor(b / 10)} = ${a * Math.floor(b / 10)} (tens)`,
      `Shift the tens result: ${a * Math.floor(b / 10)}0`,
      `Add: ${a * (b % 10)} + ${a * Math.floor(b / 10) * 10} = ${answer}`,
    ];
  }

  return [
    `Multiply ${a} × ${b}`,
    `The answer is ${answer}`,
  ];
}
