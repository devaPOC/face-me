'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';

const Icons = {
  UpArrow: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>,
  Mic: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>,
  MicOff: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>,
  Video: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
  VideoOff: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  More: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>,
  Hangup: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-3.3 0-6.3.8-9 2.2V15c0 .5.3 1 .8 1.2l3.4 1.1c.3.1.6.1.8-.1l2.5-2.5C11 15 11.5 15 12 15s1 .1 1.4.3l2.5 2.5c.2.2.5.3.8.1l3.4-1.1c.5-.2.8-.7.8-1.2v-3.8C18.3 9.8 15.3 9 12 9z" /></svg>,
};

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
    audioDevices,
    videoDevices,
    selectedAudioId,
    selectedVideoId,
    switchDevice,
    flipCamera,
    connect,
    admitGuest,
    rejectGuest,
    toggleMute,
    toggleVideo,
    raiseHand
  } = useWebRTC(roomId, isCreator);

  const [inputName, setInputName] = useState('');
  const [menuOpen, setMenuOpen] = useState<'audio' | 'video' | 'more' | null>(null);

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

  useEffect(() => {
    const closeMenu = () => setMenuOpen(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      connect(inputName.trim());
    }
  };

  const handleLeave = () => {
    router.push('/');
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

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

  // Styles for the new Google Meet style footer
  const footerBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0 16px',
    height: '48px',
    transition: 'background 0.2s',
  };

  const splitBtnContainerStyle: React.CSSProperties = {
    display: 'flex',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    height: '48px',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#202124',
    border: '1px solid #3c4043',
    borderRadius: '8px',
    padding: '8px 0',
    minWidth: '200px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    zIndex: 100,
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#e8eaed',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

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

      {/* Meet-Style Controls Footer */}
      <footer style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '8px', display: 'flex', justifyContent: 'center', gap: '12px', background: '#202124', borderRadius: '32px', zIndex: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>

        {/* Mic Group */}
        <div style={{ ...splitBtnContainerStyle, background: isMuted ? '#ea4335' : '#3c4043' }}>
          <button
            onClick={(e) => { stopPropagation(e); setMenuOpen(menuOpen === 'audio' ? null : 'audio'); }}
            style={{ ...footerBtnStyle, borderRight: '1px solid rgba(0,0,0,0.2)', padding: '0 10px', background: isMuted ? '#ea4335' : '#3c4043' }}
          >
            <Icons.UpArrow />
          </button>
          <button
            onClick={toggleMute}
            style={{ ...footerBtnStyle, padding: '0 20px', background: isMuted ? '#ea4335' : '#3c4043' }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <Icons.MicOff /> : <Icons.Mic />}
          </button>

          {menuOpen === 'audio' && (
            <div style={dropdownStyle} onClick={stopPropagation}>
              {audioDevices.length === 0 && <div style={{ ...dropdownItemStyle, opacity: 0.5 }}>No microphones found</div>}
              {audioDevices.map((d, i) => (
                <div
                  key={d.deviceId || i}
                  onClick={() => { switchDevice('audio', d.deviceId); setMenuOpen(null); }}
                  style={{ ...dropdownItemStyle, background: d.deviceId === selectedAudioId ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = d.deviceId === selectedAudioId ? 'rgba(255,255,255,0.1)' : 'transparent'}
                >
                  {d.deviceId === selectedAudioId ? '✓ ' : ' '} {d.label || `Microphone ${i + 1}`}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Group */}
        <div style={{ ...splitBtnContainerStyle, background: isVideoOff ? '#ea4335' : '#3c4043' }}>
          <button
            onClick={(e) => { stopPropagation(e); setMenuOpen(menuOpen === 'video' ? null : 'video'); }}
            style={{ ...footerBtnStyle, borderRight: '1px solid rgba(0,0,0,0.2)', padding: '0 10px', background: isVideoOff ? '#ea4335' : '#3c4043' }}
          >
            <Icons.UpArrow />
          </button>
          <button
            onClick={toggleVideo}
            style={{ ...footerBtnStyle, padding: '0 20px', background: isVideoOff ? '#ea4335' : '#3c4043' }}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <Icons.VideoOff /> : <Icons.Video />}
          </button>

          {menuOpen === 'video' && (
            <div style={dropdownStyle} onClick={stopPropagation}>
              {videoDevices.length === 0 && <div style={{ ...dropdownItemStyle, opacity: 0.5 }}>No cameras found</div>}
              {videoDevices.map((d, i) => (
                <div
                  key={d.deviceId || i}
                  onClick={() => { switchDevice('video', d.deviceId); setMenuOpen(null); }}
                  style={{ ...dropdownItemStyle, background: d.deviceId === selectedVideoId ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = d.deviceId === selectedVideoId ? 'rgba(255,255,255,0.1)' : 'transparent'}
                >
                  {d.deviceId === selectedVideoId ? '✓ ' : ' '} {d.label || `Camera ${i + 1}`}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* More Options Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => { stopPropagation(e); setMenuOpen(menuOpen === 'more' ? null : 'more'); }}
            style={{ ...footerBtnStyle, background: '#3c4043', borderRadius: '24px', padding: '0 16px' }}
          >
            <Icons.More />
          </button>

          {menuOpen === 'more' && (
            <div style={dropdownStyle} onClick={stopPropagation}>
              <div
                onClick={() => { raiseHand(); setMenuOpen(null); }}
                style={dropdownItemStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                ✋ Raise Hand
              </div>
              <div
                onClick={() => { flipCamera(); setMenuOpen(null); }}
                style={dropdownItemStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🔄 Flip Camera
              </div>
            </div>
          )}
        </div>

        {/* End Call */}
        <button
          onClick={handleLeave}
          style={{ ...footerBtnStyle, background: '#ea4335', padding: '0 28px', borderRadius: '24px' }}
          title="Leave Call"
        >
          <Icons.Hangup />
        </button>
      </footer>
    </div>
  );
}
