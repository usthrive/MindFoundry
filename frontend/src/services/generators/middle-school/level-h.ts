import type { Problem, LevelHProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelHProblemType
} {
  if (worksheet <= 20) return { type: 'basics_review' }
  if (worksheet <= 40) return { type: 'solve_for_variable' }
  if (worksheet <= 60) return { type: 'transform_formula' }
  if (worksheet <= 80) return { type: 'system_2_variables_substitution' }
  if (worksheet <= 100) return { type: 'system_2_variables_elimination' }
  if (worksheet <= 110) return { type: 'system_3_variables' }
  if (worksheet <= 120) return { type: 'system_word_problems' }
  if (worksheet <= 140) return { type: 'solve_linear_inequality' }
  if (worksheet <= 150) return { type: 'compound_inequality' }
  if (worksheet <= 160) return { type: 'function_notation' }
  if (worksheet <= 170) return { type: 'linear_function_graphing' }
  if (worksheet <= 180) return { type: 'slope_intercept_form' }
  if (worksheet <= 190) return { type: 'polynomial_addition' }
  return { type: 'polynomial_multiplication' }
}

function generateBasicsReview(): Problem {
  const x = randomInt(-8, 8)
  const a = randomInt(2, 6)
  const b = randomInt(-10, 10)
  const result = a * x + b
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'basics_review',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Solve for x: ${a}x ${bStr} = ${result}`,
    correctAnswer: x,
    hints: ['Isolate x by performing inverse operations'],
  }
}

function generateSolveForVariable(): Problem {
  const variables = ['x', 'y', 'a', 'b', 'r']
  const targetVar = randomChoice(variables)
  const otherVar = randomChoice(variables.filter(v => v !== targetVar))
  
  const a = randomInt(2, 5)
  const b = randomInt(1, 10)
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_for_variable',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve for ${targetVar}: ${a}${targetVar} + ${b}${otherVar} = ${randomInt(10, 30)}`,
    correctAnswer: `${targetVar} = (${randomInt(10, 30)} - ${b}${otherVar})/${a}`,
    hints: [
      `Isolate terms with ${targetVar} on one side`,
      `Divide by the coefficient of ${targetVar}`,
    ],
  }
}

