/**
 * G6 — exponents, expressions, equations, inequalities (E10-E15)
 *
 * The Level-E algebra family (FILL-ARCHITECTURE §2 row G6, §6 recipes E10-E15):
 * powers as repeated multiplication · order of operations with exponents ·
 * evaluating an expression at a value · one- and two-step equation solving by
 * inverse operations · inequality solving whose answer is a {symbol, bound}
 * pair · equal-at-x checks (the computable core of E12) — plus the four
 * misconceptions those weeks name by hand: 3^4 = 12 (base × exponent),
 * 2(x + 3) = 2x + 3 (distribute once), adding to both sides where the equation
 * asks for a subtraction, and flipping the inequality symbol when adding.
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
 * `registry.ts` spreads `ALGEBRA_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 *
 * ---------------------------------------------------------------------------
 * FIVE DECISIONS THIS FAMILY MADE, recorded so the next author does not have to
 * re-derive them:
 *
 *  1. AN EXPONENT IS WRITTEN `3^4`, NOT `3⁴`. A Unicode superscript is invisible
 *     to `surface.ts::numericTokens`, which is the tokenizer QG-1/QG-4 and the
 *     `drawUniqueItem` guard sign items with. `3⁴` and `3⁵` would therefore carry
 *     the SAME operand surface, and the freshness machinery would quietly stop
 *     distinguishing two different questions. The caret keeps every digit of an
 *     item in the signature, and `power()` below is the single place it is
 *     rendered — no template spells an exponent by hand.
 *
 *  2. AN INEQUALITY ANSWER IS A {symbol, bound} PAIR, NEVER FREE TEXT
 *     (FILL-ARCHITECTURE §2, G6). The params carry `{symbol, bound}`, the
 *     registered `answerFor` renders them, and `inequalityForms` enumerates the
 *     surfaces a child may legitimately write (`x>7`, `x >= 7`, the mirrored
 *     `7 < x`). Validation is `ordered-list`, because that is the one mode whose
 *     QG-5 audit compares TOKENS rather than parsing a number: an inequality has
 *     no numeric value to compare, and `exact-numeric` would fail every one of
 *     these items in the validator while looking fine in the generator.
 *
 *  3. EVERY EQUATION IS BUILT BACKWARDS FROM ITS SOLUTION. The draw picks `x`
 *     first and computes the constant the equation must state, so a non-integer
 *     solution is unreachable — rather than drawing the constants and redrawing
 *     until the division happens to come out. A redraw loop consumes a variable
 *     number of rng draws, which would make every LATER item in the pack depend
 *     on which seed this one landed on. The same rule produces the exact division
 *     in `oneStepSolution`, `twoStepSolution` and `inequalityBound`, so
 *     `whole()` (which refuses a fractional result) can never actually fire.
 *
 *  4. A MISCONCEPTION THAT COLLAPSES ONTO THE TRUTH IS NOT A MISCONCEPTION.
 *     Each verify below REFUSES params where its named slip returns the right
 *     answer, and each draw is constructed so that refusal cannot trigger: the
 *     power pool omits (2, 2) because 2^2 and 2 × 2 are the same number; the
 *     distribute-once draws keep the multiplier above one; the base-swap pool
 *     omits {2, 4} because 2^4 and 4^2 are both 16. That is the "no generator
 *     may throw on any seed" rule discharged at the DRAW, not by a try/catch.
 *
 *  5. ⚠ FIGURE NOTE (reported upward, not worked around): the figure library has
 *     no shaded-ray primitive, which is what an inequality graph actually is.
 *     `readInequalityGraph` therefore carries the ray as a number-line HOP from
 *     the boundary out to the end of the line, with the dot style ('open' for a
 *     strict symbol, 'point' for an inclusive one) doing the work the E15
 *     discrimination is about, and states both in the figure's accessible name.
 *     No primitive was invented and none was bent into pretending to be a ray.
 *
 * WEEK AUTHORS: the distractor `errorTag`s used here are `concept-misconception`,
 * `procedure-slip`, `representation-misread` and `task-comprehension`; a week
 * serving these generators must bank every tag its chosen items emit
 * (assemble.ts refuses a blueprint whose mistakeBank misses one).
 */

import type { BBFigure, MarkStyle } from '../../../figures/types';
import type { Rng } from '../../rng';
import type { ItemDraft } from '../shared';
import type { AnswerDef, VerifyDef, VerifyResult } from './compute';
import { canonicalSigned, evalRatChain, formatFrac, mulFrac, num, str, type Frac } from './compute';
import { discrimination } from './discrimination';
import { errorAnalysis } from './erroranalysis';
import { assertsParam, barModel, numberLine } from './figures';
import { countNoun, fmtInt, unitFor } from './format';
import { multiStep, type ItemGen } from './multistep';
import { situation } from './situations';

type Params = Record<string, unknown>;

// ===========================================================================
// Surface authorities — the only places an algebraic form is spelled
// ===========================================================================

/**
 * A power, always `3^4` (see decision 1 in the header). Both numbers go through
 * `fmtInt`, so a large base would group exactly as it does everywhere else.
 */
export function power(base: number, exp: number): string {
  return `${fmtInt(base)}^${fmtInt(exp)}`;
}

/**
 * A linear expression, sign-correct at the join: `3x + 5`, `3x - 5`, `x + 5`.
 * A coefficient of one is written as the bare variable (no child writes `1x`),
 * and a zero constant drops the join entirely rather than printing `+ 0`.
 * The minus is ASCII, never the Unicode minus — three shared gates read prose
 * character by character (the note lib/integers.ts records at its head).
 */
export function linearExpr(a: number, b: number, v = 'x'): string {
  const term = a === 1 ? v : `${fmtInt(a)}${v}`;
  if (b === 0) return term;
  return b > 0 ? `${term} + ${fmtInt(b)}` : `${term} - ${fmtInt(Math.abs(b))}`;
}

/** The factored twin of `linearExpr`: `2(x + 3)`. */
export function factoredExpr(a: number, b: number, v = 'x'): string {
  return `${fmtInt(a)}(${v} ${b < 0 ? '-' : '+'} ${fmtInt(Math.abs(b))})`;
}

/** A linear equation as the child sees it: `3x + 5 = 20`. */
export function equationText(a: number, b: number, c: number, v = 'x'): string {
  return `${linearExpr(a, b, v)} = ${fmtInt(c)}`;
}

/** The four inequality symbols, as the canonical answer renders them. */
export type IneqSymbol = '>' | '<' | '≥' | '≤';
const SYMBOLS: readonly IneqSymbol[] = ['>', '<', '≥', '≤'];

/** The symbol a flip produces — the move E15's named misconception performs. */
export function flipSymbol(symbol: IneqSymbol): IneqSymbol {
  switch (symbol) {
    case '>': return '<';
    case '<': return '>';
    case '≥': return '≤';
    case '≤': return '≥';
  }
}

/** True for a symbol whose boundary value is itself a solution (a closed dot). */
export function isInclusive(symbol: IneqSymbol): boolean {
  return symbol === '≥' || symbol === '≤';
}

/** Keyboard spellings of the two symbols a keyboard has no key for. */
const ASCII_SYMBOL: Record<IneqSymbol, string> = { '>': '>', '<': '<', '≥': '>=', '≤': '<=' };

function ineqSymbol(p: Params, id: string): IneqSymbol {
  const s = str(p, 'symbol');
  if (!(SYMBOLS as readonly string[]).includes(s)) {
    throw new Error(`${id}: symbol must be one of ${SYMBOLS.join(' ')}, got '${s}'`);
  }
  return s as IneqSymbol;
}

/**
 * THE canonical inequality answer: `x > 7` — a {symbol, bound} pair rendered,
 * never a sentence a marker would have to interpret.
 */
export function inequalityAnswer(symbol: IneqSymbol, bound: number, v = 'x'): string {
  if (!(SYMBOLS as readonly string[]).includes(symbol)) {
    throw new Error(`inequalityAnswer(): '${symbol}' is not an inequality symbol`);
  }
  return `${v} ${symbol} ${fmtInt(bound)}`;
}

/**
 * The surfaces a child may legitimately hand in for that pair. `checkAnswer`
 * matches an acceptable form by exact (normalised) surface, so the keyboard
 * spellings, the unspaced form and the MIRRORED reading (`7 < x` for `x > 7`)
 * have to be enumerated — none of them is a different answer, and a child who
 * writes the mirror has understood the item better than one who copies the
 * template. De-duplicated because for `<` and `>` the ASCII spelling IS the
 * symbol.
 */
export function inequalityForms(symbol: IneqSymbol, bound: number, v = 'x'): string[] {
  const n = fmtInt(bound);
  const ascii = ASCII_SYMBOL[symbol];
  const mirror = flipSymbol(symbol);
  return [
    ...new Set([
      `${v}${symbol}${n}`,
      `${v} ${ascii} ${n}`,
      `${v}${ascii}${n}`,
      `${n} ${mirror} ${v}`,
      `${n}${mirror}${v}`,
    ]),
  ];
}

// ===========================================================================
// Exact arithmetic — folded through compute.ts, never hand-rolled
// ===========================================================================

