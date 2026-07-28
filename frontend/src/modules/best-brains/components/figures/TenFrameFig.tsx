/**
 * Ten-frame — the Level A/B number anchor: subitising to five, the partners of
 * ten, and the "one more row" structure that makes 13 read as ten-and-three.
 *
 * Two structural commitments. Filling is left-to-right, top row first and never
 * prettified, because the pattern IS the content — a child reads 7 as a full top
 * row plus two. And a `hidden` cell is drawn as a COVER, not as an empty cell:
 * A12's game asks how many are underneath, so the picture must say that
 * something is underneath (ghost outline + '?'), never leave it ambiguous.
 */

import type { ReactElement } from 'react';
import {
  FIG, STROKE, TEXT, FONT, W, r2, defId,
  type FigurePartProps, type FigureSize,
} from './shared';

const TS: Record<FigureSize, number> = { sm: 0.94, md: 1, lg: 1.1 };
const LS: Record<FigureSize, number> = { sm: 0.85, md: 1, lg: 1.2 };

type Icon = NonNullable<FigurePartProps<'ten-frame'>['params']['icon']>;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

const STAR_UNIT: Array<[number, number]> = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const rr = i % 2 ? 0.46 : 1;
  return [Math.cos(a) * rr, Math.sin(a) * rr];
});

const PETAL_UNIT: Array<[number, number]> = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return [Math.cos(a) * 0.58, Math.sin(a) * 0.58];
});

/**
 * Counter glyphs. Each is told apart by SILHOUETTE at ~14 viewBox units — the
 * colour is decoration, never the distinction, and nothing here is red (R3).
 * Duplicated in CountersFig: the two primitives are the only consumers and
 * `shared.ts` is the schema owner's file, not ours.
 */
