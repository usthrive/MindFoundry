/**
 * bb-screen-contract-test — the pack↔screen seam, field by field.
 *
 * Run (from frontend/): npx tsx scripts/bb-screen-contract-test.ts [--selftest] [--seeds N]
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
 *   warm-up       WarmUp.tsx ↔ session/dayFlow.ts — the screen promises "2–4 fast
 *                 retrieval items"; dayFlow folds a lone one into the work
 *                 screen (owner ruling 2026-09-04, option a). Assert the
 *                 guarantee, conservation of items, and count the folds.
 *   sprint        sprintLogic.ts:54, SprintGate.tsx:34, SprintRun.tsx:54 — a
 *                 timer at band A is a hard fail: every Level A pack must carry
 *                 fluencySprint === null so even a deep link cannot reach a timer.
 *   teacherNoteStrip  validator.ts (Day 5 only) ↔ PuzzleGrove (reads Day 5) —
 *                 assert every strip sits on Day 5.
 *   audioFirst    presentation.audioFirst ↔ PracticePage.tsx:388 / WarmUp.tsx:199
 *                 autoplay at band A: assert the flag is true exactly at Level A.
 *
 * ── THE HONEST-CONTROLS CHECKS (owner ruling 2026-09-22) ────────────────────
 * Added from B3-D5-03: a three-claim prompt printed as one paragraph, answered
 * into a bare "Your answer / Check" box for an item nothing grades. The ruling
 * was to fix the CLASS and add a gate so it cannot recur, so these five read
 * the same laws the child's screen reads — `inputSurfaceFor`, `placeholderFor`,
 * `promptText` — rather than describing them a second time.
 *
 *   control-honesty     inputSurface.ts ↔ AnswerEntry.tsx — a `manual-review`
 *                       item may only reach `ack` or `explain` (never a graded
 *                       box), and a `truth-set` item may only reach `truth`.
 *   multi-claim-prompt  a prompt carrying two or more comparison claims, or
 *                       naming "sentence"/"statement" twice, must either BE the
 *                       truth form or be SET OUT on lines. A ratchet: the
 *                       pre-ruling debt is enumerated per level and may fall,
 *                       never rise (the SCENE_DEBT precedent in
 *                       bb-answerability-gate).
 *   typed-format-hint   every typed surface says the SHAPE the marker accepts;
 *                       only a numeric answer may keep the bare "Your answer".
 *   prompt-lines-render source check — a file printing `promptText(...)` in JSX
 *                       must also carry `whitespace-pre-line`, and
 *                       `promptText` must still preserve a single `\n`. A
 *                       preserved newline that CSS then eats is worse than no
 *                       newline: the author believes it worked.
 *   run-on-prompt       report-only census of long / many-imperative prompts.
 *                       The owner reads it; nothing fails on it.
 *
 * ── THE RUBRIC CENSUS (owner ruling 2026-09-22, option (a)) ─────────────────
 *   review-rubric       report-only. Since "Tell Ms. Wren" now sends a band
 *                       B/C explanation to be READ against the item's own
 *                       rubric, that rubric became load-bearing: the reader is
 *                       given `answer.value`, `acceptableForms`, the hint
 *                       ladder and the DD7 tags, and nothing else. An item
 *                       with an empty `answer.value` is UNREVIEWABLE — there
 *                       is nothing to judge the child's sentence against, and
 *                       the reader would fall back on its own idea of the
 *                       concept, which is exactly what "in their own words"
 *                       exists to avoid. The census names those items, and
 *                       prints the rubric strength of every other one so the
 *                       thin ones are visible before a child meets them.
 *
 * --selftest builds control packs with each seam deliberately broken and proves
 * the gate fires on every one (a gate never seen to fail is unproven;
 * bb-probe-and-rank-test --selftest is the pattern). The three checks that read
 * a law take that law as a PARAMETER so the control can hand them a broken one
 * — the corpus walk always passes the real function, so the two cannot drift.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator';
import type { AnswerValidation, PackDay, PackItem, WeeklyConceptPack } from '../src/modules/best-brains/types';
import { dayFlow, WARMUP_MIN_ITEMS } from '../src/modules/best-brains/session/dayFlow';
import { describeSurface, inputSurfaceFor, type InputSurface } from '../src/modules/best-brains/inputSurface';
import { bandForLevel, type InteractionBand } from '../src/modules/best-brains/copy';
import { promptText } from '../src/modules/best-brains/figures/prompt';
// The placeholder table lives beside the box it fills; the gate asserts THAT
// table rather than a copy of it (the inputSurface law, applied to copy).
import { placeholderFor } from '../src/modules/best-brains/components/AnswerEntry';

const argv = process.argv.slice(2);
const SELFTEST = argv.includes('--selftest');
const nSeeds = Number(argv[argv.indexOf('--seeds') + 1]) || 3;
const SEEDS = [12345, 67890, 424242, 8, 999983].slice(0, nSeeds);

/** Standing exception: the A15 FIXTURE (pinned calibration artifact, served until its generated week lands) carries pageCount 2 on 3–5-item days. */
const KNOWN_EXCEPTIONS = new Set(['A15']);

