/**
 * School Math (Singapore Method) — the engine's data shapes.
 *
 * Source: ENGINE-SPEC §4.1–§4.2, BUILD-PLAN v2 §5.2 (roles) and §13 (the fix-it twin),
 * EXEMPLAR-G1-U02. Everything here is plain data: an item can be dumped, stored and
 * re-checked without running any screen code.
 *
 * Rules the shapes carry:
 *   - an item has one or more PARTS, each with its own surface, answer and reveal rule
 *     (the error item's rows exist only after the fix is committed: `after-part:<k>`);
 *   - every wrong value the item shows or names comes from a named misconception rule
 *     (engine/lib/misconceptions.ts) and is re-derived by the template's `verifyFor`;
 *   - the ladder has four rungs, number-free and the same at every seed.
 */

import type { Rng } from '../best-brains/generator/rng'

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

export type SkillKind = 'solve' | 'model' | 'explain' | 'stretch'
export type FluencyKind = 'standard' | 'model-long'

export interface SMSkill {
  /** e.g. 'G1-U02-K6'. */
  id: string
  unitId: string
  /** The lessons that teach it (K4 and K10 span two). */
  lessonIds: string[]
  kind: SkillKind
  says: string
  /** Templates whose first-try answers count as "knows" evidence (DD9). */
  earnedOn: string[]
  fluencyKind: FluencyKind
}

export interface SMLesson {
  /** e.g. 'G1-U02-L4'. */
  id: string
  unitId: string
  iCan: string
  /** Concrete → pictorial → abstract, in the order the lesson day serves them. */
  cpaSteps: string[]
  /** Template ids served by this lesson. */
  templates: string[]
  skills: string[]
  /** Units/lessons this lesson's skills return in (GRADE-1 "Return target"). */
  returnTargets: string[]
  /** The lesson's exit templates (EXEMPLAR §3). */
  exitTemplates: string[]
  explainTemplate?: string
  isPaperLesson: boolean
}

/** A bond fact: one whole and its two parts (parts unordered). */
export interface SMFact {
  whole: number
  parts: [number, number]
}

export interface SMDemo {
  lessonId: string
  says: string
  facts: SMFact[]
}

export interface SMUnit {
  id: string
  grade: number
  title: string
  /** A lookup to the school's chapter (DD2); never a publisher lesson title. */
  schoolChapter: { number: number; topic: string }
  ccss: string[]
  lessonCount: number
  modelBuilt: string
  heuristic: string
  /** Full detail only for the units built so far (G1-U02; the U01 lessons it uses). */
  lessons: SMLesson[]
  skills: SMSkill[]
  /** The teacher's demos (fixed, authored). Checks never use these facts (EXEMPLAR §1). */
  lessonExampleNumbers: SMDemo[]
  entryCheckLine?: string
  /** Story settings this unit owns (EXEMPLAR §8; the cross-unit ledger). */
  storySettings?: string[]
}

// ---------------------------------------------------------------------------
// Roles, rungs, formats
// ---------------------------------------------------------------------------

/** ENGINE §4.2 roles plus `placement` and `warm` (BUILD-PLAN §5.2). */
export type SMRole =
  | 'starter' | 'step' | 'exit' | 'practice' | 'return' | 'comeback' | 'preview'
  | 'entry' | 'check' | 'mock' | 'prep' | 'short-check' | 'review' | 'placement' | 'warm'

export type ModelRung = 'read' | 'label' | 'build' | 'unaided'

// ---------------------------------------------------------------------------
// Figures (plain data; renderers come in stage 2)
// ---------------------------------------------------------------------------

/** A bond circle: a number, empty (the asked circle), or "?" (a story's unknown). */
export type BondCell = number | 'empty' | '?'

export interface BondShape {
  whole: BondCell
  parts: [BondCell, BondCell]
}

