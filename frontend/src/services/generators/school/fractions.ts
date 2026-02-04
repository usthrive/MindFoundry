/**
 * School Fractions Problem Generator
 */

import type { SchoolProblemTemplate, GeneratedSchoolProblem, TemplatePattern } from './types';
import {
  generateId,
  randomInt,
} from './utils';

interface Fraction {
  numerator: number;
  denominator: number;
}

/**
 * Generate a fractions problem from template
 */
export function generateFractionsProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const pattern = template.template_pattern;
  const operator = pattern.operators?.[0] || '+';

  // Generate fractions based on subtype
  const { fractions, answer, problemText, steps } = generateFractionProblem(pattern, operator);

  // Generate hints
  const hints = template.hint_templates.length > 0
    ? template.hint_templates.map(hint =>
        hint
          .replace(/\{\{num1\}\}/g, formatFraction(fractions[0]))
          .replace(/\{\{num2\}\}/g, fractions[1] ? formatFraction(fractions[1]) : '')
          .replace(/\{\{answer\}\}/g, answer)
      )
    : generateDefaultFractionHints(fractions, operator);

  // Generate solution steps
  const solutionSteps = template.solution_step_templates.length > 0
    ? template.solution_step_templates.map(step =>
        step
          .replace(/\{\{num1\}\}/g, formatFraction(fractions[0]))
          .replace(/\{\{num2\}\}/g, fractions[1] ? formatFraction(fractions[1]) : '')
          .replace(/\{\{answer\}\}/g, answer)
      )
    : steps;

  return {
    id: generateId(),
    template_id: template.id,
    problem_text: problemText,
    correct_answer: answer,
    problem_data: {
      operands: fractions.map(f => f.numerator / f.denominator),
      operator,
      format: pattern.format,
      hints,
      solution_steps: solutionSteps,
      fractions, // Store original fractions for reference
    },
    difficulty,
  };
}

/**
 * Generate a specific fraction problem
 */
function generateFractionProblem(
  pattern: TemplatePattern,
  operator: string
): {
  fractions: Fraction[];
  answer: string;
  problemText: string;
  steps: string[];
} {
  const constraints = pattern.constraints || {};
  const sameDenominator = constraints.same_denominator;
  const commonDenominators = constraints.common_denominators || [2, 3, 4, 5, 6, 8, 10, 12];

  let fractions: Fraction[];
  let answer: string;
  let problemText: string;
  let steps: string[];

  switch (operator) {
    case '+':
      if (sameDenominator) {
        fractions = generateSameDenominatorFractions(commonDenominators);
        const result = addFractions(fractions[0], fractions[1]);
        answer = formatFraction(result);
        problemText = `${formatFraction(fractions[0])} + ${formatFraction(fractions[1])} = ?`;
        steps = generateAdditionStepsSameDenom(fractions, result);
      } else {
        fractions = generateDifferentDenominatorFractions(commonDenominators);
        const result = addFractions(fractions[0], fractions[1]);
        answer = formatFraction(result);
        problemText = `${formatFraction(fractions[0])} + ${formatFraction(fractions[1])} = ?`;
        steps = generateAdditionStepsDiffDenom(fractions, result);
      }
      break;

    case '-':
      if (sameDenominator) {
        fractions = generateSameDenominatorFractions(commonDenominators);
        // Ensure first fraction is larger
        if (fractions[0].numerator < fractions[1].numerator) {
          [fractions[0], fractions[1]] = [fractions[1], fractions[0]];
        }
        const result = subtractFractions(fractions[0], fractions[1]);
        answer = formatFraction(result);
        problemText = `${formatFraction(fractions[0])} - ${formatFraction(fractions[1])} = ?`;
        steps = generateSubtractionStepsSameDenom(fractions, result);
      } else {
        fractions = generateDifferentDenominatorFractions(commonDenominators);
        // Ensure first fraction is larger (by value)
        if (fractions[0].numerator / fractions[0].denominator <
            fractions[1].numerator / fractions[1].denominator) {
          [fractions[0], fractions[1]] = [fractions[1], fractions[0]];
        }
        const result = subtractFractions(fractions[0], fractions[1]);
        answer = formatFraction(result);
        problemText = `${formatFraction(fractions[0])} - ${formatFraction(fractions[1])} = ?`;
        steps = generateSubtractionStepsDiffDenom(fractions, result);
      }
      break;

    case '*':
      fractions = generateMultiplicationFractions(commonDenominators);
      const multResult = multiplyFractions(fractions[0], fractions[1]);
      answer = formatFraction(multResult);
      problemText = `${formatFraction(fractions[0])} × ${formatFraction(fractions[1])} = ?`;
      steps = generateMultiplicationSteps(fractions, multResult);
      break;

    case '/':
      fractions = generateDivisionFractions(commonDenominators);
      const divResult = divideFractions(fractions[0], fractions[1]);
      answer = formatFraction(divResult);
      problemText = `${formatFraction(fractions[0])} ÷ ${formatFraction(fractions[1])} = ?`;
      steps = generateDivisionSteps(fractions, divResult);
      break;

    default:
      // Simplification problem
      const unsimplified = generateUnsimplifiedFraction();
      fractions = [unsimplified];
      const simplified = simplifyFraction(unsimplified);
      answer = formatFraction(simplified);
      problemText = `Simplify: ${formatFraction(unsimplified)}`;
      steps = generateSimplificationSteps(unsimplified, simplified);
  }

  return { fractions, answer, problemText, steps };
}

