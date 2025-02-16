import { create } from 'zustand';

interface UserState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  updateUser: (data: Partial<any>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
  logout: () => set({ user: null })
}));
