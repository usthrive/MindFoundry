/**
 * THE ANSWERABILITY GATE
 *
 * One question, asked of every served surface:
 *
 *     Given the input surface this child actually gets, can the stored answer
 *     physically be produced?
 *
 * ── WHY ─────────────────────────────────────────────────────────────────────
 * Six defects were found by a seven-year-old in one week, and every one was the
 * same shape: a question no one could have answered, which the app then marked
 * him wrong for. Division answers of "13 R 1" on a pad with no R key. A 4-digit
 * product with two answer boxes. Level G answers like "y = 5x + 2" on a
 * digits-only pad. Inequalities stored as "x < -4.666666666666667". A scene that
 * lived only inside an `[image: …]` direction and was never drawn.
 *
 * They were fixed as six bugs. They are one bug, and this is the gate for it.
 *
 * ── HOW IT DIFFERS FROM A COUNT ─────────────────────────────────────────────
 * A gate that counts is not a gate. The figure census printed
 * "un-migrated [image:] 1" on every green run for weeks and shipped anyway;
 * bb-verify-packs prints a permit reading "BLOCKING: … the question cannot be
 * answered without the shape" and exits 0. So:
 *
 *   · this script EXITS 1 on any answerability failure;
 *   · a permit may excuse a MISSING PICTURE, never an UNANSWERABLE ITEM —
 *     `channel: 'blocking'` is a failure by definition, not a silencer;
 *   · it proves producibility CONSTRUCTIVELY: it builds a string the child
 *     could physically enter and runs the REAL marker (`checkAnswer`) on it.
 *     Nothing is asserted about the marker that the marker did not confirm.
 *
 * ── AND IT READS THE LAW, IT DOES NOT COPY IT ───────────────────────────────
 * The input surface comes from `inputSurfaceFor()`, the same function
 * `AnswerEntry` renders from. A gate holding its own copy of the rule drifts
 * from the component the first time a prop changes — which is precisely how the
 * census rotted. There is one law and both sides read it.
 */

import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator';
import { checkAnswer } from '../src/modules/best-brains/answers';
import { inputSurfaceFor, describeSurface, type InputSurface } from '../src/modules/best-brains/inputSurface';
import { bandForLevel } from '../src/modules/best-brains/copy';
import { hasImagePlaceholder, promptText, promptImageAlt } from '../src/modules/best-brains/figures/prompt';
import type { PackItem, AnswerSpec } from '../src/modules/best-brains/types';

// ── Permits ────────────────────────────────────────────────────────────────
//
// `channel` states HOW the child receives what the missing picture would have
// carried. 'spoken' asserts the `[image: …]` words are sufficient when read
// aloud — every authored-item screen wires `speakablePrompt` behind a speaker
// button, and band A autoplays it. 'blocking' asserts they are NOT sufficient,
// which is a defect, and the gate fails on it however carefully it is worded.
type Channel = 'spoken' | 'in-words' | 'blocking';
const FIGURE_PERMITS: Record<string, { channel: Channel; why: string }> = {
  'A15-D2-01': { channel: 'spoken', why: 'hands/fingers manipulative; the spoken scene names the shown finger count' },
  'A15-D4-03': { channel: 'spoken', why: 'a one-to-one compare figure would hand over the answer the conservation trap withholds; the spoken scene gives both counts' },
  'A15-D5-04': { channel: 'spoken', why: 'shape gallery — angle-figure draws one polygon and no circle; the spoken scene names all three' },
  'A15-PZ-01': { channel: 'spoken', why: 'labelled-sum garden — no primitive; the spoken scene carries the labels' },
  // B14-D1-03's permit lived here until 2026-08-20, when base-ten-blocks made
  // its "model of 45" drawable and it was drawn; the stale-permit guard forced
  // the deletion, in this table and in bb-verify-packs' FIGURE_DEBT alike.
  'C7-GE-03':  { channel: 'in-words', why: 'a bird-watch chart whose tally contents are stated in the visible prompt — nothing is read off a drawing' },
  // C22-D5-02 held a `channel: 'blocking'` permit until 2026-08-17. It is gone
  // because the item is FIXED, not because the permit was softened: the week's
  // own `tiltedSquareFig()` now draws the card. Retiring a permit by drawing the
  // picture is the only way one should ever leave this table.
};

