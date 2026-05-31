// ──────────────────────────────────────────────────────────────────────────────
// @echobridge/shared — Single-file export (no barrel re-exports)
// Turbopack-compatible: all exports in one file, no intermediate re-exports.
// ──────────────────────────────────────────────────────────────────────────────

// ── Event Names ──────────────────────────────────────────────────────────────

export const CLIENT_EVENTS = {
  CREATE_ROOM: 'create-room',
  JOIN_ROOM: 'join-room',
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
  LEAVE_ROOM: 'leave-room',
  PING: 'ping',
} as const

export const SERVER_EVENTS = {
  ROOM_CREATED: 'room-created',
  ROOM_JOINED: 'room-joined',
  PEER_JOINED: 'peer-joined',
  PEER_LEFT: 'peer-left',
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
  ERROR: 'error',
  PONG: 'pong',
  ROOM_NOT_FOUND: 'room-not-found',
} as const

export type ClientEvent = (typeof CLIENT_EVENTS)[keyof typeof CLIENT_EVENTS]
export type ServerEvent = (typeof SERVER_EVENTS)[keyof typeof SERVER_EVENTS]

// ── Constants ─────────────────────────────────────────────────────────────────

export const ROOM_ID_LENGTH = 6
export const DEFAULT_ROOM_MAX_AGE_MS = 2 * 60 * 60 * 1000
export const PING_INTERVAL_MS = 25_000
export const PONG_TIMEOUT_MS = 10_000
export const MAX_PEERS_PER_ROOM = 2

export const ERROR_CODES = {
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  PEER_NOT_IN_ROOM: 'PEER_NOT_IN_ROOM',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// ── Domain Types ──────────────────────────────────────────────────────────────

export type PeerRole = 'broadcaster' | 'receiver'

export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error'

export interface Room {
  roomId: string
  createdAt: number
  expiresAt?: number
  hostPeerId: string
  peerCount: number
  status: 'waiting' | 'active' | 'ended'
}

export interface Peer {
  peerId: string
  role: PeerRole
  roomId: string
  connectedAt: number
  connectionState: ConnectionState
}

// ── Client → Server Messages ──────────────────────────────────────────────────

export interface CreateRoomMessage {
  type: 'create-room'
  peerId: string
}

export interface JoinRoomMessage {
  type: 'join-room'
  peerId: string
  roomId: string
}

export interface OfferMessage {
  type: 'offer'
  peerId: string
  roomId: string
  sdp: RTCSessionDescriptionInit
}

export interface AnswerMessage {
  type: 'answer'
  peerId: string
  roomId: string
  sdp: RTCSessionDescriptionInit
}

export interface IceCandidateMessage {
  type: 'ice-candidate'
  peerId: string
  roomId: string
  candidate: RTCIceCandidateInit
}

export interface LeaveRoomMessage {
  type: 'leave-room'
  peerId: string
  roomId: string
}

export interface PingMessage {
  type: 'ping'
}

export type ClientMessage =
  | CreateRoomMessage
  | JoinRoomMessage
  | OfferMessage
  | AnswerMessage
  | IceCandidateMessage
  | LeaveRoomMessage
  | PingMessage

// ── Server → Client Messages ──────────────────────────────────────────────────

export interface RoomCreatedMessage {
  type: 'room-created'
  roomId: string
  peerId: string
}

export interface RoomJoinedMessage {
  type: 'room-joined'
  roomId: string
  peerId: string
  hostPeerId: string
}

export interface PeerJoinedMessage {
  type: 'peer-joined'
  peerId: string
  roomId: string
}

export interface PeerLeftMessage {
  type: 'peer-left'
  peerId: string
  roomId: string
}

export interface ServerOfferMessage {
  type: 'offer'
  fromPeerId: string
  sdp: RTCSessionDescriptionInit
}

export interface ServerAnswerMessage {
  type: 'answer'
  fromPeerId: string
  sdp: RTCSessionDescriptionInit
}

export interface ServerIceCandidateMessage {
  type: 'ice-candidate'
  fromPeerId: string
  candidate: RTCIceCandidateInit
}

export interface ErrorMessage {
  type: 'error'
  code: string
  message: string
}

export interface PongMessage {
  type: 'pong'
}

export interface RoomNotFoundMessage {
  type: 'room-not-found'
  roomId: string
}

export type ServerMessage =
  | RoomCreatedMessage
  | RoomJoinedMessage
  | PeerJoinedMessage
  | PeerLeftMessage
  | ServerOfferMessage
  | ServerAnswerMessage
  | ServerIceCandidateMessage
  | ErrorMessage
  | PongMessage
  | RoomNotFoundMessage
