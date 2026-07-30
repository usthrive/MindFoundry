/**
 * Situation-CONTEXT frame registry + cross-week rotation ledger
 * (POLISH-PASS-SPEC §P3; PEDAGOGY-CEILING-REVIEW F4).
 *
 * Two defects live here, and they share one cause — context was chosen per week,
 * per item, with nothing looking sideways:
 *
 *  1. CONVERGENCE ACROSS WEEKS. Every multiplication week independently picked
 *     the most natural context and landed on the same one: D5, D8 and D15 all
 *     seat people in rows; D6, D7 and D16 all share things at tables or load
 *     buses. Each week is defensible alone; read in sequence they are one week
 *     repeated. A human tester saw it within minutes of first opening the app.
 *
 *  2. NOUNS AND PREDICATES DRAWN INDEPENDENTLY, which produced "1/4 of the
 *     marbles are ripe" — grammatical, arithmetically sound, and nonsense. A
 *     frame binds its nouns to the predicates that can truthfully be said about
 *     them, so the impossible combination cannot be drawn.
 *
 * The registry is deliberately DATA, not prose helpers: a week names the frames
 * it wants, the ledger tells it which ones its recent same-family neighbours
 * already used, and the preflight refuses a blueprint that repeats them. Because
 * a blueprint's declared frames are fixed (not drawn), the gate is
 * blueprint-structural and therefore seed-invariant — it throws for every seed
 * or for none, which is the standing rule for anything running at pack-generation
 * time (LEARNINGS L19).
 */

import type { BBLevel } from '../../../types';

/** The archetype pools a frame can belong to. A frame may serve several. */
export type FrameFamily =
  | 'multiplicative'      // equal groups, arrays, scaling, area-model
  | 'division'            // sharing, grouping, remainders
  | 'fraction'            // parts of a whole, parts of a set
  | 'decimal-money'       // prices, change, budgets
  | 'measurement'         // length, mass, capacity, time
  | 'number-property';    // place value, factors, patterns

export interface ContextFrame {
  id: string;
  families: FrameFamily[];
  /** Countable objects this frame can talk about (plural form). */
  nouns: readonly string[];
  /** Container / group word, for equal-group and sharing stories. */
  group?: string;
  /** Predicates that are TRUE of this frame's nouns — bound, never cross-drawn. */
  predicates?: readonly string[];
  /** The unit an amount in this frame is measured in. */
  unit?: string;
  /** One-line note for authors on what the frame is good for. */
  note: string;
}

/**
 * The pool. Target ≥6 usable frames per family so a rotation of the last two
 * same-family weeks never runs the pool dry.
 */
