/**
 * A pictograph (2026-11-17). C23 said "A pictograph shows books. Monday has 8
 * stars…" and drew a NUMBER LINE (the key as one step on a ruler). A pictograph
 * is rows of one symbol with a key underneath, and reading the key first is the
 * whole week. The rows are the givens the words print; nothing here is to scale
 * beyond one symbol = one symbol, so the picture never does the multiplying.
 *
 * Pure function of its params: no randomness, no measurement.
 */
import type { ReactElement } from 'react';
import type { FigurePartProps } from './shared';
import { FIG, FONT, STROKE, TEXT, W, r2 } from './shared';

type Symbol = FigurePartProps<'pictograph'>['params']['symbol'];
const LABEL_W = 92;
const ROW_H = 30;

function glyph(symbol: Symbol, cx: number, cy: number, s: number, key: string): ReactElement {
  const h = s / 2;
  switch (symbol) {
    case 'star': {
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const ang = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 === 0 ? h : h * 0.45;
        pts.push(`${r2(cx + rr * Math.cos(ang))},${r2(cy + rr * Math.sin(ang))}`);
      }
      return <polygon key={key} points={pts.join(' ')} fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={STROKE.hair} strokeLinejoin="round" />;
    }
    case 'circle':
      return <circle key={key} cx={r2(cx)} cy={r2(cy)} r={r2(h * 0.85)} fill={FIG.primarySoft} stroke={FIG.primary} strokeWidth={STROKE.thin} />;
    case 'square':
      return <rect key={key} x={r2(cx - h * 0.8)} y={r2(cy - h * 0.8)} width={r2(h * 1.6)} height={r2(h * 1.6)} rx={1.5} fill={FIG.attentionSoft} stroke={FIG.attention} strokeWidth={STROKE.thin} />;
    default:
      return (
        <path
          key={key}
          d={`M ${r2(cx)} ${r2(cy - h)} C ${r2(cx + h * 0.9)} ${r2(cy)}, ${r2(cx + h * 0.7)} ${r2(cy + h)}, ${r2(cx)} ${r2(cy + h)} C ${r2(cx - h * 0.7)} ${r2(cy + h)}, ${r2(cx - h * 0.9)} ${r2(cy)}, ${r2(cx)} ${r2(cy - h)} Z`}
          fill={FIG.primarySoft}
          stroke={FIG.primary}
          strokeWidth={STROKE.thin}
        />
      );
  }
}

export default function PictographFig({ params }: FigurePartProps<'pictograph'>) {
  const rows = params.rows ?? [];
  const most = Math.max(1, ...rows.map((r) => r.count));
  const pitch = Math.min(22, (W - LABEL_W - 12) / most);
  const s = Math.min(18, pitch * 0.86);
  const keyY = rows.length * ROW_H + 26;
  const H = keyY + 14;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block', height: 'auto', fontFamily: FONT }}>
      {rows.map((row, i) => {
        const cy = 16 + i * ROW_H;
        return (
          <g key={row.label}>
            <text x={LABEL_W - 10} y={r2(cy + 5)} textAnchor="end" fontSize={TEXT.body} fontWeight={600} fill={FIG.ink} fontFamily={FONT}>
              {row.label}
            </text>
            <line x1={LABEL_W - 2} y1={r2(cy - ROW_H / 2 + 3)} x2={LABEL_W - 2} y2={r2(cy + ROW_H / 2 - 3)} stroke={FIG.line} strokeWidth={STROKE.thin} />
            {Array.from({ length: row.count }, (_, k) => glyph(params.symbol, LABEL_W + 6 + pitch * k + pitch / 2, cy, s, `${i}-${k}`))}
          </g>
        );
      })}
      <line x1={8} y1={keyY - 16} x2={W - 8} y2={keyY - 16} stroke={FIG.line} strokeWidth={STROKE.thin} />
      {glyph(params.symbol, 24, keyY, 16, 'key')}
      <text x={38} y={r2(keyY + 5)} fontSize={TEXT.body} fontWeight={700} fill={FIG.ink} fontFamily={FONT}>
        {`stands for ${params.key.worth} ${params.key.unit}`}
      </text>
    </svg>
  );
}
