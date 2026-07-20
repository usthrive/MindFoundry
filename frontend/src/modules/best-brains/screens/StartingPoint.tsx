/**
 * StartingPoint (Flow 1) — the placement reveal: a celebration of strengths,
 * never a rank. Level shown as a neutral letter only (DD2 — never a grade);
 * writes bb_enrollment on continue (the walk's single persistence moment).
 * Quiet, no confetti (P5).
 */

import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BB_LEVEL_DISPLAY_NAMES } from '../constants';
import { MODULE_COPY, bandForLevel } from '../copy';
import { enroll } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import type { PlacementResult } from '../types';

export default function StartingPoint() {
  const location = useLocation();
  const navigate = useNavigate();
  const { childId, childName, refreshEnrollment } = useFoundrySession();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const result = (location.state as { result?: PlacementResult } | null)?.result;
  if (!result) return <Navigate to="/foundry/placement/welcome" replace />;

  const band = bandForLevel(result.placedLevel);

  async function handleContinue() {
    if (!result || saving) return;
    setSaving(true);
    setError(false);
    try {
      await enroll(childId, result);
      await refreshEnrollment();
      navigate('/foundry/map', { replace: true });
    } catch (e) {
      console.error('[bb] enrollment failed', e);
      setError(true);
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <WrenBubble band={band} autoplay text={MODULE_COPY.startingPoint[band]} emotion="warm" />

      <section aria-label="Your strengths" className="rounded-3xl bg-surface p-6 shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">
          {childName} already knows
        </p>
        <ul className="space-y-2">
          {result.strengths.map((s) => (
            <li key={s} className="flex items-start gap-2 text-lg text-text-primary">
              <span aria-hidden="true" className="mt-1 text-secondary">
                ●
              </span>
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* Neutral level letter — never a grade (DD2). */}
      <section aria-label="Your starting point" className="rounded-3xl bg-secondary-light p-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-text-secondary">Your trail starts at</p>
        <p className="mt-1 text-4xl font-bold text-secondary-700">
          {BB_LEVEL_DISPLAY_NAMES[result.placedLevel]}
        </p>
      </section>

      {error && (
        <p className="text-center text-text-secondary">
          Ms. Wren couldn't save that just now — one more tap should do it.
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleContinue()}
        disabled={saving}
        className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg transition-all hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 touch-manipulation"
      >
        {saving ? 'Pinning your spot…' : 'See my journey'}
      </button>
    </div>
  );
}