type Finding = { check: string; where: string; msg: string; strict: boolean; level?: string; id?: string };

// ===========================================================================
// The honest-controls checks (2026-09-22). Each is a PURE function of the law
// it reads, so --selftest can hand it a broken law and watch it fire.
// ===========================================================================

/** The only validations for which a bare "Your answer" is an honest placeholder. */
const NUMERIC_VALIDATIONS = new Set<AnswerValidation>([
  'exact-numeric', 'equivalent-numeric', 'equivalent-fraction',
]);

/** Two or more comparison claims in one prompt — the B3-D5-03 signature. */
const COMPARISON_CLAIM_RE = /\d+\s*[<>=≠≤≥]\s*\d+/g;
const CLAIM_NOUN_RE = /\b(sentence|statement)\b/gi;

/**
 * MULTI-CLAIM DEBT, RE-MEASURED 2026-09-22 after the lining pass, across every
 * served week at the three default seeds (stable: every offender is structural,
 * not value-dependent).
 *
 * ONE ITEM OF DEBT REMAINS: B14-D3-06.
 *
 *   B: B14-D3-06 — "Sam solved 63 - 47 like this: ones: 7 - 3 = 4; tens:
 *      6 - 4 = 2; answer 24. What went wrong?"
 *
 * It is the only one left because it is a PINNED FIXTURE
 * (generator/fixtures/mfm-b14.ts), not generator output: the week is served
 * from a static pack whose bytes are the pack's identity, so relining that
 * prompt is a fixture re-pin and not a template edit, and it is out of scope
 * for a content pass. The twelve generated offenders the ruling named
 * (C10-D2-02, C10-D3-03, E9 ×7, E15-PZ-01, B6-D5-02, D4-D5-02, E8-D5-03) now
 * carry `\n• ` lines, so every other level is at zero.
 *
 * A RATCHET, not a pass/fail line, and for the reason the scene-debt ceiling in
 * bb-answerability-gate states: the existing debt is real, and what must NOT
 * happen is the number going UP — a new run-together claim list is a new child
 * reading a wall. Ceilings come down as prompts get lined; they may never go up
 * without a deliberate edit here. Every level but B is 0 and stays 0; B falls
 * to 0 when the B14 fixture is re-pinned.
 */
const MULTI_CLAIM_CEILING: Record<string, number> = { A: 0, B: 1, C: 0, D: 0, E: 0 };

/**
 * control-honesty — can this item's surface mark what it asks for?
 *
 * `surface` is passed in rather than computed so the control can prove the
 * assertion fires; the corpus walk always passes `inputSurfaceFor(item, band)`,
 * which is the same function `AnswerEntry` renders from.
 */
function honestyMsg(item: PackItem, surface: InputSurface): string | null {
  const v = item.answer.validation;
  if (v === 'manual-review' && surface.kind !== 'ack' && surface.kind !== 'explain') {
    return `manual-review item served on ${describeSurface(surface)} — checkAnswer never reads it, so a graded box (and a button saying "Check") is a lie about what happens next`;
  }
  if (v === 'truth-set' && surface.kind !== 'truth') {
    return `truth-set item served on ${describeSurface(surface)} — the claims must be rows the child can judge one at a time`;
  }
  return null;
}

