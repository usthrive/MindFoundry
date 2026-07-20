/**
 * Best Brains-inspired module — concept catalog.
 *
 * Typed port of CURRICULUM-MAP.md's five 24-week concept tables (Level × Week:
 * concept name, computational-strand focus, non-computational Day-5 focus).
 * Sequencing is the map's [original design] synthesis; this file only encodes it.
 *
 * conceptIds are stable kebab-case keys; the three cells with spec worked
 * packs use the packs' exact conceptIds (A15 addition-within-10,
 * B14 sub-within-100-regrouping, D17 frac-addsub-unlike-denominators).
 */

import type { BBBand, BBLevel, StrandTag } from '../types';
import { CHECKPOINT_WEEK, WEEKS_PER_LEVEL } from '../constants';

export interface CatalogWeek {
  level: BBLevel;
  /** 1–24 */
  week: number;
  conceptId: string;
  conceptName: string;
  /** Computational strand focus (CURRICULUM-MAP column 3). */
  computationalFocus: string;
  /** Non-computational Day-5 strand focus (CURRICULUM-MAP column 4). */
  noncomputationalFocus: string;
  band: BBBand;
  strandTags: StrandTag[];
  /** Week 12 — extended Mid-Level Checkpoint (DD9). */
  isCheckpoint: boolean;
  /** Week 24 — gating Level-Exit test (DD9). */
  isLevelExit: boolean;
}

const LEVEL_BANDS: Record<BBLevel, BBBand> = {
  A: 'beginner',
  B: 'intermediate',
  C: 'intermediate',
  D: 'transition',
  E: 'advanced',
};

type Row = [conceptId: string, name: string, comp: string, noncomp: string, tags: StrandTag[]];

function expand(level: BBLevel, rows: Row[]): CatalogWeek[] {
  if (rows.length !== WEEKS_PER_LEVEL) {
    throw new Error(`Level ${level} catalog has ${rows.length} weeks; expected ${WEEKS_PER_LEVEL}`);
  }
  return rows.map(([conceptId, conceptName, computationalFocus, noncomputationalFocus, strandTags], i) => ({
    level,
    week: i + 1,
    conceptId,
    conceptName,
    computationalFocus,
    noncomputationalFocus,
    band: LEVEL_BANDS[level],
    strandTags,
    isCheckpoint: i + 1 === CHECKPOINT_WEEK,
    isLevelExit: i + 1 === WEEKS_PER_LEVEL,
  }));
}

// --- Level A — Pre-K/K Readiness -------------------------------------------

