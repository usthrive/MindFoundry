/**
 * Level E · Week 23 — "Probability" (conceptId: probability).
 *
 * FILL-ARCHITECTURE §6 row E23: anchor "the 0–1 certainty line"; key multi-step
 * "P as fraction; complement"; error-analysis "past flips change the next flip";
 * discrimination "either it happens or not, so 50-50"; Day-5 signature
 * "fair-game design: flagged open part". Flag **R** — the invented game ships as
 * `manual-review`, never as a faked computable answer (§7).
 * Catalog: "Probability scale 0–1; simple and compound events; experimental vs
 * theoretical", Day-5 "Fair-game design: invent a game, prove whether it's fair".
 *
 * THE WEEK'S CLAIM. A chance is not a feeling and it is not an opinion. Cut the
 * line from 0 to 1 into one equal step for every outcome the thing can produce,
 * count the outcomes that win, and walk that many steps: a chance is where the
 * winning count lands on the line. Everything else in the week falls out of that
 * one picture.
 *
 *  - IT ONLY WORKS WHEN THE STEPS ARE EQUAL, and that clause is the whole week.
 *    "Either it rains or it doesn't, so it's fifty-fifty" gets the arithmetic
 *    right and the counting wrong. Two outcomes is not two EQUAL outcomes, and
 *    the test is physical rather than verbal: the outcomes are equally likely
 *    when the things themselves are identical apart from their names — equal
 *    sectors of a spinner, counters differing in nothing but colour. Rain and
 *    no-rain fail that test on sight.
 *  - THE LINE IS CUT ONCE, at the chance. What lies left of the cut is the
 *    event's chance and what lies right of it is the chance of the event not
 *    happening; the two pieces are the whole line, which is why they come to one.
 *    That is not a rule to memorise, it is what "all the outcomes" means.
 *  - AND THE PAST CHANGES A CHANCE ONLY BY CHANGING THE COUNTS, NEVER OTHERWISE.
 *    A spinner has no memory because spinning removes nothing from the spinner —
 *    six greens in the last nine spins leave the same sectors on it. A bag you do
 *    not refill remembers exactly what was taken out of it, because taking a
 *    counter out really does change what is there. Both cases obey one
 *    instruction: COUNT WHAT IS THERE NOW.
 *
 * That last sentence is authored rather than left to be discovered, and the
 * reason is a design challenge that caught this week asserting "a spinner has no
 * memory" while building an item where the past demonstrably does change the
 * next draw. Unstated, the probe reads as a trick that breaks the week's own
 * rule. Stated, it is the best sentence in the week.
 *
 * ---------------------------------------------------------------------------
 * NINE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3). Five
 * are forced by MEASURED properties of `lib/stats.ts`, reported upward and NOT
 * fixed here (lib/ is not this week's to edit).
 *
 *  1. THE RECIPE'S OWN DISCRIMINATION IS NOT SERVED, AND THIS IS THE SEVENTH
 *     CONSECUTIVE LEVEL-E WEEK ABLE TO SAY SO WITH A MEASUREMENT — the worst of
 *     the seven. `stats.eitherOrFiftyFifty` carries TWO independent 100%
 *     defects, measured over 6,000 draws before a line of this week was written:
 *
 *       · "1/2" is offered on 6000/6000 draws and keyed on 0. The generator's own
 *         comment says why: "Never exactly half the spinner, so the 50-50 option
 *         is genuinely wrong." A permanently unkeyable card (L38).
 *       · "1/2" is ALSO the middle option on every draw, and that is algebra
 *         rather than luck. The three cards are p = f/t, its complement 1−p, and
 *         1/2. If p < ½ then 1−p > ½; if p > ½ then 1−p < ½; and p = ½ is
 *         excluded by the guard above. So 1/2 lies strictly between the other two
 *         on EVERY legal draw. Measured middle 100.0% / 0.0% / 0.0%.
 *
 *     Put together, the exploit is *strike the middle card, take the smaller of
 *     the two left*: the key is smallest on 90.3% of draws and middle on 0.0%.
 *     The item is WORSE once a child has spotted the dead card than before —
 *     33% blind becomes 90.3% — which no other defect in this programme has
 *     managed. Seven distinct option sets across 6,000 draws. Reported, not
 *     edited: it is a shared file.
 *
 *  2. THE COMPLEMENT DISTRACTOR IS THE ROOT CAUSE, so it stops being mandatory.
 *     `1/2` sits in the middle *because* the other two cards are p and 1−p. No
 *     amount of redrawing p fixes that; the pair has to go. `discrimWhichChance`
 *     below keeps a complement card in the pool but draws it against four other
 *     named misconceptions, so the pairing rotates (kit §E2.11's cure: "have
 *     enough honest wrong values that the PAIRING can rotate").
 *
 *     THE RANK IS DRAWN FIRST AND THE CARD SET IS ENUMERATED AT MODULE LOAD, the
 *     shape E17's `SIGN_CARDS` established. Every legal (t, f, distractor-pair)
 *     triple is built once, every triple with two equal card texts is dropped,
 *     and the draw picks a RANK uniformly and then a triple inside it — so the
 *     key is smallest, middle and largest on exactly a third each BY
 *     CONSTRUCTION rather than by hope.
 *
 *     WHY THE HALF CASE NEEDED FINDING TWICE. The first version drew a verdict
 *     of half / less / more and kept "1/2" as a mandatory card, on the theory
 *     that a spinner really can be half green so the dead card becomes keyable.
 *     Enumerating it produced ZERO legal half cells, and the reason is obvious
 *     only afterwards: when f = t/2 the correct answer IS 1/2, so it is not a
 *     separate card at all — the distinctness guard threw every one of those
 *     draws away in silence. On a half draw the 1/2 card occupies the CORRECT
 *     slot and TWO distractors are drawn instead of one.
 *
 *  3. FOUR MORE GUARDS, each of which would have shipped a broken page:
 *       · `odds` = f/(t−f) reduces to exactly "1/2" whenever t = 3f (2 of 6 →
 *         2/4), colliding with the 1/2 card — two identical texts, one of them
 *         the week's named misconception. Excluded.
 *       · `odds` EXCEEDS ONE whenever f > t−f, and a probability above one is a
 *         free strike by the week's own anchor. The fix is structural rather
 *         than a guard: the odds card is paired to the f < t/2 branch only.
 *       · `one-part` = 1/t equals the correct answer when f = 1. So f ≥ 2.
 *       · ODD TOTALS LEAK. With t odd, "1/2" is impossible and a child can strike
 *         it unread on those pages and not others. Every total here is EVEN, and
 *         the device makes that honest rather than arbitrary: a fair dice comes
 *         with 6, 8, 10 or 12 faces and never 7.
 *
 *  4. WHAT THE DISCRIMINATION STILL CONCEDES, said plainly. "Read which colour
 *     outnumbers the other, strike anything at or above one, and take the card on
 *     the majority's side of a half" wins a good share of draws with no fraction
 *     ever formed. That heuristic IS this item's target insight — locating a
 *     chance against the even split — and forming the fraction is the situation
 *     items' job, not this page's. So the concession is deliberate, and the page
 *     CERTIFIES NOTHING: it is served once, on Day 2, and is absent from both
 *     mastery forms (E21 decision 5b — a three-option page concedes a third of a
 *     slot before any reasoning happens).
 *
 *  5. THE PROBE IS A SAMPLE-SPACE QUESTION, DECIDED BY A DRAWN WORD, AND IT FEEDS
 *     THE SOLVE. One parcel is drawn from a lucky dip and is either PUT BACK or
 *     KEPT OUT — drawn, with the same numerals printed either way — and the item
 *     asks for the chance that the next parcel wins. The branch genuinely changes
 *     the answer (f/t against (f−1)/(t−1)), so unlike E22's contrast-probe the
 *     commitment is consumed by the arithmetic itself.
 *
 *     IT IS NOT PHRASED AS A CONDITIONAL. "The chance the second is a winner
 *     GIVEN the first was" is KS4 furniture and invites the pedant's "but what if
 *     it wasn't?". Stated as a fact in the story — the first parcel drawn is a
 *     winner, and it is kept out; a second is now drawn — the item is simply the
 *     chance on the dip as it now stands, which is Level-E and is the week's own
 *     claim: count what is there NOW.
 *
 *     THE PREDICATE AVOIDS TWO HOLES. It does not ask whether taking the parcel
 *     out "changes what is left", because on the put-back branch the dip really
 *     was briefly changed and a literalist can truthfully answer "both". And it
 *     does not say "one fewer", which would hand over the denominator move —
 *     half the solve, and the very thing the two classic wrong answers
 *     (f/(t−1) and (f−1)/t) disagree about. It asks whether the second draw meets
 *     the dip as it started or a changed one.
 *
 *  6. THE ERROR-ANALYSIS IS AUTHORED LOCALLY OVER THE LIBRARY'S TRUTH, to repair
 *     a measured defect. `stat_verify_next_trial_v1` is sound and
 *     `eaPastTrialsChangeNext` measured clean on every axis that matters — the
 *     correct value is flat (25.8 / 25.1 / 25.1 / 24.0 over 6,000 draws), the
 *     shown wrong value is larger than the truth on 91.8% rather than always,
 *     and the ratio between them takes 19 distinct values. But its `drawParams`
 *     hardcodes `favorable = 1`, so the true answer is ALWAYS one-over-something
 *     and after a single exposure the numeric half of the item needs no reading.
 *     Drawing `favorable` at 2 or 3 costs nothing and removes it. The collision
 *     nudge is re-derived here rather than inherited, because the library's
 *     one-step walk was written for favorable = 1.
 *
 *  7. THE WEEK'S SPINE, WHICH THE FIRST DESIGN DID NOT HAVE. A design challenge
 *     counted the mastery form before anything was written and found it
 *     unfillable: the three-option discrimination, the Day-5 error-analysis and
 *     the R-flagged task are all barred from certifying, which left three
 *     generators for six slots — and not one multi-step item, against
 *     `GATE_PROFILE.E`'s floor of two week-wide and one on Day 4. The week would
 *     have failed assembly rather than review. Three chains close it, one per
 *     posing shape the E band owes, and each lives inside the claim rather than
 *     beside it:
 *       · `msRestickerTheDice` FORWARD — blank faces are stickered over, so the
 *         count changes under the child's hands. It is "count what is there now"
 *         made computational.
 *       · `msRecoverCount` INVERSE-START — the chance of NOT winning is stated,
 *         so the opening move is to undo the complement before anything can be
 *         counted.
 *       · `msSpareGoes` HAS-DISTRACTOR — the spinner's number of past spins is
 *         stated and never used. That is the gambler's fallacy as a spare
 *         quantity: a child who believes the past matters will spend it.
 *
 *  8. ONE SCENE PER GENERATOR, ASSIGNED RATHER THAN DRAWN (E22 decision, applied
 *     from the start this time). `CHANCE_ITEMS` holds three entries, is
 *     module-private so this file cannot import or dodge it, and
 *     `probabilityOfEvent` draws it — so the served lib item owns bag / jar / tin
 *     outright and nothing local may touch those nouns. The local scenes are a
 *     gumball machine, a lucky dip, a fair dice, a vending machine and a spinner,
 *     one apiece, so no day can open two items on one scene.
 *
 *     EVERY DEVICE IS GENUINELY EQUALLY LIKELY, and that is a content constraint
 *     rather than a stylistic one. A hoopla stall, a coconut shy and a darts
 *     board were all drafted and cut: they are skill games, their outcomes are
 *     not equally likely, and staging the week's counting rule on them would
 *     teach the falsehood the claim exists to prevent. Sealed parcels, identical
 *     capsules, equal sectors and a fair dice all pass the physical test in §1.
 *
 *  9. WHAT THIS WEEK DOES NOT COVER, DECLARED RATHER THAN QUIETLY DROPPED. The
 *     catalog line reads "Probability scale 0–1; simple and compound events;
 *     experimental vs theoretical".
 *       · THE 0–1 SCALE is carried three ways: the anchor sentence, the number
 *         line `probabilityOfEvent` draws (cut into one step per outcome, which
 *         is the anchor made visible), and the always/sometimes/never item, whose
 *         middle claim is that a probability can exceed one.
 *       · EXPERIMENTAL VS THEORETICAL is carried in prose and by the
 *         error-analysis, which IS the collision — an observed run set against
 *         the spinner's own fraction. No dedicated item is built, deliberately: a
 *         "we spun it twenty times" generator invites the exact inference the
 *         week exists to kill.
 *       · COMPOUND EVENTS ARE OMITTED. There is no generator and no primitive,
 *         and half-taught compound counting — reading {two heads, one head, none}
 *         as three equally likely outcomes — manufactures precisely the miscount
 *         the claim warns against. The two-stage lucky dip is this week's one
 *         honest step in that direction. Owner decision, reported not taken.
 *
 * ---------------------------------------------------------------------------
 * 10. WHAT THE LOCAL DECISION ITEMS MEASURE, off SERVED packs and never off the
 *     draw (L39), because the two are not the same thing and this week proved it
 *     twice.
 *
 *       - the probe, 700 served items: put back 50.1% / kept out 49.9%, with
 *         always-put-back at 50.1% and "more winners than blanks" at 47.4%.
 *         Across every served item the branch phrase has ONE word count (three)
 *         and two character lengths one apart, so neither length nor numeral
 *         count has anything to read. The first version's phrases were three
 *         words against four.
 *       - `discrimWhichChance`, 700 served items: key rank largest 35.9% /
 *         middle 33.4% / smallest 30.7%, best card 2.6 points over chance and
 *         inside the corpus's five-point bar. "1/2" is offered on 100% of draws
 *         and KEYED ON 12.1% of them, against the library's 0.0%. 17 distinct
 *         keyed texts, against the library's seven whole option sets.
 *       - `chanceClaimASN`, 700 served: always 32.4%, never 34.1%, sometimes
 *         33.4% — "answer sometimes and read nothing" sits at chance.
 *       - the mastery slots, 1,400 forms each: key-in-prompt 0.0% on all six,
 *         and answer-in-prompt 0.0% on every generator in the week.
 *
 *     WHY THE RANK IS NOT EXACTLY A THIRD, WHICH IT IS BY CONSTRUCTION. The
 *     draw measures 33.4 / 33.2 / 33.4 over 60,000 rolls — the enumeration and
 *     the uniform pick do exactly what they promise. The served page did not,
 *     and the first reading was 39.4 / 31.9 / 28.7 on TWO disjoint seed
 *     lattices, so it was structural rather than noise. The cause is the
 *     assembler's guided-example echo guard: a day item whose numeric tokens
 *     match a guided example's is redrawn, GE-01 was a ten-sector spinner with
 *     four amber and GE-03 a twelve-face dice with four crowns, and BOTH are
 *     legal cells of this very item. Each contributes three middle-rank cells
 *     against one smallest, so silently deleting them tilted the served rank
 *     toward largest. Both guided examples now print a third numeral — the
 *     count of blank faces, which they should have stated anyway — so their
 *     token lists can no longer match a cell. Measured after: 35.9 / 33.4 /
 *     30.7. THE RULE: a guided example's numerals are part of the draw space,
 *     and a rank guaranteed at draw time is not guaranteed on the page.
 *
 *     THE RESIDUAL, stated rather than rounded away: striking the fifty-fifty
 *     card still leaves a two-way page on the 87.9% of draws where it is not
 *     the answer. That is a far cry from the library's 90.3% single-strategy
 *     win, and it is why decision 4 keeps this page off both mastery forms.
 *
 * A PROSE TRAP THIS WEEK WALKED INTO, recorded because the corpus already
 * warned about it and the warning was not enough. `countNoun` pluralises the
 * LAST word of its noun phrase, so `countNoun(6, 'of them')` prints "6 of
 * thems". Five generators here said it before a served pack was read. The
 * phrase is now interpolated plainly, and `countNoun` is kept for phrases that
 * genuinely end in their head noun ("6 gumballs", "2 of the blank faces").
 *
 * THE SAME BUG IS LIVE IN `lib/stats.ts` AND HAS NEVER BEEN SEEN, because the
 * generator carrying it has never been served: `eitherOrFiftyFifty` (line 915)
 * draws `favorable` at 2 or 3 and so prints "2 of thems are green" on EVERY
 * draw. `eaPastTrialsChangeNext` (line 1035) has the identical call and escapes
 * only by accident — its `favorable` is hardcoded to 1, and "1 of them" is
 * correct. Decision 6 draws that value at 2 or 3, so serving the library's
 * wrapper with the repair applied would have printed the defect. Reported, not
 * fixed.
 *
 * ANSWER-IN-PROMPT NOTE. Every chance here is keyed as a REDUCED FRACTION and no
 * prompt prints a fraction, so the keyed surface appears in its own prompt on
 * 0.0% of draws by construction. What the prompts do print are the raw counts a
 * chance is built from, which is unavoidable — they are the givens, and a
 * probability item that hid them would have nothing to ask.
 *
 * Retrieval reaches back to what a chance is actually made of: D10's fraction
 * equivalence, because every chance here is reduced and two chances are compared
 * by the same move; and D2's addition, because the total a chance is taken over
 * is a count of outcomes that has to be joined before it can be divided into.
 */

