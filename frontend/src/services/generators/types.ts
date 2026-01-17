export type KumonLevel =
  | '7A' | '6A' | '5A' | '4A' | '3A' | '2A'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K'
  | 'L' | 'M' | 'N' | 'O'
  | 'XV' | 'XM' | 'XP' | 'XS'

export type ProblemFormat = 'horizontal' | 'vertical' | 'expression' | 'graph' | 'geometry' | 'table' | 'sequenceBoxes' | 'matching'

export type Level7AProblemType =
  | 'count_pictures_to_5'
  | 'count_pictures_to_10'
  | 'count_dots_to_10'
  | 'match_quantity_to_numeral'
  | 'dot_pattern_recognition'

export type Level6AProblemType =
  | 'count_to_5'
  | 'count_to_10'
  | 'count_to_20'
  | 'count_to_30'
  | 'number_reading_to_10'
  | 'dot_recognition_to_10'
  | 'dot_recognition_to_20'

export type Level5AProblemType =
  | 'number_reading_to_30'
  | 'sequence_to_30'
  | 'sequence_to_40'
  | 'sequence_to_50'
  | 'number_before_after'

export type Level4AProblemType =
  | 'trace_number_1_to_10'
  | 'write_number_1_to_10'
  | 'write_number_1_to_20'
  | 'write_number_1_to_30'
  | 'write_number_1_to_50'
  | 'number_table_completion'
  | 'match_number_to_objects'

export type Level3AProblemType =
  | 'sequence_to_100'
  | 'sequence_to_120'
  | 'add_1_small'
  | 'add_1_medium'
  | 'add_1_large'
  | 'add_2_small'
  | 'add_2_medium'
  | 'add_3_small'
  | 'add_3_medium'
  | 'add_mixed_1_2_3'

export type Level2AProblemType =
  | 'add_review_1_2_3'
  | 'add_4'
  | 'add_5'
  | 'add_up_to_5'
  | 'add_6'
  | 'add_7'
  | 'add_up_to_7'
  | 'add_8'
  | 'add_9'
  | 'add_10'
  | 'add_up_to_10'

export type LevelAProblemType =
  | 'addition_sums_to_12'
  | 'addition_sums_to_15'
  | 'addition_sums_to_18'
  | 'addition_sums_to_20'
  | 'addition_sums_to_24'
  | 'addition_sums_to_28'
  | 'addition_summary'
  | 'subtract_1'
  | 'subtract_2'
  | 'subtract_3'
  | 'subtract_up_to_3'
  | 'subtract_up_to_5'
  | 'subtract_from_10'
  | 'subtract_from_11'
  | 'subtract_from_12'
  | 'subtract_from_14'
  | 'subtract_from_16'
  | 'subtract_from_20'
  | 'subtraction_summary'

export type LevelBProblemType =
  | 'addition_review'
  | 'vertical_addition_2digit_no_carry'
  | 'vertical_addition_2digit_with_carry'
  | 'vertical_addition_3digit'
  | 'subtraction_review'
  | 'vertical_subtraction_2digit_no_borrow'
  | 'vertical_subtraction_2digit_with_borrow'
  | 'vertical_subtraction_3digit'
  | 'mixed_add_subtract_2digit'

export type LevelCProblemType =
  | 'review_level_b'
  | 'times_table_2_3'
  | 'times_table_4_5'
  | 'times_table_6_7'
  | 'times_table_8_9'
  | 'multiplication_2digit_by_1digit'
  | 'multiplication_3digit_by_1digit'
  | 'multiplication_4digit_by_1digit'
  | 'division_intro'
  | 'division_exact'
  | 'division_with_remainder'
  | 'division_2digit_by_1digit'
  | 'division_3digit_by_1digit'

