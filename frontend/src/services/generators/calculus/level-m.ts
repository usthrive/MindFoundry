import type { Problem, LevelMProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelMProblemType
} {
  if (worksheet <= 30) return { type: 'equation_of_line' }
  if (worksheet <= 50) return { type: 'equation_of_circle' }
  if (worksheet <= 80) return { type: 'locus_problems' }
  if (worksheet <= 100) return { type: 'evaluate_trig_ratio' }
  if (worksheet <= 110) return { type: 'unit_circle' }
  if (worksheet <= 120) return { type: 'pythagorean_identities' }
  if (worksheet <= 130) return { type: 'solve_basic_trig_equation' }
  if (worksheet <= 150) return { type: 'graph_sine_cosine' }
  if (worksheet <= 170) return { type: 'sum_difference_formulas' }
  if (worksheet <= 180) return { type: 'double_angle_formulas' }
  if (worksheet <= 190) return { type: 'law_of_sines' }
  return { type: 'law_of_cosines' }
}

function generateEquationOfLine(): Problem {
  const x1 = randomInt(-5, 5)
  const y1 = randomInt(-5, 5)
  const x2 = randomInt(-5, 5)
  const y2 = randomInt(-5, 5)
  
  if (x1 === x2) {
    return {
      id: generateId(),
      level: 'M',
      worksheetNumber: 1,
      type: 'geometry',
      subtype: 'equation_of_line',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `Find the equation of the line through (${x1}, ${y1}) and (${x2}, ${y2})`,
      correctAnswer: `x = ${x1}`,
      hints: ['Vertical line: x = constant'],
    }
  }
  
  const slope = (y2 - y1) / (x2 - x1)
  const yIntercept = y1 - slope * x1
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'geometry',
    subtype: 'equation_of_line',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the equation of the line through (${x1}, ${y1}) and (${x2}, ${y2})`,
    correctAnswer: `y = ${slope}x + ${yIntercept}`,
    hints: [
      `slope = (${y2} - ${y1})/(${x2} - ${x1})`,
      'Use point-slope form: y - y1 = m(x - x1)',
    ],
  }
}

function generateEquationOfCircle(): Problem {
  const h = randomInt(-5, 5)
  const k = randomInt(-5, 5)
  const r = randomInt(1, 6)
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  const kStr = k >= 0 ? `- ${k}` : `+ ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'geometry',
    subtype: 'equation_of_circle',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Write the equation of a circle with center (${h}, ${k}) and radius ${r}`,
    correctAnswer: `(x ${hStr})² + (y ${kStr})² = ${r * r}`,
    hints: ['Standard form: (x - h)² + (y - k)² = r²'],
  }
}

function generateTrigRatio(): Problem {
  const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
  const angle = randomChoice(angles)
  const func = randomChoice(['sin', 'cos', 'tan'])
  
  const values: Record<number, { sin: string; cos: string; tan: string }> = {
    0: { sin: '0', cos: '1', tan: '0' },
    30: { sin: '1/2', cos: '√3/2', tan: '√3/3' },
    45: { sin: '√2/2', cos: '√2/2', tan: '1' },
    60: { sin: '√3/2', cos: '1/2', tan: '√3' },
    90: { sin: '1', cos: '0', tan: 'undefined' },
    120: { sin: '√3/2', cos: '-1/2', tan: '-√3' },
    135: { sin: '√2/2', cos: '-√2/2', tan: '-1' },
    150: { sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
    180: { sin: '0', cos: '-1', tan: '0' },
    210: { sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
    225: { sin: '-√2/2', cos: '-√2/2', tan: '1' },
    240: { sin: '-√3/2', cos: '-1/2', tan: '√3' },
    270: { sin: '-1', cos: '0', tan: 'undefined' },
    300: { sin: '-√3/2', cos: '1/2', tan: '-√3' },
    315: { sin: '-√2/2', cos: '√2/2', tan: '-1' },
    330: { sin: '-1/2', cos: '√3/2', tan: '-√3/3' },
  }
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'trigonometry',
    subtype: 'evaluate_trig_ratio',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Evaluate: ${func}(${angle}°)`,
    correctAnswer: values[angle][func as keyof typeof values[0]],
    hints: ['Use the unit circle or special triangles'],
  }
}

