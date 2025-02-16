'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Link } from 'lucide-react';

const CreateMeeting = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const toast = useToast();

  const [meetingPassword, setMeetingPassword] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateMeetingLink = () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    return `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${randomId}`;
  };

  const handleCreateMeeting = async () => {
    if (!client || !user) return;
    setIsCreating(true);

    try {
      const newMeetingLink = generateMeetingLink();
      const meetingId = newMeetingLink.split('/').pop();

      const newCall = client.call('default', meetingId!);
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          password: meetingPassword,
          created_by: user.id
        },
      });

      setMeetingLink(newMeetingLink);
      toast({
        title: 'Meeting Created Successfully',
        description: 'You can now share the meeting link and password',
      });
    } catch (error) {
      toast({
        title: 'Error creating meeting',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-black/30 border-white/10 backdrop-blur-xl p-8 rounded-2xl">
          <h1 className="text-2xl font-bold text-white mb-6">Create New Meeting</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Meeting Password
              </label>
              <input
                type="password"
                value={meetingPassword}
                onChange={(e) => setMeetingPassword(e.target.value)}
                placeholder="Enter meeting password"
                className="w-full bg-gray-900 border-white/10 rounded-xl p-3 text-white"
                required
              />
            </div>

            <Button
              onClick={handleCreateMeeting}
              disabled={isCreating || !meetingPassword}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-xl"
            >
              {isCreating ? 'Creating Meeting...' : 'Create Meeting'}
            </Button>

            {meetingLink && (
              <div className="mt-6 space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Meeting Link:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({ title: 'Link copied!' });
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-white font-mono text-sm mt-2">{meetingLink}</p>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Password:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(meetingPassword);
                        toast({ title: 'Password copied!' });
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-white font-mono text-sm mt-2">{meetingPassword}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateMeeting;