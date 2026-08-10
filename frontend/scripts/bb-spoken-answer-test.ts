/**
 * Does the app READ THE ANSWER OUT before it asks the question?
 *
 * WHY THIS GATE EXISTS. Every screen that shows an item builds its audio from
 * `speakablePrompt(item.prompt, item.figure?.alt)` (`figures/prompt.ts`), which
 * prepends the SCENE to the question and prefers `figure.alt` over the authored
 * `[image: …]` bracket. `PracticePage`, `CheckRunner`, `WarmUp`, `PuzzleGrove`
 * and `TreasureChest` all autoplay that string at band A, where the child is
 * four or five and CANNOT READ — the spoken line is not a convenience, it is the
 * whole item. Measured before the B1.1 fix, most of the Level-A counting family
 * shipped an alt that stated the very count the item asked for:
 *
 *     A1-D1-02  answer 5   "5 ducks in a row. Count the ducks. How many?"
 *     A2-D1-03  answer 7   "a frame with 7 counters. How many counters …?"
 *     A1-D3-04  answer 4   "4 flowers scattered. Oh no! Nim counted and says 5 …"
 *
 * That is LEARNINGS L33 arriving through the audio channel — the most dangerous
 * figure is not a wrong one, it is a HELPFUL one, and the question to ask of it
 * is what it lets the child SKIP. A library fix alone silently degrades (L28):
 * the next generator that interpolates `countNoun(n, noun)` into an alt puts it
 * straight back, and nothing on the page looks wrong. So the rule is a script.
 *
 * WHAT IT CHECKS. For every generated week, at every band, over N seeds, it
 * rebuilds the spoken string exactly as the screens do and fails when the SCENE
 * portion discloses the item's own answer — the keyed correct choice's text, or
 * `answer.value` — as a whole token.
 *
 * ── THE GUARDS, AND WHY EACH ONE IS HERE (a gate that cries wolf gets switched
 * off — L35/L42) ────────────────────────────────────────────────────────────
 *
 *  G1  A VALUE THE QUESTION ITSELF STATES IS A GIVEN, NOT A LEAK. Only the
 *      scene is judged, and only for values absent from the question the child
 *      is asked. A build task ("Draw 3 counters in the frame"), a story that
 *      names its own count ("Ava lays out 3 leaves… How many leaves?"), a
 *      partner sentence ("3 and ▢ make 5") and "Show all the ways to make 5"
 *      all put the number in the child's ears legitimately. Without G1 the gate
 *      would fire on a quarter of Level A and be worthless.
 *
 *  G2  WHOLE TOKENS, NEVER SUBSTRINGS — the QG-11 lesson. A keyed "8:30" is not
 *      satisfied by a scene containing "8", and "10" does not match inside
 *      "100". Times, decimals and money stay single tokens; so does a
 *      hyphenated compound, which is why naming the manipulative ("a ten-frame")
 *      is not read as saying "ten".
 *
 *  G3  DIGITS AND NUMBER WORDS ARE THE SAME VALUE. "five ducks" discloses an
 *      answer of 5 exactly as "5 ducks" does, so both surfaces normalise to the
 *      digit before comparison.
 *
 *  G4  A SCENE THAT NAMES EVERY OPTION HAS SINGLED OUT NONE. On a choice item
 *      the leak is DISCRIMINATION, not mention: `patternNext`'s alt is the
 *      pattern run itself and names both nouns on offer, and a fixed
 *      `compareSets` alt says "a row of apples above a row of pears" while the
 *      answer is one of them. Neither tells the child which. So a choice item
 *      fires only when the scene contains the correct option and NOT some other
 *      offered option.
 *
 *  G5  FREE-RESPONSE ITEMS ARE JUDGED ON NUMBERS ONLY. With no option set there
 *      is no discrimination test available, and the alt of a sorting or oral
 *      item necessarily names the things being sorted ("groups to count: ducks,
 *      blocks and apples" for an answer of "apples, ducks, blocks"). Firing on
 *      that would be firing on the vocabulary of the domain. A NUMBER in such a
 *      scene is unambiguous and is still checked.
 *
 * ── RULE 2: THE OPTIONS, MEASURED FOR THE CHILD ────────────────────────────
 *
 * The commonest Level-A leak was not the answer token at all. `setForNumeral`
 * asked "Tap the group that shows 3" over an alt reading "5 apples, 3 flowers,
 * 7 balls"; `pickExtreme` ("tap the group with the fewest") and `compareMeasure`
 * ("which one is heavier?") did the same thing. The answer word is nowhere in
 * the scene — the scene attaches a COUNT to each option, and the counting the
 * item exists to make the child do has already been done aloud. So R2 fails an
 * item when two or more of its offered options are named in the scene with a
 * scene-only number attached (within three tokens either side). Numbers the
 * question already states do not count, by G1.
 *
 * ── WHAT THIS DELIBERATELY DOES NOT COVER ──────────────────────────────────
 *
 *  - Guided examples and the lesson script. A worked example states its answer
 *    on purpose (`expected` values, "Three apples!"), so measuring it would be
 *    measuring the teaching. Day items, both mastery forms and the puzzle — the
 *    surfaces that ASSESS — are covered.
 *  - Two-halves disclosure with no token match: an alt reading "a frame of 10
 *    with 6 counters" over "How many boxes are empty?" hands over a subtraction
 *    without ever saying "4". Judged per generator by a human; the fix removed
 *    every instance in `earlynumber.ts`, and no script re-derives arithmetic
 *    from prose here.
 *  - Semantic disclosure: "a triangle" over "How many corners does it have?" is
 *    the answer to a child who knows the word, and no token gate can see it.
 *    Same for "joined" over "Does this picture add or take away?" — judged, and
 *    argued, at the generator.
 *  - Whether the alt is TRUE of the picture. That is QG-13's job (`asserts`).
 *
 * ── BANDS: WHERE THE HARD BAR SITS, AND WHY IT SITS THERE ──────────────────
 *
 * Every band is measured. **Band A FAILS the run; B-E are reported.** That is a
 * measured decision, not a shrug, and the numbers behind it are printed on every
 * run so it can be revisited on evidence rather than on a guess.
 *
 *  - At band A the child cannot read, and every screen autoplays the prompt. The
 *    spoken scene is not a supplement to the item, it IS the item, so a
 *    disclosure there is total. Band-A alts also describe simple counted sets in
 *    a few words, which makes any number in one unambiguous: measured, the rule
 *    fires on every leaking counting generator in the pre-fix corpus and on
 *    nothing at all in 1,600 post-fix band-A items.
 *  - Above band A the child reads the prompt and looks at the picture, and the
 *    alts legitimately describe rich drawings full of landmarks — clock-hand
 *    positions, number-line endpoints, the number of bars in a balance. Any of
 *    those can collide with a numeric answer by chance, and measured they mostly
 *    do: "a balance drawn as two bars" beside an answer of 2, "the long hand
 *    points straight up at the 12" beside 12 o'clock, "a number line from 130 to
 *    140" beside a rounded 140. Failing those would train an author to describe
 *    the picture LESS — the exact harm the readability gate's alt exemption
 *    exists to prevent — so they are reported and read by a human.
 *  - Reported does not mean ignored. `PracticePage` autoplays a word-problem on
 *    a word-problem day at ANY band, and those advisory lines are flagged
 *    SPOKEN-UNASKED so the escalation list is on the page. One real cluster of
 *    the Level-A kind lives there today: B23's graph alts read every bar's value
 *    out before asking for one of them. That is a genuine disclosure and a
 *    different design problem — a data display's alt is the only thing a
 *    screen-reader child has, so it cannot simply drop the values the way a
 *    counting alt can.
 *
 * Run: npx tsx scripts/bb-spoken-answer-test.ts [--level A] [--seeds 25] [--list]
 *      npx tsx scripts/bb-spoken-answer-test.ts --selftest   (the rules' own fixtures)
 */

