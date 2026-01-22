import type { Problem, LevelOProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'
import {
  generateTangentNormalHints,
  generateIncreasingDecreasingHints,
  generateConcavityHints,
  generateExtremaHints,
  generateUSubstitutionHints,
  generateIntegrationByPartsHints,
  generatePartialFractionsHints,
  generateAreaBetweenCurvesHints,
  generateVolumeHints,
  generateSeparableDEHints,
  generateLinearDEHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelOProblemType
} {
  if (worksheet <= 20) return { type: 'tangents_normals' }
  if (worksheet <= 40) return { type: 'find_intervals_increasing_decreasing' }
  if (worksheet <= 60) return { type: 'find_concavity_inflection' }
  if (worksheet <= 80) return { type: 'find_maxima_minima' }
  if (worksheet <= 100) return { type: 'integration_by_substitution' }
  if (worksheet <= 120) return { type: 'integration_by_parts' }
  if (worksheet <= 140) return { type: 'partial_fractions' }
  if (worksheet <= 160) return { type: 'area_between_curves_advanced' }
  if (worksheet <= 180) return { type: 'volume_disk_washer' }
  return { type: 'separable_de' }
}

function generateTangentNormal(): Problem {
  const a = randomInt(1, 3)
  const x0 = randomInt(1, 3)
  const slope = 2 * a * x0
  const y0 = a * x0 * x0
  
  const type = randomChoice(['tangent', 'normal'])
  
  if (type === 'tangent') {
    return {
      id: generateId(),
      level: 'O',
      worksheetNumber: 1,
      type: 'calculus',
      subtype: 'tangents_normals',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Find the equation of the tangent line to y = ${a === 1 ? '' : a}x² at x = ${x0}`,
      correctAnswer: `y - ${y0} = ${slope}(x - ${x0})`,
      hints: [
        `Find y'(${x0}) for the slope`,
        `Point: (${x0}, ${y0})`,
        'Use point-slope form',
      ],
      graduatedHints: generateTangentNormalHints('tangent', `${a === 1 ? '' : a}x²`, x0, 'O'),
    }
  }
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'calculus',
    subtype: 'tangents_normals',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the equation of the normal line to y = ${a === 1 ? '' : a}x² at x = ${x0}`,
    correctAnswer: `y - ${y0} = ${-1 / slope}(x - ${x0})`,
    hints: [
      'Normal is perpendicular to tangent',
      `Slope of normal = -1/(slope of tangent)`,
    ],
    graduatedHints: generateTangentNormalHints('normal', `${a === 1 ? '' : a}x²`, x0, 'O'),
  }
}

function generateIncreasingDecreasing(): Problem {
  const a = randomChoice([-2, -1, 1, 2])
  const h = randomInt(-3, 3)
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'calculus',
    subtype: 'find_intervals_increasing_decreasing',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the intervals where f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${hStr})² is increasing and decreasing`,
    correctAnswer: a > 0
      ? `Decreasing on (-∞, ${h}), Increasing on (${h}, ∞)`
      : `Increasing on (-∞, ${h}), Decreasing on (${h}, ∞)`,
    hints: [
      'Find f\'(x) and set it equal to 0',
      'Test the sign of f\'(x) in each interval',
      'f is increasing where f\' > 0, decreasing where f\' < 0',
    ],
    graduatedHints: generateIncreasingDecreasingHints(`${a === 1 ? '' : a === -1 ? '-' : a}(x ${hStr})²`, 'O'),
  }
}

