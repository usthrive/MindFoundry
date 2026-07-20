/**
 * ReportHistory (PARENT-FLOWS Flow 2) — the browsable acknowledged-report
 * archive: the persistent learner profile the family can always revisit
 * (E85). Reverse-chronological; unacknowledged items flagged quietly; the
 * placement story persists in the profile header.
 */

import { Link, useParams } from 'react-router-dom';
import { VERDICT_LABELS } from '../../parentCopy';
import { getCatalogWeek } from '../../content/catalog';
import { useParentContext } from './FoundryParentLayout';

export default function ReportHistory() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, reportsByChild, enrollments, childName } = useParentContext();
  const name = childName(childId);
  const reports = reportsByChild.get(childId) ?? [];
  const enr = enrollments.get(childId);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[21px] font-bold text-text-primary">{name}'s report shelf</h1>

      {/* Profile header — the placement story persists here. */}
      {enr && (
        <Link
          to={`/foundry/parent/story/${childId}`}
          className="mf-card-quiet flex items-center justify-between p-4"
        >
          <span className="text-sm font-semibold text-text-primary">
            Level {enr.level} · placed{' '}
            {enr.placedAt ? new Date(enr.placedAt).toLocaleDateString() : 'earlier'}
          </span>
          <span className="text-[12.5px] font-semibold text-primary">Placement story</span>
        </Link>
      )}

      {reports.length === 0 && (
        <p className="mf-card-quiet p-5 text-center text-sm text-text-secondary">
          The story is just starting — the first weekly note arrives after {name}'s first weekly
          check.
        </p>
      )}
      {reports.length > 0 && reports.length < 3 && (
        <p className="text-center text-[12.5px] text-text-muted">The story is just starting.</p>
      )}

      <div className="flex flex-col gap-2.5">
        {reports.map((r) => (
          <Link
            key={`${r.level}-${r.week}`}
            to={`/foundry/parent/report/${childId}/${r.level}/${r.week}`}
            className="mf-card-quiet flex items-center justify-between gap-3 p-4"
          >
            <div className="min-w-0">
              <p className="mf-label">
                Level {r.level} · Week {r.week}
              </p>
              <p className="truncate text-[15px] font-semibold text-text-primary">
                {getCatalogWeek(r.level, r.week)?.conceptName ?? `Week ${r.week}`}
              </p>
              <p className="text-[12.5px] text-text-secondary">
                {VERDICT_LABELS[r.verdict]}
                {r.acknowledgedAt
                  ? ` · seen ${new Date(r.acknowledgedAt).toLocaleDateString()}`
                  : ' · not seen yet'}
              </p>
            </div>
            <span aria-hidden="true" className="text-text-muted">
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
