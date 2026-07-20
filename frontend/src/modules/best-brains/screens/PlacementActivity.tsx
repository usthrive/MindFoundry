/**
 * PlacementActivity (Flow 1, DD5) — the adaptive placement walk.
 *
 * Clusters of 5 exit-skill items drawn from the entry-week pack of each level
 * (generator templates at level-week 1). ≥80% steps up, <50% steps down, else
 * the walk places here. Every answer gets the identical warm-neutral
 * acknowledgment ("Got it!") — never right/wrong (DD5 never-a-test law).
 * Soft pause offer every ~8 items. No AnchorPanel (nothing taught yet).
 *
 * Increment-3 coverage note: the ladder spans levels A–C (the cells with
 * entry-week content); D/E join when their week-1 packs land. Mid-level entry
 * (front-block mastery → week 13) is deferred with them — entryWeek is 1.
 */

import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePack } from '../generator/packGenerator';
import { getCatalogWeek } from '../content/catalog';
import { PLACEMENT_STEP_UP_THRESHOLD, PLACEMENT_STEP_DOWN_THRESHOLD } from '../constants';
import { bandForLevel, MODULE_COPY } from '../copy';
import { checkAnswer } from '../answers';
import { recordItemAttempt } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import AnswerEntry from '../components/AnswerEntry';
import type { BBLevel, PlacementClusterResult, PlacementResult } from '../types';

/** Levels with placeable entry-week content in increment 2. */
const LADDER: readonly BBLevel[] = ['A', 'B', 'C'];
const ITEMS_PER_CLUSTER = 5;
const PAUSE_EVERY = 8;

function startLevelForAge(age: number): BBLevel {
  if (age <= 6) return 'A';
  if (age <= 8) return 'B';
  return 'C';
}

function buildStrengths(clusters: PlacementClusterResult[], placed: BBLevel): string[] {
  const strengths: string[] = [];
  for (const c of clusters) {
    if (c.accuracy >= 0.6) {
      const cell = getCatalogWeek(c.level, 1);
      if (cell) strengths.push(cell.conceptName);
    }
  }
  const below = LADDER[LADDER.indexOf(placed) - 1];
  if (strengths.length < 2 && below) {
    const cell = getCatalogWeek(below, 1);
    if (cell && !strengths.includes(cell.conceptName)) strengths.push(cell.conceptName);
  }
  if (strengths.length < 2) strengths.push('Sticking with tricky ones and trying again');
  return strengths.slice(0, 3);
}

