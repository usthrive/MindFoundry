/**
 * School Problem Generator Types
 *
 * Type definitions for the algorithmic school problem generator.
 * These types mirror the database schema and support template-based generation.
 */

import type { HomeworkProblemType } from '../../../types/homework';

/**
 * Operand range configuration
 */
export interface OperandRange {
  min: number;
  max: number;
  type: 'integer' | 'decimal' | 'fraction';
  position?: number;
  // For fractions
  numeratorMin?: number;
  numeratorMax?: number;
  denominatorMin?: number;
  denominatorMax?: number;
}

/**
 * Constraints for problem generation
 */
export interface GenerationConstraints {
  no_negative_results?: boolean;
  max_digits_in_answer?: number;
  requires_carrying?: boolean;
  requires_borrowing?: boolean;
  denominator_range?: { min: number; max: number };
  // For algebra
  variable_coefficient_max?: number;
  constant_max?: number;
  // For word problems
  max_steps?: number;
}

/**
 * Template pattern stored in database
 */
export interface TemplatePattern {
  format: 'horizontal' | 'vertical' | 'word_problem' | 'expression';
  operand_ranges: OperandRange[];
  operators: string[];
  constraints?: GenerationConstraints;
  word_problem_templates?: string[];
  variable_names?: string[];
}

/**
 * Full problem template from database
 */
export interface SchoolProblemTemplate {
  id: string;
  child_id: string | null;
  problem_type: HomeworkProblemType;
  subtype: string | null;
  grade_level: string;
  template_pattern: TemplatePattern;
  difficulty_level: number;
  hint_templates: string[];
  solution_step_templates: string[];
  source_problem_text: string | null;
  times_used: number;
  success_rate: number | null;
  created_at: string;
}

/**
 * Generated problem structure
 */
export interface GeneratedSchoolProblem {
  id: string;
  template_id: string;
  problem_text: string;
  correct_answer: string | number;
  problem_data: {
    operands: number[];
    operator: string;
    format: string;
    hints: string[];
    solution_steps: string[];
  };
  difficulty: number;
}

/**
 * Configuration for generating problems
 */
export interface SchoolGeneratorConfig {
  template: SchoolProblemTemplate;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  count?: number;
}

/**
 * Word problem context for templating
 */
export interface WordProblemContext {
  name: string;
  pronoun: string;
  num1: number;
  num2: number;
  num3?: number;
  item?: string;
  action?: string;
}

/**
 * Common names for word problems
 */
export const NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn'];

/**
 * Common items for word problems
 */
export const ITEMS = [
  'apples', 'oranges', 'cookies', 'stickers', 'marbles',
  'pencils', 'books', 'toys', 'candies', 'flowers'
];
