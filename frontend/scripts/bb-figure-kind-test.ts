/**
 * bb-figure-kind-test — the picture is the KIND of thing the words tell the child to look at.
 *
 * Run (from frontend/): npx tsx scripts/bb-figure-kind-test.ts
 *
 * WHY (2026-11-17). The owner's son, on Level B week 6 ("the balanced equal sign"),
 * was asked "The left pan of a balance holds 7, 4 and 5 walnuts. The right pan holds
 * 12 walnuts and one closed bag. The bar sits level…" under a BAR MODEL — boxes like
 * the ones used for tens and ones, one pan only. 16 of the week's 35 questions, the
 * lesson and the puzzle did this: there was no balance figure, so the week reached
 * for bars. A census of every week found the same class elsewhere: B7's covered-dish
 * balance drawn as a bar; B10's "ten-blocks, each worth ten" drawn as single small
 * squares (the glyph a ONE gets); B2's "6 rods and 2 cubes" drawn as a digit chart
 * that printed the answer. Every check passed — QG-13 proves a figure cannot
 * contradict the NUMBERS, and nothing asked whether it was the right THING.
 *
 * This gate asks it. On every surface of every week (practice, warm-up, check forms,
 * lesson script, guided examples, puzzle), when the words point at:
 *   - a pan balance                       → the picture must be a `balance`;
 *   - rods / cubes / ten-blocks / flats   → the picture must be `base-ten-blocks`;
 * or there is no picture at all (words alone are honest). And a balance may draw
 * its heaps as COUNTABLE dots only where the answer is already on the page (the
 * lesson script, the modeled and completion examples): anywhere a child is
 * answering, countable heaps on both pans turn the sum into a count (L33), so
 * there each heap is a fixed-size pile carrying its number. Known debt — weeks whose
 * balance needs a pan that holds a named object or weight (A20 stone, E13/E15 grams)
 * — is a RATCHET: its count may fall, never rise, and a new week may not join it.
 *
 * Every check runs on the real packs and on deliberately broken controls that must
 * be caught (a gate never seen to fail is unproven).
 */
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator/packGenerator'

