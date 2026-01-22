import type { Problem, KumonLevel } from '@/types'
import { generateSequenceHints } from './hintGenerator'

export function generateSequenceProblem(worksheetNumber: number = 100): Problem {
  const problemId = Math.random().toString(36).substring(2, 11)

  let maxNum: number

  if (worksheetNumber <= 40) {
    maxNum = 10
  } else if (worksheetNumber <= 100) {
    maxNum = 10
  } else if (worksheetNumber <= 120) {
    maxNum = 20
  } else if (worksheetNumber <= 140) {
    maxNum = 30
  } else {
    maxNum = 50
  }

  const startNum = Math.floor(Math.random() * (maxNum - 4)) + 1
  const missingPosition = Math.floor(Math.random() * 3) + 1

  const answer = startNum + missingPosition

  return {
    id: problemId,
    type: 'addition',
    level: '4A',
    operands: [startNum, missingPosition],
    correctAnswer: answer,
    displayFormat: 'horizontal',
    difficulty: 1,
    missingPosition,
    graduatedHints: generateSequenceHints(startNum, missingPosition, '4A'),
  }
}

export function generateCountingProblem(level: KumonLevel, worksheetNumber: number = 100): Problem {
  const problemId = Math.random().toString(36).substring(2, 11)

  let maxCount: number

  switch (level) {
    case '7A':
      maxCount = worksheetNumber <= 30 ? 5 : 10
      break
    case '6A':
      maxCount = worksheetNumber <= 50 ? 10 : 20
      break
    case '5A':
    default:
      maxCount = worksheetNumber <= 100 ? 20 : 30
      break
  }

  const count = Math.floor(Math.random() * maxCount) + 1

  return {
    id: problemId,
    type: 'addition',
    level,
    operands: [count, 0],
    correctAnswer: count,
    displayFormat: 'horizontal',
    difficulty: 1
  }
}
