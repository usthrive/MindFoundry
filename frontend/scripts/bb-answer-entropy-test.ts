/**
 * Can a child score this item WITHOUT doing the mathematics?
 *
 * Every existing gate judges ONE pack: QG-1..QG-13 recompute answers, check
 * figures, scan drawn text. All of them pass an item whose keyed answer is
 * correct — even if that answer is "the same number" on every seed, or always
 * the largest option. A child meeting such an item twice learns the shortcut,
 * scores full marks, and is promoted having learned nothing. That is FALSE
 * MASTERY, and it is invisible to per-pack checking because the mathematics,
 * the distractors and the rationales are all honest.
 *
 * Found the hard way: b20's array-comparison item only ever compared a×b with
 * b×a, so "they have the same number" was correct on 8/8 exposures across both
 * seeds — including a mastery slot. The style gate caught it by reading; no
 * deterministic gate could, because none of them looks ACROSS seeds. This one
 * does.
 *
 * SLOT IDENTITY, NOT PROMPT MATCHING. Assembly is deterministic, so item k of
 * day d of week W is produced by the same generator on every seed. Grouping by
 * (week, container, index) therefore compares like with like exactly, with no
 * prompt-shape heuristics to tune or to fool.
 *
 * The tells it measures, per slot, over N seeds:
 *   CONSTANT_ANSWER      one keyed text across every draw
 *   ALWAYS_MAX / _MIN    the keyed option is the largest/smallest number
 *   CONSTANT_NUMERIC_RANK the keyed option always sits at one rank (incl. the middle)
 *   CONSTANT_POSITION    the key sits at the same index every time
 *   NEVER_CORRECT        an option is offered often and keyed never
 *   CONSTANT_VERDICT     a true/false or yes/no item with one answer
 *   ORDINAL_TELL         the key is always the Nth thing named in the prompt
 *
 * A constant answer is not automatically a defect — "how many cubes fill one
 * paperclip?" SHOULD always be 3, because that is the fact being drilled. So
 * findings are reported with their prompt for judgement, and only slots in a
 * DISCRIMINATION or MASTERY role are counted as failures: those are the slots
 * that certify, and a shortcut there is what gets a child promoted early.
 *
 * WHAT THIS GATE CANNOT SEE — read this before trusting a PASS.
 *
 * It measures items that carry CHOICES with one keyed correct. Three surfaces are
 * therefore invisible to it, and each has already produced a real defect:
 *   · METACOGNITION PROBES. `withEstimateFirst` prepends a binary question
 *     ("more than one dime, or less?") that the child answers before solving. It
 *     has no keyed answer, so nothing here can weigh it — and b16's was ~70%
 *     "more", meaning a child who always guessed one way was mostly right. Found
 *     by a human reading the draw, and fixed by drawing the side first.
 *   · FREE-ENTRY ANSWERS. A typed number has no options to rank, so "always the
 *     bigger of the two numbers in the prompt" is not detectable here.
 *   · ALWAYS/SOMETIMES/NEVER and manual-review reasoning tasks, whose answer is
 *     prose.
 * For those, the check is a human reading the generator's draw and asking what a
 * child could guess. Write down what a gate does not cover; the uncovered surface
 * is where the next real bug lives.
 *
 * Run: npx tsx scripts/bb-answer-entropy-test.ts [--level B] [--seeds 120] [--all]
 */

import { GENERATED_WEEKS, SHADOWED_WEEKS, buildShadowedPack, generatePack, CONTENT_VERSION } from '../src/modules/best-brains/generator/packGenerator';
// The band-A tap options are built in the DISPLAY layer, not in content, so the
// gate has to import the same function the screen calls or it cannot see them.
import { tapOptionsFor } from '../src/modules/best-brains/answers';

const argv = process.argv.slice(2);
const arg = (k: string) => {
  const i = argv.indexOf(k);
  return i >= 0 ? argv[i + 1] : undefined;
};
const ONLY_LEVEL = arg('--level')?.toUpperCase();
const SEEDS = Number(arg('--seeds') ?? 120);
/** Report every tell, including the low-stakes teaching slots. */
const SHOW_ALL = argv.includes('--all');

