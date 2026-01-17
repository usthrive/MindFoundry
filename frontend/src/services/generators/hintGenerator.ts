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
    default:
      return generateGenericHints(operation, level)
  }
}
