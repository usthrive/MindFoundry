import type { Problem, LevelXPProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'
import {
  generatePermutationHints,
  generateCombinationHints,
  generateBinomialExpansionHints,
  generateBasicProbabilityHints,
  generateConditionalProbabilityHints,
  generateExpectedValueHints,
  generateGenericHints,
} from '../hintGenerator'

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

function permutation(n: number, r: number): number {
  return factorial(n) / factorial(n - r)
}

function combination(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r))
}

function getWorksheetConfig(worksheet: number): {
  type: LevelXPProblemType
} {
  if (worksheet <= 20) return { type: 'permutation_basic' }
  if (worksheet <= 35) return { type: 'combination_basic' }
  if (worksheet <= 50) return { type: 'binomial_expansion' }
  if (worksheet <= 65) return { type: 'probability_basic' }
  if (worksheet <= 80) return { type: 'conditional_probability' }
  return { type: 'expected_value' }
}

function generatePermutationBasic(): Problem {
  const n = randomInt(5, 10)
  const r = randomInt(2, Math.min(4, n))
  
  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'permutation',
    subtype: 'permutation_basic',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `How many ways can ${r} items be arranged from a set of ${n} distinct items?`,
    correctAnswer: permutation(n, r),
    hints: [
      'This is a permutation: P(n,r) = n!/(n-r)!',
      `P(${n},${r}) = ${n}!/${n - r}!`,
    ],
    graduatedHints: generatePermutationHints(n, r, 'XP'),
  }
}

function generatePermutationWithRepetition(): Problem {
  const word = randomChoice(['MISSISSIPPI', 'COMMITTEE', 'SUCCESS', 'BANANA'])

  const counts: Record<string, { letters: Record<string, number>; total: number }> = {
    MISSISSIPPI: { letters: { M: 1, I: 4, S: 4, P: 2 }, total: 11 },
    COMMITTEE: { letters: { C: 1, O: 1, M: 2, I: 1, T: 2, E: 2 }, total: 9 },
    SUCCESS: { letters: { S: 3, U: 1, C: 2 }, total: 7 },
    BANANA: { letters: { B: 1, A: 3, N: 2 }, total: 6 },
  }

  const data = counts[word]
  const denominator = Object.values(data.letters).map(c => `${c}!`).join(' × ')

  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'permutation',
    subtype: 'permutation_with_repetition',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `How many different arrangements of the letters in "${word}" are possible?`,
    correctAnswer: `${data.total}!/(${denominator})`,
    hints: [
      'Use the formula for permutations with repetition',
      'n!/(n₁! × n₂! × ... × nₖ!)',
    ],
    graduatedHints: generateGenericHints('permutation_repetition', 'XP'),
  }
}

function generateCircularPermutation(): Problem {
  const n = randomInt(4, 8)
  const scenario = randomChoice(['table', 'necklace', 'bracelet'])

  if (scenario === 'table') {
    return {
      id: generateId(),
      level: 'XP',
      worksheetNumber: 1,
      type: 'permutation',
      subtype: 'circular_permutation',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `In how many ways can ${n} people be seated around a circular table?`,
      correctAnswer: factorial(n - 1),
      hints: [
        'For circular arrangements, fix one position',
        'Circular permutation = (n-1)!',
      ],
      graduatedHints: generateGenericHints('circular_permutation', 'XP'),
    }
  }

  if (scenario === 'necklace') {
    return {
      id: generateId(),
      level: 'XP',
      worksheetNumber: 1,
      type: 'permutation',
      subtype: 'circular_permutation',
      difficulty: 3,
      displayFormat: 'horizontal',
      question: `In how many ways can ${n} different beads be arranged on a necklace?`,
      correctAnswer: `${factorial(n - 1)}/2 = ${factorial(n - 1) / 2}`,
      hints: [
        'Necklace can be flipped, so divide by 2',
        '(n-1)!/2',
      ],
      graduatedHints: generateGenericHints('necklace_permutation', 'XP'),
    }
  }

  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'permutation',
    subtype: 'circular_permutation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${n} keys are to be arranged on a circular key ring. How many distinct arrangements are possible?`,
    correctAnswer: `${factorial(n - 1)}/2 = ${factorial(n - 1) / 2}`,
    hints: ['Key ring can be flipped, use (n-1)!/2'],
    graduatedHints: generateGenericHints('circular_permutation', 'XP'),
  }
}

function generateCombinationWithRepetition(): Problem {
  const n = randomInt(3, 5)
  const r = randomInt(3, 5)

  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'combination',
    subtype: 'combination_with_repetition',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `How many ways can you choose ${r} items from ${n} types (repetition allowed)?`,
    correctAnswer: combination(n + r - 1, r),
    hints: [
      'Combination with repetition: C(n+r-1, r)',
      `C(${n + r - 1}, ${r})`,
    ],
    graduatedHints: generateGenericHints('combination_repetition', 'XP'),
  }
}

function generateBayesTheorem(): Problem {
  const scenarios = [
    {
      question: 'A test is 95% accurate for detecting a disease. If 1% of population has the disease and a person tests positive, what is P(has disease | positive test)?',
      answer: 'P(D|+) = (0.95 × 0.01) / [(0.95 × 0.01) + (0.05 × 0.99)]',
      hints: ['Use Bayes theorem: P(A|B) = P(B|A)×P(A) / P(B)', 'Consider true positives and false positives'],
    },
    {
      question: 'Box A has 3 red, 2 blue balls. Box B has 4 red, 1 blue. A box is chosen randomly, then a ball. If ball is red, what is P(from Box A)?',
      answer: 'P(A|R) = (3/5 × 1/2) / [(3/5 × 1/2) + (4/5 × 1/2)] = 3/7',
      hints: ['Apply Bayes theorem', 'P(A|R) = P(R|A)×P(A) / P(R)'],
    },
  ]

  const scenario = randomChoice(scenarios)

  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'bayes_theorem',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: scenario.question,
    correctAnswer: scenario.answer,
    hints: scenario.hints,
    graduatedHints: generateGenericHints('bayes_theorem', 'XP'),
  }
}

function generateIndependentEvents(): Problem {
  const n1 = randomInt(2, 4)
  const n2 = randomInt(2, 4)

  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'independent_events',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `A die is rolled ${n1} times and a coin is flipped ${n2} times. What is the probability of getting all sixes and all heads?`,
    correctAnswer: `(1/6)^${n1} × (1/2)^${n2} = 1/${Math.pow(6, n1) * Math.pow(2, n2)}`,
    hints: [
      'For independent events, multiply probabilities',
      'P(A and B) = P(A) × P(B)',
    ],
    graduatedHints: generateGenericHints('independent_events', 'XP'),
  }
}

function generateCombinationBasic(): Problem {
  const n = randomInt(6, 12)
  const r = randomInt(2, Math.min(5, n))
  
  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'combination',
    subtype: 'combination_basic',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `How many ways can a committee of ${r} be chosen from ${n} people?`,
    correctAnswer: combination(n, r),
    hints: [
      'This is a combination: C(n,r) = n!/[r!(n-r)!]',
      `C(${n},${r}) = ${n}!/[${r}!×${n - r}!]`,
    ],
    graduatedHints: generateCombinationHints(n, r, 'XP'),
  }
}

function generateBinomialExpansion(): Problem {
  const n = randomInt(3, 6)
  const a = randomChoice([1, 2])
  const b = randomChoice([1, -1, 2, -2])
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'algebra',
    subtype: 'binomial_expansion',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find the coefficient of x³ in the expansion of (${a === 1 ? '' : a}x ${bStr})^${n}`,
    correctAnswer: `C(${n},3) × ${a}³ × ${b}^${n - 3}`,
    hints: [
      'Use the Binomial Theorem',
      'The term with x³ has the form C(n,3) × (ax)³ × b^(n-3)',
    ],
    graduatedHints: generateBinomialExpansionHints(a, b, n, 'XP'),
  }
}

function generateProbabilityBasic(): Problem {
  const type = randomChoice(['dice', 'cards', 'coins'])
  
  if (type === 'dice') {
    const target = randomInt(1, 6)
    return {
      id: generateId(),
      level: 'XP',
      worksheetNumber: 1,
      type: 'probability',
      subtype: 'probability_basic',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `What is the probability of rolling a ${target} on a fair die?`,
      correctAnswer: '1/6',
      hints: ['P(event) = favorable outcomes / total outcomes'],
      graduatedHints: generateBasicProbabilityHints('dice', 'XP'),
    }
  }
  
  if (type === 'cards') {
    const suit = randomChoice(['heart', 'spade', 'diamond', 'club'])
    return {
      id: generateId(),
      level: 'XP',
      worksheetNumber: 1,
      type: 'probability',
      subtype: 'probability_basic',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `What is the probability of drawing a ${suit} from a standard deck?`,
      correctAnswer: '13/52 = 1/4',
      hints: ['13 cards of each suit in a deck of 52'],
      graduatedHints: generateBasicProbabilityHints('cards', 'XP'),
    }
  }
  
  const flips = randomInt(2, 4)
  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'probability_basic',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `What is the probability of getting all heads in ${flips} coin flips?`,
    correctAnswer: `1/${Math.pow(2, flips)}`,
    hints: ['Each flip has probability 1/2, multiply for independent events'],
    graduatedHints: generateBasicProbabilityHints('coins', 'XP'),
  }
}

function generateConditionalProbability(): Problem {
  const scenario = randomChoice(['bag', 'cards'])
  
  if (scenario === 'bag') {
    const red = randomInt(3, 6)
    const blue = randomInt(3, 6)
    const total = red + blue

    return {
      id: generateId(),
      level: 'XP',
      worksheetNumber: 1,
      type: 'probability',
      subtype: 'conditional_probability',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `A bag has ${red} red and ${blue} blue balls. Two balls are drawn without replacement. What is P(2nd is red | 1st is red)?`,
      correctAnswer: `${red - 1}/${total - 1}`,
      hints: [
        'After drawing first red, there are now red-1 red balls',
        'Total balls is now total-1',
      ],
      graduatedHints: generateConditionalProbabilityHints('bag', 'XP'),
    }
  }
  
  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'conditional_probability',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Two cards are drawn without replacement. What is P(2nd is Ace | 1st is Ace)?`,
    correctAnswer: '3/51',
    hints: ['After drawing one ace, 3 aces remain in 51 cards'],
    graduatedHints: generateConditionalProbabilityHints('cards', 'XP'),
  }
}

function generateExpectedValue(): Problem {
  const type = randomChoice(['dice', 'game'])
  
  if (type === 'dice') {
    return {
      id: generateId(),
      level: 'XP',
      worksheetNumber: 1,
      type: 'probability',
      subtype: 'expected_value',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `What is the expected value when rolling a fair die?`,
      correctAnswer: '3.5',
      hints: [
        'E(X) = Σ x × P(x)',
        '(1+2+3+4+5+6)/6',
      ],
      graduatedHints: generateExpectedValueHints('dice', 'XP'),
    }
  }
  
  const win = randomInt(5, 10)
  const lose = randomInt(2, 4)
  
  return {
    id: generateId(),
    level: 'XP',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'expected_value',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `A game pays $${win} for heads and loses $${lose} for tails. What is the expected value?`,
    correctAnswer: `$${(win - lose) / 2}`,
    hints: [
      'E(X) = (win × P(win)) + (lose × P(lose))',
      `(${win} × 0.5) + (-${lose} × 0.5)`,
    ],
    graduatedHints: generateExpectedValueHints('game', 'XP'),
  }
}

export function generateXPProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  const variety = Math.random()

  switch (config.type) {
    case 'permutation_basic':
      problem = generatePermutationBasic()
      break
    case 'permutation_with_repetition':
      problem = generatePermutationWithRepetition()
      break
    case 'circular_permutation':
      problem = generateCircularPermutation()
      break
    case 'combination_basic':
    case 'combination_word_problems':
      if (variety < 0.7) problem = generateCombinationBasic()
      else problem = generateCombinationWithRepetition()
      break
    case 'combination_with_repetition':
      problem = generateCombinationWithRepetition()
      break
    case 'binomial_expansion':
      problem = generateBinomialExpansion()
      break
    case 'probability_basic':
      problem = generateProbabilityBasic()
      break
    case 'independent_events':
      problem = generateIndependentEvents()
      break
    case 'conditional_probability':
      if (variety < 0.6) problem = generateConditionalProbability()
      else problem = generateBayesTheorem()
      break
    case 'bayes_theorem':
      problem = generateBayesTheorem()
      break
    case 'expected_value':
      problem = generateExpectedValue()
      break
    default:
      problem = generatePermutationBasic()
  }

  problem.worksheetNumber = worksheet
  return problem
}

export function generateXPProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateXPProblem(worksheet))
  }
  return problems
}

export function getXPWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelXPProblemType, string> = {
    'permutation_basic': 'Basic Permutations',
    'permutation_with_repetition': 'Permutations with Repetition',
    'circular_permutation': 'Circular Permutations',
    'combination_basic': 'Basic Combinations',
    'combination_with_repetition': 'Combinations with Repetition',
    'combination_word_problems': 'Combination Word Problems',
    'binomial_expansion': 'Binomial Expansion',
    'probability_basic': 'Basic Probability',
    'conditional_probability': 'Conditional Probability',
    'bayes_theorem': 'Bayes Theorem',
    'independent_events': 'Independent Events',
    'expected_value': 'Expected Value',
  }
  
  return {
    level: 'XP' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
