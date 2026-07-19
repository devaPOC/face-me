import { useEffect, useRef, useState, useCallback } from 'react';

export type CallStatus = 'IDLE' | 'WAITING_FOR_GUEST' | 'KNOCKING' | 'PROMPTING_CREATOR' | 'IN_CALL' | 'REJECTED';

type SignalingMessage = {
  type: 'knock' | 'admit' | 'reject' | 'ready' | 'offer' | 'answer' | 'ice_candidate' | 'action';
  payload?: unknown;
};

export function useWebRTC(roomId: string, isCreator: boolean) {
  const [status, setStatus] = useState<CallStatus>('IDLE');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteHandRaised, setRemoteHandRaised] = useState(false);

  const [localName, setLocalName] = useState('');
  const [remoteName, setRemoteName] = useState('');

  // Device Management State
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Cleanup WebRTC connections on unmount
  useEffect(() => {
    return () => {
      pcRef.current?.close();
      wsRef.current?.close();
    };
  }, []);

  // Cleanup local media stream on unmount or when it changes
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [localStream]);

  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
      setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
    } catch (err) {
      console.error('Failed to enumerate devices', err);
    }
  };

  const connect = async (userName: string) => {
    setLocalName(userName);
    
    // Safeguard for Secure Context (HTTPS or localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access blocked! You must use HTTPS or localhost to access the camera (Secure Context). Please use a tunneling service like localtunnel.");
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      // Load available devices
      await loadDevices();

      // Set initial selected devices
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      if (audioTrack) setSelectedAudioId(audioTrack.getSettings().deviceId || '');
      if (videoTrack) setSelectedVideoId(videoTrack.getSettings().deviceId || '');

    } catch (err) {
      console.error('Error accessing media devices:', err);
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pcRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream!));

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ice_candidate', payload: event.candidate }));
      }
    };

    // Connect signaling server via Next.js proxy
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${roomId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (isCreator) {
        setStatus('WAITING_FOR_GUEST');
      } else {
        setStatus('KNOCKING');
        ws.send(JSON.stringify({ type: 'knock', payload: { name: userName } }));
      }
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data) as SignalingMessage;
        const payload = msg.payload as any;

        if (msg.type === 'knock' && isCreator) {
          setRemoteName(payload.name);
          setStatus('PROMPTING_CREATOR');
        } else if (msg.type === 'admit' && !isCreator) {
          setRemoteName(payload.name);
          setStatus('IN_CALL');
          ws.send(JSON.stringify({ type: 'ready' }));
        } else if (msg.type === 'reject' && !isCreator) {
          setStatus('REJECTED');
          stream?.getTracks().forEach(track => track.stop());
          pc.close();
          ws.close();
        } else if (msg.type === 'ready' && isCreator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: 'offer', payload: offer }));
        } else if (msg.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', payload: answer }));
        } else if (msg.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
        } else if (msg.type === 'ice_candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(payload));
        } else if (msg.type === 'action') {
          if (payload?.action === 'raise_hand') {
            setRemoteHandRaised(true);
            setTimeout(() => setRemoteHandRaised(false), 3000);
          }
        }
      } catch (err) {
        console.error("Failed to handle signaling message:", err);
      }
    };
  };

  const switchDevice = useCallback(async (kind: 'audio' | 'video', deviceId: string) => {
    if (!localStream || !pcRef.current) return;

    try {
      const constraints = kind === 'audio' 
        ? { audio: { deviceId: { exact: deviceId } }, video: false }
        : { audio: false, video: { deviceId: { exact: deviceId } } };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newTrack = kind === 'audio' ? newStream.getAudioTracks()[0] : newStream.getVideoTracks()[0];
      
      const oldTrack = kind === 'audio' ? localStream.getAudioTracks()[0] : localStream.getVideoTracks()[0];
      
      // Replace track in peer connection
      const sender = pcRef.current.getSenders().find(s => s.track?.kind === kind);
      if (sender) {
        await sender.replaceTrack(newTrack);
      }

      // Update local stream state
      localStream.removeTrack(oldTrack);
      localStream.addTrack(newTrack);
      setLocalStream(new MediaStream(localStream.getTracks()));

      // Stop old track
      oldTrack.stop();

      // Apply current mute state to the newly created track
      if (kind === 'audio') {
        newTrack.enabled = !isMuted;
        setSelectedAudioId(deviceId);
      } else {
        newTrack.enabled = !isVideoOff;
        setSelectedVideoId(deviceId);
      }

    } catch (err) {
      console.error(`Failed to switch ${kind} device`, err);
    }
  }, [localStream, isMuted, isVideoOff]);

  const flipCamera = useCallback(async () => {
    if (videoDevices.length < 2) return;
    const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedVideoId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    await switchDevice('video', videoDevices[nextIndex].deviceId);
  }, [videoDevices, selectedVideoId, switchDevice]);

  const admitGuest = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'admit', payload: { name: localName } }));
      setStatus('IN_CALL');
    }
  }, [localName]);

  const rejectGuest = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'reject' }));
      setStatus('WAITING_FOR_GUEST');
      setRemoteName('');
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  const raiseHand = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'action', payload: { action: 'raise_hand' } }));
    }
  }, []);

  return {
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
    switchDevice,
    flipCamera,
    connect,
    admitGuest,
    rejectGuest,
    toggleMute,
    toggleVideo,
    raiseHand
  };
}
