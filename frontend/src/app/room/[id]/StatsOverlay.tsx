'use client';

import React from 'react';
import { Telemetry } from '@/hooks/useWebRTC';
import { Activity, Wifi, Image as ImageIcon, Zap } from 'lucide-react';

export default function StatsOverlay({ telemetry, onClose }: { telemetry: Telemetry | null, onClose: () => void }) {
  if (!telemetry) return null;

  return (
    <div className="absolute top-16 left-4 right-4 sm:right-auto z-50 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 shadow-2xl sm:w-72 animate-fade-in pointer-events-auto">
      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
        <h3 className="font-semibold text-white flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-green-400" />
          Stats for Nerds
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Wifi className="w-3 h-3" /> Network & Latency
          </div>
          <div className="grid grid-cols-2 gap-x-2 pl-4.5">
            <div>RTT:</div><div className="text-right text-white">{telemetry.rtt} ms</div>
            <div>Jitter:</div><div className="text-right text-white">{telemetry.jitter} ms</div>
            <div>Packet Loss:</div><div className="text-right text-white">{telemetry.packetLoss} pkts</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <ImageIcon className="w-3 h-3" /> Video Quality
          </div>
          <div className="grid grid-cols-2 gap-x-2 pl-4.5">
            <div>Resolution:</div><div className="text-right text-white">{telemetry.resolution}</div>
            <div>Framerate:</div><div className="text-right text-white">{telemetry.fps} FPS</div>
            <div>Bitrate:</div><div className="text-right text-white">{telemetry.bitrateKbps} kbps</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Zap className="w-3 h-3" /> Transport Info
          </div>
          <div className="grid grid-cols-2 gap-x-2 pl-4.5">
            <div>Protocol:</div><div className="text-right text-white">{telemetry.iceProtocol}</div>
            <div className="col-span-2 mt-1 truncate" title={telemetry.iceType}>
              <span className="text-gray-500">Pair:</span> <span className="text-white text-[10px]">{telemetry.iceType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
