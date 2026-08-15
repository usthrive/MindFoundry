/**
 * Guessability census — can a child score on this generator without doing any
 * mathematics?
 *
 * WHY THIS EXISTS. The standing nine-gate battery measures whether an item's
 * answer is CORRECT. It has nothing to say about whether the answer is
 * GUESSABLE. Six generator families were hand-pre-flighted before authoring
 * their week and six of six carried a free-scoring strategy — five of them at
 * 100% — every one of which had passed `bb-verify-packs`, `bb-family-test`,
 * QG-5/11/12/13 and the rest, because every item's answer was right:
 *
 *     percentOfEquality    say "they are equal", never read the numbers   100%
 *     partWholeVsPartPart  pick the smallest fraction                     100%
 *     stackedPercentTrap   pick the middle amount                         100%
 *     betterBuy            pick the bigger pack                           100%
 *     minusNegativeTrap    pick the biggest number                        100%
 *     countTheSignsTrap    say "positive"                                68.7%
 *
 * They were being found one week at a time, by hand, which is slow and depends
 * on remembering to look. This finds them at the source, over every generator
 * at once. Two signatures account for nearly all of them:
 *
 *   NUDGE-COLLAPSE     a repair loop that WALKS a value toward legality
 *                      (`while (bad) x += 1`) does not remove the excluded
 *                      answers, it shunts them onto their neighbours — piling
 *                      mass on the first legal value. Caught by §1 (answer
 *                      concentration).
 *   CONSTANT-RANK      options built from one construction have a fixed ORDER
 *                      or a fixed WINNER even when the values vary. Caught by
 *                      §2 (card rank) and §3 (card identity). Two separate
 *                      repairs in this program replaced "pick the biggest" at
 *                      100% with "pick the middle" at 100%, so the rank must be
 *                      RE-MEASURED after every fix, not reasoned about.
 *
 * REPORT-ONLY, AND DELIBERATELY SO. Many flags are legitimate: a "which is
 * greater" item's key is genuinely the larger card about half the time, a mode
 * is always a member of its own data, an ASN item has three fixed words. A gate
 * that cries wolf gets switched off (the QG-12 lesson), so this prints a census
 * a human reads and triages. What becomes binding is an owner decision, taken
 * after reading the first run — not in the same change that lands the census.
 *
 * WHAT IT DOES NOT SEE, stated plainly:
 *   · It sweeps GENERATORS, not authored week content. `items.classify` — where
 *     the Always/Sometimes/Never cards live — takes its three cards from the
 *     week module as config, so its guessability belongs to the corpus scan,
 *     not here. It is listed AUTHORED-CONTENT below rather than swept, because
 *     an unmeasured generator must never read as a clean one.
 *   · One difficulty per run (3 by default, `--diff N` to change). A defect that
 *     only exists at difficulty 5 is invisible until that run is made.
 *   · Nothing about whether the WEEK that serves the generator balances it. A
 *     generator at 50% "largest" is fine if its week pairs it with one at 50%
 *     "smallest"; that is a per-week measurement and stays the author's job.
 *
 * Run:  npx tsx scripts/bb-guessability-test.ts [draws] [--all] [--diff N] [--only substr]
 */

import { streamRng } from '../src/modules/best-brains/generator/rng';
import { TupleGuard } from '../src/modules/best-brains/generator/templates/shared';
import { promptText } from '../src/modules/best-brains/figures/prompt';
import type { ItemDraft } from '../src/modules/best-brains/generator/templates/shared';

import * as clock from '../src/modules/best-brains/generator/templates/lib/clock';
import * as money from '../src/modules/best-brains/generator/templates/lib/money';
import * as ratio from '../src/modules/best-brains/generator/templates/lib/ratio';
import * as integers from '../src/modules/best-brains/generator/templates/lib/integers';
import * as stats from '../src/modules/best-brains/generator/templates/lib/stats';
import * as earlynumber from '../src/modules/best-brains/generator/templates/lib/earlynumber';
import * as algebra from '../src/modules/best-brains/generator/templates/lib/algebra';
import * as items from '../src/modules/best-brains/generator/templates/lib/items';

