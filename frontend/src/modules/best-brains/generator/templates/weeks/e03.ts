/**
 * Level E · Week 3 — "Meeting percent" (conceptId: meeting-percent).
 *
 * FILL-ARCHITECTURE §6 row E3: anchor "the per-hundred grid"; key multi-step
 * "convert then compare"; error-analysis "25% written 25.0 (the point drop)";
 * discrimination "40% of 50 vs 50% of 40 (equal!)"; Day-5 signature "three
 * names, one amount (percent / fraction / decimal)". NOT R-flagged — every item
 * below is computable, and nothing ships as manual-review except the written
 * strand the band-E contract requires anyway.
 *
 * THE WEEK'S CLAIM. A percent is not an amount. It is a count out of a hundred,
 * and a hundred is a scale the quantity itself never has to reach: a club of
 * 240 and a club of 40 can both be 35% anything. That single idea decides
 * everything below:
 *  - the per-hundred grid is the anchor because it is the only picture in which
 *    the percent IS the thing you count. Ten by ten, shade the percent, and the
 *    share is on the page before any arithmetic happens;
 *  - two shares written over different totals cannot be set beside each other
 *    as they stand, so the week's headline chain is convert THEN compare —
 *    bring the count-share to its per-hundred name first, and only then read
 *    the difference. That is what a percent is FOR, and it is why the recipe
 *    puts the comparison at the centre rather than the arithmetic;
 *  - one share has three names, and they are three spellings of one number, not
 *    three quantities. The Day-5 item asks for all three of one share, the
 *    Day-3 discrimination offers three records of one share with one of them
 *    out of step, and the single-step conversions run the swap in all three
 *    directions;
 *  - and because a percent looks like a whole number while behaving like a
 *    hundredth, the size of an answer is the thing that gives a slip away —
 *    which is why the estimate-first probe asks for a size before any working
 *    and why the recipe's error-analysis is a misplaced point.
 *
 * Each of the Level-E ceiling lifts is carried by its own item, never doubled up:
 *  - INVERSE-START — `msRecoverTheStock`: the story states the part, not the
 *    whole, so the total the percent was written over has to be rebuilt before
 *    anything can be taken away from it — and no sentence asks for that;
 *  - CHECK-BACK — the same item, wrapped: the honest check on a recovered total
 *    is whether the two groups you end with put the stated share back together;
 *  - HAS-DISTRACTOR — `msPercentThenDelivery` states a count of display windows
 *    that is never used, and it is the seductive kind of spare number because
 *    the story invites a division by it.
 *  - ESTIMATE-FIRST — `sitPercentFullEstimate`, reachable ONLY through the
 *    wrapper (kit §E2.2), so it does not spend two ladder slots on one wording.
 *
 * FIVE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. `percentOffPrice`, `percentOfVsPercentOff`, `stackedPercentTrap` and
 *     `msDiscountThenTax` ARE NOT SERVED, although all four are G4 percent
 *     generators and three of them would have fitted a day slot without
 *     complaint. They are E17's cell — "Percent applications: tax, tip,
 *     discount, markup" (catalog) — and E3 is the week where a percent is MET.
 *     Serving the sale-price arithmetic here would spend E17's content a
 *     fortnight early and leave that week re-teaching its own anchor. The one
 *     sale frame this week does carry is `eaPercentPointDrop`, which the recipe
 *     names by hand and which is a percent-OF item (the SIZE of a reduction)
 *     wearing a shop sign.
 *
 *  2. `percentOfEquality`'S DRAW IS LEFT EXACTLY AS THE LIBRARY SHIPS IT. Its
 *     history is the reason: the item asked "which is larger, p% of q or q% of
 *     p", the two are always equal (both are pq/100), and "say equal, never
 *     read the numbers" scored 100% — on the week's own headline
 *     discrimination. The repair draws WHETHER the two sides are equal, so the
 *     identity now survives on about a third of draws and is met as a surprise
 *     rather than learnt as a password. A week that constrained the draw back
 *     to the identity — to make the recipe's "(equal!)" land every time — would
 *     restore that 100% strategy in the act of teaching against it. So the
 *     surprise is rationed by the generator and the week does not touch it; the
 *     identity is instead SAID, once, where saying it costs nothing: in the
 *     lesson script and the parent strip.
 *
 *  3. `discrimThreeNames` KEYS A LABEL, NOT A VALUE, and that is what makes it
 *     measurable. The three records are a percent, a decimal and a fraction of
 *     one share, with one of them replaced by the COMPLEMENT share (the single
 *     commonest percent error there is: "35% went by bus" read as "35% stayed
 *     behind"). Two constructions were rejected before this one:
 *       · keying the impostor's TEXT made the card set three values in three
 *         notations, which `parseValue` cannot rank and a child ranks by eye;
 *       · a place-value impostor (the point moved one place instead of two, so
 *         0.35 becomes 0.035) is detectable by MAGNITUDE without any
 *         conversion — every impostor decimal would have read "0.0…" while
 *         almost no honest one does, which is a free strike on a third of
 *         draws. The complement impostor has no such tell: it is larger than
 *         the truth when the share is under half and smaller when it is over,
 *         so nothing about its size separates it.
 *     Which notation carries the impostor is drawn in equal thirds, so "pick
 *     the fraction" — and "pick the longest card", since the labels are three
 *     fixed strings — sit exactly at chance. And because all three values print
 *     in the PROMPT, the item carries a surface signature and is guarded
 *     against repeating itself inside a pack, which a labels-only prompt would
 *     not have been.
 *
 *  4. THE ALWAYS/SOMETIMES/NEVER ITEM DRAWS ITS CLAIM, and it does so because
 *     the authored form measured as an L38 card. `items.classify` takes its
 *     three cards as config, so a week that authors one claim ships a slot whose
 *     key never moves: this week's first version keyed "sometimes" on 400 of 400
 *     served packs, with "always" and "never" offered every time and keyed
 *     never. The guessability census cannot see it — it excludes
 *     `items.classify` as authored content, correctly, because the defect
 *     belongs to the week rather than to the library — and every week in the
 *     corpus that uses the primitive has the same shape. So this week keeps the
 *     primitive's form and draws the CLAIM from three, one per verdict, chosen
 *     to be the three things a learner most needs to be able to defend here: a
 *     share is not an amount (sometimes), the three names are one number
 *     (always), and a percent alone never states a size (never). Nothing about
 *     the page changes for the child; "answer sometimes and read nothing" falls
 *     from everything to a third, and no card is unreachable. Measured after:
 *     34.5% on the top verdict over 400 packs, no dead card.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, one generator at a time. Every local draw is
 *     bounded so that the number it asks for cannot already be standing in its
 *     own sentence, and the bound is written out beside the draw that carries
 *     it: a container is at least 120 units full while every percent it can
 *     answer is at most 98 · the per-hundred gap is at most 24 while the count
 *     printed beside it is at least 32 and the total at least 80 · the
 *     un-inspected remainder is at least 84 while the percent is at most 40 and
 *     the counted group is a different number by construction (the 50% draw,
 *     where the two halves coincide, is excluded) · the delivery total is at
 *     least 44 while the percent is at most 40 and the window count at most 9.
 *     The family generators this week serves were measured clean at difficulty
 *     3 over 3,000 draws each by the orchestrator's guessability census before
 *     authoring began, and re-measured here.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5): `GATE_PROFILE.E.pictorialPerDay`
 * is 0, so band E earns its pictures where they teach. The hundred-square that
 * anchors the week shows a percent BEING COUNTED, which on an assessed item is
 * the strategy the item exists to ask for — so the grids live in the lesson
 * script and the guided examples, where the answer is already on the page. The
 * one figure a day item carries is `percentOfCount`'s own, which asserts the
 * drawn percent (a GIVEN, never the answer) and belongs to its generator.
 *
 * The warm-ups reach backwards only, and to three places: D12 for the swap
 * between a fraction and a decimal (two of this week's three names, met a level
 * early), D20 for decimal × whole (what a percent-of becomes once the percent
 * has been renamed), and E1 for a share named as a fraction — the exact object
 * this week rewrites per hundred. The Day-1 warm-ups are ORDERED so that the last of them is the
 * fraction-to-decimal one: `applyRetrievalRamp` moves a pack's final Day-1
 * warm-up onto Day 5 after the assembler's checks have run, and Day 5 already
 * carries the part-to-whole format, so the two would have collided on the
 * served page with no gate able to see it.
 */