function generateUnitCircle(): Problem {
  const angle = randomChoice([0, 'π/6', 'π/4', 'π/3', 'π/2', '2π/3', '3π/4', '5π/6', 'π'])
  
  const coordinates: Record<string, string> = {
    '0': '(1, 0)',
    'π/6': '(√3/2, 1/2)',
    'π/4': '(√2/2, √2/2)',
    'π/3': '(1/2, √3/2)',
    'π/2': '(0, 1)',
    '2π/3': '(-1/2, √3/2)',
    '3π/4': '(-√2/2, √2/2)',
    '5π/6': '(-√3/2, 1/2)',
    'π': '(-1, 0)',
  }
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'trigonometry',
    subtype: 'unit_circle',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the coordinates of the point on the unit circle at angle ${angle}`,
    correctAnswer: coordinates[angle],
    hints: ['(cos θ, sin θ)'],
  }
}

function generatePythagoreanIdentity(): Problem {
  const type = randomChoice(['verify', 'simplify'])
  
  if (type === 'verify') {
    return {
      id: generateId(),
      level: 'M',
      worksheetNumber: 1,
      type: 'trigonometry',
      subtype: 'pythagorean_identities',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Simplify: sin²θ + cos²θ`,
      correctAnswer: '1',
      hints: ['This is the Pythagorean identity'],
    }
  }
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'trigonometry',
    subtype: 'pythagorean_identities',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Simplify: 1 - sin²θ`,
    correctAnswer: 'cos²θ',
    hints: ['Use sin²θ + cos²θ = 1', 'Rearrange: cos²θ = 1 - sin²θ'],
  }
}

function generateTrigEquation(): Problem {
  const func = randomChoice(['sin', 'cos'])
  const values = ['0', '1/2', '√2/2', '√3/2', '1', '-1/2', '-√2/2', '-√3/2', '-1']
  const value = randomChoice(values)
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_basic_trig_equation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve for θ in [0, 2π): ${func}(θ) = ${value}`,
    correctAnswer: `θ = ...`,
    hints: [
      'Find the reference angle',
      'Determine which quadrants have this value',
    ],
  }
}

