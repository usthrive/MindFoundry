/**
 * Generator-family smoke suite — every family generator, over many seeds.
 *
 * The families (clock · money · ratio · integers · stats · earlynumber ·
 * algebra) are what Levels A/B/C/E are written on, and a fault in one of them
 * multiplies across every week that uses it. A week-level check would find that
 * eventually and expensively; this finds it at the source.
 *
 * For every exported generator, over N seeds, it asserts:
 *   1. it does not throw;
 *   2. its `templateId` RESOLVES in the registry — an unregistered id silently
 *      skips the QG-5 audit, so this is the same hole `bb-verify-packs` closes
 *      for packs, closed one layer earlier;
 *   3. the registered `answerFor` recomputes the generator's OWN `answer.value`
 *      from the params it shipped — the correctness invariant itself;
 *   4. any `verifyFor` recomputes, and an error-analysis prompt really shows the
 *      misconception value it claims to;
 *   5. any figure is well-formed AND does not contradict the item (QG-13's two
 *      checks, applied per item rather than per pack);
 *   6. hints are SEED-INVARIANT — the ladder must not vary with the operands,
 *      because a name/number-templated hint breaks the pack-generation dedup for
 *      whichever learner draws the unlucky seed (LEARNINGS L19).
 *
 * Run: npx tsx scripts/bb-family-test.ts [seeds]
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { streamRng } from '../src/modules/best-brains/generator/rng';
import { PERSON_NAMES } from '../src/modules/best-brains/generator/surface';
import { TupleGuard } from '../src/modules/best-brains/generator/templates/shared';
import { getTemplate } from '../src/modules/best-brains/generator/templates/registry';
import { checkFigureShape, figureValue } from '../src/modules/best-brains/figures/assert';
import { promptText } from '../src/modules/best-brains/figures/prompt';
import type { ItemDraft } from '../src/modules/best-brains/generator/templates/shared';

import * as clock from '../src/modules/best-brains/generator/templates/lib/clock';
import * as money from '../src/modules/best-brains/generator/templates/lib/money';
import * as ratio from '../src/modules/best-brains/generator/templates/lib/ratio';
import * as integers from '../src/modules/best-brains/generator/templates/lib/integers';
import * as stats from '../src/modules/best-brains/generator/templates/lib/stats';
import * as earlynumber from '../src/modules/best-brains/generator/templates/lib/earlynumber';
import * as algebra from '../src/modules/best-brains/generator/templates/lib/algebra';

const SEEDS = Number(process.argv[2] ?? 60);

/**
 * Sample arguments for the generators that REQUIRE options.
 *
 * Guessing (calling with `{}`) produced NaN operands and looked like a family
 * fault when it was a harness fault, so the shapes are named here from each
 * family's exported option types. A generator that needs options and is not
 * listed shows up as UNEXERCISED, which is the honest outcome — an untested
 * generator must never read as a passing one.
 */
