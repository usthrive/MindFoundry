import type { Problem, LevelXMProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelXMProblemType
} {
  if (worksheet <= 20) return { type: 'matrix_addition' }
  if (worksheet <= 35) return { type: 'matrix_multiplication' }
  if (worksheet <= 50) return { type: 'matrix_determinant' }
  if (worksheet <= 65) return { type: 'matrix_inverse' }
  if (worksheet <= 75) return { type: 'solve_system_with_matrices' }
  return { type: 'transformation_rotation' }
}

function generateMatrixAddition(): Problem {
  const a11 = randomInt(-5, 5)
  const a12 = randomInt(-5, 5)
  const a21 = randomInt(-5, 5)
  const a22 = randomInt(-5, 5)
  const b11 = randomInt(-5, 5)
  const b12 = randomInt(-5, 5)
  const b21 = randomInt(-5, 5)
  const b22 = randomInt(-5, 5)
  
  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'matrix',
    subtype: 'matrix_addition',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Add: [[${a11}, ${a12}], [${a21}, ${a22}]] + [[${b11}, ${b12}], [${b21}, ${b22}]]`,
    correctAnswer: `[[${a11 + b11}, ${a12 + b12}], [${a21 + b21}, ${a22 + b22}]]`,
    hints: ['Add corresponding elements'],
  }
}

function generateMatrixMultiplication(): Problem {
  const a11 = randomInt(-3, 3)
  const a12 = randomInt(-3, 3)
  const a21 = randomInt(-3, 3)
  const a22 = randomInt(-3, 3)
  const b11 = randomInt(-3, 3)
  const b12 = randomInt(-3, 3)
  const b21 = randomInt(-3, 3)
  const b22 = randomInt(-3, 3)
  
  const c11 = a11 * b11 + a12 * b21
  const c12 = a11 * b12 + a12 * b22
  const c21 = a21 * b11 + a22 * b21
  const c22 = a21 * b12 + a22 * b22
  
  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'matrix',
    subtype: 'matrix_multiplication',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Multiply: [[${a11}, ${a12}], [${a21}, ${a22}]] × [[${b11}, ${b12}], [${b21}, ${b22}]]`,
    correctAnswer: `[[${c11}, ${c12}], [${c21}, ${c22}]]`,
    hints: [
      'Row × Column',
      'c₁₁ = a₁₁b₁₁ + a₁₂b₂₁',
    ],
  }
}

function generateDeterminant(): Problem {
  const a = randomInt(-5, 5)
  const b = randomInt(-5, 5)
  const c = randomInt(-5, 5)
  const d = randomInt(-5, 5)
  
  const det = a * d - b * c
  
  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'matrix',
    subtype: 'matrix_determinant',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Find the determinant: [[${a}, ${b}], [${c}, ${d}]]`,
    correctAnswer: det,
    hints: ['det = ad - bc'],
  }
}

function generateInverse(): Problem {
  let a = randomInt(1, 4)
  let b = randomInt(-3, 3)
  let c = randomInt(-3, 3)
  let d = randomInt(1, 4)
  
  let det = a * d - b * c
  while (det === 0) {
    d = randomInt(1, 4)
    det = a * d - b * c
  }
  
  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'matrix',
    subtype: 'matrix_inverse',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the inverse of: [[${a}, ${b}], [${c}, ${d}]]`,
    correctAnswer: `(1/${det})[[${d}, ${-b}], [${-c}, ${a}]]`,
    hints: [
      'A⁻¹ = (1/det) × [[d, -b], [-c, a]]',
      `det = ${det}`,
    ],
  }
}

function generateSystemWithMatrices(): Problem {
  const x = randomInt(-3, 3)
  const y = randomInt(-3, 3)
  const a = randomInt(1, 3)
  const b = randomInt(1, 3)
  const c = randomInt(1, 3)
  const d = randomInt(1, 3)
  
  const e = a * x + b * y
  const f = c * x + d * y
  
  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'matrix',
    subtype: 'solve_system_with_matrices',
    difficulty: 3,
    displayFormat: 'vertical',
    question: `Solve using matrices:\n${a}x + ${b}y = ${e}\n${c}x + ${d}y = ${f}`,
    correctAnswer: `x = ${x}, y = ${y}`,
    hints: [
      'Write as AX = B',
      'X = A⁻¹B',
      'First find the inverse of A',
    ],
  }
}

function generateMatrixSubtraction(): Problem {
  const a11 = randomInt(-5, 5)
  const a12 = randomInt(-5, 5)
  const a21 = randomInt(-5, 5)
  const a22 = randomInt(-5, 5)
  const b11 = randomInt(-5, 5)
  const b12 = randomInt(-5, 5)
  const b21 = randomInt(-5, 5)
  const b22 = randomInt(-5, 5)

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'matrix',
    subtype: 'matrix_subtraction',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Subtract: [[${a11}, ${a12}], [${a21}, ${a22}]] - [[${b11}, ${b12}], [${b21}, ${b22}]]`,
    correctAnswer: `[[${a11 - b11}, ${a12 - b12}], [${a21 - b21}, ${a22 - b22}]]`,
    hints: ['Subtract corresponding elements'],
  }
}

function generateSetUnion(): Problem {
  const setA = new Set<number>()
  const setB = new Set<number>()
  const size = randomInt(3, 5)

  while (setA.size < size) setA.add(randomInt(1, 10))
  while (setB.size < size) setB.add(randomInt(1, 10))

  const union = new Set([...setA, ...setB])

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'set_operation',
    subtype: 'set_union',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Find A ∪ B where A = {${[...setA].sort((a, b) => a - b).join(', ')}} and B = {${[...setB].sort((a, b) => a - b).join(', ')}}`,
    correctAnswer: `{${[...union].sort((a, b) => a - b).join(', ')}}`,
    hints: ['Union includes all elements from both sets'],
  }
}