/**
 * The whole-number value of an exact rational result. Every equation in this
 * family is built backwards from an integer solution (decision 3), so a
 * fractional result here means a DRAW is wrong, not that a child met a hard
 * fraction — hence a loud throw rather than a formatted mixed number.
 */
function whole(f: Frac, id: string): number {
  if (f.d !== 1) throw new Error(`${id}: expected a whole-number result, got ${formatFrac(f)}`);
  return canonicalSigned(f.n);
}

/**
 * `base^exp`, as the repeated multiplication E10 defines it to be — folded
 * through `mulFrac`, which is where the exact-arithmetic audit lives. Writing
 * `Math.pow` would be a second arithmetic implementation in a library whose
 * whole point is that there is only one.
 */
export function powerValue(base: number, exp: number): number {
  if (!Number.isInteger(base) || !Number.isInteger(exp)) {
    throw new Error(`powerValue(): base and exponent must be whole numbers, got ${base}^${exp}`);
  }
  if (exp < 1) throw new Error(`powerValue(): this family only writes positive exponents, got ${exp}`);
  let acc: Frac = { n: 1, d: 1 };
  for (let i = 0; i < exp; i++) acc = mulFrac(acc, { n: base, d: 1 });
  return whole(acc, 'powerValue');
}

/** `a·x + b` — the value of a linear expression at one value of the variable. */
export function linearValue(a: number, x: number, b: number): number {
  return whole(
    evalRatChain(x, 1, [{ op: 'mul', n: a, d: 1 }, { op: 'add', n: b, d: 1 }]),
    'linearValue',
  );
}

/** `a·(x + b)` — the FACTORED reading, which is what "distribute" starts from. */
export function factoredValue(a: number, x: number, b: number): number {
  return whole(
    evalRatChain(x, 1, [{ op: 'add', n: b, d: 1 }, { op: 'mul', n: a, d: 1 }]),
    'factoredValue',
  );
}

const ONE_STEP_OPS = ['add', 'sub', 'mul', 'div'] as const;
/** Which move the EQUATION performs on x (the child applies its inverse). */
export type OneStepOp = (typeof ONE_STEP_OPS)[number];

function oneStepOp(p: Params, id: string): OneStepOp {
  const op = str(p, 'op');
  if (!(ONE_STEP_OPS as readonly string[]).includes(op)) {
    throw new Error(`${id}: op must be one of ${ONE_STEP_OPS.join(', ')}, got '${op}'`);
  }
  return op as OneStepOp;
}

/**
 * The solution of a one-step equation, reached by the INVERSE of the move the
 * equation makes — the same four lines the child writes, in the same order.
 */
function oneStepSolution(p: Params): number {
  const b = num(p, 'b');
  const c = num(p, 'c');
  const id = 'e_alg_one_step_v1';
  if (b === 0) throw new Error(`${id}: a move of zero is not a move — the equation would already be solved`);
  switch (oneStepOp(p, id)) {
    case 'add': return whole(evalRatChain(c, 1, [{ op: 'sub', n: b, d: 1 }]), id);
    case 'sub': return whole(evalRatChain(c, 1, [{ op: 'add', n: b, d: 1 }]), id);
    case 'mul': return whole(evalRatChain(c, 1, [{ op: 'div', n: b, d: 1 }]), id);
    case 'div': return whole(evalRatChain(c, 1, [{ op: 'mul', n: b, d: 1 }]), id);
  }
}

/** The solution of `a·x + b = c`: undo the addition first, then the scaling. */
function twoStepSolution(p: Params): number {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const c = num(p, 'c');
  const id = 'e_alg_two_step_v1';
  if (a === 0) throw new Error(`${id}: a zero coefficient leaves no variable to solve for`);
  return whole(evalRatChain(c, 1, [{ op: 'sub', n: b, d: 1 }, { op: 'div', n: a, d: 1 }]), id);
}

/**
 * The boundary of the solution set of `a·x + b ⋈ c`. The coefficient is kept
 * POSITIVE by every draw here, which is the whole reason E15's rule ("adding to
 * both sides keeps the tip") is true and its named slip (flipping while adding)
 * is a slip: dividing by a negative is a later week, and mixing it in would make
 * the misconception occasionally correct.
 */
function inequalityBound(p: Params): number {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const c = num(p, 'c');
  const id = 'e_alg_inequality_v1';
  if (a <= 0) throw new Error(`${id}: this family solves with a positive coefficient only, got ${a}`);
  return whole(evalRatChain(c, 1, [{ op: 'sub', n: b, d: 1 }, { op: 'div', n: a, d: 1 }]), id);
}

// ===========================================================================
// Registered answers (QG-5 re-derives every one of these)
// ===========================================================================

/** `base^exp` — E10's core value. */
function algPower(p: Params): string {
  return String(powerValue(num(p, 'base'), num(p, 'exp')));
}

/** `a + c × base^exp` — order of operations with an exponent in the middle. */
function algOrderOfOps(p: Params): string {
  const a = num(p, 'a');
  const c = num(p, 'c');
  const inner = powerValue(num(p, 'base'), num(p, 'exp'));
  // The exponent is settled first, then the multiplication, then the addition —
  // the chain IS the precedence rule, so params and prose cannot disagree.
  return String(
    whole(evalRatChain(inner, 1, [{ op: 'mul', n: c, d: 1 }, { op: 'add', n: a, d: 1 }]), 'e_alg_ooo_v1'),
  );
}

/** `a·x + b` at a given x — E11's evaluate-at-a-value. */
function algEvalAtX(p: Params): string {
  return String(linearValue(num(p, 'a'), num(p, 'x'), num(p, 'b')));
}

/**
 * BOTH values of an expression pair at one x, as an ordered pair — E12's
 * computable core. `mode` names which second expression was drawn:
 *   'equivalent'      a(x + b) and ax + ab, which agree at EVERY x;
 *   'distribute-once' a(x + b) and ax + b, which agree at NO x once a > 1.
 * The item never claims which; that judgement is what it asks for.
 */
function algPairAtX(p: Params): string {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const x = num(p, 'x');
  const mode = str(p, 'mode');
  if (mode !== 'equivalent' && mode !== 'distribute-once') {
    throw new Error(`e_alg_pair_at_x_v1: mode must be 'equivalent' or 'distribute-once', got '${mode}'`);
  }
  const first = factoredValue(a, x, b);
  const second = mode === 'equivalent' ? linearValue(a, x, a * b) : linearValue(a, x, b);
  return `${first}, ${second}`;
}

/** The solution of a one-step equation, as a plain number. */
function algOneStep(p: Params): string {
  return String(oneStepSolution(p));
}

/** The solution of a two-step equation, as a plain number. */
function algTwoStep(p: Params): string {
  return String(twoStepSolution(p));
}

/** The solved inequality, as the canonical {symbol, bound} surface. */
function algInequality(p: Params): string {
  return inequalityAnswer(ineqSymbol(p, 'e_alg_inequality_v1'), inequalityBound(p));
}

/** The inequality a graphed solution set names — the {symbol, bound} pair read off. */
function algInequalityFromGraph(p: Params): string {
  return inequalityAnswer(ineqSymbol(p, 'e_alg_inequality_graph_v1'), num(p, 'bound'));
}

// ===========================================================================
// Registered truths (QG-11) — the misconceptions E10-E15 name by hand
//
// Each one REFUSES params on which its named slip returns the true answer, so an
// error-analysis item can never show a "student error" that is really right, and
// a discrimination can never key two identical options.
// ===========================================================================

/** `3^4 = 12` — the exponent read as a second factor (E10's named slip). */
function verifyPower(p: Params): VerifyResult {
  const base = num(p, 'base');
  const exp = num(p, 'exp');
  const correct = powerValue(base, exp);
  const mode = str(p, 'wrongMode');
  let wrong: number;
  switch (mode) {
    case 'base-times-exponent':
      wrong = base * exp;
      break;
    case 'exponent-as-repeated-addition':
      // The other half of "repeated × vs repeated +": base added exp times.
      wrong = base * exp;
      break;
    default:
      throw new Error(`e_alg_verify_power_v1: bad wrongMode '${mode}'`);
  }
  if (wrong === correct) {
    throw new Error(
      `e_alg_verify_power_v1: ${power(base, exp)} and ${fmtInt(base)} × ${fmtInt(exp)} are the same number — that pair cannot show the slip`,
    );
  }
  return { correct: String(correct), wrong: String(wrong) };
}

/** `2^3` vs `3^2` — which power is larger when base and exponent trade places. */
function verifyPowerSwap(p: Params): VerifyResult {
  const base = num(p, 'base');
  const exp = num(p, 'exp');
  const here = powerValue(base, exp);
  const swapped = powerValue(exp, base);
  // An equal pair is RECOMPUTED, not refused. It used to throw, on the reasoning
  // that the swap has nothing to decide — true of the pair list as it then
  // stood, and no longer: 2^4 against 4^2 is drawn deliberately. The guard is
  // not lost, it is inverted, which is the useful direction — keying a POWER on
  // an equal pair now fails to recompute.
  if (here === swapped) return { correct: POWER_SWAP_SAME };
  return { correct: here > swapped ? power(base, exp) : power(exp, base), wrong: String(Math.min(here, swapped)) };
}

