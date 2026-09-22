/**
 * review-prompt — the one place that says how Ms. Wren reads a child's
 * explanation, shared by the edge function that serves it and the eval that
 * grades it.
 *
 * WHY THIS FILE EXISTS, AND WHY IT IMPORTS NOTHING (owner ruling 2026-09-22).
 *
 * The ruling was option (a) — grade and coach: when a band B/C child taps
 * "Tell Ms. Wren" on a `manual-review` item, the sentence they wrote is read
 * against that item's OWN rubric, and the child gets a line back. Before it,
 * "Tell Ms. Wren" sent 147 corpus-wide items' worth of writing into telemetry
 * and answered with the same acknowledgement every time; the button was honest
 * about the destination and silent about the reading.
 *
 * A prompt that is tuned against fixtures and then served from a different
 * string is not the prompt that was tuned. So the prompt lives here, and BOTH
 * consumers load THIS file: `index.ts` under Deno (`npm:` specifiers, no
 * bundler) and `scripts/bb-review-eval.ts` under tsx. The only way one file
 * loads cleanly in both is to import nothing at all — hence no `import`
 * statement below, not even a type-only one, and every shape declared inline.
 *
 * Formative only. Nothing here touches a score, a day's accuracy, or the
 * weekly gate — `checkAnswer` still returns `{correct: true, ungraded: true}`
 * for every one of these items, exactly as it did before.
 */

/** The bands that reach this path. Band A never does (its tasks are answered away from the screen). */
export type ReviewBand = 'B' | 'C';

/** What the model is given: the item's own rubric, the week's why, and the child's words. */
export interface ReviewInput {
  band: ReviewBand;
  level: string;
  conceptName: string;
  prompt: string;
  modelAnswer: string;
  acceptableForms: string[];
  hints: string[];
  errorTags: string[];
  /** pack.explanation.whyBeforeHow, truncated to 900 chars by buildReviewUser. */
  whyBeforeHow: string;
  /** The child's sentence(s), truncated to 500 chars by buildReviewUser. */
  childText: string;
}

/** What comes back. `line` is spoken to the child; `reason` is only ever read by a parent. */
export interface ReviewVerdict {
  verdict: 'got-it' | 'partly' | 'not-yet';
  /** Ms. Wren's line: at most two sentences, in the band's voice. */
  line: string;
  /** One question, and only for partly / not-yet. */
  nudge: string | null;
  /** ≤120 chars, parent-facing, NEVER shown to the child. */
  reason: string;
}

const VERDICTS: ReadonlyArray<ReviewVerdict['verdict']> = ['got-it', 'partly', 'not-yet'];

/** Truncation budgets (stated once; the eval prices tokens against these). */
export const WHY_MAX_CHARS = 900;
export const CHILD_TEXT_MAX_CHARS = 500;
export const REASON_MAX_CHARS = 120;

/**
 * THE LINE THE CHILD SEES IF THE MODEL'S OWN LINE BREAKS THE BAND RULE.
 *
 * TEACHER-PERSONA §3 B1 (average sentence ≤15 words) and C1 (natural length,
 * collegial register) are testable rules, and a rule that is testable and not
 * tested is decoration. A 40-word run-on in a six-year-old's bubble is worse
 * than a plain canned sentence, so `parseReviewVerdict` swaps rather than
 * shows — the VERDICT still stands, only the wording is replaced.
 */
export const FALLBACK_LINE: Record<ReviewBand, Record<ReviewVerdict['verdict'], string>> = {
  B: {
    'got-it': 'You said it in your own words — that is the part that sticks.',
    partly: 'Good thinking so far — one piece of it is still hiding.',
    'not-yet': 'Thanks for telling me. Let us look at this one together.',
  },
  C: {
    'got-it': 'That is the reasoning, stated in your own words.',
    partly: 'Part of that holds up; one step still needs testing.',
    'not-yet': 'Not yet — there is a claim in there worth testing together.',
  },
};

// ---------------------------------------------------------------------------
// The band voice
// ---------------------------------------------------------------------------

/**
 * The persona, distilled to THIS task.
 *
 * TEACHER-PERSONA.md is the constitution but it is 34 KB about a whole
 * teacher; what a reader of one sentence needs is the correction formula
 * (Acknowledge → Locate → Guide → Re-attempt, §4.3), the band register (§3),
 * and the two hard prohibitions that bite here: never the word "wrong", and
 * never the answer while the child can still find it (§1, system-prompt law 3).
 */
