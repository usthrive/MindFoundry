import type { ProblemHints, KumonLevel } from './types'

/**
 * Hint Generator - Creates 3-level graduated hints for problems
 *
 * PEDAGOGICAL PHILOSOPHY:
 * "Productive struggle is sacred. Scaffold through questions, not answers."
 *
 * Level 1 (Micro): Socratic QUESTIONS that prompt thinking
 * Level 2 (Visual): Show SETUP only, hide the SOLUTION
 * Level 3 (Teaching): Demonstrate with a SIMILAR problem, not the original
 */

// Helper: Generate a similar problem for teaching demos
function generateSimilarAddition(num1: number, num2: number): { operands: number[]; answer: number; question: string } {
  // Create a similar but different problem
  const newNum1 = num1 <= 5 ? num1 + 1 : num1 - 1
  const newNum2 = num2 <= 5 ? num2 + 1 : num2 - 1
  return {
    operands: [newNum1, newNum2],
    answer: newNum1 + newNum2,
    question: `${newNum1} + ${newNum2}`,
  }
}

function generateSimilarSubtraction(num1: number, num2: number): { operands: number[]; answer: number; question: string } {
  const newNum1 = num1 + 1
  const newNum2 = Math.min(num2, newNum1 - 1)
  return {
    operands: [newNum1, newNum2],
    answer: newNum1 - newNum2,
    question: `${newNum1} - ${newNum2}`,
  }
}

function generateSimilarMultiplication(num1: number, num2: number): { operands: number[]; answer: number; question: string } {
  const newNum1 = num1 <= 5 ? num1 + 1 : num1 - 1
  const newNum2 = num2 <= 5 ? num2 + 1 : num2 - 1
  return {
    operands: [newNum1, newNum2],
    answer: newNum1 * newNum2,
    question: `${newNum1} × ${newNum2}`,
  }
}

function generateSimilarDivision(dividend: number, divisor: number): { operands: number[]; answer: number; question: string } {
  // Create a clean division problem
  const newDivisor = divisor <= 5 ? divisor + 1 : divisor - 1
  const newDividend = newDivisor * Math.floor(dividend / divisor)
  return {
    operands: [newDividend, newDivisor],
    answer: newDividend / newDivisor,
    question: `${newDividend} ÷ ${newDivisor}`,
  }
}

// Helper: Generate a similar fraction problem
function generateSimilarFraction(num: number, denom: number): { num: number; denom: number; display: string } {
  // Create a similar but different fraction
  const newDenom = denom <= 4 ? denom + 2 : denom - 2
  const newNum = Math.min(num, newDenom - 1) || 1
  return {
    num: newNum,
    denom: newDenom,
    display: `${newNum}/${newDenom}`,
  }
}

// Helper: Find GCD for simplifying fractions
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

// Helper: Find LCM for common denominators
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

// ============================================
// ADDITION HINTS (Socratic Approach)
// ============================================

export function generateAdditionHints(
  operands: number[],
  level: KumonLevel
): ProblemHints {
  const [num1, num2] = operands
  const bigger = Math.max(num1, num2)
  const similarProblem = generateSimilarAddition(num1, num2)

  // Pre-K / Early levels (7A-4A): Counting-based hints
  if (['7A', '6A', '5A', '4A'].includes(level)) {
    return {
      micro: {
        level: 'micro',
        // SOCRATIC: Ask, don't tell
        text: `Can you point to each one and count them all together?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        // SETUP ONLY: Show objects, no total
        text: `Look at all the objects. How many do you see?`,
        animationId: 'counting-objects-setup', // Shows objects without count
        duration: 10,
      },
      teaching: {
        level: 'teaching',
        // SIMILAR PROBLEM: Demo with different numbers
        text: `Let me show you with ${similarProblem.question}. Then you try yours!`,
        animationId: 'addition-counting-all',
        duration: 30,
      },
    }
  }

  // Level 3A-2A: Counting-on strategy
  if (['3A', '2A'].includes(level)) {
    return {
      micro: {
        level: 'micro',
        // SOCRATIC: Prompt thinking, don't give sequence
        text: `What's ${bigger} plus 1 more? Can you keep counting?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        // SETUP ONLY: Number line with starting point, no jumps shown
        text: `Look at the number line. Can you start at ${bigger} and count up?`,
        animationId: 'number-line-setup', // Shows line with starting dot only
        duration: 12,
      },
      teaching: {
        level: 'teaching',
        // SIMILAR PROBLEM
        text: `Let me show you with ${similarProblem.question} = ${similarProblem.answer}. Now try ${num1} + ${num2}!`,
        animationId: 'addition-counting-on',
        duration: 30,
      },
    }
  }

  // Level A: Strategies for adding to 20
  if (level === 'A') {
    const makes10 = (10 - num1 <= num2) && num1 < 10

    if (makes10) {
      return {
        micro: {
          level: 'micro',
          // SOCRATIC: Prompt the strategy without doing it
          text: `Hmm, what do you need to add to ${num1} to make 10?`,
          duration: 5,
        },
        visual: {
          level: 'visual',
          // SETUP: Show the 10-frame, don't fill it in
          text: `Look at the 10-frame. Can you figure out how to make 10 first?`,
          animationId: 'make-10-setup', // Empty 10-frame setup
          duration: 15,
        },
        teaching: {
          level: 'teaching',
          text: `Let me show "Make 10" with ${similarProblem.question}. Then try ${num1} + ${num2}!`,
          animationId: 'addition-make-10',
          duration: 45,
        },
      }
    }

    return {
      micro: {
        level: 'micro',
        // SOCRATIC
        text: `Which number is bigger? Can you start there and count up?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        text: `Look at the number line starting at ${bigger}. How many more do you need?`,
        animationId: 'number-line-setup',
        duration: 12,
      },
      teaching: {
        level: 'teaching',
        text: `Let me show you with ${similarProblem.question} = ${similarProblem.answer}. Now you try!`,
        animationId: 'addition-to-20',
        duration: 40,
      },
    }
  }

  // Level B+: Vertical addition with regrouping
  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Ask about the ones column
      text: `Look at the ones column. What do you get when you add those digits?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Show place value columns, don't solve
      text: `Look at the place value chart. Add the ones first - do you need to regroup?`,
      animationId: 'place-value-setup', // Shows columns without answers
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Let me show you column addition with ${similarProblem.question}. Then try yours!`,
      animationId: 'vertical-addition-with-carry',
      duration: 45,
    },
  }
}

// ============================================
// SUBTRACTION HINTS (Socratic Approach)
// ============================================

export function generateSubtractionHints(
  operands: number[],
  level: KumonLevel
): ProblemHints {
  const [num1, num2] = operands
  const similarProblem = generateSimilarSubtraction(num1, num2)

  // Early levels: Counting back
  if (['7A', '6A', '5A', '4A', '3A', '2A'].includes(level)) {
    return {
      micro: {
        level: 'micro',
        // SOCRATIC: Prompt counting back without doing it
        text: `Start at ${num1}. Can you count backwards ${num2} times?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        // SETUP: Number line with starting point only
        text: `Look at the number line at ${num1}. Which way do you jump for subtraction?`,
        animationId: 'number-line-setup-subtraction', // Start position only
        duration: 12,
      },
      teaching: {
        level: 'teaching',
        text: `Let me show you with ${similarProblem.question} = ${similarProblem.answer}. Now try ${num1} - ${num2}!`,
        animationId: 'subtraction-counting-back',
        duration: 30,
      },
    }
  }

  // Level A: Subtraction to 20
  if (level === 'A') {
    return {
      micro: {
        level: 'micro',
        // SOCRATIC: Use fact family thinking
        text: `Think: What number plus ${num2} equals ${num1}?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        text: `Look at ${num1} objects. If you take away ${num2}, how many are left?`,
        animationId: 'objects-setup-subtraction', // Shows objects, doesn't remove them
        duration: 12,
      },
      teaching: {
        level: 'teaching',
        text: `Let me show subtraction with ${similarProblem.question} = ${similarProblem.answer}. Try yours!`,
        animationId: 'subtraction-fact-family',
        duration: 40,
      },
    }
  }

  // Level B+: Vertical subtraction with borrowing
  const needsBorrow = (num1 % 10) < (num2 % 10)

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Ask about the comparison
      text: needsBorrow
        ? `Look at the ones column. Is the top digit big enough? What could you do?`
        : `Can you subtract the ones column first?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Show place values without solving
      text: needsBorrow
        ? `Look at the ones place. The top is smaller - you'll need to think about regrouping!`
        : `Look at each column. Subtract the bottom from the top.`,
      animationId: needsBorrow ? 'borrowing-setup' : 'vertical-subtraction-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Let me show you with ${similarProblem.question} = ${similarProblem.answer}. Then try ${num1} - ${num2}!`,
      animationId: needsBorrow ? 'subtraction-with-borrowing' : 'vertical-subtraction',
      duration: 45,
    },
  }
}

// ============================================
// MULTIPLICATION HINTS (Socratic Approach)
// ============================================

export function generateMultiplicationHints(
  operands: number[],
  level: KumonLevel
): ProblemHints {
  const [num1, num2] = operands
  const similarProblem = generateSimilarMultiplication(num1, num2)

  // Level C: Times tables
  if (level === 'C') {
    return {
      micro: {
        level: 'micro',
        // SOCRATIC: Ask about the meaning
        text: `How many groups of ${num2} do you have? Can you add them up?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        // SETUP: Show empty array grid, no total
        text: `Look at the array: ${num1} rows and ${num2} columns. How many squares total?`,
        animationId: 'array-setup', // Empty grid, no count shown
        duration: 15,
      },
      teaching: {
        level: 'teaching',
        text: `Let me show you with ${similarProblem.question} = ${similarProblem.answer}. Now try ${num1} × ${num2}!`,
        animationId: 'multiplication-as-repeated-addition',
        duration: 45,
      },
    }
  }

  // Level D+: Larger multiplication
  return {
    micro: {
      level: 'micro',
      text: `Can you break this into smaller parts? What's ${num1} × the ones digit?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Look at the area model. Can you find each part?`,
      animationId: 'area-model-setup', // Shows divided rectangle, no values
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `Let me show step-by-step with ${similarProblem.question}. Then try yours!`,
      animationId: 'multi-digit-multiplication',
      duration: 60,
    },
  }
}

// ============================================
// DIVISION HINTS (Socratic Approach)
// ============================================

export function generateDivisionHints(
  operands: number[],
  level: KumonLevel
): ProblemHints {
  const [dividend, divisor] = operands
  const similarProblem = generateSimilarDivision(dividend, divisor)

  // Level C: Basic division
  if (level === 'C') {
    return {
      micro: {
        level: 'micro',
        // SOCRATIC: Ask the grouping question
        text: `If you make groups of ${divisor}, how many groups can you make from ${dividend}?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        // SETUP: Show objects, circles for groups, not filled
        text: `Look at ${dividend} objects. Can you circle groups of ${divisor}?`,
        animationId: 'division-grouping-setup', // Objects without groupings shown
        duration: 15,
      },
      teaching: {
        level: 'teaching',
        text: `Let me show you with ${similarProblem.question} = ${similarProblem.answer}. Now try ${dividend} ÷ ${divisor}!`,
        animationId: 'division-as-grouping',
        duration: 45,
      },
    }
  }

  // Level D+: Long division
  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Prompt the first step
      text: `How many times does ${divisor} go into the first digit(s)?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Set up the long division. What's the first step?`,
      animationId: 'long-division-setup', // Shows format without solving
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `Let me show long division with ${similarProblem.question}. Then try ${dividend} ÷ ${divisor}!`,
      animationId: 'long-division-teaching',
      duration: 60,
    },
  }
}

// ============================================
// COUNTING / PRE-K HINTS (Socratic Approach)
// ============================================

export function generateCountingHints(
  targetCount: number,
  level: KumonLevel
): ProblemHints {
  // Level may be used for future age-appropriate hint variations
  void level

  // Create a similar counting problem
  const similarCount = targetCount <= 5 ? targetCount + 1 : targetCount - 1

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Prompt the action
      text: `Can you touch each one as you count? Start with 1...`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Objects appear but no count shown
      text: `Look at the objects. Point to each one as you count out loud!`,
      animationId: 'counting-objects-setup', // No running total displayed
      duration: 10,
    },
    teaching: {
      level: 'teaching',
      text: `Let me count ${similarCount} objects with you. Then you count yours!`,
      animationId: 'counting-demonstration',
      duration: 25,
    },
  }
}

// ============================================
// FRACTION HINTS (Socratic Approach)
// For Levels E-F: Following CPA progression
// ============================================

/**
 * Fraction Addition - Same Denominator
 * Pedagogy: "Same-sized pieces - just count them!"
 */
export function generateFractionAddSameDenomHints(
  num1: number,
  num2: number,
  denominator: number,
  level: KumonLevel
): ProblemHints {
  void level // May be used for age-appropriate variations
  const similar = generateSimilarFraction(num1, denominator)

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Prompt understanding of "same size"
      text: `Same bottom number means same-sized pieces. How many pieces total?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Show pie slices, don't combine them
      text: `Picture two pie slices: ${num1} pieces + ${num2} pieces. Count them!`,
      animationId: 'fraction-add-same-denom-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      // SIMILAR PROBLEM: Demo with different fractions
      text: `When pieces are the same size, just count: ${similar.display} + ${similar.display} = ${similar.num * 2}/${similar.denom}. Now try yours!`,
      animationId: 'fraction-add-same-denom-demo',
      duration: 40,
    },
  }
}

/**
 * Fraction Addition - Different Denominators (CRITICAL)
 * Pedagogy: "Can't add different-sized pieces! Find a common size first."
 * This is where most students struggle - the hint must address the WHY.
 */
export function generateFractionAddDiffDenomHints(
  num1: number,
  denom1: number,
  num2: number,
  denom2: number,
  level: KumonLevel
): ProblemHints {
  void level
  const commonDenom = lcm(denom1, denom2)

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Address the core misconception
      text: `Can't add different-sized pieces! What size should we cut them into?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Show two pies cut differently, don't solve
      text: `Two pies: one cut into ${denom1} slices, one into ${denom2}. What if we cut BOTH into ${commonDenom} equal pieces?`,
      animationId: 'fraction-find-common-denom-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      // SIMILAR PROBLEM: Demo finding common denominator
      text: `Watch: 1/3 + 1/4. Can't add! But 1/3 = 4/12 and 1/4 = 3/12. Now: 4/12 + 3/12 = 7/12. Try finding a common size for yours!`,
      animationId: 'fraction-add-diff-denom-demo',
      duration: 60,
    },
  }
}