import { GENERATED_WEEKS, generatePack, CONTENT_VERSION } from '../src/modules/best-brains/generator/packGenerator';
import { promptImageAlt, promptText, speakablePrompt } from '../src/modules/best-brains/figures/prompt';

const argv = process.argv.slice(2);
const arg = (k: string) => {
  const i = argv.indexOf(k);
  return i >= 0 ? argv[i + 1] : undefined;
};
const ONLY_LEVEL = arg('--level')?.toUpperCase();
const SEEDS = Number(arg('--seeds') ?? 25);
const LIST = argv.includes('--list');

// ---------------------------------------------------------------------------
// Tokens (G2) and values (G3)
// ---------------------------------------------------------------------------

/**
 * Whole tokens, with the edges trimmed of punctuation and nothing else.
 *
 * Splitting on whitespace first is what keeps "8:30", "3.5", "$4.50" and
 * "ten-frame" intact; a global punctuation strip would shatter all four and
 * reintroduce exactly the substring match QG-11 was written about.
 */
function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/^[^a-z0-9$]+/, '').replace(/[^a-z0-9%]+$/, ''))
    .filter((t) => t.length > 0);
}

const WORD_NUM: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7',
  eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13',
  fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18',
  nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60',
  seventy: '70', eighty: '80', ninety: '90',
};

