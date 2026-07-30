/**
 * Cross-week originality scan — the gate that reads the corpus, not the pack.
 *
 * Every existing gate judges ONE pack. The pedagogical preflight dedups hint
 * ladders inside a week; QG-1/QG-4 keep operand surfaces fresh inside a week.
 * Nothing looks across weeks — and the fill authors 88 of them, each written by
 * copying the same two proven exemplars. One author caught themselves shipping
 * hints copied word-for-word from another week and reported it plainly: "both
 * gates passed before I found this — the 200-seed check cannot see it."
 *
 * So this reads the whole corpus at once and reports what only becomes visible
 * there:
 *
 *   1. HINT LADDERS shared between different weeks. A hint is fixed and
 *      role-based by design (it must be seed-invariant), so some convergence on
 *      short phrasings is inevitable — but a whole ladder appearing in two weeks
 *      means one week was written by copying the other's voice rather than its
 *      shape.
 *   2. PROMPT TEMPLATES shared between weeks — the same sentence with the
 *      numbers swapped, which is what "structurally polished, pedagogically
 *      hollow" looked like the first time this corpus failed.
 *   3. CONTEXT convergence — the same real-world frame carrying different
 *      concepts across weeks (L24: "seats for every multiplication week").
 *
 * REPORT-ONLY by default: some of this is legitimate and the judgement is a
 * human's. Pass --strict to fail on exact whole-ladder reuse across weeks,
 * which is the one signal with no innocent explanation.
 *
 * Run: npx tsx scripts/bb-cross-week-test.ts [--strict]
 */

import { generatePack, AVAILABLE_WEEKS } from '../src/modules/best-brains/generator/packGenerator';
import { promptText } from '../src/modules/best-brains/figures/prompt';
import type { PackItem, WeeklyConceptPack } from '../src/modules/best-brains/types';

const STRICT = process.argv.includes('--strict');
const SEED = 424242;

/** Digits, names and nouns stripped: what remains is the SHAPE of the sentence. */
function shapeOf(text: string): string {
  return promptText(text)
    .toLowerCase()
    .replace(/\d+(?:[./]\d+)?/g, '#')
    .replace(/[^a-z#\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const items = (p: WeeklyConceptPack): PackItem[] => [
  ...p.days.flatMap((d) => d.items),
  ...p.masteryCheck.formA,
  ...p.masteryCheck.formB,
];

const ladderOwners = new Map<string, Set<string>>();
const ladderTemplates = new Map<string, Set<string>>();
const promptOwners = new Map<string, Set<string>>();
const packs: Array<{ id: string; level: string; week: number; pack: WeeklyConceptPack }> = [];

for (const c of AVAILABLE_WEEKS) {
  const pack = generatePack(c.level, c.week, SEED);
  packs.push({ id: `${c.level}${c.week}`, level: c.level, week: c.week, pack });
  for (const it of items(pack)) {
    if (it.isRetrieval) continue; // warm-ups legitimately replay another week
    const ladder = (it.hintLadder ?? []).map((h) => shapeOf(h)).join(' | ');
    if (ladder.length > 40) {
      if (!ladderOwners.has(ladder)) ladderOwners.set(ladder, new Set());
      ladderOwners.get(ladder)!.add(`${c.level}${c.week}`);
      // Record which generator produced it. Two weeks that share a generator
      // FAMILY share its hints by construction — the hints live in the family
      // and must be fixed and role-based to stay seed-invariant. That is not
      // plagiarism; it is the design. What matters is the other case.
      if (!ladderTemplates.has(ladder)) ladderTemplates.set(ladder, new Set());
      ladderTemplates.get(ladder)!.add(it.generator?.templateId ?? `authored:${it.type}`);
    }
    const shape = shapeOf(it.prompt);
    if (shape.split(' ').length >= 8) {
      if (!promptOwners.has(shape)) promptOwners.set(shape, new Set());
      promptOwners.get(shape)!.add(`${c.level}${c.week}`);
    }
  }
}

let hardFailures = 0;

console.log(`\nCross-week originality over ${packs.length} packs (seed ${SEED})\n`);

console.log('1. Hint ladders appearing in MORE THAN ONE week');
{
  const shared = [...ladderOwners.entries()].filter(([, owners]) => owners.size > 1);
  // Split by cause, because only one of the two is a defect.
  const structural: Array<[string, Set<string>]> = [];
  const copied: Array<[string, Set<string>]> = [];
  for (const entry of shared) {
    (ladderTemplates.get(entry[0])!.size === 1 ? structural : copied).push(entry);
  }
  if (copied.length === 0) console.log('   no COPIED ladders — every week hints in its own voice');
  for (const [ladder, owners] of copied.sort((a, b) => b[1].size - a[1].size).slice(0, 15)) {
    console.log(`   ⚠ COPIED  ${[...owners].join(', ')}  ←  "${ladder.slice(0, 88)}…"`);
  }
  for (const [ladder, owners] of structural.sort((a, b) => b[1].size - a[1].size).slice(0, 8)) {
    const tpl = [...ladderTemplates.get(ladder)!][0];
    console.log(`   ok shared  ${[...owners].join(', ')}  via ${tpl}  ←  "${ladder.slice(0, 60)}…"`);
  }
  if (STRICT) hardFailures += copied.length;
  console.log(
    `   total: ${copied.length} COPIED across weeks (a defect) · ${structural.length} shared via one generator (by design)`,
  );
}

// ---------------------------------------------------------------------------
// 1b. NEAR-duplicate ladders — the half exact matching cannot see.
//
// An author reported plagiarising a sibling week's hints and finding it only
// with a token-similarity scan: their ladder was the other week's sentence with
// the noun swapped, which an exact shape match sails straight past. Both gates
// had passed. So similarity is measured, not just equality.
// ---------------------------------------------------------------------------
console.log('\n1b. NEAR-duplicate hint ladders across weeks (token overlap, different generators)');
{
  const NEAR = 0.55;
  const entries = [...ladderOwners.entries()].map(([ladder, owners]) => ({
    ladder,
    owners,
    tpl: ladderTemplates.get(ladder)!,
    tokens: new Set(ladder.split(/[\s|]+/).filter((t) => t.length > 3)),
  }));
  const jaccard = (a: Set<string>, b: Set<string>) => {
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    return inter / (a.size + b.size - inter || 1);
  };
  const hits: Array<[number, string, string, string]> = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const A = entries[i];
      const B = entries[j];
      // Same generator ⇒ shared by construction, already reported above.
      if ([...A.tpl].some((t) => B.tpl.has(t))) continue;
      // Same week ⇒ the in-pack dedup owns that case.
      const shareWeek = [...A.owners].some((w) => B.owners.has(w));
      if (shareWeek) continue;
      const sim = jaccard(A.tokens, B.tokens);
      if (sim >= NEAR) hits.push([sim, [...A.owners].join('/'), [...B.owners].join('/'), A.ladder]);
    }
  }
  if (hits.length === 0) console.log(`   none above ${NEAR} token overlap`);
  for (const [sim, a, b, ladder] of hits.sort((x, y) => y[0] - x[0]).slice(0, 12)) {
    console.log(`   ${sim.toFixed(2)}  ${a} ~ ${b}  ←  "${ladder.slice(0, 74)}…"`);
  }
  if (hits.length > 12) console.log(`   …and ${hits.length - 12} more`);
  if (STRICT) hardFailures += hits.filter((h) => h[0] >= 0.7).length;
  console.log(`   total: ${hits.length} near-duplicate pairs (≥0.7 fails under --strict)`);
}

