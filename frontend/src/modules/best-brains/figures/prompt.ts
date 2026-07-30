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

/** The prompt as a child should SEE it — every `[image: …]` removed. */
export function promptText(prompt: string): string {
  return prompt
    .replace(IMAGE_RE, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
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
 * What a text-to-speech voice should read: the scene first (so a pre-reader
 * knows what they are looking at), then the question. `figureAlt` wins over the
 * authored bracket when a real figure is attached.
 */
export function speakablePrompt(prompt: string, figureAlt?: string): string {
  const scene = (figureAlt ?? promptImageAlt(prompt) ?? '').trim();
  const text = promptText(prompt);
  if (!scene) return text;
  const stop = /[.!?]$/.test(scene) ? '' : '.';
  return `${scene}${stop} ${text}`.trim();
}