export type LevelDProblemType =
  | 'review_level_c'
  | 'multiplication_2digit_by_2digit'
  | 'multiplication_3digit_by_2digit'
  | 'add_subtract_review'
  | 'mult_div_review'
  | 'long_division_by_2digit'
  | 'long_division_multi_digit_quotient'
  | 'fraction_identification'
  | 'fraction_shading'
  | 'equivalent_fractions'
  | 'reduce_fraction'

export type LevelEProblemType =
  | 'review_level_d'
  | 'fraction_add_same_denom'
  | 'fraction_add_diff_denom'
  | 'fraction_subtract_same_denom'
  | 'fraction_subtract_diff_denom'
  | 'fraction_add_subtract_mixed'
  | 'fraction_multiply'
  | 'fraction_divide'
  | 'fraction_mult_div_mixed'
  | 'four_operations_fractions'

export type LevelFProblemType =
  | 'review_level_e'
  | 'three_fraction_mult_div'
  | 'three_fraction_addition'
  | 'three_fraction_add_subtract'
  | 'order_of_operations_3_fractions'
  | 'order_of_operations_multi_fractions'
  | 'fraction_to_decimal'
  | 'decimal_to_fraction'
  | 'word_problems'
  | 'decimal_operations'

export type LevelGProblemType =
  | 'review_level_f'
  | 'integer_addition'
  | 'integer_subtraction'
  | 'integer_multiplication'
  | 'integer_division'
  | 'integer_mixed_operations'
  | 'evaluate_expression'
  | 'simplify_like_terms'
  | 'simplify_with_distribution'
  | 'solve_one_step'
  | 'solve_two_step'
  | 'solve_with_distribution'
  | 'equation_word_problems'

export type LevelHProblemType =
  | 'basics_review'
  | 'solve_for_variable'
  | 'transform_formula'
  | 'system_2_variables_substitution'
  | 'system_2_variables_elimination'
  | 'system_3_variables'
  | 'system_4_variables'
  | 'system_word_problems'
  | 'solve_linear_inequality'
  | 'compound_inequality'
  | 'inequality_graphing'
  | 'function_notation'
  | 'linear_function_graphing'
  | 'slope_intercept_form'
  | 'point_slope_form'
  | 'monomial_operations'
  | 'polynomial_addition'
  | 'polynomial_multiplication'

export type LevelIProblemType =
  | 'basics_review'
  | 'foil_binomials'
  | 'special_products'
  | 'factor_gcf'
  | 'factor_trinomial_leading_1'
  | 'factor_trinomial_leading_a'
  | 'factor_difference_of_squares'
  | 'factor_perfect_square_trinomial'
  | 'simplify_square_root'
  | 'operations_with_radicals'
  | 'rationalize_denominator'
  | 'solve_by_factoring'
  | 'solve_by_square_root'
  | 'solve_by_completing_square'
  | 'solve_by_quadratic_formula'
  | 'vertex_form'
  | 'graph_parabola'
  | 'find_vertex_axis_symmetry'
  | 'find_hypotenuse'
  | 'find_leg'
  | 'distance_formula'
  | 'pythagorean_word_problems'

export type LevelJProblemType =
  | 'expansion_polynomial_products'
  | 'factor_sum_difference_cubes'
  | 'factor_by_grouping'
  | 'factor_quartic'
  | 'fractional_expressions'
  | 'complex_addition_subtraction'
  | 'complex_multiplication'
  | 'complex_division'
  | 'powers_of_i'
  | 'find_discriminant'
  | 'determine_nature_of_roots'
  | 'find_k_for_root_type'
  | 'sum_of_roots'
  | 'product_of_roots'
  | 'form_equation_from_roots'
  | 'polynomial_long_division'
  | 'synthetic_division'
  | 'remainder_theorem'
  | 'factor_theorem'
  | 'algebraic_identity_proof'
  | 'inequality_proof'

