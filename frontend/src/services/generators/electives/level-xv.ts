import type { Problem, LevelXVProblemType } from '../types'
import { randomInt, generateId } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelXVProblemType
} {
  if (worksheet <= 30) return { type: 'vector_addition_2d' }
  if (worksheet <= 50) return { type: 'vector_magnitude' }
  if (worksheet <= 70) return { type: 'dot_product' }
  if (worksheet <= 90) return { type: 'cross_product_3d' }
  if (worksheet <= 110) return { type: 'equation_of_line_vectors' }
  return { type: 'equation_of_plane' }
}

function generateVectorAddition(): Problem {
  const a1 = randomInt(-5, 5)
  const a2 = randomInt(-5, 5)
  const b1 = randomInt(-5, 5)
  const b2 = randomInt(-5, 5)

  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'vector_addition_2d',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Add the vectors: a = <${a1}, ${a2}> and b = <${b1}, ${b2}>`,
    correctAnswer: `<${a1 + b1}, ${a2 + b2}>`,
    hints: ['Add corresponding components: <a₁+b₁, a₂+b₂>'],
  }
}

function generateScalarMultiplication(): Problem {
  const k = randomInt(-4, 4)
  const a1 = randomInt(-5, 5)
  const a2 = randomInt(-5, 5)

  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'vector_scalar_multiplication',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Calculate ${k} × <${a1}, ${a2}>`,
    correctAnswer: `<${k * a1}, ${k * a2}>`,
    hints: ['Multiply each component by the scalar: k<a, b> = <ka, kb>'],
  }
}

function generateVectorSubtraction(): Problem {
  const a1 = randomInt(-5, 5)
  const a2 = randomInt(-5, 5)
  const b1 = randomInt(-5, 5)
  const b2 = randomInt(-5, 5)

  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'vector_subtraction_2d',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Subtract vectors: a - b where a = <${a1}, ${a2}> and b = <${b1}, ${b2}>`,
    correctAnswer: `<${a1 - b1}, ${a2 - b2}>`,
    hints: ['a - b = <a₁-b₁, a₂-b₂>'],
  }
}

function generate3DCoordinates(): Problem {
  const x1 = randomInt(-5, 5)
  const y1 = randomInt(-5, 5)
  const z1 = randomInt(-5, 5)
  const x2 = randomInt(-5, 5)
  const y2 = randomInt(-5, 5)
  const z2 = randomInt(-5, 5)

  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  const distSq = dx * dx + dy * dy + dz * dz

  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'coordinates_in_space',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the distance between points P(${x1}, ${y1}, ${z1}) and Q(${x2}, ${y2}, ${z2})`,
    correctAnswer: Number.isInteger(Math.sqrt(distSq)) ? Math.sqrt(distSq) : `√${distSq}`,
    hints: [
      'd = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)',
      'The 3D distance formula extends the 2D Pythagorean theorem',
    ],
  }
}

function generateVectorProjection(): Problem {
  const a1 = randomInt(1, 5)
  const a2 = randomInt(1, 5)
  const b1 = randomInt(1, 5)
  const b2 = randomInt(1, 5)

  const dotAB = a1 * b1 + a2 * b2
  const magBSq = b1 * b1 + b2 * b2

  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'vector_projection',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find the projection of a = <${a1}, ${a2}> onto b = <${b1}, ${b2}>`,
    correctAnswer: `(${dotAB}/${magBSq})<${b1}, ${b2}>`,
    hints: [
      'proj_b(a) = ((a·b)/(b·b)) × b',
      'First calculate a·b and |b|²',
    ],
  }
}

function generateParallelPerpendicular(): Problem {
  const mode = Math.random() < 0.5 ? 'parallel' : 'perpendicular'
  const a1 = randomInt(1, 4)
  const a2 = randomInt(1, 4)

  let b1: number, b2: number, answer: string

  if (mode === 'parallel') {
    const k = randomInt(2, 4)
    b1 = k * a1
    b2 = k * a2
    answer = 'parallel'
  } else {
    b1 = -a2
    b2 = a1
    answer = 'perpendicular'
  }

  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'vector_parallel_perpendicular',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Are vectors a = <${a1}, ${a2}> and b = <${b1}, ${b2}> parallel, perpendicular, or neither?`,
    correctAnswer: answer,
    hints: [
      'Parallel: a = kb for some scalar k',
      'Perpendicular: a·b = 0',
    ],
  }
}

