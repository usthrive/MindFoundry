/**
 * QG-13 regression suite — proves the figure gates FIRE (B1.0).
 *
 * The B0 lesson, applied to pictures (L28): a rule in a library is a guarantee,
 * a scan over the emitted artefact is the backstop, and a scan nobody has seen
 * fail is untested. Every case below deliberately draws a lie — a mark outside
 * its own number line, a triangle whose angles cannot close, a coin set that
 * disagrees with the answer it illustrates — and asserts QG-13 catches it, then
 * asserts the honest twin is NOT caught.
 *
 * The contradiction half is the one that matters: it is the `answerFor`
 * discipline applied to pictures. A figure built from the item's own drawn
 * values cannot disagree with its answer, and this proves it rather than
 * trusting it.
 *
 * Run: npx tsx scripts/bb-qg13-test.ts
 */

import { generatePack } from '../src/modules/best-brains/generator/packGenerator';
import { validatePack } from '../src/modules/best-brains/generator/validator';
import { checkFigureShape, figureValue } from '../src/modules/best-brains/figures/assert';
import { promptImageAlt, promptText, speakablePrompt } from '../src/modules/best-brains/figures/prompt';
import { FIGURE_TYPES, type BBFigure } from '../src/modules/best-brains/figures/types';
import type { WeeklyConceptPack } from '../src/modules/best-brains/types';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    pass++;
    console.log(`  ok  ${name}${detail ? ` [${detail}]` : ''}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}${detail ? ` [${detail}]` : ''}`);
  }
}

const base = (): WeeklyConceptPack => generatePack('D', 12, 777) as WeeklyConceptPack;

/** QG-13 messages raised when `figure` hangs on the first Day-1 item. */
function onItem(figure: BBFigure, answer?: string, params?: Record<string, unknown>): string[] {
  const p = base();
  const it = p.days[0].items[0];
  it.figure = figure;
  if (answer !== undefined) {
    it.answer = { ...it.answer, value: answer, acceptableForms: [] };
  }
  if (params !== undefined) {
    it.generator = { templateId: it.generator?.templateId ?? 'd_mul_v1', params, seed: 1 };
  }
  return validatePack(p, { contract: 'v2' })
    .violations.filter((v) => v.gate === 'QG-13')
    .map((v) => v.message);
}

// ---------------------------------------------------------------------------
console.log('\nQG-13a — the picture cannot draw an impossibility');
// ---------------------------------------------------------------------------

const alt = 'a picture';

check(
  'a mark outside its own number line is caught',
  checkFigureShape({ type: 'number-line', alt, params: { min: 0, max: 1, marks: [{ at: 3 }] } }).length > 0,
  '3 on a 0–1 line',
);
check(
  'the same mark INSIDE the line is not caught',
  checkFigureShape({ type: 'number-line', alt, params: { min: 0, max: 4, marks: [{ at: 3 }] } }).length === 0,
  'false-positive guard',
);
check(
  'a bar wider than its own scale is caught',
  checkFigureShape({ type: 'bar-model', alt, params: { bars: [{ segments: [{ value: 30 }] }], scaleMax: 24 } }).length > 0,
  'scaleMax 24 < bar 30',
);
check(
  'more shaded cells than the grid holds is caught',
  checkFigureShape({ type: 'area-grid', alt, params: { rows: 3, cols: 4, shaded: 13 } }).length > 0,
  '13 of 12',
);
check(
  'a mislabelled area grid is caught',
  checkFigureShape({ type: 'area-grid', alt, params: { rows: 2, cols: 2, cellLabels: ['600', '80', '180'] } }).length > 0,
  '3 labels for 4 rooms',
);
check(
  'over-filling a ten-frame is caught',
  checkFigureShape({ type: 'ten-frame', alt, params: { filled: 8, hidden: 5 } }).length > 0,
  '13 counters in 10 cells',
);
check(
  'filling a DOUBLE frame to 13 is not caught',
  checkFigureShape({ type: 'ten-frame', alt, params: { frames: 2, filled: 13 } }).length === 0,
  'false-positive guard',
);
check(
  'crossing out more counters than are drawn is caught',
  checkFigureShape({ type: 'counters', alt, params: { groups: [{ count: 4 }], crossedOut: 6 } }).length > 0,
  'take 6 from 4',
);
check(
  'more rods than the page can hold is caught',
  checkFigureShape({ type: 'base-ten-blocks', alt, params: { state: { rods: 13, ones: 2 } } }).length > 0,
  '13 rods will not fit the figure width',
);
check(
  "a 'becomes' that changes the quantity is caught",
  checkFigureShape({ type: 'base-ten-blocks', alt, params: { state: { rods: 0, ones: 10 }, then: { rods: 2, ones: 0 } } }).length > 0,
  'ten ones may not become two tens — a regrouping conserves',
);
check(
  'the honest regroup is not caught',
  checkFigureShape({ type: 'base-ten-blocks', alt, params: { state: { rods: 3, ones: 17 }, then: { rods: 4, ones: 7 } } }).length === 0,
  'false-positive guard: 47 becomes 47',
);
check(
  'a sentence token past eight characters is caught',
  checkFigureShape({ type: 'math-sentence', alt, params: { tokens: [{ text: '123456789' }] } }).length > 0,
  'tokens cap at 8 chars — split long numbers',
);
check(
  'a marked short sentence is not caught',
  checkFigureShape({ type: 'math-sentence', alt, params: { tokens: [{ text: '3' }, { text: '+' }, { text: '4', mark: 'ring' }, { text: '=' }, { text: '▢', mark: 'box' }] } }).length === 0,
  'false-positive guard',
);
check(
  'a lesson board may not lie: a false written equation is caught',
  checkFigureShape({ type: 'math-sentence', alt, params: { tokens: [{ text: '3' }, { text: '+' }, { text: '4' }, { text: '×' }, { text: '2' }, { text: '=' }, { text: '14' }] } }).length > 0,
  'lesson figures are audited with no answer target, so this is the only gate that sees it',
);
check(
  'a deliberate wrong line passes when it says so',
  checkFigureShape({ type: 'math-sentence', alt, params: { deliberate: true, tokens: [{ text: '3' }, { text: '+' }, { text: '4' }, { text: '×' }, { text: '2' }, { text: '=' }, { text: '14' }] } }).length === 0,
  'error-analysis boards declare themselves',
);
check(
  'a U+2212 negative line is audited, not silently skipped',
  checkFigureShape({ type: 'math-sentence', alt, params: { tokens: [{ text: '−3' }, { text: '×' }, { text: '−2' }, { text: '=' }, { text: '−6' }] } }).length > 0,
  'the corpus minus is U+2212; −3 × −2 is +6, and the gate must see that',
);
check(
  'a lying column total is caught',
  checkFigureShape({ type: 'column-method', alt, params: { op: '+', rows: [{ cells: ['4', '7'], role: 'operand' }, { cells: ['2', '6'], role: 'operand' }, { cells: ['6', '3'], role: 'result' }] } }).length > 0,
  '47 + 26 is 73, not 63',
);
check(
  'a blank result row is not audited',
  checkFigureShape({ type: 'column-method', alt, params: { op: '+', rows: [{ cells: ['4', '7'], role: 'operand' }, { cells: ['2', '6'], role: 'operand' }, { cells: ['', ''], role: 'result' }] } }).length === 0,
  'the ruled-line, answer-not-written form is legitimate',
);
check(
  'ragged column rows are caught',
  checkFigureShape({ type: 'column-method', alt, params: { rows: [{ cells: ['4', '7'], role: 'operand' }, { cells: ['2'], role: 'result' }] } }).length > 0,
  'row 1 has 1 cell; row 0 has 2 — misaligned columns',
);
check(
  'a multi-digit cell is caught',
  checkFigureShape({ type: 'column-method', alt, params: { rows: [{ cells: ['47'], role: 'operand' }, { cells: ['2'], role: 'result' }] } }).length > 0,
  'a column holds a digit, not a number',
);
check(
  'an honest addition column is not caught',
  checkFigureShape({ type: 'column-method', alt, params: { op: '+', rows: [{ cells: ['1', ''], role: 'carry' }, { cells: ['4', '7'], role: 'operand' }, { cells: ['2', '6'], role: 'operand' }, { cells: ['7', '3'], role: 'result' }] } }).length === 0,
  'false-positive guard: 47 + 26 = 73 with its carry',
);
check(
  'a separator inside place-value digits is caught',
  checkFigureShape({ type: 'place-value-chart', alt, params: { digits: '507,036' } }).length > 0,
  'digits are canonical, the CHART groups them',
);
check(
  'an impossible clock time is caught',
  checkFigureShape({ type: 'clock', alt, params: { h: 3, m: 75 } }).length > 0,
  '75 minutes',
);
check(
  'a non-existent coin is caught',
  checkFigureShape({ type: 'coin-set', alt, params: { coins: [{ cents: 3 as 1, count: 2 }] } }).length > 0,
  'there is no 3¢ coin',
);
check(
  'a point off the grid is caught',
  checkFigureShape({ type: 'coordinate-grid', alt, params: { xMin: 0, xMax: 5, yMin: 0, yMax: 5, points: [{ x: 9, y: 1 }] } }).length > 0,
  '(9,1) on a 5×5 grid',
);
check(
  'a triangle whose angles cannot close is caught',
  checkFigureShape({ type: 'angle-figure', alt, params: { shape: 'triangle', angles: [90, 60, 50] } }).length > 0,
  '200°',
);
check(
  'an honest triangle is not caught',
  checkFigureShape({ type: 'angle-figure', alt, params: { shape: 'triangle', angles: [40, 60, 80] } }).length === 0,
  'false-positive guard',
);
check(
  'a triangle with no room left for its unknown is caught',
  checkFigureShape({ type: 'angle-figure', alt, params: { shape: 'triangle', angles: [120, 70, null] } }).length > 0,
  '190° already used',
);
check(
  'a figure with no alt text is caught',
  checkFigureShape({ type: 'ten-frame', alt: '  ', params: { filled: 3 } }).length > 0,
  'alt is the accessible name',
);