export const CONTEXT_FRAMES: readonly ContextFrame[] = [
  // --- multiplicative -------------------------------------------------------
  { id: 'seating', families: ['multiplicative', 'division'], group: 'row',
    nouns: ['seats', 'chairs'], predicates: ['are taken', 'stay empty'],
    note: 'Rows of seats — the natural array. Heavily used; rotate away from it.' },
  { id: 'packing', families: ['multiplicative', 'division'], group: 'crate',
    nouns: ['jars', 'tins', 'bottles'], predicates: ['are packed', 'are sealed'],
    note: 'Crates and cartons — clean equal grouping with a physical container.' },
  { id: 'tiling', families: ['multiplicative', 'measurement'], group: 'row',
    nouns: ['tiles', 'paving stones'], predicates: ['are laid', 'are cut'],
    note: 'Floor tiling — the area model made literal.' },
  { id: 'baking', families: ['multiplicative', 'division', 'fraction'], group: 'tray',
    nouns: ['muffins', 'rolls', 'biscuits'], predicates: ['are baked', 'have cooled'],
    note: 'Batches on trays — equal groups with a strong fraction affordance.' },
  { id: 'orchard', families: ['multiplicative', 'division', 'fraction'], group: 'basket',
    nouns: ['apples', 'pears', 'plums'], predicates: ['are ripe', 'are picked'],
    note: 'Harvest — the ONLY frame where "are ripe" may be said.' },
  { id: 'bookshelf', families: ['multiplicative', 'division'], group: 'shelf',
    nouns: ['books', 'albums'], predicates: ['are shelved', 'are borrowed'],
    note: 'Shelves of books — array without the seating cliché.' },
  { id: 'track-laps', families: ['multiplicative', 'measurement'], group: 'lap',
    nouns: ['laps'], predicates: ['are run', 'are walked'], unit: 'metres',
    note: 'Repeated laps — scaling a length rather than a count.' },
  { id: 'ticket-sales', families: ['multiplicative', 'decimal-money'], group: 'booking',
    nouns: ['tickets', 'passes'], predicates: ['are sold', 'are booked'],
    note: 'Sales — equal groups that carry a price naturally.' },
  { id: 'bead-craft', families: ['multiplicative', 'division', 'fraction'], group: 'string',
    nouns: ['beads', 'charms'], predicates: ['are threaded', 'are gold'],
    note: 'Craft — small countables, good for part-of-a-set.' },

  // --- division-leaning -----------------------------------------------------
  { id: 'transport', families: ['division'], group: 'bus',
    nouns: ['riders', 'passengers'], predicates: ['are waiting', 'have boarded'],
    note: 'Buses and vans — the canonical round-UP remainder story.' },
  { id: 'table-seating', families: ['division'], group: 'table',
    nouns: ['guests', 'diners'], predicates: ['are seated', 'are waiting'],
    note: 'Guests at tables — round-up remainder. Sibling of seating; do not pair.' },
  { id: 'ribbon-cutting', families: ['division', 'measurement', 'fraction'], group: 'piece',
    nouns: ['bows', 'strips'], predicates: ['are tied', 'are cut'], unit: 'cm',
    note: 'Cutting a length — the canonical DROP-the-remainder story.' },
  { id: 'team-split', families: ['division'], group: 'team',
    nouns: ['players', 'members'], predicates: ['have signed up', 'are picked'],
    note: 'Teams — sharing where a leftover person is vivid.' },

  // --- fraction -------------------------------------------------------------
  { id: 'recipe', families: ['fraction', 'measurement'], group: 'batch',
    nouns: ['cups', 'spoons'], predicates: ['are measured', 'are stirred in'], unit: 'cup',
    note: 'Recipes — state the partition ("measured in eighths of a cup") when using unreduced thirds/eighths.' },
  { id: 'cloth', families: ['fraction', 'measurement'], group: 'length',
    nouns: ['ribbons', 'strips'], predicates: ['are cut', 'are sewn'], unit: 'metre',
    note: 'Cloth and ribbon — parts of a linear whole.' },
  { id: 'garden-bed', families: ['fraction', 'multiplicative'], group: 'bed',
    nouns: ['plots', 'rows'], predicates: ['are planted', 'lie empty'], unit: 'square metre',
    note: 'Garden beds — parts of an AREA, good for fraction × fraction.' },
  { id: 'water-jug', families: ['fraction', 'measurement', 'decimal-money'], group: 'jug',
    nouns: ['jugs', 'bottles'], predicates: ['are filled', 'are poured out'], unit: 'litre',
    note: 'Capacity — parts of a volume; pairs with decimals.' },
  { id: 'trail', families: ['fraction', 'measurement'], group: 'leg',
    nouns: ['legs', 'stages'], predicates: ['are walked', 'are marked'], unit: 'kilometre',
    note: 'A trail split into legs — partition-anchored by construction.' },
  { id: 'pizza', families: ['fraction'], group: 'pizza',
    nouns: ['slices'], predicates: ['are eaten', 'are shared'],
    note: 'Slices — the partition is physically visible, so unreduced forms are honest.' },

  // --- decimal / money ------------------------------------------------------
  { id: 'shop-change', families: ['decimal-money'], group: 'purchase',
    nouns: ['erasers', 'pencils', 'badges', 'stickers'], predicates: ['are bought', 'are paid for'],
    note: 'Buying and change — the canonical money 2-step.' },
  { id: 'allowance', families: ['decimal-money'], group: 'week',
    nouns: ['savings'], predicates: ['are saved', 'are spent'],
    note: 'Saving over days — running totals without a shop.' },
  { id: 'market-stall', families: ['decimal-money', 'multiplicative'], group: 'stall',
    nouns: ['punnets', 'bunches'], predicates: ['are sold', 'are weighed'],
    note: 'Per-unit prices — rate reasoning with money.' },
  { id: 'day-pass', families: ['decimal-money', 'multiplicative'], group: 'day',
    nouns: ['passes', 'fares'], predicates: ['are bought', 'are used'],
    note: 'Repeated fares — price × count.' },

  // --- measurement ----------------------------------------------------------
  { id: 'rope-wire', families: ['measurement', 'division'], group: 'coil',
    nouns: ['ropes', 'wires'], predicates: ['are cut', 'are joined'], unit: 'metre',
    note: 'Cutting and joining lengths.' },
  { id: 'weighing', families: ['measurement'], group: 'sack',
    nouns: ['sacks', 'parcels'], predicates: ['are weighed', 'are loaded'], unit: 'kg',
    note: 'Mass — a scale reading rather than a count.' },
  { id: 'walking-path', families: ['measurement', 'fraction'], group: 'section',
    nouns: ['sections'], predicates: ['are paved', 'are walked'], unit: 'km',
    note: 'Path sections — ragged decimal lengths are realistic here.' },

  // --- number property ------------------------------------------------------
  { id: 'population', families: ['number-property'], group: 'town',
    nouns: ['residents'], predicates: ['are counted', 'are recorded'],
    note: 'Census figures — large numbers that want thousands separators.' },
  { id: 'attendance', families: ['number-property'], group: 'festival',
    nouns: ['visitors'], predicates: ['arrive', 'are counted'],
    note: 'Attendance across days — large-number addition.' },
  { id: 'warehouse', families: ['number-property', 'multiplicative'], group: 'pallet',
    nouns: ['cans', 'cartons'], predicates: ['are stored', 'are stacked'],
    note: 'Stock at scale — ×10/×100 place-value stories.' },
];

