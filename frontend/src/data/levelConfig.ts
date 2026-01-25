import type { KumonLevel } from '@/types'

export interface WorksheetRange {
  start: number
  end: number
  type: string
  description: string
}

export interface LevelConfig {
  level: KumonLevel
  name: string
  description: string
  gradeRange: string
  category: 'pre-k' | 'elementary-basic' | 'elementary-advanced' | 'middle-school' | 'high-school' | 'calculus' | 'elective'
  sct: string
  worksheetRanges: WorksheetRange[]
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  // PRE-K LEVELS
  {
    level: '7A',
    name: 'Level 7A',
    description: 'Early Counting',
    gradeRange: 'Pre-K (Age 3-4)',
    category: 'pre-k',
    sct: 'Not timed',
    worksheetRanges: [
      { start: 1, end: 30, type: 'count_pictures_to_5', description: 'Count pictures (max 5)' },
      { start: 31, end: 100, type: 'count_pictures_to_10', description: 'Count pictures and dots (max 10)' },
      { start: 101, end: 150, type: 'match_quantity_to_numeral', description: 'Match quantity to number' },
      { start: 151, end: 200, type: 'dot_pattern_recognition', description: 'Subitizing/dot patterns' },
    ],
  },
  {
    level: '6A',
    name: 'Level 6A',
    description: 'Number Recognition',
    gradeRange: 'Pre-K (Age 4-5)',
    category: 'pre-k',
    sct: 'Not timed',
    worksheetRanges: [
      { start: 1, end: 30, type: 'count_to_5', description: 'Counting up to 5' },
      { start: 31, end: 100, type: 'count_to_10', description: 'Counting up to 10' },
      { start: 101, end: 150, type: 'number_reading_to_10', description: 'Number reading (1-10)' },
      { start: 151, end: 200, type: 'dot_recognition_to_10', description: 'Dot recognition (1-10)' },
    ],
  },
  {
    level: '5A',
    name: 'Level 5A',
    description: 'Number Sequences',
    gradeRange: 'Pre-K (Age 4-5)',
    category: 'pre-k',
    sct: 'Not timed',
    worksheetRanges: [
      { start: 1, end: 100, type: 'number_reading_to_30', description: 'Number reading (up to 30)' },
      { start: 101, end: 130, type: 'sequence_to_30', description: 'Number sequences (up to 30)' },
      { start: 131, end: 160, type: 'sequence_to_40', description: 'Number sequences (up to 40)' },
      { start: 161, end: 190, type: 'sequence_to_50', description: 'Number sequences (up to 50)' },
      { start: 191, end: 200, type: 'number_before_after', description: 'Number before/after (to 100)' },
    ],
  },
  {
    level: '4A',
    name: 'Level 4A',
    description: 'Number Writing',
    gradeRange: 'Pre-K/K (Age 5)',
    category: 'pre-k',
    sct: '2 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'trace_number_1_to_10', description: 'Number tracing (1-10)' },
      { start: 41, end: 100, type: 'write_number_1_to_10', description: 'Number writing (1-10)' },
      { start: 101, end: 120, type: 'write_number_1_to_20', description: 'Number writing (1-20)' },
      { start: 121, end: 140, type: 'write_number_1_to_30', description: 'Number writing (1-30)' },
      { start: 141, end: 200, type: 'write_number_1_to_50', description: 'Number writing (1-50)' },
    ],
  },

  // ELEMENTARY BASIC
  {
    level: '3A',
    name: 'Level 3A',
    description: 'Early Addition',
    gradeRange: 'K-1st',
    category: 'elementary-basic',
    sct: '8 min',
    worksheetRanges: [
      { start: 1, end: 60, type: 'sequence_to_100', description: 'Number sequence to 100' },
      { start: 61, end: 70, type: 'sequence_to_120', description: 'Number sequence to 120' },
      { start: 71, end: 90, type: 'add_1', description: 'Adding +1' },
      { start: 91, end: 130, type: 'add_1_large', description: 'Adding +1 (larger numbers)' },
      { start: 131, end: 160, type: 'add_2', description: 'Adding +2' },
      { start: 161, end: 180, type: 'add_3', description: 'Adding +3' },
      { start: 181, end: 200, type: 'add_mixed_1_2_3', description: 'Mixed +1, +2, +3' },
    ],
  },
  {
    level: '2A',
    name: 'Level 2A',
    description: 'Single-Digit Addition',
    gradeRange: '1st',
    category: 'elementary-basic',
    sct: '8 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'add_review_1_2_3', description: 'Review: +1, +2, +3' },
      { start: 11, end: 30, type: 'add_4', description: 'Adding +4' },
      { start: 31, end: 50, type: 'add_5', description: 'Adding +5' },
      { start: 51, end: 70, type: 'add_up_to_5', description: 'Adding +1 to +5 (mixed)' },
      { start: 71, end: 90, type: 'add_6', description: 'Adding +6' },
      { start: 91, end: 110, type: 'add_7', description: 'Adding +7' },
      { start: 111, end: 130, type: 'add_up_to_7', description: 'Adding +1 to +7 (mixed)' },
      { start: 131, end: 150, type: 'add_8', description: 'Adding +8' },
      { start: 151, end: 160, type: 'add_9', description: 'Adding +9' },
      { start: 161, end: 170, type: 'add_10', description: 'Adding +10' },
      { start: 171, end: 200, type: 'add_up_to_10', description: 'Adding +1 to +10 (mixed)' },
    ],
  },
  {
    level: 'A',
    name: 'Level A',
    description: 'Addition & Subtraction Basics',
    gradeRange: '1st-2nd',
    category: 'elementary-basic',
    sct: '8 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'addition_sums_to_12', description: 'Addition (sums to 12)' },
      { start: 21, end: 40, type: 'addition_sums_to_18', description: 'Addition (sums to 18)' },
      { start: 41, end: 60, type: 'addition_sums_to_24', description: 'Addition (sums to 24)' },
      { start: 61, end: 80, type: 'addition_summary', description: 'Addition summary' },
      { start: 81, end: 110, type: 'subtract_1_to_3', description: 'Subtracting -1, -2, -3' },
      { start: 111, end: 140, type: 'subtract_up_to_5', description: 'Subtracting -1 to -5' },
      { start: 141, end: 170, type: 'subtract_from_10_to_16', description: 'Subtract from 10-16' },
      { start: 171, end: 190, type: 'subtract_from_20', description: 'Subtract from 20' },
      { start: 191, end: 200, type: 'subtraction_summary', description: 'Subtraction summary' },
    ],
  },
  {
    level: 'B',
    name: 'Level B',
    description: 'Multi-Digit Add/Subtract',
    gradeRange: '2nd',
    category: 'elementary-basic',
    sct: '6 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'addition_review', description: 'Addition review' },
      { start: 11, end: 40, type: 'vertical_addition_2digit_no_carry', description: '2-digit addition (no carry)' },
      { start: 41, end: 70, type: 'vertical_addition_2digit_with_carry', description: '2-digit addition (with carry)' },
      { start: 71, end: 100, type: 'vertical_addition_3digit', description: '3-digit addition' },
      { start: 101, end: 120, type: 'subtraction_review', description: 'Subtraction review' },
      { start: 121, end: 150, type: 'vertical_subtraction_2digit_no_borrow', description: '2-digit subtraction (no borrow)' },
      { start: 151, end: 180, type: 'vertical_subtraction_2digit_with_borrow', description: '2-digit subtraction (with borrow)' },
      { start: 181, end: 200, type: 'mixed_add_subtract', description: 'Mixed add & subtract' },
    ],
  },

  // ELEMENTARY ADVANCED
  {
    level: 'C',
    name: 'Level C',
    description: 'Multiplication & Division Intro',
    gradeRange: '3rd',
    category: 'elementary-advanced',
    sct: '5 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'review_level_b', description: 'Level B review' },
      { start: 11, end: 14, type: 'times_table_2', description: '2s table only' },
      { start: 15, end: 18, type: 'times_table_3', description: '3s table only' },
      { start: 19, end: 22, type: 'times_table_2_3', description: '2s and 3s mixed' },
      { start: 23, end: 26, type: 'times_table_4', description: '4s table only' },
      { start: 27, end: 30, type: 'times_table_5', description: '5s table only' },
      { start: 31, end: 34, type: 'times_table_4_5', description: '4s and 5s mixed' },
      { start: 35, end: 38, type: 'times_table_6', description: '6s table only' },
      { start: 39, end: 42, type: 'times_table_7', description: '7s table only' },
      { start: 43, end: 46, type: 'times_table_6_7', description: '6s and 7s mixed' },
      { start: 47, end: 50, type: 'times_table_8', description: '8s table only' },
      { start: 51, end: 54, type: 'times_table_9', description: '9s table only' },
      { start: 55, end: 60, type: 'times_table_8_9', description: '8s and 9s mixed' },
      { start: 61, end: 70, type: 'times_table_all', description: 'All times tables (2-9)' },
      { start: 71, end: 90, type: 'multiplication_2digit_by_1digit', description: '2-digit × 1-digit' },
      { start: 91, end: 110, type: 'multiplication_3digit_by_1digit', description: '3-digit × 1-digit' },
      { start: 111, end: 120, type: 'division_intro', description: 'Division introduction' },
      { start: 121, end: 140, type: 'division_exact', description: 'Division (no remainder)' },
      { start: 141, end: 160, type: 'division_with_remainder', description: 'Division (with remainder)' },
      { start: 161, end: 180, type: 'division_2digit_by_1digit', description: '2-digit ÷ 1-digit' },
      { start: 181, end: 200, type: 'division_3digit_by_1digit', description: '3-digit ÷ 1-digit' },
    ],
  },
  {
    level: 'D',
    name: 'Level D',
    description: 'Advanced Mult/Div & Fractions',
    gradeRange: '4th',
    category: 'elementary-advanced',
    sct: '5 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'review_level_c', description: 'Level C review' },
      { start: 11, end: 70, type: 'multiplication_2_3_digit', description: '2-3 digit multiplication' },
      { start: 71, end: 90, type: 'operations_review', description: 'Operations review' },
      { start: 91, end: 130, type: 'long_division', description: 'Long division' },
      { start: 131, end: 160, type: 'fraction_intro', description: 'Fraction introduction' },
      { start: 161, end: 180, type: 'equivalent_fractions', description: 'Equivalent fractions' },
      { start: 181, end: 200, type: 'reduce_fraction', description: 'Reducing fractions' },
    ],
  },
  {
    level: 'E',
    name: 'Level E',
    description: 'Fraction Operations',
    gradeRange: '5th',
    category: 'elementary-advanced',
    sct: '5 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'review_level_d', description: 'Level D review' },
      { start: 11, end: 50, type: 'fraction_add_same_denom', description: 'Add fractions (same denom)' },
      { start: 51, end: 100, type: 'fraction_add_diff_denom', description: 'Add fractions (diff denom)' },
      { start: 101, end: 140, type: 'fraction_subtract', description: 'Subtract fractions' },
      { start: 141, end: 170, type: 'fraction_multiply', description: 'Multiply fractions' },
      { start: 171, end: 190, type: 'fraction_divide', description: 'Divide fractions' },
      { start: 191, end: 200, type: 'four_operations_fractions', description: 'Four operations (fractions)' },
    ],
  },
  {
    level: 'F',
    name: 'Level F',
    description: 'Decimals & Order of Operations',
    gradeRange: '6th',
    category: 'elementary-advanced',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'review_level_e', description: 'Level E review' },
      { start: 21, end: 80, type: 'fraction_advanced', description: 'Advanced fraction operations' },
      { start: 81, end: 130, type: 'order_of_operations', description: 'Order of operations' },
      { start: 131, end: 170, type: 'fraction_decimal_conversion', description: 'Fraction ↔ Decimal' },
      { start: 171, end: 180, type: 'word_problems', description: 'Word problems' },
      { start: 181, end: 200, type: 'decimal_operations', description: 'Decimal operations' },
    ],
  },

  // MIDDLE SCHOOL
  {
    level: 'G',
    name: 'Level G',
    description: 'Integers & Basic Algebra',
    gradeRange: '7th',
    category: 'middle-school',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'review_level_f', description: 'Level F review' },
      { start: 21, end: 60, type: 'integer_addition', description: 'Integer addition' },
      { start: 61, end: 100, type: 'integer_operations', description: 'Integer operations' },
      { start: 101, end: 130, type: 'evaluate_expression', description: 'Evaluate expressions' },
      { start: 131, end: 170, type: 'simplify_expressions', description: 'Simplify expressions' },
      { start: 171, end: 200, type: 'solve_equations', description: 'Solve equations' },
    ],
  },
  {
    level: 'H',
    name: 'Level H',
    description: 'Algebra I (Linear)',
    gradeRange: '8th',
    category: 'middle-school',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'basics_review', description: 'Basics review' },
      { start: 21, end: 60, type: 'solve_for_variable', description: 'Solve for variable' },
      { start: 61, end: 110, type: 'systems_of_equations', description: 'Systems of equations' },
      { start: 111, end: 140, type: 'inequalities', description: 'Linear inequalities' },
      { start: 141, end: 170, type: 'linear_functions', description: 'Linear functions' },
      { start: 171, end: 200, type: 'polynomials', description: 'Polynomial operations' },
    ],
  },
  {
    level: 'I',
    name: 'Level I',
    description: 'Algebra II (Quadratics)',
    gradeRange: '9th',
    category: 'middle-school',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 30, type: 'foil_binomials', description: 'FOIL method' },
      { start: 31, end: 50, type: 'special_products', description: 'Special products' },
      { start: 51, end: 100, type: 'factoring', description: 'Factoring' },
      { start: 101, end: 130, type: 'radicals', description: 'Radical operations' },
      { start: 131, end: 170, type: 'solve_quadratics', description: 'Solve quadratics' },
      { start: 171, end: 200, type: 'graph_parabolas', description: 'Graph parabolas' },
    ],
  },

  // HIGH SCHOOL
  {
    level: 'J',
    name: 'Level J',
    description: 'Advanced Algebra',
    gradeRange: '10th',
    category: 'high-school',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 50, type: 'polynomial_products', description: 'Polynomial products' },
      { start: 51, end: 90, type: 'advanced_factoring', description: 'Advanced factoring' },
      { start: 91, end: 120, type: 'complex_numbers', description: 'Complex numbers' },
      { start: 121, end: 160, type: 'quadratic_theory', description: 'Quadratic theory' },
      { start: 161, end: 200, type: 'polynomial_division', description: 'Polynomial division' },
    ],
  },
  {
    level: 'K',
    name: 'Level K',
    description: 'Functions & Analysis',
    gradeRange: '10th-11th',
    category: 'high-school',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'function_review', description: 'Function review' },
      { start: 41, end: 80, type: 'max_min_values', description: 'Max/min values' },
      { start: 81, end: 120, type: 'quadratic_inequalities', description: 'Quadratic inequalities' },
      { start: 121, end: 160, type: 'rational_functions', description: 'Rational functions' },
      { start: 161, end: 180, type: 'radical_functions', description: 'Radical functions' },
      { start: 181, end: 200, type: 'exponential_functions', description: 'Exponential functions' },
    ],
  },

  // CALCULUS
  {
    level: 'L',
    name: 'Level L',
    description: 'Pre-Calculus & Intro Calculus',
    gradeRange: '11th-12th',
    category: 'calculus',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'logarithms', description: 'Logarithm properties' },
      { start: 41, end: 80, type: 'limits', description: 'Evaluate limits' },
      { start: 81, end: 130, type: 'derivatives_basic', description: 'Basic derivatives' },
      { start: 131, end: 160, type: 'tangent_extrema', description: 'Tangent lines & extrema' },
      { start: 161, end: 200, type: 'integrals_basic', description: 'Basic integrals' },
    ],
  },
  {
    level: 'M',
    name: 'Level M',
    description: 'Coordinate Geometry & Trig',
    gradeRange: '11th-12th',
    category: 'calculus',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 50, type: 'coordinate_geometry', description: 'Lines & circles' },
      { start: 51, end: 80, type: 'locus_problems', description: 'Locus problems' },
      { start: 81, end: 120, type: 'trig_basics', description: 'Trig ratios & unit circle' },
      { start: 121, end: 150, type: 'trig_graphs', description: 'Graph sine/cosine' },
      { start: 151, end: 180, type: 'trig_identities', description: 'Trig identities' },
      { start: 181, end: 200, type: 'law_of_sines_cosines', description: 'Law of sines/cosines' },
    ],
  },
  {
    level: 'N',
    name: 'Level N',
    description: 'Sequences, Series & Adv Calc',
    gradeRange: '12th+',
    category: 'calculus',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'sequences', description: 'Arithmetic & geometric sequences' },
      { start: 41, end: 80, type: 'sigma_notation', description: 'Sigma notation & series' },
      { start: 81, end: 120, type: 'mathematical_induction', description: 'Mathematical induction' },
      { start: 121, end: 160, type: 'limits_continuity', description: 'Limits & continuity' },
      { start: 161, end: 200, type: 'advanced_derivatives', description: 'Trig & higher derivatives' },
    ],
  },
  {
    level: 'O',
    name: 'Level O',
    description: 'Advanced Calculus & DiffEq',
    gradeRange: '12th+',
    category: 'calculus',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'curve_analysis', description: 'Tangents & curve analysis' },
      { start: 41, end: 80, type: 'extrema_inflection', description: 'Extrema & inflection' },
      { start: 81, end: 140, type: 'integration_techniques', description: 'Integration techniques' },
      { start: 141, end: 180, type: 'applications_of_integration', description: 'Area & volume' },
      { start: 181, end: 200, type: 'differential_equations', description: 'Differential equations' },
    ],
  },
]

