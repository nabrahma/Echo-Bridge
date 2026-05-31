'use client'
import { Mic, Square, Radio } from 'lucide-react'
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

export function StreamControls({
  captureState,
  connectionState,
  peerCount,
  stream,
  captureError,
  onStartCapture,
  onStopCapture,
}: StreamControlsProps) {
  const isActive    = captureState === 'active'
  const isRequesting = captureState === 'requesting'

  return (
    <NeonCard active={isActive}>
      <NeonCardHeader>
        <NeonCardTitle>Audio Source</NeonCardTitle>
        <StatusBadge
          state={isActive ? 'broadcasting' : connectionState}
          label={isActive ? 'Broadcasting' : undefined}
        />
      </NeonCardHeader>

      {/* Meter */}
      <div className="mb-5 border border-border rounded-sm p-3 bg-surface-2">
        <AudioMeter stream={stream} active={isActive} />
      </div>

      {/* Listener count */}
      <div className="flex items-center justify-between mb-5 py-2.5 border-t border-b border-border">
        <span className="label text-fg-3">Listeners</span>
        <span className="label text-foreground">{peerCount} / 1</span>
      </div>

      {/* Controls */}
      {!isActive ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onStartCapture}
          disabled={isRequesting}
          id="start-broadcast-btn"
          className="w-full"
        >
          {isRequesting ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              Requesting Access…
            </>
          ) : (
            <>
              <Radio className="h-4 w-4" />
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
        >
          <Square className="h-4 w-4 fill-current" />
          Stop Broadcast
        </Button>
      )}

      {/* Error */}
      {captureError && (
        <p className="mt-4 text-xs text-error leading-relaxed" role="alert">
          <Mic className="inline h-3.5 w-3.5 mr-1.5 opacity-70" aria-hidden="true" />
          {captureError}
        </p>
      )}

      {/* Instruction */}
      {!isActive && captureState !== 'error' && (
        <p className="mt-4 text-xs text-fg-3 leading-relaxed text-center">
          When prompted, select the tab or window to broadcast.
          Check <strong className="text-fg-2">Share tab audio</strong>.
        </p>
      )}
    </NeonCard>
  )
}