/** `(a + b)^n` vs `a + b^n` — what a grouping is worth (E10's F5 story). */
function verifyGrouping(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const exp = num(p, 'exp');
  const correct = powerValue(a + b, exp);
  const wrong = whole(evalRatChain(powerValue(b, exp), 1, [{ op: 'add', n: a, d: 1 }]), 'e_alg_verify_grouping_v1');
  if (correct === wrong) {
    throw new Error(`e_alg_verify_grouping_v1: the grouping changes nothing for (${a}, ${b}, ${exp})`);
  }
  return { correct: String(correct), wrong: String(wrong) };
}

/** `2(x + 3) = 2x + 3` — the multiplier reaching only the first term (E12). */
function verifyDistribute(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const x = num(p, 'x');
  const correct = factoredValue(a, x, b);
  const wrong = linearValue(a, x, b);
  if (correct === wrong) {
    throw new Error(
      `e_alg_verify_distribute_v1: a=${a}, b=${b} leaves the two expressions equal — a multiplier of one distributes to nothing`,
    );
  }
  return { correct: String(correct), wrong: String(wrong) };
}

/**
 * `3 more than twice n` written `2(n + 3)` — a bracket the words never asked
 * for (E11's named slip, and the exact mirror of `verifyDistribute` above).
 *
 * BOTH DIRECTIONS HAVE TO EXIST, because they are different children's
 * mistakes on different weeks. E12's child is handed the FACTORED form and
 * expands it short. E11's is handed the WORDS and reaches for a grouping
 * nothing in them spoke. Only E12's direction was registered, so E11's recipe
 * cell appeared to have no template at all — which is how the previous two
 * weeks' error-analyses came to be relocated.
 *
 * This one the library CAN express, and it is worth being exact about why: the
 * slip changes how far the multiplication REACHES over a fixed ordered pair,
 * which is an operation-shaped change. The open gap is narrower than "the
 * verify library cannot express E11's slip" — it is that no template can swap
 * the two OPERANDS (E4's inverted fraction, E5's LCM), and that gap is
 * untouched by this.
 *
 * Guard rather than nudge: `a·x + b` and `a·(x + b)` differ by `b(a − 1)`, so
 * they coincide exactly when `a = 1` (or `b = 0`), and the throw names it.
 */
function verifyMisgroup(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const x = num(p, 'x');
  const correct = linearValue(a, x, b);
  const wrong = factoredValue(a, x, b);
  if (correct === wrong) {
    throw new Error(
      `e_alg_verify_misgroup_v1: a=${a}, b=${b} leaves the two expressions equal — the bracket only bites when the multiplier is above one and the extra is non-zero`,
    );
  }
  return { correct: String(correct), wrong: String(wrong) };
}

/**
 * The one-step equation solved by the WRONG inverse: the child performs the
 * equation's own move on both sides instead of undoing it (E13's named slip —
 * adds where the equation asks for a subtraction).
 */
function verifyInverse(p: Params): VerifyResult {
  const b = num(p, 'b');
  const c = num(p, 'c');
  const op = oneStepOp(p, 'e_alg_verify_inverse_v1');
  if (op !== 'add' && op !== 'sub') {
    throw new Error(`e_alg_verify_inverse_v1: the wrong-inverse slip is an additive one, got op '${op}'`);
  }
  const correct = oneStepSolution({ op, b, c });
  // Repeats the equation's move rather than undoing it.
  const wrong = whole(evalRatChain(c, 1, [{ op: op === 'add' ? 'add' : 'sub', n: b, d: 1 }]), 'e_alg_verify_inverse_v1');
  if (correct === wrong) {
    throw new Error(`e_alg_verify_inverse_v1: a move of ${fmtInt(b)} undoes itself — pick a non-zero move`);
  }
  return { correct: String(correct), wrong: String(wrong) };
}

/**
 * The inequality solved correctly and then flipped (E15's named slip). Both
 * values are {symbol, bound} surfaces, so the shown "wrong" is an inequality —
 * the form the child actually wrote — not a bare number.
 */
function verifyFlip(p: Params): VerifyResult {
  const b = num(p, 'b');
  const c = num(p, 'c');
  const symbol = ineqSymbol(p, 'e_alg_verify_flip_v1');
  const bound = whole(evalRatChain(c, 1, [{ op: 'sub', n: b, d: 1 }]), 'e_alg_verify_flip_v1');
  return {
    correct: inequalityAnswer(symbol, bound),
    wrong: inequalityAnswer(flipSymbol(symbol), bound),
  };
}

const AGREEMENT = {
  one: 'they match at exactly one value of x',
  all: 'they match at every value of x',
  none: 'they never match',
} as const;

/**
 * How two linear expressions relate — E12's discrimination, decided by code:
 * `a·x + b` and `c·x + d` match everywhere when both parts agree, nowhere when
 * only the slopes do, and at exactly one x otherwise.
 */
function verifyAgreement(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const c = num(p, 'c');
  const d = num(p, 'd');
  if (a === c) return { correct: b === d ? AGREEMENT.all : AGREEMENT.none };
  return { correct: AGREEMENT.one };
}

// ===========================================================================
// Draw pools — nouns bound to the frame that can truthfully carry them
// ===========================================================================

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

/** Two distinct names (never a hardcoded name that is also in the pool). */
function two(r: Rng): [string, string] {
  return r.shuffle([...NAMES]).slice(0, 2) as [string, string];
}

/**
 * Push a drawn value up until it clears every number its prompt will print.
 *
 * WHY IT EXISTS: an equation is built backwards from its solution, so nothing
 * stops the solution landing on one of the constants the equation states —
 * `x + 8 = 16` prints the answer in the question. It is rare (about one seed in
 * fifty) and it silently converts a solving item into a copying item, which is
 * precisely the kind of defect that only shows up for the one learner who drew
 * it.
 *
 * WHY IT IS NOT A REDRAW: it consumes NO rng. A redraw loop advances the stream
 * by a variable number of draws, so every LATER item in the pack would depend on
 * which seed this one happened to land on. Stepping the value by one instead is
 * deterministic and provably total: each of the `forbidden.length` values can be
 * hit at most once on the way up, so `forbidden.length + 1` steps always clear.
 */
function clearOf(value: number, forbidden: readonly number[]): number {
  let out = value;
  for (let i = 0; i <= forbidden.length; i++) {
    if (!forbidden.includes(out)) return out;
    out += 1;
  }
  return out;
}

/**
 * (base, exponent) pairs a Level-E child can hold: every value lands under a
 * thousand, and (2, 2) is absent BY CONSTRUCTION — 2^2 and 2 × 2 are the same
 * number, the one pair on which "3^4 = 12" has nothing to show (decision 4).
 */
const POWER_PAIRS = [
  [2, 3], [2, 4], [2, 5], [2, 6],
  [3, 2], [3, 3], [3, 4],
  [4, 2], [4, 3],
  [5, 2], [5, 3],
  [6, 2], [7, 2], [8, 2], [9, 2],
] as const;

/**
 * Pairs for the base/exponent SWAP contrast. `a ≠ b` throughout, and {2, 4} is
 * absent because 2^4 and 4^2 are both sixteen — the only swap in reach that has
 * no larger side.
 */
/**
 * 2^4 = 4^2 = 16 IS IN HERE, and it has to be.
 *
 * The list used to hold only pairs where the swap changes the value, and
 * `verifyPowerSwap` threw on an equal pair — so "they are equal" was offered on
 * every draw of `powerBaseSwapTrap` and could never be the answer. That is the
 * L38 unkeyable card, in the item whose lesson is that a power is NOT a product
 * and its two numbers do NOT trade places freely. A child who learns to strike
 * that card has learnt the opposite of the point.
 *
 * (2,4) is the only non-trivial pair of positive integers with a^b = b^a, which
 * makes it exactly the right thing to meet as a surprise rather than to be told:
 * the swap usually changes the value, and here is the one place it does not.
 */
/**
 * THREE POOLS, BECAUSE THE ARITHMETIC HAS THREE CASES AND ONLY ONE WAS COMMON.
 *
 * Among distinct whole numbers above one, a^b > b^a for EVERY pair except
 * {2,3} — so on a flat draw the card with the bigger exponent won almost
 * always, and "take the one with the bigger exponent" keyed 54.9% of 3,000
 * draws against a 33.3% baseline (E10's author measured 49.4%; mine is worse).
 * The exception and the equal pair are what make the item honest, so they are
 * drawn as often as the ordinary case rather than being rarities.
 */
const SWAP_ORDINARY_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [2, 5], [5, 2], [2, 6], [6, 2], [3, 4], [4, 3], [3, 5], [5, 3],
];
/** 2^3 = 8 < 9 = 3^2 — the one pair where the SMALLER exponent wins. */
const SWAP_EXCEPTION_PAIRS: ReadonlyArray<readonly [number, number]> = [[2, 3], [3, 2]];
const SWAP_EQUAL_PAIRS: ReadonlyArray<readonly [number, number]> = [[2, 4], [4, 2]];
/** "they are equal", named once and shared with the verify below. */
const POWER_SWAP_SAME = 'they are equal';

