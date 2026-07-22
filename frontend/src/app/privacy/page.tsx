
import Link from 'next/link';
import BuyMeACoffee from '@/components/BuyMeACoffee';

export default function PrivacyPolicy() {
  return (
    <div className="bg-mesh min-h-screen flex flex-col font-body-md text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 bg-white/70 backdrop-blur-md z-50 border-b border-slate-100">
        <Link href="/" className="font-headline-lg text-headline-lg font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
          <span className="tracking-tight">FaceMe</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/devaPOC/face-me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            title="Star on GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>
            <span className="hidden md:inline font-label-md font-bold">Star on GitHub</span>
          </a>
        </div>
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

      <footer className="w-full py-6 px-margin-mobile border-t border-slate-100 bg-white/50 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          {/* 1. Socials */}
          <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-start">
            <a href="https://github.com/devaPOC" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors" title="GitHub">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/tmsankaram" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors" title="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>

          {/* 2. Made By */}
          <div className="w-full md:w-1/3 text-center">
            <p className="font-label-sm text-outline">
              Made by Mahadeva Sankaram.<br className="md:hidden" />
              <a className="underline hover:text-primary transition-colors ml-1 md:ml-2" href="/privacy">Privacy</a> ·
              <a className="underline hover:text-primary transition-colors ml-1" href="/terms">Terms</a>
            </p>
          </div>

          {/* 3. Buy Me A Coffee */}
          <div className="w-full md:w-1/3">
            <BuyMeACoffee />
          </div>

        </div>
      </footer>
    </div>
  );
}
