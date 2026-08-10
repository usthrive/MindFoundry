/**
 * Loose counters — counting arrangements (A1/A2), join and take-away story
 * pictures (A14/A16), and the two discriminations those lessons hang on.
 *
 * `scatter` exists to break the row: A1's conservation trap is the SAME count
 * spread out, so the offsets are a fixed low-discrepancy sequence — not random,
 * not merely "unseeded random". A picture that reshuffles between renders would
 * be arguing with the item it illustrates.
 *
 * `compare` is A5's entire lesson and is therefore a layout, not a decoration:
 * the two rows are drawn on a shared pitch with each counter above its partner —
 * unless a row asks for a `spread`, which multiplies ITS spacing only. That is
 * how "a long row of 5 beside a tight row of 6" becomes drawable: without it,
 * one pitch was derived from the longest row and every row began at the same
 * left edge, so more counters always meant more width and A5's conservation
 * trap could not be posed at all. Counter size is unchanged by spread.
 * The pairing threads and the ring around the leftovers are OPT-IN
 * (`showPairs` / `markExtra`), because drawing them performs the matching the
 * child is being asked to perform — a scaffold placed under the exact step
 * being assessed removes the assessment (LEARNINGS L33). Turn them on to model
 * the strategy in a lesson script; leave them off on anything that asks.
 */

import type { ReactElement } from 'react';
import {
  FIG, STROKE, TEXT, FONT, W, r2, defId,
  type FigurePartProps, type FigureSize,
} from './shared';

const TS: Record<FigureSize, number> = { sm: 0.94, md: 1, lg: 1.1 };
const LS: Record<FigureSize, number> = { sm: 0.85, md: 1, lg: 1.2 };

type Params = FigurePartProps<'counters'>['params'];
type Icon = NonNullable<Params['groups'][number]['icon']>;
type Arrangement = NonNullable<Params['arrangement']>;

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
 * Duplicated in TenFrameFig: the two primitives are the only consumers and
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

/** Taken-away counters stay fully drawn and legible — the strike is the claim. */
function strike(cx: number, cy: number, r: number, ls: number, k: number): ReactElement {
  return (
    <path
      key={`x${k}`}
      d={`M ${r2(cx - r * 1.2)},${r2(cy + r * 1.2)} L ${r2(cx + r * 1.2)},${r2(cy - r * 1.2)}`}
      stroke={FIG.attention} strokeWidth={r2(STROKE.bold * ls)} strokeLinecap="round"
    />
  );
}

interface Pt { x: number; y: number }
interface Box { pts: Pt[]; w: number; h: number }

/** Plastic-number pair — even coverage without clumps, and the same every time. */
const SEQ_X = 0.7548776662466927;
const SEQ_Y = 0.5698402909980533;

/** Counter centres in box-local coordinates. Every size here is linear in pitch. */
function layout(n: number, arrangement: Arrangement, pitch: number): Box {
  const pts: Pt[] = [];
  if (n <= 0) return { pts, w: 0, h: pitch };

  switch (arrangement) {
    case 'rows': {
      // 'rows' is a REQUEST for more than one row: the prompt that asks for it
      // says "in two rows", and a single row of six standing beside that
      // sentence is the picture disagreeing with the words. Two rows until the
      // count outgrows them, then wrap at six.
      const per = n <= 1 ? 1 : Math.min(6, Math.ceil(n / 2));
      const rowsN = Math.ceil(n / per);
      for (let i = 0; i < n; i++) {
        pts.push({ x: ((i % per) + 0.5) * pitch, y: (Math.floor(i / per) + 0.5) * pitch });
      }
      return { pts, w: per * pitch, h: rowsN * pitch };
    }
    case 'scatter': {
      const w = Math.max(2.6, Math.sqrt(n) * 1.7) * pitch;
      const h = Math.max(2, Math.sqrt(n) * 1.15) * pitch;
      const m = pitch * 0.55;
      for (let i = 0; i < n; i++) {
        pts.push({
          x: m + ((0.5 + (i + 1) * SEQ_X) % 1) * (w - 2 * m),
          y: m + ((0.5 + (i + 1) * SEQ_Y) % 1) * (h - 2 * m),
        });
      }
      return { pts, w, h };
    }
    case 'ring': {
      const rad = Math.max(pitch * 0.8, (n * pitch) / (2 * Math.PI));
      const s = 2 * rad + pitch;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        pts.push({ x: s / 2 + Math.cos(a) * rad, y: s / 2 + Math.sin(a) * rad });
      }
      return { pts, w: s, h: s };
    }
    case 'stack': {
      const perCol = 6;
      const colsN = Math.ceil(n / perCol);
      const h = Math.min(n, perCol) * pitch;
      for (let i = 0; i < n; i++) {
        pts.push({ x: (Math.floor(i / perCol) + 0.5) * pitch, y: h - ((i % perCol) + 0.5) * pitch });
      }
      return { pts, w: colsN * pitch, h };
    }
    case 'row':
    default:
      for (let i = 0; i < n; i++) pts.push({ x: (i + 0.5) * pitch, y: pitch / 2 });
      return { pts, w: n * pitch, h: pitch };
  }
}

