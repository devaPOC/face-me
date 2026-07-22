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
        <h1 className="text-4xl font-headline-lg-mobile text-primary font-bold">Privacy Policy</h1>
        <p className="text-on-surface-variant">Last updated: July 2024</p>
        
        <div className="space-y-4 text-on-background">
          <h2 className="text-2xl font-bold mt-8">1. Introduction</h2>
          <p>Welcome to FaceMe. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
          
          <h2 className="text-2xl font-bold mt-8">2. The Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Technical Data, and Usage Data. FaceMe is designed to be privacy-first, operating predominantly via peer-to-peer connections.</p>

          <h2 className="text-2xl font-bold mt-8">3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide our video calling services, manage our relationship with you, and improve our platform.</p>

          <h2 className="text-2xl font-bold mt-8">4. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. Video and audio streams are end-to-end encrypted.</p>
        </div>
      </main>
    </div>
  );
}
