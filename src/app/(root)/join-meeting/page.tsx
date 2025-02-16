'use client';

import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Video, VideoOff, Mic, MicOff, Loader2 } from 'lucide-react';
import { ExtendedCall } from '@/types/ExtendedCall';

const backgrounds = [
  { id: 'none', name: 'None', gradient: 'from-gray-500 to-gray-600' },
  { id: 'blur', name: 'Blur', gradient: 'from-blue-500 to-purple-600' },
  { id: 'office', name: 'Office', gradient: 'from-green-500 to-emerald-600' },
  { id: 'library', name: 'Library', gradient: 'from-orange-500 to-red-600' }
];

const JoinMeeting = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { addToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [meetingLink, setMeetingLink] = useState('');
  const [password, setPassword] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (selectedBackground !== 'none' && selectedBackground !== 'blur') {
      const img = new Image();
      img.src = `/backgrounds/${selectedBackground}.jpg`;
      img.onload = () => setBackgroundImage(img);
    } else {
      setBackgroundImage(null);
    }
  }, [selectedBackground]);

  const applyVideoEffect = (inputStream: MediaStream) => {
    if (!canvasRef.current || !videoRef.current) return inputStream;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return inputStream;

    const processFrame = () => {
      if (!videoRef.current) return;
      
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      if (selectedBackground === 'blur') {
        // Apply blur effect
        ctx.filter = 'blur(10px)';
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
      } else if (backgroundImage && selectedBackground !== 'none') {
        // Apply custom background
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }
      
      requestAnimationFrame(processFrame);
    };

    processFrame();
    return canvas.captureStream();
  };

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      const processedStream = applyVideoEffect(mediaStream);
      setStream(processedStream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      addToast({
        title: 'Camera Access Error',
        description: 'Unable to access camera and microphone',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    startVideo();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleJoinMeeting = async () => {
    setIsJoining(true);
    try {
      // Extract meeting ID from the link
      const meetingId = meetingLink.split('/').pop();
      
      if (!client || !user || !meetingId) {
        throw new Error('Missing required information');
      }

      // Create and join the call
      const call = client.call('default', meetingId) as ExtendedCall;
      await call.getOrCreate();
      
      await call.join({ 
        camera: isVideoOn, 
        microphone: isAudioOn,
        customVideoStream: stream
      });

      // Navigate to meeting room
      router.push(`/meeting/${meetingId}`);
    } catch (error: any) {
      addToast({
        title: 'Error joining meeting',
        description: error.message || 'Failed to join meeting',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-5xl mx-auto p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Video Preview */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
            <div className="aspect-video relative rounded-2xl overflow-hidden bg-gray-900/80">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoOn ? '' : 'hidden'}`}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: selectedBackground !== 'none' ? 'block' : 'none' }}
              />
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
                  <Camera className="h-20 w-20 text-gray-400 animate-pulse" />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center space-x-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`rounded-2xl transition-all duration-300 ${
                  !isVideoOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'hover:bg-white/10'
                }`}
              >
                {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`rounded-2xl transition-all duration-300 ${
                  !isAudioOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'hover:bg-white/10'
                }`}
              >
                {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </Button>
            </div>

            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-200 mb-4">
                Background Effect
              </label>
              <div className="grid grid-cols-4 gap-3">
                {backgrounds.map((bg) => (
                  <Button
                    key={bg.id}
                    variant={selectedBackground === bg.id ? 'default' : 'ghost'}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`text-sm py-6 rounded-xl transition-all duration-300 ${
                      selectedBackground === bg.id 
                        ? `bg-gradient-to-r ${bg.gradient}`
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {bg.name}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Join Form */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Join Meeting
            </h1>
            
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-gray-200 mb-3">
                  Meeting Link
                </label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Enter meeting link"
                  className="w-full bg-gray-900/60 border-white/10 rounded-xl p-4 text-white text-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-200 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter meeting password"
                  className="w-full bg-gray-900/60 border-white/10 rounded-xl p-4 text-white text-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button
                onClick={handleJoinMeeting}
                disabled={isJoining || !meetingLink || !password}
                className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isJoining ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Joining...</span>
                  </div>
                ) : (
                  'Join Meeting'
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting;