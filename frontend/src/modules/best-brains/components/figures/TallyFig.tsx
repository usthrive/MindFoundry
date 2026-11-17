/**
 * Tally marks (2026-11-17). C7's bird-watch chart asked about "a full tally gate"
 * and drew five round counters — a tally gate is four upright strokes with one
 * across them, and that shape IS the five. Gates of five, then loose strokes;
 * rows of five gates.
 *
 * Pure function of its params: no randomness, no measurement.
 */
import type { ReactElement } from 'react';
import type { FigurePartProps } from './shared';
import { FIG, W, r2 } from './shared';

const STROKE_GAP = 9;
const GATE_GAP = 16;
const MARK_H = 36;
const ROW_H = 50;
const GATES_PER_ROW = 5;

export default function TallyFig({ params }: FigurePartProps<'tally'>) {
  const n = Math.max(0, Math.min(60, Math.round(params.count)));
  const gates = Math.floor(n / 5);
  const loose = n % 5;
  const units = gates + (loose ? 1 : 0);
  const rows = Math.max(1, Math.ceil(units / GATES_PER_ROW));
  const gateW = 3 * STROKE_GAP;
  const perRow = Math.min(GATES_PER_ROW, Math.max(1, units));
  const rowW = perRow * gateW + (perRow - 1) * GATE_GAP;
  const x0 = (W - rowW) / 2;
  const H = rows * ROW_H + 8;
  const out: ReactElement[] = [];
  for (let u = 0; u < units; u++) {
    const row = Math.floor(u / GATES_PER_ROW);
    const col = u % GATES_PER_ROW;
    const gx = x0 + col * (gateW + GATE_GAP);
    const top = 8 + row * ROW_H;
    const strokes = u < gates ? 4 : loose;
    for (let s = 0; s < strokes; s++) {
      const x = gx + s * STROKE_GAP;
      out.push(<line key={`${u}-${s}`} x1={r2(x)} y1={r2(top)} x2={r2(x)} y2={r2(top + MARK_H)} stroke={FIG.ink} strokeWidth={3} strokeLinecap="round" />);
    }
    if (u < gates) {
      out.push(
        <line key={`${u}-x`} x1={r2(gx - 6)} y1={r2(top + MARK_H - 6)} x2={r2(gx + gateW + 6)} y2={r2(top + 6)} stroke={FIG.accentDeep} strokeWidth={3} strokeLinecap="round" />,
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block', height: 'auto' }}>
      {out}
    </svg>
  );
}
