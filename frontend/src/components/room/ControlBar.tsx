import { Button } from '@/components/ui/button';
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
import {
  Mic, MicOff, Video, VideoOff,
  MoreVertical, PhoneOff, Hand, SwitchCamera,
  ChevronUp, Users, MonitorUp, Activity, MessageSquare
} from 'lucide-react';

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
    <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-xl px-3 py-2 rounded-full z-40 shadow-2xl border border-border">
      {/* Mic split button */}
      <div className="flex rounded-full overflow-hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant={isMuted ? 'destructive' : 'ghost'}
                size="icon-sm"
                className="rounded-none rounded-l-full cursor-pointer"
              />
            }
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </DropdownMenuTrigger>
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

        <Button
          variant={isMuted ? 'destructive' : 'ghost'}
          size="icon"
          onClick={toggleMute}
          className="rounded-none rounded-r-full cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      </div>

      {/* Video split button */}
      <div className="flex rounded-full overflow-hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant={isVideoOff ? 'destructive' : 'ghost'}
                size="icon-sm"
                className="rounded-none rounded-l-full cursor-pointer"
              />
            }
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </DropdownMenuTrigger>
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={isVideoOff ? 'destructive' : 'ghost'}
          size="icon"
          onClick={toggleVideo}
          className="rounded-none rounded-r-full cursor-pointer"
          title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        >
          {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
        </Button>
      </div>

      {/* Screen Share button */}
      <Button
        variant={isScreenSharing ? 'secondary' : 'ghost'}
        size="icon"
        onClick={toggleScreenShare}
        className="rounded-full cursor-pointer text-white"
        title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
      >
        <MonitorUp className="w-4 h-4" />
      </Button>

      {/* Waiting Room button */}
      {inCallCount < 2 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (modalOpen && activeTab === 'people') setModalOpen(false);
            else { setModalOpen(true); setActiveTab('people'); }
          }}
          className="rounded-full cursor-pointer relative"
          title="Waiting Room"
        >
          <Users className="w-4 h-4" />
          {(waitingCount > 0) && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {waitingCount}
            </span>
          )}
        </Button>
      )}

      {status === 'IN_CALL' && (
        <>
          {/* Chat button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (modalOpen && activeTab === 'chat') setModalOpen(false);
              else { setModalOpen(true); setActiveTab('chat'); }
            }}
            className="rounded-full cursor-pointer"
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>

          {/* Raise Hand button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={raiseHand}
            className="rounded-full cursor-pointer"
            title="Raise Hand"
          >
            <Hand className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* More options */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="rounded-full cursor-pointer" />
          }
        >
          <MoreVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center">
          <DropdownMenuItem onClick={() => setShowStats(!showStats)} className="cursor-pointer">
            <Activity className="w-4 h-4 mr-2" /> Stats for Nerds
          </DropdownMenuItem>
          <DropdownMenuItem onClick={flipCamera} className="cursor-pointer">
            <SwitchCamera className="w-4 h-4 mr-2" /> Flip Camera
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* End call */}
      <Button
        variant="destructive"
        size="lg"
        onClick={handleLeave}
        className="rounded-full px-6 ml-1 cursor-pointer"
        title="Leave Call"
      >
        <PhoneOff className="w-4 h-4" />
      </Button>
    </footer>
  );
}
