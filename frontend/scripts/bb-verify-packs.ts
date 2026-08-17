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
  getTemplate,
  V2_WEEKS,
} from '../src/modules/best-brains/generator';
import { getCatalogWeek } from '../src/modules/best-brains/content/catalog';
import type { PackItem, WeeklyConceptPack } from '../src/modules/best-brains/types';

/** Every child-answered item that ships a generator spec (day + mastery items). */
function generatorItems(p: WeeklyConceptPack): PackItem[] {
  return [
    ...p.days.flatMap((d) => d.items),
    ...p.masteryCheck.formA,
    ...p.masteryCheck.formB,
  ];
}

const SEEDS = [12345, 67890, 424242, 8, 999983];

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

    // 2. Quality gates (v2 weeks validated under the v2 contract → QG-11 detector blocks)
    const contract = V2_WEEKS.has(`${cell.level}${cell.week}`) ? 'v2' : 'v1';
    const result = validatePack(pack, { contract });
    if (!result.valid) {
      for (const viol of result.violations) {
        console.error(`  FAIL  [seed ${seed}] ${viol.gate} @ ${viol.path}: ${viol.message}`);
      }
    }
    assert(result.valid, `[seed ${seed}] validator: ${result.violations.length} violation(s)`);

    // 3. Determinism: regenerate with the same seed → deep-equal
    const again = generatePack(cell.level, cell.week, seed);
    assert(packJson(pack) === packJson(again), `[seed ${seed}] same seed regenerates deep-equal pack`);

    // 3b. No authoring-time metadata leaks into the shipped pack (FIX-SPEC §3, review M2).
    assert(!packJson(pack).includes('"authorMeta"'), `[seed ${seed}] emitted pack carries no authorMeta`);

    // 3c. Every generator-backed item's templateId resolves in the registry, so the
    //     QG-5 arithmetic audit is never silently skipped (FIX-SPEC §5, review determinism-minor).
    for (const it of generatorItems(pack)) {
      if (it.generator) {
        assert(
          getTemplate(it.generator.templateId) !== undefined,
          `[seed ${seed}] item ${it.id} templateId "${it.generator.templateId}" resolves in registry`,
        );
      }
    }

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

