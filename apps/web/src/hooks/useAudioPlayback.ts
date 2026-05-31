'use client'
// ──────────────────────────────────────────────────────────────────────────────
// useAudioPlayback — plays a remote MediaStream on an audio element
// Single responsibility: attach a stream to an audio element and handle autoplay.
// ──────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react'

type PlaybackState = 'idle' | 'ready' | 'playing' | 'paused' | 'error' | 'blocked'

interface UseAudioPlaybackReturn {
  playbackState: PlaybackState
  volume: number
  setStream: (stream: MediaStream | null) => void
  play: () => Promise<void>
  pause: () => void
  setVolume: (volume: number) => void
  audioRef: React.RefObject<HTMLAudioElement>
}

export function useAudioPlayback(): UseAudioPlaybackReturn {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle')
  const [volume, setVolumeState] = useState(1)

  const setStream = useCallback((stream: MediaStream | null) => {
    const audio = audioRef.current
    if (!audio) return

    if (!stream) {
      audio.srcObject = null
      setPlaybackState('idle')
      return
    }

    audio.srcObject = stream
    setPlaybackState('ready')

    // Attempt autoplay
    audio.play().then(() => {
      setPlaybackState('playing')
    }).catch((err) => {
      // Autoplay blocked (common on mobile and some desktop browsers)
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPlaybackState('blocked')
      } else {
        setPlaybackState('error')
        console.error('[audio-playback] Play error:', err)
      }
    })
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      await audio.play()
      setPlaybackState('playing')
    } catch (err) {
      setPlaybackState('error')
      console.error('[audio-playback] Play failed:', err)
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlaybackState('paused')
  }, [])

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol))
    setVolumeState(clamped)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
  }, [])

  // Sync volume on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  })

  return { playbackState, volume, setStream, play, pause, setVolume, audioRef }
}