/** multi-claim-prompt — several claims in one paragraph, with no form for them. */
function multiClaimMsg(item: PackItem): string | null {
  const claims = (item.prompt.match(COMPARISON_CLAIM_RE) ?? []).length;
  const nouns = (item.prompt.match(CLAIM_NOUN_RE) ?? []).length;
  if (claims < 2 && nouns < 2) return null;
  if (item.answer.validation === 'truth-set') return null;
  if (item.prompt.includes('\n')) return null;
  return `${claims} comparison claim(s) and ${nouns} claim noun(s) in one unbroken paragraph — make it a truth-set item or set it out on lines: "${promptText(item.prompt).slice(0, 100)}"`;
}

/**
 * typed-format-hint — does the box say the shape the marker accepts?
 *
 * `hint` is passed in for the same reason `surface` is above.
 */
function formatHintMsg(validation: AnswerValidation, hint: string): string | null {
  if (NUMERIC_VALIDATIONS.has(validation)) return null;
  if (hint !== 'Your answer') return null;
  return `typed surface for "${validation}" offers the placeholder "Your answer" — it says nothing about the shape checkAnswer accepts (e.g. a list is split on commas)`;
}

/** run-on-prompt — the report-only census the owner reads. */
const RUN_ON_CHARS = 220;
const IMPERATIVE_RE = /\b(Write|Fix|Tell|Draw|Then|Show|Explain)\b/g;
function runOnMsg(item: PackItem): string | null {
  const visible = promptText(item.prompt);
  const imperatives = (visible.match(IMPERATIVE_RE) ?? []).length;
  if (visible.length <= RUN_ON_CHARS && imperatives < 3) return null;
  return `${visible.length} chars, ${imperatives} imperative(s): "${visible.slice(0, 100)}"`;
}

/**
 * review-rubric — how much is there for Ms. Wren to judge against?
 *
 * Report-only by design: a thin rubric is a content judgement the owner makes,
 * not a build failure, and the module ships 147 of these items. The message is
 * shaped so the census can sort on it — an item with no model answer says so
 * in capitals and sorts to the top of the printed list.
 */
function reviewRubricMsg(item: PackItem, band: InteractionBand): string | null {
  if (item.answer.validation !== 'manual-review') return null;
  if (band === 'A') return null;
  const model = (item.answer.value ?? '').trim();
  const forms = (item.answer.acceptableForms ?? []).filter((f) => f && f.trim()).length;
  const hints = (item.hintLadder ?? []).length;
  if (!model) return `NO MODEL ANSWER — unreviewable (${forms} accepted form(s), ${hints} hint(s))`;
  return `model answer ${model.length} chars, ${forms} accepted form(s), ${hints} hint(s)`;
}

/** Every item a child is actually served, with where it sits. */
function servedItems(pack: WeeklyConceptPack): Array<{ item: PackItem; where: string }> {
  const out: Array<{ item: PackItem; where: string }> = [];
  for (const day of pack.days) for (const it of day.items) out.push({ item: it, where: `D${day.day}` });
  for (const it of pack.masteryCheck.formA) out.push({ item: it, where: 'formA' });
  for (const it of pack.masteryCheck.formB) out.push({ item: it, where: 'formB' });
  // PuzzleGrove answers the puzzle through the SAME AnswerEntry (`puzzleAsItem`),
  // so it is a served surface and is walked here too.
  out.push({ item: pack.puzzle as unknown as PackItem, where: 'puzzle' });
  return out;
}

/** PracticePage.tsx `pageCount`/`pageOf`, verbatim: today's work items (dayFlow) spread evenly over the declared pages. */
function practiceReading(day: PackDay) {
  const items = dayFlow(day).work;
  const declared = Math.max(1, day.pageCount ?? 1);
  const pageCount = Math.max(1, Math.min(declared, Math.max(1, items.length)));
  const pageOf = (i: number) => Math.floor((Math.min(i, items.length - 1) * pageCount) / Math.max(1, items.length)) + 1;
  const pages = new Set(items.map((_, i) => pageOf(i)));
  const perPage = Math.max(...items.map((_, i) => items.filter((__, j) => pageOf(j) === pageOf(i)).length));
  return { practice: items.length, declared, pageCount, perPage, reached: pages.size };
}

