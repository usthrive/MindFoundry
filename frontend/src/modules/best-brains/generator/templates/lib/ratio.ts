/**
 * G4 — ratios, rates, percent (E1, E2, E3, E16, E17)
 *
 * The family that carries the Level-E proportional-reasoning block:
 * equivalent-ratio fill, ratio-table cell, unit rate, better-buy, the three
 * names of one share (percent / fraction / decimal), percent-of and percent-off,
 * and the constant of proportionality k.
 *
 * Contract every family in this directory follows:
 *  - generators return an `ItemGen` (see lib/items.ts) and stamp `authorMeta`;
 *  - every computational item names a `templateId` registered in the array
 *    below, so QG-5 re-derives its answer from the same params the generator
 *    used and a wrong answer key is structurally impossible;
 *  - embedded-claim items (discrimination / error-analysis) register a
 *    `verifyFor` instead, which QG-11 calls the same way;
 *  - prose is interpolated ONLY through lib/format.ts, never a bare `${…}`;
 *  - figures come from lib/figures.ts and are built from the item's OWN drawn
 *    values, so QG-13 can prove the picture agrees with the answer.
 *
 * `registry.ts` spreads `RATIO_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 *
 * ---------------------------------------------------------------------------
 * ARITHMETIC LAW (FILL-ARCHITECTURE §2, G4): percent is `base · p / 100`
 * evaluated on SCALED INTEGERS via `compute.ts`, never on floats. `0.1 * 3` is
 * 0.30000000000000004 in IEEE754, and a curriculum that teaches "a percent is a
 * per-hundred count" cannot ship a price with a float tail. Every value below
 * flows through `mulDec` / `subDec` / `divDecByWhole` / `fracToDec`, all of which
 * are exact scaled-integer operations, and every draw is sized so the exact
 * result LANDS on a legal surface (a money amount never runs finer than a cent,
 * a count of people is always whole).
 *
 * DISTRACTOR LAW: a wrong option is the genuine OUTPUT of a named misconception,
 * computed by the same code that computes the truth —
 *   - ADDITIVE SCALING          adds the same number to both terms of a ratio
 *                               (`ratio_verify_scale_v1`);
 *   - PART:PART ↔ PART:WHOLE    names 3 gold : 5 glass as "3/5 are gold"
 *                               (`ratio_verify_part_whole_v1`);
 *   - STACKED PERCENTS          "40% off then 20% off = 60% off"
 *                               (`ratio_verify_stacked_pct_v1`).
 *
 * WEEK AUTHORS: the distractor `errorTag`s used here are `concept-misconception`,
 * `task-comprehension`, `procedure-slip` and `representation-misread`; a week
 * serving these generators must bank all of the tags its chosen items emit
 * (assemble.ts refuses a blueprint whose mistakeBank misses one).
 */

import type { BBFigure } from '../../../figures/types';
import {
  formatDec,
  formatFrac,
  fracToDec,
  mulDec,
  num,
  reduceFrac,
  str,
  subDec,
  divDecByWhole,
  type AnswerDef,
  type VerifyDef,
} from './compute';
import { discrimination } from './discrimination';
import { errorAnalysis } from './erroranalysis';
import { areaGrid, barModel, assertsParam } from './figures';
import { countNoun, money, wholeMoney } from './format';
import { multiStep, multiStepDec, type ItemGen } from './multistep';
import { numberWords } from '../shared';
import { situation } from './situations';

// ---------------------------------------------------------------------------
// Exact percent / rate arithmetic — the single place these values are computed
// ---------------------------------------------------------------------------

/** `pct`% OF a base amount (a canonical decimal string): base × pct/100, exact. */
export function percentOfValue(base: string, pct: number): string {
  return mulDec(base, fracToDec(pct, 100));
}

/** The amount LEFT after `pct`% is taken off, exact. */
export function percentOffValue(base: string, pct: number): string {
  return subDec(base, percentOfValue(base, pct));
}

/** A whole number of cents as its canonical dollar string ("450" → "4.5"). */
function dollars(cents: number): string {
  return formatDec(cents, 2);
}

/**
 * Every money amount inside ONE prose string, rendered the same way — the
 * all-or-none cents rule of `format.ts` §P1 expressed as code. A string that
 * mentions cents anywhere prints every amount with cents ("$4.50" beside
 * "$8.00"); a string where every amount is whole dollars prints them bare.
 */
function cashList(cents: readonly number[]): string[] {
  const anyCents = cents.some((c) => c % 100 !== 0);
  return cents.map((c) => (anyCents ? money(dollars(c)) : wholeMoney(c / 100)));
}

/**
 * Two pack offers where "cheaper at the till" and "cheaper per item" DISAGREE —
 * the condition that makes a better-buy question a rate question at all. The
 * bounds prove it rather than hoping for it: the big pack's total
 * (`bigEach·bigQ ≥ 30·8`) always exceeds the small pack's
 * (`≤ (bigEach+15)·4`), because `8e > 4e + 60` for every `e ≥ 30`.
 */
/**
 * Two pack offers whose better-value side is DRAWN, not fixed.
 *
 * This used to be `trapPacks`, and its own comment stated the design: "the BIG
 * pack is better per item … the small pack is the trap." Measured over 4,000
 * draws of `betterBuy`, that made three faults at once:
 *
 *   · "the pack of three"/"the pack of four" were offered on ~50% of draws
 *     each and keyed on 0.0% — so ALWAYS PICK THE BIGGER PACK won 100% of
 *     exposures, with no arithmetic;
 *   · "they are the same value" was offered on 100% and keyed on 0.0% — the
 *     L38 permanently unkeyable card, the sixth instance in this library;
 *   · and the strategy it rewards is false in life. "The big pack is better
 *     value" is exactly the shopping misconception a better-buy item exists to
 *     break, and the generator was teaching it.
 *
 * The outcome is now drawn first and the prices built to match — the move that
 * fixed `countTheSignsTrap` and `compareNegativesTrap`. All three cards are
 * reachable in equal thirds.
 *
 * The till-vs-per-item TRAP (the better-value pack costing more at the till) is
 * only constructible when the larger pack wins — a smaller pack that is better
 * per item is also cheaper at the till, necessarily. So the trap lives on the
 * `larger` third, and the other two thirds carry the lesson that makes the trap
 * safe to teach: you cannot know which side wins without working it out.
 */
