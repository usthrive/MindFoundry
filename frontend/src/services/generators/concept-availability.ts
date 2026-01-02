import type { KumonLevel } from './types'
import { LEVEL_ORDER } from './types'

export interface ConceptIntroduction {
  level: KumonLevel
  worksheet: number
}

export const CONCEPT_INTRODUCTION: Record<string, ConceptIntroduction> = {
  counting_to_5: { level: '7A', worksheet: 1 },
  counting_to_10: { level: '7A', worksheet: 31 },
  number_recognition_to_10: { level: '7A', worksheet: 101 },
  dot_pattern_recognition: { level: '7A', worksheet: 151 },

  counting_to_20: { level: '6A', worksheet: 171 },
  counting_to_30: { level: '6A', worksheet: 171 },
  number_reading_to_10: { level: '6A', worksheet: 101 },
  dot_recognition_to_10: { level: '6A', worksheet: 151 },

  number_reading_to_30: { level: '5A', worksheet: 1 },
  number_sequences: { level: '5A', worksheet: 101 },
  sequence_to_30: { level: '5A', worksheet: 101 },
  sequence_to_40: { level: '5A', worksheet: 131 },
  sequence_to_50: { level: '5A', worksheet: 161 },

  number_tracing: { level: '4A', worksheet: 1 },
  number_writing: { level: '4A', worksheet: 41 },
  number_writing_to_10: { level: '4A', worksheet: 41 },
  number_writing_to_20: { level: '4A', worksheet: 101 },
  number_writing_to_30: { level: '4A', worksheet: 121 },
  number_writing_to_50: { level: '4A', worksheet: 141 },

  sequence_to_100: { level: '3A', worksheet: 1 },
  sequence_to_120: { level: '3A', worksheet: 61 },
  addition_plus_1: { level: '3A', worksheet: 71 },
  addition_plus_2: { level: '3A', worksheet: 131 },
  addition_plus_3: { level: '3A', worksheet: 161 },
  addition_mixed_1_2_3: { level: '3A', worksheet: 181 },

  addition_plus_4: { level: '2A', worksheet: 11 },
  addition_plus_5: { level: '2A', worksheet: 31 },
  addition_plus_6: { level: '2A', worksheet: 71 },
  addition_plus_7: { level: '2A', worksheet: 91 },
  addition_plus_8: { level: '2A', worksheet: 131 },
  addition_plus_9: { level: '2A', worksheet: 151 },
  addition_plus_10: { level: '2A', worksheet: 161 },
  addition_up_to_10: { level: '2A', worksheet: 171 },

  addition_mastery: { level: 'A', worksheet: 1 },
  subtraction: { level: 'A', worksheet: 81 },
  subtraction_minus_1: { level: 'A', worksheet: 81 },
  subtraction_minus_2: { level: 'A', worksheet: 91 },
  subtraction_minus_3: { level: 'A', worksheet: 101 },
  subtraction_up_to_3: { level: 'A', worksheet: 111 },
  subtraction_up_to_5: { level: 'A', worksheet: 121 },
  subtraction_from_10: { level: 'A', worksheet: 131 },
  subtraction_from_20: { level: 'A', worksheet: 181 },

  vertical_format: { level: 'B', worksheet: 11 },
  vertical_addition: { level: 'B', worksheet: 11 },
  carrying: { level: 'B', worksheet: 41 },
  addition_2digit: { level: 'B', worksheet: 11 },
  addition_3digit: { level: 'B', worksheet: 71 },
  vertical_subtraction: { level: 'B', worksheet: 101 },
  borrowing: { level: 'B', worksheet: 121 },
  subtraction_2digit: { level: 'B', worksheet: 121 },
  subtraction_3digit: { level: 'B', worksheet: 161 },

  multiplication: { level: 'C', worksheet: 11 },
  times_table_2_3: { level: 'C', worksheet: 11 },
  times_table_4_5: { level: 'C', worksheet: 21 },
  times_table_6_7: { level: 'C', worksheet: 31 },
  times_table_8_9: { level: 'C', worksheet: 41 },
  multiplication_2digit_by_1digit: { level: 'C', worksheet: 51 },
  multiplication_3digit_by_1digit: { level: 'C', worksheet: 101 },
  division: { level: 'C', worksheet: 111 },
  division_with_remainder: { level: 'C', worksheet: 121 },
  division_2digit_by_1digit: { level: 'C', worksheet: 161 },
  division_3digit_by_1digit: { level: 'C', worksheet: 181 },

  multiplication_2digit_by_2digit: { level: 'D', worksheet: 11 },
  multiplication_3digit_by_2digit: { level: 'D', worksheet: 41 },
  long_division: { level: 'D', worksheet: 81 },
  long_division_by_2digit: { level: 'D', worksheet: 81 },
  fractions_intro: { level: 'D', worksheet: 131 },
  fraction_identification: { level: 'D', worksheet: 131 },
  equivalent_fractions: { level: 'D', worksheet: 141 },
  reducing_fractions: { level: 'D', worksheet: 161 },

  fraction_addition: { level: 'E', worksheet: 11 },
  fraction_add_same_denom: { level: 'E', worksheet: 11 },
  fraction_add_diff_denom: { level: 'E', worksheet: 51 },
  fraction_subtraction: { level: 'E', worksheet: 101 },
  fraction_multiply: { level: 'E', worksheet: 141 },
  fraction_divide: { level: 'E', worksheet: 161 },
  four_operations_fractions: { level: 'E', worksheet: 181 },

  three_fraction_operations: { level: 'F', worksheet: 21 },
  order_of_operations: { level: 'F', worksheet: 61 },
  order_of_operations_fractions: { level: 'F', worksheet: 61 },
  fraction_decimal_conversion: { level: 'F', worksheet: 131 },
  decimals: { level: 'F', worksheet: 181 },
  word_problems: { level: 'F', worksheet: 161 },

  negative_numbers: { level: 'G', worksheet: 21 },
  integer_addition: { level: 'G', worksheet: 21 },
  integer_subtraction: { level: 'G', worksheet: 21 },
  integer_multiplication: { level: 'G', worksheet: 61 },
  integer_division: { level: 'G', worksheet: 71 },
  algebraic_expressions: { level: 'G', worksheet: 101 },
  evaluating_expressions: { level: 'G', worksheet: 101 },
  simplifying_expressions: { level: 'G', worksheet: 121 },
  linear_equations: { level: 'G', worksheet: 161 },

  literal_equations: { level: 'H', worksheet: 21 },
  simultaneous_equations: { level: 'H', worksheet: 41 },
  system_2_variables: { level: 'H', worksheet: 41 },
  system_3_variables: { level: 'H', worksheet: 91 },
  system_4_variables: { level: 'H', worksheet: 101 },
  inequalities: { level: 'H', worksheet: 121 },
  functions: { level: 'H', worksheet: 141 },
  function_graphing: { level: 'H', worksheet: 141 },
  polynomials: { level: 'H', worksheet: 181 },

  polynomial_multiplication: { level: 'I', worksheet: 11 },
  foil: { level: 'I', worksheet: 11 },
  special_products: { level: 'I', worksheet: 21 },
  factoring: { level: 'I', worksheet: 31 },
  factor_gcf: { level: 'I', worksheet: 31 },
  factor_trinomial: { level: 'I', worksheet: 41 },
  factor_difference_squares: { level: 'I', worksheet: 61 },
  square_roots: { level: 'I', worksheet: 81 },
  radicals: { level: 'I', worksheet: 81 },
  quadratic_equations: { level: 'I', worksheet: 111 },
  quadratic_formula: { level: 'I', worksheet: 131 },
  quadratic_functions: { level: 'I', worksheet: 141 },
  parabolas: { level: 'I', worksheet: 141 },
  pythagorean_theorem: { level: 'I', worksheet: 171 },

  advanced_factoring: { level: 'J', worksheet: 11 },
  sum_difference_cubes: { level: 'J', worksheet: 31 },
  fractional_expressions: { level: 'J', worksheet: 61 },
  irrational_numbers: { level: 'J', worksheet: 71 },
  complex_numbers: { level: 'J', worksheet: 111 },
  discriminant: { level: 'J', worksheet: 121 },
  root_coefficient_relationships: { level: 'J', worksheet: 131 },
  polynomial_division: { level: 'J', worksheet: 151 },
  remainder_theorem: { level: 'J', worksheet: 161 },
  factor_theorem: { level: 'J', worksheet: 171 },
  proofs: { level: 'J', worksheet: 181 },

  quadratic_function_graphing: { level: 'K', worksheet: 21 },
  maxima_minima: { level: 'K', worksheet: 41 },
  quadratic_inequalities: { level: 'K', worksheet: 81 },
  higher_degree_functions: { level: 'K', worksheet: 101 },
  rational_functions: { level: 'K', worksheet: 121 },
  irrational_functions: { level: 'K', worksheet: 151 },
  exponential_functions: { level: 'K', worksheet: 171 },

  logarithms: { level: 'L', worksheet: 1 },
  log_equations: { level: 'L', worksheet: 21 },
  modulus_functions: { level: 'L', worksheet: 31 },
  limits: { level: 'L', worksheet: 41 },
  derivatives: { level: 'L', worksheet: 41 },
  tangent_lines: { level: 'L', worksheet: 51 },
  relative_extrema: { level: 'L', worksheet: 61 },
  absolute_extrema: { level: 'L', worksheet: 81 },
  optimization: { level: 'L', worksheet: 81 },
  integration: { level: 'L', worksheet: 111 },
  indefinite_integrals: { level: 'L', worksheet: 111 },
  definite_integrals: { level: 'L', worksheet: 121 },
  area_under_curve: { level: 'L', worksheet: 141 },
  volume_revolution: { level: 'L', worksheet: 161 },

  analytic_geometry: { level: 'M', worksheet: 1 },
  equation_of_line: { level: 'M', worksheet: 1 },
  equation_of_circle: { level: 'M', worksheet: 31 },
  locus: { level: 'M', worksheet: 51 },
  trigonometry: { level: 'M', worksheet: 81 },
  trig_ratios: { level: 'M', worksheet: 81 },
  trig_properties: { level: 'M', worksheet: 101 },
  trig_equations: { level: 'M', worksheet: 121 },
  trig_graphs: { level: 'M', worksheet: 131 },
  trig_inequalities: { level: 'M', worksheet: 141 },
  addition_formulas: { level: 'M', worksheet: 151 },
  double_angle_formulas: { level: 'M', worksheet: 161 },
  law_of_sines: { level: 'M', worksheet: 181 },
  law_of_cosines: { level: 'M', worksheet: 181 },
  area_triangle_trig: { level: 'M', worksheet: 191 },

  sequences: { level: 'N', worksheet: 1 },
  arithmetic_sequences: { level: 'N', worksheet: 1 },
  geometric_sequences: { level: 'N', worksheet: 11 },
  recurrence_relations: { level: 'N', worksheet: 41 },
  mathematical_induction: { level: 'N', worksheet: 51 },
  infinite_sequences: { level: 'N', worksheet: 61 },
  infinite_series: { level: 'N', worksheet: 81 },
  convergence: { level: 'N', worksheet: 91 },
  limit_of_functions: { level: 'N', worksheet: 101 },
  special_limits: { level: 'N', worksheet: 121 },
  continuity: { level: 'N', worksheet: 131 },
  trig_differentiation: { level: 'N', worksheet: 161 },
  log_differentiation: { level: 'N', worksheet: 171 },
  exponential_differentiation: { level: 'N', worksheet: 171 },
  higher_order_derivatives: { level: 'N', worksheet: 181 },

  curve_sketching: { level: 'O', worksheet: 1 },
  concavity: { level: 'O', worksheet: 21 },
  advanced_maxima_minima: { level: 'O', worksheet: 31 },
  integration_by_substitution: { level: 'O', worksheet: 71 },
  integration_by_parts: { level: 'O', worksheet: 81 },
  advanced_definite_integrals: { level: 'O', worksheet: 91 },
  area_between_curves: { level: 'O', worksheet: 131 },
  volume_disk_washer: { level: 'O', worksheet: 141 },
  volume_shell: { level: 'O', worksheet: 141 },
  arc_length: { level: 'O', worksheet: 151 },
  differential_equations: { level: 'O', worksheet: 161 },
  separable_de: { level: 'O', worksheet: 161 },
  first_order_linear_de: { level: 'O', worksheet: 171 },

  vectors_2d: { level: 'XV', worksheet: 1 },
  vectors_3d: { level: 'XV', worksheet: 41 },
  dot_product: { level: 'XV', worksheet: 61 },
  cross_product: { level: 'XV', worksheet: 71 },
  line_equations_3d: { level: 'XV', worksheet: 101 },
  plane_equations: { level: 'XV', worksheet: 111 },

  matrices: { level: 'XM', worksheet: 1 },
  matrix_multiplication: { level: 'XM', worksheet: 11 },
  matrix_inverse: { level: 'XM', worksheet: 21 },
  matrix_equations: { level: 'XM', worksheet: 31 },
  transformations: { level: 'XM', worksheet: 51 },

  permutations: { level: 'XP', worksheet: 1 },
  combinations: { level: 'XP', worksheet: 21 },
  binomial_theorem: { level: 'XP', worksheet: 41 },
  probability: { level: 'XP', worksheet: 51 },
  conditional_probability: { level: 'XP', worksheet: 61 },
  expected_value: { level: 'XP', worksheet: 81 },

  statistics_intro: { level: 'XS', worksheet: 1 },
  binomial_distribution: { level: 'XS', worksheet: 11 },
  probability_density: { level: 'XS', worksheet: 21 },
  normal_distribution: { level: 'XS', worksheet: 31 },
  sampling: { level: 'XS', worksheet: 51 },
  hypothesis_testing: { level: 'XS', worksheet: 61 },
}

