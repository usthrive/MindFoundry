import type { Problem, Level5AProblemType, SequenceItem } from '../types'
import { randomInt, randomChoice, generateId } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: Level5AProblemType
  maxNumber: number
  part: number
} {
  if (worksheet <= 100) {
    return { 
      type: 'number_reading_to_30', 
      maxNumber: 30, 
      part: Math.ceil(worksheet / 10) 
    }
  }
  if (worksheet <= 130) {
    return { 
      type: 'sequence_to_30', 
      maxNumber: 30, 
      part: Math.ceil((worksheet - 100) / 10) 
    }
  }
  if (worksheet <= 160) {
    return { 
      type: 'sequence_to_40', 
      maxNumber: 40, 
      part: Math.ceil((worksheet - 130) / 10) 
    }
  }
  if (worksheet <= 190) {
    return { 
      type: 'sequence_to_50', 
      maxNumber: 50, 
      part: Math.ceil((worksheet - 160) / 10) 
    }
  }
  return { 
    type: 'number_before_after', 
    maxNumber: 100, 
    part: 1 
  }
}

function generateNumberReadingProblem(maxNumber: number): Problem {
  const number = randomInt(1, maxNumber)
  const problemTypes = ['read', 'identify', 'compare']
  const problemType = randomChoice(problemTypes)
  
  if (problemType === 'read') {
    return {
      id: generateId(),
      level: '5A',
      worksheetNumber: 1,
      type: 'number_reading',
      subtype: 'number_reading_to_30',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `Read this number: ${number}`,
      correctAnswer: number,
      visualAssets: [`numeral_large_${number}`],
      hints: ['Say the number out loud'],
    }
  }
  
  if (problemType === 'identify') {
    const options = generateDistractorNumbers(number, 1, maxNumber, 3)
    return {
      id: generateId(),
      level: '5A',
      worksheetNumber: 1,
      type: 'number_reading',
      subtype: 'number_reading_to_30',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Which number is ${number}?`,
      correctAnswer: number,
      operands: options,
      hints: ['Look at each number carefully'],
    }
  }
  
  const num2 = randomInt(1, maxNumber)
  while (num2 === number) {
    return generateNumberReadingProblem(maxNumber)
  }
  return {
    id: generateId(),
    level: '5A',
    worksheetNumber: 1,
    type: 'number_reading',
    subtype: 'number_reading_to_30',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Which is bigger: ${number} or ${num2}?`,
    correctAnswer: Math.max(number, num2),
    operands: [number, num2],
    hints: ['Think about counting - which number comes later?'],
  }
}

function generateSequenceProblem(maxNumber: number): Problem {
  const startNum = randomInt(1, maxNumber - 4)
  const missingIndex = randomInt(1, 3)

  const sequenceData: SequenceItem[] = []
  for (let i = 0; i < 5; i++) {
    sequenceData.push({
      value: i === missingIndex ? null : startNum + i,
      isMissing: i === missingIndex
    })
  }

  let subtype: Level5AProblemType = 'sequence_to_30'
  if (maxNumber > 30 && maxNumber <= 40) subtype = 'sequence_to_40'
  if (maxNumber > 40) subtype = 'sequence_to_50'

  return {
    id: generateId(),
    level: '5A',
    worksheetNumber: 1,
    type: 'sequence',
    subtype,
    difficulty: 2,
    displayFormat: 'sequenceBoxes',
    interactionType: 'sequence',
    question: 'Fill in the missing number',
    correctAnswer: startNum + missingIndex,
    operands: sequenceData.filter(s => !s.isMissing).map(s => s.value as number),
    missingPosition: missingIndex,
    sequenceData,
    hints: [
      'Count forward from the first number',
      'Each number is 1 more than the one before',
    ],
  }
}

function generateNumberBeforeAfterProblem(maxNumber: number): Problem {
  const number = randomInt(2, maxNumber - 1)
  const askBefore = Math.random() < 0.5
  
  if (askBefore) {
    return {
      id: generateId(),
      level: '5A',
      worksheetNumber: 1,
      type: 'sequence',
      subtype: 'number_before_after',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `What number comes just BEFORE ${number}?`,
      correctAnswer: number - 1,
      operands: [number],
      hints: [
        'Count backwards by 1',
        `Count: ..., ___, ${number}`,
      ],
    }
  }
  
  return {
    id: generateId(),
    level: '5A',
    worksheetNumber: 1,
    type: 'sequence',
    subtype: 'number_before_after',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `What number comes just AFTER ${number}?`,
    correctAnswer: number + 1,
    operands: [number],
    hints: [
      'Count forward by 1',
      `Count: ${number}, ___`,
    ],
  }
}

function generateDistractorNumbers(target: number, min: number, max: number, count: number): number[] {
  const numbers = new Set<number>([target])
  while (numbers.size < count + 1) {
    let n = randomInt(min, max)
    if (Math.random() < 0.5 && target > min + 2 && target < max - 2) {
      n = target + randomChoice([-1, 1, -2, 2])
      n = Math.max(min, Math.min(max, n))
    }
    numbers.add(n)
  }
  return Array.from(numbers).sort(() => Math.random() - 0.5)
}

export function generate5AProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'number_reading_to_30':
      problem = generateNumberReadingProblem(config.maxNumber)
      break
    case 'sequence_to_30':
    case 'sequence_to_40':
    case 'sequence_to_50':
      problem = generateSequenceProblem(config.maxNumber)
      break
    case 'number_before_after':
      problem = generateNumberBeforeAfterProblem(config.maxNumber)
      break
    default:
      problem = generateSequenceProblem(30)
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generate5AProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generate5AProblem(worksheet))
  }
  return problems
}

export function get5AWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<Level5AProblemType, string> = {
    'number_reading_to_30': `Number Reading Exercises (Up to 30) ${config.part}`,
    'sequence_to_30': `Sequence of Numbers (Up to 30) ${config.part}`,
    'sequence_to_40': `Sequence of Numbers (Up to 40) ${config.part}`,
    'sequence_to_50': `Sequence of Numbers (Up to 50) ${config.part}`,
    'number_before_after': 'Large Numbers',
  }
  
  return {
    level: '5A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: 'Not timed',
    problemTypes: [config.type],
  }
}
