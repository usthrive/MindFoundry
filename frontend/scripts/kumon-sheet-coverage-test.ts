/**
 * Times-table sheet coverage — the questions a table sheet actually asks.
 *
 * Run: npx tsx scripts/kumon-sheet-coverage-test.ts   (from frontend/)
 *
 * WHY THIS EXISTS. A Level C table sheet has ten questions and the table has ten
 * facts; the ten should BE the ten. Drawing them at random with replacement looks
 * fine in code review and is wrong in a specific, invisible way: a child gets
 * 3 × 7 three times over and never sees 3 × 4, on the one sheet whose whole job is
 * to drill the ×3 table. That defect was found, fixed for single-table sheets, and
 * left in place for the mixed ones — where it survived until a seven-year-old
 * pointed at his screen and said the same question was there three times.
 *
 * A per-problem validator cannot see this: every individual question is perfectly
 * valid. It is a property of the SHEET, so it needs a sheet-level test.
 *
 * Pinned here:
 *   1. every table sheet asks ten DISTINCT facts;
 *   2. consecutive mixed sheets TILE the pool rather than overlap;
 *   3. an ordered sheet really does walk ×1 … ×10, because the count-by rhythm is
 *      the thing being taught;
 *   4. the problem's position is honoured — a sheet generated position by position
 *      must not pin itself to one fact (the one-question-per-page path did);
 *   5. the table card's idea of a sheet matches the questions it will sit next to;
 *   6. regeneration is stable, so restoring a session does not reshuffle the sheet.
 * Plus a negative control, so a passing run means the checks can still fail.
 */

import React from 'react'
import { renderToStaticMarkup as R } from 'react-dom/server'
import { generateProblem } from '../src/services/sessionManager'
import { getTimesTableSupport } from '../src/services/generators/elementary-advanced/level-c'
import { TimesTableCard } from '../src/components/tables/TimesTableCard'

/** Level C runs ten problems per worksheet, shown five to a page. */
const PER_SHEET = 10
const FIRST_TABLE_SHEET = 11
const LAST_TABLE_SHEET = 50

let failures = 0
let checks = 0
function check(cond: boolean, label: string): boolean {
  checks += 1
  if (!cond) {
    failures += 1
    console.error(`  FAIL  ${label}`)
  }
  return cond
}

/** A worksheet as the page builder makes it: position passed for every problem. */
function sheet(ws: number): string[] {
  return Array.from(
    { length: PER_SHEET },
    (_, i) => (generateProblem('C', ws, i) as { question: string }).question,
  )
}

const factsOf = (qs: string[]) => qs.map((q) => q.replace(/\s*=.*$/, '').trim())
const dupes = (qs: string[]) => {
  const seen = new Map<string, number>()
  for (const q of qs) seen.set(q, (seen.get(q) ?? 0) + 1)
  return [...seen.entries()].filter(([, n]) => n > 1)
}
const parse = (fact: string) => {
  const m = /^(\d+)\s*×\s*(\d+)$/.exec(fact)
  return m ? { table: Number(m[1]), multiplier: Number(m[2]) } : null
}

console.log('Level C times-table sheet coverage\n')