const argv = process.argv.slice(2);
/**
 * Flags are consumed before the positional draw count is read. The naive form
 * (`argv.find(/^\d+$/)`) was written first and is wrong twice over: with no
 * `--diff` present, `indexOf` returns -1 and `argv[0]` becomes the difficulty,
 * so the first full run silently swept at difficulty 3000 and reported it in
 * its own header. Read your script's header line.
 */
const diffAt = argv.indexOf('--diff');
const onlyAt = argv.indexOf('--only');
const consumed = new Set<number>([diffAt, diffAt + 1, onlyAt, onlyAt + 1].filter((i) => i > 0));
const DIFFICULTY = diffAt >= 0 ? Number(argv[diffAt + 1]) : 3;
const ONLY = onlyAt >= 0 ? argv[onlyAt + 1] : null;
const SHOW_ALL = argv.includes('--all');
const DRAWS = Number(argv.find((a, i) => !consumed.has(i) && /^\d+$/.test(a)) ?? 3000);

// --- Thresholds -------------------------------------------------------------
// EVERY THRESHOLD IS AN EXCESS OVER CHANCE, never a raw share. The first cut
// used flat shares and flagged dozens of two-card items for keying option A on
// 50% of draws — which is exactly chance and exactly what a fair shuffle does.
// A census whose loudest rows are arithmetic tautologies is a census nobody
// finishes reading, so the baseline travels with every number printed here:
// with n cards, chance for one rank bucket / one card / one position is 1/n.
const T = {
  /** Points above chance before a choice-item strategy is worth a human's time. */
  excess: 0.15,
  /**
   * Free-entry answers have no card count, so the baseline is uniform over the
   * answers the generator actually reaches: 1/distinct. A flat 15% share
   * threshold flagged `countByTens` at 25.5% over four possible answers, which
   * is uniform to within noise — the same tautology the choice side had.
   */
  freeExcess: 0.15,
  /** …but a free-entry slot with almost no answer space is worth a look anyway. */
  freeAnswerFloor: 0.35,
  /** A card offered this often and keyed never is the L38 unkeyable card. */
  deadCardOffered: 0.4,
};

/**
 * Sample arguments for the generators that REQUIRE options.
 *
 * The first seven families are copied verbatim from `bb-family-test.ts` so the
 * two suites exercise the same surface; `items` is added here because it is the
 * Level-D library that Levels B/C/D were built on (50 factories, never swept for
 * guessability). A generator that needs options and is not listed shows up as
 * UNEXERCISED, which is the honest outcome.
 */
