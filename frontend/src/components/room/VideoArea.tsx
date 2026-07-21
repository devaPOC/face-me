import React from 'react';
import { Loader2 } from 'lucide-react';
import StatsOverlay from '@/app/room/[id]/StatsOverlay';

interface VideoAreaProps {
  status: string;
  localName: string;
  remoteName: string;
  isScreenSharing: boolean;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  telemetry: any;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function VideoArea({
  status,
  localName,
  remoteName,
  isScreenSharing,
  showStats,
  setShowStats,
  telemetry,
  localVideoRef,
  remoteVideoRef
}: VideoAreaProps) {
  return (
    <main className="flex-1 relative w-full h-full">
      <StatsOverlay telemetry={showStats ? telemetry : null} onClose={() => setShowStats(false)} />

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
          {localName} (You) {isScreenSharing ? '- Sharing Screen' : ''}
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
    </main>
  );
}
