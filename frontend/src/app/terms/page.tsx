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
        <h1 className="text-4xl font-headline-lg-mobile text-primary font-bold">Terms and Conditions</h1>
        <p className="text-on-surface-variant">Last updated: July 2024</p>
        
        <div className="space-y-4 text-on-background">
          <h2 className="text-2xl font-bold mt-8">1. Acceptance of Terms</h2>
          <p>By accessing and using FaceMe, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this service, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          
          <h2 className="text-2xl font-bold mt-8">2. Description of Service</h2>
          <p>FaceMe provides users with access to a rich collection of resources, including video communication tools. You understand and agree that the service is provided "AS-IS" and that FaceMe assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications.</p>

          <h2 className="text-2xl font-bold mt-8">3. User Conduct</h2>
          <p>You agree to not use the service to: (a) upload, post, email, transmit or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libellous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</p>

          <h2 className="text-2xl font-bold mt-8">4. Modifications to Service</h2>
          <p>FaceMe reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
        </div>
      </main>
    </div>
  );
}
