/**
 * Concept Animation Mapping
 * Phase 1.12: Educational Animation System
 *
 * Maps mathematical concepts to their appropriate animations and intro content.
 * Provides titles, descriptions, and demo operands for concept introduction modals.
 */

export type ConceptAnimationType =
  | 'counting-objects'
  | 'number-line-addition'
  | 'number-line-subtraction'
  | 'ten-frame'
  | 'place-value'
  | 'sequence' // For number sequences BEFORE addition is taught (no + symbol)
  // Level C+ Animation Types
  | 'array-groups' // Multiplication as arrays
  | 'fair-sharing' // Division as equal sharing
  | 'long-division-steps' // Step-by-step division algorithm
  // Level D+ Animation Types
  | 'fraction-bar' // Fraction visualization with bars
  | 'fraction-circle' // Fraction visualization with circles
  | 'equivalent-fractions' // Equivalent fraction comparison
  // Level E+ Animation Types
  | 'fraction-operation' // Fraction add/subtract/multiply/divide
  // Level G+ Animation Types
  | 'algebra-tiles' // Integer/polynomial visualization
  | 'balance-scale' // Equation solving
  | 'number-line-algebra' // Integers and inequalities
  | 'coordinate-plot' // Linear functions, systems
  // Level I+ Animation Types
  | 'foil-visual' // FOIL method for polynomials
  | 'factoring-visual' // Factoring visualization
  | 'parabola-graph' // Quadratic functions
  | 'quadratic-formula' // Formula application
  // Level J+ Animation Types
  | 'complex-plane' // Complex numbers
  | 'polynomial-division' // Polynomial long division
  | 'advanced-factoring' // Factor by grouping, sum/difference of cubes
  | 'discriminant' // Discriminant analysis
  | 'proof-steps' // Mathematical proofs
  // Level K+ Animation Types
  | 'function-graph' // Generic function plotting
  | 'function-transform' // Function transformations
  | 'exponential-graph' // Exponential functions
  | 'exponential-log' // Exponential and logarithm relationship
  | 'rational-function' // Rational functions with asymptotes
  | 'irrational-function' // Root/irrational functions
  // Level L+ Animation Types
  | 'limit-approach' // Calculus limits
  | 'tangent-line' // Derivatives
  | 'area-under-curve' // Integration
  | 'optimization' // Optimization problems
  // Level M+ Animation Types
  | 'unit-circle' // Trigonometry
  | 'trig-graph' // Sine/cosine waves
  | 'triangle-trig' // Right triangle ratios
  // Level N+ Animation Types
  | 'sequence-series' // Sequences and series
  | 'recurrence-induction' // Recurrence and induction
  | 'advanced-differentiation' // Chain rule, trig/log/exp derivatives
  // Level O Animation Types
  | 'curve-analysis' // Curve sketching and analysis
  | 'integration-methods' // U-sub, integration by parts
  | 'volume-revolution' // Solids of revolution

export interface ConceptIntroConfig {
  animationId: ConceptAnimationType
  title: string
  description: string
  demoOperands: number[]
  minViewTime: number // seconds before Continue is enabled
  showMode: 'mandatory' | 'optional' // mandatory = first encounter, optional = can skip
}

/**
 * Full mapping of concepts to their animations (MVP: Levels 7A through B)
 * 45 concepts total
 */
