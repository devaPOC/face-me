# Software Requirements Specification (SRS)

## Project Name: P2P FaceTime Clone (V1)

### 1. Project Overview & Architecture

* **Objective:** Build an ultra-low-resource, strict 1-to-1 peer-to-peer video calling web application.
* **Architecture:**
* **Frontend:** Next.js (TypeScript) deployed on Vercel. Connects to the user's camera/mic and establishes direct WebRTC channels.
* **Backend:** Go (using `gorilla/websocket`) running on a private home server behind a Cloudflare Tunnel. The server handles *only* signaling metadata and enforces structural bounds in-memory (no database required).

---

### 2. System Scope & Constraints

* **Strict 2-Person Limit:** A room can have a maximum of 2 participants. Any subsequent join requests must be instantly rejected.
* **Zero Persistent Storage:** Room states are kept entirely in-memory using Go synchronization primitives (`sync.Map`, channels) and purged completely when empty.
* **Media Routing:** Video and audio data must stream directly between browsers via WebRTC (P2P Mesh). The Go backend must never touch or route media bytes.

---

### 3. Functional Requirements

#### 3.1 Room Lifecycle & State Management

* **Room Creation:** The frontend generates a unique, short Room ID string and opens a WebSocket connection to the Go backend.
* **Room Joining:** A second user joins via the same Room ID. The backend maps them to the existing room channel.
* **Capacity Guard:** If a 3rd user attempts to connect via WebSocket to a room with 2 active connections, the Go server must close the WebSocket connection immediately with a specific error message.
* **Teardown:** When a user disconnects, the Go backend notifies the remaining peer and deletes the room key from memory if the occupant count reaches 0.

#### 3.2 WebRTC Signaling Protocol

The Go backend must act as a transparent pub/sub broker, forwarding the following structured JSON payloads between the 2 peers:

* `create_room` / `join_room`
* `offer` (WebRTC Session Description Protocol)
* `answer` (WebRTC Session Description Protocol)
* `ice_candidate` (Network connectivity paths)
* `action` (State synchronization events)

#### 3.3 Core Features (In-Call Actions)

* **Camera Toggle:** Disable/Enable the local video stream track. Broadcast a status change event text message to the peer.
* **Mic Toggle:** Mute/Unmute the local audio stream track. Broadcast a status change event text message to the peer.
* **Raise Hand:** Send a lightweight text payload through the WebSocket to trigger a visual overlay indicator on the remote peer’s screen.
* **Leave Room:** Explicitly disconnect from the call, teardown local media tracks, close the WebSocket, and redirect back to the home screen.

---

### 4. Technical Specifications & Components

#### 4.1 Backend Engine (Go)

* Use the standard library where possible alongside `gorilla/websocket` for stability.
* Use a thread-safe global `sync.Map` to track active rooms.
* Each room structure must encapsulate a `sync.Mutex` safeguarding a map of up to 2 `Client` pointer structs.

#### 4.2 Frontend Engine (Next.js)

* **API Utilization:** Native browser `RTCPeerConnection` and `navigator.mediaDevices.getUserMedia`.
* **State Hook:** A dedicated React context or hook managing the state machine transitions: `IDLE` $\rightarrow$ `CONNECTING` $\rightarrow$ `SIGNALING` $\rightarrow$ `CONNECTED` $\rightarrow$ `DISCONNECTED`.
* **STUN Servers:** Use free public STUN infrastructure (`stun:stun.l.google.com:19302`) embedded in the client peer configuration.

---

### 5. Deployment & Networking Configurations

* **Local Backend Expose:** Map the local Go execution port using a `cloudflared` tunnel configuration.
* **WebSocket Passthrough:** Ensure the Cloudflare configuration explicitly allows long-lived HTTP Upgrade requests (WebSockets) without intermediate timeout flags.

---

## 🛠️ Step-by-Step Implementation Map

Feed these steps sequentially into your development workspace to build the components cleanly:

1. **Initialize Go Server Core Structure:** Backend Setup.
Generate the boilerplate `main.go`. Define the thread-safe concurrent Room maps and structure data limits. Write the HTTP WebSocket upgrader endpoint that reads the incoming path URL to separate room codes.

2. **Write the WebSocket Message Switchboard:** Signaling Logic.
Implement a JSON messaging loop inside the Go server. Write the logic that intercepts an incoming text chunk and routes it directly to the *opposite* peer connection channel mapped under the exact same room ID.

3. **Scaffold Next.js Base Views:** Frontend UI.
Build a simple two-page structure: a landing view with "Create Room" / "Enter Code" input fields, and a dynamic routing room page `/room/[id]` featuring a layout with exactly two HTML `<video>` elements (Local and Remote).

4. **Implement the WebRTC Peer Handshake:** Client Integration.
Write the React hook that instantiates `new RTCPeerConnection()`. Bind `onicecandidate` and `ontrack` events. Wire the system so that receiving a WebSocket connection notification triggers the generation of the local browser SDP offer structure automatically.

5. **Attach In-Call Feature Handlers:** Feature Toggles.
Connect UI buttons to the browser `MediaStreamTrack.enabled` toggle endpoints. Wire the "Raise Hand" action to broadcast a custom text string via the active signaling connection so the remote client catches and renders the notification state update.

**folder structure**

```folders
face-time-clone/
├── README.md               # The high-level overview of the project architecture
├── docs/                   # System design diagrams and WebRTC flowcharts
│   └── signaling-spec.md   # Explicit JSON contract documentation
├── backend/                # Go Backend Engine
│   ├── main.go             # Server entry point & routing
│   ├── go.mod
│   ├── go.sum
│   └── internal/
│       └── room/           # The sync.Map room management engine
└── frontend/               # Next.js Frontend
    ├── package.json
    ├── next.config.js
    └── src/
        ├── app/            # Next.js pages (/room/[id])
        └── hooks/          # Custom useWebRTC hooks

```
