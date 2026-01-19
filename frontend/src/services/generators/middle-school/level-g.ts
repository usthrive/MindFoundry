import type { Problem, LevelGProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'
import {
  generateIntegerAdditionHints,
  generateIntegerSubtractionHints,
  generateIntegerMultiplicationHints,
  generateIntegerDivisionHints,
  generateExpressionEvaluationHints,
  generateLikeTermsHints,
  generateDistributionHints,
  generateOneStepEquationHints,
  generateTwoStepEquationHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelGProblemType
} {
  if (worksheet <= 20) return { type: 'review_level_f' }
  if (worksheet <= 40) return { type: 'integer_addition' }
  if (worksheet <= 60) return { type: 'integer_subtraction' }
  if (worksheet <= 80) return { type: 'integer_multiplication' }
  if (worksheet <= 100) return { type: 'integer_division' }
  if (worksheet <= 110) return { type: 'integer_mixed_operations' }
  if (worksheet <= 130) return { type: 'evaluate_expression' }
  if (worksheet <= 150) return { type: 'simplify_like_terms' }
  if (worksheet <= 170) return { type: 'simplify_with_distribution' }
  if (worksheet <= 180) return { type: 'solve_one_step' }
  if (worksheet <= 190) return { type: 'solve_two_step' }
  return { type: 'solve_with_distribution' }
}

function generateIntegerAddition(): Problem {
  const a = randomInt(-20, 20)
  const b = randomInt(-20, 20)
  const sum = a + b
  
  const aStr = a >= 0 ? String(a) : `(${a})`
  const bStr = b >= 0 ? `+ ${b}` : `+ (${b})`
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'integer',
    subtype: 'integer_addition',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${aStr} ${bStr} = ___`,
    correctAnswer: sum,
    operands: [a, b],
    hints: [
      a >= 0 && b >= 0 ? 'Add the numbers normally' :
      a < 0 && b < 0 ? 'Both negative: add absolute values, result is negative' :
      'Different signs: subtract smaller absolute value from larger, keep sign of larger',
    ],
    graduatedHints: generateIntegerAdditionHints(a, b, 'G'),
  }
}

function generateIntegerSubtraction(): Problem {
  const a = randomInt(-20, 20)
  const b = randomInt(-20, 20)
  const diff = a - b
  
  const aStr = a >= 0 ? String(a) : `(${a})`
  const bStr = b >= 0 ? `- ${b}` : `- (${b})`
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'integer',
    subtype: 'integer_subtraction',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${aStr} ${bStr} = ___`,
    correctAnswer: diff,
    operands: [a, b],
    hints: [
      'Subtracting a negative is the same as adding a positive',
      `${aStr} - (${b}) = ${aStr} + ${-b}`,
    ],
    graduatedHints: generateIntegerSubtractionHints(a, b, 'G'),
  }
}

function generateIntegerMultiplication(): Problem {
  const a = randomInt(-12, 12)
  const b = randomInt(-12, 12)
  const product = a * b
  
  const aStr = a >= 0 ? String(a) : `(${a})`
  const bStr = b >= 0 ? String(b) : `(${b})`
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'integer',
    subtype: 'integer_multiplication',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${aStr} × ${bStr} = ___`,
    correctAnswer: product,
    operands: [a, b],
    hints: [
      'Multiply the absolute values',
      (a >= 0) === (b >= 0) ? 'Same signs = positive result' : 'Different signs = negative result',
    ],
    graduatedHints: generateIntegerMultiplicationHints(a, b, 'G'),
  }
}

function generateIntegerDivision(): Problem {
  const b = randomInt(1, 12) * (Math.random() < 0.5 ? 1 : -1)
  const quotient = randomInt(-10, 10)
  const a = b * quotient
  
  const aStr = a >= 0 ? String(a) : `(${a})`
  const bStr = b >= 0 ? String(b) : `(${b})`
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'integer',
    subtype: 'integer_division',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${aStr} ÷ ${bStr} = ___`,
    correctAnswer: quotient,
    operands: [a, b],
    hints: [
      'Divide the absolute values',
      (a >= 0) === (b >= 0) ? 'Same signs = positive result' : 'Different signs = negative result',
    ],
    graduatedHints: generateIntegerDivisionHints(a, b, 'G'),
  }
}

