/**
 * Animation System Type Definitions
 * Phase 1.12: Educational Animation System
 */

// ============================================
// ANIMATION IDENTIFIERS
// ============================================

export type AnimationId =
  // Number Line Animations (3A-A)
  | 'number-line-addition'
  | 'number-line-subtraction'
  | 'number-line-setup'
  | 'number-line-setup-subtraction'
  // Counting Animations (7A-4A)
  | 'counting-objects'
  | 'counting-objects-setup'
  | 'dot-pattern'
  | 'dot-pattern-setup'
  // Sequence Animations (5A-3A)
  | 'sequence'
  // Place Value Animations (B)
  | 'base-10-blocks'
  | 'place-value'
  | 'place-value-setup'
  | 'borrowing-setup'
  | 'carrying-setup'
  // Ten Frame Animations (2A)
  | 'ten-frame'
  | 'make-10-setup'
  // Subtraction Animations (3A-A)
  | 'objects-setup-subtraction'
  | 'take-away'
  // Vertical Operations (B+)
  | 'vertical-addition-setup'
  | 'vertical-subtraction-setup'
  // Multiplication Animations (C+)
  | 'array-groups'
  | 'array-setup'
  | 'area-model'
  | 'area-model-setup'
  | 'grouping-multiplication'
  // Division Animations (C+)
  | 'fair-sharing'
  | 'long-division-steps'
  | 'division-grouping-setup'
  | 'long-division-setup'
  // Fraction Animations (D+)
  | 'fraction-bar'
  | 'fraction-circle'
  | 'fraction-operation'
  | 'fraction-addition'
  | 'fraction-subtraction'
  | 'fraction-multiply'
  | 'fraction-divide'
  | 'equivalent-fractions'
  // Algebra Animations (G+)
  | 'algebra-tiles'
  | 'balance-scale'
  | 'number-line-algebra'
  | 'coordinate-plot'
  // Polynomial/Quadratic Animations (I+)
  | 'foil-visual'
  | 'factoring-visual'
  | 'parabola-graph'
  | 'quadratic-formula'
  | 'complex-plane'
  // Advanced Algebra Animations (J+)
  | 'polynomial-division'
  | 'advanced-factoring'
  | 'discriminant'
  | 'proof-steps'
  // Function Animations (K+)
  | 'function-graph'
  | 'function-transform'
  | 'exponential-graph'
  | 'exponential-log'
  | 'rational-function'
  | 'irrational-function'
  // Calculus Animations (L+)
  | 'limit-approach'
  | 'tangent-line'
  | 'area-under-curve'
  | 'curve-sketch'
  | 'optimization'
  // Trigonometry Animations (M+)
  | 'unit-circle'
  | 'trig-graph'
  | 'triangle-trig'
  // Sequence Animations (N)
  | 'sequence-advanced'
  | 'sequence-series'
  | 'series-sum'
  | 'recurrence-induction'
  // Advanced Differentiation (N)
  | 'advanced-differentiation'
  // Advanced Calculus Animations (O)
  | 'curve-analysis'
  | 'integration-methods'
  | 'volume-revolution'
  // Generic
  | 'generic-hint'

// ============================================
// PROBLEM DATA TYPES
// ============================================

export interface ProblemData {
  /** The numbers involved in the problem */
  operands?: number[]
  /** The operation type */
  operation?: 'addition' | 'subtraction' | 'multiplication' | 'division'
  /** The correct answer */
  correctAnswer?: number | string
  /** Additional problem context */
  context?: Record<string, unknown>
}

// ============================================
// ANIMATION STATE
// ============================================

export type AnimationState = 'idle' | 'playing' | 'paused' | 'complete'

export interface AnimationControls {
  play: () => void
  pause: () => void
  reset: () => void
  seek: (time: number) => void
}

// ============================================
// ANIMATION COMPONENT PROPS
// ============================================