const ARGS: Record<string, unknown[][]> = {
  // earlynumber
  'earlynumber.countArrangement': [[{ min: 1, max: 5 }], [{ min: 4, max: 9, arrangement: 'scattered' }]],
  'earlynumber.countByTens': [[{ minTens: 2, maxTens: 5 }]],
  'earlynumber.howManyChoice': [[{ min: 2, max: 6 }]],
  'earlynumber.setForNumeral': [[{ min: 2, max: 6 }], [{ min: 3, max: 8, groups: 3 }]],
  'earlynumber.tenFrameRead': [[{ min: 1, max: 9 }], [{ min: 11, max: 19, frames: 2 }]],
  'earlynumber.tenFrameBuild': [[{ min: 2, max: 8 }]],
  'earlynumber.tenFrameEmpty': [[{ min: 2, max: 8 }], [{ min: 1, max: 4, size: 5 }]],
  'earlynumber.partnersHiding': [[{ total: 5 }], [{ total: 10 }]],
  'earlynumber.partnerBox': [[{ total: 5 }], [{ total: 10 }]],
  'earlynumber.allWaysToMake': [[{ total: 5 }]],
  'earlynumber.neighbourNumber': [[{ kind: 'before', min: 2, max: 9 }], [{ kind: 'between', min: 2, max: 9 }]],
  'earlynumber.pickExtreme': [[{ which: 'smallest', min: 1, max: 9 }], [{ which: 'biggest', min: 2, max: 10 }]],
  'earlynumber.patternNext': [[{ kind: 'AB' }], [{ kind: 'ABB' }], [{ kind: 'AAB' }]],
  'earlynumber.pictureJoin': [[{ min: 1, max: 5, maxTotal: 10 }]],
  'earlynumber.pictureTakeAway': [[{ min: 3, max: 9 }]],
  'earlynumber.joinOrTakeAway': [[{ min: 2, max: 8 }]],
  'earlynumber.numeralTrap': [[{ trap: 'six-nine' }], [{ trap: 'teen-ty' }], [{ trap: 'digit-swap' }]],
  'earlynumber.compareSets': [[{ which: 'more', min: 2, max: 8 }], [{ which: 'fewer', min: 2, max: 8 }]],
  'earlynumber.compareMeasure': [[{ attr: 'length' }], [{ attr: 'weight' }], [{ attr: 'capacity' }]],
  'earlynumber.solidChoice': [[{ test: 'rolls' }], [{ test: 'stacks' }]],
  'earlynumber.puppetSlip': [[{ slip: 'double-count' }], [{ slip: 'skip-count' }], [{ slip: 'count-back-start' }], [{ slip: 'teen-writing' }]],
  'earlynumber.sortAndTell': [[{ min: 2, max: 9 }]],
  // clock
  'clock.readClock': [['hour'], ['half'], ['quarter'], ['five'], ['minute']],
  'clock.drawHands': [['half'], ['quarter']],
  'clock.elapsedMinutes': [['five']],
  'clock.elapsedThenMore': [['five']],
  'clock.misreadClockEA': [['hand-swap'], ['quarter-flip'], ['hour-drift']],
  // money
  'money.miscountEA': [['nickel-as-1'], ['count-coins']],
  // ratio
  'ratio.percentConversion': [['to-decimal'], ['to-fraction'], ['from-fraction']],
  // integers
  'integers.orderTemperatures': [['asc'], ['desc']],
  // algebra
  'algebra.oneStepEquation': [['add'], ['sub'], ['mul'], ['div']],
  'algebra.evaluateBothAtX': [['equivalent'], ['distribute-once']],
  'algebra.solveInequality': [['one'], ['two']],
  // items — the Level-D library. Ranges are the ones the D week builders pass.
  'items.roundWhole': [[1, 10, 999], [2, 100, 9999], [3, 1000, 99999]],
  'items.addWhole': [[100, 9999], [1000, 99999]],
  'items.subWhole': [[100, 9999], [1000, 99999, true]],
  'items.multiply': [[2, 9, 10, 99], [11, 99, 11, 99]],
  'items.divideExact': [[2, 9, 10, 99], [11, 25, 10, 40]],
  'items.divideRemainder': [[3, 9, 20, 99], [11, 25, 100, 999]],
  'items.fracAddSubLike': [[1], [-1]],
  'items.fracAddSubUnlike': [[1], [-1]],
  'items.decRound': [[1], [2], [3]],
  'items.decAddSub': [[1], [-1]],
  'items.decMultiply': [[false], [true]],
  'items.evalExpr': [[false], [true]],
  'items.angleArith': [['supplementary'], ['complementary'], ['triangle']],
  'items.storyDivideUse': [['round-up'], ['drop'], ['remainder']],
  'items.storyDecRound': [[1], [2]],
  'items.storyRound': [[1, 10, 999], [3, 1000, 99999]],
  'items.storyDecimalMoney': [[1], [-1]],
  'items.storyFractionCombine': [[1], [-1], [1, true], [-1, true]],
};

