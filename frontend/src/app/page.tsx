'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

    router.push(`/room/${newRoomId}?creator=true`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Logo / Title */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20 shadow-cyan-500/10">
          <Image
            src="/icon.png"
            alt="FaceMe Logo Icon"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            FaceMe
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Instant, Zero-Persistence P2P Video Calls
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
