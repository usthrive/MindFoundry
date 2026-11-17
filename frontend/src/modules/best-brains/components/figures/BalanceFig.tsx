/**
 * A pan balance (2026-11-17).
 *
 * WHY. Level B week 6, "the balanced equal sign", is built on the balance scale:
 * "The left pan of a balance holds 7, 4 and 5 walnuts. The right pan holds 12
 * walnuts and one closed bag. The bar sits level." The figure drawn under it was
 * a bar model — boxes like the ones used for tens and ones, and only one pan. A
 * child told to look at a balance must see a balance.
 *
 * WHAT IT DRAWS. A post and a beam, level or tipped (the heavier side lower);
 * a pan hanging from each end on vertical strings; on each pan its heaps with
 * each count written under the pan, and any closed bags as sacks marked "?" (or
 * covered dishes, when the words say dish). What is under a bag or dish is never
 * drawn — it is the question.
 *
 * NAMED THINGS AND WEIGHTS (change set 2). A pan may also hold labelled weight
 * blocks ("40 g", E13/E15) and named things of unknown weight — a stone or a
 * balloon weighed in blocks (A20), a sealed box or tins marked "?" (E13/E15).
 * All are one fixed size each; the drawing never measures them. With `icon:
 * 'block'`, countable heaps are squares (A20's blocks) rather than dots.
 *
 * TWO WAYS TO DRAW A HEAP. By default a heap is one solid pile, the SAME size
 * whatever it holds — its number says how much, the tilt says which side is
 * heavier, and nothing on the page can be counted in place of adding (an assessed
 * page). With `countable`, a heap is that many dots, piled from the bottom — for
 * the lesson and the worked examples, where the answer is already on the page and
 * watching the heaps balance is the teaching.
 *
 * Pure function of its params (see ./shared): no randomness, no measurement.
 */
import type { ReactElement } from 'react';
import type { FigurePartProps } from './shared';
import type { BalanceObject } from '../../figures/types';
import { FIG, FONT, STROKE, TEXT, r2 } from './shared';

const VW = 360;
const VH = 186;
const PIVOT = { x: VW / 2, y: 30 };
/** Pivot to each hanging point, along the beam. */
const HALF = 104;
/** Hanging point to the pan's rim. */
const DROP = 58;
const PAN_W = 144;
const TILT_DEG = 7;
/** Sized for a 7-year-old's eye at phone width (the first draft's 3 px dots were too small). */
const PITCH = 10.4;
const DOT_R = 4.1;
/** Above this, a heap is drawn as this many dots and its written count carries the rest. */
const MAX_DRAWN = 20;
const BAG_W = 34;
const BAG_H = 38;
/** A pile (not countable): one fixed size, so its size measures nothing. */
const PILE_W = 38;
const PILE_H = 22;
const GAP = 9;
/** A labelled weight block ("40 g"): one fixed size, whatever it says. */
const WEIGHT_W = 44;
const WEIGHT_H = 24;
/** Named things of unknown weight (A20, E13, E15): fixed sizes, never to scale. */
const OBJ: Record<BalanceObject, { w: number; h: number }> = {
  stone: { w: 36, h: 22 },
  balloon: { w: 34, h: 40 },
  box: { w: 34, h: 30 },
  tin: { w: 22, h: 30 },
};

type Pan = { heaps?: number[]; bags?: number; weights?: number[]; objects?: BalanceObject[] };

function heapCols(n: number): number {
  return Math.min(5, Math.max(1, Math.ceil(Math.sqrt(Math.min(n, MAX_DRAWN)))));
}

/** Width one heap takes on a pan, before any shrinking. */
function heapWidth(n: number, countable: boolean): number {
  return countable ? Math.max(1, heapCols(n)) * PITCH : PILE_W;
}

function panWidthNeeded(pan: Pan, countable: boolean): number {
  const parts = [
    ...(pan.heaps ?? []).map((n) => heapWidth(n, countable)),
    ...(pan.weights ?? []).map(() => WEIGHT_W),
    ...(pan.objects ?? []).map((o) => OBJ[o].w),
    ...Array.from({ length: pan.bags ?? 0 }, () => BAG_W),
  ];
  return parts.length ? parts.reduce((a, w) => a + w, 0) + GAP * (parts.length - 1) : 0;
}

