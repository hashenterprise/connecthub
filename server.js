// server.js (Create this file in your project root)
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
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
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    // Handle private messages
    socket.on('sendMessage', (message) => {
      // Emit to both sender and receiver
      io.to(message.receiverId).emit('receiveMessage', message);
      io.to(message.senderId).emit('messageDelivered', message);
    });

    // Handle typing indicators
    socket.on('typing', ({ senderId, receiverId }) => {
      io.to(receiverId).emit('userTyping', { userId: senderId });
    });

    // Handle online status
    socket.on('setOnlineStatus', ({ userId, status }) => {
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