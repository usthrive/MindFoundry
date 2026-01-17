import type { Problem, Level4AProblemType, MatchingItem, MatchingData } from '../types'
import { randomInt, randomChoice, generateId } from '../utils'
import { generateCountingHints, generateGenericHints } from '../hintGenerator'

const MATCHING_OBJECTS = ['apple', 'star', 'flower', 'heart', 'butterfly', 'fish']

function generateMatchingItems(count: number, maxNum: number): MatchingItem[] {
  const items: MatchingItem[] = []
  const usedCounts = new Set<number>()

  for (let i = 0; i < count; i++) {
    let itemCount: number
    do {
      itemCount = randomInt(1, Math.min(maxNum, 10))
    } while (usedCounts.has(itemCount))
    usedCounts.add(itemCount)

    items.push({
      id: generateId(),
      visual: MATCHING_OBJECTS[i % MATCHING_OBJECTS.length],
      count: itemCount,
    })
  }

  return items
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getWorksheetConfig(worksheet: number): {
  type: Level4AProblemType
  maxNumber: number
  part: number
} {
  if (worksheet <= 40) {
    return { 
      type: 'trace_number_1_to_10', 
      maxNumber: 10, 
      part: Math.ceil(worksheet / 10) 
    }
  }
  if (worksheet <= 100) {
    return { 
      type: 'write_number_1_to_10', 
      maxNumber: 10, 
      part: Math.ceil((worksheet - 40) / 10) 
    }
  }
  if (worksheet <= 120) {
    return { 
      type: 'write_number_1_to_20', 
      maxNumber: 20, 
      part: Math.ceil((worksheet - 100) / 10) 
    }
  }
  if (worksheet <= 140) {
    return { 
      type: 'write_number_1_to_30', 
      maxNumber: 30, 
      part: Math.ceil((worksheet - 120) / 10) 
    }
  }
  return { 
    type: 'write_number_1_to_50', 
    maxNumber: 50, 
    part: Math.ceil((worksheet - 140) / 10) 
  }
}

function generateTracingProblem(maxNumber: number): Problem {
  const number = randomInt(1, maxNumber)

  return {
    id: generateId(),
    level: '4A',
    worksheetNumber: 1,
    type: 'writing',
    subtype: 'trace_number_1_to_10',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Trace the number ${number}`,
    correctAnswer: number,
    visualAssets: [`trace_number_${number}`],
    hints: [
      'Follow the dotted lines',
      'Start at the top',
    ],
    graduatedHints: generateGenericHints('writing', '4A'),
  }
}

function generateMatchingProblem(maxNumber: number): Problem {
  const itemCount = 3
  const items = generateMatchingItems(itemCount, maxNumber)
  const correctCounts = items.map(item => item.count)

  // Add some distractors to options
  const distractorCount = 1
  const distractors: number[] = []
  while (distractors.length < distractorCount) {
    const d = randomInt(1, Math.min(maxNumber, 10))
    if (!correctCounts.includes(d) && !distractors.includes(d)) {
      distractors.push(d)
    }
  }

  const options = shuffleArray([...correctCounts, ...distractors])

  const matchingData: MatchingData = {
    items,
    options,
  }

  return {
    id: generateId(),
    level: '4A',
    worksheetNumber: 1,
    type: 'matching',
    subtype: 'match_number_to_objects',
    difficulty: 2,
    displayFormat: 'matching',
    interactionType: 'match',
    question: 'Count each group and match it to the correct number',
    correctAnswer: items.map(i => `${i.id}:${i.count}`).join(','),
    matchingData,
    hints: [
      'Count the objects in each group',
      'Match each group to its number',
    ],
    graduatedHints: generateCountingHints(items[0]?.count || 5, '4A'),
  }
}

function generateWritingProblem(maxNumber: number): Problem {
  const number = randomInt(1, maxNumber)

  let subtype: Level4AProblemType = 'write_number_1_to_10'
  if (maxNumber > 10 && maxNumber <= 20) subtype = 'write_number_1_to_20'
  if (maxNumber > 20 && maxNumber <= 30) subtype = 'write_number_1_to_30'
  if (maxNumber > 30) subtype = 'write_number_1_to_50'

  // Use matching or counting problem types (removed confusing 'from_model')
  const problemTypes = ['matching', 'from_counting', 'from_word']
  const problemType = randomChoice(problemTypes)

  if (problemType === 'matching') {
    return generateMatchingProblem(maxNumber)
  }
  
  if (problemType === 'from_counting') {
    const object = randomChoice(['star', 'dot', 'circle', 'square'])
    return {
      id: generateId(),
      level: '4A',
      worksheetNumber: 1,
      type: 'writing',
      subtype,
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Count the ${object}s and write the number`,
      correctAnswer: number,
      visualAssets: [`${object}_grid_${number}`],
      hints: [
        'Count all the objects first',
        'Then write the number',
      ],
      graduatedHints: generateCountingHints(number, '4A'),
    }
  }
  
  const numberWords: Record<number, string> = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
    16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
  }
  
  const word = numberWords[number] || String(number)
  return {
    id: generateId(),
    level: '4A',
    worksheetNumber: 1,
    type: 'writing',
    subtype,
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Write the number for "${word}"`,
    correctAnswer: number,
    hints: [
      'Think about what number this word means',
    ],
    graduatedHints: generateGenericHints('writing', '4A'),
  }
}

function generateNumberTableProblem(maxNumber: number): Problem {
  const startNum = randomInt(1, Math.max(1, maxNumber - 10))
  const endNum = Math.min(startNum + 9, maxNumber)
  
  const missingIndices = new Set<number>()
  const totalNumbers = endNum - startNum + 1
  const numMissing = Math.min(3, Math.floor(totalNumbers / 3))
  
  while (missingIndices.size < numMissing) {
    missingIndices.add(randomInt(0, totalNumbers - 1))
  }
  
  const tableDisplay: string[] = []
  const answers: number[] = []
  
  for (let i = 0; i < totalNumbers; i++) {
    const num = startNum + i
    if (missingIndices.has(i)) {
      tableDisplay.push('___')
      answers.push(num)
    } else {
      tableDisplay.push(String(num))
    }
  }
  
  return {
    id: generateId(),
    level: '4A',
    worksheetNumber: 1,
    type: 'writing',
    subtype: 'number_table_completion',
    difficulty: 2,
    displayFormat: 'table',
    question: `Complete the number table:\n${tableDisplay.join(' | ')}`,
    correctAnswer: answers.join(', '),
    operands: [startNum, endNum],
    hints: [
      'Count from the first number',
      'Each box is 1 more than the one before',
    ],
    graduatedHints: generateCountingHints(answers[0] || startNum, '4A'),
  }
}

function generateConsecutiveWritingProblem(maxNumber: number): Problem {
  const startNum = randomInt(1, Math.max(1, maxNumber - 5))
  const count = randomInt(3, 5)
  const endNum = Math.min(startNum + count - 1, maxNumber)
  
  const numbers: number[] = []
  for (let i = startNum; i <= endNum; i++) {
    numbers.push(i)
  }
  
  return {
    id: generateId(),
    level: '4A',
    worksheetNumber: 1,
    type: 'writing',
    subtype: 'write_number_1_to_50',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Write the numbers from ${startNum} to ${endNum}`,
    correctAnswer: numbers.join(', '),
    operands: [startNum, endNum],
    hints: [
      `Start with ${startNum}`,
      'Add 1 each time until you reach the end',
    ],
    graduatedHints: generateCountingHints(startNum, '4A'),
  }
}

