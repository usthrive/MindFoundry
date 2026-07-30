/**
 * Level B · Week 19 — "Even, odd & fair shares" (conceptId: even-odd-fair-shares).
 *
 * FILL-ARCHITECTURE §4 row B19: anchor "pair-up test"; multi-step "share then
 * check the pairs"; error-analysis "15 is even — it ends in 5's count";
 * discrimination "ends-in digit vs pair test"; Day-5 signature "ASN: an even
 * number always shares fairly by 2". Catalog focus: "Even/odd via pairing;
 * doubles facts" and "Fair-share reasoning: can 13 be split fairly? Prove it".
 *
 * WHAT THIS WEEK IS FOR. A child who owns "ends in 0, 2, 4, 6 or 8" owns a rule.
 * A child who puts the things in twos and looks at what is left owns a reason.
 * This week is the reason, and it is built so the reason is the only route:
 *   1. EVEN means it pairs up with nothing left over. That is the definition the
 *      pages work from, never the digit list.
 *   2. The digit rule is a CONSEQUENCE, and the pages say why: a whole ten pairs
 *      up on its own, every time, so the tens can never leave anything behind
 *      and only the ones at the end can. That single sentence is what turns a
 *      remembered list into something a six-year-old can defend.
 *   3. An even number is a DOUBLE (the catalog's second focus), because two
 *      matching shares are exactly what pairing up produces. `twoEqualCases`
 *      makes that a page rather than an aside.
 *
 * THE TWO TOOLS, MADE VISIBLY DIFFERENT (the brief's own requirement). The
 * discrimination `sharesFairlyBetweenTwo` puts one number in three unrelated
 * dresses and asks which of the three shares fairly:
 *   - a plain numeral (60–98) — the last digit is right there, and reading it is
 *     the whole job. Pairing 74 things by hand is not on offer;
 *   - "3 tens and 5 ones" (B2's own language) — there is a last digit written,
 *     but it is only trustworthy if you know the tens pair up on their own;
 *   - "8 and 9 added together" — no last digit exists yet. The child has to
 *     reach the number, or reason that one odd amount beside one even amount
 *     must leave one over.
 * Exactly one of the three is even on every draw and WHICH one rotates, so no
 * dress can be picked twice in a row and be right. The digit rule solves the
 * first option and cannot touch the third; the pair-up reasoning solves the
 * third and would take all afternoon on the first. They are different tools and
 * the page is where a child finds that out.
 *
 * NO ÷ AND NO × ANYWHERE CHILD-FACING. C6/C9 own those symbols; B19 owns the
 * dealing and the pairing they will later name. The two op-chains do carry an
 * internal `{op:'div', n:2}` step in their params — that is the op-chain
 * library's only way to say "dealt out into two matching shares", and it is what
 * makes the answer code-computed rather than authored. Every chain is guarded so
 * that step lands on a whole number; no prompt in this pack contains a `÷` or a
 * `×`, and every one states the move as an action the child performs. Declared
 * here rather than left to be discovered (b18 made the same declaration for its
 * internal `mul`).
 *
 * NO VERIFY-LIBRARY LIMIT HERE, and it took the ten minutes kit §E2.3 asks for.
 * The recipe's error is a CLASSIFICATION ("15 is even"), and the verify library
 * has no parity transform — so the first instinct is to reframe. It does not need
 * reframing, because the misconception produces a NUMBER as soon as the child is
 * asked to act on it. A child certain that 15 is even puts the counters in twos
 * and, finding one alone at the end, counts that lone counter as a two: seven
 * twos become eight. That is exactly `a_verify_count_slip_v1` in its
 * `slip:'double-count'` mode (correct n, wrong n + 1) applied to the TRUE pair
 * count, so both numbers on the page are code-derived from one set of params and
 * the misconception is NAMED by the template rather than invented by the prompt.
 * The stated reason is the recipe's own — "a count of fives lands on it" — and it
 * is deliberately a TRUE premise with a false conclusion, which is the harder and
 * more honest version of the slip: re-checking the arithmetic cannot rescue it.
 * Nothing was fabricated and nothing was moved.
 *
 * CONCEPT FAMILY: 'operation', the full row (≥2 multi-step week-wide; four here).
 * Declaring 'place-value' would have been a dodge — the recipe hands this week a
 * two-step and the two-step is the point. `msAddThenPair` brings newcomers in and
 * re-runs the pair test on a total the child had to work out first; `msShareThenEat`
 * deals a whole into two matching shares and then changes one of them. Sharing
 * FIRST and sharing SECOND are different jobs, and a child who has only met one
 * of them has learnt a story rather than a method.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). `counters` with
 * `arrangement:'rows'` lays a set out in two rows, so each column is a pair and a
 * leftover has nowhere to hide — the pair-up test, drawn. That makes it a
 * scaffold that performs the assessed move, so its use is rationed exactly:
 *   - the lesson script and the modeled guided example use it freely, on an even
 *     set and then on an odd one, because there the answer is already on the page
 *     and watching the leftover appear IS the teaching;
 *   - on assessed pages it appears once, on `msAddThenPair`, where it draws the
 *     shelf AS THE STORY STATES IT ("standing in twos") before the newcomers
 *     arrive. It asserts the chain's own opening quantity, and the answer — the
 *     twos AFTER the newcomers — is not in the picture;
 *   - `flowersInARow` gets a plain single ROW, which hands over the objects and
 *     no pairing at all. The child does the moving; that is the item;
 *   - `twoEqualCases` draws ONE case and asserts its size, the b18/c07 pattern:
 *     the unit is worth drawing, the total never is, because the total is the
 *     question;
 *   - the discrimination, both chains' second halves, the fair-share pages and
 *     the metacognition item carry NO picture on purpose. A drawn set beside
 *     "will every child get straight into a canoe?" answers the question, and a
 *     drawn set beside any of the three dresses would spare the child the one
 *     piece of work the page exists for. `showPairs` and `markExtra` are not
 *     reachable through `lib/figures.ts` at all, which is the library making this
 *     harder to get wrong than to get right.
 * Every drawn set is kept at twelve or under, because the renderer wraps at six
 * per row: thirteen in 'rows' draws three rows and stops being a pair picture.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): prompt sentences ≤15
 * words; `even`, `odd`, `pair up`, `left over` and `double` glossed in
 * `explanation.vocabulary` before any item leans on them; metacognition in its
 * intro form — a "will it come out level?" call made before any working, over a
 * pool that genuinely holds both answers; error-analysis written-lite, one
 * sentence; the sprint ungraded and self-referenced. No gendered pronoun appears
 * in any prompt, because every name is drawn.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8), not at the start. The first scan earned its keep three times:
 *   - b18 counts SOCKS in pairs in a drawer and c07 sorts a lost-property box of
 *     SHOES with some that never found a partner. Paired garments are therefore
 *     spoken for twice over, and the first draft of this week opened on mittens.
 *     Nothing in this pack wears a pair of anything, which for a pairing week
 *     took some doing and is the better week for it.
 *   - b18's own hairband stall claimed "stall", and c07 claimed the bicycle and
 *     its two wheels — the obvious "count in twos" rate. Both avoided.
 *   - "partner" already means a number bond in A13/B5 ("the partner of ten"), so
 *     this week never uses the word. Things "pair up" and one is "left over".
 *
 * THE END-OF-BUILD RE-SCAN then caught two more, and the second one arrived from
 * a sibling that landed one minute after this file did — precisely the case §E2.8
 * describes:
 *   - a word-boundary grep for "flowers" had returned zero, but "flower" hits
 *     b14 (flower pots in a shed), b17 (sunflower seeds) and c24 (flower bulbs in
 *     a garden-club box). None of those COUNTS cut flowers, so the florist's row
 *     is kept — disclosed here rather than buried, per the b20 author's example.
 *   - "bench" was worse. c11's second chain is `msGreenhouseBench` and asks how
 *     many seedlings are on the bench, which is things-counted-on-a-bench, the
 *     same act. The flowers now lie in a row with no furniture under them at all.
 *   - b20 also flagged, in its own re-scan, that b18 tips satsumas into a crate
 *     and this week's B13 warm-up was tipping into a second one. It is now two
 *     amounts counted, with no vessel on the page. (b20 avoided the same frame
 *     rather than making it a third; both weeks came out better.)
 * Everything kept — flowers waiting to be bunched, hazelnuts and saucers,
 * whistles in cases, canoes on the lake, matchboxes on a shelf, radishes shared,
 * sponges counted, peaches at the market, forks in trays, coasters dealt out —
 * appears nowhere else in the corpus, one scene per generator and no scene twice.
 * ('whistle', 'hazelnut', 'saucer', 'radish', 'coaster', 'peach', 'fork',
 * 'canoe', 'sponge' and the bare noun 'flowers' return zero hits across all 62
 * authored weeks; b20's header independently confirms this week is clear of it.)
 *
 * Retrieval is backward-only and every warm-up is load-bearing here rather than
 * decorative: B18 (a count of FIVES — the very count the Day-5 error mistakes for
 * the even numbers, put in the child's hands on Day 1), B2 (tens and ones, which
 * is what makes "the tens pair up on their own" sayable), B13 (addition within
 * 100, the first move of `msAddThenPair`) and B7 (a missing part of a whole,
 * which is a fair share with one side hidden).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, counterGroups, counters } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B2 = { level: 'B' as const, week: 2 };
const B7 = { level: 'B' as const, week: 7 };
const B13 = { level: 'B' as const, week: 13 };
const B18 = { level: 'B' as const, week: 18 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so a share is never split between someone and themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// Decorators — a picture, or a pinned truth, built from the item's OWN values.
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so the
// QG-1/QG-4 surface signature the guard already registered is unchanged).
//
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers its answer was computed from — which is what makes a contradicting
// picture unbuildable rather than merely unlikely. `withPin` covers the one case
// the params cannot: `discrimination()` emits no generator spec at all, so its
// draw closure posts what it drew into a one-slot box that the decorator reads
// immediately afterwards. `drawUniqueItem` returns the draft its LAST build call
// produced, so the box always holds that same draw. (Pattern from c06/b15.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface Pin {
  params: Params;
  seed: number;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

/**
 * Give a choice item the generator spec that lets the gates read it.
 *
 * The pinned template is `d_verify_binop_v1`, fed the two MATCHING SHARES of the
 * option this draw keyed correct. QG-11 therefore recomputes their total and
 * proves the keyed option really does name a number that is two equal whole
 * amounts put together — which is this week's own definition of even. That is the
 * whole reason the item can rotate its correct dress on every draw and stay
 * trustworthy: no branch is allowed to decide its own truth.
 */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b19/withPin: the draw posted nothing to build from');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// The anchor, drawn — a set laid out so the pair test can be run on it
