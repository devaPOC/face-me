# FaceMe: Peer-to-Peer FaceTime Clone

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="tmsankaram" data-color="#FFDD00" data-emoji="☕"  data-font="Lato" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/tmsankaram)

FaceMe is a robust, ultra-low-resource, strict 1-to-1 peer-to-peer video calling application.

It is designed to showcase modern web technologies, including **WebRTC** for direct browser-to-browser media streaming, **Next.js** for a fluid and premium front-end experience, and **Go** for a high-concurrency, zero-persistence signaling backend.

---

## 🚀 Live Deployments

* **Frontend App:** [faceme.switchspace.in](https://faceme.switchspace.in)
* **Backend Signaling API:** `faceme-api.switchspace.in` (Secured behind a Cloudflare Tunnel with no public ports exposed on the host machine)

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16** & **React 19** | App Router framework written in **TypeScript**. |
| **Styling** | **Tailwind CSS v4** | Modern, premium utilities with fluid hover micro-animations. |
| **Backend** | **Go (Golang)** | Signaling server using `gorilla/websocket` with in-memory synchronization. |
| **Media Stream** | **WebRTC** | Native browser APIs utilizing Google's public STUN servers. |
| **Deployment** | **Vercel** & **Cloudflare Tunnels** | Frontend hosted on Vercel Edge; Go backend hosted on a private server via `cloudflared`. |

---

## 📦 Directory Structure

```mermaid
graph TD
    classDef dir fill:#0F172A,stroke:#334155,stroke-width:2px,color:#fff;
    classDef file fill:#0284C7,stroke:#0369A1,stroke-width:2px,color:#fff;

    Root["face-me/"]:::dir

    %% Root Files
    Readme["README.md<br>(Main Documentation)"]:::file
    Docker["docker-compose.yml<br>(Compose Orchestrator)"]:::file
    Root --> Readme
    Root --> Docker

    %% Docs
    Docs["docs/"]:::dir
    Arch["architecture.md<br>(Flows & Topology)"]:::file
    Setup["setup-guide.md<br>(Setup & CF Tunnel)"]:::file
    Api["api-spec.md<br>(JSON Payload Spec)"]:::file
    Root --> Docs
    Docs --> Arch
    Docs --> Setup
    Docs --> Api

    %% Backend
    Backend["backend/"]:::dir
    Main["main.go<br>(Server Entrypoint)"]:::file
    GoMod["go.mod / go.sum"]:::file
    Internal["internal/room/<br>(In-Memory Rooms)"]:::dir
    Root --> Backend
    Backend --> Main
    Backend --> GoMod
    Backend --> Internal

    %% Frontend
    Frontend["frontend/"]:::dir
    Pkg["package.json"]:::file
    NextCfg["next.config.ts<br>(Dev proxy & config)"]:::file
    Src["src/"]:::dir
    Root --> Frontend
    Frontend --> Pkg
    Frontend --> NextCfg
    Frontend --> Src

    App["app/<br>(Pages & Layouts)"]:::dir
    Hooks["hooks/<br>(WebRTC Context & Loop)"]:::dir
    Comp["components/<br>(UI Buttons & Frames)"]:::dir
    Src --> App
    Src --> Hooks
    Src --> Comp
```

---

## 🧩 High-Level System Architecture

FaceMe streams media directly between browser peers. The backend server acts only as a signaling broker to coordinate connection descriptors (SDP) and connection paths (ICE).

Once the signaling handshake completes, the audio/video bytes flow directly between browser clients, ensuring complete media privacy and saving server bandwidth.

```mermaid
graph LR
    classDef client fill:#0284C7,stroke:#0369A1,stroke-dasharray: 5 5,stroke-width:2px,color:#fff;
    classDef server fill:#232F3E,stroke:#3F4F5F,stroke-width:2px,color:#fff;

    ClientA["Browser Peer A<br>(Room Creator)"]:::client
    ClientB["Browser Peer B<br>(Guest Client)"]:::client
    GoServer["Go Signaling Server<br>(Cloudflare Tunnel Broker)"]:::server

    %% Handshake Flow
    ClientA -->|1. Signaling WebSocket| GoServer
    ClientB -->|2. Signaling WebSocket| GoServer

    %% Media Flow
    ClientA ---|3. Direct P2P Media Streams| ClientB
```

---

## 📚 Detailed Documentation

Explore the sub-documentation files to learn more about the internals of FaceMe:

1. **[System Design & Architecture](./docs/architecture.md):** Detailed explanations of the WebRTC sequence flow, state machines, and the Cloudflare Tunnel deployment topology.
2. **[Developer Setup & Deployment Guide](./docs/setup-guide.md):** Prerequisites, local execution commands, Docker setups, Secure Context requirements, and private server installation via `cloudflared`.
3. **[API & Signaling Specifications](./docs/api-spec.md):** JSON payload structures for WebSocket communication, room creation endpoints, and connection logic.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
