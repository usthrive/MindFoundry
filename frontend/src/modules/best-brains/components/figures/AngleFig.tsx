/**
 * Angle and shape figure — D23 (angle sum, classify by the LARGEST angle),
 * C22 (quadrilateral families), A7 (the tilted square that is still a square).
 *
 * THE RULE THIS FILE EXISTS TO KEEP: the drawn angles ARE the labelled angles.
 * D23's discrimination is "classify by the largest angle", so a 40/60/80
 * triangle drawn as a comfortable equilateral would teach a child to answer
 * from the label instead of the picture — and A7/C22 turn on a shape staying
 * exact while it tilts. Vertices are therefore CONSTRUCTED from `angles`, never
 * decorated with them, and `rotation` moves the constructed points rather than
 * skewing anything.
 */

import { FIG, STROKE, TEXT, FONT, W, r2, type FigurePartProps } from './shared';

const H = 280;
const PAD = 40; // room outside the shape for vertex letters and degree labels
const D2R = Math.PI / 180;

type Pt = { x: number; y: number };

function scaleFor(size: 'sm' | 'md' | 'lg'): number {
  return size === 'sm' ? 1.2 : size === 'lg' ? 0.95 : 1;
}

function unit(a: Pt, b: Pt): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  return { x: dx / L, y: dy / L };
}

/**
 * A triangle is fixed up to similarity by its angles, so the law of sines on a
 * unit circumdiameter gives THE triangle the labels name: the side opposite an
 * angle is sin(angle).
 */
function triangleFromAngles(a: number[]): Pt[] {
  const [A, B, C] = a;
  return [
    { x: 0, y: 0 },
    { x: Math.sin(C * D2R), y: 0 },
    { x: Math.sin(B * D2R) * Math.cos(A * D2R), y: Math.sin(B * D2R) * Math.sin(A * D2R) },
  ];
}

/**
 * A quadrilateral is NOT fixed by its angles — infinitely many realise the same
 * four — so we pick one representative: the polygon that circumscribes a
 * circle. Its tangent length at a vertex is cot(angle/2), which is strictly
 * positive for any angle the validator admits, so this walk always closes and
 * always hits the labelled angles exactly. The approximation is therefore in
 * the SIDE LENGTHS only (the most "even" member of the family): 90/90/90/90
 * draws a true square, 90/100/90/80 draws the trapezium those angles force.
 */
function tangentialPolygon(a: number[]): Pt[] {
  const halfCot = (deg: number) => 1 / Math.tan((deg * D2R) / 2);
  const pts: Pt[] = [{ x: 0, y: 0 }];
  let heading = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; i < a.length - 1; i += 1) {
    const len = halfCot(a[i]) + halfCot(a[i + 1]);
    x += len * Math.cos(heading * D2R);
    y += len * Math.sin(heading * D2R);
    pts.push({ x, y });
    heading += 180 - a[i + 1];
  }
  return pts;
}

/** Regular n-gon, oriented to stand on a flat side (its untilted "normal" look). */
function regularPolygon(n: number): Pt[] {
  const start = -90 + 180 / n;
  return Array.from({ length: n }, (_, i) => {
    const t = (start + (i * 360) / n) * D2R;
    return { x: Math.cos(t), y: Math.sin(t) };
  });
}

/**
 * Fill a single `null` so the GEOMETRY is complete while the label stays '?'.
 *
 * A fully-specified figure is returned UNTOUCHED. That line is the whole point:
 * an earlier version treated "nothing missing" as a failure to solve and fell
 * back to the regular shape, so every labelled 40/60/80 triangle drew
 * equilateral — a picture contradicting its own labels, in the week whose
 * discrimination is "classify by the LARGEST angle". The validator cannot see
 * this (the params were honest); only rendering the figure and recomputing the
 * drawn angles catches it, which is what `bb-figure-render-test` now does.
 */
function resolveAngles(raw: Array<number | null> | undefined, n: number, sum: number): number[] {
  const fallback = Array.from({ length: n }, () => sum / n);
  if (!raw || raw.length !== n) return fallback;
  const unknowns = raw.filter((v) => v === null).length;
  if (unknowns === 0) return raw as number[];
  if (unknowns > 1) return fallback;
  const known = raw.filter((v): v is number => v !== null);
  const missing = sum - known.reduce((t, v) => t + v, 0);
  if (missing <= 0 || missing >= 180) return fallback;
  return raw.map((v) => (v === null ? missing : v));
}

/**
 * The interior arc between rays `u` and `w`. `interior` is what the figure
 * claims, so a reflex opening takes the long way round instead of quietly
 * drawing its 360° complement.
 */
function arcPath(v: Pt, u: Pt, w: Pt, r: number, interior: number): string {
  const a = { x: v.x + u.x * r, y: v.y + u.y * r };
  const b = { x: v.x + w.x * r, y: v.y + w.y * r };
  const cross = u.x * w.y - u.y * w.x;
  const reflex = interior > 180.5;
  const large = reflex ? 1 : 0;
  const sweep = cross > 0 === !reflex ? 1 : 0;
  return `M ${r2(a.x)} ${r2(a.y)} A ${r2(r)} ${r2(r)} 0 ${large} ${sweep} ${r2(b.x)} ${r2(b.y)}`;
}

function bisector(u: Pt, w: Pt, reflex: boolean): Pt {
  const bx = u.x + w.x;
  const by = u.y + w.y;
  const L = Math.hypot(bx, by);
  if (L < 1e-6) return { x: -u.y, y: u.x }; // a straight angle has no bisector to speak of
  const k = (reflex ? -1 : 1) / L;
  return { x: bx * k, y: by * k };
}

export default function AngleFig({ params, size }: FigurePartProps<'angle-figure'>) {
  const s = scaleFor(size);
  const shape = params.shape;
  const showArcs = params.showArcs ?? true;
  const showRightMarks = params.showRightMarks ?? true;
  const rotation = params.rotation ?? 0;
  const fs = r2(TEXT.body * s);
  const letterFs = r2(TEXT.small * s);

  // Model space is y-up; `values[i]` is the interior angle drawn at vertex i.
  let model: Pt[];
  let values: number[];
  let closed = true;
  if (shape === 'triangle') {
    values = resolveAngles(params.angles, 3, 180);
    model = triangleFromAngles(values);
  } else if (shape === 'quadrilateral') {
    values = resolveAngles(params.angles, 4, 360);
    model = tangentialPolygon(values);
  } else if (shape === 'polygon') {
    const n = params.sides ?? 5;
    values = Array.from({ length: n }, () => ((n - 2) * 180) / n);
    model = regularPolygon(n);
  } else {
    const deg = params.degrees ?? 90;
    values = [deg];
    // The rays open symmetrically about the horizontal so the wedge — not the
    // ray length — is what fills the box after fitting.
    model = [
      { x: 0, y: 0 },
      { x: Math.cos((-deg / 2) * D2R), y: Math.sin((-deg / 2) * D2R) },
      { x: Math.cos((deg / 2) * D2R), y: Math.sin((deg / 2) * D2R) },
    ];
    closed = false;
  }

  // Rotate the model, not the SVG: a transform would carry the labels round
  // with it. Negated because the y-flip below turns model-CCW into screen-CW.
  const rot = -rotation * D2R;
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);
  const spun = model.map((p) => ({ x: p.x * cosR - p.y * sinR, y: p.x * sinR + p.y * cosR }));

  const xs = spun.map((p) => p.x);
  const ys = spun.map((p) => p.y);
  const bw = Math.max(Math.max(...xs) - Math.min(...xs), 1e-6);
  const bh = Math.max(Math.max(...ys) - Math.min(...ys), 1e-6);
  const k = Math.min((W - 2 * PAD) / bw, (H - 2 * PAD) / bh);
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const my = (Math.max(...ys) + Math.min(...ys)) / 2;
  const V: Pt[] = spun.map((p) => ({ x: r2(W / 2 + (p.x - mx) * k), y: r2(H / 2 - (p.y - my) * k) }));

  const centroid = V.reduce((t, p) => ({ x: t.x + p.x / V.length, y: t.y + p.y / V.length }), { x: 0, y: 0 });
  const labels = params.labels ?? [];
  const showLetters = size !== 'sm' && labels.length > 0;
  const sideMarks = params.sideMarks ?? [];

  // Which vertices carry an annotation, and with what text.
  const annotated: Array<{ i: number; v: number; text: string | null }> = [];
  if (shape === 'angle') {
    annotated.push({ i: 0, v: values[0], text: `${values[0]}°` });
  } else if (shape === 'triangle' || shape === 'quadrilateral') {
    const raw = params.angles;
    values.forEach((v, i) => {
      const isUnknown = !!raw && raw[i] === null;
      annotated.push({ i, v, text: isUnknown ? '?' : `${v}°` });
    });
  } else {
    // A regular polygon carries no labelled data; only the square corner is
    // worth marking, and only because it is what makes a 4-gon a square.
    values.forEach((v, i) => annotated.push({ i, v, text: null }));
  }

  const marks: JSX.Element[] = [];
  for (const { i, v, text } of annotated) {
    const vertex = V[i];
    let u: Pt;
    let w: Pt;
    let armLen: number;
    if (shape === 'angle') {
      u = unit(vertex, V[1]);
      w = unit(vertex, V[2]);
      armLen = Math.min(Math.hypot(V[1].x - vertex.x, V[1].y - vertex.y), Math.hypot(V[2].x - vertex.x, V[2].y - vertex.y));
    } else {
      const prev = V[(i - 1 + V.length) % V.length];
      const next = V[(i + 1) % V.length];
      u = unit(vertex, prev);
      w = unit(vertex, next);
      armLen = Math.min(Math.hypot(prev.x - vertex.x, prev.y - vertex.y), Math.hypot(next.x - vertex.x, next.y - vertex.y));
    }
    const isRight = Math.abs(v - 90) < 0.5 && showRightMarks && text !== '?';
    const rA = Math.min(0.3 * armLen, (shape === 'angle' ? 46 : 32) * s);

    if (isRight) {
      const q = Math.min(0.22 * armLen, 16 * s);
      const p1 = { x: vertex.x + u.x * q, y: vertex.y + u.y * q };
      const p2 = { x: vertex.x + w.x * q, y: vertex.y + w.y * q };
      marks.push(
        <path
          key={`rm${i}`}
          d={`M ${r2(p1.x)} ${r2(p1.y)} L ${r2(p1.x + p2.x - vertex.x)} ${r2(p1.y + p2.y - vertex.y)} L ${r2(p2.x)} ${r2(p2.y)}`}
          fill="none"
          stroke={FIG.primaryDeep}
          strokeWidth={r2(STROKE.thin * s)}
        />,
      );
      continue;
    }

    const reflex = v > 180.5;
    if (showArcs || text === '?') {
      marks.push(
        <path
          key={`ar${i}`}
          d={arcPath(vertex, u, w, rA, v)}
          fill="none"
          stroke={text === '?' ? FIG.attention : FIG.primaryDeep}
          strokeWidth={r2(STROKE.thin * s)}
          strokeLinecap="round"
        />,
      );
    }
    // The unknown is never dropped: it is the question the item asks.
    if (text !== null && (showArcs || text === '?')) {
      const b = bisector(u, w, reflex);
      marks.push(
        <text
          key={`av${i}`}
          x={r2(vertex.x + b.x * (rA + fs * 0.9 + 3))}
          y={r2(vertex.y + b.y * (rA + fs * 0.9 + 3))}
          fill={text === '?' ? FIG.attention : FIG.ink}
          fontFamily={FONT}
          fontSize={fs}
          fontWeight={text === '?' ? 700 : 500}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {text}
        </text>,
      );
    }
  }

  const tickMarks: JSX.Element[] = [];
  if (closed) {
    sideMarks.forEach((count, i) => {
      if (!count || count < 1 || i >= V.length) return;
      const a = V[i];
      const b = V[(i + 1) % V.length];
      const d = unit(a, b);
      const n = { x: -d.y, y: d.x };
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const half = 6 * s;
      const gap = 5 * s;
      for (let t = 0; t < count; t += 1) {
        const o = (t - (count - 1) / 2) * gap;
        const c = { x: mid.x + d.x * o, y: mid.y + d.y * o };
        tickMarks.push(
          <line
            key={`sm${i}-${t}`}
            x1={r2(c.x - n.x * half)}
            y1={r2(c.y - n.y * half)}
            x2={r2(c.x + n.x * half)}
            y2={r2(c.y + n.y * half)}
            stroke={FIG.accentDeep}
            strokeWidth={r2(STROKE.base * s)}
            strokeLinecap="round"
          />,
        );
      }
    });
  }

  const letters: JSX.Element[] = [];
  if (showLetters) {
    V.forEach((p, i) => {
      const t = labels[i];
      if (!t) return;
      const out = unit(centroid, p);
      letters.push(
        <text
          key={`vl${i}`}
          x={r2(p.x + out.x * (14 * s + letterFs * 0.4))}
          y={r2(p.y + out.y * (14 * s + letterFs * 0.4))}
          fill={FIG.inkMuted}
          fontFamily={FONT}
          fontSize={letterFs}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {t}
        </text>,
      );
    });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', height: 'auto' }}
    >
      {closed ? (
        <polygon
          points={V.map((p) => `${p.x},${p.y}`).join(' ')}
          fill={FIG.primarySoft}
          stroke={FIG.ink}
          strokeWidth={r2(STROKE.base * s)}
          strokeLinejoin="round"
        />
      ) : (
        <>
          <path
            d={`M ${V[1].x} ${V[1].y} L ${V[0].x} ${V[0].y} L ${V[2].x} ${V[2].y}`}
            fill="none"
            stroke={FIG.ink}
            strokeWidth={r2(STROKE.bold * s)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={V[0].x} cy={V[0].y} r={r2(4 * s)} fill={FIG.ink} />
        </>
      )}

      {tickMarks}
      {marks}
      {letters}
    </svg>
  );
}
