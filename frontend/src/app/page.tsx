'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Minimal Black & White Vector Logo / Title */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-xl border border-border">
          <svg className="w-7 h-7" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 21C16 18.7909 17.7909 17 20 17H34C36.2091 17 38 18.7909 38 21V43C38 45.2091 36.2091 47 34 47H20C17.7909 47 16 45.2091 16 43V21Z"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M38 27.5L48 21V43L38 36.5"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="27" cy="32" r="4" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            FaceMe
          </h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-wide">
            Instant · Zero-Persistence · P2P Video Calls
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {/* Create Room */}
        <Card>
          <CardHeader>
            <CardTitle>Start a new call</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Topic (optional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={handleCreateRoom} className="w-full cursor-pointer">
              Create Room
            </Button>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Join Room */}
        <Card>
          <CardHeader>
            <CardTitle>Join an existing call</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinRoom} className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Button type="submit" variant="secondary" className="w-full cursor-pointer">
                Join <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
