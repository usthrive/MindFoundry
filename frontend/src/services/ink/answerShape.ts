/**
 * How many characters an answer could need, and which characters they could be.
 *
 * Both are derived from the SHAPE of the problem — the operation and the size of its
 * operands — and never from the answer itself. Sizing the writing strip to the actual
 * answer would quietly tell the child how many digits to expect, which is the same
 * leak the column grid avoids: every 2-digit x 1-digit problem gets the same number of
 * boxes whether the product is 24 or 891.
 */
import type { Problem } from '@/services/generators/types'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const digitsIn = (n: number) => String(Math.abs(Math.trunc(n))).length

/** Levels whose division answers may carry a remainder, written "13 R 1". */
function levelUsesRemainder(problem: Problem): boolean {
  if (problem.type !== 'division') return false
  if (problem.level === 'C') return (problem.worksheetNumber ?? 0) >= 111
  return problem.level === 'D'
}

/** Widest the answer could possibly be for a problem of this shape. */
export function cellCountForProblem(problem: Problem | null | undefined): number {
  if (!problem) return 4
  const operands = problem.operands ?? []
  if (operands.length < 2) return 5

  const digits = operands.map(digitsIn)
  let width: number
  switch (problem.type) {
    case 'multiplication':
      width = digits.reduce((a, b) => a + b, 0)
      break
    case 'addition':
      width = Math.max(...digits) + 1
      break
    case 'division':
      // Quotient is never wider than the dividend; a remainder adds " R n".
      width = digits[0] + (levelUsesRemainder(problem) ? 2 : 0)
      break
    default:
      width = Math.max(...digits)
  }
  // Never fewer than 2 boxes, never more than fits comfortably on a phone.
  return Math.min(7, Math.max(2, width))
}

/** Characters the strip should try to recognise for this problem. */
export function allowedCharsForProblem(problem: Problem | null | undefined): string[] {
  if (!problem) return DIGITS
  const chars = [...DIGITS]
  if (levelUsesRemainder(problem)) chars.push('R')
  // A subtraction that can go below zero, or any level that deals in negatives.
  if (['G', 'H', 'I', 'J', 'K'].includes(String(problem.level))) chars.push('-')
  return chars
}
