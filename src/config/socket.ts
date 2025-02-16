export const socketConfig = {
    url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
    options: {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    }
  };