export function isConceptAvailable(
  concept: string,
  currentLevel: KumonLevel,
  currentWorksheet: number
): boolean {
  const intro = CONCEPT_INTRODUCTION[concept]
  if (!intro) return false

  const currentIndex = LEVEL_ORDER.indexOf(currentLevel)
  const introIndex = LEVEL_ORDER.indexOf(intro.level)

  if (currentIndex > introIndex) return true
  if (currentIndex < introIndex) return false
  return currentWorksheet >= intro.worksheet
}

export function getAvailableConcepts(
  level: KumonLevel,
  worksheet: number
): string[] {
  const available: string[] = []
  for (const [concept] of Object.entries(CONCEPT_INTRODUCTION)) {
    if (isConceptAvailable(concept, level, worksheet)) {
      available.push(concept)
    }
  }
  return available
}

export function getConceptIntroduction(concept: string): ConceptIntroduction | undefined {
  return CONCEPT_INTRODUCTION[concept]
}

export function getNewConceptsAtWorksheet(
  level: KumonLevel,
  worksheet: number
): string[] {
  const newConcepts: string[] = []
  for (const [concept, intro] of Object.entries(CONCEPT_INTRODUCTION)) {
    if (intro.level === level && intro.worksheet === worksheet) {
      newConcepts.push(concept)
    }
  }
  return newConcepts
}
