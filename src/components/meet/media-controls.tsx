import { useState } from 'react';
import { Button } from '../ui/button';
import { useMedia } from '@/hooks/use-media';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';

export function MediaControls() {
  const {
    toggleVideo,
    toggleAudio,
    isVideoEnabled,
    isAudioEnabled,
    leaveCall,
  } = useMedia();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center gap-4 bg-gray-900/80">
      <Button
        onClick={toggleVideo}
        variant={isVideoEnabled ? 'default' : 'destructive'}
      >
        {isVideoEnabled ? <Video /> : <VideoOff />}
      </Button>
      <Button
        onClick={toggleAudio}
        variant={isAudioEnabled ? 'default' : 'destructive'}
      >
        {isAudioEnabled ? <Mic /> : <MicOff />}
      </Button>
      <Button onClick={leaveCall} variant="destructive">
        <PhoneOff />
      </Button>
    </div>
  );
}