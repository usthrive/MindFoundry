/**
 * The one place a Best Brains figure becomes a picture (B1.0).
 *
 * Every child surface that shows a prompt shows it through here, so the
 * accessibility contract, the sizing and the child-safe palette are decided
 * once. The primitives draw geometry only; this wrapper owns the semantics:
 * the SVG is `aria-hidden` and the frame carries `role="img"` with the figure's
 * `alt` as its name — a screen reader hears one description, not a soup of
 * decorative shapes.
 */

import type { BBFigure } from '../../figures/types';
import type { InteractionBand } from '../../copy';
import { promptImageAlt, promptText } from '../../figures/prompt';
import type { FigureSize } from './shared';
import { FIG } from './shared';

import NumberLineFig from './NumberLineFig';
import BarModelFig from './BarModelFig';
import AreaGridFig from './AreaGridFig';
import TenFrameFig from './TenFrameFig';
import CountersFig from './CountersFig';
import PlaceValueChartFig from './PlaceValueChartFig';
import ClockFig from './ClockFig';
import CoinSetFig from './CoinSetFig';
import CoordinateGridFig from './CoordinateGridFig';
import AngleFig from './AngleFig';

/** Band A gets the biggest drawing: small hands, unpractised eyes, no reading. */
export function sizeForBand(band: InteractionBand): FigureSize {
  return band === 'A' ? 'lg' : 'md';
}

const MAX_WIDTH: Record<FigureSize, number> = { sm: 220, md: 330, lg: 420 };

function Primitive({ figure, size }: { figure: BBFigure; size: FigureSize }) {
  switch (figure.type) {
    case 'number-line': return <NumberLineFig params={figure.params} size={size} />;
    case 'bar-model': return <BarModelFig params={figure.params} size={size} />;
    case 'area-grid': return <AreaGridFig params={figure.params} size={size} />;
    case 'ten-frame': return <TenFrameFig params={figure.params} size={size} />;
    case 'counters': return <CountersFig params={figure.params} size={size} />;
    case 'place-value-chart': return <PlaceValueChartFig params={figure.params} size={size} />;
    case 'clock': return <ClockFig params={figure.params} size={size} />;
    case 'coin-set': return <CoinSetFig params={figure.params} size={size} />;
    case 'coordinate-grid': return <CoordinateGridFig params={figure.params} size={size} />;
    case 'angle-figure': return <AngleFig params={figure.params} size={size} />;
  }
}

export default function BBFigureView({
  figure,
  band,
  size,
  className,
}: {
  figure: BBFigure;
  band?: InteractionBand;
  size?: FigureSize;
  className?: string;
}) {
  const s: FigureSize = size ?? sizeForBand(band ?? 'B');
  return (
    <figure className={className} style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        role="img"
        aria-label={figure.alt}
        style={{ width: '100%', maxWidth: MAX_WIDTH[s] }}
      >
        <Primitive figure={figure} size={s} />
      </div>
      {figure.caption && (
        <figcaption style={{ color: FIG.inkMuted, fontSize: 13, textAlign: 'center' }}>{figure.caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * A prompt and its picture, together — the shape every practice surface needs.
 *
 * When a figure is attached it is drawn. When one is NOT attached but the
 * prompt still carries an authored `[image: …]` direction, the words are shown
 * as a quiet note rather than as literal bracket characters in the middle of
 * the question (LEARNINGS L27: `PracticePage` used to print them raw to a
 * pre-reader). That note is a visible marker of un-migrated content, not a
 * design; `bb-verify-packs` counts them.
 */
export function PromptFigure({
  prompt,
  figure,
  band,
  size,
}: {
  prompt: string;
  figure?: BBFigure;
  band?: InteractionBand;
  size?: FigureSize;
}) {
  if (figure) return <BBFigureView figure={figure} band={band} size={size} />;

  // NO PICTURE? THEN SAY THE SCENE, AS A SENTENCE — NOT AS A STAGE DIRECTION.
  //
  // This began as "🖼 6 rods and 2 cubes in labeled columns" in grey 14px under
  // the question: a caption that looked like a broken image and read like a note
  // to an illustrator. A child was asked to read a number off it.
  //
  // The first repair was to show nothing at all. That is right when the picture
  // was only support — "45 - 27 = ?" stands on its own — but wrong when the
  // scene carries the question. Three Level-A items put their whole content in
  // the direction: strip it from "[image: 7 red balloons, 5 blue balloons] Which
  // color has MORE?" and no colour is named anywhere. Silence made those
  // unanswerable rather than merely confusing.
  //
  // So the words come back, but as CONTENT: the same size and colour as the
  // question, sitting where a first sentence would, which is exactly where
  // speakablePrompt already reads them for the audio-first band. A described
  // scene is a poor substitute for a drawn one and every item here still wants
  // its picture — bb-verify-packs fails on any that is not declared — but a
  // sentence a child can act on beats both a caption they cannot and a blank
  // space that tells them nothing.
  const alt = promptImageAlt(prompt);
  if (!alt) return null;
  const scene = alt.charAt(0).toUpperCase() + alt.slice(1);
  return (
    <p style={{ color: FIG.ink, fontSize: band === 'A' ? 20 : 18, textAlign: 'center' }}>
      {scene}{/[.!?]$/.test(scene) ? '' : '.'}
    </p>
  );
}

export { promptText, promptImageAlt };
