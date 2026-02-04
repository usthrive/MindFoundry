/**
 * School Generator Utilities
 *
 * Shared utility functions for school problem generation.
 */

import type { OperandRange, WordProblemContext, TemplatePattern } from './types';
import { NAMES, ITEMS } from './types';

/**
 * Generate a random integer in range [min, max] inclusive
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate operand based on range configuration
 */
export function generateOperand(range: OperandRange): number {
  if (range.type === 'integer') {
    return randomInt(range.min, range.max);
  }

  if (range.type === 'decimal') {
    const value = Math.random() * (range.max - range.min) + range.min;
    return Math.round(value * 100) / 100; // 2 decimal places
  }

  // Fractions handled separately
  return randomInt(range.min, range.max);
}

/**
 * Generate operands for a problem based on template pattern
 */
export function generateOperands(pattern: TemplatePattern): number[] {
  return pattern.operand_ranges.map(range => generateOperand(range));
}

/**
 * Pick random element from array
 */
export function pickRandom<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Pick random operator from pattern
 */
export function pickOperator(pattern: TemplatePattern): string {
  return pickRandom(pattern.operators);
}

/**
 * Generate word problem context
 */
export function generateWordProblemContext(num1: number, num2: number, num3?: number): WordProblemContext {
  const name = pickRandom(NAMES);
  return {
    name,
    pronoun: 'they', // Gender-neutral
    num1,
    num2,
    num3,
    item: pickRandom(ITEMS),
    action: pickRandom(['bought', 'found', 'collected', 'received', 'picked']),
  };
}

/**
 * Fill word problem template with context
 */
export function fillWordProblemTemplate(template: string, context: WordProblemContext): string {
  return template
    .replace(/\{\{name\}\}/g, context.name)
    .replace(/\{\{pronoun\}\}/g, context.pronoun)
    .replace(/\{\{num1\}\}/g, String(context.num1))
    .replace(/\{\{num2\}\}/g, String(context.num2))
    .replace(/\{\{num3\}\}/g, String(context.num3 ?? ''))
    .replace(/\{\{item\}\}/g, context.item ?? 'items')
    .replace(/\{\{action\}\}/g, context.action ?? 'got');
}

/**
 * Generate hints from templates
 */
export function generateHints(
  hintTemplates: string[],
  operands: number[],
  operator: string
): string[] {
  if (!hintTemplates.length) {
    // Default hints
    return getDefaultHints(operator, operands);
  }

  return hintTemplates.map(template =>
    template
      .replace(/\{\{num1\}\}/g, String(operands[0]))
      .replace(/\{\{num2\}\}/g, String(operands[1] ?? ''))
      .replace(/\{\{operator\}\}/g, getOperatorWord(operator))
  );
}

/**
 * Get default hints based on operator
 */
function getDefaultHints(operator: string, operands: number[]): string[] {
  switch (operator) {
    case '+':
      return [
        `Start with ${operands[0]} and count up ${operands[1]}`,
        `Think about combining ${operands[0]} and ${operands[1]} together`,
      ];
    case '-':
      return [
        `Start with ${operands[0]} and count back ${operands[1]}`,
        `Think about taking ${operands[1]} away from ${operands[0]}`,
      ];
    case '*':
    case '×':
      return [
        `${operands[0]} groups of ${operands[1]}`,
        `Add ${operands[1]} to itself ${operands[0]} times`,
      ];
    case '/':
    case '÷':
      return [
        `How many groups of ${operands[1]} fit into ${operands[0]}?`,
        `Split ${operands[0]} into equal groups of ${operands[1]}`,
      ];
    default:
      return [`Think about what ${operator} means`];
  }
}

/**
 * Get word form of operator
 */
export function getOperatorWord(operator: string): string {
  switch (operator) {
    case '+': return 'addition';
    case '-': return 'subtraction';
    case '*':
    case '×': return 'multiplication';
    case '/':
    case '÷': return 'division';
    default: return operator;
  }
}

/**
 * Calculate answer based on operands and operator
 */
export function calculateAnswer(operands: number[], operator: string): number {
  const [a, b] = operands;

  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
    case '×':
      return a * b;
    case '/':
    case '÷':
      return a / b;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

/**
 * Format problem text based on format type
 */
export function formatProblemText(
  operands: number[],
  operator: string,
  format: 'horizontal' | 'vertical' | 'expression'
): string {
  const displayOp = operator === '*' ? '×' : operator === '/' ? '÷' : operator;

  if (format === 'horizontal') {
    return `${operands[0]} ${displayOp} ${operands[1]} = ___`;
  }

  if (format === 'vertical') {
    // Return in a format that can be displayed vertically
    return `  ${operands[0]}\n${displayOp} ${operands[1]}\n─────`;
  }

  // Expression format
  return `${operands[0]} ${displayOp} ${operands[1]}`;
}

/**
 * Ensure operands satisfy constraints
 */
export function applyConstraints(
  operands: number[],
  operator: string,
  constraints?: import('./types').GenerationConstraints
): number[] {
  if (!constraints) return operands;

  let [a, b] = operands;

  // No negative results for subtraction
  if (constraints.no_negative_results && operator === '-' && a < b) {
    [a, b] = [b, a]; // Swap to ensure positive result
  }

  return [a, b];
}
