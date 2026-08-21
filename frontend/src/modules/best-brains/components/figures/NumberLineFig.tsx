/**
 * NumberLineFig — the number line primitive (B1.0).
 *
 * THE LAYOUT RULE, and it is the whole design: everything the ITEM asserts lives
 * above the line (marks, hops); everything the LINE is lives below it (ticks and
 * their labels). That is what makes D9's equivalence pair work — the 3/8 dot is
 * placed from its value, so re-partitioning the ruler underneath it into fourths
 * moves every tick and moves nothing above the line. A child watching the two
 * pictures side by side sees the point stay put, which is the lesson.
 *
 * It also keeps the two crowded zones apart: hop arcs never land in tick labels,
 * and a flag's pennant never sits on a fraction label.
 */

import { FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps } from './shared';
import { AnimStyle, MAX_TIER, anim, quadLen, type AnimProps } from './anim';

/**
 * The hops, in order, once (MICRO-ANIMATIONS-SPEC §2.2). Each arc draws itself
 * along its own path and its landing mark settles as the arc arrives — which is
 * the count-on story told in the order a child tells it.
 *
 * Three tiers per hop (draw, then land 210ms later), so hop 0 draws at 0ms,
 * hop 1 at 210ms, hop 2 at 420ms. A fourth hop and beyond share the last tier
 * rather than run past L4's 900ms ceiling: the budget is the law, the stagger
 * is the preference.
 */
const hopDrawTier = (i: number) => Math.min(MAX_TIER, 3 * i);
const hopLandTier = (i: number) => Math.min(MAX_TIER, 3 * i + 3);

/**
 * 'sm' draws into a smaller box, so viewBox type must grow to stay legible —
 * and that growth is exactly what thins the optional sub-tick labels, since
 * label survival is decided by collision, not by a hand-tuned size table.
 */
const SCALE = { sm: 1.14, md: 1, lg: 0.94 } as const;

/** Width estimate for collision only — never for positioning, so no measurement. */
function textW(s: string, fs: number): number {
  return s.length * fs * 0.58;
}

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '0';
  const r = Math.round(v * 1e6) / 1e6;
  return Object.is(r, -0) ? '0' : String(r);
}

/**
 * Sub-ticks print UNREDUCED (0, 1/8, 2/8, 3/8 …). Reducing 2/8 to 1/4 would
 * quietly do the equivalence the child is being asked to see.
 */