export const ELECTIVE_CONFIGS: LevelConfig[] = [
  {
    level: 'A' as KumonLevel, // XV placeholder
    name: 'Level XV',
    description: 'Vectors',
    gradeRange: 'Elective',
    category: 'elective',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 50, type: 'vector_2d', description: '2D vector operations' },
      { start: 51, end: 90, type: 'dot_cross_product', description: 'Dot & cross product' },
      { start: 91, end: 200, type: 'vector_equations', description: 'Line & plane equations' },
    ],
  },
  {
    level: 'B' as KumonLevel, // XM placeholder
    name: 'Level XM',
    description: 'Matrices & Transformations',
    gradeRange: 'Elective',
    category: 'elective',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 35, type: 'matrix_operations', description: 'Matrix add/multiply' },
      { start: 36, end: 65, type: 'determinant_inverse', description: 'Determinant & inverse' },
      { start: 66, end: 200, type: 'transformations', description: 'Transformations' },
    ],
  },
  {
    level: 'C' as KumonLevel, // XP placeholder
    name: 'Level XP',
    description: 'Permutations & Probability',
    gradeRange: 'Elective',
    category: 'elective',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 35, type: 'permutations_combinations', description: 'Permutations & combinations' },
      { start: 36, end: 65, type: 'binomial_expansion', description: 'Binomial expansion' },
      { start: 66, end: 200, type: 'probability', description: 'Probability' },
    ],
  },
  {
    level: 'D' as KumonLevel, // XS placeholder
    name: 'Level XS',
    description: 'Statistics',
    gradeRange: 'Elective',
    category: 'elective',
    sct: '4 min',
    worksheetRanges: [
      { start: 1, end: 25, type: 'descriptive_stats', description: 'Mean, median, mode, std dev' },
      { start: 26, end: 55, type: 'distributions', description: 'Binomial & normal distribution' },
      { start: 56, end: 200, type: 'inference', description: 'Z-scores, CI, hypothesis testing' },
    ],
  },
]

