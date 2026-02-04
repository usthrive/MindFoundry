/**
 * School Problem Generator
 *
 * Generates practice problems algorithmically based on templates.
 * NO LLM cost - uses predefined patterns and randomization.
 *
 * This follows the same pattern as the Kumon generators but for
 * school homework-style problems.
 */

import type {
  SchoolProblemTemplate,
  SchoolGeneratorConfig,
  GeneratedSchoolProblem,
} from './types';
import { generateAdditionProblem } from './addition';
import { generateSubtractionProblem } from './subtraction';
import { generateMultiplicationProblem } from './multiplication';
import { generateDivisionProblem } from './division';
import { generateFractionProblem } from './fractions';
import { generateWordProblem } from './word-problems';

export * from './types';

/**
 * Generate problems from a school template (ZERO LLM cost)
 *
 * @param config - Generation configuration including template
 * @returns Array of generated problems
 */
export function generateFromTemplate(config: SchoolGeneratorConfig): GeneratedSchoolProblem[] {
  const { template, difficulty, count = 1 } = config;
  const problems: GeneratedSchoolProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problem = generateSingleProblem(template, difficulty);
    problems.push(problem);
  }

  return problems;
}

/**
 * Generate a single problem based on template type
 */
function generateSingleProblem(
  template: SchoolProblemTemplate,
  difficulty?: number
): GeneratedSchoolProblem {
  const effectiveDifficulty = difficulty ?? template.difficulty_level;

  switch (template.problem_type) {
    case 'addition':
      return generateAdditionProblem(template, effectiveDifficulty);

    case 'subtraction':
      return generateSubtractionProblem(template, effectiveDifficulty);

    case 'multiplication':
      return generateMultiplicationProblem(template, effectiveDifficulty);

    case 'division':
      return generateDivisionProblem(template, effectiveDifficulty);

    case 'fractions':
      return generateFractionProblem(template, effectiveDifficulty);

    case 'word_problem':
      return generateWordProblem(template, effectiveDifficulty);

    case 'decimals':
      // Use addition/subtraction generators with decimal flag
      return generateAdditionProblem(template, effectiveDifficulty);

    case 'percentages':
      // Generate percentage problems (similar structure to multiplication)
      return generateMultiplicationProblem(template, effectiveDifficulty);

    case 'algebra':
      // Simple algebra - generate equation problems
      return generateAlgebraProblem(template, effectiveDifficulty);

    case 'geometry':
      // Basic geometry - area/perimeter
      return generateGeometryProblem(template, effectiveDifficulty);

    case 'order_of_operations':
      return generateOrderOfOperationsProblem(template, effectiveDifficulty);

    default:
      // Fallback to addition for unknown types
      console.warn(`Unknown problem type: ${template.problem_type}, falling back to addition`);
      return generateAdditionProblem(template, effectiveDifficulty);
  }
}

/**
 * Simple algebra problem generator
 */
function generateAlgebraProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const { generateId, randomInt } = require('./utils');

  // Generate a simple linear equation: ax + b = c
  const coeffMax = Math.min(10, 2 + difficulty * 2);
  const a = randomInt(1, coeffMax);
  const x = randomInt(1, 10); // The answer we're solving for
  const b = randomInt(0, 10 * difficulty);
  const c = a * x + b;

  const variable = template.template_pattern.variable_names?.[0] || 'x';

  return {
    id: generateId(),
    template_id: template.id,
    problem_text: b > 0 ? `${a}${variable} + ${b} = ${c}` : `${a}${variable} = ${c}`,
    correct_answer: x,
    problem_data: {
      operands: [a, b, c],
      operator: 'solve',
      format: 'expression',
      hints: [
        b > 0 ? `First, subtract ${b} from both sides` : `Divide both sides by ${a}`,
        `${variable} = ${c}${b > 0 ? ` - ${b}` : ''} ÷ ${a}`,
      ],
      solution_steps: [
        b > 0 ? `Subtract ${b} from both sides: ${a}${variable} = ${c - b}` : '',
        `Divide both sides by ${a}: ${variable} = ${x}`,
      ].filter(Boolean),
    },
    difficulty,
  };
}

/**
 * Basic geometry problem generator
 */
function generateGeometryProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const { generateId, randomInt, pickRandom } = require('./utils');

  const shapes = ['rectangle', 'square', 'triangle'];
  const shape = pickRandom(shapes);

  let problem_text: string;
  let answer: number;
  let hints: string[];
  let steps: string[];
  const operands: number[] = [];

  if (shape === 'square') {
    const side = randomInt(2, 5 + difficulty * 2);
    operands.push(side);

    const isArea = Math.random() > 0.5;
    if (isArea) {
      answer = side * side;
      problem_text = `Find the area of a square with side ${side} units.`;
      hints = [`Area of square = side × side`, `Area = ${side} × ${side}`];
      steps = [`Area = side × side`, `Area = ${side} × ${side} = ${answer} square units`];
    } else {
      answer = side * 4;
      problem_text = `Find the perimeter of a square with side ${side} units.`;
      hints = [`Perimeter of square = 4 × side`, `Perimeter = 4 × ${side}`];
      steps = [`Perimeter = 4 × side`, `Perimeter = 4 × ${side} = ${answer} units`];
    }
  } else if (shape === 'rectangle') {
    const length = randomInt(3, 6 + difficulty * 2);
    const width = randomInt(2, length - 1);
    operands.push(length, width);

    const isArea = Math.random() > 0.5;
    if (isArea) {
      answer = length * width;
      problem_text = `Find the area of a rectangle with length ${length} and width ${width} units.`;
      hints = [`Area = length × width`, `Area = ${length} × ${width}`];
      steps = [`Area = length × width`, `Area = ${length} × ${width} = ${answer} square units`];
    } else {
      answer = 2 * (length + width);
      problem_text = `Find the perimeter of a rectangle with length ${length} and width ${width} units.`;
      hints = [`Perimeter = 2 × (length + width)`, `Perimeter = 2 × (${length} + ${width})`];
      steps = [`Perimeter = 2 × (length + width)`, `= 2 × ${length + width} = ${answer} units`];
    }
  } else {
    // Triangle - just perimeter for simplicity
    const a = randomInt(3, 5 + difficulty);
    const b = randomInt(3, 5 + difficulty);
    const c = randomInt(Math.abs(a - b) + 1, a + b - 1); // Valid triangle
    operands.push(a, b, c);

    answer = a + b + c;
    problem_text = `Find the perimeter of a triangle with sides ${a}, ${b}, and ${c} units.`;
    hints = [`Add all three sides together`, `Perimeter = ${a} + ${b} + ${c}`];
    steps = [`Perimeter = side1 + side2 + side3`, `= ${a} + ${b} + ${c} = ${answer} units`];
  }

  return {
    id: generateId(),
    template_id: template.id,
    problem_text,
    correct_answer: answer,
    problem_data: {
      operands,
      operator: 'geometry',
      format: 'word_problem',
      hints,
      solution_steps: steps,
    },
    difficulty,
  };
}

/**
 * Order of operations problem generator
 */
function generateOrderOfOperationsProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const { generateId, randomInt } = require('./utils');

  // Generate expression based on difficulty
  let expression: string;
  let answer: number;
  let steps: string[];

  if (difficulty <= 2) {
    // Simple: a + b × c
    const a = randomInt(1, 10);
    const b = randomInt(2, 5);
    const c = randomInt(2, 5);
    expression = `${a} + ${b} × ${c}`;
    answer = a + b * c;
    steps = [
      `First, do multiplication: ${b} × ${c} = ${b * c}`,
      `Then, add: ${a} + ${b * c} = ${answer}`,
    ];
  } else if (difficulty <= 4) {
    // Medium: (a + b) × c
    const a = randomInt(2, 8);
    const b = randomInt(2, 8);
    const c = randomInt(2, 5);
    expression = `(${a} + ${b}) × ${c}`;
    answer = (a + b) * c;
    steps = [
      `First, do parentheses: ${a} + ${b} = ${a + b}`,
      `Then, multiply: ${a + b} × ${c} = ${answer}`,
    ];
  } else {
    // Hard: a + b × c - d
    const a = randomInt(5, 15);
    const b = randomInt(2, 4);
    const c = randomInt(2, 4);
    const d = randomInt(1, 5);
    expression = `${a} + ${b} × ${c} - ${d}`;
    answer = a + b * c - d;
    steps = [
      `First, do multiplication: ${b} × ${c} = ${b * c}`,
      `Then, add and subtract left to right:`,
      `${a} + ${b * c} = ${a + b * c}`,
      `${a + b * c} - ${d} = ${answer}`,
    ];
  }

  return {
    id: generateId(),
    template_id: template.id,
    problem_text: `Solve: ${expression} = ___`,
    correct_answer: answer,
    problem_data: {
      operands: [],
      operator: 'order_of_operations',
      format: 'expression',
      hints: [
        'Remember PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction',
        'Work from left to right for operations at the same level',
      ],
      solution_steps: steps,
    },
    difficulty,
  };
}

/**
 * Check if a template can generate valid problems
 */
export function validateTemplate(template: SchoolProblemTemplate): boolean {
  try {
    // Try to generate a problem
    const problem = generateSingleProblem(template, template.difficulty_level);
    return !!problem && !!problem.problem_text && problem.correct_answer !== undefined;
  } catch {
    return false;
  }
}