function generateTransformFormula(): Problem {
  const formulas = [
    { original: 'A = lw', solveFor: 'l', answer: 'l = A/w' },
    { original: 'A = lw', solveFor: 'w', answer: 'w = A/l' },
    { original: 'P = 2l + 2w', solveFor: 'l', answer: 'l = (P - 2w)/2' },
    { original: 'd = rt', solveFor: 'r', answer: 'r = d/t' },
    { original: 'd = rt', solveFor: 't', answer: 't = d/r' },
    { original: 'V = lwh', solveFor: 'h', answer: 'h = V/(lw)' },
    { original: 'C = 2πr', solveFor: 'r', answer: 'r = C/(2π)' },
  ]
  
  const formula = randomChoice(formulas)
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'transform_formula',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve ${formula.original} for ${formula.solveFor}`,
    correctAnswer: formula.answer,
    hints: ['Isolate the variable you are solving for'],
  }
}

function generateSystemSubstitution(): Problem {
  const x = randomInt(-5, 5)
  const y = randomInt(-5, 5)
  
  const a1 = randomInt(1, 4)
  const b1 = randomInt(-4, 4)
  const c1 = a1 * x + b1 * y
  
  const a2 = 1
  const b2 = randomInt(-3, 3)
  const c2 = a2 * x + b2 * y
  
  const b1Str = b1 >= 0 ? `+ ${b1}y` : `- ${Math.abs(b1)}y`
  const b2Str = b2 >= 0 ? `+ ${b2}y` : `- ${Math.abs(b2)}y`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'system',
    subtype: 'system_2_variables_substitution',
    difficulty: 2,
    displayFormat: 'vertical',
    question: `Solve the system:\n${a1}x ${b1Str} = ${c1}\nx ${b2Str} = ${c2}`,
    correctAnswer: `x = ${x}, y = ${y}`,
    hints: [
      'Solve the second equation for x',
      'Substitute into the first equation',
      'Solve for y, then find x',
    ],
  }
}

function generateSystemElimination(): Problem {
  const x = randomInt(-5, 5)
  const y = randomInt(-5, 5)
  
  const a1 = randomInt(1, 4)
  const b1 = randomInt(1, 4)
  const c1 = a1 * x + b1 * y
  
  const a2 = randomInt(1, 4)
  const b2 = -b1
  const c2 = a2 * x + b2 * y
  
  const b1Str = b1 >= 0 ? `+ ${b1}y` : `- ${Math.abs(b1)}y`
  const b2Str = b2 >= 0 ? `+ ${b2}y` : `- ${Math.abs(b2)}y`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'system',
    subtype: 'system_2_variables_elimination',
    difficulty: 2,
    displayFormat: 'vertical',
    question: `Solve the system:\n${a1}x ${b1Str} = ${c1}\n${a2}x ${b2Str} = ${c2}`,
    correctAnswer: `x = ${x}, y = ${y}`,
    hints: [
      'Add the equations to eliminate y',
      'Solve for x',
      'Substitute to find y',
    ],
  }
}

function generateLinearInequality(): Problem {
  const a = randomInt(2, 6)
  const b = randomInt(-10, 10)
  const c = randomInt(-20, 20)
  const op = randomChoice(['<', '>', '≤', '≥'])
  
  const boundary = (c - b) / a
  const answer = a > 0 
    ? `x ${op} ${boundary}`
    : `x ${op === '<' ? '>' : op === '>' ? '<' : op === '≤' ? '≥' : '≤'} ${boundary}`
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'inequality',
    subtype: 'solve_linear_inequality',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve: ${a}x ${bStr} ${op} ${c}`,
    correctAnswer: answer,
    hints: [
      'Solve like an equation',
      a < 0 ? 'Remember to flip the inequality when dividing by a negative' : '',
    ].filter(Boolean),
  }
}

function generateFunctionNotation(): Problem {
  const a = randomInt(1, 5)
  const b = randomInt(-10, 10)
  const x = randomInt(-5, 5)
  const result = a * x + b
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'function',
    subtype: 'function_notation',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `If f(x) = ${a}x ${bStr}, find f(${x})`,
    correctAnswer: result,
    hints: [`Substitute ${x} for x in the expression`],
  }
}

function generateSlopeInterceptForm(): Problem {
  const m = randomInt(-5, 5)
  const b = randomInt(-10, 10)
  
  const x1 = randomInt(-3, 3)
  const y1 = m * x1 + b
  const x2 = x1 + randomInt(1, 3)
  const y2 = m * x2 + b
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'linear',
    subtype: 'slope_intercept_form',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the equation of the line passing through (${x1}, ${y1}) and (${x2}, ${y2}) in slope-intercept form`,
    correctAnswer: `y = ${m === 1 ? '' : m === -1 ? '-' : m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`,
    hints: [
      `First find the slope: m = (${y2} - ${y1})/(${x2} - ${x1})`,
      'Then use point-slope form and convert',
    ],
  }
}

function generatePolynomialAddition(): Problem {
  const a1 = randomInt(1, 5)
  const b1 = randomInt(-5, 5)
  const c1 = randomInt(-5, 5)
  const a2 = randomInt(1, 5)
  const b2 = randomInt(-5, 5)
  const c2 = randomInt(-5, 5)
  
  const aSum = a1 + a2
  const bSum = b1 + b2
  const cSum = c1 + c2
  
  const poly1 = `${a1}x² ${b1 >= 0 ? `+ ${b1}x` : `- ${Math.abs(b1)}x`} ${c1 >= 0 ? `+ ${c1}` : `- ${Math.abs(c1)}`}`
  const poly2 = `${a2}x² ${b2 >= 0 ? `+ ${b2}x` : `- ${Math.abs(b2)}x`} ${c2 >= 0 ? `+ ${c2}` : `- ${Math.abs(c2)}`}`
  
  let answer = `${aSum}x²`
  if (bSum !== 0) answer += bSum >= 0 ? ` + ${bSum}x` : ` - ${Math.abs(bSum)}x`
  if (cSum !== 0) answer += cSum >= 0 ? ` + ${cSum}` : ` - ${Math.abs(cSum)}`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'polynomial_addition',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Add: (${poly1}) + (${poly2})`,
    correctAnswer: answer,
    hints: ['Combine like terms: x² with x², x with x, constants with constants'],
  }
}

