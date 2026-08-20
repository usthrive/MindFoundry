/**
 * The vertical written algorithm as a still (B1.0) — carried tens, borrows,
 * partial rows, the placeholder zero, the decimal alignment line.
 *
 * Everything here is what a teacher leaves on the board mid-explanation:
 * a carry digit small above its column, a struck-out digit with its
 * replacement written above, the rule before the result row, the point
 * drawn down through every row so alignment is visible rather than asserted.
 */

import { FIG, FONT, STROKE, W, r2, type FigurePartProps } from './shared';

const SCALE: Record<'sm' | 'md' | 'lg', number> = { sm: 1.08, md: 1, lg: 0.95 };

export default function ColumnMethodFig({ params, size }: FigurePartProps<'column-method'>) {
  const ts = SCALE[size];
  const rows = params.rows;
  const cols = rows[0]?.cells.length ?? 1;

  const cell = Math.min(34, (W - 90) / cols) * ts;
  const font = cell * 0.68;
  const carryFont = font * 0.62;
  const rowH = cell * 1.06;
  const top = 14;
  const left = (W - cols * cell) / 2 + cell * 0.25;

  // Row y-positions: carry rows ride above the row that follows them.
  const yOf: number[] = [];
  let y = top;
  rows.forEach((r, i) => {
    if (r.role === 'carry') {
      yOf[i] = y + carryFont; // sits in the gap above the next row
      y += carryFont * 1.35;
    } else {
      yOf[i] = y + font;
      y += rowH;
    }
  });
  const resultIdx = rows.findIndex((r) => r.role === 'result');
  const ruleY = resultIdx > 0 ? r2(yOf[resultIdx] - font * 1.05) : null;
  const height = r2(y + 10);

  const xOf = (c: number) => r2(left + c * cell + cell / 2);
  const opRow = [...rows].reverse().find((r) => r.role === 'operand');
  const opRowIdx = opRow ? rows.lastIndexOf(opRow) : -1;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" role="presentation" aria-hidden="true">
      {(params.highlightCols ?? []).map((c) => (
        <rect
          key={`h${c}`} x={r2(left + c * cell)} y={4} width={r2(cell)} height={height - 8}
          rx={5} fill={FIG.accentSoft ?? '#f3e8d9'} opacity={0.55}
        />
      ))}
      {rows.map((r, i) =>
        r.cells.map((c, j) => {
          if (!c) return null;
          const struck = (r.struck ?? []).includes(j);
          const f = r.role === 'carry' ? carryFont : font;
          return (
            <g key={`${i}.${j}`}>
              <text
                x={xOf(j)} y={r2(yOf[i])} textAnchor="middle" fontFamily={FONT} fontSize={f}
                fill={r.role === 'carry' ? FIG.accent : r.role === 'partial' ? FIG.inkMuted : FIG.ink}
                fontWeight={r.role === 'result' ? 700 : 600}
              >
                {c}
              </text>
              {struck && (
                <line
                  x1={r2(xOf(j) - f * 0.42)} y1={r2(yOf[i] - f * 0.32)}
                  x2={r2(xOf(j) + f * 0.42)} y2={r2(yOf[i] - f * 0.02)}
                  stroke={FIG.accent} strokeWidth={STROKE.base} strokeLinecap="round"
                />
              )}
            </g>
          );
        }),
      )}
      {params.op && opRowIdx >= 0 && (
        <text
          x={r2(left - cell * 0.55)} y={r2(yOf[opRowIdx])} textAnchor="middle"
          fontFamily={FONT} fontSize={font} fill={FIG.ink} fontWeight={600}
        >
          {params.op}
        </text>
      )}
      {ruleY !== null && (
        <line
          x1={r2(left - cell * 0.9)} y1={ruleY} x2={r2(left + cols * cell + cell * 0.15)} y2={ruleY}
          stroke={FIG.ink} strokeWidth={STROKE.bold} strokeLinecap="round"
        />
      )}
      {params.pointAfterCol !== undefined && (
        <g>
          {rows.map((r, i) =>
            r.role === 'carry' ? null : (
              <circle
                key={`p${i}`} cx={r2(left + (params.pointAfterCol! + 1) * cell)} cy={r2(yOf[i] - font * 0.06)}
                r={r2(Math.max(2, font * 0.09))} fill={FIG.ink}
              />
            ),
          )}
          <line
            x1={r2(left + (params.pointAfterCol + 1) * cell)} y1={6}
            x2={r2(left + (params.pointAfterCol + 1) * cell)} y2={height - 6}
            stroke={FIG.inkMuted} strokeWidth={STROKE.hair} strokeDasharray="3 4"
          />
        </g>
      )}
    </svg>
  );
}
