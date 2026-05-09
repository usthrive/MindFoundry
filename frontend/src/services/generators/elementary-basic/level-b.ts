import type { Problem, LevelBProblemType } from '../types'
import { randomInt, generateId, hasCarry, hasBorrow } from '../utils'
import { generateAdditionHints, generateSubtractionHints } from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelBProblemType
  digits: number
  allowCarry: boolean
  allowBorrow: boolean
  maxMinuend?: number
  maxSubtrahend?: number
  mixed2x1?: boolean
  threeDigitPart?: 1 | 2 | 3 | 4
} {
  if (worksheet <= 10) {
    return { type: 'addition_review', digits: 1, allowCarry: false, allowBorrow: false }
  }
  // Spec line 421: "Addition to 100 — Parts 1-3, 2-digit + 1-digit".
  // Previously this generated 2-digit + 2-digit pairs, which is the next-level
  // skill (41-70). The `mixed2x1` flag routes through a 2+1-digit path.
  if (worksheet <= 40) {
    return { type: 'vertical_addition_2digit_no_carry', digits: 2, allowCarry: false, allowBorrow: false, mixed2x1: true }
  }
  if (worksheet <= 70) {
    return { type: 'vertical_addition_2digit_with_carry', digits: 2, allowCarry: true, allowBorrow: false }
  }
  if (worksheet <= 100) {
    return { type: 'vertical_addition_3digit', digits: 3, allowCarry: true, allowBorrow: false }
  }
  // Worksheets 101-110: Subtraction Review Part 1 (review early Level A: subtract 1-3 from numbers up to 10)
  if (worksheet <= 110) {
    return { type: 'subtraction_review', digits: 1, allowCarry: false, allowBorrow: false, maxMinuend: 10, maxSubtrahend: 3 }
  }
  // Worksheets 111-120: Subtraction Review Part 2 (review later Level A: subtract 1-5 from numbers up to 14)
  if (worksheet <= 120) {
    return { type: 'subtraction_review', digits: 1, allowCarry: false, allowBorrow: false, maxMinuend: 14, maxSubtrahend: 5 }
  }
  // Worksheets 121-150: 2-digit subtraction WITH borrowing (Parts 1-3 per spec).
  // Previously this range had allowBorrow:false, which silently skipped the
  // entire borrowing curriculum. Spec line 425.
  if (worksheet <= 150) {
    return { type: 'vertical_subtraction_2digit_with_borrow', digits: 2, allowCarry: false, allowBorrow: true }
  }
  // Worksheets 151-160: mixed add/subtract 2-digit (spec line 426).
  if (worksheet <= 160) {
    return { type: 'mixed_add_subtract_2digit', digits: 2, allowCarry: true, allowBorrow: true }
  }
  // Worksheets 161-200: 3-digit subtraction (Parts 1-4 per spec line 427).
  // Operand difficulty ramps via threeDigitPart: Part 1 single-borrow, Parts
  // 2-3 routine borrowing in narrower minuend ranges, Part 4 full-range borrow
  // including across-zero cases.
  if (worksheet <= 170) return { type: 'vertical_subtraction_3digit', digits: 3, allowCarry: false, allowBorrow: true, threeDigitPart: 1 }
  if (worksheet <= 180) return { type: 'vertical_subtraction_3digit', digits: 3, allowCarry: false, allowBorrow: true, threeDigitPart: 2 }
  if (worksheet <= 190) return { type: 'vertical_subtraction_3digit', digits: 3, allowCarry: false, allowBorrow: true, threeDigitPart: 3 }
  return { type: 'vertical_subtraction_3digit', digits: 3, allowCarry: false, allowBorrow: true, threeDigitPart: 4 }
}

