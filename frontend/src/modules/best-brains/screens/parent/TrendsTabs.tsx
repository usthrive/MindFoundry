/**
 * TrendsTabs — the shared two-tab header for TrendsView ⇄ MasteryMap
 * ("two tabs, one mental model", PARENT-FLOWS Flow 4).
 */

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function TrendsTabs({ childId, active }: { childId: string; active: 'trends' | 'map' }) {
  const base = 'flex-1 rounded-xl py-2.5 text-center text-sm font-bold touch-manipulation';
  return (
    <div className="flex gap-1 rounded-2xl bg-gray-100 p-1">
      <Link
        to={`/foundry/parent/trends/${childId}`}
        className={cn(base, active === 'trends' ? 'bg-white text-primary-700 shadow-sm' : 'text-text-secondary')}
      >
        Trends
      </Link>
      <Link
        to={`/foundry/parent/mastery/${childId}`}
        className={cn(base, active === 'map' ? 'bg-white text-primary-700 shadow-sm' : 'text-text-secondary')}
      >
        Mastery map
      </Link>
    </div>
  );
}