/**
 * Not swept, with the reason recorded. These take their content from the WEEK
 * module, so what they generate is authored, not drawn — a sweep would measure
 * this file's sample config and report it as a library property, which is a
 * false diagnosis of exactly the kind this suite exists to avoid.
 */
const AUTHORED_CONTENT = new Set(['items.reasoning', 'items.classify', 'items.asWarmup']);

const FAMILIES: Array<[string, Record<string, unknown>]> = [
  ['clock', clock], ['money', money], ['ratio', ratio], ['integers', integers],
  ['stats', stats], ['earlynumber', earlynumber], ['algebra', algebra], ['items', items],
];

// --- Value parsing ----------------------------------------------------------

/**
 * Parse a card's text as a scalar, or return null.
 *
 * STRICTNESS IS THE POINT. Stripping non-digits turns "2/5" into 25 and that
 * produced a false diagnosis during this program — it reported a middle-rank
 * defect on a generator whose real fault was smallest-rank. So every form is
 * matched explicitly and anything unrecognised is refused, not guessed. The
 * refused texts are printed at the end of the run so the parser's blind spots
 * are visible rather than silently scoring as "not a numeric set".
 *
 * The UNIT travels with the value: a set mixing "50%" and "0.5" is not rankable
 * on one axis, and pretending otherwise invents an ordering.
 */
function parseValue(raw: string): { value: number; unit: string } | null {
  let s = raw.trim().toLowerCase().replace(/,/g, '');
  if (!s) return null;
  // A colon is a ratio ("3:4") or a time ("8:30") — a pair, never a scalar.
  if (s.includes(':')) return null;
  let sign = 1;
  if (/^[-−–]/.test(s)) {
    sign = -1;
    s = s.slice(1).trim();
  }
  let unit = '';
  if (s.startsWith('$')) {
    unit = '$';
    s = s.slice(1).trim();
    if (/^[-−–]/.test(s)) { sign = -1; s = s.slice(1).trim(); }
  }
  const split = /^([\d\s./]+)(.*)$/.exec(s);
  if (!split) return null;
  const core = split[1].trim();
  const rest = split[2].trim();
  if (rest) {
    // A single trailing unit token is fine ("12 cm", "4 cm²", "20°", "25%").
    // Anything wordier ("20 out of 50", "3 and a half") is not a scalar.
    if (!/^([%°¢]|[a-z][a-z]*[²³]?\.?|[²³])$/.test(rest)) return null;
    unit += rest.replace(/\.$/, '');
  }
  let m = /^(\d+)\s+(\d+)\/(\d+)$/.exec(core); // mixed number "2 1/2"
  if (m) return { value: sign * (Number(m[1]) + Number(m[2]) / Number(m[3])), unit };
  m = /^(\d+)\/(\d+)$/.exec(core); // fraction "2/5"
  if (m) return Number(m[2]) === 0 ? null : { value: (sign * Number(m[1])) / Number(m[2]), unit };
  if (/^\d+(\.\d+)?$/.test(core) || /^\.\d+$/.test(core)) return { value: sign * Number(core), unit };
  return null;
}

// --- Per-generator accumulator ---------------------------------------------

interface Acc {
  label: string;
  family: string;
  draws: number;
  threw: number;
  /** Free-entry (no choices) answers, by value. */
  answers: Map<string, number>;
  freeDraws: number;
  /** Choice draws. */
  choiceDraws: number;
  /** Card text → how often offered / how often keyed. */
  cards: Map<string, { offered: number; keyed: number }>;
  /** Key's rank among the cards, largest-first, when every card parses. */
  rankable: number;
  rankLargest: number;
  rankSmallest: number;
  rankMiddle: number;
  rankTied: number;
  /** Unrankable reasons, and a sample of what could not be parsed. */
  unparsed: number;
  mixedUnit: number;
  unparsedSamples: Set<string>;
  /** Key by TEXT LENGTH — "pick the longest word" is the ASN tell. */
  lenLongest: number;
  lenShortest: number;
  lenTied: number;
  /** Key's option position (A/B/C/…). */
  positions: Map<string, number>;
  /** The same text twice in one card set. */
  dupSets: number;
  dupSamples: Set<string>;
  /** No option marked correct — a generator fault, not a guessability one. */
  noKey: number;
  /** The answer printed in its own prompt (report-only, as in bb-family-test). */
  selfLeak: number;
  cardCounts: Set<number>;
  /** Cards summed over choice draws — the mean is what every baseline is 1/n of. */
  cardTotal: number;
}