import { asWarmup, decMultiply, decimalToFraction, fractionToDecimal, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { drawUniqueItem } from '../lib/guard';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { formatFrac, fracToDec, reduceFrac } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, barModel } from '../lib/figures';
import {
  eaPercentPointDrop,
  partToWholeShare,
  percentConversion,
  percentOfCount,
  percentOfEquality,
} from '../lib/ratio';
import { makeChoices } from '../shared';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const D12 = { level: 'D' as const, week: 12 };
const D15 = { level: 'D' as const, week: 15 };
const D20 = { level: 'D' as const, week: 20 };
const E1 = { level: 'E' as const, week: 1 };

// ---------------------------------------------------------------------------
// Scenery. Each pool was grepped against the entire weeks directory on the day
// this week was finished rather than the day it was started (kit §E2.8), and
// again against the G4 family's own pools and the local pools of E1 and E2 —
// the two weeks a learner meets immediately before this one. Nothing here
// repeats a scene any of them uses.
// ---------------------------------------------------------------------------

/** Containers with a stated capacity — the "what percent is it?" frame. */
const VESSELS = [
  { thing: 'A water butt', unit: 'litres' },
  { thing: 'A grain hopper', unit: 'kg' },
  { thing: 'A fuel drum', unit: 'litres' },
  { thing: 'A feed bin', unit: 'kg' },
] as const;

/**
 * Paired survey sites for the convert-then-compare chain. Both sites count the
 * SAME kind of thing, and the two are told apart by a neutral position word, so
 * neither name carries a hint about which share is the larger.
 */
const SITES = [
  { a: 'the north lake', b: 'the south lake', things: 'birds', trait: 'geese' },
  { a: 'the east wood', b: 'the west wood', things: 'trees', trait: 'oaks' },
  { a: 'the walled garden', b: 'the open garden', things: 'roses', trait: 'in bud' },
  { a: 'the old barn', b: 'the new barn', things: 'nests', trait: 'lined with wool' },
] as const;

/** Stock inspections — the frame where only the sub-count is known. */
const STORES = [
  { where: 'a hardware store', many: 'hinges', trait: 'brass' },
  { where: 'a joinery', many: 'dowels', trait: 'sanded' },
  { where: 'a vine nursery', many: 'vines', trait: 'grafted' },
  { where: 'a glass works', many: 'panes', trait: 'toughened' },
] as const;

/** Written records that state one share three ways. */
const RECORDS = [
  { label: 'A recycling report', of: 'the town\'s waste that was recycled' },
  { label: 'A match report', of: 'the shots that were on target' },
  { label: 'A rainfall chart', of: 'the days that were wet' },
  { label: 'A stock card', of: 'the crates that were checked' },
] as const;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** E1 — a share of a whole named as a fraction. This week renames it per
 *  hundred, which is the only change the whole of E3 makes to it. */
const wPartWhole = asWarmup(partToWholeShare(), E1);
/** D12 — a decimal renamed as a fraction: two of this week's three names,
 *  swapped, a level before the third name joins them. */
const wDecToFrac = asWarmup(decimalToFraction(), D12);
/** D12 — and the same swap run the other way, which is the move a percent
 *  makes when it stops being a percent. */
const wFracToDec = asWarmup(fractionToDecimal(), D12);
/** D20 — decimal × whole, which is exactly what "a percent of an amount" is
 *  once the percent has been renamed, so no percent-of item stalls on it. */
const wDecMultiply = asWarmup(decMultiply(false), D20);

// ---------------------------------------------------------------------------
// Single-step percent
//
// Three come from the G4 family: the percent OF a count (with the family's own
// hundred-square, which asserts the GIVEN percent), and the conversion run in
// all three directions — to a decimal, to a fraction, and from a count-share up
// to a percent. The fourth is local, and it is the question the other three
// never ask: not "what is this percent of that", but "what percent IS this" —
// read off a container whose capacity is stated in units, not in hundredths.
// It is the week's estimate-first carrier, so it is reachable only through the
// wrapper (kit §E2.2).
// ---------------------------------------------------------------------------

