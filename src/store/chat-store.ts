import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  fetchMessages: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setMessages: (messages) => set({ messages }),
  fetchMessages: async (chatId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const data = await response.json();
      set({ messages: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch messages', isLoading: false });
    }
  }
}));