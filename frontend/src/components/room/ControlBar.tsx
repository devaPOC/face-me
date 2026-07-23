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
import { Activity, SwitchCamera } from 'lucide-react';

interface ControlBarProps {
  status: string;
  inCallCount: number;
  waitingCount: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  activeTab: 'people' | 'chat';
  setActiveTab: (tab: 'people' | 'chat') => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  raiseHand: () => void;
  handleLeave: () => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  flipCamera: () => void;
  audioDevices: any[];
  videoDevices: any[];
  selectedAudioId: string;
  selectedVideoId: string;
  switchDevice: (type: 'audio' | 'video', deviceId: string) => void;
}

export default function ControlBar({
  status,
  inCallCount,
  waitingCount,
  isMuted,
  isVideoOff,
  isScreenSharing,
  modalOpen,
  setModalOpen,
  activeTab,
  setActiveTab,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  raiseHand,
  handleLeave,
  showStats,
  setShowStats,
  flipCamera,
  audioDevices,
  videoDevices,
  selectedAudioId,
  selectedVideoId,
  switchDevice
}: ControlBarProps) {
  return (
    <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 w-full px-2 sm:px-margin-mobile flex justify-center pointer-events-none">
      <div className="glass p-2 md:p-3 lg:p-4 rounded-xl flex flex-wrap justify-center items-center gap-1.5 md:gap-2 lg:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto max-w-full">

        {/* Mic Toggle with Device Selector inside DropdownMenu */}
        <DropdownMenu>
          <div className="flex bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <DropdownMenuTrigger render={
              <button className="control-btn px-1.5 md:px-2 h-10 md:h-12 lg:h-14 flex items-center justify-center text-white/70 hover:text-white border-r border-white/10 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">expand_less</span>
              </button>
            } />
            <button
              onClick={toggleMute}
              className={`control-btn w-10 h-10 md:w-12 md:h-12 lg:w-12 lg:h-14 flex items-center justify-center cursor-pointer ${isMuted ? 'text-red-400' : 'text-white'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isMuted ? 'mic_off' : 'mic'}
              </span>
            </button>
          </div>
          <DropdownMenuContent side="top" align="start" className="min-w-[220px]">
            <DropdownMenuGroup>
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Camera Toggle with Device Selector inside DropdownMenu */}
        <DropdownMenu>
          <div className="flex bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <DropdownMenuTrigger render={
              <button className="control-btn px-1.5 md:px-2 h-10 md:h-12 lg:h-14 flex items-center justify-center text-white/70 hover:text-white border-r border-white/10 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">expand_less</span>
              </button>
            } />
            <button
              onClick={toggleVideo}
              className={`control-btn w-10 h-10 md:w-12 md:h-12 lg:w-12 lg:h-14 flex items-center justify-center cursor-pointer ${isVideoOff ? 'text-red-400' : 'text-white'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isVideoOff ? 'videocam_off' : 'videocam'}
              </span>
            </button>
          </div>
          <DropdownMenuContent side="top" align="start" className="min-w-[220px]">
            <DropdownMenuGroup>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={flipCamera} className="cursor-pointer">
                <SwitchCamera className="w-4 h-4 mr-2" /> Flip Camera
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`control-btn w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center cursor-pointer ${isScreenSharing ? 'bg-secondary text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>present_to_all</span>
        </button>

        <div className="w-px h-8 bg-white/10 mx-1"></div>

        {/* Raise Hand */}
        {status === 'IN_CALL' && (
          <button
            onClick={raiseHand}
            className="control-btn w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>front_hand</span>
          </button>
        )}

        {/* Participants (Waiting Room) */}
        {inCallCount < 2 && (
          <button
            onClick={() => {
              if (modalOpen && activeTab === 'people') setModalOpen(false);
              else { setModalOpen(true); setActiveTab('people'); }
            }}
            className="control-btn w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 relative cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            {(waitingCount > 0) && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#0F172A]"></span>
            )}
          </button>
        )}

        {/* Chat Drawer Toggle */}
        {status === 'IN_CALL' && (
          <button
            onClick={() => {
              if (modalOpen && activeTab === 'chat') setModalOpen(false);
              else { setModalOpen(true); setActiveTab('chat'); }
            }}
            className="control-btn w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 relative cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="control-btn w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 cursor-pointer">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          } />
          <DropdownMenuContent side="top" align="center">
            <DropdownMenuItem onClick={() => setShowStats(!showStats)} className="cursor-pointer">
              <Activity className="w-4 h-4 mr-2" /> Stats for Nerds
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* End Call */}
        <button
          onClick={handleLeave}
          className="control-btn px-4 md:px-6 lg:px-8 h-10 md:h-12 lg:h-14 rounded-full flex items-center justify-center bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-lg shadow-red-900/20 ml-1 md:ml-2 cursor-pointer">
          <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>call_end</span>
          <span className="font-label-md text-label-md font-bold uppercase tracking-widest hidden md:inline">End</span>
        </button>

      </div>
    </div>
  );
}
