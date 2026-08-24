/**
 * The two surfaces `bb-answer-entropy-test` says it cannot see — measured.
 *
 * That gate's own header lists its blind spots, and two of them have now cost
 * four real defects in three consecutive Level-E weeks. This file is the
 * complement, not a replacement: it deliberately measures nothing the entropy
 * gate already measures, and everything it says it cannot.
 *
 * ---------------------------------------------------------------------------
 * WHY EACH CHECK EXISTS — one shipped defect per check, named
 * ---------------------------------------------------------------------------
 *
 * 1. CONDITIONAL_RANK — a rank that is balanced OVERALL and fixed once you read
 *    a word the prompt already printed.
 *
 *    `ratio.stackedPercentTrap` draws whether a price is raised twice or reduced
 *    twice, precisely so the truth is not always the middle card. It works: the
 *    marginal rank measures middle 49.5% / largest 50.5% over 4,000 draws, and
 *    the generator's own comment records that measurement as its repair.
 *
 *    But the direction is PRINTED. Condition on it and the rank is not balanced
 *    at all — it is perfect:
 *
 *        "… is reduced by p1%, and that new price is then reduced by p2%"
 *            → the truth is the MIDDLE amount on 100.0% of draws
 *        "… is raised by p1%, and that new price is then raised by p2%"
 *            → the truth is the LARGEST amount on 100.0% of draws
 *
 *    So "read one word, then pick by rank" scores 100% with no arithmetic, on a
 *    generator whose rank defect was already found once and fixed once. The
 *    entropy gate reports CONSTANT_NUMERIC_RANK and sees nothing here, because
 *    it aggregates over all draws and the aggregate is honest.
 *
 *    THE RULE THIS ENCODES: balancing a marginal rank while a printed clause
 *    pins the conditional rank is not a repair. A generator that draws a branch
 *    to fix a rank must be re-measured WITHIN each branch.
 *
 * 2. MAJORITY_VOTE — the key agrees with the crowd on every feature at once.
 *
 *    `algebra.openOrClosedDotTrap` offers three number-line descriptions that
 *    vary on two features, the circle (open / filled) and the direction (left /
 *    right). On every draw the keyed option holds the MAJORITY value of both, so
 *    "take the reading the other two agree with" is correct 100% of the time
 *    over 4,000 draws — with no number line read and no inequality solved.
 *
 *    Nothing in the entropy gate can see it: the keyed text moves every draw, no
 *    option is dead, the key sits at no fixed position, and the options are prose
 *    so there is no numeric rank at all.
 *
 * 3. PROBE_BRANCH — a metacognition probe that is not a coin flip.
 *
 *    A probe has no answer key, so no gate can weigh it directly and this one
 *    cannot either. What it CAN weigh is the thing that decides the probe's
 *    answer. Every probe worth shipping is binary and settled by a drawn branch
 *    — a call-out charge that is present or absent, a price increased or
 *    decreased — and a drawn branch shows up as a word appearing in some served
 *    prompts and not others. So this measures the BALANCE of every such clause
 *    on every metacognition item.
 *
 *    b16 shipped a probe that ran ~70/30 and taught the guess instead of the
 *    commitment; it was found by a human reading the draw. A 70/30 clause on a
 *    metacog item is exactly that shape, and it is mechanical to see.
 *
 *    This is a PROXY and it is worth being honest about its two failure modes:
 *    a probe whose branch is carried by a NUMBER rather than a word is invisible
 *    here (that is E15's magnitude-probe class, and the cure for it is design,
 *    not detection); and a balanced clause does not prove a balanced probe, only
 *    that the obvious carrier is balanced. It moves the floor, it does not
 *    replace reading the draw.
 *
 * ---------------------------------------------------------------------------
 * SLOT IDENTITY, AND WHY THE CONDITIONING IS SOUND
 * ---------------------------------------------------------------------------
 *
 * Assembly is deterministic: item k of day d of week W comes from the same
 * generator on every seed. Grouping by (week, container, index) — the entropy
 * gate's scheme, kept identical on purpose — means every draw inside a group is
 * the same generator, so conditioning on a word that varies WITHIN the group
 * conditions on that generator's own branch and on nothing else.
 *
 * A clause qualifies only if it appears in 15–85% of a slot's draws, so a word
 * that is always there (structure) and a word that is nearly never there (a
 * five-noun pool) are both excluded. Both arms need MIN_ARM draws before any
 * conditional rate is reported, so a thin arm cannot manufacture a 100%.
 *
 * ---------------------------------------------------------------------------
 * POSTURE: this is a CENSUS, and deliberately so
 * ---------------------------------------------------------------------------
 *
 * It runs over a corpus of 112 weeks that was authored before it existed, so a
 * hard failure on the first run would be a gate switched off within a week (L35,
 * which is why `bb-answer-entropy-test` keeps its day slots report-only and why
 * `bb-guessability-test` is a census with no pass/fail at all).
 *
 * Default: report everything, exit 0. `--strict` fails on findings in CERTIFYING
 * slots only — formA/formB, the slots that promote a child. Triage the census
 * first, then turn --strict on in the battery once the backlog is worked through.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS GATE CANNOT SEE — read before trusting a clean census
 * ---------------------------------------------------------------------------
 *
 * · B14. It iterates `GENERATED_WEEKS`, which holds 111 of the corpus's 112
 *   cells: B14 is FIXTURE-SHADOWED — registered, but the served pack comes from
 *   a pinned fixture rather than the builder — so it is not in the list and no
 *   gate that walks that list has ever measured it. `bb-answer-entropy-test`
 *   walks the same list and has the same hole.
 * · A probe whose branch is carried by a NUMBER rather than a word. That is
 *   E15's magnitude-probe class, and its cure is design (ask about the shape of
 *   an answer, not its size), not detection.
 * · Free-entry items, which have no options to rank and no crowd to side with.
 * · A conditional rank on a clause drawn less than 15% or more than 85% of the
 *   time, or with fewer than 25 draws in an arm. Deliberate: those thresholds
 *   are what stop a five-noun pool manufacturing a 100%, and the cost is that a
 *   genuinely rare branch is invisible.
 *
 * Run: npx tsx scripts/bb-probe-and-rank-test.ts [--level E] [--seeds 80] [--strict]
 */

