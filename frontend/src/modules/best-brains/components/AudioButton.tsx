/**
 * AudioButton (P10) — replayable TTS on every child instruction, every band.
 * Presentational; speech via the existing ttsService (browser voice — the
 * accessibility floor, never removable). Target ≥48px at all bands.
 *
 * THE CHILD CAN STOP HER TALKING. Before this, tapping while Ms. Wren was
 * speaking called `speak()` again, which restarted her from the beginning — so a
 * child who found the voice too fast, or who wanted quiet to think, had no way
 * out but to wait. That is an accessibility floor rather than a nicety: a
 * six-year-old cannot read a long instruction and listen to it at the same time.
 *
 * One button, three states, because two controls is one too many at this age:
 *   idle     🔊  tap → speaks from the start
 *   playing  ⏸   tap → pauses where she is
 *   paused   ▶   tap → carries on from there
 *
 * PAUSE IS VERIFIED, NOT ASSUMED. `speechSynthesis.pause()` is unreliable on
 * iOS Safari — it can be silently ignored, and on some versions resume never
 * fires — and this component deliberately uses the browser voice. So after
 * asking for a pause we check `isPaused()`; if the platform ignored it we stop
 * her instead and drop back to idle. Either way the tap does what the child
 * asked, which is "stop talking"; the only difference is whether the next tap
 * resumes or restarts, and the icon says which.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { isPaused, pause, resume, speak, stop } from '@/services/ttsService';
import type { InteractionBand } from '../copy';

export interface AudioButtonProps {
  text: string;
  band: InteractionBand;
  /** A band: play automatically on mount (audio-carried instruction). */
  autoplay?: boolean;
  className?: string;
}

type VoiceState = 'idle' | 'playing' | 'paused';

/** How long to give the platform to honour a pause before checking. */
const PAUSE_VERIFY_MS = 120;

export default function AudioButton({ text, band, autoplay = false, className }: AudioButtonProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const verifyTimer = useRef<number | undefined>(undefined);

  const clearVerify = useCallback(() => {
    if (verifyTimer.current !== undefined) {
      window.clearTimeout(verifyTimer.current);
      verifyTimer.current = undefined;
    }
  }, []);

  const play = useCallback(() => {
    if (!text.trim()) return;
    setState('playing');
    void speak(
      text,
      {},
      () => setState('idle'),
      () => setState('idle'),
      'browser',
    );
  }, [text]);

  const handleTap = useCallback(() => {
    if (state === 'playing') {
      pause();
      clearVerify();
      verifyTimer.current = window.setTimeout(() => {
        if (isPaused()) {
          setState('paused');
        } else {
          // The platform ignored the pause; stopping still honours the tap.
          stop();
          setState('idle');
        }
      }, PAUSE_VERIFY_MS);
      return;
    }
    if (state === 'paused') {
      resume();
      setState('playing');
      return;
    }
    play();
  }, [state, play, clearVerify]);

  useEffect(() => {
    if (autoplay) play();
    return () => {
      clearVerify();
      stop();
    };
    // Autoplay retriggers when the instruction text changes (new item).
  }, [autoplay, play, clearVerify]);

  const sizeClasses = band === 'A' ? 'h-14 w-14 text-2xl' : 'h-12 w-12 text-xl';

  // In the child's own terms — never "TTS", never "utterance".
  const label =
    state === 'playing' ? 'Stop the reading' : state === 'paused' ? 'Carry on reading' : 'Hear this instruction';
  const glyph = state === 'playing' ? '⏸' : state === 'paused' ? '▶' : '🔊';

  return (
    <button
      type="button"
      onClick={handleTap}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'bg-secondary-light text-secondary-700 shadow-sm',
        'transition-all hover:bg-secondary-light/70 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-secondary/40',
        'touch-manipulation select-none',
        state !== 'idle' && 'ring-2 ring-secondary/50',
        sizeClasses,
        className,
      )}
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );
}