function PanContents({
  pan,
  cx,
  rimY,
  showCounts,
  side,
  cover,
  countable,
  square,
  unit,
}: {
  pan: Pan;
  cx: number;
  rimY: number;
  showCounts: boolean;
  side: 'left' | 'right';
  cover: 'bag' | 'dish';
  countable: boolean;
  /** Countable heaps drawn as squares (A20's blocks) rather than dots. */
  square: boolean;
  unit?: string;
}): ReactElement {
  const need = panWidthNeeded(pan, countable);
  // Shrink a crowded pan rather than spill over its rim.
  const k = need > PAN_W - 14 ? (PAN_W - 14) / need : 1;
  const pitch = PITCH * k;
  // The dot shrinks WITH its spacing, so a crowded pan never overlaps its dots.
  const r = Math.min(DOT_R, pitch * 0.42);
  const out: ReactElement[] = [];
  let x = cx - (need * k) / 2;
  (pan.heaps ?? []).forEach((n, hi) => {
    if (!countable) {
      // One solid pile, the same for 3 as for 16: a mound with a soft highlight.
      const w = PILE_W * k;
      const h = PILE_H * Math.max(0.8, k);
      const base = rimY - 3;
      out.push(
        <g key={`${side}-h${hi}-pile`}>
          <path
            d={`M ${r2(x)} ${r2(base)}
                C ${r2(x + w * 0.12)} ${r2(base - h * 0.85)}, ${r2(x + w * 0.32)} ${r2(base - h)}, ${r2(x + w / 2)} ${r2(base - h)}
                C ${r2(x + w * 0.68)} ${r2(base - h)}, ${r2(x + w * 0.88)} ${r2(base - h * 0.85)}, ${r2(x + w)} ${r2(base)}
                Z`}
            fill={FIG.accent}
            stroke={FIG.accentDeep}
            strokeWidth={STROKE.thin}
            strokeLinejoin="round"
          />
          <path
            d={`M ${r2(x + w * 0.3)} ${r2(base - h * 0.62)} Q ${r2(x + w * 0.42)} ${r2(base - h * 0.86)} ${r2(x + w * 0.56)} ${r2(base - h * 0.84)}`}
            fill="none"
            stroke={FIG.accentSoft}
            strokeWidth={STROKE.base}
            strokeLinecap="round"
          />
        </g>,
      );
      if (showCounts) {
        out.push(
          <text
            key={`${side}-h${hi}-n`}
            x={r2(x + w / 2)}
            y={r2(rimY + 24)}
            textAnchor="middle"
            fontSize={TEXT.large}
            fontWeight={700}
            fill={FIG.ink}
            fontFamily={FONT}
          >
            {n}
          </text>,
        );
      }
      x += w + GAP * k;
      return;
    }
    const cols = heapCols(n);
    const drawn = Math.min(n, MAX_DRAWN);
    const w = cols * pitch;
    for (let i = 0; i < drawn; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      // Rows fill from the bottom; an odd last row is centred, like a pile.
      const inRow = Math.min(cols, drawn - row * cols);
      const offset = ((cols - inRow) * pitch) / 2;
      const dx = x + offset + col * pitch + pitch / 2;
      const dy = rimY - 4 - r - row * pitch;
      if (square) {
        out.push(
          <rect
            key={`${side}-h${hi}-d${i}`}
            x={r2(dx - r)}
            y={r2(dy - r)}
            width={r2(2 * r)}
            height={r2(2 * r)}
            rx={0.8}
            fill={FIG.accent}
            stroke={FIG.accentDeep}
            strokeWidth={STROKE.hair}
          />,
        );
        continue;
      }
      out.push(
        <circle
          key={`${side}-h${hi}-d${i}`}
          cx={r2(dx)}
          cy={r2(dy)}
          r={r2(r)}
          fill={FIG.accent}
          stroke={FIG.accentDeep}
          strokeWidth={STROKE.hair}
        />,
      );
    }
    if (showCounts) {
      out.push(
        <text
          key={`${side}-h${hi}-n`}
          x={r2(x + w / 2)}
          y={r2(rimY + 24)}
          textAnchor="middle"
          fontSize={TEXT.large}
          fontWeight={700}
          fill={FIG.ink}
          fontFamily={FONT}
        >
          {n}
        </text>,
      );
    }
    x += w + GAP * k;
  });
  // Labelled weights: a block with a handle, its amount written on it.
  (pan.weights ?? []).forEach((amount, wi) => {
    const w = WEIGHT_W * k;
    const h = WEIGHT_H * Math.max(0.85, k);
    const base = rimY - 3;
    out.push(
      <g key={`${side}-w${wi}`}>
        <path
          d={`M ${r2(x + w * 0.38)} ${r2(base - h)} Q ${r2(x + w / 2)} ${r2(base - h - 9)} ${r2(x + w * 0.62)} ${r2(base - h)}`}
          fill="none"
          stroke={FIG.inkMuted}
          strokeWidth={STROKE.base}
        />
        <path
          d={`M ${r2(x)} ${r2(base)} L ${r2(x + w * 0.12)} ${r2(base - h)} L ${r2(x + w * 0.88)} ${r2(base - h)} L ${r2(x + w)} ${r2(base)} Z`}
          fill={FIG.fill}
          stroke={FIG.inkMuted}
          strokeWidth={STROKE.thin}
          strokeLinejoin="round"
        />
        <text
          x={r2(x + w / 2)}
          y={r2(base - h / 2 + 4)}
          textAnchor="middle"
          fontSize={TEXT.small}
          fontWeight={700}
          fill={FIG.ink}
          fontFamily={FONT}
        >
          {unit ? `${amount} ${unit}` : String(amount)}
        </text>
      </g>,
    );
    x += w + GAP * k;
  });
  // Named things of unknown weight. A sealed box or tin carries "?"; a stone or
  // a balloon is simply there, to be weighed in blocks.
  (pan.objects ?? []).forEach((o, oi) => {
    const w = OBJ[o].w * k;
    const h = OBJ[o].h * Math.max(0.85, k);
    const base = rimY - 3;
    const mid = x + w / 2;
    const mark = (y: number) => (
      <text x={r2(mid)} y={r2(y)} textAnchor="middle" fontSize={TEXT.body} fontWeight={700} fill={FIG.attention} fontFamily={FONT}>
        ?
      </text>
    );
    let shape: ReactElement;
    if (o === 'stone') {
      shape = (
        <path
          d={`M ${r2(x + w * 0.06)} ${r2(base)} C ${r2(x - w * 0.04)} ${r2(base - h * 0.7)}, ${r2(x + w * 0.3)} ${r2(base - h * 1.05)}, ${r2(x + w * 0.58)} ${r2(base - h * 0.95)} C ${r2(x + w * 0.9)} ${r2(base - h * 0.9)}, ${r2(x + w * 1.04)} ${r2(base - h * 0.45)}, ${r2(x + w * 0.94)} ${r2(base)} Z`}
          fill={FIG.inkFaint}
          stroke={FIG.inkMuted}
          strokeWidth={STROKE.thin}
          strokeLinejoin="round"
        />
      );
    } else if (o === 'balloon') {
      const ry = h * 0.42;
      shape = (
        <g>
          <ellipse cx={r2(mid)} cy={r2(base - h + ry)} rx={r2(w / 2)} ry={r2(ry)} fill={FIG.primarySoft} stroke={FIG.primary} strokeWidth={STROKE.thin} />
          <path d={`M ${r2(mid - 3)} ${r2(base - h + 2 * ry + 4)} L ${r2(mid)} ${r2(base - h + 2 * ry)} L ${r2(mid + 3)} ${r2(base - h + 2 * ry + 4)} Z`} fill={FIG.primary} />
          <path d={`M ${r2(mid)} ${r2(base - h + 2 * ry + 4)} Q ${r2(mid + 4)} ${r2(base - 4)} ${r2(mid)} ${r2(base)}`} fill="none" stroke={FIG.primary} strokeWidth={STROKE.hair} />
        </g>
      );
    } else if (o === 'box') {
      shape = (
        <g>
          <rect x={r2(x)} y={r2(base - h)} width={r2(w)} height={r2(h)} rx={2} fill={FIG.attentionSoft} stroke={FIG.attention} strokeWidth={STROKE.thin} />
          <line x1={r2(x)} y1={r2(base - h * 0.72)} x2={r2(x + w)} y2={r2(base - h * 0.72)} stroke={FIG.attention} strokeWidth={STROKE.hair} />
          {mark(base - h * 0.18)}
        </g>
      );
    } else {
      shape = (
        <g>
          <rect x={r2(x)} y={r2(base - h + 3)} width={r2(w)} height={r2(h - 3)} fill={FIG.attentionSoft} stroke={FIG.attention} strokeWidth={STROKE.thin} />
          <ellipse cx={r2(mid)} cy={r2(base - h + 3)} rx={r2(w / 2)} ry={3} fill={FIG.surface} stroke={FIG.attention} strokeWidth={STROKE.thin} />
          {mark(base - h * 0.25)}
        </g>
      );
    }
    out.push(<g key={`${side}-o${oi}`}>{shape}</g>);
    x += w + GAP * k;
  });
  for (let b = 0; b < (pan.bags ?? 0); b++) {
    const bw = BAG_W * k;
    const bh = BAG_H * Math.max(0.8, k);
    const left = x;
    const top = rimY - 4 - bh;
    if (cover === 'dish') {
      // A covered dish: an upside-down bowl with a little knob, marked "?" (B7).
      out.push(
        <g key={`${side}-dish${b}`}>
          <path
            d={`M ${r2(left - 2)} ${r2(top + bh)} Q ${r2(left + bw / 2)} ${r2(top - bh * 0.15)} ${r2(left + bw + 2)} ${r2(top + bh)} Z`}
            fill={FIG.attentionSoft}
            stroke={FIG.attention}
            strokeWidth={STROKE.thin}
            strokeLinejoin="round"
          />
          <circle cx={r2(left + bw / 2)} cy={r2(top + bh * 0.3)} r={2.6} fill={FIG.attention} />
          <text
            x={r2(left + bw / 2)}
            y={r2(top + bh * 0.92)}
            textAnchor="middle"
            fontSize={TEXT.large}
            fontWeight={700}
            fill={FIG.attention}
            fontFamily={FONT}
          >
            ?
          </text>
        </g>,
      );
      x += bw + GAP * k;
      continue;
    }
    // A sack: rounded body, a pinched neck and a tie.
    out.push(
      <g key={`${side}-bag${b}`}>
        <path
          d={`M ${r2(left + bw * 0.3)} ${r2(top + bh * 0.22)}
              C ${r2(left - bw * 0.05)} ${r2(top + bh * 0.45)}, ${r2(left)} ${r2(top + bh)}, ${r2(left + bw / 2)} ${r2(top + bh)}
              C ${r2(left + bw)} ${r2(top + bh)}, ${r2(left + bw * 1.05)} ${r2(top + bh * 0.45)}, ${r2(left + bw * 0.7)} ${r2(top + bh * 0.22)}
              Z`}
          fill={FIG.attentionSoft}
          stroke={FIG.attention}
          strokeWidth={STROKE.thin}
        />
        <path
          d={`M ${r2(left + bw * 0.3)} ${r2(top + bh * 0.22)} L ${r2(left + bw * 0.36)} ${r2(top)} L ${r2(left + bw * 0.64)} ${r2(top)} L ${r2(left + bw * 0.7)} ${r2(top + bh * 0.22)}`}
          fill={FIG.attentionSoft}
          stroke={FIG.attention}
          strokeWidth={STROKE.thin}
          strokeLinejoin="round"
        />
        <line
          x1={r2(left + bw * 0.28)}
          y1={r2(top + bh * 0.22)}
          x2={r2(left + bw * 0.72)}
          y2={r2(top + bh * 0.22)}
          stroke={FIG.attention}
          strokeWidth={STROKE.base}
          strokeLinecap="round"
        />
        <text
          x={r2(left + bw / 2)}
          y={r2(top + bh * 0.78)}
          textAnchor="middle"
          fontSize={TEXT.large}
          fontWeight={700}
          fill={FIG.attention}
          fontFamily={FONT}
        >
          ?
        </text>
      </g>,
    );
    x += bw + GAP * k;
  }
  return <g>{out}</g>;
}

