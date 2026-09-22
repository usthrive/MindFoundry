/**
 * Prompt ↔ picture separation (B1.0).
 *
 * Authored prompts carry an `[image: 3 acorns in a row]` direction. Until B1.0
 * nothing consumed it, so `PracticePage` printed the literal characters to a
 * pre-reader (LEARNINGS L27). Two rules now hold everywhere a prompt is shown:
 *
 *  - the bracket NEVER reaches the screen — `promptText()` strips it;
 *  - the bracket's words are not thrown away — they are the picture's
 *    accessible name and, for the audio-first band, the spoken scene.
 *
 * The bracket deliberately stays in the stored `prompt` string. It is authored
 * content, it is what QG-1/QG-4 sign for operand freshness (many Level-A items
 * carry their only number inside it), and keeping it means a figure can be
 * added to an existing item without disturbing one byte of pack identity (L29:
 * rendering and identity are separated deliberately).
 *
 * Structured figures live in the `figure` field rather than inside the prompt
 * string (FILL-ARCHITECTURE §2 G1 sketched a `[figure:{…}]` literal): a typed
 * field is checkable by QG-13, cannot be corrupted by prose formatting, and
 * leaves the prompt free to stay exactly what it already was.
 */

const IMAGE_RE = /\[image:\s*([^\]]*)\]/gi;

/** True when the prompt carries at least one `[image: …]` direction. */
export function hasImagePlaceholder(prompt: string): boolean {
  IMAGE_RE.lastIndex = 0;
  return IMAGE_RE.test(prompt);
}

/**
 * The prompt as a child should SEE it — every `[image: …]` removed, and every
 * AUTHORED LINE BREAK KEPT.
 *
 * WHY THE NEWLINE SURVIVES (owner ruling 2026-09-22, from B3-D5-03). This used
 * to collapse `\s{2,}` — which includes `\n` — so an author had no way to put
 * three claims on three lines. The only shape available was one paragraph, and
 * B3-D5-03 duly shipped as "Three sentences are on the board. 62 > 58. 71 < 68.
 * 45 = 45. Write TRUE beside each…", which is three claims and three
 * instructions read as one wall by a six-year-old. The ruling is to fix the
 * class: a prompt may carry lines, so runs of SPACES AND TABS still collapse
 * (that is prose hygiene) while a single `\n` is content and is preserved.
 * Two or more `\n` collapse to one, because a blank line in a prompt is a
 * formatting accident, never a pedagogical unit.
 *
 * Every element that prints this as text carries `whitespace-pre-line`, and
 * `bb-screen-contract-test`'s `prompt-lines-render` check asserts that pairing
 * in the source — a preserved newline that CSS then eats is worse than no
 * newline at all, because the author believes it worked.
 */
export function promptText(prompt: string): string {
  return prompt
    .replace(IMAGE_RE, ' ')
    // A line break keeps its break and loses its padding …
    .replace(/[^\S\n]*\n[^\S\n]*/g, '\n')
    // … but never becomes a blank line.
    .replace(/\n{2,}/g, '\n')
    .replace(/[^\S\n]{2,}/g, ' ')
    .replace(/[^\S\n]+([,.;:!?])/g, '$1')
    .trim();
}

/** The words inside the first `[image: …]`, or null. */
export function promptImageAlt(prompt: string): string | null {
  IMAGE_RE.lastIndex = 0;
  const m = IMAGE_RE.exec(prompt);
  const alt = m?.[1]?.trim();
  return alt ? alt : null;
}

/**
 * SYMBOL → SPEECH. The module had no such map anywhere before 2026-09-22
 * (searched: `figures/`, `components/AudioButton`, `services/ttsService`,
 * `lib/utils`), so this is the first one and every caller must reuse it rather
 * than grow a second.
 *
 * It exists because of the truth-set form (same ruling): a claim like "62 > 58"
 * is READ by the child and SPOKEN by Ms. Wren, and a browser voice given a bare
 * ">" either says nothing or says "greater-than sign". A pre-reader who cannot
 * yet decode the symbol is exactly the child who needs it read, so the words
 * are the accessible form of the claim, not a nicety.
 */
const SYMBOL_SPEECH: Array<[RegExp, string]> = [
  [/≠/g, ' is not equal to '],
  [/≤/g, ' is less than or equal to '],
  [/≥/g, ' is greater than or equal to '],
  [/>/g, ' is greater than '],
  [/</g, ' is less than '],
  [/=/g, ' equals '],
];

/** One claim as a voice should read it: symbols in words, single-spaced. */
export function speakableStatement(statement: string): string {
  let s = statement;
  for (const [re, words] of SYMBOL_SPEECH) s = s.replace(re, words);
  return s.replace(/\s{2,}/g, ' ').trim();
}

/** "Sentence one", "Sentence two", … — a spoken index a pre-reader can hold. */
const SENTENCE_ORDINALS = [
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
];

/**
 * A lined prompt, spoken. Each `\n` becomes a full stop and a space so the
 * voice PAUSES where the page breaks (2026-09-22 ruling): without it, three
 * bulleted claims are read as one breathless sentence, which is the audio
 * version of the wall of text the lines were added to remove. A line that
 * already ends in punctuation keeps it, and the LAST line is left exactly as it
 * was so every single-line prompt in the corpus speaks byte-identically to
 * before.
 */
function spokenLines(text: string): string {
  const lines = text
    .split('\n')
    // The bullet is authored text on the SCREEN (it renders as written); a
    // voice reading "bullet" aloud is noise, so it is dropped from speech only.
    .map((l) => l.replace(/^[•·]\s*/, '').trim())
    .filter(Boolean);
  return lines
    .map((l, i) => (i === lines.length - 1 || /[.!?:]$/.test(l) ? l : `${l}.`))
    .join(' ');
}

/**
 * What a text-to-speech voice should read: the scene first (so a pre-reader
 * knows what they are looking at), then the question, then — for a `truth-set`
 * item — the claims themselves, numbered and with their symbols in words.
 * `figureAlt` wins over the authored bracket when a real figure is attached.
 *
 * `statements` is passed by every screen that renders the truth form, because
 * those claims live in `item.statements` rather than in the prompt string and
 * would otherwise be the one part of the item the audio channel never carries.
 */
export function speakablePrompt(
  prompt: string,
  figureAlt?: string,
  statements?: readonly string[],
): string {
  const scene = (figureAlt ?? promptImageAlt(prompt) ?? '').trim();
  const claims = (statements ?? []).map((s, i) => {
    const said = speakableStatement(s);
    const stop = /[.!?]$/.test(said) ? '' : '.';
    return `Sentence ${SENTENCE_ORDINALS[i] ?? String(i + 1)}: ${said}${stop}`;
  });
  const text = [spokenLines(promptText(prompt)), ...claims].filter(Boolean).join(' ');
  if (!scene) return text;
  const stop = /[.!?]$/.test(scene) ? '' : '.';
  return `${scene}${stop} ${text}`.trim();
}