/**
 * Wording that only makes sense if a picture is on the screen — carried over
 * from `bb-broken-promise-scan`, whose exclusions are kept: "these numbers" in
 * a choice-key stem means the OPTIONS, not a picture.
 */
const PROSE_PROMISES = [
  /\bthese\s+(groups?|groupings?|rods|cubes|blocks|counters)\b/i,
  /\b(look at|point to|shade|circle)\s+(the\s+)?(picture|diagram|image|figure|array|grid|number line|ten.frame)\b/i,
  /\b(shown|pictured|drawn|displayed)\s+(above|below|here)\b/i,
  /\bthe (picture|diagram|chart|image|figure|model) (above|below|here|shows)\b/i,
];

// ── Findings ───────────────────────────────────────────────────────────────
type Axis = 'REACH' | 'CAPACITY' | 'MARKING' | 'INFO' | 'WELLFORMED' | 'SCENE';
interface Finding { axis: Axis; level: string; week: number; surface: string; id: string; detail: string; }
const findings: Finding[] = [];
const fail = (f: Finding) => findings.push(f);

let surfacesChecked = 0;
let answerBearing = 0;
const permitsSeen = new Set<string>();

/**
 * SCENE DEBT — lesson-script segments that describe a picture and draw nothing.
 *
 * Not answerability (the child is not answering a lesson segment), but the same
 * bug class, and the one my son hit on Level B Day 1: he opened "watch the
 * lesson again", was told "Ten cubes magnetize into a single rod labeled 10",
 * and was shown an empty dashed box with that sentence italicised inside it.
 * The sentence is a direction to an animator. He read it as the lesson.
 *
 * This is a RATCHET, not a pass/fail line. The existing debt is real and large
 * (Level D has barely any lesson pictures at all) and blocking every build on it
 * would help nobody. What must not happen is the number going UP — a new
 * undrawn scene is a new child staring at an empty box. Ceilings come down as
 * weeks get drawn; they may never go up without a deliberate edit here.
 */
const sceneDebt = new Map<string, number>();
// Re-measured 2026-08-20, after the corpus-wide figure fill: 119 scenes paid
// down to 7, every remaining one DELIBERATE and named — a21 (a cone in the
// hands teaches what a still cannot) · b08 (the fact triangle the adult draws
// on paper) · b23 (a dot plot needs baseline-aligned stacks CountersFig cannot
// draw — measured rejection in b23's header) · d06 (a counterfactual "if" has
// no still) · d23 ×3 (adjacent-angles-on-a-line and a three-shape gallery,
// neither expressible by the one-opening angle figure — the recorded gap).
// Each number is a debt to pay down, never a budget to spend.
const SCENE_DEBT_CEILING: Record<string, number> = {
  A: 1, B: 2, C: 0, D: 4, E: 0,
};

// ── Producibility ──────────────────────────────────────────────────────────

/**
 * Can this exact string be assembled on this surface?
 *
 * `choices` and `tap` are CLOSED SETS — the child submits a key or a numeral
 * that the surface itself offers and cannot type anything else. Treating them
 * as open (the first version of this file did) lets the stored answer count as
 * its own evidence, and the sentinel caught it: a multiple-choice item whose
 * correct key is absent from its own choices passed, because "7" was reachable
 * even though no button on the screen said 7.
 */
function composable(s: string, surface: InputSurface): boolean {
  if (!s) return false;
  switch (surface.kind) {
    case 'choices':
      return surface.keys.includes(s);
    case 'tap':
      return surface.options.includes(s);
    case 'ack':
    case 'text':
      return true;
    case 'pad': {
      for (const ch of s) if (!surface.alphabet.has(ch)) return false;
      const digits = [...s].filter((c) => c >= '0' && c <= '9').length;
      return digits <= surface.maxDigits;
    }
  }
}