/**
 * What percent of the container is full.
 *
 * The denominator pool is `[10, 20, 20, 25, 25, 50, 50, 50]` rather than a flat
 * list, and the weighting is deliberate. Drawing the denominators uniformly put
 * an eighth of every draw on a pool of two possible percents, and the commonest
 * answer then reached about one draw in ten; leaning the pool toward the finer
 * partitions spreads the served answers across roughly sixty values without
 * changing a single thing the child does. (Denominators of 4 and 5 are dropped
 * entirely for that reason — 4 admits only 25% and 75%.)
 *
 * THE PROBE IS A COIN FLIP BY CONSTRUCTION, not by hope (kit §E2.9a). Whether
 * the container is over or under half is DRAWN first, and the numerator is then
 * picked from that side's pool; every denominator here has pools of equal size
 * on the two sides of the halfway mark, so nothing about the draw leans. The
 * exact half is excluded on both sides, so "half full" is never the answer to a
 * question about which side of half it is.
 *
 * No leak by construction: the container holds at least 120 units while every
 * percent it can answer is at most 98, so the answer can never be the capacity;
 * and the one coincidence that CAN arise — the amount held happening to equal
 * the percent — is stepped past deterministically rather than redrawn (kit
 * §E2.4), by taking one more copy of the ratio, which leaves the share and
 * therefore the answer untouched.
 */
