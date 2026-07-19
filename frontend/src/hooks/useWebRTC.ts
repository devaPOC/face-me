import { useEffect, useRef, useState, useCallback } from 'react';

type SignalingMessage = {
  type: 'ready' | 'offer' | 'answer' | 'ice_candidate' | 'action';
  payload?: any;
};

export function useWebRTC(roomId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteHandRaised, setRemoteHandRaised] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let ws: WebSocket | null = null;
    let pc: RTCPeerConnection | null = null;

    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        return;
      }

      pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcRef.current = pc;

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => pc!.addTrack(track, stream!));

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ice_candidate', payload: event.candidate }));
        }
      };

      // Connect signaling server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname === 'localhost' ? 'localhost:8080' : window.location.host;
      const wsUrl = process.env.NODE_ENV === 'development' 
        ? `ws://localhost:8080/ws/${roomId}` 
        : `${protocol}//${host}/ws/${roomId}`;
      
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to signaling server');
        // Tell the other peer (if they exist) that we are ready to receive an offer
        ws!.send(JSON.stringify({ type: 'ready' }));
      };

      ws.onmessage = async (event) => {
        try {
          const msg: SignalingMessage = JSON.parse(event.data);
          
          if (msg.type === 'ready') {
            // Received ready, we should initiate the offer
            const offer = await pc!.createOffer();
            await pc!.setLocalDescription(offer);
            ws!.send(JSON.stringify({ type: 'offer', payload: offer }));
          } else if (msg.type === 'offer') {
            await pc!.setRemoteDescription(new RTCSessionDescription(msg.payload));
            const answer = await pc!.createAnswer();
            await pc!.setLocalDescription(answer);
            ws!.send(JSON.stringify({ type: 'answer', payload: answer }));
          } else if (msg.type === 'answer') {
            await pc!.setRemoteDescription(new RTCSessionDescription(msg.payload));
          } else if (msg.type === 'ice_candidate') {
            await pc!.addIceCandidate(new RTCIceCandidate(msg.payload));
          } else if (msg.type === 'action') {
            if (msg.payload?.action === 'raise_hand') {
              setRemoteHandRaised(true);
              setTimeout(() => setRemoteHandRaised(false), 3000); // Hide after 3s
            }
          }
        } catch (err) {
          console.error("Failed to handle signaling message:", err);
        }
      };
    };

    init();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
      pc?.close();
      ws?.close();
    };
  }, [roomId]);

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
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    remoteHandRaised,
    toggleMute,
    toggleVideo,
    raiseHand
  };
}
