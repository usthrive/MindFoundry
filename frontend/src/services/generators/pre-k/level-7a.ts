import type { Problem, Level7AProblemType } from '../types'
import { randomInt, randomChoice, generateId } from '../utils'

const COUNTING_OBJECTS = ['apple', 'star', 'ball', 'flower', 'heart', 'cat', 'dog', 'fish', 'bird', 'tree']

function getWorksheetConfig(worksheet: number): {
  type: Level7AProblemType
  maxCount: number
} {
  if (worksheet <= 30) {
    return { type: 'count_pictures_to_5', maxCount: 5 }
  }
  if (worksheet <= 100) {
    const subRange = Math.floor((worksheet - 31) / 10)
    if (subRange < 4) {
      return { type: 'count_pictures_to_10', maxCount: 10 }
    }
    return { type: 'count_dots_to_10', maxCount: 10 }
  }
  if (worksheet <= 150) {
    return { type: 'match_quantity_to_numeral', maxCount: 10 }
  }
  return { type: 'dot_pattern_recognition', maxCount: 10 }
}

function generateCountPicturesProblem(maxCount: number): Problem {
  const count = randomInt(1, maxCount)
  const object = randomChoice(COUNTING_OBJECTS)
  const plural = count === 1 ? object : `${object}s`
  
  return {
    id: generateId(),
    level: '7A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: maxCount <= 5 ? 'count_pictures_to_5' : 'count_pictures_to_10',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Count the ${plural}`,
    correctAnswer: count,
    visualAssets: [`${object}_${count}`],
    hints: [
      'Point to each one as you count',
      `Count slowly: 1, 2, 3...`,
    ],
  }
}

function generateCountDotsProblem(maxCount: number): Problem {
  const count = randomInt(1, maxCount)
  const pattern = getDotPattern(count)
  
  return {
    id: generateId(),
    level: '7A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: 'count_dots_to_10',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: 'How many dots?',
    correctAnswer: count,
    visualAssets: [`dots_pattern_${pattern}`],
    hints: [
      'Touch each dot as you count',
    ],
  }
}

function getDotPattern(count: number): string {
  const patterns: Record<number, string[]> = {
    1: ['center'],
    2: ['horizontal', 'vertical', 'diagonal'],
    3: ['triangle', 'line', 'L-shape'],
    4: ['square', 'line', 'diamond'],
    5: ['dice', 'pentagon', 'plus'],
    6: ['dice', 'two-rows', 'hexagon'],
    7: ['dice-plus-1', 'two-rows-plus-1'],
    8: ['two-rows', 'grid'],
    9: ['grid', 'three-rows'],
    10: ['two-rows', 'pentagon-double'],
  }
  return randomChoice(patterns[count] || ['grid'])
}

function generateMatchQuantityProblem(maxCount: number): Problem {
  const targetCount = randomInt(1, maxCount)
  const options = generateDistractorNumbers(targetCount, 1, maxCount, 3)
  
  return {
    id: generateId(),
    level: '7A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: 'match_quantity_to_numeral',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Which number shows ${targetCount} objects?`,
    correctAnswer: targetCount,
    operands: options,
    visualAssets: [`objects_${targetCount}`],
    hints: [
      'Count the objects first',
      'Find that number in the choices',
    ],
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

function generateDotPatternRecognitionProblem(maxCount: number): Problem {
  const count = randomInt(1, maxCount)
  const pattern = getDotPattern(count)
  
  return {
    id: generateId(),
    level: '7A',
    worksheetNumber: 1,
    type: 'counting',
    subtype: 'dot_pattern_recognition',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: 'How many dots? (Try to see it without counting one by one)',
    correctAnswer: count,
    visualAssets: [`dots_subitize_${pattern}_${count}`],
    hints: [
      'Look at the whole pattern',
      'Does it look like a familiar shape?',
    ],
  }
}

export function generate7AProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'count_pictures_to_5':
    case 'count_pictures_to_10':
      problem = generateCountPicturesProblem(config.maxCount)
      break
    case 'count_dots_to_10':
      problem = generateCountDotsProblem(config.maxCount)
      break
    case 'match_quantity_to_numeral':
      problem = generateMatchQuantityProblem(config.maxCount)
      break
    case 'dot_pattern_recognition':
      problem = generateDotPatternRecognitionProblem(config.maxCount)
      break
    default:
      problem = generateCountPicturesProblem(5)
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generate7AProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generate7AProblem(worksheet))
  }
  return problems
}

export function get7AWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<Level7AProblemType, string> = {
    'count_pictures_to_5': 'Counting (Up to 5)',
    'count_pictures_to_10': 'Counting (Up to 10)',
    'count_dots_to_10': 'Counting Dots (Up to 10)',
    'match_quantity_to_numeral': 'Number Recognition 1-10',
    'dot_pattern_recognition': 'Dot Pattern Recognition',
  }
  
  return {
    level: '7A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: 'Not timed',
    problemTypes: [config.type],
  }
}
