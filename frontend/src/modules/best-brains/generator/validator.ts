/**
 * WeeklyConceptPack validator — machine-checked quality gates QG-1..QG-10
 * (QUESTION-GENERATOR-SPEC §3.6) plus the structural/schema constraints that
 * TypeScript cannot express (packId/contentId regexes, count bounds,
 * isRetrieval→retrievalSource, distractor errorTags, threshold consistency).
 *
 * Interpretations calibrated so the spec's own worked sample packs (§4,
 * ported verbatim as fixtures) pass — the fixtures are normative:
 *  - QG-1 duplicate surfaces: exact ordered operand tuple in the SAME format
 *    class (item.type), among daily items <2 days apart, and within each
 *    mastery form. Commuted/cross-format reuse is flagged only same-day.
 *  - QG-3/QG-9 mistake-bank coverage applies to NON-retrieval items' choices
 *    (retrieval items trap errors of their SOURCE week, whose bank lives in
 *    that week's pack).
 *  - QG-5 hint audit flags a rung that equals the answer, contains
 *    "= <answer>", or contains the whole answer string (len ≥ 3). The
 *    arithmetic audit recomputes answers via the template registry for
 *    generated items with objective validations.
 *  - QG-2 origin exception: Level A Week 1 is the curriculum-graph origin
 *    (no earlier week exists), so a zero retrieval share is legal there only.
 *  - §3.3 ramps: retrieval warm-ups must sit at difficulty ≤ 3 (the ordering
 *    ramps are generation-side rules; the spec's worked packs themselves
 *    deviate from a strict ordering reading, so they are not gated here).
 */

import type {
  BBFigure,
  BBLevel,
  PackDay,
  PackItem,
  WeekRef,
  WeeklyConceptPack,
} from '../types';
import { checkFigureShape, figureValue } from '../figures/assert';
import {
  BB_LEVELS,
  DAILY_DOSE_MAX_MINUTES,
  DAILY_DOSE_MIN_MINUTES,
  FAST_TRACK_PCT,
  MASTERY_BAND_MAX_PCT,
  MASTERY_BAND_MIN_PCT,
  RETRIEVAL_SHARE_MAX,
  RETRIEVAL_SHARE_MIN,
  SPRINT_DURATION_SECONDS,
  SPRINT_SOURCE_MIN_WEEKS_PRIOR,
  WEEKS_PER_LEVEL,
} from '../constants';
import { getTemplate } from './templates/registry';
import { commutedSignature, surfaceSignature } from './surface';
import { GROUP_LARGE_NUMBERS } from './templates/lib/format';

export interface Violation {
  /** Gate code: QG-1..QG-10 or S-* for structural/schema checks. */
  gate: string;
  /** JSON-path-ish locator inside the pack. */
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: Violation[];
}

// ---------------------------------------------------------------------------
// Enums & regexes (mirror of the JSON schema)
// ---------------------------------------------------------------------------

const PACK_ID_RE = /^MFM-[A-E](2[0-4]|1[0-9]|[1-9])$/;
const CONTENT_ID_RE = /^[A-E](2[0-4]|1[0-9]|[1-9])-(D[1-5]|GE|PZ|FS|MA|MB)-[0-9]{2}$/;
const SEMVER_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const CONCEPT_ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const ERROR_TAGS = new Set([
  'fact-recall', 'procedure-slip', 'concept-misconception',
  'representation-misread', 'task-comprehension',
]);
const ITEM_TYPES = new Set([
  'computation', 'word-problem', 'representation', 'reasoning',
  'error-analysis', 'classification', 'drawing', 'fluency',
]);
const VALIDATIONS = new Set([
  'exact-numeric', 'equivalent-numeric', 'equivalent-fraction', 'number-sentence',
  'choice-key', 'short-text-keyword', 'ordered-list', 'set', 'manual-review',
]);
const BANDS = new Set(['beginner', 'intermediate', 'transition', 'advanced']);
const STRAND_TAGS = new Set([
  'number-sense-counting', 'addition-subtraction', 'multiplication-division',
  'decimals-fractions', 'probability-statistics', 'algebra-geometry',
]);
const PUZZLE_TYPES = new Set([
  'logic', 'pattern', 'math-art', 'game', 'estimation', 'construction', 'error-analysis',
]);
const DAY_FOCUS_TEMPLATE = [
  'concept-echo', 'fluency-application', 'fluency-application', 'word-problems', 'noncomputational',
] as const;
const FADE_ORDER: Record<string, number> = {
  modeled: 0, completion: 1, prompted: 2, independent: 3,
};

/** Per-band per-item minutes: base + 0.25 × difficulty (+2.5 min/day overhead). */
const BAND_MINUTES_BASE: Record<string, number> = {
  beginner: 0.8, intermediate: 1.0, transition: 1.1, advanced: 1.2,
};
const DAY_OVERHEAD_MINUTES = 2.5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function levelOrdinal(level: BBLevel): number {
  return BB_LEVELS.indexOf(level);
}

function isStrictlyEarlier(src: WeekRef, level: BBLevel, week: number): boolean {
  const so = levelOrdinal(src.level);
  const po = levelOrdinal(level);
  return so < po || (so === po && src.week < week);
}

/** Parse "3", "0.5", "3/4", "1 7/12" → numeric value (or null). */
function numericValue(raw: string): number | null {
  // Thousands separators are a RENDERING choice (P6); strip before parsing so a
  // grouped answer and its bare form compare equal.
  const s = raw.trim().replace(/(\d),(?=\d{3}\b)/g, '$1');
  let m = /^(\d+)\s+(\d+)\/(\d+)$/.exec(s);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  m = /^(\d+)\/(\d+)$/.exec(s);
  if (m) return Number(m[1]) / Number(m[2]);
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return null;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * QG-11(b) prose anchor scan — CONSERVATIVE by design (FIX-SPEC §7b, review B3).
 * Flags ONLY a self-contained binary "a <+|×> b = c" integer equation whose
 * result is wrong. It deliberately ignores multi-term chains (a step past it is
 * an operator), fraction/decimal/mixed literals, unit-word-adjacent numbers, ids,
 * and en-dash ranges — so it cannot false-fail correct prose (the D17/A15/B14
 * fixtures and every v1 week stay green), while still catching a fabricated
 * product/sum baked into narration (the D8 class). Subtraction is excluded
 * (hyphen/en-dash/negative ambiguity).
 */
function scanBinaryIntegerEquations(text: string): Array<{ expr: string; computed: number; stated: number }> {
  const out: Array<{ expr: string; computed: number; stated: number }> = [];
  // Comma-grouped ("1,000") or plain integers; commas stripped before Number().
  const NUM = '\\d{1,3}(?:,\\d{3})+|\\d{1,7}';
  const re = new RegExp(`(${NUM})\\s+([×x*·+])\\s+(${NUM})\\s*=\\s*(${NUM})`, 'g');
  const val = (s: string) => Number(s.replace(/,/g, ''));
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(text)) !== null) {
    const start = mm.index;
    const end = re.lastIndex;
    // Look left past spaces: a preceding digit/operator/dot/slash/= means the first
    // operand continues a larger numeric expression (a plain word/punctuation before
    // is fine). Comma is NOT a boundary — NUM already consumes comma-grouped numbers,
    // so any leftover comma is punctuation, not a grouping separator.
    let bi = start - 1;
    while (bi >= 0 && text[bi] === ' ') bi--;
    const beforeCh = bi >= 0 ? text[bi] : ' ';
    if (/[\d./×x*·+\-÷–=]/.test(beforeCh)) continue;
    // Look right past spaces: a trailing digit/operator/dot/slash/% means the RHS
    // continues (a chain, decimal, fraction, or percentage). Comma excluded (see above).
    let ai = end;
    while (ai < text.length && text[ai] === ' ') ai++;
    const afterCh = ai < text.length ? text[ai] : ' ';
    if (/[\d./×x*·+\-÷–%]/.test(afterCh)) continue;
    const a = val(mm[1]);
    const b = val(mm[3]);
    const stated = val(mm[4]);
    const op = mm[2];
    const computed = op === '+' ? a + b : a * b;
    if (computed !== stated) out.push({ expr: `${mm[1]} ${op} ${mm[3]} = ${mm[4]}`, computed, stated });
  }
  return out;
}

