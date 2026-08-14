/**
 * Level E · Week 7 — "Four-quadrant plane" (conceptId: four-quadrant-plane).
 *
 * FILL-ARCHITECTURE §6 row E7: anchor "signs name the quadrant"; key multi-step
 * "plot then reflect"; error-analysis "the x/y swap"; discrimination
 * "(-3, 2) vs (2, -3)"; Day-5 signature "hidden picture (figure params)". No R
 * flag: every strand of this week is computable and code-keyed.
 *
 * THE WEEK'S CLAIM. An ordered pair is an INSTRUCTION READ IN ORDER, not a bag
 * holding two numbers. Two facts follow and the week is built to force both
 * rather than announce them:
 *  - the ORDER decides which axis each number is measured along, so (-3, 2) and
 *    (2, -3) are two different places built from the same three marks on paper;
 *  - the SIGNS decide the corner, and nothing else does. Sizes name no quadrant:
 *    (-9, 1) and (-1, 9) sit in the same corner, and (9, 1) sits in a different
 *    one from both.
 * Everything below is aimed at those two:
 *  - two discriminations attack from opposite ends. `quadrantSignTrap` (the
 *    family's, the recipe's own) asks the child to PRODUCE the corner from a
 *    pair, with the swapped reading offered beside it. `discrimAxisOrQuadrant`
 *    asks the prior question the family never asks: whether the reading names a
 *    quadrant AT ALL. No generator in G5 has ever put a point on an axis in
 *    front of a child, and `verifyQuadrant` throws on one, so a child could
 *    finish the week believing every point lives in a corner;
 *  - the error-analysis is the family's own `eaCoordinateSwap`, whose shown
 *    wrong pair is re-derived by `e_verify_point_v1` from the same params the
 *    prompt's directions are written from;
 *  - three genuine chains, one per posing shape the E band owes: a FORWARD
 *    plot-then-reflect (the recipe's headline — one post reflected into four,
 *    and the frame they make measured), an INVERSE-START recovery where the
 *    stated area is the RESULT of the chain, and a HAS-DISTRACTOR walk whose
 *    north-south leg cannot touch the east-west reading it is asked for;
 *  - the Day-5 signature is a real hidden picture. Eight of a stencil's nine
 *    corners are plotted and joined on one grid; the ninth is missing, no line
 *    runs to it, and the child recovers it by reflecting the one corner left
 *    without a partner.
 *
 * ---------------------------------------------------------------------------
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3).
 *
 *  1. `quadrantSignTrap` IS SERVED AS IT STANDS, and its one soft spot is
 *     reported rather than worked around. Its `x` and `y` are two independent
 *     coin flips, so the two coordinates carry the SAME sign on 50.0% of draws
 *     (measured, 4,000) — and on those draws the swapped pair is the same
 *     corner, so the swap misconception has no distinct output. The generator
 *     already handles the card set: when the swap coincides with the truth it
 *     substitutes the y-axis mirror, so three distinct quadrants are always
 *     offered and no option is dead. What it does NOT do is re-word the
 *     rationale, so on those 50% the option tagged "reads the pair up-then-
 *     across" is the mirror rather than the swap and its rationale describes a
 *     move that did not produce it. That is a shared-file matter (lib/ is not
 *     this week's to edit) and it is reported, not patched. The consequence for
 *     the week is that this item is a QUADRANT item on every draw and a SWAP
 *     item on half of them — so the swap is carried three more times where it
 *     cannot degenerate: the Day-5 error-analysis, the Day-5 written defence
 *     (which names (-3, 2) and (2, -3) outright), and the lesson script.
 *
 *  2. `namePointFromMoves` PRINTS |x| AND |y| AS STEP COUNTS, and that is the
 *     task rather than a leak. Translating a described walk into a pair is
 *     exactly the E7 move: the digits are handed over and the ORDER and the two
 *     SIGNS are the whole of the work. It will appear in `bb-family-test`'s
 *     report-only answer-in-prompt census, and it is reported below with the
 *     measurement rather than dressed around. The same is true of the puzzle,
 *     which states two distances and asks for the pair they belong to.
 *
 *  3. NO `asserts` ON ANY COORDINATE-GRID FIGURE. `assertsParam` compares a
 *     figure's read-back value with a scalar param, and `point:k` reads back the
 *     formatted PAIR "(-2, -4)" while this family's params are the scalars x, y
 *     and axis — there is nothing to compare it against, and the assertion fails
 *     on every draw. `withFigure` already gives the QG-13 guarantee structurally:
 *     the picture is built from the same params the answer was folded from, so
 *     there is no second draw and no second source of truth. The note is
 *     recorded in `reflectPoint` too; it is repeated here because every figure
 *     this week ships is a coordinate grid.
 *
 *  4. EVERY DAY-ITEM GRID SHOWS THE GIVEN AND WITHHOLDS THE RESULT. A grid that
 *     plots the point answers "name this point" and "which quadrant is it in"
 *     outright, which is L33 in its sharpest form — the dangerous figure is the
 *     helpful one. So the reflection items show the starting point and both axes
 *     and never the image; the stencil shows eight corners and the lines between
 *     them, with the ninth corner and the two lines to it left off; and one
 *     guided example ships a completely BLANK four-quadrant grid, which leaks
 *     nothing at all and is still the scaffold the item needs, because a child
 *     cannot reason about a corner they cannot see the shape of. The grids that
 *     show a finished journey live in the lesson script and the modeled guided
 *     example, where the answer is already on the page.
 *
 *  5. THE STENCIL ITEM SHIPS TWO EXTRA PARAMS (`w`, `m`) BESIDE THE THREE
 *     `e_int_reflect_v1` READS. The answer is a reflection and is re-derived
 *     from {x, y, axis} exactly as the registry demands; the outline the picture
 *     draws cannot be rebuilt from those three alone, because a pair at height
 *     `m` could be either an eave or a neck of the design. One helper,
 *     `stencilOutline(w, m)`, is called by the draw AND by the figure builder,
 *     so the nine corners are computed once and the prompt, the picture and the
 *     key cannot disagree. The validator recomputes `answerFor(params)` and
 *     ignores keys the template does not read, so the extra pair is inert.
 *
 *  6. NEITHER DISCRIMINATION CERTIFIES. Both live on Days 2 and 3, where they
 *     are taught and practised; the mastery form carries none of them. A
 *     three-option page hands a guesser a third of a slot outright, and this
 *     week certifies only where the pair or the chain has to be produced. The
 *     form's six slots are three position items (name a pair from a walk;
 *     reflect through the origin; reflect across the x-axis) and three chains,
 *     and the three chains all key a number the prompt never prints.
 *
 * ---------------------------------------------------------------------------
 * Retrieval is backward-only into the four skills a four-quadrant reading
 * actually runs on: D22 naming a point from a right-and-up description — the
 * direct ancestor, one quadrant of it — and three from E6, which is where the
 * second half of every pair in this week came from. E6's opposite is the
 * reflection at zero on a LINE, which is what a reflection across an axis does
 * to one coordinate at a time; E6's absolute value is the distance from zero,
 * which is what a coordinate measures once its sign is set aside; and E6's gap
 * between two readings is the length of every segment this week draws along an
 * axis. Adjacent weeks share a generator family, so the retrieval slots are the
 * one place E6's frames are deliberately reused, and every authored frame in
 * this week is new (see the cross-week scan in the report).
 */

