'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CyberGrid } from '@/components/ui/cyber-grid'
import { StatusBadge } from '@/components/ui/status-badge'
import { RoomDisplay } from '@/components/broadcast/room-display'
import { StreamControls } from '@/components/broadcast/stream-controls'
import { useSignaling } from '@/hooks/useSignaling'
import { useWebRTC } from '@/hooks/useWebRTC'
import { useAudioCapture } from '@/hooks/useAudioCapture'
import { generateRoomId, generatePeerId } from '@/lib/room-utils'
import type { ServerMessage, ConnectionState } from '@echobridge/shared'

export default function BroadcastPage() {
  const [roomId] = useState(() => generateRoomId())
  const [peerId] = useState(() => generatePeerId())
  const [peerCount, setPeerCount] = useState(0)
  const [webRtcState, setWebRtcState] = useState<ConnectionState>('idle')

  const roomCreated = useRef(false)

  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? ''
  const joinUrl = `${appUrl}/join?room=${roomId}`

  // ── Audio capture ──────────────────────────────────────────────────────────
  const { stream, captureState, error: captureError, startCapture, stopCapture } = useAudioCapture()

  // ── WebRTC ─────────────────────────────────────────────────────────────────
  const { createOffer, handleAnswer, addIceCandidate, close: closeRtc } = useWebRTC({
    onOffer: (sdp) => {
      signalingRef.current?.({ type: 'offer', peerId, roomId, sdp })
    },
    onIceCandidate: (candidate) => {
      signalingRef.current?.({ type: 'ice-candidate', peerId, roomId, candidate })
    },
    onConnectionStateChange: setWebRtcState,
  })

  const signalingRef = useRef<((msg: Parameters<typeof send>[0]) => void) | null>(null)

  // ── Signaling ──────────────────────────────────────────────────────────────
  const handleSignalingMessage = useCallback(
    async (message: ServerMessage) => {
      switch (message.type) {
        case 'peer-joined':
          setPeerCount((n) => n + 1)
          // Start the WebRTC offer if we have a stream
          if (stream) {
            await createOffer(stream)
          }
          break

        case 'peer-left':
          setPeerCount((n) => Math.max(0, n - 1))
          setWebRtcState('disconnected')
          break

        case 'answer':
          await handleAnswer(message.sdp)
          break

        case 'ice-candidate':
          await addIceCandidate(message.candidate)
          break

        default:
          break
      }
    },
    [stream, createOffer, handleAnswer, addIceCandidate]
  )

  const { status: signalingStatus, send, connect } = useSignaling({
    onMessage: handleSignalingMessage,
  })

  // Store send in ref so WebRTC callbacks can access it
  useEffect(() => {
    signalingRef.current = send
  }, [send])

  // ── Connect signaling and create room on mount ─────────────────────────────
  useEffect(() => {
    const init = async () => {
      await connect()
      if (!roomCreated.current) {
        send({ type: 'create-room', peerId })
        roomCreated.current = true
      }
    }
    init().catch(console.error)

    return () => {
      send({ type: 'leave-room', peerId, roomId })
      closeRtc()
      stopCapture()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── When stream becomes available and peer is connected — send offer ───────
  useEffect(() => {
    if (stream && peerCount > 0 && webRtcState === 'idle') {
      createOffer(stream).catch(console.error)
    }
  }, [stream, peerCount, webRtcState, createOffer])

  return (
    <div className="relative min-h-screen pt-16">
      <CyberGrid withGlow />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* Page header */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-neon-yellow/60 mb-2">
                Broadcaster Control Center
              </p>
              <h1 className="font-display text-5xl tracking-display text-foreground">
                BROADCAST
              </h1>
            </div>
            <StatusBadge
              state={signalingStatus === 'connected' ? 'connected' : 'connecting'}
              label={`Signal: ${signalingStatus}`}
              className="mt-2"
            />
          </div>

          {/* Signaling hint */}
          {signalingStatus === 'error' && (
            <div className="mt-4 rounded-sm border border-red-500/30 bg-red-500/10 p-3" role="alert">
              <p className="text-xs text-red-400">
                Cannot reach signaling server. Make sure the signaling service is running at{' '}
                <code className="font-mono">{process.env['NEXT_PUBLIC_SIGNALING_URL']}</code>.
              </p>
            </div>
          )}
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Room pairing */}
          <RoomDisplay roomId={roomId} joinUrl={joinUrl} />

          {/* Right: Stream controls */}
          <StreamControls
            captureState={captureState}
            connectionState={webRtcState}
            peerCount={peerCount}
            stream={stream}
            captureError={captureError}
            onStartCapture={startCapture}
            onStopCapture={stopCapture}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-sm border border-neon-yellow/10 bg-neon-yellow/3 p-5">
          <h2 className="font-display text-xl tracking-display text-neon-yellow mb-3">
            HOW TO BROADCAST
          </h2>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-foreground/60">
            <li>Share the room code or QR code with your phone.</li>
            <li>Once your phone joins, click <strong className="text-foreground/80">Start Broadcast</strong>.</li>
            <li>When the browser prompts you, select the tab or window to share. <strong className="text-foreground/80">Check &quot;Share tab audio&quot;</strong>.</li>
            <li>Audio will stream to your phone immediately.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