/**
 * MASTERY slots BLOCK; day slots are REPORTED.
 *
 * A tell in formA/formB means a child can be certified — promoted — without the
 * mathematics, which is the failure this gate exists to prevent. A tell in a day
 * item is a teaching slot: lower stakes, but it still trains the shortcut, so it
 * is always printed rather than hidden behind --all. Keeping the two apart is
 * deliberate: 28 day slots across Levels A/C carry a real "pick the biggest
 * number" tell that needs an overshoot distractor to fix, and folding those into
 * a hard failure would make the gate something people switch off (L35) before the
 * backlog is worked through.
 */
const CERTIFYING = /^(formA|formB)/;

interface Choice { text: string; isCorrect?: boolean }
interface Item { id?: string; prompt?: string; choices?: Choice[]; kind?: string; variant?: string }

interface Slot {
  key: string;
  keyed: Map<string, number>;
  keyedIndex: Map<number, number>;
  offered: Map<string, number>;
  maxHits: number;
  minHits: number;
  numericDraws: number;
  draws: number;
  sample: string;
  kind: string;
  /** Rank of the keyed option's first mention in the prompt, one entry per draw. */
  mentionRanks: number[];
  /** How often the keyed option had each rank among the numeric options. */
  rankHits: Map<number, number>;
  optionCount: number;
}

const num = (t: string): number | null => {
  // A bare quantity, optionally with a unit or currency around it. Anything
  // wordier is not a number the child could be ranking.
  const m = /^[^\d-]{0,3}(-?\d+(?:[.,]\d+)?)\s*[a-z%°]{0,12}$/i.exec(t.trim());
  return m ? Number(m[1].replace(',', '.')) : null;
};

const VERDICTS = new Set(['true', 'false', 'yes', 'no', 'always', 'sometimes', 'never']);

/**
 * OPTIONS THAT MUST NEVER BE CORRECT, and the argument for each.
 *
 * A never-keyed option is usually a defect: b05 offered "both sums" on every
 * exposure and keyed it on none, so a child learnt to strike it out and the page
 * collapsed to a two-way guess. But some options are a NAMED MISCONCEPTION held
 * up for rejection — "an equals sign cannot have an add after it" is false about
 * notation itself, and keying it would teach the falsehood the week exists to
 * remove. Those must never be correct, and the gate would otherwise push an
 * author to "fix" them by making them true.
 *
 * The test that separates the two is the same one LEARNINGS L36 sets for
 * recipes: is the option ever true under ANY legal draw? If the impossibility is
 * in the mathematics, it is a lure and belongs here WITH ITS PROOF. If it is
 * merely a draw that never happened, it is a defect — widen the draw (b05, b13)
 * or reframe the question (b18, whose "counting in tens" could not be unique
 * because every multiple of ten is also reached by twos and fives).
 *
 * Every entry is an assertion about the mathematics, so each one is written out
 * and can be argued with. An entry with a weak reason is a bug in this file.
 */
const DECLARED_LURES: ReadonlyArray<{ week: string; match: string; reason: string }> = [
  {
    week: 'B6',
    match: 'an equals sign cannot have an add after it',
    reason: 'False about notation, not about this draw: an equals sign is a balance, so an addition may always stand to its right. The week exists to replace this belief, so keying it would teach it.',
  },
  {
    week: 'B6',
    match: 'the adding has to come first',
    reason: 'False about notation: 7 = 2 + 5 is a well-formed sentence. No draw can make this claim true.',
  },
  {
    week: 'B21',
    match: 'one of them must be mistaken',
    reason: 'The two counts are constructed as one length measured in two units, and QG-11 recomputes one from the other, so neither count can be wrong. It is the misconception the page exists to unseat.',
  },
];

const declaredLure = (slotKey: string, text: string): boolean => {
  const week = slotKey.split(' ')[0];
  return DECLARED_LURES.some((l) => l.week === week && text.toLowerCase().includes(l.match.toLowerCase()));
};

const slots = new Map<string, Slot>();

