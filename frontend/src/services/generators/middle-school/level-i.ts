import type { Problem, LevelIProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelIProblemType
} {
  if (worksheet <= 10) return { type: 'basics_review' }
  if (worksheet <= 30) return { type: 'foil_binomials' }
  if (worksheet <= 40) return { type: 'special_products' }
  if (worksheet <= 50) return { type: 'factor_gcf' }
  if (worksheet <= 70) return { type: 'factor_trinomial_leading_1' }
  if (worksheet <= 90) return { type: 'factor_trinomial_leading_a' }
  if (worksheet <= 100) return { type: 'factor_difference_of_squares' }
  if (worksheet <= 110) return { type: 'factor_perfect_square_trinomial' }
  if (worksheet <= 130) return { type: 'simplify_square_root' }
  if (worksheet <= 150) return { type: 'operations_with_radicals' }
  if (worksheet <= 160) return { type: 'solve_by_factoring' }
  if (worksheet <= 170) return { type: 'solve_by_quadratic_formula' }
  if (worksheet <= 180) return { type: 'graph_parabola' }
  return { type: 'pythagorean_word_problems' }
}

function generateFOIL(): Problem {
  const a = randomInt(1, 4)
  const b = randomInt(-8, 8)
  const c = randomInt(1, 4)
  const d = randomInt(-8, 8)
  
  const first = a * c
  const outer = a * d
  const inner = b * c
  const last = b * d
  const middle = outer + inner
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`
  
  let answer = first === 1 ? 'x²' : `${first}x²`
  if (middle !== 0) answer += middle >= 0 ? ` + ${middle}x` : ` - ${Math.abs(middle)}x`
  if (last !== 0) answer += last >= 0 ? ` + ${last}` : ` - ${Math.abs(last)}`
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'foil_binomials',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Expand: (${a === 1 ? '' : a}x ${bStr})(${c === 1 ? '' : c}x ${dStr})`,
    correctAnswer: answer,
    hints: ['FOIL: First, Outer, Inner, Last', 'Combine like terms'],
  }
}

function generateSpecialProducts(): Problem {
  const type = randomChoice(['square_sum', 'square_diff', 'diff_squares'])
  const a = randomInt(1, 5)
  const b = randomInt(1, 8)
  
  if (type === 'square_sum') {
    const expanded = `${a * a}x² + ${2 * a * b}x + ${b * b}`
    return {
      id: generateId(),
      level: 'I',
      worksheetNumber: 1,
      type: 'polynomial',
      subtype: 'special_products',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Expand: (${a === 1 ? '' : a}x + ${b})²`,
      correctAnswer: expanded,
      hints: ['(a + b)² = a² + 2ab + b²'],
    }
  }
  
  if (type === 'square_diff') {
    const expanded = `${a * a}x² - ${2 * a * b}x + ${b * b}`
    return {
      id: generateId(),
      level: 'I',
      worksheetNumber: 1,
      type: 'polynomial',
      subtype: 'special_products',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Expand: (${a === 1 ? '' : a}x - ${b})²`,
      correctAnswer: expanded,
      hints: ['(a - b)² = a² - 2ab + b²'],
    }
  }
  
  const expanded = `${a * a}x² - ${b * b}`
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'special_products',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Expand: (${a === 1 ? '' : a}x + ${b})(${a === 1 ? '' : a}x - ${b})`,
    correctAnswer: expanded,
    hints: ['(a + b)(a - b) = a² - b²'],
  }
}

function generateFactorGCF(): Problem {
  const gcf = randomInt(2, 6)
  const a = randomInt(1, 4)
  const b = randomInt(-5, 5)
  
  const term1 = gcf * a
  const term2 = gcf * b
  
  const term2Str = term2 >= 0 ? `+ ${term2}` : `- ${Math.abs(term2)}`
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'factoring',
    subtype: 'factor_gcf',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Factor: ${term1}x ${term2Str}`,
    correctAnswer: `${gcf}(${a === 1 ? '' : a}x ${bStr})`,
    hints: [`Find the GCF of ${term1} and ${Math.abs(term2)}`],
  }
}

