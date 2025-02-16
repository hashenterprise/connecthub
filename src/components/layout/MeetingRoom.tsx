'use client';

import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';
import { ExtendedCall } from '@/types/ExtendedCall';
import { CallLayoutType } from '@/types/CallLayoutType';

interface MeetingRoomProps {
  call: ExtendedCall;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ call }) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>(CallLayoutType.SPEAKER_LEFT);
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case CallLayoutType.GRID:
        return <PaginatedGridLayout participantsBarPosition="bottom" />;
      case CallLayoutType.SPEAKER_RIGHT:
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <SpeakerLayout participantsBarPosition="left" />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-dark-2">
      <div className="relative flex h-full flex-1">
        {/* Participants list sidebar */}
        <div
          className={cn(
            'absolute left-0 top-0 z-50 h-full w-[300px] bg-dark-2 transition-transform lg:static',
            showParticipants ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>

        {/* Main video area */}
        <div className="relative flex-1">
          <CallLayout />

          {/* Call controls */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-4">
              <CallControls />
              <CallStatsButton />
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl bg-dark-1 p-2.5 hover:bg-dark-3">
                    <LayoutList className="size-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() =>
                        setLayout(item.toLowerCase().replace('-', '_') as CallLayoutType)
                      }
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => setShowParticipants((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-dark-1 p-2.5 hover:bg-dark-3 lg:hidden"
              >
                <Users className="size-6" />
              </button>

              {!isPersonalRoom && (
                <EndCallButton
                  onClick={() => {
                    call.leave();
                    router.push(`/`);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;