// ---------------------------------------------------------------------------
console.log('\nQG-13b — the picture cannot contradict the item');
// ---------------------------------------------------------------------------

const contradicts = (msgs: string[]) => msgs.some((m) => m.includes('contradicts the item'));

check(
  'a ten-frame showing 7 on an item answered 8 is caught',
  contradicts(onItem({ type: 'ten-frame', alt, asserts: { equals: 'answer' }, params: { filled: 7 } }, '8')),
  'filled 7 vs answer 8',
);
check(
  'a ten-frame showing 8 on an item answered 8 passes',
  !contradicts(onItem({ type: 'ten-frame', alt, asserts: { equals: 'answer' }, params: { filled: 8 } }, '8')),
  'false-positive guard',
);
check(
  'a coin set totalling 41¢ on an item answered $1.25 is caught',
  contradicts(onItem({ type: 'coin-set', alt, asserts: { equals: 'answer' }, params: { coins: [{ cents: 25, count: 1 }, { cents: 10, count: 1 }, { cents: 5, count: 1 }, { cents: 1, count: 1 }] } }, '$1.25')),
  '41 vs 125',
);
check(
  'the same coin set answered "41¢" passes, and so does "$0.41"',
  !contradicts(onItem({ type: 'coin-set', alt, asserts: { equals: 'answer' }, params: { coins: [{ cents: 25, count: 1 }, { cents: 10, count: 1 }, { cents: 5, count: 1 }, { cents: 1, count: 1 }] } }, '41¢')) &&
    !contradicts(onItem({ type: 'coin-set', alt, asserts: { equals: 'answer' }, params: { coins: [{ cents: 25, count: 1 }, { cents: 10, count: 1 }, { cents: 5, count: 1 }, { cents: 1, count: 1 }] } }, '$0.41')),
  'the gate audits value, never punctuation',
);
check(
  'a number line marked 3/8 on an item answered 1/2 is caught',
  contradicts(onItem({ type: 'number-line', alt, asserts: { equals: 'answer' }, params: { min: 0, max: 1, partition: 8, marks: [{ at: 0.375 }] } }, '1/2')),
  '3/8 vs 1/2',
);
check(
  'a number line marked 4/8 on an item answered 1/2 passes',
  !contradicts(onItem({ type: 'number-line', alt, asserts: { equals: 'answer' }, params: { min: 0, max: 1, partition: 8, marks: [{ at: 0.5 }] } }, '1/2')),
  'equivalent fractions are the same VALUE',
);
check(
  'a clock reading 3:45 on an item answered 2:55 is caught',
  contradicts(onItem({ type: 'clock', alt, asserts: { equals: 'answer' }, params: { h: 3, m: 45 } }, '2:55')),
  'hour-hand drift is a misconception, not a licence',
);
check(
  'a bar model whose bars total 30 against a param of 24 is caught',
  contradicts(onItem({ type: 'bar-model', alt, asserts: { of: 'bar:1', equals: 'param:b' }, params: { bars: [{ segments: [{ value: 6 }] }, { segments: [{ value: 10 }, { value: 10 }, { value: 10 }] }] } }, undefined, { a: 6, b: 24 })),
  'bar 1 = 30, param b = 24',
);
check(
  'the same bar model with four 6s passes',
  !contradicts(onItem({ type: 'bar-model', alt, asserts: { of: 'bar:1', equals: 'param:b' }, params: { bars: [{ segments: [{ value: 6 }] }, { segments: [{ value: 6 }, { value: 6 }, { value: 6 }, { value: 6 }] }] } }, undefined, { a: 6, b: 24 })),
  'false-positive guard',
);
check(
  'a bar model of 40 against a UNIT-bearing answer "40 m" passes',
  !contradicts(onItem({ type: 'bar-model', alt, asserts: { of: 'bar:0', equals: 'answer' }, params: { bars: [{ segments: [{ value: 8 }, { value: 8 }, { value: 8 }, { value: 8 }, { value: 8 }] }] } }, '40 m')),
  'a picture carries no units',
);
check(
  'a bar model of 30 against "40 m" is still caught',
  contradicts(onItem({ type: 'bar-model', alt, asserts: { of: 'bar:0', equals: 'answer' }, params: { bars: [{ segments: [{ value: 10 }, { value: 10 }, { value: 10 }] }] } }, '40 m')),
  'unit tolerance loosens punctuation, never VALUE',
);
check(
  'an area grid asserting its shaded fraction is checked as a fraction',
  contradicts(onItem({ type: 'area-grid', alt, asserts: { of: 'shaded-fraction', equals: 'answer' }, params: { rows: 4, cols: 5, shaded: 6 } }, '1/2')),
  '6/20 vs 1/2',
);
check(
  'asserting a param the item does not carry is caught',
  onItem({ type: 'ten-frame', alt, asserts: { equals: 'param:zzz' }, params: { filled: 3 } }, '3', { a: 1 }).some((m) => m.includes('zzz')),
  'a typo must not silently skip the audit',
);
check(
  'a selector the figure type cannot compute is caught',
  onItem({ type: 'ten-frame', alt, asserts: { of: 'cents', equals: 'answer' }, params: { filled: 3 } }, '3').some((m) => m.includes('cents')),
  'ten-frames do not have cents',
);
check(
  'a figure with NO assertion is checked for possibility only',
  onItem({ type: 'ten-frame', alt, params: { filled: 7 } }, '8').length === 0,
  'context pictures are legal — this is the gate\'s honest limit',
);

