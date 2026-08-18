/**
 * Does any surface PROMISE a picture and then not draw one?
 *
 * Not the same question as the figure census, which counts how many surfaces have a
 * figure. Plenty of them rightly have none — "Build the number 81 yourself" needs no
 * picture. What harms a child is a surface whose WORDS point at something to look at
 * when there is nothing to look at: they are asked to read a number off a diagram
 * that was never drawn, and there is no way for them to be right.
 */
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator';

/** Wording that only makes sense if a picture is on the screen. */
const PROMISES = [
  /\[image:/i,
  // "these numbers" in a choice-key stem means the OPTIONS, not a picture — and a
  // chart whose contents are given in words ("7 full gates") needs no drawing to be
  // answered. Both were flagged before and neither is a broken promise.
  /\bthese\s+(groups?|groupings?|rods|cubes|blocks|counters)\b/i,
  /\b(look at|point to|shade|circle)\s+(the\s+)?(picture|diagram|image|figure|array|grid|number line|ten.frame)\b/i,
  /\b(shown|pictured|drawn|displayed)\s+(above|below|here)\b/i,
  /\bthe (picture|diagram|chart|image|figure|model) (above|below|here|shows)\b/i,
]
const promises = (t?: string) => !!t && PROMISES.some(re => re.test(t))

type Row = { level: string; week: number; surface: string; id: string; text: string }
const broken: Row[] = []
const perLevel = new Map<string, { broken: number; surfaces: number }>()

function note(level: string, ok: boolean) {
  const e = perLevel.get(level) ?? { broken: 0, surfaces: 0 }
  e.surfaces++
  if (!ok) e.broken++
  perLevel.set(level, e)
}

for (const cell of AVAILABLE_WEEKS) {
  const pack = generatePack(cell.level, cell.week, 12345) as any
  const L = cell.level, W = cell.week

  // 1. Lesson script segments
  for (const seg of pack.explanation?.segments ?? []) {
    const p = promises(seg.say) || promises(seg.visual)
    if (!p) continue
    note(L, !!seg.figure)
    if (!seg.figure) broken.push({ level: L, week: W, surface: 'lesson script', id: '-', text: (seg.visual || seg.say).slice(0, 90) })
  }

  // 2. Guided examples
  for (const ge of pack.guidedExamples ?? []) {
    if (!promises(ge.prompt)) continue
    note(L, !!ge.figure)
    if (!ge.figure) broken.push({ level: L, week: W, surface: 'guided example', id: ge.id, text: ge.prompt.slice(0, 90) })
  }

  // 3. Every child-answered item
  for (const day of pack.days ?? []) {
    for (const it of day.items ?? []) {
      if (!promises(it.prompt)) continue
      note(L, !!it.figure)
      if (!it.figure) broken.push({ level: L, week: W, surface: `day ${day.day} item`, id: it.id, text: it.prompt.slice(0, 90) })
    }
  }
  // MASTERY. This read `pack.masteryCheck?.items` until 2026-08-17 — a field
  // that has never existed on the type, which is `formA`/`formB`. The `?? []`
  // turned the mistake into silence, so the loop iterated NOTHING and the
  // graded gate deciding whether a child passes the week went unscanned on
  // every green run. Same shape as the figure census: a check that reports
  // rather than fails, over a set that is empty for the wrong reason.
  for (const [form, items] of [['formA', pack.masteryCheck?.formA], ['formB', pack.masteryCheck?.formB]] as const) {
    for (const it of items ?? []) {
      if (!promises(it.prompt)) continue
      note(L, !!it.figure)
      if (!it.figure) broken.push({ level: L, week: W, surface: `mastery ${form}`, id: it.id, text: it.prompt.slice(0, 90) })
    }
  }

  // The puzzle is answered through the same AnswerEntry as any item and was
  // never walked here either.
  if (pack.puzzle && promises(pack.puzzle.prompt)) {
    note(L, !!pack.puzzle.figure)
    if (!pack.puzzle.figure) broken.push({ level: L, week: W, surface: 'puzzle', id: pack.puzzle.id, text: pack.puzzle.prompt.slice(0, 90) })
  }
}

console.log('Surfaces that promise a picture, by level:')
for (const [lvl, e] of [...perLevel].sort()) {
  const pct = e.surfaces ? Math.round((e.surfaces - e.broken) / e.surfaces * 100) : 100
  console.log(`  Level ${lvl}: ${e.surfaces - e.broken}/${e.surfaces} deliver one (${pct}%) — ${e.broken} BROKEN PROMISE(S)`)
}
console.log(`\nTotal broken promises: ${broken.length}`)
if (broken.length) {
  console.log('\nEvery one of them:')
  for (const b of broken) {
    console.log(`  ${b.level}${String(b.week).padStart(2, '0')} ${b.surface.padEnd(16)} ${b.id.padEnd(12)} "${b.text}"`)
  }
}