// ---------------------------------------------------------------------------
// Figure census (B1.0) — what the child actually SEES.
//
// The L27 defect was invisible because nothing counted it: a `visual` field
// with a placeholder consumer looks identical to a rendered one in every gate.
// So it gets counted, every run, per level. The Level-A row is an ASSERTION,
// not a report: a pre-reader served an `[image: …]` with no picture behind it
// is served literal bracket characters, which is why Level A was blocked on
// this task at all.
// ---------------------------------------------------------------------------
console.log('\nFigure census — drawn pictures vs un-migrated [image: …] directions');
{
  const IMAGE = /\[image:/i;
  type Row = { figures: number; unmigrated: number; scriptFigs: number; scriptSegs: number; geFigs: number; ges: number };
  const rows = new Map<string, Row>();
  // Every level, not just A. A child served an un-migrated [image: …] sees no
  // picture at all — the prompt strips the direction and PromptFigure now says
  // nothing — so the question is unanswerable whatever level it is on.
  const unmigrated: string[] = [];
  const unmigratedA: string[] = [];

  for (const cell of AVAILABLE_WEEKS) {
    const pack = generatePack(cell.level, cell.week, SEEDS[0]);
    const row = rows.get(cell.level) ?? { figures: 0, unmigrated: 0, scriptFigs: 0, scriptSegs: 0, geFigs: 0, ges: 0 };
    for (const it of generatorItems(pack)) {
      if (it.figure) row.figures++;
      else if (IMAGE.test(it.prompt)) {
        row.unmigrated++;
        unmigrated.push(`${it.id}: ${it.prompt.slice(0, 60)}`);
        if (cell.level === 'A') unmigratedA.push(`${it.id}: ${it.prompt.slice(0, 60)}`);
      }
    }
    if (pack.puzzle.figure) row.figures++;
    else if (IMAGE.test(pack.puzzle.prompt)) {
      row.unmigrated++;
      unmigrated.push(`${pack.puzzle.id}: ${pack.puzzle.prompt.slice(0, 60)}`);
      if (cell.level === 'A') unmigratedA.push(`${pack.puzzle.id}: ${pack.puzzle.prompt.slice(0, 60)}`);
    }
    row.scriptSegs += pack.explanation.script.length;
    row.scriptFigs += pack.explanation.script.filter((s) => s.figure).length;
    row.ges += pack.guidedExamples.length;
    row.geFigs += pack.guidedExamples.filter((g) => g.figure).length;
    for (const g of pack.guidedExamples) {
      if (!g.figure && IMAGE.test(g.prompt)) {
        row.unmigrated++;
        unmigrated.push(`${g.id}: ${g.prompt.slice(0, 60)}`);
      }
    }
    rows.set(cell.level, row);
  }

  for (const [lvl, r] of [...rows.entries()].sort()) {
    console.log(
      `  Level ${lvl}: items drawn ${r.figures}, un-migrated [image:] ${r.unmigrated} · ` +
        `lesson script ${r.scriptFigs}/${r.scriptSegs} drawn · guided examples ${r.geFigs}/${r.ges} drawn`,
    );
  }
  // The named residue. B1.0 shipped ten primitives; these Level-A surfaces want
  // an eleventh, twelfth or thirteenth, so they are DECLARED rather than quietly
  // tolerated. The renderer already prevents the L27 harm everywhere —
  // `PromptFigure` shows the direction as a quiet caption, never raw bracket
  // characters — so what is left here is missing ARTWORK, not broken output.
  // The assertion is that this list does not GROW: any newly un-migrated
  // Level-A item fails the gate.
  //
  // 2026-08-09: four `A2-*` entries were removed. They described shape-pattern
  // strips in an A2 that no longer exists (the week was rebuilt onto the frame),
  // so they had become permits that could never match — the mirror of a detector
  // that never fires, silently pre-authorising anything that reused those ids.
  // The printed list now equals the measured count; if it ever does not, one of
  // the two is lying. (L49)
  const FIGURE_DEBT: Record<string, string> = {
    'A15-D2-01': 'hands/fingers manipulative; a five-frame would silently swap the authored manipulative',
    'A15-D4-03': 'deliberately NOT drawn: the item\'s own rationale says one group is drawn larger and spread out, and a one-to-one compare figure would hand over the answer the conservation trap exists to withhold',
    'A15-D5-04': 'a shape gallery (triangle/circle/square side by side) — angle-figure draws one polygon and no circle',
    'A15-PZ-01': 'a labelled-sum garden — no primitive',
    // Answerable without the picture: stripping the direction leaves
    // "45 - 27 = ? Trade first if the ones can't pay.", which is the whole task.
    // The base-ten model was support, not the question. Worth drawing (b14 has a
    // placeValueChart helper) but it does not block a child.
    'B14-D1-03': 'base-ten model of 45 — supportive only; the subtraction is fully stated in the prompt. Drawable via b14 placeValueChart; not yet migrated',
    // NOT answerable without the picture — the child is asked about a shape that
    // is never shown. This one needs content repair, not a permit, and is listed
    // so it stays visible until it gets one.
    'C22-D5-02': 'BLOCKING: a rhombus balanced on a corner with equal-side ticks — angle-figure cannot express the rotation or the tick marks, and the question cannot be answered without the shape. Needs a primitive or a reworded item',
  };
  const undeclared = unmigrated.filter((m) => !FIGURE_DEBT[m.split(':')[0]]);
  for (const miss of undeclared) console.error(`  FAIL  serves an UNDECLARED [image: …] with no picture — ${miss}`);
  assert(undeclared.length === 0, `no undeclared [image: …] prompts on ANY level (${undeclared.length} found)`);

  // …and the permit list must not outlive what it permits. A key matching no
  // observed surface is a dead permit: it reports nothing, looks like diligence,
  // and pre-authorises whatever later reuses that id. Four such keys survived an
  // entire A2 rebuild before anyone noticed (L49).
  const observed = new Set(unmigrated.map((m) => m.split(':')[0]));
  const deadPermits = Object.keys(FIGURE_DEBT).filter((id) => !observed.has(id));
  for (const id of deadPermits) console.error(`  FAIL  FIGURE_DEBT declares '${id}', which no Level-A surface emits — stale permit`);
  assert(deadPermits.length === 0, `FIGURE_DEBT has no dead permits (${deadPermits.length} found)`);
  console.log(`  Figure debt: ${unmigrated.length} declared surface(s) with no picture (Level A: ${unmigratedA.length})`);
  for (const [id, why] of Object.entries(FIGURE_DEBT)) console.log(`    · ${id} — ${why}`);
}

// Level-D coverage summary (the proof level: 23 template weeks + 1 fixture = 24).
const dCells = AVAILABLE_WEEKS.filter((w) => w.level === 'D');
const dTemplate = dCells.filter((w) => w.source === 'template').length;
const dFixture = dCells.filter((w) => w.source === 'fixture').length;
console.log(
  `\nLevel D coverage: ${dCells.length}/24 cells servable (${dTemplate} template + ${dFixture} fixture).`,
);

console.log(`\n${checks} assertions, ${failures} failure(s).`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log('ALL GREEN');
}
