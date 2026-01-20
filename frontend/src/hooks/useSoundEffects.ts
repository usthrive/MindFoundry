/**
 * useSoundEffects - Hook for playing animation sound effects
 * Phase 1.12: Educational Animation System
 *
 * Uses Web Audio API to generate sounds programmatically.
 * No external audio files needed - sounds are synthesized.
 */

import { useCallback, useRef, useEffect } from 'react'

// Sound types available
export type SoundType =
  | 'pop'        // Soft pop for counting
  | 'ding'       // Success/completion ding
  | 'whoosh'     // Transition/movement sound
  | 'click'      // Button/selection click
  | 'success'    // Cheerful success (multi-tone)
  | 'borrow'     // Borrowing sound (descending)
  | 'carry'      // Carrying sound (ascending)

interface UseSoundEffectsOptions {
  enabled?: boolean
  volume?: number // 0 to 1
}

export function useSoundEffects(options: UseSoundEffectsOptions = {}) {
  const { enabled = true, volume = 0.3 } = options
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize AudioContext lazily (must be after user interaction)
  const getAudioContext = useCallback((): AudioContext | null => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) {
          console.warn('[useSoundEffects] AudioContext not supported in this browser')
          return null
        }
        audioContextRef.current = new AudioContextClass()
      }
      // Resume if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch((err) => {
          console.warn('[useSoundEffects] Failed to resume AudioContext:', err)
        })
      }
      return audioContextRef.current
    } catch (error) {
      console.warn('[useSoundEffects] Error creating AudioContext:', error)
      return null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play a simple tone
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine', attack = 0.01, decay = 0.1) => {
      if (!enabled) return

      try {
        const ctx = getAudioContext()
        if (!ctx) return // AudioContext not available, fail silently

        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

        // Envelope: attack and decay
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + duration)
      } catch (error) {
        // Fail silently - animations should continue even if sound fails
        console.warn('[useSoundEffects] Error playing tone:', error)
      }
    },
    [enabled, volume, getAudioContext]
  )

  // Play specific sound effects
  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!enabled) return

      switch (soundType) {
        case 'pop':
          // Soft pop - quick high frequency burst
          playTone(800, 0.08, 'sine', 0.005, 0.05)
          break

        case 'ding':
          // Clear ding - pleasant bell-like sound
          playTone(880, 0.3, 'sine', 0.01, 0.2)
          setTimeout(() => playTone(1320, 0.2, 'sine', 0.01, 0.15), 50)
          break

        case 'whoosh':
          // Whoosh - frequency sweep
          if (!enabled) return
          try {
            const ctx = getAudioContext()
            if (!ctx) return // AudioContext not available, fail silently
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(400, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15)
            gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.15)
          } catch (error) {
            console.warn('[useSoundEffects] Error playing whoosh:', error)
          }
          break

        case 'click':
          // Quick click
          playTone(600, 0.05, 'square', 0.001, 0.03)
          break

        case 'success':
          // Cheerful ascending tones
          playTone(523, 0.15, 'sine', 0.01, 0.1) // C
          setTimeout(() => playTone(659, 0.15, 'sine', 0.01, 0.1), 100) // E
          setTimeout(() => playTone(784, 0.25, 'sine', 0.01, 0.15), 200) // G
          break

        case 'borrow':
          // Descending tone for borrowing
          playTone(600, 0.12, 'triangle', 0.01, 0.08)
          setTimeout(() => playTone(400, 0.15, 'triangle', 0.01, 0.1), 80)
          break

        case 'carry':
          // Ascending tone for carrying
          playTone(400, 0.12, 'triangle', 0.01, 0.08)
          setTimeout(() => playTone(600, 0.15, 'triangle', 0.01, 0.1), 80)
          break

        default:
          break
      }
    },
    [enabled, playTone, getAudioContext, volume]
  )

  return {
    playSound,
    playPop: useCallback(() => playSound('pop'), [playSound]),
    playDing: useCallback(() => playSound('ding'), [playSound]),
    playWhoosh: useCallback(() => playSound('whoosh'), [playSound]),
    playClick: useCallback(() => playSound('click'), [playSound]),
    playSuccess: useCallback(() => playSound('success'), [playSound]),
    playBorrow: useCallback(() => playSound('borrow'), [playSound]),
    playCarry: useCallback(() => playSound('carry'), [playSound]),
  }
}

export default useSoundEffects