type PackOutcome = 'larger' | 'smaller' | 'tie';

function packOffers(
  r: { int: (lo: number, hi: number) => number; pick: <T>(xs: readonly T[]) => T },
  outcome: PackOutcome,
): { bigQ: number; smallQ: number; bigEach: number; smallEach: number; bigTotal: number; smallTotal: number } {
  const cheapEach = r.int(6, 12) * 5;              // 30–60c per item
  const dearEach = cheapEach + r.int(1, 3) * 5;    // 5–15c dearer per item
  const bigQ = r.int(8, 12);
  const smallQ = r.pick([3, 4]);
  const bigEach = outcome === 'smaller' ? dearEach : cheapEach;
  const smallEach = outcome === 'larger' ? dearEach : cheapEach;
  return {
    bigQ, smallQ, bigEach, smallEach,
    bigTotal: bigEach * bigQ,
    smallTotal: smallEach * smallQ,
  };
}

/** A base such that `base × pct / 100` is a WHOLE number (people are not fractional). */
function wholeBaseFor(r: { int: (lo: number, hi: number) => number }, pct: number): number {
  const g = gcdInt(pct, 100);
  const step = 100 / g; // the smallest base that clears the division
  return step * r.int(2, Math.max(2, Math.floor(240 / step)));
}

function gcdInt(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

// ---------------------------------------------------------------------------
// Draw pools — nouns bound to the frame that can truthfully carry them
// ---------------------------------------------------------------------------

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

/** Two distinct names (never a hardcoded name that is also in the pool). */
function two(r: { shuffle: <T>(a: readonly T[]) => T[] }): [string, string] {
  return r.shuffle([...NAMES]).slice(0, 2) as [string, string];
}

/**
 * Two-part mixes: the pair is the unit of draw, so the parts always belong
 * together, and `unit` is the word both parts share (a mix of tins and tins
 * totals TINS — a combined total needs one honest noun).
 */
const MIXES = [
  { what: 'A paint mix', first: 'blue tins', second: 'white tins', unit: 'tins' },
  { what: 'A fruit drink', first: 'juice cups', second: 'water cups', unit: 'cups' },
  { what: 'A mortar mix', first: 'cement scoops', second: 'sand scoops', unit: 'scoops' },
  { what: 'A bird feed', first: 'oat scoops', second: 'seed scoops', unit: 'scoops' },
  { what: 'A dye bath', first: 'red drops', second: 'yellow drops', unit: 'drops' },
] as const;

/** Two-colour collections, for part:part vs part:whole. */
const COLLECTIONS = [
  { thing: 'beads', a: 'gold beads', b: 'glass beads' },
  { thing: 'tiles', a: 'plain tiles', b: 'patterned tiles' },
  { thing: 'cards', a: 'shiny cards', b: 'matt cards' },
  { thing: 'counters', a: 'red counters', b: 'blue counters' },
] as const;

/** Steady-rate machines, for unit rate and the constant of proportionality. */
const RATES = [
  { agent: 'A printer', out: 'pages', per: 'minutes' },
  { agent: 'A pump', out: 'litres', per: 'minutes' },
  { agent: 'A conveyor', out: 'crates', per: 'minutes' },
  { agent: 'A weaving loom', out: 'centimetres', per: 'minutes' },
] as const;

/** Priced goods, for unit price / better buy / percent-off. */
const GOODS = [
  { one: 'pen', many: 'pens' },
  { one: 'sponge', many: 'sponges' },
  { one: 'notebook', many: 'notebooks' },
  { one: 'battery', many: 'batteries' },
] as const;

const GARMENTS = ['jacket', 'coat', 'backpack', 'pair of boots', 'tent'] as const;

// ---------------------------------------------------------------------------
// Figure attachment — no new rng draw, built from the item's OWN params
// ---------------------------------------------------------------------------

/**
 * Attach a figure computed from the drafted item's own `generator.params`.
 * Modeled on `asWarmup`: all work happens inside the returned closure and no
 * new value is drawn, so the item's surface signature (and therefore QG-1/QG-4)
 * is untouched and the pack stays bit-stable per seed.
 */
function withFigure(base: ItemGen, build: (params: Record<string, unknown>) => BBFigure | null): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const fig = d.generator ? build(d.generator.params) : null;
    return fig ? { ...d, figure: fig } : d;
  };
}

// ===========================================================================
// E1 — ratios: equivalent ratios, ratio tables, part:whole
// ===========================================================================

/**
 * Equivalent-ratio fill: scale a two-part mix and name the missing part.
 * The bar figure shows the ORIGINAL ratio only — drawing the scaled bar would
 * hand over the answer the item exists to ask for (d04's L33 note).
 */
