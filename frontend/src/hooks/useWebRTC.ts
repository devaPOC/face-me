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

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const cleanup = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
    pcRef.current?.close();
    wsRef.current?.close();
  }, [localStream]);

  useEffect(() => {
    return () => {
      // Intentionally avoiding passing cleanup directly to useEffect return to prevent premature teardown on re-renders,
      // but standard unmount cleanup is needed.
      localStream?.getTracks().forEach(track => track.stop());
      pcRef.current?.close();
      wsRef.current?.close();
    };
  }, []);

  const connect = async (userName: string) => {
    setLocalName(userName);
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
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

    const wsBase = process.env.NEXT_PUBLIC_WS_URL || (window.location.protocol === 'https:' ? `wss://${window.location.host}` : `ws://${window.location.host}`);
    const wsUrl = `${wsBase}/ws/${roomId}`;

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
          localStream?.getTracks().forEach(track => track.stop());
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
    connect,
    admitGuest,
    rejectGuest,
    toggleMute,
    toggleVideo,
    raiseHand
  };
}