const sitPercentFull = situation({
  situationType: 'measurement',
  cognitiveOp: 'percent-from-part',
  draw: (r) => {
    const vessel = r.pick(VESSELS);
    const d = r.pick([10, 20, 20, 25, 25, 50, 50, 50]);
    const above = r.chance(0.5);
    const pool: number[] = [];
    for (let i = 1; i < d; i++) {
      const p = (100 * i) / d;
      if (above ? p > 50 : p < 50) pool.push(i);
    }
    const n = r.pick(pool);
    const pct = (100 * n) / d;
    let m = r.int(Math.ceil(120 / d), Math.floor(400 / d));
    if (n * m === pct) m += 1;
    const whole = d * m;
    const part = n * m;
    return {
      prompt: `${vessel.thing} is full at ${countNoun(whole, vessel.unit)}, and it is holding ${countNoun(part, vessel.unit)} now. What percent of it is full?`,
      answerValue: String(pct),
      templateId: 'ratio_frac_to_pct_v1',
      params: { n: part, d: whole },
      acceptableForms: [`${pct}%`],
      hints: [
        'What would this container be holding if it had been built to take exactly a hundred?',
        'Set the amount held against the full capacity, then rename that share so its bottom number is a hundred.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitPercentFullEstimate = withEstimateFirst(
  sitPercentFull,
  'will the level turn out to be more than half of the container, or less than half?',
);

/**
 * A percent OF a stated amount — the week's central computation, and the reason
 * this generator exists beside the family's `percentOfCount` rather than
 * instead of it.
 *
 * `percentOfCount` is the anchor item: it carries the hundred-square that
 * asserts the drawn percent, and it holds two day slots for exactly that
 * reason. But its base comes from `wholeBaseFor`, which can draw a base of
 * EXACTLY 100 — and at a base of 100 the answer IS the percent, a number the
 * prompt has already printed. Measured over 400 served packs: 4.3% and 4.3% on
 * the two day slots. That is a shared-file matter, reported and not fixed
 * (§ SHARED-FILE DEFECTS in the report), and at 4% on a day page it is a
 * blemish. On the instrument that certifies a child it is not, so the mastery
 * slot uses this instead — the same operation, a different frame, and no draw
 * that can print its own answer.
 *
 * No leak by construction, and the argument is one line: the answer equals the
 * percent only when the base is exactly a hundred, and the base here is a
 * multiple of twenty from 120 to 400. It can never equal the base either, since
 * every percent drawn is under a hundred.
 */
const sitPercentOfPath = situation({
  situationType: 'measurement',
  cognitiveOp: 'percent-of',
  draw: (r) => {
    const base = 20 * r.int(6, 20);                    // 120–400 m, never 100
    const pct = 5 * r.int(2, 18);                      // 10%–90%, always whole
    return {
      prompt: `A footpath is ${countNoun(base, 'm')} long, and ${pct}% of it has been resurfaced. How many metres have been resurfaced?`,
      answerValue: String((base * pct) / 100),
      templateId: 'ratio_pct_of_v1',
      params: { base: String(base), pct },
      units: 'm',
      hints: [
        'How much of this path would have been resurfaced if the whole of it had measured exactly a hundred metres?',
        'Rename the percent as a count of hundredths, then take that many hundredths of the length.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: three shapes, so "two steps" never becomes one template
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S HEADLINE CHAIN (§6 row E3, "convert then compare"). One site
 * reports a count out of its own total; the other reports a percent. The two
 * cannot be set beside each other as they stand, because one is written over a
 * total the other never had — so the chain is convert first, compare second,
 * and the answer is the difference the conversion makes visible: how many more
 * in every hundred.
 *
 * The question is asked in "every hundred" rather than in percentage points on
 * purpose. This is the week where a percent is met, and the phrase that makes
 * the comparison mean something is the one the anchor is built on; the term
 * "percentage point" belongs with E17's percent CHANGE, where the distinction
 * between a point and a percent starts to bite.
 *
 * No leak by construction: the answer is a per-hundred gap of at most 24, while
 * the count printed beside it is at least 32 and the total at least 80. The one
 * pair that can coincide — a gap equal to the stated percent, which happens
 * only when the two shares straddle the halfway mark exactly — is stepped past
 * deterministically rather than redrawn.
 */
const msConvertThenCompare = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'percent-convert-compare',
  draw: (r) => {
    const site = r.pick(SITES);
    // A TOTAL OF EXACTLY 100 IS EXCLUDED, and reading the pack is what found it.
    // At a hundred counted, the counted part IS the per-hundred share already, so
    // the convert step vanishes and the answer is a subtraction of two numbers
    // both printed on the page — in the item whose entire point is that a count
    // out of one total cannot be compared with a percent until it is rewritten.
    // It was 1 draw in 9. No gate sees it; the pack read wrong.
    const whole = r.pick([80, 120, 140, 160, 180, 200, 220, 240]);
    const truePct = 5 * r.int(8, 17);       // 40%–85%, and always a whole percent
    let gap = r.int(3, 24);
    // gap === truePct − gap only when the gap is exactly half the true share,
    // which needs truePct ≥ 40 and therefore gap ≥ 20 — so stepping down by one
    // can never take the gap below its floor.
    if (truePct - gap === gap) gap -= 1;
    const statedPct = truePct - gap;
    const part = (whole * truePct) / 100;
    return {
      prompt: `Of the ${countNoun(whole, site.things)} counted at ${site.a}, ${countNoun(part, site.things)} were ${site.trait}. At ${site.b}, ${statedPct}% were ${site.trait}. How many more ${site.things} in every hundred were ${site.trait} at ${site.a}?`,
      initN: part,
      steps: [
        { op: 'mul', n: 100, d: whole },
        { op: 'sub', n: statedPct, d: 1 },
      ],
      acceptableForms: [`${gap}%`],
      hints: [
        'Can a count out of one total be set beside a percent from somewhere else, or does one of them have to be rewritten first?',
        'Rename the counted share so its bottom number is a hundred, then hold that beside the percent the other site reports.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3, the Level-E lift). Everything the
 * story states belongs to the part; the total the percent was written over is
 * the one quantity it never mentions. So the first move has to rebuild that
 * total, and only then can the rest of the stock be taken off it.
 *
 * Served through the check-back wrapper, because the honest check on a
 * recovered total is not "is the arithmetic right" but "do the two groups I
 * ended with put the stated share back together" — the week's rule used
 * backwards.
 *
 * No leak by construction: the un-inspected remainder is at least 84, while the
 * percent printed is at most 40 and the total is never printed at all. A share
 * of 50% is excluded from the pool because there the two groups are the same
 * size, and the answer would be the number already standing in the sentence.
 */
const msRecoverTheStock = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'percent-recover-whole',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const store = r.pick(STORES);
    // 50% is excluded: there the counted group and the rest are equal, and the
    // answer would be a number the prompt has already printed.
    const pct = r.pick([10, 20, 25, 40]);
    const step = pct === 10 ? 10 : pct === 25 ? 4 : 5;
    const total = step * r.int(Math.ceil(140 / step), Math.floor(340 / step));
    const counted = (total * pct) / 100;
    return {
      prompt: `An inspection of ${store.where} counted ${countNoun(counted, store.many)} that were ${store.trait}, and that was ${pct}% of the ${store.many} in stock. How many of the ${store.many} in stock were not ${store.trait}?`,
      initN: counted,
      steps: [
        { op: 'mul', n: 100, d: pct },
        { op: 'sub', n: counted, d: 1 },
      ],
      units: store.many,
      hints: [
        'Does the counted number describe the whole stock, or only the part the percent picks out?',
        'Build the whole stock back up from the part the percent named, then take that part away again.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msRecoverTheStockCheck = withCheckBack(
  msRecoverTheStock,
  'put your two groups back together — does the part you were given still stand at the share the inspection reported?',
);

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3), and the shape that shows a
 * percent belongs to the total it was taken from: the delivery is added AFTER
 * the share has been read off, so it is not part of the percent and must not be
 * scaled with it. The number of display windows is stated, is never used, and
 * is exactly the number the sentence invites a child to divide by.
 *
 * No leak by construction: the answer is at least 44, while the percent printed
 * is at most 40 and the window count at most 9; and the answer is always
 * strictly below the stock it came out of, since a stock of at least 160 cannot
 * be reached by four tenths of itself plus at most forty-five.
 */
const msPercentThenDelivery = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'percent-of-then-add',
  posing: 'has-distractor',
  draw: (r) => {
    const stock = 20 * r.int(8, 15);              // 160–300 in store
    const pct = r.pick([15, 20, 25, 30, 40]);
    const extra = r.int(20, 45);
    const windows = r.int(3, 9);
    return {
      prompt: `A model shop keeps ${countNoun(stock, 'model engines')} in store, and ${pct}% of them are steam engines. A delivery of ${countNoun(extra, 'more steam engines')} arrives and goes straight into store. The shop has ${countNoun(windows, 'display windows')}. How many steam engines are in store now?`,
      initN: stock,
      steps: [
        { op: 'mul', n: pct, d: 100 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: 'steam engines',
      hints: [
        'Which number here is a share of the store, and which one is a count that arrived on its own?',
        'Read the share off the stock that was already there, then bring in what came with the delivery.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the two halves of the week, from opposite ends
//
// `percentOfEquality` (the family's, the recipe's own) is the AMOUNT side: two
// percent-of amounts that have to be worked out before either can be called the
// larger, and on about a third of draws turn out to be the same amount. The
// item below is the NAME side: one share written three ways, with one record
// out of step. Neither can be answered by the other's habit.
// ---------------------------------------------------------------------------

/**
 * One share, three records, one of them the complement.
 *
 * The key is a LABEL — 'the percent', 'the decimal', 'the fraction' — and which
 * notation carries the impostor is drawn in equal thirds, so every named
 * surface strategy sits exactly at chance: pick the fraction, pick the longest
 * card, pick the first card. There is no value rank to exploit, because the
 * cards are words; and there is no magnitude tell in the prompt, because the
 * complement of a share under half is LARGER than it and the complement of a
 * share over half is smaller, so the impostor's size says nothing.
 *
 * The impostor is the complement share, which is the commonest percent error
 * there is — the share that stayed read as the share that went — and it is
 * computed by the same code that computes the two honest records, so no card is
 * fabricated. A share of exactly 50% is excluded, because there the complement
 * and the truth coincide and the item would have no odd record at all.
 *
 * Each distractor's rationale names the record it actually agrees with ON THIS
 * DRAW, which is why the same label can carry a different partner from one seed
 * to the next.
 */
const NAME_LABELS = { percent: 'the percent', decimal: 'the decimal', fraction: 'the fraction' } as const;
type NameKind = keyof typeof NAME_LABELS;

const discrimThreeNames = discrimination({
  variant: 'structural',
  cognitiveOp: 'percent-three-names',
  draw: (r) => {
    const rec = r.pick(RECORDS);
    // Multiples of 5 from 5% to 95%, minus the halfway share where the
    // complement and the truth are the same number.
    const pct = r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95]);
    const odd = r.pick(['percent', 'decimal', 'fraction'] as const);
    const comp = 100 - pct;
    const shown = {
      percent: `${odd === 'percent' ? comp : pct}%`,
      decimal: fracToDec(odd === 'decimal' ? comp : pct, 100),
      fraction: formatFrac(reduceFrac(odd === 'fraction' ? comp : pct, 100)),
    };
    const kinds: NameKind[] = ['percent', 'decimal', 'fraction'];
    const others = kinds.filter((k) => k !== odd);
    /** The honest reading that produces this label's card ON THIS DRAW. */
    const agreeingCard = (k: NameKind) => {
      const partner = NAME_LABELS[others.find((o) => o !== k) as NameKind];
      return k === 'fraction'
        ? {
          text: NAME_LABELS[k],
          errorTag: 'representation-misread' as const,
          rationale: `Rejects the fraction because simplifying changed how it looks, when it agrees with ${partner} exactly as it stands — a reduced share is the same share, written shorter.`,
        }
        : {
          text: NAME_LABELS[k],
          errorTag: 'procedure-slip' as const,
          rationale: `This record and ${partner} already name the same share, so neither of them can be the one out of step; checking a single pair of the three and stopping is what lands here.`,
        };
    };
    return {
      prompt: `${rec.label} gives the share of ${rec.of} and writes it three ways: ${shown.percent} as a percent, ${shown.decimal} as a decimal, and ${shown.fraction} as a fraction. Two of the three name the same share and one does not. Which record is the odd one out?`,
      correct: NAME_LABELS[odd],
      distractors: others.map(agreeingCard),
      hints: [
        'Which of these three names says outright how many out of a hundred, and what would the other two have to be turned into to be read the same way?',
        'Write all three over a hundred, then look for the one that does not match the pair.',
      ],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * THE DAY-5 SIGNATURE (§6 row E3, "three names, one amount"). One share, all
 * three of its names asked for by name, and then the question the three names
 * exist to answer: which of them lets a second report be read against this one
 * with no further work. The prose is fixed because what is being assessed is
 * the writing and the choice, not another piece of arithmetic — and the four
 * parts are named
 * separately, so a percent with no decimal beside it, or three numbers with no
 * sentence under them, is an incomplete answer rather than a passing one.
 */
const threeNamesOneShare = reasoning({
  prompt:
    'A bike hire shop reports that 21 of its 28 bikes were out on Saturday. Write that share as a percent, then as a decimal, then as a fraction in its simplest form. A second shop reports that 0.68 of its bikes were out. Finish with one sentence naming which of the three names lets you set the two shops side by side straight away, and what that name is counting.',
  value:
    'the share is 75%, 0.75 and 3/4 — the percent, because it states the share as a count out of a hundred, which is a total both shops can be written over even though neither of them owns a hundred bikes',
  acceptableForms: ['75%', '75', '0.75', '3/4', 'percent', 'out of a hundred', 'per hundred'],
  keywords: true,
  hints: [
    'What has to be true of two shares before either of them can be called the larger?',
    'Write the counted share over a hundred first, and then read the second shop\'s decimal the same way.',
  ],
  errorTags: ['task-comprehension', 'concept-misconception'],
});

/**
 * The Always/Sometimes/Never claim — and the CLAIM IS DRAWN, which is the point.
 *
 * `items.classify` takes its three cards as authored config, so every week that
 * uses it ships a slot whose key never moves: the two verdicts it does not key
 * are offered on 100% of draws and keyed on 0% of them, which is the L38
 * permanently-unkeyable card in its most literal form. Measured on this slot
 * before the repair: "always" and "never" offered 100%, keyed 0.0% over 400
 * packs. The guessability census does not see it, because it excludes
 * `items.classify` as authored content — correctly, since the defect belongs to
 * the week, not to the library.
 *
 * So this week draws its claim from three, one for each verdict. Nothing about
 * the item changes for the child — one claim, three cards, one sentence of
 * justification — but "answer sometimes and read nothing" now scores a third
 * rather than everything, and every card is reachable. The three claims are the
 * three things the week most needs a learner to be able to defend: that a share
 * is not an amount, that the three names are one number, and that a percent
 * alone never states a size.
 */
type Verdict = 'always' | 'sometimes' | 'never';
const VERDICTS: readonly Verdict[] = ['always', 'sometimes', 'never'];

interface AsnClaim {
  claim: string;
  verdict: Verdict;
  wrong: Record<string, { tag: ErrorTag; text: string }>;
}

const ASN_CLAIMS: readonly AsnClaim[] = [
  {
    claim: 'if a higher percent of one group are members than of another group, then the first group has more members',
    verdict: 'sometimes',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Reads a percent as an amount. A percent counts out of a hundred whatever the group is really made of, so a larger share of a small group can still be a smaller number of people.',
      },
      never: {
        tag: 'task-comprehension',
        text: 'Over-corrects into denying that a percent settles anything about numbers, which throws away the one case it does settle: two groups of the same size are ordered by their percents exactly as they are ordered by their counts.',
      },
    },
  },
  {
    claim: 'writing one share as a percent, then as a decimal, then as a fraction leaves the share itself unchanged',
    verdict: 'always',
    wrong: {
      sometimes: {
        tag: 'concept-misconception',
        text: 'Treats the three names as three quantities that happen to agree on the easy shares, so the share is expected to shift when it is rewritten. A name is not a measurement, and nothing about a share moves when it is spelled a different way.',
      },
      never: {
        tag: 'representation-misread',
        text: 'Reads the three names as three different things because the numerals look different, when the numerals differ only in what each of them is counting out of — a hundred, a one, or whatever the fraction was reduced to.',
      },
    },
  },
  {
    claim: 'a percent on its own tells you how many things are in the group it describes',
    verdict: 'never',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Reads a percent as a count of things. A percent states a share out of a hundred and says nothing whatever about the size of the group it was taken from.',
      },
      sometimes: {
        tag: 'task-comprehension',
        text: 'Reaches for the case where the percent happens to match the count — a group of exactly a hundred — but even there the percent did not tell you the size of the group; the group did.',
      },
    },
  },
];

const shareIsNotAmount: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: c.wrong[v].tag,
      rationale: c.wrong[v].text,
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    return {
      type: 'classification',
      prompt: `Always, sometimes, or never true: ${c.claim}. Write one sentence giving the case that settles it.`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: [
        'What would a claim have to survive before it has earned the word always, and what would it take to earn never?',
        'Test the claim on one plain case first, then go looking for a case that breaks it; the verdict is the one that covers both.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension', 'representation-misread'],
    };
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE03 = makeWeekBuilder({
  level: 'E',
  week: 3,
  conceptId: 'meeting-percent',
  conceptName: 'Meeting percent',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D12, D20, E1],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the per-hundred grid',
  conceptFamily: 'operation',
  deepeningDelta:
    'E1 established that a ratio is a relationship rather than a pair of sizes, and that scaling both terms leaves it intact. E2 picked one row of that table — the row for ONE — and made it the only row two offers can be compared at. E3 picks a different row, the row for a HUNDRED, and the change is not cosmetic: one is a size a quantity can actually be, while a hundred is a size it usually is not, so a percent is a share written over a total that need never exist. That is what lets two groups of different sizes be compared with no common term between them, and it is why one share now has three interchangeable names rather than one.',
  explanation: {
    hook:
      'Two clubs both say a third of their members came. One club has twelve members and one has three hundred. Both sentences are true, both describe the same share, and the two crowds do not look remotely alike. This week is about the number that can say the first thing without ever saying the second.',
    whyBeforeHow:
      'A percent is a count out of a hundred, and that is the whole of it. It says nothing about how large the group is, because the hundred it counts out of is not the group — it is a scale we agree to rewrite every share onto. That is why a percent can compare two things that have no total in common: a club of twelve and a club of three hundred cannot be set beside each other by their counts, but both can be rewritten as a count out of a hundred, and there the comparison is ordinary. So we work with the per-hundred grid: ten rows of ten, one cell for each of the hundred, and the percent is simply how many cells are shaded. Everything else the week does is a translation into or out of that grid. A share written as a fraction is renamed until its bottom number is a hundred. A share written as a decimal is the same count read into the hundredths place, which is why the point sits two places along and not one. And the size of a percent is the first thing to check, because a number that looks like a whole number while behaving like a hundredth is the easiest number in mathematics to write in the wrong place.',
    script: [
      {
        say: 'Watch me shade a share. Here is a grid of a hundred cells, and I want thirty-five hundredths of it. I do not have to work anything out — I count thirty-five cells and shade them. That shaded part IS thirty-five percent, and the word percent is only telling me what I already did: per cent, for each hundred. The grid is not a picture of the answer. The grid is the definition.',
        visual: 'A ten-by-ten grid with thirty-five of its hundred cells shaded.',
        figure: areaGrid(
          { rows: 10, cols: 10, shaded: 35 },
          { alt: 'a grid of a hundred cells with thirty-five of them shaded' },
        ),
      },
      {
        say: 'Now the same share wearing its other two names. Thirty-five shaded out of a hundred is the fraction thirty-five hundredths, and thirty-five hundredths simplifies to seven twentieths — the shading has not moved, only the way I have cut it up. Read the same grid down the columns instead and it is nought point three five, because the hundredths place is exactly where a per-hundred count belongs. Three names, one shading. If two of them disagree, one of them is written down wrong.',
        visual: 'The same thirty-five shaded cells, with the seven shaded columns of five marked off.',
        figure: areaGrid(
          { rows: 10, cols: 10, shaded: 35 },
          { alt: 'the same grid of a hundred cells with thirty-five shaded, the shading grouped into seven blocks of five' },
        ),
      },
      {
        say: 'Here is what the grid does that a raw count cannot. Twenty-four of the forty seats on the small coach were taken, and fifty-one of the ninety seats on the large one. Nobody can compare twenty-four with fifty-one — they are counted out of different totals. But shade each share onto its own hundred grid and one comes out at sixty cells and one at fifty-seven, and now the comparison is ordinary. The small coach was the fuller one, and it was the fuller one all along.',
        visual: 'Two bars drawn to one scale: sixty per hundred against fifty-seven per hundred.',
        figure: barModel(
          [
            { label: 'the small coach, seats taken in every hundred', segments: [{ value: 60, label: '60' }] },
            { label: 'the large coach, seats taken in every hundred', segments: [{ value: 57, label: '57' }] },
          ],
          { scaleMax: 100, alt: 'two bars on one scale of a hundred, one reaching 60 and one reaching 57, the two coach shares rewritten per hundred' },
        ),
      },
      {
        say: 'Two habits before any of the arithmetic. First I estimate the size. Twenty-five percent of a number is a quarter of it, so the answer has to come out well under the number I started with — if it lands above it, I have not made an arithmetic slip, I have put a point in the wrong place. And second, a small surprise worth carrying: forty percent of fifty and fifty percent of forty are the same amount, both of them twenty, and that is not a coincidence about those two numbers. It happens because both of them are the same two numbers multiplied together and then shared into a hundred. Check that yourself on a pair of your own before you believe me.',
        visual: 'Forty percent of a fifty-cell strip beside fifty percent of a forty-cell strip, both reaching twenty.',
        figure: barModel(
          [
            { label: 'forty in every hundred of a fifty', segments: [{ value: 20, label: '20' }, { value: 30 }], total: '50' },
            { label: 'fifty in every hundred of a forty', segments: [{ value: 20, label: '20' }, { value: 20 }], total: '40' },
          ],
          { scaleMax: 50, alt: 'a bar of 50 with its first 20 marked off beside a bar of 40 with its first 20 marked off, the two marked parts the same length' },
        ),
      },
    ],
    summary:
      'A percent is a count out of a hundred, and the hundred is a scale rather than the group — which is why a percent can compare two groups that share no total. The per-hundred grid holds all of it: shade the percent, and the same shading can be read as a fraction over a hundred, simplified, or as a decimal in the hundredths place. Those three names are one number written three ways. To compare a count-share with a percent, rewrite the count-share over a hundred first and compare there; to take a percent of an amount, rename the percent as its per-hundred share and then take that share. Check the size of every answer before the working, because a percent looks like a whole number and behaves like a hundredth.',
    vocabulary: [
      { term: 'percent', kidGloss: 'a count out of a hundred — the share you would have if the group were rebuilt with exactly a hundred in it' },
      { term: 'per-hundred grid', kidGloss: 'ten rows of ten, one cell for each of the hundred, so a percent is simply the number of cells shaded' },
      { term: 'percent of an amount', kidGloss: 'the amount you get by taking that many hundredths of it' },
      { term: 'equivalent forms', kidGloss: 'the percent, the decimal and the fraction that name one share — three spellings of one number' },
      { term: 'benchmark percent', kidGloss: 'a share simple enough to find without written work: a tenth, a quarter, a half, three quarters' },
    ],
  },
  guidedExamples: [
    {
      ...ge(3, 1, 'modeled', 'A choir has 240 members. 35% of them sang at the summer concert. How many sang?', [
        {
          teacherSay:
            'Let me settle what I am being asked before I touch a number. The thirty-five is not a count of singers — it is a count out of a hundred, and this choir does not have a hundred members. So my job is to rebuild that share on a group of two hundred and forty.',
        },
        {
          teacherSay:
            'Before I work it out I make a rough call, so I know what I am looking for. Thirty-five in every hundred is a bit over a third, and a third of two hundred and forty is eighty — so I am expecting something in the eighties. Now the exact share: thirty-five hundredths of two hundred and forty is what?',
          expected: '84',
        },
        {
          childDo: 'Hold that answer against the whole choir and against the rough call, and say whether it sits where it should.',
          expected: '84',
        },
      ], '84'),
      visual: 'The hundred grid with thirty-five cells shaded — the share before it is laid onto the choir.',
      figure: areaGrid(
        { rows: 10, cols: 10, shaded: 35 },
        { alt: 'a grid of a hundred cells with thirty-five of them shaded, the share the question names' },
      ),
    },
    {
      ...ge(3, 2, 'completion', 'A survey found that 18 of the 25 people asked cycle to work. Write that share as a percent.', [
        {
          teacherSay: 'What has to change about this share before it can be called a percent — the amount it describes, or the total it is written over?',
          expected: 'the total it is written over',
        },
        {
          childDo: 'Rename the share so its bottom number is a hundred, then read the top.',
          expected: '72',
        },
      ], '72'),
      visual: 'The twenty-five asked, drawn as twenty-five cells, beside the hundred grid the share is being moved onto.',
      figure: areaGrid(
        { rows: 10, cols: 10, shaded: 72 },
        { alt: 'a grid of a hundred cells with seventy-two of them shaded, the same share rewritten out of a hundred' },
      ),
    },
    ge(3, 3, 'prompted', 'Write 45% as a decimal, and then as a fraction in its simplest form.', [
      {
        childDo: 'Read the percent as a count of hundredths first, and let that one reading give you both of the other names.',
        expected: '0.45',
      },
    ], '0.45 and 9/20'),
    {
      // Independent stage: the two reports only. Deciding that the counted
      // share has to be rewritten over a hundred BEFORE anything is compared is
      // the task here, so drawing either share as a per-hundred bar would hand
      // over the plan the item exists to ask for (L33).
      ...ge(3, 4, 'independent', 'Of the 150 trees counted in the east wood, 96 were oaks. In the west wood, 52% were oaks. How many more trees in every hundred were oaks in the east wood? Solve cold.', [
        { childDo: 'Rewrite the counted share over a hundred before you compare anything, then read off the difference.', expected: '12' },
      ], '12'),
      visual: 'The east wood\'s count as it stands. The per-hundred share is yours to work out.',
      figure: barModel(
        [
          { label: 'the east wood: oaks among the trees counted', segments: [{ value: 96, label: '96' }, { value: 54 }], total: '150' },
        ],
        { scaleMax: 150, alt: 'a bar of 150 for the trees counted in the east wood, with the first 96 marked off as oaks; the west wood is not drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the percent read three ways (shaded onto a group,
    // renamed as a decimal, renamed as a fraction). Single-step only; no chain,
    // no choice and no trap yet.
    //
    // The warm-ups are ORDERED so the LAST of them is the fraction-to-decimal
    // one: `applyRetrievalRamp` moves a pack's final Day-1 warm-up onto Day 5
    // after every gate has run, and Day 5 already carries the part-to-whole
    // format, so leaving that one last would put two warm-ups of one format on
    // the served page with nothing able to see it.
    [
      { gen: wPartWhole, diff: 2 },
      { gen: wDecToFrac, diff: 2 },
      { gen: wFracToDec, diff: 2 },
      { gen: percentOfCount(), diff: 3 },
      { gen: percentConversion('to-decimal'), diff: 3 },
      { gen: percentConversion('to-fraction'), diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first reading of a container,
    // the recipe's own discrimination, and the week's first chain.
    [
      { gen: wDecMultiply, diff: 2 },
      { gen: wFracToDec, diff: 2 },
      { gen: sitPercentFullEstimate, diff: 3 },
      { gen: percentOfEquality(), diff: 3 },
      { gen: percentConversion('to-decimal'), diff: 3 },
      { gen: msConvertThenCompare, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations against single-step conversion
    // and an inverse-start chain, so nothing on the page signals which kind of
    // work is coming next.
    [
      { gen: wDecToFrac, diff: 2 },
      { gen: percentOfEquality(), diff: 3 },
      { gen: discrimThreeNames, diff: 3 },
      { gen: percentConversion('from-fraction'), diff: 3 },
      { gen: percentOfCount(), diff: 3 },
      { gen: msRecoverTheStockCheck, diff: 4 },
    ],
    // Day 4 — word problems. Three chains sit here, and no two of them are posed
    // alike: one converts before it compares, one has to rebuild a total before
    // it can subtract, one states a number it never spends. Two single-step
    // items sit among them so that the length of a prompt predicts nothing.
    [
      { gen: msConvertThenCompare, diff: 5 },
      { gen: msRecoverTheStockCheck, diff: 5 },
      { gen: msPercentThenDelivery, diff: 4 },
      { gen: sitPercentFullEstimate, diff: 4 },
      { gen: percentConversion('from-fraction'), diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the misplaced point, the three
    // names of one share, and the claim that separates a share from an amount
    // (+ a ramped warm-up).
    [
      { gen: wPartWhole, diff: 2 },
      { gen: eaPercentPointDrop(), diff: 4 },
      { gen: threeNamesOneShare, diff: 3 },
      { gen: shareIsNotAmount, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the slip worth watching for this week is a decimal point one place out — 25% worked out as 2.5 of something rather than a quarter of it. It is not carelessness. A percent is written like a whole number and behaves like a hundredth, and the two habits fight each other. If you see it, do not move the point for them. Ask roughly how big a quarter of the amount ought to be, and let the size of their answer tell them.',
  ],
  puzzle: (r) => {
    // BENCHMARK-PERCENT ESTIMATION (the CURRICULUM-MAP Day-5 non-computational
    // focus for this cell: "benchmark-percent estimation — 10%, 25%, 50% —
    // without computing"). The week's move run a new way: instead of taking a
    // percent of an amount, BUILD the percent out of pieces small enough to
    // find by eye. Every share the puzzle names is a whole number of tenths
    // plus one half-tenth, so it is always reachable and never reachable by
    // tenths alone — which is what forces the halving.
    const total = 20 * r.int(30, 60);        // 600–1200 wristbands
    const pct = r.pick([15, 25, 35, 45, 55]);
    const tenth = total / 10;                // 60–120, always above every pct
    const share = (total * pct) / 100;
    return {
      id: 'E3-PZ-01',
      title: 'Puzzle Grove: The Steward\'s Tenth',
      puzzleType: 'estimation',
      prompt: `A festival has printed ${fmtInt(total)} wristbands. The head steward never reaches for a calculator: she finds a tenth of any number first, and then halves it, or lays several tenths together, until she has the share she wants. Write a tenth of the wristbands. Then write ${pct}% of them. Finish with one sentence naming how many whole tenths and how many half-tenths she has to lay together to reach ${pct}%.`,
      answer: {
        value: `${fmtInt(tenth)}, ${fmtInt(share)}`,
        acceptableForms: [
          `${tenth} ${share}`,
          `${tenth}, ${share}`,
          `${fmtInt(tenth)}, ${fmtInt(share)}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Which single share of a number can be read straight off its digits, with no working at all?',
        'Find that share first, then ask how many copies of it — and how many halves of it — the share you want is made of.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'percent-benchmark-build' },
  sprint: {
    skill: 'Multiplication facts to 12 — the pairing that renames a share over a hundred',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [4, 12] },
  },
  mastery: [
    { gen: sitPercentOfPath, diff: 3 },
    { gen: msConvertThenCompare, diff: 4 },
    { gen: percentConversion('to-fraction'), diff: 3 },
    { gen: msRecoverTheStockCheck, diff: 4 },
    { gen: percentOfEquality(), diff: 3 },
    { gen: msPercentThenDelivery, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step and single-decision percent work — a percent taken of a stated length, a percent renamed as a fraction in its simplest form, and a comparison of two percent-of amounts whose outcome — first larger, second larger, or the two equal — is drawn by the generator, so Form B can key a different outcome from Form A without changing the slot. 02/04/06: chains — a counted share rewritten over a hundred and compared with a stated percent, a whole stock recovered from the part a percent picked out and then the remainder taken (inverse-start, with the check named), and a share read off a stock before a delivery is added to it (carrying a window count that goes deliberately unused). No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'percent-as-amount',
      description: 'Treats a percent as a count of things rather than a count out of a hundred, so a share is compared, added or ranked as though the hundred it is written over were the group itself. The reading survives every item where the group happens to hold a hundred, and fails the moment two groups of different sizes are set beside each other.',
      exampleWrongAnswer: 'a club where 60% are new members called larger than a club where 40% are, with no count of members read at all',
      distractorRationale: 'Offer the side the larger percent points at on a draw where the two groups are different sizes and the counts point the other way, so only the amounts separate the options.',
      reteachPointer: 'explanation/script[2] (two coaches, two totals, one grid each) beside script[0] (the grid is the definition, not a picture of the answer)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'point-one-place-out',
      description: 'Renames the percent by moving the decimal point one place instead of two, so 25% is worked as 2.5 rather than 0.25 and the answer comes out ten times too large. The arithmetic is clean and only the SIZE of the result gives it away, which is exactly what the estimate-first habit exists to catch.',
      exampleWrongAnswer: '25% of a group of 80 written as a share of 200, from a working that used 2.5 where it needed 0.25',
      distractorRationale: 'Offer the amount a working that used the percent as a count of TENTHS arrives at, so the two options carry the same digits and differ only in where the point came to rest.',
      reteachPointer: 'explanation/script[1] (the hundredths place is where a per-hundred count belongs), then guidedExamples/E3-GE-03',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'complement-read-as-share',
      description: 'Reads the share that is left as the share that was named, or the reverse — the wet days counted as the dry ones, the reduction counted as the amount paid. Both numbers are real and both belong to the story; only one of them answers the question asked.',
      exampleWrongAnswer: 'a report of 35% recycled written up as the fraction 13/20',
      distractorRationale: 'Offer the complement of the true share, computed by the same code, in whichever of the three names the draw puts it in — so the card is a genuine reading of the same situation rather than a wrong number.',
      reteachPointer: 'explanation/script[1] (three names, one shading — if two disagree, one is written down wrong), then the Day-3 three-records item',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'uses-every-number',
      description: 'Treats "use what you are given" as the whole instruction, so a figure that furnishes the scene — how many display windows a shop has — is drafted into the working as one more division. The same reflex takes a percent of a total that the percent was never written over, such as a stock after a delivery has been added to it.',
      exampleWrongAnswer: 'a count of steam engines divided again between the shop\'s display windows',
      distractorRationale: 'Build the option a solver reaches by spending the spare quantity, or by reading the share off the total AFTER the addition rather than before it.',
      reteachPointer: 'guidedExamples/E3-GE-04 (settle what the share is written over before comparing anything), then the Day-4 word problems',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Percent — reading a percent as a count out of a hundred rather than as an amount, moving one share between its three names (percent, decimal and fraction), taking a percent of a group, recovering a whole group from the part a percent picked out, and comparing two shares by rewriting both of them over a hundred first.',
    improvingCandidates: [
      'renaming a counted share so its bottom number is a hundred',
      'moving one share between a percent, a decimal and a fraction without changing its value',
      'estimating the size of a percent of an amount before working it out',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reading a percent as a share of its own group rather than as an amount — the hundred-cell grids make the difference visible at once',
      },
      {
        errorTag: 'procedure-slip',
        text: 'placing the decimal point two places along rather than one, with a rough size settled before the working starts',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping the share that was named apart from the share that was left over',
      },
      {
        errorTag: 'task-comprehension',
        text: 'spending only the figures a percent question is built on, and noticing which total the percent was written over',
      },
    ],
    homeFocus: {
      praiseLine:
        'You estimated how big the answer had to be before you trusted the working, and you rewrote both shares out of a hundred before you compared them at all. Those two moves are what this week was for.',
      questionForChild: 'If a quarter of one class and a half of another both came to the trip, could the quarter still be more children — and how would you decide?',
      schoolSyncHook: 'A percent gets written three ways in three classrooms — "35%", "35 per cent", or straight to "0.35 of". Let us know which one your child is being taught and these pages will follow it.',
    },
    vocabularyForParent: [
      'percent (a count out of a hundred, whatever size the group really is)',
      'equivalent forms (the percent, the decimal and the fraction that name one share)',
      'benchmark percent (a tenth, a quarter, a half — shares simple enough to find without written work)',
    ],
  },
});