const BY_ID = new Map(CONTEXT_FRAMES.map((f) => [f.id, f]));

export function frame(id: string): ContextFrame {
  const f = BY_ID.get(id);
  if (!f) throw new Error(`contexts: unknown frame '${id}'`);
  return f;
}

/** Every frame serving a family, for authors choosing a fresh one. */
export function framesFor(family: FrameFamily): ContextFrame[] {
  return CONTEXT_FRAMES.filter((f) => f.families.includes(family));
}

/**
 * Nouns bound to an attribute that is actually TRUE of them. Drawing the noun
 * and the adjective from separate pools is what produced "1/4 of the marbles
 * are ripe" — each draw was individually sensible, the combination absurd.
 * The pair is the unit of draw, so the absurd combination cannot occur.
 */
export const ATTRIBUTE_PAIRS: readonly (readonly [string, string])[] = [
  ['apples', 'ripe'], ['pears', 'ripe'], ['plums', 'ripe'],
  ['marbles', 'blue'], ['marbles', 'striped'], ['beads', 'gold'],
  ['tiles', 'cracked'], ['tiles', 'red'], ['cards', 'shiny'],
  ['stickers', 'silver'], ['buttons', 'wooden'], ['shells', 'spotted'],
];

/** A noun with an adjective that can truthfully describe it. */
export function boundAttribute(
  r: { pick: <T>(xs: readonly T[]) => T },
): { noun: string; attribute: string } {
  const [noun, attribute] = r.pick(ATTRIBUTE_PAIRS);
  return { noun, attribute };
}

/**
 * A noun with a predicate that is TRUE of it — the pairing that stops
 * "the marbles are ripe". Both come from the same frame, drawn together.
 */
