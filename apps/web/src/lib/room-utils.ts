// ──────────────────────────────────────────────────────────────────────────────
// Room utility functions
// ──────────────────────────────────────────────────────────────────────────────
import { ROOM_ID_LENGTH } from '@echobridge/shared'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Generate a random room ID — unambiguous characters only */
export function generateRoomId(): string {
  let id = ''
  const array = new Uint8Array(ROOM_ID_LENGTH)
  crypto.getRandomValues(array)
  for (const byte of array) {
    id += CHARS[byte % CHARS.length]
  }
  return id
}

/** Generate a UUID v4 peer ID */
export function generatePeerId(): string {
  return crypto.randomUUID()
}

/** Validate a room ID format */
export function isValidRoomId(id: string): boolean {
  return /^[A-Z2-9]{6}$/.test(id.toUpperCase())
}

/** Normalize room ID input (uppercase, strip whitespace) */
export function normalizeRoomId(id: string): string {
  return id.trim().toUpperCase()
}
