// ──────────────────────────────────────────────────────────────────────────────
// Room Manager — in-memory room and peer state
// ──────────────────────────────────────────────────────────────────────────────
import type { WebSocket } from 'ws'
import { MAX_PEERS_PER_ROOM, DEFAULT_ROOM_MAX_AGE_MS } from '@echobridge/shared'
import type { Room } from '@echobridge/shared'

export interface ConnectedPeer {
  peerId: string
  roomId: string | null
  role: 'broadcaster' | 'receiver' | null
  ws: WebSocket
  connectedAt: number
  isAlive: boolean
}

interface RoomEntry {
  room: Room
  peers: Map<string, ConnectedPeer>
}

const rooms = new Map<string, RoomEntry>()
const peers = new Map<string, ConnectedPeer>()

const ROOM_MAX_AGE_MS = parseInt(process.env['ROOM_MAX_AGE_MS'] ?? String(DEFAULT_ROOM_MAX_AGE_MS), 10)

// ── Peer management ──────────────────────────────────────────────────────────

export function registerPeer(peerId: string, ws: WebSocket): ConnectedPeer {
  const peer: ConnectedPeer = {
    peerId,
    roomId: null,
    role: null,
    ws,
    connectedAt: Date.now(),
    isAlive: true,
  }
  peers.set(peerId, peer)
  return peer
}

export function getPeer(peerId: string): ConnectedPeer | undefined {
  return peers.get(peerId)
}

export function removePeer(peerId: string): void {
  const peer = peers.get(peerId)
  if (peer?.roomId) {
    removePeerFromRoom(peer.roomId, peerId)
  }
  peers.delete(peerId)
}

// ── Room management ──────────────────────────────────────────────────────────

export function createRoom(roomId: string, hostPeer: ConnectedPeer): Room {
  const room: Room = {
    roomId,
    createdAt: Date.now(),
    expiresAt: Date.now() + ROOM_MAX_AGE_MS,
    hostPeerId: hostPeer.peerId,
    peerCount: 1,
    status: 'waiting',
  }

  const entry: RoomEntry = {
    room,
    peers: new Map([[hostPeer.peerId, hostPeer]]),
  }

  rooms.set(roomId, entry)
  hostPeer.roomId = roomId
  hostPeer.role = 'broadcaster'

  return room
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId)?.room
}

export function getRoomEntry(roomId: string): RoomEntry | undefined {
  return rooms.get(roomId)
}

export function joinRoom(roomId: string, peer: ConnectedPeer): 'ok' | 'not-found' | 'full' {
  const entry = rooms.get(roomId)
  if (!entry) return 'not-found'

  if (entry.peers.size >= MAX_PEERS_PER_ROOM) return 'full'

  entry.peers.set(peer.peerId, peer)
  entry.room.peerCount = entry.peers.size
  entry.room.status = 'active'

  peer.roomId = roomId
  peer.role = 'receiver'

  return 'ok'
}

export function removePeerFromRoom(roomId: string, peerId: string): void {
  const entry = rooms.get(roomId)
  if (!entry) return

  entry.peers.delete(peerId)
  entry.room.peerCount = entry.peers.size

  if (entry.peers.size === 0) {
    rooms.delete(roomId)
    return
  }

  if (entry.room.hostPeerId === peerId) {
    entry.room.status = 'ended'
  }
}

export function getPeersInRoom(roomId: string): ConnectedPeer[] {
  return Array.from(rooms.get(roomId)?.peers.values() ?? [])
}

export function getHostPeer(roomId: string): ConnectedPeer | undefined {
  const entry = rooms.get(roomId)
  if (!entry) return undefined
  return entry.peers.get(entry.room.hostPeerId)
}

export function pruneExpiredRooms(): number {
  const now = Date.now()
  let pruned = 0

  for (const [roomId, entry] of rooms) {
    if (entry.room.expiresAt !== undefined && entry.room.expiresAt < now) {
      for (const peer of entry.peers.values()) {
        peer.roomId = null
        peer.role = null
      }
      rooms.delete(roomId)
      pruned++
    }
  }

  return pruned
}

export function getStats() {
  return {
    rooms: rooms.size,
    peers: peers.size,
  }
}
