import { create } from 'zustand';

interface Participant {
  id: string;
  name: string;
  // Add other participant properties as needed
}

interface MeetState {
  activeRoom: string | null;
  participants: Participant[];
  isMuted: boolean;
  isVideoEnabled: boolean;
  setActiveRoom: (roomId: string | null) => void;
  setParticipants: (participants: Participant[]) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

export const useMeetStore = create<MeetState>((set) => ({
  activeRoom: null,
  participants: [],
  isMuted: false,
  isVideoEnabled: true,
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  setParticipants: (participants) => set({ participants }),
  toggleAudio: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoEnabled: !state.isVideoEnabled }))
}));