const ARGS: Record<string, unknown[][]> = {
  // earlynumber
  'earlynumber.countArrangement': [[{ min: 1, max: 5 }], [{ min: 4, max: 9, arrangement: 'scattered' }]],
  'earlynumber.countByTens': [[{ minTens: 2, maxTens: 5 }]],
  'earlynumber.howManyChoice': [[{ min: 2, max: 6 }]],
  'earlynumber.setForNumeral': [[{ min: 2, max: 6 }], [{ min: 3, max: 8, groups: 3 }]],
  'earlynumber.tenFrameRead': [[{ min: 1, max: 9 }], [{ min: 11, max: 19, frames: 2 }]],
  'earlynumber.tenFrameBuild': [[{ min: 2, max: 8 }]],
  'earlynumber.tenFrameEmpty': [[{ min: 2, max: 8 }], [{ min: 1, max: 4, size: 5 }]],
  'earlynumber.partnersHiding': [[{ total: 5 }], [{ total: 10 }]],
  'earlynumber.partnerBox': [[{ total: 5 }], [{ total: 10 }]],
  'earlynumber.allWaysToMake': [[{ total: 5 }]],
  'earlynumber.neighbourNumber': [[{ kind: 'before', min: 2, max: 9 }], [{ kind: 'between', min: 2, max: 9 }]],
  'earlynumber.pickExtreme': [[{ which: 'smallest', min: 1, max: 9 }], [{ which: 'biggest', min: 2, max: 10 }]],
  'earlynumber.patternNext': [[{ kind: 'AB' }], [{ kind: 'ABB' }], [{ kind: 'AAB' }]],
  'earlynumber.pictureJoin': [[{ min: 1, max: 5, maxTotal: 10 }]],
  'earlynumber.pictureTakeAway': [[{ min: 3, max: 9 }]],
  'earlynumber.joinOrTakeAway': [[{ min: 2, max: 8 }]],
  'earlynumber.numeralTrap': [[{ trap: 'six-nine' }], [{ trap: 'teen-ty' }], [{ trap: 'digit-swap' }]],
  'earlynumber.compareSets': [[{ which: 'more', min: 2, max: 8 }], [{ which: 'fewer', min: 2, max: 8 }]],
  'earlynumber.compareMeasure': [[{ attr: 'length' }], [{ attr: 'weight' }], [{ attr: 'capacity' }]],
  'earlynumber.solidChoice': [[{ test: 'rolls' }], [{ test: 'stacks' }]],
  'earlynumber.puppetSlip': [[{ slip: 'double-count' }], [{ slip: 'skip-count' }], [{ slip: 'count-back-start' }], [{ slip: 'teen-writing' }]],
  'earlynumber.sortAndTell': [[{ min: 2, max: 9 }]],
  // clock — granularity/misread modes
  'clock.readClock': [['hour'], ['half'], ['quarter'], ['five'], ['minute']],
  'clock.drawHands': [['half'], ['quarter']],
  'clock.elapsedMinutes': [['five']],
  'clock.elapsedThenMore': [['five']],
  'clock.misreadClockEA': [['hand-swap'], ['quarter-flip'], ['hour-drift']],
  // money
  'money.miscountEA': [['nickel-as-1'], ['count-coins']],
  // ratio
  'ratio.percentConversion': [['to-decimal'], ['to-fraction'], ['from-fraction']],
  // integers
  'integers.orderTemperatures': [['asc'], ['desc']],
  // algebra — the equation move, the expansion under test, the inequality shape
  'algebra.oneStepEquation': [['add'], ['sub'], ['mul'], ['div']],
  'algebra.evaluateBothAtX': [['equivalent'], ['distribute-once']],
  'algebra.solveInequality': [['one'], ['two']],
};
const FAMILIES: Array<[string, Record<string, unknown>]> = [
  ['clock', clock], ['money', money], ['ratio', ratio], ['integers', integers],
  ['stats', stats], ['earlynumber', earlynumber], ['algebra', algebra],
];

let checks = 0;
let failures = 0;
const leaks: string[] = [];
const seen = new Map<string, string[]>();
function fail(family: string, gen: string, msg: string): void {
  failures++;
  const key = `${family}.${gen}`;
  const list = seen.get(key) ?? [];
  if (list.length < 2) {
    list.push(msg);
    seen.set(key, list);
    console.error(`  FAIL ${key}: ${msg}`);
  }
}

/** Loose value comparison — punctuation and units never, VALUE always. */
function numish(s: string): number | null {
  const t = s.trim().replace(/[$¢°,\s]/g, '');
  let m = /^(-?\d+)\/(\d+)$/.exec(t);
  if (m) return Number(m[1]) / Number(m[2]);
  m = /^(-?\d+(?:\.\d+)?)/.exec(t);
  return m ? Number(m[1]) : null;
}
function sameValue(a: string, b: string): boolean {
  if (a.trim().toLowerCase() === b.trim().toLowerCase()) return true;
  const x = numish(a);
  const y = numish(b);
  return x !== null && y !== null && Math.abs(x - y) < 1e-9;
}

