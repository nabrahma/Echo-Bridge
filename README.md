# EchoBridge

Hear your laptop audio through your phone. No app install. No account. No Bluetooth.

EchoBridge lets you use wired earphones plugged into your phone to listen to whatever is playing on your laptop — movies, music, meetings — from across the room. It runs entirely in the browser and streams audio peer-to-peer over your local network using WebRTC.

---

## Why this exists

Wired earphones sound better and cost less than wireless ones. But the cable doesn't stretch across a room.

Most people reach for Bluetooth earbuds as the default solution — but that means buying new hardware, dealing with pairing, latency, and battery life. EchoBridge takes a different approach: keep the wired earphones you already have, and use your phone as the wireless bridge.

No server processes the audio. No account is required. No data leaves your network. The browser handles everything natively.

---

## What it does

- Captures system audio from your laptop using the browser's `getDisplayMedia` API
- Creates a WebRTC peer-to-peer connection between your laptop and phone
- Streams audio in real time — typically under 100ms on a local network
- Pairs devices with a 6-character room code or QR code
- Runs in Chrome, Edge, and most mobile browsers with no installation

---

## Getting started

### Requirements

- Node.js 18 or later
- npm 9 or later
- Chrome or Edge on the laptop (for system audio capture)
- Any modern browser on the phone

### Install

```bash
git clone https://github.com/nabrahma/Echo-Bridge.git
cd Echo-Bridge
npm install
```

### Configure

Copy the example environment file and set your local IP address. The defaults work for same-device testing, but you need to set the correct IP for phone access.

```bash
cp .env.example apps/web/.env.local
```

Open `apps/web/.env.local` and set:

```env
NEXT_PUBLIC_SIGNALING_URL=ws://localhost:4000
NEXT_PUBLIC_APP_URL=http://<your-laptop-ip>:3000
NEXT_PUBLIC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"}]
```

Replace `<your-laptop-ip>` with your machine's local IP (e.g. `192.168.1.42`). This is what the QR code will encode, so your phone can scan it and go directly to the right address.

To find your local IP:
- **Windows:** `ipconfig` → look for IPv4 Address under your Wi-Fi adapter
- **macOS / Linux:** `ip addr` or `ifconfig`

### Run

```bash
npm run dev
```

This starts both servers at once:

| Service | URL |
|---|---|
| Web app | http://localhost:3000 |
| Signaling server | http://localhost:4000 |

To start them separately:

```bash
npm run dev:web          # Next.js frontend only
npm run dev:signaling    # Node.js signaling server only
```

---

## Using it

**On your laptop**

1. Open `http://localhost:3000` in Chrome or Edge
2. Click **Broadcast**
3. A room code and QR code appear immediately — share them with your phone

**On your phone**

1. Open `http://<your-laptop-ip>:3000` in any mobile browser
2. Click **Join Room**
3. Scan the QR code or type the room code

**Back on your laptop**

4. Click **Start Broadcast**
5. The browser will ask you to select a tab or window — pick the one you want to share audio from
6. Check the **Share tab audio** checkbox before confirming

Your phone will receive the audio stream. Plug in wired earphones and listen.

---

## Project structure

```
Echo-Bridge/
├── apps/
│   ├── web/                   # Next.js frontend (App Router, TypeScript)
│   └── signaling/             # Node.js WebSocket server
├── packages/
│   └── shared/                # Shared types and constants
├── .env.example               # All environment variables with descriptions
├── package.json               # npm workspaces root
└── README.md
```

The signaling server only relays session setup messages (SDP offers/answers and ICE candidates). Audio never passes through it — that goes directly between the two browsers over WebRTC.

```
Laptop browser ──────── WebRTC audio (P2P) ──────── Phone browser
      │                                                    │
      └──── WebSocket (SDP + ICE) ──── Signaling server ──┘
```

---

## Deploying

### Frontend — Vercel

1. Push the repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new), set root directory to `apps/web`
3. Add environment variables:
   ```
   NEXT_PUBLIC_SIGNALING_URL=wss://your-signaling-server.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### Signaling server — Render

1. New Web Service, root directory: `apps/signaling`
2. Build command: `npm install && npm run build`
3. Start command: `node dist/index.js`
4. Environment variables:
   ```
   PORT=4000
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

> **Internet use:** WebRTC peer-to-peer works well on the same local network. For connections across different networks (e.g. two separate Wi-Fi networks), you'll need a TURN server. Add TURN credentials to `NEXT_PUBLIC_ICE_SERVERS` to support that use case.

---

## Environment variables

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SIGNALING_URL` | `apps/web/.env.local` | WebSocket URL for the signaling server |
| `NEXT_PUBLIC_APP_URL` | `apps/web/.env.local` | Public URL of the web app (used in QR codes) |
| `NEXT_PUBLIC_ICE_SERVERS` | `apps/web/.env.local` | JSON array of STUN/TURN server objects |
| `PORT` | `apps/signaling/.env` | Port the signaling server listens on |
| `ALLOWED_ORIGINS` | `apps/signaling/.env` | Allowed CORS origins (comma-separated) |
| `ROOM_MAX_AGE_MS` | `apps/signaling/.env` | How long a room lives without activity (default: 2 hours) |

---

## Browser support

System audio capture (`getDisplayMedia` with audio) is currently only supported in Chrome and Edge on desktop. The phone receiver works in any modern browser.

| Role | Browser | Support |
|---|---|---|
| Broadcaster | Chrome 122+ desktop | ✅ Full |
| Broadcaster | Edge 122+ desktop | ✅ Full |
| Broadcaster | Firefox desktop | ⚠️ No system audio |
| Broadcaster | Any mobile browser | ⚠️ Tab audio only (OS restriction) |
| Receiver | Chrome, Edge, Firefox | ✅ |
| Receiver | Safari iOS | ⚠️ Requires a tap to start audio |

---

## Contributing

Contributions are welcome. Open an issue to discuss what you'd like to change before submitting a pull request.

A few things that would be useful:

- TURN server support and documentation for cross-network use
- Multi-receiver support (currently one receiver per room)
- Audio quality controls (bitrate, codec selection)
- Mobile broadcaster support when browser APIs allow it
- Persistent room codes (currently regenerated each session)

Please keep pull requests focused — one feature or fix per PR.

---

## License

MIT. See [LICENSE](LICENSE).
