/**
 * Coordinate grid — D22 (first quadrant) and E7 (four quadrants, reflections).
 *
 * Two layouts fall out of the same code because the only thing that changes is
 * where the axes land: with xMin=0 they ARE the left and bottom edges, with a
 * negative min they cross the middle. The axes are always drawn heavier than
 * the gridlines (a child reading (3,7) must see which two lines to count from),
 * and the numbers live OUTSIDE the plot so they never sit under a plotted dot.
 *
 * Point labels are placed by a small deterministic search — no measurement, no
 * randomness — because a label lying on an axis or on a neighbouring dot is the
 * fastest way to make a hidden-picture task (D22/E7) unreadable.
 */

import { FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps } from './shared';

type Box = { x: number; y: number; w: number; h: number };

function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Smaller renders need relatively fatter strokes and bigger type to stay legible. */
function scaleFor(size: 'sm' | 'md' | 'lg'): number {
  return size === 'sm' ? 1.2 : size === 'lg' ? 0.95 : 1;
}

/** Kill float drift so 0.1 steps print as "0.3", not "0.30000000000000004". */
function tidy(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/** Text advance estimate — good enough to keep labels apart, and pure. */
function textWidth(text: string, fs: number): number {
  return text.length * fs * 0.58 + 4;
}

export default function CoordinateGridFig({ params, size }: FigurePartProps<'coordinate-grid'>) {
  const s = scaleFor(size);
  const { xMin, xMax, yMin, yMax } = params;
  const step = params.step && params.step > 0 ? params.step : 1;
  const showAxisLabels = params.showAxisLabels ?? true;
  const fs = r2(TEXT.small * s);

  const nx = Math.max(1, Math.round((xMax - xMin) / step));
  const ny = Math.max(1, Math.round((yMax - yMin) / step));

  const padL = r2(24 * s + 10);
  const padB = r2(20 * s + 10);
  const padT = 14;
  const padR = 16;

  // Cells stay square (a stretched grid teaches a false distance) and are capped
  // so a 2×2 grid does not blow up to fill the width.
  const availW = W - padL - padR;
  const cell = Math.min(availW / nx, 56, 300 / ny);
  const plotW = cell * nx;
  const plotH = cell * ny;
  const x0 = r2(padL + (availW - plotW) / 2);
  const y0 = padT;
  const H = r2(padT + plotH + padB);

  const sx = (v: number) => r2(x0 + ((v - xMin) / (xMax - xMin)) * plotW);
  const sy = (v: number) => r2(y0 + plotH - ((v - yMin) / (yMax - yMin)) * plotH);

  const hasXAxis = yMin <= 0 && yMax >= 0;
  const hasYAxis = xMin <= 0 && xMax >= 0;
  const axisY = hasXAxis ? sy(0) : null;
  const axisX = hasYAxis ? sx(0) : null;
  const showOrigin = showAxisLabels && hasXAxis && hasYAxis;

  // Thin the number rows when the cells are too tight for the type to fit.
  const every = cell >= 22 * s ? 1 : cell >= 13 * s ? 2 : 5;

  const placed: Box[] = [];

  const gridlines: JSX.Element[] = [];
  for (let i = 0; i <= nx; i += 1) {
    const x = sx(tidy(xMin + i * step));
    gridlines.push(
      <line key={`gx${i}`} x1={x} y1={y0} x2={x} y2={r2(y0 + plotH)} stroke={FIG.line} strokeWidth={r2(STROKE.hair * s)} />,
    );
  }
  for (let i = 0; i <= ny; i += 1) {
    const y = sy(tidy(yMin + i * step));
    gridlines.push(
      <line key={`gy${i}`} x1={x0} y1={y} x2={r2(x0 + plotW)} y2={y} stroke={FIG.line} strokeWidth={r2(STROKE.hair * s)} />,
    );
  }

  const axisNumbers: JSX.Element[] = [];
  if (showAxisLabels) {
    const yRow = r2(y0 + plotH + fs * 0.8 + 6);
    for (let i = 0; i <= nx; i += 1) {
      if (i % every !== 0 && i !== nx) continue;
      const v = tidy(xMin + i * step);
      if (v === 0 && showOrigin) continue;
      axisNumbers.push(
        <text
          key={`lx${i}`}
          x={sx(v)}
          y={yRow}
          fill={FIG.inkMuted}
          fontFamily={FONT}
          fontSize={fs}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {v}
        </text>,
      );
    }
    const xCol = r2(x0 - 6);
    for (let i = 0; i <= ny; i += 1) {
      if (i % every !== 0 && i !== ny) continue;
      const v = tidy(yMin + i * step);
      if (v === 0 && showOrigin) continue;
      axisNumbers.push(
        <text
          key={`ly${i}`}
          x={xCol}
          y={sy(v)}
          fill={FIG.inkMuted}
          fontFamily={FONT}
          fontSize={fs}
          textAnchor="end"
          dominantBaseline="central"
        >
          {v}
        </text>,
      );
    }
    if (showOrigin) {
      axisNumbers.push(
        <text
          key="l0"
          x={r2((axisX ?? x0) - 6)}
          y={r2((axisY ?? y0 + plotH) + fs * 0.8 + 6)}
          fill={FIG.inkMuted}
          fontFamily={FONT}
          fontSize={fs}
          textAnchor="end"
          dominantBaseline="central"
        >
          0
        </text>,
      );
    }
  }

  const segments = params.segments ?? [];
  const points = params.points ?? [];
  const dotR = r2(5 * s);

  // Every dot is reserved before any label is placed, so a label can never be
  // pushed onto a point drawn after it.
  for (const p of points) {
    placed.push({ x: sx(p.x) - dotR - 2, y: sy(p.y) - dotR - 2, w: dotR * 2 + 4, h: dotR * 2 + 4 });
  }

  const segmentLabels: JSX.Element[] = [];
  segments.forEach((seg, i) => {
    if (!seg.label) return;
    const ax = sx(seg.from[0]);
    const ay = sy(seg.from[1]);
    const bx = sx(seg.to[0]);
    const by = sy(seg.to[1]);
    const len = Math.hypot(bx - ax, by - ay) || 1;
    // Offset along the normal, always to the upper side, so the label rides
    // beside the segment rather than on it.
    const nxv = -(by - ay) / len;
    const nyv = (bx - ax) / len;
    const flip = nyv > 0 ? -1 : 1;
    const off = 8 * s + fs * 0.5;
    const lx = r2((ax + bx) / 2 + nxv * off * flip);
    const ly = r2((ay + by) / 2 + nyv * off * flip);
    const w = textWidth(seg.label, fs);
    placed.push({ x: lx - w / 2, y: ly - fs * 0.6, w, h: fs * 1.2 });
    segmentLabels.push(
      <text
        key={`sl${i}`}
        x={lx}
        y={ly}
        fill={FIG.primaryDeep}
        fontFamily={FONT}
        fontSize={fs}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {seg.label}
      </text>,
    );
  });

  const pointLabels: JSX.Element[] = [];
  points.forEach((p, i) => {
    if (!p.label) return;
    const px = sx(p.x);
    const py = sy(p.y);
    const w = textWidth(p.label, fs);
    const h = fs * 1.2;
    const g = dotR + 6;
    const cands: Array<[number, number, 'start' | 'end' | 'middle']> = [
      [g, -g, 'start'],
      [-g, -g, 'end'],
      [g, g, 'start'],
      [-g, g, 'end'],
      [0, -(g + fs * 0.6), 'middle'],
      [0, g + fs * 0.6, 'middle'],
    ];
    let chosen = cands[0];
    for (const c of cands) {
      const [dx, dy, anchor] = c;
      const bx = anchor === 'start' ? px + dx : anchor === 'end' ? px + dx - w : px + dx - w / 2;
      const box: Box = { x: bx, y: py + dy - h / 2, w, h };
      if (box.x < 2 || box.x + box.w > W - 2 || box.y < 2 || box.y + box.h > H - 2) continue;
      if (axisY !== null && box.y < axisY + 1 && box.y + box.h > axisY - 1) continue;
      if (axisX !== null && box.x < axisX + 1 && box.x + box.w > axisX - 1) continue;
      if (placed.some((q) => overlaps(box, q))) continue;
      chosen = c;
      break;
    }
    const [dx, dy, anchor] = chosen;
    const bx = anchor === 'start' ? px + dx : anchor === 'end' ? px + dx - w : px + dx - w / 2;
    placed.push({ x: bx, y: py + dy - h / 2, w, h });
    pointLabels.push(
      <text
        key={`pl${i}`}
        x={r2(px + dx)}
        y={r2(py + dy)}
        fill={FIG.ink}
        fontFamily={FONT}
        fontSize={fs}
        textAnchor={anchor}
        dominantBaseline="central"
      >
        {p.label}
      </text>,
    );
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
      <rect x={x0} y={y0} width={r2(plotW)} height={r2(plotH)} fill={FIG.surface} />
      {gridlines}

      {axisY !== null && (
        <line x1={x0} y1={axisY} x2={r2(x0 + plotW)} y2={axisY} stroke={FIG.ink} strokeWidth={r2(STROKE.base * s)} />
      )}
      {axisX !== null && (
        <line x1={axisX} y1={y0} x2={axisX} y2={r2(y0 + plotH)} stroke={FIG.ink} strokeWidth={r2(STROKE.base * s)} />
      )}

      {axisNumbers}

      {segments.map((seg, i) => (
        <line
          key={`sg${i}`}
          x1={sx(seg.from[0])}
          y1={sy(seg.from[1])}
          x2={sx(seg.to[0])}
          y2={sy(seg.to[1])}
          stroke={FIG.primary}
          strokeWidth={r2(STROKE.base * s)}
          strokeLinecap="round"
        />
      ))}
      {segmentLabels}

      {points.map((p, i) => {
        const px = sx(p.x);
        const py = sy(p.y);
        const style = p.style ?? 'point';
        if (style === 'open') {
          return (
            <circle
              key={`pt${i}`}
              cx={px}
              cy={py}
              r={dotR}
              fill={FIG.surface}
              stroke={FIG.primaryDeep}
              strokeWidth={r2(STROKE.bold * s)}
            />
          );
        }
        if (style === 'unknown') {
          return (
            <g key={`pt${i}`}>
              <circle
                cx={px}
                cy={py}
                r={r2(dotR * 1.7)}
                fill={FIG.attentionSoft}
                stroke={FIG.attention}
                strokeWidth={r2(STROKE.thin * s)}
                strokeDasharray={`${r2(3 * s)} ${r2(3 * s)}`}
              />
              <text
                x={px}
                y={py}
                fill={FIG.attention}
                fontFamily={FONT}
                fontSize={r2(TEXT.body * s)}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
              >
                ?
              </text>
            </g>
          );
        }
        if (style === 'flag') {
          const top = r2(py - 20 * s);
          return (
            <g key={`pt${i}`}>
              <line x1={px} y1={py} x2={px} y2={top} stroke={FIG.accentDeep} strokeWidth={r2(STROKE.base * s)} />
              <path
                d={`M ${px} ${top} L ${r2(px + 16 * s)} ${r2(top + 5 * s)} L ${px} ${r2(top + 10 * s)} Z`}
                fill={FIG.accentSoft}
                stroke={FIG.accentDeep}
                strokeWidth={r2(STROKE.thin * s)}
              />
              <circle cx={px} cy={py} r={r2(dotR * 0.7)} fill={FIG.accentDeep} />
            </g>
          );
        }
        return (
          <circle
            key={`pt${i}`}
            cx={px}
            cy={py}
            r={dotR}
            fill={FIG.primaryDeep}
            stroke={FIG.surface}
            strokeWidth={r2(STROKE.thin * s)}
          />
        );
      })}
      {pointLabels}
    </svg>
  );
}