export function generate4AProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  if (config.type === 'trace_number_1_to_10') {
    problem = generateTracingProblem(config.maxNumber)
  } else if (config.type === 'number_table_completion') {
    problem = generateNumberTableProblem(config.maxNumber)
  } else {
    if (Math.random() < 0.15 && config.maxNumber > 10) {
      problem = generateNumberTableProblem(config.maxNumber)
    } else if (Math.random() < 0.1 && config.maxNumber > 20) {
      problem = generateConsecutiveWritingProblem(config.maxNumber)
    } else {
      problem = generateWritingProblem(config.maxNumber)
    }
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generate4AProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generate4AProblem(worksheet))
  }
  return problems
}

export function get4AWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<Level4AProblemType, string> = {
    'trace_number_1_to_10': `Number Tracing Exercises ${config.part}`,
    'write_number_1_to_10': `Number Writing Exercises up to 10 Part ${config.part}`,
    'write_number_1_to_20': `Number Writing Exercises up to 20 Part ${config.part}`,
    'write_number_1_to_30': `Number Writing Exercises up to 30 Part ${config.part}`,
    'write_number_1_to_50': `Numbers up to 50 Part ${config.part}`,
    'number_table_completion': 'Number Table Completion',
    'match_number_to_objects': 'Match Numbers to Objects',
  }
  
  return {
    level: '4A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '0.5-2 min',
    problemTypes: [config.type],
  }
}
