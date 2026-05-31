<div align="center">

# ⟁ ECHOBRIDGE

**Browser-native audio relay. Laptop to phone. Zero latency. No install.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P-orange?style=flat-square&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

*Stream your laptop audio to your phone in real time. Plug in wired earphones. Listen from anywhere in the room.*

</div>

---

## The Problem It Solves

You're watching a movie on your laptop. Your wired earphones are plugged in. You want to sit on the sofa — but the cable won't reach. You don't own wireless earbuds.

EchoBridge fixes this. Open the app on both devices. Pair in seconds. Your phone becomes a wireless audio receiver. Plug your wired earphones into the phone and listen comfortably.

No app store. No Bluetooth pairing. No accounts. No cloud. Just a browser URL.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                       LOCAL NETWORK                             │
│                                                                 │
│   ┌──────────────┐    WebSocket     ┌──────────────────────┐   │
│   │   LAPTOP     │ ◄──SDP/ICE────► │  SIGNALING SERVER    │   │
│   │  (Browser)   │                  │  (Node.js + ws)      │   │
│   └──────┬───────┘                  └──────────────────────┘   │
│          │                                      ▲               │
│          │ WebRTC (P2P)                          │ WebSocket     │
│          │ Audio Track                           │ SDP/ICE       │
│          ▼                                      │               │
│   ┌──────────────┐                    ┌──────────────────────┐  │
│   │    PHONE     │ ◄──────────────── │   PHONE (Browser)    │  │
│   │  (Audio Out) │                   │   joins via room code │  │
│   └──────────────┘                   └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

         Audio NEVER passes through the signaling server.
         The server only relays SDP offers/answers + ICE candidates.
```

**The pairing flow:**
1. Laptop browser calls `getDisplayMedia({ audio: true })` → captures system audio
2. Laptop creates an RTCPeerConnection and generates an SDP offer
3. Signaling server relays the offer to the phone (identified by room code)
4. Phone creates an SDP answer, relays it back
5. ICE candidates are exchanged — WebRTC punch-through establishes the P2P stream
6. Audio flows directly from laptop to phone with sub-100ms latency on LAN

---

## Monorepo Structure

```
EchoBridge/
├── apps/
│   ├── web/                        # Frontend — Next.js 16 App Router
│   │   ├── src/
│   │   │   ├── app/                # Pages (route-based)
│   │   │   │   ├── page.tsx        # Landing page
│   │   │   │   ├── broadcast/      # Broadcaster control center
│   │   │   │   └── join/           # Receiver join flow
│   │   │   ├── components/
│   │   │   │   ├── ui/             # Design system components
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── neon-card.tsx
│   │   │   │   │   ├── signal-orb.tsx    # Animated hero orb
│   │   │   │   │   ├── audio-meter.tsx   # Web Audio API visualizer
│   │   │   │   │   ├── cyber-grid.tsx    # Background decoration
│   │   │   │   │   └── status-badge.tsx
│   │   │   │   ├── layout/         # Navbar, Footer
│   │   │   │   ├── home/           # Hero, FeatureCards, HowItWorks
│   │   │   │   ├── broadcast/      # RoomDisplay, StreamControls
│   │   │   │   └── receiver/       # JoinForm, PlaybackStatus
│   │   │   ├── hooks/
│   │   │   │   ├── useSignaling.ts     # WebSocket lifecycle
│   │   │   │   ├── useWebRTC.ts        # RTCPeerConnection management
│   │   │   │   ├── useAudioCapture.ts  # getDisplayMedia capture
│   │   │   │   └── useAudioPlayback.ts # Remote stream playback
│   │   │   ├── lib/
│   │   │   │   ├── signaling-client.ts # WS client class (not React)
│   │   │   │   ├── webrtc-config.ts    # ICE server config from env
│   │   │   │   ├── room-utils.ts       # Room/peer ID generation
│   │   │   │   └── qr.ts              # QR code generator
│   │   │   └── styles/
│   │   │       └── globals.css         # Design tokens + animations
│   │   ├── .env.local              # Local dev env (gitignored)
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   └── signaling/                  # Backend — Node.js WS server
│       ├── src/
│       │   ├── index.ts            # HTTP + WebSocket server entry
│       │   ├── handlers.ts         # Message routing (create/join/offer/answer/ice)
│       │   ├── rooms.ts            # In-memory room + peer state
│       │   └── utils.ts            # Room ID + peer ID generation
│       ├── .env                    # Local dev env (gitignored)
│       └── tsconfig.json
│
├── packages/
│   └── shared/                     # Shared TypeScript — zero dependencies
│       └── src/
│           └── index.ts            # All types, constants, event names
│
├── .env.example                    # Every env var documented
├── .gitignore
├── package.json                    # npm workspaces root
├── tsconfig.base.json              # Shared TS config base
└── README.md
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | File-based routing, React Server Components, Vercel-ready |
| **Language** | TypeScript 5.5 (strict) | End-to-end type safety, shared types across packages |
| **Styling** | Tailwind CSS + custom CSS | Utility classes + design-system tokens for the neon aesthetic |
| **Audio transport** | WebRTC (`RTCPeerConnection`) | Browser-native P2P, sub-100ms LAN latency |
| **Audio capture** | `getDisplayMedia` | System/tab audio without screen recording |
| **Audio playback** | Web Audio API + `<audio>` | Analyser node for the live meter visualizer |
| **Signaling** | Node.js + `ws` | Minimal, dependency-light WS server |
| **QR codes** | `qrcode` npm package | Scanned by phone camera to auto-fill room code |
| **Package manager** | npm workspaces | No extra tooling, built into Node.js |
| **Dev runner** | `concurrently` | Runs frontend + backend in one terminal |