import { GENERATED_WEEKS, generatePack, CONTENT_VERSION } from '../src/modules/best-brains/generator/packGenerator';
// Imported for the SELF-TEST only (see `--selftest`): two library generators
// whose defects this gate was built from. Neither is served by any week — both
// were declined by the weeks whose recipes named them — which is exactly why the
// gate needs them to prove it can still see.
import { stackedPercentTrap } from '../src/modules/best-brains/generator/templates/lib/ratio';
import { openOrClosedDotTrap } from '../src/modules/best-brains/generator/templates/lib/algebra';
import { streamRng } from '../src/modules/best-brains/generator/rng';
import { TupleGuard } from '../src/modules/best-brains/generator/templates/shared';

const argv = process.argv.slice(2);
const arg = (k: string) => {
  const i = argv.indexOf(k);
  return i >= 0 ? argv[i + 1] : undefined;
};
const ONLY_LEVEL = arg('--level')?.toUpperCase();
const SEEDS = Number(arg('--seeds') ?? 80);
const STRICT = argv.includes('--strict');
const SELFTEST = argv.includes('--selftest');

/** formA/formB certify a child; a shortcut there promotes without the mathematics. */
const CERTIFYING = /^form/;

/** A clause has to be genuinely optional, not structure and not a rare noun. */
const CLAUSE_MIN = 0.15;
const CLAUSE_MAX = 0.85;
/** No conditional rate is reported off fewer draws than this in EITHER arm. */
const MIN_ARM = 25;
/** A conditional rank at or above this, with a balanced marginal, is the defect. */
const COND_RANK_FLAG = 0.9;
/** Majority-vote at or above this is a password rather than a discrimination. */
const MAJORITY_FLAG = 0.9;
/** A metacognition clause outside this band is a probe leaning one way. */
const PROBE_LO = 0.35;
const PROBE_HI = 0.65;

/**
 * The three lead sentences `lib/metacog.ts` welds onto a wrapped item. Detection
 * has to go through the PROSE because `authorMeta` does not survive into the
 * served pack — checked, not assumed: `isMetacog` is stamped by the wrapper and
 * dropped by the assembler, so a gate reading served items cannot ask for it.
 */
const METACOG_LEAD = /^(Think before you solve\.|Predict first\.|Make a call first\.)/;
const METACOG_TAIL = /(After you solve, check yourself\.|Then check your answer\.)/;

interface Choice { text: string; isCorrect?: boolean; key?: string }
interface Item { prompt?: string; choices?: Choice[]; answer?: { value?: unknown } }