function record(weekId: string, container: string, index: number, it: Item) {
  if (!it.choices || it.choices.length < 2) return;
  // `it.type` is the field that actually exists on an item ('classification',
  // 'representation', 'word-problem', 'computation'). The first version read
  // `it.variant ?? it.kind`, neither of which is ever set, so every day slot got
  // the key `dayN#?[i]` — which the CERTIFYING regex below could not match, so
  // every day slot was silently excluded from the failure count and 28 slots at
  // a 100% tell were reported as a PASS. A filter that never fires reads exactly
  // like a filter that finds nothing (L37).
  const kind = it.type ?? '?';
  const key = `${weekId} ${container}#${kind}[${index}]`;
  let s = slots.get(key);
  if (!s) {
    s = {
      key, keyed: new Map(), keyedIndex: new Map(), offered: new Map(),
      maxHits: 0, minHits: 0, numericDraws: 0, draws: 0, sample: it.prompt ?? '', kind,
      mentionRanks: [],
      rankHits: new Map(),
      optionCount: it.choices.length,
    };
    slots.set(key, s);
  }
  s.draws++;
  const ki = it.choices.findIndex((c) => c.isCorrect);
  if (ki < 0) return;
  const keyedText = it.choices[ki].text;
  s.keyed.set(keyedText, (s.keyed.get(keyedText) ?? 0) + 1);
  s.keyedIndex.set(ki, (s.keyedIndex.get(ki) ?? 0) + 1);
  for (const c of it.choices) s.offered.set(c.text, (s.offered.get(c.text) ?? 0) + 1);

  // Where each option is first named in the prompt. Only meaningful when every
  // option actually appears there (a "which of these events…" item); numeric
  // options are excluded because a digit's position in the prose is not a rank
  // the child could read off.
  const prompt = (it.prompt ?? '').toLowerCase();
  const bare = (t: string) => t.toLowerCase().replace(/^(the|a|an)\s+/, '').trim();
  const at = it.choices.map((c) => (num(c.text) === null ? prompt.indexOf(bare(c.text)) : -1));
  if (at.every((i) => i >= 0) && new Set(at).size === at.length) {
    // THE OPTIONS MUST BE SPREAD THROUGH THE PROMPT AS CONTENT, not listed in the
    // question's own wording.
    //
    // House style names every option in the prompt so the page reads as one
    // question rather than a question plus a surprise third door — which means an
    // "Always, sometimes, or never true? <claim>" item contains all three option
    // words inside its first five words. Ranking those measures the position of
    // the stem's boilerplate, and it fired on all twelve Level-B ASN items at
    // 100%. A real ordinal tell looks different: b12 named three EVENTS spread
    // across a schedule and always keyed the second, so the mentions span most of
    // the prompt. Requiring that span keeps the true class and drops the stem.
    const span = Math.max(...at) - Math.min(...at);
    const spreadAsContent = span >= 40 && span >= 0.35 * prompt.length;
    if (spreadAsContent) {
      const rank = at.slice().sort((a, b) => a - b).indexOf(at[ki]);
      s.mentionRanks.push(rank);
    }
  }

  // THE MAX/MIN TELL IS MEASURED OVER THE NUMERIC SUBSET, not only over items
  // whose every option is a number.
  //
  // The first version required all options to parse, and so skipped exactly the
  // shape where "pick the bigger number" works: a three-option item with two
  // numbers and one verbal option — ["45", "both are composite", "29"],
  // ["7 + 6", "7 + 2", "both sums"], ["1/5", "2/4", "they are equal"]. Those are
  // the items this detector exists for, and it silently passed every one of them
  // (ALWAYS_MAX never fired once across 64 weeks, which is what gave it away).
  //
  // Only draws whose KEYED option is itself numeric are counted: when the answer
  // is the verbal option, "pick the biggest number" fails, and folding those in
  // as misses is the honest denominator.
  const nums = it.choices.map((c) => num(c.text));
  const numeric = nums.filter((n): n is number => n !== null);
  if (numeric.length >= 2 && new Set(numeric).size > 1 && nums[ki] !== null) {
    s.numericDraws++;
    if (nums[ki] === Math.max(...numeric)) s.maxHits++;
    if (nums[ki] === Math.min(...numeric)) s.minHits++;
    const rank = numeric.slice().sort((a, b) => a - b).indexOf(nums[ki] as number);
    s.rankHits.set(rank, (s.rankHits.get(rank) ?? 0) + 1);
  }
}

// GENERATED ∪ SHADOWED (2026-08-25, the D17-§3 residual): a fixture-shadowed
// builder (today: B14) was invisible to this gate, so its slots had never been
// measured. Shadowed cells carry `~builder` in their id and NEVER block — the
// fixture is what a child is served — but their tells now appear in the census.
const weeks: Array<{ level: any; week: number; shadowed?: boolean }> = [
  ...GENERATED_WEEKS.filter((w) => !ONLY_LEVEL || w.level === ONLY_LEVEL),
  ...SHADOWED_WEEKS.filter((w) => !ONLY_LEVEL || w.level === ONLY_LEVEL).map((w) => ({ ...w, shadowed: true })),
];
let built = 0;
const buildFailures: string[] = [];