/**
 * Fraction Subtraction - Same Denominator
 */
export function generateFractionSubtractSameDenomHints(
  num1: number,
  num2: number,
  denominator: number,
  level: KumonLevel
): ProblemHints {
  void level
  const similar = generateSimilarFraction(Math.max(num1, num2), denominator)

  return {
    micro: {
      level: 'micro',
      text: `Same-sized pieces! If you have ${num1} and take away ${num2}, how many are left?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Picture ${num1} pie slices. Cross out ${num2} of them. How many remain?`,
      animationId: 'fraction-subtract-same-denom-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Same denominator = same size. ${similar.num}/${similar.denom} - 1/${similar.denom} = ${similar.num - 1}/${similar.denom}. Try yours!`,
      animationId: 'fraction-subtract-same-denom-demo',
      duration: 40,
    },
  }
}

/**
 * Fraction Subtraction - Different Denominators
 */
export function generateFractionSubtractDiffDenomHints(
  num1: number,
  denom1: number,
  num2: number,
  denom2: number,
  level: KumonLevel
): ProblemHints {
  void level
  const commonDenom = lcm(denom1, denom2)

  return {
    micro: {
      level: 'micro',
      text: `Different-sized pieces! What common size should we use first?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Two pies cut differently. Convert both to ${commonDenom}ths, then subtract!`,
      animationId: 'fraction-subtract-diff-denom-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `Watch: 1/2 - 1/3. Convert: 1/2 = 3/6, 1/3 = 2/6. Now: 3/6 - 2/6 = 1/6. Find common size for yours!`,
      animationId: 'fraction-subtract-diff-denom-demo',
      duration: 60,
    },
  }
}

/**
 * Fraction Multiplication
 * Pedagogy: "OF" interpretation - What is 1/2 OF 1/3?
 */
export function generateFractionMultiplyHints(
  num1: number,
  denom1: number,
  num2: number,
  denom2: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Prompt "of" thinking
      text: `Think "OF": What is ${num2}/${denom2} of ${num1}/${denom1}?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Area model without overlap count
      text: `Draw a rectangle. Shade ${num1}/${denom1} one way, ${num2}/${denom2} the other way. Where do they overlap?`,
      animationId: 'fraction-multiply-area-model-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      // SIMILAR PROBLEM with concrete explanation
      text: `Area model: 1/2 × 1/3 means "half of one-third". Shade half one way, third the other. Overlap = 1/6. Try yours!`,
      animationId: 'fraction-multiply-demo',
      duration: 60,
    },
  }
}

/**
 * Fraction Division
 * Pedagogy: "How many groups of X fit into Y?"
 */
export function generateFractionDivideHints(
  num1: number,
  denom1: number,
  num2: number,
  denom2: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Prompt grouping thinking
      text: `How many groups of ${num2}/${denom2} fit into ${num1}/${denom1}?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Grouping model without count
      text: `Division counts groups. To count them, multiply by the "flip" (reciprocal)!`,
      animationId: 'fraction-divide-grouping-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      // SIMILAR PROBLEM: Explain why we flip
      text: `Watch: 1/2 ÷ 1/4 = "How many 1/4s in 1/2?" Flip and multiply: 1/2 × 4/1 = 2. Two quarters fit in a half! Try yours!`,
      animationId: 'fraction-divide-demo',
      duration: 60,
    },
  }
}

/**
 * General Fraction Hints - Routes to specific fraction operation
 */
export function generateFractionHints(
  operands: number[],
  operation: string,
  level: KumonLevel
): ProblemHints {
  // operands format: [num1, denom1, num2, denom2] or [num1, num2, denom] for same denom
  if (operation === 'fraction_add_same_denom' || operation === 'add_same_denom') {
    const [num1, num2, denom] = operands
    return generateFractionAddSameDenomHints(num1, num2, denom, level)
  }

  if (operation === 'fraction_add_diff_denom' || operation === 'add_diff_denom' || operation === 'fraction_addition') {
    const [num1, denom1, num2, denom2] = operands
    if (denom1 === denom2) {
      return generateFractionAddSameDenomHints(num1, num2, denom1, level)
    }
    return generateFractionAddDiffDenomHints(num1, denom1, num2, denom2, level)
  }

  if (operation === 'fraction_subtract_same_denom' || operation === 'subtract_same_denom') {
    const [num1, num2, denom] = operands
    return generateFractionSubtractSameDenomHints(num1, num2, denom, level)
  }

  if (operation === 'fraction_subtract_diff_denom' || operation === 'subtract_diff_denom' || operation === 'fraction_subtraction') {
    const [num1, denom1, num2, denom2] = operands
    if (denom1 === denom2) {
      return generateFractionSubtractSameDenomHints(num1, num2, denom1, level)
    }
    return generateFractionSubtractDiffDenomHints(num1, denom1, num2, denom2, level)
  }

  if (operation === 'fraction_multiply' || operation === 'multiply') {
    const [num1, denom1, num2, denom2] = operands
    return generateFractionMultiplyHints(num1, denom1, num2, denom2, level)
  }

  if (operation === 'fraction_divide' || operation === 'divide') {
    const [num1, denom1, num2, denom2] = operands
    return generateFractionDivideHints(num1, denom1, num2, denom2, level)
  }

  // Fallback for unknown fraction operations
  return generateGenericHints('fraction', level)
}

