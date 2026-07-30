/**
 * US coin set (B1.0) — the B16 money picture, and the trap it exists to spring.
 *
 * The coins are drawn in TRUE relative proportion (mm diameters), because the
 * dime is the smallest coin on the table and worth more than the nickel beside
 * it: draw them the same size and "more coins ≠ more money" stops being visible
 * and becomes something a child has to be told. For the same reason a row sits
 * the coins on a shared baseline — a common bottom edge is what makes the size
 * order readable at a glance.
 *
 * Colour is doing real work here (copper penny vs silver coins) and is the one
 * hue distinction the module allows, so every denomination ALSO carries a rim
 * treatment and an inner-ring treatment that survive greyscale:
 *
 *   1¢   plain rim, solid inner ring      5¢   plain rim, no ring
 *   10¢  dotted rim                       25¢  milled rim
 *   50¢  milled rim, solid inner ring     $1   plain rim, dashed inner ring
 *
 * `arrangement:'scatter'` is the coins-jumbled-on-a-table picture, so its
 * offsets come out of the coin's index arithmetically — no randomness, ever
 * (the pure-function contract in `shared.ts`, and QG-13's ability to recompute
 * what the picture claims, both depend on it).
 */

import { FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps } from './shared';

/** Real US coin diameters in mm — the whole point of the figure. */
const COIN_MM: Record<number, number> = { 1: 19, 5: 21, 10: 18, 25: 24, 50: 30, 100: 26 };
const COIN_LABEL: Record<number, string> = {
  1: '1¢', 5: '5¢', 10: '10¢', 25: '25¢', 50: '50¢', 100: '$1',
};
const COIN_RIM: Record<number, 'plain' | 'dotted' | 'milled'> = {
  1: 'plain', 5: 'plain', 10: 'dotted', 25: 'milled', 50: 'milled', 100: 'plain',
};
const COIN_RING: Record<number, 'none' | 'solid' | 'dashed'> = {
  1: 'solid', 5: 'none', 10: 'none', 25: 'none', 50: 'solid', 100: 'dashed',
};

/** See PlaceValueChartFig: a physically small render needs relatively larger
 *  type and heavier strokes, so sm scales UP. `lg` earns the finer rim detail. */
const SCALE: Record<'sm' | 'md' | 'lg', { mm: number; type: number; stroke: number; ticks: number }> = {
  sm: { mm: 1.3, type: 1.12, stroke: 1.2, ticks: 12 },
  md: { mm: 1.15, type: 1, stroke: 1, ticks: 16 },
  lg: { mm: 1.05, type: 0.94, stroke: 0.95, ticks: 20 },
};

const PAD = 10;
const GAP_IN = 5;
const GAP_GROUP = 15;

interface Coin { cents: number; d: number }
interface Placed extends Coin { cx: number; cy: number }