for (const { level, week, shadowed } of weeks) {
  const id = `${level}${week}${shadowed ? '~builder' : ''}`;
  for (let i = 0; i < SEEDS; i++) {
    try {
      // Through the public entry point, so a slot is measured exactly as the
      // child receives it (fixture resolution, contract wiring and all) —
      // except for shadowed builders, which the public entry point would hide.
      const p = (shadowed
        ? buildShadowedPack(level, week, i * 7 + 1)
        : generatePack(level, week, i * 7 + 1, CONTENT_VERSION)) as unknown as Record<string, any>;
      built++;
      /**
       * AT BAND A, MEASURE WHAT THE CHILD IS SHOWN — NOT WHAT WAS AUTHORED.
       *
       * A numeric band-A item with no authored `choices` is not a free-entry
       * page: `AnswerEntry` calls `tapOptionsFor(item)` and renders four number
       * buttons. Those options exist only at render time, so this gate — which
       * reads `it.choices` — skipped every one of them. It was measuring roughly
       * half of Level A and reporting a clean pass over the rest.
       *
       * That blind spot hid a 100% tell: the old `tapOptionsFor` always produced
       * {answer-1, answer, answer+1, answer+2}, so the answer was the
       * second-smallest button on 7,440 of 7,440 items. Both weeks that had just
       * moved mastery slots to free-entry numerics — the right fix for a dead
       * option in content — landed straight in it.
       *
       * So band-A items are projected into the same `choices` shape the rest of
       * the gate already understands, and every downstream check (CONSTANT_*,
       * NEVER_CORRECT, rank tells) then applies to them unchanged.
       */
      const project = (it: Item): Item => {
        if (level !== 'A' || (it.choices && it.choices.length >= 2)) return it;
        // MIRROR `AnswerEntry`'S ORDER EXACTLY. It returns the ungraded
        // "I did it!" acknowledge button for `manual-review` BEFORE it ever
        // reaches `tapOptionsFor`, so projecting those items would judge four
        // buttons no child is ever shown — a gate manufacturing its own
        // findings. Caught by the A12 author reading this projection against
        // the component. When a gate mirrors a UI, the ORDER of the branches is
        // part of what it has to mirror.
        if ((it as unknown as { answer?: { validation?: string } }).answer?.validation === 'manual-review') return it;
        const opts = tapOptionsFor(it as never);
        if (!opts) return it;
        const answer = String((it as unknown as { answer?: { value?: unknown } }).answer?.value ?? '');
        return {
          ...it,
          choices: opts.map((o) => ({ text: String(o), isCorrect: String(o) === answer })),
        };
      };
      (p.days ?? []).forEach((d: Record<string, any>, di: number) => {
        (d.items ?? []).forEach((it: Item, ii: number) => record(id, `day${di + 1}`, ii, project(it)));
      });
      const mc = p.masteryCheck ?? {};
      (mc.formA ?? []).forEach((it: Item, ii: number) => record(id, 'formA', ii, project(it)));
      (mc.formB ?? []).forEach((it: Item, ii: number) => record(id, 'formB', ii, project(it)));
    } catch (e) {
      const msg = `${id} seed ${i * 7 + 1}: ${(e as Error).message}`;
      if (!buildFailures.includes(msg)) buildFailures.push(msg);
      break;
    }
  }
}

interface Finding { slot: string; tell: string; detail: string; prompt: string; certifying: boolean }
const findings: Finding[] = [];

