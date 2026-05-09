import type { Problem, Level3AProblemType } from '../types'
import { randomInt, generateId, formatSequence } from '../utils'
import { generateAdditionHints, generateSequenceHints } from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: Level3AProblemType
  addend?: number
  maxFirst?: number
  minFirst?: number
} {
  // FIXED: Aligned with Kumon requirements for Level 3A

  // Worksheets 1-70: NO ADDITION (mental math prep only)
  if (worksheet <= 70) {
    if (worksheet <= 30) return { type: 'sequence_to_100', maxFirst: 100 }
    if (worksheet <= 60) return { type: 'sequence_to_100', maxFirst: 100 }
    return { type: 'sequence_to_120', maxFirst: 120 }
  }

  // Worksheets 71-130: +1 only, with the spec ladder 12 → 18 → 24 → 30 → 60 → 1000
  // (spec lines 181-186). Previously 91-120 jumped straight to maxFirst=100,
  // skipping the gentle 24/30/60 steps — operand size doubled then 6×'d
  // overnight from one block to the next.
  if (worksheet <= 80) return { type: 'add_1_small', addend: 1, maxFirst: 12 }
  if (worksheet <= 90) return { type: 'add_1_small', addend: 1, maxFirst: 18 }
  if (worksheet <= 100) return { type: 'add_1_medium', addend: 1, maxFirst: 24 }
  if (worksheet <= 110) return { type: 'add_1_medium', addend: 1, maxFirst: 30 }
  if (worksheet <= 120) return { type: 'add_1_medium', addend: 1, maxFirst: 60 }
  if (worksheet <= 130) return { type: 'add_1_large', addend: 1, maxFirst: 1000 }

  // Spec lines 187-193: +2 ends at worksheet 160, then +3 spans 161-180,
  // then mixed +1/+2/+3 is 181-200. The previous boundaries had +2 lingering
  // through 170 and pushed mixed-practice to a single 10-sheet block.

  // Worksheets 131-150: +2 Part 1-2 (spec: max 14, then 18)
  if (worksheet <= 140) {
    return { type: 'add_2_small', addend: 2, maxFirst: 14 }
  }
  if (worksheet <= 150) {
    return { type: 'add_2_small', addend: 2, maxFirst: 18 }
  }

  // Worksheets 151-160: +2 Part 3 (spec: max 32+2)
  if (worksheet <= 160) {
    return { type: 'add_2_medium', addend: 2, maxFirst: 32 }
  }

  // Worksheets 161-170: +3 Part 1 (spec: max 14+3)
  if (worksheet <= 170) {
    return { type: 'add_3_small', addend: 3, maxFirst: 14 }
  }

  // Worksheets 171-180: +3 Part 2 (spec: max 21+3)
  if (worksheet <= 180) {
    return { type: 'add_3_medium', addend: 3, maxFirst: 21 }
  }

  // Worksheets 181-200: Mixed +1, +2, +3 (Parts 1-2)
  return { type: 'add_mixed_1_2_3', maxFirst: 32 }
}

function generateSequenceProblem(maxNumber: number): Problem {
  const startNum = randomInt(1, Math.max(1, maxNumber - 10))
  const sequenceLength = randomInt(5, 8)
  const missingIndex = randomInt(1, sequenceLength - 2)
  
  const sequence: (number | null)[] = []
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(i === missingIndex ? null : startNum + i)
  }
  
  const questionText = formatSequence(
    sequence.map((n, i) => i === missingIndex ? null : n),
    missingIndex
  )
  
  const subtype: Level3AProblemType = maxNumber > 100 ? 'sequence_to_120' : 'sequence_to_100'
  
  return {
    id: generateId(),
    level: '3A',
    worksheetNumber: 1,
    type: 'sequence',
    subtype,
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Fill in the missing number: ${questionText}`,
    correctAnswer: startNum + missingIndex,
    operands: sequence.filter((n): n is number => n !== null),
    missingPosition: missingIndex,
    hints: [
      'Count forward from the first number',
      'Each number is 1 more than the one before',
    ],
    graduatedHints: generateSequenceHints(startNum, missingIndex, '3A'),
  }
}

function generateAdditionProblem(addend: number, maxFirst: number, subtype: Level3AProblemType): Problem {
  const first = randomInt(1, maxFirst)
  const sum = first + addend

  // FIXED: Kumon 3A is HORIZONTAL ONLY - removed 'vertical' and 'missing_addend'
  // Only horizontal format allowed in Level 3A

  return {
    id: generateId(),
    level: '3A',
    worksheetNumber: 1,
    type: 'addition',
    subtype,
    difficulty: 1,
    displayFormat: 'horizontal', // Always horizontal for Level 3A
    question: `${first} + ${addend} = ___`,
    correctAnswer: sum,
    operands: [first, addend],
    hints: [
      `Start at ${first} and count up ${addend}`,
      addend === 1 ? 'Adding 1 means the next number' : `Count: ${first}, ${first + 1}${addend > 1 ? `, ${first + 2}` : ''}${addend > 2 ? `, ${first + 3}` : ''}`,
    ],
    graduatedHints: generateAdditionHints([first, addend], '3A'),
  }
}

function generateMixedAdditionProblem(maxFirst: number): Problem {
  const addend = randomInt(1, 3)
  const first = randomInt(1, maxFirst)
  const sum = first + addend

  return {
    id: generateId(),
    level: '3A',
    worksheetNumber: 1,
    type: 'addition',
    subtype: 'add_mixed_1_2_3',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${first} + ${addend} = ___`,
    correctAnswer: sum,
    operands: [first, addend],
    hints: [
      `Start at ${first} and count up ${addend}`,
    ],
    graduatedHints: generateAdditionHints([first, addend], '3A'),
  }
}

export function generate3AProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'sequence_to_100':
      problem = generateSequenceProblem(100)
      break
    case 'sequence_to_120':
      problem = generateSequenceProblem(120)
      break
    case 'add_1_small':
    case 'add_1_medium':
    case 'add_1_large':
      problem = generateAdditionProblem(1, config.maxFirst || 10, config.type)
      break
    case 'add_2_small':
    case 'add_2_medium':
      problem = generateAdditionProblem(2, config.maxFirst || 10, config.type)
      break
    case 'add_3_small':
    case 'add_3_medium':
      problem = generateAdditionProblem(3, config.maxFirst || 10, config.type)
      break
    case 'add_mixed_1_2_3':
      problem = generateMixedAdditionProblem(config.maxFirst || 20)
      break
    default:
      problem = generateSequenceProblem(100)
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generate3AProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generate3AProblem(worksheet))
  }
  return problems
}

export function get3AWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<Level3AProblemType, string> = {
    'sequence_to_100': 'Number Sequence to 100',
    'sequence_to_120': 'Number Sequence to 120',
    'add_1_small': 'Adding +1 (Small Numbers)',
    'add_1_medium': 'Adding +1 (Medium Numbers)',
    'add_1_large': 'Adding +1 (Large Numbers)',
    'add_2_small': 'Adding +2 (Small Numbers)',
    'add_2_medium': 'Adding +2 (Medium Numbers)',
    'add_3_small': 'Adding +3 (Small Numbers)',
    'add_3_medium': 'Adding +3 (Medium Numbers)',
    'add_mixed_1_2_3': 'Mixed Addition (+1, +2, +3)',
  }
  
  return {
    level: '3A' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: worksheet <= 70 ? 'Not timed' : '8 min',
    problemTypes: [config.type],
  }
}