export const CATEGORY_LABELS: Record<LevelConfig['category'], string> = {
  'pre-k': 'Pre-K',
  'elementary-basic': 'Elementary (Basic)',
  'elementary-advanced': 'Elementary (Advanced)',
  'middle-school': 'Middle School',
  'high-school': 'High School',
  'calculus': 'Calculus',
  'elective': 'Electives',
}

export const CATEGORY_COLORS: Record<LevelConfig['category'], string> = {
  'pre-k': 'bg-pink-100 text-pink-700 border-pink-300',
  'elementary-basic': 'bg-orange-100 text-orange-700 border-orange-300',
  'elementary-advanced': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'middle-school': 'bg-green-100 text-green-700 border-green-300',
  'high-school': 'bg-blue-100 text-blue-700 border-blue-300',
  'calculus': 'bg-purple-100 text-purple-700 border-purple-300',
  'elective': 'bg-gray-100 text-gray-700 border-gray-300',
}

export function getLevelsByCategory() {
  const grouped: Record<LevelConfig['category'], LevelConfig[]> = {
    'pre-k': [],
    'elementary-basic': [],
    'elementary-advanced': [],
    'middle-school': [],
    'high-school': [],
    'calculus': [],
    'elective': [],
  }

  LEVEL_CONFIGS.forEach((config) => {
    grouped[config.category].push(config)
  })

  return grouped
}

/**
 * Get the configuration for a specific level
 */
export function getLevelConfig(level: KumonLevel): LevelConfig | undefined {
  return LEVEL_CONFIGS.find(c => c.level === level)
}

/**
 * Find which worksheet range contains the given worksheet number
 */
export function getCurrentConceptRange(level: KumonLevel, worksheet: number): WorksheetRange | undefined {
  const config = getLevelConfig(level)
  if (!config) return undefined
  return config.worksheetRanges.find(range => worksheet >= range.start && worksheet <= range.end)
}
