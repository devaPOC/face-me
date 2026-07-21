# System Architecture & Design

This document details the system design, communication protocols, WebRTC handshake flow, and deployment topology of **FaceMe**.

---

## 1. Deployment Topology

The application is deployed using a hybrid serverless/on-premises architecture designed to optimize privacy, security, and cost.

* **Frontend:** Built with Next.js and hosted on the Vercel Edge Network for rapid static asset delivery and serverless route optimization.
* **Backend:** A lightweight Go application running on a private server inside a local network with **no public IP address**.
* **Tunneling & Security:** A Cloudflare Tunnel client daemon (`cloudflared`) runs next to the Go backend on the private server. It initiates a persistent outbound control link to the Cloudflare Edge network. All user requests to `faceme-api.switchspace.in` are securely proxied through Cloudflare down to the local server, completely eliminating the need to expose ports on a home router.

### Deployment Architecture Diagram

```mermaid
graph TD
    %% Define styles
    classDef cloud fill:#232F3E,stroke:#3F4F5F,stroke-width:2px,color:#fff;
    classDef edge fill:#1E293B,stroke:#475569,stroke-width:2px,color:#fff;
    classDef client fill:#0369A1,stroke:#0284C7,stroke-width:2px,color:#fff;
    classDef private fill:#7F1D1D,stroke:#991B1B,stroke-width:2px,color:#fff;

    subgraph ClientSpace ["User Browser Context"]
        BrowserA["Client A (Creator)"]:::client
        BrowserB["Client B (Guest)"]:::client
    end

    subgraph VercelEdge ["Vercel Edge Network"]
        NextJS["Next.js Web Frontend<br>(faceme.switchspace.in)"]:::edge
    end

    subgraph CloudflareNetwork ["Cloudflare Edge Network"]
        CFProxy["Cloudflare Edge Proxy<br>(faceme-api.switchspace.in)"]:::cloud
    end

    subgraph PrivateHomeNetwork ["On-Premises Private Network (No Public IP)"]
        CFTunnel["Cloudflare Tunnel Client<br>(cloudflared daemon)"]:::private
        GoBackend["Go Signaling Server<br>(localhost:8080)"]:::private
    end

    %% Client downloads frontend
    BrowserA -->|HTTP GET /| NextJS
    BrowserB -->|HTTP GET /| NextJS

    %% WebSockets and REST API
    BrowserA -->|Secure WS /ws/roomId| CFProxy
    BrowserB -->|Secure WS /ws/roomId| CFProxy

    %% Cloudflare Tunnel linkage
    CFProxy -->|Outbound Tunnel| CFTunnel
    CFTunnel -->|Local Port 8080| GoBackend

    %% Peer-to-Peer media
    BrowserA ---|Direct WebRTC P2P Media Stream| BrowserB
```

---

## 2. WebRTC Signaling Sequence

WebRTC requires an out-of-band communication channel (signaling) to exchange session configurations and network routing options. The Go backend handles this coordination by acting as an in-memory pub/sub broker.

The signaling handshake, knock system, and direct media establishment flow:

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Client A (Room Creator)
    participant Server as Go Signaling Server
    actor Guest as Client B (Guest)

    Note over Creator, Server: Room Created
    Creator->>Server: Establish WebSocket Connection (WS /ws/roomId)
    Server-->>Creator: Connection Open (Status: WAITING_FOR_GUEST)

    Note over Guest, Server: Guest Joins Room
    Guest->>Server: Establish WebSocket Connection (WS /ws/roomId)
    Server-->>Guest: Connection Open
    Guest->>Server: Send {"type": "knock", "payload": {"name": "Alice"}}
    Server->>Creator: Forward "knock" message
    Note over Creator: UI prompts creator:<br>"Alice wants to join. Admit?"

    alt Creator Rejects Guest
        Creator->>Server: Send {"type": "reject"}
        Server->>Guest: Forward "reject" message
        Note over Guest: Close WebSocket & Peer Connection
    else Creator Admits Guest
        Creator->>Server: Send {"type": "admit", "payload": {"name": "Bob (Creator)"}}
        Server->>Guest: Forward "admit" message
        Note over Guest: UI transitions to IN_CALL
        Guest->>Server: Send {"type": "ready"}
        Server->>Creator: Forward "ready" message

        Note over Creator, Guest: WebRTC Handshake Phase
        Note over Creator: Creator creates SDP Offer
        Creator->>Server: Send {"type": "offer", "payload": offerSDP}
        Server->>Guest: Forward "offer" message
        Note over Guest: Guest sets Remote Description
        Note over Guest: Guest creates SDP Answer
        Guest->>Server: Send {"type": "answer", "payload": answerSDP}
        Server->>Creator: Forward "answer" message
        Note over Creator: Creator sets Remote Description

        par ICE Candidate Gathering & Exchange
            Creator->>Server: Send {"type": "ice_candidate", "payload": candidate}
            Server->>Guest: Forward "ice_candidate" message
            Note over Guest: Add ICE Candidate
        and
            Guest->>Server: Send {"type": "ice_candidate", "payload": candidate}
            Server->>Creator: Forward "ice_candidate" message
            Note over Creator: Add ICE Candidate
        end

        Note over Creator, Guest: Peer Connection Established
        Creator->>Guest: Direct Peer-to-Peer Media Flow (WebRTC)
        Note over Creator, Guest: Media bytes bypass Go Server completely!
    end