for (const [family, mod] of FAMILIES) {
  const names = Object.keys(mod).filter((k) => typeof (mod as Record<string, unknown>)[k] === 'function');
  let exercised = 0;
  const unexercised: string[] = [];

  for (const name of names) {
    const factory = (mod as Record<string, (...a: unknown[]) => unknown>)[name];
    // A family exports both ItemGen FACTORIES (zero required args) and plain
    // helpers (meanOf, totalCents…). Only the factories are generators; a
    // helper either throws on a no-arg call or returns a non-function.
    // A family exports ItemGen FACTORIES (some zero-arg, some taking an options
    // object) alongside plain helpers (meanOf, totalCents…). Try both shapes;
    // anything that still will not yield a generator is reported as UNEXERCISED
    // rather than silently skipped — an untested generator must not look like a
    // passing one.
    const argSets = ARGS[`${family}.${name}`] ?? [[]];
    const gens: unknown[] = [];
    for (const a of argSets) {
      try {
        const v = factory(...(a as unknown[]));
        if (typeof v === 'function') gens.push(v);
      } catch (e) {
        if (ARGS[`${family}.${name}`]) fail(family, name, `factory threw on ${JSON.stringify(a)}: ${(e as Error).message}`);
      }
    }
    if (gens.length === 0) { unexercised.push(name); continue; }
    exercised++;
    for (const gen of gens) {

    for (const gen2 of [gens[0]]) { void gen2; }
    const ladders = new Set<string>();
    for (let i = 0; i < SEEDS; i++) {
      const rng = streamRng(i * 7919 + 13, 'fam');
      const guard = new TupleGuard();
      let d: ItemDraft;
      try {
        d = (gen as (r: unknown, g: unknown, diff: number) => ItemDraft)(rng, guard, 3);
      } catch (e) {
        fail(family, name, `THREW at seed ${i}: ${(e as Error).message}`);
        continue;
      }
      checks++;

      // (6) hints must not vary with the operands
      ladders.add((d.hintLadder ?? []).join(' | '));

      // (7) THE ANSWER MUST NOT BE PRINTED IN ITS OWN PROMPT.
      // Found by an author, not by this suite: "x + 8 = 16" hands over the 8 it
      // asks for, turning a solving item into a copying item for whichever
      // learner drew that seed — invisible to every value-based gate, because
      // the value is right. Carve-outs: an error-analysis prompt shows the
      // student's wrong number by design, and a choice-key answer is a letter.
      // Scoped deliberately, because the naive form fires on correct content and
      // a gate that cries wolf gets switched off. What it does NOT cover, stated
      // plainly (L30): a `drawing`/`representation` item legitimately names its
      // own target ("Draw 2 counters"); a statistics item's answer is often a
      // member of the data it lists (the MODE always is, and a range or missing
      // value can coincide); and a choice-key answer is a letter. So the check
      // runs where the invariant genuinely holds — a computation or word problem
      // over a handful of operands, which is where the equation class lives.
      // REPORT-ONLY, and that is a considered decision. The defect is real — an
      // author found seven generators printing "x + 8 = 16", handing over the 8
      // the item asks for — but it is NOT mechanically separable from correct
      // content: the mode of a list is always one of the listed values, the
      // partner of 5 in 10 is 5, a temperature swing can land on a number the
      // story already said. Every scoping I tried still fired on correct items,
      // and a gate that cries wolf gets switched off (the QG-12 lesson). So it
      // prints a census a human reads, and the guarantee stays where it works:
      // authors construct clear of their own operands.
      const LEAK_EXEMPT_TYPES = new Set(['error-analysis', 'drawing', 'representation', 'classification']);
      if (!LEAK_EXEMPT_TYPES.has(d.type) && d.answer.validation !== 'choice-key' && !d.choices) {
        const ans = d.answer.value.trim();
        const tokens = promptText(d.prompt).match(/-?\d+(?:\.\d+)?/g) ?? [];
        // ≥4 operands means a data list; the answer being among them is normal.
        if (/^-?\d+$/.test(ans) && tokens.length < 4 && tokens.includes(ans)) {
          leaks.push(`${family}.${name}: answer "${ans}" appears in "${promptText(d.prompt).slice(0, 90)}"`);
        }
      }

      // (2)(3) the answer the generator shipped must be re-derivable
      const spec = d.generator;
      if (spec) {
        const tpl = getTemplate(spec.templateId);
        if (!tpl) {
          fail(family, name, `templateId "${spec.templateId}" does not resolve in the registry`);
        } else if (tpl.answerFor && ['exact-numeric', 'equivalent-numeric', 'equivalent-fraction'].includes(d.answer.validation)) {
          let recomputed: string | null = null;
          try {
            recomputed = tpl.answerFor(spec.params);
          } catch (e) {
            fail(family, name, `answerFor("${spec.templateId}") threw: ${(e as Error).message}`);
          }
          if (recomputed !== null) {
            const forms = [d.answer.value, ...(d.answer.acceptableForms ?? [])];
            if (!forms.some((f) => sameValue(f, recomputed!))) {
              fail(family, name, `answerFor gives "${recomputed}" but the item answers "${d.answer.value}" (params ${JSON.stringify(spec.params)})`);
            }
          }
        }
        // (4) embedded-claim truth
        if (tpl?.verifyFor) {
          try {
            const truth = tpl.verifyFor(spec.params);
            if (d.type === 'error-analysis' && truth.wrong !== undefined && !d.prompt.includes(truth.wrong)) {
              fail(family, name, `error-analysis prompt does not show the recomputed misconception value "${truth.wrong}"`);
            }
            if (d.choices) {
              const correct = d.choices.find((c) => c.isCorrect);
              if (correct && !sameValue(correct.text, truth.correct) && !correct.text.includes(truth.correct)) {
                fail(family, name, `option keyed correct ("${correct.text}") ≠ recomputed truth "${truth.correct}"`);
              }
            }
          } catch (e) {
            fail(family, name, `verifyFor threw: ${(e as Error).message}`);
          }
        }
      }

      // (5) the picture must be possible, and must not contradict the item
      if (d.figure) {
        for (const problem of checkFigureShape(d.figure)) fail(family, name, `figure: ${problem}`);
        if (d.figure.asserts) {
          const forms = figureValue(d.figure);
          if (!forms) {
            fail(family, name, `figure asserts "${d.figure.asserts.of ?? '(default)'}" which this figure type cannot compute`);
          } else {
            const want = d.figure.asserts.equals === 'answer'
              ? [d.answer.value, ...(d.answer.acceptableForms ?? [])]
              : [String(spec?.params?.[d.figure.asserts.equals.slice(6)])];
            if (!forms.some((f) => want.some((w) => sameValue(f, w)))) {
              fail(family, name, `figure shows "${forms[0]}" but the item's ${d.figure.asserts.equals} is "${want[0]}" — the picture contradicts the item`);
            }
          }
        }
      }
    }

    if (ladders.size > 1) {
      fail(family, name, `hint ladder is SEED-VARIANT (${ladders.size} distinct ladders across ${SEEDS} seeds) — it must be fixed, role-based, name-free and number-free`);
    }
    }
  }
  console.log(
    `  ${family.padEnd(12)} ${String(exercised).padStart(2)} generators exercised` +
      (unexercised.length ? `   · not exercised (helpers or needing args): ${unexercised.join(', ')}` : ''),
  );
}

