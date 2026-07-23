import React from 'react';
import { Loader2 } from 'lucide-react';
import StatsOverlay from '@/app/room/[id]/StatsOverlay';

interface VideoAreaProps {
  status: string;
  localName: string;
  remoteName: string;
  isScreenSharing: boolean;
  isScreenSharePaused: boolean;
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
  isScreenSharePaused,
  showStats,
  setShowStats,
  telemetry,
  localVideoRef,
  remoteVideoRef
}: VideoAreaProps) {
  return (
    <div className="absolute inset-0 z-0">
      <StatsOverlay telemetry={showStats ? telemetry : null} onClose={() => setShowStats(false)} />

      {isScreenSharePaused && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-black px-6 py-2.5 rounded-full font-medium text-sm shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Screen sharing is paused while you are on this tab
        </div>
      )}

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
          ? 'absolute top-[120px] md:top-auto md:bottom-32 right-margin-mobile md:right-8 z-20 group'
          : 'absolute inset-0 z-10 flex items-center justify-center pointer-events-none'
      }>
        <div className={
          status === 'IN_CALL'
            ? 'w-[100px] h-[150px] md:w-64 md:h-auto md:aspect-video rounded-lg overflow-hidden border border-white/20 md:border-2 md:border-white/90 shadow-2xl transition-transform duration-500 hover:scale-[1.02] cursor-grab active:scale-95'
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
