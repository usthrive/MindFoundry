/**
 * Level B · Week 4 — "Count on & count back" (conceptId: count-on-and-count-back).
 *
 * FILL-ARCHITECTURE §4 row B4: anchor "number-line hops"; multi-step "on 3 then
 * back 2"; error-analysis "hops the start number"; discrimination "on vs back
 * from story"; Day-5 signature "write the hop story". Catalog cell:
 * computational focus "+1/+2/+3 and −1/−2/−3 within 20 from any number";
 * non-computational focus "Number-line hop puzzles (mystery landing spot)".
 *
 * WHAT THIS WEEK IS FOR. Before this week a number was a thing to read, build or
 * rank. Here it becomes a PLACE, and the child learns to travel between places.
 * Two facts carry the whole week, and both are easy to say and easy to get wrong:
 *
 *   1. **the square you stand on is not a hop.** A hop is the move between two
 *      squares, so the first hop lands on the NEXT square along. A child who says
 *      the starting number as hop one arrives one square out, every time;
 *   2. **the words settle the way, and nothing else does.** Two squares sit either
 *      side of where you stand, and only the story says which of them the hops are
 *      heading for. Nothing about the numbers themselves can tell you.
 *
 * Fact 2 is the one B3 handed over on purpose. Its header records the boundary in
 * as many words: "no page here asks the child to decide a direction from the
 * words: every change in this week arrives". So every page here does ask, and the
 * story never signals the way with a single reliable keyword — three phrasings
 * send the counter up the track and three send it down, and one of them is a
 * direction word ("up", "down") rather than a movement word at all.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OWNERSHIP. This is week 4 of 24, and FOUR later weeks already retrieve this
 * skill by name, so what is settled here has to be genuinely taught here rather
 * than assumed (kit §E2.8).
 *
 * B4 OWNS (introduces AND assesses):
 *   · **counting on from any number within twenty, by one, two or three** — the
 *     `count_on_v1` template, which b05 (`wCountOn`), b06 (`wFrogHops`) and b12
 *     (`wCountOn`) each pull back out of B4 as a settled warm-up skill. It is
 *     taught here on the same registered template those three retrieve;
 *   · **counting back the same way** — b14 retrieves it as "hopping back along the
 *     number line, the plainest form of taking away" (`a_takeaway_v1`) and b18 as
 *     "one step back along the number path". Taught here on `a_takeaway_v1`, which
 *     is the transform b14 names;
 *   · **the direction decided FROM THE STORY** — B3's explicit handoff, and the
 *     week's discrimination. Both `discWhichWay` and `discBothMoves` exist for it;
 *   · **the off-by-one that lives in every count**: the starting square counted as
 *     the first hop. Held up for rejection in the Day-5 error analysis and offered
 *     as a distractor on the single-move choice;
 *   · **two hops in one story, each with its own direction** — the recipe's "on 3
 *     then back 2", and its harder sibling, two hops that do NOT turn round;
 *   · the words **hop**, **count on**, **count back**, **up/down the track** and
 *     **landing square**, all glossed in `explanation.vocabulary` before any item
 *     leans on them.
 *
 * B4 USES BUT DOES NOT TEACH (all in warm-up slots, which is where a settled
 * skill belongs):
 *   · **A6 — before and after on the number path.** One step either way, named.
 *     It is the atom a hop is made of, and it is the first warm-up;
 *   · **A23 — a teen number is ten and some more.** Every landing square in this
 *     week is under twenty and half of them are teens, so a child who cannot read
 *     fourteen as ten-and-four spends the hop on the reading. Second warm-up;
 *   · **B1 — reading and writing numbers on the hundred path.** Third warm-up.
 *   · **A15 — the count-on facts within ten.** The sprint, and only the sprint:
 *     it is this week's arithmetic at a size that is already fluent.
 *
 * B4 DELIBERATELY LEAVES TO A LATER WEEK THAT ALREADY OWNS IT:
 *   1. **B7 owns the missing addend** (6 + ▢ = 13, think-addition, the box as the
 *      unknown). So no page here leaves the HOP COUNT unknown. Every story states
 *      how many hops and which way; the only thing ever asked for is the square
 *      the counter reaches, or — in the puzzle — which of three stated journeys
 *      reaches a stated square. "How many hops was that?" is B7's question and it
 *      is not asked once.
 *   2. **B5 owns making ten to add** (8 + 5 via 8 + 2 + 3). Hops here are never
 *      split at ten and no page mentions filling a frame: a hop of three from
 *      eight is counted as three single steps that happen to pass ten, which is
 *      exactly the pre-bridge move B5 then replaces with a strategy.
 *   3. **B18 owns skip counting** (twos, fives and tens), whose anchor is also
 *      "hops on the line". The difference is the whole of both weeks: a B18 hop
 *      never changes size and there are many of them; a B4 hop is one, two or
 *      three squares, there are at most two of them, and the SIZES may differ.
 *      Nothing in this pack repeats a hop more than twice, and no page asks for a
 *      run or a pattern.
 *   4. **B9 owns story problems within 20** and **B15 owns comparison stories.**
 *      This week never asks how many more, never compares two counts and draws no
 *      comparison bar. `sitMeetOnOneSquare` states two journeys and asks which
 *      square they share — a place, never a difference.
 *   5. **B13/B14 own written two-digit addition and subtraction and the trade.**
 *      Every number on every page is under twenty-one and every move is counted
 *      out along a track, so no column, carry or trade can arise.
 *   6. **B3 owns comparing and the signs.** No `>`, `<` or `=` appears anywhere,
 *      no page asks which square is greater, and where two journeys are stated the
 *      question is where they MEET.
 *   7. **B6 owns the equal sign** and **B10/B11 own adding tens and crossing a
 *      ten by addition.** No equation is written down in this pack at all: every
 *      calculation is stated as moves the child makes in order.
 *
 * THE COMPLETE LIST OF SYMBOLS A CHILD MEETS IN THIS PACK: the digits. Nothing else.
 * No `+`, no `−`, no `>`, `<`, `=`, no `×`, no `÷` and no `n/d`. The B4 row grants
 * none of them; C6, C9 and C15 own the last three and B3/B6 own the comparison
 * signs. The two-hop chains do carry `{op:'add'}` / `{op:'sub'}` steps inside
 * `generator.params` — that is the op-chain library's only way to say "this many
 * squares, this way round", and it is what lets a chain's answer be folded by code
 * instead of typed. No child-facing string in this pack contains an operator. Spelled out
 * here because a symbol ban is not something a later reader should have to infer
 * from a row of a table.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠ VERIFY-LIBRARY LIMIT — THERE IS NONE, AND THAT WAS PROVED BEFORE ANY
 * REFRAMING WAS CONSIDERED (kit §E2.3, LEARNINGS L34/L36: seven weeks in a row
 * reached for the escape hatch and then C4 found the identity, so the order is
 * now prove-impossible FIRST).
 *
 * The recipe's misconception is "hops the start number", and the registry already
 * holds it under that exact name. `a_verify_countback_slip_v1` is documented in
 * `lib/earlynumber.ts` as `count-back-start  a − b + 1  (counting back starting ON
 * the start number)` — A17's puppet slip, generalised. Fed this week's own
 * operands it returns `{correct: a − b, wrong: a − b + 1}`: the true landing
 * square, and the square a child reaches when the square they set off from is
 * counted as hop one. Nothing is reframed, relocated or invented, and
 * `eaCountedTheStart` prints the numbers the slip actually says OUT LOUD (`a`,
 * `a − 1`, …), so what the page shows is the misconception performing itself and
 * not a result asserted about it. Both halves go back through QG-11.
 *
 * Three consequences worth recording, because they are what made the count-BACK
 * direction the right one to build the error analysis on:
 *   · the slip lands ONE SQUARE HIGH when the hops go back, and one square SHORT
 *     when they go on. Same slip, opposite sides. That asymmetry is what supplies
 *     this week's overshooting distractor (see the guessability note below), and
 *     it is why the count-back form is the one worth showing a child;
 *   · the count-ON twin of the same slip (`a + b − 1`) has no honest transform.
 *     `d_verify_binop_misconception_v1` varies the OPERATION over one operand
 *     pair, so producing `{correct: a + b, wrong: a + b − 1}` from it needs
 *     `x ∘ y = a + b` and `x ∘' y = a + b − 1`; over {+, −} that forces
 *     `y = 1/2`, and over the other op pairs there is generically no integer
 *     solution at all. `a_verify_count_slip_v1` in `slip:'skip-count'` mode
 *     returns the right NUMBER (`n − 1` for `n = a + b`) but names a different
 *     mechanism — an object never touched — so pinning to it would put a true
 *     value under a false name. It is therefore not used, and the count-on form
 *     of the slip appears only where it needs no `wrong` value: as a distractor
 *     on `discWhichWay`, computed from that item's own operands;
 *   · `d_verify_binop_v1` (correct-only) and `d_verify_ratchain_v1` (correct-only)
 *     pin the two discriminations, so both keyed options are RECOMPUTED from the
 *     item's own params rather than trusted (kit §F.1 / QG-11). A discrimination
 *     wants a correct-only transform: its wrong answers are its options, not a
 *     claim about a worked result.
 *
 * WHICH GATE AUDITS WHICH ANSWER, stated because one item's audit lives in an
 * unusual place. `sitHopOn` (`count_on_v1`), `sitHopBack` (`a_takeaway_v1`),
 * `sitMeetOnOneSquare` (`count_on_v1`) and both chains (`d_multistep_rat_v1`) are
 * re-derived by QG-5's arithmetic check. The two discriminations carry
 * correct-only verify templates, so their keyed option is re-derived by QG-11
 * instead. Nothing in the pack is left unaudited.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GUESSABILITY, MEASURED NOT ASSUMED (kit §E2.11 — and the commonest defect,
 * "every distractor undershoots", is a live danger in a week whose two named
 * errors are both off-by-a-little).
 *
 *   · **`discBothMoves` ROTATES WHICH PAIR OF WRONG FINISHES IT OFFERS, so the
 *     answer sits low, middle and high in turn.** Four wrong finishes exist, all
 *     named misconceptions: both moves sent up the track (`start + kOn + kBack`),
 *     both sent down (`start − kOn − kBack`), and the two ways of dropping a move
 *     rather than turning it round (`start + kOn`, `start − kBack`).
 *
 *     An earlier version of this item always offered the first pair, which brackets
 *     the true finish — and that was written up here as a virtue, since neither
 *     "pick the biggest" nor "pick the smallest" can score against a bracketed
 *     answer. Both halves of that were true and the conclusion was still wrong:
 *     bracketing on EVERY draw makes the answer the middle number every time, and
 *     "pick the middle" is exactly as free. It measured 100% of draws in a mastery
 *     slot. Rotating the pairing is the fix; measured over 300 seeds the keyed rank
 *     is 409 low / 405 middle / 386 high.
 *
 *     This is the item that also sits in mastery, deliberately: a certifying slot
 *     should be the one with no position to guess at.
 *   · **`discWhichWay` rotates its direction, so the extreme rotates with it.**
 *     Its two distractors are the week's two named errors — the other way along
 *     the track, and the starting square counted as hop one — and both of them
 *     fall on the same side of the answer, necessarily: on a hop ON they are both
 *     smaller, on a hop BACK they are both larger. The way is drawn 50/50, so the
 *     keyed option is the largest on about half its draws and the smallest on the
 *     other half, and on the back-hop half BOTH distractors overshoot. Measured
 *     over 400 seeds: 50% largest / 50% smallest on its Day-2 slot and 46% / 54%
 *     on its Day-3 slot, across seventeen different keyed squares. A child who
 *     always picks an extreme is at a coin flip, which is precisely the decision
 *     the item measures — and this item is never a mastery slot for exactly that
 *     reason (L42's blocking-versus-teaching distinction, applied at authoring
 *     time rather than argued with afterwards). Measured splits are in the report.
 *   · **NO DEAD OPTION anywhere.** Every option on both discriminations is a
 *     square number computed from that draw's own operands, and each of them is the
 *     key on a real share of draws. There is nothing here that gets offered every
 *     time and keyed none of the time, so `DECLARED_LURES` gains no entry.
 *   · **NO ORDINAL TELL.** Every option is a numeral, so there is no "second thing
 *     named" to key; `makeChoices` shuffles.
 *   · The one fixed answer in the pack is the ASN claim's "sometimes", which is a
 *     property of the claim rather than of a draw. It is a Day-5 teaching slot and
 *     it is not offered anywhere a child can be certified on it.
 *   · **AND THE SWEEP CANNOT SEE THE PUZZLE**, because a puzzle carries no options
 *     — the same coverage hole L41 records for probes. That hole had something in
 *     it: the first version of this puzzle could be solved with no arithmetic at
 *     all, by picking the starting square nearest the prize, and it was found by
 *     reading a generated page rather than by any gate. The rebuild puts one
 *     counter at each of the three distances from the prize, so nearest, middle and
 *     furthest each win about a third of the time (measured: 32% / 33% / 35% over
 *     400 seeds). Uniqueness was then re-checked by a parser that re-derives all
 *     three landings from the PROSE alone: 500 puzzles, 0 disagreements.
 *
 * THE PROBE, AND THE SPLIT IT WAS MEASURED AT. A metacognition probe carries no
 * answer key, so the answer-entropy sweep is structurally blind to it and the only
 * check available is a person reading the draw and asking what a child could
 * guess. b16 shipped one a guesser could win about seven times in ten
 * (LEARNINGS L41), so this one is built the way that finding says to build it:
 *
 *   · the probe is **"which hop is bigger, on or back?"** — six words, which is
 *     what the seven-word budget leaves once `lib/metacog.ts` has added its own
 *     lead-in (kit §E2.9);
 *   · it rides `msNetHops`, the chain whose two hops travel opposite ways, and its
 *     answer is even BY CONSTRUCTION: `onWins` is settled before any size is
 *     drawn, and the bigger of the two sizes then goes to whichever direction won
 *     it. Measured over 800 exposures the forward hop is the bigger one 48.9% of
 *     the time, so neither answer is worth guessing;
 *   · and it is worth asking at all because it decides something. A child who has
 *     answered it knows which side of the starting square the finish falls on, and
 *     still has to walk the track to find out where.
 *
 * `msNetHops` reaches the daily pages ONLY inside the wrapper. Serving it raw as
 * well would put the same hint ladder on the page twice over and burn two of the
 * three exposures the dedup allows on one idea (kit §E2.2). Mastery is the one
 * place it appears bare, because the dedup does not count mastery and because a
 * page that lends the child a habit cannot then measure whether they have it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THE PICTURES SHOW, AND WHAT THEY REFUSE TO (kit §F.7 / §E2.5, and L33's
 * test: the dangerous figure is the helpful one).
 *
 * THE ONE PICTURE THIS WEEK DRAWS is the track itself: squares 0 to 20 in a row,
 * with a dot on the square the story says the counter is standing on. That is the
 * anchor, and the decision behind it is the opposite of b18's for the same
 * primitive, so it is worth stating why. b18 switches its tick LABELS OFF, because
 * on a skip count a child could read the landing number off the ladder and never
 * take a hop. Here the labels are ON: this week's method IS walking the labelled
 * track a square at a time, so the numbers under the line are the manipulative,
 * not the answer. What the picture withholds is everything the item asks for:
 *   1. **no hop is ever drawn on an assessed item.** No arc, no arrow, no second
 *      mark, no flag on the finish. The picture states where the journey BEGINS —
 *      a quantity the prose hands over in its first sentence — and stops there.
 *      Every assessed figure asserts `param:start`, `param:a` or `param:first`,
 *      never `answer` (QG-13 re-derives the marked square from the figure's own
 *      params and compares);
 *   2. **the direction is never shown.** A drawn hop would answer the week's
 *      discrimination outright, so `discWhichWay`'s track carries the same
 *      single dot as every other page. The arithmetic is free either way; what is
 *      assessed is which way to walk, and the picture leaves that entirely alone;
 *   3. **finished journeys are drawn only where the answer is already printed** —
 *      the lesson script and the modeled guided example. There the three hops from
 *      twelve to fifteen are drawn as three separate arcs with a flag on fifteen,
 *      because watching one hop cross one square IS the teaching.
 *
 * FOUR THINGS ARE DELIBERATELY NOT DRAWN:
 *   · **`predictNetHops` has no picture.** The probe asks the child to commit to
 *     which hop is bigger BEFORE working, and a labelled track invites them to
 *     start walking instead of judging. A scaffold placed under the exact step
 *     being assessed removes the assessment (L33), and here the step is the
 *     commitment itself (L25: who does the cognitive work?).
 *   · **`discBothMoves` has no picture.** Its three options are the three ways two
 *     moves can be combined, and all three are reachable by walking the track with
 *     a fingertip — so the drawing would turn one discrimination into three
 *     computations, which is a different task with the same answer.
 *   · **the puzzle has no picture.** Marking three starting squares and the prize
 *     square on one track lets a child measure the gaps by eye and never work out
 *     a landing; the search, which is the puzzle, would become a lookup.
 *   · **nothing is ever marked, ringed, hatched or crossed out**, anywhere. The
 *     `numberLine` primitive's `hops` array is used in exactly two places in this
 *     file, both of them inside `explanation` / `guidedExamples`.
 *
 * ACCESSIBILITY, DISCLOSED. A track's accessible name says which square the
 * counter is on and nothing else ("a number track from 0 to 20 with a counter on
 * square 14"), which is exactly what a sighted child reads off the picture. Where
 * two journeys are stated, both starting squares are named in the same order the
 * prose names them. No alt text anywhere names a landing square or a direction.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE BAND'S OWN SETTINGS (FILL-ARCHITECTURE §1), each one checked rather than
 * assumed. The fifteen-word ceiling is held at 0.00% by the sweep, and the
 * sentence that nearly broke it is worth recording: with the longest of the six
 * move phrasings drawn twice, the two-hop chain ran to sixteen words in one
 * sentence, so both chains now state their second move in a sentence of its own.
 * The metacognition is the band's own intro shape: a judgement the child has to
 * land on before they are allowed to work. One sentence is what the error analysis
 * asks back. The timer is untimed against anyone but the child's own last go. And
 * there is no "he" or "she" anywhere in the pack, since every actor is drawn.
 *
 * THE FRAME, and the grep that settled it — run against the weeks directory at
 * the END of the build rather than the start, because siblings land while you
 * write (kit §E2.8). **`hopscotch` returns zero hits across all ninety authored
 * weeks.** That is why the track is a hopscotch track: the week is about hopping,
 * every six-year-old has stood on one, and no sibling can collide with it. What
 * MOVES here is a child, not an animal and not a token, which is the other half
 * of the same check — b06 has the frog, b14 the snail, b18 the grasshopper and
 * the paper number path, b05 the board-game piece, b12 a child on the number
 * path. "Chalk" is kept out as a noun, since b14 counts chalk sticks; this is
 * just "the hopscotch track". The only "counters" in the pack are the ten in the
 * A23 warm-up's frame, which is A23's own anchor.
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, numberLine } from '../lib/figures';
import { numberWords } from '../shared';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A6 = { level: 'A' as const, week: 6 };
const A15 = { level: 'A' as const, week: 15 };
const A17 = { level: 'A' as const, week: 17 };
const A23 = { level: 'A' as const, week: 23 };
const B1 = { level: 'B' as const, week: 1 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so no page has one child racing themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

// ---------------------------------------------------------------------------
// The track, and the words that send a counter along it
//
// Squares 0 to 20, the same track on every page, so a child who has walked it
// once knows where they are. Every landing stays inside it by construction: each
// draw's bounds are computed from the hop sizes rather than checked afterwards,
// so no page can send a counter off either end (kit §E2.4 — deterministic
// bounds, never a redraw loop).
// ---------------------------------------------------------------------------

const TRACK_MIN = 0;
const TRACK_MAX = 20;

/**
 * HOW A STORY SENDS THE COUNTER, in six phrasings.
 *
 * Three send it up the track and three send it down, and they are drawn so that no
 * single keyword decides the way: "on" and "forward" and "up" all mean the same
 * move, and "up the track" is a direction rather than a movement at all. That is
 * the reading B3 left to this week — a child who has learnt "the word 'back'
 * means take away" has learnt a lookup, not a decision.
 *
 * "towards the start" was drafted as a seventh phrasing and cut on reading: a
 * six-year-old can hear it as the start OF THE TRACK or as the square they started
 * on, and those point opposite ways on half of all draws (kit §E2.7 — a computable
 * answer is not the same as an askable question).
 */