export const CONCEPT_INTRO_CONFIG: Record<string, ConceptIntroConfig> = {
  // ===== Level 7A: Counting Basics (4 concepts) =====
  counting_to_5: {
    animationId: 'counting-objects',
    title: 'Counting to 5!',
    description: 'Point to each object as you count: 1, 2, 3, 4, 5. Touch each one!',
    demoOperands: [5],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST counting-objects animation
  },
  counting_to_10: {
    animationId: 'counting-objects',
    title: 'Counting to 10!',
    description: "Let's count all the way to 10! Touch each object as you count.",
    demoOperands: [10],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_recognition_to_10: {
    animationId: 'counting-objects',
    title: 'Recognizing Numbers',
    description: 'Look at the objects and tell how many there are. Can you see the number?',
    demoOperands: [7],
    minViewTime: 10,
    showMode: 'optional',
  },
  dot_pattern_recognition: {
    animationId: 'counting-objects',
    title: 'Dot Patterns',
    description: 'Some numbers make special patterns. Can you see how many without counting?',
    demoOperands: [6],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level 6A: Counting to 30 (4 concepts) =====
  counting_to_20: {
    animationId: 'counting-objects',
    title: 'Counting to 20!',
    description: "Numbers keep going after 10! Let's count to 20 together.",
    demoOperands: [15],
    minViewTime: 10,
    showMode: 'optional',
  },
  counting_to_30: {
    animationId: 'counting-objects',
    title: 'Counting to 30!',
    description: 'Big numbers are fun! Count by ones all the way to 30.',
    demoOperands: [25],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_reading_to_10: {
    animationId: 'counting-objects',
    title: 'Reading Numbers',
    description: 'Each number has a name. Can you say the number when you see it?',
    demoOperands: [8],
    minViewTime: 10,
    showMode: 'optional',
  },
  dot_recognition_to_10: {
    animationId: 'counting-objects',
    title: 'See & Count Dots',
    description: 'Look at the dots. How many do you see? Try to see the number quickly!',
    demoOperands: [9],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level 5A: Number Sequences (5 concepts) =====
  number_reading_to_30: {
    animationId: 'counting-objects',
    title: 'Big Numbers!',
    description: 'Numbers can get really big! Practice reading numbers up to 30.',
    demoOperands: [28],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_sequences: {
    animationId: 'sequence',
    title: 'What Comes Next?',
    description: 'Numbers follow a pattern. After 5 comes 6, after 6 comes 7...',
    demoOperands: [5, 3], // Show: 5, 6, 7, ?
    minViewTime: 15,
    showMode: 'mandatory', // FIRST sequence animation
  },
  sequence_to_30: {
    animationId: 'sequence',
    title: 'Counting Forward',
    description: 'Count forward to find the next number! What comes next?',
    demoOperands: [25, 3], // Show: 25, 26, 27, ?
    minViewTime: 10,
    showMode: 'optional',
  },
  sequence_to_40: {
    animationId: 'sequence',
    title: 'Numbers to 40',
    description: 'The numbers keep going! Count forward to find what comes next.',
    demoOperands: [35, 3], // Show: 35, 36, 37, ?
    minViewTime: 10,
    showMode: 'optional',
  },
  sequence_to_50: {
    animationId: 'sequence',
    title: 'Numbers to 50',
    description: "Almost to 50! Count forward to see what comes next.",
    demoOperands: [45, 3], // Show: 45, 46, 47, ?
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level 4A: Number Writing (6 concepts) =====
  number_tracing: {
    animationId: 'counting-objects',
    title: 'Tracing Numbers',
    description: 'Follow the dotted lines to write numbers. Start at the top!',
    demoOperands: [3],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_writing: {
    animationId: 'counting-objects',
    title: 'Writing Numbers',
    description: 'Now write the numbers yourself! Make them nice and clear.',
    demoOperands: [5],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_writing_to_10: {
    animationId: 'counting-objects',
    title: 'Write 1 to 10',
    description: 'Practice writing all numbers from 1 to 10. You can do it!',
    demoOperands: [7],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_writing_to_20: {
    animationId: 'counting-objects',
    title: 'Write to 20',
    description: 'Teen numbers have a 1 in front. 11, 12, 13... Practice writing them!',
    demoOperands: [15],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_writing_to_30: {
    animationId: 'counting-objects',
    title: 'Write to 30',
    description: 'Twenty-something numbers start with 2. Keep practicing!',
    demoOperands: [23],
    minViewTime: 10,
    showMode: 'optional',
  },
  number_writing_to_50: {
    animationId: 'counting-objects',
    title: 'Big Numbers!',
    description: "You're writing big numbers now! 40s and 50s, here we come!",
    demoOperands: [42],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level 3A: Adding 1, 2, 3 (6 concepts) =====
  sequence_to_100: {
    animationId: 'sequence',
    title: 'Counting to 100!',
    description: "Numbers go past 50, 60, 70, 80, 90... all the way to 100! Let's explore!",
    demoOperands: [95, 3], // Show: 95, 96, 97, ?
    minViewTime: 10,
    showMode: 'optional',
  },
  sequence_to_120: {
    animationId: 'sequence',
    title: 'Past 100!',
    description: 'Numbers never stop! After 100 comes 101, 102, 103...',
    demoOperands: [117, 3], // Show: 117, 118, 119, ?
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_1: {
    animationId: 'number-line-addition',
    title: 'Adding One More',
    description: 'When we add 1, we count ONE more number. Jump forward on the number line!',
    demoOperands: [5, 1],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST number-line-addition animation
  },
  addition_plus_2: {
    animationId: 'number-line-addition',
    title: 'Adding Two',
    description: 'Adding 2 means jumping TWO spaces forward on the number line!',
    demoOperands: [6, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_3: {
    animationId: 'number-line-addition',
    title: 'Adding Three',
    description: 'Jump, jump, jump! Adding 3 means THREE hops forward!',
    demoOperands: [4, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_mixed_1_2_3: {
    animationId: 'number-line-addition',
    title: 'Adding 1, 2, or 3',
    description: "Now you know +1, +2, and +3! Let's practice all of them!",
    demoOperands: [7, 2],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level 2A: Adding 4-10 (8 concepts) =====
  addition_plus_4: {
    animationId: 'number-line-addition',
    title: 'Adding Four',
    description: 'Four hops forward! Count: 1, 2, 3, 4. Where do you land?',
    demoOperands: [5, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_5: {
    animationId: 'number-line-addition',
    title: 'Adding Five',
    description: 'Adding 5 is like counting one whole hand! Jump forward 5 spaces.',
    demoOperands: [4, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_6: {
    animationId: 'ten-frame',
    title: 'Adding Six',
    description: "When numbers get bigger, we can use a ten-frame to help us see!",
    demoOperands: [6, 6],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST ten-frame animation
  },
  addition_plus_7: {
    animationId: 'ten-frame',
    title: 'Adding Seven',
    description: 'Fill the ten-frame and see how addition works with bigger numbers!',
    demoOperands: [5, 7],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_8: {
    animationId: 'ten-frame',
    title: 'Make 10 to Add 8',
    description: 'A cool trick: Fill to 10 first, then see what\'s left! 8 + 5 = 10 + 3 = 13!',
    demoOperands: [8, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_9: {
    animationId: 'ten-frame',
    title: 'Make 10 to Add 9',
    description: '9 is close to 10! Add 1 more to make 10, then add the rest.',
    demoOperands: [9, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_plus_10: {
    animationId: 'ten-frame',
    title: 'Adding Ten',
    description: 'Adding 10 is easy! The ones digit stays the same, the tens digit goes up by 1!',
    demoOperands: [7, 10],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_up_to_10: {
    animationId: 'ten-frame',
    title: 'Sums to 10',
    description: 'Number bonds! What two numbers make 10? 6 + 4, 7 + 3, 8 + 2...',
    demoOperands: [6, 4],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level A: Subtraction (9 concepts) =====
  addition_mastery: {
    animationId: 'ten-frame',
    title: 'Addition Practice',
    description: "You're getting great at adding! Let's practice to become even faster!",
    demoOperands: [7, 6],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction: {
    animationId: 'number-line-subtraction',
    title: 'Taking Away',
    description: 'Subtraction means taking away. Jump BACKWARD on the number line!',
    demoOperands: [8, 3],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST number-line-subtraction animation
  },
  subtraction_minus_1: {
    animationId: 'number-line-subtraction',
    title: 'Subtract One',
    description: 'Minus 1 means jumping back ONE space. What number comes before?',
    demoOperands: [7, 1],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_minus_2: {
    animationId: 'number-line-subtraction',
    title: 'Subtract Two',
    description: 'Jump back TWO spaces. Start at the number, hop back twice!',
    demoOperands: [9, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_minus_3: {
    animationId: 'number-line-subtraction',
    title: 'Subtract Three',
    description: 'Three hops backward! Count back: 1, 2, 3. Where do you land?',
    demoOperands: [10, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_up_to_3: {
    animationId: 'number-line-subtraction',
    title: 'Subtracting 1, 2, 3',
    description: 'Practice subtracting small numbers. Jump back and find the answer!',
    demoOperands: [8, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_up_to_5: {
    animationId: 'number-line-subtraction',
    title: 'Subtracting to 5',
    description: 'Subtract 4 or 5 by counting backward on the number line.',
    demoOperands: [12, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_from_10: {
    animationId: 'number-line-subtraction',
    title: 'From 10',
    description: 'Start at 10 and take away. 10 minus something is... ?',
    demoOperands: [10, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_from_20: {
    animationId: 'number-line-subtraction',
    title: 'From 20',
    description: 'Bigger numbers! Start at 20 and subtract. Use the number line to help!',
    demoOperands: [20, 7],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level B: Multi-digit & Regrouping (9 concepts) =====
  vertical_format: {
    animationId: 'place-value',
    title: 'Stacking Numbers',
    description: 'Stack numbers on top of each other. Line up the ones, line up the tens!',
    demoOperands: [23, 14],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST place-value animation
  },
  vertical_addition: {
    animationId: 'place-value',
    title: 'Adding in Columns',
    description: 'Add the ones first, then add the tens. Work from right to left!',
    demoOperands: [35, 24],
    minViewTime: 10,
    showMode: 'optional',
  },
  carrying: {
    animationId: 'place-value',
    title: 'Carrying to Tens',
    description: 'When ones add up to 10 or more, carry 1 to the tens place!',
    demoOperands: [28, 15],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_2digit: {
    animationId: 'place-value',
    title: 'Two-Digit Addition',
    description: 'Add two-digit numbers by working column by column. Remember to carry!',
    demoOperands: [47, 38],
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_3digit: {
    animationId: 'place-value',
    title: 'Three-Digit Addition',
    description: 'Hundreds, tens, ones - add each column. Carry when you need to!',
    demoOperands: [234, 152],
    minViewTime: 10,
    showMode: 'optional',
  },
  vertical_subtraction: {
    animationId: 'place-value',
    title: 'Subtracting in Columns',
    description: 'Subtract ones first, then tens. Stack the numbers and work right to left!',
    demoOperands: [58, 23],
    minViewTime: 10,
    showMode: 'optional',
  },
  borrowing: {
    animationId: 'place-value',
    title: 'Borrowing from Tens',
    description: "Can't subtract? Borrow 10 from the tens place! 12 - 7 is easier than 2 - 7!",
    demoOperands: [52, 27],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_2digit: {
    animationId: 'place-value',
    title: 'Two-Digit Subtraction',
    description: 'Subtract column by column. Borrow when the top number is smaller!',
    demoOperands: [73, 48],
    minViewTime: 10,
    showMode: 'optional',
  },
  subtraction_3digit: {
    animationId: 'place-value',
    title: 'Three-Digit Subtraction',
    description: 'Subtract hundreds, tens, and ones. Borrow across columns when needed!',
    demoOperands: [524, 267],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level C: Multiplication & Division (13 concepts) =====
  multiplication: {
    animationId: 'array-groups',
    title: 'Groups and Arrays',
    description: 'Multiplication is counting groups! 3 × 4 means 3 groups of 4.',
    demoOperands: [3, 4],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST array-groups animation
  },
  times_table_2_3: {
    animationId: 'array-groups',
    title: '2s and 3s Tables',
    description: 'Learn the 2 and 3 times tables by seeing arrays!',
    demoOperands: [3, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  times_table_4_5: {
    animationId: 'array-groups',
    title: '4s and 5s Tables',
    description: 'Arrays help you see 4 × 5 = 5 × 4. Same answer!',
    demoOperands: [4, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  times_table_6_7: {
    animationId: 'array-groups',
    title: '6s and 7s Tables',
    description: 'Bigger arrays, bigger products! Keep practicing!',
    demoOperands: [6, 7],
    minViewTime: 10,
    showMode: 'optional',
  },
  times_table_8_9: {
    animationId: 'array-groups',
    title: '8s and 9s Tables',
    description: 'The 9s have a cool pattern - the digits always add to 9!',
    demoOperands: [8, 9],
    minViewTime: 10,
    showMode: 'optional',
  },
  multiplication_2digit_by_1digit: {
    animationId: 'array-groups',
    title: 'Bigger Multiplication',
    description: 'Break apart: 23 × 4 = (20 × 4) + (3 × 4)',
    demoOperands: [23, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  multiplication_3digit_by_1digit: {
    animationId: 'array-groups',
    title: 'Even Bigger Numbers',
    description: 'Same strategy! Break into hundreds, tens, ones.',
    demoOperands: [125, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  division: {
    animationId: 'fair-sharing',
    title: 'Fair Sharing',
    description: 'Division means sharing equally. 12 ÷ 3 = share 12 among 3 groups!',
    demoOperands: [12, 3],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST fair-sharing animation
  },
  division_with_remainder: {
    animationId: 'fair-sharing',
    title: 'Remainders',
    description: "Sometimes items don't share equally. The leftover is the remainder!",
    demoOperands: [14, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  division_2digit_by_1digit: {
    animationId: 'long-division-steps',
    title: 'Long Division',
    description: 'Divide, Multiply, Subtract, Bring down - repeat!',
    demoOperands: [48, 6],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST long-division animation
  },
  division_3digit_by_1digit: {
    animationId: 'long-division-steps',
    title: 'Dividing Bigger Numbers',
    description: 'Same steps, more digits! Take it one step at a time.',
    demoOperands: [156, 4],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level D: Advanced Operations & Fractions Intro (9 concepts) =====
  multiplication_3digit_by_2digit: {
    animationId: 'array-groups',
    title: 'Three by Two Digits',
    description: 'Multiply larger numbers step by step using the area model!',
    demoOperands: [123, 45],
    minViewTime: 10,
    showMode: 'optional',
  },
  multiplication_2digit_by_2digit: {
    animationId: 'array-groups',
    title: 'Two by Two Multiplication',
    description: 'Use the area model: 23 × 45 becomes 4 smaller rectangles!',
    demoOperands: [23, 45],
    minViewTime: 10,
    showMode: 'optional',
  },
  long_division: {
    animationId: 'long-division-steps',
    title: 'Long Division Mastery',
    description: 'You know the steps! Divide, Multiply, Subtract, Bring down.',
    demoOperands: [84, 7],
    minViewTime: 10,
    showMode: 'optional',
  },
  long_division_by_2digit: {
    animationId: 'long-division-steps',
    title: 'Dividing by Two Digits',
    description: 'Same process, but estimate how many times the divisor fits!',
    demoOperands: [156, 12],
    minViewTime: 10,
    showMode: 'optional',
  },
  fractions_intro: {
    animationId: 'fraction-bar',
    title: 'Parts of a Whole',
    description: 'A fraction shows parts of a whole. 3/4 means 3 parts out of 4!',
    demoOperands: [3, 4],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST fraction-bar animation
  },
  fraction_identification: {
    animationId: 'fraction-bar',
    title: 'Reading Fractions',
    description: 'The top number (numerator) counts parts. The bottom (denominator) shows total parts.',
    demoOperands: [2, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  equivalent_fractions: {
    animationId: 'fraction-bar',
    title: 'Equal Fractions',
    description: '1/2 = 2/4 = 4/8 - same amount, different names!',
    demoOperands: [1, 2, 2, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  reducing_fractions: {
    animationId: 'fraction-bar',
    title: 'Simplifying Fractions',
    description: 'Make fractions simpler! 4/8 = 1/2 (divide top and bottom by same number)',
    demoOperands: [4, 8],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level E: Fraction Operations (7 concepts) =====
  fraction_addition: {
    animationId: 'fraction-operation',
    title: 'Adding Fractions',
    description: 'Same denominator? Just add the numerators! 1/4 + 2/4 = 3/4',
    demoOperands: [1, 4, 2, 4],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST fraction-operation animation
  },
  fraction_add_same_denom: {
    animationId: 'fraction-operation',
    title: 'Same Denominator Addition',
    description: 'When denominators match, adding is easy! Just add the tops.',
    demoOperands: [2, 5, 1, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  fraction_add_diff_denom: {
    animationId: 'fraction-operation',
    title: 'Different Denominators',
    description: 'Find a common denominator first, then add!',
    demoOperands: [1, 3, 1, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  fraction_subtraction: {
    animationId: 'fraction-operation',
    title: 'Subtracting Fractions',
    description: 'Same idea as adding - match denominators, then subtract tops!',
    demoOperands: [3, 4, 1, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  fraction_multiply: {
    animationId: 'fraction-operation',
    title: 'Multiplying Fractions',
    description: 'Multiply tops, multiply bottoms! 2/3 × 3/4 = 6/12 = 1/2',
    demoOperands: [2, 3, 3, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  fraction_divide: {
    animationId: 'fraction-operation',
    title: 'Dividing Fractions',
    description: 'Keep, Change, Flip! Keep first fraction, change ÷ to ×, flip second!',
    demoOperands: [1, 2, 1, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  four_operations_fractions: {
    animationId: 'fraction-operation',
    title: 'Fraction Mastery',
    description: "You can add, subtract, multiply, and divide fractions! Let's practice all four!",
    demoOperands: [2, 3, 1, 2],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level F: Order of Operations & Decimals (6 concepts) =====
  three_fraction_operations: {
    animationId: 'fraction-operation',
    title: 'Multiple Steps',
    description: 'Work left to right, following order of operations!',
    demoOperands: [1, 2, 1, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  order_of_operations: {
    animationId: 'fraction-operation',
    title: 'PEMDAS',
    description: 'Parentheses, Exponents, Multiply/Divide, Add/Subtract - in order!',
    demoOperands: [2, 3, 3, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  order_of_operations_fractions: {
    animationId: 'fraction-operation',
    title: 'Order with Fractions',
    description: 'PEMDAS works with fractions too! Follow the order.',
    demoOperands: [1, 2, 1, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  fraction_decimal_conversion: {
    animationId: 'fraction-bar',
    title: 'Fractions and Decimals',
    description: '1/4 = 0.25, 1/2 = 0.5 - fractions and decimals show the same amount!',
    demoOperands: [1, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  decimals: {
    animationId: 'place-value',
    title: 'Decimal Place Value',
    description: 'After the decimal: tenths, hundredths, thousandths. Each place is 10× smaller!',
    demoOperands: [3, 14],
    minViewTime: 10,
    showMode: 'optional',
  },
  word_problems: {
    animationId: 'fraction-operation',
    title: 'Problem Solving',
    description: 'Read carefully, find the numbers, choose the operation, solve!',
    demoOperands: [3, 4, 1, 2],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level G: Integers & Pre-Algebra (9 concepts) =====
  negative_numbers: {
    animationId: 'algebra-tiles',
    title: 'Negative Numbers',
    description: 'Numbers can be less than zero! Red tiles show negative numbers.',
    demoOperands: [-5, 8],
    minViewTime: 15,
    showMode: 'mandatory', // FIRST algebra-tiles animation
  },
  integer_addition: {
    animationId: 'algebra-tiles',
    title: 'Adding Integers',
    description: 'Positive + Negative: opposite tiles cancel out to zero!',
    demoOperands: [-3, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  integer_subtraction: {
    animationId: 'algebra-tiles',
    title: 'Subtracting Integers',
    description: 'Subtracting is adding the opposite! 5 - (-3) = 5 + 3',
    demoOperands: [5, -3],
    minViewTime: 10,
    showMode: 'optional',
  },
  integer_multiplication: {
    animationId: 'algebra-tiles',
    title: 'Multiplying Integers',
    description: 'Positive × Positive = Positive. Negative × Negative = Positive too!',
    demoOperands: [-4, -3],
    minViewTime: 10,
    showMode: 'optional',
  },
  integer_division: {
    animationId: 'algebra-tiles',
    title: 'Dividing Integers',
    description: 'Same sign rules as multiplication! Divide and check the signs.',
    demoOperands: [-12, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  algebraic_expressions: {
    animationId: 'algebra-tiles',
    title: 'Expressions with Variables',
    description: 'Variables like x stand for unknown numbers. 3x means 3 times x.',
    demoOperands: [3, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  evaluating_expressions: {
    animationId: 'algebra-tiles',
    title: 'Evaluating Expressions',
    description: 'Plug in the value for x, then calculate! If x = 4, then 3x = 12.',
    demoOperands: [3, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  simplifying_expressions: {
    animationId: 'algebra-tiles',
    title: 'Combining Like Terms',
    description: '3x + 2x = 5x. Combine terms that have the same variable!',
    demoOperands: [3, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  linear_equations: {
    animationId: 'balance-scale',
    title: 'Solving Equations',
    description: 'An equation is like a balance scale. Do the same to both sides!',
    demoOperands: [2, 3, 11], // 2x + 3 = 11
    minViewTime: 15,
    showMode: 'mandatory', // FIRST balance-scale animation
  },

  // ===== Level H: Systems & Functions (9 concepts) =====
  literal_equations: {
    animationId: 'balance-scale',
    title: 'Solving for Variables',
    description: 'Isolate the variable you want by doing operations to both sides.',
    demoOperands: [3, 5, 20], // 3x + 5 = 20
    minViewTime: 10,
    showMode: 'optional',
  },
  simultaneous_equations: {
    animationId: 'coordinate-plot',
    title: 'Systems of Equations',
    description: 'Two equations, two unknowns! Graph both lines to find where they meet.',
    demoOperands: [1, 2, -1, 4], // y = x + 2 and y = -x + 4
    minViewTime: 15,
    showMode: 'mandatory', // FIRST coordinate-plot animation
  },
  system_2_variables: {
    animationId: 'coordinate-plot',
    title: 'Two-Variable Systems',
    description: 'The intersection point is the solution - it works for both equations!',
    demoOperands: [2, 1, -1, 5], // y = 2x + 1 and y = -x + 5
    minViewTime: 10,
    showMode: 'optional',
  },
  system_3_variables: {
    animationId: 'balance-scale',
    title: 'Three Variables',
    description: 'More variables, more equations! Solve step by step.',
    demoOperands: [1, 2, 5], // simplified demo
    minViewTime: 10,
    showMode: 'optional',
  },
  system_4_variables: {
    animationId: 'balance-scale',
    title: 'Four Variables',
    description: 'Same strategy - eliminate variables one at a time!',
    demoOperands: [1, 3, 7],
    minViewTime: 10,
    showMode: 'optional',
  },
  inequalities: {
    animationId: 'coordinate-plot',
    title: 'Inequalities',
    description: 'Less than, greater than - shade the region that works!',
    demoOperands: [1, -2, 0, 0], // y > x - 2
    minViewTime: 10,
    showMode: 'optional',
  },
  functions: {
    animationId: 'coordinate-plot',
    title: 'Functions',
    description: 'A function gives one output for each input. f(x) = 2x + 1',
    demoOperands: [2, 1], // y = 2x + 1
    minViewTime: 10,
    showMode: 'optional',
  },
  function_graphing: {
    animationId: 'coordinate-plot',
    title: 'Graphing Functions',
    description: 'Plot points and connect them to see the function\'s shape!',
    demoOperands: [1, -1], // y = x - 1
    minViewTime: 10,
    showMode: 'optional',
  },
  polynomials: {
    animationId: 'algebra-tiles',
    title: 'Polynomials',
    description: 'Expressions with multiple terms: 3x² + 2x - 1',
    demoOperands: [3, 2],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level I: Quadratics & Roots (14 concepts) =====
  polynomial_multiplication: {
    animationId: 'foil-visual',
    title: 'FOIL Method',
    description: 'First, Outer, Inner, Last - multiply binomials step by step!',
    demoOperands: [2, 3, 1, 4], // (2x + 3)(x + 4)
    minViewTime: 15,
    showMode: 'mandatory', // FIRST foil-visual animation (placeholder)
  },
  foil: {
    animationId: 'foil-visual',
    title: 'Using FOIL',
    description: '(a + b)(c + d) = ac + ad + bc + bd',
    demoOperands: [1, 2, 1, 3], // (x + 2)(x + 3)
    minViewTime: 10,
    showMode: 'optional',
  },
  special_products: {
    animationId: 'foil-visual',
    title: 'Special Products',
    description: 'Perfect squares and difference of squares have patterns!',
    demoOperands: [1, 3, 1, 3], // (x + 3)² = x² + 6x + 9
    minViewTime: 10,
    showMode: 'optional',
  },
  factoring: {
    animationId: 'factoring-visual',
    title: 'Factoring',
    description: 'Reverse of FOIL! Find two binomials that multiply to give the trinomial.',
    demoOperands: [1, 5, 6], // x² + 5x + 6 = (x + 2)(x + 3)
    minViewTime: 15,
    showMode: 'mandatory', // FIRST factoring-visual animation (placeholder)
  },
  factor_gcf: {
    animationId: 'factoring-visual',
    title: 'Finding the GCF',
    description: 'Factor out the Greatest Common Factor first!',
    demoOperands: [2, 4, 6], // 2x² + 4x + 6 = 2(x² + 2x + 3)
    minViewTime: 10,
    showMode: 'optional',
  },
  factor_trinomial: {
    animationId: 'factoring-visual',
    title: 'Factoring Trinomials',
    description: 'Find two numbers that multiply to c and add to b in x² + bx + c',
    demoOperands: [1, 7, 12], // x² + 7x + 12 = (x + 3)(x + 4)
    minViewTime: 10,
    showMode: 'optional',
  },
  factor_difference_squares: {
    animationId: 'factoring-visual',
    title: 'Difference of Squares',
    description: 'a² - b² = (a + b)(a - b) - a special pattern!',
    demoOperands: [1, 0, -9], // x² - 9 = (x + 3)(x - 3)
    minViewTime: 10,
    showMode: 'optional',
  },
  square_roots: {
    animationId: 'algebra-tiles',
    title: 'Square Roots',
    description: '√16 = 4 because 4 × 4 = 16. Find the number that squares to give you the answer!',
    demoOperands: [16, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  radicals: {
    animationId: 'algebra-tiles',
    title: 'Simplifying Radicals',
    description: '√12 = √(4 × 3) = 2√3. Find perfect square factors!',
    demoOperands: [12, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  quadratic_equations: {
    animationId: 'parabola-graph',
    title: 'Quadratic Equations',
    description: 'ax² + bx + c = 0. Factor and solve, or use the quadratic formula!',
    demoOperands: [1, -4, 3], // x² - 4x + 3 = 0
    minViewTime: 15,
    showMode: 'mandatory', // FIRST parabola-graph animation (placeholder)
  },
  quadratic_formula: {
    animationId: 'quadratic-formula',
    title: 'The Quadratic Formula',
    description: 'x = (-b ± √(b²-4ac)) / 2a - works for any quadratic!',
    demoOperands: [2, -7, 3], // 2x² - 7x + 3 = 0
    minViewTime: 10,
    showMode: 'optional',
  },
  quadratic_functions: {
    animationId: 'parabola-graph',
    title: 'Graphing Parabolas',
    description: 'Quadratics make U-shaped curves called parabolas!',
    demoOperands: [1, -2, -3], // y = x² - 2x - 3
    minViewTime: 10,
    showMode: 'optional',
  },
  parabolas: {
    animationId: 'parabola-graph',
    title: 'Parabola Features',
    description: 'Vertex, axis of symmetry, roots - key features of parabolas!',
    demoOperands: [1, -4, 3], // y = x² - 4x + 3
    minViewTime: 10,
    showMode: 'optional',
  },
  pythagorean_theorem: {
    animationId: 'coordinate-plot',
    title: 'Pythagorean Theorem',
    description: 'a² + b² = c² - the relationship between sides of a right triangle!',
    demoOperands: [3, 4, 5], // 3-4-5 triangle
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level J: Advanced Algebra (11 concepts) =====
  advanced_factoring: {
    animationId: 'advanced-factoring',
    title: 'Advanced Factoring',
    description: 'Factor by grouping and use special patterns for complex expressions!',
    demoOperands: [1, 2, 3, 6], // x³ + 2x² + 3x + 6
    minViewTime: 15,
    showMode: 'mandatory', // FIRST advanced-factoring animation
  },
  sum_difference_cubes: {
    animationId: 'advanced-factoring',
    title: 'Sum and Difference of Cubes',
    description: 'a³ + b³ = (a + b)(a² - ab + b²) and a³ - b³ = (a - b)(a² + ab + b²)',
    demoOperands: [1, 0, 0, 8], // x³ + 8
    minViewTime: 10,
    showMode: 'optional',
  },
  fractional_expressions: {
    animationId: 'algebra-tiles',
    title: 'Rational Expressions',
    description: 'Simplify fractions with polynomials by factoring and canceling!',
    demoOperands: [2, 4, 2], // (x² + 4x + 4) / (x + 2)
    minViewTime: 10,
    showMode: 'optional',
  },
  irrational_numbers: {
    animationId: 'algebra-tiles',
    title: 'Irrational Numbers',
    description: 'Numbers like √2 and π that cannot be written as simple fractions!',
    demoOperands: [2, 1], // √2
    minViewTime: 10,
    showMode: 'optional',
  },
  complex_numbers: {
    animationId: 'complex-plane',
    title: 'Complex Numbers',
    description: 'Numbers with real and imaginary parts: a + bi where i² = -1',
    demoOperands: [3, 4], // 3 + 4i
    minViewTime: 15,
    showMode: 'mandatory', // FIRST complex-plane animation
  },
  discriminant: {
    animationId: 'discriminant',
    title: 'The Discriminant',
    description: 'b² - 4ac tells you how many real solutions a quadratic has!',
    demoOperands: [1, -5, 6], // x² - 5x + 6: D = 1, two real roots
    minViewTime: 15,
    showMode: 'mandatory', // FIRST discriminant animation
  },
  root_coefficient_relationships: {
    animationId: 'parabola-graph',
    title: 'Roots and Coefficients',
    description: "Vieta's formulas: sum of roots = -b/a, product of roots = c/a",
    demoOperands: [1, -5, 6], // roots are 2 and 3
    minViewTime: 10,
    showMode: 'optional',
  },
  polynomial_division: {
    animationId: 'polynomial-division',
    title: 'Polynomial Division',
    description: 'Divide polynomials using long division, just like numbers!',
    demoOperands: [1, 3, 2, 1, 1], // (x² + 3x + 2) ÷ (x + 1)
    minViewTime: 15,
    showMode: 'mandatory', // FIRST polynomial-division animation
  },
  remainder_theorem: {
    animationId: 'polynomial-division',
    title: 'Remainder Theorem',
    description: 'The remainder when f(x) ÷ (x - a) equals f(a)!',
    demoOperands: [1, -3, 2, 2], // f(x) = x² - 3x + 2, evaluate at x = 2
    minViewTime: 10,
    showMode: 'optional',
  },
  factor_theorem: {
    animationId: 'polynomial-division',
    title: 'Factor Theorem',
    description: 'If f(a) = 0, then (x - a) is a factor of f(x)!',
    demoOperands: [1, -3, 2, 1], // x² - 3x + 2 has root at x = 1
    minViewTime: 10,
    showMode: 'optional',
  },
  proofs: {
    animationId: 'proof-steps',
    title: 'Mathematical Proofs',
    description: 'Logical step-by-step reasoning to prove mathematical statements!',
    demoOperands: [1, 2, 3], // generic
    minViewTime: 15,
    showMode: 'mandatory', // FIRST proof-steps animation
  },

  // ===== Level K: Functions & Graphing (8 concepts) =====
  quadratic_function_graphing: {
    animationId: 'function-transform',
    title: 'Transforming Quadratics',
    description: 'Shift, stretch, and reflect parabolas using y = a(x-h)² + k',
    demoOperands: [2, 3, -1], // y = 2(x-3)² - 1
    minViewTime: 15,
    showMode: 'mandatory', // FIRST function-transform animation
  },
  maxima_minima: {
    animationId: 'function-transform',
    title: 'Finding Max and Min',
    description: 'The vertex is the maximum or minimum point of a parabola!',
    demoOperands: [-1, 2, 4], // y = -(x-2)² + 4, max at (2, 4)
    minViewTime: 10,
    showMode: 'optional',
  },
  quadratic_inequalities: {
    animationId: 'parabola-graph',
    title: 'Quadratic Inequalities',
    description: 'Graph the parabola and shade the region where the inequality holds!',
    demoOperands: [1, -2, -3], // x² - 2x - 3 > 0
    minViewTime: 10,
    showMode: 'optional',
  },
  higher_degree_functions: {
    animationId: 'coordinate-plot',
    title: 'Higher Degree Polynomials',
    description: 'Cubic, quartic, and higher - more turning points!',
    demoOperands: [1, 0, -4, 0], // x³ - 4x
    minViewTime: 10,
    showMode: 'optional',
  },
  rational_functions: {
    animationId: 'rational-function',
    title: 'Rational Functions',
    description: 'Fractions with polynomials - watch for asymptotes and holes!',
    demoOperands: [1, 0, 1, -4], // y = x / (x² - 4)
    minViewTime: 15,
    showMode: 'mandatory', // FIRST rational-function animation
  },
  irrational_functions: {
    animationId: 'irrational-function',
    title: 'Root Functions',
    description: 'Functions like √x have restricted domains - the radicand must be ≥ 0!',
    demoOperands: [1, 1, 2], // y = √(x-1) + 2
    minViewTime: 15,
    showMode: 'mandatory', // FIRST irrational-function animation
  },
  exponential_functions: {
    animationId: 'exponential-log',
    title: 'Exponential Functions',
    description: 'y = aˣ grows (or decays) rapidly! The base determines the rate.',
    demoOperands: [2, 0], // y = 2ˣ
    minViewTime: 15,
    showMode: 'mandatory', // FIRST exponential-log animation
  },
  logarithms: {
    animationId: 'exponential-log',
    title: 'Logarithms',
    description: 'log is the inverse of exponential! If 2³ = 8, then log₂(8) = 3',
    demoOperands: [2, 1], // y = log₂(x)
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level L: Calculus Introduction (14 concepts) =====
  log_equations: {
    animationId: 'exponential-log',
    title: 'Solving Log Equations',
    description: 'Use properties of logs: log(ab) = log(a) + log(b)',
    demoOperands: [10, 100], // log₁₀(x) = 2
    minViewTime: 10,
    showMode: 'optional',
  },
  modulus_functions: {
    animationId: 'coordinate-plot',
    title: 'Absolute Value Functions',
    description: '|x| makes a V-shape! It reflects the negative part above the x-axis.',
    demoOperands: [1, -2, 0], // y = |x - 2|
    minViewTime: 10,
    showMode: 'optional',
  },
  limits: {
    animationId: 'limit-approach',
    title: 'Limits',
    description: 'What value does f(x) approach as x gets closer and closer to a?',
    demoOperands: [2, 1], // lim as x→2 of (x² - 1)/(x - 1)
    minViewTime: 15,
    showMode: 'mandatory', // FIRST limit-approach animation
  },
  special_limits: {
    animationId: 'limit-approach',
    title: 'Special Limits',
    description: 'lim(sin x/x) = 1 and lim((1+1/n)ⁿ) = e as x or n → ∞',
    demoOperands: [0, 1], // lim sin(x)/x as x→0
    minViewTime: 10,
    showMode: 'optional',
  },
  continuity: {
    animationId: 'limit-approach',
    title: 'Continuity',
    description: 'A function is continuous if you can draw it without lifting your pen!',
    demoOperands: [1, 2], // check continuity at x = 2
    minViewTime: 10,
    showMode: 'optional',
  },
  derivatives: {
    animationId: 'tangent-line',
    title: 'Derivatives',
    description: "The derivative measures how fast a function changes - it's the slope of the tangent line!",
    demoOperands: [1, 0, 0, 2], // f(x) = x², find slope at x = 2
    minViewTime: 15,
    showMode: 'mandatory', // FIRST tangent-line animation
  },
  tangent_lines: {
    animationId: 'tangent-line',
    title: 'Tangent Lines',
    description: 'The tangent line just touches the curve at one point and has slope = f\'(x)',
    demoOperands: [1, 0, 0, 1], // tangent to x² at x = 1
    minViewTime: 10,
    showMode: 'optional',
  },
  relative_extrema: {
    animationId: 'tangent-line',
    title: 'Local Max and Min',
    description: 'Where f\'(x) = 0 or undefined - these are critical points!',
    demoOperands: [1, -3, 0, 2], // f(x) = x³ - 3x, extrema at x = ±1
    minViewTime: 10,
    showMode: 'optional',
  },
  absolute_extrema: {
    animationId: 'tangent-line',
    title: 'Global Max and Min',
    description: 'The highest and lowest points on the entire domain or interval!',
    demoOperands: [1, -3, 0, 0, 3], // f(x) = x³ - 3x on [0, 3]
    minViewTime: 10,
    showMode: 'optional',
  },
  optimization: {
    animationId: 'optimization',
    title: 'Optimization',
    description: 'Use calculus to find the best solution - maximum area, minimum cost!',
    demoOperands: [100], // perimeter = 100, maximize area
    minViewTime: 15,
    showMode: 'mandatory', // FIRST optimization animation
  },
  integration: {
    animationId: 'area-under-curve',
    title: 'Integration',
    description: 'Integration finds the area under a curve - the reverse of differentiation!',
    demoOperands: [0, 2, 1], // ∫x dx from 0 to 2
    minViewTime: 15,
    showMode: 'mandatory', // FIRST area-under-curve animation
  },
  indefinite_integrals: {
    animationId: 'area-under-curve',
    title: 'Antiderivatives',
    description: 'Find F(x) such that F\'(x) = f(x). Don\'t forget + C!',
    demoOperands: [2, 1], // ∫2x dx = x² + C
    minViewTime: 10,
    showMode: 'optional',
  },
  definite_integrals: {
    animationId: 'area-under-curve',
    title: 'Definite Integrals',
    description: '∫ₐᵇ f(x)dx = F(b) - F(a) - the exact area between a and b!',
    demoOperands: [1, 3, 1], // ∫x² dx from 1 to 3
    minViewTime: 10,
    showMode: 'optional',
  },
  area_under_curve: {
    animationId: 'area-under-curve',
    title: 'Area Under Curves',
    description: 'The definite integral gives the signed area between the curve and x-axis!',
    demoOperands: [0, 4, 1], // area under √x from 0 to 4
    minViewTime: 10,
    showMode: 'optional',
  },

  volume_revolution: {
    animationId: 'volume-revolution',
    title: 'Solids of Revolution',
    description: 'Rotate a curve around an axis to create a 3D solid, then find its volume!',
    demoOperands: [1, 0, 4],
    minViewTime: 15,
    showMode: 'mandatory',
  },

  // ===== Level M: Trigonometry (15 concepts) =====
  analytic_geometry: {
    animationId: 'coordinate-plot',
    title: 'Analytic Geometry',
    description: 'Study geometry using coordinates - distance, midpoint, slope!',
    demoOperands: [1, 2, 4, 6], // points (1,2) and (4,6)
    minViewTime: 10,
    showMode: 'optional',
  },
  equation_of_line: {
    animationId: 'coordinate-plot',
    title: 'Equations of Lines',
    description: 'y = mx + b (slope-intercept) or y - y₁ = m(x - x₁) (point-slope)',
    demoOperands: [2, -3], // y = 2x - 3
    minViewTime: 10,
    showMode: 'optional',
  },
  equation_of_circle: {
    animationId: 'coordinate-plot',
    title: 'Equations of Circles',
    description: '(x - h)² + (y - k)² = r² - center at (h, k), radius r',
    demoOperands: [2, 3, 5], // center (2,3), radius 5
    minViewTime: 10,
    showMode: 'optional',
  },
  locus: {
    animationId: 'coordinate-plot',
    title: 'Locus of Points',
    description: 'A locus is a set of points satisfying a given condition!',
    demoOperands: [0, 0, 3], // points at distance 3 from origin
    minViewTime: 10,
    showMode: 'optional',
  },
  trigonometry: {
    animationId: 'unit-circle',
    title: 'Trigonometry',
    description: 'The study of triangles! Sin, cos, tan relate angles to ratios.',
    demoOperands: [30], // 30 degrees
    minViewTime: 15,
    showMode: 'mandatory', // FIRST unit-circle animation
  },
  trig_ratios: {
    animationId: 'triangle-trig',
    title: 'Trig Ratios',
    description: 'SOH-CAH-TOA: Sin = Opp/Hyp, Cos = Adj/Hyp, Tan = Opp/Adj',
    demoOperands: [3, 4, 5], // 3-4-5 right triangle
    minViewTime: 15,
    showMode: 'mandatory', // FIRST triangle-trig animation
  },
  trig_properties: {
    animationId: 'unit-circle',
    title: 'Trig Identities',
    description: 'sin²θ + cos²θ = 1, and many more useful relationships!',
    demoOperands: [45], // 45 degrees
    minViewTime: 10,
    showMode: 'optional',
  },
  trig_equations: {
    animationId: 'unit-circle',
    title: 'Solving Trig Equations',
    description: 'Find all angles that satisfy the equation - often infinitely many!',
    demoOperands: [30, 150], // sin θ = 1/2
    minViewTime: 10,
    showMode: 'optional',
  },
  trig_graphs: {
    animationId: 'trig-graph',
    title: 'Graphs of Trig Functions',
    description: 'Sine and cosine make waves! Period, amplitude, and phase shift.',
    demoOperands: [1, 2, 0, 0], // y = sin(2x)
    minViewTime: 15,
    showMode: 'mandatory', // FIRST trig-graph animation
  },
  trig_inequalities: {
    animationId: 'trig-graph',
    title: 'Trig Inequalities',
    description: 'Find where sin x > 1/2 - look at the graph!',
    demoOperands: [1, 1, 0, 0.5], // sin x > 0.5
    minViewTime: 10,
    showMode: 'optional',
  },
  addition_formulas: {
    animationId: 'unit-circle',
    title: 'Addition Formulas',
    description: 'sin(A + B) = sin A cos B + cos A sin B',
    demoOperands: [30, 45], // sin(30° + 45°)
    minViewTime: 10,
    showMode: 'optional',
  },
  double_angle_formulas: {
    animationId: 'unit-circle',
    title: 'Double Angle Formulas',
    description: 'sin(2θ) = 2 sin θ cos θ, cos(2θ) = cos²θ - sin²θ',
    demoOperands: [30], // sin(60°) from sin(30°)
    minViewTime: 10,
    showMode: 'optional',
  },
  law_of_sines: {
    animationId: 'triangle-trig',
    title: 'Law of Sines',
    description: 'a/sin A = b/sin B = c/sin C - works for any triangle!',
    demoOperands: [5, 30, 7, 45], // side a=5, angle A=30°, side b=7
    minViewTime: 10,
    showMode: 'optional',
  },
  law_of_cosines: {
    animationId: 'triangle-trig',
    title: 'Law of Cosines',
    description: 'c² = a² + b² - 2ab·cos C - the generalized Pythagorean theorem!',
    demoOperands: [5, 7, 60], // sides 5 and 7, included angle 60°
    minViewTime: 10,
    showMode: 'optional',
  },
  area_triangle_trig: {
    animationId: 'triangle-trig',
    title: 'Triangle Area with Trig',
    description: 'Area = ½ab·sin C - when you know two sides and the included angle!',
    demoOperands: [6, 8, 45], // sides 6 and 8, angle 45°
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level N: Sequences & Advanced Calculus (16 concepts) =====
  sequences: {
    animationId: 'sequence-series',
    title: 'Sequences',
    description: 'An ordered list of numbers following a pattern: 2, 5, 8, 11, ...',
    demoOperands: [2, 3, 4], // start at 2, add 3, 4 terms
    minViewTime: 15,
    showMode: 'mandatory', // FIRST sequence-series animation
  },
  arithmetic_sequences: {
    animationId: 'sequence-series',
    title: 'Arithmetic Sequences',
    description: 'Add the same amount each time! aₙ = a₁ + (n-1)d',
    demoOperands: [3, 4, 5], // first term 3, difference 4
    minViewTime: 10,
    showMode: 'optional',
  },
  geometric_sequences: {
    animationId: 'sequence-series',
    title: 'Geometric Sequences',
    description: 'Multiply by the same ratio each time! aₙ = a₁ · rⁿ⁻¹',
    demoOperands: [2, 3, 4], // first term 2, ratio 3
    minViewTime: 10,
    showMode: 'optional',
  },
  recurrence_relations: {
    animationId: 'recurrence-induction',
    title: 'Recurrence Relations',
    description: 'Define each term using previous terms: aₙ = aₙ₋₁ + aₙ₋₂ (Fibonacci!)',
    demoOperands: [1, 1, 5], // a₁=1, a₂=1, find 5 terms
    minViewTime: 15,
    showMode: 'mandatory', // FIRST recurrence-induction animation
  },
  mathematical_induction: {
    animationId: 'recurrence-induction',
    title: 'Mathematical Induction',
    description: 'Prove for n=1, assume for n=k, prove for n=k+1 - like dominoes!',
    demoOperands: [1, 2, 3], // base case, hypothesis, step
    minViewTime: 10,
    showMode: 'optional',
  },
  infinite_sequences: {
    animationId: 'sequence-series',
    title: 'Infinite Sequences',
    description: 'Does the sequence approach a limit as n → ∞?',
    demoOperands: [1, 2], // 1/n → 0 as n → ∞
    minViewTime: 10,
    showMode: 'optional',
  },
  infinite_series: {
    animationId: 'sequence-series',
    title: 'Infinite Series',
    description: 'Sum infinitely many terms! 1 + 1/2 + 1/4 + ... = 2',
    demoOperands: [1, 0.5, 10], // geometric series, ratio 0.5
    minViewTime: 10,
    showMode: 'optional',
  },
  convergence: {
    animationId: 'sequence-series',
    title: 'Convergence Tests',
    description: 'Does the series converge or diverge? Ratio test, comparison test, and more!',
    demoOperands: [1, 2, 3], // generic
    minViewTime: 10,
    showMode: 'optional',
  },
  limit_of_functions: {
    animationId: 'limit-approach',
    title: 'Limits of Functions',
    description: 'Limits at infinity: what happens as x → ∞ or x → -∞?',
    demoOperands: [1, 1], // 1/x → 0 as x → ∞
    minViewTime: 10,
    showMode: 'optional',
  },
  trig_differentiation: {
    animationId: 'advanced-differentiation',
    title: 'Trig Derivatives',
    description: 'd/dx[sin x] = cos x, d/dx[cos x] = -sin x',
    demoOperands: [1, 2], // d/dx[sin(2x)]
    minViewTime: 15,
    showMode: 'mandatory', // FIRST advanced-differentiation animation
  },
  log_differentiation: {
    animationId: 'advanced-differentiation',
    title: 'Logarithmic Derivatives',
    description: 'd/dx[ln x] = 1/x. Use chain rule for ln(f(x))!',
    demoOperands: [1, 2], // d/dx[ln(x²)]
    minViewTime: 10,
    showMode: 'optional',
  },
  exponential_differentiation: {
    animationId: 'advanced-differentiation',
    title: 'Exponential Derivatives',
    description: 'd/dx[eˣ] = eˣ - it\'s its own derivative! For eᶠ⁽ˣ⁾, use chain rule.',
    demoOperands: [1, 3], // d/dx[e^(3x)]
    minViewTime: 10,
    showMode: 'optional',
  },
  higher_order_derivatives: {
    animationId: 'advanced-differentiation',
    title: 'Higher Derivatives',
    description: "f''(x) is the derivative of f'(x). It measures how the slope changes!",
    demoOperands: [1, -3, 2, 0], // f(x) = x³ - 3x² + 2x
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level O: Advanced Calculus (13 concepts) =====
  curve_sketching: {
    animationId: 'curve-analysis',
    title: 'Curve Sketching',
    description: 'Use derivatives to find all key features: intercepts, extrema, inflection points!',
    demoOperands: [1, -6, 9, 0], // f(x) = x³ - 6x² + 9x
    minViewTime: 15,
    showMode: 'mandatory', // FIRST curve-analysis animation
  },
  concavity: {
    animationId: 'curve-analysis',
    title: 'Concavity',
    description: "f''(x) > 0 means concave up (smile), f''(x) < 0 means concave down (frown)!",
    demoOperands: [1, 0, -3, 0], // f(x) = x³ - 3x
    minViewTime: 10,
    showMode: 'optional',
  },
  advanced_maxima_minima: {
    animationId: 'curve-analysis',
    title: 'Second Derivative Test',
    description: "At critical points: f''(c) > 0 → minimum, f''(c) < 0 → maximum",
    demoOperands: [1, -3, 0, 2], // f(x) = x³ - 3x
    minViewTime: 10,
    showMode: 'optional',
  },
  integration_by_substitution: {
    animationId: 'integration-methods',
    title: 'U-Substitution',
    description: 'Let u = g(x), then du = g\'(x)dx. Simplifies the integral!',
    demoOperands: [1, 2], // ∫2x·e^(x²) dx, let u = x²
    minViewTime: 15,
    showMode: 'mandatory', // FIRST integration-methods animation
  },
  integration_by_parts: {
    animationId: 'integration-methods',
    title: 'Integration by Parts',
    description: '∫u dv = uv - ∫v du. Choose u and dv wisely using LIATE!',
    demoOperands: [1, 1], // ∫x·eˣ dx
    minViewTime: 10,
    showMode: 'optional',
  },
  advanced_definite_integrals: {
    animationId: 'integration-methods',
    title: 'Advanced Integrals',
    description: 'Combine techniques: substitution, parts, partial fractions!',
    demoOperands: [1, 4, 2], // complex integral
    minViewTime: 10,
    showMode: 'optional',
  },
  area_between_curves: {
    animationId: 'area-under-curve',
    title: 'Area Between Curves',
    description: '∫(top - bottom)dx or ∫(right - left)dy for the area between two curves!',
    demoOperands: [0, 2, 1, 2], // area between x² and 2x
    minViewTime: 10,
    showMode: 'optional',
  },
  volume_disk_washer: {
    animationId: 'volume-revolution',
    title: 'Disk/Washer Method',
    description: 'V = π∫r² dx for disks, V = π∫(R² - r²) dx for washers!',
    demoOperands: [1, 0, 4], // rotate y = √x around x-axis
    minViewTime: 15,
    showMode: 'mandatory', // FIRST volume-revolution animation
  },
  volume_shell: {
    animationId: 'volume-revolution',
    title: 'Shell Method',
    description: 'V = 2π∫r·h dx - cylindrical shells when rotating around an axis!',
    demoOperands: [1, 0, 4], // rotate y = √x around y-axis
    minViewTime: 10,
    showMode: 'optional',
  },
  arc_length: {
    animationId: 'area-under-curve',
    title: 'Arc Length',
    description: "L = ∫√(1 + [f'(x)]²) dx - the length along the curve!",
    demoOperands: [0, 2], // arc length of f(x) from 0 to 2
    minViewTime: 10,
    showMode: 'optional',
  },
  differential_equations: {
    animationId: 'curve-analysis',
    title: 'Differential Equations',
    description: 'Equations involving derivatives: dy/dx = f(x, y). Find y!',
    demoOperands: [1, 2], // dy/dx = 2x
    minViewTime: 10,
    showMode: 'optional',
  },
  separable_de: {
    animationId: 'curve-analysis',
    title: 'Separable DEs',
    description: 'Separate variables: g(y)dy = f(x)dx, then integrate both sides!',
    demoOperands: [1, 1], // dy/dx = xy → dy/y = x dx
    minViewTime: 10,
    showMode: 'optional',
  },
  first_order_linear_de: {
    animationId: 'curve-analysis',
    title: 'First-Order Linear DEs',
    description: 'dy/dx + P(x)y = Q(x). Use integrating factor μ = e^(∫P dx)!',
    demoOperands: [1, 2, 1], // dy/dx + 2y = x
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level XV: Vectors (6 concepts) =====
  vectors_2d: {
    animationId: 'coordinate-plot',
    title: '2D Vectors',
    description: 'Vectors have magnitude and direction. Represent them as arrows on a plane!',
    demoOperands: [3, 4],
    minViewTime: 15,
    showMode: 'mandatory',
  },
  vectors_3d: {
    animationId: 'coordinate-plot',
    title: '3D Vectors',
    description: 'Extend to three dimensions with x, y, and z components!',
    demoOperands: [1, 2, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  dot_product: {
    animationId: 'coordinate-plot',
    title: 'Dot Product',
    description: 'a . b = |a||b|cos θ — measures how aligned two vectors are!',
    demoOperands: [3, 4, 1, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  cross_product: {
    animationId: 'coordinate-plot',
    title: 'Cross Product',
    description: 'a x b gives a vector perpendicular to both! Magnitude = |a||b|sin θ',
    demoOperands: [1, 0, 0, 0, 1, 0],
    minViewTime: 10,
    showMode: 'optional',
  },
  line_equations_3d: {
    animationId: 'coordinate-plot',
    title: 'Lines in 3D',
    description: 'Parametric equations: x = x₀ + at, y = y₀ + bt, z = z₀ + ct',
    demoOperands: [1, 2, 3, 1, 1, 1],
    minViewTime: 10,
    showMode: 'optional',
  },
  plane_equations: {
    animationId: 'coordinate-plot',
    title: 'Plane Equations',
    description: 'ax + by + cz = d — a flat surface in 3D space!',
    demoOperands: [1, 1, 1, 6],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level XM: Matrices (5 concepts) =====
  matrices: {
    animationId: 'algebra-tiles',
    title: 'Matrices',
    description: 'Rectangular arrays of numbers arranged in rows and columns!',
    demoOperands: [2, 3],
    minViewTime: 15,
    showMode: 'mandatory',
  },
  matrix_multiplication: {
    animationId: 'algebra-tiles',
    title: 'Matrix Multiplication',
    description: 'Rows times columns! The (i,j) entry is the dot product of row i and column j.',
    demoOperands: [2, 3, 3, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  matrix_inverse: {
    animationId: 'algebra-tiles',
    title: 'Matrix Inverse',
    description: 'A⁻¹ is the matrix such that A · A⁻¹ = I (the identity matrix)!',
    demoOperands: [2, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  matrix_equations: {
    animationId: 'balance-scale',
    title: 'Matrix Equations',
    description: 'Solve AX = B by multiplying both sides by A⁻¹!',
    demoOperands: [2, 3, 1],
    minViewTime: 10,
    showMode: 'optional',
  },
  transformations: {
    animationId: 'coordinate-plot',
    title: 'Transformations',
    description: 'Use matrices to rotate, reflect, scale, and translate points!',
    demoOperands: [1, 0, 0, 1],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level XP: Permutations & Probability (6 concepts) =====
  permutations: {
    animationId: 'counting-objects',
    title: 'Permutations',
    description: 'How many ways to arrange items? Order matters! n! / (n-r)!',
    demoOperands: [5, 3],
    minViewTime: 15,
    showMode: 'mandatory',
  },
  combinations: {
    animationId: 'counting-objects',
    title: 'Combinations',
    description: 'How many ways to choose items? Order does NOT matter! n! / (r!(n-r)!)',
    demoOperands: [5, 2],
    minViewTime: 10,
    showMode: 'optional',
  },
  binomial_theorem: {
    animationId: 'algebra-tiles',
    title: 'Binomial Theorem',
    description: '(a + b)ⁿ expands using Pascal\'s triangle and combinations!',
    demoOperands: [1, 1, 4],
    minViewTime: 10,
    showMode: 'optional',
  },
  probability: {
    animationId: 'counting-objects',
    title: 'Probability',
    description: 'P(event) = favorable outcomes / total outcomes. Between 0 and 1!',
    demoOperands: [3, 6],
    minViewTime: 15,
    showMode: 'mandatory',
  },
  conditional_probability: {
    animationId: 'counting-objects',
    title: 'Conditional Probability',
    description: 'P(A|B) = P(A and B) / P(B) — probability of A given that B happened!',
    demoOperands: [2, 5, 3],
    minViewTime: 10,
    showMode: 'optional',
  },
  expected_value: {
    animationId: 'coordinate-plot',
    title: 'Expected Value',
    description: 'E(X) = Σ x · P(x) — the long-run average outcome!',
    demoOperands: [1, 2, 3, 4],
    minViewTime: 10,
    showMode: 'optional',
  },

  // ===== Level XS: Statistics (6 concepts) =====
  statistics_intro: {
    animationId: 'coordinate-plot',
    title: 'Statistics',
    description: 'Collect, organize, and interpret data to find patterns and make decisions!',
    demoOperands: [5, 8, 12, 7, 10],
    minViewTime: 15,
    showMode: 'mandatory',
  },
  binomial_distribution: {
    animationId: 'coordinate-plot',
    title: 'Binomial Distribution',
    description: 'n trials, each with probability p of success. How many successes?',
    demoOperands: [10, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
  probability_density: {
    animationId: 'coordinate-plot',
    title: 'Probability Density',
    description: 'Continuous distributions use density functions — area under the curve = probability!',
    demoOperands: [0, 1],
    minViewTime: 10,
    showMode: 'optional',
  },
  normal_distribution: {
    animationId: 'coordinate-plot',
    title: 'Normal Distribution',
    description: 'The bell curve! 68% within 1σ, 95% within 2σ, 99.7% within 3σ.',
    demoOperands: [0, 1],
    minViewTime: 10,
    showMode: 'optional',
  },
  sampling: {
    animationId: 'counting-objects',
    title: 'Sampling',
    description: 'Choose a representative subset of a population to study!',
    demoOperands: [100, 30],
    minViewTime: 10,
    showMode: 'optional',
  },
  hypothesis_testing: {
    animationId: 'coordinate-plot',
    title: 'Hypothesis Testing',
    description: 'Test a claim about a population using sample data and p-values!',
    demoOperands: [0, 1, 5],
    minViewTime: 10,
    showMode: 'optional',
  },
}

/**
 * Get the animation config for a concept
 * Returns undefined if concept is not mapped
 */
export function getConceptAnimation(concept: string): ConceptIntroConfig | undefined {
  return CONCEPT_INTRO_CONFIG[concept]
}

/**
 * Check if a concept has an animation mapping
 */
export function hasConceptAnimation(concept: string): boolean {
  return concept in CONCEPT_INTRO_CONFIG
}

/**
 * Get all mapped concept names
 */
export function getMappedConcepts(): string[] {
  return Object.keys(CONCEPT_INTRO_CONFIG)
}
