/**
 * A circle cut into pieces — the pizza / cake fraction model (2026-11-17). C15
 * asked about "a pizza cut into 3 pieces that are not all the same size" under a
 * BAR. A pizza is round, and whether its slices match is something a child judges
 * by eye round the centre, not along a strip. Pieces run clockwise from the top;
 * shaded pieces are coloured in.
 *
 * Pure function of its params: no randomness, no measurement.
 */
import type { ReactElement } from 'react';
import type { FigurePartProps } from './shared';
import { FIG, STROKE, W, r2 } from './shared';

const R = 70;
const H = 2 * R + 20;

export default function FractionCircleFig({ params }: FigurePartProps<'fraction-circle'>) {
  const parts = (params.parts ?? []).filter((w) => w > 0);
  const total = parts.reduce((a, w) => a + w, 0) || 1;
  const shaded = new Set(params.shaded ?? []);
  const cx = W / 2;
  const cy = H / 2;
  const pt = (a: number, r = R) => [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))] as const;
  const out: ReactElement[] = [];
  let a = -Math.PI / 2;
  parts.forEach((w, i) => {
    const sweep = (w / total) * 2 * Math.PI;
    const [sx, sy] = pt(a);
    const [ex, ey] = pt(a + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    out.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${sx} ${sy} A ${R} ${R} 0 ${large} 1 ${ex} ${ey} Z`}
        fill={shaded.has(i) ? FIG.accent : FIG.accentSoft}
        stroke={FIG.accentDeep}
        strokeWidth={STROKE.base}
        strokeLinejoin="round"
      />,
    );
    a += sweep;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block', height: 'auto' }}>
      {/* the crust, so the circle reads as a pizza or a cake rather than a dial */}
      <circle cx={cx} cy={cy} r={R + 4} fill="none" stroke={FIG.accentDeep} strokeWidth={STROKE.heavy} />
      {out}
    </svg>
  );
}
