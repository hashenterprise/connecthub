import { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button } from '../ui/button';
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from 'lucide-react';

interface ShortPlayerProps {
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
}

export function ShortPlayer({ videoUrl, caption, likes, comments }: ShortPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div ref={ref} className="relative h-[calc(100vh-80px)] w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white mb-4">{caption}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
            </Button>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button variant="ghost" size="icon">
              <Heart className="text-white" />
              <span className="text-white text-sm">{likes}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="text-white" />
              <span className="text-white text-sm">{comments}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}