export type LevelKProblemType =
  | 'linear_function_review'
  | 'quadratic_function_review'
  | 'find_vertex'
  | 'find_axis_symmetry'
  | 'find_max_min_value'
  | 'find_max_min_restricted_domain'
  | 'write_equation_from_graph'
  | 'quadratic_inequality_solve'
  | 'cubic_function_graphing'
  | 'polynomial_end_behavior'
  | 'find_zeros_multiplicity'
  | 'find_asymptotes'
  | 'graph_rational_function'
  | 'solve_rational_equation'
  | 'solve_rational_inequality'
  | 'graph_square_root_function'
  | 'domain_of_radical'
  | 'solve_radical_equation'
  | 'graph_exponential'
  | 'exponential_growth_decay'
  | 'solve_exponential_equation'
  | 'irrational_functions'
  | 'higher_degree_functions'
  | 'rational_functions'
  | 'solve_exponential_equation'
  | 'compound_interest'

export type LevelLProblemType =
  | 'log_properties'
  | 'log_equations'
  | 'change_of_base'
  | 'graph_logarithm'
  | 'modulus_functions'
  | 'evaluate_limit'
  | 'limit_at_infinity'
  | 'one_sided_limits'
  | 'derivative_definition'
  | 'power_rule'
  | 'product_rule'
  | 'quotient_rule'
  | 'chain_rule'
  | 'tangent_line_equation'
  | 'find_critical_points'
  | 'find_relative_extrema'
  | 'find_absolute_extrema'
  | 'optimization_problems'
  | 'indefinite_integral'
  | 'definite_integral'
  | 'area_under_curve'
  | 'area_between_curves'
  | 'volume_of_revolution'
  | 'velocity_distance'

export type LevelMProblemType =
  | 'distance_between_points'
  | 'midpoint_formula'
  | 'equation_of_line'
  | 'equation_of_circle'
  | 'locus_problems'
  | 'regions'
  | 'evaluate_trig_ratio'
  | 'find_angle_given_ratio'
  | 'unit_circle'
  | 'reference_angles'
  | 'pythagorean_identities'
  | 'quotient_identities'
  | 'reciprocal_identities'
  | 'solve_basic_trig_equation'
  | 'solve_quadratic_trig_equation'
  | 'graph_sine_cosine'
  | 'amplitude_period_phase'
  | 'graph_tangent'
  | 'trig_inequalities'
  | 'sum_difference_formulas'
  | 'double_angle_formulas'
  | 'half_angle_formulas'
  | 'law_of_sines'
  | 'law_of_cosines'
  | 'area_of_triangle_trig'

export type LevelNProblemType =
  | 'arithmetic_sequence_nth_term'
  | 'arithmetic_series_sum'
  | 'geometric_sequence_nth_term'
  | 'geometric_series_sum'
  | 'sigma_notation'
  | 'recurrence_relations'
  | 'mathematical_induction_proof'
  | 'infinite_geometric_series'
  | 'convergence_tests'
  | 'limit_of_sequence'
  | 'limit_of_function'
  | 'special_limits'
  | 'continuity_at_point'
  | 'derivative_of_trig'
  | 'derivative_of_ln'
  | 'derivative_of_exponential'
  | 'implicit_differentiation'
  | 'logarithmic_differentiation'
  | 'higher_order_derivatives'

export type LevelOProblemType =
  | 'tangents_normals'
  | 'find_intervals_increasing_decreasing'
  | 'find_concavity_inflection'
  | 'find_maxima_minima'
  | 'complete_curve_sketch'
  | 'various_differentiation_applications'
  | 'integration_by_substitution'
  | 'integration_by_parts'
  | 'partial_fractions'
  | 'trigonometric_integrals'
  | 'trigonometric_substitution'
  | 'definite_integrals_advanced'
  | 'area_between_curves_advanced'
  | 'volume_disk_washer'
  | 'volume_shell_method'
  | 'arc_length'
  | 'work_problems'
  | 'separable_de'
  | 'first_order_linear_de'
  | 'exponential_growth_decay_de'
  | 'initial_value_problem'

