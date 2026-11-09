/**
 * stackedMultiplication — the column method for a multi-digit number times ONE
 * digit, step by step: the worked example, the guided "your turn", and the hints
 * a child gets after a miss (Kumon Level C, sheets C51–C110).
 *
 * WHY (owner, 2026-11-09). The stacked sheets start at C51. The app's only
 * teaching for them was an array animation ("break apart: 23 × 4 = (20 × 4) +
 * (3 × 4)") and, after a miss, times-table help ("how many groups of 5? can you add
 * them up?", a 28-row array, repeated addition). Nothing ever showed the method the
 * sheet asks for: start with the ones, multiply, write the ones digit, carry the
 * tens, ADD the carry after the next multiplication. The owner's son's misses on
 * C51–C55 were almost all that last step: 17 × 9 → "163" (he copied the carried 6
 * instead of adding it), 18 × 8 → "164", 19 × 9 → "181"; and 20 × 5 → "105"
 * (0 × 5 written as 5).
 *
 * Pure: every frame, prompt and sentence is computed from the problem, so the
 * gate (scripts/kumon-stacked-multiplication-test.ts) can check all of them for
 * every multiplicand 10–999 and multiplier 2–9.
 *
 * Columns are numbered as the worksheet numbers them: 0 = ones, 1 = tens, …
 */

export const PLACE_NAMES = ['ones', 'tens', 'hundreds', 'thousands'] as const

const digitAt = (n: number, place: number) => Math.floor(Math.abs(n) / 10 ** place) % 10
const width = (n: number) => String(Math.abs(n)).length

export interface ColumnStep {
  /** The place being worked: 0 = ones. */
  col: number
  /** The top number's digit in this place. */
  digit: number
  multiplier: number
  /** digit × multiplier */
  product: number
  /** Carried in from the column to the right (0 if none). */
  carryIn: number
  /** product + carryIn */
  total: number
  /** The leftmost column writes its whole total; every other writes the ones digit of it. */
  last: boolean
  /** Carried to the next column (0 if none, and always 0 on the last column). */
  carryOut: number
}

/** One step per digit of the top number, right to left. */
export function columnSteps(a: number, b: number): ColumnStep[] {
  const steps: ColumnStep[] = []
  let carry = 0
  const n = width(a)
  for (let col = 0; col < n; col++) {
    const digit = digitAt(a, col)
    const product = digit * b
    const total = product + carry
    const last = col === n - 1
    const carryOut = last ? 0 : Math.floor(total / 10)
    steps.push({ col, digit, multiplier: b, product, carryIn: carry, total, last, carryOut })
    carry = carryOut
  }
  return steps
}

/** What the worked example shows at one moment. */
export interface StackedFrame {
  /** Answer digits written so far, per column (index 0 = ones); null = still empty. */
  written: (string | null)[]
  /** Carries shown above the top number, per column. */
  carries: (string | null)[]
  /** The column being worked (highlighted), or null. */
  focus: number | null
  /** What the teacher says. */
  say: string
}

/** Answer columns the worksheet gives a 1-digit multiplier: one more than the top number. */
export function answerColumns(a: number): number {
  return width(a) + 1
}

function stepSentence(s: ColumnStep): string {
  const place = PLACE_NAMES[s.col]
  const next = PLACE_NAMES[s.col + 1]
  const head = `${cap(place)}: ${s.multiplier} × ${s.digit} = ${s.product}.`
  const add = s.carryIn > 0 ? ` Add the ${s.carryIn} you carried: ${s.product} + ${s.carryIn} = ${s.total}.` : ''
  if (!s.last) {
    const write = s.total >= 10
      ? ` Write the ${s.total % 10} in the ${place} box. Carry the ${Math.floor(s.total / 10)} to the ${next}.`
      : ` Write the ${s.total} in the ${place} box.`
    return head + add + write
  }
  if (s.total >= 10) {
    return `${head}${add} Write ${s.total}: the ${s.total % 10} in the ${place} box and the ${Math.floor(s.total / 10)} in the ${next} box.`
  }
  return `${head}${add} Write the ${s.total} in the ${place} box. No carry left, so the ${next} box stays empty.`
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

/**
 * The worked example, frame by frame: the problem, one frame per column, then the
 * answer read out. Frame k shows everything written by the steps before it.
 */
export function stackedFrames(a: number, b: number): StackedFrame[] {
  const cols = answerColumns(a)
  const empty = () => new Array<string | null>(cols).fill(null)
  const frames: StackedFrame[] = [
    { written: empty(), carries: empty(), focus: 0, say: `${a} × ${b}. Start with the ones, on the right.` },
  ]
  const written = empty()
  const carries = empty()
  for (const s of columnSteps(a, b)) {
    if (s.last) {
      written[s.col] = String(s.total % 10)
      if (s.total >= 10) written[s.col + 1] = String(Math.floor(s.total / 10))
    } else {
      written[s.col] = String(s.total % 10)
      if (s.carryOut > 0) carries[s.col + 1] = String(s.carryOut)
    }
    frames.push({ written: [...written], carries: [...carries], focus: s.col, say: stepSentence(s) })
  }
  frames.push({ written: [...written], carries: [...carries], focus: null, say: `${a} × ${b} = ${a * b}.` })
  return frames
}

/**
 * The visual hint on the child's OWN problem: the problem and where to start —
 * never the answer, and never the first product (that is his to work out).
 */
export function setupSentence(a: number, b: number): string {
  return `Start with the ones, on the right: what is ${b} × ${digitAt(a, 0)}? Write the ones digit of it in the ones box, and carry the tens.`
}

/** One thing the child works out in the guided "your turn". */
export interface GuidedPrompt {
  col: number
  kind: 'multiply' | 'add-carry'
  ask: string
  expect: number
  /** After a miss: a step toward it, never the number itself. */
  nudge: string
}

/** Per column: multiply; then, when something was carried in, add the carry — the step he skips. */
export function guidedPrompts(a: number, b: number): GuidedPrompt[] {
  const out: GuidedPrompt[] = []
  for (const s of columnSteps(a, b)) {
    const place = PLACE_NAMES[s.col]
    out.push({
      col: s.col,
      kind: 'multiply',
      ask: `${cap(place)}: what is ${b} × ${s.digit}?`,
      expect: s.product,
      nudge: s.digit === 0
        ? `Any number times 0 is 0.`
        : `Count by ${b}s, ${s.digit} ${s.digit === 1 ? 'time' : 'times'}.`,
    })
    if (s.carryIn > 0) {
      out.push({
        col: s.col,
        kind: 'add-carry',
        ask: `Now add the ${s.carryIn} you carried: ${s.product} + ${s.carryIn} = ?`,
        expect: s.total,
        nudge: `Start at ${s.product} and count on ${s.carryIn}.`,
      })
    }
  }
  return out
}

/**
 * A digit-reversed answer: the right digits written from the left. The worksheet
 * fills its boxes from the ones place, so a child who types "9", "6" for 96 sees
 * "69" (the owner's son: 16 × 6 → "69", 15 × 3 → "54"). Leading zeros are dropped
 * the way the worksheet drops them (140 typed 1, 4, 0 reads "41").
 */
export function isReversedAnswer(answer: string, correct: number): boolean {
  const want = String(Math.abs(correct))
  if (want.length < 2) return false
  const reversed = want.split('').reverse().join('').replace(/^0+(?=\d)/, '')
  const got = answer.trim()
  return got !== want && got === reversed
}

export const REVERSED_NOTE =
  'You wrote it from the left. Stacked problems start with the ones box on the right, then the tens.'
