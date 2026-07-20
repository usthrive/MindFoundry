/**
 * CoachCorner (PARENT-FLOWS Flow 6) — exactly two speakable lines per week:
 * the praise line and the teach-it-back question, from the latest report's
 * homeFocus (assembled by the RPC from the pack's parentSummarySeed). Lines
 * must survive a tired parent at 7pm: short, concrete, warm. The fixed
 * three-line etiquette footer is always visible. First week (no report yet)
 * → honest starter lines from the placement strengths.
 */

import { useParams } from 'react-router-dom';
import { COACH_ETIQUETTE } from '../../parentCopy';
import { speak as ttsSpeak } from '@/services/ttsService';
import { useParentContext } from './FoundryParentLayout';

export default function CoachCorner() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, enrollments, reportsByChild, childName } = useParentContext();
  const name = childName(childId);
  const enr = enrollments.get(childId);
  const latest = reportsByChild.get(childId)?.[0] ?? null;

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;

  const isCurrent = !!latest && !!enr && latest.week === enr.currentWeek && latest.level === enr.level;
  const praise = latest?.narrative.homeFocus.praiseLine ?? null;
  const question = latest?.narrative.homeFocus.questionForChild ?? null;
  const strengths = enr?.placementResult?.strengths ?? [];

  function speak(text: string) {
    void ttsSpeak(text).catch(() => undefined);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[21px] font-bold text-text-primary">What to say tonight</h1>
      {latest && !isCurrent && (
        <p className="text-[12.5px] text-text-muted">From last week — this week's lines arrive with the next report.</p>
      )}

      {praise && question ? (
        <>
          <section className="mf-card flex flex-col gap-2 p-5">
            <span className="mf-label mf-label-teal">The praise line</span>
            <p className="mf-report-body text-[16px]">“{praise}”</p>
            <button
              type="button"
              onClick={() => speak(praise)}
              className="self-start rounded-full bg-primary-light px-4 py-2 text-[12.5px] font-bold text-primary-700 touch-manipulation"
            >
              Hear Ms. Wren say it
            </button>
            <p className="text-[12.5px] text-text-secondary">
              Praise the move by name — strategy praise sticks where "so smart" slides off.
            </p>
          </section>

          <section className="mf-card flex flex-col gap-2 p-5">
            <span className="mf-label mf-label-teal">Ask {name} to teach you</span>
            <p className="mf-report-body text-[16px]">“{question}”</p>
            <button
              type="button"
              onClick={() => speak(question)}
              className="self-start rounded-full bg-primary-light px-4 py-2 text-[12.5px] font-bold text-primary-700 touch-manipulation"
            >
              Hear it aloud
            </button>
            <p className="text-[12.5px] text-text-secondary">Kids consolidate by teaching — let {name} be the expert.</p>
          </section>
        </>
      ) : (
        <section className="mf-card flex flex-col gap-2 p-5">
          <span className="mf-label mf-label-teal">Starter lines</span>
          {strengths.length > 0 ? (
            <>
              <p className="mf-report-body text-[16px]">
                “I heard you already own {strengths[0].toLowerCase()} — show me how that works?”
              </p>
              <p className="text-[12.5px] text-text-secondary">
                From {name}'s placement — real evidence, honestly earned. Weekly lines begin with the
                first report.
              </p>
            </>
          ) : (
            <p className="text-sm text-text-secondary">
              The first weekly report brings {name}'s two lines — a praise line and a
              teach-it-back question, fresh each week.
            </p>
          )}
        </section>
      )}

      {/* The fixed etiquette footer — always visible. */}
      <section className="mf-card-quiet flex flex-col gap-1.5 p-4">
        {COACH_ETIQUETTE.map((line) => (
          <p key={line} className="text-[13px] text-text-secondary">
            · {line}
          </p>
        ))}
      </section>
    </div>
  );
}