// ---------------------------------------------------------------------------
// 1-3. Every table sheet: ten distinct facts, all inside the sheet's own tables.
// ---------------------------------------------------------------------------
console.log('— every sheet asks ten distinct facts')
const beats = new Map<string, number>()
for (let ws = FIRST_TABLE_SHEET; ws <= LAST_TABLE_SHEET; ws += 1) {
  const support = getTimesTableSupport(ws)
  if (!support) {
    check(false, `C${ws}: is a table sheet but declares no tables`)
    continue
  }
  beats.set(support.beat, (beats.get(support.beat) ?? 0) + 1)

  const facts = factsOf(sheet(ws))
  const repeated = dupes(facts)
  check(
    repeated.length === 0,
    `C${ws} (${support.beat}, ×${support.tables.join('/')}): ten distinct facts`
      + (repeated.length ? ` — ${repeated.map(([f, n]) => `${f} ×${n}`).join(', ')}` : ''),
  )

  // 5. The card will sit beside these questions; it must be about the same tables.
  const drawn = new Set(facts.map((f) => parse(f)?.table))
  const declared = new Set(support.tables)
  check(
    [...drawn].every((t) => t !== undefined && declared.has(t)),
    `C${ws}: every question comes from the declared tables ×${support.tables.join('/')} (drew ×${[...drawn].join('/')})`,
  )

  // 3. An ordered sheet is the table, in order — that is the count-by rhythm.
  if (support.beat === 'ordered') {
    const multipliers = facts.map((f) => parse(f)?.multiplier)
    check(
      multipliers.every((m, i) => m === i + 1),
      `C${ws}: ordered sheet walks ×1 … ×10 (got ${multipliers.join(',')})`,
    )
  }

  // 6. Same sheet, same questions — a restored session must not reshuffle.
  check(facts.join('|') === factsOf(sheet(ws)).join('|'), `C${ws}: regenerates identically`)
}
console.log(`  ${[...beats].map(([b, n]) => `${n} ${b}`).join(' · ')} sheets`)

// ---------------------------------------------------------------------------
// 2. Consecutive mixed sheets tile the pool instead of overlapping.
// ---------------------------------------------------------------------------
console.log('— mixed pairs tile the fact pool')
for (const [a, b] of [[19, 20], [29, 30], [39, 40], [49, 50]] as const) {
  const fa = factsOf(sheet(a))
  const fb = factsOf(sheet(b))
  const overlap = fa.filter((f) => fb.includes(f))
  check(overlap.length === 0, `C${a}+C${b}: no fact asked on both sheets (${overlap.join(', ') || 'none'})`)
  const support = getTimesTableSupport(a)!
  const pool = support.tables.length * 10
  const covered = new Set([...fa, ...fb]).size
  check(
    covered === Math.min(pool, PER_SHEET * 2),
    `C${a}+C${b}: cover ${Math.min(pool, PER_SHEET * 2)} of the ${pool}-fact pool (got ${covered})`,
  )
  if (pool === PER_SHEET * 2) {
    console.log(`  C${a}+C${b} together are the whole ×${support.tables.join('/')} pool, each fact once`)
  }
}

// ---------------------------------------------------------------------------
// 4. Position is honoured — the one-question-at-a-time regression.
// ---------------------------------------------------------------------------
console.log('— the problem position changes the question')
for (const ws of [11, 12, 13, 17, 22, 29]) {
  const walked = new Set(factsOf(sheet(ws)))
  check(walked.size === PER_SHEET, `C${ws}: ten positions give ten questions (got ${walked.size})`)
}

// ---------------------------------------------------------------------------
// Negative control: the check must still be able to fail.
// ---------------------------------------------------------------------------
console.log('— controls')
{
  // What the mixed branch used to do: draw table and multiplier independently,
  // with replacement. Over many sheets this MUST trip the distinctness rule.
  let sheetsWithRepeats = 0
  const rng = (n: number) => Math.floor(Math.random() * n)
  for (let t = 0; t < 200; t += 1) {
    const tables = [2, 3, 4, 5]
    const drawn = Array.from({ length: PER_SHEET }, () => `${tables[rng(4)]} × ${rng(10) + 1}`)
    if (dupes(drawn).length > 0) sheetsWithRepeats += 1
  }
  check(
    sheetsWithRepeats > 100,
    `control: with-replacement drawing repeats on ${sheetsWithRepeats}/200 sheets — the rule has teeth`,
  )
  console.log(`  the old mixed sampler repeated a fact on ${sheetsWithRepeats}/200 sheets; the walk repeats on 0`)

  // And the distinctness helper itself must not be blind.
  check(dupes(['2 × 3', '2 × 3']).length === 1, 'control: a duplicate is detected')
  check(dupes(['2 × 3', '2 × 4']).length === 0, 'control: distinct facts are not flagged')
}

