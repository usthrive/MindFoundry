/**
 * Analog clock — B12 (hour/half), B17 (quarters), C18 (to the minute).
 *
 * The whole primitive exists for one misconception: C18's "2:55 read as 3:55".
 * A face that pins the hour hand to the hour teaches the error, so the hour
 * hand DRIFTS with the minutes (h*30 + m*0.5) and at 2:55 sits a whisker short
 * of the 3. The two hands are told apart by LENGTH and WIDTH, never by hue —
 * a child who cannot separate the colours must still see which is which.
 */

import { FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps } from './shared';

const H = W; // a clock face is square; the viewBox follows the drawing

const CX = W / 2;
const CY = H / 2;
const R = 140;

/** Ring radii, all derived from R so the face stays one drawing. */
const TICK_MINOR = R - 7;
const TICK_MAJOR = R - 15;
const NUMERAL_R = R - 34;
const MINUTE_LEN = R - 44;
const HOUR_LEN = MINUTE_LEN * 0.62;

/**
 * A small figure is rendered physically smaller, so its strokes and type must
 * grow RELATIVE to the drawing to stay legible in a child's hand.
 */
function scaleFor(size: 'sm' | 'md' | 'lg'): number {
  return size === 'sm' ? 1.2 : size === 'lg' ? 0.95 : 1;
}

/** Clock angles run clockwise from 12, so x uses sin and y uses -cos. */
function onFace(deg: number, radius: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [r2(CX + radius * Math.sin(rad)), r2(CY - radius * Math.cos(rad))];
}

export default function ClockFig({ params, size }: FigurePartProps<'clock'>) {
  const s = scaleFor(size);
  const marks = params.marks ?? 'five';
  const numerals = params.numerals ?? true;
  const hands = params.hands ?? 'both';
  const h12 = params.h % 12; // 12 and 0 are the same place on the face
  const m = params.m;

  const minuteDeg = m * 6;
  const hourDeg = h12 * 30 + m * 0.5;

  const ticks: Array<{ key: string; x1: number; y1: number; x2: number; y2: number; major: boolean }> = [];
  if (marks !== 'none') {
    const count = marks === 'minutes' ? 60 : 12;
    for (let i = 0; i < count; i += 1) {
      const deg = (i * 360) / count;
      const isFive = marks === 'minutes' ? i % 5 === 0 : true;
      // 'hours' draws twelve plain ticks; 'five' draws the same twelve as the
      // major ring a child counts round in fives.
      const major = marks === 'minutes' ? isFive : marks === 'five';
      const [x1, y1] = onFace(deg, R);
      const [x2, y2] = onFace(deg, major ? TICK_MAJOR : TICK_MINOR);
      ticks.push({ key: `t${i}`, x1, y1, x2, y2, major });
    }
  }

  const hourHighlit = params.highlight === 'hour';
  const minuteHighlit = params.highlight === 'minute';

  const [hx, hy] = onFace(hourDeg, HOUR_LEN);
  const [mx, my] = onFace(minuteDeg, MINUTE_LEN);

  const hourW = r2(STROKE.heavy * s * (hourHighlit ? 1.6 : 1));
  const minuteW = r2(STROKE.base * s * (minuteHighlit ? 1.6 : 1));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill={FIG.surface}
        stroke={FIG.ink}
        strokeWidth={r2(STROKE.bold * s)}
      />

      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.major ? FIG.ink : FIG.inkMuted}
          strokeWidth={r2((t.major ? STROKE.base : STROKE.hair) * s)}
          strokeLinecap="round"
        />
      ))}

      {numerals
        && Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const [x, y] = onFace(n * 30, NUMERAL_R);
          return (
            <text
              key={`n${n}`}
              x={x}
              y={y}
              fill={FIG.ink}
              fontFamily={FONT}
              fontSize={r2(TEXT.large * s)}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {n}
            </text>
          );
        })}

      {(hands === 'both' || hands === 'minute') && (
        <line
          x1={CX}
          y1={CY}
          x2={mx}
          y2={my}
          stroke={minuteHighlit ? FIG.accentDeep : FIG.primaryDeep}
          strokeWidth={minuteW}
          strokeLinecap="round"
        />
      )}

      {(hands === 'both' || hands === 'hour') && (
        <line
          x1={CX}
          y1={CY}
          x2={hx}
          y2={hy}
          stroke={hourHighlit ? FIG.accentDeep : FIG.ink}
          strokeWidth={hourW}
          strokeLinecap="round"
        />
      )}

      {/* The pin is drawn last and stays for hands:'none' — the draw-the-hands
          task needs the centre a child works from. */}
      <circle cx={CX} cy={CY} r={r2(5 * s)} fill={FIG.ink} />
      <circle cx={CX} cy={CY} r={r2(2 * s)} fill={FIG.surface} />
    </svg>
  );
}
