import type { Problem, Level6AProblemType } from '../types'
import { randomInt, randomChoice, generateId } from '../utils'
import { generateCountingHints, generateGenericHints } from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: Level6AProblemType
  maxCount: number
  part: number
} {
  if (worksheet <= 30) {
    return { type: 'count_to_5', maxCount: 5, part: Math.ceil(worksheet / 10) }
  }
  if (worksheet <= 100) {
    return { type: 'count_to_10', maxCount: 10, part: Math.ceil((worksheet - 30) / 10) }
  }
  if (worksheet <= 150) {
    return { type: 'number_reading_to_10', maxCount: 10, part: Math.ceil((worksheet - 100) / 10) }
  }
  if (worksheet <= 170) {
    return { type: 'dot_recognition_to_10', maxCount: 10, part: Math.ceil((worksheet - 150) / 10) }
  }
  // ADD MISSING PHASES per Kumon requirements
  if (worksheet <= 185) {
    return { type: 'count_to_20', maxCount: 20, part: Math.ceil((worksheet - 170) / 5) }
  }
  if (worksheet <= 200) {
    return { type: 'count_to_30', maxCount: 30, part: Math.ceil((worksheet - 185) / 5) }
  }
  return { type: 'count_to_30', maxCount: 30, part: 1 }
}

function generateCountProblem(maxCount: number): Problem {
  const count = randomInt(1, maxCount)
  const objects = ['apple', 'star', 'ball', 'flower', 'heart', 'butterfly', 'fish', 'bird']
  const object = randomChoice(objects)
  // Generate distractor options for tap-to-select UI
  const options = generateDistractorNumbers(count, 1, maxCount, 3)

  return {
    id: generateId(),
    level: '6A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: maxCount <= 5 ? 'count_to_5' : 'count_to_10',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Count the ${object}s`,
    correctAnswer: count,
    operands: options, // Options for tap-to-select
    visualAssets: [`${object}_${count}`],
    hints: ['Point to each one as you count'],
    graduatedHints: generateCountingHints(count, '6A'),
    interactionType: 'match' as const, // Use tap-to-select for Pre-K
  }
}

function generateNumberReadingProblem(maxCount: number): Problem {
  // SAFETY CAP: Number reading should never exceed 10 for Pre-K students
  // Per Kumon spec, Level 6A worksheets 101-150 are "Number Reading (Up to 10)"
  const cappedMaxCount = Math.min(maxCount, 10)
  const number = randomInt(1, cappedMaxCount)
  const numberWords: Record<number, string> = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten'
  }

  // Generate distractor options for tap-to-select UI
  const options = generateDistractorNumbers(number, 1, cappedMaxCount, 3)

  const problemTypes = ['read_numeral', 'match_word', 'identify_number']
  const problemType = randomChoice(problemTypes)

  if (problemType === 'read_numeral') {
    return {
      id: generateId(),
      level: '6A',
      worksheetNumber: 1,
      type: 'number_reading',
      subtype: 'number_reading_to_10',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `What number is this?`,
      // FIXED: Use numeric answer - young children can't spell words
      correctAnswer: number,
      operands: options, // Options for tap-to-select
      hints: ['Say the number out loud'],
      graduatedHints: generateGenericHints('number_reading', '6A'),
      visualAssets: [`numeral_${number}`],
      interactionType: 'match' as const,
    }
  }

  if (problemType === 'match_word') {
    return {
      id: generateId(),
      level: '6A',
      worksheetNumber: 1,
      type: 'number_reading',
      subtype: 'number_reading_to_10',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Find the number "${numberWords[number]}"`,
      correctAnswer: number,
      operands: options,
      hints: ['Look at each number and say it'],
      graduatedHints: generateGenericHints('number_reading', '6A'),
      interactionType: 'match' as const,
    }
  }

  return {
    id: generateId(),
    level: '6A',
    worksheetNumber: 1,
    type: 'number_reading',
    subtype: 'number_reading_to_10',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Point to the number ${number}`,
    correctAnswer: number,
    operands: options,
    hints: ['Find the number that looks like this'],
    graduatedHints: generateGenericHints('number_reading', '6A'),
    visualAssets: [`numeral_${number}`],
    interactionType: 'match' as const,
  }
}

function generateDotRecognitionProblem(maxCount: number): Problem {
  const count = randomInt(1, maxCount)
  const patterns = ['dice', 'random', 'line', 'grid']
  const pattern = randomChoice(patterns)
  // Generate distractor options for tap-to-select UI
  const options = generateDistractorNumbers(count, 1, maxCount, 3)

  return {
    id: generateId(),
    level: '6A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: 'dot_recognition_to_10',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: 'How many dots do you see?',
    correctAnswer: count,
    operands: options, // Options for tap-to-select
    visualAssets: [`dots_${pattern}_${count}`],
    hints: [
      'Look at the pattern',
      'You can count if you need to',
    ],
    graduatedHints: generateCountingHints(count, '6A'),
    interactionType: 'match' as const,
  }
}

function generateCount20_30Problem(maxCount: number): Problem {
  const count = randomInt(11, maxCount)
  const object = randomChoice(['block', 'bead', 'sticker', 'coin'])
  // Generate distractor options for tap-to-select UI
  const options = generateDistractorNumbers(count, 11, maxCount, 3)

  return {
    id: generateId(),
    level: '6A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: maxCount <= 20 ? 'count_to_20' : 'count_to_30',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Count all the ${object}s`,
    correctAnswer: count,
    operands: options, // Options for tap-to-select
    visualAssets: [`${object}_grid_${count}`],
    hints: [
      'Count in groups of 10',
      'Count 10, then count the rest',
    ],
    graduatedHints: generateCountingHints(count, '6A'),
    interactionType: 'match' as const,
  }
}

function generateDistractorNumbers(target: number, min: number, max: number, count: number): number[] {
  const numbers = new Set<number>([target])
  while (numbers.size < count + 1) {
    const n = randomInt(min, max)
    numbers.add(n)
  }
  return Array.from(numbers).sort(() => Math.random() - 0.5)
}

export function generate6AProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'count_to_5':
      problem = generateCountProblem(5)
      break
    case 'count_to_10':
      problem = generateCountProblem(10)
      break
    case 'number_reading_to_10':
      problem = generateNumberReadingProblem(10)
      break
    case 'dot_recognition_to_10':
      problem = generateDotRecognitionProblem(10)
      break
    case 'count_to_20':
      problem = generateCount20_30Problem(20)
      break
    case 'count_to_30':
      problem = generateCount20_30Problem(30)
      break
    case 'dot_recognition_to_20':
      problem = generateDotRecognitionProblem(20)
      break
    default:
      problem = generateCountProblem(10)
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generate6AProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generate6AProblem(worksheet))
  }
  return problems
}

export function get6AWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<Level6AProblemType, string> = {
    'count_to_5': `Counting (Up to 5) ${config.part}`,
    'count_to_10': `Counting (Up to 10) ${config.part}`,
    'count_to_20': 'Counting (Up to 20)',
    'count_to_30': 'Counting (Up to 30)',
    'number_reading_to_10': `Number Reading Exercises (Up to 10) ${config.part}`,
    'dot_recognition_to_10': `Number of Dots (Up to 10) ${config.part}`,
    'dot_recognition_to_20': 'Number of Dots (Up to 20)',
  }
  
  return {
    level: '6A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: 'Not timed',
    problemTypes: [config.type],
  }
}