/** Every character the surface cannot emit. */
function missingChars(s: string, surface: InputSurface): string[] {
  if (surface.kind !== 'pad') return [];
  return [...new Set([...s].filter((ch) => !surface.alphabet.has(ch)))];
}

/**
 * Candidate strings a child could plausibly enter. Includes the stored surface
 * forms plus the canonical numeric rendering, because `checkAnswer` accepts
 * value-equality for the numeric validations — a child typing "7" for a stored
 * "7.0" is right, and the gate must not call that unanswerable.
 */
function candidates(spec: AnswerSpec, surface: InputSurface): string[] {
  const out = [spec.value, ...spec.acceptableForms];
  const n = Number(String(spec.value).trim().replace(/,/g, ''));
  if (Number.isFinite(n)) out.push(String(n));
  if (surface.kind === 'tap') out.push(...surface.options);
  if (surface.kind === 'choices') out.push(...surface.keys);
  return [...new Set(out.filter((s) => typeof s === 'string' && s.length > 0))];
}

/**
 * The core assertion. Proves ∃ a string that (a) the surface can emit and
 * (b) the real marker accepts. Returns null when answerable.
 */
function unanswerable(spec: AnswerSpec, surface: InputSurface): { axis: Axis; detail: string } | null {
  if (surface.kind === 'ack') return null; // ungraded; nothing can be wrong

  const cands = candidates(spec, surface);
  const reachable = cands.filter((c) => composable(c, surface));

  if (reachable.length === 0) {
    if (surface.kind === 'choices' || surface.kind === 'tap') {
      return { axis: 'MARKING', detail: `stored answer "${spec.value}" is not among the ${describeSurface(surface)} the child can press — nothing on screen is right` };
    }
    const blockers = [...new Set(cands.flatMap((c) => missingChars(c, surface)))];
    const tooLong = cands.every((c) => [...c].filter((ch) => ch >= '0' && ch <= '9').length > (surface.kind === 'pad' ? surface.maxDigits : Infinity));
    if (tooLong && blockers.length === 0) {
      return { axis: 'CAPACITY', detail: `answer "${spec.value}" needs more than ${(surface as { maxDigits: number }).maxDigits} digits — on ${describeSurface(surface)}` };
    }
    return {
      axis: 'REACH',
      detail: `answer "${spec.value}" needs ${blockers.map((c) => `'${c}'`).join(', ') || 'characters'} which the surface cannot emit — on ${describeSurface(surface)}`,
    };
  }

  // Reachable — but does the marker actually accept any reachable form?
  const accepted = reachable.some((c) => checkAnswer(spec, c).correct);
  if (!accepted) {
    return {
      axis: 'MARKING',
      detail: `every input the child can produce is marked WRONG (tried ${reachable.slice(0, 6).map((c) => `"${c}"`).join(', ')}) against stored "${spec.value}" [${spec.validation}] — on ${describeSurface(surface)}`,
    };
  }
  return null;
}

/**
 * Stored answers no child would ever type. "x < -4.666666666666667" is
 * typeable in a free-text box and still unanswerable in practice: it is a
 * float artifact, not a number anyone writes.
 */
function malformed(value: string): string | null {
  const m = value.match(/\d\.(\d+)/);
  if (!m) return null;
  const frac = m[1];
  if (/(\d)\1{5,}/.test(frac)) return `repeating-digit float artifact ".${frac}"`;
  if (frac.length > 6) return `${frac.length} fractional digits ".${frac}" — float artifact, not a writable answer`;
  return null;
}

// ── Surface walk ───────────────────────────────────────────────────────────

function checkItem(level: string, week: number, surfaceName: string, item: PackItem) {
  const band = bandForLevel(level as Parameters<typeof bandForLevel>[0]);
  const surface = inputSurfaceFor(item, band);
  surfacesChecked++;
  answerBearing++;

  const u = unanswerable(item.answer, surface);
  if (u) fail({ axis: u.axis, level, week, surface: surfaceName, id: item.id, detail: u.detail });

  const bad = malformed(item.answer.value);
  if (bad) fail({ axis: 'WELLFORMED', level, week, surface: surfaceName, id: item.id, detail: `stored answer "${item.answer.value}" is a ${bad}` });

  checkInfo(level, week, surfaceName, item.id, item.prompt, !!item.figure);
}