function fracLabel(v: number, d: number): string {
  const n = Math.round(v * d);
  return n % d === 0 ? fmt(n / d) : `${n}/${d}`;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

type Tick = { v: number; x: number; major: boolean };

export default function NumberLineFig({ params, size, animate }: FigurePartProps<'number-line'> & AnimProps) {
  const k = SCALE[size] ?? 1;
  const A = !!animate;
  const fsTick = r2(TEXT.small * k);
  const fsMark = r2(TEXT.body * k);
  const fsHop = r2(TEXT.small * k);

  // The renderer may assume a well-formed figure but must not produce NaN if it
  // is handed one that is not; every domain read below is total.
  const min = Number.isFinite(params.min) ? params.min : 0;
  const max = Number.isFinite(params.max) && params.max > min ? params.max : min + 1;
  const span = max - min;

  let step = Number.isFinite(params.step) && (params.step as number) > 0 ? (params.step as number) : 1;
  // Past ~40 majors the line is a comb no child can count along, so thin the
  // majors rather than draw one.
  let majors = Math.floor(span / step + 1e-9);
  if (majors > 40) {
    step *= Math.ceil(majors / 40);
    majors = Math.floor(span / step + 1e-9);
  }

  const partition = Number.isFinite(params.partition)
    ? clamp(Math.round(params.partition as number), 1, 24)
    : 1;
  const labels = params.labels ?? 'majors';
  // Fractions are named in sub-ticks-per-whole-unit, so a partitioned line whose
  // step is not 1 still labels honestly (and falls back to decimals if the
  // sub-tick is not a unit fraction at all).
  const den = partition / step;
  const useFrac = params.labelAs === 'fraction' && Number.isInteger(den) && den > 1;
  const tickText = (v: number) => (useFrac ? fracLabel(v, den) : fmt(v));

  const padX = 22;
  const x0 = padX;
  const x1 = W - padX;
  const X = (v: number) => r2(x0 + ((v - min) / span) * (x1 - x0));

  const marks = (params.marks ?? []).filter((m) => m && Number.isFinite(m.at));
  const hops = (params.hops ?? []).filter((h) => h && Number.isFinite(h.from) && Number.isFinite(h.to));

  const dotR = r2(4.6 * k);
  const stemH = r2(18 * k);
  const markAbove = marks.reduce((mx, m) => {
    const st = m.style ?? 'point';
    const stem = st === 'flag' || st === 'unknown' ? stemH : dotR;
    const glyph = st === 'unknown' ? fsMark + 2 : 0;
    const lab = m.label ? fsMark + 4 : 0;
    return Math.max(mx, stem + glyph + lab + 4);
  }, 0);

  // Hops get tiers so two overlapping jumps stay two readable arcs. Three tiers
  // is all a child tracks; past that they share the top tier and overlap.
  const hopSpan = hops.map((h) => {
    const a = X(h.from);
    const b = X(h.to);
    return a <= b ? ([a, b] as const) : ([b, a] as const);
  });
  const occupied: Array<Array<readonly [number, number]>> = [];
  const hopRow = hopSpan.map(([a, b]) => {
    let row = 0;
    while (row < 2 && (occupied[row] ?? []).some(([p, q]) => a < q + 6 && b > p - 6)) row += 1;
    if (!occupied[row]) occupied[row] = [];
    occupied[row].push([a, b]);
    return row;
  });

  const hopRise = r2(16 * k);
  const hopGap = r2(15 * k);
  const hopBase = r2(markAbove + 10 * k);
  const anyHopLabel = hops.some((h) => !!h.label);
  const hopAbove = hops.length
    ? hopBase + hopRise + Math.max(...hopRow) * hopGap + (anyHopLabel ? fsHop + 5 : 0)
    : 0;

  const above = Math.max(markAbove, hopAbove, 10);
  const lineY = r2(4 + above);
  const tickMajor = r2(8.5 * k);
  const tickSub = r2(4.5 * k);
  const showTickLabels = labels !== 'none';
  const tickBase = r2(lineY + tickMajor + 4 + fsTick * 0.78);
  const H = r2(lineY + tickMajor + (showTickLabels ? 5 + fsTick : 0) + 5);

  // --- ticks -------------------------------------------------------------
  const ticks: Tick[] = [];
  const seen = new Set<string>();
  const addTick = (v: number, major: boolean) => {
    if (v < min - 1e-9 || v > max + 1e-9) return;
    const key = v.toFixed(6);
    if (seen.has(key)) return;
    seen.add(key);
    ticks.push({ v, x: X(v), major });
  };
  for (let i = 0; i <= majors; i += 1) addTick(min + i * step, true);
  addTick(max, true); // the far end always carries a tick even when step misses it
  if (partition > 1) {
    for (let i = 0; i < majors; i += 1) {
      for (let j = 1; j < partition; j += 1) addTick(min + i * step + (j / partition) * step, false);
    }
  }
  ticks.sort((a, b) => a.v - b.v);

  // --- which ticks get a printed label -----------------------------------
  const isEnd = (t: Tick) => Math.abs(t.v - min) < 1e-9 || Math.abs(t.v - max) < 1e-9;
  const wanted = ticks.filter((t) =>
    labels === 'all' ? true : labels === 'majors' ? t.major : labels === 'ends' ? isEnd(t) : false,
  );
  // Ends first, then majors, then sub-ticks: a label is dropped only when
  // something more load-bearing already owns that space.
  const rank = (t: Tick) => (isEnd(t) ? 2 : t.major ? 1 : 0);
  const queue = wanted.map((t, i) => ({ t, i })).sort((a, b) => rank(b.t) - rank(a.t) || a.i - b.i);
  const printed: Array<{ x: number; w: number; text: string }> = [];
  for (const { t } of queue) {
    const text = tickText(t.v);
    const w = textW(text, fsTick);
    const cx = r2(clamp(t.x, w / 2 + 2, W - w / 2 - 2));
    if (printed.some((p) => Math.abs(p.x - cx) < (p.w + w) / 2 + 3)) continue;
    printed.push({ x: cx, w, text });
  }
  printed.sort((a, b) => a.x - b.x);

  const flagW = r2(11 * k);
  const flagH = r2(9 * k);

  /**
   * A mark sitting where a hop lands settles with that hop. Everything else on
   * a hop figure is already on the board (the ruler, and the point the child
   * counts ON from); on a figure with no hops there is no sequence to tell, so
   * the marks simply arrive.
   */
  const markAttrs = (at: number) => {
    if (!A) return {};
    const landed = hops.findIndex((h) => Math.abs(h.to - at) < 1e-9);
    if (landed >= 0) return anim(true, 'land', hopLandTier(landed));
    return hops.length ? {} : anim(true, 'fade', 0);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      <AnimStyle on={A} />
      {/* ticks below the axis only — above the axis belongs to marks and hops */}
      {ticks.map((t) => (
        <line
          key={`t${t.v.toFixed(6)}`}
          x1={t.x}
          y1={lineY}
          x2={t.x}
          y2={r2(lineY + (t.major ? tickMajor : tickSub))}
          stroke={t.major ? FIG.ink : FIG.inkFaint}
          strokeWidth={t.major ? STROKE.thin : STROKE.hair}
        />
      ))}

      {/* no arrowheads: on a 0–1 partitioned line they would claim the line runs
          past 1, which is the opposite of what a fraction line means */}
      <line
        x1={r2(x0 - 5)}
        y1={lineY}
        x2={r2(x1 + 5)}
        y2={lineY}
        stroke={FIG.ink}
        strokeWidth={STROKE.base}
        strokeLinecap="round"
      />

      {showTickLabels &&
        printed.map((p) => (
          <text
            key={`l${p.x}-${p.text}`}
            x={p.x}
            y={tickBase}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={fsTick}
            fill={FIG.inkMuted}
          >
            {p.text}
          </text>
        ))}

      {hops.map((h, i) => {
        const [lo, hi] = hopSpan[i];
        const xa = X(h.from);
        const xb = X(h.to);
        const rise = hopBase + hopRise + hopRow[i] * hopGap;
        const yFoot = r2(lineY - 3);
        const apex = r2(lineY - rise);
        // quadratic control chosen so the curve's own apex lands on `rise`
        const cx = r2((xa + xb) / 2);
        const cy = r2(lineY - 2 * rise + 3);
        const dx = xb - cx;
        const dy = yFoot - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const ah = r2(8 * k);
        const aw = r2(4.6 * k);
        const bx = xb - ux * ah;
        const by = yFoot - uy * ah;
        const arrow = `${r2(xb)},${r2(yFoot)} ${r2(bx - uy * aw)},${r2(by + ux * aw)} ${r2(bx + uy * aw)},${r2(by - ux * aw)}`;
        return (
          <g key={`h${i}`}>
            {hi - lo > 0.5 && (
              <>
                <path
                  {...anim(A, 'draw', hopDrawTier(i), quadLen(xa, yFoot, cx, cy, xb, yFoot))}
                  d={`M ${xa} ${yFoot} Q ${cx} ${cy} ${xb} ${yFoot}`}
                  fill="none"
                  stroke={FIG.accentDeep}
                  strokeWidth={STROKE.thin}
                  strokeLinecap="round"
                />
                <polygon {...anim(A, 'fade', hopLandTier(i))} points={arrow} fill={FIG.accentDeep} />
              </>
            )}
            {h.label && (
              <text
                {...anim(A, 'fade', hopLandTier(i))}
                x={r2(clamp(cx, textW(h.label, fsHop) / 2 + 2, W - textW(h.label, fsHop) / 2 - 2))}
                y={r2(apex - 4)}
                textAnchor="middle"
                fontFamily={FONT}
                fontSize={fsHop}
                fontWeight={600}
                fill={FIG.accentDeep}
              >
                {h.label}
              </text>
            )}
          </g>
        );
      })}

      {marks.map((m, i) => {
        const st = m.style ?? 'point';
        const x = X(clamp(m.at, min, max));
        const stemTop = r2(lineY - stemH);
        // pennant flips to the left rather than run off the drawing near max
        const flip = x + flagW > W - 3;
        const tipX = r2(flip ? x - flagW : x + flagW);
        const labelY =
          st === 'flag'
            ? r2(stemTop - 5)
            : st === 'unknown'
              ? r2(stemTop - fsMark - 5)
              : r2(lineY - dotR - 5);
        const lw = m.label ? textW(m.label, fsMark) : 0;
        return (
          <g key={`m${i}`} {...markAttrs(m.at)}>
            {st === 'point' && (
              <circle
                cx={x}
                cy={lineY}
                r={dotR}
                fill={FIG.primaryDeep}
                stroke={FIG.surface}
                strokeWidth={STROKE.hair}
              />
            )}
            {/* hollow, not merely paler: an excluded bound has to read in greyscale */}
            {st === 'open' && (
              <circle
                cx={x}
                cy={lineY}
                r={dotR}
                fill={FIG.surface}
                stroke={FIG.primaryDeep}
                strokeWidth={STROKE.base}
              />
            )}
            {st === 'flag' && (
              <g>
                <line
                  x1={x}
                  y1={lineY}
                  x2={x}
                  y2={stemTop}
                  stroke={FIG.accentDeep}
                  strokeWidth={STROKE.thin}
                />
                <polygon
                  points={`${x},${stemTop} ${tipX},${r2(stemTop + flagH / 2)} ${x},${r2(stemTop + flagH)}`}
                  fill={FIG.accent}
                  stroke={FIG.accentDeep}
                  strokeWidth={STROKE.hair}
                  strokeLinejoin="round"
                />
                <circle cx={x} cy={lineY} r={r2(dotR * 0.62)} fill={FIG.accentDeep} />
              </g>
            )}
            {st === 'unknown' && (
              <g>
                <line
                  x1={x}
                  y1={r2(lineY - dotR)}
                  x2={x}
                  y2={stemTop}
                  stroke={FIG.attention}
                  strokeWidth={STROKE.thin}
                  strokeDasharray="3 3"
                />
                {/* dashed edge, not just a different hue — the "we don't know yet" cue */}
                <circle
                  cx={x}
                  cy={lineY}
                  r={dotR}
                  fill={FIG.surface}
                  stroke={FIG.attention}
                  strokeWidth={STROKE.base}
                  strokeDasharray="3 2.5"
                />
                <text
                  x={x}
                  y={r2(stemTop - 2)}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={fsMark}
                  fontWeight={700}
                  fill={FIG.attention}
                >
                  ?
                </text>
              </g>
            )}
            {m.label && (
              <text
                x={r2(clamp(x, lw / 2 + 2, W - lw / 2 - 2))}
                y={labelY}
                textAnchor="middle"
                fontFamily={FONT}
                fontSize={fsMark}
                fontWeight={600}
                fill={st === 'unknown' ? FIG.attention : st === 'flag' ? FIG.accentDeep : FIG.ink}
              >
                {m.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