const LEVEL_A: Row[] = [
  ['counting-1-5', 'Counting 1–5', 'One-to-one counting of objects to 5', 'Sort-and-match picture puzzle (count → group)', ['number-sense-counting']],
  ['counting-6-10', 'Counting 6–10', 'Counting collections to 10; last-number-counted = how many', 'AB/ABB pattern spotting with shapes', ['number-sense-counting']],
  ['writing-numbers-0-5', 'Writing numbers 0–5', 'Numeral tracing and free writing 0–5', 'Number hunt: numerals in real-world scenes', ['number-sense-counting']],
  ['writing-numbers-6-10', 'Writing numbers 6–10', 'Numeral writing 6–10; numeral↔set matching', 'Draw-your-number picture stories', ['number-sense-counting']],
  ['more-fewer-same', 'More, fewer, same', 'Matching sets to compare quantities to 10', '"Which has more?" visual reasoning with near-equal sets', ['number-sense-counting']],
  ['ordering-numbers-to-10', 'Ordering numbers to 10', 'Number path work: before/after/between; fill missing numbers', 'What-comes-next sequence puzzles', ['number-sense-counting']],
  ['flat-shapes', 'Flat shapes', 'Identify/name circle, square, triangle, rectangle; count sides/corners', 'Shape art: build a picture from shapes', ['algebra-geometry']],
  ['position-and-sorting', 'Position & sorting', 'Sort by one attribute; count sorted groups', 'Above/below/beside/between picture logic', ['number-sense-counting', 'algebra-geometry']],
  ['counting-11-20', 'Counting 11–20', 'Object counting 11–20; counting out N objects', 'Teen-number "find and circle" with distractor sets', ['number-sense-counting']],
  ['writing-numbers-11-20', 'Writing numbers 11–20', 'Numeral writing 11–20; ten-frame + extras representation', 'Count-and-color with close distractors', ['number-sense-counting']],
  ['patterns', 'Patterns', 'Copy, extend, and fix broken repeating patterns', 'Create-your-own pattern and "explain the rule" orally', ['algebra-geometry']],
  ['partners-of-5', 'Partners of 5 (number bonds)', 'Compose/decompose 5 with pictures and bond diagrams', 'Missing-part icon puzzle: covered part of 5', ['number-sense-counting', 'addition-subtraction']],
  ['partners-of-10', 'Partners of 10', 'Compose/decompose 6–10; ten-frame bonds', 'Two-part icon puzzles for 10', ['number-sense-counting', 'addition-subtraction']],
  ['meeting-addition', 'Meeting addition', 'Join stories with objects/pictures within 5; + and = symbols', 'Addition story drawing: [set]+[set]=[draw the total]', ['addition-subtraction']],
  ['addition-within-10', 'Addition within 10', 'Count-on +1/+2/+3; picture + numeral addition', '"Write a number sentence and solve" from a picture', ['addition-subtraction', 'number-sense-counting']],
  ['meeting-subtraction', 'Meeting subtraction', 'Take-away stories within 5; − symbol; cross-out strategy', 'Subtraction story drawing with draw-the-answer box', ['addition-subtraction']],
  ['subtraction-within-10', 'Subtraction within 10', 'Count-back; take-apart with pictures and numerals', 'Solve-and-color with close distractors', ['addition-subtraction']],
  ['add-and-subtract-within-10', 'Add & subtract together', 'Mixed +/− within 10; choose the operation from the story', 'Which-operation picture sort (join vs take away)', ['addition-subtraction']],
  ['length-and-height', 'Length & height', 'Direct comparison; measure with nonstandard units (cubes)', 'Order three objects by size; "how do you know?"', ['number-sense-counting']],
  ['weight-and-capacity', 'Weight & capacity', 'Heavier/lighter; holds more/less; balance pictures', 'Predict-then-check reasoning page', ['number-sense-counting']],
  ['solid-shapes-and-building', 'Solid shapes & building', 'Name sphere/cube/cone/cylinder; compose new shapes from parts', 'Shape-construction puzzle: what can you build from these?', ['algebra-geometry']],
  ['counting-to-50-and-tens', 'Counting to 50 & tens', 'Rote to 50; count groups of 10; skip-count by 10s', 'Groups-of-10 picture puzzles (bundling)', ['number-sense-counting']],
  ['teen-numbers-ten-plus-some', 'Teen numbers = 10 + some', 'Decompose 11–19 as ten + ones with frames', 'Build-a-teen: fill the ten-frame, count the extras', ['number-sense-counting']],
  ['ready-for-level-b', 'Ready for Level B (consolidation)', 'Mixed capstone: count/write to 20, +/− within 10, bonds to 10', 'Math-vocabulary picture crossword with word bank', ['number-sense-counting', 'addition-subtraction']],
];

// --- Level B — Early Elementary --------------------------------------------

