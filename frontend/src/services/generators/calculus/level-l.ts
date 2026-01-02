import type { Problem, LevelLProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelLProblemType
} {
  if (worksheet <= 20) return { type: 'log_properties' }
  if (worksheet <= 30) return { type: 'log_equations' }
  if (worksheet <= 40) return { type: 'modulus_functions' }
  if (worksheet <= 60) return { type: 'evaluate_limit' }
  if (worksheet <= 80) return { type: 'derivative_definition' }
  if (worksheet <= 100) return { type: 'power_rule' }
  if (worksheet <= 110) return { type: 'product_rule' }
  if (worksheet <= 120) return { type: 'quotient_rule' }
  if (worksheet <= 130) return { type: 'chain_rule' }
  if (worksheet <= 140) return { type: 'tangent_line_equation' }
  if (worksheet <= 150) return { type: 'find_critical_points' }
  if (worksheet <= 160) return { type: 'find_relative_extrema' }
  if (worksheet <= 170) return { type: 'optimization_problems' }
  if (worksheet <= 180) return { type: 'indefinite_integral' }
  if (worksheet <= 190) return { type: 'definite_integral' }
  return { type: 'area_under_curve' }
}

function generateLogProperties(): Problem {
  const type = randomChoice(['expand', 'condense', 'evaluate'])
  const base = randomChoice([2, 3, 10, 'e'])
  
  if (type === 'expand') {
    const a = randomInt(2, 5)
    const b = randomInt(2, 5)
    return {
      id: generateId(),
      level: 'L',
      worksheetNumber: 1,
      type: 'logarithm',
      subtype: 'log_properties',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Expand: log(${a}${b === 1 ? '' : `^${b}`} × x)`,
      correctAnswer: `${b} log(${a}) + log(x)`,
      hints: ['log(ab) = log(a) + log(b)', 'log(a^n) = n log(a)'],
    }
  }
  
  if (type === 'condense') {
    const a = randomInt(2, 4)
    return {
      id: generateId(),
      level: 'L',
      worksheetNumber: 1,
      type: 'logarithm',
      subtype: 'log_properties',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Condense: ${a} log(x) + log(y)`,
      correctAnswer: `log(x^${a}y)`,
      hints: ['n log(a) = log(a^n)', 'log(a) + log(b) = log(ab)'],
    }
  }
  
  const power = randomInt(2, 5)
  const result = Math.pow(base === 'e' ? Math.E : base as number, power)
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'logarithm',
    subtype: 'log_properties',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Evaluate: log_${base}(${Math.round(result)})`,
    correctAnswer: power,
    hints: [`${base}^? = ${Math.round(result)}`],
  }
}

function generateLogEquation(): Problem {
  const base = randomChoice([2, 3, 10])
  const result = randomInt(1, 4)
  const answer = Math.pow(base, result)
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'log_equations',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve: log_${base}(x) = ${result}`,
    correctAnswer: answer,
    hints: [
      `Convert to exponential form: ${base}^${result} = x`,
    ],
  }
}

function generateLimit(): Problem {
  const type = randomChoice(['polynomial', 'rational', 'infinity'])
  
  if (type === 'polynomial') {
    const a = randomInt(1, 5)
    const b = randomInt(-5, 5)
    const c = randomInt(-5, 10)
    const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
    const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
    
    return {
      id: generateId(),
      level: 'L',
      worksheetNumber: 1,
      type: 'limit',
      subtype: 'evaluate_limit',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `Evaluate: lim(x→${c}) (${a}x² ${bStr} ${cStr})`,
      correctAnswer: a * c * c + b * c + c,
      hints: ['For continuous functions, substitute directly'],
    }
  }
  
  if (type === 'infinity') {
    const a = randomInt(1, 5)
    const b = randomInt(1, 5)
    return {
      id: generateId(),
      level: 'L',
      worksheetNumber: 1,
      type: 'limit',
      subtype: 'limit_at_infinity',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Evaluate: lim(x→∞) (${a}x² + x)/(${b}x² + 1)`,
      correctAnswer: `${a}/${b}`,
      hints: [
        'Divide all terms by the highest power of x',
        'As x→∞, 1/x → 0',
      ],
    }
  }
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'limit',
    subtype: 'evaluate_limit',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate: lim(x→0) (sin(x)/x)`,
    correctAnswer: 1,
    hints: ['This is a special limit equal to 1'],
  }
}

function generatePowerRule(): Problem {
  const n = randomInt(2, 6)
  const a = randomInt(1, 5)
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'derivative',
    subtype: 'power_rule',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Find the derivative: f(x) = ${a === 1 ? '' : a}x^${n}`,
    correctAnswer: `${a * n}x^${n - 1}`,
    hints: ['Power rule: d/dx[x^n] = nx^(n-1)'],
  }
}

function generateProductRule(): Problem {
  const a = randomInt(1, 3)
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'derivative',
    subtype: 'product_rule',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the derivative: f(x) = ${a === 1 ? '' : a}x² · e^x`,
    correctAnswer: `${a === 1 ? '' : a}(2x · e^x + x² · e^x) = ${a === 1 ? '' : a}e^x(2x + x²)`,
    hints: [
      'Product rule: (fg)\' = f\'g + fg\'',
      `f = ${a === 1 ? '' : a}x², g = e^x`,
    ],
  }
}

