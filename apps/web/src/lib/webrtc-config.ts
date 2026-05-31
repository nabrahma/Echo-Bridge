// ──────────────────────────────────────────────────────────────────────────────
// WebRTC ICE server configuration
// All values come from environment variables — no hardcoded URLs.
// ──────────────────────────────────────────────────────────────────────────────

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

function parseIceServers(): RTCIceServer[] {
  const raw = process.env['NEXT_PUBLIC_ICE_SERVERS']
  if (!raw) return DEFAULT_ICE_SERVERS

  try {
    const parsed = JSON.parse(raw) as RTCIceServer[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ICE_SERVERS
  } catch {
    console.warn('[webrtc-config] Failed to parse ICE_SERVERS env, using defaults')
    return DEFAULT_ICE_SERVERS
  }
}

export const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: parseIceServers(),
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
}
