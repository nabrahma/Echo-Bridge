// ──────────────────────────────────────────────────────────────────────────────
// EchoBridge Signaling Server — entry point
// ──────────────────────────────────────────────────────────────────────────────
import 'dotenv/config'
import http from 'node:http'
import { WebSocketServer } from 'ws'
import { handleConnection } from './handlers.js'
import { pruneExpiredRooms, getStats } from './rooms.js'

const PORT = parseInt(process.env['PORT'] ?? '4000', 10)
const ALLOWED_ORIGINS = (process.env['ALLOWED_ORIGINS'] ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())

console.log('[signaling] Allowed origins:', ALLOWED_ORIGINS)

// ── HTTP server (health check + stats) ──────────────────────────────────────

const httpServer = http.createServer((req, res) => {
  // CORS headers for all HTTP responses
  const origin = req.headers['origin'] ?? ''
  if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', ...getStats() }))
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

// ── WebSocket server ─────────────────────────────────────────────────────────

const wss = new WebSocketServer({
  server: httpServer,
  verifyClient: ({ origin }, cb) => {
    // Allow connections with no origin header (e.g. server-to-server, curl tests)
    if (!origin) {
      cb(true)
      return
    }

    if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
      cb(true)
    } else {
      console.warn(`[signaling] Rejected connection from origin: ${origin}`)
      cb(false, 403, 'Forbidden')
    }
  },
})

wss.on('connection', (ws) => {
  handleConnection(ws)
})

wss.on('error', (err) => {
  console.error('[signaling] WSS error:', err)
})

// ── Periodic cleanup ─────────────────────────────────────────────────────────

setInterval(() => {
  const pruned = pruneExpiredRooms()
  if (pruned > 0) {
    console.log(`[signaling] Pruned ${pruned} expired room(s)`)
  }
}, 60_000)

// ── Start ────────────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log(`[signaling] Server running on http://localhost:${PORT}`)
  console.log(`[signaling] WebSocket ready at ws://localhost:${PORT}`)
  console.log(`[signaling] Health check: http://localhost:${PORT}/health`)
})

// ── Graceful shutdown ────────────────────────────────────────────────────────

process.on('SIGTERM', () => {
  console.log('[signaling] Shutting down gracefully...')
  wss.close(() => {
    httpServer.close(() => {
      process.exit(0)
    })
  })
})
