/**
 * Best Brains pack verification — increment-2 acceptance harness.
 *
 * Run: npx tsx scripts/bb-verify-packs.ts (from frontend/)
 *
 * For every available (level, week) cell × 3 seeds:
 *  1. generate the pack,
 *  2. run the QG-1..QG-10 validator (zero violations required),
 *  3. assert determinism: same seed → deep-equal (JSON-identical) pack,
 *  4. template cells: different seeds → different surfaces;
 *     fixture cells: seed-independent (static pack, byte-identical),
 *  5. assert Form-B surface disjointness from Form A (per index: different
 *     prompt, different operand tuple where extractable),
 *  6. assert the pack's conceptId matches the CURRICULUM-MAP catalog cell.
 */

import {
  AVAILABLE_WEEKS,
  generatePack,
  validatePack,
  surfaceSignature,
} from '../src/modules/best-brains/generator';
import { getCatalogWeek } from '../src/modules/best-brains/content/catalog';
import type { WeeklyConceptPack } from '../src/modules/best-brains/types';

const SEEDS = [12345, 67890, 424242];

let failures = 0;
let checks = 0;

function assert(cond: boolean, label: string): void {
  checks++;
  if (!cond) {
    failures++;
    console.error(`  FAIL  ${label}`);
  }
}

function packJson(p: WeeklyConceptPack): string {
  return JSON.stringify(p);
}

console.log(`Verifying ${AVAILABLE_WEEKS.length} packs x ${SEEDS.length} seeds\n`);

for (const cell of AVAILABLE_WEEKS) {
  const label = `${cell.level}${cell.week} (${cell.source})`;
  console.log(`— Pack ${label}`);
  const bySeed: string[] = [];

  for (const seed of SEEDS) {
    const pack = generatePack(cell.level, cell.week, seed);

    // 2. Quality gates
    const result = validatePack(pack);
    if (!result.valid) {
      for (const viol of result.violations) {
        console.error(`  FAIL  [seed ${seed}] ${viol.gate} @ ${viol.path}: ${viol.message}`);
      }
    }
    assert(result.valid, `[seed ${seed}] validator: ${result.violations.length} violation(s)`);

    // 3. Determinism: regenerate with the same seed → deep-equal
    const again = generatePack(cell.level, cell.week, seed);
    assert(packJson(pack) === packJson(again), `[seed ${seed}] same seed regenerates deep-equal pack`);

    // 5. Form-B disjointness from Form-A surfaces (per index)
    const { formA, formB } = pack.masteryCheck;
    assert(formA.length === formB.length, `[seed ${seed}] formA/formB pair by index`);
    formA.forEach((a, i) => {
      const b = formB[i];
      assert(a.prompt !== b.prompt, `[seed ${seed}] formB[${i}] prompt differs from formA[${i}]`);
      const sa = surfaceSignature(a);
      const sb = surfaceSignature(b);
      if (sa && sb) {
        assert(sa !== sb, `[seed ${seed}] formB[${i}] operand surface differs from formA[${i}]`);
      }
    });

    // 6. Catalog agreement
    const cat = getCatalogWeek(cell.level, cell.week);
    assert(cat !== undefined, `[seed ${seed}] catalog has cell ${cell.level}${cell.week}`);
    if (cat) {
      assert(
        pack.identity.conceptId === cat.conceptId,
        `[seed ${seed}] conceptId "${pack.identity.conceptId}" matches catalog "${cat.conceptId}"`,
      );
    }

    bySeed.push(packJson(pack));
  }

  // 4. Seed sensitivity
  if (cell.source === 'template') {
    for (let i = 0; i < SEEDS.length; i++) {
      for (let j = i + 1; j < SEEDS.length; j++) {
        assert(
          bySeed[i] !== bySeed[j],
          `seeds ${SEEDS[i]} vs ${SEEDS[j]} produce different surfaces`,
        );
      }
    }
  } else {
    for (let i = 1; i < SEEDS.length; i++) {
      assert(bySeed[0] === bySeed[i], `fixture is seed-independent (seed ${SEEDS[i]})`);
    }
  }
  console.log(`  ok (${cell.source})`);
}

console.log(`\n${checks} assertions, ${failures} failure(s).`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log('ALL GREEN');
}
