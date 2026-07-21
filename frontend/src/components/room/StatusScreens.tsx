import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, PhoneOff, AlertCircle } from 'lucide-react';

interface StatusScreensProps {
  status: string;
  handleLeave: () => void;
}

export default function StatusScreens({ status, handleLeave }: StatusScreensProps) {
  if (status === 'REJECTED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <h2 className="text-xl font-semibold">The host rejected your request to join.</h2>
        <Button variant="secondary" onClick={handleLeave} className="cursor-pointer">Go Home</Button>
      </div>
    );
  }

  if (status === 'FULL') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden animate-fade-in">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Room is Full</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            This private space is limited to a maximum of 2 participants. The host and another guest are already in the call.
          </p>
          <Button onClick={handleLeave} className="w-full cursor-pointer py-6 text-sm font-medium">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'ENDED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden animate-fade-in">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-secondary/5 blur-3xl" />
        <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-6">
            <PhoneOff className="w-8 h-8 animate-pulse text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Call Ended</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            The host or guest has left the room, or the call was ended.
          </p>
          <Button onClick={handleLeave} className="w-full cursor-pointer py-6 text-sm font-medium">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'KNOCKING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <h2 className="text-lg text-muted-foreground">Waiting for host to let you in…</h2>
      </div>
    );
  }

  return null;
}