/** A bare quantity with at most a unit or currency around it — the entropy gate's own reading. */
const numOf = (t: string): number | null => {
  const m = /^[^\d-]{0,3}(-?\d+(?:[.,]\d+)?)\s*[a-z%°]{0,12}$/i.exec(t.trim());
  return m ? Number(m[1].replace(',', '.')) : null;
};

const words = (s: string): Set<string> =>
  new Set((s.toLowerCase().match(/[a-z]{3,}/g) ?? []));

interface Draw {
  /** Rank of the keyed option among the numeric options: 0 smallest … n-1 largest. Null when the options are not numbers. */
  rank: number | null;
  optionCount: number;
  /** Did majority-vote across varying option features pick the key, uniquely? */
  majorityPicksKey: boolean | null;
  promptWords: Set<string>;
  isMetacog: boolean;
}

interface Slot { key: string; draws: Draw[]; sample: string }
const slots = new Map<string, Slot>();

/**
 * MAJORITY-VOTE, computed per draw.
 *
 * A "feature" is any word that appears in at least one option and not in all of
 * them — which is exactly what distinguishes "an OPEN circle" from "a FILLED
 * circle" without needing to know that open/filled is a feature. Each option
 * scores one point per feature on which it holds the value the majority of
 * options hold. If the key is the unique top scorer, a child who never read the
 * question and simply sided with the crowd has just scored.
 */
function majorityVote(choices: Choice[], keyIdx: number): boolean | null {
  const sets = choices.map((c) => words(c.text));
  const all = new Set<string>();
  sets.forEach((s) => s.forEach((w) => all.add(w)));
  const features = [...all].filter((w) => {
    const n = sets.filter((s) => s.has(w)).length;
    return n > 0 && n < sets.length;
  });
  if (features.length === 0) return null;
  const score = sets.map((s) => {
    let pts = 0;
    for (const f of features) {
      const withF = sets.filter((x) => x.has(f)).length;
      const majorityHasIt = withF * 2 > sets.length;
      if (s.has(f) === majorityHasIt) pts++;
    }
    return pts;
  });
  const best = Math.max(...score);
  const winners = score.filter((s) => s === best).length;
  return winners === 1 && score[keyIdx] === best;
}

function record(id: string, container: string, index: number, it: Item): void {
  const prompt = it.prompt ?? '';
  const isMetacog = METACOG_LEAD.test(prompt) || METACOG_TAIL.test(prompt);
  const choices = it.choices;
  // A slot is worth grouping if it either carries choices (rank / majority) or
  // is a metacognition item (clause balance). Everything else has no surface
  // either check can read, and is skipped rather than counted as clean.
  if (!choices?.length && !isMetacog) return;

  const key = `${id} ${container}[${index}]`;
  let slot = slots.get(key);
  if (!slot) {
    slot = { key, draws: [], sample: prompt.slice(0, 130) };
    slots.set(key, slot);
  }

  let rank: number | null = null;
  let majorityPicksKey: boolean | null = null;
  let optionCount = 0;
  if (choices?.length) {
    optionCount = choices.length;
    const keyIdx = choices.findIndex(
      (c) => c.isCorrect === true || (c.key !== undefined && c.key === it.answer?.value),
    );
    if (keyIdx >= 0) {
      const vals = choices.map((c) => numOf(c.text));
      if (vals.every((v) => v !== null)) {
        const kv = vals[keyIdx] as number;
        // Rank by how many options sit strictly below the key. Ties collapse to
        // the same rank, which is right: two equal options offer no ordering.
        rank = (vals as number[]).filter((v) => v < kv).length;
      }
      majorityPicksKey = majorityVote(choices, keyIdx);
    }
  }
  slot.draws.push({ rank, optionCount, majorityPicksKey, promptWords: words(prompt), isMetacog });
}

// ---------------------------------------------------------------------------
// NEGATIVE CONTROL — the gate proves it can still see, before it reports a pass
// ---------------------------------------------------------------------------

/**
 * A NEW GATE THAT FINDS NOTHING ON ITS FIRST RUN IS UNPROVEN, NOT CLEAN.
 *
 * This one found nothing, and the reason is honest: the two defects it was built
 * from are not served anywhere. E15 declined `openOrClosedDotTrap` and E17
 * declined `stackedPercentTrap`, each after measuring it, so both live in the
 * library unused. The corpus really is clean of them — and that leaves no
 * evidence the detector works.
 *
 * So the gate runs both defective generators through its OWN detectors and
 * asserts they fire. If either stops firing, the finding is not "the corpus
 * improved", it is "this file broke", and it says so and exits non-zero.
 *
 * Both expectations are structural rather than empirical, which is what makes
 * them safe to assert:
 *   · stacked percents — two reductions put the truth strictly between "add the
 *     percents" (removes too much) and "stop after the first" (too little), so
 *     the truth is the MIDDLE; two rises invert both comparisons, so it is the
 *     LARGEST. The direction word is printed. Nothing about a draw changes that.
 *   · the dot trap — the key holds the majority value of both the circle and the
 *     direction on every draw, so majority-vote is a complete strategy.
 */