function checkPack(
  pack: WeeklyConceptPack,
  label: string,
  out: Finding[],
  /** The input-surface law. Injected so --selftest can hand over a broken one. */
  surfaceOf: (item: PackItem, band: InteractionBand) => InputSurface = inputSurfaceFor,
  /** The placeholder table, injected for the same reason. */
  hintOf: (v: AnswerValidation, band: InteractionBand) => string = placeholderFor,
): void {
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
    // WarmUp's contract (DD8: 2–4 items) is now guaranteed by dayFlow — a lone
    // retrieval item is folded into the work screen. Assert the guarantee, and
    // count the folds so the report shows how often it happens.
    const f = dayFlow(day);
    if (f.warmup.length > 0 && (f.warmup.length < WARMUP_MIN_ITEMS || f.warmup.length > 4)) {
      out.push({ check: 'warmup-contract', where, msg: `WarmUp screen built for ${f.warmup.length} items (contract 2–4)`, strict: true });
    }
    const lone = day.items.filter((i) => i.isRetrieval).length === 1;
    if (day.day >= 2 && lone) {
      out.push({ check: 'warmup-folded', where, msg: `lone retrieval item served as question 1 of ${f.total} on the work screen`, strict: false });
    }
    if (f.total !== day.items.length || f.warmup.length + f.work.length !== day.items.length) {
      out.push({ check: 'dayflow-conservation', where, msg: `dayFlow lost or duplicated items (${f.warmup.length}+${f.work.length} vs ${day.items.length})`, strict: true });
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

  // --- the honest-controls checks (2026-09-22) ------------------------------
  const band = bandForLevel(level);
  for (const { item, where: slot } of servedItems(pack)) {
    const where = `${label} ${slot} ${item.id}`;
    const surface = surfaceOf(item, band);

    const honesty = honestyMsg(item, surface);
    if (honesty) out.push({ check: 'control-honesty', where, msg: honesty, strict: true, level, id: item.id });

    const claim = multiClaimMsg(item);
    // Collected per level and judged against the ceiling after the walk, so the
    // debt is a ratchet rather than a wall of repeats — see MULTI_CLAIM_CEILING.
    if (claim) out.push({ check: 'multi-claim-prompt', where, msg: claim, strict: false, level, id: item.id });

    // Only the surfaces a child TYPES into carry a placeholder.
    if (surface.kind === 'text' || surface.kind === 'explain') {
      const hint = formatHintMsg(item.answer.validation, hintOf(item.answer.validation, band));
      if (hint) out.push({ check: 'typed-format-hint', where, msg: hint, strict: true, level, id: item.id });
    }

    const runOn = runOnMsg(item);
    if (runOn) out.push({ check: 'run-on-prompt', where, msg: runOn, strict: false, level, id: item.id });

    // review-rubric: only band B/C manual-review items are ever sent to be
    // read (band A's are answered away from the screen with a tap).
    const rubric = reviewRubricMsg(item, band);
    if (rubric) out.push({ check: 'review-rubric', where, msg: rubric, strict: false, level, id: item.id });
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
  for (const f of soft) if (f.check === 'warmup-folded') warmByLevel.set(f.where[0], (warmByLevel.get(f.where[0]) ?? 0) + 1);
  if (warmByLevel.size) console.log(`  lone retrieval item folded into the work screen (ruled 2026-09-04, option a): ${[...warmByLevel].map(([l, n]) => `${l}:${n}`).join(' ')}`);
  return strict.length;
}

// --- prompt-lines-render: the source check ----------------------------------
//
// A SOURCE check because there is nothing in a pack to look at: the defect is a
// component that prints a prompt and collapses its lines, which no generated
// pack can reveal. `promptText` preserving a `\n` and the element eating it is
// the worst of both — the author sees their lines in the string and the child
// never sees them on the screen.
const MODULE_DIR = fileURLToPath(new URL('../src/modules/best-brains', import.meta.url));
/** `promptText(...)` inside a JSX expression container — i.e. printed as text. */
const JSX_PROMPT_TEXT_RE = /\{\s*promptText\s*\(/;
const PRE_LINE = 'whitespace-pre-line';

function moduleSources(dir: string, rel = ''): Array<{ rel: string; src: string }> {
  const out: Array<{ rel: string; src: string }> = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const here = path.join(dir, entry.name);
    const label = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...moduleSources(here, label));
    else if (/\.tsx?$/.test(entry.name)) out.push({ rel: label, src: fs.readFileSync(here, 'utf8') });
  }
  return out;
}

/**
 * The other half of the same contract: the law itself must still PRESERVE the
 * newline the components are now dressed to show. Takes the function so the
 * control can hand over the pre-ruling one and watch this fire.
 */
function newlineLawFindings(fn: (s: string) => string): Finding[] {
  // The realistic authored form: a break beside a space ("…tens. \n• 62 > 58").
  // The pre-ruling law collapsed any 2+ whitespace run, so a LONE newline
  // survived it — the probe must carry the padding or the control is silent.
  if (fn('a. \n b').includes('\n')) return [];
  return [{
    check: 'prompt-lines-render',
    where: 'figures/prompt.ts',
    msg: 'promptText collapsed a single newline — every whitespace-pre-line in the module is then decoration',
    strict: true,
  }];
}

function lineRenderFindings(files: Array<{ rel: string; src: string }>): Finding[] {
  const out: Finding[] = [];
  for (const f of files) {
    if (!JSX_PROMPT_TEXT_RE.test(f.src)) continue;
    if (f.src.includes(PRE_LINE)) continue;
    out.push({
      check: 'prompt-lines-render',
      where: f.rel,
      msg: `prints promptText(...) as JSX text but carries no "${PRE_LINE}" — an authored line break is preserved by promptText and then collapsed by CSS`,
      strict: true,
    });
  }
  return out;
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

findings.push(...lineRenderFindings(moduleSources(MODULE_DIR)));
findings.push(...newlineLawFindings(promptText));

// --- multi-claim-prompt: the ratchet ---------------------------------------
const multiClaimIds = new Map<string, Set<string>>();
for (const f of findings) {
  if (f.check !== 'multi-claim-prompt' || !f.level || !f.id) continue;
  if (!multiClaimIds.has(f.level)) multiClaimIds.set(f.level, new Set());
  multiClaimIds.get(f.level)!.add(f.id);
}
for (const level of [...new Set([...multiClaimIds.keys(), ...Object.keys(MULTI_CLAIM_CEILING)])].sort()) {
  const ids = multiClaimIds.get(level) ?? new Set<string>();
  const cap = MULTI_CLAIM_CEILING[level];
  if (cap === undefined) {
    findings.push({ check: 'multi-claim-prompt', where: `level ${level}`, msg: `${ids.size} run-together claim prompt(s) and NO CEILING DECLARED — add one to MULTI_CLAIM_CEILING`, strict: true, level });
  } else if (ids.size > cap) {
    findings.push({ check: 'multi-claim-prompt', where: `level ${level}`, msg: `${ids.size} run-together claim prompt(s) exceeds the declared ceiling of ${cap} — a NEW one was added: ${[...ids].sort().join(' ')}`, strict: true, level });
  }
}

let bad = summarize(findings, `bb-screen-contract-test — ${packs} served packs (${AVAILABLE_WEEKS.length} cells × ${SEEDS.length} seeds)`);

// --- multi-claim ledger + the run-on census the owner reads -----------------
console.log('\nmulti-claim prompts (ruled 2026-09-22; ratchet — these may fall, never rise):');
for (const level of Object.keys(MULTI_CLAIM_CEILING).sort()) {
  const ids = [...(multiClaimIds.get(level) ?? new Set<string>())].sort();
  const cap = MULTI_CLAIM_CEILING[level];
  const mark = ids.length > cap ? 'ABOVE CEILING' : ids.length < cap ? `below ceiling ${cap} — lower it` : `at ceiling ${cap}`;
  console.log(`  Level ${level}: ${ids.length} / ${cap} — ${mark}${ids.length ? `  [${ids.join(' ')}]` : ''}`);
}

const runOn = findings.filter((f) => f.check === 'run-on-prompt' && f.id && f.level);
const runOnById = new Map<string, Finding>();
for (const f of runOn) if (!runOnById.has(f.id!)) runOnById.set(f.id!, f);
const runOnByLevel = new Map<string, number>();
for (const f of runOnById.values()) runOnByLevel.set(f.level!, (runOnByLevel.get(f.level!) ?? 0) + 1);
console.log(`\nrun-on prompts — over ${RUN_ON_CHARS} visible chars OR ≥3 imperatives (report-only; the owner reads this):`);
console.log(`  per level: ${[...runOnByLevel].sort().map(([l, n]) => `${l}:${n}`).join(' ') || 'none'}  (${runOnById.size} distinct items)`);
for (const f of [...runOnById.values()].slice(0, 10)) console.log(`  ${f.id!.padEnd(12)} ${f.msg}`);

// --- review-rubric: the census the explanation reader depends on ------------
const rubric = findings.filter((f) => f.check === 'review-rubric' && f.id && f.level);
const rubricById = new Map<string, Finding>();
for (const f of rubric) if (!rubricById.has(f.id!)) rubricById.set(f.id!, f);
const rubricByLevel = new Map<string, number>();
for (const f of rubricById.values()) rubricByLevel.set(f.level!, (rubricByLevel.get(f.level!) ?? 0) + 1);
const unreviewable = [...rubricById.values()].filter((f) => f.msg.startsWith('NO MODEL ANSWER'));
console.log('\nreview-rubric — band B/C manual-review items sent to Ms. Wren (ruled 2026-09-22; report-only):');
console.log(
  `  per level: ${[...rubricByLevel].sort().map(([l, n]) => `${l}:${n}`).join(' ') || 'none'}  (${rubricById.size} distinct items)`,
);
if (unreviewable.length === 0) {
  console.log('  every one of them carries a model answer — none is unreviewable.');
} else {
  console.log(`  UNREVIEWABLE (empty modelAnswer — the reader would have nothing to judge against): ${unreviewable.length}`);
  for (const f of unreviewable) console.log(`    ${f.id!.padEnd(12)} ${f.where}`);
}
for (const f of [...rubricById.values()].slice(0, 10)) console.log(`  ${f.id!.padEnd(12)} ${f.msg}`);

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
  const c6 = baseB(); c6.days[1].items = c6.days[1].items.map((i) => ({ ...i, isRetrieval: true })); controls.push(['B day where every item is retrieval (warm-up over its 2–4)', c6, 'warmup-contract']);
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

  // --- the honest-controls checks, each shown to fail (2026-09-22) ----------
  //
  // Three of these hand `checkPack` a BROKEN LAW rather than a broken pack,
  // because the law is exactly what cannot be broken from content: no pack can
  // make `inputSurfaceFor` return a text box for a manual-review item, which is
  // the point of the fix. The control proves the ASSERTION fires; the corpus
  // walk always passes the real function, so the two cannot drift.
  console.log('\nhonest-controls self-test — each control must fire its check:');
  let missed2 = 0;
  const fires = (name: string, check: string, run: (out: Finding[]) => void) => {
    const f: Finding[] = [];
    run(f);
    const hit = f.some((x) => x.check === check);
    if (!hit) missed2++;
    console.log(`  ${hit ? 'fires' : 'SILENT'}  ${name} → ${check}`);
  };

  // control-honesty: the pre-ruling surface law, which sent manual-review to a
  // graded text box at bands B and C. Level B has such items on Day 5.
  fires('manual-review routed to a graded text box (the pre-2026-09-22 law)', 'control-honesty', (out) => {
    const pk = baseB();
    pk.days[0].items[0] = { ...pk.days[0].items[0], choices: undefined,
      answer: { value: 'tell how you know', acceptableForms: [], validation: 'manual-review' } };
    checkPack(pk, 'CTRL', out, (item, band) =>
      item.answer.validation === 'manual-review' ? { kind: 'text' } : inputSurfaceFor(item, band));
  });

  // control-honesty, the other arm: a truth-set item dropped onto the NumberPad.
  fires('truth-set routed to the NumberPad', 'control-honesty', (out) => {
    const pk = baseB();
    pk.days[0].items[0] = { ...pk.days[0].items[0], statements: ['7 > 5', '3 > 9'],
      answer: { value: 'T,F', acceptableForms: [], validation: 'truth-set' }, choices: undefined };
    checkPack(pk, 'CTRL', out, (item, band) =>
      item.answer.validation === 'truth-set'
        ? { kind: 'pad', alphabet: new Set('0123456789'.split('')), maxDigits: 8 }
        : inputSurfaceFor(item, band));
  });

  // multi-claim-prompt: B3-D5-03 exactly as it shipped before the ruling.
  fires('the B3-D5-03 paragraph (three claims, one block, no lines)', 'multi-claim-prompt', (out) => {
    const pk = baseB();
    pk.days[0].items[0] = { ...pk.days[0].items[0],
      prompt: 'Three sentences are on the board. 62 > 58. 71 < 68. 45 = 45. Write TRUE beside each sentence that is true. Fix the one that is not true by turning its sign round. Then write one sentence about how the tens helped.',
      statements: undefined, answer: { value: 'x', acceptableForms: [], validation: 'manual-review' } };
    checkPack(pk, 'CTRL', out);
  });

  // typed-format-hint: the pre-ruling table, which said "Your answer" to
  // everything including a comma-split list.
  fires('a comma-split list box placeholdered "Your answer" (the pre-ruling copy)', 'typed-format-hint', (out) => {
    const pk = baseB();
    pk.days[0].items[0] = { ...pk.days[0].items[0], choices: undefined,
      answer: { value: '3, 7, 12', acceptableForms: [], validation: 'ordered-list' } };
    checkPack(pk, 'CTRL', out, inputSurfaceFor, () => 'Your answer');
  });

  // prompt-lines-render: a file that prints a prompt and dresses nothing.
  {
    const f = lineRenderFindings([{ rel: 'CTRL.tsx', src: 'const x = <p className="text-xl">{promptText(item.prompt)}</p>;' }]);
    const hit = f.length === 1;
    if (!hit) missed2++;
    console.log(`  ${hit ? 'fires' : 'SILENT'}  a JSX prompt with no whitespace-pre-line → prompt-lines-render`);
    const clean2 = lineRenderFindings([{ rel: 'OK.tsx', src: 'const x = <p className="whitespace-pre-line">{promptText(item.prompt)}</p>;' }]);
    const quiet = clean2.length === 0;
    if (!quiet) missed2++;
    console.log(`  ${quiet ? 'quiet' : 'NOISY '}  the same file WITH whitespace-pre-line → prompt-lines-render`);
    // And the law it is paired with: the PRE-RULING promptText, which collapsed
    // every run of whitespace including a newline.
    const preRuling = (t: string) => t.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
    const collapsed = newlineLawFindings(preRuling).length === 1;
    if (!collapsed) missed2++;
    console.log(`  ${collapsed ? 'fires' : 'SILENT'}  the pre-ruling promptText, which collapsed a newline → prompt-lines-render`);
    const kept = newlineLawFindings(promptText).length === 0;
    if (!kept) missed2++;
    console.log(`  ${kept ? 'quiet' : 'NOISY '}  today's promptText, which keeps it → prompt-lines-render`);
  }

  // run-on-prompt: report-only, so "fires" means "counted", not "failed".
  fires('a 3-imperative run-on prompt is counted', 'run-on-prompt', (out) => {
    const pk = baseB();
    pk.days[0].items[0] = { ...pk.days[0].items[0],
      prompt: 'Write the two counts. Then draw the bar for each one. Show which is greater and tell how you know.' };
    checkPack(pk, 'CTRL', out);
  });

  bad += missed2;
}

console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — ${bad} strict finding(s)`);
process.exit(bad === 0 ? 0 : 1);