const GOES_ON = [
  (k: number) => `hops on ${countNoun(k, 'squares')}`,
  (k: number) => `hops forward ${countNoun(k, 'squares')}`,
  (k: number) => `takes ${countNoun(k, 'hops')} up the track`,
] as const;
const GOES_BACK = [
  (k: number) => `hops back ${countNoun(k, 'squares')}`,
  (k: number) => `steps back ${countNoun(k, 'squares')}`,
  (k: number) => `takes ${countNoun(k, 'hops')} down the track`,
] as const;

/** One drawn move phrase. Takes exactly one rng draw on either branch. */
const move = (r: Rng, goesOn: boolean, k: number): string =>
  r.pick(goesOn ? GOES_ON : GOES_BACK)(k);

/** What a sighted child reads off the track: where the counter stands, only. */
const trackAlt = (squares: readonly number[]): string =>
  squares.length > 1
    ? `a number track from 0 to 20 with a counter on square ${fmtInt(squares[0])} and another on square ${fmtInt(squares[1])}`
    : `a number track from 0 to 20 with a counter on square ${fmtInt(squares[0])}`;

/**
 * The track with the journey's starting square (or squares) dotted, and NOTHING
 * else: no hop, no arrow, no second mark past the start, no flag on the finish.
 * The tick labels stay ON — walking the labelled track is this week's method, so
 * the numbers under the line are the manipulative and not the answer.
 */
