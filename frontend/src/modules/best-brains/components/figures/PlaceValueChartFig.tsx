/**
 * Place-value chart (B1.0) — the D1/D13/C1/B2 column picture.
 *
 * Three things the drawing has to earn, none of them decoration:
 *  - the place NAME sits over the digit, because C1's whole difficulty is that
 *    the 4 in 407 is *called* four and is *worth* four hundred; `showValues`
 *    prints the worth under the column so both live on the same picture;
 *  - the decimal point sits ON the ones/tenths boundary as a heavy divider, not
 *    inside a cell — a point drawn in a cell would read as an eleventh digit;
 *  - `showPeriods` draws the millions | thousands | ones bands over the header,
 *    which is D1's actual concept (read a big number in groups of three), so
 *    they are separated by a visible gap and tied down to the chart by ticks.
 *
 * Long names are wrapped onto extra lines and hyphenated at syllables, never
 * rotated: a child cannot read sideways text, and "hundred thousands" is one of
 * the words the week is teaching, so it may not be reduced to a code.
 */

import { defaultPlaces } from '../../figures/assert';
import { FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps } from './shared';

/**
 * `size` is the PHYSICAL render size, and the viewBox always scales to its box —
 * so a small render needs relatively LARGER type and heavier strokes to survive,
 * and a large one can afford finer detail. Hence sm > md > lg here.
 */
const SCALE: Record<'sm' | 'md' | 'lg', { type: number; stroke: number }> = {
  sm: { type: 1.12, stroke: 1.2 },
  md: { type: 1, stroke: 1 },
  lg: { type: 0.94, stroke: 0.95 },
};

/** Each place as words, each word as syllables — the only legal break points. */
const PLACE_WORDS: Record<string, string[][]> = {
  millions: [['mil', 'lions']],
  'hundred-thousands': [['hun', 'dred'], ['thou', 'sands']],
  'ten-thousands': [['ten'], ['thou', 'sands']],
  thousands: [['thou', 'sands']],
  hundreds: [['hun', 'dreds']],
  tens: [['tens']],
  ones: [['ones']],
  tenths: [['tenths']],
  hundredths: [['hun', 'dredths']],
  thousandths: [['thou', 'sandths']],
};

/** Zeros after the digit (negative = decimal places). Kept as a count, not a
 *  multiplier: 7 × 0.01 is 0.07000000000000001 in binary floating point, and a
 *  chart that teaches place value may not print that. */
const PLACE_ZEROS: Record<string, number> = {
  millions: 6, 'hundred-thousands': 5, 'ten-thousands': 4, thousands: 3,
  hundreds: 2, tens: 1, ones: 0, tenths: -1, hundredths: -2, thousandths: -3,
};

const PERIOD_NAMES = ['ones', 'thousands', 'millions', 'billions'];