function Face({ coin, cx, cy, showValue, ss, ts, ticks }: {
  coin: Coin; cx: number; cy: number; showValue: boolean;
  ss: number; ts: number; ticks: number;
}) {
  const r = coin.d / 2;
  const copper = coin.cents === 1;
  const edge = copper ? FIG.accentDeep : FIG.inkMuted;
  const rim = COIN_RIM[coin.cents] ?? 'plain';
  const ring = COIN_RING[coin.cents] ?? 'none';
  const label = COIN_LABEL[coin.cents] ?? '';
  const innerR = ring === 'none' ? r * 0.86 : r * 0.78;
  const font = showValue && label
    ? r2(Math.max(6, Math.min(TEXT.body * ts, (innerR * 1.7) / (label.length * 0.58))))
    : 0;

  const marks: JSX.Element[] = [];
  if (rim !== 'plain') {
    const count = rim === 'dotted' ? Math.round(ticks * 0.75) : ticks;
    for (let k = 0; k < count; k += 1) {
      const a = (k / count) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      marks.push(rim === 'dotted' ? (
        <circle
          key={k} cx={r2(cx + ca * r * 0.87)} cy={r2(cy + sa * r * 0.87)}
          r={r2(Math.max(0.7, r * 0.055))} fill={edge}
        />
      ) : (
        <line
          key={k}
          x1={r2(cx + ca * r * 0.82)} y1={r2(cy + sa * r * 0.82)}
          x2={r2(cx + ca * r * 0.98)} y2={r2(cy + sa * r * 0.98)}
          stroke={edge} strokeWidth={r2(STROKE.hair * ss)}
        />
      ));
    }
  }

  return (
    <g>
      <circle
        cx={r2(cx)} cy={r2(cy)} r={r2(r)}
        fill={copper ? FIG.accentSoft : FIG.fillSoft}
        stroke={edge} strokeWidth={r2(STROKE.base * ss)}
      />
      {marks}
      {ring !== 'none' && (
        <circle
          cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.76)} fill="none"
          stroke={edge} strokeWidth={r2(STROKE.thin * ss)}
          strokeDasharray={ring === 'dashed' ? `${r2(r * 0.22)} ${r2(r * 0.16)}` : undefined}
        />
      )}
      {font > 0 && (
        <text
          x={r2(cx)} y={r2(cy + font * 0.35)} fontSize={font} fontWeight={700}
          fill={FIG.ink} textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function CoinSetFig({ params, size }: FigurePartProps<'coin-set'>) {
  const cfg = SCALE[size];
  const entries = (params.coins ?? []).filter((c) => c && c.count > 0);
  const total = entries.reduce((a, c) => a + c.count, 0);

  // Proportions are fixed WITHIN the picture; the absolute scale is chosen so a
  // three-coin set still fills its box instead of sitting in it like a speck.
  const fill = total <= 2 ? 2.2 : total <= 4 ? 1.7 : total <= 8 ? 1.3 : 1;
  const mm = cfg.mm * fill;
  const dia = (cents: number) => r2((COIN_MM[cents] ?? 20) * mm);
  const maxD = entries.length ? Math.max(...entries.map((c) => dia(c.cents))) : 20;

  const maxW = W - PAD * 2;
  const showValues = params.showValues ?? true;
  const scatter = (params.arrangement ?? 'row') === 'scatter';

  const placed: Placed[] = [];
  let H = maxD + PAD * 2;

  if (scatter) {
    // Jumbled by construction: take one coin from each entry in turn, so
    // denominations interleave without a shuffle.
    const order: number[] = [];
    const left = entries.map((c) => c.count);
    for (let pass = 0; order.length < total; pass += 1) {
      let moved = false;
      for (let i = 0; i < entries.length; i += 1) {
        if (left[i] > 0) { left[i] -= 1; order.push(entries[i].cents); moved = true; }
      }
      if (!moved) break;
      if (pass > total) break;
    }

    const cellW = maxD + 12;
    const cellH = maxD + 12;
    const cols = Math.max(1, Math.min(order.length, Math.floor(maxW / cellW)));
    const rows = Math.max(1, Math.ceil(order.length / cols));
    H = r2(rows * cellH + PAD * 2);
    const gridX = PAD + (maxW - cols * cellW) / 2;

    order.forEach((cents, i) => {
      const d = dia(cents);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, order.length - row * cols);
      const rowX = gridX + ((cols - inRow) * cellW) / 2;
      // Offsets derived from the index alone — the same set always lands the
      // same way, which is what makes the picture re-checkable.
      const jx = ((i * 5 + 3) % 7) - 3;
      const jy = ((i * 3 + 1) % 5) - 2;
      const slackX = Math.max(0, (cellW - d) / 2);
      const slackY = Math.max(0, (cellH - d) / 2);
      const cx = rowX + col * cellW + cellW / 2 + (jx * slackX) / 3;
      const cy = PAD + row * cellH + cellH / 2 + (jy * slackY) / 2;
      placed.push({
        cents, d,
        cx: Math.min(W - PAD - d / 2, Math.max(PAD + d / 2, cx)),
        cy,
      });
    });
  } else {
    // 'row' = the counting strategy the week teaches: highest value first, all
    // of a kind together, so a child counts 25, 50, 60, 61, 62 rather than
    // hunting across the table.
    const byCents = new Map<number, number>();
    for (const c of entries) byCents.set(c.cents, (byCents.get(c.cents) ?? 0) + c.count);
    const groups = [...byCents.entries()].sort((a, b) => b[0] - a[0]);

    const rows: Array<Array<Coin & { x: number }>> = [[]];
    let x = 0;
    groups.forEach(([cents, count], gi) => {
      for (let i = 0; i < count; i += 1) {
        const d = dia(cents);
        let row = rows[rows.length - 1];
        let lead = row.length === 0 ? 0 : (i === 0 && gi > 0 ? GAP_GROUP : GAP_IN);
        if (row.length > 0 && x + lead + d > maxW) {
          rows.push([]); row = rows[rows.length - 1]; x = 0; lead = 0;
        }
        row.push({ cents, d, x: x + lead });
        x += lead + d;
      }
    });

    let y = PAD;
    for (const row of rows) {
      if (!row.length) continue;
      const rowD = Math.max(...row.map((c) => c.d));
      const rowW = Math.max(...row.map((c) => c.x + c.d));
      const offX = PAD + (maxW - rowW) / 2;
      for (const c of row) {
        // Bottom-aligned: a shared baseline is what makes 18mm vs 21mm read.
        placed.push({ cents: c.cents, d: c.d, cx: offX + c.x + c.d / 2, cy: y + rowD - c.d / 2 });
      }
      y += rowD + 12;
    }
    H = r2(Math.max(maxD + PAD * 2, y - 12 + PAD));
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${r2(H)}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      <g fontFamily={FONT}>
        {placed.map((c, i) => (
          <Face
            key={i}
            coin={{ cents: c.cents, d: c.d }}
            cx={c.cx} cy={c.cy}
            showValue={showValues}
            ss={cfg.stroke} ts={cfg.type} ticks={cfg.ticks}
          />
        ))}
      </g>
    </svg>
  );
}
