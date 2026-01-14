import type { Problem, Level2AProblemType } from '../types'
import { randomInt, generateId } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: Level2AProblemType
  addends: number[]
  maxFirst: number
} {
  if (worksheet <= 10) {
    return { type: 'add_review_1_2_3', addends: [1, 2, 3], maxFirst: 20 }
  }
  if (worksheet <= 30) {
    return { type: 'add_4', addends: [4], maxFirst: 20 }
  }
  if (worksheet <= 50) {
    return { type: 'add_5', addends: [5], maxFirst: 20 }
  }
  if (worksheet <= 70) {
    return { type: 'add_up_to_5', addends: [1, 2, 3, 4, 5], maxFirst: 20 }
  }
  if (worksheet <= 90) {
    return { type: 'add_6', addends: [6], maxFirst: 20 }
  }
  if (worksheet <= 110) {
    return { type: 'add_7', addends: [7], maxFirst: 20 }
  }
  if (worksheet <= 130) {
    return { type: 'add_up_to_7', addends: [1, 2, 3, 4, 5, 6, 7], maxFirst: 20 }
  }
  if (worksheet <= 150) {
    return { type: 'add_8', addends: [8], maxFirst: 20 }
  }
  if (worksheet <= 160) {
    return { type: 'add_9', addends: [9], maxFirst: 20 }
  }
  if (worksheet <= 170) {
    return { type: 'add_10', addends: [10], maxFirst: 20 }
  }
  return { type: 'add_up_to_10', addends: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], maxFirst: 20 }
}

function generateAdditionProblem(addends: number[], maxFirst: number, subtype: Level2AProblemType): Problem {
  const addend = addends[randomInt(0, addends.length - 1)]
  const first = randomInt(1, maxFirst)
  const sum = first + addend

  // KUMON COMPLIANCE FIX: Level 2A should NEVER have missing addend problems
  // Missing addend is introduced in Level A, worksheet 150+
  // Reference: /Requirements/06-KUMON-OFFICIAL-PROGRESSION.md
  const problemVariants = ['standard', 'commutative'] as const
  const variant = problemVariants[randomInt(0, problemVariants.length - 1)]

  if (variant === 'commutative') {
    return {
      id: generateId(),
      level: '2A',
      worksheetNumber: 1,
      type: 'addition',
      subtype,
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `${addend} + ${first} = ___`,
      correctAnswer: sum,
      operands: [addend, first],
      hints: [
        `Start at ${addend} and count up ${first}`,
        'Or switch the numbers - the answer is the same!',
      ],
    }
  }

  // Standard format: a + b = ?
  return {
    id: generateId(),
    level: '2A',
    worksheetNumber: 1,
    type: 'addition',
    subtype,
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${first} + ${addend} = ___`,
    correctAnswer: sum,
    operands: [first, addend],
    hints: [
      `Start at ${first} and count up ${addend}`,
      addend <= 5
        ? `Count: ${Array.from({length: addend + 1}, (_, i) => first + i).join(', ')}`
        : 'You can use your fingers to help count',
    ],
  }
}

function generateVerticalProblem(addends: number[], maxFirst: number, subtype: Level2AProblemType): Problem {
  const addend = addends[randomInt(0, addends.length - 1)]
  const first = randomInt(1, maxFirst)
  const sum = first + addend
  
  const top = Math.max(first, addend)
  const bottom = Math.min(first, addend)
  
  return {
    id: generateId(),
    level: '2A',
    worksheetNumber: 1,
    type: 'addition',
    subtype,
    difficulty: 1,
    displayFormat: 'vertical',
    question: `  ${top.toString().padStart(2)}\n+ ${bottom.toString().padStart(2)}\n----`,
    correctAnswer: sum,
    operands: [top, bottom],
    hints: [
      `Add ${top} + ${bottom}`,
      `Start at ${top} and count up ${bottom}`,
    ],
  }
}

export function generate2AProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  
  const useVertical = worksheet > 100 && Math.random() < 0.3
  
  if (useVertical) {
    const problem = generateVerticalProblem(config.addends, config.maxFirst, config.type)
    problem.worksheetNumber = worksheet
    return problem
  }
  
  const problem = generateAdditionProblem(config.addends, config.maxFirst, config.type)
  problem.worksheetNumber = worksheet
  return problem
}

export function generate2AProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generate2AProblem(worksheet))
  }
  return problems
}

export function get2AWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<Level2AProblemType, string> = {
    'add_review_1_2_3': 'Review: Adding +1, +2, +3',
    'add_4': 'Adding +4',
    'add_5': 'Adding +5',
    'add_up_to_5': 'Adding +1 to +5 (Mixed)',
    'add_6': 'Adding +6',
    'add_7': 'Adding +7',
    'add_up_to_7': 'Adding +1 to +7 (Mixed)',
    'add_8': 'Adding +8',
    'add_9': 'Adding +9',
    'add_10': 'Adding +10',
    'add_up_to_10': 'Adding +1 to +10 (Mixed)',
  }
  
  return {
    level: '2A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '8 min',
    problemTypes: [config.type],
  }
}
