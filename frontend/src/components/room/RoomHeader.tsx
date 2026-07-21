import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoomHeaderProps {
  title: string;
  remoteHandRaised: boolean;
  remoteName: string;
}

export default function RoomHeader({ title, remoteHandRaised, remoteName }: RoomHeaderProps) {
  return (
    <header className="absolute top-0 inset-x-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-20">
      <div className="flex flex-col">
        <h2 className="text-sm font-medium drop-shadow-md">{title}</h2>
        <span className="text-xs text-green-400 font-semibold mt-1">🔒 End-to-End Encrypted</span>
      </div>
      {remoteHandRaised && (
        <Badge variant="default" className="bg-amber-500 text-black font-semibold shadow-lg animate-bounce">
          ✋ {remoteName} raised hand
        </Badge>
      )}
    </header>
  );
}
