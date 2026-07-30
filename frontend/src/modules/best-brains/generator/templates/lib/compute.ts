/**
 * Answer computation library — the SINGLE SOURCE OF TRUTH for every generated
 * item's answer (correctness architecture rule 1: "AI never asserts an answer").
 *
 * Every deterministic template answer is computed HERE, once, by code. The item
 * generator (items.ts) calls the same `compute*` function to fill
 * `answer.value`, and the validator's QG-5 arithmetic audit calls the SAME
 * function again through `LIB_TEMPLATE_DEFS[id].answerFor(params)`. Because both
 * paths run identical code over identical params, a wrong answer key is
 * structurally impossible: if the generator and the audit ever disagreed, the
 * pack would fail QG-5 and never ship.
 *
 * Choice-key / short-text / manual-review templates have no closed-form single
 * answer, so they register `answerFor: undefined` (audit skipped) and compute
 * their correct choice inside the generator instead.
 */

type Params = Record<string, unknown>;

/** Read a required numeric param, throwing (audit-catchable) when malformed. */
export function num(p: Params, key: string): number {
  const v = p[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error(`template param '${key}' missing or non-numeric`);
  }
  return v;
}

export function str(p: Params, key: string): string {
  const v = p[key];
  if (typeof v !== 'string') throw new Error(`template param '${key}' missing or non-string`);
  return v;
}

// ---------------------------------------------------------------------------
// Rational-number arithmetic (exact — never floats)
// ---------------------------------------------------------------------------

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export interface Frac {
  n: number;
  d: number;
}

/** Canonical signed number: −0 collapses to 0, so no surface ever renders "-0". */
export function canonicalSigned(n: number): number {
  return n === 0 ? 0 : n;
}

/**
 * Reduce to lowest terms with a positive denominator — the NORMALISATION every
 * signed result funnels through, which is why "-3/4" is the only surface the
 * library can produce and "3/-4" is unrepresentable.
 *
 * `canonicalSigned` on the numerator kills negative zero: `(-1 * 0) / g` is −0
 * in JS, so reduceFrac(0, −5) and mulFrac(anything, 0/−d) used to hand back a
 * Frac whose numerator was −0. Every STRING surface hid it (`String(-0)` is
 * "0"), but the value compared unequal under `Object.is` and inverted to
 * −Infinity — a trap laid for the first caller to divide by it. Unreachable for
 * non-negative inputs (a positive denominator never sets sign = −1).
 */
export function reduceFrac(n: number, d: number): Frac {
  if (d === 0) throw new Error('zero denominator');
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: canonicalSigned((sign * n) / g), d: (sign * d) / g };
}