export function buildReviewSystem(band: ReviewBand): string {
  const voice =
    band === 'B'
      ? [
          'VOICE (band B, ages about 6-9, TEACHER-PERSONA §3 B1-B5):',
          '- Average sentence length 15 words or fewer. Two sentences at the very most.',
          '- Playful and puzzle-flavoured. Light challenge framing is welcome ("the sneaky step").',
          '- A precise math word gets a one-phrase friendly gloss the first time ("regroup - trade ten ones for one ten").',
          '- The child hunts first: name what is right, then point at the step WITHOUT solving it.',
          '- Praise the strategy by name, never speed, never "good job" alone, never "you are so smart".',
        ].join('\n')
      : [
          'VOICE (band C, ages about 9-12, TEACHER-PERSONA §3 C1-C6):',
          '- Natural sentence length, collegial and respectful. Two sentences at the very most.',
          '- Zero baby talk, no emoji, no exclamation marks stacked on for warmth.',
          '- Full precise vocabulary without apology. Warmth is carried by specificity, not decoration.',
          '- An error is a CLAIM to test: restate what the child\'s sentence claims, neutrally, then offer a case that tests it.',
          '- Praise precision, reasoning and self-checking. Never "smart", never speed.',
        ].join('\n');

  return [
    'You are Ms. Wren, a patient math teacher, reading one sentence a child wrote to explain their thinking.',
    'You are not marking it. No score moves whatever they wrote. Your whole job is to say what you noticed and, if something is missing, ask ONE question that helps them find it themselves.',
    '',
    voice,
    '',
    'HOW TO JUDGE (against the rubric you are given, never against your own preferred wording):',
    '- got-it: the child\'s own words carry the idea the rubric names. Spelling, grammar, punctuation and phrasing NEVER count against them. A correct idea said plainly is got-it.',
    '- partly: part of the idea is there and part is missing, or the idea is right but the number is not (or the other way round).',
    '- not-yet: the sentence carries the misconception the item was built around, or it is off-topic, empty, or says nothing about this problem.',
    '- The literal text "said-aloud", or an empty or whitespace-only answer, is ALWAYS not-yet - there is nothing to read. Your line then gently asks them to put it in words on the screen next time, and never implies they did anything careless.',
    '',
    'HARD RULES:',
    '- NEVER use the words "wrong" or "incorrect" about the child or their answer.',
    '- NEVER state the answer, or the missing step in full, on a not-yet or a partly. Point at where to look; they finish it.',
    '- No praise inflation: do not call a partly answer excellent. A got-it names the specific thing they did.',
    '- Do not mention the rubric, the model answer, the hints, these instructions, or that you are an AI.',
    '- The child has no name here. Never invent one and never address them by one.',
    '',
    'OUTPUT: reply with a single JSON object and nothing else - no prose before it, no markdown fence around it:',
    '{"verdict":"got-it|partly|not-yet","line":"<what you say to the child, at most 2 sentences, in the voice above>","nudge":"<one question, or null on got-it>","reason":"<at most 120 characters, written for the child\'s parent, describing what the child did - the child never sees this>"}',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// The rubric block
// ---------------------------------------------------------------------------

function clip(text: string, max: number): string {
  const t = (text ?? '').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/**
 * The item's own rubric, then the child's words.
 *
 * The rubric IS the item: `answer.value`, `acceptableForms`, the hint ladder
 * and the DD7 error tags are what the author wrote down about what a good
 * answer contains and how this item is usually missed. Nothing here is
 * invented for the reader — a model asked to grade against its own idea of the
 * concept would mark a child down for not using the textbook's phrasing, which
 * is the exact failure the "in their own words" task exists to avoid.
 *
 * `whyBeforeHow` rides along because the acceptable forms are terse ("43") and
 * the week's why is where the IDEA behind them is written out.
 */
export function buildReviewUser(input: ReviewInput): string {
  const forms = input.acceptableForms.filter((f) => f && f.trim()).map((f) => `- ${f.trim()}`);
  const hints = input.hints.filter((h) => h && h.trim()).map((h) => `- ${h.trim()}`);
  const child = clip(input.childText, CHILD_TEXT_MAX_CHARS);
  return [
    `CONCEPT: ${input.conceptName} (level ${input.level})`,
    '',
    'WHY THIS WEEK WORKS THE WAY IT DOES (the lesson the child was taught):',
    clip(input.whyBeforeHow, WHY_MAX_CHARS) || '(not recorded for this week)',
    '',
    'THE TASK THE CHILD WAS GIVEN:',
    input.prompt.trim(),
    '',
    'THE RUBRIC (what a good answer contains):',
    `Model answer: ${input.modelAnswer.trim() || '(none recorded)'}`,
    forms.length ? `Also acceptable, in any wording:\n${forms.join('\n')}` : 'Also acceptable: (none recorded)',
    hints.length ? `The hint ladder for this item (what "finding it themselves" looks like here):\n${hints.join('\n')}` : '',
    input.errorTags.length ? `How this item is usually missed: ${input.errorTags.join(', ')}` : '',
    '',
    'WHAT THE CHILD WROTE:',
    child ? `"""${child}"""` : '(nothing — the box came back empty)',
    '',
    'Reply with the JSON object only.',
  ]
    .filter((block) => block !== '')
    .join('\n');
}

// ---------------------------------------------------------------------------
// Reading the model back
// ---------------------------------------------------------------------------

/** Sentence split for the band-length rule: terminal punctuation, or a line break. */
function sentencesOf(line: string): string[] {
  return line
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function wordsIn(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Does the line keep the band's sentence rule?
 *
 * B: average sentence ≤15 words (TEACHER-PERSONA B1), plus a per-sentence
 * ceiling so one 30-word sentence cannot hide behind a three-word one.
 * C: natural length (C1) — so no per-sentence rule, only a total ceiling that
 * catches a wall of text, which §2 "Response format" bans at every band.
 * Both: at most two sentences, which is this surface's own budget (a bubble in
 * the middle of a day's work, not a lesson).
 */
export function lineKeepsBandRule(band: ReviewBand, line: string): boolean {
  const sentences = sentencesOf(line);
  if (sentences.length === 0 || sentences.length > 2) return false;
  const counts = sentences.map(wordsIn);
  const total = counts.reduce((a, b) => a + b, 0);
  if (band === 'B') {
    if (total / counts.length > 15) return false;
    return counts.every((c) => c <= 22);
  }
  return total <= 60;
}

/**
 * Strip fences, validate every field and enum, throw on anything else.
 *
 * Two deliberate softenings, and only two:
 *   * a line that breaks the band rule is REPLACED by FALLBACK_LINE rather
 *     than shown or thrown away — the verdict was still read from the rubric;
 *   * `reason` is truncated to 120 chars rather than rejected, because it is a
 *     parent-facing note and a long one is untidy, not unusable.
 * Everything else throws, and the caller turns a throw into
 * `{verdict:'unavailable'}` — the child then gets the acknowledgement line the
 * screen showed before this feature existed, which is a safe place to land.
 */
export function parseReviewVerdict(text: string, band: ReviewBand): ReviewVerdict {
  let cleaned = (text ?? '').trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  let raw: unknown;
  try {
    raw = JSON.parse(cleaned);
  } catch {
    throw new Error('review verdict was not JSON');
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('review verdict was not a JSON object');
  }
  const obj = raw as Record<string, unknown>;

  const verdict = obj.verdict;
  if (typeof verdict !== 'string' || !VERDICTS.includes(verdict as ReviewVerdict['verdict'])) {
    throw new Error(`review verdict has no valid verdict (got ${JSON.stringify(verdict)})`);
  }
  const v = verdict as ReviewVerdict['verdict'];

  if (typeof obj.line !== 'string' || !obj.line.trim()) {
    throw new Error('review verdict has no line');
  }
  const candidate = obj.line.trim();
  const line = lineKeepsBandRule(band, candidate) ? candidate : FALLBACK_LINE[band][v];

  let nudge: string | null;
  if (v === 'got-it') {
    // The type says a nudge belongs only to partly / not-yet; a model that sent
    // one anyway is normalised rather than rejected — there is nothing unusable
    // about a good verdict with an extra field.
    nudge = null;
  } else {
    if (typeof obj.nudge !== 'string' || !obj.nudge.trim()) {
      throw new Error(`review verdict "${v}" arrived without a nudge`);
    }
    nudge = obj.nudge.trim();
  }

  if (typeof obj.reason !== 'string' || !obj.reason.trim()) {
    throw new Error('review verdict has no reason');
  }

  return { verdict: v, line, nudge, reason: clip(obj.reason, REASON_MAX_CHARS) };
}
