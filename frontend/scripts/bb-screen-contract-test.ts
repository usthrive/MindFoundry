/**
 * bb-screen-contract-test — the pack↔screen seam, field by field.
 *
 * Run (from frontend/): npx tsx scripts/bb-screen-contract-test.ts [--selftest] [--strict-warmup] [--seeds N]
 *
 * WHY. Every other gate tests the pack. This one asserts that what the pack
 * WRITES and what the screen READS agree — the class of defect a child finds
 * by using the app and the battery cannot see. Each check re-implements the
 * screen's own reading of a field verbatim (line-referenced), builds served
 * packs, and compares.
 *
 *   pageCount     PracticePage.tsx:71-73,117,359 — perPage = ceil(practice/pageCount);
 *                 the header says "page k of pageCount". Assert the last item
 *                 lands ON page pageCount (the label's "of N" is reachable) and,
 *                 where presentation.oneOperationPerPage, that one item sits on
 *                 each page (E62). Before 2026-09-04 band A read "page 1 of 1".
 *   warm-up       WarmUp.tsx:1-3,44-47 — the screen promises "2–4 fast retrieval
 *                 items"; a day with exactly 1 builds the screen for one
 *                 question. REPORT-ONLY until the owner's A.2 ruling (81% of
 *                 Level A days, 70% of Level B days); --strict-warmup fails it.
 *   sprint        sprintLogic.ts:54, SprintGate.tsx:34, SprintRun.tsx:54 — a
 *                 timer at band A is a hard fail: every Level A pack must carry
 *                 fluencySprint === null so even a deep link cannot reach a timer.
 *   teacherNoteStrip  validator.ts (Day 5 only) ↔ PuzzleGrove (reads Day 5) —
 *                 assert every strip sits on Day 5.
 *   audioFirst    presentation.audioFirst ↔ PracticePage.tsx:388 / WarmUp.tsx:199
 *                 autoplay at band A: assert the flag is true exactly at Level A.
 *
 * --selftest builds four control packs with each seam deliberately broken and
 * proves the gate fires on every one (a gate never seen to fail is unproven;
 * bb-probe-and-rank-test --selftest is the pattern).
 */
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator';
import type { PackDay, WeeklyConceptPack } from '../src/modules/best-brains/types';

const argv = process.argv.slice(2);
const SELFTEST = argv.includes('--selftest');
const STRICT_WARMUP = argv.includes('--strict-warmup');
const nSeeds = Number(argv[argv.indexOf('--seeds') + 1]) || 3;
const SEEDS = [12345, 67890, 424242, 8, 999983].slice(0, nSeeds);

/** Standing exception: the A15 FIXTURE (pinned calibration artifact, served until its generated week lands) carries pageCount 2 on 3–5-item days. */
const KNOWN_EXCEPTIONS = new Set(['A15']);

type Finding = { check: string; where: string; msg: string; strict: boolean };

/** PracticePage.tsx `pageCount`/`pageOf`, verbatim: items spread evenly over the declared pages. */
function practiceReading(day: PackDay) {
  const items = day.items.filter((i) => !i.isRetrieval);
  const declared = Math.max(1, day.pageCount ?? 1);
  const pageCount = Math.max(1, Math.min(declared, Math.max(1, items.length)));
  const pageOf = (i: number) => Math.floor((Math.min(i, items.length - 1) * pageCount) / Math.max(1, items.length)) + 1;
  const pages = new Set(items.map((_, i) => pageOf(i)));
  const perPage = Math.max(...items.map((_, i) => items.filter((__, j) => pageOf(j) === pageOf(i)).length));
  return { practice: items.length, declared, pageCount, perPage, reached: pages.size };
}

function checkPack(pack: WeeklyConceptPack, label: string, out: Finding[]): void {
  const level = pack.identity.level;
  const onePerPage = pack.presentation?.oneOperationPerPage === true;
  const exempt = KNOWN_EXCEPTIONS.has(label.replace(/ .*/, ''));
  for (const day of pack.days) {
    const where = `${label} D${day.day}`;
    const r = practiceReading(day);
    if (r.declared !== r.pageCount || r.reached !== r.pageCount) {
      out.push({ check: 'pageCount', where, msg: `pack declares ${r.declared} pages for ${r.practice} practice items; the screen shows "of ${r.pageCount}" and reaches ${r.reached}`, strict: !exempt });
    }
    if (onePerPage && r.perPage !== 1) {
      out.push({ check: 'pageCount/E62', where, msg: `oneOperationPerPage but the screen puts ${r.perPage} items on a page (pageCount ${r.pageCount}, ${r.practice} practice items)`, strict: !exempt });
    }
    const retrieval = day.items.length - r.practice;
    if (day.day >= 2 && retrieval === 1) {
      out.push({ check: 'warmup-contract', where, msg: `WarmUp promises 2–4 retrieval items and is built for 1`, strict: STRICT_WARMUP });
    }
    if (day.teacherNoteStrip !== undefined && day.day !== 5) {
      out.push({ check: 'teacherNoteStrip', where, msg: `strip on Day ${day.day}; PuzzleGrove reads Day 5 only`, strict: true });
    }
  }
  if (level === 'A' && pack.fluencySprint !== null && pack.fluencySprint !== undefined) {
    out.push({ check: 'sprint/band-A', where: label, msg: `Level A pack carries a fluencySprint (timer) — SprintRun.tsx:54 would run it on a deep link`, strict: true });
  }
  const audioFirst = pack.presentation?.audioFirst === true;
  if (audioFirst !== (level === 'A')) {
    out.push({ check: 'audioFirst', where: label, msg: `presentation.audioFirst=${audioFirst} at Level ${level}; the screens autoplay at band A only`, strict: true });
  }
}

