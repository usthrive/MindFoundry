/**
 * SprintRun (Flow 5, DD11/P11) — the 2-minute self-referenced sprint: a
 * metronome, not a judge. One item at a time; a soft filling-arc time
 * indicator (no ticking, no countdown numerals, no red endgame); wrong
 * answers simply advance (no mid-sprint correction — flow protected); a calm
 * "done for now" early exit is always visible. Interruption (unmount before
 * finish) discards the sprint silently — it never counts against the ≤2/week
 * budget. Timer "sings" → everything simply stops → SprintFinish.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { realizeSprintItems } from '../generator/sprintItems';
import { SPRINT_DURATION_SECONDS } from '../constants';
import { useFoundrySession } from '../session/FoundrySession';
import AnswerEntry from '../components/AnswerEntry';
import type { PackItem } from '../types';

export default function SprintRun() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, enrollment, weekState, pack, band } = useFoundrySession();
  const day = Number((location.state as { day?: number } | null)?.day ?? NaN);

  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const results = useRef<Array<{ id: string; answer: string; correct: boolean }>>([]);
  const finished = useRef(false);

  const items = useMemo(() => (pack?.fluencySprint ? realizeSprintItems(pack.fluencySprint) : []), [pack]);

  // Soft timer: state ticks twice a second for the filling arc only.
  useEffect(() => {
    const started = Date.now();
    const t = window.setInterval(() => {
      setElapsed((Date.now() - started) / 1000);
    }, 500);
    return () => window.clearInterval(t);
  }, []);

  const done = elapsed >= SPRINT_DURATION_SECONDS || (items.length > 0 && idx >= items.length);

  useEffect(() => {
    if (!done || finished.current) return;
    finished.current = true;
    navigate('/foundry/sprint/finish', {
      replace: true,
      state: { day, results: results.current, early: false },
    });
  }, [done, navigate, day]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack || !pack.fluencySprint || items.length === 0) {
    return <Navigate to="/foundry" replace />;
  }

  const item = items[Math.min(idx, items.length - 1)];
  const arc = Math.min(1, elapsed / SPRINT_DURATION_SECONDS);

  // AnswerEntry wants a PackItem; sprint items are plain numeric prompts.
  const asItem: PackItem = {
    id: item.id,
    type: 'fluency',
    prompt: item.prompt,
    answer: { value: item.answer, acceptableForms: [], validation: 'exact-numeric' },
    difficulty: 2,
    strand: 'computational',
    isRetrieval: false,
    hintLadder: [], // no hints mid-sprint — flow protected
    errorTags: ['fact-recall'],
  };

  function submit(answer: string) {
    if (finished.current) return;
    const correct = answer.trim() === item.answer;
    results.current.push({ id: item.id, answer, correct });
    setIdx((i) => i + 1); // wrong answers simply advance — no correction here
  }

  function earlyExit() {
    if (finished.current) return;
    finished.current = true;
    navigate('/foundry/sprint/finish', {
      replace: true,
      state: { day, results: results.current, early: true },
    });
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      {/* Soft filling arc — no numerals, no ticking, no red endgame (P11). */}
      <div aria-hidden="true" className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-secondary/60 transition-[width] duration-500 ease-linear"
          style={{ width: `${arc * 100}%` }}
        />
      </div>

      <section aria-label="The fact" className="rounded-3xl bg-surface p-8 text-center shadow-sm">
        <p className="text-3xl font-bold text-text-primary">{item.prompt}</p>
      </section>

      <AnswerEntry item={asItem} band={band} onSubmit={submit} />

      <div className="mt-auto">
        <button
          type="button"
          onClick={earlyExit}
          className="min-h-[48px] w-full rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        >
          Done for now
        </button>
      </div>
    </div>
  );
}
