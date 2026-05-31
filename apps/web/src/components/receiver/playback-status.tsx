'use client'
import { Play, Volume2, RefreshCw, Headphones } from 'lucide-react'
import { NeonCard, NeonCardHeader, NeonCardTitle } from '@/components/ui/neon-card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { SignalOrb } from '@/components/ui/signal-orb'
import type { ConnectionState } from '@echobridge/shared'

interface PlaybackStatusProps {
  connectionState: ConnectionState
  playbackState: 'idle' | 'ready' | 'playing' | 'paused' | 'error' | 'blocked'
  volume: number
  onPlay: () => void
  onVolumeChange: (v: number) => void
  onReconnect: () => void
  audioRef: React.RefObject<HTMLAudioElement>
}

/**
 * PlaybackStatus — phone-side playback controls and connection status.
 */
export function PlaybackStatus({
  connectionState,
  playbackState,
  volume,
  onPlay,
  onVolumeChange,
  onReconnect,
  audioRef,
}: PlaybackStatusProps) {
  const isConnected = connectionState === 'connected'
  const isPlaying = playbackState === 'playing'
  const isBlocked = playbackState === 'blocked'

  return (
    <NeonCard active={isPlaying} glow={isPlaying} className="flex flex-col items-center text-center gap-6">
      <NeonCardHeader className="flex-col items-center gap-2 mb-0">
        <NeonCardTitle>Playback</NeonCardTitle>
        <StatusBadge
          state={isPlaying ? 'listening' : connectionState}
          label={isPlaying ? 'Listening' : undefined}
        />
      </NeonCardHeader>

      {/* Orb visual */}
      <div className="my-4">
        <SignalOrb size="md" active={isPlaying} />
      </div>

      {/* Hidden audio element — streams remote audio */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} autoPlay playsInline className="sr-only" />

      {/* Autoplay blocked message */}
      {isBlocked && (
        <div className="rounded-sm border border-neon-yellow/30 bg-neon-yellow/5 p-4 w-full">
          <p className="text-sm text-neon-yellow/80 mb-3">
            Tap the button below to start audio playback. Your browser requires a user gesture.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onPlay}
            id="play-audio-btn"
            className="w-full"
            aria-label="Start audio playback"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Tap to Play
          </Button>
        </div>
      )}

      {/* Not connected state */}
      {!isConnected && !isBlocked && (
        <div className="w-full space-y-3">
          <p className="text-sm text-foreground/50">
            {connectionState === 'connecting' || connectionState === 'reconnecting'
              ? 'Connecting to broadcaster...'
              : 'Waiting for audio stream...'}
          </p>
          {(connectionState === 'disconnected' || connectionState === 'error') && (
            <Button
              variant="outline"
              size="md"
              onClick={onReconnect}
              id="reconnect-btn"
              className="w-full"
              aria-label="Retry connection"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry Connection
            </Button>
          )}
        </div>
      )}

      {/* Volume control */}
      {(isPlaying || isBlocked) && (
        <div className="w-full flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-foreground/40 flex-shrink-0" aria-hidden="true" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-yellow-400 cursor-pointer"
            aria-label="Volume control"
          />
          <span className="text-xs text-foreground/40 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Earphone tip */}
      {isPlaying && (
        <div className="flex items-center gap-2 text-xs text-foreground/35 border-t border-neon-yellow/10 pt-4 w-full justify-center">
          <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Plug in wired earphones for the best experience</span>
        </div>
      )}
    </NeonCard>
  )
}