// ---------------------------------------------------------------------------
console.log('\nQG-13c — the asserted quantity is recomputed, per type');
// ---------------------------------------------------------------------------

const values: Array<[string, BBFigure, string, string]> = [
  ['number-line reads its mark as a fraction', { type: 'number-line', alt, params: { min: 0, max: 1, partition: 8, marks: [{ at: 0.375 }] } }, '', '3/8'],
  ['bar-model totals every segment', { type: 'bar-model', alt, params: { bars: [{ segments: [{ value: 6 }, { value: 6 }] }] } }, '', '12'],
  ['area-grid counts the double-shaded overlap', { type: 'area-grid', alt, params: { rows: 4, cols: 5, shadedRows: 3, shadedCols: 2 } }, '', '6'],
  ['ten-frame reads its filled cells', { type: 'ten-frame', alt, params: { filled: 7 } }, '', '7'],
  ['ten-frame reads the hidden partner', { type: 'ten-frame', alt, params: { filled: 6, hidden: 4 } }, 'hidden', '4'],
  ['counters total every group', { type: 'counters', alt, params: { groups: [{ count: 3 }, { count: 2 }] } }, '', '5'],
  ['counters read what is LEFT after a take-away', { type: 'counters', alt, params: { groups: [{ count: 7 }], crossedOut: 3 } }, 'remaining', '4'],
  ['math-sentence audits its own equation', { type: 'math-sentence', alt, params: { tokens: [{ text: '3' }, { text: '+' }, { text: '4' }, { text: '×' }, { text: '2' }, { text: '=' }, { text: '11' }] } }, 'value', '11'],
  ['math-sentence refuses a false equation', { type: 'math-sentence', alt, params: { tokens: [{ text: '3' }, { text: '+' }, { text: '4' }, { text: '×' }, { text: '2' }, { text: '=' }, { text: '14' }] } }, 'value', '11'],
  ['column-method re-reads its result row', { type: 'column-method', alt, params: { op: '+', rows: [{ cells: ['4', '7'], role: 'operand' }, { cells: ['2', '6'], role: 'operand' }, { cells: ['7', '3'], role: 'result' }] } }, 'result', '73'],
  ['column-method reads the drawn point', { type: 'column-method', alt, params: { pointAfterCol: 0, rows: [{ cells: ['8', '6'], role: 'operand' }, { cells: ['4', '2'], role: 'result' }] } }, 'result', '4.2'],
  ['base-ten blocks read as one number', { type: 'base-ten-blocks', alt, params: { state: { rods: 4, ones: 7 } } }, '', '47'],
  ['base-ten blocks read the AFTER state of a regroup', { type: 'base-ten-blocks', alt, params: { state: { rods: 3, ones: 17 }, then: { rods: 4, ones: 7 } } }, '', '47'],
  ['base-ten blocks can be asked for the rods alone', { type: 'base-ten-blocks', alt, params: { state: { rods: 4, ones: 7 } } }, 'rods', '4'],
  ['place-value reads the whole number', { type: 'place-value-chart', alt, params: { digits: '507036' } }, '', '507036'],
  ['place-value reads a digit\'s VALUE, not its face', { type: 'place-value-chart', alt, params: { digits: '407' } }, 'place:hundreds', '400'],
  ['clock reads its time', { type: 'clock', alt, params: { h: 2, m: 55 } }, '', '2:55'],
  ['coin-set totals by value, not by coin count', { type: 'coin-set', alt, params: { coins: [{ cents: 10, count: 1 }, { cents: 1, count: 3 }] } }, '', '13'],
  ['coin-set can also be asked how MANY coins', { type: 'coin-set', alt, params: { coins: [{ cents: 10, count: 1 }, { cents: 1, count: 3 }] } }, 'count', '4'],
  ['coordinate-grid reads its point', { type: 'coordinate-grid', alt, params: { xMin: 0, xMax: 9, yMin: 0, yMax: 9, points: [{ x: 3, y: 7 }] } }, '', '(3,7)'],
  ['angle-figure solves for the unknown angle', { type: 'angle-figure', alt, params: { shape: 'triangle', angles: [90, 55, null] } }, 'missing', '35'],
  ['angle-figure reads a plain opening', { type: 'angle-figure', alt, params: { shape: 'angle', degrees: 135 } }, '', '135'],
];
for (const [name, fig, of, want] of values) {
  const got = figureValue(fig, of || undefined);
  check(name, !!got && got.includes(want), `${got?.[0] ?? 'null'} ⊇ ${want}`);
}
check(
  'every figure type is exercised above',
  FIGURE_TYPES.every((t) => values.some(([, f]) => f.type === t)),
  `${FIGURE_TYPES.length} types`,
);

