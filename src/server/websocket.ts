import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Simulate real-time data updates
  const interval = setInterval(() => {
    socket.emit('analytics-update', {
      usersOnline: Math.floor(Math.random() * 100) + 50,
      pageViews: Math.floor(Math.random() * 200) + 100,
    });
  }, 3000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

const PORT = process.env.WEBSOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
}); 