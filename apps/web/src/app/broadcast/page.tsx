'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RoomDisplay } from '@/components/broadcast/room-display'
import { StreamControls } from '@/components/broadcast/stream-controls'
import { StatusBadge } from '@/components/ui/status-badge'
import { useSignaling } from '@/hooks/useSignaling'
import { useWebRTC } from '@/hooks/useWebRTC'
import { useAudioCapture } from '@/hooks/useAudioCapture'
import { generateRoomId, generatePeerId } from '@/lib/room-utils'
import type { ServerMessage, ConnectionState } from '@echobridge/shared'

export default function BroadcastPage() {
  const [roomId]    = useState(() => generateRoomId())
  const [peerId]    = useState(() => generatePeerId())
  const [peerCount, setPeerCount] = useState(0)
  const [webRtcState, setWebRtcState] = useState<ConnectionState>('idle')

  const roomCreated = useRef(false)

  const appUrl  = process.env['NEXT_PUBLIC_APP_URL'] ?? ''
  const joinUrl = `${appUrl}/join?room=${roomId}`

  const { stream, captureState, error: captureError, startCapture, stopCapture } = useAudioCapture()

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

  const handleSignalingMessage = useCallback(
    async (message: ServerMessage) => {
      switch (message.type) {
        case 'peer-joined':
          setPeerCount((n) => n + 1)
          if (stream) await createOffer(stream)
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
      }
    },
    [stream, createOffer, handleAnswer, addIceCandidate]
  )

  const { status: signalingStatus, send, connect } = useSignaling({ onMessage: handleSignalingMessage })

  useEffect(() => { signalingRef.current = send }, [send])

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

  useEffect(() => {
    if (stream && peerCount > 0 && webRtcState === 'idle') {
      createOffer(stream).catch(console.error)
    }
  }, [stream, peerCount, webRtcState, createOffer])

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Page header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="label text-fg-3 mb-2">Broadcaster Control Center</p>
            <h1 className="font-display text-display-lg text-foreground">Broadcast</h1>
          </div>
          <StatusBadge
            state={signalingStatus === 'connected' ? 'connected' : 'connecting'}
            label={`Signal: ${signalingStatus}`}
          />
        </div>

        {/* Signaling error */}
        {signalingStatus === 'error' && (
          <p className="text-xs text-error mb-6" role="alert">
            Cannot reach signaling server. Check that it is running at{' '}
            <code className="font-mono">{process.env['NEXT_PUBLIC_SIGNALING_URL']}</code>.
          </p>
        )}

        {/* Main content — 2 col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RoomDisplay roomId={roomId} joinUrl={joinUrl} />
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
        <div className="mt-8 border-t border-border pt-6">
          <p className="label text-fg-3 mb-3">How to broadcast</p>
          <ol className="space-y-1.5 text-sm text-fg-2">
            {[
              'Share the room code or QR code with your phone.',
              'Once your phone joins, click Start Broadcast.',
              'Select the tab or window. Check "Share tab audio" when prompted.',
              'Audio streams to your phone immediately.',
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="label text-fg-4 w-4 flex-shrink-0 mt-0.5">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  )
}
