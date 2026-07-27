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

/** Reduce to lowest terms with a positive denominator. */
export function reduceFrac(n: number, d: number): Frac {
  if (d === 0) throw new Error('zero denominator');
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (sign * n) / g, d: (sign * d) / g };
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
  return reduceFrac(a.n * b.d, a.d * b.n);
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

export function roundDec(value: string, places: number): string {
  const d = parseDec(value);
  if (d.scale <= places) return formatDec(d.int * 10 ** (places - d.scale), places);
  const drop = d.scale - places;
  const factor = 10 ** drop;
  const q = Math.round(d.int / factor);
  return formatDec(q, places);
}

/** Round an integer to the nearest 10^k (k = "place": 1,2,3,...). */
export function roundInt(n: number, place: number): number {
  const unit = 10 ** place;
  return Math.round(n / unit) * unit;
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
  return `${Math.floor(a / b)}, ${a % b}`;
}

/** Interpreted-remainder word answer: mode picks how the remainder is used. */
function interpretRemainder(p: Params): string {
  const a = num(p, 'a');
  const b = num(p, 'b');
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