export function addFrac(a: Frac, b: Frac): Frac {
  return reduceFrac(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function subFrac(a: Frac, b: Frac): Frac {
  return reduceFrac(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mulFrac(a: Frac, b: Frac): Frac {
  return reduceFrac(a.n * b.n, a.d * b.d);
}

export function divFrac(a: Frac, b: Frac): Frac {
  // Named before the generic 'zero denominator' throw fires: dividing BY zero and
  // constructing a fraction OVER zero are different authoring mistakes, and the
  // signed audit made the difference matter (a sign-flip bug and a divide-by-zero
  // bug produce the same reduceFrac message otherwise).
  if (b.n === 0) throw new Error('division by a zero fraction');
  return reduceFrac(a.n * b.d, a.d * b.n);
}

/**
 * Exact three-way comparison of two rationals — the operation the library was
 * MISSING (signed audit, G5). Comparison is where signed arithmetic breaks in
 * practice: `a.n * b.d - b.n * a.d` reads correctly only once both denominators
 * are positive, so a fraction carrying its sign on the denominator (3/-4) would
 * otherwise compare backwards. Normalising through `reduceFrac` first makes that
 * impossible, and the comparison itself stays on integers — never a float.
 *
 * Returns -1 (a < b), 0 (equal), 1 (a > b), so `sort(cmpFrac)` orders ascending
 * and −8 < −3 comes out of the same code path that says 8 > 3.
 */
export function cmpFrac(a: Frac, b: Frac): -1 | 0 | 1 {
  const x = reduceFrac(a.n, a.d);
  const y = reduceFrac(b.n, b.d);
  const left = x.n * y.d;
  const right = y.n * x.d;
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Canonical fraction string: whole number when integral, mixed number when
 * improper (|n| > d), else a reduced proper fraction. The validator's
 * equivalent-fraction audit compares NUMERIC VALUE, so any equivalent surface
 * passes; this just picks the natural teaching form.
 */
export function formatFrac(f: Frac): string {
  const { n, d } = reduceFrac(f.n, f.d);
  if (d === 1) return String(n);
  const sign = n < 0 ? '-' : '';
  const an = Math.abs(n);
  if (an > d) {
    const whole = Math.floor(an / d);
    const rem = an % d;
    return rem === 0 ? `${sign}${whole}` : `${sign}${whole} ${rem}/${d}`;
  }
  return `${sign}${an}/${d}`;
}

// ---------------------------------------------------------------------------
// Decimal arithmetic (exact — computed on scaled integers, never floats)
// ---------------------------------------------------------------------------

interface Dec {
  /** Integer mantissa; value = int / 10^scale. */
  int: number;
  scale: number;
}

export function parseDec(s: string): Dec {
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s.trim());
  if (!m) throw new Error(`bad decimal '${s}'`);
  const sign = m[1] === '-' ? -1 : 1;
  const frac = m[3] ?? '';
  const int = sign * Number(m[2] + frac);
  return { int, scale: frac.length };
}

function align(a: Dec, b: Dec): [number, number, number] {
  const scale = Math.max(a.scale, b.scale);
  return [a.int * 10 ** (scale - a.scale), b.int * 10 ** (scale - b.scale), scale];
}

/** Format a scaled integer back to a trimmed decimal string. */
export function formatDec(int: number, scale: number): string {
  if (scale <= 0) return String(int);
  const sign = int < 0 ? '-' : '';
  let digits = String(Math.abs(int)).padStart(scale + 1, '0');
  let whole = digits.slice(0, digits.length - scale);
  let frac = digits.slice(digits.length - scale).replace(/0+$/, '');
  return frac ? `${sign}${whole}.${frac}` : `${sign}${whole}`;
}

export function addDec(a: string, b: string): string {
  const [ai, bi, s] = align(parseDec(a), parseDec(b));
  return formatDec(ai + bi, s);
}

export function subDec(a: string, b: string): string {
  const [ai, bi, s] = align(parseDec(a), parseDec(b));
  return formatDec(ai - bi, s);
}

export function mulDec(a: string, b: string): string {
  const da = parseDec(a);
  const db = parseDec(b);
  return formatDec(da.int * db.int, da.scale + db.scale);
}

/** Exact decimal ÷ whole number (generators only ever produce exact cases). */
export function divDecByWhole(a: string, whole: number): string {
  const da = parseDec(a);
  // Increase scale until the division is exact (bounded — inputs are exact).
  for (let extra = 0; extra <= 6; extra++) {
    const scaled = da.int * 10 ** extra;
    if (scaled % whole === 0) return formatDec(scaled / whole, da.scale + extra);
  }
  throw new Error(`non-terminating decimal division ${a} / ${whole}`);
}

/** Exact fraction → terminating decimal (generators restrict to terminating d). */
export function fracToDec(n: number, d: number): string {
  for (let scale = 0; scale <= 6; scale++) {
    const scaled = n * 10 ** scale;
    if (scaled % d === 0) return formatDec(scaled / d, scale);
  }
  throw new Error(`non-terminating fraction ${n}/${d}`);
}

/** Decimal string → reduced fraction string. */
export function decToFrac(value: string): string {
  const d = parseDec(value);
  return formatFrac(reduceFrac(d.int, 10 ** d.scale));
}

/**
 * SIGNED-SAFE rounding (audit fix, G5). `Math.round` breaks the tie toward +∞
 * (`Math.round(-2.5) === -2`), so the old body rounded +0.25 AWAY from zero and
 * −0.25 TOWARD it — two different rules on the two sides of the number line,
 * which is not the rule any school teaches and would have made "round −2.5" a
 * coin flip in Level E. Rounding the MAGNITUDE and re-applying the sign gives
 * one rule ("half away from zero") on both sides.
 *
 * Non-negative inputs are untouched: for n ≥ 0, `Math.abs(n) === n`, so this is
 * `Math.round` exactly as before (proved bit-for-bit by the audit's regression
 * grid and by the corpus hash check).
 */
export function roundDec(value: string, places: number): string {
  const d = parseDec(value);
  if (d.scale <= places) return formatDec(d.int * 10 ** (places - d.scale), places);
  const drop = d.scale - places;
  const factor = 10 ** drop;
  const q = Math.round(Math.abs(d.int) / factor);
  return formatDec(d.int < 0 ? -q : q, places);
}

/** Round an integer to the nearest 10^k (k = "place": 1,2,3,...), half away from zero. */
export function roundInt(n: number, place: number): number {
  const unit = 10 ** place;
  const q = Math.round(Math.abs(n) / unit) * unit;
  // `-q` when q is 0 would hand back negative zero, which renders as "-0" through
  // some surfaces and compares equal through others; canonicalise it here.
  return q === 0 ? 0 : n < 0 ? -q : q;
}

/**
 * Exact three-way comparison of two decimal strings — the decimal twin of
 * `cmpFrac`, and likewise previously missing. Compares on the aligned scaled
 * INTEGERS, so "-0.30" vs "-0.3" is equality and "-8" < "-3" needs no float.
 */
export function cmpDec(a: string, b: string): -1 | 0 | 1 {
  const [ai, bi] = align(parseDec(a), parseDec(b));
  return ai < bi ? -1 : ai > bi ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Multi-step composition — a serializable rational op-chain (FIX-SPEC §4.2/§5).
//
// A multi-step item's answer is COMPOSED from an ordered chain of exact rational
// operations. Because the chain is plain serializable data that ships in
// `generator.params`, three things follow for free:
//   1. stepCount = steps.length is DERIVABLE from params (never a hand-set label,
//      review B5) — the assembler reads it, the generator stamps the same number;
//   2. the registry `answerFor` re-executes the IDENTICAL chain over the same
//      params, so QG-5 audits the composed answer exactly as it audits single-op
//      items (no borrowed single-op templateId that would verify nothing);
//   3. it is TOTAL over its param space (Frac ops never throw on the operands the
//      generators produce; no non-terminating-division escape hatch).
// Whole numbers are Frac with d = 1, so one evaluator covers whole-number and
// fraction multi-step problems alike.
// ---------------------------------------------------------------------------

export type RatOp = 'add' | 'sub' | 'mul' | 'div';

export interface RatStep {
  op: RatOp;
  /** Operand numerator. */
  n: number;
  /** Operand denominator (1 for whole numbers). */
  d: number;
}

/** Fold an ordered rational op-chain from an initial value; exact throughout. */
export function evalRatChain(initN: number, initD: number, steps: RatStep[]): Frac {
  let acc: Frac = reduceFrac(initN, initD);
  for (const s of steps) {
    const b: Frac = { n: s.n, d: s.d };
    acc = s.op === 'add' ? addFrac(acc, b)
      : s.op === 'sub' ? subFrac(acc, b)
      : s.op === 'mul' ? mulFrac(acc, b)
      : divFrac(acc, b);
  }
  return acc;
}

/** answerFor for the generic multi-step rational chain. */
function multistepRat(p: Params): string {
  const steps = p.steps;
  if (!Array.isArray(steps)) throw new Error('multistep chain missing steps[]');
  return formatFrac(evalRatChain(num(p, 'initN'), num(p, 'initD'), steps as RatStep[]));
}

/** Decimal op-chain — same shape as RatStep but exact scaled-integer decimals,
 *  so a multi-step DECIMAL word problem displays a decimal answer (not a fraction). */
export interface DecStep {
  op: RatOp;
  /** Operand as a decimal string ('0.5'); for 'div' it must be a whole number. */
  v: string;
}

export function evalDecChain(init: string, steps: DecStep[]): string {
  let acc = init;
  for (const s of steps) {
    acc = s.op === 'add' ? addDec(acc, s.v)
      : s.op === 'sub' ? subDec(acc, s.v)
      : s.op === 'mul' ? mulDec(acc, s.v)
      : divDecByWhole(acc, Number(s.v));
  }
  return acc;
}

function multistepDec(p: Params): string {
  const steps = p.steps;
  if (!Array.isArray(steps)) throw new Error('multistep decimal chain missing steps[]');
  return evalDecChain(str(p, 'init'), steps as DecStep[]);
}

// ---------------------------------------------------------------------------
// Concept-specific misconception verifies (error-analysis, all levels).
// The "wrong" value is a NAMED misconception's real output, computed by code —
// never fabricated (the D8 class). Reusable across the fraction/decimal weeks.
// ---------------------------------------------------------------------------

/** Fraction add/sub/× with a named misconception. Modes:
 *  tops-bottoms = (n1±n2)/(d1±d2); wrong-op-add/-mul = did the wrong operation;
 *  num-only = combined numerators but kept the first denominator (forgot to rename). */
function verifyFrac(p: Params): VerifyResult {
  const a: Frac = { n: num(p, 'n1'), d: num(p, 'd1') };
  const b: Frac = { n: num(p, 'n2'), d: num(p, 'd2') };
  const op = str(p, 'op');
  const correct = op === '+' ? addFrac(a, b) : op === '-' ? subFrac(a, b) : mulFrac(a, b);
  const mode = str(p, 'wrongMode');
  let wrong: Frac;
  switch (mode) {
    case 'tops-bottoms':
      wrong = reduceFrac(op === '-' ? a.n - b.n : a.n + b.n, op === '*' ? a.d * b.d : a.d + b.d);
      break;
    case 'wrong-op-add': wrong = addFrac(a, b); break;
    case 'wrong-op-mul': wrong = mulFrac(a, b); break;
    case 'num-only': wrong = reduceFrac(op === '-' ? a.n - b.n : a.n + b.n, a.d); break;
    default: throw new Error(`bad frac wrongMode '${mode}'`);
  }
  return { correct: formatFrac(correct), wrong: formatFrac(wrong) };
}

/** Decimal add/sub/× with a named misconception. Modes:
 *  right-align = added as if right-justified (ignores the point); wrong-op-* = wrong op;
 *  point-drop = multiplied the digits but dropped the decimal point (whole-number result). */
function verifyDec(p: Params): VerifyResult {
  const a = str(p, 'a');
  const b = str(p, 'b');
  const op = str(p, 'op');
  const correct = op === '+' ? addDec(a, b) : op === '-' ? subDec(a, b) : mulDec(a, b);
  const mode = str(p, 'wrongMode');
  let wrong: string;
  switch (mode) {
    case 'right-align': {
      // Treat both as their digit strings right-justified (the classic misalignment):
      // strip points, operate as integers, then reattach the LONGER scale.
      const da = parseDec(a);
      const db = parseDec(b);
      // SIGNED GUARD (audit): this mode models a DIGIT-STRING slip, so it works on
      // magnitudes — with a negative operand it silently returned a sign-free value
      // (verifyDec('-1.5','0.25','+') gave "0.4"), i.e. a "misconception output" no
      // child could produce. There is no honest signed reading of right-justifying
      // a signed decimal, so the mode refuses the input instead of inventing one.
      if (da.int < 0 || db.int < 0) {
        throw new Error(`dec wrongMode 'right-align' models a digit-string slip and is undefined for signed operands (${a}, ${b})`);
      }
      const scale = Math.max(da.scale, db.scale);
      const ai = Math.abs(da.int);
      const bi = Math.abs(db.int);
      const raw = op === '-' ? ai - bi : ai + bi;
      wrong = formatDec(raw, scale);
      break;
    }
    case 'wrong-op-add': wrong = addDec(a, b); break;
    case 'wrong-op-sub': wrong = subDec(a, b); break;
    case 'point-drop': {
      const da = parseDec(a);
      const db = parseDec(b);
      wrong = String(da.int * db.int); // multiplied digits, dropped the point entirely
      break;
    }
    default: throw new Error(`bad dec wrongMode '${mode}'`);
  }
  return { correct, wrong };
}

// ---------------------------------------------------------------------------
// Template answerFor definitions (consumed by registry.ts → QG-5 audit)
// ---------------------------------------------------------------------------

/** Minimal shape structurally compatible with registry.TemplateDef. */
export interface AnswerDef {
  id: string;
  answerFor?: (params: Params) => string;
}

/**
 * Division-with-remainder as an ordered pair "q, r" (ordered-list validation),
 * so the QG-5 ordered-list audit re-checks both numbers.
 */
function divRem(p: Params): string {
  const a = num(p, 'a');
  const b = num(p, 'b');
  assertSharingOperands(a, b, 'd_div_rem_v1');
  return `${Math.floor(a / b)}, ${a % b}`;
}

/**
 * SIGNED GUARD (audit) for the two remainder templates. `Math.floor(a/b)` is
 * FLOOR division while JS `%` is TRUNCATED remainder — agreeing only when both
 * operands are non-negative. Fed a = −7, b = 2 they returned "−4, −1", a (q, r)
 * pair that satisfies no division identity (−4 × 2 + −1 = −9, not −7) and a
 * "leftover" no sharing story can mean. Both templates model fair-sharing of
 * real objects, so a signed operand is an authoring error, and it says so.
 */
function assertSharingOperands(a: number, b: number, id: string): void {
  if (a < 0 || b <= 0) {
    throw new Error(`${id}: remainder templates model fair sharing of whole objects — need a ≥ 0 and b > 0, got a=${a}, b=${b}`);
  }
}

/** Interpreted-remainder word answer: mode picks how the remainder is used. */
function interpretRemainder(p: Params): string {
  const a = num(p, 'a');
  const b = num(p, 'b');
  assertSharingOperands(a, b, 'd_interpret_rem_v1');
  const q = Math.floor(a / b);
  const r = a % b;
  switch (str(p, 'mode')) {
    case 'round-up':
      return String(r > 0 ? q + 1 : q);
    case 'drop':
      return String(q);
    case 'remainder':
      return String(r);
    case 'exact':
      return String(a / b);
    default:
      throw new Error(`bad remainder mode`);
  }
}

/** Arithmetic-sequence nth term (1-based). */
function patternTerm(p: Params): string {
  return String(num(p, 'start') + num(p, 'step') * (num(p, 'k') - 1));
}

/** Angle relationships: supplementary / complementary / triangle-third. */
function angle(p: Params): string {
  switch (str(p, 'rel')) {
    case 'supplementary':
      return String(180 - num(p, 'a'));
    case 'complementary':
      return String(90 - num(p, 'a'));
    case 'triangle':
      return String(180 - num(p, 'a') - num(p, 'b'));
    default:
      throw new Error('bad angle rel');
  }
}

// ---------------------------------------------------------------------------
// Verify truths (FIX-SPEC §5 / §7 QG-11) — recompute the CORRECT answer of an
// embedded-claim item (discrimination / error-analysis) from its serializable
// `generator.params`, so QG-11 can confirm the option keyed `isCorrect` (or the
// item's stated true answer) is actually true, and that an error-analysis
// item's "wrong" number is a genuine misconception output — never fabricated
// (the D6 / D8 bug classes). Truth functions live beside `answerFor` and are
// registered on the same TemplateDef via `verifyFor`.
// ---------------------------------------------------------------------------

export interface VerifyResult {
  /** Canonical correct value the `isCorrect` option / stated true answer must carry. */
  correct: string;
  /** Error-analysis only: the genuine misconception output that must appear as the shown "wrong" value. */
  wrong?: string;
}

export interface VerifyDef {
  id: string;
  verifyFor: (params: Params) => VerifyResult;
}

function binop(a: number, b: number, op: string): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
    default: throw new Error(`bad binop '${op}'`);
  }
}

// ---------------------------------------------------------------------------
// Signed / integer misconception verifies (G5 — E6…E9).
//
// WHY THEY LIVE HERE and not in lib/integers.ts with the rest of the family:
// `erroranalysis.ts` resolves `verifyTemplateId` against LIB_VERIFY_DEFS ONLY
// (`const VERIFY = new Map(LIB_VERIFY_DEFS…)`), so a verify template registered
// anywhere else is invisible to the error-analysis primitive. The family's
// `answerFor` templates stay in integers.ts; only these four truths have to sit
// on the shared list. Each one REFUSES params that do not actually exhibit its
// misconception (wrong === correct throws), so an error-analysis item can never
// show a "student error" that is really the right answer.
// ---------------------------------------------------------------------------

/** The ordered-pair surface every coordinate template renders: "(-3, 2)". */
export function formatPoint(x: number, y: number): string {
  return `(${canonicalSigned(x)}, ${canonicalSigned(y)})`;
}

/** Order comparison vs the "bigger digits win" misconception (−8 > −3). */
function verifyIntCompare(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  if (a === b) throw new Error('e_verify_int_compare_v1: the two values are equal — nothing to order');
  if (Math.abs(a) === Math.abs(b)) {
    throw new Error(`e_verify_int_compare_v1: |${a}| = |${b}|, so the magnitude misconception has no output`);
  }
  const correct = cmpFrac({ n: a, d: 1 }, { n: b, d: 1 }) > 0 ? a : b;
  const wrong = Math.abs(a) > Math.abs(b) ? a : b;
  if (wrong === correct) {
    throw new Error(`e_verify_int_compare_v1: (${a}, ${b}) does not exhibit the misconception — the bigger magnitude IS the bigger number`);
  }
  return { correct: String(canonicalSigned(correct)), wrong: String(canonicalSigned(wrong)) };
}

/** Signed add/sub vs a named misconception. Modes:
 *  add-magnitudes = ignored the signs and combined the digits, keeping the first
 *  sign (−5 + 3 → −8); minus-negative-as-minus = read −(−n) as one subtraction
 *  (5 − (−3) → 2); sign-dropped = computed the size and lost the sign. */
function verifyIntAddSub(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const op = str(p, 'op');
  if (op !== '+' && op !== '-') throw new Error(`e_verify_int_addsub_v1: op must be '+' or '-', got '${op}'`);
  const correct = op === '+' ? a + b : a - b;
  const mode = str(p, 'wrongMode');
  let wrong: number;
  switch (mode) {
    case 'add-magnitudes':
      if (op !== '+') throw new Error("e_verify_int_addsub_v1: 'add-magnitudes' describes an addition");
      wrong = (a < 0 ? -1 : 1) * (Math.abs(a) + Math.abs(b));
      break;
    case 'minus-negative-as-minus':
      if (op !== '-' || b >= 0) {
        throw new Error("e_verify_int_addsub_v1: 'minus-negative-as-minus' needs a subtraction of a negative");
      }
      wrong = a - Math.abs(b);
      break;
    case 'sign-dropped':
      wrong = Math.abs(correct);
      break;
    default:
      throw new Error(`e_verify_int_addsub_v1: bad wrongMode '${mode}'`);
  }
  if (wrong === correct) {
    throw new Error(`e_verify_int_addsub_v1: mode '${mode}' returns the TRUE answer for (${a}, ${b}) — pick operands that exhibit it`);
  }
  return { correct: String(canonicalSigned(correct)), wrong: String(canonicalSigned(wrong)) };
}

/** Signed × / ÷ vs a named misconception (neg × neg kept negative; sign dropped). */
function verifyIntMulDiv(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const op = str(p, 'op');
  if (op !== '*' && op !== '/') throw new Error(`e_verify_int_mul_v1: op must be '*' or '/', got '${op}'`);
  if (op === '/') {
    if (b === 0) throw new Error('e_verify_int_mul_v1: division by zero');
    if (a % b !== 0) throw new Error(`e_verify_int_mul_v1: ${a} ÷ ${b} is not exact — integer templates divide exactly`);
  }
  const correct = op === '*' ? a * b : a / b;
  const mode = str(p, 'wrongMode');
  let wrong: number;
  switch (mode) {
    case 'neg-times-neg-is-neg':
      if (!(a < 0 && b < 0)) throw new Error('e_verify_int_mul_v1: this misconception needs two negative operands');
      wrong = -Math.abs(correct);
      break;
    case 'sign-dropped':
      wrong = Math.abs(correct);
      break;
    default:
      throw new Error(`e_verify_int_mul_v1: bad wrongMode '${mode}'`);
  }
  if (wrong === correct) {
    throw new Error(`e_verify_int_mul_v1: mode '${mode}' returns the TRUE answer for (${a}, ${b}) — pick operands that exhibit it`);
  }
  return { correct: String(canonicalSigned(correct)), wrong: String(canonicalSigned(wrong)) };
}

/** Coordinate-pair truths: the x/y swap, and reflecting the wrong coordinate. */
function verifyPoint(p: Params): VerifyResult {
  const x = num(p, 'x');
  const y = num(p, 'y');
  const mode = str(p, 'mode');
  switch (mode) {
    case 'swap':
      if (x === y) throw new Error('e_verify_point_v1: a point on y = x cannot show the swap');
      return { correct: formatPoint(x, y), wrong: formatPoint(y, x) };
    case 'reflect-x':
      if (y === 0 || x === 0) throw new Error('e_verify_point_v1: reflection needs a point off both axes');
      return { correct: formatPoint(x, -y), wrong: formatPoint(-x, y) };
    case 'reflect-y':
      if (y === 0 || x === 0) throw new Error('e_verify_point_v1: reflection needs a point off both axes');
      return { correct: formatPoint(-x, y), wrong: formatPoint(x, -y) };
    default:
      throw new Error(`e_verify_point_v1: bad mode '${mode}'`);
  }
}

/** All verify (QG-11 truth) templates, keyed by templateId. */
export const LIB_VERIFY_DEFS: VerifyDef[] = [
  // Single binary operation truth (discrimination: which op applies?).
  {
    id: 'd_verify_binop_v1',
    verifyFor: (p) => ({ correct: String(binop(num(p, 'a'), num(p, 'b'), str(p, 'op'))) }),
  },
  // True op vs a named misconception op (error-analysis: correct + the shown wrong).
  {
    id: 'd_verify_binop_misconception_v1',
    verifyFor: (p) => ({
      correct: String(binop(num(p, 'a'), num(p, 'b'), str(p, 'op'))),
      wrong: String(binop(num(p, 'a'), num(p, 'b'), str(p, 'wrongOp'))),
    }),
  },
  // Multi-step rational chain truth (multi-step-based discrimination / error-analysis).
  {
    id: 'd_verify_ratchain_v1',
    verifyFor: (p) => {
      const steps = p.steps;
      if (!Array.isArray(steps)) throw new Error('verify chain missing steps[]');
      return { correct: formatFrac(evalRatChain(num(p, 'initN'), num(p, 'initD'), steps as RatStep[])) };
    },
  },
  // Division-with-remainder truth (error-analysis on a claimed "q R r").
  {
    id: 'd_verify_remainder_v1',
    verifyFor: (p) => {
      const a = num(p, 'a');
      const b = num(p, 'b');
      return { correct: `${Math.floor(a / b)} R ${a % b}` };
    },
  },
  // Fraction misconception truth (tops-and-bottoms, wrong-op, forgot-to-rename).
  { id: 'd_verify_frac_v1', verifyFor: verifyFrac },
  // Decimal misconception truth (right-align, wrong-op, point-drop).
  { id: 'd_verify_dec_v1', verifyFor: verifyDec },
  // --- Signed / integer truths (G5, E6–E9) ---------------------------------
  // Integer order vs "bigger digits win" (−8 > −3).
  { id: 'e_verify_int_compare_v1', verifyFor: verifyIntCompare },
  // Signed ± vs adding magnitudes (−5 + 3 = −8) / minus-a-negative.
  { id: 'e_verify_int_addsub_v1', verifyFor: verifyIntAddSub },
  // Signed × ÷ vs neg × neg = neg / sign dropped.
  { id: 'e_verify_int_mul_v1', verifyFor: verifyIntMulDiv },
  // Coordinate pair vs the x/y swap and the wrong-coordinate reflection.
  { id: 'e_verify_point_v1', verifyFor: verifyPoint },
];

/** All Level-D deterministic templates, keyed by templateId. */
export const LIB_TEMPLATE_DEFS: AnswerDef[] = [
  { id: 'd_multistep_rat_v1', answerFor: multistepRat },
  { id: 'd_multistep_dec_v1', answerFor: multistepDec },
  // --- Whole-number place value / rounding ---------------------------------
  { id: 'd_pv_expand_v1', answerFor: (p) => String(num(p, 'value')) },
  { id: 'd_pv_digit_value_v1', answerFor: (p) => String(num(p, 'digit') * 10 ** num(p, 'place')) },
  { id: 'd_round_v1', answerFor: (p) => String(roundInt(num(p, 'n'), num(p, 'place'))) },
  { id: 'd_pv_compare_v1' }, // choice
  // --- Whole-number arithmetic ---------------------------------------------
  { id: 'd_add_v1', answerFor: (p) => String(num(p, 'a') + num(p, 'b')) },
  { id: 'd_sub_v1', answerFor: (p) => String(num(p, 'a') - num(p, 'b')) },
  { id: 'd_mul_v1', answerFor: (p) => String(num(p, 'a') * num(p, 'b')) },
  { id: 'd_div_v1', answerFor: (p) => String(num(p, 'a') / num(p, 'b')) },
  { id: 'd_div_rem_v1', answerFor: divRem },
  { id: 'd_interpret_rem_v1', answerFor: interpretRemainder },
  { id: 'd_mul_compare_v1', answerFor: (p) => String(num(p, 'a') * num(p, 'k')) },
  // --- Number theory --------------------------------------------------------
  { id: 'd_factor_pair_v1', answerFor: (p) => String(num(p, 'n') / num(p, 'f')) },
  { id: 'd_prime_v1' }, // choice
  { id: 'd_multiple_v1', answerFor: (p) => String(num(p, 'base') * num(p, 'k')) },
  // --- Fractions ------------------------------------------------------------
  { id: 'd_frac_equiv_v1', answerFor: (p) => String((num(p, 'n1') * num(p, 'd2')) / num(p, 'd1')) },
  { id: 'd_frac_compare_v1' }, // choice
  {
    id: 'd_frac_like_v1',
    answerFor: (p) =>
      formatFrac(
        num(p, 'op') === -1
          ? subFrac({ n: num(p, 'n1'), d: num(p, 'd') }, { n: num(p, 'n2'), d: num(p, 'd') })
          : addFrac({ n: num(p, 'n1'), d: num(p, 'd') }, { n: num(p, 'n2'), d: num(p, 'd') }),
      ),
  },
  {
    id: 'd_frac_unlike_v1',
    answerFor: (p) =>
      formatFrac(
        num(p, 'op') === -1
          ? subFrac({ n: num(p, 'n1'), d: num(p, 'd1') }, { n: num(p, 'n2'), d: num(p, 'd2') })
          : addFrac({ n: num(p, 'n1'), d: num(p, 'd1') }, { n: num(p, 'n2'), d: num(p, 'd2') }),
      ),
  },
  {
    id: 'd_frac_times_whole_v1',
    answerFor: (p) => formatFrac(mulFrac({ n: num(p, 'k'), d: 1 }, { n: num(p, 'n'), d: num(p, 'd') })),
  },
  {
    id: 'd_frac_times_frac_v1',
    answerFor: (p) =>
      formatFrac(mulFrac({ n: num(p, 'n1'), d: num(p, 'd1') }, { n: num(p, 'n2'), d: num(p, 'd2') })),
  },
  {
    id: 'd_frac_div_v1',
    answerFor: (p) =>
      formatFrac(divFrac({ n: num(p, 'n1'), d: num(p, 'd1') }, { n: num(p, 'n2'), d: num(p, 'd2') })),
  },
  // --- Decimals -------------------------------------------------------------
  { id: 'd_dec_compare_v1' }, // choice
  { id: 'd_dec_pv_v1', answerFor: (p) => String(num(p, 'digit')) },
  { id: 'd_dec_round_v1', answerFor: (p) => roundDec(str(p, 'value'), num(p, 'places')) },
  { id: 'd_dec_addsub_v1', answerFor: (p) => (num(p, 'op') === -1 ? subDec(str(p, 'a'), str(p, 'b')) : addDec(str(p, 'a'), str(p, 'b'))) },
  { id: 'd_dec_mul_v1', answerFor: (p) => mulDec(str(p, 'a'), str(p, 'b')) },
  { id: 'd_dec_div_v1', answerFor: (p) => divDecByWhole(str(p, 'a'), num(p, 'b')) },
  { id: 'd_frac_to_dec_v1', answerFor: (p) => fracToDec(num(p, 'n'), num(p, 'd')) },
  { id: 'd_dec_to_frac_v1', answerFor: (p) => decToFrac(str(p, 'value')) },
  // --- Expressions ----------------------------------------------------------
  { id: 'd_eval_expr_v1', answerFor: (p) => String(num(p, 'value')) },
  { id: 'd_write_expr_v1' }, // choice
  // --- Patterns / coordinate ------------------------------------------------
  { id: 'd_pattern_term_v1', answerFor: patternTerm },
  { id: 'd_plot_v1' }, // choice
  // --- Geometry -------------------------------------------------------------
  { id: 'd_angle_v1', answerFor: angle },
  { id: 'd_triangle_v1' }, // choice
  { id: 'd_volume_v1', answerFor: (p) => String(num(p, 'l') * num(p, 'w') * num(p, 'h')) },
  { id: 'd_area_v1', answerFor: (p) => String(num(p, 'l') * num(p, 'w')) },
];