function glyph(icon: Icon, cx: number, cy: number, r: number, ls: number): ReactElement {
  const sw = r2(Math.max(0.7, r * 0.11) * ls);
  const p = (x: number, y: number) => `${r2(cx + x * r)},${r2(cy + y * r)}`;
  const at = (x: number, y: number) => [r2(cx + x * r), r2(cy + y * r)] as const;

  switch (icon) {
    case 'star':
      return (
        <polygon
          points={STAR_UNIT.map(([x, y]) => p(x, y)).join(' ')}
          fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    case 'apple': {
      const [lx, ly] = at(0.5, -0.9);
      return (
        <g>
          {/* A circle reads as an ORANGE. The apple is told by its silhouette:
              two lobes meeting in a dimple under the stem. */}
          <path
            d={`M ${p(0, -0.5)} C ${p(-0.5, -1.02)} ${p(-1, -0.5)} ${p(-1, 0.1)} C ${p(-1, 0.78)} ${p(-0.45, 1.05)} ${p(0, 0.82)} C ${p(0.45, 1.05)} ${p(1, 0.78)} ${p(1, 0.1)} C ${p(1, -0.5)} ${p(0.5, -1.02)} ${p(0, -0.5)} Z`}
            fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={sw} strokeLinejoin="round"
          />
          <path d={`M ${p(0, -0.62)} Q ${p(0.12, -0.92)} ${p(0.3, -1)}`} fill="none" stroke={FIG.ink} strokeWidth={sw} strokeLinecap="round" />
          <ellipse cx={lx} cy={ly} rx={r2(r * 0.32)} ry={r2(r * 0.16)} fill={FIG.primary} transform={`rotate(-22 ${lx} ${ly})`} />
        </g>
      );
    }
    case 'duck':
      return (
        <g>
          <ellipse cx={r2(cx - r * 0.1)} cy={r2(cy + r * 0.3)} rx={r2(r * 0.9)} ry={r2(r * 0.55)} fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={sw} />
          <circle cx={r2(cx + r * 0.5)} cy={r2(cy - r * 0.45)} r={r2(r * 0.42)} fill={FIG.accent} stroke={FIG.accentDeep} strokeWidth={sw} />
          <polygon points={`${p(0.85, -0.55)} ${p(1.3, -0.36)} ${p(0.85, -0.2)}`} fill={FIG.accentDeep} />
          <circle cx={r2(cx + r * 0.52)} cy={r2(cy - r * 0.58)} r={r2(Math.max(0.6, r * 0.11))} fill={FIG.ink} />
        </g>
      );
    case 'fish':
      return (
        <g>
          <polygon points={`${p(-0.45, 0)} ${p(-1.05, -0.6)} ${p(-1.05, 0.6)}`} fill={FIG.primarySoft} stroke={FIG.primaryDeep} strokeWidth={sw} strokeLinejoin="round" />
          <ellipse cx={r2(cx + r * 0.18)} cy={r2(cy)} rx={r2(r * 0.85)} ry={r2(r * 0.55)} fill={FIG.primary} stroke={FIG.primaryDeep} strokeWidth={sw} />
          <circle cx={r2(cx + r * 0.6)} cy={r2(cy - r * 0.14)} r={r2(Math.max(0.6, r * 0.12))} fill={FIG.surface} />
        </g>
      );
    case 'leaf':
      return (
        <g>
          <path
            d={`M ${p(0, -1)} C ${p(1.15, -0.5)} ${p(1.1, 0.5)} ${p(0, 1)} C ${p(-1.1, 0.5)} ${p(-1.15, -0.5)} ${p(0, -1)} Z`}
            fill={FIG.primarySoft} stroke={FIG.primaryDeep} strokeWidth={sw} strokeLinejoin="round"
          />
          <path d={`M ${p(0, -0.85)} L ${p(0, 0.9)}`} stroke={FIG.primaryDeep} strokeWidth={sw} strokeLinecap="round" />
        </g>
      );
    case 'block':
      return (
        <g>
          <rect
            x={r2(cx - r * 0.82)} y={r2(cy - r * 0.72)} width={r2(r * 1.64)} height={r2(r * 1.5)}
            rx={r2(r * 0.12)} fill={FIG.accentSoft} stroke={FIG.accentDeep} strokeWidth={sw}
          />
          <path d={`M ${p(-0.82, -0.28)} L ${p(0.82, -0.28)}`} stroke={FIG.accentDeep} strokeWidth={sw} />
        </g>
      );
    case 'shell':
      return (
        <g>
          <path
            d={`M ${p(-1, 0.6)} A ${r2(r)} ${r2(r)} 0 0 1 ${p(1, 0.6)} Z`}
            fill={FIG.accentSoft} stroke={FIG.accentDeep} strokeWidth={sw} strokeLinejoin="round"
          />
          <path d={`M ${p(0, 0.6)} L ${p(-0.6, -0.16)}`} stroke={FIG.accentDeep} strokeWidth={sw} />
          <path d={`M ${p(0, 0.6)} L ${p(0, -0.4)}`} stroke={FIG.accentDeep} strokeWidth={sw} />
          <path d={`M ${p(0, 0.6)} L ${p(0.6, -0.16)}`} stroke={FIG.accentDeep} strokeWidth={sw} />
        </g>
      );
    case 'flower':
      return (
        <g>
          {PETAL_UNIT.map(([x, y], i) => {
            const [px, py] = at(x, y);
            return <circle key={i} cx={px} cy={py} r={r2(r * 0.44)} fill={FIG.accentSoft} stroke={FIG.accentDeep} strokeWidth={sw} />;
          })}
          <circle cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.34)} fill={FIG.accentDeep} />
        </g>
      );
    case 'ball':
      return (
        <g>
          <circle cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.92)} fill={FIG.primarySoft} stroke={FIG.primaryDeep} strokeWidth={sw} />
          <path d={`M ${p(-0.62, -0.68)} Q ${p(0.05, 0)} ${p(-0.62, 0.68)}`} fill="none" stroke={FIG.primaryDeep} strokeWidth={sw} />
          <path d={`M ${p(0.62, -0.68)} Q ${p(-0.05, 0)} ${p(0.62, 0.68)}`} fill="none" stroke={FIG.primaryDeep} strokeWidth={sw} />
        </g>
      );
    case 'dot':
    default:
      return <circle cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.88)} fill={FIG.primary} stroke={FIG.primaryDeep} strokeWidth={sw} />;
  }
}

