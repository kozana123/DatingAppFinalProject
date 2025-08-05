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
  const maleUsers = new Map();
  const femaleUsers = new Map();  
  const otherUsers = new Map();  


io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register-test', (callerId, userDetails) => {
    switch(userDetails.gender){
      case "male":
        maleUsers.set(callerId, { socketId: socket.id, userDetails: userDetails});
        break 

      case "female":
        femaleUsers.set(callerId, { socketId: socket.id, userDetails: userDetails}); 
        break

      case "other":
        otherUsers.set(callerId, { socketId: socket.id, userDetails: userDetails}); 
        break
    }

    console.log(`User registered: ${callerId} -> ${socket.id}`);
    console.log(`Amount of users: ${users.size}`);

    const targeUser = null;
    switch(userDetails.genderPref){
      case "male":
        targeUser = GetBestUser(maleUsers, userDetails)
        break 
      
      case "female":
        targeUser = GetBestUser(femaleUsers, userDetails) 
        break

      case "other":
        targeUser = GetBestUser(otherUsers, userDetails) 
        break
    }

    if (targeUser) {
      const targetId = targeUser.callerId;
      const initiatorId = callerId;
      const initiatorSocketId = socket.id;

      console.log(`🚀 Triggering offer from ${initiatorId} to ${targetId}`);
      io.to(initiatorSocketId).emit('initiate-offer', {
        targetId: targetId,
        senderId: initiatorId
      });
    }
  });

  socket.on('register', (callerId) => {
    users.set(callerId, socket.id);
    console.log(`User registered: ${callerId} -> ${socket.id}`);
    console.log(`Amount of users: ${users.size}`);

    if (users.size >= 2) {
    const [initiatorId, initiatorSocketId] = [...users.entries()][0];
    const [targetId, targetSocketId] = [...users.entries()][1];

    console.log(`🚀 Triggering offer from ${initiatorId} to ${targetId}`);
    io.to(initiatorSocketId).emit('initiate-offer', {
      targetId: targetId,
      senderId: initiatorId
    });
  }
  });

  socket.on('offer', ({ targetId, offer, senderId }) => {
    const targetSocketId = users.get(targetId);
    console.log("getting OFFER");
    
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
    console.log(`Amount of users: ${users.size}`);
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

function GetBestUser(userType, userDetails) {
  let bestUser = null;

  userType.forEach((entry, callerId) => {
    const { socketId, otherUserDetails } = entry;

    // Check age and distance
    if (user.age >= age.min && user.age <= age.max && user.distance <= distance) {
      // Count common likes
      let commonCount = 0;
      const set1 = new Set(preferenceLikes);
      const set2 = new Set(likes);

      for (let item of set1) {
        if (set2.has(item)) {
          commonCount++;
        }
      }

      // Update bestUser if this one is better
      if (!bestUser || commonCount > bestUser.same) {
        bestUser = {
          callerId: callerId,
          socketId: socketId,
          user: user,
          same: commonCount
        };
      }
    }
  });
  return bestUser; // includes user, socketId, and callerId
}

}