const LEVEL_B: Row[] = [
  ['numbers-to-120', 'Numbers to 120', 'Count/read/write to 120; number-path navigation', 'Hundred-chart hidden-picture logic puzzle', ['number-sense-counting']],
  ['tens-and-ones', 'Tens and ones', 'Compose/decompose 2-digit numbers; tens|ones column work', 'Riddle cards: "I have 4 tens and 7 ones — who am I?"', ['number-sense-counting']],
  ['comparing-numbers', 'Comparing numbers', 'Compare 2-digit numbers with <, >, =; order three numbers', 'True/false comparison claims — prove or fix each', ['number-sense-counting']],
  ['count-on-and-count-back', 'Count on & count back', '+1/+2/+3 and −1/−2/−3 within 20 from any number', 'Number-line hop puzzles (mystery landing spot)', ['addition-subtraction']],
  ['make-ten-to-add', 'Make ten to add', '8+5 as 8+2+3; ten-frame strategy work within 20', '"Show two ways" — same sum, two strategies', ['addition-subtraction']],
  ['balanced-equal-sign', 'The balanced equal sign', 'True/false equations; both-sides-equal work', 'Balance-scale logic: what keeps the scale level?', ['addition-subtraction', 'algebra-geometry']],
  ['missing-addends', 'Missing addends', '6+▢=13 and ▢+4=11 via think-addition', 'Icon-equation puzzles (shape stands for the hidden number)', ['addition-subtraction', 'algebra-geometry']],
  ['fact-families-add-sub', 'Fact families', 'Add/subtract fact triangles within 20; related facts', 'Family sort: which fact doesn\'t belong? Explain', ['addition-subtraction']],
  ['story-problems-within-20', 'Story problems within 20', 'Result-unknown and change-unknown join/separate problems', 'Write-your-own story problem for a given number sentence', ['addition-subtraction']],
  ['adding-tens', 'Adding tens', '34+20, 57+30; multiples of 10 on the hundred chart', 'Hundred-chart movement puzzles (down = +10)', ['addition-subtraction', 'number-sense-counting']],
  ['two-digit-plus-one-digit', 'Two-digit + one-digit', '45+3, 38+6 with place-value models, no/with crossing ten', 'Estimate first: "will it cross a ten?" prediction page', ['addition-subtraction']],
  ['time-hour-half-hour', 'Time: hour & half hour', 'Read/draw analog and digital times to the half hour', 'Daily-schedule logic (order the day\'s events)', ['number-sense-counting']],
  ['add-within-100-regrouping', 'Addition within 100 (regrouping)', '2-digit + 2-digit with base-ten models → column method', '"Spot the regrouping mistake" — find where a worked solution went wrong', ['addition-subtraction']],
  ['sub-within-100-regrouping', 'Subtraction within 100 (regrouping)', '2-digit − 2-digit with models → column method', 'Two students, two methods — do both work?', ['addition-subtraction', 'number-sense-counting']],
  ['compare-and-change-stories', 'Compare & change stories', 'Compare-unknown word problems; bar-model pictures', 'Draw-the-model: turn a story into a picture before solving', ['addition-subtraction']],
  ['money', 'Money', 'Coin identification; count mixed collections; make amounts two ways', 'Shop-window puzzle: exact change combinations', ['number-sense-counting']],
  ['time-quarter-hours', 'Time: quarter hours', 'Quarter past / quarter to; elapsed hour problems', 'Clock riddles ("I am 15 minutes after…")', ['number-sense-counting']],
  ['skip-counting-2-5-10', 'Skip counting 2s, 5s, 10s', 'Fluent skip sequences; counting money/objects in groups', 'Skip-pattern secret-code puzzle', ['multiplication-division', 'number-sense-counting']],
  ['even-odd-fair-shares', 'Even, odd & fair shares', 'Even/odd via pairing; doubles facts', 'Fair-share reasoning: can 13 be split fairly? Prove it', ['multiplication-division', 'number-sense-counting']],
  ['arrays-repeated-addition', 'Arrays & repeated addition', 'Rows × columns as repeated addition; build/describe arrays', 'Array hunt: arrays in real-world pictures', ['multiplication-division']],
  ['measuring-length', 'Measuring length', 'Inches and centimeters; ruler technique; estimate-then-measure', 'Measurement detective: why did two children get different answers?', ['number-sense-counting']],
  ['halves-and-quarters', 'Halves & quarters', 'Partition circles/rectangles; equal vs unequal shares', 'Equal-share sort with tricky non-congruent halves', ['decimals-fractions']],
  ['bar-graphs-line-plots', 'Bar graphs & line plots', 'Build and read graphs; one-step "how many more" questions', 'Ask-your-own-question: write a question a graph can answer', ['probability-statistics']],
  ['ready-for-level-c', 'Ready for Level C (consolidation)', 'Mixed capstone: place value, ±within 100, time, money', 'Math-vocabulary crossword + logic mini-puzzle set', ['number-sense-counting', 'addition-subtraction']],
];