function selfTest(): boolean {
  const cases = [
    { name: 'ratio.stackedPercentTrap', gen: stackedPercentTrap(), expect: 'CONDITIONAL_RANK' },
    { name: 'algebra.openOrClosedDotTrap', gen: openOrClosedDotTrap(), expect: 'MAJORITY_VOTE' },
  ];
  let ok = true;
  console.log('\nNEGATIVE CONTROL — can this gate still see the defects it was built from?');
  for (const c of cases) {
    slots.clear();
    for (let i = 0; i < 400; i++) {
      const d = c.gen(streamRng(i * 7919 + 13, 'selftest'), new TupleGuard(), 3) as unknown as Item;
      record('SELF', 'day1', 0, d);
    }
    const before = findings.length;
    evaluate();
    const got = findings.slice(before).filter((f) => f.kind === c.expect);
    const fired = got.length > 0;
    console.log(`  ${fired ? 'SEES' : 'BLIND'}  ${c.name} → expected ${c.expect}`);
    if (fired) console.log(`         ${got[0].detail}`);
    if (!fired) ok = false;
    findings.length = before;
  }
  slots.clear();
  console.log(ok ? '  control PASSED — a clean census below is evidence.\n' : '  control FAILED — THIS FILE IS BROKEN; ignore any pass it reports.\n');
  return ok;
}


// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------

interface Finding { slot: string; kind: string; detail: string; certifying: boolean; sample: string }
const findings: Finding[] = [];
const pct = (a: number, b: number) => `${((100 * a) / b).toFixed(1)}%`;
const RANK_NAME = (r: number, n: number) => (r === 0 ? 'smallest' : r === n - 1 ? 'largest' : `rank ${r + 1}`);

/** Turn everything currently in `slots` into findings. Called by the self-test
 * on the two defective generators, then again on the corpus. */
function evaluate(): void {
  for (const slot of slots.values()) {
  const draws = slot.draws;
  const certifying = CERTIFYING.test(slot.key.split(' ')[1] ?? '');

  // --- the clauses this slot draws --------------------------------------
  const counts = new Map<string, number>();
  for (const d of draws) for (const w of d.promptWords) counts.set(w, (counts.get(w) ?? 0) + 1);
  const clauses = [...counts.entries()]
    .filter(([, n]) => n >= draws.length * CLAUSE_MIN && n <= draws.length * CLAUSE_MAX)
    .filter(([, n]) => n >= MIN_ARM && draws.length - n >= MIN_ARM)
    .map(([w]) => w);

  // --- 1. CONDITIONAL_RANK ----------------------------------------------
  const ranked = draws.filter((d) => d.rank !== null);
  if (ranked.length >= MIN_ARM * 2) {
    const n = ranked[0].optionCount;
    const marginal = new Map<number, number>();
    ranked.forEach((d) => marginal.set(d.rank!, (marginal.get(d.rank!) ?? 0) + 1));
    const marginalTop = Math.max(...marginal.values()) / ranked.length;
    for (const w of clauses) {
      const arm = ranked.filter((d) => d.promptWords.has(w));
      const off = ranked.filter((d) => !d.promptWords.has(w));
      if (arm.length < MIN_ARM || off.length < MIN_ARM) continue;
      const tally = new Map<number, number>();
      arm.forEach((d) => tally.set(d.rank!, (tally.get(d.rank!) ?? 0) + 1));
      const [topRank, topN] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
      const rate = topN / arm.length;
      // Only interesting when the WHOLE-SLOT rank looked acceptable. A slot whose
      // marginal rank is already pinned is the entropy gate's finding, not this
      // one, and reporting it twice trains people to skim both.
      if (rate >= COND_RANK_FLAG && marginalTop < COND_RANK_FLAG) {
        findings.push({
          slot: slot.key,
          kind: 'CONDITIONAL_RANK',
          detail: `prompts containing "${w}" (${arm.length} draws) key the ${RANK_NAME(topRank, n)} option ${pct(topN, arm.length)} of the time — while across all ${ranked.length} draws no rank exceeds ${pct(Math.max(...marginal.values()), ranked.length)}`,
          certifying,
          sample: slot.sample,
        });
      }
    }
  }

  // --- 2. MAJORITY_VOTE --------------------------------------------------
  const voted = draws.filter((d) => d.majorityPicksKey !== null);
  if (voted.length >= MIN_ARM * 2) {
    const hits = voted.filter((d) => d.majorityPicksKey).length;
    if (hits / voted.length >= MAJORITY_FLAG) {
      findings.push({
        slot: slot.key,
        kind: 'MAJORITY_VOTE',
        detail: `siding with whichever reading the other options agree with picks the key on ${pct(hits, voted.length)} of ${voted.length} draws (chance ≈ ${pct(1, voted[0].optionCount)})`,
        certifying,
        sample: slot.sample,
      });
    }
  }

  // --- 3. PROBE_BRANCH ---------------------------------------------------
  if (draws.filter((d) => d.isMetacog).length >= MIN_ARM * 2) {
    const meta = draws.filter((d) => d.isMetacog);
    for (const w of clauses) {
      const share = meta.filter((d) => d.promptWords.has(w)).length / meta.length;
      if (share > 0 && (share < PROBE_LO || share > PROBE_HI)) {
        findings.push({
          slot: slot.key,
          kind: 'PROBE_BRANCH',
          detail: `the clause "${w}" is drawn on ${pct(share * meta.length, meta.length)} of ${meta.length} served probes — a probe decided by it is not a coin flip`,
          certifying,
          sample: slot.sample,
        });
      }
    }
  }
  }
}