const trackAt = (squares: readonly number[], asserts?: BBFigure['asserts']): BBFigure =>
  numberLine(
    {
      min: TRACK_MIN,
      max: TRACK_MAX,
      step: 1,
      labels: 'all',
      marks: squares.map((n) => ({ at: n, label: fmtInt(n), style: 'point' as const })),
    },
    { alt: trackAlt(squares), ...(asserts ? { asserts } : {}) },
  );

/**
 * A FINISHED JOURNEY, drawn one hop at a time — the lesson script and the modeled
 * guided example ONLY. Every arc is one square wide, because a hop is the move
 * between two neighbours and drawing it as one long jump would hide the very
 * thing being taught. Legitimate here and nowhere else: on both surfaces the
 * answer is already printed on the page (kit §E2.5).
 */
const trackWalk = (from: number, to: number, asserts?: BBFigure['asserts']): BBFigure => {
  const stepDir = to > from ? 1 : -1;
  const stops = Array.from({ length: Math.abs(to - from) }, (_, i) => from + stepDir * (i + 1));
  return numberLine(
    {
      min: TRACK_MIN,
      max: TRACK_MAX,
      step: 1,
      labels: 'all',
      marks: [{ at: to, label: fmtInt(to), style: 'flag' as const }],
      hops: stops.map((stop, i) => ({ from: i === 0 ? from : stops[i - 1], to: stop })),
    },
    {
      alt: `a number track from 0 to 20 with ${countNoun(stops.length, 'single hops')} drawn from square ${fmtInt(from)}, ending with a flag on square ${fmtInt(to)}`,
      ...(asserts ? { asserts } : {}),
    },
  );
};

// ---------------------------------------------------------------------------
// Two after-the-fact wrappers: one hangs the track on an item, one hands a
// choice item the spec QG-11 audits it against
//
// Neither exists by choice. `lib/` is off limits to a week and no shipped
// primitive has a figure slot or accepts a generator spec, so a week that wants
// either has to add it to the finished draft. Two properties make that safe, and
// both are checked here rather than hoped for: no wrapper takes an rng draw, and
// no wrapper touches `prompt`. So the surface the guard registered for QG-1/QG-4
// is still the surface that ships.
//
// `withTrack` builds its picture out of `generator.params` and nothing else,
// which is what stops it lying: the only numbers it can draw with are the numbers
// the answer came from.
//
// `withClaimSpec` handles what `withTrack` cannot. A `discrimination()` draft
// arrives with no `generator` at all — no params to draw from, and no truth for
// QG-11 to re-derive — so the draw posts its operands into one mutable slot and
// this reads them back on the next line. Reading them THERE is the safety
// property: `drawUniqueItem` may run the draw repeatedly, and the slot always
// holds whichever run produced the draft that came back. (b03 hit the same wall
// and built the same mechanism; the idea is its, the wording below is mine.)
// ---------------------------------------------------------------------------