function generatePolynomialMultiplication(): Problem {
  const a = randomInt(1, 3)
  const b = randomInt(-5, 5)
  const c = randomInt(1, 3)
  const d = randomInt(-5, 5)
  
  const first = a * c
  const outer = a * d
  const inner = b * c
  const last = b * d
  const middle = outer + inner
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`
  
  let answer = `${first}x²`
  if (middle !== 0) answer += middle >= 0 ? ` + ${middle}x` : ` - ${Math.abs(middle)}x`
  if (last !== 0) answer += last >= 0 ? ` + ${last}` : ` - ${Math.abs(last)}`
  
  return {
    id: generateId(),
    level: 'H',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'polynomial_multiplication',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Multiply: (${a}x ${bStr})(${c}x ${dStr})`,
    correctAnswer: answer,
    hints: [
      'Use FOIL: First, Outer, Inner, Last',
      'Then combine like terms',
    ],
  }
}

export function generateHProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'basics_review':
      problem = generateBasicsReview()
      break
    case 'solve_for_variable':
      problem = generateSolveForVariable()
      break
    case 'transform_formula':
      problem = generateTransformFormula()
      break
    case 'system_2_variables_substitution':
      problem = generateSystemSubstitution()
      break
    case 'system_2_variables_elimination':
      problem = generateSystemElimination()
      break
    case 'system_3_variables':
    case 'system_4_variables':
    case 'system_word_problems':
      problem = generateSystemElimination()
      break
    case 'solve_linear_inequality':
    case 'compound_inequality':
    case 'inequality_graphing':
      problem = generateLinearInequality()
      break
    case 'function_notation':
    case 'linear_function_graphing':
      problem = generateFunctionNotation()
      break
    case 'slope_intercept_form':
    case 'point_slope_form':
      problem = generateSlopeInterceptForm()
      break
    case 'monomial_operations':
    case 'polynomial_addition':
      problem = generatePolynomialAddition()
      break
    case 'polynomial_multiplication':
      problem = generatePolynomialMultiplication()
      break
    default:
      problem = generateBasicsReview()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateHProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateHProblem(worksheet))
  }
  return problems
}

export function getHWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelHProblemType, string> = {
    'basics_review': 'Basics Review',
    'solve_for_variable': 'Solve for Variable',
    'transform_formula': 'Transform Formula',
    'system_2_variables_substitution': 'Systems (Substitution)',
    'system_2_variables_elimination': 'Systems (Elimination)',
    'system_3_variables': 'Systems (3 Variables)',
    'system_4_variables': 'Systems (4 Variables)',
    'system_word_problems': 'System Word Problems',
    'solve_linear_inequality': 'Linear Inequalities',
    'compound_inequality': 'Compound Inequalities',
    'inequality_graphing': 'Inequality Graphing',
    'function_notation': 'Function Notation',
    'linear_function_graphing': 'Linear Function Graphing',
    'slope_intercept_form': 'Slope-Intercept Form',
    'point_slope_form': 'Point-Slope Form',
    'monomial_operations': 'Monomial Operations',
    'polynomial_addition': 'Polynomial Addition',
    'polynomial_multiplication': 'Polynomial Multiplication',
  }
  
  return {
    level: 'H' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
