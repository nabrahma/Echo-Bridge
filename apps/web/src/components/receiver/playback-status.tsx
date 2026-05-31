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
  const isPlaying   = playbackState === 'playing'
  const isBlocked   = playbackState === 'blocked'

  return (
    <NeonCard active={isPlaying} className="flex flex-col gap-5">
      <NeonCardHeader>
        <NeonCardTitle>Playback</NeonCardTitle>
        <StatusBadge
          state={isPlaying ? 'listening' : connectionState}
          label={isPlaying ? 'Listening' : undefined}
        />
      </NeonCardHeader>

      {/* Connection diagram */}
      <div className="flex justify-center py-2 border-t border-b border-border">
        <SignalOrb size="sm" active={isPlaying} />
      </div>

      {/* Hidden audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} autoPlay playsInline className="sr-only" />

      {/* Autoplay blocked */}
      {isBlocked && (
        <div className="space-y-3">
          <p className="text-xs text-fg-2 leading-relaxed">
            Your browser requires a tap to start audio.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onPlay}
            id="play-audio-btn"
            className="w-full"
          >
            <Play className="h-4 w-4" />
            Tap to Play
          </Button>
        </div>
      )}

      {/* Not connected */}
      {!isConnected && !isBlocked && (
        <div className="space-y-3">
          <p className="text-sm text-fg-2">
            {connectionState === 'connecting' || connectionState === 'reconnecting'
              ? 'Connecting to broadcaster…'
              : 'Waiting for audio stream…'}
          </p>
          {(connectionState === 'disconnected' || connectionState === 'error') && (
            <Button
              variant="outline"
              size="md"
              onClick={onReconnect}
              id="reconnect-btn"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Volume */}
      {(isPlaying || isBlocked) && (
        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-fg-3 flex-shrink-0" aria-hidden="true" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-[#C8960C] cursor-pointer"
            aria-label="Volume"
          />
          <span className="label text-fg-3 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Earphone tip */}
      {isPlaying && (
        <p className="flex items-center gap-2 text-xs text-fg-3 border-t border-border pt-4">
          <Headphones className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          Wired earphones recommended for best audio quality
        </p>
      )}
    </NeonCard>
  )
}
