'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CyberGrid } from '@/components/ui/cyber-grid'
import { JoinForm } from '@/components/receiver/join-form'
import { PlaybackStatus } from '@/components/receiver/playback-status'
import { NeonCard } from '@/components/ui/neon-card'
import { useSignaling } from '@/hooks/useSignaling'
import { useWebRTC } from '@/hooks/useWebRTC'
import { useAudioPlayback } from '@/hooks/useAudioPlayback'
import { generatePeerId } from '@/lib/room-utils'
import type { ServerMessage, ConnectionState } from '@echobridge/shared'

function JoinPageInner() {
  const searchParams = useSearchParams()
  const prefillRoomId = searchParams.get('room') ?? ''

  const [peerId] = useState(() => generatePeerId())
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [webRtcState, setWebRtcState] = useState<ConnectionState>('idle')

  const signalingRef = useRef<((msg: Parameters<typeof send>[0]) => void) | null>(null)

  // ── Audio playback ─────────────────────────────────────────────────────────
  const { playbackState, volume, setStream, play, setVolume, audioRef } = useAudioPlayback()

  // ── WebRTC ─────────────────────────────────────────────────────────────────
  const { handleOffer, addIceCandidate, close: closeRtc } = useWebRTC({
    onAnswer: (sdp) => {
      if (joinedRoomId) {
        signalingRef.current?.({ type: 'answer', peerId, roomId: joinedRoomId, sdp })
      }
    },
    onIceCandidate: (candidate) => {
      if (joinedRoomId) {
        signalingRef.current?.({ type: 'ice-candidate', peerId, roomId: joinedRoomId, candidate })
      }
    },
    onRemoteStream: (remoteStream) => {
      setStream(remoteStream)
    },
    onConnectionStateChange: setWebRtcState,
  })

  // ── Signaling message handler ──────────────────────────────────────────────
  const handleSignalingMessage = useCallback(
    async (message: ServerMessage) => {
      switch (message.type) {
        case 'room-joined':
          setIsJoining(false)
          break

        case 'room-not-found':
          setIsJoining(false)
          setJoinError('Room not found. Check the code and try again.')
          setJoinedRoomId(null)
          break

        case 'offer':
          await handleOffer(message.sdp)
          break

        case 'ice-candidate':
          await addIceCandidate(message.candidate)
          break

        case 'peer-left':
          setWebRtcState('disconnected')
          setStream(null)
          break

        case 'error':
          setIsJoining(false)
          setJoinError(message.message)
          break

        default:
          break
      }
    },
    [handleOffer, addIceCandidate, setStream]
  )

  const { status: signalingStatus, send, connect } = useSignaling({
    onMessage: handleSignalingMessage,
  })

  useEffect(() => {
    signalingRef.current = send
  }, [send])

  // Connect signaling on mount
  useEffect(() => {
    connect().catch(console.error)

    return () => {
      if (joinedRoomId) {
        send({ type: 'leave-room', peerId, roomId: joinedRoomId })
      }
      closeRtc()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Handle join ────────────────────────────────────────────────────────────
  const handleJoin = useCallback(
    async (roomId: string) => {
      setJoinError(null)
      setIsJoining(true)

      if (signalingStatus !== 'connected') {
        try {
          await connect()
        } catch {
          setIsJoining(false)
          setJoinError('Cannot connect to signaling server. Make sure both devices are on the same network and the server is running.')
          return
        }
      }

      setJoinedRoomId(roomId)
      send({ type: 'join-room', peerId, roomId })
    },
    [signalingStatus, connect, send, peerId]
  )

  const handleReconnect = () => {
    if (joinedRoomId) handleJoin(joinedRoomId)
  }

  return (
    <div className="relative min-h-screen pt-16">
      <CyberGrid withGlow />

      <div className="relative z-10 mx-auto max-w-lg px-6 py-12">
        {/* Page header */}
        <div className="mb-10 text-center animate-slide-up">
          <p className="text-xs uppercase tracking-widest text-neon-yellow/60 mb-2">
            Receiver Mode
          </p>
          <h1 className="font-display text-5xl tracking-display text-foreground">
            JOIN ROOM
          </h1>
          <p className="mt-3 text-sm text-foreground/50">
            Enter the room code displayed on the broadcaster&apos;s laptop.
          </p>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Join form — shown until joined */}
          {!joinedRoomId ? (
            <JoinForm
              onJoin={handleJoin}
              isJoining={isJoining}
              error={joinError}
              // Pass prefill from URL query param (scanned QR)
              // Note: JoinForm manages its own input state; prefill handled below
            />
          ) : (
            <PlaybackStatus
              connectionState={webRtcState}
              playbackState={playbackState}
              volume={volume}
              onPlay={play}
              onVolumeChange={setVolume}
              onReconnect={handleReconnect}
              audioRef={audioRef}
            />
          )}

          {/* Connection info */}
          {joinedRoomId && (
            <NeonCard className="text-center py-3 px-4">
              <p className="text-xs text-foreground/40 uppercase tracking-wide">
                Room &nbsp;
                <span className="font-display text-neon-yellow text-base tracking-widest">
                  {joinedRoomId}
                </span>
              </p>
            </NeonCard>
          )}

          {/* Troubleshooting tips */}
          <div className="rounded-sm border border-neon-yellow/10 p-4">
            <h2 className="text-xs uppercase tracking-wide text-neon-yellow/60 mb-2 font-medium">
              Troubleshooting
            </h2>
            <ul className="text-xs text-foreground/40 space-y-1.5 list-disc list-inside">
              <li>Make sure both devices are on the same Wi-Fi network.</li>
              <li>If audio doesn&apos;t start, tap the play button when it appears.</li>
              <li>Use Chrome or Edge for best WebRTC support.</li>
              <li>If the room isn&apos;t found, check the code and ask the broadcaster to refresh.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinPageInner />
    </Suspense>
  )
}
