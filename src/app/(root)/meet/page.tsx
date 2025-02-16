'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Mic, MicOff, Video, VideoOff, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useTheme } from 'next-themes';

const MeetingInterface = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();
  const {
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
  } = useMediaDevices();
  
  const [participants, setParticipants] = useState([
    { id: 1, name: 'You', isHost: true },
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const meetingId = user?.id;
  const meetingLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}`;

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await checkPermissions();
        await startStream();
      } catch (error) {
        console.error('Error accessing media devices:', error);
        addToast({
          title: 'Permission Denied',
          description: 'Unable to access camera and microphone',
          variant: 'destructive',
        });
      }
    };

    requestPermissions();

    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to Meeting Room</h1>
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create Meeting Card */}
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Create a Meeting</h2>
            <p className="text-gray-400 mb-6">Start a new meeting and invite others to join</p>
            <Link href="/create-meeting">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Create New Meeting
              </Button>
            </Link>
          </Card>

          {/* Join Meeting Card */}
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Join a Meeting</h2>
            <p className="text-gray-400 mb-6">Join an existing meeting with a link and password</p>
            <Link href="/join-meeting">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Join Meeting
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Meetings */}
        <Card className="bg-black/30 border-white/10 backdrop-blur-xl p-8 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Your Personal Meeting Room</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Meeting ID:</span>
              <span className="font-mono">{meetingId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Invite Link:</span>
              <span className="font-mono">{meetingLinkUrl}</span>
            </div>
            <Button
              className="bg-black/30 backdrop-blur-xl hover:bg-white/10"
              onClick={() => {
                navigator.clipboard.writeText(meetingLinkUrl);
                addToast({
                  title: 'Link Copied',
                });
              }}
            >
              Copy Personal Meeting Link
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MeetingInterface;