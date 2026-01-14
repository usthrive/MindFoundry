import type { Problem, LevelAProblemType } from '../types'
import { randomInt, generateId } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelAProblemType
  maxSum?: number
  subtrahend?: number
  maxMinuend?: number
} {
  if (worksheet <= 10) return { type: 'addition_sums_to_12', maxSum: 12 }
  if (worksheet <= 20) return { type: 'addition_sums_to_15', maxSum: 15 }
  if (worksheet <= 30) return { type: 'addition_sums_to_18', maxSum: 18 }
  if (worksheet <= 40) return { type: 'addition_sums_to_20', maxSum: 20 }
  if (worksheet <= 50) return { type: 'addition_sums_to_24', maxSum: 24 }
  if (worksheet <= 60) return { type: 'addition_sums_to_28', maxSum: 28 }
  if (worksheet <= 80) return { type: 'addition_summary', maxSum: 28 }
  if (worksheet <= 90) return { type: 'subtract_1', subtrahend: 1, maxMinuend: 20 }
  if (worksheet <= 100) return { type: 'subtract_2', subtrahend: 2, maxMinuend: 20 }
  if (worksheet <= 110) return { type: 'subtract_3', subtrahend: 3, maxMinuend: 20 }
  if (worksheet <= 120) return { type: 'subtract_up_to_3', maxMinuend: 20 }
  if (worksheet <= 130) return { type: 'subtract_up_to_5', maxMinuend: 20 }
  if (worksheet <= 140) return { type: 'subtract_from_10', maxMinuend: 10 }
  if (worksheet <= 150) return { type: 'subtract_from_11', maxMinuend: 11 }
  if (worksheet <= 160) return { type: 'subtract_from_12', maxMinuend: 12 }
  if (worksheet <= 170) return { type: 'subtract_from_14', maxMinuend: 14 }
  if (worksheet <= 180) return { type: 'subtract_from_16', maxMinuend: 16 }
  if (worksheet <= 190) return { type: 'subtract_from_20', maxMinuend: 20 }
  return { type: 'subtraction_summary', maxMinuend: 20 }
}

function generateAdditionProblem(maxSum: number, subtype: LevelAProblemType, worksheet: number = 1): Problem {
  const sum = randomInt(Math.min(3, maxSum), maxSum)
  const first = randomInt(1, sum - 1)
  const second = sum - first

  // KUMON COMPLIANCE FIX: Missing addend only allowed for late Level A (worksheet 150+)
  // Reference: /Requirements/06-KUMON-OFFICIAL-PROGRESSION.md
  const variants = worksheet >= 150
    ? ['standard', 'commutative', 'missing'] as const
    : ['standard', 'commutative'] as const
  const variant = variants[randomInt(0, variants.length - 1)]

  if (variant === 'commutative') {
    return {
      id: generateId(),
      level: 'A',
      worksheetNumber: worksheet,
      type: 'addition',
      subtype,
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `${second} + ${first} = ___`,
      correctAnswer: sum,
      operands: [second, first],
      hints: [`${second} + ${first} is the same as ${first} + ${second}`],
    }
  }

  if (variant === 'missing') {
    // This branch only executes for worksheet >= 150
    const missingFirst = Math.random() < 0.5
    if (missingFirst) {
      return {
        id: generateId(),
        level: 'A',
        worksheetNumber: worksheet,
        type: 'addition',
        subtype,
        difficulty: 2,
        displayFormat: 'horizontal',
        question: `___ + ${second} = ${sum}`,
        correctAnswer: first,
        operands: [first, second],
        missingPosition: 0,
        hints: [`What number plus ${second} equals ${sum}?`],
      }
    }
    return {
      id: generateId(),
      level: 'A',
      worksheetNumber: worksheet,
      type: 'addition',
      subtype,
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `${first} + ___ = ${sum}`,
      correctAnswer: second,
      operands: [first, second],
      missingPosition: 1,
      hints: [`What do you add to ${first} to get ${sum}?`],
    }
  }

  return {
    id: generateId(),
    level: 'A',
    worksheetNumber: worksheet,
    type: 'addition',
    subtype,
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${first} + ${second} = ___`,
    correctAnswer: sum,
    operands: [first, second],
    hints: [`Start at ${first} and count up ${second}`],
  }
}

function generateSubtractionProblem(
  subtrahend: number | undefined,
  maxMinuend: number,
  subtype: LevelAProblemType,
  worksheet: number = 1
): Problem {
  const minuend = randomInt(subtrahend ? subtrahend + 1 : 2, maxMinuend)
  const actualSubtrahend = subtrahend || randomInt(1, Math.min(minuend - 1, subtype === 'subtract_up_to_3' ? 3 : 5))
  const difference = minuend - actualSubtrahend

  // KUMON COMPLIANCE FIX: Missing operand variants only allowed for late Level A (worksheet 170+)
  // Early subtraction (worksheets 81-169) should ONLY use standard format: a - b = ?
  // Reference: /Requirements/06-KUMON-OFFICIAL-PROGRESSION.md
  const variants = worksheet >= 170
    ? ['standard', 'missing_subtrahend', 'missing_minuend'] as const
    : ['standard'] as const
  const variant = variants[randomInt(0, variants.length - 1)]

  if (variant === 'missing_subtrahend') {
    // This branch only executes for worksheet >= 170
    return {
      id: generateId(),
      level: 'A',
      worksheetNumber: worksheet,
      type: 'subtraction',
      subtype,
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `${minuend} - ___ = ${difference}`,
      correctAnswer: actualSubtrahend,
      operands: [minuend, actualSubtrahend],
      missingPosition: 1,
      hints: [
        `What do you subtract from ${minuend} to get ${difference}?`,
        `Count from ${difference} to ${minuend}`,
      ],
    }
  }

  if (variant === 'missing_minuend') {
    // This branch only executes for worksheet >= 170
    return {
      id: generateId(),
      level: 'A',
      worksheetNumber: worksheet,
      type: 'subtraction',
      subtype,
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `___ - ${actualSubtrahend} = ${difference}`,
      correctAnswer: minuend,
      operands: [minuend, actualSubtrahend],
      missingPosition: 0,
      hints: [
        `What number minus ${actualSubtrahend} equals ${difference}?`,
        `${difference} + ${actualSubtrahend} = ?`,
      ],
    }
  }

  // Standard format: a - b = ? (used for worksheets 81-169)
  return {
    id: generateId(),
    level: 'A',
    worksheetNumber: worksheet,
    type: 'subtraction',
    subtype,
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${minuend} - ${actualSubtrahend} = ___`,
    correctAnswer: difference,
    operands: [minuend, actualSubtrahend],
    hints: [
      `Start at ${minuend} and count back ${actualSubtrahend}`,
      actualSubtrahend <= 3
        ? `Count: ${Array.from({length: actualSubtrahend + 1}, (_, i) => minuend - i).join(', ')}`
        : 'You can use your fingers to count back',
    ],
  }
}

function generateSubtractionFromFixedProblem(maxMinuend: number, subtype: LevelAProblemType): Problem {
  const minuend = maxMinuend
  const subtrahend = randomInt(1, minuend - 1)
  const difference = minuend - subtrahend
  
  return {
    id: generateId(),
    level: 'A',
    worksheetNumber: 1,
    type: 'subtraction',
    subtype,
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${minuend} - ${subtrahend} = ___`,
    correctAnswer: difference,
    operands: [minuend, subtrahend],
    hints: [
      `What is ${minuend} take away ${subtrahend}?`,
      `Start at ${minuend} and count back ${subtrahend}`,
    ],
  }
}

export function generateAProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem

  switch (config.type) {
    case 'addition_sums_to_12':
    case 'addition_sums_to_15':
    case 'addition_sums_to_18':
    case 'addition_sums_to_20':
    case 'addition_sums_to_24':
    case 'addition_sums_to_28':
    case 'addition_summary':
      // Pass worksheet number for missing addend compliance check
      problem = generateAdditionProblem(config.maxSum || 20, config.type, worksheet)
      break
    case 'subtract_1':
    case 'subtract_2':
    case 'subtract_3':
      // Pass worksheet number for missing operand compliance check
      problem = generateSubtractionProblem(config.subtrahend, config.maxMinuend || 20, config.type, worksheet)
      break
    case 'subtract_up_to_3':
    case 'subtract_up_to_5':
    case 'subtraction_summary':
      problem = generateSubtractionProblem(undefined, config.maxMinuend || 20, config.type, worksheet)
      break
    case 'subtract_from_10':
    case 'subtract_from_11':
    case 'subtract_from_12':
    case 'subtract_from_14':
    case 'subtract_from_16':
    case 'subtract_from_20':
      problem = generateSubtractionFromFixedProblem(config.maxMinuend || 10, config.type)
      break
    default:
      problem = generateAdditionProblem(20, 'addition_summary', worksheet)
  }

  problem.worksheetNumber = worksheet
  return problem
}

export function generateAProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateAProblem(worksheet))
  }
  return problems
}

export function getAWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelAProblemType, string> = {
    'addition_sums_to_12': 'Addition (Sums to 12)',
    'addition_sums_to_15': 'Addition (Sums to 15)',
    'addition_sums_to_18': 'Addition (Sums to 18)',
    'addition_sums_to_20': 'Addition (Sums to 20)',
    'addition_sums_to_24': 'Addition (Sums to 24)',
    'addition_sums_to_28': 'Addition (Sums to 28)',
    'addition_summary': 'Addition Summary',
    'subtract_1': 'Subtracting -1',
    'subtract_2': 'Subtracting -2',
    'subtract_3': 'Subtracting -3',
    'subtract_up_to_3': 'Subtracting -1 to -3',
    'subtract_up_to_5': 'Subtracting -1 to -5',
    'subtract_from_10': 'Subtracting from 10',
    'subtract_from_11': 'Subtracting from 11',
    'subtract_from_12': 'Subtracting from 12',
    'subtract_from_14': 'Subtracting from 14',
    'subtract_from_16': 'Subtracting from 16',
    'subtract_from_20': 'Subtracting from 20',
    'subtraction_summary': 'Subtraction Summary',
  }
  
  return {
    level: 'A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '8 min',
    problemTypes: [config.type],
  }
}