import { asWarmup, classify, plotChoice, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { canonicalSigned, formatPoint } from '../lib/compute';
import { article, countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { coordinateGrid } from '../lib/figures';
import {
  absoluteValue,
  distanceBetween,
  eaCoordinateSwap,
  namePointFromMoves,
  oppositeValue,
  quadrantSignTrap,
  reflectPoint,
} from '../lib/integers';
import type { Rng } from '../../rng';
import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const D22 = { level: 'D' as const, week: 22 };
const E6 = { level: 'E' as const, week: 6 };

type Params = Record<string, unknown>;

/** The four corners, named the way every textbook names them. */
const QUADRANT = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'] as const;
/** The reading that belongs to no corner at all — the family never draws one. */
const NO_QUADRANT = 'On an axis, so in no quadrant';

/** Which corner a pair of non-zero signs names. */
function quadrantOf(x: number, y: number): string {
  return QUADRANT[x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2];
}

/** A non-zero integer of magnitude `lo`…`hi`, negative on a fair coin. */
function signedMag(r: Rng, lo: number, hi: number): number {
  const mag = r.int(lo, hi);
  return r.int(0, 1) === 0 ? -mag : mag;
}

/**
 * A magnitude drawn from `lo`…`hi` that is never one of `avoid`.
 *
 * A bijection rather than a redraw loop (kit §E2.4): the shortened range maps
 * onto the full range with the forbidden values skipped in order, so every
 * admissible value stays equally likely and the draw consumes exactly one rng
 * step — which is what keeps every later item in the pack independent of this
 * one (L19).
 */
function magnitudeApartFrom(r: Rng, lo: number, hi: number, ...avoid: number[]): number {
  const banned = [...new Set(avoid.filter((v) => v >= lo && v <= hi))].sort((a, b) => a - b);
  let v = r.int(lo, hi - banned.length);
  for (const b of banned) if (v >= b) v += 1;
  return v;
}

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// `situations.ts` and `multistep.ts` carry no figure slot and lib/ is not this
// week's to edit, so the wrapper reads the finished draft's `generator.params` —
// the very numbers the answer was folded from. There is no second draw and
// therefore no second source of truth, which is what QG-13 audits. (Same shape
// as e01's and e06's, and as the wrapper the integer family uses internally.)
// ---------------------------------------------------------------------------

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params as Params) } : d;
  };
}

/**
 * redrawUntil — a rejection FILTER over a shared generator's own draw.
 *
 * Same shape as e06's `belowZero` and e21's `redrawUntil`: it re-runs the
 * generator's draw and keeps the first item satisfying the condition, so nothing
 * is fabricated and the accepted item is one the shared library itself produced.
 * Bounded, so a draw space that cannot satisfy the condition degrades to the
 * library's own behaviour rather than hanging. Used only where a MEASURED
 * property of a shared file would otherwise put a defect on the page.
 */
