'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';

export default function RoomUI({ roomId, initialTopic, isCreator }: { roomId: string, initialTopic: string, isCreator: boolean }) {
  const router = useRouter();

  const {
    status,
    localStream,
    remoteStream,
    localName,
    remoteName,
    isMuted,
    isVideoOff,
    remoteHandRaised,
    connect,
    admitGuest,
    rejectGuest,
    toggleMute,
    toggleVideo,
    raiseHand
  } = useWebRTC(roomId, isCreator);
  
  const [inputName, setInputName] = useState('');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, status]); 

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, status]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      connect(inputName.trim());
    }
  };

  const handleLeave = () => {
    router.push('/');
  };

  if (status === 'IDLE') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111', color: 'white', fontFamily: 'sans-serif' }}>
        <h2>Join Room {roomId}</h2>
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            style={{ padding: '0.75rem', fontSize: '1.1rem', borderRadius: '4px', border: '1px solid #333' }}
            autoFocus
          />
          <button 
            type="submit"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {isCreator ? 'Start Call' : 'Knock to Join'}
          </button>
        </form>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111', color: 'white', fontFamily: 'sans-serif' }}>
        <h2>The host rejected your request to join.</h2>
        <button onClick={handleLeave} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Go Home</button>
      </div>
    );
  }

  if (status === 'KNOCKING') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111', color: 'white', fontFamily: 'sans-serif' }}>
        <h2>Waiting for host to let you in...</h2>
      </div>
    );
  }

  const title = initialTopic ? `Meet: ${initialTopic}` : `Room: ${roomId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', fontFamily: 'sans-serif', background: '#000', color: 'white', overflow: 'hidden' }}>
      
      {/* Header overlaid on video */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(rgba(0,0,0,0.7), transparent)', zIndex: 20 }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{title}</h2>
        {remoteHandRaised && <span style={{ background: '#f5a623', padding: '0.5rem 1rem', borderRadius: '20px', color: 'black', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>✋ {remoteName} raised hand</span>}
      </header>

      {/* Video Container */}
      <main style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        
        {/* Remote Video (Full Screen if in call) */}
        {status === 'IN_CALL' && (
          <>
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: '120px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '4px', zIndex: 20, fontSize: '0.9rem' }}>
              {remoteName}
            </div>
          </>
        )}

        {/* Local Video */}
        <div style={
          status === 'IN_CALL' 
          ? { position: 'absolute', bottom: '120px', right: '20px', width: '150px', height: '220px', zIndex: 30, borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }
          : { width: '100%', height: '100%' } // Full screen when waiting
        }>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted={true} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
            {localName} (You)
          </div>
        </div>

        {/* Status Overlay (Waiting / Prompting) */}
        {status === 'WAITING_FOR_GUEST' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', padding: '1rem 2rem', borderRadius: '30px', backdropFilter: 'blur(10px)', zIndex: 40 }}>
            Waiting for others to join...
          </div>
        )}
        
        {status === 'PROMPTING_CREATOR' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(30,30,30,0.9)', padding: '2rem', borderRadius: '16px', backdropFilter: 'blur(10px)', zIndex: 50, textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>{remoteName} wants to join</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={rejectGuest} style={{ padding: '0.75rem 2rem', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>Deny</button>
              <button onClick={admitGuest} style={{ padding: '0.75rem 2rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>Admit</button>
            </div>
          </div>
        )}
      </main>

      {/* Controls Footer */}
      <footer style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '1rem 2rem', display: 'flex', justifyContent: 'center', gap: '1rem', background: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(20px)', borderRadius: '40px', zIndex: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={toggleMute}
          style={{ width: '50px', height: '50px', borderRadius: '25px', cursor: 'pointer', background: isMuted ? '#ff4444' : '#444', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'background 0.2s' }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        <button 
          onClick={toggleVideo}
          style={{ width: '50px', height: '50px', borderRadius: '25px', cursor: 'pointer', background: isVideoOff ? '#ff4444' : '#444', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'background 0.2s' }}
          title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        >
          {isVideoOff ? '🚫' : '📷'}
        </button>
        <button 
          onClick={raiseHand}
          style={{ width: '50px', height: '50px', borderRadius: '25px', cursor: 'pointer', background: '#444', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'background 0.2s' }}
          title="Raise Hand"
        >
          ✋
        </button>
        <button 
          onClick={handleLeave}
          style={{ width: '50px', height: '50px', borderRadius: '25px', cursor: 'pointer', background: '#ff3b30', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginLeft: '1rem', boxShadow: '0 2px 10px rgba(255,59,48,0.4)' }}
          title="Leave Call"
        >
          👋
        </button>
      </footer>
    </div>
  );
}
