/**
 * PlacementStory (PARENT-FLOWS Flow 1) — the placement-results conversation:
 * placed level (neutral letter + parent-only level↔age context, DD2), the
 * evidenced strengths, first-month targets from the curriculum graph, and the
 * standing promise that placement is re-checkable. Destigmatizing by law:
 * "behind" is never said; we start where instruction lands.
 */

import { Link, useParams } from 'react-router-dom';
import { getCatalogWeek } from '../../content/catalog';
import { LEVEL_CONTEXT } from '../../parentCopy';
import { useParentContext } from './FoundryParentLayout';

export default function PlacementStory() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, enrollments, childName } = useParentContext();
  const name = childName(childId);
  const enr = enrollments.get(childId);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;

  if (!enr) {
    return (
      <div className="mf-card-quiet flex flex-col gap-3 p-5 text-center">
        <p className="text-sm text-text-secondary">
          {name} hasn't found a starting point yet — ready when you are.
        </p>
        <Link to="/foundry/parent/welcome" className="text-[13px] font-semibold text-primary">
          How this module works
        </Link>
      </div>
    );
  }

  const placement = enr.placementResult;
  const strengths = placement?.strengths ?? [];
  const firstMonth = [0, 1, 2, 3]
    .map((offset) => getCatalogWeek(enr.level, Math.min(24, (placement?.entryWeek ?? 1) + offset)))
    .filter((w, i, arr) => w && arr.findIndex((x) => x?.week === w.week) === i);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[21px] font-bold text-text-primary">{name}'s starting point</h1>

      <section className="mf-card flex flex-col gap-2 p-5">
        <span className="mf-label mf-label-teal">Where instruction lands</span>
        <p className="text-[24px] font-bold text-text-primary">Level {enr.level}</p>
        <p className="text-[15px] leading-relaxed text-text-secondary">{LEVEL_CONTEXT[enr.level]}</p>
        <p className="text-[13px] text-text-secondary">
          We start where instruction lands, not where frustration lives — the level letter is a
          starting point, never a rank.
        </p>
      </section>

      {strengths.length > 0 && (
        <section className="mf-card-quiet flex flex-col gap-2 p-5">
          <span className="mf-label mf-label-teal">What {name} already owns</span>
          <ul className="flex flex-col gap-1.5">
            {strengths.map((s) => (
              <li key={s} className="text-[15px] text-text-primary">
                • {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mf-card-quiet flex flex-col gap-2 p-5">
        <span className="mf-label mf-label-teal">The first month</span>
        <ul className="flex flex-col gap-1.5">
          {firstMonth.map(
            (w) =>
              w && (
                <li key={w.week} className="text-[15px] text-text-primary">
                  <span className="font-semibold">Week {w.week}</span> · {w.conceptName}
                </li>
              ),
          )}
        </ul>
        <p className="text-[13px] leading-relaxed text-text-secondary">
          One concept a week, each gated by a short mastery check — {name} moves when a concept is
          owned, and the pace compresses naturally where things come easily.
        </p>
      </section>

      <section className="mf-card-quiet p-5">
        <span className="mf-label mf-label-apricot">Our standing promise</span>
        <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
          Placement is re-checkable. If a stretch ever proves too steep, that is ours to fix — the
          program re-checks its own homework rather than letting {name} grind.
        </p>
      </section>

      <Link to="/foundry/parent" className="mf-btn-primary flex items-center justify-center touch-manipulation">
        To this week
      </Link>
    </div>
  );
}
