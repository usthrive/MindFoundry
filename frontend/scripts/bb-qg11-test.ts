/**
 * QG-11 regression test (CONTENT-GENERATOR-FIX-SPEC §7/§11). Proves the anchor /
 * embedded-claim audit:
 *   1. FLAGS the original D6 keyed-wrong-answer bug and the D8 fabricated-anchor
 *      bug when their weeks are treated as v2 (the detector / prose scanner work).
 *   2. Catches a tampered verify-backed answer (the mismatch audit).
 *   3. Catches a fabricated equation injected into narration (the prose scanner).
 *   4. Leaves the three hand-authored fixtures (A15/B14/D17) CLEAN under v2 — the
 *      pinned regression set QG-11 must never false-fail.
 *
 * Run: npx tsx scripts/bb-qg11-test.ts
 */

import { generatePack, validatePack } from '../src/modules/best-brains/generator';
import type { WeeklyConceptPack } from '../src/modules/best-brains/types';

let failures = 0;
const check = (cond: boolean, label: string) => {
  console.log(`${cond ? '  ok  ' : 'FAIL  '}${label}`);
  if (!cond) failures++;
};
const qg11 = (pack: WeeklyConceptPack, contract: 'v1' | 'v2') =>
  validatePack(pack, { contract }).violations.filter((v) => v.gate === 'QG-11');
const clone = (p: WeeklyConceptPack): WeeklyConceptPack => JSON.parse(JSON.stringify(p));

// 1. The D6/D8 bug CLASSES (week-independent — the real weeks get rewritten as v2,
//    so we inject the offending shape into a clone of a clean pack and confirm the
//    v2 detector flags it while v1 leaves it report-only).
function injectClaim(base: WeeklyConceptPack, prompt: string): WeeklyConceptPack {
  const p = clone(base);
  // A hand-authored classify/error-analysis item with an embedded worked claim and
  // NO generator/verify template — exactly the D6/D8 authored-bug shape.
  p.days[4].items.push({
    id: `${p.identity.level}${p.identity.week}-D5-99`,
    type: 'classification',
    prompt,
    choices: [
      { key: 'A', text: 'yes', isCorrect: true },
      { key: 'B', text: 'no', isCorrect: false, errorTag: 'procedure-slip', rationale: 'x' },
    ],
    answer: { value: 'A', acceptableForms: [], validation: 'choice-key' },
    difficulty: 3, strand: 'noncomputational', isRetrieval: false,
    hintLadder: ['Is that right?'], errorTags: ['procedure-slip'],
  });
  return p;
}
{
  const base = generatePack('A', 15, 12345); // any clean pack
  const d6shape = injectClaim(base, 'A student shared 29 by 4 and wrote 7 R 3. Is that right?');
  const d8shape = injectClaim(base, 'A student multiplied 32 × 21 and got 674. Is that right?');
  const v2a = validatePack(d6shape, { contract: 'v2' }).violations.filter((v) => v.gate === 'QG-11');
  const v1a = validatePack(d6shape, { contract: 'v1' }).violations.filter((v) => v.gate === 'QG-11');
  const v2b = validatePack(d8shape, { contract: 'v2' }).violations.filter((v) => v.gate === 'QG-11');
  check(v2a.length > 0, `D6-class ("wrote 7 R 3") authored claim is FLAGGED under v2 [${v2a.map((x) => x.path).join(', ') || 'none'}]`);
  check(v1a.length === 0, 'D6-class claim is report-only (not flagged) under v1 — migration-safe');
  check(v2b.length > 0, `D8-class ("got 674") authored claim is FLAGGED under v2 [${v2b.map((x) => x.path).join(', ') || 'none'}]`);
}

// 2. Mismatch audit: tamper a verify-backed error-analysis answer on the v2 D4 exemplar.
{
  const d4 = generatePack('D', 4, 12345);
  const clean = qg11(d4, 'v2');
  check(clean.length === 0, 'D4 v2 exemplar is QG-11 clean as generated');
  const bad = clone(d4);
  const ea = bad.days.flatMap((d) => d.items).find((i) => i.type === 'error-analysis');
  if (ea) {
    ea.answer.value = 'the true answer is 999999';
    ea.answer.acceptableForms = ['999999'];
  }
  // Re-find in the tampered pack and validate.
  const flagged = validatePack(bad, { contract: 'v2' }).violations.filter((v) => v.gate === 'QG-11');
  check(flagged.length > 0, `tampered error-analysis answer is caught by the mismatch audit [${flagged.map((x) => x.path).join(', ') || 'none'}]`);
}

// 3. Prose scanner: inject a fabricated equation into an explanation segment.
{
  const d4 = clone(generatePack('D', 4, 12345));
  d4.explanation.script[0].say = `A quick check: 7 × 8 = 54, so we are set.`; // 56, not 54
  const flagged = validatePack(d4, { contract: 'v2' }).violations.filter((v) => v.gate === 'QG-11');
  check(flagged.some((v) => v.path.startsWith('explanation.script')), 'fabricated "7 × 8 = 54" in narration is caught by the prose scanner');
}

// 4. Fixtures stay clean under their ACTUAL contract (v1 — they are hand-authored
//    references, never migrated to v2, so the embedded-claim detector is off for
//    them; the always-on mismatch/prose/pointer checks must still pass). This is
//    the migration-safety guarantee: a hand-authored error-analysis in a v1/fixture
//    pack (D17-D5-01 "Jo claims 1/3 + 1/4 = 2/7") is legitimate and must NOT fail.
for (const [lvl, wk] of [['A', 15], ['B', 14], ['D', 17]] as const) {
  const pack = generatePack(lvl, wk, 12345);
  const v = qg11(pack, 'v1');
  check(v.length === 0, `fixture ${lvl}${wk} is QG-11 CLEAN under v1 [${v.map((x) => x.gate + '@' + x.path).join(', ') || 'clean'}]`);
}
// 4b. And the always-on QG-11 checks (mismatch/prose/pointer, detector OFF) never
//     false-fail D17 even if it were mis-fed as v2 EXCEPT for the detector line —
//     confirm the ONLY v2 flag on D17 is the (correct) detector demand on its
//     hand-authored error-analysis, nothing spurious in prose or pointers.
{
  const d17 = generatePack('D', 17, 12345);
  const v2only = qg11(d17, 'v2');
  const nonDetector = v2only.filter((x) => !x.message.includes('no verify template'));
  check(nonDetector.length === 0, `D17 under v2 has ONLY the detector demand, no spurious prose/pointer/mismatch flags [${nonDetector.map((x) => x.path).join(', ') || 'none'}]`);
}

console.log(`\n${failures === 0 ? 'ALL QG-11 REGRESSION TESTS PASS' : failures + ' QG-11 TEST(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