/** Character budget → wrapped lines, hyphenating a word only if it cannot fit. */
function wrapPlace(place: string, maxChars: number): string[] {
  const words = PLACE_WORDS[place];
  if (!words) return place ? [place] : [];
  const lines: string[] = [];
  let cur = '';
  for (const chunks of words) {
    const word = chunks.join('');
    if (word.length <= maxChars) {
      if (!cur) cur = word;
      else if (cur.length + 1 + word.length <= maxChars) cur = `${cur} ${word}`;
      else { lines.push(cur); cur = word; }
      continue;
    }
    if (cur) { lines.push(cur); cur = ''; }
    let acc = '';
    for (let i = 0; i < chunks.length; i += 1) {
      const isLast = i === chunks.length - 1;
      const need = acc.length + chunks[i].length + (isLast ? 0 : 1);
      if (acc && need > maxChars) { lines.push(`${acc}-`); acc = chunks[i]; }
      else acc += chunks[i];
    }
    cur = acc;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Largest header type that keeps every name inside three lines. */
function fitHeader(places: string[], colW: number, typeScale: number) {
  const ladder = [TEXT.body, TEXT.small, 10, 9, 8, 7];
  let out = { font: ladder[ladder.length - 1] * typeScale, lines: [] as string[][] };
  for (const base of ladder) {
    const font = base * typeScale;
    const maxChars = Math.max(3, Math.floor((colW - 4) / (font * 0.56)));
    const lines = places.map((p) => wrapPlace(p, maxChars));
    out = { font, lines };
    if (Math.max(1, ...lines.map((l) => l.length)) <= 3) break;
  }
  return out;
}

/** The digit's WORTH as an exact string ("400", "0.07", "0"). */
function worthText(digit: string, place: string): string {
  const zeros = PLACE_ZEROS[place];
  if (zeros === undefined) return '';
  if (digit === '0') return '0';
  return zeros >= 0
    ? digit + '0'.repeat(zeros)
    : `0.${'0'.repeat(-zeros - 1)}${digit}`;
}

/** Shrink a label until it fits its column; never below a legible floor. */
function fitText(text: string, boxW: number, max: number): number {
  if (!text) return max;
  return r2(Math.max(5.5, Math.min(max, boxW / (text.length * 0.58))));
}

export default function PlaceValueChartFig({ params, size }: FigurePartProps<'place-value-chart'>) {
  const { type: ts, stroke: ss } = SCALE[size];
  const digits = params.digits ?? '';
  const chars = digits.replace('.', '').split('');
  const dotAt = digits.indexOf('.') >= 0 ? digits.indexOf('.') : -1;

  // Align supplied/derived names to the digits from the RIGHT: a digit string
  // wider than the named places (billions) still gets its column, just no name.
  const named = (params.places ?? defaultPlaces(digits)) as string[];
  const places = named.length === chars.length
    ? named
    : named.length < chars.length
      ? [...Array(chars.length - named.length).fill(''), ...named]
      : named.slice(named.length - chars.length);

  const n = Math.max(1, chars.length);
  const pad = 8;
  const chartW = W - pad * 2;
  const colW = chartW / n;

  const header = fitHeader(places, colW, ts);
  const headRows = Math.max(1, ...header.lines.map((l) => l.length));
  const lineH = header.font * 1.14;
  const headerH = headRows * lineH + 8;

  const digitFont = r2(Math.min(TEXT.huge * ts, colW * 0.62));
  const cellH = r2(digitFont * 1.72);

  const showValues = params.showValues ?? false;
  const showPeriods = params.showPeriods ?? false;
  const worths = places.map((p, i) => (showValues ? worthText(chars[i] ?? '', p) : ''));
  const valueFont = showValues
    ? Math.min(TEXT.small * ts, ...worths.map((w) => fitText(w, colW - 4, TEXT.small * ts)))
    : 0;
  const valuesH = showValues ? valueFont * 1.7 + 4 : 0;

  const bandFontMax = TEXT.small * ts;
  const bandH = showPeriods ? r2(bandFontMax * 1.9) : 0;
  const bandGap = showPeriods ? 6 : 0;

  const chartTop = r2(4 + bandH + bandGap);
  const cellsTop = r2(chartTop + headerH);
  const chartBottom = r2(cellsTop + cellH);
  const H = r2(chartBottom + valuesH + 5);

  const colX = (i: number) => r2(pad + i * colW);
  const colMid = (i: number) => r2(pad + (i + 0.5) * colW);

  // Periods: group the WHOLE columns into threes from the right. Decimal
  // columns get no band — D1's periods are a whole-number idea and a fourth
  // band over the tenths would teach the wrong thing.
  const wholeCount = dotAt >= 0 ? dotAt : chars.length;
  const bands: Array<{ from: number; to: number; label: string }> = [];
  if (showPeriods) {
    for (let i = 0; i < wholeCount; i += 1) {
      const period = Math.floor((wholeCount - 1 - i) / 3);
      const last = bands[bands.length - 1];
      if (last && last.label === PERIOD_NAMES[period] && last.to === i - 1) last.to = i;
      else bands.push({ from: i, to: i, label: PERIOD_NAMES[period] ?? '' });
    }
  }

  const hi = params.highlight ? places.indexOf(params.highlight) : -1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      <g fontFamily={FONT}>
        {/* Period bands, tied to the chart by edge ticks so the grouping cannot
            be mistaken for a floating caption. */}
        {bands.map((b) => {
          const x = colX(b.from) + 1.5;
          const w = r2(colX(b.to + 1) - colX(b.from) - 3);
          const font = fitText(b.label, w - 6, bandFontMax);
          return (
            <g key={`band-${b.from}`}>
              <rect
                x={r2(x)} y={4} width={w} height={bandH} rx={3}
                fill={FIG.primarySoft} stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.thin * ss)}
              />
              <line
                x1={r2(x)} y1={r2(4 + bandH)} x2={r2(x)} y2={chartTop}
                stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.thin * ss)}
              />
              <line
                x1={r2(x + w)} y1={r2(4 + bandH)} x2={r2(x + w)} y2={chartTop}
                stroke={FIG.primaryDeep} strokeWidth={r2(STROKE.thin * ss)}
              />
              <text
                x={r2(x + w / 2)} y={r2(4 + bandH / 2 + font * 0.35)}
                fontSize={font} fontWeight={600} fill={FIG.primaryDeep} textAnchor="middle"
              >
                {b.label}
              </text>
            </g>
          );
        })}

        <rect
          x={pad} y={chartTop} width={r2(chartW)} height={r2(headerH)}
          fill={FIG.fillSoft}
        />

        {hi >= 0 && (
          <rect
            x={colX(hi)} y={chartTop} width={r2(colW)} height={r2(chartBottom - chartTop)}
            fill={FIG.attentionSoft}
          />
        )}

        {chars.map((_, i) => (i === 0 ? null : (
          <line
            key={`div-${i}`}
            x1={colX(i)} y1={chartTop} x2={colX(i)} y2={chartBottom}
            stroke={FIG.line} strokeWidth={r2(STROKE.thin * ss)}
          />
        )))}

        <line
          x1={pad} y1={cellsTop} x2={r2(W - pad)} y2={cellsTop}
          stroke={FIG.inkMuted} strokeWidth={r2(STROKE.thin * ss)}
        />
        <rect
          x={pad} y={chartTop} width={r2(chartW)} height={r2(chartBottom - chartTop)}
          rx={4} fill="none" stroke={FIG.inkMuted} strokeWidth={r2(STROKE.base * ss)}
        />

        {header.lines.map((lines, i) => (
          <g key={`head-${i}`}>
            {lines.map((ln, j) => (
              <text
                key={`head-${i}-${j}`}
                x={colMid(i)}
                y={r2(chartTop + 5 + (j + 0.82) * lineH)}
                fontSize={r2(header.font)}
                fill={i === hi ? FIG.ink : FIG.inkMuted}
                fontWeight={i === hi ? 700 : 500}
                textAnchor="middle"
              >
                {ln}
              </text>
            ))}
          </g>
        ))}

        {chars.map((d, i) => (
          <text
            key={`digit-${i}`}
            x={colMid(i)} y={r2(cellsTop + cellH / 2 + digitFont * 0.35)}
            fontSize={digitFont} fontWeight={700} fill={FIG.ink} textAnchor="middle"
          >
            {d}
          </text>
        ))}

        {/* The decimal point: a heavy divider on the boundary plus a dot ringed
            in the surface colour, so it reads as a point sitting on the line
            rather than as a bead threaded onto it. */}
        {dotAt > 0 && dotAt < chars.length && (
          <g>
            <line
              x1={colX(dotAt)} y1={chartTop} x2={colX(dotAt)} y2={chartBottom}
              stroke={FIG.ink} strokeWidth={r2(STROKE.heavy * ss)}
            />
            <circle
              cx={colX(dotAt)} cy={r2(cellsTop + cellH * 0.76)} r={r2(3.2 * ss)}
              fill={FIG.ink} stroke={FIG.surface} strokeWidth={r2(STROKE.thin * ss)}
            />
          </g>
        )}

        {showValues && worths.map((w, i) => (
          <text
            key={`worth-${i}`}
            x={colMid(i)} y={r2(chartBottom + 4 + valueFont)}
            fontSize={r2(valueFont)} fill={i === hi ? FIG.ink : FIG.inkMuted}
            fontWeight={i === hi ? 700 : 500} textAnchor="middle"
          >
            {w}
          </text>
        ))}

        {/* Highlight outline last: hue alone never carries a distinction, so the
            marked column is a soft fill AND a heavier frame. */}
        {hi >= 0 && (
          <rect
            x={colX(hi)} y={chartTop} width={r2(colW)} height={r2(chartBottom - chartTop)}
            rx={3} fill="none" stroke={FIG.attention} strokeWidth={r2(STROKE.bold * ss)}
          />
        )}
      </g>
    </svg>
  );
}
