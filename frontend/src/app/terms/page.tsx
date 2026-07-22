import Link from 'next/link';
import BuyMeACoffee from '@/components/BuyMeACoffee';

export default function TermsOfService() {
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
        <h1 className="text-4xl font-headline-lg-mobile text-primary font-bold">Terms & Conditions for FaceMe</h1>
        <p className="text-on-surface-variant font-bold">Last Updated: <span className="font-normal">July 2026</span></p>

        <div className="space-y-6 text-on-background leading-relaxed">
          <p>
            Welcome to <strong>FaceMe</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). FaceMe is an open-source, free, peer-to-peer (P2P) real-time video calling application hosted at <code>faceme.switchspace.in</code>.
          </p>
          <p>
            By accessing or using FaceMe, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the application.
          </p>

          <hr className="border-t border-slate-200 my-8" />

          <h2 className="text-2xl font-bold mt-8 text-primary">1. Description of Service</h2>
          <p>FaceMe provides an ephemeral, browser-based, 1-to-1 video communication platform. The application uses a Go-based signaling server solely to establish connections between browser peers. Once established, media streams and chat messages flow directly between participants via WebRTC.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">2. Free &amp; Open-Source Nature</h2>
          <p>FaceMe is provided free of charge for personal and demonstration purposes. The underlying source code is open-source and licensed under the <strong>MIT License</strong>. While you may inspect, fork, or modify the code according to its license, your use of the hosted application service at <code>faceme.switchspace.in</code> is subject to these Terms.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">3. User Conduct &amp; Acceptable Use</h2>
          <p>You agree to use FaceMe only for lawful purposes. You are strictly prohibited from:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Using the service to transmit unlawful, threatening, abusive, harassing, or objectionable material.</li>
            <li>Attempting to exploit, overload, or bypass the signaling backend or Cloudflare Tunnel infrastructure.</li>
            <li>Attempting to join calls or intercept streams without the host&apos;s permission.</li>
            <li>Using automated bots or scripts to create or flood rooms.</li>
          </ul>
          <p>We reserve the right to terminate or block WebSocket signaling connections for any user violating these rules without prior notice.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">4. No Storage or Media Recording</h2>
          <p>FaceMe does <strong>not</strong> record, store, or monitor video, audio, or text messages on its servers. However, we cannot control whether the person on the other end of your call uses external screen recording software or local tools. You use the application at your own risk regarding the actions of your call counterparty.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">5. Disclaimer of Warranties</h2>
          <p className="uppercase">THE SERVICE IS PROVIDED ON AN <strong>&quot;AS IS&quot;</strong> AND <strong>&quot;AS AVAILABLE&quot;</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
          <p>We do not guarantee that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The service will be uninterrupted, bug-free, or continuously available.</li>
            <li>Network hole-punching (STUN/TURN) will succeed across all network firewalls or cellular providers.</li>
            <li>Ephemeral signaling server connections will be error-free.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-primary">6. Limitation of Liability</h2>
          <p className="uppercase">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE DEVELOPERS, HOSTS, OR COPYRIGHT HOLDERS OF FACEME BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.</p>

          <h2 className="text-2xl font-bold mt-8 text-primary">7. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Updated versions will be posted directly on this page with a revised &quot;Last Updated&quot; date.</p>

          <hr className="border-t border-slate-200 my-8" />

          <p>
            <strong>Contact:</strong> For open-source contributions or legal inquiries, please visit our public GitHub repository.
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
