/**
 * Does QG-11's pin actually DISCRIMINATE, or does it pass whatever it is handed?
 *
 * QG-11 proves a keyed option equals a recomputed truth. Its choice arm accepts
 * `numEq(correct.text, truth.correct) || correct.text.includes(truth.correct)`,
 * and that second clause is the hole: when the keyed option is a SENTENCE rather
 * than a bare numeral — "5 − 4 = 9", "13 = 4 + 9" — it contains several numerals,
 * so the check passes for the true value AND for the wrong ones. The pin is green
 * and audits nothing.
 *
 * Found by b08's author while trying to pin a discrimination whose options are
 * equations: they proved the pin passed on every draw for one operand order and
 * failed on every draw for the mirror order, which is the signature of a check
 * being satisfied by coincidence rather than by correctness.
 *
 * THIS IS A NEGATIVE CONTROL, which is the only way to measure a gate's power
 * (see the audit-probe rule: a probe without a negative control is inadmissible).
 * For every pinned choice-key item it asks: how many DIFFERENT values would this
 * same check have accepted? One means the pin is load-bearing. Two or more means
 * a wrong transform, a swapped operand order, or a mis-registered template would
 * have sailed through — the D6 bug class QG-11 exists to make impossible.
 *
 * OUTCOME (2026-07-30): the hole is CLOSED. QG-11's choice arm now requires a
 * whole-value match — equal as numbers, or equal as whole strings once currency and
 * thousands separators are set aside — instead of a substring. All 18,982 corpus
 * assertions and the QG-11 regression suite still pass, which means every one of the
 * 11 weak slots was substantively correct; they were simply not being PROVEN
 * correct. This script now stands as a census: the slots it lists are the ones whose
 * keyed option carries more than one number, i.e. the ones that would silently lose
 * their audit if anybody reintroduced a substring comparison.
 *
 * Run: npx tsx scripts/bb-qg11-power-test.ts [--level B] [--seeds 30]
 */

import { GENERATED_WEEKS, generatePack, CONTENT_VERSION } from '../src/modules/best-brains/generator/packGenerator';
import { getTemplate } from '../src/modules/best-brains/generator/templates/registry';

const argv = process.argv.slice(2);
const arg = (k: string) => {
  const i = argv.indexOf(k);
  return i >= 0 ? argv[i + 1] : undefined;
};
const ONLY_LEVEL = arg('--level')?.toUpperCase();
const SEEDS = Number(arg('--seeds') ?? 30);

interface Choice { text: string; isCorrect?: boolean }
interface Item {
  id?: string;
  prompt?: string;
  choices?: Choice[];
  answer?: { validation?: string; value?: string; acceptableForms?: string[] };
  generator?: { templateId?: string };
}

/** Distinct numerals a substring match could latch onto, longest first. */
function candidateValues(text: string): string[] {
  const found = text.match(/\d+(?:[.,]\d+)?/g) ?? [];
  return [...new Set(found)];
}

interface Weak { slot: string; templateId: string; option: string; accepts: string[] }
const weak = new Map<string, Weak>();
let pinnedChoiceItems = 0;
let strongItems = 0;

for (const { level, week } of GENERATED_WEEKS) {
  if (ONLY_LEVEL && level !== ONLY_LEVEL) continue;
  const id = `${level}${week}`;
  for (let i = 0; i < SEEDS; i++) {
    let pack: Record<string, any>;
    try {
      pack = generatePack(level, week, i * 7 + 1, CONTENT_VERSION) as unknown as Record<string, any>;
    } catch {
      break;
    }
    const visit = (it: Item, where: string) => {
      // Only PINNED choice-key items are in scope: those are the ones whose claim
      // QG-11 is supposed to be recomputing.
      if (!it.generator?.templateId) return;
      if (it.answer?.validation !== 'choice-key' || !it.choices) return;
      // ONLY items QG-11 actually audits. Its recompute branch runs only when the
      // registered template exposes a `verifyFor`; without one the item is audited
      // by QG-5 against `answerFor` instead, and reporting it here would invent a
      // hole that cannot be reached. The first version of this probe missed that and
      // over-reported by counting every pinned choice item — the same mistake the
      // entropy gate made when its filter keyed on a field that was never set.
      const tpl = getTemplate(it.generator.templateId) as { verifyFor?: unknown } | undefined;
      if (!tpl || typeof tpl.verifyFor !== 'function') return;
      const keyed = it.choices.find((c) => c.isCorrect);
      if (!keyed) return;
      pinnedChoiceItems++;

      const values = candidateValues(keyed.text);
      // A bare numeral is matched by numEq and is load-bearing whatever else is
      // in the string; the hole only opens when the text carries several numbers
      // and the check falls through to `includes`.
      const isBareNumber = /^\s*\d+(?:[.,]\d+)?\s*$/.test(keyed.text);
      if (isBareNumber || values.length <= 1) {
        strongItems++;
        return;
      }
      const key = `${id} ${where}`;
      if (!weak.has(key)) {
        weak.set(key, { slot: key, templateId: it.generator.templateId, option: keyed.text, accepts: values });
      }
    };
    (pack.days ?? []).forEach((d: Record<string, any>, di: number) => {
      (d.items ?? []).forEach((it: Item, ii: number) => visit(it, `day${di + 1}[${ii}]`));
    });
    for (const form of ['formA', 'formB']) {
      ((pack.masteryCheck ?? {})[form] ?? []).forEach((it: Item, ii: number) => visit(it, `${form}[${ii}]`));
    }
    if (pack.puzzle) visit(pack.puzzle as Item, 'puzzle');
  }
}

const rows = [...weak.values()].sort((a, b) => b.accepts.length - a.accepts.length);

console.log(`\nbb-qg11-power — pinned choice-key items: ${pinnedChoiceItems} (${strongItems} matched on a bare numeral)\n`);
if (rows.length === 0) {
  console.log('Every pinned keyed option is a bare numeral, so every pin discriminates.\n');
} else {
  console.log(`${rows.length} slot(s) where the keyed option carries MORE THAN ONE number, so`);
  console.log(`\`correct.text.includes(truth.correct)\` would have accepted any of them:\n`);
  for (const r of rows) {
    console.log(`  ${r.slot}  [${r.templateId}]`);
    console.log(`      keyed option: "${r.option}"`);
    console.log(`      would also accept: ${r.accepts.join(', ')}  (${r.accepts.length} values)`);
  }
  console.log(`\n  Under the CURRENT validator these are audited correctly: the choice arm`);
  console.log(`  requires a whole-value match, so a partial numeral no longer satisfies it.`);
  console.log(`  They are listed because they are the slots that would silently lose their`);
  console.log(`  audit if a substring comparison were ever reintroduced.\n`);
}
process.exit(0);
