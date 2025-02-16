import { useCallback, useEffect, useState } from 'react';
import { useMeetStore } from '@/store/meet-store';

export function useMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { isMuted, isVideoEnabled, toggleAudio, toggleVideo } = useMeetStore();

  const initializeMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      setStream(mediaStream);
    } catch (error) {
      console.error('Failed to get media devices:', error);
    }
  }, []);

  useEffect(() => {
    initializeMedia();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
      stream.getVideoTracks().forEach(track => track.enabled = isVideoEnabled);
    }
  }, [isMuted, isVideoEnabled, stream]);

  return {
    stream,
    isMuted,
    isVideoEnabled,
    toggleAudio,
    toggleVideo
  };
}
