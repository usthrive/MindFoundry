/**
 * WeeklyReport (PARENT-FLOWS Flow 2) — Ms. Wren's weekly note, rendered from
 * bb_parent_reports.narrative (the E102 four-field frame the scoring RPC
 * assembles; TEACHER-PERSONA §6 owns the structure — this screen renders,
 * never re-invents). Reference dress: serif body, sans section labels,
 * verdict-as-typography (underline, no color coding), the % exactly once,
 * "Seen it" acknowledge in ink. Same calm dress for every verdict.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCatalogWeek } from '../../content/catalog';
import { acknowledgeReport, getReport } from '../../services/bbParentService';
import { VERDICT_LABELS, ackLabel } from '../../parentCopy';
import { useParentContext } from './FoundryParentLayout';
import type { BBLevel, BBParentReport } from '../../types';

function SectionLabel({ children, apricot }: { children: string; apricot?: boolean }) {
  return <div className={apricot ? 'mf-label mf-label-apricot' : 'mf-label mf-label-teal'}>{children}</div>;
}

export default function WeeklyReport() {
  const params = useParams<{ childId: string; level: string; week: string }>();
  const navigate = useNavigate();
  const { childName, refresh } = useParentContext();
  const childId = params.childId ?? '';
  const level = (params.level ?? 'A') as BBLevel;
  const week = Number(params.week);

  const [report, setReport] = useState<BBParentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [acking, setAcking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getReport(childId, level, week)
      .then((r) => {
        if (!cancelled) setReport(r);
      })
      .catch((e) => console.error('[bb] report load failed', e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [childId, level, week]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Opening the note…</p>;
  if (!report) {
    // Verdict-pending state: the rhythm bends, never breaks.
    return (
      <div className="mf-card-quiet flex flex-col gap-3 p-5 text-center">
        <p className="text-sm text-text-secondary">
          {childName(childId)} is still finishing this week up — the note arrives once the weekly
          check is done.
        </p>
        <Link to="/foundry/parent" className="text-[13px] font-semibold text-primary">
          Back to this week
        </Link>
      </div>
    );
  }

  const name = childName(report.childId);
  const concept = getCatalogWeek(report.level, report.week)?.conceptName ?? `Week ${report.week}`;
  const n = report.narrative;
  const acknowledged = !!report.acknowledgedAt;

  async function onAcknowledge() {
    if (!report || acking || report.acknowledgedAt) return;
    setAcking(true);
    try {
      const stamp = await acknowledgeReport(report.childId, report.level, report.week);
      setReport({ ...report, acknowledgedAt: stamp });
      void refresh();
    } catch (e) {
      console.error('[bb] acknowledge failed', e);
    } finally {
      setAcking(false);
    }
  }

  return (
    <div className="mf-card-quiet flex flex-col overflow-hidden">
      {/* Header — level letter + week code, concept, verdict-as-typography + % once. */}
      <div className="flex flex-col gap-1 border-b border-gray-200 bg-gray-50 px-5 py-4" style={{ background: 'var(--mf-paper)' }}>
        <div className="mf-label">
          {name} · Level {report.level} · Week {report.week}
        </div>
        <div className="text-[19px] font-bold text-text-primary">{concept}</div>
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="mf-verdict">{VERDICT_LABELS[report.verdict]}</span>
          <span className="text-[13px] text-text-secondary">{report.percent}% on the weekly check</span>
        </div>
      </div>

      {/* Serif body — the E102 four fields, in warmth order. */}
      <div className="mf-report-body flex flex-col gap-4 px-5 py-4">
        <div>
          <SectionLabel>What we worked on</SectionLabel>
          <p className="mt-1.5">{n.whatWeWorkedOn}</p>
        </div>
        <div>
          <SectionLabel>{`Where ${name} is improving`}</SectionLabel>
          <p className="mt-1.5">{n.improving}</p>
        </div>
        <div>
          <SectionLabel>What we're strengthening</SectionLabel>
          <p className="mt-1.5">{n.strengthening}</p>
          {report.verdict !== 'passed' && (
            <Link
              to={`/foundry/parent/patterns/${report.childId}`}
              className="mt-1 inline-block text-[13px] font-semibold text-primary"
              style={{ fontFamily: 'var(--mf-font-parent)' }}
            >
              See the pattern
            </Link>
          )}
        </div>
        <div className="rounded-xl px-4 py-3.5" style={{ background: 'var(--mf-paper)' }}>
          <SectionLabel apricot>At home this week</SectionLabel>
          <p className="mt-2">
            Praise the move: <em>“{n.homeFocus.praiseLine}”</em>
          </p>
          <p className="mt-2">
            Ask {name} to teach you: <em>“{n.homeFocus.questionForChild}”</em>
          </p>
          {n.homeFocus.schoolSyncHook && <p className="mt-2">{n.homeFocus.schoolSyncHook}</p>}
        </div>
        {n.teacherNarrative && <p className="text-[14px] italic text-text-secondary">{n.teacherNarrative}</p>}
      </div>

      {/* Footer — the acknowledge ritual (E15), then the gentle follow-ons. */}
      <div className="flex flex-col gap-3 px-5 pb-5">
        {acknowledged ? (
          <p className="text-center text-[13px] font-semibold text-text-secondary">
            Seen {new Date(report.acknowledgedAt!).toLocaleDateString()} — {name} will know their
            week counted.
          </p>
        ) : (
          <button type="button" className="mf-ack-btn touch-manipulation" disabled={acking} onClick={() => void onAcknowledge()}>
            {acking ? 'Signing…' : ackLabel(name)}
          </button>
        )}
        <div className="flex justify-center gap-4 text-[12.5px] font-semibold">
          <button
            type="button"
            onClick={() => navigate(`/foundry/parent/coach/${report.childId}`)}
            className="text-primary"
          >
            Coach corner
          </button>
          <button
            type="button"
            onClick={() => navigate(`/foundry/parent/history/${report.childId}`)}
            className="text-primary"
          >
            All reports
          </button>
        </div>
      </div>
    </div>
  );
}
