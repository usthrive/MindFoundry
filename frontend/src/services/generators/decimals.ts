import type { Problem, MathOperation } from '@/types'

export function generateDecimalProblem(worksheetNumber: number = 100): Problem {
  const problemId = Math.random().toString(36).substring(2, 11)

  let operation: MathOperation

  if (worksheetNumber <= 50) {
    operation = Math.random() < 0.5 ? 'addition' : 'subtraction'
  } else if (worksheetNumber <= 100) {
    operation = 'multiplication'
  } else if (worksheetNumber <= 150) {
    operation = 'division'
  } else {
    const ops: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division']
    operation = ops[Math.floor(Math.random() * ops.length)]
  }

  let operand1: number
  let operand2: number
  let answer: number

  switch (operation) {
    case 'addition': {
      operand1 = Math.round((Math.random() * 20 + 1) * 10) / 10
      operand2 = Math.round((Math.random() * 10 + 1) * 10) / 10
      answer = Math.round((operand1 + operand2) * 10) / 10
      break
    }
    case 'subtraction': {
      operand1 = Math.round((Math.random() * 20 + 5) * 10) / 10
      operand2 = Math.round((Math.random() * 10 + 1) * 10) / 10
      answer = Math.round((operand1 - operand2) * 10) / 10
      break
    }
    case 'multiplication': {
      operand1 = Math.round((Math.random() * 5 + 1) * 10) / 10
      operand2 = Math.round((Math.random() * 3 + 1) * 10) / 10
      answer = Math.round((operand1 * operand2) * 100) / 100
      break
    }
    case 'division': {
      answer = Math.round((Math.random() * 5 + 1) * 10) / 10
      operand2 = Math.round((Math.random() * 3 + 1) * 10) / 10
      operand1 = Math.round((answer * operand2) * 10) / 10
      break
    }
  }

  return {
    id: problemId,
    type: operation,
    level: 'F',
    operands: [operand1, operand2],
    correctAnswer: answer,
    displayFormat: 'horizontal',
    difficulty: 4
  }
}

export function generateOrderOfOperationsProblem(_worksheetNumber: number = 100): Problem {
  const problemId = Math.random().toString(36).substring(2, 11)

  const a = Math.floor(Math.random() * 10 + 1)
  const b = Math.floor(Math.random() * 10 + 1)
  const c = Math.floor(Math.random() * 10 + 1)

  let operand1: number
  let operand2: number
  let answer: number

  const pattern = Math.floor(Math.random() * 4)
  switch (pattern) {
    case 0:
      operand1 = a
      operand2 = b * c
      answer = a + (b * c)
      break
    case 1:
      operand1 = a * b
      operand2 = c
      answer = (a * b) - c
      break
    case 2:
      const divisor = Math.floor(Math.random() * 3 + 1)
      const dividend = divisor * Math.floor(Math.random() * 10 + 1)
      operand1 = dividend / divisor
      operand2 = c
      answer = (dividend / divisor) + c
      break
    case 3:
    default:
      operand1 = a + b
      operand2 = c
      answer = (a + b) * c
      break
  }

  return {
    id: problemId,
    type: 'multiplication',
    level: 'F',
    operands: [operand1, operand2],
    correctAnswer: answer,
    displayFormat: 'horizontal',
    difficulty: 5
  }
}
