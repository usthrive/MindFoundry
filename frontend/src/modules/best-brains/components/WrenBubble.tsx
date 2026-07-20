/**
 * WrenBubble — Ms. Wren's presence on any screen: one conversational turn at
 * a time, band-voiced (SCREEN-SPECS §F). Never blocks input to the task;
 * never two competing bubbles (P2). Paired AudioButton always.
 *
 * Band decoration law: mascot-adjacent warmth at A, light at B, none at C.
 */

import { cn } from '@/lib/utils';
import type { InteractionBand } from '../copy';
import AudioButton from './AudioButton';
import WrenMark from './WrenMark';

export type WrenEmotion = 'warm' | 'curious' | 'settled';

export interface WrenBubbleProps {
  band: InteractionBand;
  text: string;
  emotion?: WrenEmotion;
  /** A band: autoplay the line (audio-carried, P10). */
  autoplay?: boolean;
  className?: string;
}

/** Reference grammar: white bubble default; teal-soft for the warm register. */
const EMOTION_STYLES: Record<WrenEmotion, string> = {
  warm: 'mf-bubble-teal',
  curious: 'mf-bubble',
  settled: 'mf-bubble',
};

export default function WrenBubble({ band, text, emotion = 'warm', autoplay, className }: WrenBubbleProps) {
  if (!text) return null;
  return (
    <div className={cn('flex items-start gap-3', className)} role="note" aria-label="Ms. Wren says">
      {/* The Wren mark (design/inbound motif): full at A/B, smaller at C (band decoration law). */}
      <WrenMark size={band === 'C' ? 28 : 36} className="mt-1 shrink-0" />
      <div className={cn('relative flex-1 px-4 py-3', EMOTION_STYLES[emotion])}>
        <p
          className={cn(
            'text-text-primary',
            band === 'A' ? 'text-xl leading-relaxed' : band === 'B' ? 'text-lg' : 'text-base',
          )}
        >
          {text}
        </p>
        <div className="mt-2 flex justify-end">
          <AudioButton text={text} band={band} autoplay={band === 'A' ? autoplay : false} />
        </div>
      </div>
    </div>
  );
}