export function subject(
  f: ContextFrame,
  r: { pick: <T>(xs: readonly T[]) => T },
): { noun: string; predicate: string } {
  return {
    noun: r.pick(f.nouns),
    predicate: f.predicates ? r.pick(f.predicates) : 'are counted',
  };
}

// ---------------------------------------------------------------------------
// Cross-week rotation ledger
// ---------------------------------------------------------------------------

/**
 * The primary frames each week has CLAIMED, declared by its blueprint. This is
 * the sideways view no gate previously had: a week can only know it is repeating
 * its neighbours if someone records what the neighbours used.
 *
 * Keyed `"<level><week>"`. A week lists the frames it leans on for ≥2 core items
 * (incidental single uses are not claims and need not be declared).
 */
export const WEEK_PRIMARY_FRAMES: Record<string, readonly string[]> = {
  // Level D — reassigned to break the seats/tables convergence (POLISH §P3).
  D4: ['bead-craft', 'track-laps'],
  D5: ['seating', 'tiling'],            // area model keeps its rows-of-seats anchor
  D6: ['baking', 'bookshelf'],
  D7: ['transport', 'ribbon-cutting'],  // round-up and drop, one frame each
  D8: ['packing', 'warehouse'],
  D11: ['recipe', 'track-laps'],
  // D12's conceptual anchor IS the money model, so it keeps the shop; D14 must
  // therefore find a different money situation, which is the rule working —
  // "buy two things and get change" twice in three weeks is the convergence.
  D12: ['shop-change', 'water-jug'],
  D13: ['weighing', 'market-stall'],
  D14: ['allowance', 'walking-path'],
  D15: ['ticket-sales', 'bookshelf'],
  D16: ['orchard', 'team-split'],
  D18: ['garden-bed', 'cloth'],
  D19: ['water-jug', 'rope-wire'],
  D20: ['day-pass', 'shop-change'],   // shop returns 8 weeks after D12 — well outside the window
};

/** Which family a week's concept belongs to, for the rotation window. */
export const WEEK_FAMILY: Record<string, FrameFamily> = {
  D4: 'multiplicative', D5: 'multiplicative', D8: 'multiplicative', D15: 'multiplicative',
  D6: 'division', D7: 'division', D16: 'division', D19: 'division',
  D9: 'fraction', D10: 'fraction', D11: 'fraction', D18: 'fraction', D17: 'fraction',
  D12: 'decimal-money', D13: 'decimal-money', D14: 'decimal-money', D20: 'decimal-money',
  D1: 'number-property', D2: 'number-property', D3: 'number-property',
  D21: 'number-property', D22: 'number-property', D23: 'measurement', D24: 'measurement',
};

/**
 * The frames claimed by the TWO most recent strictly-earlier weeks of the same
 * family. A blueprint may not claim any of these — two weeks is the rotation
 * window: long enough that a reader never meets the same context twice running,
 * short enough that a ≥6-frame pool never runs dry.
 *
 * KNOWN LIMIT: the window is per-FAMILY, so two weeks of different families may
 * still share a frame a fortnight apart (a multiplication week and a division
 * week both using baskets). That is far milder than the convergence this fixes —
 * the operation differs, so the problems do not read as the same page — but a
 * reader moving straight through the level can still notice it. Widening the
 * rule to all families would need a larger pool than Level D's assignment has
 * room for; revisit when the A/B/C/E pools are authored.
 */
export function recentFamilyFrames(level: BBLevel, week: number, lookback = 2): Set<string> {
  const key = `${level}${week}`;
  const family = WEEK_FAMILY[key];
  const used = new Set<string>();
  if (!family) return used;
  let found = 0;
  for (let w = week - 1; w >= 1 && found < lookback; w--) {
    const k = `${level}${w}`;
    if (WEEK_FAMILY[k] !== family) continue;
    found++;
    for (const id of WEEK_PRIMARY_FRAMES[k] ?? []) used.add(id);
  }
  return used;
}
