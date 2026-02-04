/**
 * School Division Problem Generator
 */

import type { SchoolProblemTemplate, GeneratedSchoolProblem, TemplatePattern } from './types';
import {
  generateId,
  generateHints,
  formatProblemText,
  randomInt,
} from './utils';

/**
 * Generate a division problem from template
 */
export function generateDivisionProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const pattern = template.template_pattern;

  // Generate operands ensuring clean division (no remainders for basic problems)
  const operands = generateDivisionOperands(pattern);

  // Calculate answer
  const answer = Math.floor(operands[0] / operands[1]);

  // Generate hints
  const hints = generateHints(template.hint_templates, operands, '÷');

  // Generate solution steps
  const solutionSteps = template.solution_step_templates.length > 0
    ? template.solution_step_templates.map(step =>
        step
          .replace(/\{\{num1\}\}/g, String(operands[0]))
          .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
          .replace(/\{\{answer\}\}/g, String(answer))
      )
    : generateDefaultDivisionSteps(operands, answer);

  // Format problem text
  const problem_text = formatProblemText(operands, '÷', pattern.format);

  return {
    id: generateId(),
    template_id: template.id,
    problem_text,
    correct_answer: answer,
    problem_data: {
      operands,
      operator: '÷',
      format: pattern.format,
      hints,
      solution_steps: solutionSteps,
    },
    difficulty,
  };
}

/**
 * Generate operands that divide evenly
 */
function generateDivisionOperands(pattern: TemplatePattern): number[] {
  const ranges = pattern.operand_ranges;

  if (ranges.length >= 2) {
    // Divisor (second number)
    const divisor = randomInt(ranges[1].min, ranges[1].max);

    // Quotient range based on first operand range
    const minQuotient = Math.ceil(ranges[0].min / divisor);
    const maxQuotient = Math.floor(ranges[0].max / divisor);

    // Generate quotient
    const quotient = randomInt(Math.max(1, minQuotient), maxQuotient);

    // Dividend = divisor × quotient (ensures clean division)
    const dividend = divisor * quotient;

    return [dividend, divisor];
  }

  // Fallback: simple division
  const divisor = randomInt(2, 10);
  const quotient = randomInt(2, 12);
  return [divisor * quotient, divisor];
}

/**
 * Generate default solution steps for division
 */
function generateDefaultDivisionSteps(operands: number[], answer: number): string[] {
  const [dividend, divisor] = operands;

  // Simple division (small numbers)
  if (dividend <= 100 && divisor <= 10) {
    return [
      `We need to find ${dividend} ÷ ${divisor}`,
      `This means: how many groups of ${divisor} are in ${dividend}?`,
      `Think: ${divisor} × ? = ${dividend}`,
      `${divisor} × ${answer} = ${dividend}`,
      `So ${dividend} ÷ ${divisor} = ${answer}`,
    ];
  }

  // Larger division - use partial quotients
  if (dividend > 100) {
    const steps: string[] = [
      `Divide ${dividend} by ${divisor}`,
    ];

    let remaining = dividend;
    let quotientSoFar = 0;

    // Find easy multiples
    const easyMultiples = [100, 50, 20, 10, 5, 2, 1].filter(m => m * divisor <= remaining);

    for (const multiple of easyMultiples) {
      if (multiple * divisor <= remaining) {
        const product = multiple * divisor;
        steps.push(`${divisor} × ${multiple} = ${product}`);
        remaining -= product;
        quotientSoFar += multiple;

        if (remaining === 0) break;
        if (remaining < divisor) break;

        steps.push(`${dividend} - ${dividend - remaining} = ${remaining} remaining`);
      }
    }

    steps.push(`Total: ${quotientSoFar} groups`);
    steps.push(`So ${dividend} ÷ ${divisor} = ${answer}`);

    return steps;
  }

  return [
    `Divide ${dividend} by ${divisor}`,
    `The answer is ${answer}`,
  ];
}
