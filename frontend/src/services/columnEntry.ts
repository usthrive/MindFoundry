/**
 * columnEntry — how a child types a one-row stacked answer (a sum, or a number
 * times ONE digit): one digit per box from the ones, and the LAST step written
 * as a whole number, the way it is said.
 *
 * WHY (owner, 2026-11-19). On 47 × 6 the last step is 4 × 6 + 4 = 28. On paper a
 * child writes "28" at the left, 2 then 8. The worksheet made him type it as two
 * separate boxes, 8 first and then 2: right to left inside one number. That is the
 * order a 7-year-old gets backwards. (His records already held "69" for 96 and
 * "54" for 45: digits typed the way they are said, landing in right-to-left boxes.)
 * Addition did this from April (the last column took "12" for 55 + 67) until the
 * July place-value fix made every column one digit; this brings it back for both,
 * keeping one digit per box on screen: "2" shows in the tens box, then "8" moves
 * it into the hundreds box and takes the tens. Place value still reads right.
 *
 * The last step is the column of the top number's leftmost digit. Its total can
 * need two boxes, that column and the "only if needed" one to its left; nothing
 * else ever does. Which problems have one follows the problem's SHAPE (the same
 * rule as getAnswerColumnCount), never its answer, so nothing here gives away
 * whether the answer has the extra digit.
 *
 * Pure, so scripts/kumon-last-step-entry-test.ts can drive every shape.
 */
import type { Problem } from './generators/types'

type Shape = Pick<Problem, 'type' | 'displayFormat' | 'operands'>

const width = (n: number) => String(Math.abs(n)).length

/**
 * The column where the last step's whole number starts (its ones digit); the
 * number may also fill the column to its left. Undefined when the problem has no
 * such step (subtraction never grows; a 2-digit multiplier writes partial rows).
 *
 *   addition                 widest addend − 1   (the answer has widest + 1 boxes)
 *   multiplication by 1 digit  top number − 1    (the answer has top + 1 boxes)
 */
export function getLastStepColumn(p: Shape): number | undefined {
  if (p.displayFormat !== 'vertical' || !p.operands || p.operands.length < 2) return undefined
  if (!p.operands.every((op) => Number.isInteger(op) && op >= 0)) return undefined
  const widths = p.operands.map(width)
  if (p.type === 'addition') return Math.max(...widths) - 1
  if (p.type === 'multiplication' && p.operands.length === 2 && widths[1] === 1) return widths[0] - 1
  return undefined
}

/** The last step's number as it was typed, left to right ("28"), read from its two boxes. */
export function readLastStep(columns: (string | null)[], last: number): string {
  return (columns[last + 1] ?? '') + (columns[last] ?? '')
}

/** Puts a typed number back in its boxes, right-aligned: its ones digit in the last-step column. */
export function writeLastStep(columns: (string | null)[], last: number, typed: string): (string | null)[] {
  const out = [...columns]
  out[last] = typed.length >= 1 ? typed[typed.length - 1] : null
  out[last + 1] = typed.length >= 2 ? typed[typed.length - 2] : null
  return out
}

/** The cursor never sits in the "only if needed" box: that box belongs to the last step. */
export function normalizeActiveColumn(col: number, last: number | undefined): number {
  return last !== undefined && col > last ? last : col
}

export interface ColumnEntryState {
  columns: (string | null)[]
  active: number
}

/**
 * One key on a one-row stacked answer. Before the last step: one digit per box,
 * and the cursor moves left. On the last step: up to two digits, typed the way the
 * number is said; a third is ignored (the step is full; ⌫ takes the last digit
 * off). With no last step (subtraction), every box takes one digit, as before.
 */
export function enterColumnKey(
  state: ColumnEntryState,
  key: string,
  last: number | undefined,
): ColumnEntryState {
  let columns = [...state.columns]
  let active = normalizeActiveColumn(state.active, last)
  const count = columns.length
  const onLastStep = last !== undefined && active >= last

  if (key === 'backspace') {
    if (onLastStep && last !== undefined) {
      const typed = readLastStep(columns, last)
      if (typed.length > 0) return { columns: writeLastStep(columns, last, typed.slice(0, -1)), active: last }
      if (last > 0) {
        columns[last - 1] = null
        return { columns, active: last - 1 }
      }
      return { columns, active: last }
    }
    if (columns[active] !== null) {
      columns[active] = null
    } else if (active > 0) {
      active -= 1
      columns[active] = null
    }
    return { columns, active }
  }

  if (!/^\d$/.test(key)) return { columns, active }

  if (onLastStep && last !== undefined) {
    const typed = readLastStep(columns, last)
    if (typed.length >= 2) return { columns, active: last }
    columns = writeLastStep(columns, last, typed + key)
    return { columns, active: last }
  }

  columns[active] = key
  if (active < count - 1) active += 1
  return { columns, active }
}

/** The answer the boxes read, left to right, as the worksheet composes it. */
export function composeColumnAnswer(columns: (string | null)[]): string {
  return columns.slice().reverse().map((d) => d ?? '').join('').replace(/^0+(?=\d)/, '')
}

/** Types a whole sequence of keys into empty boxes, the way a child would. */
export function typeKeys(problem: Shape, columnCount: number, keys: string[]): string {
  const last = getLastStepColumn(problem)
  let state: ColumnEntryState = { columns: new Array(columnCount).fill(null), active: 0 }
  for (const k of keys) state = enterColumnKey(state, k, last)
  return composeColumnAnswer(state.columns)
}

/**
 * Which order a wrong answer was typed in, when the digits are all right:
 *   'from-left'  the whole answer typed the way it is said (the boxes start at the ones);
 *   'last-step'  the last step's number typed ones first (the old habit: 8, then 2, for 28).
 * Found by typing the right answer both ways through the real entry rule, so it
 * can never disagree with what the boxes do.
 */
export function diagnoseEntryOrder(
  problem: Shape,
  columnCount: number,
  answer: string,
  correct: number,
): 'from-left' | 'last-step' | null {
  const want = String(Math.abs(correct))
  const got = answer.trim()
  if (got === '' || got === want || want.length < 2) return null
  const digits = want.split('')
  // The old habit first: when the answer reads the same both ways (171 for 19 × 9),
  // ones-first typing is the habit he is known to have.
  if (got === typeKeys(problem, columnCount, [...digits].reverse())) return 'last-step'
  if (got === typeKeys(problem, columnCount, digits)) return 'from-left'
  return null
}

export const LAST_STEP_NOTE =
  'In the big box, type the number the way you say it: the first digit you say goes first.'