export type SMFigure =
  | { kind: 'counters'; count: number; layout: 'scattered' | 'row' | 'two-circles'; tappable: boolean; spoken: string }
  | { kind: 'number-bond'; bond: BondShape; spoken: string }
  /** Fixed shapes each carrying its number; nothing countable (L33). */
  | { kind: 'groups'; shape: string; groups: number[]; spoken: string }
  | { kind: 'split-list'; whole: number; rows: Array<{ first: number; second: number | null }>; spoken: string }
  | { kind: 'match-rows'; top: { count: number; spread: boolean }; bottom: { count: number; spread: boolean }; spoken: string }
  | { kind: 'number-track'; cells: Array<number | null>; spoken: string }
  | { kind: 'scene'; setting: string; shape: string; groups: number[]; spoken: string }

// ---------------------------------------------------------------------------
// Choices and truth rows
// ---------------------------------------------------------------------------

export type ChoiceContent =
  | { kind: 'number'; value: number }
  | { kind: 'pair'; a: number; b: number }
  | { kind: 'bond'; bond: BondShape }
  | { kind: 'sentence'; text: string }
  /** A picture choice: a full ten frame (or not) and some ones. */
  | { kind: 'picture'; fullTen: boolean; ones: number }
  | { kind: 'row'; which: 'top' | 'bottom' }

export interface SMChoice {
  /** Display key, 'A'… in served order. */
  key: string
  text: string
  content: ChoiceContent
  /** The misconception rule that makes this value; null only on the key. */
  rule: string | null
}

export interface SMTruthRow {
  /** Stable row id; `verifyFor` recomputes its truth from the item's numbers. */
  id: string
  text: string
  truth: boolean
  /** A rule the false row voices (e.g. fact.order-swapped), when it has one. */
  rule?: string
}

// ---------------------------------------------------------------------------
// Surfaces (ENGINE §3.2 ids; the screen renders from these in stage 2)
// ---------------------------------------------------------------------------

export type SMSurface =
  | { kind: 'counter-split'; id: 'N-I4'; whole: number }
  | { kind: 'bond'; id: 'N-I2'; mode: 'build' | 'fill' | 'label'; start: BondShape }
  | { kind: 'sentence'; id: 'N-I8'; text: string; input: 'chips' | 'pad'; chips?: string[]; shapeHint?: string }
  | { kind: 'pad'; id: 'T8'; text?: string }
  | { kind: 'choices'; id: 'T1'; choices: SMChoice[]; numeric: boolean; pictures: boolean }
  | { kind: 'truth'; id: 'N-I10'; rows: SMTruthRow[] }
  | { kind: 'paper'; id: 'N-I11'; button: string; chips: string[] }
  /** DD17's "tell it back": never graded. */
  | { kind: 'ack'; label: string }

// ---------------------------------------------------------------------------
// Answers (one validation per part; each kind is on the validator's QG-5 list)
// ---------------------------------------------------------------------------

export type BondAsk = 'whole' | 'part' | 'orientation' | 'unknown-place'

export type SMAnswer =
  | { kind: 'number'; value: number }
  /** Any two parts ≥ 1 that make `whole`; optionally not the shown pair; or equal to another part's split. */
  | { kind: 'split'; whole: number; notPair?: [number, number]; sameAsPart?: string }
  /**
   * The bond the child builds or fills. `whole`/`parts` null = "his own split from
   * part `sameAsPart`"; '?' = a story's unknown he places. Parts are unordered.
   */
  | {
      kind: 'bond-parts'
      whole: number | '?'
      parts: [number | '?', number | '?'] | null
      asked: BondAsk[]
      sameAsPart?: string
    }
  /** The child's sentence must be one of `accepts` (normalised). */
  | { kind: 'sentence-match'; accepts: string[] }
  | { kind: 'choice-key'; key: string }
  | { kind: 'truth-set'; value: string }
  /** "I drew it" then the typed sentence; the sentence is graded, the drawing never. */
  | { kind: 'paper-ack'; accepts: string[] }
  | { kind: 'ack' }

export type SMAnswerKind = SMAnswer['kind']

/** What `answerFor` returns per part: a full answer, or (for choices) the key's content. */
export type SMExpected =
  | Exclude<SMAnswer, { kind: 'choice-key' }>
  | { kind: 'choice-key'; content: string }

/** A review line the item can say when the child's answer matches a named rule. */
export interface SMReviewRule {
  rule: string
  /** The value the rule gives (number), or a canonical text for pair / sentence rules. */
  value: number | string
  line: string
}

