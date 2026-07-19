'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomUI({ roomId, initialTopic }: { roomId: string, initialTopic: string }) {
  const router = useRouter();
  
  // State for controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  
  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // TODO: Implement WebRTC signaling and stream management here.

  const handleLeave = () => {
    // TODO: cleanup WebRTC connections
    router.push('/');
  };

  const title = initialTopic ? `Meet: ${initialTopic}` : `Room: ${roomId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', background: '#111', color: 'white' }}>
      <header style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222' }}>
        <h2>{title}</h2>
        {handRaised && <span style={{ background: '#f5a623', padding: '0.5rem', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>Remote peer raised hand!</span>}
      </header>

      <main style={{ flex: 1, display: 'flex', padding: '1rem', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Local</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', maxWidth: '600px', aspectRatio: '16/9', background: '#000', borderRadius: '8px', border: '2px solid #444', objectFit: 'cover' }}
          />
        </div>
        
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Remote</h3>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', maxWidth: '600px', aspectRatio: '16/9', background: '#000', borderRadius: '8px', border: '2px solid #444', objectFit: 'cover' }}
          />
        </div>
      </main>

      <footer style={{ padding: '1rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', background: '#222' }}>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
        >
          {isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        </button>
        <button 
          onClick={() => setHandRaised(!handRaised)} // Mocking the toggle for now
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
        >
          Raise Hand
        </button>
        <button 
          onClick={handleLeave}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#e00', color: 'white' }}
        >
          Leave Room
        </button>
      </footer>
    </div>
  );
}
