/**
 * School Word Problems Generator
 *
 * Generates word problems using templates with variable substitution.
 * Templates come from the database, extracted by LLM from original problems.
 */

import type { SchoolProblemTemplate, GeneratedSchoolProblem, TemplatePattern } from './types';
import {
  generateId,
  randomInt,
  calculateAnswer,
} from './utils';

// Common names for word problems (child-friendly)
const NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Lucas', 'Sophia', 'Mason',
  'Isabella', 'Ethan', 'Mia', 'Aiden', 'Charlotte', 'Oliver', 'Amelia', 'Elijah',
  'Harper', 'James', 'Evelyn', 'Benjamin', 'Luna', 'Jack', 'Chloe', 'Henry',
];

// Common objects for word problems
const OBJECTS: Record<string, string[]> = {
  countable: [
    'apples', 'oranges', 'cookies', 'candies', 'stickers', 'marbles', 'pencils',
    'crayons', 'books', 'toys', 'balloons', 'flowers', 'stars', 'shells', 'rocks',
  ],
  money: ['dollars', 'cents', 'coins'],
  time: ['minutes', 'hours', 'days', 'weeks'],
  distance: ['miles', 'meters', 'feet', 'steps'],
};

// Action verbs by operation
const ACTIONS: Record<string, Record<string, string[]>> = {
  '+': {
    getting: ['found', 'got', 'received', 'picked up', 'collected', 'earned', 'bought'],
    giving: ['gave to', 'shared with', 'added to'],
  },
  '-': {
    losing: ['lost', 'gave away', 'ate', 'used', 'spent', 'broke'],
    taking: ['took', 'removed', 'dropped'],
  },
  '*': {
    groups: ['bags with', 'boxes with', 'packs of', 'groups of', 'rows of'],
  },
  '/': {
    sharing: ['shared equally among', 'divided between', 'split among', 'gave equally to'],
    grouping: ['put into groups of', 'packed into bags of'],
  },
};

/**
 * Generate a word problem from template
 */
export function generateWordProblem(
  template: SchoolProblemTemplate,
  difficulty: number
): GeneratedSchoolProblem {
  const pattern = template.template_pattern;
  const operator = pattern.operators?.[0] || '+';

  // Check if template has a word problem template string
  if (pattern.word_problem_template) {
    return generateFromTemplateString(template, pattern, operator, difficulty);
  }

  // Otherwise, generate a generic word problem
  return generateGenericWordProblem(template, pattern, operator, difficulty);
}

/**
 * Generate word problem from a template string with placeholders
 */
function generateFromTemplateString(
  template: SchoolProblemTemplate,
  pattern: TemplatePattern,
  operator: string,
  difficulty: number
): GeneratedSchoolProblem {
  const ranges = pattern.operand_ranges;

  // Generate operands
  const operands: number[] = ranges.map(range => randomInt(range.min, range.max));

  // Calculate answer based on operator
  const answer = calculateAnswer(operands, operator);

  // Generate random values for placeholders
  const name = NAMES[randomInt(0, NAMES.length - 1)];
  const object = OBJECTS.countable[randomInt(0, OBJECTS.countable.length - 1)];

  // Replace placeholders in template
  let problemText = pattern.word_problem_template!
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{name1\}\}/g, name)
    .replace(/\{\{name2\}\}/g, NAMES[(NAMES.indexOf(name) + 1) % NAMES.length])
    .replace(/\{\{object\}\}/g, object)
    .replace(/\{\{num1\}\}/g, String(operands[0]))
    .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
    .replace(/\{\{num3\}\}/g, String(operands[2] ?? ''))
    .replace(/\{\{answer\}\}/g, String(answer));

  // Generate hints
  const hints = template.hint_templates.length > 0
    ? template.hint_templates.map(hint =>
        hint
          .replace(/\{\{num1\}\}/g, String(operands[0]))
          .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
          .replace(/\{\{answer\}\}/g, String(answer))
      )
    : generateWordProblemHints(operator, operands);

  // Generate solution steps
  const solutionSteps = template.solution_step_templates.length > 0
    ? template.solution_step_templates.map(step =>
        step
          .replace(/\{\{num1\}\}/g, String(operands[0]))
          .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
          .replace(/\{\{answer\}\}/g, String(answer))
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{object\}\}/g, object)
      )
    : generateDefaultWordProblemSteps(operands, operator, answer, name, object);

  return {
    id: generateId(),
    template_id: template.id,
    problem_text: problemText,
    correct_answer: answer,
    problem_data: {
      operands,
      operator,
      format: 'word',
      hints,
      solution_steps: solutionSteps,
      word_problem_context: { name, object },
    },
    difficulty,
  };
}

/**
 * Generate a generic word problem when no template string is available
 */