function withTrack(base: ItemGen, squaresOf: (params: Params) => number[], asserts: BBFigure['asserts']): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.generator) return draft;
    return { ...draft, figure: trackAt(squaresOf(draft.generator.params), asserts) };
  };
}

interface ClaimSpec {
  params: Params;
  seed: number;
}

const claimSlot = (): { posted: ClaimSpec | null } => ({ posted: null });

/** Give a choice item the generator spec QG-11 recomputes its keyed option from. */
function withClaimSpec(slot: { posted: ClaimSpec | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const spec = slot.posted;
    if (!spec) throw new Error('b04/withClaimSpec: the draw posted no params to pin the keyed option on');
    return { ...draft, generator: { templateId, params: spec.params, seed: spec.seed } };
  };
}

// ---------------------------------------------------------------------------
// Three warm-up formats, each a part this week is built out of
//
// Not a revision of last week: every one of these is machinery the daily pages
// then run on. A6 supplies the single step, which is what a hop IS. A23 supplies
// the teen structure, so a landing on fourteen is read rather than decoded. B1
// supplies the numeral behind the word, because most squares on this track have
// two digits and a child still assembling "seventeen" has nothing left over for
// the journey. All three sources are strictly earlier weeks (QG-2), and warm-ups
// sit outside the pedagogy gates by design.
// ---------------------------------------------------------------------------