```

---

## 3. Go Backend State Management

The backend is built in Go to guarantee low-latency, concurrent operations, and small memory foot-prints.

### In-Memory Thread Safety

Because there is no persistent database, all state is ephemeral and resides in RAM. The system uses native Go concurrency primitives to remain thread-safe:

* **`sync.Map` (`Rooms`):** Stores active rooms. This provides a lock-free read implementation for high-concurrency access to room pointers.
* **`sync.Mutex` (`Room.mu`):** Each individual room manages a mutex lock `mu` to prevent data races on its `Clients` map during join, leave, and broadcasting operations.

```go
type Client struct {
 Conn *websocket.Conn
 Send chan []byte
}

type Room struct {
 ID      string
 Topic   string
 Clients map[*Client]bool
 mu      sync.Mutex
}
```

### Lifecycle Rules & Guards

1. **Strict 2-Person Limit:** The room joining method inspects the `Clients` map. If `len(r.Clients) >= 2`, the client is immediately rejected with a `{ "error": "Room is full" }` message, and the WebSocket is closed.
2. **Zero-Waste Purge:** When a client leaves, they are removed from their room's `Clients` map. If `len(r.Clients) == 0`, the room ID is deleted from the global `Rooms` `sync.Map` immediately, ensuring zero leakage of stale memory allocations.

---

## 4. Frontend State Machine (Next.js)

The React client controls page interactions using a WebRTC hook. The connection cycle implements the following states:

* **`IDLE`**: Initial state where the user enters their username and enters/creates a room code.
* **`WAITING_FOR_GUEST`**: (Creator only) Active after joining the room, waiting for another client to connect.
* **`KNOCKING`**: (Guest only) Sent a `knock` request to join the room and waiting for the creator's decision.
* **`PROMPTING_CREATOR`**: (Creator only) Displays a modal interface asking to "Admit" or "Reject" the knocking guest.
* **`IN_CALL`**: The signaling handshake completed and WebRTC P2P stream is active.
* **`REJECTED`**: (Guest only) The creator declined the knock request; local media tracks are stopped and cleanup is run.

---

## 5. Level 2 Features

### Screen Share Track Replacement (Zero-Renegotiation)

```mermaid
sequenceDiagram
    actor User as Presenter
    participant Hook as useWebRTC
    participant PC as RTCPeerConnection (Sender)
    participant Receiver as Remote Peer

    User->>Hook: toggleScreenShare()
    Hook->>navigator.mediaDevices: getDisplayMedia({video:true})
    navigator.mediaDevices-->>Hook: Screen MediaStream
    Hook->>PC: getSenders().find(kind === 'video')
    Hook->>PC: sender.replaceTrack(screenTrack)
    Note over PC, Receiver: Media frames now source from screen.<br>NO SDP renegotiation triggered.
    
    User->>Hook: Stops sharing (via browser UI)
    Hook->>PC: sender.replaceTrack(cameraTrack)
```

### P2P DataChannel Payload Structure

Data flow completely bypasses the Go backend.

```mermaid
sequenceDiagram
    actor Caller
    participant DC as RTCDataChannel
    actor Callee

    Note over Caller, Callee: Sending Text Chat
    Caller->>DC: {"type":"chat", "text":"Hello!", "sender":"Alice"}
    DC->>Callee: onmessage JSON parsing

    Note over Caller, Callee: Sending File Chunking
    Caller->>DC: {"type":"file_start", "name":"image.png", "size":120000}
    DC->>Callee: init array buffer
    loop file chunks
      Caller->>DC: ArrayBuffer (16KB chunk)
      DC->>Callee: binary frame appended
    end
    Caller->>DC: {"type":"file_end"}
    DC->>Callee: Blob assembled -> UI link
```

### WebRTC Encoded Transform (E2EE)

```mermaid
sequenceDiagram
    participant PC as RTCPeerConnection
    participant Sender as RTCRtpSender
    participant Worker as e2ee.worker.js
    participant Receiver as RTCRtpReceiver

    Note over PC, Worker: Initialize Transform
    PC->>Sender: sender.transform = new RTCRtpScriptTransform(worker, {op:'encode', key})
    
    Sender->>Worker: Raw Audio/Video Frames
    Note over Worker: AES-GCM Encrypt Frame Payload
    Worker->>Sender: Encrypted Frames
    
    Sender->>Receiver: Encrypted SRTP Packets over Network
    
    Receiver->>Worker: Encrypted Audio/Video Frames
    Note over Worker: AES-GCM Decrypt Frame Payload
    Worker->>Receiver: Raw Audio/Video Frames
    Receiver->>PC: Render to HTMLVideoElement
```
