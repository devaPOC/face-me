'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleCreateRoom = async () => {
    // Generate a random 6-character string for the room ID
    const newRoomId = Math.random().toString(36).substring(2, 8);
    
    // Attempt to register the room in the backend
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      await fetch(`${backendUrl}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newRoomId, topic: topic.trim() })
      });
    } catch (err) {
      console.error('Failed to create room:', err);
    }

    router.push(`/room/${newRoomId}?creator=true`);
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
      
      <div style={{ margin: '2rem 0', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <h2>Start a new call</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Topic (Optional)" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1.1rem' }}
          />
          <button 
            onClick={handleCreateRoom}
            style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Create Room
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <h2>Join an existing call</h2>
        <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Enter Room ID" 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1.1rem' }}
          />
          <button 
            type="submit"
            style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
