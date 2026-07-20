/**
 * AudioButton (P10) — replayable TTS on every child instruction, every band.
 * Presentational; speech via the existing ttsService (browser voice — the
 * accessibility floor, never removable). Target ≥48px at all bands.
 */

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { speak, stop } from '@/services/ttsService';
import type { InteractionBand } from '../copy';

export interface AudioButtonProps {
  text: string;
  band: InteractionBand;
  /** A band: play automatically on mount (audio-carried instruction). */
  autoplay?: boolean;
  className?: string;
}

export default function AudioButton({ text, band, autoplay = false, className }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    if (!text.trim()) return;
    setPlaying(true);
    void speak(
      text,
      {},
      () => setPlaying(false),
      () => setPlaying(false),
      'browser',
    );
  }, [text]);

  useEffect(() => {
    if (autoplay) play();
    return () => stop();
    // Autoplay retriggers when the instruction text changes (new item).
  }, [autoplay, play]);

  const sizeClasses = band === 'A' ? 'h-14 w-14 text-2xl' : 'h-12 w-12 text-xl';

  return (
    <button
      type="button"
      onClick={play}
      aria-label={playing ? 'Playing instruction audio' : 'Hear this instruction'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'bg-secondary-light text-secondary-700 shadow-sm',
        'transition-all hover:bg-secondary-light/70 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-secondary/40',
        'touch-manipulation select-none',
        playing && 'ring-2 ring-secondary/50',
        sizeClasses,
        className,
      )}
    >
      <span aria-hidden="true">{playing ? '…' : '🔊'}</span>
    </button>
  );
}