function generateSetIntersection(): Problem {
  const common = [randomInt(1, 10), randomInt(1, 10)]
  const setA = new Set<number>(common)
  const setB = new Set<number>(common)

  while (setA.size < 4) setA.add(randomInt(1, 10))
  while (setB.size < 4) setB.add(randomInt(1, 10))

  const intersection = [...setA].filter(x => setB.has(x))

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'set_operation',
    subtype: 'set_intersection',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Find A ∩ B where A = {${[...setA].sort((a, b) => a - b).join(', ')}} and B = {${[...setB].sort((a, b) => a - b).join(', ')}}`,
    correctAnswer: `{${intersection.sort((a, b) => a - b).join(', ')}}`,
    hints: ['Intersection includes only elements in BOTH sets'],
  }
}

function generateSetDifference(): Problem {
  const setA = new Set<number>()
  const setB = new Set<number>()

  while (setA.size < 5) setA.add(randomInt(1, 10))
  while (setB.size < 4) setB.add(randomInt(1, 10))

  const difference = [...setA].filter(x => !setB.has(x))

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'set_operation',
    subtype: 'set_difference',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find A - B where A = {${[...setA].sort((a, b) => a - b).join(', ')}} and B = {${[...setB].sort((a, b) => a - b).join(', ')}}`,
    correctAnswer: `{${difference.sort((a, b) => a - b).join(', ')}}`,
    hints: ['A - B contains elements in A that are NOT in B'],
  }
}

function generateMapping(): Problem {
  const domain = [1, 2, 3, 4]
  const mappingTypes = ['one-to-one', 'onto', 'many-to-one']
  const type = randomChoice(mappingTypes)

  let codomain: number[]
  let mapping: Record<number, number> = {}

  if (type === 'one-to-one') {
    codomain = [5, 6, 7, 8, 9]
    const shuffled = [...codomain].sort(() => Math.random() - 0.5)
    domain.forEach((d, i) => { mapping[d] = shuffled[i] })
  } else if (type === 'many-to-one') {
    codomain = [5, 6]
    domain.forEach(d => { mapping[d] = randomChoice(codomain) })
  } else {
    codomain = [5, 6, 7, 8]
    domain.forEach((d, i) => { mapping[d] = codomain[i] })
  }

  const mappingStr = domain.map(d => `${d} → ${mapping[d]}`).join(', ')

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'mapping',
    subtype: 'mapping',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Is this mapping one-to-one, onto, or many-to-one?\nf: {${domain.join(', ')}} → {${codomain.join(', ')}}\n${mappingStr}`,
    correctAnswer: type,
    hints: [
      'One-to-one: each output has at most one input',
      'Onto: every element in codomain is mapped to',
      'Many-to-one: multiple inputs map to same output',
    ],
  }
}

function generateDomainRange(): Problem {
  const a = randomInt(1, 3)
  const b = randomInt(-2, 2)
  const funcType = randomChoice(['linear', 'quadratic'])

  if (funcType === 'linear') {
    return {
      id: generateId(),
      level: 'XM',
      worksheetNumber: 1,
      type: 'mapping',
      subtype: 'domain_range',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Find the range of f(x) = ${a}x ${b >= 0 ? '+' : ''}${b} for domain {1, 2, 3, 4}`,
      correctAnswer: `{${[1, 2, 3, 4].map(x => a * x + b).join(', ')}}`,
      hints: ['Evaluate f(x) for each element in the domain'],
    }
  }

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'mapping',
    subtype: 'domain_range',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the range of f(x) = x² for domain {-2, -1, 0, 1, 2}`,
    correctAnswer: '{0, 1, 4}',
    hints: ['Calculate f(x) for each value', 'Remove duplicates in the range'],
  }
}

function generateCompositeMapping(): Problem {
  const a1 = randomInt(1, 3)
  const b1 = randomInt(-2, 2)
  const a2 = randomInt(1, 3)
  const b2 = randomInt(-2, 2)
  const x = randomInt(1, 5)

  const fx = a1 * x + b1
  const gfx = a2 * fx + b2

  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'mapping',
    subtype: 'composite_mapping',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `If f(x) = ${a1}x ${b1 >= 0 ? '+' : ''}${b1} and g(x) = ${a2}x ${b2 >= 0 ? '+' : ''}${b2}, find (g ∘ f)(${x})`,
    correctAnswer: gfx,
    hints: [
      '(g ∘ f)(x) = g(f(x))',
      `First calculate f(${x}) = ${fx}`,
      `Then calculate g(${fx})`,
    ],
  }
}

function generateTransformation(): Problem {
  const type = randomChoice(['reflection', 'rotation', 'scaling'])
  
  if (type === 'reflection') {
    const x = randomInt(-5, 5)
    const y = randomInt(-5, 5)
    const axis = randomChoice(['x-axis', 'y-axis', 'y=x'])
    
    let newX: number, newY: number
    switch (axis) {
      case 'x-axis':
        newX = x
        newY = -y
        break
      case 'y-axis':
        newX = -x
        newY = y
        break
      case 'y=x':
        newX = y
        newY = x
        break
      default:
        newX = x
        newY = y
    }
    
    return {
      id: generateId(),
      level: 'XM',
      worksheetNumber: 1,
      type: 'transformation',
      subtype: 'transformation_reflection',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Reflect the point (${x}, ${y}) over the ${axis}`,
      correctAnswer: `(${newX}, ${newY})`,
      hints: [
        axis === 'x-axis' ? '(x, y) → (x, -y)' :
        axis === 'y-axis' ? '(x, y) → (-x, y)' :
        '(x, y) → (y, x)',
      ],
    }
  }
  
  if (type === 'rotation') {
    const x = randomInt(1, 5)
    const y = randomInt(1, 5)
    const angle = randomChoice([90, 180, 270])
    
    let newX: number, newY: number
    switch (angle) {
      case 90:
        newX = -y
        newY = x
        break
      case 180:
        newX = -x
        newY = -y
        break
      case 270:
        newX = y
        newY = -x
        break
      default:
        newX = x
        newY = y
    }
    
    return {
      id: generateId(),
      level: 'XM',
      worksheetNumber: 1,
      type: 'transformation',
      subtype: 'transformation_rotation',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Rotate the point (${x}, ${y}) by ${angle}° counterclockwise about the origin`,
      correctAnswer: `(${newX}, ${newY})`,
      hints: [
        angle === 90 ? '(x, y) → (-y, x)' :
        angle === 180 ? '(x, y) → (-x, -y)' :
        '(x, y) → (y, -x)',
      ],
    }
  }
  
  const x = randomInt(1, 5)
  const y = randomInt(1, 5)
  const k = randomInt(2, 4)
  
  return {
    id: generateId(),
    level: 'XM',
    worksheetNumber: 1,
    type: 'transformation',
    subtype: 'transformation_scaling',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Scale the point (${x}, ${y}) by a factor of ${k}`,
    correctAnswer: `(${k * x}, ${k * y})`,
    hints: ['(x, y) → (kx, ky)'],
  }
}