function generateQuotientRule(): Problem {
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'derivative',
    subtype: 'quotient_rule',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the derivative: f(x) = x²/(x + 1)`,
    correctAnswer: `(2x(x+1) - x²)/(x+1)² = (x² + 2x)/(x+1)²`,
    hints: [
      'Quotient rule: (f/g)\' = (f\'g - fg\')/g²',
      'f = x², g = x + 1',
    ],
  }
}

function generateChainRule(): Problem {
  const n = randomInt(2, 4)
  const a = randomInt(1, 3)
  const b = randomInt(1, 5)
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'derivative',
    subtype: 'chain_rule',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the derivative: f(x) = (${a === 1 ? '' : a}x ${bStr})^${n}`,
    correctAnswer: `${n}(${a === 1 ? '' : a}x ${bStr})^${n - 1} · ${a}`,
    hints: [
      'Chain rule: d/dx[g(x)^n] = n·g(x)^(n-1)·g\'(x)',
      `g(x) = ${a === 1 ? '' : a}x ${bStr}, g'(x) = ${a}`,
    ],
  }
}

function generateTangentLine(): Problem {
  const a = randomInt(1, 3)
  const x0 = randomInt(1, 3)
  const y0 = a * x0 * x0
  const slope = 2 * a * x0
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'calculus',
    subtype: 'tangent_line_equation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the equation of the tangent line to f(x) = ${a === 1 ? '' : a}x² at x = ${x0}`,
    correctAnswer: `y - ${y0} = ${slope}(x - ${x0}) or y = ${slope}x - ${slope * x0 - y0}`,
    hints: [
      `Find f'(x) = ${2 * a}x`,
      `Evaluate f'(${x0}) = ${slope} for the slope`,
      `Find the point: (${x0}, ${y0})`,
      'Use point-slope form',
    ],
  }
}

function generateIndefiniteIntegral(): Problem {
  const n = randomInt(2, 5)
  const a = randomInt(1, 4)
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'indefinite_integral',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate: ∫ ${a === 1 ? '' : a}x^${n} dx`,
    correctAnswer: `${a}x^${n + 1}/${n + 1} + C`,
    hints: ['Power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C'],
  }
}

function generateDefiniteIntegral(): Problem {
  const a = 0
  const b = randomInt(1, 3)
  const coeff = randomInt(1, 3)
  
  const result = (coeff * Math.pow(b, 2)) / 2 - (coeff * Math.pow(a, 2)) / 2
  
  return {
    id: generateId(),
    level: 'L',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'definite_integral',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate: ∫[${a} to ${b}] ${coeff === 1 ? '' : coeff}x dx`,
    correctAnswer: result,
    hints: [
      `Find the antiderivative: ${coeff}x²/2`,
      'Apply the Fundamental Theorem of Calculus',
      `F(${b}) - F(${a})`,
    ],
  }
}

export function generateLProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'log_properties':
    case 'change_of_base':
    case 'graph_logarithm':
      problem = generateLogProperties()
      break
    case 'log_equations':
      problem = generateLogEquation()
      break
    case 'modulus_functions':
      problem = generateLimit()
      break
    case 'evaluate_limit':
    case 'limit_at_infinity':
    case 'one_sided_limits':
      problem = generateLimit()
      break
    case 'derivative_definition':
    case 'power_rule':
      problem = generatePowerRule()
      break
    case 'product_rule':
      problem = generateProductRule()
      break
    case 'quotient_rule':
      problem = generateQuotientRule()
      break
    case 'chain_rule':
      problem = generateChainRule()
      break
    case 'tangent_line_equation':
      problem = generateTangentLine()
      break
    case 'find_critical_points':
    case 'find_relative_extrema':
    case 'find_absolute_extrema':
    case 'optimization_problems':
      problem = generateTangentLine()
      break
    case 'indefinite_integral':
      problem = generateIndefiniteIntegral()
      break
    case 'definite_integral':
    case 'area_under_curve':
    case 'area_between_curves':
    case 'volume_of_revolution':
    case 'velocity_distance':
      problem = generateDefiniteIntegral()
      break
    default:
      problem = generatePowerRule()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateLProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateLProblem(worksheet))
  }
  return problems
}

export function getLWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelLProblemType, string> = {
    'log_properties': 'Logarithm Properties',
    'log_equations': 'Logarithmic Equations',
    'change_of_base': 'Change of Base',
    'graph_logarithm': 'Graph Logarithms',
    'modulus_functions': 'Modulus Functions',
    'evaluate_limit': 'Evaluate Limits',
    'limit_at_infinity': 'Limits at Infinity',
    'one_sided_limits': 'One-Sided Limits',
    'derivative_definition': 'Derivative Definition',
    'power_rule': 'Power Rule',
    'product_rule': 'Product Rule',
    'quotient_rule': 'Quotient Rule',
    'chain_rule': 'Chain Rule',
    'tangent_line_equation': 'Tangent Line Equations',
    'find_critical_points': 'Critical Points',
    'find_relative_extrema': 'Relative Extrema',
    'find_absolute_extrema': 'Absolute Extrema',
    'optimization_problems': 'Optimization',
    'indefinite_integral': 'Indefinite Integrals',
    'definite_integral': 'Definite Integrals',
    'area_under_curve': 'Area Under Curve',
    'area_between_curves': 'Area Between Curves',
    'volume_of_revolution': 'Volume of Revolution',
    'velocity_distance': 'Velocity and Distance',
  }
  
  return {
    level: 'L' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