function generateFactorTrinomialLeading1(): Problem {
  const p = randomInt(-8, 8)
  const q = randomInt(-8, 8)
  
  const b = p + q
  const c = p * q
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  const pStr = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`
  const qStr = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'factoring',
    subtype: 'factor_trinomial_leading_1',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Factor: x² ${bStr} ${cStr}`,
    correctAnswer: `(x ${pStr})(x ${qStr})`,
    hints: [
      `Find two numbers that multiply to ${c} and add to ${b}`,
    ],
  }
}

function generateFactorTrinomialLeadingA(): Problem {
  const a = randomInt(2, 4)
  const p = randomInt(-5, 5)
  const q = randomInt(-5, 5)
  
  const middle = a * p + q
  const last = p * q
  
  const middleStr = middle >= 0 ? `+ ${middle}x` : `- ${Math.abs(middle)}x`
  const lastStr = last >= 0 ? `+ ${last}` : `- ${Math.abs(last)}`
  
  const pStr = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`
  const qStr = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'factoring',
    subtype: 'factor_trinomial_leading_a',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Factor: ${a}x² ${middleStr} ${lastStr}`,
    correctAnswer: `(${a}x ${qStr})(x ${pStr})`,
    hints: [
      'Use the AC method or trial and error',
      `Multiply ${a} × ${last} = ${a * last}`,
    ],
  }
}

function generateDifferenceOfSquares(): Problem {
  const a = randomInt(1, 6)
  const b = randomInt(1, 10)
  
  const aSquared = a * a
  const bSquared = b * b
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'factoring',
    subtype: 'factor_difference_of_squares',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Factor: ${aSquared === 1 ? '' : aSquared}x² - ${bSquared}`,
    correctAnswer: `(${a === 1 ? '' : a}x + ${b})(${a === 1 ? '' : a}x - ${b})`,
    hints: ['Difference of squares: a² - b² = (a + b)(a - b)'],
  }
}

function generateSimplifySquareRoot(): Problem {
  const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100]
  const coefficient = randomChoice(perfectSquares)
  const remaining = randomChoice([2, 3, 5, 6, 7])
  const radicand = coefficient * remaining
  
  const sqrtCoeff = Math.sqrt(coefficient)
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'radical',
    subtype: 'simplify_square_root',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Simplify: √${radicand}`,
    correctAnswer: `${sqrtCoeff}√${remaining}`,
    hints: [
      `Find the largest perfect square factor of ${radicand}`,
      `${radicand} = ${coefficient} × ${remaining}`,
    ],
  }
}

function generateSolveByFactoring(): Problem {
  const p = randomInt(-6, 6)
  const q = randomInt(-6, 6)
  
  const b = -(p + q)
  const c = p * q
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'quadratic',
    subtype: 'solve_by_factoring',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve: x² ${bStr} ${cStr} = 0`,
    correctAnswer: `x = ${p} or x = ${q}`,
    hints: [
      'Factor the trinomial',
      'Set each factor equal to zero',
    ],
  }
}

function generateQuadraticFormula(): Problem {
  const a = randomInt(1, 3)
  const b = randomInt(-8, 8)
  const discriminant = randomChoice([1, 4, 9, 16, 25])
  const c = (b * b - discriminant) / (4 * a)
  
  if (!Number.isInteger(c)) {
    return generateQuadraticFormula()
  }
  
  const sqrtDisc = Math.sqrt(discriminant)
  const x1 = (-b + sqrtDisc) / (2 * a)
  const x2 = (-b - sqrtDisc) / (2 * a)
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'quadratic',
    subtype: 'solve_by_quadratic_formula',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Solve using the quadratic formula: ${a === 1 ? '' : a}x² ${bStr} ${cStr} = 0`,
    correctAnswer: Number.isInteger(x1) && Number.isInteger(x2) 
      ? `x = ${x1} or x = ${x2}`
      : `x = (${-b} ± ${sqrtDisc})/${2 * a}`,
    hints: [
      'x = (-b ± √(b² - 4ac)) / 2a',
      `a = ${a}, b = ${b}, c = ${c}`,
    ],
  }
}