function generateAdditionPair(digits: number, requireCarry: boolean, mixed2x1: boolean = false): [number, number] {
  // 2-digit + 1-digit path for worksheets 11-40 ("Addition to 100").
  if (mixed2x1) {
    const a = randomInt(11, 99)
    const maxB = requireCarry ? 9 : Math.min(9, 99 - a)
    if (maxB < 1) return [a, 1]
    let b = randomInt(1, maxB)
    if (requireCarry) {
      let attempts = 0
      while (!hasCarry(a, b) && attempts < 50) {
        b = randomInt(1, 9)
        attempts++
      }
    } else {
      let attempts = 0
      while (hasCarry(a, b) && attempts < 50) {
        b = randomInt(1, Math.min(9, 99 - a))
        if (99 - a < 1) break
        attempts++
      }
    }
    return [a, b]
  }

  const max = Math.pow(10, digits) - 1
  const min = digits === 1 ? 1 : Math.pow(10, digits - 1)

  let attempts = 0
  while (attempts < 100) {
    const a = randomInt(min, max)
    const b = randomInt(min, Math.min(max, max * 2 - a))
    
    if (requireCarry && !hasCarry(a, b)) {
      attempts++
      continue
    }
    if (!requireCarry && hasCarry(a, b)) {
      attempts++
      continue
    }
    
    return [a, b]
  }
  
  if (requireCarry) {
    const a = randomInt(Math.floor(max / 2), max)
    const b = randomInt(Math.floor(max / 2), max - a + Math.floor(max / 2))
    return [a, b]
  }
  
  return [randomInt(min, Math.floor(max / 2)), randomInt(min, Math.floor(max / 2))]
}

function generateSubtractionPair(
  digits: number,
  requireBorrow: boolean,
  maxMinuend?: number,
  maxSubtrahend?: number,
  threeDigitPart?: 1 | 2 | 3 | 4,
): [number, number] {
  // 1-digit subtraction review (Level B worksheets 101-120). The legacy
  // multi-digit path used `min + 10` for the minuend, which collapses to an
  // invalid range when digits=1 and produced near-identical problems on every
  // worksheet. Handle 1-digit explicitly with the per-part caps from the spec.
  if (digits === 1) {
    const subCap = maxSubtrahend ?? 5
    const minCap = maxMinuend ?? 10
    const subtrahend = randomInt(1, subCap)
    const minuend = randomInt(subtrahend + 1, minCap)
    return [minuend, subtrahend]
  }

  // 3-digit subtraction Parts 1-4 (Level B 161-200) — operand difficulty ramp.
  if (digits === 3 && requireBorrow && threeDigitPart) {
    // Part 1: minuend 100-499, single borrow likely (small subtrahend).
    // Part 2: minuend 200-699, larger subtrahend, routine borrow.
    // Part 3: minuend 300-899, full subtrahend range.
    // Part 4: minuend 100-999, including across-zero borrow scenarios.
    const ranges: Record<1 | 2 | 3 | 4, [number, number, number, number]> = {
      1: [100, 499, 50, 250],
      2: [200, 699, 100, 450],
      3: [300, 899, 150, 700],
      4: [100, 999, 50, 900],
    }
    const [minA, maxA, minB, maxB] = ranges[threeDigitPart]
    let attempts = 0
    while (attempts < 100) {
      const a = randomInt(minA, maxA)
      const b = randomInt(minB, Math.min(maxB, a - 1))
      if (b < 1) { attempts++; continue }
      if (hasBorrow(a, b)) return [a, b]
      attempts++
    }
    // Fallback: force a borrow construction within the part range.
    const a = randomInt(minA + 50, maxA)
    const b = randomInt(Math.max(minB, 1), Math.min(maxB, a - 1))
    return [a, b]
  }

  const max = Math.pow(10, digits) - 1
  const min = Math.pow(10, digits - 1)

  let attempts = 0
  while (attempts < 100) {
    const a = randomInt(min + 10, max)
    const b = randomInt(min, a - 1)

    if (requireBorrow && !hasBorrow(a, b)) {
      attempts++
      continue
    }
    if (!requireBorrow && hasBorrow(a, b)) {
      attempts++
      continue
    }

    return [a, b]
  }

  if (requireBorrow) {
    const onesA = randomInt(0, 4)
    const tensA = randomInt(3, 9)
    const onesB = randomInt(onesA + 1, 9)
    const tensB = randomInt(1, tensA - 1)
    return [tensA * 10 + onesA, tensB * 10 + onesB]
  }

  const a = randomInt(min + 10, max)
  const b = randomInt(min, Math.floor(a / 2))
  return [a, b]
}

