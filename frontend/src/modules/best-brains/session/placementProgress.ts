/**
 * Saving and resuming the placement walk, in Supabase.
 *
 * The placement can run to twenty-five items across five level clusters, and it
 * held ALL of its state in React state with nothing persisted — so a closed tab,
 * a flat battery or an accidental back-swipe threw everything away and the child
 * began again at item one. That is the worst thing to lose: a placement is the one
 * activity a child has no reason to enjoy repeating, and a second run's answers
 * are contaminated by the first anyway.
 *
 * THE SEED IS PART OF THE PROGRESS. `PlacementActivity` draws `walkSeed` from
 * `Math.random()` into a ref, and `generatePack` is pure in that seed, so
 * re-mounting without it would regenerate a DIFFERENT set of items — the child
 * would resume into an assessment they never started. Persisting the seed makes
 * the resumed walk identical to the abandoned one, item for item.
 *
 * WHY ITS OWN TABLE. The walk runs BEFORE enrolment — choosing the level is its
 * output — so there is no `bb_week_state` row to hang it from. `bb_placement_progress`
 * is one row per child, replaced as the walk advances and deleted once the child
 * is placed, under the same parent-owns-child RLS rule as every other bb_ table.
 *
 * LOCALSTORAGE IS A FALLBACK, NOT THE STORE. Supabase is the source of truth, so
 * a walk started on the tablet resumes on the laptop. But a child mid-placement on
 * a dropped connection must not lose their place either, so every save also writes
 * a local mirror, and the load falls back to it when the network read fails. The
 * mirror is cleared alongside the row.
 */

import { supabase } from '@/lib/supabase';
import type { BBLevel, PlacementClusterResult } from '../types';

/** Bump when the shape below changes, so a stale entry is discarded not misread. */
const SCHEMA = 2;
const MIRROR_PREFIX = 'bb-placement-progress';

/**
 * How long a half-finished placement is worth resuming.
 *
 * Long enough for "he got tired, we came back at the weekend", short enough that a
 * walk abandoned a fortnight ago — by a child who has since moved on — is not
 * offered back as though it were current.
 */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface PlacementWalk {
  /** The pack seed, so resumed items are the SAME items (see the note above). */
  walkSeed: number;
  level: BBLevel;
  visited: BBLevel[];
  clusters: PlacementClusterResult[];
  itemIdx: number;
  clusterCorrect: number;
  totalServed: number;
}

interface StoredWalk extends PlacementWalk {
  schema: number;
  savedAt: number;
}

const mirrorKey = (childId: string) => `${MIRROR_PREFIX}:${childId}`;

function readMirror(childId: string): StoredWalk | null {
  try {
    const raw = window.localStorage.getItem(mirrorKey(childId));
    return raw ? (JSON.parse(raw) as StoredWalk) : null;
  } catch {
    return null;
  }
}

function writeMirror(childId: string, walk: StoredWalk): void {
  try {
    window.localStorage.setItem(mirrorKey(childId), JSON.stringify(walk));
  } catch {
    /* private browsing or a full quota — Supabase still has it */
  }
}

function clearMirror(childId: string): void {
  try {
    window.localStorage.removeItem(mirrorKey(childId));
  } catch {
    /* nothing to do */
  }
}

/** Every field must be present: a partial entry resumes into a broken walk. */
function usable(w: Partial<StoredWalk> | null): w is StoredWalk {
  if (!w) return false;
  if (w.schema !== SCHEMA) return false;
  if (typeof w.savedAt !== 'number' || Date.now() - w.savedAt > MAX_AGE_MS) return false;
  return (
    typeof w.walkSeed === 'number' &&
    typeof w.level === 'string' &&
    Array.isArray(w.visited) &&
    Array.isArray(w.clusters) &&
    typeof w.itemIdx === 'number' &&
    typeof w.clusterCorrect === 'number' &&
    typeof w.totalServed === 'number'
  );
}

/**
 * Persist the walk. Never throws and never awaited by the UI: a slow network must
 * not sit between a child and the next question.
 */
export function savePlacementProgress(childId: string, walk: PlacementWalk): void {
  if (!childId) return;
  const stored: StoredWalk = { ...walk, schema: SCHEMA, savedAt: Date.now() };
  writeMirror(childId, stored);
  void supabase
    .from('bb_placement_progress')
    .upsert({ child_id: childId, progress: stored, updated_at: new Date().toISOString() }, { onConflict: 'child_id' })
    .then(({ error }) => {
      if (error) console.warn('[bb] placement progress not saved remotely:', error.message);
    });
}

/** The saved walk, or null when there is nothing usable to resume. */
export async function loadPlacementProgress(childId: string): Promise<PlacementWalk | null> {
  if (!childId) return null;
  try {
    const { data, error } = await supabase
      .from('bb_placement_progress')
      .select('progress')
      .eq('child_id', childId)
      .maybeSingle();
    if (!error && data?.progress) {
      const remote = data.progress as Partial<StoredWalk>;
      if (usable(remote)) return remote;
      return null; // a stale or malformed row is not silently replaced by the mirror
    }
  } catch {
    /* fall through to the mirror */
  }
  const local = readMirror(childId);
  return usable(local) ? local : null;
}

export async function clearPlacementProgress(childId: string): Promise<void> {
  if (!childId) return;
  clearMirror(childId);
  try {
    await supabase.from('bb_placement_progress').delete().eq('child_id', childId);
  } catch {
    /* the row expires from the resume offer on its own after MAX_AGE_MS */
  }
}

/**
 * How many items a resumed walk has already answered — for "you have already done
 * seven", which is the sentence that makes carrying on feel worth it.
 */
export const answeredSoFar = (w: PlacementWalk): number => w.totalServed;
