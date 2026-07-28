/**
 * QG-12 regression suite — proves each surface-realism scan FIRES.
 *
 * A gate that has never failed is a gate nobody has tested. Every case below is
 * a real defect that shipped through 7,877 green correctness assertions AND a
 * 23/23 authenticity pass, because in each one the VALUE was right and only the
 * presentation was impossible. Each test deliberately re-breaks one, asserts the
 * scan catches it, then asserts the honest counterpart is NOT caught — the
 * false-positive half matters as much, since a gate that fires on correct content
 * gets switched off.
 *
 * Run: npx tsx scripts/bb-qg12-test.ts
 */

import { generatePack } from '../src/modules/best-brains/generator/packGenerator';
import { validatePack } from '../src/modules/best-brains/generator/validator';
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

function gatesFired(pack: WeeklyConceptPack, prefix: string): string[] {
  return validatePack(pack, { contract: 'v2' })
    .violations.filter((v) => v.gate.startsWith(prefix))
    .map((v) => v.gate);
}

/** Mutate the first day-1 item's prompt and report which QG-12 gates fire. */
function withPrompt(text: string): string[] {
  const p = base();
  p.days[0].items[0].prompt = text;
  return gatesFired(p, 'QG-12');
}

console.log('\nQG-12a — currency rendering');
check('one-decimal money is caught', withPrompt('A pencil costs $0.5. How much is that in cents?').includes('QG-12a'), '$0.5');
check('finer-than-a-cent money is caught', withPrompt('A pencil costs $0.125 today.').includes('QG-12a'), '$0.125');
check('"$x of a dollar" is caught', withPrompt('A coin is worth $0.10 of a dollar. Write it as a fraction.').includes('QG-12a'), 'sign + phrase');
check('mixing cents with a bare-dollar amount is caught', withPrompt('You have $1 and spend $0.40 on a badge. What is left?').includes('QG-12a'), '$1 beside $0.40');
check('correct 2dp money is NOT caught', !withPrompt('You have $1.00 and spend $0.40 on a badge. What is left?').includes('QG-12a'), 'false-positive guard');
check('a bill DENOMINATION stays exempt', !withPrompt('Ben pays with a $10 bill for a book costing $2.35. How much change?').includes('QG-12a'), '"$10 bill" is an object');

console.log('\nQG-12b — context-sensitive fraction simplification');
{
  const p = base();
  const it = p.days[0].items[0];
  it.type = 'word-problem';
  it.generator = { templateId: 'd_multistep_rat_v1', params: {}, seed: 1 };
  it.prompt = 'A recipe uses 2/4 cup of flour. How many cups is that?';
  check('unreduced real-world QUANTITY is caught', gatesFired(p, 'QG-12b').length > 0, '2/4 cup of flour');

  it.prompt = 'A path is split into 6 equal legs and a bench sits at the 2/6 mark. Which mark is it?';
  check('PARTITION-ANCHORED unreduced is NOT caught', gatesFired(p, 'QG-12b').length === 0, 'prose states the partition');

  it.prompt = 'Which is greater: 1/2 or 2/6?';
  check('COMPARISON unreduced is NOT caught', gatesFired(p, 'QG-12b').length === 0, 'the unreduced form IS the lesson');

  it.generator = { templateId: 'd_frac_equiv_v1', params: {}, seed: 1 };
  it.prompt = 'Rename 2/6 into twelfths.';
  check('LESSON-OBJECT template is NOT caught', gatesFired(p, 'QG-12b').length === 0, 'd_frac_equiv_v1');

  it.type = 'computation';
  it.generator = { templateId: 'd_frac_times_whole_v1', params: {}, seed: 1 };
  it.prompt = '2 × 6/8 = ?';
  check('BARE ARITHMETIC unreduced is NOT caught', gatesFired(p, 'QG-12b').length === 0, 'no real-world context to be wrong about');
}

console.log('\nQG-12c — number/noun and article agreement');
check('"1 liters" is caught', withPrompt('Tom pours 1 liters of juice into the jug.').includes('QG-12c'), 'count of one, plural noun');
check('"1 marbles" is caught', withPrompt('Ben has 1 marbles left in the bag.').includes('QG-12c'), '');
check('"a 8 cm strip" is caught', withPrompt('Zoe tapes a 8 cm strip onto the rope.').includes('QG-12c'), 'vowel-sound numeral');
check('"a 11-metre rope" is caught', withPrompt('Ken cuts a 11 metre rope into pieces.').includes('QG-12c'), '');
check('broken singular "buse" is caught', withPrompt('Each buse holds 6 riders.').includes('QG-12c'), 'naive .slice(0,-1)');
check('"1 litre" is NOT caught', !withPrompt('Tom pours 1 litre of juice into the jug.').includes('QG-12c'), 'false-positive guard');
check('"an 8 cm strip" is NOT caught', !withPrompt('Zoe tapes an 8 cm strip onto the rope.').includes('QG-12c'), '');
check('"1 km" (invariant unit) is NOT caught', !withPrompt('The trail is 1 km long from the gate.').includes('QG-12c'), '');
check('a decimal ending in .1 is NOT caught', !withPrompt('The jug holds 4.1 litres of water.').includes('QG-12c'), '"4.1 litres" is not a count of one');
check('a NAMED digit is NOT caught', !withPrompt('Find which place the 1 sits in.').includes('QG-12c'), 'digit reference, not a count');
check('an enumerated 1 is NOT caught', !withPrompt('Benchmark number line with 0, 1/2, 1 flags.').includes('QG-12c'), 'list element, not a count');

console.log('\nPinned fixtures are report-only (as for QG-11)');
for (const [lvl, wk] of [['A', 15], ['B', 14], ['D', 17]] as const) {
  const p = generatePack(lvl, wk, 777) as WeeklyConceptPack;
  check(`fixture ${lvl}${wk} is never failed by QG-12`, gatesFired(p, 'QG-12').length === 0, p.packId);
}

console.log('\nThe live corpus is clean');
{
  let dirty = 0;
  for (let w = 1; w <= 24; w++) {
    for (const seed of [777, 12345, 424242, 999983]) {
      const p = generatePack('D', w, seed) as WeeklyConceptPack;
      dirty += gatesFired(p, 'QG-12').length;
    }
  }
  check('Level D × 4 seeds has zero QG-12 violations', dirty === 0, `${dirty} found`);
}

console.log(`\n${fail === 0 ? 'ALL QG-12 REGRESSION TESTS PASS' : `${fail} FAILURE(S)`}  (${pass} passed)`);
process.exit(fail === 0 ? 0 : 1);
