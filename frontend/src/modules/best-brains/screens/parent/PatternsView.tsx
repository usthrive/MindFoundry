/**
 * PatternsView (PARENT-FLOWS Flow 5) — DD7 error patterns translated into
 * parent language, each with what the program is ALREADY doing about it
 * (diagnosis-and-treatment, never symptoms-for-the-parent-to-treat). Language
 * stays task-level always ("the regrouping step," never "careless"); no
 * shame artifacts; the standing footer hands the parent to CoachCorner.
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listMissGroups, type MissGroup } from '../../services/bbParentService';
import { PATTERNS_FOOTER, TAG_GLOSSES, TAG_PARENT_MOVE } from '../../parentCopy';
import { getCatalogWeek } from '../../content/catalog';
import { useParentContext } from './FoundryParentLayout';
import type { BBLevel } from '../../types';

/** "MFM-C1" → the concept name, for naming the skill in parent words. */
function conceptFromPackId(packId: string): string | null {
  const m = /^MFM-([A-E])(\d+)$/.exec(packId);
  if (!m) return null;
  return getCatalogWeek(m[1] as BBLevel, Number(m[2]))?.conceptName ?? null;
}

export default function PatternsView() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, childName } = useParentContext();
  const name = childName(childId);
  const [groups, setGroups] = useState<MissGroup[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listMissGroups(childId)
      .then((g) => {
        if (!cancelled) setGroups(g);
      })
      .catch(() => setGroups([]));
    return () => {
      cancelled = true;
    };
  }, [childId]);

  if (loading || groups === null)
    return <p className="py-12 text-center text-text-secondary">Setting up…</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[21px] font-bold text-text-primary">What we're watching</h1>

      {groups.length === 0 && (
        <section className="mf-card-quiet p-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            A quiet stretch — nothing needed reinforcement recently. Strong weeks look exactly like
            this.
          </p>
        </section>
      )}

      {groups.map((g) => {
        const gloss = TAG_GLOSSES[g.errorTag];
        const concepts = g.packIds
          .map(conceptFromPackId)
          .filter((c): c is string => !!c)
          .slice(0, 2);
        return (
          <section key={g.errorTag} className="mf-card-quiet flex flex-col gap-2 p-5">
            <span className="mf-label mf-label-teal">{gloss.gloss}</span>
            {concepts.length > 0 && (
              <p className="text-[15px] font-semibold text-text-primary">{concepts.join(' · ')}</p>
            )}
            <p className="text-[13px] text-text-secondary">
              {g.countThisWeek >= 2
                ? `Happened ${g.countThisWeek} times this week — a pattern we're on.`
                : g.count >= 2
                  ? `Seen ${g.count} times this month.`
                  : 'A one-time slip — noted, not worried.'}
            </p>
            <div className="rounded-xl px-4 py-3" style={{ background: 'var(--mf-paper)' }}>
              <span className="mf-label mf-label-apricot">What the program is doing</span>
              <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">{gloss.plan}</p>
            </div>
            {/* The parent's own move — offered, never assigned. The label says
                "if you'd like" in as many words because this screen previously
                told the parent the opposite, and a like-instructor reading it
                needs to know which of the two the product now means. Nothing
                anywhere records whether they did it.

                Shown only where the line above calls something a pattern. A
                one-time slip is already answered with "noted, not worried", and
                handing a parent a move for it would contradict that in the next
                breath — the offer has to be as calm as the diagnosis or it
                reads as an instruction with a softener on it. */}
            {(g.countThisWeek >= 2 || g.count >= 2) && (
              <div className="rounded-xl border-2 border-dashed px-4 py-3" style={{ borderColor: 'var(--mf-paper)' }}>
                <span className="mf-label mf-label-teal">If you'd like to help</span>
                <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">
                  {TAG_PARENT_MOVE[g.errorTag]}
                </p>
              </div>
            )}
          </section>
        );
      })}

      <p className="text-center text-[13px] leading-relaxed text-text-secondary">
        {PATTERNS_FOOTER}
      </p>
      <Link
        to={`/foundry/parent/coach/${childId}`}
        className="mf-btn-primary flex items-center justify-center touch-manipulation"
      >
        Tonight's two lines for {name}
      </Link>
    </div>
  );
}