function redrawUntil(base: ItemGen, holds: (params: Params) => boolean, tries = 12): ItemGen {
  return (rng, guard, difficulty) => {
    let d = base(rng, guard, difficulty);
    for (let i = 0; i < tries && d.generator && !holds(d.generator.params as Params); i++) {
      d = base(rng, guard, difficulty);
    }
    return d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * D22 — name the pair for a point described as so far RIGHT and so far UP. It is
 * this week's own question with three of its four corners removed, which is
 * exactly what makes it the right warm-up: the rule the child brings ("across
 * before up") survives intact, and only the sign convention is new.
 *
 * SERVED THROUGH A REJECTION FILTER, because `plotChoice` interpolates its two
 * counts with a bare `${…}` — "Point P is 4 units right and 1 units up" — and a
 * count of one therefore prints a plural noun. Measured over 4,000 draws: 20.9%
 * of prompts carry "1 units" (x = 1 on 11.2%, y = 1 on 9.8%). It is a QG-12c
 * violation and it fails the 200-seed sweep of any week that serves the
 * generator, which is a lib/items.ts matter and is reported rather than patched
 * here. The filter re-runs the generator's OWN draw and keeps the first item
 * with both counts at 2 or more, so nothing is fabricated and the accepted item
 * is one the Level-D library itself produced.
 */
const wNamePointQ1 = asWarmup(
  redrawUntil(plotChoice(), (p) => Number(p.x) >= 2 && Number(p.y) >= 2),
  D22,
);
/**
 * E6 — the opposite of a reading: the same distance from zero, the other side.
 * A reflection across an axis is that move performed on ONE coordinate while the
 * other is left where it stood, so this is the week's central action met a week
 * early on a single line.
 */
const wOppositeAtZero = asWarmup(oppositeValue(), E6);
/**
 * E6 — absolute value: how far a reading lies from zero. A coordinate carries
 * that number and a side of the line, and every distance this week measures
 * along an axis is an absolute value with its sign set aside.
 */
const wStepsToZero = asWarmup(absoluteValue(), E6);
/**
 * E6 — the gap between two readings on one line, which is the length of every
 * segment this week draws between a point and its mirror image.
 */
const wGapAlongTheLine = asWarmup(distanceBetween(), E6);

// ---------------------------------------------------------------------------
// Single-step position work (the family's own E7 generators)
// ---------------------------------------------------------------------------

/** Translate a described walk into an ordered pair (the family's E7 plot item). */
const sitNamePoint = namePointFromMoves();
/**
 * The three reflections, each with its own hint ladder (which is what lets all
 * three be served without spending the week's whole ladder allowance on one
 * wording). Every one of them ships the GIVEN point on a grid and never the
 * image — see decision 4.
 */
const sitReflectX = reflectPoint('x');
const sitReflectY = reflectPoint('y');
const sitReflectO = reflectPoint('origin');

// ---------------------------------------------------------------------------
// Discrimination — the two questions a pair has to survive
// ---------------------------------------------------------------------------

/** PRODUCE the corner. The family's own, the recipe's own (see decision 1). */
const discrimQuadrant = quadrantSignTrap();

/**
 * DETECT whether there is a corner to name at all.
 *
 * Every quadrant generator in G5 draws both coordinates non-zero, so a child can
 * meet the whole family and never see the reading that belongs to no corner —
 * and `verifyQuadrant` throws on one rather than answering, which is correct and
 * also means the fact can never be taught by the family. This item teaches it,
 * and it is built so that no single option is a winning guess: one draw in three
 * puts the aircraft on an axis and keys the third option, while the other two
 * key a corner. Measured on the SERVED item rather than the draw (2,000 packs),
 * "always answer on-an-axis" scores 35.0% and "always take the first option"
 * 32.0% — neither better than the 33.3% a three-option page concedes to a coin,
 * and the four corner labels share the remaining 65% between them at 14-18%
 * each, so no quadrant is a house favourite either.
 *
 * On a corner draw the live distractor is the corner produced by reading the
 * second offset as a distance rather than a direction, which is the slip that
 * puts a southward aircraft above the beacon; the axis option carries the
 * over-applied rule, which is a real thing a child does the week after meeting
 * it. On an axis draw the two distractors are the two corners the ray runs
 * between, so a child who has decided the aircraft "must be somewhere" has both
 * plausible somewheres in front of them.
 */
const discrimAxisOrQuadrant = discrimination({
  variant: 'structural',
  cognitiveOp: 'int-region',
  draw: (r) => {
    const onAnAxis = r.int(1, 3) === 1;
    const east = signedMag(r, 2, 9);
    const north = signedMag(r, 2, 9);
    // Which of the two offsets is the live one when the aircraft sits on a ray.
    const alongEastWest = r.int(0, 1) === 0;
    const eastWord = east > 0 ? 'east' : 'west';
    const northWord = north > 0 ? 'north' : 'south';
    const opening =
      'An airfield radar screen puts the beacon at the origin, with east to the right of it and north at the top.';
    if (onAnAxis) {
      const where = alongEastWest
        ? `${countNoun(Math.abs(east), 'km')} ${eastWord} of the beacon, and neither north nor south of it`
        : `${countNoun(Math.abs(north), 'km')} ${northWord} of the beacon, and neither east nor west of it`;
      // The two corners the ray runs between: the sign that IS set is fixed and
      // the sign that is missing takes both values in turn. The rationales name
      // the two halves the ray divides, so they describe the option they are
      // attached to whichever axis the aircraft is sitting on.
      const pair = alongEastWest
        ? [quadrantOf(east, 1), quadrantOf(east, -1)]
        : [quadrantOf(1, north), quadrantOf(-1, north)];
      const [side, other] = alongEastWest ? ['above', 'below'] : ['east of', 'west of'];
      return {
        prompt: `${opening} One aircraft shows ${where}. Which of these describes where it is on the screen?`,
        correct: NO_QUADRANT,
        distractors: [
          {
            text: pair[0],
            errorTag: 'concept-misconception' as ErrorTag,
            rationale:
              `Supplies the offset the screen never gave from the corner the aircraft looks nearest to, so a reading that sits exactly on one of the two lines is pushed ${side} it.`,
          },
          {
            text: pair[1],
            errorTag: 'task-comprehension' as ErrorTag,
            rationale:
              `Takes "every point is somewhere" as far as "every point is in a corner", so the same reading is pushed ${other} that line instead of being left on it.`,
          },
        ],
        hints: [
          'What has to be true of BOTH offsets before a reading can name a corner at all?',
          'Read the east-west offset for the left-or-right half and the north-south offset for the top-or-bottom half, then check whether either of them is nothing.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    }
    return {
      prompt: `${opening} One aircraft shows ${countNoun(Math.abs(east), 'km')} ${eastWord} of the beacon and ${countNoun(Math.abs(north), 'km')} ${northWord} of it. Which of these describes where it is on the screen?`,
      correct: quadrantOf(east, north),
      distractors: [
        {
          text: quadrantOf(east, -north),
          errorTag: 'concept-misconception' as ErrorTag,
          // Direction-NEUTRAL on purpose. Naming one direction ("an aircraft
          // below the beacon...") describes the option it is attached to on only
          // half the draws, which is the defect this week reports upward in
          // `quadrantSignTrap`; it is not one to reproduce locally.
          rationale:
            'Uses the second offset as a size and drops the direction it was given in, so the aircraft is placed the same distance on the other side of the east-west line.',
        },
        {
          text: NO_QUADRANT,
          errorTag: 'task-comprehension' as ErrorTag,
          rationale:
            'Applies the no-quadrant rule to any reading given as offsets from the beacon, so a point standing clear of both lines is placed on one of them anyway.',
        },
      ],
      hints: [
        'What has to be true of BOTH offsets before a reading can name a corner at all?',
        'Read the east-west offset for the left-or-right half and the north-south offset for the top-or-bottom half, then check whether either of them is nothing.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: three chains, one per posing shape
// ---------------------------------------------------------------------------

/**
 * FORWARD — the recipe's headline, "plot then reflect", with the reflections
 * made to DO something. One corner post is logged; the other three are its
 * reflection across each path and its reflection through the flagpole, which is
 * every reflection the week teaches named in one sentence. The four posts are
 * the corners of a rectangle whose width is twice the logged post's distance
 * from one path and whose height is twice its distance from the other, so the
 * rope is 4(|x| + |y|).
 *
 * No leak by construction: the two distances are 2-9 and the rope is at least
 * 20 m, so the answer is larger than every number the prompt prints. The two
 * distances are drawn apart from each other, so the frame is never a square and
 * "the two numbers are the same" is never a shortcut past reading both.
 */
const msRopeFrame = multiStep({
  situationType: 'combine',
  cognitiveOp: 'int-reflect-frame',
  draw: (r) => {
    const across = r.int(2, 9);
    const up = magnitudeApartFrom(r, 2, 9, across);
    const x = r.int(0, 1) === 0 ? -across : across;
    const y = r.int(0, 1) === 0 ? -up : up;
    // Every article runs through `article()` and none of them opens a sentence,
    // so a vowel-sound noun cannot reach the page carrying the wrong one.
    const ground = r.pick(['showground', 'county show', 'craft fair', 'open-air fete']);
    return {
      prompt: `The plan of ${article(ground)} puts its flagpole at the origin, with east to the right and north at the top. One corner post is logged at ${formatPoint(x, y)}. The other three posts stand at that post's reflection across the east-west path, its reflection across the north-south path, and its reflection through the flagpole itself. The four posts are the corners of a rectangle, and a rope runs right round the outside of them. How many metres of rope does that run take?`,
      initN: across,
      steps: [
        { op: 'add', n: up, d: 1 },
        { op: 'mul', n: 4, d: 1 },
      ],
      units: 'm',
      hints: [
        'How far apart do a post and its mirror image stand, once you know how far the post itself lies from the mirror line?',
        'Build the rectangle\'s full width and full height from the reflections first, then take the rope once round the outside.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * INVERSE-START. The quantity the story hands over is the RESULT of the whole
 * chain: the ice is stated as an area, and nothing in the sentence order says
 * that the first move is a division. The stated distance to the northern edge is
 * only HALF the rink's height, which is the second thing the sentence does not
 * say, and it is the step the hint ladder orients on.
 *
 * No leak by construction: the answer is 2-9 and is drawn apart from the stated
 * northern distance, while the area is at least 24 — so the answer equals no
 * number the prompt prints, at any seed.
 *
 * Served only through the check-back wrapper: the honest check on a recovered
 * half-width is not "is the arithmetic right" but "does the rectangle I have
 * just described have the area the plan states".
 */
const msRinkCorner = multiStep({
  situationType: 'area',
  cognitiveOp: 'int-corner-from-area',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const north = r.int(2, 9);
    const east = magnitudeApartFrom(r, 2, 9, north);
    const area = 4 * east * north;
    const rink = r.pick(['ice rink', 'curling sheet', 'skating pad', 'training rink']);
    return {
      prompt: `The plan of ${article(rink)} puts its centre spot at the origin, with east to the right and north at the top. The ice is laid out as a rectangle centred on that spot and measures ${countNoun(area, 'square metres')}. Its northern edge runs ${countNoun(north, 'm')} north of the centre spot. Every corner is logged as an ordered pair read from the centre spot. How many metres east of the centre spot does the north-east corner lie?`,
      initN: area,
      steps: [
        { op: 'div', n: 4, d: 1 },
        { op: 'div', n: north, d: 1 },
      ],
      units: 'm',
      hints: [
        'Is the distance to the northern edge the whole height of the ice, or only part of it?',
        'Recover the full height of the ice first, use the area to reach its full width, and halve that to get back to one corner.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
// The wrapper's prose names "the ice", not "the rink": the surface noun is
// drawn, so a curling sheet and a skating pad both reach the page, and a check
// that called either of them a rink would be describing something the story
// never mentioned.
const msRinkCornerCheck = withCheckBack(
  msRinkCorner,
  'multiply the full width of the ice by its full height — does that rebuild the area the plan states?',
);

/**
 * HAS-DISTRACTOR. Four legs of a walk, three of them east or west and one north
 * or south, and only the east-west reading is asked for. The spare leg is the
 * seductive kind: it is measured in the same units, it stands in the same list,
 * and it is exactly the number a child who consumes every quantity will fold in.
 * Its POSITION in the walk is drawn, so "leave the second one out" is not a rule
 * that survives the week.
 *
 * THE WALK'S SHAPE IS A PARAMETER, because two habits can otherwise answer the
 * probe without any arithmetic at all. Drawn naively — three independent signs,
 * three independent magnitudes — the probe's own answer split is a perfect
 * 49.9/50.1, and the page is still free: "the side two of the three legs agree
 * on" was measured at 98.8% and "the side the LONGEST leg runs" at 89.0% over
 * 2,400 served items. That is b11's defect exactly (kit §E2.9a) — a balanced
 * answer distribution is not the same as an unguessable question — so the shape
 * is dealt from a pool instead:
 *  - `sweep`             all three legs run the same way (both habits right);
 *  - `pair-beats-bigger` two legs together beat one LONGER leg going the other
 *                        way, so counting the sides is right and the longest leg
 *                        is wrong;
 *  - `loner-beats-pair`  one leg beats the two others between them, so the
 *                        longest leg is right and counting the sides is wrong.
 * Dealt 1 : 2 : 2, which puts both habits at 60% — where b11's shipped pool sat
 * — while the correct rule stays "total each side and compare".
 *
 * The whole sign pattern is then flipped on a fair coin and the three legs are
 * shuffled, so the finishing side is a coin however the shape was built (b09's
 * repair: remove the mechanism rather than dodge it) and no leg position tells
 * anything. Each shape is CONSTRUCTED rather than rejected into, so the draw
 * consumes a fixed number of rng steps and no loop can fall off its own end.
 *
 * No leak by construction, per shape: a sweep's total exceeds every leg; a
 * pair-beats-bigger total is smaller than all three; and a loner-beats-pair
 * total is drawn clear of the two short legs and is smaller than the long one.
 * The spare north-south leg is drawn clear of the answer's magnitude too.
 *
 * Served only through the estimate-first wrapper: which side of the datum peg
 * the walk ends on is decidable before any arithmetic, and it is the one
 * commitment that stops a child drifting across the peg mid-calculation.
 */
const msSiteWalk = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'int-walk-axis',
  posing: 'has-distractor',
  draw: (r) => {
    const shape = r.pick([
      'sweep', 'pair-beats-bigger', 'pair-beats-bigger', 'loner-beats-pair', 'loner-beats-pair',
    ] as const);
    let mags: number[];
    let signs: number[];
    if (shape === 'sweep') {
      const a = r.int(2, 14);
      const b = magnitudeApartFrom(r, 2, 14, a);
      const c = magnitudeApartFrom(r, 2, 14, a, b);
      mags = [a, b, c];
      signs = [1, 1, 1];
    } else if (shape === 'pair-beats-bigger') {
      // The two legs of the pair start at 5, which does two things: it keeps the
      // window for the long leg non-empty, and it widens the window the TOTAL is
      // drawn from. Starting them at 3 put the answer on 2 or -2 on 23.0% of
      // served items (measured, 1,000), because the window is only as wide as
      // the shorter leg and a short pair leaves almost nowhere for it to land.
      const a = r.int(5, 14);
      const b = magnitudeApartFrom(r, 5, 14, a);
      const loner = r.int(Math.max(a, b) + 1, a + b - 2);
      mags = [a, b, loner];
      signs = [1, 1, -1];
    } else {
      const a = r.int(2, 6);
      const b = magnitudeApartFrom(r, 2, 6, a);
      // The total is drawn FIRST here and the long leg built from it, so the
      // answer can be held clear of both short legs without nudging it.
      const total = magnitudeApartFrom(r, 2, 12, a, b);
      mags = [a, b, a + b + total];
      signs = [-1, -1, 1];
    }
    const flip = r.int(0, 1) === 0 ? -1 : 1;
    const order = r.shuffle([0, 1, 2]);
    const legMag = order.map((i) => mags[i]);
    const legSign = order.map((i) => signs[i] * flip);
    const net = legSign[0] * legMag[0] + legSign[1] * legMag[1] + legSign[2] * legMag[2];
    const cross = magnitudeApartFrom(r, 2, 9, Math.abs(net));
    const crossSign = r.int(0, 1) === 0 ? -1 : 1;
    const at = r.int(0, 3);
    const legs: string[] = [];
    let k = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === at) {
        legs.push(`${countNoun(cross, 'm')} ${crossSign > 0 ? 'north' : 'south'}`);
      } else {
        legs.push(`${countNoun(legMag[k], 'm')} ${legSign[k] > 0 ? 'east' : 'west'}`);
        k += 1;
      }
    }
    const site = r.pick(['dig site', 'excavation', 'trench grid', 'quarry floor']);
    return {
      prompt: `The plan of ${article(site)} puts its datum peg at the origin, counting east and north as the positive directions. A recorder sets off from the peg and walks ${legs[0]}, then ${legs[1]}, then ${legs[2]}, then ${legs[3]}. Which x-coordinate does the recorder stop on?`,
      initN: legSign[0] * legMag[0],
      steps: [
        { op: legSign[1] > 0 ? 'add' : 'sub', n: legMag[1], d: 1 },
        { op: legSign[2] > 0 ? 'add' : 'sub', n: legMag[2], d: 1 },
      ],
      hints: [
        'Which of these four legs can move an east-west reading, and which one never can?',
        'Follow only the legs that run east or west, taking each one in the direction the plan gave it.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});
const msSiteWalkEstimate = withEstimateFirst(
  msSiteWalk,
  'will the walk end east of the datum peg or west of it?',
);

// ---------------------------------------------------------------------------
// Day 5 — the hidden picture, and the written strand
// ---------------------------------------------------------------------------

/**
 * The stencil's NINE corners, in the order the outline is cut.
 *
 * One helper, called by the DRAW and by the FIGURE BUILDER, so the corners the
 * prompt lists, the corners the picture plots and the corner the key names are
 * one computation rather than three (decision 5). The design is symmetric about
 * the y-axis by construction: index 0 sits on the axis and 1-8, 2-7, 3-6 and 4-5
 * are mirror pairs, which is what makes exactly one missing corner recoverable.
 *
 * NINE rather than seven, and this is the reason. A seven-corner outline holds
 * three mirror pairs, so they cannot be split evenly above and below the
 * horizontal axis — the first build put two pairs above and one below, and the
 * missing corner therefore landed in an upper quadrant on 64.7% of draws
 * (measured over 600). Four pairs split two and two, and the key spreads across
 * all four quadrants at roughly a quarter each.
 */
function stencilOutline(w: number, m: number): Array<{ x: number; y: number }> {
  const neck = w - 3;
  return [
    { x: 0, y: m + 5 },
    { x: w, y: m },
    { x: neck, y: m },
    { x: neck, y: -m - 2 },
    { x: w, y: -m - 4 },
    { x: -w, y: -m - 4 },
    { x: -neck, y: -m - 2 },
    { x: -neck, y: m },
    { x: -w, y: m },
  ];
}

/** The mirror index of corner `i` in that cycle (0 is its own mirror). */
const stencilMirror = (i: number): number => (i === 0 ? 0 : 9 - i);

/**
 * THE DAY-5 SIGNATURE — a hidden picture built from figure params.
 *
 * Eight corners are plotted on one grid and joined in cutting order; the ninth
 * is missing and neither of the two lines that would reach it is drawn, so the
 * picture shows the child a shape with a bite out of it. Exactly one plotted
 * corner is left without a partner across the fold, and the answer is that
 * corner's reflection — which is why the item is a reflection item wearing a
 * picture rather than a picture with a reflection bolted on.
 *
 * THE EIGHT CORNERS ARE LISTED ALONG THE CUT, from one lip of the gap round to
 * the other, and the direction of travel is a coin. Listing them from the peak
 * instead put the unpartnered corner at position 4 on 35.3% of draws (measured
 * over 600) because two different missing corners map to the same listed slot,
 * so "mirror the fourth pair" was worth twice what it should be. Walking the cut
 * makes the lone corner's position a permutation of one to eight — flat at an
 * eighth each — because the listing starts where the gap does.
 *
 * The answer pair is never printed: the missing corner's height is shared with
 * its own partner (that is what a reflection across the y-axis IS), but the pair
 * itself appears nowhere in the list, at any seed.
 */
const sitStencil = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'int-complete-symmetry',
    draw: (r) => {
      const w = r.int(5, 8);
      const m = r.int(2, 4);
      const missing = r.int(1, 8);
      const outline = stencilOutline(w, m);
      const partner = outline[stencilMirror(missing)];
      // The cut, walked from one lip of the gap round to the other.
      const walk = [1, 2, 3, 4, 5, 6, 7, 8].map((step) => outline[(missing + step) % 9]);
      const shown = r.int(0, 1) === 0 ? walk : [...walk].reverse();
      const listed = shown.map((p) => formatPoint(p.x, p.y)).join(', ');
      return {
        prompt: `A stencil is cut so that its outline is symmetric about the y-axis. Eight of its nine corners are marked on the grid and joined along the cut, in this order: ${listed}. The ninth corner is missing, and neither of the two lines that would reach it has been drawn. Which ordered pair names the missing corner?`,
        answerValue: `${canonicalSigned(-partner.x)}, ${canonicalSigned(partner.y)}`,
        templateId: 'e_int_reflect_v1',
        params: { x: partner.x, y: partner.y, axis: 'y', w, m },
        validation: 'ordered-list',
        acceptableForms: [formatPoint(-partner.x, partner.y)],
        hints: [
          'Which of the corners on the grid has no partner facing it across the fold line?',
          'Find the corner standing on its own, then step the same distance out on the other side of the y-axis, keeping its height exactly as it is.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const w = Number(p.w);
    const m = Number(p.m);
    const px = Number(p.x);
    const py = Number(p.y);
    const outline = stencilOutline(w, m);
    const missing = outline.findIndex((v) => v.x === -px && v.y === py);
    const points = outline
      .map((v, i) => ({ ...v, i }))
      .filter((v) => v.i !== missing)
      .map((v) => ({ x: v.x, y: v.y, label: formatPoint(v.x, v.y), style: 'point' as const }));
    // Every cutting-order edge EXCEPT the two that would touch the missing
    // corner — drawing either of them would place the answer on the page.
    const segments: Array<{ from: [number, number]; to: [number, number] }> = [];
    for (let i = 0; i < 9; i++) {
      const j = (i + 1) % 9;
      if (i === missing || j === missing) continue;
      segments.push({ from: [outline[i].x, outline[i].y], to: [outline[j].x, outline[j].y] });
    }
    return coordinateGrid(
      { xMin: -(w + 1), xMax: w + 1, yMin: -m - 5, yMax: m + 6, step: 1, points, segments },
      {
        alt: 'a four-quadrant grid carrying eight of the stencil\'s corners joined along the cut, with the ninth corner and the two lines to it left off',
      },
    );
  },
);

/**
 * The recipe's discrimination in WRITTEN form, on the exact pair the recipe
 * names. Fixed prose, because the demand is on the defence rather than on the
 * arithmetic — and because the two pairs have to be the same three marks on
 * paper for the classmate's claim to be worth answering, which no draw can
 * guarantee. It also carries the swap on a pair whose coordinates have opposite
 * signs, which is the half of the draw space `quadrantSignTrap` cannot reach
 * (decision 1).
 */
const defendTheSwap = reasoning({
  prompt:
    'A classmate says that (-3, 2) and (2, -3) have to name the same spot, on the grounds that they are built from the same three marks with the minus sign moved along. Name the quadrant each pair lies in. Then write a defence of your answer aimed at that classmate. Your defence has to say what the ORDER of a pair decides that the two numbers on their own do not.',
  value:
    '(-3, 2) lies in Quadrant II and (2, -3) lies in Quadrant IV — the first number of a pair is always measured along the horizontal axis and the second along the vertical one, so moving the minus sign moves the point into a different corner',
  acceptableForms: [
    'Quadrant II',
    'Quadrant IV',
    'the first number',
    'horizontal axis',
    'across before up',
    'x-coordinate',
  ],
  keywords: true,
  hints: [
    'What does the ORDER of a pair decide that its two numbers on their own do not?',
    'Walk each pair out from the origin — the first number sideways, the second up or down — and name the corner each walk finishes in.',
  ],
  errorTags: ['representation-misread', 'concept-misconception'],
});

/**
 * The claim that pins down what a reflection LEAVES ALONE. Everything else on
 * the page is about what a reflection changes, so the written claim takes the
 * other half: a mirror along the horizontal axis rewrites one coordinate and
 * never touches the other, so a point's distance from the vertical axis survives
 * it untouched — including for a point sitting on either axis, which is what
 * makes the verdict "never" rather than "nearly never".
 *
 * It keys `never`. Of the Level-E weeks already built, E1 and E13 key
 * `sometimes`, E21 keys `always` and E6 keys `never`, so no verdict is becoming
 * the safe bet, and a child who has learned that a hedged answer usually pays is
 * not rewarded for it here.
 */
const claimReflectionDistance = classify({
  prompt:
    'Always, sometimes, or never true: reflecting a point across the x-axis changes how far it lies from the y-axis. In one sentence, say which points you tested your verdict against.',
  correct: 'never',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale:
        'Reads a reflection as a move that rewrites everything about a point, because the pair it is written with does change — so both of its distances are taken to move with it.',
    },
    {
      text: 'sometimes',
      errorTag: 'task-comprehension',
      rationale:
        'Lets the corner decide, so a reflection that carries a point across into a different quadrant is credited with altering both of its distances rather than only its height.',
    },
  ],
  hints: [
    'Which of a point\'s two coordinates does a mirror running along the horizontal axis actually rewrite?',
    'Reflect one point from above the horizontal axis and one from below it, then hold each image against its own starting point and read off which measurement moved.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE07 = makeWeekBuilder({
  level: 'E',
  week: 7,
  conceptId: 'four-quadrant-plane',
  conceptName: 'Four-quadrant plane',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D22, E6],
  pedagogyContract: 'v2',
  conceptualAnchor: 'two number lines crossed at the origin, where a pair of signs names the corner',
  conceptFamily: 'operation',
  deepeningDelta:
    'D22 gave a point a position by two measurements, right and up, and every point it ever plotted lived in the one corner where both of those counts begin. E6 broke the other half of that restriction on a single line: past zero a reading carries a side as well as a size, and the minus sign names the side. E7 joins them. The two number lines are crossed at the origin so that each of a pair\'s two numbers is measured on its own signed line, which turns D22\'s single corner into four and makes the ORDER of a pair load-bearing for the first time: the same two numbers written the other way round now name a different place, and on three corners in four they name a different corner as well. Reflection enters as the move that carries a point across one of those lines, because it is E6\'s opposite applied to one coordinate while the other is left standing.',
  explanation: {
    hook:
      'Write down the numbers 3 and 2 and a minus sign, and you can build two completely different places with them. Nothing about the numbers tells you which one you meant. The order does, and so does which number the minus sign landed on.',
    whyBeforeHow:
      'A pair of coordinates is an instruction read in order, not a bag holding two numbers, because the two numbers are measured along two different lines and the pair says which is which. That is the whole reason the model this week reasons with is two number lines crossed at the origin, where a pair of signs names the corner: the horizontal line carries the first number, the vertical line carries the second, and each of them runs the way a number line has always run, from least on the left or the bottom to greatest on the right or the top. The origin is the one place both readings are zero, and it is where the two lines cut each other into four corners. Which corner a point falls in is settled by the two SIGNS and by nothing else — not by the sizes of the numbers, since a point nine steps left and one step up sits in exactly the same corner as one that is one step left and nine steps up. Sizes say how far out; signs say which corner; order says which number is which. And because a reflection across an axis flips the reading on one line and leaves the reading on the other exactly where it stood, it is E6\'s opposite performed on a single coordinate — which is why a reflected point keeps one of its two distances unchanged, always.',
    script: [
      {
        say: 'Two number lines, crossed where both of them read zero. That crossing point is the origin. To reach a point I read the pair in order: the first number tells me how far to travel along the horizontal line, and only then does the second number tell me how far to climb or drop. Across before up, every time. Here is four, then three — and notice that I never once had to decide which number was which, because the pair had already told me.',
        visual: 'The two axes crossing at the origin, with the across-then-up journey to one point drawn as two legs.',
        figure: coordinateGrid(
          {
            xMin: -7,
            xMax: 7,
            yMin: -7,
            yMax: 7,
            step: 1,
            points: [{ x: 4, y: 3, label: '(4, 3)', style: 'point' }],
            segments: [
              { from: [0, 0], to: [4, 0] },
              { from: [4, 0], to: [4, 3] },
            ],
          },
          { alt: 'a four-quadrant grid with a journey drawn four steps along the horizontal axis and then three steps up to a marked point' },
        ),
      },
      {
        say: 'Here is the pair the whole week turns on. Minus three, two. And two, minus three. Same three marks on the paper, and the minus sign has simply moved along one place. Plot them instead of reading them. The first one goes three steps left and two steps up, so it lands in the corner above and to the left. The second goes two steps right and three steps down, so it lands in the corner below and to the right. They are not near each other. They are not even in the same half of the grid.',
        visual: 'Both pairs plotted on one grid, in opposite corners, with the origin between them.',
        figure: coordinateGrid(
          {
            xMin: -6,
            xMax: 6,
            yMin: -6,
            yMax: 6,
            step: 1,
            points: [
              { x: -3, y: 2, label: '(-3, 2)', style: 'point' },
              { x: 2, y: -3, label: '(2, -3)', style: 'point' },
            ],
          },
          { alt: 'a four-quadrant grid carrying one point three steps left and two up, and another two steps right and three down' },
        ),
      },
      {
        say: 'A reflection is a fold. Fold the grid along the horizontal axis and a point drops to the same distance below it, keeping its sideways position exactly as it was. Fold along the vertical axis instead and the sideways position flips while the height stays put. Do both — which is the same as turning the grid half a turn about the origin — and the point lands in the opposite corner with both numbers carrying the other sign. One point, four places, and every one of them the same two distances from the two lines.',
        visual: 'One point with its three reflections, one in each corner, all the same distance out from both axes.',
        figure: coordinateGrid(
          {
            xMin: -7,
            xMax: 7,
            yMin: -7,
            yMax: 7,
            step: 1,
            points: [
              { x: 5, y: 3, label: '(5, 3)', style: 'point' },
              { x: 5, y: -3, label: '(5, -3)', style: 'open' },
              { x: -5, y: 3, label: '(-5, 3)', style: 'open' },
              { x: -5, y: -3, label: '(-5, -3)', style: 'open' },
            ],
          },
          { alt: 'a four-quadrant grid with one solid point and its three reflections drawn as open marks, one in each of the other corners' },
        ),
      },
      {
        say: 'One habit before any of the working. I estimate the CORNER first, and only the corner: I read the two signs off the story, say out loud which quarter of the grid the answer has to be in, and then I calculate. A walk that runs further west than it ever runs east finishes on the left of the origin, and that is settled before a single digit is touched. Then a working that comes back on the wrong side of the origin has not been unlucky — it has gone wrong somewhere, and the call I made at the start is what sends me back to look for it.',
        visual: 'A walk from a start point, running one way and then further back the other, ending on the far side of the vertical axis.',
        figure: coordinateGrid(
          {
            xMin: -8,
            xMax: 8,
            yMin: -6,
            yMax: 6,
            step: 1,
            points: [{ x: 3, y: 2, label: 'start', style: 'flag' }],
            segments: [
              { from: [3, 2], to: [3, -2] },
              { from: [3, -2], to: [-4, -2] },
            ],
          },
          { alt: 'a four-quadrant grid with a flagged starting point, one leg drawn downwards and a longer leg drawn leftwards across the vertical axis' },
        ),
      },
    ],
    summary:
      'A coordinate pair is read in order: the first number is measured along the horizontal axis, the second along the vertical one, and swapping them names a different place. The two axes cross at the origin and cut the plane into four quadrants, numbered anticlockwise from the corner where both readings are positive. Which quadrant a point lies in is decided by its two signs and never by the sizes of its numbers — and a point with a zero in it lies on an axis, which belongs to no quadrant at all. Reflecting across an axis flips the reading on that axis and leaves the other one exactly as it stood, so a point and its image always share one of their two distances; reflecting through the origin flips both.',
    vocabulary: [
      { term: 'coordinate plane', kidGloss: 'two number lines crossed at right angles, on which every point has exactly one ordered pair' },
      { term: 'origin', kidGloss: 'the point where the two axes cross and both readings are zero, written (0, 0)' },
      { term: 'ordered pair', kidGloss: 'two coordinates written in a fixed order: the horizontal reading first, the vertical reading second' },
      { term: 'quadrant', kidGloss: 'one of the four regions the axes cut the plane into, numbered I to IV anticlockwise from the corner where both readings are positive' },
      { term: 'reflection', kidGloss: 'the move that folds a point across an axis, flipping its reading on that axis and leaving the other reading untouched' },
    ],
  },
  guidedExamples: [
    {
      ...ge(7, 1, 'modeled', 'In which quadrant does the point (-6, 3) lie? Say how you decided.', [
        {
          teacherSay:
            'I am going to narrate my first move, because it is the one that decides everything after it. I can see a six and a three, and my instinct is to rank them by size and let the bigger of the two settle where the point goes. Sizes name no corner at all. So I am putting the sizes aside and reading the two signs, in the order they were written.',
        },
        {
          teacherSay:
            'The first number is negative, so this point sits to the left of the vertical axis. That already rules out half the grid. Which side of the horizontal axis does the second number put it on?',
          expected: 'above',
        },
        {
          childDo: 'Name the corner that lies to the left of the vertical axis and above the horizontal one.',
          expected: 'Quadrant II',
        },
      ], 'Quadrant II'),
      visual: 'The point plotted, with both axes drawn through the origin.',
      figure: coordinateGrid(
        {
          xMin: -8,
          xMax: 8,
          yMin: -8,
          yMax: 8,
          step: 1,
          points: [{ x: -6, y: 3, label: '(-6, 3)', style: 'point' }],
        },
        { alt: 'a four-quadrant grid with a single point marked six steps left of the vertical axis and three steps above the horizontal one' },
      ),
    },
    {
      ...ge(7, 2, 'completion', 'The point (5, -2) is reflected across the y-axis. Write the reflected point, and say which coordinate the mirror leaves alone.', [
        {
          teacherSay: 'Which coordinate can a mirror standing along the vertical axis leave completely untouched?',
          expected: 'the second one, the height',
        },
        {
          childDo: 'Fold the grid along the vertical axis and write the pair the mark lands on.',
          expected: '(-5, -2)',
        },
      ], '(-5, -2)'),
      visual: 'Only the point you were handed. The far side of the fold is deliberately blank.',
      figure: coordinateGrid(
        {
          xMin: -8,
          xMax: 8,
          yMin: -8,
          yMax: 8,
          step: 1,
          points: [{ x: 5, y: -2, label: '(5, -2)', style: 'point' }],
        },
        { alt: 'a four-quadrant grid with the given point marked and the far side of the vertical axis left bare' },
      ),
    },
    {
      ...ge(7, 3, 'prompted', 'A walker starts at the origin, goes 4 steps west, then 7 steps south. Write the ordered pair that names where they stop.', [
        {
          childDo: 'Write the sideways move first with the sign its direction gives it, then the up-and-down move with the sign its direction gives it.',
          expected: '(-4, -7)',
        },
      ], '(-4, -7)'),
      visual: 'An empty grid to walk it out on. Nothing is plotted for you.',
      figure: coordinateGrid(
        { xMin: -9, xMax: 9, yMin: -9, yMax: 9, step: 1 },
        { alt: 'an empty four-quadrant grid with both axes drawn through the origin and no points marked' },
      ),
    },
    {
      // Independent stage: the logged mark only. Deciding WHICH coordinate the
      // fold rewrites is the task here, so plotting the image would hand over
      // the very move the item exists to ask for (L33).
      ...ge(7, 4, 'independent', 'A marker is logged at (3, -6). A second marker stands at its reflection across the x-axis. How many units apart are the two markers? Solve cold.', [
        {
          childDo: 'Call which coordinate the fold rewrites before you count anything, then measure from the marker to its image.',
          expected: '12',
        },
      ], '12'),
      visual: 'The logged marker alone; nothing else on this grid has been drawn for you.',
      figure: coordinateGrid(
        {
          xMin: -9,
          xMax: 9,
          yMin: -9,
          yMax: 9,
          step: 1,
          points: [{ x: 3, y: -6, label: '(3, -6)', style: 'point' }],
        },
        { alt: 'a four-quadrant grid with the logged marker plotted below the horizontal axis and nothing drawn above it' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: one pair read three ways (named from a walk, folded
    // across the horizontal axis, folded across the vertical one). Single-step
    // throughout; no chain and no choice yet.
    [
      { gen: wNamePointQ1, diff: 2 },
      { gen: wOppositeAtZero, diff: 2 },
      { gen: wStepsToZero, diff: 2 },
      { gen: sitNamePoint, diff: 3 },
      { gen: sitReflectX, diff: 3 },
      { gen: sitReflectY, diff: 3 },
    ],
    // Day 2 — fluency + application: the quadrant discrimination and the
    // estimate-first walk enter, against the half-turn reflection and a second
    // naming item.
    [
      { gen: wGapAlongTheLine, diff: 2 },
      { gen: wNamePointQ1, diff: 2 },
      { gen: msSiteWalkEstimate, diff: 3 },
      { gen: discrimQuadrant, diff: 3 },
      { gen: sitReflectO, diff: 3 },
      { gen: sitNamePoint, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations sit either side of two chains of
    // different shapes, so nothing on the page announces which work is coming.
    [
      { gen: wOppositeAtZero, diff: 2 },
      { gen: discrimAxisOrQuadrant, diff: 3 },
      { gen: msRopeFrame, diff: 4 },
      { gen: msRinkCornerCheck, diff: 4 },
      { gen: discrimQuadrant, diff: 3 },
      { gen: sitReflectX, diff: 3 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus two
    // single-step reflections so a two-step reflex is never the winning read of
    // a page.
    [
      { gen: msRopeFrame, diff: 5 },
      { gen: msRinkCornerCheck, diff: 5 },
      { gen: msSiteWalkEstimate, diff: 4 },
      { gen: sitReflectO, diff: 4 },
      { gen: sitReflectY, diff: 4 },
    ],
    // Day 5 — the error-analysis on the week's named slip, the hidden picture,
    // the written defence of the recipe's own pair, and the claim that says what
    // a fold leaves alone (+ a ramped warm-up).
    [
      { gen: wStepsToZero, diff: 2 },
      { gen: eaCoordinateSwap(), diff: 4 },
      { gen: sitStencil, diff: 4 },
      { gen: defendTheSwap, diff: 3 },
      { gen: claimReflectionDistance, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: a pair of coordinates looks like two facts and behaves like one instruction, and that is where this week goes wrong for most children. Handed (2, -3), they plot it by taking the numbers in whichever order feels natural, or by letting the bigger one decide the corner. Neither is carelessness; both are rules that worked everywhere until now. Rather than correcting the plot, ask which of the two crossing lines each number is being measured along, and let the grid answer.',
  ],
  puzzle: (r) => {
    // The week's move run BACKWARDS. A day item hands over a point and asks
    // where its reflection lands; here the REFLECTION's corner is given and the
    // original has to be recovered from it, with two distances that fix the
    // sizes and settle nothing about the signs.
    const a = r.int(2, 9);
    const b = magnitudeApartFrom(r, 2, 9, a);
    const q = r.int(1, 4);
    // The reflection is (x, -y). Reading the corner it lands in backwards gives
    // the sign of x directly and the sign of y inverted.
    const x = (q === 1 || q === 4 ? 1 : -1) * a;
    const y = (q === 1 || q === 2 ? -1 : 1) * b;
    return {
      id: 'E7-PZ-01',
      title: 'Puzzle Grove: The Corner That Gives Itself Away',
      puzzleType: 'logic',
      prompt: `An orienteering control stands ${countNoun(a, 'm')} from the north-south line and ${countNoun(b, 'm')} from the east-west line, on a map whose two lines cross at the origin. Its reflection across the east-west line lies in ${QUADRANT[q - 1]}. Write the control's own ordered pair, first number first. Then say why the two distances on their own could never have settled it, however carefully they were measured.`,
      answer: {
        value: `${canonicalSigned(x)}, ${canonicalSigned(y)}`,
        acceptableForms: [
          `${canonicalSigned(x)}, ${canonicalSigned(y)}`,
          formatPoint(x, y),
          `${fmtInt(x)} and ${fmtInt(y)}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What does a reflection across the east-west line do to each of the two numbers in a pair?',
        'Undo the reflection on the corner you were told about, and the pair of signs the control has to carry falls straight out of it.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'int-point-from-clues' },
  sprint: {
    skill: 'Single-digit multiplication facts — the doubling a mirror pair asks for, and the four sides of a frame',
    sourceWeek: { level: 'D', week: 15 },
    itemCount: 20,
    scheduledDay: 2,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sitNamePoint, diff: 3 },
    { gen: msRopeFrame, diff: 4 },
    { gen: sitReflectO, diff: 3 },
    { gen: msRinkCornerCheck, diff: 4 },
    { gen: sitReflectX, diff: 3 },
    { gen: msSiteWalkEstimate, diff: 4 },
  ],
  isomorphNotes:
    'The two forms share a generator and a difficulty at every index and draw their operands off separate streams, so no surface on Form B has been met on Form A or on any daily page. The odd slots all ask for a POSITION, written as a pair: name the spot a described walk finishes on (01), turn a point half a turn about the origin (03), and fold a point across the horizontal axis (05). Because every one of those keys two signed numbers rather than one, a single guessed value cannot score any of them. The even slots all ask for a QUANTITY the prompt never prints: the rope round the rectangle one post makes with its three reflections (02); a corner\'s distance east, recovered from the area of the ice and the distance to its northern edge, with the rebuild named (04, inverse-start); and the east-west reading a four-leg walk finishes on, one of whose legs runs north or south and can play no part in it (06). Both discriminations were kept off the form on purpose. Three options concede a third of a slot before any reasoning starts, so certification here rests entirely on items where the pair or the chain has to be produced from nothing.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'pair-read-up-then-across',
      description:
        'Reads an ordered pair in whichever order feels natural — up then across, or the larger number first — so the two coordinates are measured along the wrong axes. The pair is not misread as a number; it is misread as a set, and the child sees no reason why order should matter when the same two numbers are present either way.',
      exampleWrongAnswer: 'a point 2 units right and 3 units down written as (-3, 2)',
      distractorRationale:
        'Offer the place the swapped reading genuinely lands in, which is what a child measuring the first number vertically actually produces.',
      reteachPointer:
        'explanation/script[1] (the same three marks, two places) beside script[0] (across before up, every time)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'size-decides-the-corner',
      description:
        'Settles which quadrant a point lies in by the sizes of its two numbers rather than by their signs, or reads a direction word as a size and drops the side it named — so a westward or southward offset is placed on the positive side of its axis.',
      exampleWrongAnswer: 'a point 8 km west and 3 km south of a beacon placed in the corner above and to the right',
      distractorRationale:
        'Offer the corner produced by keeping one offset\'s direction and discarding the other\'s, which is the reading a child who treats a direction as a magnitude writes down.',
      reteachPointer:
        'explanation/whyBeforeHow (sizes say how far out, signs say which corner) then guidedExamples/E7-GE-01',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'every-point-is-in-a-corner',
      description:
        'Treats a reading with a zero in it as belonging to a quadrant, because every point met so far has been in one — or over-corrects the week after, and puts a point with two genuine offsets on an axis it merely lies near. Both are the same rule applied one step past where it works.',
      exampleWrongAnswer: 'an aircraft 6 km west of a beacon and level with it reported as being in Quadrant II',
      distractorRationale:
        'Offer one of the two corners the ray runs between, which is exactly where a child who has decided the point must be somewhere will put it.',
      reteachPointer:
        'explanation/summary (a point with a zero in it lies on an axis, which belongs to no quadrant) then the Day-3 radar item',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'fold-applied-to-both',
      description:
        'Chooses the right fold and applies it to both coordinates instead of one, or to neither — reflecting across an axis and changing the sign of everything, or copying the point out unchanged. It also covers spending a quantity that was only ever scenery on a calculation nobody called for.',
      exampleWrongAnswer: '(4, -5) reflected across the x-axis written as (-4, 5)',
      distractorRationale:
        'Offer the result of folding through the origin where only one axis was named, which stays the right size in both coordinates and lands in the wrong corner.',
      reteachPointer:
        'explanation/script[2] (one fold rewrites one reading and leaves the other standing) then guidedExamples/E7-GE-02',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The four-quadrant coordinate plane — reading an ordered pair in order rather than as two loose numbers, naming the quadrant a point lies in from its two signs, recognising that a point with a zero in it lies on an axis and in no quadrant, reflecting points across each axis and through the origin, and following journeys whose east-west and north-south readings move independently.',
    improvingCandidates: [
      'naming the quadrant from the two signs before doing any measuring',
      'writing the horizontal reading first and the vertical reading second, every time',
      'saying which coordinate a fold rewrites and which one it leaves standing',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'keeping a pair in its order — the first number is always measured across, the second always up or down',
      },
      {
        errorTag: 'concept-misconception',
        text: 'letting the two signs name the corner, and treating the sizes as how far out rather than as which way',
      },
      {
        errorTag: 'task-comprehension',
        text: 'spotting the readings that sit on an axis, which belong to no quadrant at all',
      },
      {
        errorTag: 'procedure-slip',
        text: 'applying a fold to the single coordinate it rewrites, and stepping over any quantity that belongs to the setting rather than to the question',
      },
    ],
    homeFocus: {
      praiseLine:
        'You drew both axes before you plotted anything, and you checked which corner your answer had to be in before you worked out a single number.',
      questionForChild:
        'If I walk 5 steps west from the front door and then 2 steps north, and 5 steps north and then 2 steps west, do I end up in the same place — and how would you write each one down?',
      schoolSyncHook:
        'Some classes write a pair as (3, -4), some as x = 3 and y = -4, and a few number the quadrants clockwise. Send us whichever your child meets and their pages will use it.',
    },
    vocabularyForParent: [
      'ordered pair (two coordinates in a fixed order: across first, then up or down)',
      'quadrant (one of the four regions the two axes cut the plane into, decided by the pair\'s two signs)',
      'reflection (folding a point across an axis: one coordinate flips, the other stays exactly where it was)',
    ],
  },
});