// --- Level C — Elementary Fluency ------------------------------------------

const LEVEL_C: Row[] = [
  ['place-value-to-1000', 'Place value to 1,000', 'Read/write/expand 3-digit numbers; hundreds|tens|ones columns', 'Number riddles with place-value clues', ['number-sense-counting']],
  ['compare-and-round', 'Compare & round', '<,>,= to 1,000; round to nearest 10/100 on the number line', '"About how many?" estimation reasoning page', ['number-sense-counting']],
  ['addition-within-1000', 'Addition within 1,000', '3-digit column addition, single and double regrouping', 'Find-the-error in a multi-step addition', ['addition-subtraction']],
  ['subtraction-within-1000', 'Subtraction within 1,000', '3-digit column subtraction incl. across zeros', 'Two methods compared: column vs counting-up — when is each faster?', ['addition-subtraction']],
  ['two-step-add-sub-stories', 'Two-step +/− stories', 'Two-step word problems with bar models', 'Plan-before-solving page: write the plan, don\'t solve', ['addition-subtraction']],
  ['meeting-multiplication', 'Meeting multiplication', 'Equal groups and arrays; × as "groups of"; repeated addition link', 'Array/group sort: which pictures show 3×4? Defend', ['multiplication-division']],
  ['facts-2-5-10', 'Facts: ×2, ×5, ×10', 'Fact practice via skip-count anchors; commutativity', 'Pattern hunt in the ×5 and ×10 columns of the fact table', ['multiplication-division']],
  ['facts-3-4', 'Facts: ×3, ×4', 'Doubling strategies (×4 = double-double); mixed fact practice', 'Missing-factor grids', ['multiplication-division']],
  ['meeting-division', 'Meeting division', 'Sharing vs grouping models; ÷ notation; ÷ as missing factor', 'Fair-share story sort: sharing or grouping?', ['multiplication-division']],
  ['fact-families-mul-div', 'Fact families ×/÷', 'Related multiplication/division facts; triangles', 'Family "impostor" puzzles — which equation doesn\'t belong?', ['multiplication-division']],
  ['facts-6-7', 'Facts: ×6, ×7', 'Build-from-known strategies (6×7 = 5×7+7); practice', 'Strategy-swap page: show a friend\'s shortcut, does it always work?', ['multiplication-division']],
  ['facts-8-9', 'Facts: ×8, ×9', 'Near-ten strategies (9×n = 10×n−n); full-table mixed practice', 'Fact-table treasure hunt: symmetry and patterns', ['multiplication-division']],
  ['distributive-thinking', 'Distributive thinking', 'Break-apart multiplication: 7×6 = 7×5 + 7×1; area-model seed', 'Balance-scale equations with products', ['multiplication-division', 'algebra-geometry']],
  ['multiply-by-tens', 'Multiply by tens', '4×30, 7×60 using place-value reasoning', 'Estimation duel: closest guess wins — justify your bound', ['multiplication-division', 'number-sense-counting']],
  ['meeting-fractions', 'Meeting fractions', 'Unit fractions as equal parts; fractions on the number line', 'Equal-parts sort with tricky unequal partitions', ['decimals-fractions']],
  ['equivalent-comparing-fractions', 'Equivalent & comparing fractions', 'Equivalence with models/number lines; compare same numerator/denominator', '"Who ate more pizza?" reasoning with different-sized wholes', ['decimals-fractions']],
  ['fractions-of-a-set', 'Fractions of a set', '1/3 of 12; whole numbers as fractions', 'Sharing-scenario puzzles (fractions in fair division)', ['decimals-fractions', 'multiplication-division']],
  ['time-to-the-minute', 'Time to the minute', 'Read/write to the minute; elapsed time within the hour', 'Timeline logic: schedule-planning puzzle', ['number-sense-counting']],
  ['mass-liquid-volume', 'Mass & liquid volume', 'Grams/kilograms, liters; one-step measurement problems', 'Estimate-or-measure? Choosing tools and units', ['number-sense-counting']],
  ['area', 'Area', 'Unit-square tiling → area formula for rectangles', 'Same-area-different-shape design challenge', ['algebra-geometry', 'multiplication-division']],
  ['perimeter-vs-area', 'Perimeter vs area', 'Perimeter fluency; fixed-perimeter/varying-area investigations', 'The fence-and-garden paradox: same perimeter, different areas — explain', ['algebra-geometry']],
  ['quadrilateral-families', 'Quadrilateral families', 'Classify by sides/angles; attribute language', 'Always/Sometimes/Never claims about shapes', ['algebra-geometry']],
  ['scaled-graphs', 'Scaled graphs', 'Read/build scaled bar graphs and line plots; two-step graph questions', 'Misleading-graph detective: what makes this graph unfair?', ['probability-statistics']],
  ['ready-for-level-d', 'Ready for Level D (consolidation)', 'Mixed capstone: ±within 1,000, ×/÷ facts, fractions', 'Vocabulary crossword + multi-step logic puzzle', ['multiplication-division', 'decimals-fractions']],
];