/** Things that multiply themselves each period — the honest home of a power. */
const GROWTHS = [
  { where: 'a lab dish', one: 'cell', many: 'cells', period: 'hour', verb: 'splits into' },
  { where: 'a fern bed', one: 'frond', many: 'fronds', period: 'week', verb: 'sprouts into' },
  { where: 'a puzzle tree', one: 'branch', many: 'branches', period: 'level', verb: 'divides into' },
  { where: 'a message chain', one: 'reader', many: 'readers', period: 'round', verb: 'passes it to' },
] as const;

/** Countable collections, for equations posed as a missing part. */
const COLLECTIONS = [
  { one: 'badge', many: 'badges', place: 'a locker' },
  { one: 'sticker', many: 'stickers', place: 'an album' },
  { one: 'marble', many: 'marbles', place: 'a jar' },
  { one: 'card', many: 'cards', place: 'a folder' },
] as const;

/** Equal-group frames, for the scaling equations. */
const GROUPINGS = [
  { unit: 'seats', group: 'row', groups: 'rows' },
  { unit: 'cakes', group: 'box', groups: 'boxes' },
  { unit: 'photos', group: 'page', groups: 'pages' },
  { unit: 'bulbs', group: 'tray', groups: 'trays' },
] as const;

/** Steady machines, for evaluate-at-x. */
// `warm` names a SET-UP STAGE, not a single unit of output: "21 pages used on
// the test page" says a lone page consumed twenty-one, which is not a sentence
// about anything. The stage is what carries a count.
const MACHINES = [
  { agent: 'A printer', out: 'pages', per: 'minute', warm: 'set-up run' },
  { agent: 'A knitting rig', out: 'rows', per: 'minute', warm: 'threading stage' },
  { agent: 'A label press', out: 'labels', per: 'minute', warm: 'alignment pass' },
] as const;

// ===========================================================================
// Figure attachment — no new rng draw, built from the item's OWN params
// ===========================================================================

/**
 * Attach a figure built from the drafted item's own `generator.params` (the
 * QG-13 law: the picture is derived from the values the answer was derived from,
 * so it cannot disagree with it).
 *
 * It is a local wrapper because `situations.ts` carries no `figure` slot in its
 * draw shape and it is a shared file this family does not own. Reading the
 * params back off the finished draft is not a workaround for that — it is the
 * same guarantee from the other end: there is no second draw, so there is no
 * second source of truth.
 */
function withFigure(base: ItemGen, build: (params: Params) => BBFigure | undefined): ItemGen {
  return (rng, guard, difficulty) => {
    const draft: ItemDraft = base(rng, guard, difficulty);
    if (!draft.generator) return draft;
    const figure = build(draft.generator.params as Params);
    return figure ? { ...draft, figure } : draft;
  };
}

// ===========================================================================
// E10 — exponents, and order of operations with them
// ===========================================================================

/**
 * A power as the repeated multiplication it is: one thing becomes `base` things
 * each period, for `exp` periods (E10's "repeated × vs repeated +" anchor).
 */
