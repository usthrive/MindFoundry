/**
 * Does the lesson SPEAK, and does a long spoken segment SHOW anything?
 *
 * Two rules, from one afternoon watching a seven-year-old on Level C Day 1
 * (2026-08-31). Ms. Wren stopped mid-sentence, and the surface she stopped in
 * the middle of had no picture at all.
 *
 * ---------------------------------------------------------------------------
 * PART 1 — CHUNKING (hard). `services/speechChunk.ts` is what stops the browser
 * cutting her off, and it is a pure function precisely so a gate can hold it:
 *
 *   · Chrome stops a SINGLE utterance at roughly fifteen seconds, with no
 *     error event — the voice just ends. 59.2% of this corpus's lesson
 *     segments were longer than that.
 *   · `ttsService`'s own watchdog used to cancel any utterance still running
 *     at thirty seconds, on every browser. That was 26.7% of segments.
 *
 * So: every chunk must fit the speech budget, and chunking must never lose,
 * invent or re-order a word. A silent failure here is a child mid-lesson.
 *
 * PART 2 — VISUAL COVER (census). The owner's ruling, same day: a long why is
 * RIGHT and stays — the argument is the point of the lesson — provided it is
 * SHOWN in action rather than only said. So a spoken segment past
 * `VISUAL_REQUIRED_SECONDS` wants a figure, and this reports the ones without.
 * Census, not failure: 117 weeks were authored before the rule existed and the
 * backlog is content work, not a bug (L35 — a gate that fails on its first run
 * is a gate switched off within a week).
 *
 * Run: npx tsx scripts/bb-lesson-audio-test.ts [--level C] [--strict] [--all]
 */

import { AVAILABLE_WEEKS, generatePack, CONTENT_VERSION } from '../src/modules/best-brains/generator/packGenerator';
import { chunkForSpeech } from '../src/services/speechChunk';

const argv = process.argv.slice(2);
const arg = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const ONLY_LEVEL = arg('--level')?.toUpperCase();
const STRICT = argv.includes('--strict');
const SHOW_ALL = argv.includes('--all');

/**
 * Words per minute the browser voice actually delivers at rate 0.9. A typical
 * en-US voice runs near 150 wpm at rate 1.0; this is the conservative reading,
 * because under-estimating the rate would under-estimate the duration and let
 * a too-long chunk through.
 */
const WPM = 150 * 0.9;
/** Chrome's single-utterance ceiling, with the headroom a slow voice needs. */
const CHUNK_MAX_SECONDS = 12;
/** Past this, a spoken segment should have something to look at. */
const VISUAL_REQUIRED_SECONDS = 20;

const words = (s: string): string[] => (s.trim().match(/\S+/g) ?? []);
const seconds = (s: string): number => (words(s).length / WPM) * 60;
const fmt = (n: number) => `${n.toFixed(0)}s`;

interface Bare { id: string; kind: string; secs: number; sample: string }
const overLong: Array<{ id: string; kind: string; chunk: string; secs: number }> = [];
const corrupted: Array<{ id: string; kind: string; detail: string }> = [];
const bare: Bare[] = [];
let segments = 0;
let chunksTotal = 0;

// --- Part 1's liveness control: the checks must be seen to fire -------------
function selfTest(): boolean {
  let ok = true;
  console.log('CONTROL — can this gate still see a bad chunking?');
  const long = Array.from({ length: 60 }, (_, i) => `Sentence number ${i + 1} sits here.`).join(' ');
  const split = chunkForSpeech(long);
  const splits = split.length > 1 && split.every((c) => seconds(c) <= CHUNK_MAX_SECONDS);
  console.log(`  ${splits ? 'SEES' : 'BLIND'}  a 60-sentence block splits into ${split.length} chunks, longest ${fmt(Math.max(...split.map(seconds)))}`);
  if (!splits) ok = false;

  // The tokens that must NEVER be cut in half, because the split rule needs
  // whitespace and a sentence-opener after the punctuation.
  const traps: Array<[string, string]> = [
    ['$4.50', 'The price is $4.50 today. Then it changed again.'],
    ['3.5', 'It read 3.5 metres. Next came something longer.'],
    ['8:30', 'At 8:30 he left. Then he ran all the way home.'],
  ];
  for (const [token, text] of traps) {
    const kept = chunkForSpeech(text, 6).some((c) => c.includes(token));
    console.log(`  ${kept ? 'SEES' : 'BLIND'}  "${token}" survives an aggressive split`);
    if (!kept) ok = false;
  }
  console.log(ok ? '  control PASSED — the readings below are evidence.\n' : '  control FAILED — THIS FILE IS BROKEN.\n');
  return ok;
}

