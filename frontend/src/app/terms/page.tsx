import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
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
    </div>
  );
}