---

## Quick Start

### Prerequisites

- **Node.js 18+**
- **npm 9+**
- Chrome or Edge (for system audio capture on the broadcaster side)

### 1. Clone and install

```bash
git clone https://github.com/nabrahma/Echo-Bridge.git
cd Echo-Bridge
npm install
```

### 2. Configure environment

Everything works out of the box for local development. No changes needed.

```bash
# Already included — defaults to localhost
# apps/web/.env.local
NEXT_PUBLIC_SIGNALING_URL=ws://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"}]

# apps/signaling/.env
PORT=4000
ALLOWED_ORIGINS=http://localhost:3000
```

> **Phone access:** Update `NEXT_PUBLIC_APP_URL` to your laptop's LAN IP (e.g. `http://192.168.1.42:3000`) so QR codes link to the right address when scanned from your phone.

### 3. Run

```bash
npm run dev
```

Opens two processes:
- `→ web` at **http://localhost:3000**
- `→ signaling` at **http://localhost:4000**

Run them separately if needed:

```bash
npm run dev:web          # Next.js only
npm run dev:signaling    # Node.js WS server only
```

### 4. Use it

| On laptop | On phone |
|---|---|
| Go to `http://localhost:3000` | Go to `http://<your-laptop-ip>:3000` |
| Click **Broadcast** | Click **Join Room** |
| Share room code / QR | Enter code or scan QR |
| Click **Start Broadcast** | Plug in earphones and listen |
| Check **"Share tab audio"** when prompted | Tap **Play** if autoplay is blocked |

---

## Environment Variables

All variables are documented in `.env.example`. Never commit `.env.local` or `.env`.

### `apps/web/.env.local`

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_SIGNALING_URL` | `ws://localhost:4000` | WebSocket URL of the signaling server |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public frontend URL (used in QR codes) |
| `NEXT_PUBLIC_ICE_SERVERS` | Google STUN | JSON array of ICE server objects |

### `apps/signaling/.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Port the WS server listens on |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |
| `ROOM_MAX_AGE_MS` | `7200000` | Room TTL in ms (default: 2 hours) |

---

## Signaling Protocol

All messages are JSON over WebSocket. Types defined in `packages/shared/src/index.ts`.

### Client → Server

| Message type | Payload | Description |
|---|---|---|
| `create-room` | `{ peerId }` | Create a new room (broadcaster) |
| `join-room` | `{ peerId, roomId }` | Join an existing room (receiver) |
| `offer` | `{ peerId, roomId, sdp }` | Relay SDP offer to room peers |
| `answer` | `{ peerId, roomId, sdp }` | Relay SDP answer to room peers |
| `ice-candidate` | `{ peerId, roomId, candidate }` | Relay ICE candidate |
| `leave-room` | `{ peerId, roomId }` | Notify peers and clean up |
| `ping` | — | Keepalive ping |

### Server → Client

| Message type | Payload | Description |
|---|---|---|
| `room-created` | `{ roomId, peerId }` | Room created, code assigned |
| `room-joined` | `{ roomId, peerId, hostPeerId }` | Successfully joined |
| `peer-joined` | `{ peerId, roomId }` | A receiver joined (sent to broadcaster) |
| `peer-left` | `{ peerId, roomId }` | Peer disconnected |
| `offer` | `{ fromPeerId, sdp }` | Relayed SDP offer |
| `answer` | `{ fromPeerId, sdp }` | Relayed SDP answer |
| `ice-candidate` | `{ fromPeerId, candidate }` | Relayed ICE candidate |
| `room-not-found` | `{ roomId }` | Room doesn't exist |
| `error` | `{ code, message }` | Generic error |
| `pong` | — | Keepalive response |

### Signaling server health check

```bash
curl http://localhost:4000/health
# → {"status":"ok","rooms":1,"peers":2}
```

---

## Hook Architecture

Each hook has a single responsibility. They are composed on the page level.

