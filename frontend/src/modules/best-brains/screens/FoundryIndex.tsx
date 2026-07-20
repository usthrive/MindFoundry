/**
 * FoundryIndex — module entry router: placement when unenrolled, otherwise
 * the weekly hub (ThisWeekHub is the module's home every launch, Flow 2).
 */

import { Navigate } from 'react-router-dom';
import { useFoundrySession } from '../session/FoundrySession';

export default function FoundryIndex() {
  const { loading, enrollment } = useFoundrySession();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-lg text-text-secondary">Setting up…</p>
      </div>
    );
  }

  if (!enrollment) return <Navigate to="/foundry/placement/welcome" replace />;
  return <Navigate to="/foundry/hub" replace />;
}