// Helper functions for fraction generation

function generateSameDenominatorFractions(denoms: number[]): Fraction[] {
  const denom = denoms[randomInt(0, denoms.length - 1)];
  return [
    { numerator: randomInt(1, denom - 1), denominator: denom },
    { numerator: randomInt(1, denom - 1), denominator: denom },
  ];
}

function generateDifferentDenominatorFractions(denoms: number[]): Fraction[] {
  const denom1 = denoms[randomInt(0, denoms.length - 1)];
  let denom2 = denoms[randomInt(0, denoms.length - 1)];
  while (denom2 === denom1) {
    denom2 = denoms[randomInt(0, denoms.length - 1)];
  }
  return [
    { numerator: randomInt(1, denom1 - 1), denominator: denom1 },
    { numerator: randomInt(1, denom2 - 1), denominator: denom2 },
  ];
}

function generateMultiplicationFractions(denoms: number[]): Fraction[] {
  // Keep numbers small for multiplication
  return [
    { numerator: randomInt(1, 5), denominator: randomInt(2, 6) },
    { numerator: randomInt(1, 5), denominator: randomInt(2, 6) },
  ];
}

function generateDivisionFractions(denoms: number[]): Fraction[] {
  return [
    { numerator: randomInt(1, 6), denominator: randomInt(2, 6) },
    { numerator: randomInt(1, 4), denominator: randomInt(2, 5) },
  ];
}

function generateUnsimplifiedFraction(): Fraction {
  const simplified = { numerator: randomInt(1, 5), denominator: randomInt(2, 8) };
  const multiplier = randomInt(2, 4);
  return {
    numerator: simplified.numerator * multiplier,
    denominator: simplified.denominator * multiplier,
  };
}

// Fraction operations

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplifyFraction(f: Fraction): Fraction {
  const divisor = gcd(f.numerator, f.denominator);
  return {
    numerator: f.numerator / divisor,
    denominator: f.denominator / divisor,
  };
}

function addFractions(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const newNum = (a.numerator * (commonDenom / a.denominator)) +
                  (b.numerator * (commonDenom / b.denominator));
  return simplifyFraction({ numerator: newNum, denominator: commonDenom });
}

function subtractFractions(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const newNum = (a.numerator * (commonDenom / a.denominator)) -
                  (b.numerator * (commonDenom / b.denominator));
  return simplifyFraction({ numerator: newNum, denominator: commonDenom });
}

function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
}

function divideFractions(a: Fraction, b: Fraction): Fraction {
  return multiplyFractions(a, { numerator: b.denominator, denominator: b.numerator });
}

function formatFraction(f: Fraction): string {
  if (f.denominator === 1) return String(f.numerator);
  if (f.numerator > f.denominator) {
    const whole = Math.floor(f.numerator / f.denominator);
    const remainder = f.numerator % f.denominator;
    if (remainder === 0) return String(whole);
    return `${whole} ${remainder}/${f.denominator}`;
  }
  return `${f.numerator}/${f.denominator}`;
}

// Step generation functions

function generateAdditionStepsSameDenom(fractions: Fraction[], result: Fraction): string[] {
  const [a, b] = fractions;
  return [
    `Both fractions have the same denominator: ${a.denominator}`,
    `Add the numerators: ${a.numerator} + ${b.numerator} = ${a.numerator + b.numerator}`,
    `Keep the denominator: ${a.denominator}`,
    `Result: ${a.numerator + b.numerator}/${a.denominator}`,
    result.numerator !== a.numerator + b.numerator
      ? `Simplify: ${formatFraction(result)}`
      : `Answer: ${formatFraction(result)}`,
  ].filter(Boolean);
}

