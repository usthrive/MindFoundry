/**
 * Base-ten blocks — flats, rods and loose ones.
 *
 * THE ONE STRUCTURAL COMMITMENT: a rod is drawn as a single fused piece with ten
 * SCORED divisions, never as ten separate cubes sitting in a line. That is the
 * entire concept of B2. A child who can still see ten independent cubes has not
 * been shown a ten; they have been shown ten ones arranged tidily, which is the
 * misconception the lesson exists to defeat. The score lines say "this was ten
 * and it remembers being ten", while the unbroken outline says "it is one thing
 * now".
 *
 * The loose ones carry the SAME cube glyph as a rod's segment, at the same size,
 * so the eye can see that nothing was resized in the trade — only regrouped.
 */

import type { ReactElement } from 'react';
import {
  FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps, type FigureSize,
} from './shared';
import type { BaseTenState } from '../../figures/types';

const TS: Record<FigureSize, number> = { sm: 0.94, md: 1, lg: 1.1 };
const LS: Record<FigureSize, number> = { sm: 0.85, md: 1, lg: 1.2 };

/** One ones-cube, the unit every other piece is built from. */
const U = 13;

function stateValue(s: BaseTenState): number {
  return (s.flats ?? 0) * 100 + s.rods * 10 + s.ones;
}

/** Width one state occupies, so two states can be centred as a pair. */
function stateWidth(s: BaseTenState): number {
  const flats = s.flats ?? 0;
  const rodCols = s.rods;
  const oneCols = Math.min(5, Math.max(s.ones, 0));
  return flats * (U * 10 + 8) + rodCols * (U + 5) + (oneCols ? oneCols * (U + 3) + 10 : 0) + 4;
}