interface LocatedItem {
  item: PackItem;
  path: string;
  /** 1–5 for daily items; 5 for mastery forms. */
  day: number;
  section: 'daily' | 'formA' | 'formB';
}

// ---------------------------------------------------------------------------
// The validator
// ---------------------------------------------------------------------------

export function validatePack(
  pack: WeeklyConceptPack,
  opts: { contract?: 'v1' | 'v2' } = {},
): ValidationResult {
  const v: Violation[] = [];
  const add = (gate: string, path: string, message: string) => v.push({ gate, path, message });

  const { level, week } = pack.identity;
  const idPrefix = `${level}${week}-`;

  // --- S-SCHEMA / QG-10: identity, versioning, top-level shapes ------------
  if (pack.schemaVersion !== '1.0') add('QG-10', 'schemaVersion', `schemaVersion must be "1.0", got "${pack.schemaVersion}"`);
  if (!PACK_ID_RE.test(pack.packId)) add('QG-10', 'packId', `packId "${pack.packId}" fails pattern MFM-<Level><Week>`);
  else if (pack.packId !== `MFM-${level}${week}`) add('QG-10', 'packId', `packId "${pack.packId}" does not match identity ${level}${week}`);
  if (!SEMVER_RE.test(pack.contentVersion)) add('QG-10', 'contentVersion', `contentVersion "${pack.contentVersion}" is not semver`);
  if (!BB_LEVELS.includes(level)) add('S-SCHEMA', 'identity.level', `invalid level "${level}"`);
  if (!Number.isInteger(week) || week < 1 || week > WEEKS_PER_LEVEL) add('S-SCHEMA', 'identity.week', `week ${week} outside 1..${WEEKS_PER_LEVEL}`);
  if (!CONCEPT_ID_RE.test(pack.identity.conceptId)) add('S-SCHEMA', 'identity.conceptId', `conceptId "${pack.identity.conceptId}" is not kebab-case`);
  if (pack.identity.conceptName.length > 80) add('S-SCHEMA', 'identity.conceptName', 'conceptName exceeds 80 chars');
  if (!BANDS.has(pack.identity.band)) add('S-SCHEMA', 'identity.band', `invalid band "${pack.identity.band}"`);
  const tags = pack.identity.strandTags;
  if (tags.length < 1 || tags.length > 3 || new Set(tags).size !== tags.length || tags.some((t) => !STRAND_TAGS.has(t))) {
    add('S-SCHEMA', 'identity.strandTags', 'strandTags must be 1-3 unique valid strand labels');
  }
  for (const [i, ref] of pack.identity.prerequisiteWeeks.entries()) {
    if (!BB_LEVELS.includes(ref.level) || ref.week < 1 || ref.week > WEEKS_PER_LEVEL) {
      add('S-SCHEMA', `identity.prerequisiteWeeks[${i}]`, 'invalid week reference');
    }
  }
  if (level === 'A' && pack.presentation?.audioFirst !== true) {
    add('S-SCHEMA', 'presentation.audioFirst', 'Level A packs require presentation.audioFirst = true');
  }

  // --- Explanation / guided examples ---------------------------------------
  const script = pack.explanation.script;
  if (script.length < 2 || script.length > 6) add('S-SCHEMA', 'explanation.script', `script needs 2-6 segments, has ${script.length}`);
  const vocab = pack.explanation.vocabulary;
  if (vocab.length < 1 || vocab.length > 6) add('S-SCHEMA', 'explanation.vocabulary', `vocabulary needs 1-6 entries, has ${vocab.length}`);
  const ges = pack.guidedExamples;
  if (ges.length < 3 || ges.length > 5) add('S-SCHEMA', 'guidedExamples', `needs 3-5 guided examples, has ${ges.length}`);
  let lastFade = -1;
  ges.forEach((ge, i) => {
    const p = `guidedExamples[${i}]`;
    if (!CONTENT_ID_RE.test(ge.id) || !ge.id.startsWith(idPrefix) || !ge.id.includes('-GE-')) {
      add('S-ID', `${p}.id`, `guided-example id "${ge.id}" must match ${level}${week}-GE-nn`);
    }
    const fade = FADE_ORDER[ge.fadeLevel];
    if (i === 0 && ge.fadeLevel !== 'modeled') add('S-SCHEMA', `${p}.fadeLevel`, 'guided examples must start with a modeled example');
    if (fade < lastFade) add('S-SCHEMA', `${p}.fadeLevel`, 'guided examples must be ordered by fade (modeled first)');
    lastFade = Math.max(lastFade, fade);
    if (ge.steps.length < 1 || ge.steps.length > 8) add('S-SCHEMA', `${p}.steps`, `needs 1-8 steps, has ${ge.steps.length}`);
    ge.steps.forEach((s, j) => {
      if (s.teacherSay === undefined && s.childDo === undefined) {
        add('S-SCHEMA', `${p}.steps[${j}]`, 'step needs teacherSay and/or childDo');
      }
    });
  });

  // --- Days: structure + QG-8 template order --------------------------------
  const days = pack.days;
  if (days.length !== 5) add('QG-8', 'days', `pack must have exactly 5 days, has ${days.length}`);
  const located: LocatedItem[] = [];
  days.forEach((day: PackDay, di: number) => {
    const p = `days[${di}]`;
    if (day.day !== di + 1) add('S-SCHEMA', `${p}.day`, `day number ${day.day} at index ${di} (expected ${di + 1})`);
    if (DAY_FOCUS_TEMPLATE[di] && day.focus !== DAY_FOCUS_TEMPLATE[di]) {
      add('QG-8', `${p}.focus`, `Day ${di + 1} focus "${day.focus}" violates the DD3 template order (expected "${DAY_FOCUS_TEMPLATE[di]}")`);
    }
    if (day.pageCount < 1 || day.pageCount > 3) add('QG-6', `${p}.pageCount`, `pageCount ${day.pageCount} outside 1-3`);
    if (day.items.length < 3 || day.items.length > 8) add('QG-6', `${p}.items`, `${day.items.length} items outside 3-8`);
    if (day.teacherNoteStrip !== undefined && day.day !== 5) {
      add('S-SCHEMA', `${p}.teacherNoteStrip`, 'teacherNoteStrip belongs on Day 5 only');
    }
    day.items.forEach((item, ii) => {
      if (!item.id.includes(`-D${di + 1}-`)) {
        add('S-ID', `${p}.items[${ii}].id`, `item id "${item.id}" must use the D${di + 1} slot`);
      }
      located.push({ item, path: `${p}.items[${ii}]`, day: di + 1, section: 'daily' });
    });
  });
  const day5 = days[4];
  if (day5) {
    if (!day5.items.some((it) => it.strand === 'noncomputational')) {
      add('QG-8', 'days[4]', 'Day 5 must carry the noncomputational strand (DD12 strand coupling)');
    }
    if (pack.identity.band === 'beginner' && !day5.teacherNoteStrip) {
      add('S-SCHEMA', 'days[4].teacherNoteStrip', 'beginner-band packs require the Day-5 teacherNoteStrip (E57)');
    }
  }

  // --- Mastery check ---------------------------------------------------------
  const mc = pack.masteryCheck;
  if (mc.passThresholdPct < MASTERY_BAND_MIN_PCT || mc.passThresholdPct > MASTERY_BAND_MAX_PCT) {
    add('S-SCHEMA', 'masteryCheck.passThresholdPct', `passThresholdPct ${mc.passThresholdPct} outside DD1 band ${MASTERY_BAND_MIN_PCT}-${MASTERY_BAND_MAX_PCT}`);
  }
  if (mc.fastTrackPct !== FAST_TRACK_PCT) add('S-SCHEMA', 'masteryCheck.fastTrackPct', `fastTrackPct must be ${FAST_TRACK_PCT}`);
  (['formA', 'formB'] as const).forEach((form) => {
    const items = mc[form];
    if (items.length < 6 || items.length > 10) add('S-SCHEMA', `masteryCheck.${form}`, `${form} needs 6-10 items, has ${items.length}`);
    const slot = form === 'formA' ? '-MA-' : '-MB-';
    items.forEach((item, i) => {
      if (!item.id.includes(slot)) add('S-ID', `masteryCheck.${form}[${i}].id`, `id "${item.id}" must use the ${slot.slice(1, 3)} slot`);
      located.push({ item, path: `masteryCheck.${form}[${i}]`, day: 5, section: form });
    });
  });
  if (!mc.isomorphNotes.trim()) add('QG-4', 'masteryCheck.isomorphNotes', 'isomorphNotes must describe the per-index isomorph classes');

  // --- Item-level structural checks (S-ITEM + QG-9 tag hygiene) -------------
  const seenIds = new Set<string>();
  const bankTags = new Set(pack.mistakeBank.map((m) => m.errorTag));
  for (const { item, path } of located) {
    if (!CONTENT_ID_RE.test(item.id)) add('S-ID', `${path}.id`, `item id "${item.id}" fails the contentId pattern`);
    else if (!item.id.startsWith(idPrefix)) add('S-ID', `${path}.id`, `item id "${item.id}" does not carry the ${level}${week} prefix`);
    if (seenIds.has(item.id)) add('S-ID', `${path}.id`, `duplicate item id "${item.id}"`);
    seenIds.add(item.id);
    if (!ITEM_TYPES.has(item.type)) add('S-SCHEMA', `${path}.type`, `invalid item type "${item.type}"`);
    if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 5) {
      add('S-SCHEMA', `${path}.difficulty`, `difficulty ${item.difficulty} outside 1-5`);
    }
    if (item.hintLadder.length < 1 || item.hintLadder.length > 3) {
      add('QG-5', `${path}.hintLadder`, `hint ladder needs 1-3 rungs, has ${item.hintLadder.length}`);
    }
    const et = item.errorTags;
    if (et.length < 1 || et.length > 3 || new Set(et).size !== et.length || et.some((t) => !ERROR_TAGS.has(t))) {
      add('QG-9', `${path}.errorTags`, 'errorTags must be 1-3 unique tags from the closed DD7 enum');
    }
    if (!VALIDATIONS.has(item.answer.validation)) add('S-SCHEMA', `${path}.answer.validation`, `invalid validation "${item.answer.validation}"`);
    if (item.isRetrieval) {
      if (!item.retrievalSource) add('QG-2', `${path}.retrievalSource`, 'isRetrieval=true requires retrievalSource');
      if (item.difficulty > 3) add('S-RAMP', `${path}.difficulty`, `retrieval warm-up at difficulty ${item.difficulty} (must be ≤3, §3.3)`);
    }
    // Choices block
    if (item.choices) {
      if (item.answer.validation !== 'choice-key') add('S-SCHEMA', `${path}.answer.validation`, 'items with choices must validate as choice-key');
      if (item.choices.length < 2 || item.choices.length > 6) add('S-SCHEMA', `${path}.choices`, `needs 2-6 choices, has ${item.choices.length}`);
      const keys = item.choices.map((c) => c.key);
      if (new Set(keys).size !== keys.length || keys.some((k) => !/^[A-F]$/.test(k))) {
        add('S-SCHEMA', `${path}.choices`, 'choice keys must be unique letters A-F');
      }
      const correct = item.choices.filter((c) => c.isCorrect);
      if (correct.length !== 1) add('S-SCHEMA', `${path}.choices`, `exactly one correct choice required, found ${correct.length}`);
      if (correct.length === 1 && item.answer.value !== correct[0].key) {
        add('QG-5', `${path}.answer.value`, `choice-key answer "${item.answer.value}" does not match the correct choice key "${correct[0].key}"`);
      }
      item.choices.forEach((c, ci) => {
        if (!c.isCorrect) {
          if (!c.errorTag) add('QG-3', `${path}.choices[${ci}]`, 'distractor is missing its DD7 errorTag');
          if (!c.rationale) add('QG-3', `${path}.choices[${ci}]`, 'distractor is missing its rationale');
          if (c.errorTag && !ERROR_TAGS.has(c.errorTag)) add('QG-9', `${path}.choices[${ci}]`, `invalid distractor errorTag "${c.errorTag}"`);
          if (c.errorTag && !item.isRetrieval && !bankTags.has(c.errorTag)) {
            add('QG-3', `${path}.choices[${ci}]`, `distractor tag "${c.errorTag}" is not covered by the pack's mistakeBank (QG-9)`);
          }
        }
      });
    } else if (item.answer.validation === 'choice-key') {
      add('S-SCHEMA', `${path}.choices`, 'choice-key validation requires a choices block');
    }
  }

  // --- QG-2: retrieval integrity --------------------------------------------
  const dailyItems = located.filter((l) => l.section === 'daily');
  const retrieval = dailyItems.filter((l) => l.item.isRetrieval);
  for (const { item, path } of retrieval) {
    const src = item.retrievalSource;
    if (src) {
      if (src.level === level && src.week === week) add('QG-2', `${path}.retrievalSource`, 'retrieval must never draw from the current week');
      else if (!isStrictlyEarlier(src, level, week)) {
        add('QG-2', `${path}.retrievalSource`, `retrieval source ${src.level}${src.week} is not strictly earlier than ${level}${week} (backward-only)`);
      }
    }
  }
  const share = dailyItems.length > 0 ? retrieval.length / dailyItems.length : 0;
  const isCurriculumOrigin = level === 'A' && week === 1;
  if (share > RETRIEVAL_SHARE_MAX + 1e-9) {
    add('QG-2', 'days', `retrieval share ${(share * 100).toFixed(1)}% above ${RETRIEVAL_SHARE_MAX * 100}%`);
  }
  if (share < RETRIEVAL_SHARE_MIN - 1e-9 && !isCurriculumOrigin) {
    add('QG-2', 'days', `retrieval share ${(share * 100).toFixed(1)}% below ${RETRIEVAL_SHARE_MIN * 100}% (only the A·W1 curriculum origin may run without warm-ups)`);
  }
  // Non-retrieval items must not dangle a retrievalSource-style styling as retrieval share.
  for (const { item, path } of dailyItems) {
    if (!item.isRetrieval && item.prompt.startsWith('Warm-up!')) {
      add('QG-2', path, 'item styled as a warm-up must set isRetrieval=true');
    }
  }

  // --- QG-1: duplicate surfaces ---------------------------------------------
  const bySig = new Map<string, Array<{ day: number; path: string; section: string }>>();
  for (const { item, path, day, section } of located) {
    const sig = surfaceSignature(item);
    if (!sig) continue;
    const list = bySig.get(sig) ?? [];
    list.push({ day, path, section });
    bySig.set(sig, list);
  }
  for (const [sig, occ] of bySig) {
    for (let i = 0; i < occ.length; i++) {
      for (let j = i + 1; j < occ.length; j++) {
        const a = occ[i];
        const b = occ[j];
        const bothDaily = a.section === 'daily' && b.section === 'daily';
        const sameForm = a.section !== 'daily' && a.section === b.section;
        if ((bothDaily && Math.abs(a.day - b.day) < 2) || sameForm) {
          add('QG-1', b.path, `duplicate operand surface "${sig}" also at ${a.path} (${sameForm ? 'same mastery form' : '<2 days apart'})`);
        }
      }
    }
  }
  // Same-day commuted reuse among daily items.
  const byCommuted = new Map<string, Array<{ day: number; path: string; exact: string | null }>>();
  for (const { item, path, day, section } of located) {
    if (section !== 'daily') continue;
    const csig = commutedSignature(item);
    if (!csig) continue;
    const list = byCommuted.get(csig) ?? [];
    list.push({ day, path, exact: surfaceSignature(item) });
    byCommuted.set(csig, list);
  }
  for (const [csig, occ] of byCommuted) {
    for (let i = 0; i < occ.length; i++) {
      for (let j = i + 1; j < occ.length; j++) {
        if (occ[i].day === occ[j].day && occ[i].exact !== occ[j].exact) {
          add('QG-1', occ[j].path, `same-day commuted operand reuse "${csig}" also at ${occ[i].path}`);
        }
      }
    }
  }

  // --- QG-4: Form-B isomorph audit ------------------------------------------
  if (mc.formA.length === mc.formB.length) {
    mc.formA.forEach((a, i) => {
      const b = mc.formB[i];
      const p = `masteryCheck.formB[${i}]`;
      if (a.type !== b.type) add('QG-4', p, `type "${b.type}" differs from formA[${i}] "${a.type}" (same isomorph class required)`);
      if (a.difficulty !== b.difficulty) add('QG-4', p, `difficulty ${b.difficulty} differs from formA[${i}] ${a.difficulty}`);
      if (a.generator && b.generator && a.generator.templateId !== b.generator.templateId) {
        add('QG-4', p, `template "${b.generator.templateId}" differs from formA[${i}] "${a.generator.templateId}"`);
      }
      if (a.prompt === b.prompt) add('QG-4', p, 'formB prompt is identical to formA (fresh surface required)');
      const sa = surfaceSignature(a);
      const sb = surfaceSignature(b);
      if (sa && sb && sa === sb) add('QG-4', p, `formB operand surface "${sb}" reuses formA[${i}]`);
    });
  } else {
    add('QG-4', 'masteryCheck', `formA (${mc.formA.length}) and formB (${mc.formB.length}) must pair by index`);
  }

  // --- QG-5: answer + hint audit --------------------------------------------
  const auditHints = (hints: readonly string[], answerValue: string, path: string, prompt: string) => {
    const val = answerValue.trim();
    if (!val) return;
    // Items that display their candidate answers openly in the prompt
    // (compare-the-given-options style) may legitimately reference them in hints.
    const shownInPrompt = prompt.includes(val);
    const eqRe = new RegExp(`=\\s*${escapeRegExp(val)}(?![\\d/])`);
    hints.forEach((h, hi) => {
      const leak =
        h.trim() === val ||
        (!shownInPrompt && (eqRe.test(h) || (val.length >= 3 && h.includes(val))));
      if (leak) add('QG-5', `${path}.hintLadder[${hi}]`, `hint rung contains the item's literal answer ("${val}")`);
    });
  };
  for (const { item, path } of located) {
    auditHints(item.hintLadder, item.answer.value, path, item.prompt);
    // Arithmetic re-check via the template registry.
    if (item.generator) {
      const tpl = getTemplate(item.generator.templateId);
      if (tpl?.answerFor && ['exact-numeric', 'equivalent-numeric', 'equivalent-fraction', 'ordered-list'].includes(item.answer.validation)) {
        let expected: string | null = null;
        try {
          expected = tpl.answerFor(item.generator.params);
        } catch {
          add('QG-5', `${path}.generator`, `template "${item.generator.templateId}" could not recompute the answer from params`);
        }
        if (expected !== null) {
          let ok: boolean;
          if (item.answer.validation === 'ordered-list') {
            const norm = (s: string) => s.split(/[\s,;]+/).filter(Boolean).join(',');
            ok = norm(expected) === norm(item.answer.value);
          } else {
            const ev = numericValue(expected);
            const av = numericValue(item.answer.value);
            ok = ev !== null && av !== null && Math.abs(ev - av) < 1e-9;
          }
          if (!ok) {
            add('QG-5', `${path}.answer.value`, `arithmetic check failed: template "${item.generator.templateId}" computes ${expected}, pack says ${item.answer.value}`);
          }
        }
      }
    }
  }
  // Puzzle hints + structure
  const pz = pack.puzzle;
  if (!CONTENT_ID_RE.test(pz.id) || !pz.id.includes('-PZ-') || !pz.id.startsWith(idPrefix)) {
    add('S-ID', 'puzzle.id', `puzzle id "${pz.id}" must match ${level}${week}-PZ-nn`);
  }
  if (!PUZZLE_TYPES.has(pz.puzzleType)) add('S-SCHEMA', 'puzzle.puzzleType', `invalid puzzleType "${pz.puzzleType}"`);
  if (pz.hintLadder.length < 1 || pz.hintLadder.length > 3) add('QG-5', 'puzzle.hintLadder', 'puzzle hint ladder needs 1-3 rungs');
  auditHints(pz.hintLadder, pz.answer.value, 'puzzle', pz.prompt);
  if (pz.errorTags && (pz.errorTags.length < 1 || pz.errorTags.length > 3 || pz.errorTags.some((t) => !ERROR_TAGS.has(t)))) {
    add('QG-9', 'puzzle.errorTags', 'puzzle errorTags must be 1-3 tags from the closed DD7 enum');
  }

  // --- QG-6: dose model ------------------------------------------------------
  const base = BAND_MINUTES_BASE[pack.identity.band] ?? 1.0;
  days.forEach((day, di) => {
    const minutes =
      DAY_OVERHEAD_MINUTES + day.items.reduce((acc, it) => acc + base + 0.25 * it.difficulty, 0);
    if (minutes < DAILY_DOSE_MIN_MINUTES || minutes > DAILY_DOSE_MAX_MINUTES) {
      add('QG-6', `days[${di}]`, `estimated dose ${minutes.toFixed(1)} min outside ${DAILY_DOSE_MIN_MINUTES}-${DAILY_DOSE_MAX_MINUTES} min`);
    }
  });

  // --- QG-7: sprint legality -------------------------------------------------
  const sprint = pack.fluencySprint;
  if (level === 'A' && sprint !== null) add('QG-7', 'fluencySprint', 'Level A packs must carry fluencySprint = null (DD11)');
  if (sprint) {
    const p = 'fluencySprint';
    if (!CONTENT_ID_RE.test(sprint.id) || !sprint.id.includes('-FS-') || !sprint.id.startsWith(idPrefix)) {
      add('S-ID', `${p}.id`, `sprint id "${sprint.id}" must match ${level}${week}-FS-nn`);
    }
    if (sprint.durationSeconds !== SPRINT_DURATION_SECONDS) add('QG-7', `${p}.durationSeconds`, `sprint duration must be ${SPRINT_DURATION_SECONDS}s`);
    if (sprint.selfReferenced !== true) add('QG-7', `${p}.selfReferenced`, 'sprint must be self-referenced');
    if (sprint.graded !== false) add('QG-7', `${p}.graded`, 'sprint must be ungraded');
    if (sprint.itemCount < 10 || sprint.itemCount > 30) add('QG-7', `${p}.itemCount`, `itemCount ${sprint.itemCount} outside 10-30`);
    if (sprint.scheduledDay < 2 || sprint.scheduledDay > 3) add('QG-7', `${p}.scheduledDay`, `scheduledDay ${sprint.scheduledDay} must be 2 or 3`);
    const src = sprint.sourceWeek;
    const srcOrd = levelOrdinal(src.level);
    const sameLevelTooClose = srcOrd === levelOrdinal(level) && src.week > week - SPRINT_SOURCE_MIN_WEEKS_PRIOR;
    if (srcOrd > levelOrdinal(level) || sameLevelTooClose) {
      add('QG-7', `${p}.sourceWeek`, `sprint source ${src.level}${src.week} must be mastered ≥${SPRINT_SOURCE_MIN_WEEKS_PRIOR} weeks before ${level}${week} (DD11)`);
    }
  }

  // --- Mistake bank + parent seed -------------------------------------------
  if (pack.mistakeBank.length < 3 || pack.mistakeBank.length > 10) {
    add('S-SCHEMA', 'mistakeBank', `needs 3-10 entries, has ${pack.mistakeBank.length}`);
  }
  pack.mistakeBank.forEach((m, i) => {
    if (!ERROR_TAGS.has(m.errorTag)) add('QG-9', `mistakeBank[${i}]`, `invalid errorTag "${m.errorTag}"`);
    if (!m.description || !m.exampleWrongAnswer || !m.distractorRationale || !m.reteachPointer) {
      add('S-SCHEMA', `mistakeBank[${i}]`, 'mistake-bank entry is missing required fields');
    }
  });
  const seed = pack.parentSummarySeed;
  if (seed.improvingCandidates.length < 2) add('S-SCHEMA', 'parentSummarySeed.improvingCandidates', 'needs ≥2 evidence slots (E102)');
  if (seed.strengtheningByTag.length < 2) add('S-SCHEMA', 'parentSummarySeed.strengtheningByTag', 'needs ≥2 growth-area entries (E102)');
  seed.strengtheningByTag.forEach((s, i) => {
    if (!ERROR_TAGS.has(s.errorTag)) add('QG-9', `parentSummarySeed.strengtheningByTag[${i}]`, `invalid errorTag "${s.errorTag}"`);
  });
  if (!seed.homeFocus.praiseLine || !seed.homeFocus.questionForChild) {
    add('S-SCHEMA', 'parentSummarySeed.homeFocus', 'homeFocus requires praiseLine and questionForChild');
  }

  // --- QG-11: embedded-claim / anchor audit (FIX-SPEC §7, fix #6) -----------
  // Blocks for v2 packs; the mismatch, prose-anchor, and pointer checks are
  // designed to never false-fail correct content, so they are safe for v1 +
  // fixtures too. Only the "no-verify-template embedded claim" DETECTOR is
  // v2-gated (v1/fixtures legitimately carry hand-authored error-analysis).
  const isV2 = opts.contract === 'v2';
  const CLAIM_RE = /\b(wrote|got|claims?|says?|answered)\b[^.?!]*?\d/i;
  const REMAINDER_CLAIM_RE = /\b\d+\s*R\s*\d+\b/;
  const numEq = (x: string, y: string): boolean => {
    const a = numericValue(x);
    const b = numericValue(y);
    return a !== null && b !== null && Math.abs(a - b) < 1e-9;
  };
  for (const { item, path } of located) {
    const tpl = item.generator ? getTemplate(item.generator.templateId) : undefined;
    const verify = tpl?.verifyFor;
    if (verify && item.generator) {
      // (a) MISMATCH audit — recompute the truth of an embedded-claim item.
      let truth: { correct: string; wrong?: string } | null = null;
      try {
        truth = verify(item.generator.params);
      } catch {
        add('QG-11', `${path}.generator`, `verify template "${item.generator.templateId}" could not recompute the claim`);
      }
      if (truth) {
        if (item.answer.validation === 'choice-key' && item.choices) {
          const correct = item.choices.find((c) => c.isCorrect);
          if (correct) {
            const ok =
              numEq(correct.text, truth.correct) ||
              correct.text.includes(truth.correct) ||
              (item.answer.acceptableForms ?? []).some((f) => numEq(f, truth!.correct) || f.includes(truth!.correct));
            if (!ok) {
              add('QG-11', `${path}.choices`, `option keyed correct ("${correct.text}") ≠ recomputed truth "${truth.correct}" (D6 class)`);
            }
          }
        } else {
          const forms = [item.answer.value, ...(item.answer.acceptableForms ?? [])];
          const present = forms.some((f) => numEq(f, truth!.correct) || f.includes(truth!.correct));
          if (!present) {
            add('QG-11', `${path}.answer`, `stated answer does not carry the recomputed true value "${truth.correct}"`);
          }
        }
        // Compare with thousands separators stripped: the prompt may legitimately
        // RENDER the value grouped ("$11,198") or as money, while `truth.wrong` is
        // the canonical computed form. The audit is about the VALUE being shown,
        // not about how it is punctuated (P6).
        const stripSep = (t: string) => t.replace(/(\d),(?=\d{3}\b)/g, '$1');
        if (truth.wrong !== undefined && !stripSep(item.prompt).includes(stripSep(truth.wrong))) {
          add('QG-11', `${path}.prompt`, `error-analysis prompt does not show the recomputed misconception value "${truth.wrong}" (D8 class)`);
        }
      }
    } else if (isV2 && (item.answer.validation === 'choice-key' || item.type === 'error-analysis')) {
      // (a-detector) v2: a verify-a-worked-answer item MUST carry a verify template.
      if (CLAIM_RE.test(item.prompt) || REMAINDER_CLAIM_RE.test(item.prompt)) {
        add('QG-11', `${path}.prompt`, 'v2 item embeds a worked-answer claim but has no verify template — use the generated discrimination/erroranalysis primitive');
      }
    }
  }
  // (b) prose anchor audit — conservative binary-integer equations only.
  const scanProse = (text: string, where: string) => {
    for (const hit of scanBinaryIntegerEquations(text)) {
      add('QG-11', where, `anchor equation "${hit.expr}" computes ${hit.computed} — a fabricated/wrong number in narration`);
    }
  };
  pack.explanation.script.forEach((seg, i) => scanProse(seg.say, `explanation.script[${i}]`));
  scanProse(pack.explanation.summary, 'explanation.summary');
  scanProse(pack.explanation.whyBeforeHow, 'explanation.whyBeforeHow');
  pack.guidedExamples.forEach((ge, i) =>
    ge.steps.forEach((s, j) => {
      if (s.teacherSay) scanProse(s.teacherSay, `guidedExamples[${i}].steps[${j}].teacherSay`);
    }),
  );
  scanProse(pack.puzzle.prompt, 'puzzle.prompt');
  // (c) reteach-pointer resolution — only structured tokens must resolve.
  const geIds = new Set(pack.guidedExamples.map((g) => g.id));
  pack.mistakeBank.forEach((mb, i) => {
    const p = mb.reteachPointer ?? '';
    const scriptRef = p.match(/script\[(\d+)\]/);
    if (scriptRef && Number(scriptRef[1]) >= pack.explanation.script.length) {
      add('QG-11', `mistakeBank[${i}].reteachPointer`, `references script[${scriptRef[1]}] but the pack has ${pack.explanation.script.length} script segments`);
    }
    const geRef = p.match(/[A-E]\d+-GE-\d+/);
    if (geRef && !geIds.has(geRef[0])) {
      add('QG-11', `mistakeBank[${i}].reteachPointer`, `references ${geRef[0]} which is not a guided example in this pack`);
    }
  });

  // --- QG-12: SURFACE REALISM (POLISH-PASS-SPEC §P1/P2/P5/P6) --------------
  // The blind spot the two-gate architecture had: both gates measured whether a
  // pack was CORRECT and whether it was DEEP, and neither read it as a reader.
  // Every defect this family catches shipped through 7,877 green assertions and
  // a 23/23 authenticity pass, because in each case the VALUE was right and only
  // the presentation was impossible ("$0.5", "2/4 cup of flour", "1 liters").
  //
  // These are BACKSTOPS. The guarantee is lib/format.ts — templates that can only
  // interpolate through the formatters cannot emit a violation at any seed. A hit
  // here means some template bypassed the formatters; fix the template, not this.
  // Pinned fixtures (A15/B14/D17) are the normative regression set and are
  // hand-authored, so QG-12 runs REPORT-ONLY over them — the same treatment
  // QG-11 gives them (POLISH-PASS-SPEC §0).
  const isPinnedFixture = /^MFM-(A15|B14|D17)$/.test(pack.packId);
  runSurfaceRealismScans(pack, isPinnedFixture ? () => {} : add);

  // --- QG-13: FIGURE TRUTH (B1.0) ------------------------------------------
  // Blocks for every pack including the fixtures: the `figure` field is new, so
  // nothing pre-existing carries one and there is no legacy corpus to grandfather.
  runFigureScans(pack, add);

  return { valid: v.length === 0, violations: v };
}

