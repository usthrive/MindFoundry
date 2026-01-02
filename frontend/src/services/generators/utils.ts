import type { Fraction, KumonLevel, Problem, ProblemSubtype, ProblemFormat } from './types'
import { LEVEL_ORDER } from './types'

let idCounter = 0

export function generateId(): string {
  idCounter++
  return `prob_${Date.now()}_${idCounter}_${Math.random().toString(36).substring(2, 9)}`
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

export function simplifyFraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) throw new Error('Denominator cannot be zero')
  const divisor = gcd(numerator, denominator)
  let num = numerator / divisor
  let den = denominator / divisor
  if (den < 0) {
    num = -num
    den = -den
  }
  return { numerator: num, denominator: den }
}

export function fractionToString(f: Fraction): string {
  if (f.denominator === 1) return `${f.numerator}`
  return `${f.numerator}/${f.denominator}`
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator)
  const newNum = (a.numerator * (commonDenom / a.denominator)) + (b.numerator * (commonDenom / b.denominator))
  return simplifyFraction(newNum, commonDenom)
}

export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator)
  const newNum = (a.numerator * (commonDenom / a.denominator)) - (b.numerator * (commonDenom / b.denominator))
  return simplifyFraction(newNum, commonDenom)
}

export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction(a.numerator * b.numerator, a.denominator * b.denominator)
}

export function divideFractions(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) throw new Error('Cannot divide by zero')
  return simplifyFraction(a.numerator * b.denominator, a.denominator * b.numerator)
}

export function calculateDifficulty(
  level: KumonLevel,
  worksheetNumber: number,
  operands?: number[]
): number {
  const levelIndex = LEVEL_ORDER.indexOf(level)
  const baseDifficulty = Math.min(Math.floor(levelIndex / 3) + 1, 10)
  const worksheetFactor = Math.min(Math.floor(worksheetNumber / 50), 3)
  let operandFactor = 0
  if (operands && operands.length > 0) {
    const maxOperand = Math.max(...operands.map(Math.abs))
    if (maxOperand > 1000) operandFactor = 3
    else if (maxOperand > 100) operandFactor = 2
    else if (maxOperand > 10) operandFactor = 1
  }
  return Math.min(baseDifficulty + worksheetFactor + operandFactor, 10)
}

export function hasCarry(a: number, b: number): boolean {
  while (a > 0 || b > 0) {
    if ((a % 10) + (b % 10) >= 10) return true
    a = Math.floor(a / 10)
    b = Math.floor(b / 10)
  }
  return false
}

export function hasBorrow(a: number, b: number): boolean {
  while (a > 0 || b > 0) {
    if ((a % 10) < (b % 10)) return true
    a = Math.floor(a / 10)
    b = Math.floor(b / 10)
  }
  return false
}

export function generateAdditionNoCarry(max1: number, max2: number): [number, number] {
  let a: number, b: number
  let attempts = 0
  do {
    a = randomInt(1, max1)
    b = randomInt(1, max2)
    attempts++
    if (attempts > 100) break
  } while (hasCarry(a, b))
  return [a, b]
}

export function generateSubtractionNoBorrow(minuend: number, maxSubtrahend: number): [number, number] {
  let a: number, b: number
  let attempts = 0
  do {
    a = minuend
    b = randomInt(1, Math.min(maxSubtrahend, a))
    attempts++
    if (attempts > 100) break
  } while (hasBorrow(a, b))
  return [a, b]
}

export function formatHorizontalAddition(a: number, b: number): string {
  return `${a} + ${b} = ___`
}

export function formatHorizontalSubtraction(a: number, b: number): string {
  return `${a} - ${b} = ___`
}

export function formatHorizontalMultiplication(a: number, b: number): string {
  return `${a} × ${b} = ___`
}

export function formatHorizontalDivision(a: number, b: number): string {
  return `${a} ÷ ${b} = ___`
}

export function formatVerticalAddition(a: number, b: number): string {
  const maxLen = Math.max(a.toString().length, b.toString().length)
  return `  ${a.toString().padStart(maxLen)}\n+ ${b.toString().padStart(maxLen)}\n${'─'.repeat(maxLen + 2)}\n  ${'_'.repeat(maxLen)}`
}

