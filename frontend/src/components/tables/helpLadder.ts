/**
 * helpLadder — the progression of help for a times-table fact, from thinking to
 * the answer. Pure content; the card that shows it is HelpLadder.tsx.
 *
 * WHY (owner, 2026-09-26): "I like the table. It should just not be the only
 * option. There should be a progression of hints / help that helps him learn."
 * The owner's son reached Kumon Level C sheet 50 largely by reading the table:
 * it was the only help there was, so a stuck child went straight to the answer.
 * A tutor gives the least help that gets the child moving, one step at a time:
 *
 *   1  Think        what the fact MEANS          "6 × 7 means 6 groups of 7."
 *   2  Use a fact   derive it from a known fact  "5 × 7 = 35. Add one more 7."
 *   3  Count it     a way to finish by himself   "Count by 7s: 7, 14, 21… Count 6 numbers."
 *   4  The table    the answer, when truly needed (TimesTableCard, unchanged)
 *
 * Rung 2 is the heart of it: using a fact you know to find one you don't is the
 * critical-thinking move in arithmetic, and it is how strong students actually
 * know their tables. Anchors are ×1, ×2, ×5, ×10; every other fact has a route.
 *
 * LAW: no rung below the table states the answer (a fact whose answer IS one of
 * its own numbers, like 1 × 7, is exempt — it cannot be avoided). The gate
 * `scripts/kumon-help-ladder-test.ts` checks every fact up to 12 × 12, and also
 * that every "a × b = c" the ladder prints is true.
 */

export type HelpRung = 1 | 2 | 3

export interface LadderFact {
  /** The fact exactly as asked, left operand first. */
  a: number
  b: number
}

export interface HelpLadderContent {
  /** Groups × size used for the explanation (may be the turn-around of the asked fact). */
  groups: number
  size: number
  think: string
  route: string
  count: string
}

/**
 * Which operand reads most easily as "the number of groups": the one with the
 * simplest route. Anchors first (a rule, not a calculation), then routes that
 * lean on one anchor, then routes that lean on two.
 */
const GROUP_PRIORITY = [1, 10, 2, 5, 3, 9, 4, 6, 11, 8, 12, 7] as const

function rank(n: number): number {
  const i = (GROUP_PRIORITY as readonly number[]).indexOf(n)
  return i === -1 ? 99 : i
}

const plural = (s: number) => `${s}s`

/** The route for `groups` groups of `size`, built only from facts easier than the one asked. */
function routeFor(groups: number, size: number): string {
  switch (groups) {
    case 0:
      return `Zero groups of anything is nothing at all.`
    case 1:
      return `Any number times 1 stays the same.`
    case 2:
      return `Double it: ${size} + ${size}.`
    case 3:
      return `2 × ${size} = ${2 * size}. Add one more ${size}.`
    case 4:
      return `Double ${size} is ${2 * size}. Now double that.`
    case 5:
      return `10 × ${size} = ${10 * size}. Five groups is half of that.`
    case 6:
      return `5 × ${size} = ${5 * size}. Add one more ${size}.`
    case 7:
      return `5 × ${size} = ${5 * size} and 2 × ${size} = ${2 * size}. Put them together.`
    case 8:
      return `4 × ${size} = ${4 * size}. Now double that.`
    case 9:
      return `10 × ${size} = ${10 * size}. Take away one ${size}.`
    case 10:
      return `Ten groups: put a 0 on the end of ${size}.`
    case 11:
      return `10 × ${size} = ${10 * size}. Add one more ${size}.`
    case 12:
      return `10 × ${size} = ${10 * size} and 2 × ${size} = ${2 * size}. Put them together.`
    default:
      return `Break ${groups} into 10 and ${groups - 10}, then put the two parts together.`
  }
}

/** Counting by `size`, stopping BEFORE the answer: at most three terms, never the last. */
function countFor(groups: number, size: number): string {
  if (groups <= 1) return `Count by ${plural(size)}: just one ${size}.`
  const shown = Math.min(groups - 1, 3)
  const terms = Array.from({ length: shown }, (_, i) => (i + 1) * size)
  return `Count by ${plural(size)}: ${terms.join(', ')}… Count ${groups} numbers.`
}

export function helpLadderFor(fact: LadderFact): HelpLadderContent {
  const { a, b } = fact
  // The operand with the easier route becomes "groups"; ties keep the asked order.
  const aGroups = rank(a) <= rank(b)
  const groups = aGroups ? a : b
  const size = aGroups ? b : a
  const think = aGroups
    ? `${a} × ${b} means ${a} groups of ${b}.`
    : `${a} × ${b} is the same as ${b} × ${a}: ${b} groups of ${a}.`
  return { groups, size, think, route: routeFor(groups, size), count: countFor(groups, size) }
}

/** The text of rung 1..3, in order (the table is rung 4 and is not text). */
export function rungText(content: HelpLadderContent, rung: HelpRung): string {
  return rung === 1 ? content.think : rung === 2 ? content.route : content.count
}

/** What each rung is called on its button. */
export const RUNG_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Think about it',
  2: 'Use a fact I know',
  3: 'Count it',
  4: 'Show me the table',
}
