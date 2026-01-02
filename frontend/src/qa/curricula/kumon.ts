import type { CurriculumSpec, LevelSpec, WorksheetRange } from '../types'

const KUMON_LEVELS: LevelSpec[] = [
  {
    level: '7A',
    name: 'Level 7A: Counting to 10',
    gradeRange: 'Pre-K (Ages 3-4)',
    totalWorksheets: 200,
    sct: 'Not timed',
    worksheetRanges: [
      { start: 1, end: 30, type: 'count_pictures_to_5', description: 'Counting (Up to 5)', expectedSkills: ['count_objects', 'recognize_quantities_1_5'] },
      { start: 31, end: 100, type: 'count_pictures_to_10', description: 'Counting (Up to 10)', expectedSkills: ['count_objects', 'recognize_quantities_1_10'] },
      { start: 101, end: 150, type: 'match_quantity_to_numeral', description: 'Number Recognition 1-10', expectedSkills: ['match_quantity_numeral', 'number_recognition'] },
      { start: 151, end: 200, type: 'dot_pattern_recognition', description: 'Dot Pattern Recognition', expectedSkills: ['subitizing', 'pattern_recognition'] },
    ],
  },
  {
    level: '6A',
    name: 'Level 6A: Counting to 30',
    gradeRange: 'Pre-K (Ages 4-5)',
    totalWorksheets: 200,
    sct: 'Not timed',
    worksheetRanges: [
      { start: 1, end: 30, type: 'count_to_5', description: 'Counting (Up to 5)', expectedSkills: ['count_objects_1_5'] },
      { start: 31, end: 100, type: 'count_to_10', description: 'Counting (Up to 10)', expectedSkills: ['count_objects_1_10'] },
      { start: 101, end: 150, type: 'number_reading_to_10', description: 'Number Reading (1-10)', expectedSkills: ['read_numerals_1_10', 'match_word_numeral'] },
      { start: 151, end: 200, type: 'dot_recognition_to_10', description: 'Dot Recognition (1-10)', expectedSkills: ['count_dots', 'subitizing'] },
    ],
  },
  {
    level: '5A',
    name: 'Level 5A: Reading Numbers to 50',
    gradeRange: 'Pre-K/K (Ages 4-5)',
    totalWorksheets: 200,
    sct: 'Not timed',
    worksheetRanges: [
      { start: 1, end: 100, type: 'number_reading_to_30', description: 'Number Reading (Up to 30)', expectedSkills: ['read_numerals_1_30'] },
      { start: 101, end: 130, type: 'sequence_to_30', description: 'Sequences (Up to 30)', expectedSkills: ['number_sequences', 'counting_forward'] },
      { start: 131, end: 160, type: 'sequence_to_40', description: 'Sequences (Up to 40)', expectedSkills: ['number_sequences', 'counting_forward'] },
      { start: 161, end: 200, type: 'sequence_to_50', description: 'Sequences (Up to 50)', expectedSkills: ['number_sequences', 'counting_forward'] },
    ],
  },
  {
    level: '4A',
    name: 'Level 4A: Writing Numbers to 50',
    gradeRange: 'Kindergarten (Ages 5-6)',
    totalWorksheets: 200,
    sct: '0.5-2 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'trace_number_1_to_10', description: 'Number Tracing (1-10)', expectedSkills: ['trace_numerals', 'pencil_control'] },
      { start: 41, end: 100, type: 'write_number_1_to_10', description: 'Number Writing (1-10)', expectedSkills: ['write_numerals_1_10'] },
      { start: 101, end: 120, type: 'write_number_1_to_20', description: 'Number Writing (1-20)', expectedSkills: ['write_numerals_1_20'] },
      { start: 121, end: 140, type: 'write_number_1_to_30', description: 'Number Writing (1-30)', expectedSkills: ['write_numerals_1_30'] },
      { start: 141, end: 200, type: 'write_number_1_to_50', description: 'Number Writing (1-50)', expectedSkills: ['write_numerals_1_50'] },
    ],
  },
  {
    level: '3A',
    name: 'Level 3A: Adding 1, 2, 3',
    gradeRange: 'K-1 (Ages 5-6)',
    totalWorksheets: 200,
    sct: '1-2 min',
    worksheetRanges: [
      { start: 1, end: 70, type: 'number_sequence_to_120', description: 'Numbers up to 120', expectedSkills: ['counting_to_120', 'number_sequences'] },
      { start: 71, end: 130, type: 'adding_1', description: 'Adding 1', expectedSkills: ['addition_plus_1'] },
      { start: 131, end: 160, type: 'adding_2', description: 'Adding 2', expectedSkills: ['addition_plus_2'] },
      { start: 161, end: 180, type: 'adding_3', description: 'Adding 3', expectedSkills: ['addition_plus_3'] },
      { start: 181, end: 200, type: 'adding_up_to_3', description: 'Adding 1, 2, or 3 (Mixed)', expectedSkills: ['addition_plus_1', 'addition_plus_2', 'addition_plus_3'] },
    ],
  },
  {
    level: '2A',
    name: 'Level 2A: Adding 4-10',
    gradeRange: 'Grade 1 (Ages 6-7)',
    totalWorksheets: 200,
    sct: '1-2 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'review_3a', description: 'Review (Up to 3A)', expectedSkills: ['addition_plus_1', 'addition_plus_2', 'addition_plus_3'] },
      { start: 11, end: 30, type: 'adding_4', description: 'Adding 4', expectedSkills: ['addition_plus_4'] },
      { start: 31, end: 50, type: 'adding_5', description: 'Adding 5', expectedSkills: ['addition_plus_5'] },
      { start: 51, end: 70, type: 'adding_up_to_5', description: 'Adding up to 5', expectedSkills: ['addition_plus_1_to_5'] },
      { start: 71, end: 90, type: 'adding_6', description: 'Adding 6', expectedSkills: ['addition_plus_6'] },
      { start: 91, end: 110, type: 'adding_7', description: 'Adding 7', expectedSkills: ['addition_plus_7'] },
      { start: 111, end: 130, type: 'adding_up_to_7', description: 'Adding up to 7', expectedSkills: ['addition_plus_1_to_7'] },
      { start: 131, end: 150, type: 'adding_8', description: 'Adding 8', expectedSkills: ['addition_plus_8'] },
      { start: 151, end: 160, type: 'adding_9', description: 'Adding 9', expectedSkills: ['addition_plus_9'] },
      { start: 161, end: 170, type: 'adding_9_and_10', description: 'Adding 9 and 10', expectedSkills: ['addition_plus_9', 'addition_plus_10'] },
      { start: 171, end: 200, type: 'adding_up_to_10', description: 'Adding up to 10', expectedSkills: ['addition_plus_1_to_10'] },
    ],
  },
  {
    level: 'A',
    name: 'Level A: Subtraction Introduction',
    gradeRange: 'Grades 1-2 (Ages 6-7)',
    totalWorksheets: 200,
    sct: '1-3 min',
    worksheetRanges: [
      { start: 1, end: 80, type: 'addition_review', description: 'Addition Review', expectedSkills: ['addition_mastery'] },
      { start: 81, end: 90, type: 'subtracting_1', description: 'Subtracting 1', expectedSkills: ['subtraction_minus_1'] },
      { start: 91, end: 100, type: 'subtracting_2', description: 'Subtracting 2', expectedSkills: ['subtraction_minus_2'] },
      { start: 101, end: 110, type: 'subtracting_3', description: 'Subtracting 3', expectedSkills: ['subtraction_minus_3'] },
      { start: 111, end: 120, type: 'subtracting_up_to_3', description: 'Subtracting up to 3', expectedSkills: ['subtraction_minus_1_to_3'] },
      { start: 121, end: 200, type: 'subtraction_mastery', description: 'Subtraction Mastery', expectedSkills: ['subtraction_all'] },
    ],
  },
  {
    level: 'B',
    name: 'Level B: Vertical Operations & Regrouping',
    gradeRange: 'Grade 2 (Ages 7-8)',
    totalWorksheets: 200,
    sct: '1-5 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'review_a', description: 'Review (Up to A)', expectedSkills: ['horizontal_add_sub'] },
      { start: 11, end: 100, type: 'vertical_addition', description: 'Vertical Addition (2-3 digits)', expectedSkills: ['vertical_addition', 'carrying'] },
      { start: 101, end: 200, type: 'vertical_subtraction', description: 'Vertical Subtraction (2-3 digits)', expectedSkills: ['vertical_subtraction', 'borrowing'] },
    ],
  },
  {
    level: 'C',
    name: 'Level C: Multiplication & Division',
    gradeRange: 'Grade 3 (Ages 8-9)',
    totalWorksheets: 200,
    sct: '2-5 min',
    worksheetRanges: [
      { start: 1, end: 10, type: 'review_b', description: 'Review (Up to B)', expectedSkills: ['vertical_operations'] },
      { start: 11, end: 14, type: 'times_table_2', description: 'Times Table: 2s', expectedSkills: ['multiplication_2'] },
      { start: 15, end: 18, type: 'times_table_3', description: 'Times Table: 3s', expectedSkills: ['multiplication_3'] },
      { start: 19, end: 22, type: 'times_table_2_3', description: 'Times Tables: 2s and 3s', expectedSkills: ['multiplication_2', 'multiplication_3'] },
      { start: 23, end: 26, type: 'times_table_4', description: 'Times Table: 4s', expectedSkills: ['multiplication_4'] },
      { start: 27, end: 30, type: 'times_table_5', description: 'Times Table: 5s', expectedSkills: ['multiplication_5'] },
      { start: 31, end: 40, type: 'times_table_4_5', description: 'Times Tables: 4s and 5s', expectedSkills: ['multiplication_4', 'multiplication_5'] },
      { start: 41, end: 44, type: 'times_table_6', description: 'Times Table: 6s', expectedSkills: ['multiplication_6'] },
      { start: 45, end: 48, type: 'times_table_7', description: 'Times Table: 7s', expectedSkills: ['multiplication_7'] },
      { start: 49, end: 56, type: 'times_table_6_7', description: 'Times Tables: 6s and 7s', expectedSkills: ['multiplication_6', 'multiplication_7'] },
      { start: 57, end: 60, type: 'times_table_8', description: 'Times Table: 8s', expectedSkills: ['multiplication_8'] },
      { start: 61, end: 64, type: 'times_table_9', description: 'Times Table: 9s', expectedSkills: ['multiplication_9'] },
      { start: 65, end: 80, type: 'times_table_8_9', description: 'Times Tables: 8s and 9s', expectedSkills: ['multiplication_8', 'multiplication_9'] },
      { start: 81, end: 110, type: 'multiplication_multi_digit', description: 'Multi-digit Multiplication', expectedSkills: ['multiplication_2digit_by_1digit'] },
      { start: 111, end: 120, type: 'division_intro', description: 'Division Introduction', expectedSkills: ['division_basic'] },
      { start: 121, end: 200, type: 'division_with_remainder', description: 'Division with Remainders', expectedSkills: ['division_remainder'] },
    ],
  },
  {
    level: 'D',
    name: 'Level D: Long Division & Fractions Intro',
    gradeRange: 'Grade 4 (Ages 9-10)',
    totalWorksheets: 200,
    sct: '2-6 min',
    worksheetRanges: [
      { start: 1, end: 50, type: 'multiplication_2x2', description: 'Multi-digit Multiplication', expectedSkills: ['multiplication_2digit_by_2digit'] },
      { start: 51, end: 130, type: 'long_division', description: 'Long Division', expectedSkills: ['long_division_by_2digit'] },
      { start: 131, end: 140, type: 'fractions_intro', description: 'Fractions Introduction', expectedSkills: ['fraction_identification', 'fraction_concept'] },
      { start: 141, end: 200, type: 'fraction_reduction', description: 'Reducing Fractions', expectedSkills: ['reduce_fraction', 'gcf'] },
    ],
  },
  {
    level: 'E',
    name: 'Level E: Fraction Operations',
    gradeRange: 'Grade 5 (Ages 10-11)',
    totalWorksheets: 200,
    sct: '2-6 min',
    worksheetRanges: [
      { start: 1, end: 100, type: 'fraction_addition', description: 'Fraction Addition', expectedSkills: ['fraction_add_same_denom', 'fraction_add_diff_denom'] },
      { start: 101, end: 140, type: 'fraction_subtraction', description: 'Fraction Subtraction', expectedSkills: ['fraction_subtract'] },
      { start: 141, end: 170, type: 'fraction_multiplication', description: 'Fraction Multiplication', expectedSkills: ['fraction_multiply'] },
      { start: 171, end: 200, type: 'fraction_division', description: 'Fraction Division', expectedSkills: ['fraction_divide'] },
    ],
  },
  {
    level: 'F',
    name: 'Level F: Decimals & Order of Operations',
    gradeRange: 'Grade 6 (Ages 11-12)',
    totalWorksheets: 200,
    sct: '3-7 min',
    worksheetRanges: [
      { start: 1, end: 60, type: 'three_fraction_operations', description: '3+ Fraction Operations', expectedSkills: ['fraction_complex'] },
      { start: 61, end: 130, type: 'order_of_operations', description: 'Order of Operations (PEMDAS)', expectedSkills: ['pemdas', 'order_of_operations'] },
      { start: 131, end: 180, type: 'fractions_and_decimals', description: 'Fractions and Decimals', expectedSkills: ['fraction_decimal_conversion'] },
      { start: 181, end: 200, type: 'decimal_operations', description: 'Decimal Operations', expectedSkills: ['decimal_arithmetic'] },
    ],
  },
  {
    level: 'G',
    name: 'Level G: Integers & Pre-Algebra',
    gradeRange: 'Grade 7 (Ages 12-13)',
    totalWorksheets: 200,
    sct: '3-6 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'review_f', description: 'Review (Up to F)', expectedSkills: ['fractions', 'decimals'] },
      { start: 21, end: 100, type: 'integer_operations', description: 'Integer Operations', expectedSkills: ['integer_add', 'integer_subtract', 'integer_multiply', 'integer_divide'] },
      { start: 101, end: 160, type: 'algebraic_expressions', description: 'Algebraic Expressions', expectedSkills: ['evaluate_expression', 'simplify_expression'] },
      { start: 161, end: 200, type: 'linear_equations', description: 'Linear Equations', expectedSkills: ['solve_linear_equation'] },
    ],
  },
  {
    level: 'H',
    name: 'Level H: Systems & Functions',
    gradeRange: 'Grade 8 (Ages 13-14)',
    totalWorksheets: 200,
    sct: '4-6 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'literal_equations', description: 'Literal Equations', expectedSkills: ['solve_for_variable'] },
      { start: 41, end: 120, type: 'simultaneous_equations', description: 'Simultaneous Equations', expectedSkills: ['system_2_variables', 'system_3_variables'] },
      { start: 121, end: 140, type: 'inequalities', description: 'Inequalities', expectedSkills: ['linear_inequality'] },
      { start: 141, end: 180, type: 'functions_and_graphs', description: 'Functions and Graphs', expectedSkills: ['function_notation', 'linear_graphing'] },
      { start: 181, end: 200, type: 'polynomials', description: 'Polynomials', expectedSkills: ['polynomial_operations'] },
    ],
  },
  {
    level: 'I',
    name: 'Level I: Factorization & Quadratics',
    gradeRange: 'Grade 9 (Ages 14-15)',
    totalWorksheets: 200,
    sct: '4-6 min',
    worksheetRanges: [
      { start: 1, end: 30, type: 'polynomial_multiplication', description: 'Polynomial Multiplication', expectedSkills: ['foil', 'special_products'] },
      { start: 31, end: 80, type: 'factorization', description: 'Factorization', expectedSkills: ['factor_gcf', 'factor_trinomial', 'factor_special'] },
      { start: 81, end: 110, type: 'square_roots', description: 'Square Roots', expectedSkills: ['simplify_radical', 'radical_operations'] },
      { start: 111, end: 140, type: 'quadratic_equations', description: 'Quadratic Equations', expectedSkills: ['solve_quadratic'] },
      { start: 141, end: 170, type: 'quadratic_functions', description: 'Quadratic Functions', expectedSkills: ['vertex_form', 'graph_parabola'] },
      { start: 171, end: 200, type: 'pythagorean_theorem', description: 'Pythagorean Theorem', expectedSkills: ['pythagorean_theorem', 'distance_formula'] },
    ],
  },
  {
    level: 'J',
    name: 'Level J: Advanced Algebra',
    gradeRange: 'Grade 10 (Ages 15-16)',
    totalWorksheets: 200,
    sct: '5-12 min',
    worksheetRanges: [
      { start: 1, end: 60, type: 'advanced_factoring', description: 'Advanced Factoring', expectedSkills: ['factor_cubes', 'factor_grouping'] },
      { start: 61, end: 70, type: 'fractional_expressions', description: 'Fractional Expressions', expectedSkills: ['rational_expressions'] },
      { start: 71, end: 90, type: 'irrational_numbers', description: 'Irrational Numbers', expectedSkills: ['irrational_operations'] },
      { start: 91, end: 120, type: 'quadratic_equations_advanced', description: 'Advanced Quadratic Equations', expectedSkills: ['quadratic_complex_roots'] },
      { start: 121, end: 140, type: 'discriminant', description: 'Discriminant & Root Analysis', expectedSkills: ['discriminant', 'root_coefficient'] },
      { start: 141, end: 150, type: 'simultaneous_advanced', description: 'Advanced Simultaneous Equations', expectedSkills: ['system_nonlinear'] },
      { start: 151, end: 170, type: 'polynomial_division', description: 'Polynomial Division', expectedSkills: ['polynomial_long_division', 'remainder_theorem'] },
      { start: 171, end: 180, type: 'factor_theorem', description: 'Factor Theorem', expectedSkills: ['factor_theorem'] },
      { start: 181, end: 200, type: 'proofs', description: 'Algebraic Proofs', expectedSkills: ['identity_proof', 'inequality_proof'] },
    ],
  },
  {
    level: 'K',
    name: 'Level K: Functions',
    gradeRange: 'Grades 10-11 (Ages 15-17)',
    totalWorksheets: 200,
    sct: '4-16 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'function_review', description: 'Function Review', expectedSkills: ['linear_function', 'quadratic_function'] },
      { start: 21, end: 100, type: 'quadratic_functions_advanced', description: 'Advanced Quadratic Functions', expectedSkills: ['max_min', 'quadratic_inequality'] },
      { start: 101, end: 120, type: 'higher_degree_functions', description: 'Higher Degree Functions', expectedSkills: ['cubic_function', 'polynomial_end_behavior'] },
      { start: 121, end: 150, type: 'rational_functions', description: 'Rational Functions', expectedSkills: ['asymptotes', 'rational_graphing'] },
      { start: 151, end: 170, type: 'irrational_functions', description: 'Irrational Functions', expectedSkills: ['radical_function'] },
      { start: 171, end: 200, type: 'exponential_functions', description: 'Exponential Functions', expectedSkills: ['exponential_graph', 'exponential_equation'] },
    ],
  },
  {
    level: 'L',
    name: 'Level L: Logarithms & Basic Calculus',
    gradeRange: 'Grade 11 (Ages 16-17)',
    totalWorksheets: 200,
    sct: '6-60 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'logarithms', description: 'Logarithmic Functions', expectedSkills: ['log_properties', 'log_equations'] },
      { start: 41, end: 60, type: 'limits_derivatives', description: 'Limits and Derivatives', expectedSkills: ['limit_evaluation', 'derivative_definition'] },
      { start: 61, end: 110, type: 'derivative_applications', description: 'Derivative Applications', expectedSkills: ['tangent_line', 'extrema', 'optimization'] },
      { start: 111, end: 170, type: 'integration', description: 'Integration', expectedSkills: ['indefinite_integral', 'definite_integral'] },
      { start: 171, end: 200, type: 'integration_applications', description: 'Integration Applications', expectedSkills: ['area_under_curve', 'volume'] },
    ],
  },
  {
    level: 'M',
    name: 'Level M: Trigonometry',
    gradeRange: 'Grades 11-12 (Ages 16-18)',
    totalWorksheets: 200,
    sct: '6-24 min',
    worksheetRanges: [
      { start: 1, end: 80, type: 'analytic_geometry', description: 'Analytic Geometry', expectedSkills: ['coordinate_geometry', 'circles', 'loci'] },
      { start: 81, end: 120, type: 'trigonometric_ratios', description: 'Trigonometric Ratios', expectedSkills: ['trig_ratios', 'unit_circle'] },
      { start: 121, end: 150, type: 'trig_equations', description: 'Trigonometric Equations & Graphs', expectedSkills: ['trig_equation', 'trig_graph'] },
      { start: 151, end: 180, type: 'addition_formulas', description: 'Addition Formulas', expectedSkills: ['sum_difference_formula', 'double_angle'] },
      { start: 181, end: 200, type: 'law_of_sines_cosines', description: 'Law of Sines and Cosines', expectedSkills: ['law_of_sines', 'law_of_cosines'] },
    ],
  },
  {
    level: 'N',
    name: 'Level N: Sequences, Series & Advanced Differentiation',
    gradeRange: 'Grade 12 (Ages 17-18)',
    totalWorksheets: 200,
    sct: '8-50 min',
    worksheetRanges: [
      { start: 1, end: 50, type: 'sequences', description: 'Sequences', expectedSkills: ['arithmetic_sequence', 'geometric_sequence', 'recurrence'] },
      { start: 51, end: 60, type: 'mathematical_induction', description: 'Mathematical Induction', expectedSkills: ['induction_proof'] },
      { start: 61, end: 100, type: 'series', description: 'Infinite Series', expectedSkills: ['infinite_series', 'convergence'] },
      { start: 101, end: 140, type: 'limits_advanced', description: 'Advanced Limits', expectedSkills: ['limit_function', 'continuity'] },
      { start: 141, end: 200, type: 'differentiation_advanced', description: 'Advanced Differentiation', expectedSkills: ['trig_derivative', 'log_derivative', 'implicit_differentiation'] },
    ],
  },
  {
    level: 'O',
    name: 'Level O: Advanced Calculus',
    gradeRange: 'Grade 12+ (Ages 17-18+)',
    totalWorksheets: 200,
    sct: '10-60 min',
    worksheetRanges: [
      { start: 1, end: 50, type: 'curve_sketching', description: 'Curve Sketching', expectedSkills: ['increasing_decreasing', 'concavity', 'curve_sketch'] },
      { start: 51, end: 130, type: 'integration_techniques', description: 'Integration Techniques', expectedSkills: ['substitution', 'integration_by_parts', 'partial_fractions'] },
      { start: 131, end: 160, type: 'integration_applications_advanced', description: 'Advanced Integration Applications', expectedSkills: ['volume_revolution', 'arc_length'] },
      { start: 161, end: 200, type: 'differential_equations', description: 'Differential Equations', expectedSkills: ['separable_de', 'first_order_de'] },
    ],
  },
  {
    level: 'XV',
    name: 'Level XV: Vectors',
    gradeRange: 'Elective',
    totalWorksheets: 140,
    sct: '10-40 min',
    worksheetRanges: [
      { start: 1, end: 40, type: 'surface_vectors', description: '2D Vectors', expectedSkills: ['vector_2d_operations'] },
      { start: 41, end: 70, type: 'space_vectors', description: '3D Vectors', expectedSkills: ['vector_3d_operations'] },
      { start: 71, end: 100, type: 'inner_products', description: 'Inner Products', expectedSkills: ['dot_product', 'angle_between_vectors'] },
      { start: 101, end: 140, type: 'lines_planes', description: 'Lines and Planes in Space', expectedSkills: ['equation_of_line_3d', 'equation_of_plane'] },
    ],
  },
  {
    level: 'XM',
    name: 'Level XM: Matrices & Transformations',
    gradeRange: 'Elective',
    totalWorksheets: 90,
    sct: '10-30 min',
    worksheetRanges: [
      { start: 1, end: 30, type: 'matrix_operations', description: 'Matrix Operations', expectedSkills: ['matrix_add', 'matrix_multiply', 'matrix_inverse'] },
      { start: 31, end: 50, type: 'matrix_equations', description: 'Matrix Equations', expectedSkills: ['solve_with_matrices'] },
      { start: 51, end: 90, type: 'transformations', description: 'Transformations', expectedSkills: ['reflection', 'rotation', 'scaling'] },
    ],
  },
  {
    level: 'XP',
    name: 'Level XP: Permutations, Combinations & Probability',
    gradeRange: 'Elective',
    totalWorksheets: 90,
    sct: '8-24 min',
    worksheetRanges: [
      { start: 1, end: 30, type: 'permutations', description: 'Permutations', expectedSkills: ['permutation_basic', 'permutation_repetition'] },
      { start: 31, end: 50, type: 'combinations', description: 'Combinations', expectedSkills: ['combination_basic', 'binomial_theorem'] },
      { start: 51, end: 90, type: 'probability', description: 'Probability', expectedSkills: ['probability_basic', 'conditional_probability', 'expected_value'] },
    ],
  },
  {
    level: 'XS',
    name: 'Level XS: Statistics',
    gradeRange: 'Elective',
    totalWorksheets: 70,
    sct: '6-20 min',
    worksheetRanges: [
      { start: 1, end: 20, type: 'descriptive_stats', description: 'Descriptive Statistics', expectedSkills: ['mean_median_mode', 'variance_std_dev'] },
      { start: 21, end: 50, type: 'distributions', description: 'Distributions', expectedSkills: ['binomial_distribution', 'normal_distribution'] },
      { start: 51, end: 70, type: 'inference', description: 'Statistical Inference', expectedSkills: ['confidence_interval', 'hypothesis_test'] },
    ],
  },
]

export const kumonCurriculum: CurriculumSpec = {
  name: 'Kumon',
  version: '1.0',
  levels: KUMON_LEVELS,

  getExpectedSkills(level: string, worksheet: number): string[] {
    const levelSpec = KUMON_LEVELS.find(l => l.level === level)
    if (!levelSpec) return []

    const range = levelSpec.worksheetRanges.find(
      r => worksheet >= r.start && worksheet <= r.end
    )
    return range?.expectedSkills || []
  },

  getWorksheetRange(level: string, worksheet: number): WorksheetRange | null {
    const levelSpec = KUMON_LEVELS.find(l => l.level === level)
    if (!levelSpec) return null

    return levelSpec.worksheetRanges.find(
      r => worksheet >= r.start && worksheet <= r.end
    ) || null
  },

  validateProblemType(level: string, worksheet: number, problemType: string): boolean {
    const range = this.getWorksheetRange(level, worksheet)
    if (!range) return false
    return range.type === problemType || range.expectedSkills.some(skill => 
      problemType.toLowerCase().includes(skill.toLowerCase())
    )
  },
}

export default kumonCurriculum