const SEEDS = [12345, 777]

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => {
  checks++
  if (!ok) failures++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`)
}

interface Surface {
  cell: string
  where: string
  text: string
  /** A guided example's fade level (modeled | completion | prompted | independent). */
  stage?: string
  figure?: { type: string; alt?: string; countable?: boolean }
}

/** Every object in a pack that carries a figure, with the words beside it. */
function surfaces(cell: string, pack: unknown): Surface[] {
  const out: Surface[] = []
  const walk = (o: unknown, path: string) => {
    if (!o || typeof o !== 'object') return
    const rec = o as Record<string, unknown>
    const fig = rec.figure as { type?: string; alt?: string; params?: { countable?: boolean } } | undefined
    if (fig && typeof fig.type === 'string') {
      const words = ['prompt', 'say', 'visual', 'question', 'title']
        .map((k) => rec[k])
        .filter((v): v is string => typeof v === 'string')
        .join(' ')
      out.push({
        cell,
        where: path,
        text: words,
        ...(typeof rec.fadeLevel === 'string' ? { stage: rec.fadeLevel } : {}),
        figure: { type: fig.type, alt: fig.alt, countable: fig.params?.countable === true },
      })
    }
    for (const [k, v] of Object.entries(rec)) if (k !== 'figure') walk(v, `${path}.${k}`)
  }
  walk(pack, 'pack')
  return out
}

/** The words point at a pan balance (not "balances at nine", not "balance it out"). */
const BALANCE = /\b(pans? of a balance|(a|the|level|equal-arm) balance\b|balance scale|left pan|right pan|both pans|one pan|the other pan|the pans)\b/i
/** The words point at base-ten blocks. */
const BASE_TEN = /\b(ten-blocks?|rods? and (cubes|ones)|(\d+|one|two|three|four|five|six|seven|eight|nine) rods?\b|flats? of a hundred)\b/i

/**
 * `unless`: the words themselves name a different, deliberate picture. B3 compares
 * numbers by LENGTH — "One bar for 39: three long ten-blocks, then nine small single
 * blocks" — so the blocks are laid end to end as a bar, and the words say so. A
 * balance has no such exception: a balance is never a bar.
 */
const RULES: Array<{ name: string; re: RegExp; want: string; unless?: RegExp }> = [
  { name: 'balance', re: BALANCE, want: 'balance' },
  { name: 'base-ten', re: BASE_TEN, want: 'base-ten-blocks', unless: /\bbars?\b/i },
]

type Finding = { cell: string; rule: string; drawn: string; where: string; text: string }

function findings(all: Surface[]): Finding[] {
  const out: Finding[] = []
  for (const s of all) {
    if (!s.figure) continue
    for (const r of RULES) {
      if (r.re.test(s.text) && s.figure.type !== r.want && !(r.unless && r.unless.test(s.text))) {
        out.push({ cell: s.cell, rule: r.name, drawn: s.figure.type, where: s.where, text: s.text.slice(0, 110) })
      }
    }
  }
  return out
}

/**
 * Known debt (2026-11-17), per week, summed over SEEDS. These balances put a named
 * object or a weight on a pan (a stone, a balloon, "40 g", a sealed box), which the
 * `balance` figure cannot draw yet — the next change set extends it. Counts may FALL.
 */
const DEBT: Record<string, number> = {
  A20: 6, // "A stone sits on one pan. Blocks fill the other pan" — drawn as a row of blocks
  E13: 4, // "the left arm holds a sealed box and 40 g of weights" — drawn as bars
  E15: 2, // "two pans that are not level … a sealed box and thirty" — drawn as bars
}

/** Where the answer is already on the page: the lesson script, and the modeled / completion examples. */
const answerShown = (s: Surface): boolean =>
  s.where.includes('.explanation.') || (s.where.includes('.guidedExamples.') && (s.stage === 'modeled' || s.stage === 'completion'))

/** Balances that let the child count instead of add: countable heaps on a surface where the child answers. */
function countableWhereAnswering(all: Surface[]): Surface[] {
  return all.filter((s) => s.figure?.type === 'balance' && s.figure.countable && !answerShown(s))
}

// ---------------------------------------------------------------------------
console.log('\n# every week, every surface')
const all: Surface[] = []
for (const c of AVAILABLE_WEEKS) {
  for (const seed of SEEDS) {
    const cell = `${c.level}${c.week}`
    all.push(...surfaces(cell, generatePack(c.level, c.week as never, seed)))
  }
}
const found = findings(all)
const byCell: Record<string, Finding[]> = {}
for (const f of found) (byCell[f.cell] ??= []).push(f)
const ratchet = (counts: Record<string, Finding[]>, debt: Record<string, number>): string[] => {
  const out: string[] = []
  for (const [cell, fs] of Object.entries(counts)) {
    const allowed = debt[cell] ?? 0
    if (fs.length > allowed) out.push(`${cell}: ${fs.length} picture(s) of the wrong kind (allowed ${allowed}) — e.g. "${fs[0].text}" drawn as ${fs[0].drawn}`)
  }
  return out
}
const over = ratchet(byCell, DEBT)
say(all.length > 1000, `${all.length} surfaces with a picture, ${AVAILABLE_WEEKS.length} weeks × ${SEEDS.length} seeds`)
say(over.length === 0, `no picture of the wrong kind beyond the known debt${over.length ? ':\n       ' + over.join('\n       ') : ''}`)
for (const cell of ['B6', 'B7', 'B10', 'B2']) {
  say(!(byCell[cell]?.length), `${cell} — fixed 2026-11-17 — draws the thing its words name`)
}
const balances = all.filter((s) => s.figure?.type === 'balance' && s.cell === 'B6').length
say(balances >= 40, `B6 draws its balance stories as balances (${balances} surfaces over ${SEEDS.length} seeds)`)
const leaks = countableWhereAnswering(all)
say(leaks.length === 0, `no countable balance where the child answers${leaks.length ? ':\n       ' + leaks.slice(0, 3).map((l) => `${l.cell} ${l.where}`).join('\n       ') : ''}`)
const teachingDots = all.filter((s) => s.figure?.type === 'balance' && s.figure.countable).length
say(teachingDots > 0, `the lesson and worked examples still draw countable heaps (${teachingDots} surfaces)`)
const stale = Object.entries(DEBT).filter(([cell, n]) => (byCell[cell]?.length ?? 0) < n)
if (stale.length) console.log(`  note: debt has fallen — lower DEBT for ${stale.map(([c]) => c).join(', ')}`)

// ---------------------------------------------------------------------------
console.log('\n# controls (each must be caught)')
{
  const b6before: Surface = { cell: 'B6', where: 'control', text: 'The left pan of a balance holds three heaps: 7, 4 and 5 walnuts.', figure: { type: 'bar-model' } }
  say(findings([b6before]).length > 0, 'control fires: a balance question under a bar model (B6 before the fix)')
  const b10before: Surface = { cell: 'B10', where: 'control', text: 'Four ten-blocks here. Three more arrive.', figure: { type: 'counters' } }
  say(findings([b10before]).length > 0, 'control fires: ten-blocks drawn as single counters (B10 before the fix)')
  const b2before: Surface = { cell: 'B2', where: 'control', text: '[image: 6 rods and 2 cubes in labeled columns] Read the number.', figure: { type: 'place-value-chart' } }
  say(findings([b2before]).length > 0, 'control fires: rods and cubes drawn as a digit chart (B2 before the fix)')
  const plain: Surface = { cell: 'B6', where: 'control', text: 'The whole line balances at nine. What must the box bring?', figure: { type: 'bar-model' } }
  say(findings([plain]).length === 0, 'no false alarm: "the line balances at nine" is not a pan balance')
  const lengthModel: Surface = { cell: 'B3', where: 'control', text: 'Watch me build 39. Three ten-blocks, then nine single blocks. One bar for 39.', figure: { type: 'bar-model' } }
  say(findings([lengthModel]).length === 0, 'no false alarm: blocks the words lay out as ONE BAR (B3 length model)')
  const balanceAsBar: Surface = { cell: 'B6', where: 'control', text: 'A balance: three corks on the left pan, seven on the right, drawn as one bar.', figure: { type: 'bar-model' } }
  say(findings([balanceAsBar]).length > 0, 'control fires: a balance is never excused as a bar')
  const assessedDots: Surface = { cell: 'B6', where: 'pack.days.3.items.1', text: 'The left pan of a balance holds 7, 4 and 5 walnuts.', figure: { type: 'balance', countable: true } }
  say(countableWhereAnswering([assessedDots]).length > 0, 'control fires: countable heaps on a page the child answers')
  const promptedDots: Surface = { cell: 'B6', where: 'pack.guidedExamples.2', stage: 'prompted', text: 'A balance is level.', figure: { type: 'balance', countable: true } }
  say(countableWhereAnswering([promptedDots]).length > 0, 'control fires: countable heaps on a PROMPTED example (the child answers it)')
  const scriptDots: Surface = { cell: 'B6', where: 'pack.explanation.script.0', text: 'Watch me load this scale.', figure: { type: 'balance', countable: true } }
  say(countableWhereAnswering([scriptDots]).length === 0, 'no false alarm: countable heaps in the lesson script')
  const rising = { ...byCell, X1: [found[0] ?? { cell: 'X1', rule: 'balance', drawn: 'bar-model', where: 'control', text: 'x' }] }
  say(ratchet(rising as Record<string, Finding[]>, DEBT).length > 0, 'control fires: a NEW week joining the debt')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
