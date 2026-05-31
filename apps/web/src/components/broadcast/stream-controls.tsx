'use client'
import { Mic, MicOff, Square, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NeonCard, NeonCardHeader, NeonCardTitle } from '@/components/ui/neon-card'
import { AudioMeter } from '@/components/ui/audio-meter'
import { StatusBadge } from '@/components/ui/status-badge'
import type { ConnectionState } from '@echobridge/shared'

interface StreamControlsProps {
  captureState: 'idle' | 'requesting' | 'active' | 'stopped' | 'error'
  connectionState: ConnectionState
  peerCount: number
  stream: MediaStream | null
  captureError: string | null
  onStartCapture: () => void
  onStopCapture: () => void
}

/**
 * StreamControls — broadcaster controls: start/stop capture + stream health.
 */
export function StreamControls({
  captureState,
  connectionState,
  peerCount,
  stream,
  captureError,
  onStartCapture,
  onStopCapture,
}: StreamControlsProps) {
  const isActive = captureState === 'active'
  const isRequesting = captureState === 'requesting'

  return (
    <NeonCard active={isActive} glow={isActive && connectionState === 'connected'}>
      <NeonCardHeader>
        <NeonCardTitle>Audio Source</NeonCardTitle>
        <StatusBadge
          state={isActive ? 'broadcasting' : connectionState}
          label={isActive ? 'Broadcasting' : undefined}
        />
      </NeonCardHeader>

      {/* Audio meter */}
      <div className="mb-6">
        <AudioMeter stream={stream} active={isActive} />
      </div>

      {/* Peer count indicator */}
      <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-wide">
        <span className="text-foreground/40">Listeners connected</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${peerCount > 0 ? 'bg-green-400 animate-pulse-slow' : 'bg-gray-600'}`}
            aria-hidden="true"
          />
          <span className={peerCount > 0 ? 'text-neon-yellow' : 'text-foreground/50'}>
            {peerCount} / 1
          </span>
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {!isActive ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onStartCapture}
            disabled={isRequesting}
            id="start-broadcast-btn"
            className="w-full"
            aria-label="Start audio capture and broadcast"
          >
            {isRequesting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" aria-hidden="true" />
                Requesting Access...
              </>
            ) : (
              <>
                <Radio className="h-4 w-4" aria-hidden="true" />
                Start Broadcast
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="danger"
            size="lg"
            onClick={onStopCapture}
            id="stop-broadcast-btn"
            className="w-full"
            aria-label="Stop audio broadcast"
          >
            <Square className="h-4 w-4 fill-current" aria-hidden="true" />
            Stop Broadcast
          </Button>
        )}
      </div>

      {/* Error state */}
      {captureError && (
        <div className="mt-4 rounded-sm border border-red-500/30 bg-red-500/10 p-3" role="alert">
          <p className="text-xs text-red-400 flex items-start gap-2">
            <MicOff className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {captureError}
          </p>
        </div>
      )}

      {/* Guidance */}
      {!isActive && captureState !== 'error' && (
        <p className="mt-4 text-xs text-foreground/35 text-center leading-relaxed">
          When prompted, select the tab or window you want to broadcast.
          Make sure to check <strong className="text-foreground/55">Share tab audio</strong>.
        </p>
      )}
    </NeonCard>
  )
}
