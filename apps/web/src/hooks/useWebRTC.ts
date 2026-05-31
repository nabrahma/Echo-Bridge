'use client'
// ──────────────────────────────────────────────────────────────────────────────
// useWebRTC — React hook for RTCPeerConnection management
// Single responsibility: manage the peer connection and ICE/SDP state.
// Does NOT know about signaling transport — receives/sends via callbacks.
// ──────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react'
import { RTC_CONFIGURATION } from '@/lib/webrtc-config'
import type { ConnectionState } from '@echobridge/shared'

interface UseWebRTCOptions {
  onOffer?: (sdp: RTCSessionDescriptionInit) => void
  onAnswer?: (sdp: RTCSessionDescriptionInit) => void
  onIceCandidate?: (candidate: RTCIceCandidateInit) => void
  onRemoteStream?: (stream: MediaStream) => void
  onConnectionStateChange?: (state: ConnectionState) => void
}

interface UseWebRTCReturn {
  connectionState: ConnectionState
  createOffer: (stream: MediaStream) => Promise<void>
  handleOffer: (sdp: RTCSessionDescriptionInit) => Promise<void>
  handleAnswer: (sdp: RTCSessionDescriptionInit) => Promise<void>
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>
  close: () => void
}

function mapRTCState(state: RTCPeerConnectionState): ConnectionState {
  switch (state) {
    case 'new':
      return 'idle'
    case 'connecting':
      return 'connecting'
    case 'connected':
      return 'connected'
    case 'disconnected':
      return 'reconnecting'
    case 'failed':
      return 'error'
    case 'closed':
      return 'disconnected'
    default:
      return 'idle'
  }
}

export function useWebRTC(options: UseWebRTCOptions = {}): UseWebRTCReturn {
  const { onOffer, onAnswer, onIceCandidate, onRemoteStream, onConnectionStateChange } = options
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const pcRef = useRef<RTCPeerConnection | null>(null)

  // Keep option callbacks in refs to avoid stale closures
  const onOfferRef = useRef(onOffer)
  const onAnswerRef = useRef(onAnswer)
  const onIceCandidateRef = useRef(onIceCandidate)
  const onRemoteStreamRef = useRef(onRemoteStream)
  const onConnectionStateChangeRef = useRef(onConnectionStateChange)

  useEffect(() => { onOfferRef.current = onOffer }, [onOffer])
  useEffect(() => { onAnswerRef.current = onAnswer }, [onAnswer])
  useEffect(() => { onIceCandidateRef.current = onIceCandidate }, [onIceCandidate])
  useEffect(() => { onRemoteStreamRef.current = onRemoteStream }, [onRemoteStream])
  useEffect(() => { onConnectionStateChangeRef.current = onConnectionStateChange }, [onConnectionStateChange])

  const getPeerConnection = useCallback((): RTCPeerConnection => {
    if (pcRef.current) return pcRef.current

    const pc = new RTCPeerConnection(RTC_CONFIGURATION)

    pc.onconnectionstatechange = () => {
      const state = mapRTCState(pc.connectionState)
      setConnectionState(state)
      onConnectionStateChangeRef.current?.(state)
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidateRef.current?.(event.candidate.toJSON())
      }
    }

    pc.ontrack = (event) => {
      const [stream] = event.streams
      if (stream) {
        onRemoteStreamRef.current?.(stream)
      }
    }

    pcRef.current = pc
    return pc
  }, [])

  /** Broadcaster: create offer after adding local audio tracks */
  const createOffer = useCallback(async (stream: MediaStream) => {
    const pc = getPeerConnection()

    // Add all audio tracks from the captured stream
    for (const track of stream.getAudioTracks()) {
      pc.addTrack(track, stream)
    }

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    onOfferRef.current?.(offer)
  }, [getPeerConnection])

  /** Receiver: handle incoming offer, create answer */
  const handleOffer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
    const pc = getPeerConnection()

    await pc.setRemoteDescription(new RTCSessionDescription(sdp))

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    onAnswerRef.current?.(answer)
  }, [getPeerConnection])

  /** Broadcaster: handle incoming answer */
  const handleAnswer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
    const pc = getPeerConnection()
    if (pc.signalingState !== 'have-local-offer') return

    await pc.setRemoteDescription(new RTCSessionDescription(sdp))
  }, [getPeerConnection])

  /** Add an ICE candidate from the remote peer */
  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = pcRef.current
    if (!pc) return

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (err) {
      console.warn('[webrtc] Failed to add ICE candidate:', err)
    }
  }, [])

  const close = useCallback(() => {
    pcRef.current?.close()
    pcRef.current = null
    setConnectionState('disconnected')
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      pcRef.current?.close()
      pcRef.current = null
    }
  }, [])

  return { connectionState, createOffer, handleOffer, handleAnswer, addIceCandidate, close }
}