export interface SMPart {
  id: string
  prompt?: string
  surface: SMSurface
  answer: SMAnswer
  reveal: 'with-item' | `after-part:${string}`
  skillIds: string[]
  /** Points on a check (EXEMPLAR §7); absent elsewhere. */
  points?: number
  reviewRules: SMReviewRule[]
}

export interface SMLadderRung {
  say: string
  /** What the screen does at this rung (a named action; the renderer reads the item). */
  show: string
}

export interface SMGenerator {
  templateId: string
  params: Record<string, unknown>
  seed: number
  stream: string
  /** The caller's structural choices (box place, story kind…), so a twin keeps the structure. */
  options?: Record<string, unknown>
  /** Parts kept (the placement pair keeps part 1 only). */
  partsOnly?: string[]
}

export interface SMItem {
  id: string
  unitId: string
  lessonId: string
  templateId: string
  role: SMRole
  modelRung: ModelRung
  skillIds: string[]
  formatCode: string
  prompt: string
  figures: SMFigure[]
  parts: SMPart[]
  /** Every rule id the item uses (choices, rows, review lines, shown error). */
  misconceptionRules: string[]
  /** Every line the read-aloud will say (prompt, figure, ladder, review lines, rows). */
  spokenLines: string[]
  ladderFamily: string
  ladder: [SMLadderRung, SMLadderRung, SMLadderRung, SMLadderRung]
  generator: SMGenerator
  /** The numbers printed for the child to use (QG-1 operand tuple; spoken-line rule). */
  givens: number[]
  /** The bond fact the item is about, when it has one (demo-fact rule, EXEMPLAR §1). */
  fact?: SMFact
  lessonOnly: boolean
  /** "try a new one" on previews (DD24). */
  label?: string
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface SMBuildCtx {
  role: SMRole
  seed: number
  stream: string
  /** Template-specific choices made by the caller (box place, story kind, which part is asked…). */
  options?: Record<string, unknown>
  /** Fixed draws (fixtures and the dump only). */
  force?: Record<string, number>
  /** Facts the draw must not land on (checks, entry, placement: the demo facts). */
  avoidFacts?: SMFact[]
  /** Smallest part a drawn fact may have (checks and stories: 2 — a part of 1 makes an item too easy
   *  to be evidence, and "1 apple and 1 more" is not a story). */
  minPart?: number
  /** Parts to keep (the placement pair keeps part 1 only). */
  partsOnly?: string[]
}

export interface SMVerify {
  /** The numbers the misconception rules read (w, p, k, a, b, n …). */
  args: Record<string, number>
  /** Rule inputs that differ per part (e.g. one list row per part), by part id. */
  partArgs?: Record<string, Record<string, number>>
  /** Each truth row's recomputed truth, by row id. */
  truth?: Record<string, boolean>
  /** The error item's shown value, recomputed from its rule. */
  shownWrong?: { rule: string; value: number }
}

export interface SMTemplateDef {
  id: string
  unitId: string
  lessonId: string
  skillIds: string[]
  /** Roles this template may be served in. Lesson-only templates list `step` alone. */
  uses: SMRole[]
  ladderFamily: string
  build: (rng: Rng, ctx: SMBuildCtx) => SMItem
  /** Recompute every part's answer from params alone (QG-5). */
  answerFor: (params: Record<string, unknown>) => Record<string, SMExpected>
  /** Recompute the rule inputs, truth rows and any shown wrong value (QG-11). */
  verifyFor: (params: Record<string, unknown>) => SMVerify
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

export interface SMCheckRow {
  section: string
  points: number
  item: SMItem
  category: 'concepts and procedures' | 'reasoning'
  note: string
}

export interface SMCheckForm {
  unitId: string
  kind: 'chapter-check'
  seed: number
  rows: SMCheckRow[]
  totalPoints: number
}

export interface SMEntryForm {
  unitId: string
  kind: 'entry-check'
  seed: number
  pairs: Array<{ skill: string; opensLesson: string; items: [SMItem, SMItem] }>
}

export interface SMPlacementPair {
  unitId: string
  kind: 'placement-pair'
  seed: number
  items: [SMItem, SMItem]
}