function summarize(findings: Finding[], title: string): number {
  const strict = findings.filter((f) => f.strict);
  const soft = findings.filter((f) => !f.strict);
  console.log(`\n${title}`);
  const byCheck = new Map<string, number>();
  for (const f of findings) byCheck.set(`${f.check}${f.strict ? '' : ' (report-only)'}`, (byCheck.get(`${f.check}${f.strict ? '' : ' (report-only)'}`) ?? 0) + 1);
  for (const [k, v] of byCheck) console.log(`  ${String(v).padStart(5)}  ${k}`);
  for (const f of strict.slice(0, 40)) console.log(`  FAIL  [${f.check}] ${f.where}: ${f.msg}`);
  if (strict.length > 40) console.log(`  … ${strict.length - 40} more`);
  const warmByLevel = new Map<string, number>();
  for (const f of soft) if (f.check === 'warmup-contract') warmByLevel.set(f.where[0], (warmByLevel.get(f.where[0]) ?? 0) + 1);
  if (warmByLevel.size) console.log(`  warm-up built for ONE question (report-only, owner ruling A.2 pending): ${[...warmByLevel].map(([l, n]) => `${l}:${n}`).join(' ')}`);
  return strict.length;
}

// --- served packs -----------------------------------------------------------
const findings: Finding[] = [];
let packs = 0;
for (const cell of AVAILABLE_WEEKS) {
  for (const seed of SEEDS) {
    checkPack(generatePack(cell.level, cell.week, seed), `${cell.level}${cell.week} s${seed}`, findings);
    packs++;
  }
}
let bad = summarize(findings, `bb-screen-contract-test — ${packs} served packs (${AVAILABLE_WEEKS.length} cells × ${SEEDS.length} seeds)`);

// --- self-test: the gate must be seen to fail ---------------------------------
if (SELFTEST) {
  const base = () => generatePack('A', 2, 12345);
  const baseB = () => generatePack('B', 1, 12345);
  const controls: Array<[string, WeeklyConceptPack, string]> = [];
  const c1 = base(); c1.days[1].pageCount = 1; controls.push(['band A day written as ONE page (the 2026-09-04 defect)', c1, 'pageCount/E62']);
  const c2 = baseB(); c2.days[1].pageCount = c2.days[1].items.length + 2; controls.push(['B day declaring more pages than it has items', c2, 'pageCount']);
  const c3 = base(); c3.days[1].teacherNoteStrip = 'x'; controls.push(['teacherNoteStrip on Day 2', c3, 'teacherNoteStrip']);
  const c4 = base(); (c4 as any).fluencySprint = { id: 'x', durationSeconds: 60 }; controls.push(['Level A pack carrying a sprint timer', c4, 'sprint/band-A']);
  const c5 = base(); c5.presentation = { ...(c5.presentation ?? {}), audioFirst: false }; controls.push(['Level A pack with audioFirst=false', c5, 'audioFirst']);
  console.log('\nself-test — each control must fire its check:');
  let missed = 0;
  for (const [name, pack, check] of controls) {
    const f: Finding[] = [];
    checkPack(pack, 'CTRL', f);
    const fired = f.some((x) => x.check === check && x.strict);
    if (!fired) missed++;
    console.log(`  ${fired ? 'fires' : 'SILENT'}  ${name} → ${check}`);
  }
  const clean: Finding[] = []; checkPack(base(), 'A2 clean', clean);
  const cleanStrict = clean.filter((f) => f.strict).length;
  console.log(`  ${cleanStrict === 0 ? 'ok   ' : 'FAIL '} unbroken A2 pack: ${cleanStrict} strict findings`);
  if (missed || cleanStrict) bad += missed + cleanStrict;
}

console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — ${bad} strict finding(s)`);
process.exit(bad === 0 ? 0 : 1);
