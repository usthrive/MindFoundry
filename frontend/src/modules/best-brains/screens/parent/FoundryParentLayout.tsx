/**
 * FoundryParentLayout — the /foundry/parent shell (increment 5).
 *
 * Parent-mode guard, per the app's conventions (ProgressDashboard precedent):
 * parent surfaces are routes the account owner visits — the guard is the
 * authenticated account itself (ProtectedRoute upstream), NOT a selected
 * child. This layout deliberately does not require or touch the selected
 * child, and no child-side screen links here, so an active child session
 * never lands on parent surfaces (P6: verdict + % live only behind this
 * layout). Read-mostly, weekly-cadenced, phone-first (PARENT-FLOWS law).
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/lib/supabase';
import { listEnrollments, listReports } from '../../services/bbParentService';
import WrenMark from '../../components/WrenMark';
import type { BBEnrollment, BBParentReport } from '../../types';
import '../../theme/tokens.css';

type ChildRow = Database['public']['Tables']['children']['Row'];

export interface ParentContextValue {
  loading: boolean;
  childList: ChildRow[];
  /** childId → enrollment (absent = not enrolled in this module yet). */
  enrollments: Map<string, BBEnrollment>;
  /** childId → reports, newest first. */
  reportsByChild: Map<string, BBParentReport[]>;
  childName: (childId: string) => string;
  refresh: () => Promise<void>;
}

const ParentContext = createContext<ParentContextValue | undefined>(undefined);

export function useParentContext(): ParentContextValue {
  const ctx = useContext(ParentContext);
  if (!ctx) throw new Error('useParentContext must be used within FoundryParentLayout');
  return ctx;
}

/**
 * The calm load-failure affordance (P-1). Shown in place of the parent
 * surfaces when the shared data fetch fails, so a transient network hiccup
 * never masquerades as "your enrolled child hasn't started yet."
 */
function ParentLoadError({ onRetry }: { onRetry: () => Promise<void> }) {
  const [retrying, setRetrying] = useState(false);
  return (
    <section className="mf-card-quiet flex flex-col gap-3 p-6 text-center">
      <p className="text-[15px] font-semibold text-text-primary">Couldn't load this just now</p>
      <p className="text-[13.5px] leading-relaxed text-text-secondary">
        A brief connection hiccup — nothing about your child's week is lost. Give it another tap.
      </p>
      <button
        type="button"
        disabled={retrying}
        onClick={async () => {
          setRetrying(true);
          try {
            await onRetry();
          } finally {
            setRetrying(false);
          }
        }}
        className="mf-btn-primary touch-manipulation disabled:opacity-60"
      >
        {retrying ? 'Trying…' : 'Try again'}
      </button>
    </section>
  );
}

export default function FoundryParentLayout() {
  const { children: childList } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Map<string, BBEnrollment>>(new Map());
  const [reportsByChild, setReportsByChild] = useState<Map<string, BBParentReport[]>>(new Map());
  const [loadError, setLoadError] = useState(false);

  const childIds = childList.map((c) => c.id).join(',');

  const refresh = useCallback(async () => {
    const ids = childIds ? childIds.split(',') : [];
    if (ids.length === 0) {
      setEnrollments(new Map());
      setReportsByChild(new Map());
      setLoadError(false);
      setLoading(false);
      return;
    }
    try {
      const enr = await listEnrollments(ids);
      const reports = new Map<string, BBParentReport[]>();
      await Promise.all(
        ids
          .filter((id) => enr.has(id))
          .map(async (id) => {
            reports.set(id, await listReports(id));
          }),
      );
      setEnrollments(enr);
      setReportsByChild(reports);
      setLoadError(false);
    } catch (e) {
      // Distinguish a transient load failure from a genuine "not enrolled"
      // state (P-1): surface a calm retry rather than letting downstream
      // screens render an enrolled child as "not started yet".
      console.error('[bb] parent surface load failed', e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [childIds]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const childName = useCallback(
    (childId: string) => childList.find((c) => c.id === childId)?.name ?? 'your child',
    [childList],
  );

  const value: ParentContextValue = { loading, childList, enrollments, reportsByChild, childName, refresh };

  return (
    <ParentContext.Provider value={value}>
      <div className="mf-foundry min-h-screen bg-background">
        <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
          <header className="mb-5 flex items-center justify-between">
            <Link to="/progress" className="text-[12.5px] font-semibold text-text-secondary hover:text-text-primary">
              ← Progress
            </Link>
            <Link to="/foundry/parent" className="flex items-center gap-2" aria-label="Best Brains Method parent home">
              <span className="mf-label">Best Brains Method · Parents</span>
              <WrenMark size={30} />
            </Link>
          </header>
          {loadError && !loading ? <ParentLoadError onRetry={refresh} /> : <Outlet />}
        </main>
      </div>
    </ParentContext.Provider>
  );
}
