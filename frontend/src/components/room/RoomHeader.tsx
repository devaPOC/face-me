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
    <header className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
      
      {/* Pill Container */}
      <div className="flex items-center gap-4 bg-[#23262B]/90 backdrop-blur-md rounded-full pl-6 pr-2.5 py-2.5 border border-white/10 shadow-xl">
        
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

      {remoteHandRaised && (
        <Badge variant="default" className="bg-amber-500 text-black font-semibold shadow-lg animate-bounce">
          ✋ {remoteName} raised hand
        </Badge>
      )}
    </header>
  );
}
