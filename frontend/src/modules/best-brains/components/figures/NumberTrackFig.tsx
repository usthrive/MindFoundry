/**
 * A number track (2026-11-17). B4's words are about a TRACK — "stands on square
 * 12 of the hopscotch track", "the hops land on 13, then 14" — and the picture
 * was a number LINE: ticks with numbers under them, where a child counts points
 * and gaps and the classic off-by-one ("counted the start") lives. A track is a
 * row of numbered squares; a counter stands ON a square, and a hop goes from one
 * square to the next.
 *
 * Pure function of its params: no randomness, no measurement.
 */
import type { ReactElement } from 'react';
import type { FigurePartProps } from './shared';
import { FIG, FONT, STROKE, W, r2 } from './shared';

const PAD = 6;
const TOP = 30;

export default function NumberTrackFig({ params }: FigurePartProps<'number-track'>) {
  const { min, max } = params;
  const n = Math.max(1, max - min + 1);
  const cell = (W - 2 * PAD) / n;
  const x0 = PAD;
  const cx = (v: number) => x0 + (v - min + 0.5) * cell;
  const fs = Math.min(12, cell * 0.56);
  const H = TOP + cell + 8;
  const out: ReactElement[] = [];
  for (let v = min; v <= max; v++) {
    const x = x0 + (v - min) * cell;
    out.push(
      <g key={`sq${v}`}>
        <rect x={r2(x)} y={TOP} width={r2(cell)} height={r2(cell)} fill={FIG.surface} stroke={FIG.inkMuted} strokeWidth={STROKE.thin} />
        <text x={r2(x + cell / 2)} y={r2(TOP + cell / 2 + fs * 0.36)} textAnchor="middle" fontSize={r2(fs)} fontWeight={600} fill={FIG.ink} fontFamily={FONT}>
          {v}
        </text>
      </g>,
    );
  }
  (params.hops ?? []).forEach((h, i) => {
    const a = cx(h.from);
    const b = cx(h.to);
    out.push(
      <path key={`hop${i}`} d={`M ${r2(a)} ${TOP - 2} Q ${r2((a + b) / 2)} ${TOP - 20} ${r2(b)} ${TOP - 2}`} fill="none" stroke={FIG.primary} strokeWidth={STROKE.base} strokeLinecap="round" />,
    );
  });
  for (const c of params.counters ?? []) {
    out.push(<circle key={`c${c}`} cx={r2(cx(c))} cy={TOP - 7} r={r2(Math.min(6, cell * 0.36))} fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={STROKE.thin} />);
  }
  if (params.flag !== undefined) {
    const fx = cx(params.flag);
    out.push(
      <g key="flag">
        <line x1={r2(fx)} y1={TOP} x2={r2(fx)} y2={TOP - 24} stroke={FIG.ink} strokeWidth={STROKE.thin} />
        <path d={`M ${r2(fx)} ${TOP - 24} L ${r2(fx + 11)} ${TOP - 20} L ${r2(fx)} ${TOP - 16} Z`} fill={FIG.attention} />
      </g>,
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${r2(H)}`} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block', height: 'auto' }}>
      {out}
    </svg>
  );
}