function newAcc(label: string, family: string): Acc {
  return {
    label, family, draws: 0, threw: 0,
    answers: new Map(), freeDraws: 0,
    choiceDraws: 0, cards: new Map(),
    rankable: 0, rankLargest: 0, rankSmallest: 0, rankMiddle: 0, rankTied: 0,
    unparsed: 0, mixedUnit: 0, unparsedSamples: new Set(),
    lenLongest: 0, lenShortest: 0, lenTied: 0,
    positions: new Map(), dupSets: 0, dupSamples: new Set(),
    noKey: 0, selfLeak: 0, cardCounts: new Set(), cardTotal: 0,
  };
}

const LEAK_EXEMPT_TYPES = new Set(['error-analysis', 'drawing', 'representation', 'classification']);

function observe(acc: Acc, d: ItemDraft): void {
  acc.draws++;

  if (!d.choices || d.choices.length === 0) {
    // (1) ANSWER CONCENTRATION — the nudge-collapse detector.
    acc.freeDraws++;
    const v = String(d.answer.value).trim();
    acc.answers.set(v, (acc.answers.get(v) ?? 0) + 1);
  } else {
    const cards = d.choices;
    acc.choiceDraws++;
    acc.cardCounts.add(cards.length);
    acc.cardTotal += cards.length;
    const key = cards.find((c) => c.isCorrect);
    if (!key) {
      acc.noKey++;
      return;
    }

    // (3) CARD IDENTITY — offered vs keyed, per text.
    const texts = cards.map((c) => c.text.trim());
    for (const t of new Set(texts)) {
      const e = acc.cards.get(t) ?? { offered: 0, keyed: 0 };
      e.offered++;
      acc.cards.set(t, e);
    }
    const keyText = key.text.trim();
    const ke = acc.cards.get(keyText);
    if (ke) ke.keyed++;

    // (4) DUPLICATE CARD SETS.
    if (new Set(texts).size < texts.length) {
      acc.dupSets++;
      if (acc.dupSamples.size < 3) acc.dupSamples.add(texts.join(' / '));
    }

    // Key POSITION — makeChoices shuffles, so a skew here is a shuffle failure
    // or a hand-built option list that never moved the answer.
    acc.positions.set(key.key, (acc.positions.get(key.key) ?? 0) + 1);

    // (2) CARD RANK — only when every card is a scalar in the SAME unit.
    const parsed = texts.map(parseValue);
    if (parsed.some((p) => p === null)) {
      acc.unparsed++;
      for (const [i, p] of parsed.entries()) {
        if (p === null && acc.unparsedSamples.size < 4) acc.unparsedSamples.add(texts[i]);
      }
    } else if (new Set(parsed.map((p) => p!.unit)).size > 1) {
      acc.mixedUnit++;
    } else {
      const vals = parsed.map((p) => p!.value);
      const keyVal = parseValue(keyText)!.value;
      const ties = vals.filter((v) => Math.abs(v - keyVal) < 1e-9).length;
      acc.rankable++;
      if (ties > 1) {
        acc.rankTied++;
      } else {
        const bigger = vals.filter((v) => v > keyVal + 1e-9).length;
        const smaller = vals.filter((v) => v < keyVal - 1e-9).length;
        if (bigger === 0) acc.rankLargest++;
        else if (smaller === 0) acc.rankSmallest++;
        else acc.rankMiddle++;
      }
    }

    // Key by TEXT LENGTH — reads the claim without reading the mathematics.
    const lens = texts.map((t) => t.length);
    const keyLen = keyText.length;
    const lenTies = lens.filter((l) => l === keyLen).length;
    if (lenTies > 1) acc.lenTied++;
    else if (keyLen === Math.max(...lens)) acc.lenLongest++;
    else if (keyLen === Math.min(...lens)) acc.lenShortest++;
  }

  // (5) SELF-LEAK — the answer printed in its own prompt. Report-only: a mode is
  // always in its data and a translation task legitimately prints its operands.
  if (!LEAK_EXEMPT_TYPES.has(d.type) && d.answer.validation !== 'choice-key' && !d.choices) {
    const ans = String(d.answer.value).trim();
    const tokens = promptText(d.prompt).match(/-?\d+(?:\.\d+)?/g) ?? [];
    if (/^-?\d+$/.test(ans) && tokens.length < 4 && tokens.includes(ans)) acc.selfLeak++;
  }
}

