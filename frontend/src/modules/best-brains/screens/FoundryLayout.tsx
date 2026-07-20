/**
 * FoundryLayout — the /foundry shell: requires a selected child, provides the
 * Foundry session context, and frames every screen in the module's calm,
 * low-density canvas (P2/P5). Neutral Tailwind styling grouped semantically so
 * a later token/skin pass can restyle without rewrites (design/inbound was
 * empty at build time).
 */

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FoundrySessionProvider } from '../session/FoundrySession';

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-text-secondary">Setting up…</p>
      </div>
    );
  }

  if (!currentChild) {
    return <Navigate to="/select-child" replace />;
  }

  return (
    <FoundrySessionProvider>
      <div className="min-h-screen bg-background">
        <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </FoundrySessionProvider>
  );
}