function generateGenericWordProblem(
  template: SchoolProblemTemplate,
  pattern: TemplatePattern,
  operator: string,
  difficulty: number
): GeneratedSchoolProblem {
  const ranges = pattern.operand_ranges;
  const operands: number[] = ranges.map(range => randomInt(range.min, range.max));

  // For subtraction, ensure first number is larger
  if (operator === '-' && operands.length >= 2 && operands[0] < operands[1]) {
    [operands[0], operands[1]] = [operands[1], operands[0]];
  }

  // For division, ensure clean division
  if (operator === '/' && operands.length >= 2) {
    const divisor = operands[1];
    const quotient = randomInt(2, 12);
    operands[0] = divisor * quotient;
  }

  const answer = calculateAnswer(operands, operator);
  const name = NAMES[randomInt(0, NAMES.length - 1)];
  const object = OBJECTS.countable[randomInt(0, OBJECTS.countable.length - 1)];

  // Generate problem text based on operator
  const problemText = generateGenericProblemText(operands, operator, name, object);

  // Generate hints and steps
  const hints = generateWordProblemHints(operator, operands);
  const solutionSteps = generateDefaultWordProblemSteps(operands, operator, answer, name, object);

  return {
    id: generateId(),
    template_id: template.id,
    problem_text: problemText,
    correct_answer: answer,
    problem_data: {
      operands,
      operator,
      format: 'word',
      hints,
      solution_steps: solutionSteps,
      word_problem_context: { name, object },
    },
    difficulty,
  };
}

/**
 * Generate problem text for generic word problems
 */
function generateGenericProblemText(
  operands: number[],
  operator: string,
  name: string,
  object: string
): string {
  const [a, b] = operands;
  const actions = ACTIONS[operator];

  switch (operator) {
    case '+': {
      const action = actions.getting[randomInt(0, actions.getting.length - 1)];
      return `${name} had ${a} ${object}. Then ${name} ${action} ${b} more ${object}. How many ${object} does ${name} have now?`;
    }
    case '-': {
      const action = actions.losing[randomInt(0, actions.losing.length - 1)];
      return `${name} had ${a} ${object}. ${name} ${action} ${b} of them. How many ${object} does ${name} have left?`;
    }
    case '*': {
      const container = actions.groups[randomInt(0, actions.groups.length - 1)];
      return `${name} has ${a} ${container} ${b} ${object} each. How many ${object} does ${name} have in total?`;
    }
    case '/': {
      const action = actions.sharing[randomInt(0, actions.sharing.length - 1)];
      return `${name} has ${a} ${object} and wants to ${action} ${b} friends equally. How many ${object} will each friend get?`;
    }
    default:
      return `${name} has ${a} ${object}. What is ${a} ${operator} ${b}?`;
  }
}

/**
 * Generate hints for word problems
 */
function generateWordProblemHints(operator: string, operands: number[]): string[] {
  const [a, b] = operands;

  switch (operator) {
    case '+':
      return [
        'This is an addition problem - you need to find the total',
        `You\'re combining ${a} and ${b}`,
        'Add the two numbers together',
      ];
    case '-':
      return [
        'This is a subtraction problem - something is being taken away',
        `Start with ${a} and take away ${b}`,
        'Subtract to find how many are left',
      ];
    case '*':
      return [
        'This is a multiplication problem - you have equal groups',
        `You have ${a} groups of ${b}`,
        'Multiply to find the total',
      ];
    case '/':
      return [
        'This is a division problem - sharing equally',
        `You\'re splitting ${a} into ${b} equal parts`,
        'Divide to find how many in each group',
      ];
    default:
      return ['Read the problem carefully', 'Look for keywords', 'Identify the operation needed'];
  }
}

/**
 * Generate default solution steps for word problems
 */
function generateDefaultWordProblemSteps(
  operands: number[],
  operator: string,
  answer: number | string,
  name: string,
  object: string
): string[] {
  const [a, b] = operands;

  switch (operator) {
    case '+':
      return [
        `${name} starts with ${a} ${object}`,
        `${name} gets ${b} more ${object}`,
        'To find the total, we add: ' + `${a} + ${b}`,
        `${a} + ${b} = ${answer}`,
        `${name} now has ${answer} ${object}`,
      ];
    case '-':
      return [
        `${name} starts with ${a} ${object}`,
        `${name} loses/gives away ${b} ${object}`,
        'To find how many are left, we subtract: ' + `${a} - ${b}`,
        `${a} - ${b} = ${answer}`,
        `${name} has ${answer} ${object} left`,
      ];
    case '*':
      return [
        `${name} has ${a} groups`,
        `Each group has ${b} ${object}`,
        'To find the total, we multiply: ' + `${a} × ${b}`,
        `${a} × ${b} = ${answer}`,
        `${name} has ${answer} ${object} in total`,
      ];
    case '/':
      return [
        `${name} has ${a} ${object} to share`,
        `${name} shares with ${b} friends`,
        'To find how many each gets, we divide: ' + `${a} ÷ ${b}`,
        `${a} ÷ ${b} = ${answer}`,
        `Each friend gets ${answer} ${object}`,
      ];
    default:
      return [
        `Start with ${a}`,
        `Use operation ${operator} with ${b}`,
        `The answer is ${answer}`,
      ];
  }
}