/** G3: "five" and "5" are one value. Everything else is itself. */
function norm(token: string): string {
  return WORD_NUM[token] ?? token;
}

function normSet(text: string): Set<string> {
  return new Set(tokens(text).map(norm));
}

const isNumeric = (t: string) => /^\$?\d+(?:[.:/]\d+)?%?$/.test(t);

/** Stop words carry no answer: "the pears" is disclosed by "pears" alone. */
const STOP = new Set([
  'the', 'a', 'an', 'of', 'and', 'or', 'in', 'on', 'at', 'to', 'is', 'are', 'it',
  'they', 'them', 'same', 'both', 'each', 'that', 'this', 'with',
]);

/** The content tokens of an option/answer surface, normalised. */
function keyTokens(surface: string): string[] {
  return tokens(surface).map(norm).filter((t) => !STOP.has(t));
}

// ---------------------------------------------------------------------------
// What the child hears, and what the item's answer is
// ---------------------------------------------------------------------------

interface Choice { key: string; text: string; isCorrect: boolean }
interface Item {
  id?: string;
  prompt: string;
  choices?: Choice[];
  answer?: { value?: string };
  figure?: { alt?: string };
}

/**
 * The SCENE `speakablePrompt` prepends — the same expression it uses, so this
 * cannot drift from what the child hears.
 */
function sceneOf(item: Item): string {
  return (item.figure?.alt ?? promptImageAlt(item.prompt) ?? '').trim();
}

/** The keyed correct option's text, or the plain answer value. */
function answerSurface(item: Item): string {
  const keyed = (item.choices ?? []).find((c) => c.isCorrect);
  return (keyed?.text ?? item.answer?.value ?? '').trim();
}

/** A composite answer ("ducks: 3; leaves: 1") is a list of surfaces. */
function answerParts(surface: string): string[] {
  return surface.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
}

interface Leak {
  rule: 'R1' | 'R2';
  week: string;
  band: string;
  seed: number;
  id: string;
  answer: string;
  disclosed: string;
  spoken: string;
  autoplayed: boolean;
}