// ============================================
// DECIMAL HINTS (Socratic Approach)
// For Level F: Connect to fractions and place value
// ============================================

/**
 * Decimal Operations Hints
 * Pedagogy: Connect decimals to fractions and place value
 */
export function generateDecimalHints(
  operands: number[],
  operation: string,
  level: KumonLevel
): ProblemHints {
  void level
  const [num1, num2] = operands

  if (operation === 'decimal_add' || operation === 'add') {
    return {
      micro: {
        level: 'micro',
        text: `Line up the decimal points! What place value is each digit in?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        text: `Stack ${num1} and ${num2} with decimal points aligned. Add each column!`,
        animationId: 'decimal-add-place-value-setup',
        duration: 15,
      },
      teaching: {
        level: 'teaching',
        text: `Watch: 0.3 + 0.25. Line up: 0.30 + 0.25. Tenths: 3+2=5. Hundredths: 0+5=5. Answer: 0.55. Try yours!`,
        animationId: 'decimal-add-demo',
        duration: 45,
      },
    }
  }

  if (operation === 'decimal_subtract' || operation === 'subtract') {
    return {
      micro: {
        level: 'micro',
        text: `Line up the decimal points first! Do you need to add zeros?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        text: `Stack with decimal points aligned. Subtract each column, right to left!`,
        animationId: 'decimal-subtract-place-value-setup',
        duration: 15,
      },
      teaching: {
        level: 'teaching',
        text: `Watch: 0.5 - 0.23. Rewrite: 0.50 - 0.23. Hundredths: 0-3? Borrow! 10-3=7. Tenths: 4-2=2. Answer: 0.27.`,
        animationId: 'decimal-subtract-demo',
        duration: 45,
      },
    }
  }

  if (operation === 'decimal_multiply' || operation === 'multiply') {
    return {
      micro: {
        level: 'micro',
        text: `Multiply like whole numbers, then count decimal places. How many total?`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        text: `Ignore decimals, multiply. Then count: ${num1} has ___ decimal places + ${num2} has ___ = total decimal places.`,
        animationId: 'decimal-multiply-setup',
        duration: 20,
      },
      teaching: {
        level: 'teaching',
        text: `Watch: 0.3 × 0.4. Multiply: 3 × 4 = 12. Count decimals: 1 + 1 = 2. Move point 2 places: 0.12. Try yours!`,
        animationId: 'decimal-multiply-demo',
        duration: 45,
      },
    }
  }

  if (operation === 'decimal_divide' || operation === 'divide') {
    return {
      micro: {
        level: 'micro',
        text: `Move the decimal in the divisor to make it a whole number. Move the dividend the same amount!`,
        duration: 5,
      },
      visual: {
        level: 'visual',
        text: `Shift both decimals right until divisor is whole. Then divide normally!`,
        animationId: 'decimal-divide-setup',
        duration: 20,
      },
      teaching: {
        level: 'teaching',
        text: `Watch: 0.6 ÷ 0.2. Move both 1 place: 6 ÷ 2 = 3. The decimal shift keeps it equal! Try yours!`,
        animationId: 'decimal-divide-demo',
        duration: 45,
      },
    }
  }

  // Fallback
  return generateGenericHints('decimal', level)
}

/**
 * Fraction to Decimal Conversion Hints
 */
export function generateFractionToDecimalHints(
  numerator: number,
  denominator: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `A fraction IS a division! What is ${numerator} ÷ ${denominator}?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `${numerator}/${denominator} means ${numerator} divided by ${denominator}. Set up the division!`,
      animationId: 'fraction-to-decimal-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Watch: 1/4 = 1 ÷ 4. Add decimal and zeros: 1.00 ÷ 4. 4 goes into 10 twice (8), remainder 2. 4 into 20 is 5. Answer: 0.25.`,
      animationId: 'fraction-to-decimal-demo',
      duration: 60,
    },
  }
}

/**
 * Decimal to Fraction Conversion Hints
 */
export function generateDecimalToFractionHints(
  decimal: number,
  level: KumonLevel
): ProblemHints {
  void level
  const decimalStr = decimal.toString()
  const decimalPlaces = decimalStr.includes('.') ? decimalStr.split('.')[1].length : 0

  return {
    micro: {
      level: 'micro',
      text: `Read the decimal aloud! "Point two five" = "twenty-five ___ths"?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Count decimal places: ${decimalPlaces}. That's your denominator: 1${'0'.repeat(decimalPlaces)}. What's your numerator?`,
      animationId: 'decimal-to-fraction-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Watch: 0.25 = "25 hundredths" = 25/100. Simplify: 25/100 = 1/4 (divide both by 25). Try yours!`,
      animationId: 'decimal-to-fraction-demo',
      duration: 45,
    },
  }
}

// ============================================
// ORDER OF OPERATIONS HINTS (Socratic Approach)
// For Level F: PEMDAS with understanding
// ============================================

/**
 * Order of Operations Hints
 * Pedagogy: Show WHY order matters, not just PEMDAS memorization
 */
export function generateOrderOfOperationsHints(
  expression: string,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Ask about grouping
      text: `Which operation should you do FIRST? Look for parentheses, then exponents, then × ÷, then + −.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      // SETUP: Show expression with highlighted parts
      text: `Circle the part to do first. Parentheses? Exponents? Multiplication/Division? Then work left to right!`,
      animationId: 'order-of-operations-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      // SIMILAR PROBLEM: Show why order matters
      text: `Watch: 2 + 3 × 4. If left-to-right: 20. But math says: multiply first! 3×4=12, then 2+12=14. Order matters because × is "groups of"!`,
      animationId: 'order-of-operations-demo',
      duration: 60,
    },
  }
}

/**
 * Order of Operations with Fractions Hints
 */
export function generateOrderOfOpsFractionsHints(
  operands: number[],
  level: KumonLevel
): ProblemHints {
  void operands
  void level

  return {
    micro: {
      level: 'micro',
      text: `Same rules apply with fractions! Find × and ÷ first (left to right), then + and −.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Mark the operations: which are × ÷ (do first)? Which are + − (do last)? Work left to right within each group!`,
      animationId: 'order-of-ops-fractions-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `Watch: 1/2 + 1/3 × 1/4. Multiply first: 1/3 × 1/4 = 1/12. Then add: 1/2 + 1/12 = 6/12 + 1/12 = 7/12. Try yours!`,
      animationId: 'order-of-ops-fractions-demo',
      duration: 60,
    },
  }
}

// ============================================
// GENERIC HINT GENERATOR (Socratic Approach)
// ============================================

export function generateGenericHints(
  operation: string,
  level: KumonLevel
): ProblemHints {
  // These are used as fallbacks
  void operation
  void level

  return {
    micro: {
      level: 'micro',
      // SOCRATIC: Prompt thinking
      text: `What do you think the first step should be?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Look at the problem carefully. What do you notice?`,
      animationId: 'generic-problem-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Let me show you a similar problem. Then you try this one!`,
      animationId: 'step-by-step-teaching',
      duration: 30,
    },
  }
}

// ============================================
// INTEGER HINTS (Level G)
// For signed number operations
// ============================================

export function generateIntegerAdditionHints(
  num1: number,
  num2: number,
  level: KumonLevel
): ProblemHints {
  void level
  const sign1 = num1 >= 0 ? 'positive' : 'negative'
  const sign2 = num2 >= 0 ? 'positive' : 'negative'

  return {
    micro: {
      level: 'micro',
      text: num1 * num2 >= 0
        ? `Same signs: add the numbers, keep the sign. What do you get?`
        : `Different signs: subtract the smaller from larger. Which sign wins?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Number line: Start at ${num1}. Move ${num2 >= 0 ? 'right' : 'left'} ${Math.abs(num2)} units.`,
      animationId: 'integer-add-number-line',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `${sign1} + ${sign2}: (-3) + (-5) = -8 (same signs, add). (-3) + 5 = 2 (different signs, subtract). Try yours!`,
      animationId: 'integer-addition-demo',
      duration: 45,
    },
  }
}

export function generateIntegerSubtractionHints(
  num1: number,
  num2: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Subtracting is "adding the opposite". What's the opposite of ${num2}?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Rewrite: ${num1} - (${num2}) = ${num1} + ${-num2}. Now use addition rules!`,
      animationId: 'integer-subtract-rewrite',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Keep-Change-Change: 5 - (-3) → 5 + (+3) = 8. Change subtraction to addition, flip the sign! Try yours!`,
      animationId: 'integer-subtraction-demo',
      duration: 45,
    },
  }
}

export function generateIntegerMultiplicationHints(
  num1: number,
  num2: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Multiply the numbers. Are the signs same or different? Same = positive, Different = negative!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Sign rules: (+)(+)=+, (−)(−)=+, (+)(−)=−, (−)(+)=−. What signs do you have?`,
      animationId: 'integer-multiply-signs',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Pattern: (-2)×(-3)=6, (-2)×3=-6. Same signs = positive, different = negative. |${num1}|×|${num2}| = ${Math.abs(num1 * num2)}. What's the sign?`,
      animationId: 'integer-multiplication-demo',
      duration: 45,
    },
  }
}