// ---------------------------------------------------------------------------
// QG-13 — figure truth
// ---------------------------------------------------------------------------

/**
 * A picture is content, and content gets audited. Two checks, mirroring what
 * QG-5 does for answers and QG-11 does for embedded claims:
 *
 *  (a) the figure is internally possible — a mark inside its own number line, a
 *      shaded count that fits its grid, a triangle whose angles sum to 180°;
 *  (b) when the figure DECLARES what it depicts (`asserts`), that quantity is
 *      recomputed from the figure's own params and must equal the item's
 *      canonical answer or one of its generator params.
 *
 * (b) is the whole point of the schema: a figure built from the item's own
 * drawn values cannot contradict its answer, and this proves it rather than
 * trusting it. Note what is NOT covered — a figure with no `asserts` is checked
 * only for possibility, so a picture that shows the wrong CONTEXT (six apples
 * for a story about pears) still passes. That uncovered surface is where the
 * next real bug lives (L30); the style gate reads figures for it.
 */
function runFigureScans(pack: WeeklyConceptPack, add: AddFn): void {
  /** Loose equality: value first, punctuation never. */
  const norm = (s: string) =>
    s.trim().toLowerCase().replace(/[$¢°\s]/g, '').replace(/(\d),(?=\d{3}\b)/g, '$1');
  /**
   * A picture carries no units — a bar model of 40 metres draws 40 — so a
   * unit-bearing answer ("40 m", "24 books") is compared on its numeral. This
   * loosens punctuation and units, never VALUE: a picture showing 30 against an
   * answer of "40 m" still fails, which is the contradiction we are hunting.
   */
  const leadingNumber = (s: string): string | null => {
    const m = /^\s*-?\d+(?:,\d{3})*(?:\.\d+)?(?:\s+\d+\/\d+)?|^\s*-?\d+\/\d+/.exec(s);
    return m ? m[0].trim() : null;
  };
  const eqLoose = (a: string, b: string): boolean => {
    if (norm(a) === norm(b)) return true;
    const x = numericValue(a) ?? numericValue(leadingNumber(a) ?? '');
    const y = numericValue(b) ?? numericValue(leadingNumber(b) ?? '');
    return x !== null && y !== null && Math.abs(x - y) < 1e-9;
  };

  const audit = (
    figure: BBFigure | undefined,
    path: string,
    targets: { answer?: string[]; params?: Record<string, unknown> } | null,
  ) => {
    if (!figure) return;
    for (const problem of checkFigureShape(figure)) add('QG-13', `${path}.figure`, problem);
    const asserts = figure.asserts;
    if (!asserts) return;
    if (!targets) {
      add('QG-13', `${path}.figure.asserts`, 'this surface has no answer or params to assert against — drop the assertion');
      return;
    }
    const forms = figureValue(figure);
    if (!forms || forms.length === 0) {
      add('QG-13', `${path}.figure.asserts`, `selector "${asserts.of ?? '(default)'}" names no quantity a ${figure.type} can compute`);
      return;
    }
    let expected: string[];
    if (asserts.equals === 'answer') {
      expected = targets.answer ?? [];
      if (expected.length === 0) {
        add('QG-13', `${path}.figure.asserts`, 'asserts "answer" but this surface carries no answer');
        return;
      }
    } else {
      const key = asserts.equals.slice('param:'.length);
      const raw = targets.params?.[key];
      if (raw === undefined) {
        add('QG-13', `${path}.figure.asserts`, `asserts param "${key}" which the item's generator.params does not carry`);
        return;
      }
      expected = [String(raw)];
    }
    if (!forms.some((f) => expected.some((e) => eqLoose(f, e)))) {
      add(
        'QG-13',
        `${path}.figure`,
        `the picture shows ${asserts.of ?? 'its default quantity'} = "${forms[0]}" but the item's ${asserts.equals} is "${expected[0]}" — the figure contradicts the item`,
      );
    }
  };

  const itemTargets = (item: PackItem) => ({
    answer: [item.answer.value, ...(item.answer.acceptableForms ?? [])],
    params: item.generator?.params,
  });

  const allItems: Array<{ item: PackItem; path: string }> = [
    ...pack.days.flatMap((d, di) => d.items.map((item, i) => ({ item, path: `days[${di}].items[${i}]` }))),
    ...pack.masteryCheck.formA.map((item, i) => ({ item, path: `masteryCheck.formA[${i}]` })),
    ...pack.masteryCheck.formB.map((item, i) => ({ item, path: `masteryCheck.formB[${i}]` })),
  ];
  for (const { item, path } of allItems) audit(item.figure, path, itemTargets(item));

  audit(pack.puzzle.figure, 'puzzle', {
    answer: [pack.puzzle.answer.value, ...(pack.puzzle.answer.acceptableForms ?? [])],
  });

  pack.explanation.script.forEach((seg, i) => audit(seg.figure, `explanation.script[${i}]`, null));

  pack.guidedExamples.forEach((g, i) => {
    audit(g.figure, `guidedExamples[${i}]`, { answer: [g.answer] });
    g.steps.forEach((st, j) => {
      audit(st.figure, `guidedExamples[${i}].steps[${j}]`, st.expected ? { answer: [st.expected] } : null);
    });
  });
}

