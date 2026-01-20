/**
 * useVideoPlayer - Hook for managing video player state
 * Phase 1.18: YouTube Video Integration
 *
 * Manages video player modal state, tracking, and callbacks.
 * Handles video selection, playback, and completion tracking.
 */

import { useState, useCallback } from 'react'
import type { Video, VideoTriggerType } from '@/types'

interface UseVideoPlayerOptions {
  childId: string
  onVideoComplete?: (viewId: string, video: Video) => void
}

interface VideoPlayerState {
  isOpen: boolean
  video: Video | null
  conceptId: string
  conceptName: string
  triggerType: VideoTriggerType
  sessionId: string | null
  accuracyBeforeVideo: number | null
}

export function useVideoPlayer(options: UseVideoPlayerOptions) {
  const { childId, onVideoComplete } = options

  const [state, setState] = useState<VideoPlayerState>({
    isOpen: false,
    video: null,
    conceptId: '',
    conceptName: '',
    triggerType: 'explicit_request',
    sessionId: null,
    accuracyBeforeVideo: null,
  })

  // Open video player with a specific video
  const openVideo = useCallback(
    (params: {
      video: Video
      conceptId: string
      conceptName?: string
      triggerType: VideoTriggerType
      sessionId?: string
      accuracyBeforeVideo?: number
    }) => {
      setState({
        isOpen: true,
        video: params.video,
        conceptId: params.conceptId,
        conceptName: params.conceptName || '',
        triggerType: params.triggerType,
        sessionId: params.sessionId || null,
        accuracyBeforeVideo: params.accuracyBeforeVideo ?? null,
      })
    },
    []
  )

  // Close video player
  const closeVideo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  // Handle video completion
  const handleComplete = useCallback(
    (viewId: string) => {
      if (state.video && onVideoComplete) {
        onVideoComplete(viewId, state.video)
      }
    },
    [state.video, onVideoComplete]
  )

  // Props to pass to VideoPlayerModal
  const modalProps = {
    show: state.isOpen,
    video: state.video,
    conceptId: state.conceptId,
    conceptName: state.conceptName,
    triggerType: state.triggerType,
    childId,
    sessionId: state.sessionId || undefined,
    accuracyBeforeVideo: state.accuracyBeforeVideo || undefined,
    onClose: closeVideo,
    onComplete: handleComplete,
  }

  return {
    isOpen: state.isOpen,
    currentVideo: state.video,
    openVideo,
    closeVideo,
    modalProps,
  }
}

export default useVideoPlayer
