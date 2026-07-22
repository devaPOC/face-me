import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="bg-mesh min-h-screen flex flex-col font-body-md text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 bg-white/70 backdrop-blur-md z-50 border-b border-slate-100">
        <Link href="/" className="font-headline-lg text-headline-lg font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
          <span className="tracking-tight">FaceMe</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col px-margin-mobile py-32 max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-headline-lg-mobile text-primary font-bold">Privacy Policy for FaceMe</h1>
        <p className="text-on-surface-variant font-bold">Last Updated: <span className="font-normal">July 2026</span></p>
        
        <div className="space-y-6 text-on-background leading-relaxed">
          <p>
            This Privacy Policy explains how <strong>FaceMe</strong> (&quot;we,&quot; &quot;our&quot;) handles user information. We believe in absolute privacy by design.
          </p>

          <hr className="border-t border-slate-200 my-8" />
          
          <h2 className="text-2xl font-bold mt-8 text-primary">1. Zero-Persistence Core Principle</h2>
          <p>FaceMe is engineered to operate <strong>without persistent databases or user accounts</strong>.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>No Registration:</strong> You are never required to provide an email address, password, or personal identity.</li>
            <li><strong>No Video/Audio Storage:</strong> Video and audio data are streamed directly between browser participants over encrypted Peer-to-Peer (WebRTC) connections. Media data <strong>never</strong> touches or passes through our servers.</li>
            <li><strong>No Message Logs:</strong> In-call text messages and file transfers travel directly between browsers via WebRTC DataChannels and are deleted instantly when you close your browser tab.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-primary">2. Information Handled by the Signaling Server</h2>
          <p>To connect two users into a room, our Go backend acts as a temporary &quot;matchmaker&quot; (signaling server). The server processes the following ephemeral, in-memory data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Temporary Room Codes:</strong> Ephemeral strings generated when a room is created.</li>
            <li><strong>Display Handles:</strong> Temporary user handles typed into the room lobby.</li>
            <li><strong>WebRTC Descriptors (SDP &amp; ICE Candidates):</strong> Technical network routing metadata required to establish the P2P connection.</li>
          </ul>
          <p className="italic">*All room metadata and signaling memory are automatically purged and erased from server RAM the moment a room becomes empty.*</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">3. Server Logs &amp; Analytics</h2>
          <p>Our infrastructure utilizes standard edge security proxies (Cloudflare Tunnels) to protect against DDoS attacks. Standard server access logs (such as IP addresses, user-agent strings, and request timestamps) may be generated at the edge for network security and Prometheus telemetry. These logs are used purely for service health monitoring and are never sold or used for tracking.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">4. Cookies &amp; Local Storage</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cookies:</strong> FaceMe does <strong>not</strong> use tracking cookies or advertising cookies.</li>
            <li><strong>Local Storage:</strong> The application may store transient UI preferences (such as your preferred camera/mic state) locally in your browser&apos;s <code>localStorage</code>.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-primary">5. Third-Party Services</h2>
          <p>To facilitate network path discovery behind routers and firewalls, FaceMe uses public <strong>STUN servers</strong> (such as Google&apos;s public STUN infrastructure). STUN requests exchange basic IP metadata strictly to assist your browser in discovering its public network address.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">6. Children&apos;s Privacy</h2>
          <p>FaceMe does not knowingly collect or solicit personal information from anyone under the age of 13.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Any updates will be reflected on this page.</p>

          <hr className="border-t border-slate-200 my-8" />
          
          <p>
            <strong>Questions?</strong> Because we do not store your data, we have no personal data to retrieve, export, or delete!
          </p>
        </div>
      </main>
    </div>
  );
}
