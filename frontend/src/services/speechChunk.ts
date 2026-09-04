/**
 * Sentence chunking for browser speech — a PURE module, deliberately.
 *
 * It lives apart from `ttsService` because that file imports the Supabase
 * client, which needs `import.meta.env` and therefore cannot be loaded by a
 * `tsx` script. A rule that cannot be exercised by a gate is a rule nobody
 * checks, and this one is load-bearing: it is what stops Ms. Wren being cut off
 * mid-sentence. `scripts/bb-lesson-audio-test.ts` imports it directly.
 */

/**
 * SPEECH CHUNKING — the repair for two independent truncation bugs, both of
 * which cut Ms. Wren off mid-sentence on the lesson screen (reported from a
 * child's Level-C Day 1, 2026-08-31).
 *
 *  1. CHROME STOPS A SINGLE LONG UTTERANCE at roughly fifteen seconds. It is a
 *     long-standing engine limit, not a content problem, and it has no error
 *     event — the voice simply stops. Measured against the corpus: 487 of 823
 *     lesson segments (59.2%) are longer than that, and every one of the 117
 *     `whyBeforeHow` blocks is.
 *  2. THIS FILE'S OWN WATCHDOG cancelled speech that was working. See
 *     `armWatchdog` below.
 *
 * The cure for (1) is the standard one: speak SENTENCES, queued, rather than
 * one paragraph. `speechSynthesis` keeps its own queue, so every chunk is
 * enqueued synchronously inside the caller's gesture — which is also what keeps
 * the iOS gesture chain intact (the constraint the file's header records).
 *
 * WHAT IS NOT SPLIT: a decimal, a time or a price. The boundary needs
 * whitespace AND a capital or digit after it, so "3.5", "$4.50" and "8:30"
 * cannot be cut in half — the same tokenisation rule `bb-readability-test`
 * applies to the written form of these surfaces.
 *
 * Short text keeps the old single-utterance path exactly, so the ~40% of
 * segments that never had a problem are byte-identical in behaviour.
 */
/**
 * THE BUDGET IS IN WORDS, NOT CHARACTERS, AND THAT IS A CORRECTION.
 *
 * The first version budgeted 170 characters, which reads as about ten seconds
 * — until a sentence of short words fills those characters with far more of
 * them. Measured across the corpus, 139 chunks still ran past the engine limit
 * and the worst reached 19.6 seconds. The constraint is TIME, and speech time
 * tracks word count, so the budget does too. At a 0.9 rate against a ~150 wpm
 * voice, 22 words is roughly ten seconds — comfortably inside the ~15-second
 * limit even for a slow voice, and still two average sentences of this corpus.
 *
 * The character cap survives as a secondary guard for pathological input (a
 * single enormous "word", a pasted URL) that no word count would catch.
 */
const SPEECH_CHUNK_MAX_WORDS = 22;
const SPEECH_CHUNK_MAX_CHARS = 240;

const wordCount = (s: string): number => (s.trim().match(/\S+/g) ?? []).length;

/** Would adding `next` to `buf` bust either budget? */
const busts = (buf: string, next: string): boolean =>
  wordCount(buf) + wordCount(next) > SPEECH_CHUNK_MAX_WORDS ||
  buf.length + 1 + next.length > SPEECH_CHUNK_MAX_CHARS;

export function chunkForSpeech(
  text: string,
  maxWords = SPEECH_CHUNK_MAX_WORDS,
  maxChars = SPEECH_CHUNK_MAX_CHARS,
): string[] {
  const clean = text.trim();
  if (wordCount(clean) <= maxWords && clean.length <= maxChars) return [clean];

  // Sentence boundaries only: punctuation, then whitespace, then something that
  // starts a sentence. "3.5" and "$4.50" have no whitespace and never match.
  const sentences = clean.split(/(?<=[.!?])\s+(?=["'(\[]?[A-Z0-9])/);

  const out: string[] = [];
  let buf = '';
  const flush = () => { if (buf.trim()) out.push(buf.trim()); buf = ''; };

  for (const sentence of sentences) {
    // A single sentence longer than the budget still has to be broken, or the
    // engine limit bites inside it. Fall back to word boundaries — never
    // mid-word, which would make the voice say a fragment.
    if (wordCount(sentence) > maxWords || sentence.length > maxChars) {
      flush();
      let line = '';
      for (const word of sentence.split(/\s+/)) {
        if (line && (wordCount(line) + 1 > maxWords || (line + ' ' + word).length > maxChars)) {
          out.push(line);
          line = word;
        } else line = line ? line + ' ' + word : word;
      }
      if (line) out.push(line);
      continue;
    }
    if (buf && busts(buf, sentence)) flush();
    buf = buf ? buf + ' ' + sentence : sentence;
  }
  flush();
  return out.length ? out : [clean];
}

