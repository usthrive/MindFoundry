/**
 * A line plot (2026-11-17). B23's lesson says "A line plot moves the numbers…
 * Above the 5 I put one dot for every pod that held 5 peas" and drew nothing. A
 * line plot is a number line with a stack of dots over each value; the dots are
 * the things counted, never the value they sit over.
 *
 * Pure function of its params: no randomness, no measurement.
 */
import type { ReactElement } from 'react';
import type { FigurePartProps } from './shared';
import { FIG, FONT, STROKE, TEXT, W, r2 } from './shared';

const PAD = 24;
const DOT_R = 5;
const PITCH = 12;

export default function LinePlotFig({ params }: FigurePartProps<'line-plot'>) {
  const { min, max } = params;
  const most = Math.max(1, ...(params.dots ?? []).map((d) => d.count));
  const lineY = 12 + most * PITCH + 6;
  const H = lineY + 26 + (params.label ? 16 : 0);
  const span = Math.max(1, max - min);
  const X = (v: number) => PAD + ((v - min) / span) * (W - 2 * PAD);
  const out: ReactElement[] = [];
  for (let v = min; v <= max; v++) {
    out.push(
      <g key={`t${v}`}>
        <line x1={r2(X(v))} y1={lineY} x2={r2(X(v))} y2={lineY + 7} stroke={FIG.ink} strokeWidth={STROKE.thin} />
        <text x={r2(X(v))} y={lineY + 20} textAnchor="middle" fontSize={TEXT.body} fontWeight={600} fill={FIG.ink} fontFamily={FONT}>
          {v}
        </text>
      </g>,
    );
  }
  for (const d of params.dots ?? []) {
    for (let k = 0; k < d.count; k++) {
      out.push(<circle key={`d${d.at}-${k}`} cx={r2(X(d.at))} cy={r2(lineY - 8 - k * PITCH)} r={DOT_R} fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={STROKE.hair} />);
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${r2(H)}`} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block', height: 'auto' }}>
      <line x1={PAD - 10} y1={lineY} x2={W - PAD + 10} y2={lineY} stroke={FIG.ink} strokeWidth={STROKE.base} strokeLinecap="round" />
      {out}
      {params.label && (
        <text x={W / 2} y={r2(H - 4)} textAnchor="middle" fontSize={TEXT.small} fill={FIG.inkMuted} fontFamily={FONT}>
          {params.label}
        </text>
      )}
    </svg>
  );
}