/**
 * The information channel. A prompt carrying `[image: …]` has its bracket
 * STRIPPED before display (`promptText`), so the words reach the child only as
 * a drawn picture or as the spoken scene. With neither, the item is a question
 * no one could answer — the original defect, exactly.
 */
function checkInfo(level: string, week: number, surfaceName: string, id: string, prompt: string, hasFigure: boolean) {
  if (hasFigure) return;

  const bracketed = hasImagePlaceholder(prompt);
  // A promise made in PROSE with no bracket is strictly worse than a bracketed
  // one: there is no `[image: …]` text for `speakablePrompt` to read, so the
  // audio channel is empty too. The child is pointed at something to look at
  // and there is nothing there, in any channel.
  const inProse = !bracketed && PROSE_PROMISES.some((re) => re.test(prompt));
  if (!bracketed && !inProse) return;

  const permit = FIGURE_PERMITS[id];
  if (permit) permitsSeen.add(id);

  if (!permit) {
    fail({
      axis: 'INFO', level, week, surface: surfaceName, id,
      detail: bracketed
        ? `[image: …] with no picture and NO PERMIT — visible prompt is "${promptText(prompt)}"`
        : `words point at a picture that does not exist, and no bracket to speak — NO PERMIT — "${promptText(prompt).slice(0, 110)}"`,
    });
    return;
  }
  if (permit.channel === 'blocking') {
    fail({ axis: 'INFO', level, week, surface: surfaceName, id, detail: `permit declares it BLOCKING — ${permit.why}` });
    return;
  }
  if (permit.channel === 'spoken') {
    // Asserts the audio channel carries it — so the bracket must actually exist.
    if (!bracketed || !promptImageAlt(prompt)) {
      fail({ axis: 'INFO', level, week, surface: surfaceName, id, detail: `permit relies on the spoken scene, but there is no [image: …] bracket to speak` });
    }
    return;
  }
  // channel: 'in-words' — the visible prompt must stand alone. If it points at
  // a picture AND carries a bracket, the words are not self-sufficient.
  if (bracketed) {
    fail({ axis: 'INFO', level, week, surface: surfaceName, id, detail: `permit claims the prompt stands alone in words, but it carries an [image: …] bracket the child never sees` });
  }
}

