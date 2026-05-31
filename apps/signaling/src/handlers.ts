// ──────────────────────────────────────────────────────────────────────────────
// Message Handlers — process each signaling message type
// ──────────────────────────────────────────────────────────────────────────────
import type { WebSocket } from 'ws'
import { CLIENT_EVENTS, ERROR_CODES } from '@echobridge/shared'
import type { ClientMessage, ServerMessage } from '@echobridge/shared'
import {
  registerPeer,
  getPeer,
  removePeer,
  createRoom,
  getRoom,
  getRoomEntry,
  joinRoom,
  getPeersInRoom,
  getHostPeer,
} from './rooms.js'
import { generateRoomId } from './utils.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

function send(ws: WebSocket, message: ServerMessage): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message))
  }
}

function sendError(ws: WebSocket, code: string, message: string): void {
  send(ws, { type: 'error', code, message })
}

function broadcastToRoom(roomId: string, message: ServerMessage, excludePeerId?: string): void {
  const roomPeers = getPeersInRoom(roomId)
  for (const peer of roomPeers) {
    if (peer.peerId !== excludePeerId) {
      send(peer.ws, message)
    }
  }
}

// ── Connection lifecycle ─────────────────────────────────────────────────────

export function handleConnection(ws: WebSocket): void {
  // Peer ID is assigned by the client on first message (create-room or join-room)
  // We register a placeholder here to track the socket
  console.log('[signaling] New connection')

  ws.on('message', (raw) => {
    let message: ClientMessage

    try {
      message = JSON.parse(raw.toString()) as ClientMessage
    } catch {
      console.warn('[signaling] Invalid JSON received')
      return
    }

    handleMessage(ws, message)
  })

  ws.on('close', () => {
    handleDisconnect(ws)
  })

  ws.on('error', (err) => {
    console.error('[signaling] WebSocket error:', err.message)
  })
}

function handleDisconnect(ws: WebSocket): void {
  // Look up peer by the ID stored on the WebSocket object
  const wsWithId = ws as WebSocket & { _peerId?: string }
  const peerId = wsWithId._peerId

  if (!peerId) return

  const peer = getPeer(peerId)
  if (!peer) return

  const roomId = peer.roomId

  console.log(`[signaling] Peer ${peerId} disconnected`)

  if (roomId) {
    broadcastToRoom(roomId, { type: 'peer-left', peerId, roomId }, peerId)
  }

  removePeer(peerId)
}

// ── Message routing ──────────────────────────────────────────────────────────

function handleMessage(ws: WebSocket, message: ClientMessage): void {
  const wsWithId = ws as WebSocket & { _peerId?: string }

  switch (message.type) {
    case CLIENT_EVENTS.PING: {
      send(ws, { type: 'pong' })
      break
    }

    case CLIENT_EVENTS.CREATE_ROOM: {
      const { peerId } = message
      wsWithId._peerId = peerId

      const peer = registerPeer(peerId, ws)
      const roomId = generateRoomId()
      const room = createRoom(roomId, peer)

      console.log(`[signaling] Room ${roomId} created by ${peerId}`)

      send(ws, { type: 'room-created', roomId: room.roomId, peerId })
      break
    }

    case CLIENT_EVENTS.JOIN_ROOM: {
      const { peerId, roomId } = message
      wsWithId._peerId = peerId

      const room = getRoom(roomId)
      if (!room) {
        send(ws, { type: 'room-not-found', roomId })
        return
      }

      const peer = registerPeer(peerId, ws)
      const result = joinRoom(roomId, peer)

      if (result === 'not-found') {
        send(ws, { type: 'room-not-found', roomId })
        return
      }

      if (result === 'full') {
        sendError(ws, ERROR_CODES.ROOM_FULL, 'Room is full.')
        return
      }

      console.log(`[signaling] Peer ${peerId} joined room ${roomId}`)

      send(ws, {
        type: 'room-joined',
        roomId,
        peerId,
        hostPeerId: room.hostPeerId,
      })

      // Notify the broadcaster that a receiver joined
      const hostPeer = getHostPeer(roomId)
      if (hostPeer) {
        send(hostPeer.ws, { type: 'peer-joined', peerId, roomId })
      }

      break
    }

    case CLIENT_EVENTS.OFFER: {
      const { peerId, roomId, sdp } = message
      const entry = getRoomEntry(roomId)
      if (!entry) {
        sendError(ws, ERROR_CODES.ROOM_NOT_FOUND, 'Room not found.')
        return
      }

      // Relay offer to all other peers in the room
      broadcastToRoom(roomId, { type: 'offer', fromPeerId: peerId, sdp }, peerId)
      break
    }

    case CLIENT_EVENTS.ANSWER: {
      const { peerId, roomId, sdp } = message
      const entry = getRoomEntry(roomId)
      if (!entry) {
        sendError(ws, ERROR_CODES.ROOM_NOT_FOUND, 'Room not found.')
        return
      }

      broadcastToRoom(roomId, { type: 'answer', fromPeerId: peerId, sdp }, peerId)
      break
    }

    case CLIENT_EVENTS.ICE_CANDIDATE: {
      const { peerId, roomId, candidate } = message
      broadcastToRoom(roomId, { type: 'ice-candidate', fromPeerId: peerId, candidate }, peerId)
      break
    }

    case CLIENT_EVENTS.LEAVE_ROOM: {
      const { peerId, roomId } = message
      broadcastToRoom(roomId, { type: 'peer-left', peerId, roomId }, peerId)
      removePeer(peerId)
      console.log(`[signaling] Peer ${peerId} left room ${roomId}`)
      break
    }

    default: {
      console.warn('[signaling] Unknown message type:', (message as { type: string }).type)
    }
  }
}
