import React, { useEffect, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

interface JoinScreenProps {
  roomId: string;
  initialTopic: string;
  inputName: string;
  setInputName: (name: string) => void;
  handleJoin: (e: React.FormEvent) => void;
  isActuallyCreator: boolean;
  localStream: MediaStream | null;
  isVideoOff: boolean;
  isMuted: boolean;
  audioDevices: any[];
  videoDevices: any[];
  selectedAudioId: string;
  selectedVideoId: string;
  switchDevice: (type: 'audio' | 'video', id: string) => void;
  toggleVideo: () => void;
  toggleMute: () => void;
}

export default function JoinScreen({
  roomId,
  initialTopic,
  inputName,
  setInputName,
  handleJoin,
  isActuallyCreator,
  localStream,
  isVideoOff,
  isMuted,
  audioDevices,
  videoDevices,
  selectedAudioId,
  selectedVideoId,
  switchDevice,
  toggleVideo,
  toggleMute
}: JoinScreenProps) {
  const displayTitle = initialTopic ? `Ready to connect to "${initialTopic}"?` : 'Ready to connect?';
  const videoRef = useRef<HTMLVideoElement>(null);
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const bar3Ref = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const reqRef = useRef<number>(0);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoOff]);

  useEffect(() => {
    if (!localStream || isMuted) {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    audioContextRef.current = audioCtx;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(console.error);
    }

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.5;
    analyserRef.current = analyser;

    const source = audioCtx.createMediaStreamSource(localStream);
    sourceRef.current = source;
    source.connect(analyser);

    // CRITICAL: Connect to a muted gain node and then to destination.
    // If the analyser is a leaf node, some browsers optimize it out and it processes no data!
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    const updateVolume = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

      let maxVal = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArrayRef.current[i] > maxVal) {
          maxVal = dataArrayRef.current[i];
        }
      }

      // If suspended, try to resume
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(() => { });
      }

      // Map it so 0 -> 20%, and ~100+ -> 100% for high sensitivity
      const intensity = Math.min(1, maxVal / 80);

      const time = Date.now() / 200;
      const breathing = Math.sin(time) * 5 + 5; // smooth 0 to 10 breathing when silent

      const baseHeight = 20 + intensity * 80 + (intensity < 0.1 ? breathing : 0);

      // Smooth erratic jumps for speech
      const jitter1 = intensity > 0.1 ? (Math.random() - 0.5) * 20 * intensity : Math.sin(time * 1.1) * 3;
      const jitter2 = intensity > 0.1 ? (Math.random() - 0.5) * 30 * intensity : Math.cos(time * 1.3) * 4;
      const jitter3 = intensity > 0.1 ? (Math.random() - 0.5) * 20 * intensity : Math.sin(time * 0.9) * 3;

      const v1 = Math.min(100, Math.max(20, baseHeight * 0.7 + jitter1));
      const v2 = Math.min(100, Math.max(20, baseHeight * 1.3 + jitter2));
      const v3 = Math.min(100, Math.max(20, baseHeight * 0.9 + jitter3));

      if (bar1Ref.current) bar1Ref.current.style.height = `${v1}%`;
      if (bar2Ref.current) bar2Ref.current.style.height = `${v2}%`;
      if (bar3Ref.current) bar3Ref.current.style.height = `${v3}%`;

      reqRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [localStream, isMuted]);

  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-on-background antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-sm md:py-5 bg-surface/80 dark:bg-background/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-primary dark:text-primary-fixed flex items-center gap-2 tracking-tight">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed text-[28px] md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
          <span className="tracking-tight">FaceMe</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center pt-lg md:pt-32 pb-xl md:pb-24 px-margin-mobile">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-lg md:gap-16 items-center">

          {/* Left: Content & Branding */}
          <div className="flex flex-col space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-xs md:space-y-4">
              <h1 className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-primary leading-tight">{displayTitle}</h1>
              <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-md">
                Check your settings before joining the room {roomId}. Everyone is waiting for you.
              </p>
            </div>

            <form onSubmit={handleJoin} className="flex flex-col gap-md md:gap-6">
              <div className="space-y-xs md:space-y-4">
                <label className="block font-label-md text-on-surface-variant ml-sm md:ml-1">What&apos;s your name?</label>
                <div className="relative group">
                  <input
                    className="w-full h-14 md:h-auto px-lg md:px-6 py-4 md:py-4.5 bg-surface-container-lowest md:bg-white border border-outline-variant md:border-slate-200 rounded-full md:rounded-2xl text-body-md focus:ring-4 focus:ring-secondary-container/20 md:focus:ring-secondary/10 focus:border-secondary transition-all outline-none shadow-sm text-primary"
                    placeholder="e.g. Julian Anderson"
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-max h-14 md:h-auto px-14 py-4 md:py-4.5 bg-secondary text-white rounded-full font-title-md shadow-xl shadow-secondary/25 hover:scale-[1.02] hover:bg-[#FF5A4A] active:scale-95 transition-all duration-300">
                {isActuallyCreator ? 'Start Meeting' : 'Knock to Join'}
              </button>
            </form>
          </div>

          {/* Right: Camera Preview Card */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-surface md:bg-white p-0 md:p-3 rounded-none md:rounded-[32px] shadow-none md:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border-none md:border md:border-slate-100 flex flex-col">

              <div className="preview-container relative aspect-[3/4] md:aspect-[4/3] rounded-[24px] overflow-hidden bg-primary md:bg-slate-900 group flex items-center justify-center shadow-xl md:shadow-none">
                {localStream && !isVideoOff ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/50 space-y-2">
                    <span className="material-symbols-outlined text-5xl">videocam_off</span>
                    <span className="font-label-md">Camera is off</span>
                  </div>
                )}

                <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/20">
                  <div className={`w-2 h-2 rounded-full ${localStream && !isVideoOff ? 'bg-[#10b981] animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white font-bold">Preview {isVideoOff ? 'Off' : 'Ready'}</span>
                </div>
              </div>

              {/* Device Selectors & Audio Check */}
              <div className="mt-md md:mt-5 pb-2 flex flex-col gap-4 px-2 md:px-4">

                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Device Dropdowns as ControlBar */}
                  <div className="p-2 rounded-xl flex items-center gap-2 shadow-sm bg-slate-900">

                    {/* Camera Toggle with Device Selector inside DropdownMenu */}
                    <DropdownMenu>
                      <div className="flex bg-white/10 rounded-full hover:bg-white/20 transition-all">
                        <DropdownMenuTrigger render={
                          <button className="control-btn px-2 h-12 flex items-center justify-center text-white/70 hover:text-white border-r border-white/10 cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">expand_less</span>
                          </button>
                        } />
                        <button
                          type="button"
                          onClick={toggleVideo}
                          className={`control-btn w-12 h-12 flex items-center justify-center cursor-pointer ${isVideoOff ? 'text-red-400' : 'text-white'}`}>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isVideoOff ? 'videocam_off' : 'videocam'}
                          </span>
                        </button>
                      </div>
                      <DropdownMenuContent side="top" align="start" className="min-w-[220px]">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Camera Settings</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={selectedVideoId} onValueChange={(v) => switchDevice('video', v)}>
                            {videoDevices.length === 0 && <DropdownMenuItem disabled>No cameras found</DropdownMenuItem>}
                            {videoDevices.map((d, i) => (
                              <DropdownMenuRadioItem key={d.deviceId || i} value={d.deviceId}>
                                {d.label || `Camera ${i + 1}`}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mic Toggle with Device Selector inside DropdownMenu */}
                    <DropdownMenu>
                      <div className="flex bg-white/10 rounded-full hover:bg-white/20 transition-all">
                        <DropdownMenuTrigger render={
                          <button className="control-btn px-2 h-12 flex items-center justify-center text-white/70 hover:text-white border-r border-white/10 cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">expand_less</span>
                          </button>
                        } />
                        <button
                          type="button"
                          onClick={toggleMute}
                          className={`control-btn w-12 h-12 flex items-center justify-center cursor-pointer ${isMuted ? 'text-red-400' : 'text-white'}`}>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isMuted ? 'mic_off' : 'mic'}
                          </span>
                        </button>
                      </div>
                      <DropdownMenuContent side="top" align="start" className="min-w-[220px]">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Microphone Settings</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={selectedAudioId} onValueChange={(v) => switchDevice('audio', v)}>
                            {audioDevices.length === 0 && <DropdownMenuItem disabled>No mics found</DropdownMenuItem>}
                            {audioDevices.map((d, i) => (
                              <DropdownMenuRadioItem key={d.deviceId || i} value={d.deviceId}>
                                {d.label || `Microphone ${i + 1}`}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Audio Check Animation */}
                  <div className="flex items-center gap-3">
                    {!isMuted && localStream ? (
                      <div className="flex gap-1 h-4 items-center justify-center w-8">
                        <div ref={bar1Ref} className="w-1.5 bg-secondary rounded-full transition-all duration-75 ease-out" style={{ height: '20%' }}></div>
                        <div ref={bar2Ref} className="w-1.5 bg-secondary rounded-full transition-all duration-75 ease-out" style={{ height: '20%' }}></div>
                        <div ref={bar3Ref} className="w-1.5 bg-secondary rounded-full transition-all duration-75 ease-out" style={{ height: '20%' }}></div>
                      </div>
                    ) : (
                      <div className="flex gap-1 h-4 items-center justify-center w-8 opacity-30">
                        <div className="w-1.5 bg-slate-400 rounded-full h-[20%]"></div>
                        <div className="w-1.5 bg-slate-400 rounded-full h-[20%]"></div>
                        <div className="w-1.5 bg-slate-400 rounded-full h-[20%]"></div>
                      </div>
                    )}
                    <span className="text-label-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {isMuted ? 'Muted' : 'Audio Check'}
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Atmospheric Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -z-10"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
          </div>

        </div>
      </main>
    </div>
  );
}
