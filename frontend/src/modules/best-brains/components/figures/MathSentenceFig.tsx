/**
 * A written line of mathematics with a teacher's pen-marks (B1.0).
 *
 * This is the primitive the corpus asked for from the first Level-A fill:
 * the scene where the WRITING is the picture. It draws big friendly glyphs and
 * three marks a teacher makes while talking — a ring around what is being
 * discussed, an underline beneath what was decided, a box for the blank the
 * child owns. `fade` greys a token the say has set aside. A second line with a
 * connector arrow renders "this becomes that" the way b02's base-ten pairs do:
 * both states still, the step between them the child's to dwell on.
 */

import { FIG, FONT, STROKE, TEXT, W, r2, type FigurePartProps } from './shared';
import type { SentenceToken } from '../../figures/types';

const SCALE: Record<'sm' | 'md' | 'lg', number> = { sm: 1.08, md: 1, lg: 0.95 };

/** Width one character of the sentence font occupies, roughly. */
const CH = 0.62;

function lineWidth(tokens: SentenceToken[], font: number, gap: number): number {
  const chars = tokens.reduce((a, t) => a + t.text.length, 0);
  return chars * font * CH + (tokens.length - 1) * gap;
}

function Line({ tokens, y, font, gap }: { tokens: SentenceToken[]; y: number; font: number; gap: number }) {
  const width = lineWidth(tokens, font, gap);
  let x = (W - width) / 2;
  return (
    <g>
      {tokens.map((t, i) => {
        const w = t.text.length * font * CH;
        const cx = x + w / 2;
        const el = (
          <g key={i}>
            {t.mark === 'box' && (
              <rect
                x={r2(cx - w / 2 - 5)} y={r2(y - font * 0.82)} width={r2(w + 10)} height={r2(font * 1.1)}
                rx={4} fill="none" stroke={FIG.accent} strokeWidth={STROKE.base} strokeDasharray="5 4"
              />
            )}
            {t.mark === 'ring' && (
              <ellipse
                cx={r2(cx)} cy={r2(y - font * 0.3)} rx={r2(w / 2 + 7)} ry={r2(font * 0.72)}
                fill="none" stroke={FIG.accent} strokeWidth={STROKE.base}
              />
            )}
            <text
              x={r2(cx)} y={r2(y)} textAnchor="middle" fontFamily={FONT} fontSize={font}
              fill={t.mark === 'fade' ? FIG.inkMuted : FIG.ink} fontWeight={600}
            >
              {t.text}
            </text>
            {t.mark === 'underline' && (
              <line
                x1={r2(cx - w / 2 - 2)} y1={r2(y + font * 0.28)} x2={r2(cx + w / 2 + 2)} y2={r2(y + font * 0.28)}
                stroke={FIG.accent} strokeWidth={STROKE.bold} strokeLinecap="round"
              />
            )}
          </g>
        );
        x += w + gap;
        return el;
      })}
    </g>
  );
}

export default function MathSentenceFig({ params, size }: FigurePartProps<'math-sentence'>) {
  const ts = SCALE[size];
  const lines: SentenceToken[][] = [params.tokens, ...(params.then ? [params.then.tokens] : [])];

  // The largest type that fits the widest line inside the frame.
  const gapFor = (font: number) => font * 0.42;
  let font = TEXT.huge * ts;
  while (font > TEXT.body && Math.max(...lines.map((l) => lineWidth(l, font, gapFor(font)))) > W - 24) {
    font -= 1;
  }
  const gap = gapFor(font);
  const lineH = font * 1.55;
  const connectorH = params.then ? font * 1.7 : 0;
  const height = r2(16 + lines.length * lineH + connectorH + 10);
  const y1 = 16 + font;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" role="presentation" aria-hidden="true">
      <Line tokens={params.tokens} y={y1} font={font} gap={gap} />
      {params.then && (
        <>
          {params.then.connector !== 'and' && (
            <g>
              <line
                x1={W / 2} y1={r2(y1 + font * 0.55)} x2={W / 2} y2={r2(y1 + connectorH - font * 0.25)}
                stroke={FIG.inkMuted} strokeWidth={STROKE.base} markerEnd="url(#msArrow)"
              />
              <defs>
                <marker id="msArrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={FIG.inkMuted} />
                </marker>
              </defs>
              <text
                x={W / 2 + 10} y={r2(y1 + connectorH / 2 + font * 0.15)} fontFamily={FONT}
                fontSize={TEXT.small} fill={FIG.inkMuted}
              >
                {params.then.connector === 'becomes' ? 'becomes' : params.then.connector === 'equals' ? 'is the same as' : 'reads as'}
              </text>
            </g>
          )}
          <Line tokens={params.then.tokens} y={r2(y1 + connectorH + font * 0.9)} font={font} gap={gap} />
        </>
      )}
    </svg>
  );
}