for (const s of slots.values()) {
  if (s.draws < 20) continue;
  // A shadowed builder's mastery certifies nobody — the fixture is served.
  const certifying = CERTIFYING.test(s.key.split(' ')[1] ?? '') && !s.key.includes('~builder');
  const add = (tell: string, detail: string) =>
    findings.push({ slot: s.key, tell, detail, prompt: s.sample, certifying });

  const keyedTexts = [...s.keyed.entries()].sort((a, b) => b[1] - a[1]);
  if (keyedTexts.length === 1) {
    const only = keyedTexts[0][0];
    const isVerdict = VERDICTS.has(only.trim().toLowerCase());
    add(isVerdict ? 'CONSTANT_VERDICT' : 'CONSTANT_ANSWER', `always "${only}" (${s.draws} draws)`);
  }

  // A COMPARISON ITEM KEYS THE EXTREME BY DEFINITION — that is not a tell.
  // "Which is greater: 0.6 or 0.40?" MUST key the larger number, and reporting it
  // is exactly the kind of nonsense that teaches people to ignore a gate. Five of
  // the first twenty-three ALWAYS_MAX findings were this, all of them decimal
  // comparison warm-ups in Levels D.
  const asksLargest = /\bwhich (?:one )?is (?:greater|larger|bigger|more|the most|the greatest)\b|\bwhich .{0,24}\b(?:greater|larger|bigger)\b/i.test(s.sample);
  const asksSmallest = /\bwhich (?:one )?is (?:less|smaller|fewer|the least|the smallest|the fewest)\b/i.test(s.sample);
  if (s.numericDraws >= 20) {
    const maxPct = s.maxHits / s.numericDraws;
    const minPct = s.minHits / s.numericDraws;
    if (maxPct >= 0.95 && !asksLargest) add('ALWAYS_MAX', `keyed is the largest option in ${(maxPct * 100).toFixed(0)}% of ${s.numericDraws} numeric draws`);
    else if (minPct >= 0.95 && !asksSmallest) add('ALWAYS_MIN', `keyed is the smallest option in ${(minPct * 100).toFixed(0)}% of ${s.numericDraws} numeric draws`);
    else {
      // CONSTANT RANK AT ANY POSITION, not just the extremes.
      //
      // ALWAYS_MAX and ALWAYS_MIN between them miss the middle, and "pick the
      // middle number" is exactly as free as "pick the biggest". b04's two-hop
      // discrimination keyed the middle option on 100% of draws while sitting in
      // a MASTERY slot, and this gate passed it — the author measured it and said
      // so, which is the only reason it was caught. The shape is structural: with
      // distractors "did only the first move" (start+a) and "did only the second"
      // (start−b), the net start+a−b lies between them by construction, so the
      // whole item is decided by position.
      //
      // Ranking generalises both extremes, so this arm also catches a 4-option
      // item pinned to rank 2 — which neither extreme check would ever see.
      const ranks = [...s.rankHits.entries()];
      if (ranks.length) {
        const [topRank, hits] = ranks.sort((a, b) => b[1] - a[1])[0];
        const pct = hits / s.numericDraws;
        if (pct >= 0.95) {
          add('CONSTANT_NUMERIC_RANK', `keyed is always the #${topRank + 1} smallest of the ${s.optionCount} numbers on offer (${(pct * 100).toFixed(0)}% of ${s.numericDraws} draws)`);
        }
      }
    }
  }

  // THE ORDINAL TELL. b12 listed three events and always drew a half-past clock
  // face, so the answer was the SECOND event named — 800/800 exposures. Every
  // text-based check called it healthy, because the answer was a different event
  // name each seed. What is constant is the answer's RANK in the prompt, and a
  // child who notices "it's always the middle one" never reads a clock again.
  if (s.mentionRanks.length >= 20) {
    const ranks = new Map<number, number>();
    for (const r of s.mentionRanks) ranks.set(r, (ranks.get(r) ?? 0) + 1);
    const [topRank, hits] = [...ranks.entries()].sort((a, b) => b[1] - a[1])[0];
    const pct = hits / s.mentionRanks.length;
    if (pct >= 0.95 && ranks.size <= 2) {
      add('ORDINAL_TELL', `keyed option is the #${topRank + 1} thing named in the prompt in ${(pct * 100).toFixed(0)}% of ${s.mentionRanks.length} draws`);
    }
  }

  const posEntries = [...s.keyedIndex.entries()];
  if (posEntries.length === 1 && s.draws >= 20) {
    add('CONSTANT_POSITION', `key always at index ${posEntries[0][0]} of the option list`);
  }

  for (const [text, seen] of s.offered) {
    if (seen >= s.draws * 0.5 && !s.keyed.has(text) && s.keyed.size > 0) {
      if (declaredLure(s.key, text)) continue;
      add('NEVER_CORRECT', `"${text}" offered in ${seen}/${s.draws} draws, never the answer`);
    }
  }
}

const shown = findings.filter((f) => f.certifying);
const teaching = findings.filter((f) => !f.certifying);
const byTell = new Map<string, Finding[]>();
for (const f of shown) byTell.set(f.tell, [...(byTell.get(f.tell) ?? []), f]);