// ---------------------------------------------------------------------------
// QG-12 — surface realism
// ---------------------------------------------------------------------------

/** Money written to one decimal ("$0.5") or finer than a cent. */
const MONEY_1DP = /\$\d+\.\d(?!\d)/;
const MONEY_TOO_FINE = /\$\d+\.\d{3,}/;
/** The sign already says "of a dollar"; the two together are always wrong. */
const MONEY_OF_DOLLAR = /\$[\d.]+\s+of a dollar/i;
/** Every money amount in a text, with the word that follows it. */
const MONEY_AMOUNT_G = /\$(\d+)(?:\.(\d+))?\s*(\w+)?/g;
/** A bare $N naming a DENOMINATION is an object, not an amount — exempt from all-or-none. */
const DENOMINATION_WORD = /^(bill|note|coin|coins|notes|bills)$/i;

/** A count of exactly one against a plural unit ("1 liters"). */
const ONE_PLURAL_G = /(?<![\d.])(?<!than )(?<!the )(?<![\d/],\s)\b1 ([a-z]{4,}(?:s|es))\b/g;
/** Verbs and comparatives that merely look plural after a bare numeral. */
const NOT_A_PLURAL_NOUN = new Set([
  'times', 'makes', 'takes', 'gives', 'means', 'stays', 'leaves', 'shares', 'moves',
  'sits', 'goes', 'shows', 'turns', 'always', 'across', 'plus', 'less', 'sixths',
  'fifths', 'fourths', 'thirds', 'tenths', 'halves', 'eighths', 'ninths', 'sevenths',
  'twelfths', 'hundredths', 'thousandths',
]);
/** "a" before a numeral whose spoken form begins with a vowel ("a 8 cm strip"). */
const ARTICLE_VOWEL = /\ba (8|11|18|8\d|8\d{2,}|11\d{2,}|18\d{2,})\b/;

