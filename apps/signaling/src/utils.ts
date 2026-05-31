// ──────────────────────────────────────────────────────────────────────────────
// Utility functions for the signaling server
// ──────────────────────────────────────────────────────────────────────────────
import { ROOM_ID_LENGTH } from '@echobridge/shared'

const ROOM_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Generate a random room ID using unambiguous characters */
export function generateRoomId(): string {
  let id = ''
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    id += ROOM_ID_CHARS[Math.floor(Math.random() * ROOM_ID_CHARS.length)]
  }
  return id
}

/** Generate a UUID v4 peer ID */
export function generatePeerId(): string {
  return crypto.randomUUID()
}
