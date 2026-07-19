'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Mic, MicOff, Video, VideoOff,
  MoreVertical, PhoneOff, Hand, SwitchCamera,
  ChevronUp, Loader2,
} from 'lucide-react';

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
    raiseHand,
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

  /* ─── IDLE: Name Entry ─── */
  if (status === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-sm p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Join Room <span className="text-muted-foreground font-mono">{roomId}</span>
          </h2>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <Input 
              type="text" 
              placeholder="Your name" 
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full cursor-pointer">
              {isCreator ? 'Start Call' : 'Knock to Join'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── REJECTED ─── */
  if (status === 'REJECTED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <h2 className="text-xl font-semibold">The host rejected your request to join.</h2>
        <Button variant="secondary" onClick={handleLeave} className="cursor-pointer">Go Home</Button>
      </div>
    );
  }

  /* ─── KNOCKING ─── */
  if (status === 'KNOCKING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <h2 className="text-lg text-muted-foreground">Waiting for host to let you in…</h2>
      </div>
    );
  }

  const title = initialTopic ? `Meet: ${initialTopic}` : `Room: ${roomId}`;

  /* ─── IN CALL / WAITING ─── */
  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
      
      {/* ─── Header ─── */}
      <header className="absolute top-0 inset-x-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-20">
        <h2 className="text-sm font-medium drop-shadow-md">{title}</h2>
        {remoteHandRaised && (
          <Badge variant="default" className="bg-amber-500 text-black font-semibold shadow-lg animate-bounce">
            ✋ {remoteName} raised hand
          </Badge>
        )}
      </header>

      {/* ─── Video Area ─── */}
      <main className="flex-1 relative w-full h-full">
        
        {/* Remote video — full screen when in call */}
        {status === 'IN_CALL' && (
          <>
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-28 left-5 bg-black/60 px-3 py-1 rounded text-sm z-20">
              {remoteName}
            </span>
          </>
        )}

        {/* Local video — PiP when in call, full screen otherwise */}
        <div className={
          status === 'IN_CALL'
            ? 'absolute bottom-28 right-5 w-[140px] h-[200px] z-30 rounded-xl overflow-hidden border border-white/20 shadow-2xl'
            : 'w-full h-full'
        }>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover -scale-x-100"
          />
          <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs">
            {localName} (You)
          </span>
        </div>

        {/* Waiting overlay */}
        {status === 'WAITING_FOR_GUEST' && (
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for others to join…
            </div>
          </div>
        )}
        
        {/* Admission Dialog */}
        <Dialog open={status === 'PROMPTING_CREATOR'} onOpenChange={() => {}}>
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{remoteName} wants to join</DialogTitle>
              <DialogDescription>
                Allow this person into the call?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button variant="secondary" onClick={rejectGuest} className="cursor-pointer">Deny</Button>
              <Button onClick={admitGuest} className="cursor-pointer">Admit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      {/* ─── Controls Footer ─── */}
      <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-xl px-3 py-2 rounded-full z-40 shadow-2xl border border-border">

        {/* Mic split button */}
        <div className="flex rounded-full overflow-hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant={isMuted ? 'destructive' : 'ghost'}
                  size="icon-sm"
                  className="rounded-none rounded-l-full cursor-pointer"
                />
              }
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="min-w-[220px]">
              <DropdownMenuLabel>Microphone</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedAudioId} onValueChange={(v) => switchDevice('audio', v)}>
                {audioDevices.length === 0 && (
                  <DropdownMenuItem disabled>No microphones found</DropdownMenuItem>
                )}
                {audioDevices.map((d, i) => (
                  <DropdownMenuRadioItem key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={isMuted ? 'destructive' : 'ghost'}
            size="icon"
            onClick={toggleMute}
            className="rounded-none rounded-r-full cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>

        {/* Video split button */}
        <div className="flex rounded-full overflow-hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant={isVideoOff ? 'destructive' : 'ghost'}
                  size="icon-sm"
                  className="rounded-none rounded-l-full cursor-pointer"
                />
              }
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="min-w-[220px]">
              <DropdownMenuLabel>Camera</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedVideoId} onValueChange={(v) => switchDevice('video', v)}>
                {videoDevices.length === 0 && (
                  <DropdownMenuItem disabled>No cameras found</DropdownMenuItem>
                )}
                {videoDevices.map((d, i) => (
                  <DropdownMenuRadioItem key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={isVideoOff ? 'destructive' : 'ghost'}
            size="icon"
            onClick={toggleVideo}
            className="rounded-none rounded-r-full cursor-pointer"
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </Button>
        </div>

        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full cursor-pointer" />
            }
          >
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center">
            <DropdownMenuItem onClick={raiseHand} className="cursor-pointer">
              <Hand className="w-4 h-4 mr-2" /> Raise Hand
            </DropdownMenuItem>
            <DropdownMenuItem onClick={flipCamera} className="cursor-pointer">
              <SwitchCamera className="w-4 h-4 mr-2" /> Flip Camera
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* End call */}
        <Button
          variant="destructive"
          size="lg"
          onClick={handleLeave}
          className="rounded-full px-6 ml-1 cursor-pointer"
          title="Leave Call"
        >
          <PhoneOff className="w-4 h-4" />
        </Button>
      </footer>
    </div>
  );
}