export default function BalanceFig({ params }: FigurePartProps<'balance'>) {
  const theta = ((params.tilt === 'right-down' ? 1 : params.tilt === 'left-down' ? -1 : 0) * TILT_DEG * Math.PI) / 180;
  const hang = (dir: -1 | 1) => ({
    x: PIVOT.x + dir * HALF * Math.cos(theta),
    y: PIVOT.y + dir * HALF * Math.sin(theta),
  });
  const showCounts = params.showCounts !== false;
  const beamHalf = HALF + 10;
  const sides = [
    { side: 'left' as const, pan: params.left ?? {}, at: hang(-1) },
    { side: 'right' as const, pan: params.right ?? {}, at: hang(1) },
  ];
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" aria-hidden="true" style={{ display: 'block', fontFamily: FONT }}>
      {/* the stand */}
      <path
        d={`M ${PIVOT.x - 34} ${VH - 8} L ${PIVOT.x + 34} ${VH - 8} L ${PIVOT.x + 18} ${VH - 20} L ${PIVOT.x - 18} ${VH - 20} Z`}
        fill={FIG.fill}
        stroke={FIG.inkMuted}
        strokeWidth={STROKE.thin}
        strokeLinejoin="round"
      />
      <rect x={PIVOT.x - 3} y={PIVOT.y} width={6} height={VH - 20 - PIVOT.y} fill={FIG.fill} stroke={FIG.inkMuted} strokeWidth={STROKE.thin} />
      {/* the pans, hanging straight down from each end */}
      {sides.map(({ side, pan, at }) => {
        const rimY = at.y + DROP;
        const x0 = at.x - PAN_W / 2;
        const x1 = at.x + PAN_W / 2;
        return (
          <g key={side}>
            <line x1={r2(at.x)} y1={r2(at.y)} x2={r2(x0 + 8)} y2={r2(rimY)} stroke={FIG.inkFaint} strokeWidth={STROKE.thin} />
            <line x1={r2(at.x)} y1={r2(at.y)} x2={r2(x1 - 8)} y2={r2(rimY)} stroke={FIG.inkFaint} strokeWidth={STROKE.thin} />
            <PanContents
              pan={pan}
              cx={at.x}
              rimY={rimY}
              showCounts={showCounts}
              side={side}
              cover={params.cover === 'dish' ? 'dish' : 'bag'}
              countable={params.countable === true}
              square={params.icon === 'block'}
              unit={params.unit}
            />
            <path
              d={`M ${r2(x0)} ${r2(rimY)} Q ${r2(at.x)} ${r2(rimY + 14)} ${r2(x1)} ${r2(rimY)} Z`}
              fill={FIG.primarySoft}
              stroke={FIG.primary}
              strokeWidth={STROKE.base}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
      {/* the beam, drawn last so it sits over the strings */}
      <line
        x1={r2(PIVOT.x - beamHalf * Math.cos(theta))}
        y1={r2(PIVOT.y - beamHalf * Math.sin(theta))}
        x2={r2(PIVOT.x + beamHalf * Math.cos(theta))}
        y2={r2(PIVOT.y + beamHalf * Math.sin(theta))}
        stroke={FIG.primaryDeep}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle cx={PIVOT.x} cy={PIVOT.y} r={5} fill={FIG.surface} stroke={FIG.primaryDeep} strokeWidth={STROKE.base} />
    </svg>
  );
}