export default function PlacementActivity() {
  const navigate = useNavigate();
  const { childId, childAge, band: childBand } = useFoundrySession();

  const walkSeed = useRef(Math.floor(Math.random() * 0x7fffffff));
  const [level, setLevel] = useState<BBLevel>(() => startLevelForAge(childAge));
  const [visited, setVisited] = useState<BBLevel[]>([]);
  const [clusters, setClusters] = useState<PlacementClusterResult[]>([]);
  const [itemIdx, setItemIdx] = useState(0);
  const [clusterCorrect, setClusterCorrect] = useState(0);
  const [totalServed, setTotalServed] = useState(0);
  const [phase, setPhase] = useState<'item' | 'ack' | 'pause'>('item');

  // The cluster's items: exit-skill slice of the level's entry-week pack.
  const pack = useMemo(() => generatePack(level, 1, walkSeed.current), [level]);
  const items = useMemo(() => pack.masteryCheck.formA.slice(0, ITEMS_PER_CLUSTER), [pack]);
  const item = items[Math.min(itemIdx, items.length - 1)];
  const band = bandForLevel(level);

  /**
   * Terminal placement (C3 fix): settle at the highest level the child did NOT
   * fail — cluster accuracy ≥ the step-down threshold (50%). A level scored
   * below it was too hard and is never assigned, even when the walk stepped up
   * into it and can no longer step back down (the level below is already
   * visited, so `canDown` is false and the old code wrongly held at the failed
   * level). Deterministic floor: if every tested cluster was failed, settle at
   * the ladder floor (A) — the safest start, never a level the child failed.
   *   e.g. pass A 5/5 → step up → fail B 0/5  ⇒ settle A (not B)
   *        pass B 4/5 → step up → fail C 2/5  ⇒ settle B (not C)
   */
  function settleLevel(results: PlacementClusterResult[]): BBLevel {
    const passed = results.filter((c) => c.accuracy >= PLACEMENT_STEP_DOWN_THRESHOLD);
    if (passed.length === 0) return LADDER[0];
    return passed.reduce(
      (hi, c) => (LADDER.indexOf(c.level) > LADDER.indexOf(hi) ? c.level : hi),
      passed[0].level,
    );
  }

  function finishWalk(all: PlacementClusterResult[], placed: BBLevel) {
    const result: PlacementResult = {
      placedLevel: placed,
      entryWeek: 1,
      clusterResults: all,
      strengths: buildStrengths(all, placed),
      completedAt: new Date().toISOString(),
      isRecheck: false,
    };
    navigate('/foundry/placement/result', { state: { result }, replace: true });
  }

  function completeCluster(correct: number) {
    const accuracy = correct / items.length;
    const idx = LADDER.indexOf(level);
    const canUp = idx < LADDER.length - 1 && !visited.includes(LADDER[idx + 1]);
    const canDown = idx > 0 && !visited.includes(LADDER[idx - 1]);
    const decision =
      accuracy >= PLACEMENT_STEP_UP_THRESHOLD && canUp
        ? 'step_up'
        : accuracy < PLACEMENT_STEP_DOWN_THRESHOLD && canDown
          ? 'step_down'
          : 'hold';

    const clusterResult: PlacementClusterResult = {
      clusterId: `${level}1-exit`,
      level,
      itemsServed: items.length,
      itemsCorrect: correct,
      accuracy,
      decision,
    };
    const all = [...clusters, clusterResult];
    setClusters(all);
    setVisited((v) => [...v, level]);

    if (decision === 'hold') {
      // C3: settle from the whole walk, never at `level` — a failed step-up
      // (canDown blocked by the visited level below) must not place the child
      // in the level they just failed.
      finishWalk(all, settleLevel(all));
      return;
    }
    setLevel(LADDER[idx + (decision === 'step_up' ? 1 : -1)]);
    setItemIdx(0);
    setClusterCorrect(0);
  }

  function handleAnswer(answer: string) {
    if (phase !== 'item') return;
    const { correct } = checkAnswer(item.answer, answer);
    void recordItemAttempt({
      childId,
      packId: pack.packId,
      itemId: item.id,
      answer,
      correct,
      hintRungsUsed: 0,
      attemptNo: 1,
      day: null,
    });
    const newCorrect = clusterCorrect + (correct ? 1 : 0);
    const served = totalServed + 1;
    setClusterCorrect(newCorrect);
    setTotalServed(served);

    // Identical warm-neutral acknowledgment — never right/wrong (DD5).
    setPhase('ack');
    window.setTimeout(() => {
      if (itemIdx + 1 >= items.length) {
        completeCluster(newCorrect);
        setPhase('item');
      } else if (served % PAUSE_EVERY === 0) {
        setItemIdx((i) => i + 1);
        setPhase('pause');
      } else {
        setItemIdx((i) => i + 1);
        setPhase('item');
      }
    }, 800);
  }

  if (phase === 'pause') {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-8">
        <WrenBubble band={childBand} autoplay text={MODULE_COPY.placementPause[childBand]} emotion="curious" />
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setPhase('item')}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            Keep going
          </button>
          <button
            type="button"
            onClick={() => setPhase('item')}
            className="min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-6 text-lg font-medium text-text-secondary hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            I stretched — ready!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress-as-path only, never a score (B band); nothing at all at A. */}
      {band !== 'A' && (
        <p className="text-sm text-text-muted" aria-hidden="true">
          A little tour of math land…
        </p>
      )}

      <section aria-label="The question" className="rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <p className={band === 'A' ? 'flex-1 text-2xl text-text-primary' : 'flex-1 text-xl text-text-primary'}>
            {item.prompt}
          </p>
          <AudioButton text={item.prompt} band={band} autoplay={band === 'A'} />
        </div>
      </section>

      {phase === 'ack' ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <p className="text-2xl font-semibold text-secondary-600">{MODULE_COPY.placementAck[band]}</p>
        </div>
      ) : (
        <AnswerEntry item={item} band={band} onSubmit={handleAnswer} />
      )}
    </div>
  );
}