function generatePythagorean(): Problem {
  const triples = [
    [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
    [6, 8, 10], [9, 12, 15], [12, 16, 20],
  ]
  const [a, b, c] = randomChoice(triples)
  
  const findWhat = randomChoice(['hypotenuse', 'leg'])
  
  if (findWhat === 'hypotenuse') {
    return {
      id: generateId(),
      level: 'I',
      worksheetNumber: 1,
      type: 'geometry',
      subtype: 'find_hypotenuse',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `A right triangle has legs of length ${a} and ${b}. Find the hypotenuse.`,
      correctAnswer: c,
      hints: ['Use the Pythagorean theorem: a² + b² = c²'],
    }
  }
  
  return {
    id: generateId(),
    level: 'I',
    worksheetNumber: 1,
    type: 'geometry',
    subtype: 'find_leg',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `A right triangle has a leg of length ${a} and hypotenuse of length ${c}. Find the other leg.`,
    correctAnswer: b,
    hints: ['Use the Pythagorean theorem: a² + b² = c²', 'Solve for the unknown leg'],
  }
}

export function generateIProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'basics_review':
      problem = generateFOIL()
      break
    case 'foil_binomials':
      problem = generateFOIL()
      break
    case 'special_products':
      problem = generateSpecialProducts()
      break
    case 'factor_gcf':
      problem = generateFactorGCF()
      break
    case 'factor_trinomial_leading_1':
      problem = generateFactorTrinomialLeading1()
      break
    case 'factor_trinomial_leading_a':
      problem = generateFactorTrinomialLeadingA()
      break
    case 'factor_difference_of_squares':
      problem = generateDifferenceOfSquares()
      break
    case 'factor_perfect_square_trinomial':
      problem = generateSpecialProducts()
      break
    case 'simplify_square_root':
    case 'operations_with_radicals':
    case 'rationalize_denominator':
      problem = generateSimplifySquareRoot()
      break
    case 'solve_by_factoring':
    case 'solve_by_square_root':
    case 'solve_by_completing_square':
      problem = generateSolveByFactoring()
      break
    case 'solve_by_quadratic_formula':
      problem = generateQuadraticFormula()
      break
    case 'vertex_form':
    case 'graph_parabola':
    case 'find_vertex_axis_symmetry':
      problem = generateQuadraticFormula()
      break
    case 'find_hypotenuse':
    case 'find_leg':
    case 'distance_formula':
    case 'pythagorean_word_problems':
      problem = generatePythagorean()
      break
    default:
      problem = generateFOIL()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateIProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateIProblem(worksheet))
  }
  return problems
}

export function getIWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelIProblemType, string> = {
    'basics_review': 'Basics Review',
    'foil_binomials': 'FOIL Method',
    'special_products': 'Special Products',
    'factor_gcf': 'Factor GCF',
    'factor_trinomial_leading_1': 'Factor Trinomials (Leading 1)',
    'factor_trinomial_leading_a': 'Factor Trinomials (Leading a)',
    'factor_difference_of_squares': 'Factor Difference of Squares',
    'factor_perfect_square_trinomial': 'Factor Perfect Square Trinomials',
    'simplify_square_root': 'Simplify Square Roots',
    'operations_with_radicals': 'Radical Operations',
    'rationalize_denominator': 'Rationalize Denominator',
    'solve_by_factoring': 'Solve by Factoring',
    'solve_by_square_root': 'Solve by Square Root',
    'solve_by_completing_square': 'Completing the Square',
    'solve_by_quadratic_formula': 'Quadratic Formula',
    'vertex_form': 'Vertex Form',
    'graph_parabola': 'Graph Parabolas',
    'find_vertex_axis_symmetry': 'Vertex and Axis of Symmetry',
    'find_hypotenuse': 'Find Hypotenuse',
    'find_leg': 'Find Leg',
    'distance_formula': 'Distance Formula',
    'pythagorean_word_problems': 'Pythagorean Word Problems',
  }
  
  return {
    level: 'I' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