export default function TenFrameFig({ params, size }: FigurePartProps<'ten-frame'>) {
  const ts = TS[size];
  const ls = LS[size];

  const frames = clamp(Math.round(params.frames ?? 1), 1, 2);
  // A five-frame is one row of five by convention; only the ten-frame is 2×5.
  const per = params.size === 5 ? 5 : 10;
  const cols = 5;
  const rowsN = per === 5 ? 1 : 2;
  const cap = per * frames;

  const filled = clamp(Math.round(params.filled ?? 0), 0, cap);
  const hidden = clamp(Math.round(params.hidden ?? 0), 0, cap - filled);
  // 'single' draws the hidden run as ONE cover with ONE '?', so the child cannot
  // answer "how many are hiding?" by counting covers (LEARNINGS L33).
  const singleCover = (params.coverStyle ?? 'cells') === 'single';
  const icon = (params.icon ?? 'dot') as Icon;

  const pad = 10;
  const gap = 20;
  const cell = Math.min(46, (W - 2 * pad - (frames - 1) * gap) / (frames * cols));
  const frameW = cell * cols;
  const frameH = cell * rowsN;
  const totalW = frames * frameW + (frames - 1) * gap;
  const x0 = (W - totalW) / 2;
  const y0 = pad;
  const H = r2(y0 + frameH + pad);

  const r = cell * 0.33;
  const coverId = defId('frame-cover', `${size}-${per}x${frames}`);

  const frameIdx = Array.from({ length: frames }, (_, i) => i);
  const cellIdx = Array.from({ length: per }, (_, i) => i);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      <defs>
        {/* The cover carries a texture as well as a tint so "covered" survives
            greyscale — an untextured soft cell reads as merely empty. */}
        <pattern id={coverId} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill={FIG.attentionSoft} />
          <line x1="0" y1="0" x2="0" y2="5" stroke={FIG.attention} strokeWidth={r2(0.8 * ls)} />
        </pattern>
      </defs>

      {frameIdx.map((f) => {
        const fx = x0 + f * (frameW + gap);
        return (
          <g key={`f${f}`}>
            <rect
              x={r2(fx)} y={r2(y0)} width={r2(frameW)} height={r2(frameH)} rx={r2(3)}
              fill={FIG.surface} stroke={FIG.ink} strokeWidth={r2(STROKE.base * ls)}
            />
            {[1, 2, 3, 4].map((c) => (
              <line
                key={`v${c}`}
                x1={r2(fx + c * cell)} y1={r2(y0)} x2={r2(fx + c * cell)} y2={r2(y0 + frameH)}
                stroke={FIG.inkMuted} strokeWidth={r2(STROKE.hair * ls)}
              />
            ))}
            {rowsN === 2 && (
              <line
                x1={r2(fx)} y1={r2(y0 + cell)} x2={r2(fx + frameW)} y2={r2(y0 + cell)}
                stroke={FIG.inkMuted} strokeWidth={r2(STROKE.hair * ls)}
              />
            )}

            {cellIdx.map((i) => {
              const gi = f * per + i;
              const cx = fx + (i % cols) * cell + cell / 2;
              const cy = y0 + Math.floor(i / cols) * cell + cell / 2;
              if (gi < filled) return <g key={`c${i}`}>{glyph(icon, cx, cy, r, ls)}</g>;
              if (gi < filled + hidden) {
                // Under 'single' only the FIRST hidden cell draws; it spans the
                // whole run, so there is nothing countable to count.
                const first = gi === filled;
                if (singleCover && !first) return null;
                const span = singleCover ? Math.min(hidden, cols - (i % cols)) : 1;
                return (
                  <g key={`c${i}`}>
                    <rect
                      x={r2(cx - cell / 2 + 2)} y={r2(cy - cell / 2 + 2)}
                      width={r2(cell * span - 4)} height={r2(cell - 4)} rx={r2(4)}
                      fill={`url(#${coverId})`} stroke={FIG.attention}
                      strokeWidth={r2(STROKE.thin * ls)} strokeDasharray="4 3"
                    />
                    {!singleCover && (
                      <circle
                        cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.88)} fill="none"
                        stroke={FIG.attention} strokeWidth={r2(STROKE.hair * ls)} strokeDasharray="2 3"
                      />
                    )}
                    <text
                      x={r2(cx + (cell * (span - 1)) / 2)} y={r2(cy)} textAnchor="middle" dominantBaseline="central"
                      fontFamily={FONT} fontSize={r2(Math.min(TEXT.large * ts, cell * 0.52))}
                      fontWeight={600} fill={FIG.attention}
                    >
                      ?
                    </text>
                  </g>
                );
              }
              return null;
            })}
          </g>
        );
      })}
    </svg>
  );
}