import { asWarmup, addWhole, fracCompareChoice, fracEquivFill, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { formatFrac, reduceFrac } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import type { ItemDraft } from '../lib/assemble';
import { numberLine } from '../lib/figures';
import { drawUniqueItem } from '../lib/guard';
import { makeChoices } from '../shared';
import { probabilityOfEvent } from '../lib/stats';
import type { ItemGen } from '../lib/multistep';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const D2 = { level: 'D' as const, week: 2 };
const D10 = { level: 'D' as const, week: 10 };
const E22 = { level: 'E' as const, week: 22 };

/** A reduced chance, written the way every item in this week writes one. */
const chance = (n: number, d: number): string => formatFrac(reduceFrac(n, d));

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** D10 — equivalence, the move that reduces every chance this week produces. */
const wFracEquiv = asWarmup(fracEquivFill(), D10);
/** D10 — comparing two fractions, which is how two chances are set against each other. */
const wFracCompare = asWarmup(fracCompareChoice(), D10);
/** D2 — the join. A total is a count of outcomes before it is a denominator. */
const wJoin = asWarmup(addWhole(126, 489), D2);

// ---------------------------------------------------------------------------
// The chance itself — the library item, filtered (decision 8)
// ---------------------------------------------------------------------------

// (`redrawUntil`, the rejection-filter helper this week defined for its
// never-a-half guarantee, was retired 2026-08-25 with the filter itself —
// the guarantee moved into lib/stats.ts. E21 keeps its own copy for the
// missing-value filter that is still live there.)

/**
 * THE CHANCE OF AN EVENT, from the family — and the one item in the week that
 * draws the 0–1 line, cut into one step per outcome. That figure is the anchor
 * made visible and is the reason this generator is served at all rather than
 * re-authored.
 *
 * THE NEVER-EXACTLY-A-HALF GUARANTEE NOW LIVES IN THE LIBRARY (2026-08-25).
 * When this week shipped, `probabilityOfEvent` drew its two colours
 * independently and keyed 1/2 on 15.8% of draws — in THIS week the answer the
 * named misconception produces — so a local `redrawUntil(notAHalf)` filter
 * stood here. The library now nudges off the diagonal itself, which made the
 * filter a no-op asserting a defect that no longer exists; a wrapper that does
 * nothing is a decision record telling the next author a falsehood, so it is
 * retired rather than kept. (The lib fix shifted this week's rng stream on the
 * ~16% of seeds where the filter used to re-draw; the week was re-swept and
 * re-measured on the same lattices at the change.)
 */
const sitChanceOfEvent = probabilityOfEvent();

// ---------------------------------------------------------------------------
// The complement — the other piece of the same line
// ---------------------------------------------------------------------------

const GUMBALL_FLAVOURS = ['lemon', 'cherry', 'apple', 'mint'] as const;

/**
 * THE COMPLEMENT. PART-WHOLE, on a machine of identical gumballs, which passes
 * §1's physical test: they differ in flavour and in nothing else.
 *
 * The count asked for is never half the machine, for decision 8's reason — this
 * is the week's other single-step chance item and the same argument applies.
 */
const sitComplement = situation({
  situationType: 'part-whole',
  cognitiveOp: 'complement',
  draw: (r) => {
    const total = r.pick([8, 10, 12, 15, 16, 20]);
    let favorable = r.int(2, total - 2);
    // One deterministic step past the half, never a redraw loop (kit §E2.4).
    if (favorable * 2 === total) favorable = favorable === total - 2 ? favorable - 1 : favorable + 1;
    const flavour = r.pick(GUMBALL_FLAVOURS);
    return {
      prompt: `A gumball machine holds ${countNoun(total, 'gumballs')} that are alike in everything but flavour, and ${favorable} of them are ${flavour}. One gumball comes out. What is the chance that it is NOT ${flavour}?`,
      answerValue: chance(total - favorable, total),
      templateId: 'stat_prob_complement_v1',
      params: { favorable, total },
      validation: 'equivalent-fraction',
      acceptableForms: [],
      hints: [
        'Which gumballs would leave you disappointed, and how many of the machine do they make up?',
        'Count the gumballs that are not the named flavour, then set that count over every gumball in the machine.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// The commitment, made before any arithmetic (the metacog carrier, decision 5)
// ---------------------------------------------------------------------------

/**
 * A LUCKY DIP DRAWN FROM TWICE, with the first parcel either put back or kept
 * out — drawn. MULTI-STAGE, and the week's metacognition carrier, served ONLY
 * through the wrapper below (kit §E2.2), so its ladder is spent once.
 *
 * Both branches print the same two numerals in the same two places and differ in
 * one three-word phrase of equal length, so no size on the page and no sentence
 * length moves with the answer. The first parcel is stated as a FACT rather than
 * as a condition (decision 5).
 *
 * `favorable` is at least two so the kept-out branch never asks for a chance of
 * nothing, and the params deliberately DISAGREE with the printed counts on that
 * branch — `stat_prob_v1` is handed the dip as it now stands, one parcel lighter
 * — which is the whole point of the item and is flagged here for any later
 * params-versus-prompt audit.
 */
const sitSecondDraw = situation({
  situationType: 'multi-stage',
  cognitiveOp: 'probability-after-a-draw',
  draw: (r) => {
    const winners = r.int(3, 7);
    const blanks = r.int(3, 8);
    const total = winners + blanks;
    const putBack = r.int(0, 1) === 1;
    return {
      prompt: `A lucky dip holds ${countNoun(winners, 'winning parcels')} and ${countNoun(blanks, 'blank ones')}, all sealed and alike to the touch. One parcel is drawn and it is a winner. That parcel is ${putBack ? 'dropped back in' : 'kept right out'}. A second parcel is now drawn. What is the chance that it wins?`,
      answerValue: putBack ? chance(winners, total) : chance(winners - 1, total - 1),
      templateId: 'stat_prob_v1',
      params: putBack ? { favorable: winners, total } : { favorable: winners - 1, total: total - 1 },
      validation: 'equivalent-fraction',
      acceptableForms: [],
      hints: [
        'Does the second parcel meet the dip as it started, or a dip that is not the same any more?',
        'Count the winning parcels still in the dip and the parcels still in it altogether, then set one over the other.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const sitSecondDrawEstimate = withEstimateFirst(
  sitSecondDraw,
  'does the second parcel meet the dip as it started, or a changed one?',
);

// ---------------------------------------------------------------------------
// Discrimination — the fifty-fifty trap, rebuilt (decisions 1, 2, 3, 4)
// ---------------------------------------------------------------------------

type Card = { text: string; value: number; why: keyof typeof CARD_WHY | 'correct' };

const CARD_WHY = {
  fiftyFifty: {
    tag: 'concept-misconception' as ErrorTag,
    rationale:
      'Counts only "it happens" and "it does not" and treats those two as the whole story, whatever the faces actually look like. Two outcomes is not two equal outcomes, and only the dice itself can say which.',
  },
  complement: {
    tag: 'task-comprehension' as ErrorTag,
    rationale:
      'Gives the chance of the roll MISSING what was asked for — the other piece of the line, correctly worked out and answering the other question.',
  },
  odds: {
    tag: 'representation-misread' as ErrorTag,
    rationale:
      'Sets the winning faces against the losing faces instead of against all the faces there are. That is a comparison of two counts, not a share of the whole, so it does not sit on the line from nothing to certain at all.',
  },
  onePart: {
    tag: 'concept-misconception' as ErrorTag,
    rationale:
      'Gives the chance of one single named face, as though only one of the faces could win, when the question names several.',
  },
  short: {
    tag: 'procedure-slip' as ErrorTag,
    rationale:
      'Counts the winning faces one short. The method is right and the count is not, which is why the answer looks so nearly reasonable.',
  },
  long: {
    tag: 'procedure-slip' as ErrorTag,
    rationale:
      'Counts one winning face too many, most often by counting a face that was only being pointed at rather than named.',
  },
} as const;

/**
 * Every legal card set, enumerated ONCE at module load rather than drawn and
 * repaired — the shape E17's `SIGN_CARDS` established, and the only way to make
 * the key's rank exact rather than approximate.
 *
 * TOTALS ARE THE FACE-COUNTS OF REAL FAIR DICE, and all of them are even, which
 * is decision 3's parity guard wearing a scene rather than a constraint.
 */
const DICE_FACES = [6, 8, 10, 12] as const;

type Cell = { total: number; winners: number; cards: Card[]; keyRank: 'smallest' | 'middle' | 'largest' };

function buildCells(): Cell[] {
  const out: Cell[] = [];
  for (const total of DICE_FACES) {
    for (let winners = 2; winners <= total - 2; winners++) {
      const isHalf = winners * 2 === total;
      const correct: Card = { text: chance(winners, total), value: winners / total, why: 'correct' };
      const pool: Card[] = [
        { text: chance(total - winners, total), value: (total - winners) / total, why: 'complement' },
        { text: chance(1, total), value: 1 / total, why: 'onePart' },
        { text: chance(winners - 1, total), value: (winners - 1) / total, why: 'short' },
        { text: chance(winners + 1, total), value: (winners + 1) / total, why: 'long' },
      ];
      // The odds card is paired to the branch where it is a PROPER fraction, and
      // dropped where it would reduce to the fifty-fifty card (decision 3).
      if (winners * 2 < total && total !== 3 * winners) {
        pool.push({ text: chance(winners, total - winners), value: winners / (total - winners), why: 'odds' });
      }
      const half: Card = { text: '1/2', value: 0.5, why: 'fiftyFifty' };
      // On a half draw the 1/2 card IS the answer, so TWO distractors are drawn;
      // otherwise it is a mandatory distractor and ONE more is drawn (decision 2).
      const sets: Card[][] = isHalf
        ? pool.flatMap((a, i) => pool.slice(i + 1).map((b) => [{ ...half, why: 'correct' as const }, a, b]))
        : pool.map((d) => [correct, half, d]);
      for (const cards of sets) {
        if (new Set(cards.map((c) => c.text)).size < 3) continue;
        const key = cards[0];
        const below = cards.filter((c) => c.value < key.value).length;
        out.push({
          total,
          winners,
          cards,
          keyRank: below === 0 ? 'smallest' : below === 2 ? 'largest' : 'middle',
        });
      }
    }
  }
  return out;
}

const CELLS = buildCells();
const CELLS_BY_RANK = {
  smallest: CELLS.filter((c) => c.keyRank === 'smallest'),
  middle: CELLS.filter((c) => c.keyRank === 'middle'),
  largest: CELLS.filter((c) => c.keyRank === 'largest'),
};
const RANKS = ['smallest', 'middle', 'largest'] as const;
for (const rank of RANKS) {
  if (CELLS_BY_RANK[rank].length < 6) {
    throw new Error(`E23 discrimWhichChance: only ${CELLS_BY_RANK[rank].length} cells key the ${rank} card`);
  }
}

// SIX, not four, and reading a served week is why. This pool is shared by the
// discrimination, the forward chain and the puzzle, and at four marks two
// servings of the chain printed the same dice with the same mark on consecutive
// days — differing only in how many faces were stickered. `drawUniqueItem` waves
// that through because the numeric tokens differ; only reading the pages sees it.
// (E16 recorded the same constraint about a pool three generators draw from.)
const DICE_MARKS = ['a star', 'a crown', 'an anchor', 'a leaf', 'a bell', 'a key'] as const;

/**
 * The recipe's discrimination, with the KEY'S RANK DRAWN FIRST (decision 2).
 *
 * A fair dice, its faces marked, and the question of what the roll is worth.
 * Every card is a named misconception's real output and every one of them is
 * keyable — including "1/2", which is the truth exactly when half the faces are
 * marked, and which the library's version made permanently wrong on purpose.
 */
const discrimWhichChance = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'probability',
  draw: (r) => {
    const cell = r.pick(CELLS_BY_RANK[r.pick(RANKS)]);
    const mark = r.pick(DICE_MARKS);
    const [key, ...rest] = cell.cards;
    return {
      prompt: `A fair dice has ${countNoun(cell.total, 'equal faces')}, and ${cell.winners} of them show ${mark}. Which fraction gives the chance of rolling ${mark}?`,
      correct: key.text,
      distractors: rest.map((c) => ({
        text: c.text,
        errorTag: CARD_WHY[c.why as keyof typeof CARD_WHY].tag,
        rationale: CARD_WHY[c.why as keyof typeof CARD_WHY].rationale,
      })),
      hints: [
        'Are the two things that could happen on this roll — the mark, or no mark — as likely as each other?',
        'Count the faces that show the mark, then count every face there is, and set the first over the second.',
      ],
      // Three, not four: QG-9 caps an item's own tag list at three. Every card's
      // OWN errorTag is unaffected and all four are banked below.
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Chains — forward, backwards, and one carrying a quantity it never spends
// ---------------------------------------------------------------------------

/**
 * FORWARD, and "count what is there NOW" made computational: blank faces are
 * stickered over, so the dice the question asks about is not the dice it
 * describes first. Two operations, each doing real work — fold the new marks
 * into the count, then set that count over all the faces.
 *
 * No leak by construction: the answer is a reduced fraction and no prompt in this
 * week prints a fraction at all.
 */
const msRestickerTheDice = multiStep({
  situationType: 'combine',
  cognitiveOp: 'probability-after-a-change',
  draw: (r) => {
    // Four real dice sizes and a wider sticker count, for the pool reason above.
    const total = r.pick([8, 10, 12, 20]);
    const marked = r.int(2, total - 4);
    const added = r.int(2, 4);
    const mark = r.pick(DICE_MARKS);
    return {
      prompt: `A fair dice has ${countNoun(total, 'equal faces')}. ${marked} of them show ${mark} and the rest are blank. ${countNoun(added, 'of the blank faces')} are then stickered over so that they show ${mark} too. What is the chance of rolling ${mark} now?`,
      initN: marked,
      steps: [
        { op: 'add', n: added, d: 1 },
        { op: 'div', n: total, d: 1 },
      ],
      units: undefined,
      validation: 'equivalent-fraction',
      acceptableForms: [],
      hints: [
        'Which dice is this question about — the one described first, or the one left after the stickers went on?',
        'Settle how many faces show the mark once the stickers are on, then set that against the number of faces the dice has.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const CAPSULE_PRIZES = ['a whistle', 'a puzzle ring', 'a bouncy ball', 'a badge'] as const;

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The quantity the story hands over
 * is the chance of NOT winning, which is the RESULT of the complement, so the
 * opening move is to undo it — and nothing in the order the sentence is written
 * asks for that. Then the share is turned back into a count.
 *
 * The two steps are the anchor run backwards: one machine-full shared into the
 * stated number of equal parts, then as many of those parts as the complement
 * leaves. Both are whole-number operations, which is what the exact chain
 * evaluator can express.
 *
 * No leak by construction: the answer is a count of capsules between 2 and 15,
 * the total is at least 12 and is a multiple of the denominator, and the two
 * numerals the prompt prints are the denominator and the machine's size.
 */
const msRecoverCount = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'probability-recover-count',
  posing: 'inverse-start',
  draw: (r) => {
    const parts = r.pick([3, 4, 5, 6]);
    const missing = r.int(1, parts - 1);
    // THE RECOVERED COUNT MUST NOT BE A NUMERAL THE PROMPT ALREADY PRINTS, and on
    // the first draft it was, on 14.7% of servings and 15.3% of a CERTIFYING
    // mastery slot — the answer (total/parts)*(parts-missing) landed on the
    // fraction's own numerator or denominator whenever the winning share was
    // small. `lots` is the one dial free once the share is fixed, and it is
    // walked from the value drawn rather than redrawn (kit §E2.4).
    const drawnLots = r.int(3, 5);
    let lots = drawnLots;
    for (let k = 0; k < 3; k++) {
      const cand = 3 + ((drawnLots - 3 + k) % 3);
      const answer = cand * (parts - missing);
      if (![parts * cand, parts, missing].includes(answer)) { lots = cand; break; }
    }
    const total = parts * lots;
    const prize = r.pick(CAPSULE_PRIZES);
    return {
      prompt: `A vending machine holds ${countNoun(total, 'sealed capsules')}, all the same size and weight. The chance that a capsule does NOT hold ${prize} is ${chance(missing, parts)}. How many of the capsules hold ${prize}?`,
      initN: total,
      steps: [
        { op: 'div', n: parts, d: 1 },
        { op: 'mul', n: parts - missing, d: 1 },
      ],
      units: 'capsules',
      hints: [
        'Is the fraction you are given the share that wins, or the share that does not?',
        'Cut the machine into as many equal groups as the bottom of the fraction says, then take the groups the winning share is entitled to.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const SPINNER_COLOURS = ['amber', 'violet', 'teal', 'crimson'] as const;

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3), and the gambler's fallacy turned
 * into a spare quantity. The spinner's number of past spins is stated, is never
 * used, and is the one number on the page a child who believes the past matters
 * will reach for — which makes the distractor a diagnosis rather than a trap.
 *
 * Two operations: count the sectors that are NOT the named colour, then set that
 * count over every sector. That is the anchor's own method, run on the piece of
 * the line the question asks about.
 *
 * No leak by construction: the answer is a reduced fraction and nothing in the
 * prompt is written as one.
 */
const msSpareGoes = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'probability-complement-count',
  posing: 'has-distractor',
  draw: (r) => {
    const total = r.pick([8, 10, 12, 16]);
    let coloured = r.int(2, total - 2);
    if (coloured * 2 === total) coloured = coloured === total - 2 ? coloured - 1 : coloured + 1;
    const spins = r.int(14, 40);
    const colour = r.pick(SPINNER_COLOURS);
    return {
      prompt: `A spinner is cut into ${countNoun(total, 'equal sectors')}, and ${coloured} of them are ${colour}. It has already been spun ${countNoun(spins, 'times')} today. What is the chance that the next spin does NOT stop on ${colour}?`,
      initN: total,
      steps: [
        { op: 'sub', n: coloured, d: 1 },
        { op: 'div', n: total, d: 1 },
      ],
      validation: 'equivalent-fraction',
      acceptableForms: [],
      hints: [
        'Is every number printed here a number this question needs, or is one of them only telling you what the spinner has been doing?',
        'Count the sectors that are not the named colour, then set that count over every sector the spinner has.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand, including the flagged open part (§7)
// ---------------------------------------------------------------------------

/**
 * THE ERROR-ANALYSIS, on the library's registered truth with a locally repaired
 * draw (decision 6). `stat_verify_next_trial_v1` returns the spinner's own
 * chance against the chance the observed run suggests, both reduced, and refuses
 * a draw where the two agree — so the figure the student is shown is a real
 * misconception's real output and the true answer is code-derived.
 *
 * `favorable` is drawn at 2 or 3 rather than hardcoded to 1, which is the whole
 * repair: with it fixed, every true answer was one-over-something and the numeric
 * half of the item needed no reading after a single exposure.
 *
 * The collision nudge is re-derived here. The claim is `pastHits/pastTrials` and
 * the truth is `favorable/total`; they agree exactly when
 * pastHits · total = pastTrials · favorable, so at most one `pastHits` value in
 * range can collide for a given triple and one deterministic step always clears
 * it (kit §E2.4 — never a redraw loop).
 */
const eaPastSpinsChangeNext = errorAnalysis({
  verifyTemplateId: 'stat_verify_next_trial_v1',
  cognitiveOp: 'probability',
  drawParams: (r) => {
    const favorable = r.int(2, 3);
    const total = r.pick([8, 10, 12]);
    const pastTrials = r.pick([6, 9, 12]);
    let pastHits = r.int(2, 5);
    if (pastHits * total === pastTrials * favorable) pastHits = pastHits === 5 ? 2 : pastHits + 1;
    return { favorable, total, pastTrials, pastHits };
  },
  // A DICE, NOT A SPINNER, and reading a served week is why. Day 5's fair-game
  // task is a spinner by fixed prose, and while this item was one too, EVERY
  // pack opened two Day-5 items on the same device — 600 of 3,000 served day
  // pages, which is one page in five, which is Day 5 every time. E22 found the
  // identical collision between its Day-5 task and its Day-5 error-analysis and
  // fixed it the same way; a dice is exactly as memoryless as a spinner, and
  // rolling one removes nothing from it either.
  build: (v, p, r) => {
    const mark = r.pick(DICE_MARKS);
    return {
      prompt: `A fair dice has ${countNoun(Number(p.total), 'equal faces')}, and ${Number(p.favorable)} of them show ${mark}. In its last ${countNoun(Number(p.pastTrials), 'rolls')} it showed ${mark} ${countNoun(Number(p.pastHits), 'times')}. A student wrote that the chance of ${mark} on the very next roll is ${v.wrong}.`,
      extension: `Write the chance of ${mark} on the next roll, and say what the dice does and does not keep a record of.`,
      hints: [
        'Does the dice keep any record of what it showed before?',
        'Look at the dice itself, count the faces carrying the mark, and set that against every face it has.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: [v.correct],
    };
  },
});

/**
 * THE R-FLAGGED PART, and the only honest way to ship this cell.
 *
 * The recipe's Day-5 signature is "invent a fair game and prove whether it is
 * fair", and an invented game is not a number. What CAN be graded is graded: the
 * two chances are stated in `value` for whoever marks it, and the repair is
 * uniquely determined. What cannot be recomputed — a game the child made up, and
 * the argument that it is fair — is `manual-review`.
 *
 * FAIRNESS IS DEFINED IN THE WEEK'S OWN CURRENCY, which is the point of the
 * page: equal counts of winning outcomes on one round, not expected payout,
 * which needs machinery no week has taught.
 *
 * The numbers are chosen rather than drawn, because the lesson is in their
 * shape. Twelve sectors; Ana wins on the four numbers under five, Ben on the
 * three over nine, and the five in between win for nobody. So Ana holds 4/12 and
 * Ben 3/12 — a game that LOOKS even because each rule is one short sentence, and
 * is not. Moving Ben's rule to "over eight" gives him 9, 10, 11 and 12, which is
 * four sectors against Ana's four, and the game is fair with the middle band
 * still winning for nobody.
 */
const fairGameDesign = reasoning({
  prompt:
    'A spinner is cut into twelve equal sectors numbered 1 to 12. Ana wins the round if the spinner stops on a number under 5. Ben wins if it stops on a number over 9. If it stops anywhere else, nobody wins and the round is played again. Write both players\' chances of winning a round as fractions. Then say which player the game favours, and change ONE of the two rules so that the game becomes fair — and say how the counts prove it is fair, rather than that it looks it.',
  value:
    'Ana has 4 sectors out of 12, which is 1/3, and Ben has 3 out of 12, which is 1/4, so the game favours Ana; changing Ben\'s rule to a number over 8 gives him 9, 10, 11 and 12, which is four sectors each and equal chances of a third',
  keywords: false,
  hints: [
    'Before working anything out, does a rule of the same length always cover the same number of sectors?',
    'Count the sectors each rule actually wins on, write each count over twelve, and only then decide which rule to move.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The always/sometimes/never item, WITH ITS CLAIM DRAWN and each claim carrying
 * its OWN demand — one demand cannot fit three claims, which reading a served
 * week taught E22 the expensive way.
 *
 * The three are the three things a learner most needs to be able to defend here:
 * that the two pieces of the line come to one (always), that nothing can sit off
 * the end of it (never — the 0–1 scale, which the catalog names and which this
 * item is the week's item-level carrier for), and that the fifty-fifty answer is
 * right exactly when the outcomes really are equally likely (sometimes — the
 * week's named misconception, stated as the claim it actually is).
 */
const ASN_CLAIMS = [
  {
    claim: 'the chance of a thing happening and the chance of it not happening come to one between them',
    verdict: 'always',
    demand: 'Say what the two chances are counting between them, in one sentence.',
    wrong: {
      sometimes: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'Allows the two to fall short on some devices. Every outcome there is belongs to one of the two, so together they count everything the thing can do and there is nothing left over.',
      },
      never: {
        tag: 'representation-misread' as ErrorTag,
        rationale:
          'Reads the two chances as unrelated numbers that happen to sit near each other, rather than as the two pieces the line is cut into at one place.',
      },
    },
  },
  {
    claim: 'a chance can come out larger than one',
    verdict: 'never',
    demand: 'Say what a chance of exactly one would already mean.',
    wrong: {
      always: {
        tag: 'procedure-slip' as ErrorTag,
        rationale:
          'Confuses a chance with a count. Six winning faces is a perfectly good count; it is only a chance once it has been set against all the faces there are, and it cannot then be more than all of them.',
      },
      sometimes: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'Leaves room above certainty. One end of the line is everything the thing can do, so there is nowhere past it for an answer to land.',
      },
    },
  },
  {
    claim: 'when a game has two outcomes, each of them has a chance of a half',
    verdict: 'sometimes',
    demand: 'Give one game where it holds and one where it does not.',
    wrong: {
      always: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'The week\'s own misconception stated as a rule: it counts how many things could happen and never asks whether they are as likely as each other.',
      },
      never: {
        tag: 'task-comprehension' as ErrorTag,
        rationale:
          'Overcorrects. A fair coin, and a spinner cut so that exactly half of it wins, really do give a half each — the claim is not wrong, it is only unearned until the outcomes have been checked.',
      },
    },
  },
] as const;

const VERDICTS = ['always', 'sometimes', 'never'] as const;

const chanceClaimASN: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: (c.wrong as Record<string, { tag: ErrorTag; rationale: string }>)[v].tag,
      rationale: (c.wrong as Record<string, { tag: ErrorTag; rationale: string }>)[v].rationale,
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    const item: ItemDraft = {
      type: 'classification',
      prompt: `Always, sometimes, or never true: ${c.claim}. ${c.demand}`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: [
        'What would you have to check about a game before this claim could be trusted on it?',
        'Try the claim on a device whose outcomes are alike apart from their names, then on one whose outcomes are nothing like each other, and let the pair choose the verdict.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
    return item;
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE23 = makeWeekBuilder({
  level: 'E',
  week: 23,
  conceptId: 'probability',
  conceptName: 'Probability',
  strandTags: ['probability-statistics'],
  prerequisiteWeeks: [D2, D10, E22],
  pedagogyContract: 'v2',
  conceptualAnchor: 'a chance is where the winning count lands on the line',
  conceptFamily: 'operation',
  deepeningDelta:
    'E21 and E22 worked on data that had already happened — readings someone had collected, displays someone had drawn — and every question was settled by counting or summarising what was in front of the child. E23 asks about something that has NOT happened yet, and that is a genuinely different kind of question: there is nothing to count on the page, so the counting has to be done on the DEVICE instead. What makes it answerable at all is that the outcomes of a fair device are alike apart from their names, so they can be counted the way E22 counted readings in a band. The new work is threefold. A chance is a count set against all the outcomes, so the answer is a fraction rather than a number of things — which is why D10 comes back. The two pieces of the line come to one, so every question has a mirror question with an answer that can be got without starting again. And a run of results is not evidence about the next one: E22 taught that a display can mislead, and this week teaches that a short run of luck can too, which is the same lesson about evidence in a place a child will meet it for the rest of their life.',
  explanation: {
    hook:
      'Ask most people the chance of a fair spinner stopping on green and you will get an argument, not a number. Either it stops on green or it does not — so a half? That reasoning is quick, it is confident, and it is wrong about almost every spinner ever made. What is wrong with it is not the arithmetic.',
    whyBeforeHow:
      'Draw a line, put nothing at one end and certain at the other, and cut it into one equal step for every outcome the thing can produce. Now count the outcomes that win and walk that many steps along: a chance is where the winning count lands on the line. That is the whole method, and it works because the steps are equal — which is the clause everybody skips. Two outcomes is not the same as two EQUAL outcomes, and the test is not something you argue about, it is something you look at: the outcomes are equally likely when the things themselves are alike apart from their names. Eight equal sectors of a spinner pass that test. Twelve sealed parcels that feel the same in your hand pass it. Rain and no rain do not, and neither does winning the lottery, which is why "either it happens or it does not, so it is fifty-fifty" is the most confident wrong sentence in mathematics. Two more things fall straight out of the picture. The line gets cut ONCE, at the chance: what lies to the left is the chance of the thing happening and what lies to the right is the chance of it not happening, and the two pieces are the whole line, which is why they come to one. And the past changes a chance only by changing the counts, never otherwise. A spinner has no memory, because spinning it removes nothing from it — six greens in the last nine spins leave exactly the sectors that were always there. A bag you do not refill remembers perfectly well, because taking a counter out really does change what is inside. Both obey one instruction, and it is the instruction to hold on to: count what is there NOW.',
    script: [
      {
        say: 'Here is a spinner cut into eight equal sectors. Three of them are teal. I am going to work out the chance of teal, and I am going to do it by drawing a line rather than by having an opinion. Nothing at this end, certain at that end. Eight outcomes, so I cut the line into eight equal steps. Three of them win. I walk three steps. That is where the chance lives, and its name is three eighths.',
        visual: 'The line from 0 to 1 cut into eight equal steps, with the third step marked.',
        figure: numberLine(
          { min: 0, max: 1, partition: 8, labels: 'ends' },
          { alt: 'the line from nothing to certain, cut into eight equal steps, one for each sector of the spinner' },
        ),
      },
      {
        say: 'Now watch me break it, on purpose. Someone says: it either stops on teal or it does not, that is two things, so it is a half. Look at what that does to my line. It cuts it into TWO steps instead of eight. And the question I have to ask is whether those two steps are the same size — because my whole method depends on the steps being equal. They are not. One of them is three sectors wide and the other is five. Two outcomes is not two equal outcomes, and no amount of confidence changes it.',
        visual: 'The same line cut into two steps instead of eight, the two pieces plainly unequal.',
        figure: numberLine(
          { min: 0, max: 1, partition: 2, labels: 'ends' },
          { alt: 'the same line cut into just two steps, to be held against the eight-step line above it' },
        ),
      },
      {
        say: 'The line is cut once, at the chance. Three eighths is to the left of the cut and that is teal. Five eighths is to the right of it and that is everything else. Together they are the whole line, which is why they come to one — I do not have to remember that, I can see it. So if I ever want the chance of NOT teal, I never start again. I already know the piece I want is whatever is left of the line.',
        visual: 'One cut at three eighths, the two pieces labelled.',
        figure: numberLine(
          { min: 0, max: 1, partition: 8, labels: 'ends' },
          { alt: 'the eight-step line with a single cut three steps along, the short piece and the long piece making the whole' },
        ),
      },
      {
        say: 'One last habit, and it is the one that will save you money one day. Suppose the last nine spins stopped on teal six times. Does that change the chance of the next one? Only if it changed the SECTORS, and it did not — spinning a spinner removes nothing from it, so what is on it now is what was always on it. But a bag you take counters out of and do not refill is a different story, because taking one out really does change what is inside. Before I trust any answer, I check it against one instruction: count what is there NOW.',
        visual: 'The spinner unchanged after nine spins, beside a dip with one parcel taken away.',
        figure: numberLine(
          { min: 0, max: 1, partition: 8, labels: 'ends' },
          { alt: 'the eight-step line again, unchanged, to make the point that nine spins have moved nothing on it' },
        ),
      },
    ],
    summary:
      'A chance is where the winning count lands on the line from nothing to certain: cut the line into one equal step for every outcome, count the outcomes that win, and walk that far. It only works while the steps are equal, and outcomes are equally likely when the things are alike apart from their names — which is why "either it happens or it does not, so it is fifty-fifty" is wrong about almost every device, and right about the few where half really does win. The line is cut once, so the chance of a thing and the chance of not-that-thing are the two pieces of one line and come to one; the second is never worth starting again for. And a run of past results changes a chance only if it changed the counts. A spinner keeps no record and is untouched by nine spins; a bag you do not refill is changed by every counter taken out of it. Count what is there now.',
    vocabulary: [
      { term: 'probability', kidGloss: 'how likely something is, written as the winning outcomes set over all the outcomes there are' },
      { term: 'outcome', kidGloss: 'one of the things a device can do — one face of a dice, one sector of a spinner' },
      { term: 'equally likely', kidGloss: 'outcomes that are alike apart from their names, so no one of them is favoured' },
      { term: 'the complement', kidGloss: 'the chance of a thing NOT happening; it and the thing itself make one between them' },
      { term: 'certain and impossible', kidGloss: 'the two ends of the line — a chance of one, and a chance of nothing' },
    ],
  },
  guidedExamples: [
    {
      ...ge(23, 1, 'modeled', 'A spinner is cut into 10 equal sectors, 4 of them amber and the other 6 blank. What is the chance of stopping on amber?', [
        {
          teacherSay:
            'Let me settle what kind of question this is before I touch a number. It is not asking how many sectors are amber — I can see that, it is four. It is asking where four out of ten sits on the line from nothing to certain, and that is a different sort of answer: a fraction, not a count of things.',
        },
        {
          teacherSay:
            'So I cut the line into one step for every outcome. How many steps do I need, and how many of them win?',
          expected: 'ten steps, four of them win',
        },
        {
          childDo: 'Set the winning count over every outcome there is, and write it in its simplest form.',
          expected: '2/5',
        },
      ], '2/5'),
      visual: 'The line cut into ten equal steps, four of them winning.',
      figure: numberLine(
        { min: 0, max: 1, partition: 10, labels: 'ends' },
        { alt: 'the line from nothing to certain cut into ten equal steps, one for each sector of the spinner' },
      ),
    },
    {
      ...ge(23, 2, 'completion', 'A tin holds 15 buttons that differ only in colour. 6 of them are teal. What is the chance that a button taken out without looking is NOT teal?', [
        {
          teacherSay: 'The line gets cut once, at the chance of teal. Which piece of it does this question actually want — the piece to the left of the cut, or the piece to the right?',
          expected: 'the piece to the right',
        },
        {
          childDo: 'Count the buttons that are not teal, set that over every button in the tin, and simplify.',
          expected: '3/5',
        },
      ], '3/5'),
      visual: 'One line, cut once, with both pieces named.',
      figure: numberLine(
        { min: 0, max: 1, partition: 15, labels: 'ends' },
        { alt: 'the line cut into fifteen equal steps, one for each button, with a single cut six steps along' },
      ),
    },
    ge(23, 3, 'prompted', 'A fair dice has 12 equal faces: 4 show a crown and the other 8 are blank. A student says the chance of a crown is a half, because the dice either shows a crown or it does not. Say what is wrong with that reasoning, and give the chance.', [
      {
        childDo: 'Ask whether the two things the student counted are as likely as each other, then count the outcomes properly.',
        expected: '1/3',
      },
    ], '1/3'),
    {
      // Independent stage: the line is NOT drawn. Deciding how many steps to cut
      // it into is the task, so drawing it would hand over the answer the item
      // exists to ask for (L33).
      ...ge(23, 4, 'independent', 'A lucky dip holds 5 winning parcels and 7 blank ones, all sealed and alike. One parcel is drawn and it wins, and it is set to one side. A second parcel is now drawn. What is the chance that it wins? Solve cold.', [
        { childDo: 'Say what is in the dip NOW, before you write anything down, and count both parts of it again.', expected: '4/11' },
      ], '4/11'),
      visual: 'The dip as it started. What is in it for the second draw is yours to work out.',
      figure: numberLine(
        { min: 0, max: 1, partition: 12, labels: 'ends' },
        { alt: 'the line cut into twelve equal steps for the dip as it began; no line is drawn for the dip after the first parcel left it' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: a chance, its complement, and the two-stage dip.
    // Single-step throughout; no chains and no choices yet.
    //
    // The warm-up ORDER is load-bearing, which nothing in the kit says and only
    // reading a served pack shows: `applyRetrievalRamp` moves the LAST Day-1
    // retrieval item to Day 5, which carries no warm-up of its own. The
    // fraction-comparison item sits last so Day 5 gains a format rather than a
    // duplicate.
    [
      { gen: wJoin, diff: 2 },
      { gen: wFracEquiv, diff: 2 },
      { gen: wFracCompare, diff: 2 },
      { gen: sitChanceOfEvent, diff: 3 },
      { gen: sitComplement, diff: 3 },
    ],
    // Day 2 — fluency + application: the commitment made before any arithmetic,
    // the fifty-fifty decision, and the recovery chain.
    [
      { gen: wJoin, diff: 2 },
      { gen: wFracEquiv, diff: 2 },
      { gen: sitSecondDrawEstimate, diff: 3 },
      { gen: discrimWhichChance, diff: 4 },
      { gen: msRecoverCount, diff: 4 },
    ],
    // Day 3 — interleave: two chains of different shapes either side of a single
    // read, so nothing on the page signals what kind of work comes next.
    [
      { gen: wFracCompare, diff: 2 },
      { gen: msSpareGoes, diff: 4 },
      { gen: sitChanceOfEvent, diff: 3 },
      { gen: msRestickerTheDice, diff: 4 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus one
    // single-step item so "it must be a chain" never becomes the cue.
    [
      { gen: msRestickerTheDice, diff: 5 },
      { gen: msSpareGoes, diff: 5 },
      { gen: msRecoverCount, diff: 4 },
      { gen: sitComplement, diff: 3 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the flagged
    // fair-game design, and the claim that makes the fifty-fifty rule general
    // (+ a ramped warm-up).
    [
      { gen: eaPastSpinsChangeNext, diff: 4 },
      { gen: fairGameDesign, diff: 4 },
      { gen: chanceClaimASN, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the sentence this week exists to unseat is one most adults say too — "it either happens or it does not, so it is fifty-fifty". It is not the arithmetic that is wrong, it is the counting: two outcomes only split the chance evenly when the two outcomes are as likely as each other, and the test for that is physical rather than verbal. Are the things alike apart from their names? Equal sectors, identical sealed parcels: yes. Rain and no rain: plainly not. If you want one question to ask, make it "are those two things as likely as each other?" and accept an answer about the device rather than about the feeling. One honest exception worth knowing, because a sharp child will find it: a spinner really has no memory, but a bag you do not refill has an excellent one. Taking a counter out changes what is inside; spinning changes nothing. The instruction that covers both is the one the week ends on — count what is there now.',
  ],
  puzzle: (r) => {
    // DESIGN THE DEVICE, which is the week's move run BACKWARDS: every day item
    // reads a chance off a device, and here the chances are given and the device
    // has to be built. Neither Day-1 structure produces it — a Day-1 item counts
    // what is in front of it, and this one has to decide how many outcomes there
    // should BE before anything can be counted.
    //
    // Uniquely determined by the word SMALLEST: the sector count must be a
    // common multiple of both denominators, so the least one is what is asked
    // for, and the two numerators then follow. Denominators are drawn as a
    // coprime pair from a fixed table so the least common multiple is their
    // product and the remaining sectors are never negative.
    const [d1, d2] = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7]] as Array<[number, number]>);
    const sectors = d1 * d2;
    const first = sectors / d1;
    const second = sectors / d2;
    const [markA, markB] = r.shuffle([...DICE_MARKS]).slice(0, 2);
    return {
      id: 'E23-PZ-01',
      title: 'Puzzle Grove: Build the Spinner',
      puzzleType: 'construction',
      prompt: `A spinner is to be cut into equal sectors so that the chance of stopping on ${markA} is ${chance(1, d1)} and the chance of stopping on ${markB} is ${chance(1, d2)}. Every sector that is neither shows nothing at all. Write three numbers in order: the smallest number of equal sectors the spinner can have, how many of them show ${markA}, and how many show ${markB}. Then say in one sentence why no smaller spinner could do it.`,
      answer: {
        value: `${sectors}, ${first}, ${second}`,
        acceptableForms: [
          `${sectors}, ${first}, ${second}`,
          `${sectors} ${first} ${second}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What has to be true of the number of sectors before a chance like this can be cut out of it exactly?',
        'Find the smallest number that both of the bottom numbers divide into, then take that many sectors and share out each mark in turn.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'design-sample-space' },
  sprint: {
    skill: 'Multiplication facts to 12 — the equal groups a chance is cut into before anything is counted',
    sourceWeek: D2,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 12] },
  },
  // THE DISCRIMINATION AND THE ALWAYS/SOMETIMES/NEVER ITEM ARE BOTH ABSENT, for
  // E21 decision 5b's reason: a three-option page concedes a third of a slot to
  // a guesser before any reasoning happens, and this form certifies only where
  // the work has to be done. Decision 4 records the further reason the
  // discrimination in particular must not certify.
  mastery: [
    { gen: sitChanceOfEvent, diff: 3 },
    { gen: msRestickerTheDice, diff: 4 },
    { gen: sitComplement, diff: 3 },
    { gen: msRecoverCount, diff: 4 },
    { gen: sitSecondDrawEstimate, diff: 3 },
    { gen: msSpareGoes, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: the two pieces of one line — the chance of an event, drawn from a container of items alike apart from their colour and filtered so the answer is never exactly a half, and the chance of the other piece on a machine of identical gumballs. 02/04/06: chains in all three posing shapes — blank faces stickered over so the device changes under the child\'s hands (forward), a count recovered from the chance of NOT winning so the opening move is undoing the complement (inverse-start), and a spinner whose stated number of past spins is never spent (has-distractor). 05: a lucky dip drawn from twice, with the first parcel put back or kept out, drawn, behind a commitment to WHICH dip the second draw meets made before any arithmetic. Every answer on the form is a reduced fraction except the recovered count, and no prompt in this week writes a fraction at all, so no slot can be scored by copying a surface off the page. What the pairing does not claim: the two forms draw independently over small device pools, so they can land on the same total carrying a different winning count; the chances always differ, so no answer carries across.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'two-outcomes-read-as-even',
      description:
        'Counts how many things could happen and never asks whether they are as likely as each other, so any device with two outcomes is read as a half each. The arithmetic is faultless and the counting is not: the method needs the line cut into EQUAL steps, and two outcomes almost never cut it evenly. It survives because it is right occasionally — on a fair coin, and on a spinner where half really does win — which is exactly enough to keep it alive.',
      exampleWrongAnswer: 'a dice with four crowned faces out of twelve given a chance of a half',
      distractorRationale:
        'Offer a half, so only checking whether the two outcomes are alike apart from their names separates it from the truth.',
      reteachPointer: 'explanation/script[1] (it cuts the line into two steps, and they are not the same size) then guidedExamples/E23-GE-03',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-piece-of-the-line',
      description:
        'Answers with the chance of the thing NOT happening when the question wanted the thing, or the other way about. The two are the two pieces one cut makes, both correctly worked out, and nothing on the page separates them except the words — which is why the same device yields two right-looking answers.',
      exampleWrongAnswer: 'the chance of a gumball being lemon given where the chance of it not being lemon was asked for',
      distractorRationale:
        'Offer the other piece of the same line, correctly reduced, so only reading which piece the question wants separates them.',
      reteachPointer: 'explanation/script[2] (the line is cut once, and I already know the piece I want) then guidedExamples/E23-GE-02',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'past-run-read-as-evidence',
      description:
        'Reads a short run of results as though it had changed the device, so six greens in nine spins are taken to mean something about the tenth. What makes it durable is that it is sometimes right for the right reason: a bag nobody refills really is changed by every counter taken out of it. The question that separates the two cases is never about the run at all — it is whether anything was removed.',
      exampleWrongAnswer: 'the chance of the next spin given as the share of the last nine spins that landed on the colour',
      distractorRationale:
        'Offer the chance the observed run suggests, reduced the same way, so only asking whether the device itself changed separates it from the truth.',
      reteachPointer: 'explanation/script[3] (spinning removes nothing from it) then the Day-5 error-analysis',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'winners-against-losers',
      description:
        'Sets the winning outcomes against the losing ones rather than against all the outcomes there are, so three faces out of eight becomes three against five. It is a comparison of two counts rather than a share of a whole, so the answer does not sit on the line from nothing to certain at all — and on more than half the draws it comes out above one, which is a size a chance cannot be.',
      exampleWrongAnswer: 'three marked faces of eight given as three fifths',
      distractorRationale:
        'Offer the winning count set over the losing count, so only remembering what the bottom of a chance counts separates it from the truth.',
      reteachPointer: 'explanation/whyBeforeHow (count the outcomes that win and set them against all the outcomes there are)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Probability — writing a chance as the winning outcomes set over all the outcomes there are, and finding where that lands on the line from impossible to certain. We worked on why two outcomes does not mean an even chance, on the chance of a thing NOT happening being the rest of the same line, and on what a run of past results does and does not tell you about the next go.',
    improvingCandidates: [
      'checking whether the outcomes are alike before counting them',
      'reading which piece of the line a question wants',
      'asking whether anything was actually removed before letting the past matter',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'asking whether two outcomes are as likely as each other before splitting a chance between them',
      },
      {
        errorTag: 'task-comprehension',
        text: 'telling the chance of a thing from the chance of it not happening',
      },
      {
        errorTag: 'representation-misread',
        text: 'seeing that a run of results changes a chance only if it changed what is there',
      },
      {
        errorTag: 'procedure-slip',
        text: 'setting the winning outcomes against ALL the outcomes, not against the losing ones',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted what was actually in the dip after the first parcel came out, instead of trusting the numbers the question started with. Noticing that a device has changed under you is the whole of this week.',
      questionForChild:
        'I say I have a half chance of finding my keys in the next drawer I open, because either they are in there or they are not. What would you need to know before you agreed with me?',
      schoolSyncHook:
        'If your child\'s class writes chances as fractions, as decimals or as percentages, or says "likelihood" where we say chance, tell us which they use and we will match them.',
    },
    vocabularyForParent: [
      'probability (the winning outcomes set over all the outcomes there are)',
      'equally likely (outcomes alike apart from their names, so none is favoured)',
      'the complement (the chance of a thing NOT happening — it and the thing make one between them)',
    ],
  },
});