// ---------------------------------------------------------------------------

/**
 * A plain ROW: the objects handed over, and no pairing done for the child.
 *
 * The accessible name says the set is NOT yet in twos, which is the one thing a
 * child who cannot see the drawing needs to know about it — and it is not the
 * answer, because whether anything is left over is still to be found out.
 */
const inARow = (n: number, noun: string): BBFigure =>
  counters(n, noun, {
    arrangement: 'row',
    alt: `${countNoun(n, noun)} lying in a row, not yet moved into twos`,
    asserts: assertsParam('a'),
  });

/**
 * TWO ROWS: each column is a pair, so a leftover has nowhere to hide.
 *
 * This is the pair-up test drawn, which is exactly why it is rationed. It lives
 * in the script and the modeled example, where the answer is already on the page,
 * and on ONE assessed item where the pairing it shows is a state the prose has
 * already stated. Keep `n` at twelve or under: the renderer wraps at six per row,
 * so a larger set draws three rows and stops meaning "pairs".
 */
const inTwos = (n: number, noun: string, alt: string, asserts?: ReturnType<typeof assertsParam>): BBFigure =>
  counters(n, noun, { arrangement: 'in two rows', alt, ...(asserts ? { asserts } : {}) });

/** ONE group of a repeated amount, labelled and asserted against the item's param. */
const oneGroup = (n: number, label: string, alt: string, asserts: ReturnType<typeof assertsParam>): BBFigure =>
  counterGroups([{ count: n, noun: 'counters', label }], { alt, asserts });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B18 — a count of FIVES, and it opens the week on purpose.
 *
 * The Day-5 error-analysis turns on a child who has fused two true facts: a count
 * of fives lands on 15, and even numbers have a particular ending. Putting the
 * fives count in the child's own hands on Day 1 means that by Friday they are
 * examining something they have done rather than something they are told about.
 */
