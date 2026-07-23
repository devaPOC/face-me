import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoomHeaderProps {
  title: string;
  remoteHandRaised: boolean;
  remoteName: string;
}

export default function RoomHeader({ title, remoteHandRaised, remoteName }: RoomHeaderProps) {
  const parts = title.split(': ');
  const label = parts[0];
  const value = parts.slice(1).join(': ');

  return (
    <header className="absolute top-0 md:top-6 left-0 md:left-6 right-0 md:right-6 flex justify-center md:justify-between items-start z-20 pt-xl md:pt-0 pointer-events-none">
      
      {/* Desktop Pill Container */}
      <div className="hidden md:flex items-center gap-4 bg-[#23262B]/90 backdrop-blur-md rounded-full pl-6 pr-2.5 py-2.5 border border-white/10 shadow-xl pointer-events-auto">
        
        {/* Text Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-slate-400 font-semibold tracking-wider text-[13px] uppercase">{label}:</span>
          <span className="text-white font-bold text-[22px] leading-none tracking-tight">{value}</span>
        </div>
        
        {/* Divider */}
        <div className="w-px h-7 bg-white/10"></div>
        
        {/* Encrypted Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full text-[#10B981] text-sm font-semibold tracking-wide">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          Encrypted
        </div>
        
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col items-center w-full relative pointer-events-auto px-margin-mobile">
        <div className="glass px-md py-xs rounded-full flex items-center gap-xs">
          <span className="material-symbols-outlined text-green-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <span className="font-label-sm text-label-sm text-white uppercase tracking-wider">End-to-End Encrypted</span>
        </div>
        {/* Participant Info */}
        <div className="absolute left-margin-mobile top-0 flex flex-col items-start">
          <h1 className="font-title-md text-title-md text-white drop-shadow-md">{remoteName || value}</h1>
          <div className="flex items-center gap-xs">
            <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            <span className="font-label-sm text-label-sm text-white/70">Live</span>
          </div>
        </div>
      </div>

      {remoteHandRaised && (
        <Badge variant="default" className="bg-amber-500 text-black font-semibold shadow-lg animate-bounce pointer-events-auto mt-16 md:mt-0 absolute md:static top-0 right-margin-mobile">
          ✋ {remoteName} raised hand
        </Badge>
      )}
    </header>
  );
}
