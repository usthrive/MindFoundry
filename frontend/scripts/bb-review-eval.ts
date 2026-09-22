/**
 * bb-review-eval — does Ms. Wren read a child's explanation the way a teacher
 * would? (owner ruling 2026-09-22, option (a): grade and coach.)
 *
 * Run BY HAND, from frontend/, with a key in the environment:
 *
 *   ANTHROPIC_API_KEY=sk-… npx tsx scripts/bb-review-eval.ts
 *
 * NOT IN THE BATTERY, and deliberately. Every other bb-* gate is a pure
 * function of the corpus: same seeds, same answer, no network, no spend, safe
 * on every commit. This one calls a model, costs money per run, and can
 * disagree with itself between runs — three properties that would make the
 * battery untrustworthy as a gate. It is the thing you run when the prompt in
 * `review-prompt.ts` changes, and the number it prints is the thing you argue
 * with before shipping that change.
 *
 * THE PROMPT IS IMPORTED, NEVER RESTATED. `review-prompt.ts` is loaded from
 * `supabase/functions/ai-service/` by relative path — the same file the edge
 * function serves. A prompt tuned here and served from a copy over there is
 * not the prompt that was tuned; the file imports nothing precisely so that
 * Deno and tsx can both load it.
 *
 * THE ITEMS ARE REAL, NEVER INVENTED. All five come out of `generatePack` at a
 * pinned seed, so the rubric the model is judged against is the rubric a child
 * actually meets. Generated items are seed-dependent (B3-D5-02 is thimbles at
 * seed 12345 and sequins at 999983, with different numbers), so the seed is
 * pinned AND each fixture asserts the item's `answer.value`: if the corpus
 * moves under this file, it says so and stops rather than quietly grading the
 * model against sentences about a different problem.
 */

import Anthropic from '@anthropic-ai/sdk';
import { generatePack } from '../src/modules/best-brains/generator';
import { bandForLevel } from '../src/modules/best-brains/copy';
import type { BBLevel, PackItem } from '../src/modules/best-brains/types';
import {
  buildReviewSystem,
  buildReviewUser,
  parseReviewVerdict,
  type ReviewBand,
  type ReviewVerdict,
} from '../../supabase/functions/ai-service/review-prompt.ts';

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------

const SEED = 12345;
const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 400;
const TIMEOUT_MS = 6000;
/** The pass line: 16 of 20. Below it the prompt is not ready to read a child's writing. */
const PASS_AT = 16;
/** claude-sonnet-5 list price, $ per million tokens. */
const USD_PER_MTOK_IN = 2;
const USD_PER_MTOK_OUT = 10;

type Expected = ReviewVerdict['verdict'];

interface Fixture {
  level: BBLevel;
  week: number;
  itemId: string;
  /** The item's `answer.value` at SEED — asserted, so corpus drift is loud. */
  expectAnswerValue: string;
  /** Four child answers: correct-with-slip, partial, the item's own misconception, off-topic. */
  answers: Array<{ text: string; expect: Expected; kind: string }>;
}

/**
 * FIVE ITEMS × FOUR ANSWERS.
 *
 * The four shapes are the four ways this reader can be wrong, and they are
 * the reason the eval is worth running at all:
 *
 *   correct-with-slip  the whole point of "in their own words". A child who
 *                      has the idea and spells it badly must be got-it. A
 *                      reader that marks spelling is worse than no reader.
 *   partial            the number without the reasoning, or the reasoning
 *                      without the number. Must be partly, not a generous
 *                      got-it — praise inflation is the failure mode a warm
 *                      persona falls into.
 *   misconception      the item's OWN wrong answer, argued confidently. Must
 *                      be not-yet: a fluent sentence carrying the exact error
 *                      the item was built around is the hardest case, and the
 *                      one that matters most.
 *   off-topic          nothing about this problem. Must be not-yet, gently.
 */
