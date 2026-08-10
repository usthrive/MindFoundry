/**
 * Area / array grid — the four-rooms multiplication model (D8), fraction of a
 * fraction (D18), area vs perimeter (C21), arrays and repeated addition (B20).
 *
 * Two drawings live here because they are the same object seen twice: a grid of
 * equal units (an array you can count) and a rectangle partitioned in PROPORTION
 * to its group labels (an area you can decompose). The second is why `rowLabels`
 * are read as numbers when they parse — D8's whole argument is that the 20×30
 * room is the big one, and a table of four equal squares argues the opposite.
 */

import {
  FIG, STROKE, TEXT, FONT, W, r2, defId,
  type FigurePartProps, type FigureSize,
} from './shared';

/** Type/stroke scale per render size. Never used to drop drawn information. */
const TS: Record<FigureSize, number> = { sm: 0.94, md: 1, lg: 1.1 };
const LS: Record<FigureSize, number> = { sm: 0.85, md: 1, lg: 1.2 };

/** A unit cell wider than this stops reading as a unit and starts reading as a box. */
const MAX_CELL = 40;
const MAX_GRID_H = 240;
/** No room narrower than this: below it a partial product has nowhere to sit. */
const MIN_TRACK = 20;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Group labels that are plain positive numbers make the figure an area model. */
function weightsOf(labels: string[] | undefined, n: number): number[] | null {
  if (!labels || labels.length !== n) return null;
  const w = labels.map((s) => Number(String(s).trim().replace(/,/g, '')));
  return w.every((v) => Number.isFinite(v) && v > 0) ? w : null;
}

/**
 * Track sizes summing to `total`. True proportion wins whenever every track
 * still clears the label floor; only when one would collapse do we trade some
 * proportion for legibility, and then uniformly so the order still reads.
 */
function tracks(weights: number[] | null, n: number, total: number): number[] {
  if (!weights) return new Array<number>(n).fill(total / n);
  const sum = weights.reduce((a, b) => a + b, 0);
  const floor = Math.min(MIN_TRACK, total / n);
  const raw = weights.map((w) => (w / sum) * total);
  if (raw.every((v) => v >= floor)) return raw;
  const slack = total - n * floor;
  return weights.map((w) => floor + (w / sum) * slack);
}

/** Font size that fits `text` inside a w×h cell (0.6em average advance). */
function fitText(text: string, w: number, h: number, cap: number): number {
  const n = Math.max(1, text.length);
  return Math.max(4, Math.min(cap, h * 0.44, (w - 4) / (n * 0.6)));
}