export function generateIntegerDivisionHints(
  dividend: number,
  divisor: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Same sign rules as multiplication! Divide the numbers, then determine the sign.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Sign rules for division: same signs = +, different signs = −. What's |${dividend}| ÷ |${divisor}|?`,
      animationId: 'integer-divide-signs',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `(-12) ÷ (-3) = +4 (same signs). (-12) ÷ 3 = -4 (different signs). Divide, then sign! Try yours!`,
      animationId: 'integer-division-demo',
      duration: 45,
    },
  }
}

// ============================================
// ALGEBRA HINTS (Level G-H)
// Expressions, equations, and systems
// ============================================

export function generateExpressionEvaluationHints(
  variable: string,
  value: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Substitute ${variable} = ${value} everywhere you see ${variable}. What's your first calculation?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Replace every ${variable} with (${value}). Use parentheses! Then simplify step by step.`,
      animationId: 'expression-substitution-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `For 3x + 2 when x=4: Replace x with 4 → 3(4) + 2 = 12 + 2 = 14. Substitute, then calculate!`,
      animationId: 'expression-evaluation-demo',
      duration: 45,
    },
  }
}

export function generateLikeTermsHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Like terms have the SAME variable parts. Can you group them together?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Circle terms with the same variable part. Add/subtract their coefficients!`,
      animationId: 'like-terms-grouping',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `3x + 2y + 5x - y = (3x+5x) + (2y-y) = 8x + y. Group same variables, combine coefficients!`,
      animationId: 'like-terms-demo',
      duration: 45,
    },
  }
}

export function generateDistributionHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Multiply the outside term by EACH term inside the parentheses. Don't forget the signs!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Draw arrows from the outside number to each inside term. Multiply each pair!`,
      animationId: 'distribution-arrows',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `3(x + 2) = 3·x + 3·2 = 3x + 6. The outside multiplies EVERYTHING inside! Try yours!`,
      animationId: 'distribution-demo',
      duration: 45,
    },
  }
}

export function generateOneStepEquationHints(
  operation: string,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `What operation is happening to x? Do the OPPOSITE to both sides!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Balance scale: whatever you do to one side, do to the other. What "undoes" ${operation}?`,
      animationId: 'equation-balance-scale',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `x + 5 = 12 → subtract 5 from both sides → x = 7. Undo the operation! What undoes ${operation}?`,
      animationId: 'one-step-equation-demo',
      duration: 45,
    },
  }
}

export function generateTwoStepEquationHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Reverse the order of operations! Undo addition/subtraction first, then multiplication/division.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Step 1: Move the constant. Step 2: Divide/multiply to get x alone.`,
      animationId: 'two-step-equation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `2x + 3 = 11 → Subtract 3: 2x = 8 → Divide by 2: x = 4. Undo in reverse order! Try yours!`,
      animationId: 'two-step-equation-demo',
      duration: 60,
    },
  }
}

export function generateSubstitutionHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Solve one equation for a variable, then SUBSTITUTE into the other. Can you isolate one variable?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Solve for x or y in one equation. 2) Replace that variable in the other equation. 3) Solve!`,
      animationId: 'substitution-method-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `y = 2x and x + y = 6. Replace y: x + 2x = 6 → 3x = 6 → x = 2. Then y = 2(2) = 4. Try yours!`,
      animationId: 'substitution-demo',
      duration: 60,
    },
  }
}

export function generateEliminationHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Can you add or subtract the equations to eliminate one variable? Look for opposite coefficients!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Line up the equations. If needed, multiply to get opposite coefficients. Then add to eliminate!`,
      animationId: 'elimination-method-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `x + y = 5 and x - y = 1. Add them: 2x = 6 → x = 3. Then 3 + y = 5 → y = 2. Variables cancel!`,
      animationId: 'elimination-demo',
      duration: 60,
    },
  }
}

export function generateInequalityHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Solve like an equation, BUT: flip the inequality sign when multiplying/dividing by a negative!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Isolate x. Watch out: multiplying or dividing by negative flips < to > (or vice versa)!`,
      animationId: 'inequality-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `-2x > 6 → Divide by -2, FLIP: x < -3. The sign flips because negatives reverse the order! Try yours!`,
      animationId: 'inequality-demo',
      duration: 45,
    },
  }
}

export function generateSlopeInterceptHints(
  slope: number,
  yIntercept: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `y = mx + b form: m is the slope (rise/run), b is where it crosses the y-axis. What are m and b?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Plot b on the y-axis. From there, use slope m: rise ${slope >= 0 ? slope : Math.abs(slope)} units ${slope >= 0 ? 'up' : 'down'}, run 1 right.`,
      animationId: 'slope-intercept-graph',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `y = 2x + 3: Start at (0,3). Slope 2 = rise 2, run 1. Plot (1,5), (2,7)... Connect with a line!`,
      animationId: 'slope-intercept-demo',
      duration: 60,
    },
  }
}

// ============================================
// QUADRATICS & FACTORING HINTS (Level I-J)
// ============================================

export function generateFOILHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `FOIL: First, Outer, Inner, Last. Multiply each pair, then combine like terms!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Draw lines connecting: First terms, Outer terms, Inner terms, Last terms. Multiply each pair!`,
      animationId: 'foil-diagram',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `(x+2)(x+3): F: x·x=x². O: x·3=3x. I: 2·x=2x. L: 2·3=6. Combine: x² + 5x + 6. Try yours!`,
      animationId: 'foil-demo',
      duration: 60,
    },
  }
}

export function generateFactorTrinomialHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Find two numbers that MULTIPLY to give c and ADD to give b (in x² + bx + c)!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `x² + bx + c = (x + ?)(x + ?). What two numbers multiply to ${`c`} and add to ${`b`}?`,
      animationId: 'factor-trinomial-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `x² + 5x + 6: Need numbers that multiply to 6 and add to 5. That's 2 and 3! Answer: (x+2)(x+3).`,
      animationId: 'factor-trinomial-demo',
      duration: 60,
    },
  }
}

export function generateDifferenceOfSquaresHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `a² - b² = (a + b)(a - b). What are your a and b?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Pattern: □² - △² = (□ + △)(□ − △). Identify what's being squared!`,
      animationId: 'difference-of-squares-pattern',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `x² - 9 = x² - 3² = (x+3)(x-3). Find the square roots, make (sum)(difference)! Try yours!`,
      animationId: 'difference-of-squares-demo',
      duration: 45,
    },
  }
}

export function generateQuadraticFormulaHints(
  a: number,
  b: number,
  c: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `x = (-b ± √(b²-4ac)) / 2a. First, identify a, b, and c from your equation!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `ax² + bx + c = 0. Here: a=${a}, b=${b}, c=${c}. Calculate b²-4ac first (the discriminant)!`,
      animationId: 'quadratic-formula-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `2x² + 5x - 3 = 0: a=2, b=5, c=-3. Discriminant: 25-4(2)(-3)=49. x = (-5±7)/4. So x=1/2 or x=-3.`,
      animationId: 'quadratic-formula-demo',
      duration: 60,
    },
  }
}

export function generateSimplifyRadicalHints(
  radicand: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Find the largest perfect square that divides ${radicand}. What perfect squares do you know?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `√${radicand} = √(perfect square × leftover) = √(perfect square) × √(leftover)`,
      animationId: 'simplify-radical-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `√72 = √(36×2) = √36 × √2 = 6√2. Find the biggest perfect square factor! Try yours!`,
      animationId: 'simplify-radical-demo',
      duration: 45,
    },
  }
}

// ============================================
// CALCULUS HINTS (Level L-O)
// Limits, derivatives, and integrals
// ============================================

export function generateLimitHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Try direct substitution first! If you get 0/0, you need another approach.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Substitute the value. If undefined, try: factoring, L'Hôpital's Rule, or algebraic manipulation.`,
      animationId: 'limit-evaluation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `lim(x→2) (x²-4)/(x-2): Direct gives 0/0! Factor: (x+2)(x-2)/(x-2) = x+2. Now: 2+2 = 4.`,
      animationId: 'limit-demo',
      duration: 60,
    },
  }
}

export function generatePowerRuleDerivativeHints(
  coefficient: number,
  exponent: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Power Rule: d/dx[xⁿ] = n·xⁿ⁻¹. Bring down the exponent, reduce it by 1!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `${coefficient}x^${exponent}: Multiply coefficient by exponent: ${coefficient}×${exponent}. New exponent: ${exponent}-1.`,
      animationId: 'power-rule-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `d/dx[3x⁴] = 4·3x³ = 12x³. Multiply by the power, subtract 1 from the power! Try yours!`,
      animationId: 'power-rule-demo',
      duration: 45,
    },
  }
}

export function generateProductRuleHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Product Rule: (fg)' = f'g + fg'. Identify your f and g functions!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `First function × derivative of second + Second function × derivative of first.`,
      animationId: 'product-rule-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `d/dx[x²·sin(x)] = 2x·sin(x) + x²·cos(x). First' × Second + First × Second'. Try yours!`,
      animationId: 'product-rule-demo',
      duration: 60,
    },
  }
}

export function generateChainRuleHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Chain Rule: derivative of outside × derivative of inside. What's your "outside" function?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `d/dx[f(g(x))] = f'(g(x)) · g'(x). Differentiate the outside, keep inside the same, multiply by inside's derivative.`,
      animationId: 'chain-rule-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `d/dx[(3x+1)⁴] = 4(3x+1)³ · 3 = 12(3x+1)³. Outside: ⁴, Inside: 3x+1. Try yours!`,
      animationId: 'chain-rule-demo',
      duration: 60,
    },
  }
}

export function generateIntegrationPowerRuleHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Reverse the power rule! Add 1 to exponent, divide by new exponent. Don't forget +C!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Increase power by 1, divide by new power!`,
      animationId: 'integration-power-rule-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `∫x³ dx = x⁴/4 + C. Add 1 to power: 3→4. Divide by new power: 1/4. Add +C! Try yours!`,
      animationId: 'integration-power-rule-demo',
      duration: 45,
    },
  }
}