const wFivesCount = asWarmup(
  situation({
    situationType: 'rate',
    cognitiveOp: 'count-in-fives',
    draw: (r) => {
      // Six upward, so the count never lands on a box-count of five as well: "5
      // boxes of 5" reads as a puzzle about squares rather than a fives count.
      const boxes = r.int(6, 9);
      const name = one(r);
      return {
        prompt: `A box at the market holds ${countNoun(5, 'peaches')}. ${name} carries ${countNoun(boxes, 'boxes')} to the till. How many peaches is that?`,
        answerValue: String(5 * boxes),
        templateId: 'd_multiple_v1',
        params: { base: 5, k: boxes },
        units: 'peaches',
        hints: [
          'What does one box on its own give you?',
          'Lift a finger for each box, and jump five along each time you do.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  B18,
);

/**
 * B2 — tens and ones. The single fact this week leans hardest on: a number is a
 * pile of whole tens with some ones on the end, and the two behave differently
 * under the pair test.
 */
const wTensAndOnes = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'tens-ones-compose',
    draw: (r) => {
      const t = r.int(2, 6);
      const o = r.int(2, 9);
      const name = one(r);
      return {
        prompt: `${name} builds a number out of ${countNoun(t, 'tens')} and ${countNoun(o, 'ones')}. Which number is it?`,
        answerValue: String(10 * t + o),
        templateId: 'tens_ones_compose_v1',
        params: { t, o },
        hints: [
          'Which of these two parts sits at the front of the number?',
          'Build it as a pile of whole tens, and let the loose ones close it.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  B2,
);

/**
 * B13 — adding within 100, which is the first move of the shelf chain.
 *
 * The arriving amount is nudged off the starting amount DETERMINISTICALLY (kit
 * §E2.4): in a week about doubles, a warm-up that happens to draw "34, then 34
 * more" reads as a doubles question the child is meant to spot, and it is not one.
 *
 * NO CONTAINER, and that is the §E2.8 re-scan talking. b18 tips satsumas into a
 * crate, and the first draft of this warm-up tipped radishes into one; b20's
 * author, scanning after this week landed, flagged exactly that frame as one a
 * third week must not repeat. So the second amount is simply counted rather than
 * poured, there is no vessel on the page at all, and sponges belong to no other
 * week in the corpus.
 */
const wAddWithinHundred = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-within-100',
    draw: (r) => {
      const start = r.int(21, 58);
      const drawn = r.int(21, 39);
      const arriving = drawn === start ? drawn + 1 : drawn;
      const name = one(r);
      return {
        prompt: `${name} has counted ${countNoun(start, 'sponges')} already. Then ${name} counts ${countNoun(arriving, 'more sponges')}. How many sponges is that in all?`,
        answerValue: String(start + arriving),
        templateId: 'retr_add_within_100_v1',
        params: { a: start, b: arriving },
        units: 'sponges',
        hints: [
          'Is the answer going to be bigger or smaller than the first amount?',
          'Hold the first amount in your head. Count the second one on in whole tens.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B13,
);

/**
 * B7 — a missing part of a whole, which is a fair share with one side covered.
 *
 * Deliberately UNEQUAL parts. This week is about the case where the two sides
 * match, so the warm-up shows the general shape first: a whole is made of two
 * parts, and knowing one of them tells you the other.
 */
const wMissingPart = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'missing-part',
    draw: (r) => {
      const whole = r.int(13, 19);
      const known = r.int(5, 9);
      const name = one(r);
      return {
        prompt: `Two trays hold ${countNoun(whole, 'forks')} between them. ${name} counts ${countNoun(known, 'forks')} in the top tray. How many forks are in the other tray?`,
        answerValue: String(whole - known),
        templateId: 'd_sub_v1',
        params: { a: whole, b: known },
        units: 'forks',
        hints: [
          'Is the number you are after bigger or smaller than the whole lot?',
          'Cover the tray you can see, and work out what the cover is hiding.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B7,
);

// ---------------------------------------------------------------------------
// Single-step core — the pair test, the fair share, and the double
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR: a set in a row, moved into twos, and what is left.
 *
 * The answer is the leftover, which is 0 or 1 and is therefore the parity itself
 * — the whole point of the anchor is that the pair test does not report a size, it
 * reports whether anything is standing alone. The figure lays the flowers out in
 * ONE row and asserts the count the prose has already stated; the moving into
 * twos, which is the item, is left entirely to the child.
 *
 * Kept between eleven and sixteen: big enough that pairing is a real job, small
 * enough to draw honestly in a single row.
 */
const flowersInARow = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'pair-test',
    draw: (r) => {
      const n = r.int(11, 16);
      const name = one(r);
      const over = n % 2;
      return {
        prompt: `[image: ${countNoun(n, 'flowers')} lying in a row, not yet moved into twos] ${countNoun(n, 'flowers')} lie in a row, waiting to be tied into bunches. ${name} moves them into twos. How many flowers are left over?`,
        answerValue: String(over),
        templateId: 'd_interpret_rem_v1',
        params: { a: n, b: 2, mode: 'remainder' },
        acceptableForms: over === 1 ? ['1', countNoun(1, 'flowers')] : ['0', 'none'],
        hints: [
          'Does every flower here have another one beside it to go with?',
          'Slide them together in twos from one end, and watch the very last one.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => inARow(numOf(p, 'a'), 'flowers'),
);

/**
 * THE FAIR SHARE: one whole dealt out into two matching shares.
 *
 * Grouping in twos and sharing between two are different actions that land on the
 * same number, and that coincidence is what makes the pair test a fair-share test.
 * C9 owns the discrimination between the two meanings; B19 simply gives the child
 * both actions and lets them notice. The count is always even here, because
 * "how many on each saucer" has no honest answer otherwise.
 *
 * No picture. Drawing two saucers with the hazelnuts in them performs the deal.
 */
const shareTheHazelnuts = situation({
  situationType: 'sharing',
  cognitiveOp: 'share-by-two',
  draw: (r) => {
    const n = 2 * r.int(6, 12);
    const name = one(r);
    return {
      prompt: `${name} shares ${countNoun(n, 'hazelnuts')} fairly between ${countNoun(2, 'saucers')}. How many hazelnuts are on each saucer?`,
      answerValue: String(n / 2),
      templateId: 'd_div_v1',
      params: { a: n, b: 2 },
      units: 'hazelnuts',
      hints: [
        'Is this question about one saucer, or about both of them together?',
        'Deal them out one at a time. One to this side, one to that side.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * THE DOUBLE: the same amount twice, which is what a pair-up leaves behind.
 *
 * The catalog's second focus, and the reason it belongs here rather than in a
 * doubles week of its own: every double is even, and it is even BECAUSE the two
 * matching shares are the pairing already done. A child who can answer this page
 * can answer the discrimination's third dress.
 *
 * The figure draws ONE case and asserts its size. Drawing both cases would finish
 * the addition, and the total is the question.
 */
const twoEqualCases = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'double',
    draw: (r) => {
      const each = r.int(5, 11);
      const name = one(r);
      return {
        prompt: `[image: one case and the whistles inside it] ${name} keeps the whistles in ${countNoun(2, 'cases')}, with the same number in each case. One case holds ${countNoun(each, 'whistles')}. How many whistles are there in all?`,
        answerValue: String(2 * each),
        templateId: 'd_add_v1',
        params: { a: each, b: each },
        units: 'whistles',
        hints: [
          'How many cases is this question asking about?',
          'The other case holds the same amount, so bring that amount along as well.',
        ],
        errorTags: ['task-comprehension', 'fact-recall'],
      };
    },
  }),
  (p) => oneGroup(numOf(p, 'a'), 'one case', 'one case and the whistles inside it', assertsParam('a')),
);

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form, a call made before any working
//
// The B row's own "will it …?" prediction, pointed at this week's question: will
// the whole lot go in twos with nobody left waiting? The call is genuinely in
// doubt, because the drawn number is as likely to be odd as even, and a child
// who guesses is wrong half the time by construction.
//
// The probe is NOT the question. The page asks how many canoes set off full,
// which is a count; the probe asks whether anyone is left on the bank, which is
// the parity. Deciding the parity first is the habit — it tells the child in
// advance whether the count will come out level, and that is what catches a
// slip before it is written down.
//
// The base is served ONLY through the wrapper (kit §E2.2): a generator used both
// raw and wrapped ships two identical hint ladders, which spends two of the three
// the dedup allows on one idea. No figure — a drawn line of children beside
// "will every child get straight into a canoe?" answers it before it is asked.
// ---------------------------------------------------------------------------

const canoesOnTheLake = situation({
  situationType: 'sharing',
  cognitiveOp: 'count-the-twos',
  draw: (r) => {
    const children = r.int(13, 25);
    return {
      prompt: `The canoe club is out on the lake. ${countNoun(children, 'children')} are waiting for a turn. Every canoe takes ${countNoun(2, 'children')}. How many canoes set off full?`,
      answerValue: String(Math.floor(children / 2)),
      templateId: 'd_interpret_rem_v1',
      params: { a: children, b: 2, mode: 'drop' },
      units: 'canoes',
      hints: [
        'Which children can set off together, and which one might have to wait?',
        'Count the line off in twos. Lift a finger for each canoe that fills up.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

const predictCanoes = withEstimateFirst(
  canoesOnTheLake,
  'will every child get straight into a canoe?',
);

// ---------------------------------------------------------------------------
// Discrimination — the ends-in digit against the pair test (FILL-ARCHITECTURE §4)
//
// One number, three dresses, exactly one of them even, and which one rotates on
// every draw. See the file header for why the three dresses are the recipe's
// contrast rather than a decoration: the first hands over a last digit, the
// second hands over a last digit that is only trustworthy once you know the tens
// pair up alone, and the third has no last digit at all until the child makes one.
//
// Every option the child can choose is named in the prompt, so the page reads as
// one question rather than a question plus a surprise third door (b18's rule).
//
// The value ranges are DISJOINT by construction — 7–18, 20–59, 60–98 — so two
// dresses can never name the same number and the item can never have two right
// answers. The ones digit is never 1 and the tens digit never 1, because "1 ones"
// and "1 tens" are the QG-12c agreement failure this corpus keeps re-learning.
//
// Both branches of every parity choice consume exactly one `r.int` draw, so the
// stream lands in the same place whichever dress is the even one (kit §E2.4 —
// never a redraw loop).
// ---------------------------------------------------------------------------

const fairlyBox = pinSlot();

const sharesFairlyBetweenTwo = withPin(
  fairlyBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'choose-the-test',
    draw: (r) => {
      // 0 = the plain numeral is the even one · 1 = the tens-and-ones · 2 = the sum
      const which = r.int(0, 2);
      const plain = which === 0 ? 2 * r.int(30, 49) : 2 * r.int(30, 48) + 1;
      const t = r.int(2, 5);
      const o = which === 1 ? 2 * r.int(1, 4) : 2 * r.int(1, 4) + 1;
      const p = r.int(3, 9);
      const sameParity = p % 2 === 0;
      const q = which === 2
        ? (sameParity ? 2 * r.int(2, 4) : 2 * r.int(2, 4) + 1)
        : (sameParity ? 2 * r.int(2, 4) + 1 : 2 * r.int(2, 4));

      const plainText = String(plain);
      const placeText = `${countNoun(t, 'tens')} and ${countNoun(o, 'ones')}`;
      const sumText = `${p} and ${q} added together`;
      const value = [plain, 10 * t + o, p + q][which];

      const options = [
        {
          text: plainText,
          errorTag: 'fact-recall' as const,
          rationale: 'Reaches for a remembered list of endings rather than the test behind it, so an odd numeral is read as an even one.',
        },
        {
          text: placeText,
          errorTag: 'representation-misread' as const,
          rationale: 'Judges the number by its tens, though a whole ten pairs up on its own and only the ones can leave anything over.',
        },
        {
          text: sumText,
          errorTag: 'concept-misconception' as const,
          rationale: 'Treats two amounts pushed together as bound to pair up, though one odd amount beside one even amount always leaves one over.',
        },
      ];

      // The pinned truth: the two MATCHING SHARES of the option keyed correct, so
      // QG-11 recomputes their total and proves the keyed dress names a number
      // that really is two equal whole amounts put together.
      fairlyBox.last = { params: { a: value / 2, b: value / 2, op: '+' }, seed: r.uint() };

      return {
        prompt: `Only one of these shares fairly between two children, with nothing left over. Is it ${plainText}, or ${placeText}, or ${sumText}?`,
        correct: options[which].text,
        // The number the keyed dress names. It is what lets QG-11 match the
        // recomputed total against the option, and it is a form a child could
        // legitimately write down instead of the dress itself. Omitted when the
        // keyed dress IS the bare numeral, where it would only repeat itself.
        ...(which === 0 ? {} : { correctForms: [String(value)] }),
        distractors: options.filter((_, i) => i !== which).map(({ text, errorTag, rationale }) => ({ text, errorTag, rationale })),
        hints: [
          'Does every one of these show you its last digit straight away?',
          'Turn each one into a whole number first, then put that number into twos.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Multi-step — share, then check the pairs (FILL-ARCHITECTURE §4)
//
// Two chains, two genuine moves each, and `stepCount` is read off the chain
// rather than claimed. What differs is WHICH WAY ROUND the pairing sits: one
// chain changes the set and then runs the pair test on it, the other runs the
// share first and then changes one of the two shares. A child who has only met
// the first has learnt "add, then halve" as a sequence rather than a decision.
// ---------------------------------------------------------------------------

/**
 * Newcomers arrive, then the pair test is run again.
 *
 * The shelf is drawn as the story states it — standing in twos, before anything
 * new arrives — and the picture asserts the chain's own opening quantity, so the
 * prose, the picture and the arithmetic all start from one number by
 * construction. What the picture does NOT show is the answer: the twos AFTER the
 * newcomers. A child who reads the columns off the drawing and stops has made the
 * mistake the mistakeBank names.
 *
 * Both quantities are even, so the pair test comes out level at both ends of the
 * story. That is deliberate rather than convenient: this is the chain where the
 * child should see that adding an even amount to an even amount keeps it even,
 * which is the seed of every later parity argument. The opening set stays at
 * twelve or under so the two-row picture is honestly a pair picture.
 */
const msAddThenPair = withFigure(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const already = 2 * r.int(3, 6);
      const arriving = 2 * r.int(1, 3);
      const name = one(r);
      return {
        prompt: `[image: the matchboxes already on the shelf, standing in twos] A shop shelf holds ${countNoun(already, 'matchboxes')}, standing in twos. ${name} adds ${countNoun(arriving, 'more matchboxes')}. They are all pushed back into twos. How many twos are on the shelf now?`,
        initN: already,
        steps: [
          { op: 'add', n: arriving, d: 1 },
          { op: 'div', n: 2, d: 1 },
        ],
        units: 'twos',
        hints: [
          'What is standing on the shelf before anything new arrives?',
          'Bring the new ones in first, then start the twos again from one end.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const already = numOf(p, 'initN');
    return inTwos(
      already,
      'blocks',
      `the ${already} matchboxes already on the shelf, standing in twos`,
      assertsParam('initN'),
    );
  },
);

/**
 * The share first, then one of the two shares changes.
 *
 * This is the recipe's own order — share, then look again — and it is the harder
 * of the two chains because the second move applies to ONE share rather than to
 * the whole. The whole is always even so the deal comes out level, and the amount
 * taken away is always smaller than a share, so the answer is never nothing and
 * never negative.
 *
 * No picture. Any drawing of the two shares performs the first move, which is
 * half the item.
 */
const msShareThenEat = multiStep({
  situationType: 'sharing',
  cognitiveOp: 'multi-step',
  usesPriorSkill: true,
  draw: (r) => {
    const whole = 2 * r.int(6, 12);
    const eaten = r.int(3, 5);
    const [first, second] = two(r);
    return {
      prompt: `${countNoun(whole, 'radishes')} are shared fairly between ${first} and ${second}. ${first} then eats ${countNoun(eaten, 'radishes')}. How many radishes does ${first} have left?`,
      initN: whole,
      steps: [
        { op: 'div', n: 2, d: 1 },
        { op: 'sub', n: eaten, d: 1 },
      ],
      units: 'radishes',
      hints: [
        'Who is this question asking about — both of them, or just one?',
        'Split the whole lot into two matching shares first, then take from one share.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header for the derivation. The total always ends in a five so the
// student's stated reason is TRUE — a count of fives really does land on it — and
// the conclusion drawn from it is still false. That is what makes this an analysis
// rather than a hunt: there is no wrong digit anywhere to find, and re-checking
// the arithmetic cannot rescue the claim. The lone counter at the end has been
// counted as a two, so the pair count comes out exactly one too many, which is
// what `slip:'double-count'` returns from the TRUE pair count.
//
// The total rides along in the params purely so the written story and the truth
// are drawn together; the template reads only `n` and `slip`.
// ---------------------------------------------------------------------------

const eaFivesCountEnding = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'error-analysis',
  // 15, 25 or 35 — the recipe's own instance and its two nearest neighbours. The
  // ceiling is deliberate: the extension asks for the TRUE number of twos, and a
  // six-year-old reaches 7, 12 or 17 by running the count of twos B18 just gave
  // them. A total in the sixties would make the same item a halving exercise the
  // level has not taught, which is how a good task quietly becomes an unfair one.
  drawParams: (r) => {
    const total = 10 * r.int(1, 3) + 5;
    return { n: (total - 1) / 2, slip: 'double-count', total };
  },
  build: (v, p, r) => {
    const total = Number(p.total);
    const name = one(r);
    return {
      prompt: `${name} put ${countNoun(total, 'counters')} into twos and wrote down ${countNoun(Number(v.wrong), 'twos')}. ${name} says ${total} is even, because a count of fives lands on it.`,
      extension: `Write how many twos ${countNoun(total, 'counters')} really make. Then write one sentence to ${name} about what the pair-up test shows.`,
      hints: [
        'Does a count of fives only ever land on even numbers?',
        'Put the counters into twos yourself, and look hard at the very last one.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: [
        'one counter is left over',
        'a count of fives lands on odd numbers too',
        'the pair-up test leaves one over',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 production — the fair-share proof (catalog column 4) and the ASN
//
// Authored rather than drawn: the catalog names the number (13) and the demand
// ("prove it"), and a proof is only a shared one if every child argues about the
// same case. Thirteen is the right case because the leftover is a single object a
// six-year-old can point at, which is what makes the argument finishable.
// ---------------------------------------------------------------------------

const canThirteenBeShared = reasoning({
  prompt:
    'Can 13 counters be shared fairly between two children, with nothing left over? Draw the twos on your page. Then write one sentence that proves your answer.',
  value:
    'no — 13 counters make six twos with one counter left over, so the two shares cannot match',
  acceptableForms: [
    'one counter is left over',
    'six twos and one left over',
    'the two shares cannot match',
    'it is odd',
  ],
  keywords: true,
  hints: [
    'How many twos can you make before you run out?',
    'Ring the twos on your page, then look at what is not inside a ring.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

/**
 * The recipe's Always/Sometimes/Never, and its answer really is 'always' — which
 * makes it the rarer and more valuable kind of claim: the child has to argue that
 * something holds for EVERY case, not find the one where it breaks. The argument
 * is available to them, because "even" was defined as pairing up and every two is
 * one for each side.
 *
 * Both distractors are real children's positions rather than filler. 'Sometimes'
 * is where a child lands who has checked the test on small numbers and treats big
 * ones as unexplored territory — the exact difference between a rule and a
 * reason. 'Never' is where a child lands who wants each SHARE to be even too, and
 * so counts six-into-three-and-three as unfair.
 */
const asnEvenSharesFairly = classify({
  prompt:
    'Always, sometimes, or never true? An even number shares fairly between two children, with nothing left over. Write one sentence saying how you know.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale: 'Treats the pair-up test as something checked on a few small numbers, so a large even number is left in doubt.',
    },
    {
      text: 'never',
      errorTag: 'representation-misread',
      rationale: 'Expects each share to be even as well, so an even number that splits into two odd shares is counted as unfair.',
    },
  ],
  hints: [
    'Can you find an even number that leaves something over?',
    'Try the test on a big even number, then try it on a small one.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB19 = makeWeekBuilder({
  level: 'B',
  week: 19,
  conceptId: 'even-odd-fair-shares',
  conceptName: 'Even, odd & fair shares',
  strandTags: ['multiplication-division', 'number-sense-counting'],
  prerequisiteWeeks: [B2, B7, B13, B18],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the pair-up test',
  conceptFamily: 'operation',
  deepeningDelta:
    'B18 taught a count of twos as a way of getting along a number line quickly: run the count and read the landing number. B19 turns that count round and uses it to ASK something about a number that was there all along — does it come out level, or is one thing left standing? What is genuinely new is the leftover. B18 never had anything left over, because a count always lands where it lands; here the leftover is the answer, it is only ever nothing or one, and it is what the words even and odd mean. The second advance is the reason behind the ending: B18 noticed that a fives count swings between five and zero, and B19 explains why any ending predicts anything at all — a whole ten pairs up on its own, so only the ones can leave a remainder.',
  explanation: {
    hook:
      'Thirteen children want to play a game in twos. Someone is going to be left out. This week you learn to see that coming.',
    whyBeforeHow:
      'Some numbers split into two fair shares. Others will not, however hard you try. So we use the pair-up test. Put the things in twos and look at what is left. If nothing is left over, the number is even. If one thing stands on its own, the number is odd. That is why an even number always shares fairly between two. Every two is one for you and one for me. The test also explains the endings you may have been told. A whole ten pairs up on its own, every time. So only the ones at the end can leave anything behind. That is why the last digit tells you so much. The rule is the shortcut. The pair-up test is the reason underneath it.',
    script: [
      {
        say: 'Watch me test twelve. I push the flowers into twos, one two at a time, all the way along. Nothing is left over at the end, so twelve is even.',
        visual: 'Twelve flowers pushed into twos, with nothing left over.',
        figure: inTwos(12, 'flowers', 'twelve flowers pushed into twos, with nothing left over'),
      },
      {
        say: 'Now eleven, and I do exactly the same thing. This time one flower is standing on its own with nobody to go with. So eleven is odd.',
        visual: 'Eleven flowers pushed into twos, with one flower left on its own.',
        figure: inTwos(11, 'flowers', 'eleven flowers pushed into twos, with one flower left on its own'),
      },
      {
        say: 'Here is the part worth keeping. A whole ten always pairs up on its own. So the tens can never leave anything behind. Only the ones at the end can do that.',
        visual: 'A whole ten of flowers pushed into twos, with nothing left over.',
        figure: inTwos(10, 'flowers', 'a whole ten of flowers pushed into twos, with nothing left over'),
      },
      {
        say: 'One habit before I write an answer down. I check the very last digit and ask what it would leave over. A count of fives reaches 15, but 15 still leaves one over.',
        visual: 'A finger resting on the last digit of a number, before any answer is written.',
      },
    ],
    summary:
      'Even means it pairs up with nothing left over. Odd means one thing is always left standing. The pair-up test settles which one you have. It also explains the last digit. A whole ten pairs up on its own, so only the ones can leave anything behind.',
    vocabulary: [
      { term: 'even', kidGloss: 'a number that pairs up with nothing left over' },
      { term: 'odd', kidGloss: 'a number that leaves one thing standing on its own' },
      { term: 'pair up', kidGloss: 'put things in twos, one next to one' },
      { term: 'left over', kidGloss: 'the thing with nothing to go with at the end' },
      { term: 'double', kidGloss: 'the same amount twice, put together' },
    ],
  },
  guidedExamples: [
    {
      ...ge(19, 1, 'modeled', 'A tray holds 9 counters. The counters are pushed into twos. How many counters are left over?', [
        {
          teacherSay:
            'Watch me. I slide two counters together, then two more, and I keep going without hurrying. What I want to know is what is standing alone when I run out.',
        },
        {
          teacherSay: 'I have made four twos, and one counter is still sitting in my hand. So is nine even or odd?',
          expected: 'odd',
        },
      ], '1'),
      // The pair picture belongs here: the answer is already on the page, and
      // watching the leftover appear is the teaching.
      visual: 'Nine counters pushed into twos, with one counter left on its own.',
      figure: inTwos(9, 'counters', 'nine counters pushed into twos, with one counter left on its own'),
    },
    {
      ...ge(19, 2, 'completion', 'Esme keeps the whistles in 2 cases, with the same number in each case. One case holds 12 whistles. How many whistles are there in all?', [
        { teacherSay: 'If both cases hold the same amount, what have I really been handed?', expected: 'the same amount twice' },
        { childDo: 'Bring the second case in as well, and say the number you land on.', expected: '24' },
      ], '24'),
      // COMPLETION fade: the child produces 24, so the picture shows one case only.
      // Drawing both would finish the addition for them.
      visual: 'One case and the twelve whistles inside it. The other case is yours to bring in.',
      figure: counterGroups([{ count: 12, noun: 'counters', label: 'one case' }], {
        alt: 'one case and the twelve whistles inside it',
      }),
    },
    ge(19, 3, 'prompted', 'Rafi shares 26 hazelnuts fairly between 2 saucers. How many hazelnuts are on each saucer?', [
      { childDo: 'Deal them out one to this side and one to that side, until none are left.', expected: '13' },
    ], '13'),
    {
      // Independent: no picture at all, and the pair test has to be run on a
      // number the child works out first. Deciding that the newcomers come in
      // BEFORE the twos start again is the task, so any drawing hands over the plan.
      ...ge(19, 4, 'independent', 'A shop shelf holds 10 matchboxes, standing in twos. 4 more matchboxes are added. They are all pushed back into twos. How many twos are on the shelf now? Solve cold.', [
        { childDo: 'Bring the new ones in first, then start the twos again from one end.', expected: '7' },
      ], '7'),
    },
  ],
  days: [
    // Day 1 — concept echo: the pair test, the fair share and the double, each in
    // its own kind of story. Single-step only, no trap and no chain yet.
    [
      { gen: wFivesCount, diff: 2 },
      { gen: wTensAndOnes, diff: 2 },
      { gen: flowersInARow, diff: 2 },
      { gen: shareTheHazelnuts, diff: 2 },
      { gen: twoEqualCases, diff: 3 },
    ],
    // Day 2 — fluency + application: the parity call made before working, the
    // three dresses, the week's first chain, and the anchor beside them.
    [
      { gen: wAddWithinHundred, diff: 2 },
      { gen: predictCanoes, diff: 3 },
      { gen: sharesFairlyBetweenTwo, diff: 3 },
      { gen: msAddThenPair, diff: 4 },
      { gen: flowersInARow, diff: 3 },
    ],
    // Day 3 — interleave: the trap and the prediction again, against the second
    // chain, so the shape of a page never signals which move it wants.
    [
      { gen: wAddWithinHundred, diff: 2 },
      { gen: wMissingPart, diff: 2 },
      { gen: sharesFairlyBetweenTwo, diff: 4 },
      { gen: predictCanoes, diff: 4 },
      { gen: msShareThenEat, diff: 4 },
    ],
    // Day 4 — word problems: both chains beside the single-step pages they are
    // built out of, so "it must need two steps" never becomes the cue.
    [
      { gen: wFivesCount, diff: 3 },
      { gen: msAddThenPair, diff: 4 },
      { gen: msShareThenEat, diff: 4 },
      { gen: twoEqualCases, diff: 3 },
      { gen: shareTheHazelnuts, diff: 3 },
    ],
    // Day 5 — the signature: the fives-count reason taken apart, thirteen put on
    // trial, and the claim that settles what even really promises.
    [
      { gen: wTensAndOnes, diff: 2 },
      { gen: eaFivesCountEnding, diff: 4 },
      { gen: canThirteenBeShared, diff: 3 },
      { gen: asnEvenSharesFairly, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: your child may already be able to recite "even numbers end in 0, 2, 4, 6 or 8". That is a useful shortcut and it is not what this week is for. Ask instead: "show me why". A child who can put a handful of pasta into twos and point at the one left over owns something the list cannot give them — and it is the same idea that becomes halving, then division, then odd and even in algebra. Laying the table, matching washing, or splitting a packet of raisins between two people all give you the test to run without a worksheet in sight. If they get it wrong, count the twos out loud together rather than correcting the answer; the mistake is nearly always a lost count, not a lost idea.',
  ],
  puzzle: (r) => {
    // Dealing turn about, which no core page does: the pair test has to be mapped
    // onto an alternation rather than run on a set sitting still. Every two is one
    // for the first pair of hands and one for the second, so the parity of the pile
    // decides who takes the last one — and saying that is a completeness argument,
    // not a count. Unique by construction and answerable without dealing.
    const [first, second] = two(r);
    const total = r.int(13, 28);
    const last = total % 2 === 1 ? first : second;
    return {
      id: 'B19-PZ-01',
      title: 'Puzzle Grove: Who Gets the Last One?',
      puzzleType: 'game',
      prompt: `${first} and ${second} deal out ${countNoun(total, 'coasters')}, one at a time. ${first} takes the first coaster, then ${second}, then ${first} again, turn about. Who gets the very last coaster? Then say how you could tell without dealing them all out.`,
      answer: {
        value: last,
        acceptableForms: [last, `${last} gets the last coaster`],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Which pair of hands gets the second coaster of every two?',
        'Put the pile into twos first. Is one coaster left on its own?',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  // Every core page is handed a set and asked to test it or share it. The puzzle
  // is handed a set in MOTION: the child has to see that dealing turn about is the
  // pair test in disguise, and then argue that the pile's parity settles it for
  // every pile. Two moves, and neither is a Day-1 move.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'deal-by-turns' },
  sprint: {
    skill: 'Adding within 100 — the first move of a share-then-check story',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 11, max: 60 },
  },
  mastery: [
    { gen: flowersInARow, diff: 3 },
    { gen: msAddThenPair, diff: 4 },
    { gen: twoEqualCases, diff: 3 },
    { gen: msShareThenEat, diff: 4 },
    { gen: shareTheHazelnuts, diff: 3 },
    { gen: sharesFairlyBetweenTwo, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three single-step structures, one each — the pair test on a set in a row (its single-row picture preserved), the double as two matching cases (its one-case picture preserved), and the fair share dealt between two saucers, which carries no picture on either form because a drawing would perform the deal. 02/04: the two chains, one running the pair test after newcomers arrive and one changing a share after the deal, with the standing-in-twos shelf picture preserved on 02. 06: the three-dresses choice, whose correct dress rotates across the numeral, the tens-and-ones and the sum, so a form cannot be passed by picking the same dress twice. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'ending-mistaken-for-a-count',
      description: 'Fuses two true facts — that a count of fives lands on numbers ending in five, and that even numbers have particular endings — and concludes that anything a familiar count reaches must be even.',
      exampleWrongAnswer: '15 counters reported as eight twos with nothing left over',
      distractorRationale: 'Offer the amount a child reaches when the lone leftover is counted as a whole two, which is one two more than the truth.',
      reteachPointer: 'explanation/script[3] (a count of fives reaches 15, but 15 still leaves one over)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-wrong-part-of-the-number',
      description: 'Tests the number by its tens rather than its ones, or by the digits written in front of it, so a number dressed as tens-and-ones is judged on the wrong half.',
      exampleWrongAnswer: '3 tens and 5 ones offered as an amount that shares fairly between two',
      distractorRationale: 'Offer a number whose tens are even and whose ones are odd, so reading the wrong part gives the wrong verdict.',
      reteachPointer: 'explanation/script[2] (a whole ten always pairs up on its own)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-count-of-twos',
      description: 'Holds the idea steady but loses track part-way along the row, so a set is reported with one two too many or one too few even though the leftover was seen correctly.',
      exampleWrongAnswer: 'a row of 16 reported as seven twos',
      distractorRationale: 'Set the option a single pair short of the true count, since losing your place in a row costs exactly one pair.',
      reteachPointer: 'guidedExamples/B19-GE-01 (I keep going without hurrying)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-before-the-second-move',
      description: 'Runs one move of a two-move story and reports it — the twos already on the shelf before the newcomers arrive, or the whole share before anything is taken from it.',
      exampleWrongAnswer: 'a shelf of 10 with 4 more added answered as five twos',
      distractorRationale: 'Key the option to the story as it stood before the second sentence, so stopping early lands on it exactly.',
      reteachPointer: 'guidedExamples/B19-GE-04 (bring the new ones in first, then start the twos again)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'doubles-not-yet-quick',
      description: 'Sees that two matching shares are a double and then has to build the addition up again from nothing every time it is needed, which leaves no attention over for the reasoning the double was supposed to serve.',
      exampleWrongAnswer: 'two cases of 8 answered as 15',
      distractorRationale: 'Sit the option a single unit off the true double — the signature of an addition assembled under pressure.',
      reteachPointer: 'explanation/summary (even means it pairs up), plus the ungraded two-minute addition sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Even and odd numbers, but by testing rather than by remembering: putting things in twos and looking at what is left, dealing a whole amount into two matching shares, spotting that every double is even, and working out why the last digit of a number tells you anything at all.',
    improvingCandidates: [
      'running the pair-up test on a set and reading what is left over',
      'dealing a whole amount into two matching shares',
      'saying why the last digit decides, rather than only that it does',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the reason and the shortcut apart — a number a familiar count reaches is not even for that reason',
      },
      {
        errorTag: 'representation-misread',
        text: 'testing the ones at the end of a number, since a whole ten always pairs up on its own',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading a story right to its last sentence, since the pair test here is often run on a number that has just moved',
      },
      {
        errorTag: 'fact-recall',
        text: 'the doubles, which the two-minute sprint keeps close to hand while the reasoning happens',
      },
    ],
    homeFocus: {
      praiseLine:
        'You paired them up and checked what was left before you answered — that check is the whole test.',
      questionForChild: 'If we share 13 raisins between the two of us, what happens at the end — and how did you know before we started?',
      schoolSyncHook: 'If your child\'s class says "sharing equally" rather than "fair shares", tell us and we will use the words they hear.',
    },
    vocabularyForParent: [
      'even (pairs up with nothing left over — 6, 14, 40)',
      'odd (leaves one thing standing on its own — 7, 13, 41)',
      'double (the same amount twice, which is why every double is even)',
    ],
  },
});
