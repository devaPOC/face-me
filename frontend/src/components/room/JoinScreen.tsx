import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface JoinScreenProps {
  roomId: string;
  initialTopic: string;
  inputName: string;
  setInputName: (name: string) => void;
  handleJoin: (e: React.FormEvent) => void;
  isActuallyCreator: boolean;
}

export default function JoinScreen({
  roomId,
  initialTopic,
  inputName,
  setInputName,
  handleJoin,
  isActuallyCreator
}: JoinScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          {initialTopic ? `Join "${initialTopic}"` : 'Join Room'}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Room ID: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{roomId}</span>
        </p>
        <form onSubmit={handleJoin} className="flex flex-col gap-4 text-left">
          <Input
            type="text"
            placeholder="Your name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="w-full cursor-pointer">
            {isActuallyCreator ? 'Start Call' : 'Knock to Join'}
          </Button>
        </form>
      </div>
    </div>
  );
}
