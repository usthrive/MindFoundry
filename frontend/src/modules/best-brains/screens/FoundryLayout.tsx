/**
 * FoundryLayout — the /foundry shell: requires a selected child, provides the
 * Foundry session context, and frames every screen in the module's calm,
 * low-density canvas (P2/P5).
 *
 * Increment 5: carries the Claude-Design skin. The `.mf-foundry` root class
 * scopes theme/tokens.css (paper canvas #EFEAE2, calm teal/apricot palette,
 * warm neutrals) to this module only — Kumon screens are unaffected. The
 * mobile-first 430px column mirrors the reference screens' 390px card frame.
 */

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FoundrySessionProvider } from '../session/FoundrySession';
import '../theme/tokens.css';

export default function FoundryLayout() {
  const { currentChild, children: childList, loading } = useAuth();

  // AuthContext flips loading=false before the async children load resolves,
  // so give the localStorage child restore a short grace window before
  // bouncing to /select-child (otherwise every full-page reload loses /foundry).
  const [graceOver, setGraceOver] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setGraceOver(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  if (loading || (!currentChild && childList.length === 0 && !graceOver)) {
    return (
      <div className="mf-foundry flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-text-secondary">Setting up…</p>
      </div>
    );
  }

  if (!currentChild) {
    return <Navigate to="/select-child" replace />;
  }

  return (
    <FoundrySessionProvider>
      <div className="mf-foundry min-h-screen bg-background">
        <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
          <Outlet />
        </main>
      </div>
    </FoundrySessionProvider>
  );
}