/**
 * Article agreement before a WORD, not just a numeral.
 *
 * The numeral arm above has been here since B0; the word arm had not, so
 * "a obstacle course" shipped past it — found by an author reading their own
 * week, not by any gate. English keys the article to the SOUND, so both
 * exception classes are carved out explicitly rather than approximated:
 *   - vowel-LETTER, consonant-sound: "a university", "a uniform", "a one-way
 *     street", "a euro", "a ewe" — the /juː/ and /wʌ/ onsets;
 *   - consonant-LETTER, vowel-sound: "an hour", "an honest answer", "an heir".
 * Anything outside those is decidable from the first letter.
 */
// CASE MATTERS. A lowercase "a" mid-sentence is an article; a capital "A" is
// only an article at a sentence start, and elsewhere it is a LABEL — "Class A
// and Class B", "Row A is longer". Matching case-insensitively flagged those as
// article errors, which is how a gate starts crying wolf.
const A_BEFORE_VOWEL_WORD = /\ba ([aeiou][a-z]{2,})\b/;
const A_SENTENCE_INITIAL = /(?:^|[.!?]\s+|\]\s*)A ([aeiou][a-z]{2,})\b/;
const AN_BEFORE_CONSONANT_WORD = /\ban ([b-df-hj-np-tv-z][a-z]{2,})\b/;
const AN_SENTENCE_INITIAL = /(?:^|[.!?]\s+|\]\s*)An ([b-df-hj-np-tv-z][a-z]{2,})\b/;
/** Vowel-letter words that begin with a consonant SOUND — "a", not "an". */
const CONSONANT_SOUND_VOWEL_WORD =
  /^(uni|use|usu|ufo|euro|eul|eur|ewe|one|once|utens|ukul|urin|usa)/i;