export type LevelXVProblemType =
  | 'vector_addition_2d'
  | 'vector_subtraction_2d'
  | 'vector_scalar_multiplication'
  | 'vector_magnitude'
  | 'unit_vector'
  | 'dot_product'
  | 'angle_between_vectors'
  | 'vector_projection'
  | 'vector_parallel_perpendicular'
  | 'cross_product_3d'
  | 'coordinates_in_space'
  | 'vectors_in_space'
  | 'equation_of_line_vectors'
  | 'equation_of_plane'
  | 'distance_point_to_line'
  | 'distance_point_to_plane'
  | 'vectors_and_figures'

export type LevelXMProblemType =
  | 'matrix_addition'
  | 'matrix_subtraction'
  | 'matrix_multiplication'
  | 'matrix_determinant'
  | 'matrix_inverse'
  | 'solve_system_with_matrices'
  | 'set_union'
  | 'set_intersection'
  | 'set_difference'
  | 'mapping'
  | 'domain_range'
  | 'composite_mapping'
  | 'transformation_reflection'
  | 'transformation_rotation'
  | 'transformation_scaling'
  | 'composite_transformations'
  | 'matrix_equations'

export type LevelXPProblemType =
  | 'permutation_basic'
  | 'permutation_with_repetition'
  | 'circular_permutation'
  | 'combination_basic'
  | 'combination_with_repetition'
  | 'combination_word_problems'
  | 'binomial_expansion'
  | 'probability_basic'
  | 'conditional_probability'
  | 'bayes_theorem'
  | 'independent_events'
  | 'expected_value'

export type LevelXSProblemType =
  | 'mean_median_mode'
  | 'variance_standard_deviation'
  | 'standard_error'
  | 'binomial_distribution'
  | 'probability_density_function'
  | 'normal_distribution'
  | 'z_scores'
  | 'sampling'
  | 'regression'
  | 'confidence_intervals'
  | 'hypothesis_test'
  | 'chi_square'

export type ProblemSubtype =
  | Level7AProblemType
  | Level6AProblemType
  | Level5AProblemType
  | Level4AProblemType
  | Level3AProblemType
  | Level2AProblemType
  | LevelAProblemType
  | LevelBProblemType
  | LevelCProblemType
  | LevelDProblemType
  | LevelEProblemType
  | LevelFProblemType
  | LevelGProblemType
  | LevelHProblemType
  | LevelIProblemType
  | LevelJProblemType
  | LevelKProblemType
  | LevelLProblemType
  | LevelMProblemType
  | LevelNProblemType
  | LevelOProblemType
  | LevelXVProblemType
  | LevelXMProblemType
  | LevelXPProblemType
  | LevelXSProblemType

export interface Fraction {
  numerator: number
  denominator: number
}

// Hint System Types (Phase 1.8.2)
export type HintLevel = 'micro' | 'visual' | 'teaching'

export interface HintData {
  level: HintLevel
  text: string
  /** Animation ID for visual/teaching hints */
  animationId?: string
  /** Duration in seconds (default: micro=5, visual=15, teaching=60) */
  duration?: number
}

/** Graduated 3-level hint system for a problem */
export interface ProblemHints {
  /** Quick text hint shown as toast (2-5 sec) */
  micro: HintData
  /** Inline animation hint (5-15 sec) */
  visual: HintData
  /** Full teaching modal with voiceover (30-60 sec) */
  teaching: HintData
}

export interface MathExpression {
  latex: string
  text: string
  variables?: Record<string, number>
}

export interface SequenceItem {
  value: number | null
  isMissing: boolean
}

export interface MatchingItem {
  id: string
  visual: string
  count: number
}

export interface MatchingData {
  items: MatchingItem[]
  options: number[]
}

