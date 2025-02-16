import { create } from 'zustand';

interface MeetState {
  activeRoom: string | null;
  participants: any[];
  isMuted: boolean;
  isVideoEnabled: boolean;
  setActiveRoom: (roomId: string | null) => void;
  setParticipants: (participants: any[]) => void;
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
