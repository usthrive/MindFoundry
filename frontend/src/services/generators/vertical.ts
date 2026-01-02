import type { Problem, MathOperation } from '@/types'

export function generateVerticalProblem(worksheetNumber: number = 100): Problem {
  const problemId = Math.random().toString(36).substring(2, 11)

  let operation: MathOperation
  let digits: number
  let requiresRegrouping: boolean

  if (worksheetNumber <= 10) {
    operation = 'addition'
    digits = 1
    requiresRegrouping = false
  } else if (worksheetNumber <= 40) {
    operation = 'addition'
    digits = 2
    requiresRegrouping = false
  } else if (worksheetNumber <= 70) {
    operation = 'addition'
    digits = 2
    requiresRegrouping = true
  } else if (worksheetNumber <= 100) {
    operation = 'addition'
    digits = 3
    requiresRegrouping = true
  } else if (worksheetNumber <= 120) {
    operation = 'subtraction'
    digits = 2
    requiresRegrouping = false
  } else if (worksheetNumber <= 150) {
    operation = 'subtraction'
    digits = 2
    requiresRegrouping = true
  } else if (worksheetNumber <= 160) {
    operation = Math.random() < 0.5 ? 'addition' : 'subtraction'
    digits = 2
    requiresRegrouping = true
  } else {
    operation = 'subtraction'
    digits = 3
    requiresRegrouping = true
  }

  let operand1: number
  let operand2: number
  let answer: number

  if (operation === 'addition') {
    if (digits === 1) {
      operand1 = Math.floor(Math.random() * 9) + 1
      operand2 = Math.floor(Math.random() * 9) + 1
    } else if (digits === 2) {
      if (requiresRegrouping) {
        const ones1 = Math.floor(Math.random() * 9) + 1
        const ones2 = 11 - ones1 + Math.floor(Math.random() * 8)
        operand1 = Math.floor(Math.random() * 8 + 1) * 10 + ones1
        operand2 = Math.floor(Math.random() * 8 + 1) * 10 + Math.min(ones2, 9)
      } else {
        const ones1 = Math.floor(Math.random() * 5) + 1
        const ones2 = Math.floor(Math.random() * (9 - ones1)) + 1
        operand1 = Math.floor(Math.random() * 8 + 1) * 10 + ones1
        operand2 = Math.floor(Math.random() * 8 + 1) * 10 + ones2
      }
    } else {
      operand1 = Math.floor(Math.random() * 400) + 100
      operand2 = Math.floor(Math.random() * 400) + 100
    }
    answer = operand1 + operand2
  } else {
    if (digits === 1) {
      operand1 = Math.floor(Math.random() * 9) + 2
      operand2 = Math.floor(Math.random() * (operand1 - 1)) + 1
    } else if (digits === 2) {
      if (requiresRegrouping) {
        const ones1 = Math.floor(Math.random() * 5) + 1
        const ones2 = ones1 + Math.floor(Math.random() * 5) + 1
        operand1 = Math.floor(Math.random() * 8 + 2) * 10 + ones1
        operand2 = Math.floor(Math.random() * (Math.floor(operand1/10) - 1) + 1) * 10 + Math.min(ones2, 9)
      } else {
        const ones1 = Math.floor(Math.random() * 5) + 5
        const ones2 = Math.floor(Math.random() * ones1) + 1
        operand1 = Math.floor(Math.random() * 8 + 1) * 10 + ones1
        operand2 = Math.floor(Math.random() * Math.floor(operand1/10)) * 10 + ones2
      }
    } else {
      operand1 = Math.floor(Math.random() * 500) + 500
      operand2 = Math.floor(Math.random() * 400) + 100
    }
    answer = operand1 - operand2
  }

  return {
    id: problemId,
    type: operation,
    level: 'B',
    operands: [operand1, operand2],
    correctAnswer: answer,
    displayFormat: 'vertical',
    difficulty: digits + (requiresRegrouping ? 1 : 0)
  }
}
