/**
 * BarModelFig — the bar / tape model primitive (B1.0).
 *
 * THE ONE THING THIS MUST NOT GET WRONG: bars are drawn to a SHARED scale. D4's
 * "four times as many" is a picture argument — Maya's one bar against Ben's four
 * identical bars — and it only argues if a unit is the same length in every bar
 * on the page. `scaleMax` fixes that unit; without it the widest bar sets it. A
 * bar model that rescales per row teaches nothing and can mislead, so the scale
 * is computed once, above the render.
 *
 * Braces are square brackets, not curly ones: at 320 units wide a curly brace
 * turns to mush, and the bracket's centre tick points at its label unambiguously.
 */

import { FIG, STROKE, TEXT, FONT, W, r2, defId, type FigurePartProps } from './shared';

const SCALE = { sm: 1.14, md: 1, lg: 0.94 } as const;

/** Width estimate for fit decisions only — never for positioning. */
function textW(s: string, fs: number): number {
  return s.length * fs * 0.58;
}

function trunc(s: string, fs: number, maxW: number): string {
  const n = Math.max(1, Math.floor(maxW / (fs * 0.58)));
  return s.length <= n ? s : `${s.slice(0, Math.max(1, n - 1))}…`;
}

/** Greedy word wrap for the left-hand bar name; long names shrink to fit, never overflow. */
function wrap(text: string, fs: number, maxW: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (!cur || textW(next, fs) <= maxW) cur = next;
    else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  const kept = lines.slice(0, maxLines);
  if (lines.length > maxLines && kept.length) kept[kept.length - 1] = `${kept[kept.length - 1]}…`;
  return kept.map((l) => trunc(l, fs, maxW));
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

type SegBox = { x: number; w: number; fill?: string; txt: string | null; inside: boolean; row: number };

export default function BarModelFig({ params, size }: FigurePartProps<'bar-model'>) {
  const k = SCALE[size] ?? 1;
  const fsLabel = r2(TEXT.small * k);
  const fsSeg = r2(TEXT.small * k);
  const fsTotal = r2(TEXT.body * k);
  const barH = r2(size === 'sm' ? 32 : size === 'lg' ? 26 : 29);
  const gap = r2(12 * k);
  const braceD = r2(7 * k);
  const hatchId = defId('hatch', size); // keyed by size: two sizes on one page must not share a pattern

  const bars = (params.bars ?? []).filter((b) => b && Array.isArray(b.segments) && b.segments.length > 0);
  if (bars.length === 0) {
    return (
      <svg
        viewBox={`0 0 ${W} 8`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block', height: 'auto' }}
      />
    );
  }

  const val = (v: number) => (Number.isFinite(v) && v > 0 ? v : 0);
  const sums = bars.map((b) => b.segments.reduce((a, s) => a + val(s.value), 0));
  const widest = Math.max(0, ...sums);
  const declared = Number.isFinite(params.scaleMax) ? (params.scaleMax as number) : 0;
  const scaleRef = Math.max(declared, widest);
  // An all-zero model has no unit to be to-scale against; split the row evenly
  // so the segment COUNT still reads rather than drawing nothing at all.
  const degenerate = scaleRef <= 0;

  const overall = params.brace?.label ? String(params.brace.label).trim() : '';
  // With two or more bars the combined total is a vertical bracket hugging the
  // stack; with one bar it belongs underneath, where "12 in all" reads as length.
  const sideBrace = overall.length > 0 && bars.length > 1;
  let rightW = sideBrace ? Math.min(96, r2(textW(overall, fsTotal) + 16)) : 0;

  const anyName = bars.some((b) => b.label && String(b.label).trim());
  let nameW = anyName ? 80 : 0;
  let barX0 = nameW;
  let barX1 = r2(W - 6 - rightW);
  if (barX1 - barX0 < 90) {
    rightW = Math.max(0, rightW - (90 - (barX1 - barX0)));
    barX1 = r2(W - 6 - rightW);
    if (barX1 - barX0 < 90) {
      nameW = Math.max(0, nameW - (90 - (barX1 - barX0)));
      barX0 = nameW;
    }
  }
  const areaW = Math.max(10, barX1 - barX0);

  // --- layout pass (heights must be known before the viewBox is written) ---
  let y = 5;
  let labelReach = 0;
  const laid = bars.map((b) => {
    const totalTxt = b.total !== undefined && String(b.total).trim() ? String(b.total).trim() : null;
    if (totalTxt) y = r2(y + fsTotal + 4 + braceD + 4);
    const barY = r2(y);

    let acc = 0;
    const segs: SegBox[] = b.segments.map((s) => {
      const w0 = degenerate ? areaW / b.segments.length : (val(s.value) / scaleRef) * areaW;
      const sx = r2(barX0 + acc);
      acc += w0;
      // widths follow rounded positions so a row of segments never drifts apart
      const sw = r2(r2(barX0 + acc) - sx);
      const txt = s.label !== undefined && String(s.label).trim() ? String(s.label).trim() : null;
      const inside = !!txt && textW(txt, fsSeg) + 8 <= sw && barH >= fsSeg + 9;
      return { x: sx, w: sw, fill: s.fill, txt, inside, row: 0 };
    });
    const barEnd = r2(barX0 + acc);

    // A label too wide for its slice drops below it rather than being dropped:
    // a segment's value is information the item may depend on.
    const rowEnd: number[] = [];
    for (const sg of segs) {
      if (!sg.txt || sg.inside) continue;
      const c = sg.x + sg.w / 2;
      const hw = textW(sg.txt, fsSeg) / 2;
      let row = 0;
      while (rowEnd[row] !== undefined && rowEnd[row] > c - hw - 4) row += 1;
      rowEnd[row] = c + hw;
      sg.row = row;
    }
    const belowH = rowEnd.length * (fsSeg + 3);

    const nameLines = b.label && String(b.label).trim() && nameW > 20
      ? wrap(String(b.label).trim(), fsLabel, nameW - 10, 3)
      : [];
    labelReach = Math.max(labelReach, barY + barH / 2 + (nameLines.length * (fsLabel + 2)) / 2);

    y = r2(barY + barH + belowH + gap);
    return { barY, barEnd, segs, totalTxt, belowH, nameLines };
  });

  const last = laid[laid.length - 1];
  const bottomBraceY = !sideBrace && overall ? r2(last.barY + barH + last.belowH + 9) : 0;
  const contentBottom = bottomBraceY
    ? r2(bottomBraceY + braceD * 0.7 + 4 + fsTotal)
    : r2(y - gap);
  const H = r2(Math.max(contentBottom, labelReach) + 5);

  const paint = (fill?: string) => {
    switch (fill) {
      case 'soft':
        return { bg: FIG.primarySoft, edge: FIG.primary, ink: FIG.ink };
      case 'none':
        return { bg: 'none', edge: FIG.ink, ink: FIG.ink };
      case 'hatch':
        return { bg: `url(#${hatchId})`, edge: FIG.primary, ink: FIG.ink };
      default:
        return { bg: FIG.primary, edge: FIG.primaryDeep, ink: FIG.surface };
    }
  };

  const totalInk = (t: string) => (t === '?' ? FIG.attention : FIG.ink);

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
        {/* diagonal hatch: the one fill that still separates from 'solid' in
            greyscale or for a colour-blind child (CONTRAST LAW) */}
        <pattern
          id={hatchId}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="7" height="7" fill={FIG.surface} />
          <line x1="0" y1="0" x2="0" y2="7" stroke={FIG.primary} strokeWidth={STROKE.base} />
        </pattern>
      </defs>

      {laid.map((L, bi) => {
        const mid = r2(L.barY + barH / 2);
        const lh = fsLabel + 2;
        const firstBase = r2(mid - ((L.nameLines.length - 1) * lh) / 2 + fsLabel * 0.35);
        const braceY = r2(L.barY - 5);
        const braceMid = r2((barX0 + L.barEnd) / 2);
        return (
          <g key={`b${bi}`}>
            {L.nameLines.map((ln, li) => (
              <text
                key={`n${li}`}
                x={r2(nameW - 8)}
                y={r2(firstBase + li * lh)}
                textAnchor="end"
                fontFamily={FONT}
                fontSize={fsLabel}
                fontWeight={600}
                fill={FIG.ink}
              >
                {ln}
              </text>
            ))}

            {L.segs.map((sg, si) => {
              const p = paint(sg.fill);
              if (sg.w < 0.3) return null;
              return (
                <rect
                  key={`s${si}`}
                  x={sg.x}
                  y={L.barY}
                  width={sg.w}
                  height={barH}
                  fill={p.bg}
                  stroke={p.edge}
                  strokeWidth={STROKE.thin}
                />
              );
            })}

            {L.segs.map((sg, si) => {
              if (!sg.txt) return null;
              const p = paint(sg.fill);
              const cx = r2(sg.x + sg.w / 2);
              const tw = textW(sg.txt, fsSeg);
              if (sg.inside) {
                return (
                  <g key={`sl${si}`}>
                    {/* hatch lines run under the glyphs; give them a clear plate */}
                    {sg.fill === 'hatch' && (
                      <rect
                        x={r2(cx - tw / 2 - 3)}
                        y={r2(mid - fsSeg * 0.68)}
                        width={r2(tw + 6)}
                        height={r2(fsSeg + 3)}
                        rx={2}
                        fill={FIG.surface}
                      />
                    )}
                    <text
                      x={cx}
                      y={r2(mid + fsSeg * 0.35)}
                      textAnchor="middle"
                      fontFamily={FONT}
                      fontSize={fsSeg}
                      fontWeight={sg.txt === '?' ? 700 : 600}
                      fill={sg.txt === '?' && sg.fill !== undefined && sg.fill !== 'solid' ? FIG.attention : p.ink}
                    >
                      {sg.txt}
                    </text>
                  </g>
                );
              }
              return (
                <text
                  key={`sl${si}`}
                  x={r2(clamp(cx, tw / 2 + 2, W - tw / 2 - 2))}
                  y={r2(L.barY + barH + 3 + sg.row * (fsSeg + 3) + fsSeg * 0.8)}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={fsSeg}
                  fontWeight={sg.txt === '?' ? 700 : 500}
                  fill={sg.txt === '?' ? FIG.attention : FIG.inkMuted}
                >
                  {sg.txt}
                </text>
              );
            })}

            {L.totalTxt && (
              <g>
                <path
                  d={`M ${barX0} ${r2(braceY + braceD)} L ${barX0} ${braceY} L ${L.barEnd} ${braceY} L ${L.barEnd} ${r2(braceY + braceD)}`}
                  fill="none"
                  stroke={FIG.inkMuted}
                  strokeWidth={STROKE.thin}
                  strokeLinejoin="round"
                />
                <line
                  x1={braceMid}
                  y1={braceY}
                  x2={braceMid}
                  y2={r2(braceY - braceD * 0.7)}
                  stroke={FIG.inkMuted}
                  strokeWidth={STROKE.thin}
                />
                <text
                  x={r2(clamp(braceMid, textW(L.totalTxt, fsTotal) / 2 + 2, W - textW(L.totalTxt, fsTotal) / 2 - 2))}
                  y={r2(braceY - braceD * 0.7 - 3)}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={fsTotal}
                  fontWeight={700}
                  fill={totalInk(L.totalTxt)}
                >
                  {L.totalTxt}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {sideBrace && (() => {
        const bx = r2(barX1 + 5);
        const ya = laid[0].barY;
        const yb = r2(last.barY + barH);
        const ym = r2((ya + yb) / 2);
        return (
          <g>
            <path
              d={`M ${r2(bx - braceD)} ${ya} L ${bx} ${ya} L ${bx} ${yb} L ${r2(bx - braceD)} ${yb}`}
              fill="none"
              stroke={FIG.inkMuted}
              strokeWidth={STROKE.thin}
              strokeLinejoin="round"
            />
            <line x1={bx} y1={ym} x2={r2(bx + braceD * 0.7)} y2={ym} stroke={FIG.inkMuted} strokeWidth={STROKE.thin} />
            <text
              x={r2(bx + braceD * 0.7 + 4)}
              y={r2(ym + fsTotal * 0.35)}
              textAnchor="start"
              fontFamily={FONT}
              fontSize={fsTotal}
              fontWeight={700}
              fill={totalInk(overall)}
            >
              {overall}
            </text>
          </g>
        );
      })()}

      {!sideBrace && overall && (
        <g>
          <path
            d={`M ${barX0} ${r2(bottomBraceY - braceD)} L ${barX0} ${bottomBraceY} L ${last.barEnd} ${bottomBraceY} L ${last.barEnd} ${r2(bottomBraceY - braceD)}`}
            fill="none"
            stroke={FIG.inkMuted}
            strokeWidth={STROKE.thin}
            strokeLinejoin="round"
          />
          <line
            x1={r2((barX0 + last.barEnd) / 2)}
            y1={bottomBraceY}
            x2={r2((barX0 + last.barEnd) / 2)}
            y2={r2(bottomBraceY + braceD * 0.7)}
            stroke={FIG.inkMuted}
            strokeWidth={STROKE.thin}
          />
          <text
            x={r2(clamp((barX0 + last.barEnd) / 2, textW(overall, fsTotal) / 2 + 2, W - textW(overall, fsTotal) / 2 - 2))}
            y={r2(bottomBraceY + braceD * 0.7 + 3 + fsTotal * 0.8)}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={fsTotal}
            fontWeight={700}
            fill={totalInk(overall)}
          >
            {overall}
          </text>
        </g>
      )}
    </svg>
  );
}
