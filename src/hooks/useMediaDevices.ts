import { useState, useEffect, useCallback } from 'react';
import { meetingErrorHandler, MeetingError } from './error-handler';

interface MediaDeviceInfo {
  deviceId: string;
  label: string;
}

interface DeviceQuality {
  video: number;
  audio: number;
}

interface UseMediaDevicesReturn {
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  currentCamera: string | null;
  currentMicrophone: string | null;
  stream: MediaStream | null;
  isLoading: boolean;
  error: MeetingError | null;
  setCamera: (deviceId: string) => Promise<void>;
  setMicrophone: (deviceId: string) => Promise<void>;
  startStream: () => Promise<void>;
  stopStream: () => void;
  checkPermissions: () => Promise<boolean>;
  getDeviceQuality: () => Promise<DeviceQuality>;
}

export const useMediaDevices = (): UseMediaDevicesReturn => {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);
  const [currentMicrophone, setCurrentMicrophone] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<MeetingError | null>(null);

  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoDevs = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${videoDevices.length + 1}`
        }));
      
      const audioDevs = devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${audioDevices.length + 1}`
        }));

      setVideoDevices(videoDevs);
      setAudioDevices(audioDevs);

      // Set default devices if not already set
      if (!currentCamera && videoDevs.length > 0) {
        setCurrentCamera(videoDevs[0].deviceId);
      }
      if (!currentMicrophone && audioDevs.length > 0) {
        setCurrentMicrophone(audioDevs[0].deviceId);
      }
    } catch (err) {
      const handledError = meetingErrorHandler.handleMediaError(err as Error);
      setError(handledError);
    }
  }, [currentCamera, currentMicrophone]);

  const startStream = useCallback(async () => {
    try {
      setIsLoading(true);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: currentCamera ? { deviceId: currentCamera } : true,
        audio: currentMicrophone ? { deviceId: currentMicrophone } : true
      });

      setStream(newStream);
      setError(null);
    } catch (err) {
      const handledError = meetingErrorHandler.handleMediaError(err as Error);
      setError(handledError);
    } finally {
      setIsLoading(false);
    }
  }, [currentCamera, currentMicrophone, stream]);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const setCamera = async (deviceId: string) => {
    setCurrentCamera(deviceId);
    await startStream();
  };

  const setMicrophone = async (deviceId: string) => {
    setCurrentMicrophone(deviceId);
    await startStream();
  };

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  const getDeviceQuality = async () => {
    if (!stream) return { video: 0, audio: 0 };

    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    const videoSettings = videoTrack?.getSettings();
    const audioSettings = audioTrack?.getSettings();

    // Calculate quality scores (0-100)
    const videoQuality = videoSettings ? 
      Math.min(100, ((videoSettings.width || 0) * (videoSettings.height || 0)) / (1920 * 1080) * 100) : 
      0;

    const audioQuality = audioSettings?.sampleRate ? 
      Math.min(100, (audioSettings.sampleRate / 48000) * 100) : 
      0;

    return {
      video: Math.round(videoQuality),
      audio: Math.round(audioQuality)
    };
  };

  useEffect(() => {
    enumerateDevices();
    navigator.mediaDevices.addEventListener('devicechange', enumerateDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', enumerateDevices);
      stopStream();
    };
  }, [enumerateDevices, stopStream]);

  return {
    videoDevices,
    audioDevices,
    currentCamera,
    currentMicrophone,
    stream,
    isLoading,
    error,
    setCamera,
    setMicrophone,
    startStream,
    stopStream,
    checkPermissions,
    getDeviceQuality
  };
};