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
  figure?: { type: string; alt?: string; countable?: boolean; icons?: string[]; ray?: boolean }
}

/** Every object in a pack that carries a figure, with the words beside it. */
function surfaces(cell: string, pack: unknown): Surface[] {
  const out: Surface[] = []
  const walk = (o: unknown, path: string) => {
    if (!o || typeof o !== 'object') return
    const rec = o as Record<string, unknown>
    const fig = rec.figure as
      | { type?: string; alt?: string; params?: { countable?: boolean; groups?: Array<{ icon?: string }>; ray?: unknown } }
      | undefined
    const words = ['prompt', 'say', 'visual', 'question', 'title']
      .map((k) => rec[k])
      .filter((v): v is string => typeof v === 'string')
      .join(' ')
    if (fig && typeof fig.type === 'string') {
      out.push({
        cell,
        where: path,
        text: words,
        ...(typeof rec.fadeLevel === 'string' ? { stage: rec.fadeLevel } : {}),
        figure: {
          type: fig.type,
          alt: fig.alt,
          countable: fig.params?.countable === true,
          icons: (fig.params?.groups ?? []).map((g) => g.icon ?? 'dot'),
          ray: !!fig.params?.ray,
        },
      })
    } else if (typeof rec.prompt === 'string' || typeof rec.say === 'string') {
      // A surface with NO picture: honest unless its words point at one (MISSING rules).
      out.push({ cell, where: path, text: words, ...(typeof rec.fadeLevel === 'string' ? { stage: rec.fadeLevel } : {}) })
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

type Fig = NonNullable<Surface['figure']>
type Rule = {
  name: string
  re: RegExp
  /** The picture is the right kind. */
  ok: (f: Fig) => boolean
  /** The words themselves name a different, deliberate picture (or forbid one). */
  unless?: RegExp
  /** With no picture at all, the words still point at one that is not there. */
  needsFigure?: boolean
}
const is = (type: string) => (f: Fig) => f.type === type

/**
 * `unless`: B3 compares numbers by LENGTH — "One bar for 39: three long ten-blocks,
 * then nine small single blocks" — so its blocks are laid end to end as a bar, and
 * the words say so. A balance has no such exception: a balance is never a bar.
 * A pictograph that is BEING BUILT ("is being drawn", "has to show", "should …
 * show") is never drawn: its rows are the answer, so whatever stands in (the key's
 * one strip) is excused.
 */
const RULES: Rule[] = [
  { name: 'balance', re: BALANCE, ok: is('balance') },
  { name: 'base-ten', re: BASE_TEN, ok: is('base-ten-blocks'), unless: /\bbars?\b/i },
  // 2026-11-17, change set 2 — each from the census, each fixed in its week.
  { name: 'tally', re: /\btally (gate|gates|marks?)\b|\btallies\b/i, ok: is('tally') },
  { name: 'pictograph', re: /\bpictograph\b/i, ok: is('pictograph'), unless: /\bbeing drawn\b|\bhas to show\b|\bshould\b[^.?]{0,40}\bshow\b/i },
  { name: 'round whole', re: /\b(pizza|cake)\b[^.]*\bcut\b|\bcuts? (a|the|one) (pizza|cake)\b/i, ok: is('fraction-circle') },
  { name: 'number track', re: /\b(number|hopscotch) track\b/i, ok: is('number-track') },
  { name: 'line plot', re: /\bline plot\b/i, ok: is('line-plot'), unless: /\bdraw a line plot\b/i },
  { name: 'shaded ray', re: /\bshade(d)? (everything|the line|from there)\b|\bline shaded from\b/i, ok: (f) => f.type === 'number-line' && !!f.ray },
  { name: 'wheels and legs', re: /\b(wheels?|legs?)\b/i, ok: (f) => f.type !== 'counters' || !(f.icons ?? []).includes('ball') },
  { name: 'bars on the page', re: /\bthese bars\b|\bis drawn as a display\b/i, ok: is('bar-model'), needsFigure: true },
]

type Finding = { cell: string; rule: string; drawn: string; where: string; text: string }

function findings(all: Surface[]): Finding[] {
  const out: Finding[] = []
  for (const s of all) {
    for (const r of RULES) {
      if (!r.re.test(s.text) || (r.unless && r.unless.test(s.text))) continue
      const wrong = s.figure ? !r.ok(s.figure) : !!r.needsFigure
      if (wrong) out.push({ cell: s.cell, rule: r.name, drawn: s.figure?.type ?? 'nothing', where: s.where, text: s.text.slice(0, 110) })
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
  // Empty since change set 2 (2026-11-17): A20 (stone, balloon), E13 (sealed box,
  // tins, grams) and E15 (box and thirty) draw balances with objects and weights.
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
const pictured = all.filter((x) => x.figure).length
say(pictured > 1000, `${pictured} surfaces with a picture and ${all.length - pictured} without, ${AVAILABLE_WEEKS.length} weeks × ${SEEDS.length} seeds`)
say(over.length === 0, `no picture of the wrong kind beyond the known debt${over.length ? ':\n       ' + over.join('\n       ') : ''}`)
for (const cell of ['B6', 'B7', 'B10', 'B2', 'A20', 'E13', 'E15', 'C7', 'C8', 'C15', 'C23', 'B4', 'B23', 'E22']) {
  say(!(byCell[cell]?.length), `${cell} — fixed 2026-11-17 — draws the thing its words name`)
}
const kinds = (cell: string, type: string) => all.filter((x) => x.cell === cell && x.figure?.type === type).length
say(kinds('C23', 'pictograph') >= 6, `C23 reads its pictographs off a pictograph (${kinds('C23', 'pictograph')} surfaces)`)
say(kinds('B23', 'line-plot') >= 4, `B23 draws its line plots (${kinds('B23', 'line-plot')} surfaces)`)
say(kinds('B4', 'number-track') >= 10, `B4 draws its track as squares (${kinds('B4', 'number-track')} surfaces)`)
say(['A20', 'E13', 'E15'].every((c) => kinds(c, 'balance') > 0), 'A20, E13 and E15 draw their balances as balances')
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
  // Change set 2 controls — each new rule must fire on the picture it replaced.
  const fire = (name: string, x: Omit<Surface, 'cell' | 'where'>) =>
    say(findings([{ cell: 'X', where: 'control', ...x }]).length > 0, `control fires: ${name}`)
  const quiet = (name: string, x: Omit<Surface, 'cell' | 'where'>) =>
    say(findings([{ cell: 'X', where: 'control', ...x }]).length === 0, `no false alarm: ${name}`)
  fire('a tally gate drawn as round counters (C7 before)', { text: '[image: one full tally gate] A full tally gate stands for 5 birds.', figure: { type: 'counters', icons: ['dot'] } })
  fire('a pictograph drawn as a number line (C23 before)', { text: 'A pictograph shows books. Monday has 8 stars.', figure: { type: 'number-line' } })
  quiet('a pictograph BEING DRAWN with only its key strip', { text: 'A pictograph of litres is being drawn. Each drop stands for 10 litres.', figure: { type: 'bar-model' } })
  fire('a pizza cut into pieces drawn as a strip (C15 before)', { text: '[image: a pizza cut into 3 pieces that are not all the same size] A pizza has been cut into 3 pieces.', figure: { type: 'bar-model' } })
  quiet('a ribbon cut into pieces drawn as a strip', { text: 'Ava cuts a ribbon into 4 equal pieces.', figure: { type: 'area-grid' } })
  fire('a number track drawn as a tick line (B4 before)', { text: 'Noor stands on square 12 of the hopscotch track.', figure: { type: 'number-line' } })
  fire('a line plot drawn as a bar', { text: 'A line plot counts the peas in each pod.', figure: { type: 'bar-model' } })
  quiet('"Draw a line plot" with no picture (the child draws it)', { text: 'Six pods held these peas: 4, 6, 5. Draw a line plot for them.' })
  fire('"shade everything to the right" drawn as a hop (E15 before)', { text: 'I put a circle on twenty and shade everything to the right of it.', figure: { type: 'number-line', ray: false } })
  fire('bicycle wheels drawn as balls (C7/C8 before)', { text: 'Every bicycle needs 2 wheels.', figure: { type: 'counters', icons: ['ball'] } })
  quiet('bicycle wheels drawn as wheels', { text: 'Every bicycle needs 2 wheels.', figure: { type: 'counters', icons: ['wheel'] } })
  fire('"these bars" with NO bars on the page (E22 before)', { text: 'Is the order of these bars a free choice? A sunshine record is drawn as a display.' })
  const rising = { ...byCell, X1: [found[0] ?? { cell: 'X1', rule: 'balance', drawn: 'bar-model', where: 'control', text: 'x' }] }
  say(ratchet(rising as Record<string, Finding[]>, DEBT).length > 0, 'control fires: a NEW week joining the debt')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