/**
 * The same-day name guard's pool must cover every family's cast.
 *
 * `makeWeekBuilder` stops two items on one day naming the same child by
 * scanning for `PERSON_NAMES` (generator/surface.ts). A family that adds an
 * actor outside that list is simply not guarded — the guard goes blind without
 * failing, which is the failure mode this suite exists to make impossible. So
 * the pools are compared here, where every family is already imported.
 *
 * Read out of the SOURCE rather than from an export, because the seven copies
 * are private `const NAMES` declarations; centralising them is a seven-file
 * change and is not what this check is for.
 */
{
  const here = dirname(fileURLToPath(import.meta.url));
  const libDir = join(here, '../src/modules/best-brains/generator/templates/lib');
  const pool = new Set(PERSON_NAMES);
  let scanned = 0;
  for (const file of ['items', 'integers', 'ratio', 'stats', 'clock', 'money', 'algebra']) {
    const src = readFileSync(join(libDir, `${file}.ts`), 'utf8');
    const m = /^const NAMES = \[([^\]]*)\]/m.exec(src);
    if (!m) {
      fail(file, 'NAMES', `no 'const NAMES = [...]' pool found — the same-day name guard cannot be checked against this family`);
      continue;
    }
    scanned++;
    const names = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    const missing = names.filter((n) => !pool.has(n));
    if (missing.length) {
      fail(file, 'NAMES', `draws ${missing.join(', ')} but generator/surface.ts PERSON_NAMES does not list ${missing.length > 1 ? 'them' : 'it'} — makeWeekBuilder's same-day name guard is BLIND to ${missing.length > 1 ? 'those names' : 'that name'}`);
    }
  }
  console.log(`\n  same-day name guard: ${scanned}/7 family pools ⊆ PERSON_NAMES (${pool.size} names)`);
}

if (leaks.length) {
  const byGen = new Map<string, number>();
  for (const l of leaks) byGen.set(l.split(':')[0], (byGen.get(l.split(':')[0]) ?? 0) + 1);
  console.log(`\n  answer-in-prompt census (REPORT-ONLY — read these, most are legitimate): ${leaks.length} across ${byGen.size} generators`);
  for (const [g, n] of [...byGen.entries()].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(4)}×  ${g}`);
}

console.log(`\n${checks} generator instantiations over ${SEEDS} seeds. ${failures === 0 ? 'ALL FAMILY CHECKS PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