function generateEvaluateExpression(): Problem {
  const x = randomInt(-5, 10)
  const a = randomInt(1, 5)
  const b = randomInt(-10, 10)
  
  const result = a * x + b
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'algebra',
    subtype: 'evaluate_expression',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate ${a}x + ${b >= 0 ? b : `(${b})`} when x = ${x}`,
    correctAnswer: result,
    hints: [
      `Substitute ${x} for x`,
      `${a}(${x}) + ${b >= 0 ? b : `(${b})`} = ${a * x} + ${b >= 0 ? b : `(${b})`}`,
    ],
    graduatedHints: generateExpressionEvaluationHints(`${a}x + ${b >= 0 ? b : `(${b})`}`, x, 'G'),
  }
}

function generateSimplifyLikeTerms(): Problem {
  const a = randomInt(1, 8)
  const b = randomInt(-8, 8)
  const c = randomInt(-10, 10)
  const d = randomInt(-10, 10)
  
  const sumCoeff = a + b
  const sumConst = c + d
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`
  
  let answer = ''
  if (sumCoeff !== 0) {
    answer = sumCoeff === 1 ? 'x' : sumCoeff === -1 ? '-x' : `${sumCoeff}x`
  }
  if (sumConst !== 0) {
    if (answer) {
      answer += sumConst >= 0 ? ` + ${sumConst}` : ` - ${Math.abs(sumConst)}`
    } else {
      answer = String(sumConst)
    }
  }
  if (!answer) answer = '0'
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'algebra',
    subtype: 'simplify_like_terms',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Simplify: ${a}x ${bStr} ${cStr} ${dStr}`,
    correctAnswer: answer,
    hints: [
      'Combine the x terms together',
      'Combine the constant terms together',
    ],
    graduatedHints: generateLikeTermsHints([a, b], [c, d], 'G'),
  }
}

function generateSimplifyWithDistribution(): Problem {
  const a = randomInt(2, 5)
  const b = randomInt(1, 5)
  const c = randomInt(-5, 5)
  
  const resultCoeff = a * b
  const resultConst = a * c
  
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  let answer = ''
  if (resultCoeff !== 0) {
    answer = resultCoeff === 1 ? 'x' : `${resultCoeff}x`
  }
  if (resultConst !== 0) {
    if (answer) {
      answer += resultConst >= 0 ? ` + ${resultConst}` : ` - ${Math.abs(resultConst)}`
    } else {
      answer = String(resultConst)
    }
  }
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'algebra',
    subtype: 'simplify_with_distribution',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Simplify: ${a}(${b}x ${cStr})`,
    correctAnswer: answer,
    hints: [
      `Distribute ${a} to each term inside parentheses`,
      `${a} × ${b}x = ${a * b}x and ${a} × ${c >= 0 ? c : `(${c})`} = ${a * c}`,
    ],
    graduatedHints: generateDistributionHints(a, `${b}x ${cStr}`, 'G'),
  }
}

function generateSolveOneStep(): Problem {
  const x = randomInt(-10, 10)
  const a = randomInt(2, 10)
  const op = randomChoice(['+', '-', '×', '÷'])

  let equation: string
  let hints: string[]

  switch (op) {
    case '+': {
      const b = randomInt(1, 15)
      equation = `x + ${b} = ${x + b}`
      hints = [`Subtract ${b} from both sides`]
      break
    }
    case '-': {
      const b = randomInt(1, 15)
      equation = `x - ${b} = ${x - b}`
      hints = [`Add ${b} to both sides`]
      break
    }
    case '×': {
      equation = `${a}x = ${a * x}`
      hints = [`Divide both sides by ${a}`]
      break
    }
    case '÷': {
      equation = `x/${a} = ${x}`
      hints = [`Multiply both sides by ${a}`]
      break
    }
    default:
      equation = `x + 5 = ${x + 5}`
      hints = ['Subtract 5 from both sides']
  }

  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_one_step',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Solve for x: ${equation}`,
    correctAnswer: x,
    hints,
    graduatedHints: generateOneStepEquationHints(equation, 'G'),
  }
}