export function generateUSubstitutionHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Look for a function and its derivative. Let u = the inside function!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Let u = [inside function]. 2) Find du. 3) Substitute. 4) Integrate. 5) Back-substitute!`,
      animationId: 'u-substitution-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `∫2x(x²+1)³ dx: Let u=x²+1, du=2x dx. ∫u³ du = u⁴/4 = (x²+1)⁴/4 + C. Try yours!`,
      animationId: 'u-substitution-demo',
      duration: 60,
    },
  }
}

// ============================================
// TRIGONOMETRY HINTS (Level M)
// ============================================

export function generateTrigRatioHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `SOH-CAH-TOA! Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Label the triangle: Opposite (across from angle), Adjacent (next to angle), Hypotenuse (longest side).`,
      animationId: 'trig-ratio-triangle',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `For 30°: sin(30°)=1/2, cos(30°)=√3/2, tan(30°)=√3/3. Memorize special angles! What's yours?`,
      animationId: 'trig-ratio-demo',
      duration: 45,
    },
  }
}

export function generateUnitCircleHints(
  angle: string,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `On the unit circle, coordinates are (cos θ, sin θ). Which quadrant is ${angle} in?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Find the angle on the unit circle. The x-coordinate is cosine, y-coordinate is sine!`,
      animationId: 'unit-circle-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `At π/4: The point is (√2/2, √2/2). So cos(π/4)=√2/2 and sin(π/4)=√2/2. Find your angle!`,
      animationId: 'unit-circle-demo',
      duration: 60,
    },
  }
}

export function generateTrigIdentityHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Key identity: sin²θ + cos²θ = 1. Can you rearrange to find what you need?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `From sin²θ + cos²θ = 1: sin²θ = 1 - cos²θ and cos²θ = 1 - sin²θ. Substitute and simplify!`,
      animationId: 'trig-identity-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Simplify 1 - sin²θ: From the identity, 1 - sin²θ = cos²θ. Use identities to simplify! Try yours!`,
      animationId: 'trig-identity-demo',
      duration: 45,
    },
  }
}

// ============================================
// SEQUENCE & SERIES HINTS (Level N)
// ============================================

export function generateArithmeticSequenceHints(
  a1: number,
  d: number,
  n: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Arithmetic sequence: aₙ = a₁ + (n-1)d. What's your first term and common difference?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `a₁ = ${a1}, d = ${d}, n = ${n}. Plug into: aₙ = ${a1} + (${n}-1)(${d})`,
      animationId: 'arithmetic-sequence-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Find the 10th term: a₁=3, d=5. a₁₀ = 3 + (10-1)(5) = 3 + 45 = 48. Use the formula!`,
      animationId: 'arithmetic-sequence-demo',
      duration: 45,
    },
  }
}

export function generateGeometricSequenceHints(
  a1: number,
  r: number,
  n: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Geometric sequence: aₙ = a₁ · rⁿ⁻¹. What's your first term and common ratio?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `a₁ = ${a1}, r = ${r}, n = ${n}. Plug into: aₙ = ${a1} · ${r}^(${n}-1)`,
      animationId: 'geometric-sequence-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Find the 5th term: a₁=2, r=3. a₅ = 2 · 3⁴ = 2 · 81 = 162. Multiply by r^(n-1)! Try yours!`,
      animationId: 'geometric-sequence-demo',
      duration: 45,
    },
  }
}

// ============================================
// VECTOR HINTS (Level XV)
// ============================================

export function generateVectorAdditionHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Add vectors by adding corresponding components: <a₁+b₁, a₂+b₂>`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `<a₁, a₂> + <b₁, b₂> = <a₁+b₁, a₂+b₂>. Add x-components, then y-components!`,
      animationId: 'vector-addition-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `<3, 2> + <1, 4> = <3+1, 2+4> = <4, 6>. Component by component! Try yours!`,
      animationId: 'vector-addition-demo',
      duration: 45,
    },
  }
}

export function generateVectorMagnitudeHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Magnitude = √(a² + b²). It's like the Pythagorean theorem!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `For <a, b>: |v| = √(a² + b²). Square each component, add, take square root!`,
      animationId: 'vector-magnitude-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `|<3, 4>| = √(3² + 4²) = √(9 + 16) = √25 = 5. Pythagorean theorem in disguise! Try yours!`,
      animationId: 'vector-magnitude-demo',
      duration: 45,
    },
  }
}

export function generateDotProductHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Dot product: a·b = a₁b₁ + a₂b₂. Multiply corresponding components and add!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `<a₁, a₂> · <b₁, b₂> = a₁b₁ + a₂b₂. It gives a NUMBER, not a vector!`,
      animationId: 'dot-product-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `<2, 3> · <4, -1> = (2)(4) + (3)(-1) = 8 - 3 = 5. Multiply pairs, add results! Try yours!`,
      animationId: 'dot-product-demo',
      duration: 45,
    },
  }
}

export function generateCrossProductHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Cross product: <a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁>. Use the determinant pattern!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `a × b = |i  j  k |\n         |a₁ a₂ a₃|\n         |b₁ b₂ b₃|. Expand the determinant!`,
      animationId: 'cross-product-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `<1,0,0> × <0,1,0>: i(0·0-0·1) - j(1·0-0·0) + k(1·1-0·0) = <0,0,1>. Practice the pattern!`,
      animationId: 'cross-product-demo',
      duration: 60,
    },
  }
}

// ============================================
// MATRIX HINTS (Level XM)
// ============================================

export function generateMatrixAdditionHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Add matrices by adding corresponding elements. Same position = add together!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `A + B: Add element-by-element. Position (i,j) in result = A(i,j) + B(i,j).`,
      animationId: 'matrix-addition-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `[[1,2],[3,4]] + [[5,6],[7,8]] = [[1+5,2+6],[3+7,4+8]] = [[6,8],[10,12]]. Same spots add! Try yours!`,
      animationId: 'matrix-addition-demo',
      duration: 45,
    },
  }
}

export function generateMatrixMultiplicationHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Row × Column! Take a row from first matrix, column from second. Multiply pairs and add!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `C(i,j) = (row i of A) · (column j of B). Multiply corresponding elements, sum them up!`,
      animationId: 'matrix-multiplication-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `[[1,2]] × [[3],[4]] = 1×3 + 2×4 = 3 + 8 = 11. Row times column, multiply and add! Try yours!`,
      animationId: 'matrix-multiplication-demo',
      duration: 60,
    },
  }
}

export function generateDeterminantHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `For 2×2: det = ad - bc. Diagonal products, subtract!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `[[a,b],[c,d]] → det = ad - bc. Main diagonal minus other diagonal!`,
      animationId: 'determinant-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `det[[3,2],[1,4]] = 3×4 - 2×1 = 12 - 2 = 10. Cross multiply and subtract! Try yours!`,
      animationId: 'determinant-demo',
      duration: 45,
    },
  }
}

// ============================================
// PROBABILITY HINTS (Level XP)
// ============================================

export function generatePermutationHints(
  n: number,
  r: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Permutation = arrangement where ORDER MATTERS. P(n,r) = n!/(n-r)!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `P(${n},${r}) = ${n}!/(${n}-${r})! = ${n}!/${n - r}!. How many ways to arrange ${r} from ${n}?`,
      animationId: 'permutation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `P(5,3) = 5!/2! = 5×4×3 = 60. First choice: 5 options, second: 4, third: 3. Multiply! Try yours!`,
      animationId: 'permutation-demo',
      duration: 45,
    },
  }
}

export function generateCombinationHints(
  n: number,
  r: number,
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Combination = selection where ORDER DOESN'T MATTER. C(n,r) = n!/[r!(n-r)!]`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `C(${n},${r}) = ${n}!/[${r}!×${n - r}!]. How many ways to CHOOSE ${r} from ${n}?`,
      animationId: 'combination-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `C(5,2) = 5!/(2!×3!) = (5×4)/(2×1) = 10. Choose without order = permutation ÷ arrangements! Try yours!`,
      animationId: 'combination-demo',
      duration: 45,
    },
  }
}

export function generateBasicProbabilityHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `P(event) = favorable outcomes / total outcomes. What's favorable? What's total?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Count: How many ways can the event happen? How many total possibilities? Divide!`,
      animationId: 'basic-probability-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `P(rolling 3) = 1/6 (1 favorable, 6 total). P(even) = 3/6 = 1/2 (3 favorable: 2,4,6). Try yours!`,
      animationId: 'basic-probability-demo',
      duration: 45,
    },
  }
}

export function generateConditionalProbabilityHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `P(A|B) = "probability of A given B happened". The sample space changes!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `P(A|B) = P(A and B) / P(B). Given B happened, how likely is A?`,
      animationId: 'conditional-probability-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `2 reds + 3 blues. P(2nd red | 1st red) = 1/4. After taking 1 red, only 1 red left in 4 balls!`,
      animationId: 'conditional-probability-demo',
      duration: 60,
    },
  }
}

// ============================================
// STATISTICS HINTS (Level XS)
// ============================================

export function generateMeanHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Mean = (sum of all values) / (number of values). Add them up and divide!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Step 1: Add all numbers. Step 2: Count how many numbers. Step 3: Divide!`,
      animationId: 'mean-calculation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Mean of 2, 4, 6, 8: Sum = 20. Count = 4. Mean = 20/4 = 5. Add and divide! Try yours!`,
      animationId: 'mean-demo',
      duration: 45,
    },
  }
}

export function generateMedianHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Median = middle value when sorted. Odd count? Pick the middle. Even? Average the two middles!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Sort the data first! Then find the middle position: (n+1)/2`,
      animationId: 'median-calculation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Median of 3, 7, 1, 9, 4: Sort → 1, 3, 4, 7, 9. Middle = 4 (position 3 of 5). Try yours!`,
      animationId: 'median-demo',
      duration: 45,
    },
  }
}

