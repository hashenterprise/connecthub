import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...');
    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already set up');
  }
  res.end();
}