export default function BaseTenBlocksFig({ params, size }: FigurePartProps<'base-ten-blocks'>) {
  const ts = TS[size];
  const ls = LS[size];
  const sw = r2(STROKE.thin * ls);

  const states: BaseTenState[] = params.then ? [params.state, params.then] : [params.state];
  const connector = params.connector ?? 'becomes';
  const highlight = params.highlight ?? 'none';
  const showNumeral = params.showNumeral ?? false;
  const showColumns = params.showColumns ?? false;

  const GAP = params.then ? 46 : 0;
  const widths = states.map(stateWidth);
  const totalW = widths.reduce((a, b) => a + b, 0) + GAP * (states.length - 1);
  const scale = Math.min(1, (W - 24) / Math.max(totalW, 1));

  const labelRow = states.some((s) => s.label) || showNumeral;
  const colRow = showColumns ? 20 : 0;
  const bodyH = U * 10 + 16;
  const H = r2(colRow + bodyH + (labelRow ? 26 : 8));

  const y0 = colRow + 8;
  const baseY = y0 + U * 10; // pieces sit on a common floor
  let cursor = (W - totalW * scale) / 2;

  const parts: ReactElement[] = [];

  states.forEach((s, si) => {
    const sx = cursor;
    let x = sx;

    // --- hundreds flats ---
    for (let f = 0; f < (s.flats ?? 0); f++) {
      const fw = U * 10 * scale;
      parts.push(
        <g key={`f${si}-${f}`}>
          <rect
            x={r2(x)} y={r2(baseY - U * 10 * scale)} width={r2(fw)} height={r2(fw)}
            fill={FIG.primarySoft} stroke={FIG.primaryDeep} strokeWidth={sw} rx={r2(1.5)}
          />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <line
                x1={r2(x)} y1={r2(baseY - U * 10 * scale + (i + 1) * U * scale)}
                x2={r2(x + fw)} y2={r2(baseY - U * 10 * scale + (i + 1) * U * scale)}
                stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.hair * ls * 0.7)}
              />
              <line
                x1={r2(x + (i + 1) * U * scale)} y1={r2(baseY - U * 10 * scale)}
                x2={r2(x + (i + 1) * U * scale)} y2={r2(baseY)}
                stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.hair * ls * 0.7)}
              />
            </g>
          ))}
        </g>,
      );
      x += fw + 8 * scale;
    }

    // --- tens rods: ONE fused piece, ten scored divisions ---
    const rodOn = highlight === 'rods';
    for (let rIdx = 0; rIdx < s.rods; rIdx++) {
      const rw = U * scale;
      const rh = U * 10 * scale;
      parts.push(
        <g key={`r${si}-${rIdx}`}>
          <rect
            x={r2(x)} y={r2(baseY - rh)} width={r2(rw)} height={r2(rh)}
            fill={FIG.primary} stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.base * ls)} rx={r2(2)}
          />
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1={r2(x)} y1={r2(baseY - rh + (i + 1) * U * scale)}
              x2={r2(x + rw)} y2={r2(baseY - rh + (i + 1) * U * scale)}
              stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.hair * ls * 0.8)}
            />
          ))}
          {rodOn && (
            <rect
              x={r2(x - 2)} y={r2(baseY - rh - 2)} width={r2(rw + 4)} height={r2(rh + 4)}
              fill="none" stroke={FIG.attention} strokeWidth={r2(STROKE.thin * ls)}
              strokeDasharray="4 3" rx={r2(3)}
            />
          )}
        </g>,
      );
      x += rw + 5 * scale;
    }

    // --- loose ones, stacked five to a column so ten never reads as a rod ---
    if (s.ones > 0) {
      x += 8 * scale;
      const onesOn = highlight === 'ones';
      const cols = Math.ceil(s.ones / 5);
      const oxStart = x;
      for (let i = 0; i < s.ones; i++) {
        const c = Math.floor(i / 5);
        const rIn = i % 5;
        const cx = x + c * (U + 3) * scale;
        const cy = baseY - (rIn + 1) * (U + 2) * scale;
        parts.push(
          <rect
            key={`o${si}-${i}`}
            x={r2(cx)} y={r2(cy)} width={r2(U * scale)} height={r2(U * scale)}
            fill={FIG.accentSoft} stroke={FIG.accentDeep} strokeWidth={sw} rx={r2(2)}
          />,
        );
      }
      if (onesOn) {
        const rows = Math.min(5, s.ones);
        parts.push(
          <rect
            key={`oh${si}`}
            x={r2(oxStart - 3)} y={r2(baseY - rows * (U + 2) * scale - 3)}
            width={r2(cols * (U + 3) * scale + 6)} height={r2(rows * (U + 2) * scale + 6)}
            fill="none" stroke={FIG.attention} strokeWidth={r2(STROKE.thin * ls)}
            strokeDasharray="4 3" rx={r2(4)}
          />,
        );
      }
      x += cols * (U + 3) * scale;
    }

    // --- label / numeral under the state ---
    const centre = (sx + x) / 2;
    if (s.label || showNumeral) {
      const text = s.label ?? String(stateValue(s));
      parts.push(
        <text
          key={`l${si}`} x={r2(centre)} y={r2(baseY + 18)} textAnchor="middle"
          fontFamily={FONT} fontSize={r2(TEXT.large * ts)} fontWeight={700} fill={FIG.ink}
        >
          {text}
        </text>,
      );
    }

    // --- tens | ones column headers ---
    if (showColumns) {
      parts.push(
        <text
          key={`ch${si}`} x={r2(centre)} y={r2(12)} textAnchor="middle"
          fontFamily={FONT} fontSize={r2(TEXT.small * ts)} fontWeight={600} fill={FIG.inkMuted}
        >
          tens | ones
        </text>,
      );
    }

    cursor = x + GAP * scale;

    // --- connector between states ---
    if (si === 0 && states.length === 2) {
      const ax = x + (GAP * scale) / 2;
      const ay = baseY - (U * 10 * scale) / 2;
      if (connector === 'becomes') {
        parts.push(
          <g key="arrow">
            <line
              x1={r2(ax - 13)} y1={r2(ay)} x2={r2(ax + 11)} y2={r2(ay)}
              stroke={FIG.ink} strokeWidth={r2(STROKE.base * ls)} strokeLinecap="round"
            />
            <polygon
              points={`${r2(ax + 15)},${r2(ay)} ${r2(ax + 6)},${r2(ay - 5)} ${r2(ax + 6)},${r2(ay + 5)}`}
              fill={FIG.ink}
            />
          </g>,
        );
      }
    }
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      {parts}
    </svg>
  );
}
