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
    <header className="absolute top-3 left-3 right-3 md:top-6 md:left-6 md:right-6 flex justify-between items-start z-20">
      
      {/* Pill Container */}
      <div className="flex items-center gap-2 md:gap-4 bg-[#23262B]/90 backdrop-blur-md rounded-full pl-3 pr-2 py-2 md:pl-6 md:pr-2.5 md:py-2.5 border border-white/10 shadow-xl">
        
        {/* Text Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-slate-400 font-semibold tracking-wider text-[11px] md:text-[13px] uppercase">{label}:</span>
          <span className="text-white font-bold text-base md:text-[22px] leading-none tracking-tight">{value}</span>
        </div>
        
        {/* Divider */}
        <div className="w-px h-7 bg-white/10"></div>
        
        {/* Encrypted Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full text-[#10B981] text-sm font-semibold tracking-wide">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <span className="hidden sm:inline">Encrypted</span>
        </div>
        
      </div>

      {remoteHandRaised && (
        <Badge variant="default" className="bg-amber-500 text-black font-semibold shadow-lg animate-bounce">
          ✋ {remoteName} raised hand
        </Badge>
      )}
    </header>
  );
}
