'use client'
// ──────────────────────────────────────────────────────────────────────────────
// useAudioCapture — captures system/tab audio via getDisplayMedia
// Single responsibility: request and manage the audio capture stream.
// ──────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react'

type CaptureState = 'idle' | 'requesting' | 'active' | 'stopped' | 'error'

interface UseAudioCaptureReturn {
  stream: MediaStream | null
  captureState: CaptureState
  error: string | null
  startCapture: () => Promise<void>
  stopCapture: () => void
}

export function useAudioCapture(): UseAudioCaptureReturn {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captureState, setCaptureState] = useState<CaptureState>('idle')
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCapture = useCallback(async () => {
    setCaptureState('requesting')
    setError(null)

    try {
      // getDisplayMedia captures screen/tab/window including system audio.
      // video: false is not supported on all browsers — some require a video track.
      // We request video but immediately stop those tracks after getting audio.
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 48000,
          channelCount: 2,
        },
        video: {
          // Minimal video config — we discard it immediately
          width: 1,
          height: 1,
          frameRate: 1,
        },
      } as DisplayMediaStreamOptions)

      // Stop video tracks immediately — we only want audio
      for (const track of displayStream.getVideoTracks()) {
        track.stop()
      }

      const audioTracks = displayStream.getAudioTracks()
      if (audioTracks.length === 0) {
        throw new Error(
          'No audio track found. Make sure to check "Share tab audio" or "Share system audio" when prompted.'
        )
      }

      // Build an audio-only stream
      const audioStream = new MediaStream(audioTracks)

      // Listen for track ending (user stops share from browser UI)
      audioTracks[0]?.addEventListener('ended', () => {
        setStream(null)
        streamRef.current = null
        setCaptureState('stopped')
      })

      streamRef.current = audioStream
      setStream(audioStream)
      setCaptureState('active')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to capture audio. Check browser permissions.'

      // User cancelled — not really an error
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setCaptureState('idle')
        return
      }

      setError(message)
      setCaptureState('error')
    }
  }, [])

  const stopCapture = useCallback(() => {
    const s = streamRef.current
    if (s) {
      for (const track of s.getTracks()) {
        track.stop()
      }
      streamRef.current = null
      setStream(null)
    }
    setCaptureState('stopped')
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      const s = streamRef.current
      if (s) {
        for (const track of s.getTracks()) track.stop()
      }
    }
  }, [])

  return { stream, captureState, error, startCapture, stopCapture }
}
