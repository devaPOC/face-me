'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    // Generate a random 6-character string for the room ID
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>P2P FaceTime Clone</h1>
      
      <div style={{ margin: '2rem 0', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Start a new call</h2>
        <button 
          onClick={handleCreateRoom}
          style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Create Room
        </button>
      </div>

      <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Join an existing call</h2>
        <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Enter Room ID" 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1.1rem' }}
          />
          <button 
            type="submit"
            style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