console.log('\n2. Prompt SHAPES appearing in more than one week (numbers/punctuation stripped)');
{
  const shared = [...promptOwners.entries()].filter(([, owners]) => owners.size > 1);
  if (shared.length === 0) console.log('   none');
  for (const [shape, owners] of shared.sort((a, b) => b[1].size - a[1].size).slice(0, 12)) {
    console.log(`   ${[...owners].join(', ')}  ←  "${shape.slice(0, 92)}…"`);
  }
  if (shared.length > 12) console.log(`   …and ${shared.length - 12} more`);
  console.log(`   total: ${shared.length} sentence shapes shared across weeks`);
}

console.log('\n3. Context convergence — nouns carrying the most different weeks');
{
  const NOUNS = /\b(marble|sticker|shell|apple|book|ribbon|tile|bead|crate|bottle|basket|lap|seat|bus|tray|card|pencil|coin|counter|button|flower|star|duck|fish|leaf|block|ball|charm|peg|jar|box|bag|row|pack|shelf|garden|path|fence|pen|track|cup|plant|kite|tin|sack|crayon)\w*/g;
  const nounWeeks = new Map<string, Set<string>>();
  for (const { id, pack } of packs) {
    for (const it of items(pack)) {
      for (const m of promptText(it.prompt).toLowerCase().matchAll(NOUNS)) {
        const n = m[1];
        if (!nounWeeks.has(n)) nounWeeks.set(n, new Set());
        nounWeeks.get(n)!.add(id);
      }
    }
  }
  const top = [...nounWeeks.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 10);
  for (const [noun, weeks] of top) console.log(`   ${String(weeks.size).padStart(3)} weeks  ${noun}`);
}

console.log(
  `\n${STRICT ? (hardFailures === 0 ? 'STRICT: no cross-week ladder reuse' : `STRICT: ${hardFailures} shared ladder(s)`) : 'report-only (pass --strict to fail on shared hint ladders)'}`,
);
process.exit(STRICT && hardFailures > 0 ? 1 : 0);