// ---------------------------------------------------------------------------
// The table card's contract, on the sheet it will actually sit on.
//
// This is a graded page: a table printed beside the questions IS the answer key
// unless the covering is exact. The rule is that the fact the child was ASKED is
// never spelled out for him — its neighbours are, so he can step to it, and the
// count-by strip is, because using that means counting along it, which is the
// work the sheet is asking for in the first place.
// ---------------------------------------------------------------------------
console.log('— the table card never answers the question in front of him')
{
  const card = (tables: number[], support: 'open' | 'tap' | 'covered', current: { table: number; multiplier: number }) =>
    R(React.createElement(TimesTableCard as any, { tables, support, current }))

  let rendered = 0
  let hiddenTiles = 0
  for (let ws = FIRST_TABLE_SHEET; ws <= LAST_TABLE_SHEET; ws += 1) {
    const support = getTimesTableSupport(ws)!
    for (const fact of factsOf(sheet(ws))) {
      const parsed = parse(fact)!
      const html = card(support.tables, support.support, parsed)
      rendered += 1
      // The tile for the asked fact must not carry its product.
      const answered = new RegExp(`${parsed.table}\\s*×\\s*${parsed.multiplier}\\s*=\\s*${parsed.table * parsed.multiplier}\\b`)
      check(
        !answered.test(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')),
        `C${ws} (${support.support}): card does not write out ${parsed.table} × ${parsed.multiplier} = ${parsed.table * parsed.multiplier}`,
      )
      const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')

      // A neighbour IS legible on the open beats — that is the step-off.
      if (support.support !== 'covered' && parsed.multiplier > 1) {
        const neighbour = parsed.multiplier - 1
        const shown = new RegExp(`${parsed.table}\\s*×\\s*${neighbour}\\s*=\\s*${parsed.table * neighbour}\\b`)
        check(shown.test(text), `C${ws}: the neighbour ${parsed.table} × ${neighbour} stays legible to step from`)
      }

      // On a covered sheet the ANCHOR he is told to step from must be readable,
      // or the hint underneath contradicts the tile above it.
      if (support.support === 'covered') {
        const anchor = [10, 5, 2, 1].find((a) => a < parsed.multiplier)
        if (anchor && anchor !== parsed.multiplier) {
          const shown = new RegExp(`${parsed.table}\\s*×\\s*${anchor}\\s*=\\s*${parsed.table * anchor}\\b`)
          check(shown.test(text), `C${ws}: the anchor ${parsed.table} × ${anchor} stays legible on a covered sheet`)
        }
      }

      // The table he was asked about leads; the others wait behind a tap, so he
      // is never scrolling past three tables to reach his own.
      if (support.tables.length > 1) {
        const others = support.tables.filter((t) => t !== parsed.table)
        check(
          /Show my other tables/.test(text) && !new RegExp(`${others[0]} times table`).test(text),
          `C${ws}: leads with the ×${parsed.table} row, others behind a tap`,
        )
      }
    }
    // With no fact asked, every non-anchor product on a covered sheet is hidden.
    if (support.support === 'covered') {
      const html = card(support.tables, 'covered', null as any)
      const qs = (html.match(/\?/g) ?? []).length
      hiddenTiles += qs
      const nonAnchors = support.tables.length * 6
      check(qs >= nonAnchors, `C${ws}: ${nonAnchors} non-anchor products covered (found ${qs})`)
    }
  }
  console.log(`  ${rendered} card renders checked; the count-by strip stays plain so it must be counted, not read`)

  // Control: the check can fail. A card told nothing was asked shows the products.
  const open = R(React.createElement(TimesTableCard as any, { tables: [3], support: 'open', current: null }))
  check(/3\s*×\s*7\s*=\s*21/.test(open.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')),
    'control: with no fact asked, the row is fully legible — so the covering above is real')
  check(/★/.test(open), 'the anchors (×1, ×2, ×5, ×10) are marked')
  check(/count by 3/.test(open), 'the count-by rhythm is printed')
}

console.log(`\n${LAST_TABLE_SHEET - FIRST_TABLE_SHEET + 1} table sheets · ${checks} checks.`)
console.log(failures === 0 ? 'ALL SHEET COVERAGE CHECKS PASS' : `${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