export default function CountersFig({ params, size }: FigurePartProps<'counters'>) {
  const ts = TS[size];
  const ls = LS[size];

  const groups = params.groups ?? [];
  const arrangement: Arrangement = params.arrangement ?? 'row';
  const relation = params.relation ?? 'none';
  // Both scaffolds default OFF: each performs part of what the child is asked
  // to do, so they are opted into for MODELLING, never inherited by an item.
  const showPairs = params.showPairs ?? false;
  const markExtra = params.markExtra ?? false;
  const total = groups.reduce((a, g) => a + Math.max(0, Math.round(g.count)), 0);
  const crossed = clamp(Math.round(params.crossedOut ?? 0), 0, total);
  const firstCrossed = total - crossed;
  const hasLabel = groups.some((g) => !!g.label);

  // Def ids track everything that changes what the def draws, so two counter
  // figures on one page never share one and a re-render never churns it.
  const key = `${size}-${arrangement}-${relation}-${crossed}-${groups
    .map((g) => `${g.count}${g.icon ?? 'dot'}`)
    .join('.')}`.replace(/[^a-zA-Z0-9]+/g, '-');
  const arrowId = defId('counter-arrow', key);

  const svgProps = {
    width: '100%',
    preserveAspectRatio: 'xMidYMid meet',
    'aria-hidden': true as const,
    focusable: 'false' as const,
    style: { display: 'block', height: 'auto' } as const,
  };

  const arrowDef = (
    <marker
      id={arrowId} viewBox="0 0 10 10" refX="9" refY="5"
      markerWidth="5" markerHeight="5" orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 Z" fill={FIG.attention} />
    </marker>
  );

  // ---- compare: rows stacked on a shared pitch, partner above partner -------
  if (relation === 'compare' && groups.length >= 2) {
    const gutter = hasLabel ? 62 : 12;
    // Per-row spacing multiplier (default 1). A row's WIDTH is count x pitch x
    // spread, so the frame has to be sized against the widest SCALED row, not
    // the longest one — with spread the two can be different rows, which is the
    // entire point of A5's trap.
    const spreadOf = (j: number) => Math.max(0.2, groups[j].spread ?? 1);
    const maxSpan = Math.max(1, ...groups.map((g, j) => Math.max(0, g.count) * spreadOf(j)));
    const pitch = Math.min(26, (W - gutter - 14) / maxSpan);
    // Counter SIZE stays tied to the unscaled pitch, so a spread row has the same
    // counters further apart rather than bigger ones. See CountersParams.spread.
    const r = pitch * 0.36;
    const rowGap = Math.max(14, pitch * 0.6);
    const top = 12;
    const rowY = (j: number) => top + pitch / 2 + j * (pitch + rowGap);
    /** Cell width for row j — pitch when unspread, so existing figures are unmoved. */
    const cell = (j: number) => pitch * spreadOf(j);
    const cx = (j: number, i: number) => gutter + (i + 0.5) * cell(j);
    const H = r2(top + groups.length * pitch + (groups.length - 1) * rowGap + 12);

    const starts: number[] = [];
    let run = 0;
    for (const g of groups) { starts.push(run); run += Math.max(0, Math.round(g.count)); }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...svgProps}>
        {/* one-to-one threads first, so the counters sit on top of them */}
        {showPairs && groups.slice(0, -1).map((g, j) => {
          const pair = Math.min(g.count, groups[j + 1].count);
          return Array.from({ length: Math.max(0, pair) }, (_, i) => (
            <line
              key={`p${j}-${i}`}
              // Slants when the two rows are spread differently — which is what a
              // one-to-one match across unequal spacings actually looks like.
              x1={r2(cx(j, i))} y1={r2(rowY(j) + r + 2)}
              x2={r2(cx(j + 1, i))} y2={r2(rowY(j + 1) - r - 2)}
              stroke={FIG.inkFaint} strokeWidth={r2(STROKE.hair * ls)} strokeDasharray="3 3"
            />
          ));
        })}

        {/* The leftovers ARE the answer A5 is asking for, so this is opt-in:
            a picture that rings them has solved the problem for the child. */}
        {markExtra && groups.slice(0, -1).map((g, j) => {
          const a = Math.max(0, g.count);
          const b = Math.max(0, groups[j + 1].count);
          if (a === b) return null;
          const longer = a > b ? j : j + 1;
          const from = Math.min(a, b);
          const to = Math.max(a, b);
          return (
            <rect
              key={`x${j}`}
              // The leftovers live in the row with the larger COUNT, so the ring
              // is measured in that row's own cell width.
              x={r2(cx(longer, from) - cell(longer) / 2 + 1)} y={r2(rowY(longer) - pitch / 2 - 1)}
              width={r2((to - from) * cell(longer) - 2)} height={r2(pitch + 2)} rx={r2(4)}
              fill="none" stroke={FIG.attention} strokeWidth={r2(STROKE.thin * ls)} strokeDasharray="5 3"
            />
          );
        })}

        {groups.map((g, j) => {
          const n = Math.max(0, Math.round(g.count));
          const icon = (g.icon ?? 'dot') as Icon;
          return (
            <g key={`g${j}`}>
              {g.label && (
                <text
                  x={r2(gutter - 8)} y={r2(rowY(j))} textAnchor="end" dominantBaseline="central"
                  fontFamily={FONT} fontSize={r2(TEXT.small * ts)} fill={FIG.inkMuted}
                >
                  {g.label}
                </text>
              )}
              {Array.from({ length: n }, (_, i) => (
                <g key={`c${i}`}>{glyph(icon, cx(j, i), rowY(j), r, ls)}</g>
              ))}
              {Array.from({ length: n }, (_, i) => starts[j] + i)
                .filter((gi) => crossed > 0 && gi >= firstCrossed)
                .map((gi) => strike(cx(j, gi - starts[j]), rowY(j), r, ls, gi))}
            </g>
          );
        })}
      </svg>
    );
  }

  // ---- everything else: group boxes laid side by side ----------------------
  const gap = relation === 'join' || relation === 'remove' ? 36 : 20;
  const availW = W - 20;
  let pitch = 24;
  let boxes = groups.map((g) => layout(Math.max(0, Math.round(g.count)), arrangement, pitch));
  let totalW = boxes.reduce((a, b) => a + b.w, 0) + gap * Math.max(0, groups.length - 1);
  if (totalW > availW && totalW > 0) {
    // Every layout is linear in pitch, so one shrink puts the whole row in frame.
    pitch = (pitch * availW) / totalW;
    boxes = groups.map((g) => layout(Math.max(0, Math.round(g.count)), arrangement, pitch));
    totalW = boxes.reduce((a, b) => a + b.w, 0) + gap * Math.max(0, groups.length - 1);
  }
  const r = pitch * 0.36;

  const takeAway = relation === 'remove' && crossed > 0 && groups.length === 1;
  const top = 10 + (takeAway ? Math.max(22, pitch) : 0);
  const bandH = Math.max(pitch, ...boxes.map((b) => b.h));
  const labelH = hasLabel ? r2(16 * ts) : 0;
  const H = r2(top + bandH + labelH + 10);

  const xs: number[] = [];
  let cursor = (W - totalW) / 2;
  for (const b of boxes) { xs.push(cursor); cursor += b.w + gap; }

  let seen = 0;
  const drawn: ReactElement[] = [];
  const strikes: ReactElement[] = [];
  const struck: Pt[] = [];

  groups.forEach((g, j) => {
    const icon = (g.icon ?? 'dot') as Icon;
    const b = boxes[j];
    const bx = xs[j];
    const by = top + (bandH - b.h) / 2;
    b.pts.forEach((pt, i) => {
      const cx = bx + pt.x;
      const cy = by + pt.y;
      const gi = seen + i;
      drawn.push(<g key={`c${j}-${i}`}>{glyph(icon, cx, cy, r, ls)}</g>);
      if (crossed > 0 && gi >= firstCrossed) {
        if (struck.length === 0) struck.push({ x: cx, y: cy });
        strikes.push(strike(cx, cy, r, ls, gi));
      }
    });
    seen += b.pts.length;
  });

  const arrowFrom: Pt | null = struck[0] ?? null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} {...svgProps}>
      {takeAway && <defs>{arrowDef}</defs>}

      {drawn}
      {strikes}

      {relation === 'join' || relation === 'remove'
        ? groups.slice(0, -1).map((_, j) => (
            <text
              key={`s${j}`}
              x={r2(xs[j] + boxes[j].w + gap / 2)} y={r2(top + bandH / 2)}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT} fontSize={r2(TEXT.huge * ts)} fill={FIG.inkMuted}
            >
              {relation === 'join' ? '+' : '−'}
            </text>
          ))
        : null}

      {/* one group, counters struck: the arrow says where they went */}
      {takeAway && arrowFrom && (
        <path
          d={`M ${r2(arrowFrom.x)},${r2(arrowFrom.y - r - 5)} Q ${r2(arrowFrom.x + 20)},${r2(top - 6)} ${r2(Math.min(W - 14, arrowFrom.x + 52))},${r2(top + 2)}`}
          fill="none" stroke={FIG.attention} strokeWidth={r2(STROKE.thin * ls)}
          strokeLinecap="round" markerEnd={`url(#${arrowId})`}
        />
      )}

      {groups.map((g, j) =>
        g.label ? (
          <text
            key={`l${j}`}
            x={r2(xs[j] + boxes[j].w / 2)} y={r2(top + bandH + labelH * 0.7)}
            textAnchor="middle" dominantBaseline="central"
            fontFamily={FONT} fontSize={r2(TEXT.small * ts)} fill={FIG.inkMuted}
          >
            {g.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