if (!selfTest()) process.exit(1);

// --- Walk every served lesson ----------------------------------------------
const weeks = (AVAILABLE_WEEKS as Array<{ level: string; week: number }>).filter(
  (w) => !ONLY_LEVEL || w.level === ONLY_LEVEL,
);

for (const { level, week } of weeks) {
  const id = `${level}${week}`;
  let pack: Record<string, any>;
  try {
    pack = generatePack(level as never, week, 7, CONTENT_VERSION) as unknown as Record<string, any>;
  } catch {
    continue;
  }
  const e = pack.explanation;
  if (!e) continue;

  // Exactly the four surfaces LessonRoom speaks, in its own order.
  const spoken: Array<{ kind: string; say: string; figure: unknown }> = [
    { kind: 'hook', say: e.hook, figure: undefined },
    { kind: 'whyBeforeHow', say: e.whyBeforeHow, figure: e.whyFigure },
    ...e.script.map((s: Record<string, unknown>, i: number) => ({ kind: `script[${i}]`, say: s.say as string, figure: s.figure })),
    { kind: 'summary', say: e.summary, figure: undefined },
  ];

  for (const seg of spoken) {
    if (!seg.say?.trim()) continue;
    segments += 1;
    const chunks = chunkForSpeech(seg.say);
    chunksTotal += chunks.length;

    // (a) nothing lost, invented or re-ordered
    const before = words(seg.say).join(' ');
    const after = chunks.flatMap((c) => words(c)).join(' ');
    if (before !== after) {
      corrupted.push({ id, kind: seg.kind, detail: `${before.length} chars in, ${after.length} out` });
    }
    // (b) every chunk inside the engine's limit
    for (const c of chunks) {
      const s = seconds(c);
      if (s > CHUNK_MAX_SECONDS) overLong.push({ id, kind: seg.kind, chunk: c.slice(0, 70), secs: s });
    }
    // (c) a long spoken segment with nothing to look at
    const s = seconds(seg.say);
    if (s > VISUAL_REQUIRED_SECONDS && !seg.figure) {
      bare.push({ id, kind: seg.kind, secs: s, sample: seg.say.slice(0, 70) });
    }
  }
}

// --- Report -----------------------------------------------------------------
console.log(`bb-lesson-audio — ${weeks.length} weeks · ${segments} spoken segments · ${chunksTotal} chunks`);

console.log(`\nCHUNK INTEGRITY — words preserved: ${corrupted.length === 0 ? 'ALL' : `${corrupted.length} SEGMENT(S) CORRUPTED`}`);
corrupted.slice(0, 10).forEach((c) => console.log(`  ✗ ${c.id} ${c.kind} — ${c.detail}`));

console.log(`\nCHUNK LENGTH — over ${CHUNK_MAX_SECONDS}s: ${overLong.length}`);
overLong.slice(0, 10).forEach((c) => console.log(`  ✗ ${c.id} ${c.kind} ${fmt(c.secs)} — "${c.chunk}…"`));

console.log(`\nVISUAL COVER — spoken segments over ${VISUAL_REQUIRED_SECONDS}s with NO figure: ${bare.length}`);
const byKind = new Map<string, number>();
for (const b of bare) byKind.set(b.kind.replace(/\[\d+\]/, '[*]'), (byKind.get(b.kind.replace(/\[\d+\]/, '[*]')) ?? 0) + 1);
for (const [k, n] of [...byKind.entries()].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(4)}  ${k}`);
const worst = [...bare].sort((a, b) => b.secs - a.secs);
(SHOW_ALL ? worst : worst.slice(0, 12)).forEach((b) => console.log(`  ·  ${b.id.padEnd(5)} ${b.kind.padEnd(13)} ${fmt(b.secs).padStart(5)}  "${b.sample}…"`));
if (!SHOW_ALL && worst.length > 12) console.log(`     … and ${worst.length - 12} more (--all)`);

const hardFailures = corrupted.length + overLong.length;
console.log(
  `\n${hardFailures === 0 ? 'PASS' : 'FAIL'} — chunking: ${hardFailures} defect(s); ` +
    `visual cover: ${bare.length} long segment(s) with nothing to look at` +
    (STRICT ? '' : '  (census — pass --strict to fail on those too)'),
);
if (hardFailures > 0) process.exit(1);
if (STRICT && bare.length > 0) process.exit(1);
