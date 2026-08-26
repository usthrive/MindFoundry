/**
 * Surface-rendering authority (POLISH-PASS-SPEC §P1/P2/P5/P6).
 *
 * THE RULE (FANOUT-AUTHORING-KIT §A): a prompt never interpolates a raw quantity,
 * unit, price or article with a bare `${…}` — it calls a formatter here. The
 * QG-12 validator family is the backstop that proves no template bypassed this;
 * these functions are the actual guarantee.
 *
 * Why a rendering layer at all: the arithmetic was never wrong — `compute.ts`
 * computes exact values and the validator re-derives them — but a *correct value*
 * can still be *presented* impossibly ("$0.5", "2/4 cup of flour", "1 liters",
 * "433606" in the very week that teaches reading numbers in groups of three).
 * Presentation is content: a parent reads the surface, not the params.
 *
 * INVARIANT — never touch the canonical value. `answer.value` and
 * `generator.params` keep the canonical `compute.ts` forms (trimmed decimals such
 * as "0.3"), so QG-5 re-derivation stays bit-exact. Formatting applies to PROSE
 * and to `acceptableForms` only.
 */

import { gcd } from './compute';

// ---------------------------------------------------------------------------
// Money (P1)
// ---------------------------------------------------------------------------

/**
 * A money amount, always at exactly two decimal places: `money('0.7') → "$0.70"`.
 *
 * Currency has a fixed minor unit, so a price is never written to one decimal:
 * "$0.5" is not an amount of money anyone can hand over. The all-or-none rule
 * follows from the same fact — an item that mentions cents anywhere renders every
 * amount with cents ("$1.00" beside "$0.20"), the way a receipt does.
 * Denominations are the one exception; see `bill()`.
 */
export function money(value: string | number): string {
  return `$${moneyBare(value)}`;
}

/** The 2-decimal amount without the sign — for `acceptableForms` and prose that already carries a currency word. */
export function moneyBare(value: string | number): string {
  const s = typeof value === 'number' ? String(value) : value.trim();
  const m = /^(-?)(\d+)(?:\.(\d*))?$/.exec(s);
  if (!m) throw new Error(`money(): not a decimal amount '${value}'`);
  const cents = (m[3] ?? '').slice(0, 2).padEnd(2, '0');
  if ((m[3] ?? '').length > 2) throw new Error(`money(): '${value}' is finer than one cent`);
  return `${m[1]}${m[2]}.${cents}`;
}

/**
 * A bill/note DENOMINATION — a named object ("a $10 bill"), not an amount, so it
 * keeps its bare form and is exempt from the all-or-none cents rule.
 * (Refinement of POLISH-PASS-SPEC §P1 made during B0.1: "$10.00 bill" is not
 * English. QG-12a whitelists `$N` when followed by bill/note/coin.)
 */
export function bill(n: number): string {
  if (!Number.isInteger(n)) throw new Error(`bill(): denominations are whole dollars, got ${n}`);
  return `$${n}`;
}

/**
 * A whole-dollar amount, for items where NO amount anywhere has cents
 * (D2/D4/D5/D15 shop and ticket prices). Throws on a fractional input so a
 * cents-bearing amount cannot silently render as bare dollars.
 */
export function wholeMoney(n: number): string {
  if (!Number.isInteger(n)) throw new Error(`wholeMoney(): ${n} has cents — use money()`);
  return `$${fmtInt(n)}`;
}

/**
 * Acceptable surface forms for a money-valued answer whose canonical value is a
 * trimmed decimal ("0.3"). `checkAnswer` matches "$0.30" only by exact surface,
 * so the rendered form must be enumerated; the bare numeric forms already pass
 * through `numericEqual`, and are listed for clarity.
 */
export function moneyForms(canonical: string): string[] {
  const bare = moneyBare(canonical);
  return [money(canonical), bare, `${bare} dollars`];
}

/** True when a `units` string means "this answer is an amount of money". */
export function isMoneyUnit(units: string): boolean {
  return /^(dollars?|cents?)$/i.test(units.trim());
}

/**
 * Default accepted surface forms for a computed answer with a unit — the single
 * place that decides whether an answer is money-shaped or count-shaped, so no
 * week has to remember either rule.
 */
export function valueForms(canonical: string, units: string): string[] {
  return isMoneyUnit(units) ? moneyForms(canonical) : [countNoun(canonical, units)];
}

// ---------------------------------------------------------------------------
// Grammar (P5)
// ---------------------------------------------------------------------------

/** Units written as symbols never inflect: "1 km", "7 km". */
const INVARIANT_UNITS = new Set(['km', 'm', 'cm', 'mm', 'kg', 'g', 'mg', 'l', 'ml', 'in', 'ft', 'yd', 'oz', 'lb', '°', 'c', 'f']);

/** Plurals the +s rule gets wrong, keyed by singular. */
const IRREGULAR_PLURAL: Record<string, string> = {
  box: 'boxes', bus: 'buses', glass: 'glasses', dish: 'dishes', batch: 'batches',
  bench: 'benches', inch: 'inches', patch: 'patches', sandwich: 'sandwiches',
  foot: 'feet', half: 'halves', shelf: 'shelves', loaf: 'loaves', leaf: 'leaves',
  penny: 'pennies', berry: 'berries', cherry: 'cherries', story: 'stories',
  party: 'parties', body: 'bodies', city: 'cities', pony: 'ponies', puppy: 'puppies',
  person: 'people', child: 'children', mouse: 'mice',
};
/** Reverse map, for singularising a plural unit supplied by a week blueprint. */
const IRREGULAR_SINGULAR: Record<string, string> = Object.fromEntries(
  Object.entries(IRREGULAR_PLURAL).map(([s, p]) => [p, s]),
);

function pluralOf(singular: string): string {
  const key = singular.toLowerCase();
  if (INVARIANT_UNITS.has(key)) return singular;
  if (IRREGULAR_PLURAL[key]) return IRREGULAR_PLURAL[key];
  if (/(s|x|z|ch|sh)$/i.test(singular)) return `${singular}es`;
  if (/[^aeiou]y$/i.test(singular)) return `${singular.slice(0, -1)}ies`;
  return `${singular}s`;
}

function singularOf(plural: string): string {
  const key = plural.toLowerCase();
  if (INVARIANT_UNITS.has(key)) return plural;
  if (IRREGULAR_SINGULAR[key]) return IRREGULAR_SINGULAR[key];
  if (/ies$/i.test(plural)) return `${plural.slice(0, -3)}y`;
  if (/(ses|xes|zes|ches|shes)$/i.test(plural)) return plural.slice(0, -2);
  if (/s$/i.test(plural) && !/ss$/i.test(plural)) return plural.slice(0, -1);
  return plural;
}

/**
 * "{count} {unit}" with the unit agreeing: `countNoun(1,'liters') → "1 liter"`,
 * `countNoun(3,'box') → "3 boxes"`, `countNoun(1,'km') → "1 km"`.
 * Accepts the unit in EITHER number — week blueprints carry plural `units`
 * strings, and a drawn count of 1 must not print "1 marbles".
 */
export function countNoun(count: number | string, unit: string): string {
  return `${count} ${unitFor(count, unit)}`;
}

/**
 * The correctly-numbered form of `unit` for `count` (no count prefix).
 * Singular ONLY for a value of exactly one — a mixed number ("1 1/2") or a
 * fraction is plural, as English treats them.
 */
export function unitFor(count: number | string, unit: string): string {
  const isOne = exactlyOne(count);
  const key = unit.toLowerCase();
  if (INVARIANT_UNITS.has(key)) return unit;
  const singular = IRREGULAR_SINGULAR[key] ?? singularOf(unit);
  return isOne ? singular : pluralOf(singular);
}

/**
 * True for a value of MAGNITUDE exactly 1 ("1", 1, "-1", -1) — not "1 1/2",
 * not "1/2", not 1.5.
 *
 * The sign-blind version (n === 1) shipped "-1 centimetres" and QG-12c rightly
 * rejected the pack — 43 of 200 E24 seeds INVALID until that week guarded the
 * value away (e24.ts, the tank gauge). English gives negative one a singular
 * noun ("minus one centimetre"), and every caller of unitFor wants that. The
 * defect was invisible to E6/E8/E9 because their units (cm, m, °) are in
 * INVARIANT_UNITS and never inflect. Fixed 2026-08-25.
 */
function exactlyOne(count: number | string): boolean {
  if (typeof count === 'number') return Math.abs(count) === 1;
  const s = count.trim();
  if (/^-?\d+\s+\d+\/\d+$/.test(s)) return false;         // mixed number
  const frac = /^(-?\d+)\s*\/\s*(\d+)$/.exec(s);
  if (frac) return Number(frac[2]) !== 0 && Math.abs(Number(frac[1]) / Number(frac[2])) === 1;
  const n = Number(s);
  return Number.isFinite(n) && Math.abs(n) === 1;
}

/**
 * "a"/"an" by the SOUND of what follows — including numerals, where the spelling
 * gives no clue: "an 8 cm strip", "an 11 m rope", "a 7 cm strip".
 */
export function an(next: string | number): string {
  const s = String(next).trim();
  if (!s) return 'a';
  const numeral = /^\d+/.exec(s);
  if (numeral) return startsWithVowelSound(numeral[0]) ? 'an' : 'a';
  return /^[aeiou]/i.test(s) ? 'an' : 'a';
}

/** Spoken-form vowel test for a numeral: 8, 11, 18, and any 80–89 begin with a vowel sound. */
function startsWithVowelSound(digits: string): boolean {
  const lead = digits.replace(/^0+(?=\d)/, '');
  if (lead === '8' || lead === '11' || lead === '18') return true;
  if (/^8\d$/.test(lead)) return true;               // eighty…
  if (lead.length > 2 && /^8/.test(lead)) return true; // eight hundred / eight thousand …
  if (lead.length > 2 && /^11/.test(lead)) return true; // eleven hundred / eleven thousand …
  if (lead.length > 2 && /^18/.test(lead)) return true; // eighteen hundred / eighteen thousand …
  return false;
}