// --- Flagging ---------------------------------------------------------------

/** `rate` is the EXCESS over chance — what the sort and the triage order use. */
interface Flag { code: string; detail: string; rate: number }

const pct = (x: number): string => `${(x * 100).toFixed(1)}%`;

function flagsFor(a: Acc): Flag[] {
  const f: Flag[] = [];
  /** Mean cards per set — the denominator every baseline below is 1/n of. */
  const n = a.choiceDraws > 0 ? a.cardTotal / a.choiceDraws : 0;
  /** share vs its chance baseline: flag only when the excess clears T.excess. */
  const over = (code: string, share: number, chance: number, say: string): void => {
    if (share - chance > T.excess) {
      f.push({ code, rate: share - chance, detail: `${say} — ${pct(share)} vs ${pct(chance)} chance (+${pct(share - chance)})` });
    }
  };

  if (a.freeDraws > 0) {
    const top = [...a.answers.entries()].sort((x, y) => y[1] - x[1])[0];
    const share = top[1] / a.freeDraws;
    const uniform = 1 / a.answers.size;
    if (share - uniform > T.freeExcess || share > T.freeAnswerFloor) {
      f.push({
        code: 'CONC',
        rate: share - uniform,
        detail: `answer "${top[0]}" on ${pct(share)} of ${a.freeDraws} free-entry draws vs ${pct(uniform)} uniform over the ${a.answers.size} it reaches (+${pct(share - uniform)}) — nudge-collapse signature`,
      });
    }
  }

  if (a.rankable > 0 && n > 0) {
    const known = a.rankable - a.rankTied;
    if (known > 0) {
      // With n cards: chance of the key being the largest, or the smallest, is
      // 1/n each; of it being anywhere strictly inside, (n-2)/n. Using 1/n for
      // "middle" would report every 4-card generator as middle-biased.
      over('RANK', a.rankLargest / known, 1 / n, `"pick the largest card" scores on ${known} rankable draws`);
      over('RANK', a.rankSmallest / known, 1 / n, `"pick the smallest card" scores on ${known} rankable draws`);
      over('RANK', a.rankMiddle / known, Math.max(0, (n - 2) / n), `"pick a middle card" scores on ${known} rankable draws`);
      // The rank analogue of the L38 dead card, and the clearer way to say what
      // two overlapping RANK rows are both circling: a rank that is NEVER the
      // key lets a child strike an option without reading it.
      if (n >= 3 && known >= 500) {
        for (const [name, count] of [['largest', a.rankLargest], ['smallest', a.rankSmallest]] as Array<[string, number]>) {
          if (count === 0) {
            f.push({ code: 'NORANK', rate: 1 / n, detail: `the ${name} card is NEVER the key across ${known} rankable draws — "never pick the ${name}" strikes 1 of ${n.toFixed(0)} without reading` });
          }
        }
      }
    }
  }

  if (a.choiceDraws > 0 && n > 0) {
    over('LEN', a.lenLongest / a.choiceDraws, 1 / n, '"pick the longest answer" scores');
    over('LEN', a.lenShortest / a.choiceDraws, 1 / n, '"pick the shortest answer" scores');

    const topPos = [...a.positions.entries()].sort((x, y) => y[1] - x[1])[0];
    if (topPos) over('POS', topPos[1] / a.choiceDraws, 1 / n, `key sits at option ${topPos[0]}; the shuffle is not moving the answer`);

    const byKeyed = [...a.cards.entries()].sort((x, y) => y[1].keyed - x[1].keyed);
    if (byKeyed.length) over('IDENT', byKeyed[0][1].keyed / a.choiceDraws, 1 / n, `card "${byKeyed[0][0]}" is the key; saying it every time scores`);

    // Not a rate comparison: a card a child is repeatedly offered and can NEVER
    // pick is wrong at any frequency (L38), so this one keeps an absolute floor.
    const dead = [...a.cards.entries()]
      .filter(([, c]) => c.keyed === 0 && c.offered / a.choiceDraws > T.deadCardOffered)
      .sort((x, y) => y[1].offered - x[1].offered);
    for (const [text, c] of dead.slice(0, 3)) {
      f.push({ code: 'DEAD', rate: c.offered / a.choiceDraws, detail: `card "${text}" is offered on ${pct(c.offered / a.choiceDraws)} of draws and keyed on NONE — L38 unkeyable card` });
    }

    if (a.dupSets > 0) {
      f.push({ code: 'DUP', rate: a.dupSets / a.choiceDraws, detail: `the same text twice in one card set on ${pct(a.dupSets / a.choiceDraws)} of draws (e.g. ${[...a.dupSamples][0]})` });
    }
    if (a.noKey > 0) {
      f.push({ code: 'NOKEY', rate: a.noKey / a.choiceDraws, detail: `no option marked correct on ${a.noKey} draws` });
    }
  }

  if (a.threw > 0) f.push({ code: 'THREW', rate: a.threw / DRAWS, detail: `threw on ${a.threw} of ${DRAWS} draws` });
  return f;
}

