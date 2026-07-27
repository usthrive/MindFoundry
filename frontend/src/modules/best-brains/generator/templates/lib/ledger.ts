/**
 * Prior-week concept LEDGER (CONTENT-GENERATOR-FIX-SPEC §8, recommended fix #9).
 *
 * The Best Brains authenticity gate's BB-G1 (newness/deepening) and BB-G8
 * (skill-instance backward retrieval) can only be adjudicated against the list
 * of concepts a learner has ALREADY seen. Without it, the gate must route to
 * human review and can never auto-pass. This module derives that list from the
 * frozen concept catalog (content/catalog.ts) so it is a deterministic,
 * always-available generator input — never hand-maintained.
 *
 * `priorLedger(level, week)` returns every strictly-earlier curriculum cell with
 * the fields the gate needs: conceptId + names + band + the computational and
 * non-computational focus columns (our best available "representation" proxy).
 * `sharesConceptFamily` powers the §6.9 deepening-delta precondition: when a
 * week deepens a prior concept rather than introducing a new one, the blueprint
 * must document the explicit advance (larger magnitude / harder subtype / new
 * representation), which the gate reads as the BB-G1 delta.
 */

import type { BBBand, BBLevel } from '../../../types';
import { BB_LEVELS } from '../../../constants';
import { CONCEPT_CATALOG } from '../../../content/catalog';

export interface LedgerEntry {
  level: BBLevel;
  /** 1–24 */
  week: number;
  conceptId: string;
  conceptName: string;
  band: BBBand;
  /** CURRICULUM-MAP column 3 — the taught computational skill (representation proxy). */
  computationalFocus: string;
  /** CURRICULUM-MAP column 4 — the Day-5 non-computational focus (representation proxy). */
  noncomputationalFocus: string;
}

function levelOrdinal(level: BBLevel): number {
  return BB_LEVELS.indexOf(level);
}

/** True when `src` is a strictly-earlier cell than `(level, week)` in ladder order. */
export function isStrictlyEarlier(
  src: { level: BBLevel; week: number },
  level: BBLevel,
  week: number,
): boolean {
  const so = levelOrdinal(src.level);
  const po = levelOrdinal(level);
  return so < po || (so === po && src.week < week);
}

/**
 * Every strictly-earlier curriculum cell, in ladder order — the prior-week
 * concept ledger for the target `(level, week)`. Pure function of the catalog.
 */
export function priorLedger(level: BBLevel, week: number): LedgerEntry[] {
  return CONCEPT_CATALOG.filter((c) => isStrictlyEarlier(c, level, week)).map((c) => ({
    level: c.level,
    week: c.week,
    conceptId: c.conceptId,
    conceptName: c.conceptName,
    band: c.band,
    computationalFocus: c.computationalFocus,
    noncomputationalFocus: c.noncomputationalFocus,
  }));
}

/**
 * Concept "family" key for the BB-G1 same-concept detection: the conceptId with
 * its trailing magnitude/qualifier tokens stripped, so e.g.
 * `frac-addsub-like-denominators` and `frac-addsub-unlike-denominators` share
 * the family `frac-addsub`, and `place-value-to-1000` / `place-value-to-1000000`
 * share `place-value`. A shared family across weeks is legal PACING (not a
 * violation) — but it obliges the deepening week to state its delta (§6.9).
 */
export function conceptFamily(conceptId: string): string {
  return conceptId
    // drop trailing magnitude ranges: -to-1000, -1-5, -6-10, -11-20, -within-10, -within-100…
    .replace(/-(to|within)-[0-9x]+$/i, '')
    .replace(/-[0-9]+(-[0-9]+)?$/i, '')
    // drop denominator/representation qualifiers that mark a deepening, not a new family
    .replace(/-(like|unlike)-denominators$/i, '')
    .replace(/-(q1|q[1-4])$/i, '');
}

/**
 * The strictly-earlier ledger entries whose concept shares a family with
 * `conceptId`. Non-empty → the target week is a DEEPENING and its blueprint must
 * carry a `deepeningDelta` (enforced by the v2 preflight, §6.9).
 */
export function priorSameFamily(level: BBLevel, week: number, conceptId: string): LedgerEntry[] {
  const fam = conceptFamily(conceptId);
  return priorLedger(level, week).filter((e) => conceptFamily(e.conceptId) === fam);
}