```
broadcast/page.tsx
├── useSignaling()      → WebSocket connection + message dispatch
├── useWebRTC()         → RTCPeerConnection (offer/answer/ICE)
└── useAudioCapture()   → getDisplayMedia audio stream

join/page.tsx
├── useSignaling()      → WebSocket connection + message dispatch
├── useWebRTC()         → RTCPeerConnection (handle offer/send answer)
└── useAudioPlayback()  → Attach remote stream to <audio> element
```

**Why separate?** Mixing WebRTC logic with signaling logic in the same file makes reconnect logic, testing, and future TURN support much harder. Each hook can be tested and swapped independently.

---

## Deployment

### Frontend → Vercel

```bash
# 1. Push to GitHub (done)
# 2. Import at vercel.com/new
# 3. Set root directory: apps/web
# 4. Add env vars:
NEXT_PUBLIC_SIGNALING_URL=wss://your-signaling.onrender.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"}]
```

### Signaling server → Render

```bash
# 1. New Web Service on render.com
# 2. Root directory: apps/signaling
# 3. Build: npm install && npm run build
# 4. Start: node dist/index.js
# 5. Add env vars:
PORT=4000
ALLOWED_ORIGINS=https://your-app.vercel.app
```

> **Note:** For production use over the internet (not just LAN), you'll need a TURN server for WebRTC NAT traversal. Add TURN credentials to `NEXT_PUBLIC_ICE_SERVERS`.

---

## Browser Support

| Browser | Broadcast (capture) | Receive (playback) |
|---|---|---|
| Chrome 122+ (desktop) | ✅ Full system audio | ✅ |
| Edge 122+ (desktop) | ✅ Full system audio | ✅ |
| Firefox (desktop) | ⚠️ No system audio | ✅ |
| Chrome (Android) | ⚠️ Tab audio only | ✅ |
| Safari (macOS) | ⚠️ Limited | ✅ with user gesture |
| Safari (iOS) | ❌ | ⚠️ User gesture required |

**System audio capture** (`getDisplayMedia` with audio) is a Chrome/Edge desktop feature. The broadcaster must select a tab or window and check **"Share tab audio"** when the browser prompts.

---

## Design System

EchoBridge uses a custom design system built on Tailwind CSS. All tokens are CSS variables defined in `globals.css`.

| Token | Value | Usage |
|---|---|---|
| `--background` | `#080808` | Page background |
| `--surface` | `#0f0f0f` | Card backgrounds |
| `--accent` (neon yellow) | `#FFD700` | Headlines, CTAs, borders |
| `--accent-dim` | `#B8860B` | Secondary accents |
| `--border` | `rgba(255,215,0,0.15)` | Card borders |
| `--font-display` | Bebas Neue | Hero text, card titles |
| `--font-sans` | Inter | Body text, labels |

Custom components (not from any library):
- **SignalOrb** — animated concentric ring orb that pulses when broadcasting
- **AudioMeter** — real-time Web Audio API frequency bar visualizer
- **CyberGrid** — CSS grid lines + radial glow background overlay
- **NeonCard** — surface container with yellow border glow
- **StatusBadge** — animated pulse dot + uppercase state label

---

## Development Scripts

| Script | Description |
|---|---|
| `npm run dev` | Run frontend + signaling together (concurrently) |
| `npm run dev:web` | Next.js frontend only |
| `npm run dev:signaling` | Node.js signaling server only |
| `npm run build` | Production build of the web app |
| `npm run build:signaling` | Compile signaling server to `dist/` |
| `npm run typecheck` | TypeScript check across all packages |
| `npm run format` | Prettier format everything |

---

## Architecture Decisions

**Why WebRTC instead of WebSockets for audio?**  
WebSockets buffer data and are TCP-based. For audio, dropped frames are better than delayed frames. WebRTC uses RTP over UDP with browser-native jitter buffering tuned for media.

**Why a separate signaling server instead of Next.js API routes?**  
Serverless functions (Vercel) can't hold persistent WebSocket connections. The signaling server needs to track room state across multiple connected clients simultaneously.

**Why npm workspaces instead of pnpm/Turborepo?**  
Zero extra tooling. npm 9+ supports workspaces natively. The monorepo is small enough that Turborepo caching isn't necessary yet.

**Why a flat `index.ts` in `packages/shared`?**  
Barrel re-exports (`export * from './file'`) caused Turbopack module resolution failures in Next.js 16. A single flat file is simpler, faster to resolve, and avoids the issue entirely.

**Why inline environment defaults in `.env.local` / `.env`?**  
`localhost` appears only in committed `.env` files (`apps/signaling/.env`) and `.env.local` files — never in source code. Every URL is read from `process.env`. Deploying to production only requires changing env vars, not code.

---

## License

MIT — do whatever you want with it.

---

<div align="center">

Built with WebRTC, Next.js, and a lot of respect for wired earphones.

</div>
