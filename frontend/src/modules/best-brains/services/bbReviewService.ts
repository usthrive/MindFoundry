/**
 * bbReviewService — the client half of "Ms. Wren reads the explanation"
 * (owner ruling 2026-09-22, option (a): grade and coach).
 *
 * WHY IT NEVER THROWS. This call sits between a child tapping "Tell Ms. Wren"
 * and the rest of their day. Every other AI path in the app belongs to a
 * parent at a desk who can be shown an error; this one belongs to a six-year-old
 * mid-session, and the only honest failure state for them is the
 * acknowledgement line the screen showed before this feature existed. So every
 * failure — offline, 500, 403, a malformed verdict, the 7-second abort —
 * returns `{ verdict: 'unavailable' }` and the screen carries on exactly as it
 * used to. FORMATIVE ONLY: no verdict here touches a score, a day's accuracy,
 * or the weekly gate.
 *
 * WHY THE FETCH IS COPIED RATHER THAN IMPORTED. `EdgeFunctionAIService`
 * (services/ai/edgeFunctionClient.ts:79-99) throws on every non-200, logs the
 * session at info level, and carries a usage callback for the homework
 * surface — three behaviours this path must not have. Twelve lines of fetch is
 * a smaller thing to keep honest than a subclass that disables most of its
 * parent. The AUTH SHAPE is identical and deliberately so: `Authorization:
 * Bearer <access_token>` plus `apikey`, the shape the function reads.
 */

import { supabase } from '@/lib/supabase';
import type { InteractionBand } from '../copy';
import type { PackItem, WeeklyConceptPack } from '../types';

/**
 * Mirrors `supabase/functions/ai-service/review-prompt.ts`, which is the
 * authority for these shapes. It is re-declared rather than imported because
 * that file lives outside `frontend/src` (tsconfig `include: ["src"]`) and is
 * loaded by Deno with `npm:` specifiers. The eval imports the real one; if the
 * two ever disagree, review-prompt.ts wins and this comment is the pointer.
 */
export interface ReviewVerdict {
  verdict: 'got-it' | 'partly' | 'not-yet';
  /** Ms. Wren's line to the child: at most two sentences, in the band's voice. */
  line: string;
  /** One question — present on partly / not-yet, null on got-it. */
  nudge: string | null;
  /** ≤120 chars, parent-facing. NEVER rendered on a child surface. */
  reason: string;
}

/** What the child's screen actually has to handle. */
export type ReviewOutcome = ReviewVerdict | { verdict: 'unavailable'; reason?: string };

export interface ReviewRecord extends ReviewVerdict {
  packId: string;
  itemId: string;
  day: number | null;
  childText: string;
  createdAt: string;
}

/**
 * TWO READINGS PER ITEM, AND NEVER A THIRD (ruling 2026-09-22).
 *
 * "Try once more" exists because a child who is told one piece is missing
 * should get to go and find it. A third round is a different thing: it is a
 * screen refusing to let go of one item, on a page whose whole law is that no
 * single item decides anything (the move-on rule, TEACHER-PERSONA §4.2). After
 * the second verdict the only button is "On we go".
 */
export const MAX_REVIEWS_PER_ITEM = 2;

/** The screen's own clock — one second past the function's 6 s, so the function's own fallback wins the race when it can. */
const CLIENT_TIMEOUT_MS = 7000;

/** The band A "I did it!" tap and the "I said it out loud" button both produce answers nothing can read. */
export const SAID_ALOUD = 'said-aloud';

/**
 * Is there anything here for Ms. Wren to read?
 *
 * Band A is excluded by the ruling itself (make/show/tell tasks are done away
 * from the screen). `said-aloud` and an empty box are excluded because the
 * telling happened off-screen — sending them would spend a model call to be
 * told there was no text, and the child would be asked to write something they
 * were explicitly offered the choice not to write.
 */
export function shouldReview(item: PackItem, band: InteractionBand, answer: string): boolean {
  if (item.answer.validation !== 'manual-review') return false;
  if (band !== 'B' && band !== 'C') return false;
  if (!answer || !answer.trim()) return false;
  return answer.trim() !== SAID_ALOUD;
}

export interface ReviewRequest {
  childId: string;
  pack: WeeklyConceptPack;
  item: PackItem;
  band: 'B' | 'C';
  day: number | null;
  childText: string;
}

/** The request body: the item's own rubric plus the child's words. No name, ever. */
function buildParams(req: ReviewRequest): Record<string, unknown> {
  return {
    childId: req.childId,
    packId: req.pack.packId,
    itemId: req.item.id,
    day: req.day,
    band: req.band,
    level: req.pack.identity.level,
    conceptName: req.pack.identity.conceptName,
    prompt: req.item.prompt,
    modelAnswer: req.item.answer.value,
    acceptableForms: req.item.answer.acceptableForms ?? [],
    hints: req.item.hintLadder ?? [],
    errorTags: req.item.errorTags ?? [],
    whyBeforeHow: req.pack.explanation?.whyBeforeHow ?? '',
    childText: req.childText.slice(0, 500),
  };
}

function isVerdict(data: unknown): data is ReviewVerdict {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    (d.verdict === 'got-it' || d.verdict === 'partly' || d.verdict === 'not-yet') &&
    typeof d.line === 'string' &&
    d.line.trim().length > 0
  );
}

/** Send the child's explanation to be read. Never throws; never blocks the day. */
export async function reviewExplanation(req: ReviewRequest): Promise<ReviewOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return { verdict: 'unavailable' };

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-service`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ operation: 'reviewExplanation', params: buildParams(req) }),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error('[bb] explanation review failed', response.status);
      return { verdict: 'unavailable' };
    }
    const data: unknown = await response.json();
    if (isVerdict(data)) return data;
    // The function's own `{verdict:'unavailable'}` lands here too, as it should.
    return { verdict: 'unavailable' };
  } catch (e) {
    console.error('[bb] explanation review unavailable', e);
    return { verdict: 'unavailable' };
  } finally {
    clearTimeout(timer);
  }
}

interface ReviewRow {
  pack_id: string;
  item_id: string;
  day: number | null;
  child_text: string | null;
  verdict: ReviewVerdict['verdict'];
  line: string;
  nudge: string | null;
  reason: string | null;
  created_at: string;
}

const REVIEW_COLS = 'pack_id, item_id, day, child_text, verdict, line, nudge, reason, created_at';

/**
 * One week's readings for the parent report, oldest first (the order the child
 * met them). RLS-scoped: the select returns nothing for a child that is not
 * the caller's, so the screen needs no ownership check of its own.
 */
export async function listExplanationReviews(childId: string, packId: string): Promise<ReviewRecord[]> {
  if (!childId || !packId) return [];
  const { data, error } = await supabase
    .from('bb_explanation_reviews')
    .select(REVIEW_COLS)
    .eq('child_id', childId)
    .eq('pack_id', packId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('[bb] explanation review list failed', error.message);
    return [];
  }
  return (data as ReviewRow[]).map((r) => ({
    packId: r.pack_id,
    itemId: r.item_id,
    day: r.day,
    childText: r.child_text ?? '',
    verdict: r.verdict,
    line: r.line,
    nudge: r.nudge,
    reason: r.reason ?? '',
    createdAt: r.created_at,
  }));
}