export default function AreaGridFig({ params, size }: FigurePartProps<'area-grid'>) {
  const { rows, cols } = params;
  const ts = TS[size];
  const ls = LS[size];

  const colW = weightsOf(params.colLabels, cols);
  const rowW = weightsOf(params.rowLabels, rows);
  const areaModel = colW !== null || rowW !== null;

  const rowLabelW = params.rowLabels ? 34 : 0;
  const colLabelH = params.colLabels ? 20 : 0;
  const countW = params.showCounts ? 20 : 0;
  const countH = params.showCounts ? 18 : 0;
  const left = 6 + countW + rowLabelW;
  const top = 6 + countH + colLabelH;
  const availW = W - left - 10;

  let gridW: number;
  let gridH: number;
  if (areaModel) {
    gridW = availW;
    // Both axes numeric → one unit serves x and y, so the picture is a true area.
    gridH = colW && rowW
      ? clamp((gridW / colW.reduce((a, b) => a + b, 0)) * rowW.reduce((a, b) => a + b, 0), 70, MAX_GRID_H)
      : clamp((gridW / cols) * rows, 40, MAX_GRID_H);
  } else {
    const cell = Math.min(availW / cols, MAX_CELL, MAX_GRID_H / rows);
    gridW = cell * cols;
    gridH = cell * rows;
  }

  const x0 = left + (availW - gridW) / 2;
  const y0 = top;
  const ws = tracks(colW, cols, gridW);
  const hs = tracks(rowW, rows, gridH);

  const xs: number[] = [x0];
  for (const w of ws) xs.push(xs[xs.length - 1] + w);
  const ys: number[] = [y0];
  for (const h of hs) ys.push(ys[ys.length - 1] + h);

  const H = r2(y0 + gridH + 12);

  // Ids depend on the params that change what the pattern looks like, so two
  // grids on one page get their own defs and re-rendering the same grid does not
  // churn the id. Identical grids share an id because they are identical.
  const key = `${size}-${rows}x${cols}`;
  const hatchA = defId('grid-hatch-a', key);
  const hatchB = defId('grid-hatch-b', key);

  const sr = Math.max(0, Math.min(rows, params.shadedRows ?? 0));
  const sc = Math.max(0, Math.min(cols, params.shadedCols ?? 0));
  const overlap = sr > 0 && sc > 0;

  // Row-major `shaded:n` is always a block of whole rows plus one part row, and
  // both are single rectangles even when the tracks are unequal.
  const n = params.shaded === undefined ? null : clamp(Math.round(params.shaded), 0, rows * cols);
  const fullRows = n === null ? 0 : Math.floor(n / cols);
  const partCells = n === null ? 0 : n % cols;

  const box = (r0: number, r1: number, c0: number, c1: number) => ({
    x: r2(xs[c0]), y: r2(ys[r0]), width: r2(xs[c1] - xs[c0]), height: r2(ys[r1] - ys[r0]),
  });

  const lineStroke = areaModel ? FIG.ink : FIG.inkFaint;
  const lineWidth = r2((areaModel ? STROKE.thin : STROKE.hair) * ls);

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
        <pattern id={hatchA} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={FIG.primaryDeep} strokeWidth={r2(1.2 * ls)} />
        </pattern>
        <pattern id={hatchB} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={FIG.accentDeep} strokeWidth={r2(1.2 * ls)} />
        </pattern>
      </defs>

      <rect {...box(0, rows, 0, cols)} fill={FIG.surface} />

      {sr > 0 && <rect {...box(0, sr, 0, cols)} fill={FIG.primarySoft} />}
      {sc > 0 && <rect {...box(0, rows, 0, sc)} fill={FIG.accentSoft} />}
      {overlap && <rect {...box(0, sr, 0, sc)} fill={FIG.fill} />}
      {fullRows > 0 && <rect {...box(0, fullRows, 0, cols)} fill={FIG.primarySoft} />}
      {partCells > 0 && <rect {...box(fullRows, fullRows + 1, 0, partCells)} fill={FIG.primarySoft} />}

      {/* Specific cells by row-major index — the hundred chart's scattered
          squares, which `shaded` cannot express because it fills a prefix.
          Drawn before the grid lines so the rules stay visible on top. */}
      {(params.shadedCells ?? [])
        .filter((i) => Number.isInteger(i) && i >= 0 && i < rows * cols)
        .map((i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          return <rect key={`sc${i}`} {...box(r, r + 1, c, c + 1)} fill={FIG.accentSoft} />;
        })}

      {/* The hatches are the load-bearing layer: the overlap picks up BOTH and so
          reads as cross-hatched — twice the ink of either band — with no hue. */}
      {sr > 0 && <rect {...box(0, sr, 0, cols)} fill={`url(#${hatchA})`} />}
      {sc > 0 && <rect {...box(0, rows, 0, sc)} fill={`url(#${hatchB})`} />}
      {fullRows > 0 && <rect {...box(0, fullRows, 0, cols)} fill={`url(#${hatchA})`} />}
      {partCells > 0 && <rect {...box(fullRows, fullRows + 1, 0, partCells)} fill={`url(#${hatchA})`} />}

      {ws.slice(0, -1).map((_, j) => (
        <line
          key={`v${j}`}
          x1={r2(xs[j + 1])} y1={r2(y0)} x2={r2(xs[j + 1])} y2={r2(y0 + gridH)}
          stroke={lineStroke} strokeWidth={lineWidth}
        />
      ))}
      {hs.slice(0, -1).map((_, i) => (
        <line
          key={`h${i}`}
          x1={r2(x0)} y1={r2(ys[i + 1])} x2={r2(x0 + gridW)} y2={r2(ys[i + 1])}
          stroke={lineStroke} strokeWidth={lineWidth}
        />
      ))}

      {overlap && (
        <rect
          {...box(0, sr, 0, sc)}
          fill="none" stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.bold * ls)}
        />
      )}

      <rect
        {...box(0, rows, 0, cols)}
        fill="none" stroke={FIG.ink} strokeWidth={r2(STROKE.base * ls)}
      />

      {params.cellLabels?.map((text, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        if (!text) return null;
        const cw = xs[c + 1] - xs[c];
        const ch = ys[r + 1] - ys[r];
        return (
          <text
            key={`c${i}`}
            x={r2(xs[c] + cw / 2)} y={r2(ys[r] + ch / 2)}
            textAnchor="middle" dominantBaseline="central"
            fontFamily={FONT} fontSize={r2(fitText(text, cw, ch, TEXT.body * ts))}
            fill={FIG.ink}
          >
            {text}
          </text>
        );
      })}

      {params.rowLabels?.map((text, i) => (
        <text
          key={`rl${i}`}
          x={r2(x0 - 6)} y={r2(ys[i] + (ys[i + 1] - ys[i]) / 2)}
          textAnchor="end" dominantBaseline="central"
          fontFamily={FONT} fontSize={r2(TEXT.body * ts)} fill={FIG.ink}
        >
          {text}
        </text>
      ))}

      {params.colLabels?.map((text, j) => (
        <text
          key={`cl${j}`}
          x={r2(xs[j] + (xs[j + 1] - xs[j]) / 2)} y={r2(y0 - 7)}
          textAnchor="middle" dominantBaseline="auto"
          fontFamily={FONT} fontSize={r2(TEXT.body * ts)} fill={FIG.ink}
        >
          {text}
        </text>
      ))}

      {params.showCounts && (
        <>
          <text
            x={r2(x0 - 6 - rowLabelW)} y={r2(y0 + gridH / 2)}
            textAnchor="end" dominantBaseline="central"
            fontFamily={FONT} fontSize={r2(TEXT.small * ts)} fill={FIG.inkMuted}
          >
            {rows}
          </text>
          <text
            x={r2(x0 + gridW / 2)} y={r2(y0 - 7 - colLabelH)}
            textAnchor="middle" dominantBaseline="auto"
            fontFamily={FONT} fontSize={r2(TEXT.small * ts)} fill={FIG.inkMuted}
          >
            {cols}
          </text>
        </>
      )}
    </svg>
  );
}