// ---------------------------------------------------------------------------
// Run the control, then the corpus
// ---------------------------------------------------------------------------

if (SELFTEST && !selfTest()) process.exit(1);

// ---------------------------------------------------------------------------
// Walk every week exactly as a child receives it
// ---------------------------------------------------------------------------

const weeks = GENERATED_WEEKS.filter((w) => !ONLY_LEVEL || w.level === ONLY_LEVEL);
const buildFailures: string[] = [];
let built = 0;

for (const { level, week } of weeks) {
  const id = `${level}${week}`;
  for (let i = 0; i < SEEDS; i++) {
    try {
      const p = generatePack(level, week, i * 7 + 1, CONTENT_VERSION) as unknown as Record<string, any>;
      built++;
      (p.days ?? []).forEach((d: Record<string, any>, di: number) => {
        (d.items ?? []).forEach((it: Item, ii: number) => record(id, `day${di + 1}`, ii, it));
      });
      const mc = p.masteryCheck ?? {};
      (mc.formA ?? []).forEach((it: Item, ii: number) => record(id, 'formA', ii, it));
      (mc.formB ?? []).forEach((it: Item, ii: number) => record(id, 'formB', ii, it));
    } catch (e) {
      const msg = `${id} seed ${i * 7 + 1}: ${(e as Error).message}`;
      if (!buildFailures.includes(msg)) buildFailures.push(msg);
      break;
    }
  }
}

evaluate();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(`\nbb-probe-and-rank — ${weeks.length} weeks × ${SEEDS} seeds (${built} packs, ${slots.size} slots)`);
if (buildFailures.length) {
  console.log('\nBUILD FAILURES (a slot that cannot be built cannot be measured):');
  buildFailures.slice(0, 8).forEach((f) => console.log('  ' + f));
}

const order = ['CONDITIONAL_RANK', 'MAJORITY_VOTE', 'PROBE_BRANCH'];
for (const kind of order) {
  const of = findings.filter((f) => f.kind === kind);
  console.log(`\n${kind} — ${of.length} finding(s)`);
  for (const f of of) {
    console.log(`  ${f.certifying ? '⛔' : '· '} ${f.slot}`);
    console.log(`       ${f.detail}`);
    console.log(`       "${f.sample}…"`);
  }
}

const blocking = findings.filter((f) => f.certifying);
console.log(
  `\n${findings.length} finding(s); ${blocking.length} on a CERTIFYING slot.` +
    (STRICT ? '' : '  (census — pass --strict to fail on the certifying ones)'),
);
if (STRICT && blocking.length) {
  console.log('FAIL — a child can be certified on one of these without the mathematics.');
  process.exit(1);
}
console.log(findings.length === 0 ? 'CLEAN — no conditional-rank, majority-vote or lopsided-probe tell found.' : 'Census complete — read and triage.');