console.log(`\nbb-answer-entropy — ${weeks.length} weeks × ${SEEDS} seeds (${built} packs, ${slots.size} slots)`);
if (buildFailures.length) {
  console.log(`\n  BUILD FAILURES (${buildFailures.length}):`);
  for (const f of buildFailures.slice(0, 8)) console.log(`    ${f}`);
}

const ORDER = ['ALWAYS_MAX', 'ALWAYS_MIN', 'CONSTANT_NUMERIC_RANK', 'ORDINAL_TELL', 'CONSTANT_ANSWER', 'CONSTANT_VERDICT', 'NEVER_CORRECT', 'CONSTANT_POSITION'];
for (const tell of ORDER) {
  const list = byTell.get(tell);
  if (!list?.length) continue;
  console.log(`\n${tell} — ${list.length}`);
  for (const f of list) {
    console.log(`  ${f.slot}`);
    console.log(`      ${f.detail}`);
    console.log(`      "${f.prompt.slice(0, 150)}${f.prompt.length > 150 ? '…' : ''}"`);
  }
}

// CONSTANT_POSITION across a whole level means the shuffle is not running at
// all — a different, worse bug than one lazy generator, so it is called out.
const posAll = findings.filter((f) => f.tell === 'CONSTANT_POSITION');
if (posAll.length > slots.size * 0.5) {
  console.log(`\n  NOTE: ${posAll.length}/${slots.size} slots never move the key — options are probably rendered in authored order and shuffled at display time. Verify where the shuffle happens before treating these as content defects.`);
}

/**
 * ONLY TWO TELLS ARE ACTIONABLE IN A TEACHING SLOT, and reporting the rest is
 * how a gate gets switched off (L35).
 *
 * A day item's answer is often fixed BY DESIGN and correctly so. An
 * "Always, sometimes, or never true?" item states ONE claim, so its answer is a
 * fact about that claim, not a draw — and a misread lure ("6:00" offered against a
 * half-past face) is supposed to be wrong on every exposure, because it names the
 * misconception. Printing 380 of those buries the ~30 that are real.
 *
 * What survives is the pair a child can exploit without reading the item at all:
 * the keyed option is the extreme NUMBER on offer, or it is always the Nth thing
 * named. Both have a concrete fix, which is why they are worth printing.
 */
const ACTIONABLE_IN_TEACHING = new Set(['ALWAYS_MAX', 'ALWAYS_MIN', 'CONSTANT_NUMERIC_RANK', 'ORDINAL_TELL']);

if (teaching.some((f) => ACTIONABLE_IN_TEACHING.has(f.tell))) {
  const byT = new Map<string, Finding[]>();
  for (const f of teaching.filter((f) => ACTIONABLE_IN_TEACHING.has(f.tell))) byT.set(f.tell, [...(byT.get(f.tell) ?? []), f]);
  const act = teaching.filter((f) => ACTIONABLE_IN_TEACHING.has(f.tell)).length;
  console.log(`\n--- TEACHING slots (day items): ${act} actionable tell(s), reported not failed`);
  console.log(`    (${teaching.length - act} by-design tells suppressed: fixed ASN claims and misread lures) ---`);
  for (const tell of ORDER) {
    const list = byT.get(tell);
    if (!list?.length) continue;
    console.log(`\n  ${tell} — ${list.length}`);
    for (const f of list.slice(0, SHOW_ALL ? 999 : 8)) {
      console.log(`    ${f.slot}  ${f.detail}`);
      console.log(`      "${f.prompt.replace(/\[image:[^\]]*\]/, '').trim().slice(0, 96)}"`);
    }
    if (!SHOW_ALL && list.length > 8) console.log(`    … and ${list.length - 8} more (--all)`);
  }
  console.log(`\n  For ALWAYS_MAX the fix is a distractor that OVERSHOOTS: misconceptions of the`);
  console.log(`  "stop early" / "add instead of multiply" family are all smaller than a product,`);
  console.log(`  so "pick the biggest" wins. Using a factor twice, counting an edge row twice, or`);
  console.log(`  doubling-then-adding are real misconceptions that land ABOVE the answer.`);
}

const fails = shown.filter((f) => f.tell !== 'CONSTANT_POSITION');
const actionable = teaching.filter((f) => ACTIONABLE_IN_TEACHING.has(f.tell)).length;
console.log(`\n${fails.length === 0 ? 'PASS' : 'FAIL'} — ${fails.length} guessable MASTERY slot(s); ${actionable} actionable teaching-slot tell(s)\n`);
process.exit(fails.length === 0 ? 0 : 1);
