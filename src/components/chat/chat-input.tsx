import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSocket } from '@/hooks/use-socket';

export function ChatInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState('');
  const { socket } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket?.emit('send_message', {
      chatId,
      content: message,
      timestamp: new Date().toISOString(),
    });

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
Last edited 16 minutes ago