function generateSineCosineGraph(): Problem {
  const func = randomChoice(['sin', 'cos'])
  const a = randomChoice([1, 2, 3, 0.5])
  const b = randomChoice([1, 2, 0.5])
  const c = randomChoice([0, 'π/4', 'π/2'])
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'graphing',
    subtype: 'graph_sine_cosine',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Identify the amplitude, period, and phase shift of y = ${a}${func}(${b === 1 ? '' : b}x ${c === 0 ? '' : `- ${c}`})`,
    correctAnswer: `Amplitude: ${a}, Period: ${2 * Math.PI / (typeof b === 'number' ? b : 1)}, Phase shift: ${c === 0 ? '0' : c}`,
    hints: [
      'Amplitude = |a|',
      'Period = 2π/b',
      'Phase shift = c/b (to the right)',
    ],
  }
}

function generateSumDifferenceFormula(): Problem {
  const type = randomChoice(['sum', 'difference'])
  const func = randomChoice(['sin', 'cos'])
  
  if (func === 'sin') {
    return {
      id: generateId(),
      level: 'M',
      worksheetNumber: 1,
      type: 'trigonometry',
      subtype: 'sum_difference_formulas',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Expand: sin(A ${type === 'sum' ? '+' : '-'} B)`,
      correctAnswer: type === 'sum' 
        ? 'sin(A)cos(B) + cos(A)sin(B)'
        : 'sin(A)cos(B) - cos(A)sin(B)',
      hints: [`sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)`],
    }
  }
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'trigonometry',
    subtype: 'sum_difference_formulas',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Expand: cos(A ${type === 'sum' ? '+' : '-'} B)`,
    correctAnswer: type === 'sum'
      ? 'cos(A)cos(B) - sin(A)sin(B)'
      : 'cos(A)cos(B) + sin(A)sin(B)',
    hints: ['cos(A ± B) = cos(A)cos(B) ∓ sin(A)sin(B)'],
  }
}

function generateDoubleAngle(): Problem {
  const func = randomChoice(['sin', 'cos'])
  
  if (func === 'sin') {
    return {
      id: generateId(),
      level: 'M',
      worksheetNumber: 1,
      type: 'trigonometry',
      subtype: 'double_angle_formulas',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Express sin(2θ) in terms of sin(θ) and cos(θ)`,
      correctAnswer: '2sin(θ)cos(θ)',
      hints: ['Double angle formula for sine'],
    }
  }
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'trigonometry',
    subtype: 'double_angle_formulas',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Express cos(2θ) in terms of cos(θ)`,
    correctAnswer: '2cos²(θ) - 1',
    hints: ['cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ'],
  }
}

function generateLawOfSines(): Problem {
  const A = randomInt(30, 80)
  const B = randomInt(30, 80)
  const a = randomInt(5, 15)
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'triangle',
    subtype: 'law_of_sines',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `In triangle ABC, angle A = ${A}°, angle B = ${B}°, and side a = ${a}. Find side b.`,
    correctAnswer: `b = ${a} × sin(${B}°)/sin(${A}°)`,
    hints: ['Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)'],
  }
}

function generateLawOfCosines(): Problem {
  const a = randomInt(5, 10)
  const b = randomInt(5, 10)
  const angleC = randomInt(30, 120)
  
  return {
    id: generateId(),
    level: 'M',
    worksheetNumber: 1,
    type: 'triangle',
    subtype: 'law_of_cosines',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `In triangle ABC, a = ${a}, b = ${b}, and angle C = ${angleC}°. Find side c.`,
    correctAnswer: `c² = ${a}² + ${b}² - 2(${a})(${b})cos(${angleC}°)`,
    hints: ['Law of Cosines: c² = a² + b² - 2ab·cos(C)'],
  }
}

export function generateMProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'distance_between_points':
    case 'midpoint_formula':
    case 'equation_of_line':
      problem = generateEquationOfLine()
      break
    case 'equation_of_circle':
    case 'locus_problems':
    case 'regions':
      problem = generateEquationOfCircle()
      break
    case 'evaluate_trig_ratio':
    case 'find_angle_given_ratio':
    case 'reference_angles':
      problem = generateTrigRatio()
      break
    case 'unit_circle':
      problem = generateUnitCircle()
      break
    case 'pythagorean_identities':
    case 'quotient_identities':
    case 'reciprocal_identities':
      problem = generatePythagoreanIdentity()
      break
    case 'solve_basic_trig_equation':
    case 'solve_quadratic_trig_equation':
    case 'trig_inequalities':
      problem = generateTrigEquation()
      break
    case 'graph_sine_cosine':
    case 'amplitude_period_phase':
    case 'graph_tangent':
      problem = generateSineCosineGraph()
      break
    case 'sum_difference_formulas':
    case 'half_angle_formulas':
      problem = generateSumDifferenceFormula()
      break
    case 'double_angle_formulas':
      problem = generateDoubleAngle()
      break
    case 'law_of_sines':
      problem = generateLawOfSines()
      break
    case 'law_of_cosines':
    case 'area_of_triangle_trig':
      problem = generateLawOfCosines()
      break
    default:
      problem = generateTrigRatio()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateMProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateMProblem(worksheet))
  }
  return problems
}

export function getMWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelMProblemType, string> = {
    'distance_between_points': 'Distance Formula',
    'midpoint_formula': 'Midpoint Formula',
    'equation_of_line': 'Equation of Line',
    'equation_of_circle': 'Equation of Circle',
    'locus_problems': 'Locus Problems',
    'regions': 'Regions',
    'evaluate_trig_ratio': 'Trig Ratios',
    'find_angle_given_ratio': 'Find Angle',
    'unit_circle': 'Unit Circle',
    'reference_angles': 'Reference Angles',
    'pythagorean_identities': 'Pythagorean Identities',
    'quotient_identities': 'Quotient Identities',
    'reciprocal_identities': 'Reciprocal Identities',
    'solve_basic_trig_equation': 'Basic Trig Equations',
    'solve_quadratic_trig_equation': 'Quadratic Trig Equations',
    'graph_sine_cosine': 'Graph Sine/Cosine',
    'amplitude_period_phase': 'Amplitude/Period/Phase',
    'graph_tangent': 'Graph Tangent',
    'trig_inequalities': 'Trig Inequalities',
    'sum_difference_formulas': 'Sum/Difference Formulas',
    'double_angle_formulas': 'Double Angle Formulas',
    'half_angle_formulas': 'Half Angle Formulas',
    'law_of_sines': 'Law of Sines',
    'law_of_cosines': 'Law of Cosines',
    'area_of_triangle_trig': 'Area of Triangle (Trig)',
  }
  
  return {
    level: 'M' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
