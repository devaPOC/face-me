import { useEffect, useRef, useState, useCallback } from 'react';

export type CallStatus = 'IDLE' | 'WAITING_FOR_GUEST' | 'KNOCKING' | 'PROMPTING_CREATOR' | 'IN_CALL' | 'REJECTED' | 'FULL' | 'ENDED';

type SignalingMessage = {
  type: 'knock' | 'admit' | 'reject' | 'ready' | 'offer' | 'answer' | 'ice_candidate' | 'action' | 'leave';
  payload?: unknown;
};

export type ChatMessage = {
  sender: string;
  text: string;
  timestamp: string;
  isFile?: boolean;
  fileName?: string;
  fileUrl?: string;
};

export type Telemetry = {
  rtt: number;
  jitter: number;
  packetLoss: number;
  resolution: string;
  fps: number;
  bitrateKbps: number;
  iceType: string;
  iceProtocol: string;
};

export function useWebRTC(roomId: string, isCreator: boolean) {
  const [status, setStatus] = useState<CallStatus>('IDLE');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteHandRaised, setRemoteHandRaised] = useState(false);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

  const [localName, setLocalName] = useState('');
  const [remoteName, setRemoteName] = useState('');

  // Device Management State
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const e2eeWorkerRef = useRef<Worker | null>(null);
  const incomingFile = useRef<{ name: string; size: number; type: string; chunks: ArrayBuffer[]; receivedSize: number } | null>(null);

  const lastStatsRef = useRef<{ timestamp: number; bytesReceived: number; bytesSent: number } | null>(null);

  // Initialize E2EE Worker and cleanup WebRTC connections on unmount
  useEffect(() => {
    e2eeWorkerRef.current = new Worker('/e2ee.worker.js');
    return () => {
      e2eeWorkerRef.current?.terminate();
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

  // Telemetry Polling Loop
  useEffect(() => {
    if (status !== 'IN_CALL') {
      return;
    }

    const interval = setInterval(async () => {
      if (!pcRef.current) return;
      const stats = await pcRef.current.getStats();
      let rtt = 0, jitter = 0, packetLoss = 0;
      let resolution = '0x0', fps = 0, bitrateKbps = 0;
      let iceType = '', iceProtocol = '';
      let bytesReceived = 0, bytesSent = 0;

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'video') {
          jitter = (report.jitter || 0) * 1000;
          packetLoss = report.packetsLost || 0;
          resolution = `${report.frameWidth || 0}x${report.frameHeight || 0}`;
          fps = report.framesPerSecond || 0;
          bytesReceived = report.bytesReceived || 0;
        } else if (report.type === 'outbound-rtp' && report.kind === 'video') {
          bytesSent = report.bytesSent || 0;
        } else if (report.type === 'remote-inbound-rtp' && report.kind === 'video') {
          rtt = (report.roundTripTime || 0) * 1000;
        } else if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          const local = stats.get(report.localCandidateId);
          const remote = stats.get(report.remoteCandidateId);
          iceType = `${local?.candidateType || 'unknown'} -> ${remote?.candidateType || 'unknown'}`;
          iceProtocol = local?.protocol || 'unknown';
        }
      });

      const now = performance.now();
      if (lastStatsRef.current) {
        const timeDelta = (now - lastStatsRef.current.timestamp) / 1000;
        const bytesDelta = (bytesReceived + bytesSent) - (lastStatsRef.current.bytesReceived + lastStatsRef.current.bytesSent);
        if (timeDelta > 0 && bytesDelta > 0) {
          bitrateKbps = Math.round((bytesDelta * 8) / timeDelta / 1000);
        }
      }
      lastStatsRef.current = { timestamp: now, bytesReceived, bytesSent };

      setTelemetry({
        rtt: Math.round(rtt),
        jitter: Math.round(jitter),
        packetLoss,
        resolution,
        fps: Math.round(fps),
        bitrateKbps,
        iceType,
        iceProtocol: iceProtocol.toUpperCase()
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
      setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
    } catch (err) {
      console.error('Failed to enumerate devices', err);
    }
  };

  const setupDataChannel = (dc: RTCDataChannel) => {
    dc.onopen = () => console.log('Data channel opened');
    dc.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setChatMessages(prev => [...prev, { sender: data.sender || 'Guest', text: data.text, timestamp: data.timestamp }]);
        } else if (data.type === 'file_start') {
          incomingFile.current = { name: data.name, size: data.size, type: data.fileType, chunks: [], receivedSize: 0 };
        } else if (data.type === 'file_end') {
          const file = incomingFile.current;
          if (file && file.receivedSize === file.size) {
            const blob = new Blob(file.chunks, { type: file.type });
            const url = URL.createObjectURL(blob);
            setChatMessages(prev => [...prev, { sender: data.sender || 'Guest', text: `Sent a file: ${file.name}`, timestamp: new Date().toISOString(), isFile: true, fileName: file.name, fileUrl: url }]);
            incomingFile.current = null;
          }
        }
      } else {
        if (incomingFile.current) {
          incomingFile.current.chunks.push(event.data);
          incomingFile.current.receivedSize += event.data.byteLength;
        }
      }
    };
    dcRef.current = dc;
  };

  const connect = async (userName: string) => {
    setLocalName(userName);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access blocked! You must use HTTPS or localhost to access the camera (Secure Context). Please use a tunneling service like localtunnel.");
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      await loadDevices();

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

    if (isCreator) {
      const dc = pc.createDataChannel("faceme-datachannel", { ordered: true });
      setupDataChannel(dc);
    }

    pc.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };

    stream.getTracks().forEach((track) => {
      // In a P2P WebRTC connection, tracks are already End-to-End Encrypted natively via DTLS-SRTP.
      // We do not need Insertable Streams (which corrupt the video payload descriptors).
      pcRef.current!.addTrack(track, stream!);
    });

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ice_candidate', payload: event.candidate }));
      }
    };

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
      ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/${roomId}`
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/${roomId}`;

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
        const data = JSON.parse(event.data);
        if (data && data.error) {
          if (data.error === 'Room is full') setStatus('FULL');
          else setStatus('REJECTED');
          stream?.getTracks().forEach(track => track.stop());
          pcRef.current?.close();
          ws.close();
          return;
        }

        const msg = data as SignalingMessage;
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
          pcRef.current?.close();
          ws.close();
        } else if (msg.type === 'ready' && isCreator) {
          const offer = await pcRef.current!.createOffer();
          await pcRef.current!.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: 'offer', payload: offer }));
        } else if (msg.type === 'offer') {
          await pcRef.current!.setRemoteDescription(new RTCSessionDescription(payload));
          const answer = await pcRef.current!.createAnswer();
          await pcRef.current!.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', payload: answer }));
        } else if (msg.type === 'answer') {
          await pcRef.current!.setRemoteDescription(new RTCSessionDescription(payload));
        } else if (msg.type === 'ice_candidate') {
          await pcRef.current!.addIceCandidate(new RTCIceCandidate(payload));
        } else if (msg.type === 'action') {
          if (payload?.action === 'raise_hand') {
            setRemoteHandRaised(true);
            setTimeout(() => setRemoteHandRaised(false), 3000);
          }
        } else if (msg.type === 'leave') {
          if (pcRef.current) pcRef.current.close();
          setRemoteStream(null);
          setRemoteName('');

          if (isCreator) {
            const newPC = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
            pcRef.current = newPC;

            const dc = newPC.createDataChannel("faceme-datachannel", { ordered: true });
            setupDataChannel(dc);

            if (stream) {
              stream.getTracks().forEach((track) => {
                const sender = newPC.addTrack(track, stream!);
                if ((window as any).RTCRtpScriptTransform && e2eeWorkerRef.current) {
                  sender.transform = new (window as any).RTCRtpScriptTransform(e2eeWorkerRef.current, { operation: 'encode', key: roomId });
                }
              });
            }

            newPC.ontrack = (event) => {
              setRemoteStream(event.streams[0]);
              if ((window as any).RTCRtpScriptTransform && e2eeWorkerRef.current) {
                event.receiver.transform = new (window as any).RTCRtpScriptTransform(e2eeWorkerRef.current, { operation: 'decode', key: roomId });
              }
            };

            newPC.onicecandidate = (event) => {
              if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'ice_candidate', payload: event.candidate }));
              }
            };

            setStatus('WAITING_FOR_GUEST');
          } else {
            setStatus('ENDED');
            wsRef.current?.close();
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

      const sender = pcRef.current.getSenders().find(s => s.track?.kind === kind);
      if (sender) await sender.replaceTrack(newTrack);

      localStream.removeTrack(oldTrack);
      localStream.addTrack(newTrack);
      setLocalStream(new MediaStream(localStream.getTracks()));

      oldTrack.stop();

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

  const toggleScreenShare = useCallback(async () => {
    if (!pcRef.current || !localStream) return;

    if (isScreenSharing) {
      if (screenTrackRef.current) screenTrackRef.current.stop();
      const videoTrack = localStream.getVideoTracks()[0];
      const sender = pcRef.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender && videoTrack) await sender.replaceTrack(videoTrack);
      setIsScreenSharing(false);
      screenTrackRef.current = null;
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = pcRef.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) await sender.replaceTrack(screenTrack);

        screenTrack.onended = async () => {
          const videoTrack = localStream.getVideoTracks()[0];
          if (sender && videoTrack) await sender.replaceTrack(videoTrack);
          setIsScreenSharing(false);
          screenTrackRef.current = null;
        };

        screenTrackRef.current = screenTrack;
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    }
  }, [localStream, isScreenSharing]);

  const sendMessage = useCallback((text: string) => {
    if (dcRef.current?.readyState === 'open') {
      const msg = { type: 'chat', sender: localName, text, timestamp: new Date().toISOString() };
      dcRef.current.send(JSON.stringify(msg));
      setChatMessages(prev => [...prev, msg]);
    }
  }, [localName]);

  const sendFile = useCallback((file: File) => {
    if (dcRef.current?.readyState === 'open') {
      const metadata = { type: 'file_start', sender: localName, name: file.name, size: file.size, fileType: file.type };
      dcRef.current.send(JSON.stringify(metadata));

      const chunkSize = 16384;
      let offset = 0;
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result && dcRef.current) {
          dcRef.current.send(e.target.result as ArrayBuffer);
          offset += chunkSize;
          if (offset < file.size) {
            readSlice(offset);
          } else {
            dcRef.current.send(JSON.stringify({ type: 'file_end', sender: localName }));
            const url = URL.createObjectURL(file);
            setChatMessages(prev => [...prev, { sender: localName, text: `Sent a file: ${file.name}`, timestamp: new Date().toISOString(), isFile: true, fileName: file.name, fileUrl: url }]);
          }
        }
      };

      const readSlice = (o: number) => {
        const slice = file.slice(offset, o + chunkSize);
        reader.readAsArrayBuffer(slice);
      };
      readSlice(0);
    }
  }, [localName]);

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
    isScreenSharing,
    chatMessages,
    telemetry,
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
  };
}