export function evaluatePower(): ItemGen {
  return situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'alg-power',
    draw: (r) => {
      const [base, exp] = r.pick(POWER_PAIRS);
      const g = r.pick(GROWTHS);
      return {
        prompt: `In ${g.where}, every ${unitFor(1, g.one)} ${g.verb} ${countNoun(base, g.many)} each ${unitFor(1, g.period)}. Starting from a single ${unitFor(1, g.one)}, how many ${g.many} are there after ${countNoun(exp, g.period)}? Write the count as a power first, then work out its value.`,
        answerValue: algPower({ base, exp }),
        templateId: 'e_alg_power_v1',
        params: { base, exp },
        units: g.many,
        acceptableForms: [countNoun(algPower({ base, exp }), g.many), power(base, exp)],
        hints: [
          'Does each period ADD the same amount to the count, or take that many copies of it?',
          'Write out one period at a time as a multiplication, and count how many factors the whole run needs.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/**
 * Order of operations with an exponent in the middle: the power is settled
 * first, then the multiplication, then the addition (E10).
 */
export function orderOfOpsPower(): ItemGen {
  return situation({
    situationType: 'combine',
    cognitiveOp: 'alg-order-of-ops',
    draw: (r) => {
      const [base, exp] = r.pick(POWER_PAIRS.filter(([b, e]) => powerValue(b, e) <= 125));
      const a = r.int(3, 40);
      const c = r.int(2, 6);
      const thing = r.pick(['beads', 'tiles', 'pins', 'seeds', 'chips']);
      const [n1] = two(r);
      return {
        prompt: `${n1} has ${countNoun(a, thing)} loose on the bench and ${countNoun(c, 'bags')} on the shelf, each holding ${power(base, exp)} ${thing}. Work out ${fmtInt(a)} + ${fmtInt(c)} × ${power(base, exp)} to find how many ${thing} there are altogether.`,
        answerValue: algOrderOfOps({ a, c, base, exp }),
        templateId: 'e_alg_ooo_v1',
        params: { a, c, base, exp },
        units: thing,
        hints: [
          'Which part of an expression is settled before any multiplying or adding happens?',
          'Turn the power into its value first, then let the multiplication run, and let the addition finish.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/**
 * Insert the grouping that hits a stated target — D21's sibling, lifted to
 * exponents (E10's Day-5 signature). The target is the GROUPED value, so the
 * ungrouped reading is a real competing number, not a decoy.
 */
export function groupingToTarget(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'alg-grouping',
    draw: (r) => {
      // exp 2 tolerates larger parts than exp 3 does; both keep the target
      // inside what a child will actually evaluate.
      const exp = r.pick([2, 2, 3]);
      const a = r.int(2, exp === 2 ? 7 : 4);
      const b = r.int(2, exp === 2 ? 7 : 4);
      // WHICH READING THE TARGET NAMES IS DRAWN. The target used to be the
      // GROUPED value on every draw, and that handed over the answer twice
      // without any arithmetic: the key was the only card carrying a bracket on
      // 100.0% of 3,000 draws, and — because gathering a sum before raising it
      // always beats raising the parts — it was also the largest-valued card on
      // 100.0%. Two independent free strategies, on the item that teaches what a
      // grouping is worth.
      //
      // The guessability census called this generator CLEAN, and was right by
      // its own lights: the key TEXT varies every draw so card-identity is low,
      // and three expressions are not rankable so no rank check runs. "Carries a
      // bracket" is a STRUCTURAL surface, and the census does not model those.
      // Found by E10's author refusing to serve the item.
      //
      // The three readings stay exactly as they were; only the target rotates,
      // so the key lands on each in turn. The three values cannot collide: the
      // grouped reading exceeds the spread one by 2ab, and the spread exceeds
      // the second-only one whenever a > 1, which the draw guarantees.
      verifyGrouping({ a, b, exp });
      const READINGS = [
        {
          text: `(${fmtInt(a)} + ${fmtInt(b)})^${fmtInt(exp)}`,
          value: powerValue(a + b, exp),
          errorTag: 'concept-misconception' as const,
          rationale: 'Gathers the two numbers into one amount before the power acts — which is what a bracket asks for, and what this expression does not.',
        },
        {
          text: `${fmtInt(a)} + ${power(b, exp)}`,
          value: a + powerValue(b, exp),
          errorTag: 'procedure-slip' as const,
          rationale: 'Lets the exponent act on the second number alone, so the sum is never gathered before the power is taken.',
        },
        {
          text: `${power(a, exp)} + ${power(b, exp)}`,
          value: powerValue(a, exp) + powerValue(b, exp),
          errorTag: 'concept-misconception' as const,
          rationale: 'Spreads the exponent across a sum, which a power does not do — only a whole grouped amount can be raised.',
        },
      ];
      const wanted = r.int(0, 2);
      return {
        prompt: `Which expression has the value ${fmtInt(READINGS[wanted].value)}?`,
        correct: READINGS[wanted].text,
        distractors: READINGS.filter((_, i) => i !== wanted).map((x) => ({
          text: x.text,
          errorTag: x.errorTag,
          rationale: x.rationale,
        })),
        hints: [
          'What has to be gathered into one amount before a power can act on it?',
          'Read the brackets as a fence: whatever sits inside is settled into a single number first.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/** `2^3` vs `3^2` — the base and the exponent are not interchangeable (E10). */
export function powerBaseSwapTrap(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'alg-power',
    draw: (r) => {
      // The OUTCOME is drawn first, then a pair built to match, so all three
      // cards are reachable in equal thirds rather than two of them in halves.
      const shape = r.pick(['equal', 'smaller-exponent-wins', 'ordinary'] as const);
      const [base, exp] = r.pick(
        shape === 'equal' ? SWAP_EQUAL_PAIRS
          : shape === 'smaller-exponent-wins' ? SWAP_EXCEPTION_PAIRS
            : SWAP_ORDINARY_PAIRS,
      );
      const truth = verifyPowerSwap({ base, exp });
      const SAME = {
        text: POWER_SWAP_SAME,
        errorTag: 'representation-misread' as const,
        rationale: 'Reads both as "these two numbers combined", which loses the difference between what is repeated and how often.',
      };
      const SWAPPED = (text: string) => ({
        text,
        errorTag: 'concept-misconception' as const,
        rationale: 'Treats the two numbers as a pair that can trade places, as if a power behaved like a product.',
      });
      const other = truth.correct === power(base, exp) ? power(exp, base) : power(base, exp);
      return {
        prompt: `Which is larger, ${power(base, exp)} or ${power(exp, base)}?`,
        correct: truth.correct,
        // Derived from the truth, never listed beside it — the rule five
        // generators in this library learned once a previously-impossible card
        // became reachable.
        distractors: truth.correct === POWER_SWAP_SAME
          ? [SWAPPED(power(base, exp)), SWAPPED(power(exp, base))]
          : [SWAPPED(other), SAME],
        hints: [
          'Which of the two numbers in a power says WHAT is repeated, and which says HOW OFTEN?',
          'Write each one out as its full line of factors and compare the two lines.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

/** Day-5 error analysis: `3^4 = 12` — base × exponent (E10's named slip). */
export function eaBaseTimesExponent(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_alg_verify_power_v1',
    cognitiveOp: 'alg-power',
    drawParams: (r) => {
      const [base, exp] = r.pick(POWER_PAIRS);
      return { base, exp, wrongMode: 'base-times-exponent' };
    },
    build: (v, p) => ({
      prompt: `A student was asked for the value of ${power(num(p, 'base'), num(p, 'exp'))} and wrote ${v.wrong}.`,
      extension: 'Write the power out as its full line of factors, then write the value that line really gives and say what the two numbers in a power each stand for.',
      hints: [
        'In a power, does the small raised number join the multiplication, or count it?',
        'Write the repeated factor down as many times as the raised number says, then multiply along the line.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    }),
  });
}

// ===========================================================================
// E11 — algebraic expressions: the variable as an any-number bag
// ===========================================================================

/** Evaluate `a·x + b` at a drawn value of x (E11's evaluate-at-several-x core). */
export function evaluateAtX(): ItemGen {
  return situation({
    situationType: 'rate',
    cognitiveOp: 'alg-evaluate',
    draw: (r) => {
      const a = r.int(2, 12);
      const b = r.int(2, 30);
      const x = r.int(3, 15);
      const m = r.pick(MACHINES);
      return {
        prompt: `${m.agent} makes ${countNoun(a, m.out)} every ${unitFor(1, m.per)}, on top of ${countNoun(b, m.out)} produced during its ${unitFor(1, m.warm)}. Its output after x ${unitFor(2, m.per)} is ${linearExpr(a, b)} ${m.out}. What is the output after ${countNoun(x, m.per)}?`,
        answerValue: algEvalAtX({ a, b, x }),
        templateId: 'e_alg_eval_v1',
        params: { a, b, x },
        units: m.out,
        hints: [
          'Which part of the expression changes with the time, and which part stays the same however long it runs?',
          'Put the given number in place of every variable, then let the multiplication run before the addition.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  });
}

/**
 * Which expression means what the words say — `an + b` vs `a(n + b)` vs the
 * swapped roles: the phrase E11's named error-analysis mistranslates as
 * `2(n + 3)`.
 *
 * THIS IS NOT E11's RECIPE DISCRIMINATION, and an earlier version of this
 * comment said it was ("E11's 2n vs n² vs n+2 family"). It is not that: this
 * item is about GROUPING and ROLE-SWAP over one shape, whereas the recipe's
 * discrimination is about three shapes that GROW differently. Nothing in `lib/`
 * builds the latter, so the week builds it locally — and it has to be built
 * carefully, because for every n ≥ 3 the order n² > 2n > n+2 is fixed, which
 * makes "pick the squared one" a free 100% on any which-is-biggest page. The
 * distinction only bites at n ∈ {0, 1, 2}, which is also the whole point.
 */
export function expressionMeaningTrap(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'alg-write-expr',
    draw: (r) => {
      const a = r.int(2, 9);
      // b ≠ a, so the swapped-roles option is a genuinely different expression.
      const b = a + r.int(1, 6);
      // WHICH PHRASE IS ASKED IS DRAWN. The un-bracketed reading was the answer
      // on every draw, so `a(n + b)` — the only card carrying a bracket — could
      // never be keyed: "strike the bracketed one" turned a three-way item into
      // a coin toss, on 100% of draws, without reading the phrase. Found by the
      // census's structural-surface check (b5fad96), which exists because
      // `groupingToTarget` hid the same shape from every other check here.
      //
      // The three expressions are unchanged; only the phrase rotates, so each is
      // the answer in turn and the bracket says nothing. Each rationale
      // describes what its OWN card does, which stays true whichever is keyed.
      const AN_PLUS_B = {
        text: linearExpr(a, b, 'n'),
        errorTag: 'representation-misread' as const,
        rationale: 'Scales the number and then adds the extra on, so the extra is never scaled.',
      };
      const A_TIMES_SUM = {
        text: factoredExpr(a, b, 'n'),
        errorTag: 'concept-misconception' as const,
        rationale: 'Gathers the number and the extra together before scaling, so the multiplier reaches the extra as well.',
      };
      const BN_PLUS_A = {
        text: linearExpr(b, a, 'n'),
        errorTag: 'representation-misread' as const,
        rationale: 'Swaps the two numbers, so the one that scales and the one that is added trade places.',
      };
      // AND WHICH NUMERAL THE PHRASE SPEAKS FIRST IS DRAWN TOO, INDEPENDENTLY.
      // Rotating `wanted` alone fixed the bracket surface and left a second one
      // the census cannot see, because it compares cards to CARDS and never the
      // PROMPT to the cards. Every card carries the same two numerals, so their
      // ORDER is a correspondence a child can read without any algebra — and
      // with one phrasing per reading, two of the three phrases ran (a, b) and
      // only one ran (b, a). Measured over 3,000 draws: "pick the card whose
      // numbers run in the opposite order to the phrase" scored 50.6% against a
      // 33.3% chance, and its mirror sat at 16.5%, so striking that card paid as
      // well. Both directions are exploitable; see the census's own SURF note.
      //
      // Each reading therefore ships BOTH numeral orders, and the order is drawn
      // independently of which reading is keyed. That makes the phrase's order
      // carry no information about the key, by construction rather than by
      // nudge: whichever expression is wanted, the phrase runs (a, b) half the
      // time and (b, a) half the time, so every correspondence strategy above
      // settles at exactly 1/3. The bracket rotation from `5314cbe` is untouched
      // — `wanted` still keys each expression a third of the time.
      const READINGS = [
        {
          // `an + b` — scale first, then add on.
          ab: `${fmtInt(a)} times a number n, increased by ${fmtInt(b)}`,
          ba: `${fmtInt(b)} more than ${fmtInt(a)} times a number n`,
          correct: AN_PLUS_B,
        },
        {
          // `a(n + b)` — gather first, then scale.
          ab: `${fmtInt(a)} times the sum of a number n and ${fmtInt(b)}`,
          ba: `the sum of a number n and ${fmtInt(b)}, multiplied by ${fmtInt(a)}`,
          correct: A_TIMES_SUM,
        },
        {
          // `bn + a` — the same shape as the first, with the roles traded.
          ab: `${fmtInt(a)} more than ${fmtInt(b)} times a number n`,
          ba: `${fmtInt(b)} times a number n, increased by ${fmtInt(a)}`,
          correct: BN_PLUS_A,
        },
      ];
      const wanted = r.int(0, 2);
      const pick = READINGS[wanted];
      const phrase = r.int(0, 1) === 0 ? pick.ab : pick.ba;
      return {
        prompt: `Which expression means "${phrase}"?`,
        correct: pick.correct.text,
        distractors: [AN_PLUS_B, A_TIMES_SUM, BN_PLUS_A]
          .filter((c) => c.text !== pick.correct.text)
          .map((c) => ({ text: c.text, errorTag: c.errorTag, rationale: c.rationale })),
        hints: [
          'Which happens to the number first — the scaling, or the extra being added on?',
          'Read the phrase from the inside out and build the expression in that same order.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

/**
 * E11's multi-step: evaluate a rate expression at a value, then share the
 * result. Posed inverse-start-free but genuinely three-move, and the answer +
 * step-count both come from the shipped op-chain.
 */
export function msEvaluateThenShare(): ItemGen {
  return multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'alg-evaluate',
    usesPriorSkill: true,
    draw: (r) => {
      // The ranges carry a PROOF rather than a guard. Both the hours (share·k)
      // and the prepared batch (share·m) are multiples of the share, so
      // a·x + b divides exactly; and since the answer is a·k + m ≥ 22 while
      // every number the prompt prints is at most 18, the answer can never be
      // one of them (decision 3, argued instead of nudged).
      const a = r.int(5, 9);
      const share = r.pick([2, 3]);
      const k = r.int(4, 6);
      const m = r.int(2, 6);
      const x = share * k;
      const b = share * m;
      const [n1, n2] = two(r);
      const thing = r.pick(['flyers', 'tickets', 'seedlings', 'programmes']);
      return {
        prompt: `A stall produces ${linearExpr(a, b)} ${thing} in x hours: ${countNoun(a, thing)} an hour, plus ${countNoun(b, thing)} prepared in advance. ${n1} runs it for ${countNoun(x, 'hours')} and then splits the whole batch equally between ${countNoun(share, 'helpers')}, ${n2} among them. How many ${thing} does each helper get?`,
        initN: x,
        steps: [
          { op: 'mul', n: a, d: 1 },
          { op: 'add', n: b, d: 1 },
          { op: 'div', n: share, d: 1 },
        ],
        units: thing,
        hints: [
          'Does the sharing act on the hourly output alone, or on everything the stall ends up with?',
          'Work the expression out for the hours given, then split that single total between the helpers.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  });
}

// ===========================================================================
// E12 — equivalent expressions: the computable core
//
// The prove-in-general argument is E12's flagged open part (FILL-ARCHITECTURE
// §7) and is NOT generated here. What IS computable is the evidence a proof
// would have to survive: the value of both expressions at a drawn x.
// ===========================================================================

/**
 * Evaluate a factored expression and a candidate expansion at one x, as an
 * ordered pair. `mode` decides which expansion is drawn — a true one, or the
 * distribute-once one — and the item never says which, because deciding is the
 * task. Each mode carries its own hint ladder: the §6.5 dedup gate counts
 * ladder TEMPLATES, so two configurations sharing one would burn a week's whole
 * allowance on a single wording.
 */
export function evaluateBothAtX(mode: 'equivalent' | 'distribute-once' = 'distribute-once'): ItemGen {
  return situation({
    situationType: 'comparison',
    cognitiveOp: `alg-equal-at-x-${mode}`,
    draw: (r) => {
      const a = r.int(2, 8);
      const b = r.int(2, 9);
      const x = r.int(2, 12);
      const second = mode === 'equivalent' ? linearExpr(a, a * b) : linearExpr(a, b);
      return {
        prompt: `Two expressions are written on a board: ${factoredExpr(a, b)} and ${second}. Work out the value of each one when x is ${fmtInt(x)}, and write the two values in that order.`,
        answerValue: algPairAtX({ a, b, x, mode }),
        templateId: 'e_alg_pair_at_x_v1',
        params: { a, b, x, mode },
        validation: 'ordered-list',
        hints:
          mode === 'equivalent'
            ? [
                'Does a bracket have to be settled before the number outside it can act, or can the number reach in?',
                'Work the bracket out into a single amount first, then apply the multiplier to that amount.',
              ]
            : [
                'Which parts of the second expression has the multiplier been applied to?',
                'Settle each expression on its own, in its own order, before putting the two values side by side.',
              ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/**
 * E12's discrimination: agreeing at ONE value is not the same as agreeing at
 * every value. The pair is constructed to meet at exactly one x, and the truth
 * is classified by code rather than asserted.
 */
export function equalAtOneXVsAllX(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'alg-equivalence',
    draw: (r) => {
      const a = r.int(3, 9);
      const c = r.int(2, a - 1); // c < a, so the slopes differ and a meeting point exists
      const meet = r.int(2, 8);
      const b = r.int(1, 9);
      const d = b + meet * (a - c); // makes the two expressions agree exactly at x = meet
      const truth = verifyAgreement({ a, b, c, d });
      return {
        prompt: `Two expressions, ${linearExpr(a, b)} and ${linearExpr(c, d)}, both give the same value when x is ${fmtInt(meet)}. Which statement about them is true?`,
        correct: truth.correct,
        distractors: [
          {
            text: AGREEMENT.all,
            errorTag: 'concept-misconception',
            rationale: 'Takes one matching value as proof for every value — the exact evidence a single test can never supply.',
          },
          {
            text: AGREEMENT.none,
            errorTag: 'task-comprehension',
            rationale: 'Reads two different-looking expressions as unable to meet at all, when the prompt has already shown them meeting.',
          },
        ],
        hints: [
          'Does one matching value settle a claim about every possible value?',
          'Try both expressions at a second value of the variable and see whether they stay together.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

/** Day-5 error analysis: `2(x + 3) = 2x + 3` — distributed once (E12). */
export function eaDistributeOnce(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_alg_verify_distribute_v1',
    cognitiveOp: 'alg-equivalence',
    // a ≥ 2 and b ≥ 2, so the multiplier always has a second term to reach and
    // the slip can never land on the true value.
    drawParams: (r) => ({ a: r.int(2, 8), b: r.int(2, 9), x: r.int(2, 12) }),
    build: (v, p) => ({
      prompt: `A student was asked for the value of ${factoredExpr(num(p, 'a'), num(p, 'b'))} when x is ${fmtInt(num(p, 'x'))}. They wrote ${linearExpr(num(p, 'a'), num(p, 'b'))} on the next line and answered ${v.wrong}.`,
      extension: 'Work the bracket out first and write the value that gives, then write an expression without brackets that really does match the original at every value of x.',
      hints: [
        'How many of the terms inside a bracket does the multiplier outside it act on?',
        'Settle the bracket into one amount and evaluate that way, then compare the two results.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    }),
  });
}

// ===========================================================================
// E13 — one-step equations: undo ONE move
// ===========================================================================

/**
 * Solve a one-step equation by the inverse of the move it makes. `op` names the
 * equation's own move ('add' → `x + b = c`, 'mul' → `bx = c`, …) and is a
 * CONSTRUCTOR option, not a draw: the hint ladder differs per move, and a
 * ladder that varied with the operands would be seed-variant.
 *
 * Every draw picks the solution first and computes the constant from it, so a
 * fractional solution is unreachable (decision 3).
 */
export function oneStepEquation(op: OneStepOp = 'add'): ItemGen {
  const additive = op === 'add' || op === 'sub';
  return withFigure(
    situation({
      situationType: additive ? 'part-whole' : 'sharing',
      cognitiveOp: `alg-one-step-${op}`,
      draw: (r) => {
        if (additive) {
          const coll = r.pick(COLLECTIONS);
          const b = r.int(2, 20);
          // 'add' keeps the solution clear of the move it prints; 'sub' builds
          // the start ABOVE the amount removed, which clears it and also keeps
          // the remainder a positive count a locker can actually hold.
          const x = op === 'add' ? clearOf(r.int(4, 40), [b]) : b + r.int(2, 25);
          const c = op === 'add' ? x + b : x - b;
          const [n1] = two(r);
          const prompt =
            op === 'add'
              ? `${n1} keeps ${coll.many} in ${coll.place}. After ${countNoun(b, coll.many)} were added there were ${countNoun(c, coll.many)}. Solve ${equationText(1, b, c)} to find how many were there at the start.`
              : `${n1} keeps ${coll.many} in ${coll.place}. After ${countNoun(b, coll.many)} were taken out, ${countNoun(c, coll.many)} were left. Solve ${equationText(1, -b, c)} to find how many were there at the start.`;
          return {
            prompt,
            answerValue: algOneStep({ op, b, c }),
            templateId: 'e_alg_one_step_v1',
            params: { op, b, c },
            units: coll.many,
            hints:
              op === 'add'
                ? [
                    'Which single move would take the equation back to the variable standing alone?',
                    'Whatever the equation does to the unknown, do the opposite to BOTH sides, so the balance is kept.',
                  ]
                : [
                    'Is the starting amount larger or smaller than what was left behind?',
                    'Undo the removal on both sides at once, so the two sides stay balanced.',
                  ],
            errorTags: ['procedure-slip', 'concept-misconception'],
          };
        }
        const grp = r.pick(GROUPINGS);
        const b = r.int(2, 9);
        // 'mul' states the TOTAL and asks for one group, so the solution is
        // pushed clear of the group count it prints. 'div' states one SHARE and
        // asks for the total, whose value (share × groups, both ≥ 2) already
        // exceeds every number the prompt carries — nothing to clear.
        const c = op === 'mul' ? clearOf(r.int(3, 20), [b]) * b : r.int(3, 20);
        const params = { op, b, c };
        const [n1] = two(r);
        const prompt =
          op === 'mul'
            ? `${n1} lays out ${countNoun(b, grp.groups)} of ${grp.unit} with the same number in each ${unitFor(1, grp.group)}, and uses ${countNoun(c, grp.unit)} altogether. Solve ${equationText(b, 0, c)} to find how many are in one ${unitFor(1, grp.group)}.`
            // "a tray of seats" is not a thing: the sharing frame spreads the
            // WHOLE SET across the groups, which reads truthfully for every
            // unit/group pair in the pool (seats across rows, cakes across
            // boxes, photos across pages).
            : `${n1} spreads a whole set of ${grp.unit} equally across ${countNoun(b, grp.groups)}, and each ${unitFor(1, grp.group)} ends with ${countNoun(c, grp.unit)}. Solve x ÷ ${fmtInt(b)} = ${fmtInt(c)} to find how many are in the whole set.`;
        return {
          prompt,
          answerValue: algOneStep(params),
          templateId: 'e_alg_one_step_v1',
          params,
          units: grp.unit,
          hints:
            op === 'mul'
              ? [
                  'Does finding the size of one group build the total up, or break it back down?',
                  'Undo the scaling on both sides at once, so the balance is kept.',
                ]
              : [
                  'Is the amount on the tray larger or smaller than what one share holds?',
                  'Undo the sharing on both sides at once, so the balance is kept.',
                ],
          errorTags: ['procedure-slip', 'concept-misconception'],
        };
      },
    }),
    // The bar picture is drawn ONLY for the additive-forward case, and only from
    // amounts the prompt has already stated: the whole beside the known part.
    // The gap between them is the answer, which is what the child computes — a
    // labelled unknown segment would hand it over (d04's L33 note).
    (p) => {
      if (str(p, 'op') !== 'add') return undefined;
      const b = num(p, 'b');
      const c = num(p, 'c');
      return barModel(
        [
          { label: 'the amount at the end', segments: [{ value: c, label: fmtInt(c) }], total: fmtInt(c) },
          { label: 'the amount that was added', segments: [{ value: b, label: fmtInt(b) }] },
        ],
        {
          scaleMax: c,
          alt: `a bar of ${fmtInt(c)} for the final amount, and a shorter bar of ${fmtInt(b)} for the amount added, both drawn to one scale`,
          asserts: assertsParam('c', 'bar:0'),
        },
      );
    },
  );
}

/** Which inverse move undoes the equation (E13's discrimination). */
export function whichInverseMove(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'alg-inverse-choice',
    draw: (r) => {
      const b = r.int(2, 15);
      const x = r.int(3, 30);
      return {
        prompt: `Which single move solves ${equationText(1, b, x + b)} in one step?`,
        correct: `take ${fmtInt(b)} off both sides`,
        distractors: [
          {
            text: `add ${fmtInt(b)} to both sides`,
            errorTag: 'concept-misconception',
            rationale: 'Repeats the move the equation already makes, so the variable ends up further from standing alone.',
          },
          {
            text: `divide both sides by ${fmtInt(b)}`,
            errorTag: 'procedure-slip',
            rationale: 'Undoes a scaling, but the equation joins its number by addition, not by multiplication.',
          },
        ],
        hints: [
          'What is being done TO the unknown in this equation?',
          'Name that move, then name the move that cancels it, and apply the second one to both sides.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/**
 * E13's check-back multi-step: the only count the story states is the RESULT of
 * a move, so the opening step is an inverse the sentence order does not hand
 * over (PEDAGOGY-CEILING-REVIEW F3), and the recovered starting amount is then
 * USED — which is what makes it a chain rather than a solve with a tail.
 *
 * The two change amounts are drawn from DISJOINT ranges, which is what proves
 * the answer differs from the stated count (they coincide only when the two
 * changes are equal) and keeps it clear of both changes as well.
 */
export function msSolveThenCheck(): ItemGen {
  return multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'alg-one-step-sub',
    posing: 'inverse-start',
    draw: (r) => {
      const coll = r.pick(COLLECTIONS);
      const start = r.int(20, 60);
      const added = r.int(3, 12);
      const extra = r.int(15, 30);
      const [n1, n2] = two(r);
      return {
        prompt: `${n1} keeps ${coll.many} in ${coll.place}. After ${countNoun(added, coll.many)} were clipped in, the count read ${countNoun(start + added, coll.many)}. ${n2} then starts a collection with the same number ${n1} began with, and adds ${countNoun(extra, coll.many)} to it. How many ${coll.many} does ${n2} have?`,
        initN: start + added,
        steps: [{ op: 'sub', n: added, d: 1 }, { op: 'add', n: extra, d: 1 }],
        units: coll.many,
        hints: [
          'Is the count the story gives you the amount at the start, or the amount after something had already happened?',
          'Work back to the starting amount first, then build the second collection forward from there.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  });
}

/** Day-5 error analysis: added to both sides where the equation asks for a subtraction (E13). */
export function eaWrongInverse(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_alg_verify_inverse_v1',
    cognitiveOp: 'alg-one-step-add',
    // b ≥ 2 keeps the move real (a move of zero undoes itself), c > b keeps the
    // true solution a positive count, and `clearOf` keeps that solution off the
    // number the equation prints — at x = b the equation would read
    // "x + 8 = 16" and the answer the item asks for would be on the page.
    drawParams: (r) => {
      const b = r.int(2, 15);
      const x = clearOf(r.int(3, 30), [b]);
      return { op: 'add', b, c: x + b };
    },
    build: (v, p) => ({
      prompt: `A student solved ${equationText(1, num(p, 'b'), num(p, 'c'))} by adding ${fmtInt(num(p, 'b'))} to both sides, and wrote x = ${v.wrong}.`,
      extension: 'Put the written value back into the original equation and say what the two sides come to, then write the value that really balances it.',
      hints: [
        'Does repeating a move take the variable closer to standing alone, or further from it?',
        'Name the move the equation makes on the unknown, then apply its opposite to both sides.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    }),
  });
}

// ===========================================================================
// E14 — two-step equations: undo in REVERSE order
// ===========================================================================

/** Solve `a·x + b = c` (E14). The solution is drawn first; `c` follows from it. */
export function twoStepEquation(): ItemGen {
  return situation({
    situationType: 'multi-stage',
    cognitiveOp: 'alg-two-step',
    draw: (r) => {
      const a = r.int(2, 9);
      // b ≠ a keeps "take b off" and "take a off" distinct moves for the child
      // reading the equation, which is what E14's order question turns on.
      const b = a + r.int(1, 20);
      // …and the solution is kept clear of both constants the equation prints,
      // so no seed turns "solve it" into "read it off the page".
      const x = clearOf(r.int(2, 15), [a, b]);
      const c = a * x + b;
      const grp = r.pick(GROUPINGS);
      const [n1] = two(r);
      return {
        prompt: `${n1} fills ${countNoun(a, grp.groups)} of ${grp.unit} with the same number in each ${unitFor(1, grp.group)}, and ${countNoun(b, grp.unit)} stay loose. There are ${countNoun(c, grp.unit)} altogether. Solve ${equationText(a, b, c)} to find how many are in one ${unitFor(1, grp.group)}.`,
        answerValue: algTwoStep({ a, b, c }),
        templateId: 'e_alg_two_step_v1',
        params: { a, b, c },
        units: grp.unit,
        hints: [
          'Which of the two moves in this equation is the LAST one done to the unknown?',
          'Undo the moves in the reverse of the order they were applied, keeping both sides balanced at each step.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/** Which move comes FIRST (E14's discrimination — the named divide-too-early slip). */
export function whichMoveFirst(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'alg-two-step',
    draw: (r) => {
      const a = r.int(2, 9);
      const b = a + r.int(1, 20); // b ≠ a, so the two "take … off" options differ
      const x = r.int(2, 15);
      return {
        prompt: `Which move comes FIRST when solving ${equationText(a, b, a * x + b)}?`,
        correct: `take ${fmtInt(b)} off both sides`,
        distractors: [
          {
            text: `divide both sides by ${fmtInt(a)}`,
            errorTag: 'procedure-slip',
            rationale: 'Undoes the scaling while the loose amount is still attached, so the division lands on a total that is not all scaled.',
          },
          {
            text: `take ${fmtInt(a)} off both sides`,
            errorTag: 'representation-misread',
            rationale: 'Treats the multiplier as though it were added on, so the number removed is the one that scales rather than the one that joins.',
          },
        ],
        hints: [
          'Which move was applied to the unknown LAST as the expression was built?',
          'Peel the expression the way it was wrapped: the outermost move comes off first.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  });
}

/**
 * E14 as a story: the stated total is the RESULT of both moves, so the child
 * plans backwards. The answer and the step-count both come from the shipped
 * op-chain, never a hand-typed label.
 */
export function msTwoStepUndo(): ItemGen {
  return multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'alg-two-step',
    posing: 'inverse-start',
    draw: (r) => {
      const perSession = r.int(3, 12);
      const joining = r.int(5, 40);
      // The session count is the answer, so it is kept off both charges the
      // story states; the total is larger than it by construction.
      const sessions = clearOf(r.int(2, 12), [perSession, joining]);
      const total = perSession * sessions + joining;
      const [n1] = two(r);
      const club = r.pick(['a climbing club', 'a pottery club', 'a chess club', 'a swim squad']);
      return {
        prompt: `${n1} joined ${club}. It charges ${countNoun(joining, 'credits')} to join, then ${countNoun(perSession, 'credits')} for each session. ${n1} has spent ${countNoun(total, 'credits')} in all. How many sessions has ${n1} attended?`,
        initN: total,
        steps: [{ op: 'sub', n: joining, d: 1 }, { op: 'div', n: perSession, d: 1 }],
        units: 'sessions',
        hints: [
          'Is the joining charge paid once, or once for every session?',
          'Set the one-off charge aside first, then see how many session charges the rest covers.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  });
}

// ===========================================================================
// E15 — inequalities: the tipping balance and a ray of answers
// ===========================================================================

/**
 * Solve an inequality. The answer is the {symbol, bound} pair rendered through
 * `inequalityAnswer`, with `inequalityForms` registering the surfaces a child
 * may legitimately write instead (decision 2).
 *
 * `steps` is a constructor option, so each shape carries its own fixed ladder.
 * The coefficient is always positive, which is what makes E15's rule ("adding
 * to both sides keeps the tip") true and its named slip a slip.
 */
export function solveInequality(steps: 'one' | 'two' = 'one'): ItemGen {
  return situation({
    situationType: 'comparison',
    cognitiveOp: `alg-inequality-${steps}`,
    draw: (r) => {
      const symbol = r.pick(SYMBOLS);
      const a = steps === 'one' ? 1 : r.int(2, 6);
      const bound = r.int(2, 20);
      const b = r.int(2, 25);
      const c = a * bound + b;
      const [n1] = two(r);
      const thing = r.pick(['tokens', 'points', 'stamps', 'credits']);
      // Both shapes state the inequality and ask for the solution set; only the
      // expression differs, because "where each x is worth a tokens" would be
      // describing the COEFFICIENT as though it were the unknown's value.
      const prompt = `${n1} is working out which whole amounts of ${thing} satisfy ${linearExpr(a, b)} ${symbol} ${fmtInt(c)}. Solve it, and write the answer as an inequality in x.`;
      return {
        prompt,
        answerValue: algInequality({ a, b, c, symbol }),
        templateId: 'e_alg_inequality_v1',
        params: { a, b, c, symbol },
        validation: 'ordered-list',
        acceptableForms: inequalityForms(symbol, bound),
        hints:
          steps === 'one'
            ? [
                'Does taking the same amount off both sides of a balance change which way it tips?',
                'Clear the number that joins the variable, keeping the symbol pointing exactly as it was.',
              ]
            : [
                'Which of the two moves has to be undone first, and does either of them tip the balance the other way?',
                'Clear the joined number first and the multiplier second, keeping the symbol pointing exactly as it was.',
              ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/**
 * Read a solution set off its graph — the translation half of "solve then
 * graph". The boundary is stated in the prompt (so the item carries an operand
 * surface and stays fresh across a pack); the DIRECTION and the dot style, which
 * are what E15's discrimination is about, are carried only by the picture and
 * its accessible name.
 */
export function readInequalityGraph(): ItemGen {
  return withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'alg-inequality-graph',
      draw: (r) => {
        const symbol = r.pick(SYMBOLS);
        const bound = r.int(2, 20);
        return {
          prompt: `The number line marks ${fmtInt(bound)} and shades every value of x that one inequality allows. Write that inequality.`,
          answerValue: algInequalityFromGraph({ symbol, bound }),
          templateId: 'e_alg_inequality_graph_v1',
          params: { symbol, bound },
          validation: 'ordered-list',
          acceptableForms: inequalityForms(symbol, bound),
          hints: [
            'Which side of the marked value does the shading run towards, and is the marked value itself shaded in?',
            'Read the direction from the shading and the boundary from the circle, then write the two together.',
          ],
          errorTags: ['representation-misread', 'concept-misconception'],
        };
      },
    }),
    (p) => {
      const bound = num(p, 'bound');
      const symbol = ineqSymbol(p, 'e_alg_inequality_graph_v1');
      const towardsRight = symbol === '>' || symbol === '≥';
      const min = bound - 6;
      const max = bound + 6;
      // An OPEN circle excludes the boundary, a filled point includes it — the
      // whole content of "< vs ≤", carried by the mark style rather than said.
      const style: MarkStyle = isInclusive(symbol) ? 'point' : 'open';
      return numberLine(
        {
          min,
          max,
          step: 2,
          marks: [{ at: bound, label: fmtInt(bound), style }],
          hops: [{ from: bound, to: towardsRight ? max : min }],
        },
        {
          alt: `a number line with ${isInclusive(symbol) ? 'a filled circle' : 'an open circle'} at ${fmtInt(bound)} and the line shaded from there to the ${towardsRight ? 'right' : 'left'}`,
          asserts: assertsParam('bound', 'mark:0'),
        },
      );
    },
  );
}

/** Open vs closed dot, and which way the ray runs (E15's discrimination). */
export function openOrClosedDotTrap(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'alg-inequality-graph',
    draw: (r) => {
      const symbol = r.pick(SYMBOLS);
      const bound = r.int(2, 20);
      const towardsRight = symbol === '>' || symbol === '≥';
      const dot = isInclusive(symbol) ? 'a filled circle' : 'an open circle';
      const otherDot = isInclusive(symbol) ? 'an open circle' : 'a filled circle';
      const side = towardsRight ? 'right' : 'left';
      const otherSide = towardsRight ? 'left' : 'right';
      const graph = (d: string, s: string) => `${d} at ${fmtInt(bound)}, shaded to the ${s}`;
      return {
        prompt: `Which number line shows every value that satisfies ${inequalityAnswer(symbol, bound)}?`,
        correct: graph(dot, side),
        distractors: [
          {
            text: graph(otherDot, side),
            errorTag: 'concept-misconception',
            rationale: 'Runs the shading the right way but treats the boundary value the opposite way, which is the whole difference between a strict symbol and an inclusive one.',
          },
          {
            text: graph(dot, otherSide),
            errorTag: 'representation-misread',
            rationale: 'Marks the boundary correctly but sends the ray the other way, so the set holds the values the inequality excludes.',
          },
        ],
        hints: [
          'Is the marked value itself one of the answers, or only the values beyond it?',
          'Test one value on each side of the boundary, and test the boundary itself, then shade whatever passed.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

/** Day-5 error analysis: the symbol flipped while adding (E15's named slip). */
export function eaFlipWhenAdding(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_alg_verify_flip_v1',
    cognitiveOp: 'alg-inequality-one',
    drawParams: (r) => {
      const symbol = r.pick(SYMBOLS);
      const b = r.int(2, 20);
      const bound = r.int(2, 20);
      return { b, c: bound + b, symbol };
    },
    build: (v, p) => ({
      prompt: `A student solved ${linearExpr(1, num(p, 'b'))} ${str(p, 'symbol')} ${fmtInt(num(p, 'c'))}. They took ${countNoun(num(p, 'b'), 'units')} off both sides and wrote ${v.wrong}.`,
      extension: 'Test one value from each side of the boundary in the ORIGINAL inequality, then write the solution the tests support and say which moves can turn a symbol round.',
      hints: [
        'Does taking the same amount off both pans of a balance change which pan is heavier?',
        'Try a value that fits the written answer in the original inequality and see whether it really holds.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    }),
  });
}

// ===========================================================================
// Registry (spread by registry.ts)
// ===========================================================================

export const ALGEBRA_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  // --- Exponents and order of operations (E10) ------------------------------
  /** `base^exp`, folded as the repeated multiplication E10 defines it to be. */
  { id: 'e_alg_power_v1', answerFor: algPower },
  /** `a + c × base^exp` — the power settled first, then ×, then + . */
  { id: 'e_alg_ooo_v1', answerFor: algOrderOfOps },
  // --- Expressions (E11, E12) ------------------------------------------------
  /** `a·x + b` at one value of the variable. */
  { id: 'e_alg_eval_v1', answerFor: algEvalAtX },
  /** Both expressions of a pair evaluated at one x, as an ordered pair. */
  { id: 'e_alg_pair_at_x_v1', answerFor: algPairAtX },
  // --- Equations (E13, E14) --------------------------------------------------
  /** The solution of a one-step equation, by the inverse of its own move. */
  { id: 'e_alg_one_step_v1', answerFor: algOneStep },
  /** The solution of `a·x + b = c`, undoing the addition before the scaling. */
  { id: 'e_alg_two_step_v1', answerFor: algTwoStep },
  // --- Inequalities (E15) ----------------------------------------------------
  /** The solved inequality as a {symbol, bound} pair (never free text). */
  { id: 'e_alg_inequality_v1', answerFor: algInequality },
  /** The inequality a graphed solution set names, same pair form. */
  { id: 'e_alg_inequality_graph_v1', answerFor: algInequalityFromGraph },

  // --- Verify truths (QG-11) -------------------------------------------------
  // The four misconceptions §6 names for E10-E15, plus the two contrasts whose
  // correct option is code-SELECTED rather than hand-authored. `discrimination()`
  // ships no GeneratorSpec, so QG-11 cannot re-derive those from a shipped pack
  // the way it re-derives an error-analysis truth; registering them anyway is
  // what keeps the keyed option and the registered truth ONE expression.
  /** `3^4 = 12` — the exponent read as a second factor. */
  { id: 'e_alg_verify_power_v1', verifyFor: verifyPower },
  /** `2^3` vs `3^2` — base and exponent are not interchangeable. */
  { id: 'e_alg_verify_power_swap_v1', verifyFor: verifyPowerSwap },
  /** `(a + b)^n` vs `a + b^n` — what a grouping is worth. */
  { id: 'e_alg_verify_grouping_v1', verifyFor: verifyGrouping },
  /** `2(x + 3) = 2x + 3` — the multiplier reaching only the first term. */
  { id: 'e_alg_verify_distribute_v1', verifyFor: verifyDistribute },
  /** `3 more than twice n` written `2(n + 3)` — its mirror, and E11's slip. */
  { id: 'e_alg_verify_misgroup_v1', verifyFor: verifyMisgroup },
  /** Adding to both sides where the equation asks for a subtraction. */
  { id: 'e_alg_verify_inverse_v1', verifyFor: verifyInverse },
  /** The inequality symbol flipped while adding. */
  { id: 'e_alg_verify_flip_v1', verifyFor: verifyFlip },
  /** Agreeing at one value vs agreeing at every value (E12). */
  { id: 'e_alg_verify_agreement_v1', verifyFor: verifyAgreement },
];