export function generateStandardDeviationHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `σ = √[Σ(x-mean)²/n]. Find mean, subtract from each value, square, average, square root!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Find mean. 2) Subtract mean from each. 3) Square each. 4) Average squares. 5) Square root!`,
      animationId: 'standard-deviation-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `Data: 2, 4, 6. Mean=4. Deviations: -2, 0, 2. Squares: 4, 0, 4. Average: 8/3. SD: √(8/3) ≈ 1.63.`,
      animationId: 'standard-deviation-demo',
      duration: 60,
    },
  }
}

export function generateZScoreHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `z = (x - mean) / standard deviation. How many SDs from the mean?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `z tells you position relative to the mean in terms of standard deviations.`,
      animationId: 'z-score-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Mean=70, SD=10, x=85. z = (85-70)/10 = 1.5. The score is 1.5 SDs above the mean! Try yours!`,
      animationId: 'z-score-demo',
      duration: 45,
    },
  }
}

export function generateNormalDistributionHints(
  level: KumonLevel
): ProblemHints {
  void level

  return {
    micro: {
      level: 'micro',
      text: `Convert to z-score, then use the z-table. What's (x - μ)/σ?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Find z = (x - μ)/σ. 2) Look up z in the standard normal table. 3) Read the probability!`,
      animationId: 'normal-distribution-setup',
      duration: 20,
    },
    teaching: {
      level: 'teaching',
      text: `μ=100, σ=15, P(X<115)? z=(115-100)/15=1. From table: P(z<1)≈0.8413 = 84.13%. Try yours!`,
      animationId: 'normal-distribution-demo',
      duration: 60,
    },
  }
}

// ============================================
// CALCULUS - LEVEL N (Sequences & Series)
// ============================================

export function generateSigmaNotationHints(
  type: string,
  start: number,
  end: number,
  level: KumonLevel
): ProblemHints {
  void type
  void start
  void end
  void level

  return {
    micro: {
      level: 'micro',
      text: `Σ means "sum up." What values go from the bottom to top number?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Substitute each value (i=${start} to ${end}) and add the results together.`,
      animationId: 'sigma-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Σ(i=1 to 3) 2i = 2(1) + 2(2) + 2(3) = 2 + 4 + 6 = 12. Your turn!`,
      animationId: 'sigma-demo',
      duration: 45,
    },
  }
}

export function generateRecurrenceHints(
  a1: number,
  multiplier: number,
  addend: number,
  level: KumonLevel
): ProblemHints {
  void a1
  void multiplier
  void addend
  void level

  return {
    micro: {
      level: 'micro',
      text: `Each term depends on the previous one. Start with a₁ and work forward.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `a₁ → a₂ → a₃ → ... Apply the formula step by step!`,
      animationId: 'recurrence-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `If aₙ₊₁ = 2aₙ + 1, a₁=3: a₂=2(3)+1=7, a₃=2(7)+1=15, a₄=2(15)+1=31. Now try yours!`,
      animationId: 'recurrence-demo',
      duration: 45,
    },
  }
}

export function generateInductionHints(
  type: string,
  statement: string,
  level: KumonLevel
): ProblemHints {
  void type
  void statement
  void level

  return {
    micro: {
      level: 'micro',
      text: `Two steps: 1) Prove the base case. 2) Assume P(k), prove P(k+1).`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Base case → Assume P(k) true → Show P(k+1) must be true.`,
      animationId: 'induction-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Prove 1+2+...+n = n(n+1)/2. Base: n=1 gives 1=1(2)/2=1 ✓. Inductive step: Add (k+1) to both sides!`,
      animationId: 'induction-demo',
      duration: 60,
    },
  }
}

export function generateInfiniteSeriesHints(
  a: number,
  r: number,
  level: KumonLevel
): ProblemHints {
  void a
  void r
  void level

  return {
    micro: {
      level: 'micro',
      text: `Does the series converge? Check if |r| < 1.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `If |r| < 1: S = a/(1-r). If |r| ≥ 1: Series diverges (no finite sum).`,
      animationId: 'infinite-series-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `S = 6 + 3 + 1.5 + ... where a=6, r=0.5. S = 6/(1-0.5) = 6/0.5 = 12. Try yours!`,
      animationId: 'infinite-series-demo',
      duration: 45,
    },
  }
}

export function generateContinuityHints(
  func: string,
  x0: number,
  level: KumonLevel
): ProblemHints {
  void func
  void x0
  void level

  return {
    micro: {
      level: 'micro',
      text: `Check three things: f(a) exists, lim f(x) exists, and they're equal.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Continuous = no breaks, holes, or jumps. Can you draw it without lifting your pen?`,
      animationId: 'continuity-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `f(x)=x² is continuous everywhere (polynomial). f(x)=1/x is not continuous at x=0. Check your function!`,
      animationId: 'continuity-demo',
      duration: 45,
    },
  }
}

