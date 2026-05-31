'use client'
// ──────────────────────────────────────────────────────────────────────────────
// useSignaling — React hook for WebSocket signaling connection
// Single responsibility: manage the WS lifecycle and dispatch server messages.
// ──────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ServerMessage, ClientMessage } from '@echobridge/shared'
import { SignalingClient } from '@/lib/signaling-client'

type SignalingStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'

interface UseSignalingOptions {
  onMessage?: (message: ServerMessage) => void
  onDisconnect?: () => void
  autoConnect?: boolean
}

interface UseSignalingReturn {
  status: SignalingStatus
  send: (message: ClientMessage) => void
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
}

export function useSignaling(options: UseSignalingOptions = {}): UseSignalingReturn {
  const { onMessage, onDisconnect, autoConnect = false } = options
  const [status, setStatus] = useState<SignalingStatus>('idle')
  const clientRef = useRef<SignalingClient | null>(null)
  const onMessageRef = useRef(onMessage)
  const onDisconnectRef = useRef(onDisconnect)

  // Keep refs in sync without re-subscribing on every render
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    onDisconnectRef.current = onDisconnect
  }, [onDisconnect])

  const getSignalingUrl = () => {
    const url = process.env['NEXT_PUBLIC_SIGNALING_URL']
    if (!url) throw new Error('NEXT_PUBLIC_SIGNALING_URL is not set')
    return url
  }

  const connect = useCallback(async () => {
    if (clientRef.current?.isConnected) return

    setStatus('connecting')

    const client = new SignalingClient(getSignalingUrl())
    clientRef.current = client

    const unsubMessage = client.onMessage((msg) => {
      onMessageRef.current?.(msg)
    })

    const unsubClose = client.onClose(() => {
      setStatus('disconnected')
      onDisconnectRef.current?.()
      unsubMessage()
      unsubClose()
    })

    client.onError(() => {
      setStatus('error')
    })

    try {
      await client.connect()
      setStatus('connected')
    } catch {
      setStatus('error')
      throw new Error('Failed to connect to signaling server')
    }
  }, [])

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect()
    clientRef.current = null
    setStatus('idle')
  }, [])

  const send = useCallback((message: ClientMessage) => {
    clientRef.current?.send(message)
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect().catch(console.error)
    }

    return () => {
      clientRef.current?.disconnect()
    }
  }, [autoConnect, connect])

  return {
    status,
    send,
    connect,
    disconnect,
    isConnected: status === 'connected',
  }
}
