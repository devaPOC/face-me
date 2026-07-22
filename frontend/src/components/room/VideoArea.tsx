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
    <div className="absolute inset-0 z-0">
      <StatsOverlay telemetry={showStats ? telemetry : null} onClose={() => setShowStats(false)} />

      {/* Primary Stage: Remote Video */}
      {status === 'IN_CALL' ? (
        <div className="absolute inset-0 z-0 bg-slate-900">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 video-stage-overlay pointer-events-none"></div>
          <div className="absolute bottom-32 left-8 z-20">
            <div className="px-3 py-1 glass rounded-md text-white font-label-sm shadow-md">
              {remoteName}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-900 flex items-center justify-center">
           {status === 'WAITING_FOR_GUEST' && (
             <div className="glass px-6 py-3 rounded-full text-white text-sm flex items-center gap-3">
               <Loader2 className="w-5 h-5 animate-spin" />
               <span className="font-label-md">Waiting for others to join…</span>
             </div>
           )}
           <div className="absolute inset-0 video-stage-overlay pointer-events-none"></div>
        </div>
      )}

      {/* PIP: Local Video */}
      <div className={
        status === 'IN_CALL'
          ? 'absolute bottom-32 right-8 z-20 group'
          : 'absolute inset-0 z-10 flex items-center justify-center pointer-events-none'
      }>
        <div className={
          status === 'IN_CALL'
            ? 'w-48 md:w-64 aspect-video rounded-lg overflow-hidden border-2 border-white/90 shadow-2xl transition-transform duration-500 hover:scale-[1.02]'
            : 'w-full h-full'
        }>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 ${status !== 'IN_CALL' ? 'opacity-30' : ''}`}
          />
          {status === 'IN_CALL' && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 glass rounded-md">
              <span className="text-white font-label-sm text-label-sm">
                {localName || 'You'} {isScreenSharing ? '(Sharing Screen)' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