export interface BaseAnimationProps {
  /** Problem data for dynamic visualization */
  problemData?: ProblemData
  /**
   * PEDAGOGICAL: Show only the setup, NOT the solution
   * When false (default), shows the setup to prompt thinking
   * When true, shows the full animation with solution
   */
  showSolution?: boolean
  /**
   * Controls whether animation is paused without resetting state
   * When true, animation freezes at current position
   * When false/undefined (default), animation plays normally
   * This is separate from showSolution to allow pause/resume without restart
   */
  isPaused?: boolean
  /** Callback when animation completes */
  onComplete?: () => void
  /** Additional CSS classes */
  className?: string
}

export interface NumberLineAnimationProps extends BaseAnimationProps {
  /** Whether this is a subtraction animation (moves left) */
  isSubtraction?: boolean
  /** Custom min/max range */
  range?: { min: number; max: number }
}

export interface CountingObjectsAnimationProps extends BaseAnimationProps {
  /** Object emoji to display */
  objectEmoji?: string
  /** Whether to show group separation */
  showGroups?: boolean
}

export interface TenFrameAnimationProps extends BaseAnimationProps {
  /** Whether to show make-10 strategy */
  showMake10?: boolean
  /** Filled dot color */
  filledColor?: string
}

export interface PlaceValueAnimationProps extends BaseAnimationProps {
  /** Show regrouping animation */
  showRegrouping?: boolean
  /** Operation type for vertical format */
  operationType?: 'addition' | 'subtraction'
}

export interface Base10BlocksAnimationProps extends BaseAnimationProps {
  /** Show combining animation */
  showCombining?: boolean
}

// ============================================
// ANIMATION PLAYER PROPS
// ============================================

export interface AnimationPlayerProps {
  /** The animation component to render */
  children: React.ReactNode
  /** Show play/pause controls */
  showControls?: boolean
  /** Show progress bar */
  showProgress?: boolean
  /** Auto-play on mount */
  autoPlay?: boolean
  /** Loop the animation */
  loop?: boolean
  /** Callback when animation completes */
  onComplete?: () => void
  /** Additional CSS classes */
  className?: string
}

// ============================================
// ANIMATION CONFIGURATION
// ============================================

export interface AnimationConfig {
  id: AnimationId
  /** Duration in seconds */
  duration: number
  /** Steps for multi-step animations */
  steps?: number
  /** Whether animation can be paused */
  pausable?: boolean
  /** Whether animation can be skipped */
  skippable?: boolean
  /** Minimum view time before skip is allowed (seconds) */
  minViewTime?: number
}

export const DEFAULT_ANIMATION_CONFIG: Partial<AnimationConfig> = {
  duration: 10,
  pausable: true,
  skippable: true,
  minViewTime: 3,
}

// ============================================
// HINT ANIMATION MAPPING
// ============================================

export interface HintAnimationMapping {
  /** Animation ID to use */
  animationId: AnimationId
  /** Hint text to display */
  text: string
  /** Animation configuration overrides */
  config?: Partial<AnimationConfig>
}

/**
 * Maps problem types to their visual hint animations
 * Used by hintGenerator.ts to return appropriate animations
 *
 * ALIGNED WITH ACTUAL KUMON PROBLEM TYPES FROM types.ts
 */