/** `an()` with the word attached: `article(8,'cm strip') → "an 8 cm strip"`. */
export function article(next: string | number, rest?: string): string {
  const tail = rest === undefined ? String(next) : `${next} ${rest}`;
  return `${an(next)} ${tail}`;
}

// ---------------------------------------------------------------------------
// Integers (P6) — wired on in B0.7, after the guard/validator prerequisites
// ---------------------------------------------------------------------------

/**
 * Thousands separators for child-facing prose at C+ bands: `fmtInt(433606) →
 * "433,606"`. D1 *teaches* reading big numbers in groups of three and then
 * printed its own operands bare — the engineering convenience ("comma-free
 * surfaces for clean tokenization") was overriding the week's own content law.
 *
 * ENABLED 2026-07-27, after all four §P6 prerequisites landed and were verified
 * green in this order: `checkAnswer.parseNumeric` already stripped separators ·
 * `surface.ts` now matches a grouped literal as ONE token and normalises it, so
 * QG-1/QG-4 signatures are identical either way · `validator.numericValue` strips
 * separators before parsing · QG-11(b)'s anchor matcher already accepted grouped
 * operands. Flipping this before those would have fractured every freshness and
 * isomorph signature in the corpus.
 */
export const GROUP_LARGE_NUMBERS = true;

/**
 * Grouping starts at 1,000 — the convention D1 itself teaches ("read a big number
 * in groups of three"). A higher threshold produced "100,000 + 1000 + 200" inside
 * the place-value week's own expanded-form item, which contradicts the lesson on
 * the same line.
 */
const GROUP_FROM = 1000;

export function fmtInt(n: number): string {
  if (!Number.isFinite(n)) throw new Error(`fmtInt(): ${n}`);
  if (!GROUP_LARGE_NUMBERS || Math.abs(n) < GROUP_FROM) return String(n);
  return n.toLocaleString('en-US');
}

// ---------------------------------------------------------------------------
// Fractions (P2) — the context-sensitive simplification rule
// ---------------------------------------------------------------------------

/**
 * Why a fraction is being shown, which decides whether it may stay unreduced.
 * A blanket "always reduce" rule would destroy the lesson in the equivalence and
 * comparison weeks, where the unreduced form IS the object of study.
 *
 * - `lesson-object`    — the fraction is what the child renames/compares/judges
 *                        ("Which is greater: 1/2 or 2/6?"). PRESERVE.
 * - `partition-anchored` — the prose physically instantiates the denominator
 *                        ("split into 6 equal legs … the 2/6 mark"). PRESERVE:
 *                        2/6 is the honest name of that mark.
 * - `quantity`         — a free real-world amount with no stated partition
 *                        ("2/4 cup of flour"). REDUCE: a recipe card says 1/2 cup.
 */
export type FracRole = 'lesson-object' | 'partition-anchored' | 'quantity';

/** Render `n/d` per its role. Mixed numbers are left to `formatFrac`. */
export function fmtFrac(n: number, d: number, role: FracRole = 'quantity'): string {
  if (d === 0) throw new Error('fmtFrac(): zero denominator');
  if (role !== 'quantity') return `${n}/${d}`;
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  return `${n / g}/${d / g}`;
}

/** The reduced pair, when a draw needs the reduced OPERANDS (not just the text). */
export function reducePair(n: number, d: number): [number, number] {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  return [n / g, d / g];
}

/**
 * A numerator in [1, d-1] sharing no factor with `d`, so the drawn fraction is
 * already in lowest terms. Use in `quantity`-role draws: it keeps the fraction
 * honest at the SOURCE, rather than reducing a fraction the params already
 * committed to (which would desynchronise prose from `generator.params`).
 */
export function coprimeNumerator(r: { int: (lo: number, hi: number) => number }, d: number): number {
  for (let i = 0; i < 40; i++) {
    const n = r.int(1, d - 1);
    if (gcd(n, d) === 1) return n;
  }
  // Deterministic fallback: the largest coprime numerator below d (d ≥ 2 ⇒ exists).
  for (let n = d - 1; n >= 1; n--) if (gcd(n, d) === 1) return n;
  return 1;
}

const PARTITION_WORD: Record<number, string> = {
  2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths', 7: 'sevenths',
  8: 'eighths', 9: 'ninths', 10: 'tenths', 12: 'twelfths', 16: 'sixteenths',
  20: 'twentieths', 25: 'twenty-fifths', 100: 'hundredths',
};

/**
 * The name of a d-way partition ("eighths"), for prose that must STATE the
 * partition it measures in. Naming it is what makes an unreduced fraction
 * honest: "a recipe measured in eighths of a cup … 6/8 cup" is how a cook with
 * an eighth-cup scoop really works, whereas a bare "6/8 cup of flour" is not
 * something any recipe card says. This is the `partition-anchored` role earning
 * its keep — the alternative (reducing) would destroy a like-denominator lesson.
 */
export function partitionWord(d: number): string {
  const w = PARTITION_WORD[d];
  if (!w) throw new Error(`partitionWord(): no name for a ${d}-way partition`);
  return w;
}
