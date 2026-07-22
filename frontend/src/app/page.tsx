'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BuyMeACoffee from '@/components/BuyMeACoffee';
import SupportModal from '@/components/SupportModal';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [topic, setTopic] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('showSupportModal') === 'true') {
      sessionStorage.removeItem('showSupportModal');
      setTimeout(() => {
        setShowSupportModal(true);
      }, 0);
    }
  }, []);

  const handleCreateRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    try {
      await fetch(`${backendUrl}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newRoomId, topic: topic.trim() })
      });
    } catch (err) {
      console.error('Failed to create room:', err);
    }

    sessionStorage.setItem(`faceme_creator_${newRoomId}`, 'true');
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="bg-mesh min-h-screen flex flex-col font-body-md text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 bg-white/70 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="font-headline-lg text-headline-lg font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
          <span className="tracking-tight">FaceMe</span>
        </div>
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

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile py-8">
        <div className="w-full max-w-[440px] glass-card rounded-lg p-8 shadow-[0_20px_40px_rgba(30,41,59,0.08)] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Headline & Value Prop */}
          <div className="space-y-4">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary leading-tight">
              Friendly, direct video calls — zero sign-ups needed
            </h2>
            <p className="text-on-surface-variant font-body-md">
              Connect instantly with anyone, anywhere. Just create a room and share the link.
            </p>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 text-left">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-secondary-container transition-colors">meeting_room</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Weekly Sync or Coffee Chat"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-surface-container-low border-outline-variant border-[1px] rounded-DEFAULT pr-4 pl-12 py-4 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all placeholder:text-outline"
                />
              </div>
              <button
                onClick={handleCreateRoom}
                className="w-full bg-secondary-container text-on-secondary-container font-title-md py-4 rounded-full shadow-lg shadow-secondary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Create Room
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-surface-variant"></div>
              <span className="flex-shrink mx-4 text-outline font-label-sm uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-surface-variant"></div>
            </div>

            {/* Join Room Form */}
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-primary-container transition-colors">link</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Room Code"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-surface-container-low border-outline-variant border-[1px] rounded-DEFAULT pr-4 pl-12 py-4 font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-all placeholder:text-outline"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-container text-on-primary-container font-title-md py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">login</span>
                Join Room
              </button>
            </form>
          </div>

          {/* Security Note */}
          <div className="pt-4 flex items-center justify-center gap-1 text-on-surface-variant font-label-sm">
            <span className="material-symbols-outlined text-[18px] text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            Fully encrypted & private
          </div>
        </div>
      </main>

      {/* Footer */}
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
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