export const PROBLEM_TYPE_ANIMATIONS: Record<string, HintAnimationMapping> = {
  // ============================================
  // LEVEL 7A: Counting to 10 (Pre-K 3-4)
  // ============================================
  'count_pictures_to_5': {
    animationId: 'counting-objects-setup',
    text: 'Point to each picture as you count. 1, 2, 3...',
  },
  'count_pictures_to_10': {
    animationId: 'counting-objects-setup',
    text: 'Touch each one as you count. Don\'t skip any!',
  },
  'count_dots_to_10': {
    animationId: 'dot-pattern-setup',
    text: 'Count each dot. How many do you see?',
  },
  'match_quantity_to_numeral': {
    animationId: 'counting-objects-setup',
    text: 'Count the objects first. Which number matches?',
  },
  'dot_pattern_recognition': {
    animationId: 'dot-pattern-setup',
    text: 'Look at the pattern. How many dots?',
  },

  // ============================================
  // LEVEL 6A: Counting to 30 (Pre-K 4-5)
  // ============================================
  'count_to_5': {
    animationId: 'counting-objects-setup',
    text: 'Count carefully: 1, 2, 3, 4, 5',
  },
  'count_to_10': {
    animationId: 'counting-objects-setup',
    text: 'Count each object. Touch and count!',
  },
  'count_to_20': {
    animationId: 'counting-objects-setup',
    text: 'Keep counting past 10: 11, 12, 13...',
  },
  'count_to_30': {
    animationId: 'counting-objects-setup',
    text: 'After 20 comes 21, 22, 23...',
  },
  'number_reading_to_10': {
    animationId: 'counting-objects-setup',
    text: 'What number is this? Count the dots to check.',
  },
  'dot_recognition_to_10': {
    animationId: 'dot-pattern-setup',
    text: 'How many dots? You can count or recognize the pattern.',
  },
  'dot_recognition_to_20': {
    animationId: 'dot-pattern-setup',
    text: 'Count the dots. Group by 5s or 10s to help!',
  },

  // ============================================
  // LEVEL 5A: Numbers to 50, Sequences (Pre-K/K)
  // ============================================
  'number_reading_to_30': {
    animationId: 'counting-objects-setup',
    text: 'This is a number. Say it out loud!',
  },
  'sequence_to_30': {
    animationId: 'number-line-setup',
    text: 'What number comes next? Count forward.',
  },
  'sequence_to_40': {
    animationId: 'number-line-setup',
    text: 'Fill in the missing number. What comes before? After?',
  },
  'sequence_to_50': {
    animationId: 'number-line-setup',
    text: 'The numbers go in order. Which one is missing?',
  },
  'number_before_after': {
    animationId: 'number-line-setup',
    text: 'Think: what comes just before? Just after?',
  },

  // ============================================
  // LEVEL 4A: Writing Numbers (K 5-6)
  // ============================================
  'trace_number_1_to_10': {
    animationId: 'counting-objects-setup',
    text: 'Trace the number. Start at the dot.',
  },
  'write_number_1_to_10': {
    animationId: 'counting-objects-setup',
    text: 'Write the number that matches how many objects.',
  },
  'write_number_1_to_20': {
    animationId: 'counting-objects-setup',
    text: 'Count the objects, then write the number.',
  },
  'write_number_1_to_30': {
    animationId: 'counting-objects-setup',
    text: 'How many? Write the number.',
  },
  'write_number_1_to_50': {
    animationId: 'counting-objects-setup',
    text: 'Count carefully, then write your answer.',
  },
  'number_table_completion': {
    animationId: 'number-line-setup',
    text: 'What number is missing from the table?',
  },
  'match_number_to_objects': {
    animationId: 'counting-objects-setup',
    text: 'Count the objects. Find the matching number.',
  },

  // ============================================
  // LEVEL 3A: Adding +1, +2, +3 (K-1)
  // ============================================
  'sequence_to_100': {
    animationId: 'number-line-setup',
    text: 'What number comes next? Keep counting.',
  },
  'sequence_to_120': {
    animationId: 'number-line-setup',
    text: 'After 99 comes 100, then 101, 102...',
  },
  'add_1_small': {
    animationId: 'number-line-addition',
    text: 'Adding 1 means "one more". What comes next?',
  },
  'add_1_medium': {
    animationId: 'number-line-addition',
    text: 'Plus 1 is the very next number. Count on!',
  },
  'add_1_large': {
    animationId: 'number-line-addition',
    text: 'What number is 1 more than this?',
  },
  'add_2_small': {
    animationId: 'number-line-addition',
    text: 'Count on 2 from the first number.',
  },
  'add_2_medium': {
    animationId: 'number-line-addition',
    text: 'Start at the first number. Jump forward 2.',
  },
  'add_3_small': {
    animationId: 'number-line-addition',
    text: 'Count on 3: one, two, three more!',
  },
  'add_3_medium': {
    animationId: 'number-line-addition',
    text: 'Start here and count 3 jumps forward.',
  },
  'add_mixed_1_2_3': {
    animationId: 'number-line-addition',
    text: 'Count on from the bigger number.',
  },

  // ============================================
  // LEVEL 2A: Adding +4 to +10 (Grade 1)
  // ============================================
  'add_review_1_2_3': {
    animationId: 'number-line-addition',
    text: 'Count on from the first number.',
  },
  'add_4': {
    animationId: 'make-10-setup',
    text: 'Can you make 10 first? Then add what\'s left.',
  },
  'add_5': {
    animationId: 'make-10-setup',
    text: 'Adding 5 is like half of 10. Use the ten-frame!',
  },
  'add_up_to_5': {
    animationId: 'number-line-addition',
    text: 'Count on from the bigger number.',
  },
  'add_6': {
    animationId: 'make-10-setup',
    text: 'Make 10 first if you can!',
  },
  'add_7': {
    animationId: 'make-10-setup',
    text: 'Think: how many more to make 10?',
  },
  'add_up_to_7': {
    animationId: 'make-10-setup',
    text: 'Try making 10 as a stepping stone.',
  },
  'add_8': {
    animationId: 'make-10-setup',
    text: '8 needs just 2 more to make 10. Then what?',
  },
  'add_9': {
    animationId: 'make-10-setup',
    text: '9 + 1 = 10. So 9 + anything is close to 10 + something!',
  },
  'add_10': {
    animationId: 'make-10-setup',
    text: 'Adding 10 is easy! The ones stay the same.',
  },
  'add_up_to_10': {
    animationId: 'make-10-setup',
    text: 'Look for pairs that make 10!',
  },

  // ============================================
  // LEVEL A: Subtraction (Grades 1-2)
  // ============================================
  'addition_sums_to_12': {
    animationId: 'number-line-addition',
    text: 'Start at the first number and count forward.',
  },
  'addition_sums_to_15': {
    animationId: 'make-10-setup',
    text: 'Can you make 10 first? Then add the rest.',
  },
  'addition_sums_to_18': {
    animationId: 'make-10-setup',
    text: 'Use the make-10 strategy!',
  },
  'addition_sums_to_20': {
    animationId: 'make-10-setup',
    text: 'Make 10, then add what\'s left.',
  },
  'addition_sums_to_24': {
    animationId: 'make-10-setup',
    text: 'Think about making 10 or 20.',
  },
  'addition_sums_to_28': {
    animationId: 'place-value-setup',
    text: 'Add the ones. Do you need to regroup?',
  },
  'addition_summary': {
    animationId: 'number-line-addition',
    text: 'Use what you know about adding!',
  },
  'subtract_1': {
    animationId: 'number-line-setup-subtraction',
    text: 'Subtracting 1 means "one less". What comes before?',
  },
  'subtract_2': {
    animationId: 'number-line-setup-subtraction',
    text: 'Count back 2 from the first number.',
  },
  'subtract_3': {
    animationId: 'number-line-setup-subtraction',
    text: 'Count back 3: three, two, one less!',
  },
  'subtract_up_to_3': {
    animationId: 'number-line-setup-subtraction',
    text: 'Start at the big number and count backwards.',
  },
  'subtract_up_to_5': {
    animationId: 'objects-setup-subtraction',
    text: 'Cross out the ones you\'re taking away.',
  },
  'subtract_from_10': {
    animationId: 'make-10-setup',
    text: 'If you know 10 - ? = answer, this is the same!',
  },
  'subtract_from_11': {
    animationId: 'objects-setup-subtraction',
    text: 'Think of 11 as 10 + 1. What\'s left?',
  },
  'subtract_from_12': {
    animationId: 'objects-setup-subtraction',
    text: 'How many are left after taking away?',
  },
  'subtract_from_14': {
    animationId: 'objects-setup-subtraction',
    text: 'Cross them out and count what\'s left.',
  },
  'subtract_from_16': {
    animationId: 'objects-setup-subtraction',
    text: 'Think about the related addition fact.',
  },
  'subtract_from_20': {
    animationId: 'objects-setup-subtraction',
    text: '20 take away means counting back from 20.',
  },
  'subtraction_summary': {
    animationId: 'number-line-setup-subtraction',
    text: 'Use what you know about subtracting!',
  },

  // ============================================
  // LEVEL B: Vertical Operations, Regrouping (Grade 2)
  // ============================================
  'addition_review': {
    animationId: 'number-line-addition',
    text: 'Add by counting on or making 10.',
  },
  'vertical_addition_2digit_no_carry': {
    animationId: 'place-value-setup',
    text: 'Line up the ones. Add ones, then tens.',
  },
  'vertical_addition_2digit_with_carry': {
    animationId: 'carrying-setup',
    text: 'Add the ones first. If 10 or more, carry to tens!',
  },
  'vertical_addition_3digit': {
    animationId: 'carrying-setup',
    text: 'Start with ones, then tens, then hundreds. Carry if needed.',
  },
  'subtraction_review': {
    animationId: 'number-line-setup-subtraction',
    text: 'Subtract by counting back or thinking addition.',
  },
  'vertical_subtraction_2digit_no_borrow': {
    animationId: 'place-value-setup',
    text: 'Subtract ones, then tens. Easy when no borrowing!',
  },
  'vertical_subtraction_2digit_with_borrow': {
    animationId: 'borrowing-setup',
    text: 'Can you subtract the ones? If not, borrow from tens!',
  },
  'vertical_subtraction_3digit': {
    animationId: 'borrowing-setup',
    text: 'Start with ones. Borrow if needed from the next place.',
  },
  'mixed_add_subtract_2digit': {
    animationId: 'place-value-setup',
    text: 'Is this adding or subtracting? Check the sign!',
  },

  // ============================================
  // LEVEL C: Multiplication & Division (Grade 3)
  // ============================================
  'review_level_b': {
    animationId: 'place-value-setup',
    text: 'Remember: line up by place value!',
  },
  'times_table_2_3': {
    animationId: 'array-setup',
    text: 'Think of groups! 2 groups of 3 or 3 groups of 2.',
  },
  'times_table_4_5': {
    animationId: 'array-setup',
    text: 'Use your times tables or count by groups.',
  },
  'times_table_6_7': {
    animationId: 'array-setup',
    text: 'Draw an array to help you see it.',
  },
  'times_table_8_9': {
    animationId: 'array-setup',
    text: 'For 9s, use the finger trick or patterns!',
  },
  'multiplication_2digit_by_1digit': {
    animationId: 'area-model-setup',
    text: 'Break the big number into tens and ones.',
  },
  'multiplication_3digit_by_1digit': {
    animationId: 'area-model-setup',
    text: 'Multiply each place value, then add.',
  },
  'multiplication_4digit_by_1digit': {
    animationId: 'area-model-setup',
    text: 'Go place by place: ones, tens, hundreds, thousands.',
  },
  'division_intro': {
    animationId: 'division-grouping-setup',
    text: 'Division means sharing equally into groups.',
  },
  'division_exact': {
    animationId: 'division-grouping-setup',
    text: 'How many groups of this size can you make?',
  },
  'division_with_remainder': {
    animationId: 'division-grouping-setup',
    text: 'Divide, and what\'s left over is the remainder.',
  },
  'division_2digit_by_1digit': {
    animationId: 'long-division-setup',
    text: 'How many times does it go into the first digit?',
  },
  'division_3digit_by_1digit': {
    animationId: 'long-division-setup',
    text: 'Divide step by step: divide, multiply, subtract, bring down.',
  },
}