// ── Liveness sentinel ──────────────────────────────────────────────────────
//
// A clean run means nothing until the gate is shown to be capable of failing.
// `--selftest` replays the six defects my son found, as synthetic items, and
// asserts each one is caught. If the corpus is green AND this is green, the
// green is worth something. Run it in CI beside the gate itself.
if (process.argv.includes('--selftest')) {
  const spec = (value: string, validation: string, forms: string[] = []): AnswerSpec =>
    ({ value, acceptableForms: forms, validation } as AnswerSpec);
  const mk = (id: string, prompt: string, answer: AnswerSpec, extra: Partial<PackItem> = {}): PackItem =>
    ({ id, type: 'computation', prompt, answer, difficulty: 1, strand: 'computational',
       isRetrieval: false, hintLadder: {} as never, errorTags: [], ...extra } as PackItem);

  const cases: { name: string; level: string; item: PackItem; expect: Axis }[] = [
    { name: 'division remainder "13 R 1" on a pad with no R key',
      level: 'B', item: mk('T-01', '27 ÷ 2 = ?', spec('13 R 1', 'exact-numeric')), expect: 'REACH' },
    { name: '4-digit product that will not fit the box',
      level: 'B', item: mk('T-02', '4821 × 3907 = ?', spec('188335647', 'exact-numeric')), expect: 'CAPACITY' },
    { name: 'Level G text answer on a digits-only pad',
      level: 'B', item: mk('T-03', 'Solve for y.', spec('y = 5x + 2', 'exact-numeric')), expect: 'REACH' },
    { name: 'negative answer — the pad never renders a minus key',
      level: 'B', item: mk('T-04', '3 − 8 = ?', spec('-5', 'exact-numeric')), expect: 'REACH' },
    { name: 'decimal answer with the decimal key withheld',
      level: 'B', item: mk('T-05', 'Half of 5?', spec('2.5', 'exact-numeric')), expect: 'REACH' },
    { name: 'choices present but the key is not among them',
      level: 'B', item: mk('T-06', 'Which is more?', spec('7', 'choice-key'),
        { choices: [{ key: 'A', text: 'red', isCorrect: false }, { key: 'B', text: 'blue', isCorrect: true }] as never }), expect: 'MARKING' },
    { name: 'inequality stored as a float artifact',
      level: 'D', item: mk('T-07', 'Solve.', spec('x < -4.666666666666667', 'short-text-keyword')), expect: 'WELLFORMED' },
    { name: 'scene that exists only as an [image: …] direction',
      level: 'B', item: mk('T-08', '[image: 7 red balloons, 5 blue balloons] Which colour has MORE?', spec('red', 'short-text-keyword')), expect: 'INFO' },
  ];

  let caught = 0;
  for (const c of cases) {
    const before = findings.length;
    checkItem(c.level, 99, 'selftest', c.item);
    const got = findings.slice(before);
    const hit = got.some((f) => f.axis === c.expect);
    console.log(`  ${hit ? 'caught  ' : 'MISSED  '}[${c.expect.padEnd(10)}] ${c.name}`);
    if (!hit) console.log(`            got instead: ${got.map((f) => f.axis).join(', ') || 'NOTHING'}`);
    if (hit) caught++;
  }
  console.log(`\nSentinel: ${caught}/${cases.length} known defects caught.`);
  process.exit(caught === cases.length ? 0 : 1);
}

for (const cell of AVAILABLE_WEEKS) {
  const pack = generatePack(cell.level, cell.week, 12345) as any;
  const L = cell.level;
  const W = cell.week;

  // `explanation.script`, NOT `.segments`. `bb-broken-promise-scan` read
  // `.segments` — a field that has never existed on the Explanation type — and
  // `?? []` made the mistake silent, so its lesson-script loop iterated NOTHING
  // on every green run. This gate inherited the bug by copying the walk, and the
  // scene-debt counter reporting a flat 0 against a census showing 71 undrawn
  // Level-D segments is what exposed it. Third time this exact shape has bitten:
  // masteryCheck.items, explanation.segments, and items.ts in bb-family-test.
  // A `?? []` on a misspelt field is indistinguishable from clean content.
  for (const [i, seg] of (pack.explanation?.script ?? []).entries()) {
    surfacesChecked++;
    checkInfo(L, W, 'lesson script', `${L}${W}-SEG-${i + 1}`, seg.say ?? '', !!seg.figure);
    if (seg.visual) checkInfo(L, W, 'lesson script', `${L}${W}-SEG-${i + 1}`, seg.visual, !!seg.figure);
    // A described-but-undrawn scene. `LessonRoom` falls back to printing the
    // `visual` as italic prose, so this is not a quiet gap — the stage
    // direction is shown to the child AS the lesson.
    if (seg.visual && !seg.figure) sceneDebt.set(L, (sceneDebt.get(L) ?? 0) + 1);
  }

  for (const ge of pack.guidedExamples ?? []) {
    surfacesChecked++;
    checkInfo(L, W, 'guided example', ge.id, ge.prompt ?? '', !!ge.figure);
    if (ge.visual) checkInfo(L, W, 'guided example', ge.id, ge.visual, !!ge.figure);
  }

  for (const day of pack.days ?? []) {
    for (const it of day.items ?? []) checkItem(L, W, `day ${day.day}`, it);
  }

  // The puzzle is answered through the SAME AnswerEntry (PuzzleGrove adapts it
  // via `puzzleAsItem`), and the broken-promise scan never walked it.
  if (pack.puzzle) checkItem(L, W, 'puzzle', pack.puzzle as PackItem);

  // MASTERY. `bb-broken-promise-scan` reads `masteryCheck.items`, which does not
  // exist on the type — the field is formA/formB. That loop has always iterated
  // NOTHING, so the graded gate deciding whether a child passes the week has
  // never once been scanned.
  for (const it of pack.masteryCheck?.formA ?? []) checkItem(L, W, 'mastery formA', it);
  for (const it of pack.masteryCheck?.formB ?? []) checkItem(L, W, 'mastery formB', it);
}