export interface Problem {
  id: string
  level: KumonLevel
  worksheetNumber: number
  type: string
  subtype: ProblemSubtype
  difficulty: number
  displayFormat: ProblemFormat
  question: string | MathExpression
  operands?: number[]
  correctAnswer: number | string | Fraction | MathExpression
  missingPosition?: number
  /** Legacy string hints (deprecated - use graduatedHints) */
  hints?: string[]
  /** 3-level graduated hint system */
  graduatedHints?: ProblemHints
  solutionSteps?: string[]
  timeLimit?: number
  visualAssets?: string[]
  interactionType?: 'input' | 'match' | 'sequence'
  sequenceData?: SequenceItem[]
  matchingData?: MatchingData
}

export interface WorksheetInfo {
  level: KumonLevel
  worksheetNumber: number
  topic: string
  sct: string
  problemTypes: ProblemSubtype[]
}

export interface GeneratorConfig {
  level: KumonLevel
  worksheetNumber: number
  count?: number
  seed?: number
}

export const LEVEL_ORDER: KumonLevel[] = [
  '7A', '6A', '5A', '4A', '3A', '2A',
  'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K',
  'L', 'M', 'N', 'O',
  'XV', 'XM', 'XP', 'XS'
]

export const LEVEL_WORKSHEETS: Record<KumonLevel, number> = {
  '7A': 200, '6A': 200, '5A': 200, '4A': 200, '3A': 200, '2A': 200,
  'A': 200, 'B': 200, 'C': 200, 'D': 200, 'E': 200, 'F': 200,
  'G': 200, 'H': 200, 'I': 200, 'J': 200, 'K': 200,
  'L': 200, 'M': 200, 'N': 200, 'O': 200,
  'XV': 140, 'XM': 90, 'XP': 90, 'XS': 70
}

export const LEVEL_GRADES: Record<KumonLevel, string> = {
  '7A': 'Pre-K (3-4)', '6A': 'Pre-K (4-5)', '5A': 'Pre-K/K (4-5)', '4A': 'K (5-6)',
  '3A': 'K-1 (5-6)', '2A': '1 (6-7)', 'A': '1-2 (6-7)', 'B': '2 (7-8)',
  'C': '3 (8-9)', 'D': '4 (9-10)', 'E': '5 (10-11)', 'F': '6 (11-12)',
  'G': '7 (12-13)', 'H': '8 (13-14)', 'I': '9 (14-15)',
  'J': '10 (15-16)', 'K': '10-11 (15-17)',
  'L': '11 (16-17)', 'M': '11-12 (16-18)', 'N': '12 (17-18)', 'O': '12+ (17-18+)',
  'XV': 'Elective', 'XM': 'Elective', 'XP': 'Elective', 'XS': 'Elective'
}

export const LEVEL_TOPICS: Record<KumonLevel, string> = {
  '7A': 'Counting to 10',
  '6A': 'Counting to 30',
  '5A': 'Numbers to 50, Sequences',
  '4A': 'Writing Numbers',
  '3A': 'Adding +1, +2, +3',
  '2A': 'Adding +4 to +10',
  'A': 'Subtraction Introduction',
  'B': 'Vertical Operations, Regrouping',
  'C': 'Multiplication & Division',
  'D': 'Long Division, Fractions Intro',
  'E': 'Fraction Operations',
  'F': 'Decimals, Order of Operations',
  'G': 'Integers, Algebraic Expressions, Linear Equations',
  'H': 'Systems, Inequalities, Functions',
  'I': 'Factoring, Quadratics, Pythagorean Theorem',
  'J': 'Advanced Factoring, Complex Numbers, Proofs',
  'K': 'Quadratic/Exponential/Rational Functions',
  'L': 'Logarithms, Limits, Derivatives, Integration',
  'M': 'Trigonometry, Analytic Geometry',
  'N': 'Sequences, Series, Advanced Differentiation',
  'O': 'Advanced Integration, Differential Equations',
  'XV': 'Vectors',
  'XM': 'Matrices & Transformations',
  'XP': 'Permutations, Combinations, Probability',
  'XS': 'Statistics'
}