function generateConcavity(): Problem {
  const a = randomChoice([-1, 1, 2])
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'calculus',
    subtype: 'find_concavity_inflection',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the intervals of concavity and inflection points for f(x) = ${a === 1 ? '' : a}x³ - 3x`,
    correctAnswer: `Inflection at x = 0; Concave ${a > 0 ? 'down' : 'up'} on (-∞, 0), Concave ${a > 0 ? 'up' : 'down'} on (0, ∞)`,
    hints: [
      'Find f\'\'(x)',
      'Inflection points where f\'\'(x) = 0 and f\'\' changes sign',
      'Concave up where f\'\' > 0, concave down where f\'\' < 0',
    ],
    graduatedHints: generateConcavityHints(`${a === 1 ? '' : a}x³ - 3x`, 'O'),
  }
}

function generateMaxMin(): Problem {
  const a = randomInt(1, 3)
  const b = randomInt(-6, -2) * a
  const c = randomInt(-5, 5)
  
  const criticalPoints = -b / (2 * a)
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'calculus',
    subtype: 'find_maxima_minima',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the local maxima and minima of f(x) = ${a}x² ${bStr} ${cStr}`,
    correctAnswer: `Local minimum at x = ${criticalPoints}`,
    hints: [
      'Find f\'(x) and set it equal to 0',
      'Use the second derivative test',
      `f'(x) = ${2 * a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`,
    ],
    graduatedHints: generateExtremaHints(`${a}x² ${bStr} ${cStr}`, 'O'),
  }
}

function generateSubstitution(): Problem {
  const n = randomInt(2, 4)
  const a = randomInt(1, 3)
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'integration_by_substitution',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate: ∫ x(x² + ${a})^${n} dx`,
    correctAnswer: `(x² + ${a})^${n + 1}/${2 * (n + 1)} + C`,
    hints: [
      `Let u = x² + ${a}`,
      'Then du = 2x dx, so x dx = du/2',
      'Substitute and integrate',
    ],
    graduatedHints: generateUSubstitutionHints(`x(x² + ${a})^${n}`, `x² + ${a}`, 'O'),
  }
}

function generateByParts(): Problem {
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'integration_by_parts',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Evaluate: ∫ x·e^x dx`,
    correctAnswer: 'x·e^x - e^x + C',
    hints: [
      'Integration by parts: ∫u dv = uv - ∫v du',
      'Let u = x, dv = e^x dx',
      'Then du = dx, v = e^x',
    ],
    graduatedHints: generateIntegrationByPartsHints('x·e^x', 'x', 'e^x', 'O'),
  }
}

function generatePartialFractions(): Problem {
  const a = randomInt(1, 3)
  const b = randomInt(1, 3)
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'partial_fractions',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Evaluate: ∫ ${a + b}/(x² - ${a * b}) dx using partial fractions`,
    correctAnswer: `A·ln|x-${a}| + B·ln|x+${b}| + C (where A and B are constants from decomposition)`,
    hints: [
      'Factor the denominator: (x - a)(x + b)',
      'Set up partial fractions: A/(x-a) + B/(x+b)',
      'Solve for A and B, then integrate each term',
    ],
    graduatedHints: generatePartialFractionsHints(`${a + b}/(x² - ${a * b})`, 'O'),
  }
}

function generateAreaBetweenCurves(): Problem {
  const a = randomInt(1, 3)
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'area_between_curves_advanced',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find the area between y = x² and y = ${a}x`,
    correctAnswer: `∫[0 to ${a}] (${a}x - x²) dx`,
    hints: [
      'Find the intersection points',
      'Set up the integral: ∫(upper - lower) dx',
      'The curves intersect at x = 0 and x = ' + a,
    ],
    graduatedHints: generateAreaBetweenCurvesHints('x²', `${a}x`, 'O'),
  }
}