// ── Report ─────────────────────────────────────────────────────────────────

const AXIS_BLURB: Record<Axis, string> = {
  REACH: 'the answer needs a character the input surface cannot emit',
  CAPACITY: 'the answer does not fit the input surface',
  MARKING: 'every producible input is marked wrong',
  INFO: 'the child is not given what they need to answer',
  WELLFORMED: 'the stored answer is not a string a child would write',
  SCENE: 'a lesson describes a picture and draws nothing, so the child is shown the stage direction',
};

console.log(`Answerability gate — ${surfacesChecked} surfaces walked (${answerBearing} answer-bearing) across ${AVAILABLE_WEEKS.length} weeks.\n`);

// No silent caps: say what is NOT covered.
console.log('Not covered by this run (stated, not skipped quietly):');
console.log('  · fluency sprint items — generated at runtime from a GeneratorSpec, not materialised in the pack');
console.log('  · Kumon worksheets (StudyPage/PracticeTest) — a separate engine; see the session report');
console.log('  · guided examples are checked for INFO only; they carry a display answer, not an AnswerSpec\n');

console.log('Scene debt — lesson segments that describe a picture and draw nothing:');
for (const level of [...new Set([...sceneDebt.keys(), ...Object.keys(SCENE_DEBT_CEILING)])].sort()) {
  const n = sceneDebt.get(level) ?? 0;
  const cap = SCENE_DEBT_CEILING[level];
  if (cap === undefined) {
    console.log(`  Level ${level}: ${n} — NO CEILING SET`);
    fail({ axis: 'SCENE', level, week: 0, surface: 'lesson script', id: `level-${level}`, detail: `${n} undrawn scene(s) and no ceiling declared — add one to SCENE_DEBT_CEILING` });
    continue;
  }
  const mark = n > cap ? 'ABOVE CEILING' : n < cap ? `below ceiling ${cap} — lower it` : `at ceiling ${cap}`;
  console.log(`  Level ${level}: ${n} undrawn / ceiling ${cap} — ${mark}`);
  if (n > cap) {
    fail({ axis: 'SCENE', level, week: 0, surface: 'lesson script', id: `level-${level}`, detail: `${n} undrawn scenes exceeds the ceiling of ${cap} — a new one was added; draw it or it prints stage directions to a child` });
  }
}
console.log();

const stale = Object.keys(FIGURE_PERMITS).filter((id) => !permitsSeen.has(id));
for (const id of stale) {
  fail({ axis: 'INFO', level: '-', week: 0, surface: 'permit table', id, detail: 'permit is stale — no served surface emits this id' });
}

if (findings.length === 0) {
  console.log('✓ Every served surface can be answered on the surface the child is given.');
  process.exit(0);
}

const byAxis = new Map<Axis, Finding[]>();
for (const f of findings) byAxis.set(f.axis, [...(byAxis.get(f.axis) ?? []), f]);

for (const axis of ['REACH', 'CAPACITY', 'MARKING', 'INFO', 'WELLFORMED', 'SCENE'] as Axis[]) {
  const fs = byAxis.get(axis);
  if (!fs?.length) continue;
  console.log(`${axis} — ${AXIS_BLURB[axis]} (${fs.length})`);
  for (const f of fs) {
    console.log(`  ${f.level}${String(f.week).padStart(2, '0')} ${f.surface.padEnd(14)} ${f.id.padEnd(13)} ${f.detail}`);
  }
  console.log();
}

console.error(`ANSWERABILITY FAILURES: ${findings.length}`);
console.error('A child cannot be marked wrong for a question no one could have answered.');
process.exit(1);
