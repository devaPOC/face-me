'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [topic, setTopic] = useState('');
  const router = useRouter();

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
                  className="w-full bg-surface-container-low border-outline-variant border-[1px] rounded-DEFAULT px-4 py-4 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all placeholder:text-outline"
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
                  className="w-full bg-surface-container-low border-outline-variant border-[1px] rounded-DEFAULT px-4 py-4 font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-all placeholder:text-outline"
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
      <footer className="w-full py-8 px-margin-mobile text-center">
        <p className="font-label-sm text-outline">
          © 2024 FaceMe Communication Labs.
          <a className="underline hover:text-primary transition-colors ml-1" href="#">Privacy</a> ·
          <a className="underline hover:text-primary transition-colors ml-1" href="#">Terms</a>
        </p>
      </footer>
    </div>
  );
}