// --- Level D — Upper Elementary --------------------------------------------

const LEVEL_D: Row[] = [
  ['place-value-to-1000000', 'Place value to 1,000,000', 'Read/write/compare/round large numbers; ×10 place relationships', '"How big is a million?" benchmark-reasoning page', ['number-sense-counting']],
  ['multi-digit-add-sub-fluency', 'Multi-digit ± fluency', 'Standard algorithms to 6 digits; estimation checks', 'Error-analysis: three worked subtractions, one hides a borrowed-zero slip', ['addition-subtraction']],
  ['factors-multiples-primes', 'Factors, multiples & primes', 'Factor pairs to 100; prime/composite; divisibility patterns', 'Prime-sieve puzzle + "is the claim true for all numbers?"', ['multiplication-division']],
  ['multiplicative-comparison', 'Multiplicative comparison', '"3 times as many" problems; comparison bar models', 'Additive-vs-multiplicative comparison sort', ['multiplication-division']],
  ['area-model-multiplication', 'Area-model multiplication', '2-digit×1-digit and 3-digit×1-digit via break-apart/area model', 'Draw-the-model: connect each partial product to its rectangle', ['multiplication-division']],
  ['division-with-remainders', 'Division with remainders', '1-digit divisors; sharing model → written method; remainder notation', 'Remainder stories: same computation, four different answers', ['multiplication-division']],
  ['interpreting-remainders', 'Interpreting remainders', 'Multi-step division word problems; choosing the remainder\'s meaning', 'Justify-your-choice page: defend the interpretation in writing', ['multiplication-division']],
  ['two-digit-by-two-digit', '2-digit × 2-digit', 'Area model with four partials → standard algorithm', 'Which-partial-went-missing error analysis', ['multiplication-division']],
  ['fraction-equivalence-comparison', 'Fraction equivalence & comparison', 'Equivalence by scaling; compare via benchmarks and common denominators', 'Benchmark-reasoning: order fractions WITHOUT computing — explain', ['decimals-fractions']],
  ['frac-addsub-like-denominators', '± fractions (like denominators)', '± fractions and mixed numbers, like denominators', 'Fraction-sum target puzzles (make 2 exactly)', ['decimals-fractions']],
  ['fraction-times-whole', 'Fraction × whole number', 'n × a/b via unit-fraction bricks; word problems', 'Recipe-scaling reasoning page', ['decimals-fractions', 'multiplication-division']],
  ['meeting-decimals', 'Meeting decimals', 'Tenths/hundredths notation; fraction↔decimal; compare decimals', 'Money-as-decimals reasoning; "why is 0.8 > 0.35?" written explanation', ['decimals-fractions']],
  ['decimal-place-value-thousandths', 'Decimal place value to thousandths', 'Read/write/round/compare to thousandths', 'Density puzzle: name a decimal between 0.42 and 0.43', ['decimals-fractions', 'number-sense-counting']],
  ['addsub-decimals', '± decimals', 'Column ± with alignment reasoning; money/measurement contexts', 'Misaligned-columns error analysis', ['decimals-fractions', 'addition-subtraction']],
  ['multi-digit-multiplication-fluency', 'Multi-digit × fluency', 'Standard algorithm 3×2-digit; estimation as check', 'Two students\' methods (area model vs algorithm) — reconcile line by line', ['multiplication-division']],
  ['division-two-digit-divisors', 'Division: 2-digit divisors', 'Estimate-quotient strategies; long division with 2-digit divisors', 'Estimation-first page: bracket the quotient before dividing', ['multiplication-division']],
  ['frac-addsub-unlike-denominators', '± fractions (unlike denominators)', 'Common-denominator ±; mixed numbers; reasonableness via benchmarks', '"Why can\'t we just add tops and bottoms?" — refute with a picture', ['decimals-fractions']],
  ['multiplying-fractions', 'Multiplying fractions', 'a/b × c/d via area model; fraction of a fraction', 'Does multiplying always make bigger? Always/Sometimes/Never', ['decimals-fractions', 'multiplication-division']],
  ['dividing-unit-fractions', 'Dividing with unit fractions', 'Whole ÷ unit fraction, unit fraction ÷ whole via models', 'Story-matching: pick the story that fits 4 ÷ 1/3', ['decimals-fractions', 'multiplication-division']],
  ['muldiv-decimals', '× ÷ decimals', 'Decimal × whole, decimal × decimal, ÷ by whole', 'Where-does-the-point-go? — argue from estimation, not rules', ['decimals-fractions', 'multiplication-division']],
  ['order-of-operations-expressions', 'Order of operations & expressions', 'Evaluate with parentheses; write expressions from words', 'Insert-the-parentheses puzzles to hit a target value', ['algebra-geometry']],
  ['coordinate-plane-q1-patterns', 'Coordinate plane (Q1) & patterns', 'Plot points; generate two patterns and graph corresponding terms', 'Hidden-picture plotting + "what does the pattern predict?"', ['algebra-geometry']],
  ['angles-shape-hierarchies', 'Angles & shape hierarchies', 'Measure/draw angles; classify triangles; quadrilateral hierarchy', 'Always/Sometimes/Never: "a square is a rectangle" — defend in writing', ['algebra-geometry']],
  ['volume-ready-level-e', 'Volume + Ready for Level E', 'Volume by unit cubes → V=l×w×h; capstone mixed review', 'Box-packing design challenge + vocabulary review', ['algebra-geometry', 'multiplication-division']],
];