function inspect(week: string, band: string, seed: number, raw: Item, autoplayed: boolean, into: Leak[]): void {
  if (typeof raw?.prompt !== 'string') return;
  const scene = sceneOf(raw);
  if (!scene) return;
  const question = promptText(raw.prompt);
  const sceneTokens = normSet(scene);
  const givens = normSet(question); // G1
  const surface = answerSurface(raw);
  if (!surface) return;
  const choices = raw.choices ?? [];
  const spoken = speakablePrompt(raw.prompt, raw.figure?.alt);
  const push = (rule: Leak['rule'], disclosed: string) =>
    into.push({ rule, week, band, seed, id: raw.id ?? '?', answer: surface, disclosed, spoken, autoplayed });

  // --- R1: the scene says the answer -------------------------------------
  const answerKeys = answerParts(surface).flatMap(keyTokens);
  const numeric = answerKeys.filter(isNumeric);
  const wordy = answerKeys.filter((t) => !isNumeric(t));

  const disclosedNumeric = numeric.filter((t) => sceneTokens.has(t) && !givens.has(t));

  if (choices.length >= 2) {
    // G4 — a scene naming another option too has singled out nobody.
    const others = choices
      .filter((c) => !c.isCorrect)
      .map((c) => keyTokens(c.text))
      .filter((ks) => ks.length > 0);
    const otherAlsoInScene = others.some((ks) => ks.every((t) => sceneTokens.has(t)));
    if (!otherAlsoInScene) {
      if (disclosedNumeric.length > 0) push('R1', disclosedNumeric.join(' '));
      else if (wordy.length > 0 && wordy.every((t) => sceneTokens.has(t)) && !wordy.every((t) => givens.has(t))) {
        push('R1', wordy.join(' '));
      }
    }
  } else if (disclosedNumeric.length > 0) {
    // G5 — no option set, so numbers only.
    push('R1', disclosedNumeric.join(' '));
  }

  // --- R2: the scene has counted the options for the child ----------------
  if (choices.length >= 2) {
    const sceneSeq = tokens(scene).map(norm);
    const quantified = choices.filter((c) => {
      const ks = keyTokens(c.text).filter((t) => !isNumeric(t));
      if (ks.length === 0) return false;
      const at = sceneSeq.indexOf(ks[0]);
      if (at < 0) return false;
      for (let i = Math.max(0, at - 3); i <= Math.min(sceneSeq.length - 1, at + ks.length + 2); i++) {
        const t = sceneSeq[i];
        if (isNumeric(t) && !givens.has(t)) return true; // G1 again: scene-only
      }
      return false;
    });
    if (quantified.length >= 2) {
      push('R2', quantified.map((c) => c.text).join(' / '));
    }
  }
}

// ---------------------------------------------------------------------------
// Self-test — proof that the rules FIRE and that the guards SUPPRESS
// ---------------------------------------------------------------------------

/**
 * A GATE NOBODY HAS SEEN FAIL IS NOT KNOWN TO WORK. Three gates in this project
 * reported clean passes over empty sets, so this one carries its own fixtures:
 * every rule with an item it must catch, and every guard with an item it must
 * let through. `--selftest` runs them and exits non-zero on any disagreement,
 * which means a future refactor that quietly disarms a rule cannot pass.
 *
 * The leaking fixtures are the corpus's own pre-fix strings, verbatim.
 */
interface Fixture { name: string; fires: boolean; item: Item }