// --- Sweep ------------------------------------------------------------------

const accs: Acc[] = [];
const unexercised: string[] = [];
const authored: string[] = [];

for (const [family, mod] of FAMILIES) {
  const names = Object.keys(mod).filter((k) => typeof (mod as Record<string, unknown>)[k] === 'function');
  for (const name of names) {
    const qualified = `${family}.${name}`;
    if (ONLY && !qualified.includes(ONLY)) continue;
    if (AUTHORED_CONTENT.has(qualified)) { authored.push(qualified); continue; }

    const factory = (mod as Record<string, (...a: unknown[]) => unknown>)[name];
    const argSets = ARGS[qualified] ?? [[]];
    const gens: Array<[unknown, string]> = [];
    for (const a of argSets) {
      try {
        const v = factory(...(a as unknown[]));
        if (typeof v === 'function') {
          gens.push([v, (a as unknown[]).length ? `(${(a as unknown[]).map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(',')})` : '']);
        }
      } catch {
        /* a helper, or an arg shape this table gets wrong — reported as UNEXERCISED */
      }
    }
    if (gens.length === 0) { unexercised.push(qualified); continue; }

    for (const [gen, suffix] of gens) {
      const acc = newAcc(`${qualified}${suffix}`, family);
      for (let i = 0; i < DRAWS; i++) {
        const rng = streamRng(i * 7919 + 13, 'guess');
        const guard = new TupleGuard();
        try {
          observe(acc, (gen as (r: unknown, g: unknown, diff: number) => ItemDraft)(rng, guard, DIFFICULTY));
        } catch {
          acc.threw++;
        }
      }
      accs.push(acc);
    }
  }
}

// --- Report -----------------------------------------------------------------