// --- Level E — Middle-School Readiness --------------------------------------

const LEVEL_E: Row[] = [
  ['ratios', 'Ratios', 'Ratio language/notation; equivalent ratios; ratio tables', 'Mixture-reasoning puzzle (which lemonade is more lemony? Justify)', ['multiplication-division', 'decimals-fractions']],
  ['rates-unit-rates', 'Rates & unit rates', 'Unit-rate computation; better-buy comparisons', 'Real-world rate audit: find the trap in a "deal"', ['multiplication-division', 'decimals-fractions']],
  ['meeting-percent', 'Meeting percent', 'Percent as per-hundred; percent ↔ fraction ↔ decimal', 'Benchmark-percent estimation (10%, 25%, 50%) without computing', ['decimals-fractions']],
  ['dividing-fractions', 'Dividing fractions', 'Fraction ÷ fraction via common denominators and invert-multiply', '"Why does invert-and-multiply work?" — explain with a model', ['decimals-fractions']],
  ['gcf-lcm-decimal-fluency', 'GCF, LCM & decimal fluency', 'GCF/LCM; multi-digit decimal operations consolidation', 'Gear-and-cycle puzzles (when do they align again?)', ['multiplication-division', 'decimals-fractions']],
  ['negative-numbers', 'Negative numbers', 'Integers on the number line; opposites; absolute value; ordering', 'Elevation/temperature/debt contexts: what does −7 mean here?', ['number-sense-counting']],
  ['four-quadrant-plane', 'Four-quadrant plane', 'Plot in all quadrants; reflections across axes', 'Coordinate treasure map with reflection clues', ['algebra-geometry']],
  ['addsub-integers', 'Adding & subtracting integers', '± with integers via number-line and charge models', 'Two models, one answer: reconcile number-line and counter methods', ['number-sense-counting', 'addition-subtraction']],
  ['muldiv-rational-numbers', '× ÷ rational numbers', 'Sign rules from patterns (not decree); all four ops on rationals', 'Why-negative-times-negative page: extend the pattern, write the argument', ['number-sense-counting', 'multiplication-division']],
  ['exponents-numerical-expressions', 'Exponents & numerical expressions', 'Whole-number exponents; order of operations with exponents', 'Powers-of-two explosion puzzle (doubling surprises)', ['algebra-geometry']],
  ['algebraic-expressions', 'Algebraic expressions', 'Variables; evaluate; translate words ↔ expressions; like terms', 'Icon-to-variable bridge page: the Level-A icon puzzle, now with x', ['algebra-geometry']],
  ['equivalent-expressions', 'Equivalent expressions', 'Distributive property; factor/expand; combine like terms', '"Are these always equal?" — test with numbers, then argue in general', ['algebra-geometry']],
  ['one-step-equations', 'One-step equations', 'Solve x±a=b, ax=b, x/a=b by inverse operations; balance model', 'Balance-scale proofs: show each move keeps the scale level', ['algebra-geometry']],
  ['two-step-equations', 'Two-step equations', 'Solve ax+b=c; check by substitution; equations from stories', 'Error-analysis: two students solve differently — both right?', ['algebra-geometry']],
  ['inequalities', 'Inequalities', 'Write/solve/graph one-step inequalities on the number line', 'Always/Never classification for an inequality + number-line graph', ['algebra-geometry']],
  ['proportional-relationships', 'Proportional relationships', 'Identify proportionality (tables/graphs); constant of proportionality; y=kx', 'Proportional-or-not sort with justification', ['algebra-geometry', 'multiplication-division']],
  ['percent-applications', 'Percent applications', 'Tax, tip, discount, markup, simple interest; percent change', 'Store-sale forensics: is "40% off then 20% off" 60% off? Prove', ['decimals-fractions']],
  ['area-of-polygons', 'Area of polygons', 'Triangles, parallelograms, trapezoids; composite figures', 'Decompose-two-ways challenge: same area, two decompositions', ['algebra-geometry']],
  ['circles', 'Circles', 'Circumference and area; π as a ratio (measured, then used)', 'Measure-π lab page: string-and-lid data → where does 3.14 come from?', ['algebra-geometry']],
  ['surface-area-volume', 'Surface area & volume', 'Nets → surface area; volume of prisms (incl. fractional edges)', 'Box-design optimization: most volume, least material', ['algebra-geometry']],
  ['measures-center-spread', 'Measures of center & spread', 'Mean/median/mode/range; MAD informally; which summary when', 'Outlier forensics: one number moves — what happens to mean vs median?', ['probability-statistics']],
  ['data-displays', 'Data displays', 'Histograms, box plots, dot plots; shape of distributions', 'Misleading-display detective: same data, two stories', ['probability-statistics']],
  ['probability', 'Probability', 'Probability scale 0–1; simple and compound events; experimental vs theoretical', 'Fair-game design: invent a game, prove whether it\'s fair', ['probability-statistics']],
  ['pre-algebra-capstone', 'Pre-algebra capstone', 'Mixed capstone: equations, proportions, rationals, percent', 'ANALYZE-style capstone: critique three worked solutions + vocabulary review', ['algebra-geometry', 'probability-statistics']],
];

/** The full catalog: 5 levels × 24 weeks = 120 concept cells, in ladder order. */
export const CONCEPT_CATALOG: readonly CatalogWeek[] = [
  ...expand('A', LEVEL_A),
  ...expand('B', LEVEL_B),
  ...expand('C', LEVEL_C),
  ...expand('D', LEVEL_D),
  ...expand('E', LEVEL_E),
];

/** Lookup for one Level × Week cell. */
export function getCatalogWeek(level: BBLevel, week: number): CatalogWeek | undefined {
  return CONCEPT_CATALOG.find((c) => c.level === level && c.week === week);
}

/** All 24 cells of one level, in week order. */
export function getLevelCatalog(level: BBLevel): CatalogWeek[] {
  return CONCEPT_CATALOG.filter((c) => c.level === level);
}