/** Consonant-letter words that begin with a vowel SOUND — "an", not "a". */
const VOWEL_SOUND_CONSONANT_WORD = /^(hour|honest|honou?r|heir)/i;
/** A naive `.slice(0,-1)` singular that produced "Each buse holds 6". */
const BROKEN_SINGULAR = /\b(buse|boxe|dishe|batche|benche|inche|glasse|watche|brushe)\b/i;
/** A bare 5+ digit integer in child-facing prose (grouped form expected at C+). */
const BIG_BARE_INT = /(?<![\d,.])\d{5,}(?![\d,.])/;

/**
 * Templates where an unreduced fraction is the LESSON OBJECT — the thing being
 * renamed, compared or converted. A blanket "always reduce" rule would destroy
 * the lesson in exactly these weeks, which is why the rule is role-sensitive and
 * keyed on the TEMPLATE (a reliable, structural signal) rather than on prose.
 */
const FRACTION_ROLE_PRESERVING =
  /frac_equiv|frac_compare|verify_frac|frac_like|frac_to_dec|dec_to_frac|frac_times_whole|verify_binop_misconception/;
/** Prose that physically instantiates the denominator makes the unreduced form honest. */
const PARTITION_STATED =
  /halves|thirds|quarters|fifths|sixths|sevenths|eighths|ninths|tenths|twelfths|sixteenths|twentieths|hundredths|(?:cut|split|marked|divided|re-?striped|re-?labell?ed)\s+(?:out\s+)?(?:in|into|with)\s+\d+\s+equal|\d+\s+equal\s+(?:parts|legs|steps|slices|panels|pieces)/i;