function generateAdditionProblem(config: ReturnType<typeof getWorksheetConfig>): Problem {
  const [a, b] = generateAdditionPair(config.digits, config.allowCarry, config.mixed2x1)
  const sum = a + b
  
  const subtype: LevelBProblemType = 
    config.digits === 1 ? 'addition_review' :
    config.digits === 2 && !config.allowCarry ? 'vertical_addition_2digit_no_carry' :
    config.digits === 2 ? 'vertical_addition_2digit_with_carry' :
    'vertical_addition_3digit'
  
  const hints: string[] = []
  if (config.digits >= 2) {
    hints.push('Add the ones column first')
    if (config.allowCarry) {
      hints.push('If the ones add to 10 or more, carry 1 to the tens')
    }
    hints.push('Then add the tens column')
    if (config.digits === 3) {
      hints.push('Finally add the hundreds column')
    }
  }
  
  const isHorizontal = config.digits === 1

  return {
    id: generateId(),
    level: 'B',
    worksheetNumber: 1,
    type: 'addition',
    subtype,
    difficulty: config.allowCarry ? 2 : 1,
    displayFormat: isHorizontal ? 'horizontal' : 'vertical',
    question: isHorizontal ? `${a} + ${b} = ___` : '',
    correctAnswer: sum,
    operands: [a, b],
    hints,
    graduatedHints: generateAdditionHints([a, b], 'B'),
  }
}

function generateSubtractionProblem(config: ReturnType<typeof getWorksheetConfig>): Problem {
  const [a, b] = generateSubtractionPair(config.digits, config.allowBorrow, config.maxMinuend, config.maxSubtrahend, config.threeDigitPart)
  const difference = a - b
  
  const subtype: LevelBProblemType = 
    config.digits === 1 ? 'subtraction_review' :
    config.digits === 2 && !config.allowBorrow ? 'vertical_subtraction_2digit_no_borrow' :
    config.digits === 2 ? 'vertical_subtraction_2digit_with_borrow' :
    'vertical_subtraction_3digit'
  
  const hints: string[] = []
  if (config.digits >= 2) {
    hints.push('Subtract the ones column first')
    if (config.allowBorrow) {
      hints.push('If you cannot subtract, borrow 1 from the tens')
      hints.push('Remember: borrowing adds 10 to the ones column')
    }
    hints.push('Then subtract the tens column')
    if (config.digits === 3) {
      hints.push('Finally subtract the hundreds column')
    }
  }
  
  const isHorizontal = config.digits === 1

  return {
    id: generateId(),
    level: 'B',
    worksheetNumber: 1,
    type: 'subtraction',
    subtype,
    difficulty: config.allowBorrow ? 2 : 1,
    displayFormat: isHorizontal ? 'horizontal' : 'vertical',
    question: isHorizontal ? `${a} - ${b} = ___` : '',
    correctAnswer: difference,
    operands: [a, b],
    hints,
    graduatedHints: generateSubtractionHints([a, b], 'B'),
  }
}

function generateMixedProblem(config: ReturnType<typeof getWorksheetConfig>): Problem {
  if (Math.random() < 0.5) {
    return generateAdditionProblem({ ...config, type: 'vertical_addition_2digit_with_carry' })
  }
  return generateSubtractionProblem({ ...config, type: 'vertical_subtraction_2digit_with_borrow' })
}

export function generateBProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'addition_review':
    case 'vertical_addition_2digit_no_carry':
    case 'vertical_addition_2digit_with_carry':
    case 'vertical_addition_3digit':
      problem = generateAdditionProblem(config)
      break
    case 'subtraction_review':
    case 'vertical_subtraction_2digit_no_borrow':
    case 'vertical_subtraction_2digit_with_borrow':
    case 'vertical_subtraction_3digit':
      problem = generateSubtractionProblem(config)
      break
    case 'mixed_add_subtract_2digit':
      problem = generateMixedProblem(config)
      break
    default:
      problem = generateAdditionProblem(config)
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateBProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateBProblem(worksheet))
  }
  return problems
}

export function getBWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelBProblemType, string> = {
    'addition_review': 'Addition Review',
    'vertical_addition_2digit_no_carry': '2-Digit Addition (No Carrying)',
    'vertical_addition_2digit_with_carry': '2-Digit Addition (With Carrying)',
    'vertical_addition_3digit': '3-Digit Addition',
    'subtraction_review': 'Subtraction Review',
    'vertical_subtraction_2digit_no_borrow': '2-Digit Subtraction (No Borrowing)',
    'vertical_subtraction_2digit_with_borrow': '2-Digit Subtraction (With Borrowing)',
    'vertical_subtraction_3digit': '3-Digit Subtraction',
    'mixed_add_subtract_2digit': 'Mixed Addition & Subtraction',
  }
  
  return {
    level: 'B' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '6 min',
    problemTypes: [config.type],
  }
}
