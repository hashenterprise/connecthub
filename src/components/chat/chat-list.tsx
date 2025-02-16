import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat-store';
import { ChatMessage } from './chat-message';
import { useSocket } from '@/hooks/use-socket';

export function ChatList({ chatId }: { chatId: string }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage } = useChatStore();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('new_message', (message) => {
        addMessage(message);
      });
    }
    return () => {
      socket?.off('new_message');
    };
  }, [socket, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
