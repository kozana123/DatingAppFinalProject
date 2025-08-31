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
  const usersInCall = new Map(); 

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register', (callerId, userDetails) => {
    console.log(`User registered: ${callerId} -> ${socket.id}`);

    let targeUser = null;

    targeUser = GetBestUser(userDetails)
    // console.log(targeUser);

    if (targeUser) {
      const targetId = targeUser.callerId;
      const initiatorId = callerId;
      const initiatorSocketId = socket.id;

      users.delete(targetId);
      usersInCall.set(targeUser.callerId, {socketId: targeUser.socketId, userDetails: targeUser.user})
      usersInCall.set(callerId, { socketId: socket.id, userDetails: userDetails})
      console.log(`Amount of users: ${usersInCall.size}`);
      console.log(usersInCall);

      console.log(`🚀 Triggering offer from ${initiatorId} to ${targetId}`);
      io.to(initiatorSocketId).emit('initiate-offer', {
        targetId: targetId,
        senderId: initiatorId
      });
    }
    else{
      users.set(callerId, { socketId: socket.id, userDetails: userDetails});
    }
    console.log(`Amount of users: ${users.size}`);
    
  });

  socket.on('offer', ({ targetId, offer, senderId }) => {
    const targetSocketId = usersInCall.get(targetId);

    console.log("getting OFFER");
    
    if (targetSocketId) {
      console.log(`✅ Sent offer from ${socket.id} to ${targetSocketId.socketId}`);
      io.to(targetSocketId.socketId).emit('offer', { offer, senderId: senderId });
    }
  });

  socket.on('answer', ({ targetId, answer }) => {
    const targetSocketId = usersInCall.get(targetId);
    console.log('📥 Incoming answer - looking up:', targetId, '=>', targetSocketId.socketId);
    if (targetSocketId) {
      // console.log(`✅ the answer: ${answer}`);
      io.to(targetSocketId.socketId).emit('answer', answer);
    }
    else {
    console.log('❌ Could not find target socket for answer:', targetId);
    }
  });

  socket.on("start-call", ({ targetId, startTimestamp }) => {
    const targetSocketId = usersInCall.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId.socketId).emit("start-call", { startTimestamp });
    }
  });

  socket.on('ice-candidate', ({ targetId, candidate }) => {
    const targetSocketId = usersInCall.get(targetId);

    // console.log("targetSocketID:",targetSocketId);
    // console.log('📥  Ice CandidaSendingte:', '=>', targetSocketId, "With: ", candidate);
    if (targetSocketId.socketId) {
      io.to(targetSocketId.socketId).emit('ice-candidate', {candidate});
    }
    
  });

  socket.on('like', ({ targetId, senderId }) => {
    const target = usersInCall.get(targetId);
    console.log(targetId, senderId);
    
    if (target) {
      io.to(target.socketId).emit('liked', senderId);
    }
  });

  socket.on('dislike', ({ targetId }) => {
    const target = usersInCall.get(targetId);
    if (target) {
      io.to(target.socketId).emit('disliked');
    }
  });

  socket.on('like-response', ({ targetId, response }) => {
    const target = usersInCall.get(targetId);
    
    if (target) {
      io.to(target.socketId).emit('like-response', { response});
    }
  });

  socket.on('disconnect', () => {
    for (const [callerId, details] of users.entries()) {
      if (details.socketId === socket.id) {
        users.delete(callerId);
        break;
      }
    }

    for (const [callerId, details] of usersInCall.entries()) {
      if (details.socketId === socket.id) {
        usersInCall.delete(callerId);
        break;
      }
    }
    
    console.log('Client disconnected:', socket.id);
    console.log(`Amount of users: ${users.size}`);
    console.log(`Amount of usersInCall: ${usersInCall.size}`);

  });
})

function GetBestUser(user) {
  let bestUser = null;
  const usersFillteredList = new Map();

  users.forEach((entry, callerId) => {
    const { userDetails } = entry;
    if(user.userPref.preferredPartner == userDetails.userGender){
      usersFillteredList.set(callerId, entry)
    }
  })
  
  usersFillteredList.forEach((entry, callerId) => {
    const { socketId, userDetails } = entry;
    if(user.userPref.userId == userDetails.userPref.userId ){
      return;
    }

    if(userDetails.userPref.preferredPartner == user.userGender){
      // console.log("Pass GENDER");
      console.log("Pass AGE: " + user.userAge + " " +  userDetails.userAge);

      if (user.userPref.minAgePreference <= userDetails.userAge &&
        user.userPref.maxAgePreference >= userDetails.userAge &&
        userDetails.userPref.minAgePreference <= user.userAge &&
        userDetails.userPref.maxAgePreference >= user.userAge) 
      {
        const distance = getDistanceBetweenUsers(user, userDetails)
        // console.log(distance);
        
        if(user.userPref.preferredDistanceKm >= distance && userDetails.userPref.preferredDistanceKm >= distance){
          // console.log("Pass DISTANCE");

          let commonCount = 0;
          const set1 = new Set(user.interests);
          const set2 = new Set(userDetails.interests);
          // console.log(set1,set2 );
          for (let item of set1) {
            if (set2.has(item)) {
              commonCount++;
            }
          }

          if (!bestUser || commonCount > bestUser.same) {
            bestUser = {
              callerId: callerId,
              socketId: socketId,
              user: userDetails,
              same: commonCount
            };
          }
        }
      }
    }
   
  });
  return bestUser; // includes user, socketId, and callerId
}

function getDistanceBetweenUsers(user1, user2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const lat1 = user1.latitude;
  const lon1 = user1.longitude;
  const lat2 = user2.latitude;
  const lon2 = user2.longitude;

  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance; // in kilometers
}

}