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
    console.log(`✅ users: ${users} with socket: ${socket.id}`);
    console.log(`User registered: ${callerId} -> ${socket.id}`);
  });

  socket.on('offer', ({ targetId, offer, senderId }) => {
    const targetSocketId = users.get(targetId);
    if (targetSocketId) {
      console.log(`✅ Sent offer from ${socket.id} to ${targetSocketId}`);
      io.to(targetSocketId).emit('offer', { offer, senderId: senderId });
    }
  });

  socket.on('answer', ({ targetId, answer }) => {
    const targetSocketId = users.get(targetId);
    console.log('📥 Incoming answer - looking up:', targetId, '=>', targetSocketId);
    if (targetSocketId) {
      console.log(`✅ the answer: ${answer}`);
      io.to(targetSocketId).emit('answer', answer);
    }
    else {
    console.log('❌ Could not find target socket for answer:', targetId);
    }
  });

  socket.on('ice-candidate', ({ targetId, candidate }) => {
    const targetSocketId = users.get(targetId);
    console.log('📥 Sending Ice Candidate:', '=>', targetSocketId, "With: ", candidate);
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