/** A6 — the neighbour on the path, one step either way. */
const wNeighbourStep = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'neighbour',
    draw: (r) => {
      const n = r.int(3, 9);
      const after = r.chance(0.5);
      return {
        prompt: `A number path runs from 1 to 10. Which number comes just ${after ? 'after' : 'before'} ${fmtInt(n)}?`,
        answerValue: String(after ? n + 1 : n - 1),
        templateId: 'a_neighbour_v1',
        params: { n, kind: after ? 'after' : 'before' },
        hints: [
          'Which way along the path does that word point?',
          'Neighbours on a path sit just one step apart.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  }),
  A6,
);

/** A23 — a teen number is a full ten and some more. */
const wTenAndSome = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'teen-ten-and',
    draw: (r) => {
      const o = r.int(1, 9);
      const name = one(r);
      return {
        prompt: `A full frame holds 10 counters. ${name} puts ${countNoun(o, 'loose counters')} beside it. How many counters is that?`,
        answerValue: String(10 + o),
        templateId: 'a_teen_ten_and_v1',
        params: { o },
        units: 'counters',
        hints: [
          'Does a full frame have to be counted, or is it already known?',
          'A filled frame is worth its ten. The loose ones go on after it.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  A23,
);

/**
 * B1 — a number read from its words and written as a numeral.
 *
 * TWO GENERATORS OVER DISJOINT RANGES, and that is a bug fix rather than a
 * flourish. The prompt names its number in WORDS, so the prompt holds no numeric
 * token, so `drawUniqueItem` has no signature to guard and the same card can be
 * drawn twice in one pack — which is exactly what happened: one seed served
 * "reads forty-five" on Day 1 and again, identically, on Day 5. QG-1 cannot see
 * it (it only compares items carrying two tokens or more) and it reads to a
 * teacher as a copy-paste slip. Splitting the range makes the repeat impossible
 * at every seed, and it ramps: the later card is the bigger number.
 */
const wordCardIn = (lo: number, hi: number) => asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'read-number-words',
    draw: (r) => {
      const n = r.int(lo, hi);
      return {
        prompt: `A card on the hundred path reads ${numberWords(n)}. Write it as a number.`,
        answerValue: String(n),
        templateId: 'read_write_words_v1',
        params: { n },
        hints: [
          'How does the word sound when you say it slowly?',
          'Two digits go on the card. The word names them both, in order.',
        ],
        errorTags: ['representation-misread', 'fact-recall'],
      };
    },
  }),
  B1,
);

const wWordOnACard = wordCardIn(21, 49);
const wWordLaterCard = wordCardIn(50, 79);

// ---------------------------------------------------------------------------
// The two named skills — counting on, and counting back
//
// These are the forms four later weeks retrieve, so they are taught on the same
// registered templates those weeks name: `count_on_v1` (b05, b06, b12) and
// `a_takeaway_v1` (b14). Both carry the track with the starting square dotted,
// which is the quantity the prose hands over in its first sentence.
//
// Bounds: a hop is one, two or three squares (the catalog cell's own +1/+2/+3),
// and each start is bounded by the hop so the landing stays on the track. Nothing
// crosses twenty and nothing falls off the bottom.
// ---------------------------------------------------------------------------

const sitHopOn = withTrack(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-on',
    draw: (r) => {
      const hop = r.int(1, 3);
      const start = r.int(5, TRACK_MAX - 3);
      const name = one(r);
      return {
        prompt: `${name} stands on square ${fmtInt(start)} of the hopscotch track. ${name} ${move(r, true, hop)}. Which square does ${name} reach?`,
        answerValue: String(start + hop),
        templateId: 'count_on_v1',
        params: { start, hop },
        hints: [
          'Which square is the hop leaving from?',
          'The very first hop lands on the next square along.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  }),
  (p) => [numOf(p, 'start')],
  assertsParam('start', 'mark:0'),
);

const sitHopBack = withTrack(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-back',
    draw: (r) => {
      const b = r.int(1, 3);
      const a = r.int(6, TRACK_MAX);
      const name = one(r);
      return {
        prompt: `${name} stands on square ${fmtInt(a)} of the hopscotch track. ${name} ${move(r, false, b)}. Which square is ${name} standing on now?`,
        answerValue: String(a - b),
        templateId: 'a_takeaway_v1',
        params: { a, b },
        hints: [
          'Which end of the track is this hop heading for?',
          'Say each square out loud as you pass it. Stop when the hops run out.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  }),
  (p) => [numOf(p, 'a')],
  assertsParam('a', 'mark:0'),
);

/**
 * TWO JOURNEYS, ONE SQUARE — the week's own reason for caring which way a hop
 * goes: a square can be reached from either side of it.
 *
 * Built backwards from the meeting square, so exactly one square satisfies both
 * journeys and the degenerate case kit §E2.7 warns about cannot arise. The two
 * starting squares can never coincide either: one is above the meeting square and
 * one below it, by construction.
 *
 * It asks for a PLACE, never a difference — B15 owns "how many more" and no
 * comparison is drawn or asked for here.
 */
const sitMeetOnOneSquare = withTrack(
  situation({
    situationType: 'combine',
    cognitiveOp: 'meet-on-one-square',
    draw: (r) => {
      const land = r.int(6, 14);
      const back = r.int(1, 3);
      const fwd = r.int(1, 3);
      const [n1, n2] = two(r);
      const backNamedFirst = r.chance(0.5);
      const fromAbove = land + back;
      const fromBelow = land - fwd;
      const first = backNamedFirst
        ? { name: n1, square: fromAbove, goesOn: false, k: back }
        : { name: n1, square: fromBelow, goesOn: true, k: fwd };
      const second = backNamedFirst
        ? { name: n2, square: fromBelow, goesOn: true, k: fwd }
        : { name: n2, square: fromAbove, goesOn: false, k: back };
      return {
        prompt: `${first.name} starts on square ${fmtInt(first.square)} and ${move(r, first.goesOn, first.k)}. ${second.name} starts on square ${fmtInt(second.square)} and ${move(r, second.goesOn, second.k)}. Which square do ${first.name} and ${second.name} both reach?`,
        answerValue: String(land),
        templateId: 'count_on_v1',
        // `start`/`hop` are the upward journey, which is what `count_on_v1`
        // re-derives; `first` records which square the prose names first, so the
        // picture can dot them in the order they are read.
        params: { start: fromBelow, hop: fwd, other: fromAbove, first: first.square, second: second.square },
        hints: [
          'How many separate journeys does this page describe?',
          'Finish one journey, then the other. Then look for the square they share.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => [numOf(p, 'first'), numOf(p, 'second')],
  assertsParam('first', 'mark:0'),
);

// ---------------------------------------------------------------------------
// THE RECIPE'S DISCRIMINATION — on vs back, decided from the story
//
// B3's handoff, made into a page. The story states a square and a move; the three
// options are the true landing square and the week's two named errors, both
// computed from this draw's own operands:
//   · the square reached by walking the OTHER way — the direction misread;
//   · the square reached when the starting square is counted as hop one — the
//     off-by-one, which lands short on a hop ON and long on a hop BACK.
// The truth is recomputed by `d_verify_binop_v1` from `{a, b, op}`, where `op` is
// the way the STORY sends the counter, so a keyed square that does not follow
// from the story is structurally impossible.
//
// It carries the track with the starting square dotted and no hop drawn. The
// arithmetic is a fingertip walk either way; what is assessed is which way to
// walk, and the picture leaves that alone entirely.
//
// NEVER A MASTERY SLOT. Its two distractors necessarily fall on the same side of
// the answer, so the keyed option is an extreme on every draw and a child guessing
// the extreme is at a coin flip. That is honest for a teaching page — the coin
// flip is the decision itself — and it is not honest for a page that certifies.
// ---------------------------------------------------------------------------

const wayClaim = claimSlot();

const discWhichWay = withTrack(
  withClaimSpec(
    wayClaim,
    'd_verify_binop_v1',
    discrimination({
      variant: 'structural',
      cognitiveOp: 'choose-the-way',
      draw: (r) => {
        const goesOn = r.chance(0.5);
        // TWO OR THREE, NEVER ONE, and reading a generated page is what settled
        // it: at a hop of one the start-counted option lands ON the starting
        // square, which the prompt has already printed. A child could then strike
        // that option out on sight, without reading the direction the item exists
        // to test. At two or three it is a square the prompt never names. The
        // single-square hop the catalog cell also grants is carried by the plain
        // count-on and count-back pages, where there is nothing to eliminate.
        const hop = r.int(2, 3);
        const start = r.int(6, 16);
        const name = one(r);
        const landing = goesOn ? start + hop : start - hop;
        const otherWay = goesOn ? start - hop : start + hop;
        // One hop short of the landing, on whichever side the journey travels.
        const startCounted = goesOn ? landing - 1 : landing + 1;
        wayClaim.posted = { params: { a: start, b: hop, op: goesOn ? '+' : '-' }, seed: r.uint() };
        return {
          prompt: `${name} is on square ${fmtInt(start)} of the hopscotch track. ${name} ${move(r, goesOn, hop)}. Which square is the landing square?`,
          correct: String(landing),
          distractors: [
            {
              text: String(otherWay),
              errorTag: 'task-comprehension' as const,
              rationale: 'Sets off towards the wrong end of the track, so the hops are counted the other way along it.',
            },
            {
              text: String(startCounted),
              errorTag: 'procedure-slip' as const,
              rationale: 'Counts the square the counter is standing on as the first hop, so one hop fewer is ever taken.',
            },
          ],
          hints: [
            'Which words in the story tell you which way to go?',
            'Settle the way first. Count the squares only after that.',
          ],
          errorTags: ['task-comprehension', 'procedure-slip'],
        };
      },
    }),
  ),
  (p) => [numOf(p, 'a')],
  assertsParam('a', 'mark:0'),
);

// ---------------------------------------------------------------------------
// TWO MOVES, TWO DECISIONS — and the item that brackets its own answer
//
// The story makes two hops in opposite directions, and the two distractors are
// the two ways of not noticing the turn: both moves sent up the track, and both
// sent down. The true finish sits STRICTLY BETWEEN them on every draw, for any
// positive pair of hop sizes — so one option overshoots and one undershoots every
// single time, and there is no extreme to guess at. That is why this is the
// discrimination that also sits in mastery (kit §E2.11).
//
// The two hop sizes are drawn DIFFERENT, so the moves can never cancel and leave
// the counter where it began — a story in which nothing happens teaches nothing,
// and a child who met one would learn that the answer is the starting square.
//
// The truth is recomputed by `d_verify_ratchain_v1`, which folds the item's own
// two-step chain. NO PICTURE: all three options are reachable by walking the
// track with a fingertip, so a drawing would replace one discrimination with
// three computations.
// ---------------------------------------------------------------------------

const bothMovesClaim = claimSlot();

const discBothMoves = withClaimSpec(
  bothMovesClaim,
  'd_verify_ratchain_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'combine-two-ways',
    draw: (r) => {
      const onFirst = r.chance(0.5);
      const kBig = r.int(2, 3);
      const kSmall = r.int(1, kBig - 1);
      const onWins = r.chance(0.5);
      const kOn = onWins ? kBig : kSmall;
      const kBack = onWins ? kSmall : kBig;
      const start = r.int(7, 14);
      const name = one(r);
      const finish = start + kOn - kBack;
      const bothOn = start + kOn + kBack;
      const bothBack = start - kOn - kBack;
      // WHICH PAIR OF WRONG FINISHES IS OFFERED NOW ROTATES.
      //
      // The pair used to be {bothOn, bothBack} on every draw, which brackets the
      // answer — so neither "pick the biggest" nor "pick the smallest" worked, and
      // that is how it was designed and documented. But bracketing on EVERY draw
      // makes the answer the middle number every time, and "pick the middle" is
      // just as free. Measured at 100% of draws in a MASTERY slot.
      //
      // The two extra wrong finishes are the two ways of dropping a move rather
      // than turning it round, so all four are named misconceptions and any pair
      // is honest. Rotating the pairing puts the answer at the bottom, the middle
      // and the top of the option list in turn.
      const onlyOn = start + kOn;        // ignored the move back
      const onlyBack = start - kBack;    // ignored the move on
      const pairing = r.int(1, 3);       // 1 straddle · 2 both above · 3 both below
      const [wrongA, wrongB] = pairing === 1 ? [bothOn, bothBack]
        : pairing === 2 ? [onlyOn, bothOn]
        : [onlyBack, bothBack];
      const WHY: Record<number, string> = {
        [bothOn]: 'Treats the second move as another move up the track, so the squares it gives back are kept.',
        [bothBack]: 'Reads both moves as moves down the track, so the journey never travels up it at all.',
        [onlyOn]: 'Counts the move up the track and stops, so the move back is never taken.',
        [onlyBack]: 'Counts the move down the track and stops, so the move up it is never taken.',
      };
      const TAG: Record<number, 'concept-misconception' | 'task-comprehension'> = {
        [bothOn]: 'concept-misconception',
        [bothBack]: 'task-comprehension',
        [onlyOn]: 'task-comprehension',
        [onlyBack]: 'task-comprehension',
      };
      const steps = onFirst
        ? [{ op: 'add' as const, n: kOn, d: 1 }, { op: 'sub' as const, n: kBack, d: 1 }]
        : [{ op: 'sub' as const, n: kBack, d: 1 }, { op: 'add' as const, n: kOn, d: 1 }];
      bothMovesClaim.posted = { params: { initN: start, initD: 1, steps }, seed: r.uint() };
      return {
        prompt: `${name} is on square ${fmtInt(start)} of the hopscotch track. ${name} ${move(r, onFirst, onFirst ? kOn : kBack)}. Then ${name} ${move(r, !onFirst, onFirst ? kBack : kOn)}. Which square does ${name} finish on?`,
        correct: String(finish),
        distractors: [wrongA, wrongB].map((v) => ({
          text: String(v),
          errorTag: TAG[v],
          rationale: WHY[v],
        })),
        hints: [
          'Do the two moves go the same way, or opposite ways?',
          'Take one move at a time, in the order the story gives.',
        ],
        // Read off the pair actually offered rather than listed as the union of
        // every pairing: on the both-below draw neither distractor is a
        // concept-misconception, and an item that reports a tag it did not serve
        // feeds the wrong reteach to the child who missed it.
        errorTags: [...new Set([TAG[wrongA], TAG[wrongB]])],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// The chains — the §4 row's "on 3 then back 2", and the one that never turns
//
// `msNetHops` is the recipe's own chain and it carries the week's metacognition:
// the two hops go opposite ways, so before any counting there is a real judgement
// to make about which of them is bigger. `onWins` is drawn FIRST and the bigger
// size handed to whichever way won, so the probe's answer is a coin flip by
// construction and not by luck (LEARNINGS L41).
//
// `msSameWayTwice` exists because a week whose every chain turns round teaches
// alternation rather than reading. Both its moves go the SAME way, drawn fresh,
// so "the second move must undo the first" is wrong on half of all draws.
//
// Bounds keep every square on the track without a redraw: the sum of the two hops
// is at most six, and each start is drawn inside a window that leaves room for it
// in either direction.
// ---------------------------------------------------------------------------

const msNetHops = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'hop-then-turn',
  draw: (r) => {
    const onFirst = r.chance(0.5);
    const kBig = r.int(2, 3);
    const kSmall = r.int(1, kBig - 1);
    const onWins = r.chance(0.5);
    const kOn = onWins ? kBig : kSmall;
    const kBack = onWins ? kSmall : kBig;
    const start = r.int(7, 15);
    const name = one(r);
    const firstMove = move(r, onFirst, onFirst ? kOn : kBack);
    const secondMove = move(r, !onFirst, onFirst ? kBack : kOn);
    return {
      prompt: `${name} is on square ${fmtInt(start)} of the hopscotch track. ${name} ${firstMove}. Then ${name} turns and ${secondMove}. Which square is ${name} on at the end?`,
      initN: start,
      steps: onFirst
        ? [{ op: 'add', n: kOn, d: 1 }, { op: 'sub', n: kBack, d: 1 }]
        : [{ op: 'sub', n: kBack, d: 1 }, { op: 'add', n: kOn, d: 1 }],
      hints: [
        'Which of the two moves covers more squares?',
        'Make the first move and pause there. Then make the second.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const predictNetHops = withEstimateFirst(msNetHops, 'which hop is bigger, on or back?');

const msSameWayTwice = withTrack(
  multiStep({
    situationType: 'rate-of-change',
    cognitiveOp: 'hop-twice-one-way',
    draw: (r) => {
      const goesOn = r.chance(0.5);
      const k1 = r.int(1, 3);
      const k2 = r.int(1, 3);
      const start = r.int(8, 14);
      const name = one(r);
      const firstMove = move(r, goesOn, k1);
      const secondMove = move(r, goesOn, k2);
      return {
        prompt: `${name} is on square ${fmtInt(start)} of the hopscotch track. ${name} ${firstMove}. Then ${name} ${secondMove} the same way. Which square is ${name} on now?`,
        initN: start,
        steps: goesOn
          ? [{ op: 'add', n: k1, d: 1 }, { op: 'add', n: k2, d: 1 }]
          : [{ op: 'sub', n: k1, d: 1 }, { op: 'sub', n: k2, d: 1 }],
        hints: [
          'Does anything in this story turn the counter round?',
          'Both moves pull the same way, so keep travelling that way.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => [numOf(p, 'initN')],
  assertsParam('initN', 'mark:0'),
);

// ---------------------------------------------------------------------------
// Day-5 error analysis — the recipe's own misconception, generated
//
// `a_verify_countback_slip_v1` is the registry's "counted back starting ON the
// start number" transform: `{correct: a − b, wrong: a − b + 1}`. The template
// carries the name of the mistake and both values fall out of this item's own two
// operands, so there is nothing here for an author to invent.
//
// The prompt does not state the slip, it PERFORMS it: the numbers said out loud
// are built from `a` and `b`, and the first of them is the square the counter was
// already standing on. That is the whole error, visible, with nothing labelled.
// The child's job is to notice it, so naming it would be the answer (L25).
//
// The figure dots the square the story states in its first sentence, never the
// square the item asks for.
// ---------------------------------------------------------------------------

const eaCountedTheStart = withTrack(
  errorAnalysis({
    verifyTemplateId: 'a_verify_countback_slip_v1',
    cognitiveOp: 'error-analysis',
    drawParams: (r) => ({ a: r.int(9, 18), b: r.int(2, 3) }),
    build: (v, p, r) => {
      const a = numOf(p, 'a');
      const b = numOf(p, 'b');
      const name = one(r);
      // The count itself, built from the operands: b numbers, the first of them
      // the square the hop has not left yet. Its last entry IS `v.wrong`.
      const saidAloud = Array.from({ length: b }, (_, i) => fmtInt(a - i)).join(', ');
      return {
        prompt: `${name} stands on square ${fmtInt(a)} of the hopscotch track. ${name} hops back ${countNoun(b, 'squares')}. ${name} counts ${saidAloud} out loud, and stops on square ${fmtInt(Number(v.wrong))}.`,
        extension: `Write the square the hops really finish on. Then write one sentence about the very first number that was counted.`,
        hints: [
          'How many hops does the story ask for?',
          'Count how many numbers were said out loud. Compare the two counts.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
        answerKeywords: [
          'the square the counter was already on got counted as a hop',
          'the count began before the first hop was taken',
          'one hop fewer than the story asked for was taken',
        ],
      };
    },
  }),
  (p) => [numOf(p, 'a')],
  assertsParam('a', 'mark:0'),
);

// ---------------------------------------------------------------------------
// Day-5 production — the §4 signature, "write the hop story"
//
// Authored rather than drawn, and fixed on one pair of squares. What is being
// marked is a story the child invents, and a class can only talk about each
// other's stories if everybody was given the same two squares (b03 and b19 made
// the same call for the same reason).
//
// IT HAS MANY RIGHT ANSWERS ON PURPOSE, and the answer field says so rather than
// naming one. Five squares can be crossed as three-and-two, as two-and-two-and-one
// or as five single hops, and all of those are hop stories. What is being checked
// is that the story travels the right way and covers the right ground — so the
// prompt asks for the WAY and the SIZE of each hop and never for "how many hops",
// which would read as having one answer when it does not (kit §E2.7).
// ---------------------------------------------------------------------------

const reasoningWriteHopStory = reasoning({
  prompt:
    'Two squares are marked on the track: 9 and 14. Write a hop story that starts on 9 and finishes on 14. Say which way the hops go and how big each hop is. Then write a second story that starts on 14 and finishes on 9.',
  value:
    'any story whose hops travel five squares up the track from the lower square, and a second story whose hops travel the same five squares back down',
  hints: [
    'Which of the two squares sits further up the track?',
    'Measure the gap between them. Any set of hops that covers the gap will do.',
  ],
  errorTags: ['task-comprehension', 'concept-misconception'],
});

/**
 * The week's rule, argued about instead of stated.
 *
 * The claim is genuinely undecidable until you ask about the SIZES, which is why
 * "sometimes" is the answer: a hop back followed by a smaller hop on does leave
 * the counter lower down the track, and a hop back followed by a bigger one does
 * not. Both wrong options are positions children actually hold. 'always' belongs
 * to the child who lets whichever move came first own the whole journey;
 * 'never' to the child for whom a hop on cancels a hop back regardless of size —
 * and taking that apart is what `discBothMoves` and `msNetHops` do all week.
 */
const asnFinishLower = classify({
  prompt:
    'Always, sometimes or never true? You hop back, then you hop on. You finish lower down the track than you started. Write one sentence to show how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Lets the first move own the whole journey, so a bigger hop on can never catch it up.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Treats a hop on as undoing a hop back, whatever sizes the two hops are given.',
    },
  ],
  hints: [
    'Can a small hop on catch up with a big hop back?',
    'Try a big hop back with a small hop on. Then swap them over.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB04 = makeWeekBuilder({
  level: 'B',
  week: 4,
  conceptId: 'count-on-and-count-back',
  conceptName: 'Count on & count back',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [A6, A15, A17, A23, B1],
  pedagogyContract: 'v2',
  conceptualAnchor: 'number-line hops',
  conceptFamily: 'operation',
  deepeningDelta:
    'A15 and A17 counted on and counted back inside ten, with objects to touch and a picture to cross out. B1 laid the numbers out in order on a path and B3 ranked them. B4 puts those two together and makes a number a PLACE: the child sets off from any square up to twenty and travels, which is new in three ways. The starting square is no longer counted, because it is where you already are. The story, and only the story, says which way the travelling goes — B3 deliberately never asked that. And two moves can be strung together with a turn in the middle, which no earlier week has had a reason to mention. B5 then replaces the plain count on with a strategy (bridge at ten) and B18 replaces the single hop with a run of equal ones.',
  explanation: {
    hook:
      'A number can be a place to stand. Two squares sit either side of you. Only the story says which one you are heading for.',
    whyBeforeHow:
      'A hop is not something you add to a number; it is a move you make from one square to the next, and that is why number-line hops are the model this whole week is built on. Two things follow from it, and they are the two things children get wrong. First: the square you are standing on is not a hop. A hop is the gap between two squares, so the very first hop lands on the square NEXT to you — which means a child who says their own number as hop one arrives one square out, every single time, and arrives there confidently. Second: nothing about the numbers themselves says which way to travel. From square fourteen, three hops reach seventeen or they reach eleven, and both are correct arithmetic; only the words settle it. That is why this week rotates how the story says it — on, forward, up the track, back, down the track — because a child who has only ever met the word "back" has learnt to spot a word, not to read a story. Comparing numbers was settled last week and deliberately left the direction question alone, so this is where it is asked. Once both halves are secure, two hops can be strung together: make the first move, stop on the square it reaches, and read the story again for the second. The hardest version is not a big number, it is a small turn.',
    script: [
      {
        say: 'Here is the track. The counter sits on square 12. That square is not a hop yet.',
        visual: 'The number track from 0 to 20, with one dot on square 12 and nothing else marked.',
        figure: trackAt([12]),
      },
      {
        say: 'Watch the first hop. It lands on 13. Then 14. Then 15. Three hops on, and we reach 15.',
        visual: 'The same track, with three single hops drawn from 12 and a flag on square 15.',
        figure: trackWalk(12, 15),
      },
      {
        say: 'Now the same track the other way. From 15, the hops land on 14, then 13.',
        visual: 'Two single hops drawn back from square 15, ending with a flag on square 13.',
        figure: trackWalk(15, 13),
      },
      {
        say: 'The words tell you the way. On means up the track. Back means down the track.',
        visual: 'The track with one dot on square 9 — the same picture, no way chosen yet.',
        figure: trackAt([9]),
      },
      {
        say: 'One habit before I hop. I check which of the two hops is bigger. Then I know which way I finish.',
        visual: 'The track with one dot on square 11, ready for two moves in opposite directions.',
        figure: trackAt([11]),
      },
    ],
    summary:
      'A hop is the move between two squares, so the square you start on is never a hop. The words say which way to travel, and nothing else does. With two moves, finish the first before you read the second.',
    vocabulary: [
      { term: 'hop', kidGloss: 'one move from the square you are on to the very next square' },
      { term: 'count on', kidGloss: 'hop up the track, one square at a time' },
      { term: 'count back', kidGloss: 'hop down the track, one square at a time' },
      { term: 'up the track', kidGloss: 'towards the bigger numbers — down the track means towards the smaller ones' },
      { term: 'landing square', kidGloss: 'the square you are standing on once all the hops are done' },
    ],
  },
  guidedExamples: [
    {
      ...ge(4, 1, 'modeled', 'A counter is on square 12. It hops on 3 squares. Which square does it reach?', [
        {
          teacherSay:
            'Watch me. My finger starts on square 12, but 12 is not a hop yet. The first hop lands on 13.',
        },
        {
          teacherSay: 'So I say 13, 14, 15 as I hop. Which square did the third hop land on?',
          expected: '15',
        },
      ], '15'),
      // Here the whole journey is fair to draw, because the answer is already on
      // the page and the teaching IS watching a hop cross a single square.
      visual: 'Three single hops drawn from square 12, with a flag on square 15.',
      figure: trackWalk(12, 15, assertsAnswer),
    },
    {
      ...ge(4, 2, 'completion', 'A counter is on square 16. It hops back 2 squares. Which square is it on now?', [
        { teacherSay: 'Both hops travel down the track. What do you say for the first hop?', expected: '15' },
        { childDo: 'Take the second hop and name the square you land on.', expected: '14' },
      ], '14'),
      // The fade has started: the child supplies the answer here, so all the track
      // offers is the square the journey leaves from. No arc, no flag.
      visual: 'The track with one dot on square 16 and no hops drawn.',
      figure: trackAt([16]),
    },
    {
      ...ge(4, 3, 'prompted', 'A counter is on square 9. It hops on 2 squares, then turns and hops back 1 square. Where does it finish?', [
        { childDo: 'Make the first move. Stop on the square it reaches. Then make the second.', expected: '10' },
      ], '10'),
      visual: 'Nothing drawn — the first move is finished before the second is read.',
    },
    {
      ...ge(4, 4, 'independent', 'A counter is on square 13. It hops back 3 squares, then hops back 2 more the same way. Which square is it on now? Work it out on your own.', [
        { childDo: 'Read the way once, then make both moves without changing it.', expected: '8' },
      ], '8'),
      visual: 'No track here either — both moves are counted in the head.',
    },
  ],
  days: [
    // Day 1 — concept echo: one hop each way, then two journeys meeting on one
    // square. Single-step throughout, and no chain anywhere.
    [
      { gen: wNeighbourStep, diff: 2 },
      { gen: wWordOnACard, diff: 2 },
      { gen: sitHopOn, diff: 2 },
      { gen: sitHopBack, diff: 2 },
      { gen: sitMeetOnOneSquare, diff: 3 },
    ],
    // Day 2 — fluency + application: a judgement committed to before any counting,
    // the way chosen from the words, and the chain with no turn in it.
    [
      { gen: wTenAndSome, diff: 2 },
      { gen: predictNetHops, diff: 4 },
      { gen: discWhichWay, diff: 3 },
      { gen: sitHopOn, diff: 3 },
      { gen: msSameWayTwice, diff: 4 },
    ],
    // Day 3 — interleave: both choice pages sit beside a plain single hop, so the
    // look of an item stops predicting what it wants.
    [
      { gen: wNeighbourStep, diff: 3 },
      { gen: discWhichWay, diff: 3 },
      { gen: discBothMoves, diff: 3 },
      { gen: predictNetHops, diff: 4 },
      { gen: sitHopBack, diff: 3 },
    ],
    // Day 4 — word problems: the same-way chain sits next to the two-journey page,
    // so no child can pass by assuming both moves must pull together.
    [
      { gen: wTenAndSome, diff: 3 },
      { gen: msSameWayTwice, diff: 4 },
      { gen: discBothMoves, diff: 3 },
      { gen: sitMeetOnOneSquare, diff: 3 },
    ],
    // Day 5 — the signature: a count taken apart, two hop stories written, and
    // the week's rule finally argued about.
    [
      { gen: wWordLaterCard, diff: 2 },
      { gen: eaCountedTheStart, diff: 4 },
      { gen: reasoningWriteHopStory, diff: 3 },
      { gen: asnFinishLower, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: there are only two things to listen for this week, and both are audible from across the room. The first is where the counting starts. Ask your child to count on three from nine out loud. If you hear "nine, ten, eleven" they are counting the square they are already standing on, and they will land one short of the answer every time — for years, if nobody catches it. What fixes it is not a correction but a finger: put it on nine, then move it once as you say ten. The hop is the MOVE, not the number. The second is direction. Before any counting happens, ask "which way?" and wait. Stairs are the best number line in the house, and a pavement of paving stones is the next best: stand on one, say the number, and ask for three hops up and then three hops back down. If your child hops confidently in the wrong direction, that is not a counting problem and more counting practice will not touch it — read the sentence again together and let them tell you which word settled it.',
  ],
  puzzle: (r) => {
    // THREE JOURNEYS, ONE PRIZE SQUARE — a search, which is a different move from
    // anything in the daily core. Every core page states one journey (or two that
    // are asked about together) and wants the square it reaches. This page states
    // three and names a square, so a child has to work out all three landings and
    // then REJECT two of them. The catalog cell asks for a mystery landing spot;
    // the mystery here is which of three counters owns it.
    //
    // THE FIRST VERSION OF THIS PUZZLE WAS SOLVABLE WITHOUT ANY ARITHMETIC, and
    // reading a generated page is what caught it (kit §E2.10). The three starting
    // squares were five apart with hops of at most two, which made the landings
    // disjoint by construction — and also put the winner's start within two of the
    // prize while both losers sat three or more away. So "pick the number nearest
    // the prize square" scored 100%, on every seed, with no hop ever counted. No
    // gate can see it: a puzzle has no options, so the answer-entropy sweep never
    // looks at it.
    //
    // The rebuild makes the DISTANCE carry no information. All three children
    // stand one, two or three squares from the prize — one at each distance,
    // shuffled — so the winner is the nearest, the middle one and the furthest on a
    // third of draws each. Measured over 400 seeds: nearest 33%, furthest 34%.
    // Uniqueness is now repaired rather than spaced: a loser whose landing falls on
    // the prize has its direction flipped, and `start + hop` and `start − hop`
    // cannot both equal the prize unless the hop is zero, so one deterministic step
    // always settles it (kit §E2.4 — never a redraw loop).
    const prize = r.int(6, 14);
    const gaps = r.shuffle([1, 2, 3]);
    const above = [r.chance(0.5), r.chance(0.5), r.chance(0.5)];
    const winner = r.int(0, 2);
    // Every draw is taken up front, so the stream advances by the same amount
    // whichever child turns out to be the winner.
    const loserHops = [r.int(1, 3), r.int(1, 3)];
    const loserUp = [r.chance(0.5), r.chance(0.5)];
    let taken = 0;
    const starts: number[] = [];
    const goesOn: boolean[] = [];
    const hops: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start = above[i] ? prize + gaps[i] : prize - gaps[i];
      starts.push(start);
      if (i === winner) {
        // Hops straight to the prize square: the hop IS the gap, travelling towards it.
        hops.push(gaps[i]);
        goesOn.push(!above[i]);
      } else {
        const hop = loserHops[taken];
        let up = loserUp[taken];
        taken += 1;
        if ((up ? start + hop : start - hop) === prize) up = !up;
        hops.push(hop);
        goesOn.push(up);
      }
    }
    const names = r.shuffle([...NAMES]).slice(0, 3);
    const journey = (i: number) =>
      `${names[i]} is on square ${fmtInt(starts[i])} and ${move(r, goesOn[i], hops[i])}.`;
    return {
      id: 'B4-PZ-01',
      title: 'Puzzle Grove: The Prize Square',
      puzzleType: 'logic',
      prompt: `Three children stand on the hopscotch track. ${journey(0)} ${journey(1)} ${journey(2)} Only one of them lands on square ${fmtInt(prize)}. Which square did that child start on?`,
      answer: {
        value: String(starts[winner]),
        acceptableForms: [`square ${fmtInt(starts[winner])}`],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'How many landings do you need before you can choose?',
        'Work out all three landings. Then find the one that matches the prize.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // Core pages state a journey and want the square it reaches. The puzzle states
  // three journeys and a square, and wants the journey — so two of the three
  // landings have to be worked out and thrown away. Nothing on Day 1 has that
  // shape.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'search-the-prize-square' },
  // DD11 wants a sprint source mastered ≥2 weeks back, and it wants a fluency the
  // week genuinely runs on rather than the nearest available one. A15's count-on
  // facts are this week's arithmetic at a size that is already automatic: a child
  // rebuilding "three more than eight" from one has nothing left over for the
  // direction, which is where all the new load is.
  sprint: {
    skill: 'Counting on within ten — this week\'s hop at a size that is already quick',
    sourceWeek: A15,
    itemCount: 18,
    scheduledDay: 2,
    templateId: 'add_within_10_facts_v1',
    params: { min: 1, max: 9, sumMax: 10 },
  },
  mastery: [
    { gen: sitHopOn, diff: 3 },
    { gen: sitHopBack, diff: 3 },
    { gen: sitMeetOnOneSquare, diff: 3 },
    { gen: msNetHops, diff: 4 },
    { gen: msSameWayTwice, diff: 4 },
    { gen: discBothMoves, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: one hop up the track from a fresh square. 02: one hop down the track, drawn so the landing stays on the track on both forms. 03: two journeys meeting on one square, built backwards from a fresh meeting square, so a form cannot be passed by remembering where the last one met. 04: the two-move chain served RAW here rather than through the estimate-first wrapper the daily pages use — a check that hands over the strategy is not checking it — with the bigger hop belonging to the forward move on one form and the backward move on the other. 05: two moves the same way, with the way drawn fresh per form. 06: the two-move choice, which rotates which two of its four named wrong finishes it offers, so the keyed option sits below, between and above its distractors in turn and neither form can be passed by picking a position. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'travels-the-wrong-way',
      description:
        'Starts counting before the story has been read for its direction, so the hops set off towards the wrong end of the track and land the same distance out on the wrong side.',
      exampleWrongAnswer: 'square 17 given for a counter on 14 that hops back 3',
      distractorRationale:
        'Offer the square the counter reaches travelling the other way, on the single-move choice; and on the two-move choice, both moves read as moves down the track.',
      reteachPointer: 'explanation/script[3] (the words tell you the way — on is up the track, back is down it)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'counts-the-starting-square-as-a-hop',
      description:
        'Says the number of the square already being stood on as the first hop, so one hop fewer than the story asked for is ever taken and the count finishes one square out.',
      exampleWrongAnswer: 'square 12 given for a counter on 14 that hops back 3',
      distractorRationale:
        'Offer the square the count reaches when the starting square is counted as hop one — one short on a hop up the track, one long on a hop down it.',
      reteachPointer: 'explanation/script[0] (the square the counter sits on is not a hop yet)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'sends-both-moves-the-same-way',
      description:
        'Treats a two-move story as one long journey in a single direction, so the turn in the middle never happens and the two hops are combined instead of one giving squares back.',
      exampleWrongAnswer: 'square 15 given for a counter on 11 that hops on 3 and then back 1',
      distractorRationale:
        'Offer two of the four wrong finishes on the two-move choice — the pair rotates, so the truth is not always the middle number.',
      reteachPointer: 'guidedExamples/B4-GE-03 (make the first move, stop on the square it reaches, then make the second)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'loses-the-place-along-the-track',
      description:
        'Loses count of the squares while stepping along the track, usually by touching a square twice, so the finish lands a square or two away from the truth in the right direction.',
      exampleWrongAnswer: 'square 18 given for a counter on 14 that hops on 3',
      distractorRationale:
        'A square touched twice puts the finish one place out, so offer the squares either side of it.',
      reteachPointer: 'explanation/script[1] (say each square out loud as the hop lands on it)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'small-hops-not-yet-quick',
      description:
        'Rebuilds every small hop by counting up from one, which is correct and slow, and leaves no attention over for the direction or for the second move.',
      exampleWrongAnswer: 'a hop of three counted out from one on every page',
      distractorRationale:
        'Offer a square one hop out from the truth, which is what a rebuilt count tends to produce once attention runs short.',
      reteachPointer: 'explanation/vocabulary (hop) — and the Day-2 sprint, which is this fluency on its own',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Counting on and counting back along a number track from any square up to twenty — deciding which way to travel from the words of the story, counting hops without counting the square you start on, stringing two moves together with a turn in the middle, and finding the one square two different journeys both reach.',
    improvingCandidates: [
      'reading the story for its direction before any counting starts',
      'starting the count on the square AFTER the one you are standing on',
      'holding two moves in order, one at a time',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'deciding which way the hops travel before working anything out',
      },
      {
        errorTag: 'procedure-slip',
        text: 'counting the hops rather than the squares, so the first hop lands on the next square along',
      },
      {
        errorTag: 'concept-misconception',
        text: 'letting a two-move story turn round in the middle instead of running on in one direction',
      },
      {
        errorTag: 'fact-recall',
        text: 'making the small hops quick, so the thinking can go on the direction — the sprint keeps that sharp',
      },
    ],
    homeFocus: {
      praiseLine:
        'You worked out which way to travel first, and only then counted the squares.',
      questionForChild: 'Before you count anything, which way is this hop going to take you?',
      schoolSyncHook:
        'You may hear "count up" and "count down" at school, and "steps" for what we are calling squares. The moves underneath are identical, so use whatever wording lands at home.',
    },
    vocabularyForParent: [
      'hop (one move from the square you are on to the very next square — the square you start on is not a hop)',
      'count on / count back (travel up the track towards the bigger numbers, or down it towards the smaller ones)',
      'landing square (the square you are standing on once all the hops are done)',
    ],
  },
});