const FIXTURES: Fixture[] = [
  {
    name: 'R1 numeric — the pre-fix countArrangement alt',
    fires: true,
    item: {
      id: 'FX-01', prompt: '[image: x] Count the ducks. How many?',
      figure: { alt: '5 ducks in a row' }, answer: { value: '5' },
    },
  },
  {
    name: 'R1 numeric — the same item, fixed',
    fires: false,
    item: {
      id: 'FX-02', prompt: '[image: x] Count the ducks. How many?',
      figure: { alt: 'some ducks in a row' }, answer: { value: '5' },
    },
  },
  {
    name: 'G1 given — the story states its own count',
    fires: false,
    item: {
      id: 'FX-03', prompt: '[image: x] Ava lays out 3 leaves on the rug. How many leaves?',
      figure: { alt: '3 leaves in a row on a picnic rug' }, answer: { value: '3' },
    },
  },
  {
    name: 'G2 whole token — a keyed "8:30" is not satisfied by "8"',
    fires: false,
    item: {
      id: 'FX-04', prompt: '[image: x] What time does the clock show?',
      figure: { alt: 'a clock face where the long hand points at the 8' }, answer: { value: '8:30' },
    },
  },
  {
    name: 'G2 whole token — "a ten-frame" is not the number ten',
    fires: false,
    item: {
      id: 'FX-05', prompt: '[image: x] How many counters are in the frame?',
      figure: { alt: 'a ten-frame with some counters in it' }, answer: { value: '10' },
    },
  },
  {
    name: 'G3 number words — "five ducks" discloses an answer of 5',
    fires: true,
    item: {
      id: 'FX-06', prompt: '[image: x] Count the ducks. How many?',
      figure: { alt: 'five ducks in a row' }, answer: { value: '5' },
    },
  },
  {
    name: 'R1 choice text — the pre-fix shapeName alt IS the keyed option',
    fires: true,
    item: {
      id: 'FX-07', prompt: '[image: x] Tap the name of this shape.',
      figure: { alt: 'a triangle' }, answer: { value: 'A' },
      choices: [
        { key: 'A', text: 'triangle', isCorrect: true },
        { key: 'B', text: 'square', isCorrect: false },
        { key: 'C', text: 'hexagon', isCorrect: false },
      ],
    },
  },
  {
    name: 'G4 discrimination — a scene naming every option singles out none',
    fires: false,
    item: {
      id: 'FX-08', prompt: '[image: x] Which row has more?',
      figure: { alt: 'a row of apples above a row of pears' }, answer: { value: 'A' },
      choices: [
        { key: 'A', text: 'the pears', isCorrect: true },
        { key: 'B', text: 'the apples', isCorrect: false },
        { key: 'C', text: 'they are the same', isCorrect: false },
      ],
    },
  },
  {
    name: 'R2 pairing — the pre-fix setForNumeral alt counts every option',
    fires: true,
    item: {
      id: 'FX-09', prompt: '[image: x] Tap the group that shows 3.',
      figure: { alt: '5 apples, 3 flowers, 7 balls' }, answer: { value: 'B' },
      choices: [
        { key: 'A', text: 'the apples', isCorrect: false },
        { key: 'B', text: 'the flowers', isCorrect: true },
        { key: 'C', text: 'the balls', isCorrect: false },
      ],
    },
  },
  {
    name: 'R2 — the same item, fixed',
    fires: false,
    item: {
      id: 'FX-10', prompt: '[image: x] Tap the group that shows 3.',
      figure: { alt: 'groups to count: apples, flowers and balls' }, answer: { value: 'B' },
      choices: [
        { key: 'A', text: 'the apples', isCorrect: false },
        { key: 'B', text: 'the flowers', isCorrect: true },
        { key: 'C', text: 'the balls', isCorrect: false },
      ],
    },
  },
  {
    name: 'G5 free response — naming the groups is not naming their order',
    fires: false,
    item: {
      id: 'FX-11', prompt: '[image: x] Sort them, fewest first. Tell how you know.',
      figure: { alt: 'groups to count: ducks, blocks and apples' },
      answer: { value: 'apples, ducks, blocks' },
    },
  },
  {
    name: 'G5 free response — but a NUMBER in that scene still fires',
    fires: true,
    item: {
      id: 'FX-12', prompt: '[image: x] Now say how many of each kind.',
      figure: { alt: 'a picnic rug holding 3 ducks, 1 leaf and 5 stars' },
      answer: { value: 'ducks: 3; leaves: 1; stars: 5' },
    },
  },
  {
    name: 'no figure, no scene — nothing to disclose',
    fires: false,
    item: { id: 'FX-13', prompt: 'Which one rolls?', answer: { value: 'A' },
      choices: [{ key: 'A', text: 'the ball', isCorrect: true }, { key: 'B', text: 'the box', isCorrect: false }] },
  },
];