export function equivalentRatioFill(): ItemGen {
  return withFigure(
    situation({
      situationType: 'rate',
      cognitiveOp: 'ratio-equivalent',
      draw: (r) => {
        const a = r.int(2, 7);
        const b = a + r.int(1, 5); // b ≠ a by construction: an equal ratio has no scaling to see
        const k = r.int(2, 6);
        const mix = r.pick(MIXES);
        return {
          prompt: `${mix.what} uses ${countNoun(a, mix.first)} for every ${countNoun(b, mix.second)}. Keeping the mix exactly the same, how many ${mix.second} go with ${countNoun(a * k, mix.first)}?`,
          answerValue: String(b * k),
          templateId: 'ratio_equivalent_v1',
          params: { a, b, k, want: 'second' },
          units: mix.second,
          hints: [
            'Does keeping a mix the same mean adding the same amount to both parts, or growing both by the same factor?',
            'Work out what the first part was multiplied by, then apply that same multiplier to the other part.',
          ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      },
    }),
    (p) => {
      const a = Number(p.a);
      const b = Number(p.b);
      return barModel(
        [
          { label: 'first part', segments: [{ value: a, label: String(a) }] },
          { label: 'second part', segments: [{ value: b, label: String(b) }] },
        ],
        { scaleMax: Math.max(a, b), alt: `a bar of ${a} for the first part beside a bar of ${b} for the second part` },
      );
    },
  );
}

/** Ratio-table cell: a later row of a structure-preserving table. */
export function ratioTableCell(): ItemGen {
  return situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'ratio-table',
    draw: (r) => {
      const a = r.int(2, 6);
      const b = a + r.int(1, 6);
      const m = r.int(2, 7);
      const x = a * m;
      return {
        prompt: `A ratio table pairs ${countNoun(a, 'litres')} of paint with ${countNoun(b, 'square metres')} of wall in its first row. A later row shows ${countNoun(x, 'litres')} of paint. How many square metres does that row pair with?`,
        answerValue: String(b * m),
        templateId: 'ratio_table_cell_v1',
        params: { a, b, x },
        units: 'square metres',
        hints: [
          'What has to stay true of every row of a ratio table?',
          'Compare the new row with the first row to find the factor, then move that factor across the columns.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

/**
 * Part:whole from a part:part ratio — the item the part:part ↔ part:whole
 * confusion attacks. The answer is a reduced fraction, so it validates as
 * `equivalent-fraction`.
 */
export function partToWholeShare(): ItemGen {
  return situation({
    situationType: 'part-whole',
    cognitiveOp: 'part-whole-ratio',
    draw: (r) => {
      const p = r.int(2, 7);
      const q = r.int(2, 9);
      const c = r.pick(COLLECTIONS);
      return {
        prompt: `A box holds ${countNoun(p, c.a)} for every ${countNoun(q, c.b)}. What fraction of all the ${c.thing} are ${c.a.split(' ')[0]}?`,
        answerValue: formatFrac(reduceFrac(p, p + q)),
        templateId: 'ratio_part_whole_v1',
        params: { p, q },
        validation: 'equivalent-fraction',
        acceptableForms: [],
        hints: [
          'Is the bottom of this fraction one of the two groups, or everything in the box?',
          'Count the whole collection first, then say how much of that whole one group is.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

// ===========================================================================
// E2 — rates, unit rates, better buy
// ===========================================================================

/** Unit rate off a steady machine ("how far in ONE minute?"). */
export function unitRate(): ItemGen {
  return situation({
    situationType: 'rate',
    cognitiveOp: 'unit-rate',
    draw: (r) => {
      const rate = r.pick(RATES);
      const per = r.int(3, 9);
      const unit = r.int(12, 60);
      return {
        prompt: `${rate.agent} makes ${countNoun(unit * per, rate.out)} in ${countNoun(per, rate.per)} at a steady rate. How many ${rate.out} is that in one minute?`,
        answerValue: String(unit),
        templateId: 'ratio_unit_rate_v1',
        params: { total: String(unit * per), count: per },
        units: rate.out,
        hints: [
          'How much of the time does one minute account for?',
          'Share the whole amount equally across the time it took.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/** Unit PRICE — the "for ONE" anchor, in money. */
export function unitPrice(): ItemGen {
  return situation({
    situationType: 'money-change',
    cognitiveOp: 'unit-rate',
    draw: (r) => {
      const good = r.pick(GOODS);
      const packSize = r.pick([4, 5, 6, 8]);
      const eachCents = r.int(5, 19) * 5;
      const totalCents = eachCents * packSize;
      const [total] = cashList([totalCents]);
      return {
        prompt: `A pack of ${numberWords(packSize)} ${good.many} costs ${total}. Every ${good.one} in the pack costs the same. What does one ${good.one} cost?`,
        answerValue: dollars(eachCents),
        templateId: 'ratio_unit_rate_v1',
        params: { total: dollars(totalCents), count: packSize },
        units: 'dollars',
        hints: [
          'Which is being asked for — the price of the whole pack, or the price for just one?',
          'Split the pack price equally between the items in the pack.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  });
}

/** Unit rate → total: scale a per-one price up to a stated quantity. */
export function totalFromUnitPrice(): ItemGen {
  return situation({
    situationType: 'rate',
    cognitiveOp: 'rate-total',
    draw: (r) => {
      // $1.00 A KILOGRAM IS EXCLUDED. `r.int(6, 24) * 10` included 100, and at
      // exactly one dollar the cost of k kilograms IS k — the number the
      // sentence has already printed — so the item answers itself. One draw in
      // nineteen by construction; measured at 5.7% of 4,000 draws, and E2's
      // author kept the generator off both mastery forms because of it.
      const eachCents = r.pick([6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]) * 10;
      const count = r.int(3, 9);
      const [each] = cashList([eachCents]);
      return {
        prompt: `Rice costs ${each} for one kilogram. At that price, what do ${countNoun(count, 'kilograms')} cost?`,
        answerValue: dollars(eachCents * count),
        templateId: 'ratio_rate_total_v1',
        params: { rate: dollars(eachCents), count },
        units: 'dollars',
        hints: [
          'Does a price for one go up or down when more is bought?',
          'Treat the price for one as a building block and take as many of them as the amount asks for.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/**
 * Better buy — the E2 discrimination BY DESIGN: the pack with the lower TOTAL is
 * drawn to be the WORSE value per item, so "cheaper total" and "cheaper per unit"
 * point at different packs and the child must choose the rate.
 */
export function betterBuy(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'compare-rates',
    draw: (r) => {
      const good = r.pick(GOODS);
      // WHICH SIDE WINS IS DRAWN, in equal thirds — see `packOffers`.
      const outcome: PackOutcome = r.pick(['larger', 'smaller', 'tie'] as const);
      const { bigQ, smallQ, bigEach, smallEach, bigTotal, smallTotal } = packOffers(r, outcome);
      // Which pack is NAMED first is drawn separately, so neither the winning
      // side nor its position is predictable.
      const bigFirst = r.chance(0.5);
      const bigName = `the pack of ${numberWords(bigQ)}`;
      const smallName = `the pack of ${numberWords(smallQ)}`;
      const same = 'they are the same value';
      // The key and the two cards that are not it, derived from the outcome —
      // never a fixed list beside a truth that can now equal it (the rule three
      // generators in this library learned the hard way).
      const value = outcome === 'tie' ? same : outcome === 'larger' ? bigName : smallName;
      const wrongCards: Array<{ text: string; why: 'till' | 'bulk' | 'same' }> =
        outcome === 'tie'
          ? [{ text: bigName, why: 'bulk' }, { text: smallName, why: 'till' }]
          : outcome === 'larger'
            ? [{ text: smallName, why: 'till' }, { text: same, why: 'same' }]
            : [{ text: bigName, why: 'bulk' }, { text: same, why: 'same' }];
      void bigEach;
      void smallEach;
      const [firstQ, firstTotal, secondQ, secondTotal] = bigFirst
        ? [bigQ, bigTotal, smallQ, smallTotal]
        : [smallQ, smallTotal, bigQ, bigTotal];
      const [c1, c2] = cashList([firstTotal, secondTotal]);
      return {
        prompt: `A shop sells ${good.many} two ways: a pack of ${numberWords(firstQ)} for ${c1}, or a pack of ${numberWords(secondQ)} for ${c2}. Which is the better buy?`,
        correct: value,
        distractors: wrongCards.map((c) => (
          c.why === 'till'
            ? {
              text: c.text,
              errorTag: 'concept-misconception' as const,
              rationale: 'Picks the smaller amount at the till, which answers "which costs less", not "which costs less for each item".',
            }
            : c.why === 'bulk'
              ? {
                text: c.text,
                errorTag: 'concept-misconception' as const,
                rationale: 'Assumes the bigger pack must be the better value, without bringing either offer down to one item.',
              }
              : {
                text: c.text,
                errorTag: 'representation-misread' as const,
                rationale: 'Treats two different prices per item as one deal.',
              }
        )),
        hints: [
          'Which question is being asked — which costs less altogether, or which costs less for each one?',
          'Bring both offers down to what a single item costs, then the two are comparable.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

// ===========================================================================
// E3 — meeting percent: the three names of one share
// ===========================================================================

/**
 * Percent OF a count. The hundred-square figure asserts the drawn `pct` (the
 * per-hundred model made literal) — it pictures what is GIVEN, never the answer.
 */
export function percentOfCount(): ItemGen {
  return withFigure(
    situation({
      situationType: 'part-whole',
      cognitiveOp: 'percent-of',
      draw: (r) => {
        const pct = r.pick([10, 15, 20, 25, 30, 35, 40, 60, 75, 80]);
        const base = wholeBaseFor(r, pct);
        const thing = r.pick(['students', 'members', 'visitors', 'readers', 'players']);
        return {
          prompt: `A club has ${countNoun(base, thing)}. ${pct}% of them came on Saturday. How many came on Saturday?`,
          answerValue: percentOfValue(String(base), pct),
          templateId: 'ratio_pct_of_v1',
          params: { base: String(base), pct },
          units: thing,
          hints: [
            'What does a percent count out of — the group itself, or a hundred?',
            'Rewrite the percent as its per-hundred share, then take that share of the whole group.',
          ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      },
    }),
    (p) => {
      const pct = Number(p.pct);
      return areaGrid(
        { rows: 10, cols: 10, shaded: pct },
        { alt: `a hundred-square with ${pct} of its 100 cells shaded`, asserts: assertsParam('pct') },
      );
    },
  );
}

/** Percent OFF a price — the sale-price form (E17's workhorse). */
export function percentOffPrice(): ItemGen {
  return situation({
    situationType: 'money-change',
    cognitiveOp: 'percent-off',
    draw: (r) => {
      const base = r.int(2, 9) * 20;
      const pct = r.pick([10, 15, 20, 25, 30, 40, 50, 60]);
      const garment = r.pick(GARMENTS);
      const [price] = cashList([base * 100]);
      return {
        prompt: `A ${garment} is priced at ${price}. In the sale it is ${pct}% off. What is the sale price?`,
        answerValue: percentOffValue(String(base), pct),
        templateId: 'ratio_pct_off_v1',
        params: { base: String(base), pct },
        units: 'dollars',
        hints: [
          'Is the percent naming the part taken away, or the part still paid?',
          'Find the size of the reduction first, then take it off the original price.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  });
}

/**
 * One share, three names — percent ↔ decimal ↔ fraction.
 * `kind` picks which name the child writes; each kind carries its own hint
 * ladder so a week may serve two of them without tripping the dedup gate.
 */
export function percentConversion(kind: 'to-decimal' | 'to-fraction' | 'from-fraction'): ItemGen {
  return situation({
    situationType: 'part-whole',
    cognitiveOp: `percent-convert-${kind}`,
    draw: (r) => {
      if (kind === 'from-fraction') {
        const d = r.pick([4, 5, 8, 10, 20, 25]);
        const n = r.int(1, d - 1);
        const g = gcdInt(n, d);
        const [n2, d2] = [n / g, d / g];
        const value = fracToDec(n2 * 100, d2);
        return {
          // Stated as "n out of every d", never as a fraction literal: an
          // unreduced n/d in real-world prose is a QG-12b defect, and the pair
          // is reduced at the SOURCE so params and prose cannot disagree.
          prompt: `In a survey, ${n2} out of every ${d2} people chose blue. Write that share as a percent.`,
          answerValue: value,
          templateId: 'ratio_frac_to_pct_v1',
          params: { n: n2, d: d2 },
          acceptableForms: [`${value}%`],
          hints: [
            'How many people would that share be if the survey had asked exactly a hundred?',
            'Rename the share so its bottom number is a hundred; the top is then the percent.',
          ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      }
      const pct = r.pick([5, 12, 15, 24, 25, 35, 40, 45, 60, 64, 75, 80]);
      if (kind === 'to-decimal') {
        return {
          prompt: `A shop sign shows ${pct}% off. Write ${pct}% as a decimal.`,
          answerValue: fracToDec(pct, 100),
          templateId: 'ratio_pct_to_dec_v1',
          params: { pct },
          hints: [
            'Which place value does a per-hundred count land in?',
            'Read the percent as hundredths, then write those hundredths after the point.',
          ],
          errorTags: ['representation-misread', 'procedure-slip'],
        };
      }
      return {
        prompt: `A battery indicator reads ${pct}%. Write ${pct}% as a fraction in simplest form.`,
        answerValue: formatFrac(reduceFrac(pct, 100)),
        templateId: 'ratio_pct_to_frac_v1',
        params: { pct },
        validation: 'equivalent-fraction',
        acceptableForms: [],
        hints: [
          'What is the bottom number of any fraction a percent is really naming?',
          'Write it over a hundred first, then simplify by a factor the two share.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/** "40% of 50 vs 50% of 40" — the commutativity of percent-of, as a trap. */
export function percentOfEquality(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'percent-compare',
    draw: (r) => {
      const p = r.pick([20, 25, 40, 60, 80]);
      const q = r.pick([30, 50, 70, 90]);
      return {
        prompt: `Which is larger: ${p}% of ${q}, or ${q}% of ${p}?`,
        correct: 'they are equal',
        correctForms: ['equal', 'the same'],
        distractors: [
          {
            text: `${p}% of ${q}`,
            errorTag: 'concept-misconception',
            rationale: 'Judges by the larger starting amount, as if the percent were an amount added on.',
          },
          {
            text: `${q}% of ${p}`,
            errorTag: 'representation-misread',
            rationale: 'Judges by the larger percent alone, ignoring what it is a percent OF.',
          },
        ],
        hints: [
          'Which two numbers are being multiplied in each case?',
          'Write both as a per-hundred share times a whole, then look at the two products.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

// ===========================================================================
// E16 — proportional relationships and the constant k
// ===========================================================================

/** Find k from one (x, y) pair on a through-the-origin relationship. */
export function constantOfProportionality(): ItemGen {
  return situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'constant-of-proportionality',
    draw: (r) => {
      const rate = r.pick(RATES);
      const kd = r.pick([1, 1, 1, 2]);
      const x = r.int(2, 9) * kd;
      const kn = r.int(3, 9);
      const y = (x * kn) / kd;
      return {
        prompt: `${rate.agent} runs at a steady rate: ${countNoun(y, rate.out)} in ${countNoun(x, rate.per)}. What is the constant of proportionality, in ${rate.out} per minute?`,
        answerValue: fracToDec(y, x),
        templateId: 'ratio_k_v1',
        params: { y, x },
        units: rate.out,
        hints: [
          'What does the constant of proportionality measure — the whole journey, or one unit of it?',
          'Divide the output by the input; the answer is what one unit of the input produces.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/** Proportional vs additive table — the E16 discrimination, both tables drawn. */
export function proportionalVsAdditiveTable(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'classify-relationship',
    draw: (r) => {
      const k = r.int(3, 6);
      const c = r.int(2, 7);
      const xs = [r.int(2, 3), r.int(4, 6), r.int(7, 9)];
      const rowsOf = (f: (x: number) => number) => xs.map((x) => `${x} → ${f(x)}`).join(', ');
      const proportional = rowsOf((x) => x * k);
      const additive = rowsOf((x) => x + c);
      const scattered = rowsOf((x) => x * k + c);
      return {
        prompt: 'Which table shows a proportional relationship?',
        correct: proportional,
        distractors: [
          {
            text: additive,
            errorTag: 'concept-misconception',
            rationale: 'Every output rises as the input rises, but by a fixed amount added — the ratio output-to-input keeps changing.',
          },
          {
            text: scattered,
            errorTag: 'representation-misread',
            rationale: 'Grows by a steady multiple PLUS a fixed extra, so the line it draws misses the origin.',
          },
        ],
        hints: [
          'What has to be the same in every row of a proportional table?',
          'Divide each output by its own input and see which table gives one repeated value.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

// ===========================================================================
// E17 — percent applications: percent-of vs percent-off
// ===========================================================================

/** The E17 discrimination: which number is the amount actually PAID? */
export function percentOfVsPercentOff(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'percent-choose',
    draw: (r) => {
      const base = r.int(2, 9) * 20;
      // 50% is excluded on purpose: there the amount paid and the reduction are
      // the same number, so the three options would collapse into two.
      const pct = r.pick([10, 20, 25, 30, 40, 60]);
      const garment = r.pick(GARMENTS);
      const paid = percentOffValue(String(base), pct);
      const cut = percentOfValue(String(base), pct);
      return {
        // The prompt renders the price the same way the options do, so the child
        // is choosing between amounts, not between typographies.
        prompt: `A ${garment} is priced at ${money(String(base))} and the sign says ${pct}% off. Which amount is handed over at the till?`,
        correct: money(paid),
        distractors: [
          {
            text: money(cut),
            errorTag: 'task-comprehension',
            rationale: 'Names the size of the reduction — the amount saved, not the amount paid.',
          },
          {
            text: money(String(base)),
            errorTag: 'concept-misconception',
            rationale: 'Leaves the price untouched, as if the sign changed nothing.',
          },
        ],
        hints: [
          'Does the percent on the sign name the part kept, or the part taken away?',
          'Split the price into the part removed and the part still owed, then say which one the till asks for.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  });
}

// ===========================================================================
// Multi-step chains (answer + step-count both come from the shipped op-chain)
// ===========================================================================

/** E1: combine the two parts of a mix, then scale the whole batch. */
export function msCombineThenScale(): ItemGen {
  return multiStep({
    situationType: 'combine',
    cognitiveOp: 'ratio-equivalent',
    draw: (r) => {
      const mix = r.pick(MIXES);
      const a = r.int(3, 8);
      const b = r.int(2, 7);
      const batches = r.int(3, 6);
      const [n1] = two(r);
      return {
        prompt: `${mix.what} uses ${countNoun(a, mix.first)} and ${countNoun(b, mix.second)} for one batch. ${n1} makes ${countNoun(batches, 'batches')} of it. How many ${mix.unit} go in altogether?`,
        initN: a,
        steps: [{ op: 'add', n: b, d: 1 }, { op: 'mul', n: batches, d: 1 }],
        units: mix.unit,
        hints: [
          'Which comes first — finding what one batch needs, or growing it to all the batches?',
          'Total one batch first, then repeat that total once for each batch made.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  });
}

/** E2: unit rate → total, the two-move chain the better-buy defence rests on. */
export function msUnitRateThenTotal(): ItemGen {
  return multiStepDec({
    situationType: 'rate',
    cognitiveOp: 'unit-rate',
    draw: (r) => {
      const good = r.pick(GOODS);
      const packSize = r.pick([4, 5, 6, 8]);
      const eachCents = r.int(5, 19) * 5;
      const totalCents = eachCents * packSize;
      const buy = r.int(9, 15);
      const [total] = cashList([totalCents]);
      return {
        prompt: `${good.many[0].toUpperCase()}${good.many.slice(1)} cost ${total} for a pack of ${numberWords(packSize)}. At that same price for each ${good.one}, what do ${numberWords(buy)} ${good.many} cost?`,
        init: dollars(totalCents),
        steps: [{ op: 'div', v: String(packSize) }, { op: 'mul', v: String(buy) }],
        units: 'dollars',
        hints: [
          'Can the two amounts be compared before the price for a single one is known?',
          'Bring the pack down to what one costs, then build up to the number wanted.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  });
}

/** E16: find k, then predict — the two moves of a proportional relationship. */
export function msFindKThenPredict(): ItemGen {
  return multiStep({
    situationType: 'rate-of-change',
    cognitiveOp: 'constant-of-proportionality',
    usesPriorSkill: true,
    draw: (r) => {
      const rate = r.pick(RATES);
      const k = r.int(4, 12);
      const x = r.int(3, 8);
      const y = k * x;
      const ask = x + r.int(3, 9);
      return {
        prompt: `${rate.agent} makes ${countNoun(y, rate.out)} in ${countNoun(x, rate.per)} at a steady rate. How many ${rate.out} does it make in ${countNoun(ask, rate.per)}?`,
        initN: y,
        steps: [{ op: 'div', n: x, d: 1 }, { op: 'mul', n: ask, d: 1 }],
        units: rate.out,
        hints: [
          'Is the longer stretch of time a few more than the first, or a whole multiple of it?',
          'Get the amount for a single unit of time first, then take as many of those as the question asks.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/** E17: price → discount → tax, the native money chain. */
export function msDiscountThenTax(): ItemGen {
  return multiStepDec({
    situationType: 'multi-stage',
    cognitiveOp: 'percent-off',
    draw: (r) => {
      const base = r.int(2, 9) * 20;
      const cut = r.pick([10, 20, 25, 50]);
      const tax = r.pick([5, 10]);
      const garment = r.pick(GARMENTS);
      const [price] = cashList([base * 100]);
      return {
        prompt: `A ${garment} is priced at ${price}. A sale takes ${cut}% off, and then a ${tax}% charge is added at the till. What is the final amount paid?`,
        init: String(base),
        steps: [
          { op: 'mul', v: fracToDec(100 - cut, 100) },
          { op: 'mul', v: fracToDec(100 + tax, 100) },
        ],
        units: 'dollars',
        hints: [
          'Are the two percents both measured against the first price, or does the second one act on what is left?',
          'Settle the sale price first, and let the second percent work on that new amount.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

// ===========================================================================
// Named-misconception DISTRACTORS
//
// ⚠ WHY THESE ARE DISCRIMINATIONS AND NOT ERROR-ANALYSES. `erroranalysis.ts`
// resolves `verifyTemplateId` against `LIB_VERIFY_DEFS` in compute.ts ONLY
// (`const VERIFY = new Map(LIB_VERIFY_DEFS…)`), so a verify template registered
// by a FAMILY is invisible to the error-analysis primitive — this module cannot
// reach its own truths from there without editing a file it does not own (the
// G5 integer family solved the same problem by relocating four truths INTO
// compute.ts; doing that from here concurrently would collide with it).
//
// Three of G4's named misconceptions have no equivalent in the shared verify
// library, so they are carried where a misconception legitimately lives without
// one: as CODE-COMPUTED DISTRACTORS on a discrimination item. The truths are
// still registered below as `ratio_verify_*`, computed by the SAME functions the
// distractors use, so the day the resolver reads the registry they light up as
// error-analysis items with nothing else to change.
// ===========================================================================

/** The second term an ADDITIVE scaler produces: adds a·(k−1) to both terms. */
export function additiveScalingTerm(a: number, b: number, k: number): number {
  return b + a * (k - 1);
}

/** PART:PART named as though it were PART:WHOLE. */
export function partPartShare(p: number, q: number): string {
  return formatFrac(reduceFrac(p, q));
}

/** The price two reductions really leave, vs the price of adding them first. */
export function stackedVsAdded(base: string, p1: number, p2: number): { stacked: string; added: string } {
  return {
    stacked: percentOffValue(percentOffValue(base, p1), p2),
    added: percentOffValue(base, p1 + p2),
  };
}

/** E1 — part:part read as part:whole, as a choice between two real fractions. */
export function partWholeVsPartPart(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'part-whole-ratio',
    draw: (r) => {
      const c = r.pick(COLLECTIONS);
      const p = r.int(2, 6);
      const q = p + r.int(1, 4); // p ≠ q, so the two readings cannot coincide
      const first = c.a.split(' ')[0];
      return {
        prompt: `A box holds ${countNoun(p, c.a)} for every ${countNoun(q, c.b)}. Which fraction of ALL the ${c.thing} are ${first}?`,
        correct: formatFrac(reduceFrac(p, p + q)),
        distractors: [
          {
            text: partPartShare(p, q),
            errorTag: 'concept-misconception',
            rationale: 'Puts one group over the OTHER group — a part-to-part ratio wearing a fraction\'s clothes, not a share of the whole.',
          },
          {
            text: formatFrac(reduceFrac(q, p + q)),
            errorTag: 'task-comprehension',
            rationale: 'Gives the share belonging to the other group.',
          },
        ],
        hints: [
          'What is the bottom number of a fraction counting when the fraction describes a share of everything?',
          'Count the whole box first, and let that count sit underneath.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

/** E17 — STACKED PERCENTS: "40% off then 20% off = 60% off". */
export function stackedPercentTrap(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'percent-off',
    draw: (r) => {
      const base = String(r.int(2, 9) * 20);
      const p1 = r.pick([20, 25, 30, 40]);
      const p2 = r.pick([10, 20, 25]);
      const { stacked, added } = stackedVsAdded(base, p1, p2);
      return {
        prompt: `A tent priced at ${money(base)} is reduced by ${p1}%, and that new price is then reduced by ${p2}%. Which amount is the final price?`,
        correct: money(stacked),
        distractors: [
          {
            text: money(added),
            errorTag: 'concept-misconception',
            rationale: 'Adds the two percents and takes them off the first price in one go — but the second reduction acts on a smaller price, so it is worth less.',
          },
          {
            text: money(percentOffValue(base, p1)),
            errorTag: 'task-comprehension',
            rationale: 'Stops after the first reduction and never applies the second.',
          },
        ],
        hints: [
          'Does the second reduction act on the first price, or on the price after the first cut?',
          'Settle the price after one reduction, then let the second one work on that new amount.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

// ===========================================================================
// Error analysis — built on the SHARED verify library, so the shown "wrong" is
// a registered misconception's real output and QG-11 re-derives both numbers
// ===========================================================================

/** E1 — a ratio-table row scaled by ADDING instead of multiplying. */
export function eaScaleByAdding(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'd_verify_binop_misconception_v1',
    cognitiveOp: 'ratio-equivalent',
    // a·b ≠ a+b for every draw here (they coincide only at 2 and 2).
    drawParams: (r) => ({ a: r.int(3, 9), b: r.int(3, 7), op: '*', wrongOp: '+' }),
    build: (v, p) => ({
      prompt: `A ratio table pairs one batch of paint with ${countNoun(Number(p.a), 'white tins')}. A student filled in the row for ${countNoun(Number(p.b), 'batches')} and wrote ${countNoun(Number(v.wrong), 'white tins')}.`,
      extension: 'Draw the row as bars, then write the number of tins the table really pairs with that many batches.',
      hints: [
        'Does a ratio table grow its rows by adding on, or by taking copies?',
        'Picture one row as a bar and lay down as many of those bars as the new row calls for.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    }),
  });
}

/** E2 — the price for ONE found by multiplying the pack price by the pack size. */
export function eaUnitPriceMultiplied(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'd_verify_binop_misconception_v1',
    cognitiveOp: 'unit-rate',
    drawParams: (r) => {
      // `a` STAYS A WHOLE NUMBER OF DOLLARS, and that is not laziness.
      //
      // The realism complaint is correct — "A pack of five sponges costs
      // $20.00" is $4 a sponge — but the first repair fixed it by drawing the
      // per-item price in 20c steps as a FLOAT, and `0.2 * 6` is
      // 1.2000000000000002 in IEEE754. It threw inside `money()` on the third
      // draw: "57.599999999999994 is finer than one cent". This file's own
      // header states the law it broke — every value flows through scaled
      // integers, never floats — so the float version is gone.
      //
      // `r.int(2, 9) * count` keeps `a / count` exactly integral, which is what
      // makes the verify's a/b and a*b safe. The realism is fixed where it
      // actually went wrong: the noun. $2-$9 each is absurd for a sponge and
      // ordinary for a notebook, and the noun was hard-coded here while the
      // rest of the family draws from `GOODS`.
      const count = r.pick([4, 5, 6, 8]);
      return { a: r.int(2, 9) * count, b: count, op: '/', wrongOp: '*' };
    },
    build: (v, p) => ({
      // Both amounts render with cents, so the string obeys the all-or-none rule.
      prompt: `A pack of ${numberWords(Number(p.b))} notebooks costs ${money(String(p.a))}. A student worked out the price of ONE notebook and wrote ${money(v.wrong)}.`,
      extension: 'Write what a single notebook really costs, then say how the SIZE of that answer could have been predicted before any working.',
      hints: [
        'Should one item out of a pack cost more or less than the whole pack?',
        'Share the pack price out between the items rather than stacking copies of it.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    }),
  });
}

/** E3 / E17 — the percent multiplied as digits, with the point dropped. */
export function eaPercentPointDrop(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'd_verify_dec_v1',
    cognitiveOp: 'percent-of',
    drawParams: (r) => ({
      a: String(r.int(2, 9) * 20),
      b: fracToDec(r.pick([10, 15, 20, 25, 30, 40]), 100),
      op: '*',
      wrongMode: 'point-drop',
    }),
    build: (v, p, r) => {
      const garment = r.pick(GARMENTS);
      const pct = mulDec(String(p.b), '100');
      return {
        prompt: `A shop takes ${pct}% off a ${garment} priced at ${money(String(p.a))}. A student worked out the size of the reduction and wrote ${money(v.wrong)}.`,
        extension: 'Shade the percent on a hundred-square, then write the reduction the shading really gives.',
        hints: [
          'Roughly how big should a part of a price be, next to the price itself?',
          'Rewrite the percent as its per-hundred share before multiplying, and keep track of where the point sits.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  });
}

/**
 * E16 — an ADDITIVE table read as proportional. The anchor row is 2 → 4, which
 * is the one row that "add 2" and "double" agree on: that coincidence is exactly
 * what lets the misconception survive a check, so it is what the item shows.
 */
export function eaTableAsProportional(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'd_verify_binop_misconception_v1',
    cognitiveOp: 'classify-relationship',
    drawParams: (r) => ({ a: r.int(5, 14), b: 2, op: '+', wrongOp: '*' }),
    build: (v, p) => ({
      prompt: `A table follows the rule "the output is the input plus 2", and its first row pairs an input of 2 with an output of 4. A student read the table as proportional and wrote that an input of ${p.a} gives ${v.wrong}.`,
      extension: 'Write the output the rule really gives, then say which single row let both readings look right.',
      hints: [
        'Does one matching row prove a rule, or does a rule have to hold for every row?',
        'Test both readings on a second row and see where they part company.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    }),
  });
}

/** E1 — additive vs multiplicative growth, decided on the numbers themselves. */
export function additiveVsMultiplicativeGrowth(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'ratio-equivalent',
    draw: (r) => {
      const mix = r.pick(MIXES);
      const a = r.int(2, 5);
      const b = a + r.int(2, 5);
      const k = r.int(3, 5);
      return {
        prompt: `${mix.what} uses ${countNoun(a, mix.first)} to ${countNoun(b, mix.second)}. Scaled up to ${countNoun(a * k, mix.first)}, which number of ${mix.second} keeps the mix the same?`,
        correct: String(b * k),
        distractors: [
          {
            text: String(additiveScalingTerm(a, b, k)),
            errorTag: 'concept-misconception',
            rationale: 'Adds to the second part the same number that was added to the first — additive scaling, which changes the mix.',
          },
          {
            text: String(a * k),
            errorTag: 'representation-misread',
            rationale: 'Repeats the scaled first part, as if both parts of the mix were the same size.',
          },
        ],
        hints: [
          'Which change leaves a mix tasting the same — adding to both parts, or copying both parts?',
          'Count how many copies of the original first part the new amount holds, then build the second part the same way.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

// ===========================================================================
// Template registry — QG-5 answers and QG-11 truths for everything above
// ===========================================================================

/** k-scaled term of an equivalent ratio; `want` names which term is missing. */
function ratioEquivalent(p: Record<string, unknown>): string {
  const k = num(p, 'k');
  return String(str(p, 'want') === 'first' ? num(p, 'a') * k : num(p, 'b') * k);
}

/** The paired cell of a ratio table: x : y ≡ a : b, so y = x·b/a (x is a multiple of a). */
function ratioTable(p: Record<string, unknown>): string {
  const a = num(p, 'a');
  const x = num(p, 'x');
  if (x % a !== 0) throw new Error(`ratio table row ${x} is not a whole multiple of ${a}`);
  return String((x / a) * num(p, 'b'));
}

export const RATIO_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  // --- ratios ---------------------------------------------------------------
  /** Equivalent-ratio fill: the k-scaled partner of a two-term ratio. */
  { id: 'ratio_equivalent_v1', answerFor: ratioEquivalent },
  /** Ratio-table cell: the value a later row pairs with, structure preserved. */
  { id: 'ratio_table_cell_v1', answerFor: ratioTable },
  /** Part:whole share read off a part:part ratio, as a reduced fraction. */
  { id: 'ratio_part_whole_v1', answerFor: (p) => formatFrac(reduceFrac(num(p, 'p'), num(p, 'p') + num(p, 'q'))) },
  // --- rates ----------------------------------------------------------------
  /** Unit rate / unit price: an exact share of a total across a whole count. */
  { id: 'ratio_unit_rate_v1', answerFor: (p) => divDecByWhole(str(p, 'total'), num(p, 'count')) },
  /** Unit rate scaled back up to a total (also E16's predict-from-k move). */
  { id: 'ratio_rate_total_v1', answerFor: (p) => mulDec(str(p, 'rate'), String(num(p, 'count'))) },
  /** The constant of proportionality k = y/x, exact. */
  { id: 'ratio_k_v1', answerFor: (p) => fracToDec(num(p, 'y'), num(p, 'x')) },
  // --- percent --------------------------------------------------------------
  /** pct% OF a base — base·p/100 on scaled integers. */
  { id: 'ratio_pct_of_v1', answerFor: (p) => percentOfValue(str(p, 'base'), num(p, 'pct')) },
  /** The amount left after pct% is taken OFF. */
  { id: 'ratio_pct_off_v1', answerFor: (p) => percentOffValue(str(p, 'base'), num(p, 'pct')) },
  /** Percent → decimal. */
  { id: 'ratio_pct_to_dec_v1', answerFor: (p) => fracToDec(num(p, 'pct'), 100) },
  /** Percent → fraction in simplest form. */
  { id: 'ratio_pct_to_frac_v1', answerFor: (p) => formatFrac(reduceFrac(num(p, 'pct'), 100)) },
  /** Fraction → percent (exact; the generator draws terminating denominators). */
  { id: 'ratio_frac_to_pct_v1', answerFor: (p) => fracToDec(num(p, 'n') * 100, num(p, 'd')) },

  // --- verify truths (QG-11) ------------------------------------------------
  // The three named misconceptions the shared verify library cannot express.
  // They ship registered and are computed by the SAME functions the
  // discrimination distractors above use, so they are the single home for each
  // truth — and the moment `erroranalysis.ts` resolves verify ids through the
  // registry (or these truths are relocated to LIB_VERIFY_DEFS, as G5 did for
  // the integer family), the matching error-analysis items need no other change.
  /** ADDITIVE SCALING: the true scaled term vs the term reached by adding. */
  {
    id: 'ratio_verify_scale_v1',
    verifyFor: (p) => {
      const a = num(p, 'a');
      const b = num(p, 'b');
      const k = num(p, 'k');
      if (a === b || k < 2) throw new Error('additive scaling has no output when the terms are equal or nothing is scaled');
      return { correct: String(b * k), wrong: String(additiveScalingTerm(a, b, k)) };
    },
  },
  /** PART:PART ↔ PART:WHOLE: the true share of the whole vs the part:part name. */
  {
    id: 'ratio_verify_part_whole_v1',
    verifyFor: (p) => {
      const a = num(p, 'p');
      const b = num(p, 'q');
      return { correct: formatFrac(reduceFrac(a, a + b)), wrong: partPartShare(a, b) };
    },
  },
  /** STACKED PERCENTS: two reductions applied in turn vs the two added together. */
  {
    id: 'ratio_verify_stacked_pct_v1',
    verifyFor: (p) => {
      const p1 = num(p, 'p1');
      const p2 = num(p, 'p2');
      if (p1 + p2 >= 100) throw new Error('stacked percents must leave something to pay');
      const { stacked, added } = stackedVsAdded(str(p, 'base'), p1, p2);
      return { correct: stacked, wrong: added };
    },
  },
];