/** Rename / compare / convert asks, where the unreduced operand IS the question. */
const RENAME_OR_COMPARE = /which is greater|which move|rename|equal to|simplest form|as a decimal|which fraction/i;

const FRACTION_G = /(?<![\d/])(\d+)\/(\d+)(?![\d/])/g;

function gcdInt(a: number, b: number): number {
  return b === 0 ? a : gcdInt(b, a % b);
}

type AddFn = (gate: string, path: string, message: string) => void;

/** Every child- or parent-reachable string in the pack, with its path. */
type SurfaceKind = 'prose' | 'answer';

function collectSurfaces(pack: WeeklyConceptPack): Array<{ path: string; text: string; kind: SurfaceKind }> {
  const out: Array<{ path: string; text: string; kind: SurfaceKind }> = [];
  const push = (path: string, text?: string, kind: SurfaceKind = 'prose') => {
    if (typeof text === 'string' && text.length) out.push({ path, text, kind });
  };
  push('explanation.hook', pack.explanation.hook);
  push('explanation.whyBeforeHow', pack.explanation.whyBeforeHow);
  push('explanation.summary', pack.explanation.summary);
  pack.explanation.script.forEach((s, i) => {
    push(`explanation.script[${i}].say`, s.say);
    push(`explanation.script[${i}].visual`, s.visual);
  });
  pack.explanation.vocabulary.forEach((t, i) => push(`explanation.vocabulary[${i}].kidGloss`, t.kidGloss));
  pack.guidedExamples.forEach((g, i) => {
    push(`guidedExamples[${i}].prompt`, g.prompt);
    push(`guidedExamples[${i}].answer`, String(g.answer), 'answer');
    g.steps.forEach((s, j) => {
      push(`guidedExamples[${i}].steps[${j}].teacherSay`, s.teacherSay);
      push(`guidedExamples[${i}].steps[${j}].childDo`, s.childDo);
    });
  });
  const pushItem = (it: PackItem, base: string) => {
    push(`${base}.prompt`, it.prompt);
    push(`${base}.answer.value`, it.answer.value, 'answer');
    it.answer.acceptableForms.forEach((f, k) => push(`${base}.answer.acceptableForms[${k}]`, f, 'answer'));
    it.hintLadder.forEach((h, k) => push(`${base}.hintLadder[${k}]`, h));
    it.choices?.forEach((c, k) => {
      push(`${base}.choices[${k}].text`, c.text);
      push(`${base}.choices[${k}].rationale`, c.rationale);
    });
  };
  pack.days.forEach((d, di) => d.items.forEach((it, ii) => pushItem(it, `days[${di}].items[${ii}]`)));
  pack.masteryCheck.formA.forEach((it, i) => pushItem(it, `masteryCheck.formA[${i}]`));
  pack.masteryCheck.formB.forEach((it, i) => pushItem(it, `masteryCheck.formB[${i}]`));
  push('puzzle.prompt', pack.puzzle.prompt);
  push('puzzle.answer.value', pack.puzzle.answer.value, 'answer');
  pack.puzzle.hintLadder.forEach((h, i) => push(`puzzle.hintLadder[${i}]`, h));
  pack.mistakeBank.forEach((m, i) => {
    push(`mistakeBank[${i}].description`, m.description);
    push(`mistakeBank[${i}].exampleWrongAnswer`, m.exampleWrongAnswer);
  });
  const ps = pack.parentSummarySeed;
  push('parentSummarySeed.whatWeWorkedOn', ps.whatWeWorkedOn);
  push('parentSummarySeed.homeFocus.praiseLine', ps.homeFocus.praiseLine);
  push('parentSummarySeed.homeFocus.questionForChild', ps.homeFocus.questionForChild);
  return out;
}