const FIXTURES: Fixture[] = [
  {
    level: 'B',
    week: 3,
    itemId: 'B3-D5-02',
    expectAnswerValue: 'the true answer is 43; the error was the misconception, not the method',
    answers: [
      {
        kind: 'correct-with-slip',
        expect: 'got-it',
        text: 'The first tray reely holds 43 becuase ten more makes a tray fuller not emptyer. So the first tray holds more now.',
      },
      { kind: 'partial', expect: 'partly', text: 'It is 43.' },
      {
        kind: 'misconception',
        expect: 'not-yet',
        text: 'Ken is right, it is 23, because 33 take away ten is 23. So the other tray still holds more.',
      },
      { kind: 'off-topic', expect: 'not-yet', text: 'i like trays my brother has a tray asdfgh' },
    ],
  },
  {
    level: 'C',
    week: 13,
    itemId: 'C13-D5-02',
    expectAnswerValue: 'the true answer is 20; the error was the misconception, not the method',
    answers: [
      {
        kind: 'correct-with-slip',
        expect: 'got-it',
        text: 'The secound part is 5 x 4 which is 20, not 5 + 4. The student added the leftover peice instead of multiplying it by the 5 rows.',
      },
      { kind: 'partial', expect: 'partly', text: 'The second part is really worth 20.' },
      {
        kind: 'misconception',
        expect: 'not-yet',
        text: 'The second part is 9 because you put the 5 and the 4 back together, so 25 + 9 = 34 is right.',
      },
      { kind: 'off-topic', expect: 'not-yet', text: 'my favourite number is 7 and i have a dog' },
    ],
  },
  {
    level: 'D',
    week: 1,
    itemId: 'D1-D5-01',
    expectAnswerValue: 'the true answer is 823530; the error was the misconception, not the method',
    answers: [
      {
        kind: 'correct-with-slip',
        expect: 'got-it',
        text: 'Ten times means every digit slides one colum to the left on the chart, so 82,353 becomes 823,530. Ten MORE would only chnage the tens place, which is what the student did.',
      },
      { kind: 'partial', expect: 'partly', text: 'The true count is 823,530 boxes.' },
      {
        kind: 'misconception',
        expect: 'not-yet',
        text: 'Ten warehouses means you add ten on, so 82,353 + 10 = 82,363 and the student is right.',
      },
      { kind: 'off-topic', expect: 'not-yet', text: 'that is a lot of boxes for one warehouse haha' },
    ],
  },
  {
    level: 'E',
    week: 1,
    itemId: 'E1-D5-02',
    expectAnswerValue: 'the true answer is 9; the error was the misconception, not the method',
    answers: [
      {
        kind: 'correct-with-slip',
        expect: 'got-it',
        text: 'A ratio table grows by takeing copies, not by adding on. Three batches is three copys of the first row, so it pairs with 9 white tins.',
      },
      { kind: 'partial', expect: 'partly', text: '9 white tins.' },
      {
        kind: 'misconception',
        expect: 'not-yet',
        text: 'You add 3 to each row, so one batch is 3 tins and three batches is 3 + 3 = 6 tins. The student is right.',
      },
      { kind: 'off-topic', expect: 'not-yet', text: 'white paint is boring we painted my room blue' },
    ],
  },
  {
    level: 'B',
    week: 9,
    itemId: 'B9-D5-02',
    expectAnswerValue: 'the true answer is 2; the error was the misconception, not the method',
    answers: [
      {
        kind: 'correct-with-slip',
        expect: 'got-it',
        text: '16 is to big becuase you cant put in more than the whole lot. The box only went up by 2 baubles.',
      },
      { kind: 'partial', expect: 'partly', text: '2 were packed in.' },
      {
        kind: 'misconception',
        expect: 'not-yet',
        text: 'Zoe is right because 7 and 9 makes 16, so 16 baubles were packed in.',
      },
      { kind: 'off-topic', expect: 'not-yet', text: 'baubles baubles baubles hahaha this is fun' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('bb-review-eval needs a key: ANTHROPIC_API_KEY is not set.');
  console.error('This eval calls the model and costs money per run — that is why it is not in the battery.');
  console.error('Run it as:  ANTHROPIC_API_KEY=sk-… npx tsx scripts/bb-review-eval.ts');
  process.exit(2);
}

function findItem(level: BBLevel, week: number, itemId: string): PackItem {
  const pack = generatePack(level, week, SEED);
  const item = pack.days.flatMap((d) => d.items).find((i) => i.id === itemId);
  if (!item) throw new Error(`item ${itemId} is not in pack ${level}${week} at seed ${SEED}`);
  return item;
}

function truncate(text: string, n: number): string {
  return text.length <= n ? text : `${text.slice(0, n - 1)}…`;
}

async function main(): Promise<void> {
  const anthropic = new Anthropic({ apiKey });

  let right = 0;
  let total = 0;
  let inTokens = 0;
  let outTokens = 0;
  const rows: string[][] = [];
  const drift: string[] = [];

  for (const fx of FIXTURES) {
    const pack = generatePack(fx.level, fx.week, SEED);
    const item = findItem(fx.level, fx.week, fx.itemId);
    const band = bandForLevel(fx.level) as ReviewBand;
    if (band !== 'B' && band !== 'C') throw new Error(`${fx.itemId} is band ${band}; this path is B/C only`);

    // CORPUS DRIFT CHECK. These child answers were written about THESE numbers.
    if (item.answer.value !== fx.expectAnswerValue) {
      drift.push(
        `${fx.itemId}: answer.value is now "${item.answer.value}" but the fixtures were written for "${fx.expectAnswerValue}"`,
      );
      continue;
    }

    const system = buildReviewSystem(band);
    for (const a of fx.answers) {
      total += 1;
      const user = buildReviewUser({
        band,
        level: pack.identity.level,
        conceptName: pack.identity.conceptName,
        prompt: item.prompt,
        modelAnswer: item.answer.value,
        acceptableForms: item.answer.acceptableForms ?? [],
        hints: item.hintLadder ?? [],
        errorTags: item.errorTags ?? [],
        whyBeforeHow: pack.explanation.whyBeforeHow,
        childText: a.text,
      });

      let got = 'ERROR';
      let line = '';
      let nudge = '';
      try {
        const response = await anthropic.messages.create(
          {
            model: MODEL,
            max_tokens: MAX_TOKENS,
            // NO temperature: Sonnet 5 rejects it. Same as the edge function.
            system,
            messages: [{ role: 'user', content: user }],
          },
          { timeout: TIMEOUT_MS, maxRetries: 0 },
        );
        inTokens += response.usage.input_tokens;
        outTokens += response.usage.output_tokens;
        const text = response.content.find((c) => c.type === 'text');
        if (!text || text.type !== 'text') throw new Error('no text block');
        const verdict = parseReviewVerdict(text.text, band);
        got = verdict.verdict;
        line = verdict.line;
        nudge = verdict.nudge ?? '';
      } catch (e) {
        line = e instanceof Error ? e.message : String(e);
      }

      const hit = got === a.expect;
      if (hit) right += 1;
      rows.push([
        `${fx.itemId} (${band})`,
        a.kind,
        truncate(a.text, 46),
        a.expect,
        `${hit ? ' ' : '✗'}${got}`,
        truncate(line, 58),
        truncate(nudge, 44),
      ]);
    }
  }

  const header = ['item', 'answer kind', 'child text', 'expected', 'got', 'line', 'nudge'];
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)));
  const render = (cells: string[]) => cells.map((c, i) => (c ?? '').padEnd(widths[i])).join('  ');
  console.log(`\nbb-review-eval — ${MODEL}, seed ${SEED}, ${FIXTURES.length} items × 4 answers\n`);
  console.log(render(header));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const r of rows) console.log(render(r));

  if (drift.length) {
    console.log('\nCORPUS DRIFT — these items no longer match the fixtures they were written for:');
    for (const d of drift) console.log(`  ${d}`);
    console.log('  Re-read the item (scripts/bb-dump-pack.ts) and rewrite its four child answers.');
  }

  const cost = (inTokens / 1e6) * USD_PER_MTOK_IN + (outTokens / 1e6) * USD_PER_MTOK_OUT;
  console.log(`\ntokens: ${inTokens} in / ${outTokens} out — $${cost.toFixed(4)} at $${USD_PER_MTOK_IN}/$${USD_PER_MTOK_OUT} per MTok`);
  console.log(`accuracy: ${right}/${total}  (pass line ${PASS_AT}/20)`);

  const failed = drift.length > 0 || right < PASS_AT;
  console.log(`${failed ? 'FAIL' : 'PASS'} — ${right}/${total}`);
  process.exit(failed ? 1 : 0);
}

void main().catch((e) => {
  console.error('bb-review-eval failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