function generateVolume(): Problem {
  const r = randomInt(1, 3)
  
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'integral',
    subtype: 'volume_disk_washer',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find the volume of the solid formed by rotating y = ${r === 1 ? '' : r}x, 0 ≤ x ≤ 1, about the x-axis`,
    correctAnswer: `π∫[0 to 1] (${r}x)² dx = ${r * r}π/3`,
    hints: [
      'Disk method: V = π∫[a to b] [f(x)]² dx',
      `[f(x)]² = ${r * r}x²`,
    ],
    graduatedHints: generateVolumeHints('disk', `${r === 1 ? '' : r}x`, 'O'),
  }
}

function generateSeparableDE(): Problem {
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'differential_equation',
    subtype: 'separable_de',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Solve the differential equation: dy/dx = xy`,
    correctAnswer: 'y = Ce^(x²/2)',
    hints: [
      'Separate variables: dy/y = x dx',
      'Integrate both sides',
      'Solve for y',
    ],
    graduatedHints: generateSeparableDEHints('dy/dx = xy', 'O'),
  }
}

function generateFirstOrderLinear(): Problem {
  return {
    id: generateId(),
    level: 'O',
    worksheetNumber: 1,
    type: 'differential_equation',
    subtype: 'first_order_linear_de',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Solve: dy/dx + y = e^x`,
    correctAnswer: 'y = (e^x + C)/e^x = 1/2·e^x + Ce^(-x)',
    hints: [
      'This is first-order linear: dy/dx + P(x)y = Q(x)',
      'Find integrating factor: μ = e^∫P dx = e^x',
      'Multiply through and integrate',
    ],
    graduatedHints: generateLinearDEHints('O'),
  }
}

export function generateOProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'tangents_normals':
      problem = generateTangentNormal()
      break
    case 'find_intervals_increasing_decreasing':
      problem = generateIncreasingDecreasing()
      break
    case 'find_concavity_inflection':
      problem = generateConcavity()
      break
    case 'find_maxima_minima':
    case 'complete_curve_sketch':
    case 'various_differentiation_applications':
      problem = generateMaxMin()
      break
    case 'integration_by_substitution':
      problem = generateSubstitution()
      break
    case 'integration_by_parts':
      problem = generateByParts()
      break
    case 'partial_fractions':
    case 'trigonometric_integrals':
    case 'trigonometric_substitution':
    case 'definite_integrals_advanced':
      problem = generatePartialFractions()
      break
    case 'area_between_curves_advanced':
      problem = generateAreaBetweenCurves()
      break
    case 'volume_disk_washer':
    case 'volume_shell_method':
    case 'arc_length':
    case 'work_problems':
      problem = generateVolume()
      break
    case 'separable_de':
    case 'exponential_growth_decay_de':
    case 'initial_value_problem':
      problem = generateSeparableDE()
      break
    case 'first_order_linear_de':
      problem = generateFirstOrderLinear()
      break
    default:
      problem = generateSubstitution()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateOProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateOProblem(worksheet))
  }
  return problems
}

export function getOWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelOProblemType, string> = {
    'tangents_normals': 'Tangents and Normals',
    'find_intervals_increasing_decreasing': 'Increasing/Decreasing',
    'find_concavity_inflection': 'Concavity and Inflection',
    'find_maxima_minima': 'Maxima and Minima',
    'complete_curve_sketch': 'Curve Sketching',
    'various_differentiation_applications': 'Differentiation Applications',
    'integration_by_substitution': 'Integration by Substitution',
    'integration_by_parts': 'Integration by Parts',
    'partial_fractions': 'Partial Fractions',
    'trigonometric_integrals': 'Trigonometric Integrals',
    'trigonometric_substitution': 'Trigonometric Substitution',
    'definite_integrals_advanced': 'Advanced Definite Integrals',
    'area_between_curves_advanced': 'Area Between Curves',
    'volume_disk_washer': 'Volume (Disk/Washer)',
    'volume_shell_method': 'Volume (Shell Method)',
    'arc_length': 'Arc Length',
    'work_problems': 'Work Problems',
    'separable_de': 'Separable DE',
    'first_order_linear_de': 'First-Order Linear DE',
    'exponential_growth_decay_de': 'Exponential Growth/Decay DE',
    'initial_value_problem': 'Initial Value Problems',
  }
  
  return {
    level: 'O' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