function generateAdditionStepsDiffDenom(fractions: Fraction[], result: Fraction): string[] {
  const [a, b] = fractions;
  const commonDenom = lcm(a.denominator, b.denominator);
  const newA = a.numerator * (commonDenom / a.denominator);
  const newB = b.numerator * (commonDenom / b.denominator);

  return [
    `Find a common denominator for ${a.denominator} and ${b.denominator}`,
    `Common denominator: ${commonDenom}`,
    `Convert ${formatFraction(a)}: multiply by ${commonDenom / a.denominator}/${commonDenom / a.denominator} = ${newA}/${commonDenom}`,
    `Convert ${formatFraction(b)}: multiply by ${commonDenom / b.denominator}/${commonDenom / b.denominator} = ${newB}/${commonDenom}`,
    `Add numerators: ${newA} + ${newB} = ${newA + newB}`,
    `Result: ${newA + newB}/${commonDenom}`,
    `Simplified answer: ${formatFraction(result)}`,
  ];
}

function generateSubtractionStepsSameDenom(fractions: Fraction[], result: Fraction): string[] {
  const [a, b] = fractions;
  return [
    `Both fractions have the same denominator: ${a.denominator}`,
    `Subtract the numerators: ${a.numerator} - ${b.numerator} = ${a.numerator - b.numerator}`,
    `Keep the denominator: ${a.denominator}`,
    `Answer: ${formatFraction(result)}`,
  ];
}

function generateSubtractionStepsDiffDenom(fractions: Fraction[], result: Fraction): string[] {
  const [a, b] = fractions;
  const commonDenom = lcm(a.denominator, b.denominator);
  const newA = a.numerator * (commonDenom / a.denominator);
  const newB = b.numerator * (commonDenom / b.denominator);

  return [
    `Find a common denominator for ${a.denominator} and ${b.denominator}`,
    `Common denominator: ${commonDenom}`,
    `Convert ${formatFraction(a)} to ${newA}/${commonDenom}`,
    `Convert ${formatFraction(b)} to ${newB}/${commonDenom}`,
    `Subtract numerators: ${newA} - ${newB} = ${newA - newB}`,
    `Answer: ${formatFraction(result)}`,
  ];
}

function generateMultiplicationSteps(fractions: Fraction[], result: Fraction): string[] {
  const [a, b] = fractions;
  return [
    `Multiply the numerators: ${a.numerator} × ${b.numerator} = ${a.numerator * b.numerator}`,
    `Multiply the denominators: ${a.denominator} × ${b.denominator} = ${a.denominator * b.denominator}`,
    `Result: ${a.numerator * b.numerator}/${a.denominator * b.denominator}`,
    `Simplified answer: ${formatFraction(result)}`,
  ];
}

function generateDivisionSteps(fractions: Fraction[], result: Fraction): string[] {
  const [a, b] = fractions;
  return [
    `To divide fractions, multiply by the reciprocal`,
    `Flip the second fraction: ${formatFraction(b)} becomes ${b.denominator}/${b.numerator}`,
    `Now multiply: ${formatFraction(a)} × ${b.denominator}/${b.numerator}`,
    `Numerators: ${a.numerator} × ${b.denominator} = ${a.numerator * b.denominator}`,
    `Denominators: ${a.denominator} × ${b.numerator} = ${a.denominator * b.numerator}`,
    `Answer: ${formatFraction(result)}`,
  ];
}

function generateSimplificationSteps(original: Fraction, simplified: Fraction): string[] {
  const divisor = gcd(original.numerator, original.denominator);
  return [
    `Find the GCD of ${original.numerator} and ${original.denominator}`,
    `GCD = ${divisor}`,
    `Divide both by ${divisor}:`,
    `${original.numerator} ÷ ${divisor} = ${simplified.numerator}`,
    `${original.denominator} ÷ ${divisor} = ${simplified.denominator}`,
    `Simplified: ${formatFraction(simplified)}`,
  ];
}

function generateDefaultFractionHints(fractions: Fraction[], operator: string): string[] {
  switch (operator) {
    case '+':
    case '-':
      return [
        'Check if the denominators are the same',
        'If not, find a common denominator first',
        `Remember: only ${operator === '+' ? 'add' : 'subtract'} the numerators`,
      ];
    case '*':
      return [
        'Multiply numerator by numerator',
        'Multiply denominator by denominator',
        'Simplify if possible',
      ];
    case '/':
      return [
        'To divide fractions, multiply by the reciprocal',
        'Flip the second fraction',
        'Then multiply as normal',
      ];
    default:
      return [
        'Find the greatest common divisor (GCD)',
        'Divide both numerator and denominator by the GCD',
      ];
  }
}