function generateVectorMagnitude(): Problem {
  const a = randomInt(-5, 5)
  const b = randomInt(-5, 5)
  const magnitude = Math.sqrt(a * a + b * b)
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'vector_magnitude',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Find the magnitude of the vector v = <${a}, ${b}>`,
    correctAnswer: Number.isInteger(magnitude) ? magnitude : `√${a * a + b * b}`,
    hints: ['|v| = √(a² + b²)'],
  }
}

function generateUnitVector(): Problem {
  const x = randomInt(3, 5)
  const y = randomInt(3, 5)
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'unit_vector',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the unit vector in the direction of v = <${x}, ${y}>`,
    correctAnswer: `<${x}/√${x * x + y * y}, ${y}/√${x * x + y * y}>`,
    hints: [
      'Unit vector = v/|v|',
      'First find |v|, then divide each component by |v|',
    ],
  }
}

function generateDotProduct(): Problem {
  const a1 = randomInt(-5, 5)
  const a2 = randomInt(-5, 5)
  const b1 = randomInt(-5, 5)
  const b2 = randomInt(-5, 5)
  
  const dotProduct = a1 * b1 + a2 * b2
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'dot_product',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the dot product: a = <${a1}, ${a2}> · b = <${b1}, ${b2}>`,
    correctAnswer: dotProduct,
    hints: [
      'a · b = a₁b₁ + a₂b₂',
      `${a1}(${b1}) + ${a2}(${b2})`,
    ],
  }
}

function generateAngleBetweenVectors(): Problem {
  const a1 = randomInt(1, 4)
  const a2 = randomInt(1, 4)
  const b1 = randomInt(1, 4)
  const b2 = randomInt(1, 4)
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'angle_between_vectors',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the angle between a = <${a1}, ${a2}> and b = <${b1}, ${b2}>`,
    correctAnswer: `cos⁻¹((a·b)/(|a||b|))`,
    hints: [
      'cos(θ) = (a · b)/(|a| |b|)',
      'First find dot product and magnitudes',
    ],
  }
}

function generateCrossProduct(): Problem {
  const a1 = randomInt(-3, 3)
  const a2 = randomInt(-3, 3)
  const a3 = randomInt(-3, 3)
  const b1 = randomInt(-3, 3)
  const b2 = randomInt(-3, 3)
  const b3 = randomInt(-3, 3)
  
  const c1 = a2 * b3 - a3 * b2
  const c2 = a3 * b1 - a1 * b3
  const c3 = a1 * b2 - a2 * b1
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'cross_product_3d',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find a × b where a = <${a1}, ${a2}, ${a3}> and b = <${b1}, ${b2}, ${b3}>`,
    correctAnswer: `<${c1}, ${c2}, ${c3}>`,
    hints: [
      'a × b = <a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁>',
      'Use the determinant method',
    ],
  }
}

function generateLineEquation(): Problem {
  const x0 = randomInt(-3, 3)
  const y0 = randomInt(-3, 3)
  const z0 = randomInt(-3, 3)
  const d1 = randomInt(-3, 3)
  const d2 = randomInt(-3, 3)
  const d3 = randomInt(-3, 3)
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'equation_of_line_vectors',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Write the vector equation of the line through (${x0}, ${y0}, ${z0}) with direction <${d1}, ${d2}, ${d3}>`,
    correctAnswer: `r = <${x0}, ${y0}, ${z0}> + t<${d1}, ${d2}, ${d3}>`,
    hints: [
      'Vector form: r = r₀ + td',
      'where r₀ is a point and d is the direction',
    ],
  }
}

function generatePlaneEquation(): Problem {
  const a = randomInt(1, 5)
  const b = randomInt(1, 5)
  const c = randomInt(1, 5)
  const x0 = randomInt(-3, 3)
  const y0 = randomInt(-3, 3)
  const z0 = randomInt(-3, 3)
  
  const d = a * x0 + b * y0 + c * z0
  
  return {
    id: generateId(),
    level: 'XV',
    worksheetNumber: 1,
    type: 'vector',
    subtype: 'equation_of_plane',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Write the equation of the plane through (${x0}, ${y0}, ${z0}) with normal vector <${a}, ${b}, ${c}>`,
    correctAnswer: `${a}x + ${b}y + ${c}z = ${d}`,
    hints: [
      'Plane equation: a(x-x₀) + b(y-y₀) + c(z-z₀) = 0',
      'Or: ax + by + cz = d',
    ],
  }
}

export function generateXVProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem

  // Mix in variety based on random selection within each worksheet range
  const variety = Math.random()

  switch (config.type) {
    case 'vector_addition_2d':
      if (variety < 0.4) problem = generateVectorAddition()
      else if (variety < 0.7) problem = generateScalarMultiplication()
      else problem = generateVectorSubtraction()
      break
    case 'vector_scalar_multiplication':
      problem = generateScalarMultiplication()
      break
    case 'vector_magnitude':
      if (variety < 0.6) problem = generateVectorMagnitude()
      else problem = generateUnitVector()
      break
    case 'unit_vector':
      problem = generateUnitVector()
      break
    case 'dot_product':
      if (variety < 0.5) problem = generateDotProduct()
      else if (variety < 0.75) problem = generateAngleBetweenVectors()
      else problem = generateVectorProjection()
      break
    case 'angle_between_vectors':
      if (variety < 0.6) problem = generateAngleBetweenVectors()
      else problem = generateParallelPerpendicular()
      break
    case 'cross_product_3d':
      problem = generateCrossProduct()
      break
    case 'coordinates_in_space':
      problem = generate3DCoordinates()
      break
    case 'vectors_in_space':
      if (variety < 0.5) problem = generateCrossProduct()
      else problem = generate3DCoordinates()
      break
    case 'equation_of_line_vectors':
      problem = generateLineEquation()
      break
    case 'distance_point_to_line':
      problem = generateLineEquation()
      break
    case 'equation_of_plane':
      problem = generatePlaneEquation()
      break
    case 'distance_point_to_plane':
    case 'vectors_and_figures':
      problem = generatePlaneEquation()
      break
    default:
      problem = generateVectorAddition()
  }

  problem.worksheetNumber = worksheet
  return problem
}

export function generateXVProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateXVProblem(worksheet))
  }
  return problems
}

export function getXVWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelXVProblemType, string> = {
    'vector_addition_2d': '2D Vector Addition',
    'vector_subtraction_2d': '2D Vector Subtraction',
    'vector_scalar_multiplication': 'Scalar Multiplication',
    'vector_magnitude': 'Vector Magnitude',
    'unit_vector': 'Unit Vectors',
    'dot_product': 'Dot Product',
    'angle_between_vectors': 'Angle Between Vectors',
    'vector_projection': 'Vector Projection',
    'vector_parallel_perpendicular': 'Parallel & Perpendicular Vectors',
    'cross_product_3d': 'Cross Product',
    'coordinates_in_space': '3D Coordinates',
    'vectors_in_space': '3D Vectors',
    'equation_of_line_vectors': 'Line Equations',
    'equation_of_plane': 'Plane Equations',
    'distance_point_to_line': 'Distance to Line',
    'distance_point_to_plane': 'Distance to Plane',
    'vectors_and_figures': 'Vectors and Figures',
  }
  
  return {
    level: 'XV' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
