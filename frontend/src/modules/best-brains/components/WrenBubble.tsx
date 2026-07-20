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

export type WrenEmotion = 'warm' | 'curious' | 'settled';

export interface WrenBubbleProps {
  band: InteractionBand;
  text: string;
  emotion?: WrenEmotion;
  /** A band: autoplay the line (audio-carried, P10). */
  autoplay?: boolean;
  className?: string;
}

const EMOTION_STYLES: Record<WrenEmotion, string> = {
  warm: 'bg-primary-light border-primary/20',
  curious: 'bg-secondary-light border-secondary/20',
  settled: 'bg-surface border-gray-200',
};

export default function WrenBubble({ band, text, emotion = 'warm', autoplay, className }: WrenBubbleProps) {
  if (!text) return null;
  return (
    <div className={cn('flex items-start gap-3', className)} role="note" aria-label="Ms. Wren says">
      {/* Persona avatar: warm at A/B, plain marker at C (no mascot decoration at C). */}
      <div
        aria-hidden="true"
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
          band === 'C' ? 'h-9 w-9 bg-secondary text-sm' : 'h-12 w-12 bg-secondary text-xl',
        )}
      >
        {band === 'C' ? 'W' : '🪶'}
      </div>
      <div
        className={cn(
          'relative flex-1 rounded-2xl rounded-tl-md border px-4 py-3',
          EMOTION_STYLES[emotion],
        )}
      >
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