function runSurfaceRealismScans(pack: WeeklyConceptPack, add: AddFn): void {
  const band = pack.identity.level;
  for (const { path, text, kind } of collectSurfaces(pack)) {
    // --- QG-12a — currency rendering ---------------------------------------
    if (MONEY_1DP.test(text)) {
      add('QG-12a', path, `money written to one decimal — currency always renders 2 places: "${text.slice(0, 90)}"`);
    }
    if (MONEY_TOO_FINE.test(text)) {
      add('QG-12a', path, `money written finer than a cent: "${text.slice(0, 90)}"`);
    }
    if (MONEY_OF_DOLLAR.test(text)) {
      add('QG-12a', path, `"$x of a dollar" — the sign and the phrase are mutually exclusive: "${text.slice(0, 90)}"`);
    }
    // All-or-none cents within one string (denominations exempt).
    let hasCents = false;
    let bareAmount: string | null = null;
    for (const m of text.matchAll(MONEY_AMOUNT_G)) {
      if (m[2]) hasCents = true;
      else if (!DENOMINATION_WORD.test(m[3] ?? '')) bareAmount = m[0];
    }
    if (hasCents && bareAmount) {
      add('QG-12a', path, `mixes an amount with cents and a bare-dollar amount ("${bareAmount.trim()}") — render all money the same way: "${text.slice(0, 90)}"`);
    }

    // --- QG-12c — number/noun and article agreement ------------------------
    for (const m of text.matchAll(ONE_PLURAL_G)) {
      if (!NOT_A_PLURAL_NOUN.has(m[1])) {
        add('QG-12c', path, `"1 ${m[1]}" — a count of one takes a singular noun: "${text.slice(0, 90)}"`);
      }
    }
    if (ARTICLE_VOWEL.test(text)) {
      add('QG-12c', path, `"a" before a vowel-sound numeral (an 8 / an 11 / an 18): "${text.slice(0, 90)}"`);
    }
    const aWord = A_BEFORE_VOWEL_WORD.exec(text) ?? A_SENTENCE_INITIAL.exec(text);
    if (aWord && !CONSONANT_SOUND_VOWEL_WORD.test(aWord[1])) {
      add('QG-12c', path, `"a ${aWord[1]}" — a vowel-sound word takes "an": "${text.slice(0, 90)}"`);
    }
    const anWord = AN_BEFORE_CONSONANT_WORD.exec(text) ?? AN_SENTENCE_INITIAL.exec(text);
    if (anWord && !VOWEL_SOUND_CONSONANT_WORD.test(anWord[1])) {
      add('QG-12c', path, `"an ${anWord[1]}" — a consonant-sound word takes "a": "${text.slice(0, 90)}"`);
    }
    if (BROKEN_SINGULAR.test(text)) {
      add('QG-12c', path, `broken singular from a naive plural strip — use unitFor(): "${text.slice(0, 90)}"`);
    }

    // --- QG-12d — large-number grouping (C+ bands) -------------------------
    // Report-only while lib/format.ts GROUP_LARGE_NUMBERS is false (P6 ordering).
    // PROSE only. `answer.value` stays the canonical computed form (QG-5
    // re-derives it) and acceptableForms are accepted INPUT — grouping those
    // would break the arithmetic audit for a display concern the UI owns.
    if (GROUP_LARGE_NUMBERS && kind === 'prose' && band >= 'C' && BIG_BARE_INT.test(text)) {
      add('QG-12d', path, `bare 5-digit number in child-facing prose — group it: "${text.slice(0, 90)}"`);
    }
  }

  // --- QG-12b — context-sensitive fraction simplification ------------------
  // Applies ONLY to fractions asserted as real-world QUANTITIES. Preserved where
  // the fraction is the lesson object (rename/compare/convert) or where the prose
  // states the partition it measures in — there the unreduced form is the honest
  // name for that mark, and reducing would destroy the lesson.
  const items: Array<{ it: PackItem; path: string }> = [];
  pack.days.forEach((d, di) => d.items.forEach((it, ii) => items.push({ it, path: `days[${di}].items[${ii}]` })));
  pack.masteryCheck.formA.forEach((it, i) => items.push({ it, path: `masteryCheck.formA[${i}]` }));
  pack.masteryCheck.formB.forEach((it, i) => items.push({ it, path: `masteryCheck.formB[${i}]` }));
  for (const { it, path } of items) {
    if (it.type !== 'word-problem') continue;                       // bare arithmetic has no context to be unrealistic about
    if (FRACTION_ROLE_PRESERVING.test(it.generator?.templateId ?? '')) continue;
    if (RENAME_OR_COMPARE.test(it.prompt) || PARTITION_STATED.test(it.prompt)) continue;
    for (const m of it.prompt.matchAll(FRACTION_G)) {
      const n = Number(m[1]);
      const d = Number(m[2]);
      if (d > 1 && n < d && gcdInt(n, d) > 1) {
        add('QG-12b', `${path}.prompt`, `unreduced fraction ${m[0]} stated as a real-world quantity — a recipe says 1/2 cup, never 2/4: "${it.prompt.slice(0, 90)}"`);
      }
    }
  }
}