// ---------------------------------------------------------------------------
console.log('\nPrompt ↔ picture separation (the L27 defect)');
// ---------------------------------------------------------------------------

const raw = '[image: 3 acorns in a row] Count the acorns. How many?';
check('the bracket never reaches the screen', promptText(raw) === 'Count the acorns. How many?', promptText(raw));
check('the bracket words become the accessible name', promptImageAlt(raw) === '3 acorns in a row', String(promptImageAlt(raw)));
check('the spoken form leads with the scene', speakablePrompt(raw) === '3 acorns in a row. Count the acorns. How many?', speakablePrompt(raw));
check('a real figure\'s alt outranks the authored bracket', speakablePrompt(raw, 'three acorns') === 'three acorns. Count the acorns. How many?', '');
check('a promptless-of-images prompt is untouched', promptText('What is 3 + 4?') === 'What is 3 + 4?', '');
check('a mid-sentence bracket does not leave a double space', promptText('Look: [image: a ten-frame] how many?') === 'Look: how many?', promptText('Look: [image: a ten-frame] how many?'));

// ---------------------------------------------------------------------------
console.log('\nThe live corpus is clean');
// ---------------------------------------------------------------------------
{
  let dirty = 0;
  const seen: string[] = [];
  for (const [lvl, weeks] of [['A', [1, 2, 15]], ['B', [1, 2, 14]], ['C', [1, 2]], ['D', Array.from({ length: 24 }, (_, i) => i + 1)]] as const) {
    for (const w of weeks) {
      for (const seed of [777, 12345, 424242]) {
        const p = generatePack(lvl, w, seed) as WeeklyConceptPack | null;
        if (!p) continue;
        const hits = validatePack(p, { contract: 'v2' }).violations.filter((v) => v.gate === 'QG-13');
        dirty += hits.length;
        if (hits.length) seen.push(`${p.packId}@${seed}: ${hits[0].message}`);
      }
    }
  }
  check('every servable pack × 3 seeds has zero QG-13 violations', dirty === 0, seen[0] ?? `${dirty} found`);
}

console.log(`\n${fail === 0 ? 'ALL QG-13 REGRESSION TESTS PASS' : `${fail} FAILURE(S)`}  (${pass} passed)`);
process.exit(fail === 0 ? 0 : 1);