export function generateTrigDerivativeHints(
  func: string,
  level: KumonLevel
): ProblemHints {
  void func
  void level

  return {
    micro: {
      level: 'micro',
      text: `Remember: d/dx[sin x] = cos x, d/dx[cos x] = -sin x, d/dx[tan x] = sec²x.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `sin → cos → -sin → -cos → sin (cycles!) tan → sec² (memorize this one!)`,
      animationId: 'trig-derivative-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `d/dx[sin(2x)] = cos(2x) × 2 = 2cos(2x). Chain rule: multiply by the derivative of the inside!`,
      animationId: 'trig-derivative-demo',
      duration: 45,
    },
  }
}

export function generateHigherDerivativeHints(
  a: number,
  power: number,
  n: number,
  level: KumonLevel
): ProblemHints {
  void a
  void power
  void n
  void level

  return {
    micro: {
      level: 'micro',
      text: `Apply the power rule repeatedly. Each derivative reduces the power by 1.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `f(x) → f'(x) → f''(x) → f'''(x) → ... Keep differentiating!`,
      animationId: 'higher-derivative-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `f(x)=x⁵: f'=5x⁴, f''=20x³, f'''=60x², f⁽⁴⁾=120x, f⁽⁵⁾=120. Try yours!`,
      animationId: 'higher-derivative-demo',
      duration: 45,
    },
  }
}

// ============================================
// CALCULUS - LEVEL O (Integration & DEs)
// ============================================

export function generateTangentNormalHints(
  type: string,
  func: string,
  x0: number,
  level: KumonLevel
): ProblemHints {
  void type
  void func
  void x0
  void level

  return {
    micro: {
      level: 'micro',
      text: type === 'tangent'
        ? `Tangent slope = f'(a). What's the derivative at that point?`
        : `Normal is perpendicular: its slope = -1/(tangent slope).`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Find f'(x). 2) Evaluate f'(a) for slope. 3) Find the point (a, f(a)). 4) Use point-slope form.`,
      animationId: 'tangent-normal-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `y=x² at x=2: f'(x)=2x, slope=4, point=(2,4). Tangent: y-4=4(x-2). Normal: y-4=-¼(x-2). Try yours!`,
      animationId: 'tangent-normal-demo',
      duration: 45,
    },
  }
}

export function generateIncreasingDecreasingHints(
  func: string,
  level: KumonLevel
): ProblemHints {
  void func
  void level

  return {
    micro: {
      level: 'micro',
      text: `Find f'(x). Where is f' > 0? Where is f' < 0?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `f' > 0 → increasing. f' < 0 → decreasing. Find critical points where f' = 0!`,
      animationId: 'inc-dec-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `f(x)=x²-4x: f'(x)=2x-4=0 at x=2. f'<0 on (-∞,2), f'>0 on (2,∞). Decreasing then increasing!`,
      animationId: 'inc-dec-demo',
      duration: 45,
    },
  }
}

export function generateConcavityHints(
  func: string,
  level: KumonLevel
): ProblemHints {
  void func
  void level

  return {
    micro: {
      level: 'micro',
      text: `Find f''(x). Where is f'' > 0? Where is f'' < 0?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `f'' > 0 → concave up (smile). f'' < 0 → concave down (frown). Inflection where f'' = 0 and changes sign.`,
      animationId: 'concavity-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `f(x)=x³: f''(x)=6x=0 at x=0. f''<0 for x<0 (concave down), f''>0 for x>0 (concave up). Inflection at x=0!`,
      animationId: 'concavity-demo',
      duration: 45,
    },
  }
}

export function generateExtremaHints(
  func: string,
  level: KumonLevel
): ProblemHints {
  void func
  void level

  return {
    micro: {
      level: 'micro',
      text: `Find critical points where f'(x) = 0. Then use the second derivative test.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `At critical point c: f''(c) > 0 → local min. f''(c) < 0 → local max. f''(c) = 0 → test inconclusive.`,
      animationId: 'extrema-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `f(x)=x³-3x: f'=3x²-3=0 at x=±1. f''=6x. f''(-1)=-6<0 (max at x=-1), f''(1)=6>0 (min at x=1).`,
      animationId: 'extrema-demo',
      duration: 45,
    },
  }
}

export function generateIntegrationByPartsHints(
  integral: string,
  u: string,
  dv: string,
  level: KumonLevel
): ProblemHints {
  void integral
  void u
  void dv
  void level

  return {
    micro: {
      level: 'micro',
      text: `LIATE: pick u from Logs, Inverse trig, Algebraic, Trig, Exponential (first available).`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `∫u dv = uv - ∫v du. Find du by differentiating u, find v by integrating dv.`,
      animationId: 'by-parts-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `∫x·eˣ dx: u=x, dv=eˣdx → du=dx, v=eˣ. Answer: x·eˣ - ∫eˣdx = x·eˣ - eˣ + C. Try yours!`,
      animationId: 'by-parts-demo',
      duration: 45,
    },
  }
}

export function generatePartialFractionsHints(
  integral: string,
  level: KumonLevel
): ProblemHints {
  void integral
  void level

  return {
    micro: {
      level: 'micro',
      text: `Factor the denominator first. Then split into simpler fractions.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1/((x-a)(x-b)) = A/(x-a) + B/(x-b). Solve for A and B, then integrate each term!`,
      animationId: 'partial-fractions-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `∫1/(x²-1)dx: 1/((x-1)(x+1)) = A/(x-1) + B/(x+1). A=1/2, B=-1/2. Integrate to get (1/2)ln|x-1| - (1/2)ln|x+1| + C.`,
      animationId: 'partial-fractions-demo',
      duration: 60,
    },
  }
}

export function generateAreaBetweenCurvesHints(
  f1: string,
  f2: string,
  level: KumonLevel
): ProblemHints {
  void f1
  void f2
  void level

  return {
    micro: {
      level: 'micro',
      text: `Area = ∫(top - bottom) dx. First find the intersection points!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Find where curves meet (set f = g). 2) Determine which is on top. 3) Integrate the difference.`,
      animationId: 'area-curves-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `y=x² and y=x: Meet at x=0,1. x is on top. Area = ∫₀¹(x - x²)dx = [x²/2 - x³/3]₀¹ = 1/2 - 1/3 = 1/6.`,
      animationId: 'area-curves-demo',
      duration: 45,
    },
  }
}

export function generateVolumeHints(
  method: string,
  func: string,
  level: KumonLevel
): ProblemHints {
  void method
  void func
  void level

  return {
    micro: {
      level: 'micro',
      text: method === 'disk'
        ? `Disk method: V = π∫[f(x)]² dx. Think of stacking circular disks!`
        : `Shell method: V = 2π∫x·f(x) dx. Think of cylindrical shells!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Rotating around x-axis? Use disks (radius = y). Around y-axis? Consider shells (radius = x).`,
      animationId: 'volume-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Rotate y=√x, 0≤x≤4 around x-axis: V = π∫₀⁴(√x)²dx = π∫₀⁴x dx = π[x²/2]₀⁴ = 8π.`,
      animationId: 'volume-demo',
      duration: 45,
    },
  }
}

export function generateSeparableDEHints(
  equation: string,
  level: KumonLevel
): ProblemHints {
  void equation
  void level

  return {
    micro: {
      level: 'micro',
      text: `Can you get all y's on one side and all x's on the other?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `dy/dx = f(x)g(y) → (1/g(y))dy = f(x)dx. Integrate both sides!`,
      animationId: 'separable-de-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `dy/dx = xy: (1/y)dy = x dx → ln|y| = x²/2 + C → y = Ae^(x²/2). Try yours!`,
      animationId: 'separable-de-demo',
      duration: 45,
    },
  }
}

// ============================================
// VECTORS - LEVEL XV
// ============================================

export function generateVectorLineHints(
  point: number[],
  direction: number[],
  level: KumonLevel
): ProblemHints {
  void point
  void direction
  void level

  return {
    micro: {
      level: 'micro',
      text: `Line equation: r = r₀ + t·d where r₀ is a point and d is the direction.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Start at point r₀, then move along direction d as t varies from -∞ to ∞.`,
      animationId: 'vector-line-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Point (1,2,3), direction <2,1,0>: r = <1,2,3> + t<2,1,0> = <1+2t, 2+t, 3>. Now write yours!`,
      animationId: 'vector-line-demo',
      duration: 45,
    },
  }
}

export function generatePlaneEquationHints(
  point: number[],
  normal: number[],
  level: KumonLevel
): ProblemHints {
  void point
  void normal
  void level

  return {
    micro: {
      level: 'micro',
      text: `Plane: n·(r - r₀) = 0, or ax + by + cz = d where <a,b,c> is the normal.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `The normal vector is perpendicular to the plane. Every point in the plane satisfies the equation.`,
      animationId: 'plane-equation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Point (1,2,3), normal <1,1,1>: 1(x-1)+1(y-2)+1(z-3)=0 → x+y+z=6. Write yours!`,
      animationId: 'plane-equation-demo',
      duration: 45,
    },
  }
}

// ============================================
// MATRICES - LEVEL XM (Additional functions)
// ============================================

export function generateMatrixAddHints(
  A: number[][],
  B: number[][],
  level: KumonLevel
): ProblemHints {
  void A
  void B
  void level

  return {
    micro: {
      level: 'micro',
      text: `Add corresponding entries: (A+B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Same position → add together. Matrices must be the same size!`,
      animationId: 'matrix-add-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `[[1,2],[3,4]] + [[5,6],[7,8]] = [[1+5,2+6],[3+7,4+8]] = [[6,8],[10,12]]. Try yours!`,
      animationId: 'matrix-add-demo',
      duration: 45,
    },
  }
}

export function generateMatrixMultHints(
  A: number[][],
  B: number[][],
  level: KumonLevel
): ProblemHints {
  void A
  void B
  void level

  return {
    micro: {
      level: 'micro',
      text: `Row of A times column of B: (AB)ᵢⱼ = Σ Aᵢₖ × Bₖⱼ`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `For each entry: take the row from A, column from B, multiply pairs, and add!`,
      animationId: 'matrix-mult-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `[[1,2],[3,4]]×[[5,6],[7,8]]: Entry (1,1) = 1×5+2×7=19. Entry (1,2) = 1×6+2×8=22. Continue for all entries!`,
      animationId: 'matrix-mult-demo',
      duration: 45,
    },
  }
}

export function generateMatrixInverseHints(
  matrix: number[][],
  level: KumonLevel
): ProblemHints {
  void matrix
  void level

  return {
    micro: {
      level: 'micro',
      text: `For 2×2: A⁻¹ = (1/det(A))[[d,-b],[-c,a]] where A=[[a,b],[c,d]].`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Calculate det(A) = ad - bc. 2) Swap a↔d, negate b and c. 3) Divide by det.`,
      animationId: 'matrix-inverse-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `A=[[2,1],[5,3]]: det=2×3-1×5=1. A⁻¹=(1/1)[[3,-1],[-5,2]]=[[3,-1],[-5,2]]. Verify: A×A⁻¹=I!`,
      animationId: 'matrix-inverse-demo',
      duration: 45,
    },
  }
}

export function generateMatrixSystemHints(
  A: number[][],
  b: number[],
  level: KumonLevel
): ProblemHints {
  void A
  void b
  void level

  return {
    micro: {
      level: 'micro',
      text: `AX = B → X = A⁻¹B. First find the inverse of A!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) Write system as AX=B. 2) Find A⁻¹. 3) Multiply: X=A⁻¹B.`,
      animationId: 'matrix-system-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `2x+y=5, 3x+2y=8 → [[2,1],[3,2]][[x],[y]]=[[5],[8]]. A⁻¹=[[2,-1],[-3,2]]. X=[[2,-1],[-3,2]][[5],[8]]=[[2],[1]].`,
      animationId: 'matrix-system-demo',
      duration: 60,
    },
  }
}

export function generateTransformationHints(
  type: string,
  param: string,
  level: KumonLevel
): ProblemHints {
  void type
  void param
  void level

  return {
    micro: {
      level: 'micro',
      text: type === 'reflection'
        ? `Reflection: flip across the axis. Check which coordinates change sign.`
        : type === 'rotation'
        ? `Rotation: use the rotation matrix [[cosθ,-sinθ],[sinθ,cosθ]].`
        : `Scaling: multiply coordinates by the scale factor.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Reflection over x-axis: (x,y)→(x,-y). Over y-axis: (x,y)→(-x,y). Over y=x: (x,y)→(y,x).`,
      animationId: 'transformation-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Rotate (3,4) by 90°: [[0,-1],[1,0]][[3],[4]] = [[-4],[3]]. The point moves from (3,4) to (-4,3)!`,
      animationId: 'transformation-demo',
      duration: 45,
    },
  }
}

// ============================================
// PROBABILITY - LEVEL XP (Additional functions)
// ============================================

export function generateBinomialExpansionHints(
  a: number,
  b: number,
  n: number,
  level: KumonLevel
): ProblemHints {
  void a
  void b
  void n
  void level

  return {
    micro: {
      level: 'micro',
      text: `(a+b)ⁿ = Σ C(n,k) × aⁿ⁻ᵏ × bᵏ. What term has the power you need?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Term k: C(n,k) × aⁿ⁻ᵏ × bᵏ. For x³ in (x+2)⁵, find k where the x-power is 3.`,
      animationId: 'binomial-expansion-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `(x+2)⁴: x³ term needs k=1. C(4,1)×x³×2¹ = 4×x³×2 = 8x³. Find the coefficient in yours!`,
      animationId: 'binomial-expansion-demo',
      duration: 45,
    },
  }
}

export function generateExpectedValueHints(
  type: string,
  level: KumonLevel
): ProblemHints {
  void type
  void level

  return {
    micro: {
      level: 'micro',
      text: `E(X) = Σ x × P(x). Multiply each outcome by its probability, then add!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `List all outcomes and their probabilities. E(X) = x₁P(x₁) + x₂P(x₂) + ...`,
      animationId: 'expected-value-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Fair die: E(X) = 1(1/6) + 2(1/6) + 3(1/6) + 4(1/6) + 5(1/6) + 6(1/6) = 21/6 = 3.5. Calculate yours!`,
      animationId: 'expected-value-demo',
      duration: 45,
    },
  }
}

// ============================================
// STATISTICS - LEVEL XS (Additional functions)
// ============================================

export function generateCentralTendencyHints(
  measure: string,
  data: number[],
  level: KumonLevel
): ProblemHints {
  void measure
  void data
  void level

  return {
    micro: {
      level: 'micro',
      text: measure === 'mean'
        ? `Mean = sum ÷ count. Add all values, then divide!`
        : measure === 'median'
        ? `Median = middle value. Sort first, then find the center!`
        : `Mode = most frequent. Which value appears the most?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `Mean: add all, divide by n. Median: sort, find middle. Mode: find most common.`,
      animationId: 'central-tendency-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Data: 3, 5, 7, 5, 10. Mean=(3+5+7+5+10)/5=6. Sorted: 3,5,5,7,10. Median=5. Mode=5 (appears twice).`,
      animationId: 'central-tendency-demo',
      duration: 45,
    },
  }
}

export function generateVarianceHints(
  measure: string,
  data: number[],
  level: KumonLevel
): ProblemHints {
  void measure
  void data
  void level

  return {
    micro: {
      level: 'micro',
      text: `Variance measures spread. Find deviations from mean, square them, average them.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `σ² = Σ(x - μ)² / n. Standard deviation = √variance.`,
      animationId: 'variance-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Data: 2,4,6. Mean=4. Deviations: -2,0,2. Squares: 4,0,4. Variance=8/3. SD=√(8/3)≈1.63.`,
      animationId: 'variance-demo',
      duration: 45,
    },
  }
}

export function generateBinomialDistributionHints(
  n: number,
  p: number,
  k: number,
  level: KumonLevel
): ProblemHints {
  void n
  void p
  void k
  void level

  return {
    micro: {
      level: 'micro',
      text: `P(X=k) = C(n,k) × pᵏ × (1-p)ⁿ⁻ᵏ. How many ways? Times success prob? Times failure prob?`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `C(n,k) = ways to choose. pᵏ = k successes. (1-p)ⁿ⁻ᵏ = (n-k) failures.`,
      animationId: 'binomial-dist-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `5 flips, P(exactly 3 heads): C(5,3)×0.5³×0.5² = 10×0.125×0.25 = 0.3125 = 31.25%. Try yours!`,
      animationId: 'binomial-dist-demo',
      duration: 45,
    },
  }
}

export function generateConfidenceIntervalHints(
  xbar: number,
  s: number,
  n: number,
  confidence: number,
  level: KumonLevel
): ProblemHints {
  void xbar
  void s
  void n
  void confidence
  void level

  return {
    micro: {
      level: 'micro',
      text: `CI = x̄ ± z*(s/√n). Find the z* for your confidence level!`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `90%: z*=1.645. 95%: z*=1.96. 99%: z*=2.576. Then calculate the margin of error.`,
      animationId: 'confidence-interval-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `x̄=50, s=10, n=25, 95% CI: ME=1.96×(10/√25)=1.96×2=3.92. CI: 50±3.92 = (46.08, 53.92).`,
      animationId: 'confidence-interval-demo',
      duration: 45,
    },
  }
}

export function generateHypothesisTestHints(
  type: string,
  scenario: string,
  level: KumonLevel
): ProblemHints {
  void type
  void scenario
  void level

  return {
    micro: {
      level: 'micro',
      text: type === 'setup'
        ? `H₀ includes equality (=, ≤, ≥). H₁ is what you want to prove (<, >, ≠).`
        : `Compare p-value to α. If p < α, reject H₀. If p ≥ α, fail to reject H₀.`,
      duration: 5,
    },
    visual: {
      level: 'visual',
      text: `1) State H₀ and H₁. 2) Calculate test statistic. 3) Find p-value. 4) Compare to α and decide.`,
      animationId: 'hypothesis-test-setup',
      duration: 15,
    },
    teaching: {
      level: 'teaching',
      text: `Claim: μ=50. You think μ>50. H₀: μ=50, H₁: μ>50. If p-value=0.03 and α=0.05: 0.03<0.05, so reject H₀!`,
      animationId: 'hypothesis-test-demo',
      duration: 45,
    },
  }
}

// ============================================
// MAIN DISPATCHER
// ============================================

export function generateHintsForProblem(
  operands: number[],
  operation: string,
  level: KumonLevel
): ProblemHints {
  switch (operation) {
    case 'addition':
      return generateAdditionHints(operands, level)
    case 'subtraction':
      return generateSubtractionHints(operands, level)
    case 'multiplication':
      return generateMultiplicationHints(operands, level)
    case 'division':
      return generateDivisionHints(operands, level)
    case 'counting':
      return generateCountingHints(operands[0], level)

    // Fraction operations (Levels E-F)
    case 'fraction_add_same_denom':
    case 'fraction_add_diff_denom':
    case 'fraction_addition':
    case 'fraction_subtract_same_denom':
    case 'fraction_subtract_diff_denom':
    case 'fraction_subtraction':
    case 'fraction_multiply':
    case 'fraction_divide':
    case 'fraction':
      return generateFractionHints(operands, operation, level)

    // Decimal operations (Level F)
    case 'decimal_add':
    case 'decimal_subtract':
    case 'decimal_multiply':
    case 'decimal_divide':
    case 'decimal':
      return generateDecimalHints(operands, operation, level)

    // Order of operations (Level F)
    case 'order_of_operations':
    case 'order_of_operations_fractions':
      return generateOrderOfOperationsHints('', level)

    // Integer operations (Level G)
    case 'integer_addition':
      return generateIntegerAdditionHints(operands[0], operands[1], level)
    case 'integer_subtraction':
      return generateIntegerSubtractionHints(operands[0], operands[1], level)
    case 'integer_multiplication':
      return generateIntegerMultiplicationHints(operands[0], operands[1], level)
    case 'integer_division':
      return generateIntegerDivisionHints(operands[0], operands[1], level)

    // Algebra (Levels G-H)
    case 'evaluate_expression':
      return generateExpressionEvaluationHints('x', operands[0], level)
    case 'simplify_like_terms':
      return generateLikeTermsHints(level)
    case 'simplify_with_distribution':
    case 'distribution':
      return generateDistributionHints(level)
    case 'solve_one_step':
      return generateOneStepEquationHints('addition', level)
    case 'solve_two_step':
      return generateTwoStepEquationHints(level)
    case 'substitution':
    case 'system_substitution':
      return generateSubstitutionHints(level)
    case 'elimination':
    case 'system_elimination':
      return generateEliminationHints(level)
    case 'inequality':
    case 'solve_inequality':
      return generateInequalityHints(level)
    case 'slope_intercept':
      return generateSlopeInterceptHints(operands[0] || 1, operands[1] || 0, level)

    // Quadratics & Factoring (Level I-J)
    case 'foil':
    case 'foil_binomials':
      return generateFOILHints(level)
    case 'factor_trinomial':
      return generateFactorTrinomialHints(level)
    case 'difference_of_squares':
    case 'factor_difference_of_squares':
      return generateDifferenceOfSquaresHints(level)
    case 'quadratic_formula':
      return generateQuadraticFormulaHints(operands[0] || 1, operands[1] || 0, operands[2] || 0, level)
    case 'simplify_radical':
    case 'simplify_square_root':
      return generateSimplifyRadicalHints(operands[0], level)

    // Calculus (Levels L-O)
    case 'limit':
    case 'evaluate_limit':
      return generateLimitHints(level)
    case 'power_rule':
    case 'derivative_power':
      return generatePowerRuleDerivativeHints(operands[0] || 1, operands[1] || 2, level)
    case 'product_rule':
      return generateProductRuleHints(level)
    case 'chain_rule':
      return generateChainRuleHints(level)
    case 'indefinite_integral':
    case 'integration':
      return generateIntegrationPowerRuleHints(level)
    case 'u_substitution':
    case 'integration_by_substitution':
      return generateUSubstitutionHints(level)

    // Trigonometry (Level M)
    case 'trig_ratio':
    case 'evaluate_trig_ratio':
      return generateTrigRatioHints(level)
    case 'unit_circle':
      return generateUnitCircleHints(String(operands[0]), level)
    case 'trig_identity':
    case 'pythagorean_identities':
      return generateTrigIdentityHints(level)

    // Sequences (Level N)
    case 'arithmetic_sequence':
    case 'arithmetic_sequence_nth_term':
      return generateArithmeticSequenceHints(operands[0], operands[1], operands[2], level)
    case 'geometric_sequence':
    case 'geometric_sequence_nth_term':
      return generateGeometricSequenceHints(operands[0], operands[1], operands[2], level)

    // Vectors (Level XV)
    case 'vector_addition':
    case 'vector_addition_2d':
      return generateVectorAdditionHints(level)
    case 'vector_magnitude':
      return generateVectorMagnitudeHints(level)
    case 'dot_product':
      return generateDotProductHints(level)
    case 'cross_product':
    case 'cross_product_3d':
      return generateCrossProductHints(level)

    // Matrices (Level XM)
    case 'matrix_addition':
      return generateMatrixAdditionHints(level)
    case 'matrix_multiplication':
      return generateMatrixMultiplicationHints(level)
    case 'determinant':
    case 'matrix_determinant':
      return generateDeterminantHints(level)

    // Probability (Level XP)
    case 'permutation':
    case 'permutation_basic':
      return generatePermutationHints(operands[0], operands[1], level)
    case 'combination':
    case 'combination_basic':
      return generateCombinationHints(operands[0], operands[1], level)
    case 'probability':
    case 'probability_basic':
      return generateBasicProbabilityHints(level)
    case 'conditional_probability':
      return generateConditionalProbabilityHints(level)

    // Statistics (Level XS)
    case 'mean':
    case 'mean_median_mode':
      return generateMeanHints(level)
    case 'median':
      return generateMedianHints(level)
    case 'standard_deviation':
    case 'variance_standard_deviation':
      return generateStandardDeviationHints(level)
    case 'z_score':
    case 'z_scores':
      return generateZScoreHints(level)
    case 'normal_distribution':
      return generateNormalDistributionHints(level)

    default:
      return generateGenericHints(operation, level)
  }
}
