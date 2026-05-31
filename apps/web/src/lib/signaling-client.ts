// ──────────────────────────────────────────────────────────────────────────────
// Signaling client — singleton WebSocket connection
// ──────────────────────────────────────────────────────────────────────────────
import type { ClientMessage, ServerMessage } from '@echobridge/shared'
import { PING_INTERVAL_MS, PONG_TIMEOUT_MS } from '@echobridge/shared'

type MessageHandler = (message: ServerMessage) => void
type CloseHandler = (event: CloseEvent) => void
type ErrorHandler = (event: Event) => void

export class SignalingClient {
  private ws: WebSocket | null = null
  private messageHandlers = new Set<MessageHandler>()
  private closeHandlers = new Set<CloseHandler>()
  private errorHandlers = new Set<ErrorHandler>()
  private pingInterval: ReturnType<typeof setInterval> | null = null
  private pongTimeout: ReturnType<typeof setTimeout> | null = null
  private isIntentionallyClosed = false

  constructor(private readonly url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isIntentionallyClosed = false
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.startPingPong()
        resolve()
      }

      this.ws.onerror = (event) => {
        this.errorHandlers.forEach((h) => h(event))
        reject(new Error('WebSocket connection failed'))
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as ServerMessage

          // Handle pong internally
          if (message.type === 'pong') {
            this.clearPongTimeout()
            return
          }

          this.messageHandlers.forEach((h) => h(message))
        } catch {
          console.warn('[signaling-client] Failed to parse message')
        }
      }

      this.ws.onclose = (event) => {
        this.stopPingPong()
        this.closeHandlers.forEach((h) => h(event))
      }
    })
  }

  send(message: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('[signaling-client] Cannot send — not connected')
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onClose(handler: CloseHandler): () => void {
    this.closeHandlers.add(handler)
    return () => this.closeHandlers.delete(handler)
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  disconnect(): void {
    this.isIntentionallyClosed = true
    this.stopPingPong()
    this.ws?.close(1000, 'Client disconnect')
    this.ws = null
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  // ── Ping / Pong heartbeat ─────────────────────────────────────────────────

  private startPingPong(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' })
      this.pongTimeout = setTimeout(() => {
        console.warn('[signaling-client] Pong timeout — closing connection')
        this.ws?.close()
      }, PONG_TIMEOUT_MS)
    }, PING_INTERVAL_MS)
  }

  private stopPingPong(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
    this.clearPongTimeout()
  }

  private clearPongTimeout(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout)
      this.pongTimeout = null
    }
  }
}
