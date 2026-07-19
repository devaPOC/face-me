'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, ArrowRight } from 'lucide-react';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleCreateRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    
    try {
      await fetch(`/api/rooms`, {
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
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary">
          <Video className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">FaceMe</h1>
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