export function formatVerticalSubtraction(a: number, b: number): string {
  const maxLen = Math.max(a.toString().length, b.toString().length)
  return `  ${a.toString().padStart(maxLen)}\n- ${b.toString().padStart(maxLen)}\n${'─'.repeat(maxLen + 2)}\n  ${'_'.repeat(maxLen)}`
}

export function formatVerticalMultiplication(a: number, b: number): string {
  const maxLen = Math.max(a.toString().length, b.toString().length)
  return `  ${a.toString().padStart(maxLen)}\n× ${b.toString().padStart(maxLen)}\n${'─'.repeat(maxLen + 2)}\n  ${'_'.repeat(maxLen + 2)}`
}

export function formatSequence(numbers: (number | null)[], missingIndex: number): string {
  return numbers.map((n, i) => i === missingIndex ? '___' : n).join(', ')
}

export function createProblem(
  level: KumonLevel,
  worksheetNumber: number,
  type: string,
  subtype: ProblemSubtype,
  question: string,
  correctAnswer: number | string | Fraction,
  options: {
    operands?: number[]
    displayFormat?: ProblemFormat
    missingPosition?: number
    hints?: string[]
    solutionSteps?: string[]
    timeLimit?: number
    visualAssets?: string[]
  } = {}
): Problem {
  return {
    id: generateId(),
    level,
    worksheetNumber,
    type,
    subtype,
    difficulty: calculateDifficulty(level, worksheetNumber, options.operands),
    displayFormat: options.displayFormat || 'horizontal',
    question,
    operands: options.operands,
    correctAnswer,
    missingPosition: options.missingPosition,
    hints: options.hints,
    solutionSteps: options.solutionSteps,
    timeLimit: options.timeLimit,
    visualAssets: options.visualAssets
  }
}

export function getLevelIndex(level: KumonLevel): number {
  return LEVEL_ORDER.indexOf(level)
}

export function compareLevels(a: KumonLevel, b: KumonLevel): number {
  return getLevelIndex(a) - getLevelIndex(b)
}

export function isLevelBefore(level: KumonLevel, reference: KumonLevel): boolean {
  return getLevelIndex(level) < getLevelIndex(reference)
}

export function isLevelAfter(level: KumonLevel, reference: KumonLevel): boolean {
  return getLevelIndex(level) > getLevelIndex(reference)
}

export function primeFactors(n: number): number[] {
  const factors: number[] = []
  let divisor = 2
  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor)
      n = n / divisor
    } else {
      divisor++
    }
  }
  return factors
}

export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

export function factorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = []
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      pairs.push([i, n / i])
    }
  }
  return pairs
}

export function roundToDecimalPlaces(num: number, places: number): number {
  const factor = Math.pow(10, places)
  return Math.round(num * factor) / factor
}

export function formatDecimal(num: number, places: number = 2): string {
  return num.toFixed(places)
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

export function formatPolynomial(coefficients: number[], variable: string = 'x'): string {
  const terms: string[] = []
  for (let i = coefficients.length - 1; i >= 0; i--) {
    const coef = coefficients[coefficients.length - 1 - i]
    if (coef === 0) continue
    let term = ''
    if (i === 0) {
      term = `${Math.abs(coef)}`
    } else if (i === 1) {
      term = Math.abs(coef) === 1 ? variable : `${Math.abs(coef)}${variable}`
    } else {
      term = Math.abs(coef) === 1 ? `${variable}^${i}` : `${Math.abs(coef)}${variable}^${i}`
    }
    if (terms.length === 0) {
      terms.push(coef < 0 ? `-${term}` : term)
    } else {
      terms.push(coef < 0 ? ` - ${term}` : ` + ${term}`)
    }
  }
  return terms.length > 0 ? terms.join('') : '0'
}

export function evaluatePolynomial(coefficients: number[], x: number): number {
  let result = 0
  for (let i = 0; i < coefficients.length; i++) {
    result += coefficients[i] * Math.pow(x, coefficients.length - 1 - i)
  }
  return result
}