if (argv.includes('--selftest')) {
  let bad = 0;
  console.log('\nbb-spoken-answer --selftest\n');
  for (const f of FIXTURES) {
    const found: Leak[] = [];
    inspect('FX', 'A', 0, f.item, true, found);
    const ok = (found.length > 0) === f.fires;
    if (!ok) bad++;
    console.log(
      `  ${ok ? 'ok  ' : 'BAD '} ${f.fires ? 'must fire ' : 'must pass '} ${f.name}` +
        (found.length ? `\n         → ${found[0].rule} discloses ${JSON.stringify(found[0].disclosed)} in "${found[0].spoken}"` : ''),
    );
  }
  console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — ${FIXTURES.length - bad}/${FIXTURES.length} fixtures behaved as documented\n`);
  process.exit(bad === 0 ? 0 : 1);
}

// ---------------------------------------------------------------------------
// Sweep
// ---------------------------------------------------------------------------

const weeks = GENERATED_WEEKS.filter((w) => !ONLY_LEVEL || w.level === ONLY_LEVEL);
const rows: Array<{ week: string; band: string; items: number; leaks: Leak[] }> = [];

for (const { level, week } of weeks) {
  const id = `${level}${week}`;
  const leaks: Leak[] = [];
  let items = 0;
  for (let i = 0; i < SEEDS; i++) {
    let p: Record<string, any>;
    try {
      p = generatePack(level, week, i * 7 + 1, CONTENT_VERSION) as unknown as Record<string, any>;
    } catch {
      break;
    }
    /**
     * IS THIS STRING ACTUALLY SPOKEN WITHOUT BEING ASKED FOR? Band A autoplays
     * every prompt on every screen; above it, `PracticePage` still autoplays a
     * word-problem on a word-problem day (`packDay.focus === 'word-problems' &&
     * item.type === 'word-problem'`). Mastery forms and the puzzle are read by
     * `CheckRunner` / `PuzzleGrove`, which autoplay at band A only.
     */
    const visit = (it: Item, autoplayed: boolean) => {
      items++;
      inspect(id, level, i * 7 + 1, it, autoplayed, leaks);
    };
    for (const d of p.days ?? []) {
      for (const it of d.items ?? []) {
        const wp = d.focus === 'word-problems' && (it as { type?: string }).type === 'word-problem';
        visit(it as Item, level === 'A' || wp);
      }
    }
    for (const key of ['formA', 'formB']) {
      for (const it of (p.masteryCheck ?? {})[key] ?? []) visit(it as Item, level === 'A');
    }
    if (p.puzzle) visit(p.puzzle as Item, level === 'A');
  }
  if (items > 0) rows.push({ week: id, band: level, items, leaks });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

/**
 * THE BAR: band A fails the run, B-E are reported. The header argues it; the
 * output carries the evidence either way — per-band counts, and a SPOKEN-UNASKED
 * flag on any advisory leak the app plays without being asked (a word-problem on
 * a word-problem day, which `PracticePage` autoplays at every band).
 */
const AUTOPLAY_BAND = 'A';
const scored = rows.map((r) => ({ ...r, hard: r.band === AUTOPLAY_BAND ? r.leaks : [] }));
const failing = scored.filter((r) => r.hard.length > 0);
const advisory = scored.filter((r) => r.hard.length === 0 && r.leaks.length > 0);

console.log(
  `\nbb-spoken-answer — ${rows.length} weeks × ${SEEDS} seeds  (scene = figure.alt ?? [image: …], as speakablePrompt builds it)\n`,
);

console.log('  week   leaks/items   R1   R2   worst spoken line');
for (const r of scored) {
  if (r.band !== AUTOPLAY_BAND && !LIST) continue;
  const flag = r.hard.length > 0 ? 'FAIL' : '   ·';
  const r1 = r.leaks.filter((l) => l.rule === 'R1').length;
  const r2 = r.leaks.filter((l) => l.rule === 'R2').length;
  const worst = r.leaks[0];
  const shown = worst ? `[${worst.id} answer ${worst.answer}] ${worst.spoken.slice(0, 70)}` : '';
  console.log(
    `${flag}  ${r.week.padEnd(5)} ${String(r.leaks.length).padStart(5)}/${String(r.items).padEnd(6)} ${String(r1).padStart(4)} ${String(r2).padStart(4)}   ${shown}`,
  );
}

const byBand = new Map<string, { items: number; leaks: number; unasked: number; weeks: number }>();
for (const r of scored) {
  const b = byBand.get(r.band) ?? { items: 0, leaks: 0, unasked: 0, weeks: 0 };
  b.items += r.items;
  b.leaks += r.leaks.length;
  b.unasked += r.leaks.filter((l) => l.autoplayed).length;
  b.weeks += 1;
  byBand.set(r.band, b);
}
console.log('\n  band   weeks    items   leaks   of those, SPOKEN UNASKED   bar');
for (const [band, b] of [...byBand.entries()].sort()) {
  const bar = band === AUTOPLAY_BAND ? 'FAIL' : 'report';
  console.log(
    `  ${band.padEnd(6)} ${String(b.weeks).padStart(5)} ${String(b.items).padStart(8)} ${String(b.leaks).padStart(7)} ${String(b.unasked).padStart(25)}   ${bar}`,
  );
}

function distinct(list: Leak[]): Leak[] {
  const seen = new Set<string>();
  const out: Leak[] = [];
  for (const l of list) {
    const key = `${l.week}|${l.rule}|${l.spoken.replace(/\d+/g, '#')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

const line = (l: Leak) =>
  `  ${l.rule}${l.autoplayed ? '*' : ' '} ${l.week.padEnd(5)} ${l.id.padEnd(10)} answer ${JSON.stringify(l.answer).padEnd(12)} discloses ${JSON.stringify(l.disclosed).padEnd(10)} "${l.spoken}"`;

if (failing.length > 0) {
  console.log('\nFAILURES (band A — autoplayed to a child who cannot read), one line per distinct surface:');
  for (const l of distinct(failing.flatMap((r) => r.hard))) console.log(line(l));
}

if (advisory.length > 0) {
  const all = advisory.flatMap((r) => r.leaks);
  console.log(
    `\nADVISORY — ${all.length} leak(s) across ${advisory.length} week(s) at the reading bands; ${all.filter((l) => l.autoplayed).length} of them SPOKEN UNASKED (marked *).`,
  );
  console.log('  Read by a human: most are landmark coincidences, some are real. Nothing here fails the run.');
  for (const r of advisory) {
    const d = distinct(r.leaks);
    const unasked = r.leaks.filter((l) => l.autoplayed).length;
    console.log(
      `  ${r.week.padEnd(5)} ${String(r.leaks.length).padStart(4)} leak(s)${unasked ? ` (${unasked}*)` : '    '}, ${String(d.length).padStart(2)} distinct — e.g. answer ${JSON.stringify(d[0].answer)} in "${d[0].spoken.slice(0, 88)}"`,
    );
  }
  if (LIST) for (const l of distinct(all)) console.log(line(l));
  else console.log('  (--list prints every distinct advisory line)');
}

console.log(
  `\n${failing.length === 0 ? 'PASS' : 'FAIL'} — ${failing.length} band-A week(s) speak an item's own answer before asking it${failing.length ? ': ' + failing.map((f) => f.week).join(', ') : ''}\n`,
);
process.exit(failing.length === 0 ? 0 : 1);