function generateSolveTwoStep(): Problem {
  const x = randomInt(-8, 8)
  const a = randomInt(2, 6)
  const b = randomInt(-10, 10)
  const result = a * x + b
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_two_step',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve for x: ${a}x ${bStr} = ${result}`,
    correctAnswer: x,
    hints: [
      `First, ${b >= 0 ? `subtract ${b}` : `add ${Math.abs(b)}`} from both sides`,
      `Then divide both sides by ${a}`,
    ],
    graduatedHints: generateTwoStepEquationHints(a, b, result, 'G'),
  }
}

function generateSolveWithDistribution(): Problem {
  const x = randomInt(-5, 5)
  const a = randomInt(2, 4)
  const b = randomInt(1, 5)
  const c = randomInt(-5, 5)
  const result = a * (b * x + c)
  
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  return {
    id: generateId(),
    level: 'G',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_with_distribution',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Solve for x: ${a}(${b}x ${cStr}) = ${result}`,
    correctAnswer: x,
    hints: [
      `First distribute: ${a * b}x ${a * c >= 0 ? `+ ${a * c}` : `- ${Math.abs(a * c)}`} = ${result}`,
      'Then solve the two-step equation',
    ],
    graduatedHints: generateTwoStepEquationHints(a * b, a * c, result, 'G'),
  }
}

export function generateGProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'review_level_f':
      problem = generateIntegerAddition()
      break
    case 'integer_addition':
      problem = generateIntegerAddition()
      break
    case 'integer_subtraction':
      problem = generateIntegerSubtraction()
      break
    case 'integer_multiplication':
      problem = generateIntegerMultiplication()
      break
    case 'integer_division':
      problem = generateIntegerDivision()
      break
    case 'integer_mixed_operations':
      const ops = [generateIntegerAddition, generateIntegerSubtraction, generateIntegerMultiplication, generateIntegerDivision]
      problem = ops[randomInt(0, ops.length - 1)]()
      break
    case 'evaluate_expression':
      problem = generateEvaluateExpression()
      break
    case 'simplify_like_terms':
      problem = generateSimplifyLikeTerms()
      break
    case 'simplify_with_distribution':
      problem = generateSimplifyWithDistribution()
      break
    case 'solve_one_step':
      problem = generateSolveOneStep()
      break
    case 'solve_two_step':
      problem = generateSolveTwoStep()
      break
    case 'solve_with_distribution':
    case 'equation_word_problems':
      problem = generateSolveWithDistribution()
      break
    default:
      problem = generateIntegerAddition()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateGProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateGProblem(worksheet))
  }
  return problems
}

export function getGWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelGProblemType, string> = {
    'review_level_f': 'Level F Review',
    'integer_addition': 'Integer Addition',
    'integer_subtraction': 'Integer Subtraction',
    'integer_multiplication': 'Integer Multiplication',
    'integer_division': 'Integer Division',
    'integer_mixed_operations': 'Mixed Integer Operations',
    'evaluate_expression': 'Evaluate Expressions',
    'simplify_like_terms': 'Simplify Like Terms',
    'simplify_with_distribution': 'Simplify with Distribution',
    'solve_one_step': 'One-Step Equations',
    'solve_two_step': 'Two-Step Equations',
    'solve_with_distribution': 'Equations with Distribution',
    'equation_word_problems': 'Equation Word Problems',
  }
  
  return {
    level: 'G' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
