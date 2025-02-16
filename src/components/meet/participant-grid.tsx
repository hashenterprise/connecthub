import { useEffect, useRef } from 'react';
import { useWebRTC } from '@/hooks/use-webrtc';
import { VideoPlayer } from './video-player';

export function ParticipantGrid({ roomId }: { roomId: string }) {
  const {
    localStream,
    remoteStreams,
    joinRoom,
    leaveRoom,
  } = useWebRTC();

  useEffect(() => {
    joinRoom(roomId);
    return () => leaveRoom();
  }, [roomId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {localStream && (
        <VideoPlayer stream={localStream} isMuted isLocal />
      )}
      {remoteStreams.map((stream) => (
        <VideoPlayer
          key={stream.id}
          stream={stream}
          isMuted={false}
        />
      ))}
    </div>
  );
}