// server.ts (Create this file in your project root)
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Create Socket.io server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  // Socket.io event handlers
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle user joining
    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    // Handle private messages
    socket.on('sendMessage', (message: {
      content: string;
      senderId: string;
      receiverId: string;
    }) => {
      // Emit to both sender and receiver
      io.to(message.receiverId).emit('receiveMessage', message);
      io.to(message.senderId).emit('messageDelivered', message);
    });

    // Handle typing indicators
    socket.on('typing', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      io.to(receiverId).emit('userTyping', { userId: senderId });
    });

    // Handle online status
    socket.on('setOnlineStatus', ({ userId, status }: { userId: string; status: boolean }) => {
      io.emit('userStatusUpdate', { userId, status });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Server listening on port ${PORT}`);
  });
});

// hooks/use-socket.ts (Updated version)
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/providers/auth-provider';

interface UseSocketReturn {
  socket: Socket | null;
  sendMessage: (message: any) => void;
  startTyping: (receiverId: string) => void;
  setOnlineStatus: (status: boolean) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { session } = useAuth();
  const userId = session?.user?.id;

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const socketInstance = io(socketUrl, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      auth: {
        userId
      }
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      if (userId) {
        socketInstance.emit('join', userId);
        socketInstance.emit('setOnlineStatus', { userId, status: true });
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    return () => {
      if (userId) {
        socketInstance.emit('setOnlineStatus', { userId, status: false });
      }
      socketInstance.disconnect();
    };
  }, [userId]);

  const sendMessage = useCallback((message: any) => {
    if (socket && message) {
      socket.emit('sendMessage', message);
    }
  }, [socket]);

  const startTyping = useCallback((receiverId: string) => {
    if (socket && userId) {
      socket.emit('typing', { senderId: userId, receiverId });
    }
  }, [socket, userId]);

  const setOnlineStatus = useCallback((status: boolean) => {
    if (socket && userId) {
      socket.emit('setOnlineStatus', { userId, status });
    }
  }, [socket, userId]);

  return { socket, sendMessage, startTyping, setOnlineStatus };
};

// Required updates for package.json
{
  "scripts": {
    "dev": "node server.ts",
    "build": "next build",
    "start": "NODE_ENV=production node server.ts"
  },
  "dependencies": {
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2"
  }
}