export function generateXMProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  const variety = Math.random()

  switch (config.type) {
    case 'matrix_addition':
      if (variety < 0.5) problem = generateMatrixAddition()
      else problem = generateMatrixSubtraction()
      break
    case 'matrix_subtraction':
      problem = generateMatrixSubtraction()
      break
    case 'matrix_multiplication':
      problem = generateMatrixMultiplication()
      break
    case 'matrix_determinant':
      problem = generateDeterminant()
      break
    case 'matrix_inverse':
    case 'matrix_equations':
      problem = generateInverse()
      break
    case 'solve_system_with_matrices':
      problem = generateSystemWithMatrices()
      break
    case 'set_union':
      problem = generateSetUnion()
      break
    case 'set_intersection':
      problem = generateSetIntersection()
      break
    case 'set_difference':
      problem = generateSetDifference()
      break
    case 'mapping':
      if (variety < 0.4) problem = generateMapping()
      else if (variety < 0.7) problem = generateDomainRange()
      else problem = generateCompositeMapping()
      break
    case 'domain_range':
      problem = generateDomainRange()
      break
    case 'composite_mapping':
      problem = generateCompositeMapping()
      break
    case 'transformation_reflection':
    case 'transformation_rotation':
    case 'transformation_scaling':
    case 'composite_transformations':
      problem = generateTransformation()
      break
    default:
      problem = generateMatrixAddition()
  }

  problem.worksheetNumber = worksheet
  return problem
}

export function generateXMProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateXMProblem(worksheet))
  }
  return problems
}

export function getXMWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelXMProblemType, string> = {
    'matrix_addition': 'Matrix Addition',
    'matrix_subtraction': 'Matrix Subtraction',
    'matrix_multiplication': 'Matrix Multiplication',
    'matrix_determinant': 'Determinants',
    'matrix_inverse': 'Matrix Inverse',
    'solve_system_with_matrices': 'Systems with Matrices',
    'matrix_equations': 'Matrix Equations',
    'set_union': 'Set Union',
    'set_intersection': 'Set Intersection',
    'set_difference': 'Set Difference',
    'mapping': 'Mappings',
    'domain_range': 'Domain and Range',
    'composite_mapping': 'Composite Mappings',
    'transformation_reflection': 'Reflections',
    'transformation_rotation': 'Rotations',
    'transformation_scaling': 'Scaling',
    'composite_transformations': 'Composite Transformations',
  }
  
  return {
    level: 'XM' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
