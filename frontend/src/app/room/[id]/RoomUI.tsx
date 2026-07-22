'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';

import JoinScreen from '@/components/room/JoinScreen';
import StatusScreens from '@/components/room/StatusScreens';
import RoomHeader from '@/components/room/RoomHeader';
import VideoArea from '@/components/room/VideoArea';
import SideDrawer from '@/components/room/SideDrawer';
import ControlBar from '@/components/room/ControlBar';
import PostCallModal from '@/components/room/PostCallModal';

export default function RoomUI({ roomId, initialTopic, isCreator }: { roomId: string, initialTopic: string, isCreator: boolean }) {
  const router = useRouter();

  const [isActuallyCreator, setIsActuallyCreator] = useState(isCreator);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeof window !== 'undefined') {
        const storedCreator = sessionStorage.getItem(`faceme_creator_${roomId}`) === 'true';
        if (storedCreator) {
          setIsActuallyCreator(true);
        } else if (isCreator) {
          setIsActuallyCreator(false);
        }
  
        const url = new URL(window.location.href);
        if (url.searchParams.has('creator')) {
          url.searchParams.delete('creator');
          window.history.replaceState({}, '', url.toString());
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [roomId, isCreator]);

  const {
    status,
    localStream,
    remoteStream,
    localName,
    remoteName,
    isMuted,
    isVideoOff,
    remoteHandRaised,
    audioDevices,
    videoDevices,
    selectedAudioId,
    selectedVideoId,
    isScreenSharing,
    isScreenSharePaused,
    chatMessages,
    telemetry,
    initLocalMedia,
    switchDevice,
    flipCamera,
    connect,
    admitGuest,
    rejectGuest,
    toggleMute,
    toggleVideo,
    raiseHand,
    toggleScreenShare,
    sendMessage,
    sendFile
  } = useWebRTC(roomId, isActuallyCreator);

  const [inputName, setInputName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('face-me-username') || '';
    }
    return '';
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'people' | 'chat'>('people');
  const [chatText, setChatText] = useState('');
  const [showStats, setShowStats] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, status]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, status]);

  useEffect(() => {
    if (status === 'IDLE') {
      initLocalMedia();
    }
  }, [status, initLocalMedia]);

  // Auto-open the modal when someone knocks
  useEffect(() => {
    if (status === 'PROMPTING_CREATOR') {
      const timer = setTimeout(() => {
        setModalOpen(true);
        setActiveTab('people');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      localStorage.setItem('face-me-username', inputName.trim());
      connect(inputName.trim());
    }
  };

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleLeaveClick = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    router.push('/');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatText.trim()) {
      sendMessage(chatText.trim());
      setChatText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      sendFile(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Derive participant counts for the badge
  const inCallCount = (localName ? 1 : 0) + (status === 'IN_CALL' && remoteName ? 1 : 0);
  const waitingCount = status === 'PROMPTING_CREATOR' && remoteName ? 1 : 0;

  if (status === 'IDLE') {
    return (
      <JoinScreen
        roomId={roomId}
        initialTopic={initialTopic}
        inputName={inputName}
        setInputName={setInputName}
        handleJoin={handleJoin}
        isActuallyCreator={isActuallyCreator}
        localStream={localStream}
        isVideoOff={isVideoOff}
        isMuted={isMuted}
        audioDevices={audioDevices}
        videoDevices={videoDevices}
        selectedAudioId={selectedAudioId}
        selectedVideoId={selectedVideoId}
        switchDevice={switchDevice}
        toggleVideo={toggleVideo}
        toggleMute={toggleMute}
      />
    );
  }

  if (['REJECTED', 'FULL', 'ENDED', 'KNOCKING'].includes(status)) {
    return (
      <>
        <StatusScreens status={status} handleLeave={handleLeaveClick} />
        <PostCallModal 
          isOpen={showLeaveModal} 
          onClose={() => setShowLeaveModal(false)} 
          onConfirmLeave={handleConfirmLeave} 
        />
      </>
    );
  }

  const title = initialTopic ? `Meet: ${initialTopic}` : `Room: ${roomId}`;

  if (!mounted) return null;

  /* ─── IN CALL / WAITING ─── */
  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
      <RoomHeader 
        title={title} 
        remoteHandRaised={remoteHandRaised} 
        remoteName={remoteName} 
      />

      <VideoArea 
        status={status}
        localName={localName}
        remoteName={remoteName}
        isScreenSharing={isScreenSharing}
        isScreenSharePaused={isScreenSharePaused}
        showStats={showStats}
        setShowStats={setShowStats}
        telemetry={telemetry}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />

      <SideDrawer 
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        localName={localName}
        remoteName={remoteName}
        isActuallyCreator={isActuallyCreator}
        waitingCount={waitingCount}
        inCallCount={inCallCount}
        chatMessages={chatMessages}
        chatText={chatText}
        setChatText={setChatText}
        handleSendChat={handleSendChat}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        admitGuest={admitGuest}
        rejectGuest={rejectGuest}
      />

      <ControlBar 
        status={status}
        inCallCount={inCallCount}
        waitingCount={waitingCount}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        toggleScreenShare={toggleScreenShare}
        raiseHand={raiseHand}
        handleLeave={handleLeaveClick}
        showStats={showStats}
        setShowStats={setShowStats}
        flipCamera={flipCamera}
        audioDevices={audioDevices}
        videoDevices={videoDevices}
        selectedAudioId={selectedAudioId}
        selectedVideoId={selectedVideoId}
        switchDevice={switchDevice}
      />
      
      <PostCallModal 
        isOpen={showLeaveModal} 
        onClose={() => setShowLeaveModal(false)} 
        onConfirmLeave={handleConfirmLeave} 
      />
    </div>
  );
}
