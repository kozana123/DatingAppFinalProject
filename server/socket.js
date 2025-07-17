import { Server } from 'socket.io';

let io = null;

export function initIO(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // change if needed
      methods: ['GET', 'POST']
    }
  });

  const users = new Map(); // Map<callerId, socketId>

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register', (callerId) => {
    users.set(callerId, socket.id);
    console.log(`User registered: ${callerId} -> ${socket.id}`);
  });

  socket.on('offer', ({ targetId, offer }) => {
    const targetSocketId = users.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('offer', offer);
    }
    console.log(`User Offer: `);
  });

  socket.on('answer', ({ targetId, answer }) => {
    const targetSocketId = users.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('answer', answer);
    }
  });

  socket.on('ice-candidate', ({ targetId, candidate }) => {
    const targetSocketId = users.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice-candidate', {candidate});
    }
  });

  socket.on('disconnect', () => {
    for (const [callerId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(callerId);
        break;
      }
    }
    console.log('Client disconnected:', socket.id);
  });
})

}