console.log(`\nGUESSABILITY CENSUS — ${DRAWS} draws per generator at difficulty ${DIFFICULTY}`);
console.log('Report-only. Every line below is a question for a human, not a verdict.');
console.log('Choice rates are shown against their chance baseline (1/n cards); the sort is by EXCESS.\n');

const flagged = accs
  .map((a) => ({ a, f: flagsFor(a) }))
  .filter((x) => x.f.length > 0)
  .sort((x, y) => Math.max(...y.f.map((z) => z.rate)) - Math.max(...x.f.map((z) => z.rate)));

console.log(`  ${accs.length} generator configurations swept · ${flagged.length} carry at least one flag · ${accs.length - flagged.length} clean\n`);

for (const { a, f } of flagged) {
  const n = a.choiceDraws > 0 ? (a.cardTotal / a.choiceDraws).toFixed(1) : '—';
  console.log(`\n  ${a.label}   [${a.choiceDraws ? `${n} cards/set` : 'free-entry'}]`);
  for (const flag of f) console.log(`      ${flag.code.padEnd(6)} ${flag.detail}`);
}

if (SHOW_ALL) {
  console.log('\n\n── every configuration, flagged or not ' + '─'.repeat(30));
  let lastFamily = '';
  for (const a of accs) {
    if (a.family !== lastFamily) { console.log(`\n  ${a.family}`); lastFamily = a.family; }
    const known = a.rankable - a.rankTied;
    const bits: string[] = [];
    if (a.freeDraws) {
      const top = [...a.answers.entries()].sort((x, y) => y[1] - x[1])[0];
      bits.push(`free: ${a.answers.size} distinct, top "${top[0]}" ${pct(top[1] / a.freeDraws)}`);
    }
    if (a.choiceDraws) {
      const byKeyed = [...a.cards.entries()].sort((x, y) => y[1].keyed - x[1].keyed);
      bits.push(`choice ${[...a.cardCounts].join('/')}-card: top key "${byKeyed[0][0]}" ${pct(byKeyed[0][1].keyed / a.choiceDraws)}`);
      if (known > 0) bits.push(`rank L${pct(a.rankLargest / known)} M${pct(a.rankMiddle / known)} S${pct(a.rankSmallest / known)}`);
      else bits.push(`rank n/a (${a.unparsed} unparsed, ${a.mixedUnit} mixed-unit, ${a.rankTied} tied)`);
    }
    console.log(`    ${a.label.padEnd(46)} ${bits.join(' · ')}`);
  }
}

// Parser blind spots, so a "not a numeric set" is never taken on trust.
const unparsedRows = accs.filter((a) => a.unparsed > 0 && a.unparsedSamples.size > 0);
if (unparsedRows.length) {
  console.log('\n\n── card texts the parser refused (verify these are genuinely non-scalar) ──');
  for (const a of unparsedRows) {
    console.log(`    ${a.label.padEnd(46)} ${pct(a.unparsed / a.choiceDraws)} of sets · e.g. ${[...a.unparsedSamples].map((s) => JSON.stringify(s)).join(', ')}`);
  }
}

const leaky = accs.filter((a) => a.selfLeak > 0).sort((x, y) => y.selfLeak - x.selfLeak);
if (leaky.length) {
  console.log('\n── answer-in-prompt census (report-only; most are legitimate) ──');
  for (const a of leaky) console.log(`    ${String(a.selfLeak).padStart(5)}×  ${a.label}`);
}

if (authored.length) console.log(`\n  AUTHORED-CONTENT (config comes from the week, not the draw — swept by the corpus scan, not here): ${authored.join(', ')}`);
if (unexercised.length) console.log(`\n  UNEXERCISED (helpers, or needing an ARGS entry): ${unexercised.length}\n    ${unexercised.join(', ')}`);

console.log(`\n${accs.length} configurations · ${flagged.length} flagged. Census complete (no pass/fail — read and triage).`);
