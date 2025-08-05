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
    users.set(callerId, { socketId: socket.id, userDetails: userDetails});
    switch(userDetails.userGender){
      case "Male":
        maleUsers.set(callerId, { socketId: socket.id, userDetails: userDetails});
        break; 

      case "Female":
        femaleUsers.set(callerId, { socketId: socket.id, userDetails: userDetails}); 
        break;

      case "Other":
        otherUsers.set(callerId, { socketId: socket.id, userDetails: userDetails}); 
        break;
    }
    // console.log(maleUsers, femaleUsers, otherUsers);
    console.log(`User registered: ${callerId} -> ${socket.id}`);
    console.log(`Amount of users: ${users.size}`);

    let targeUser = null;
    switch(userDetails.userPref.preferredPartner){
      case "Male":
        targeUser = GetBestUser(maleUsers, userDetails)
        break 
      
      case "Female":
        targeUser = GetBestUser(femaleUsers, userDetails) 
        break

      case "Other":
        targeUser = GetBestUser(otherUsers, userDetails) 
        break
    }
    console.log(targeUser);
    
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
      console.log(`✅ Sent offer from ${socket.id} to ${targetSocketId.socketId}`);
      io.to(targetSocketId.socketId).emit('offer', { offer, senderId: senderId });
    }
  });

  socket.on('answer', ({ targetId, answer }) => {
    const targetSocketId = users.get(targetId);
    console.log('📥 Incoming answer - looking up:', targetId, '=>', targetSocketId.socketId);
    if (targetSocketId) {
      console.log(`✅ the answer: ${answer}`);
      io.to(targetSocketId.socketId).emit('answer', answer);
    }
    else {
    console.log('❌ Could not find target socket for answer:', targetId);
    }
  });

  socket.on('ice-candidate', ({ targetId, candidate }) => {
    const targetSocketId = users.get(targetId);
    // console.log("targetSocketID:",targetSocketId);
    
    // console.log('📥  Ice CandidaSendingte:', '=>', targetSocketId, "With: ", candidate);
    if (targetSocketId.socketId) {
      io.to(targetSocketId.socketId).emit('ice-candidate', {candidate});
    }
    
  });

  socket.on('disconnect', () => {
    for (const [callerId, details] of users.entries()) {
      if (details.socketId === socket.id) {
        users.delete(callerId);
        break;
      }
    }
    for (const [callerId, details] of maleUsers.entries()) {
      if (details.socketId === socket.id) {
        maleUsers.delete(callerId);
        break;
      }
    }
    for (const [callerId, details] of femaleUsers.entries()) {
      if (details.socketId === socket.id) {
        femaleUsers.delete(callerId);
        break;
      }
    }
    for (const [callerId, details] of otherUsers.entries()) {
      if (details.socketId === socket.id) {
        otherUsers.delete(callerId);
        break;
      }
    } 
    
    console.log('Client disconnected:', socket.id);
    console.log(`Amount of users: ${users.size}`);
  });
})

function GetBestUser(userType, user) {
  let bestUser = null;

  userType.forEach((entry, callerId) => {
    // console.log(entry);
    const { socketId, userDetails } = entry;
    if(user.userPref.userId == userDetails.userPref.userId ){
      return;
    }

    if(userDetails.userPref.preferredPartner == user.userGender){
      console.log("Pass GENDER");
        // Check age and distance
      if (user.userPref.minAgePreference <= userDetails.userAge, user.userPref.maxAgePreference >= userDetails.userAge,
        userDetails.userPref.minAgePreference <= user.userAge ,userDetails.userPref.maxAgePreference >= user.userAge) {
          console.log("Pass AGE");
          const distance = getDistanceBetweenUsers(user, userDetails)
          console.log(distance);
          
          if(user.userPref.preferredDistanceKm >= distance && userDetails.userPref.preferredDistanceKm >= distance){
            console.log("Pass DISTANCE");

            // Count common likes
            let commonCount = 0;
            const set1 = new Set(user.interests);
            const set2 = new Set(userDetails.interests);
            console.log(set1,set2 );
            for (let item of set1) {
              if (set2.has(item)) {
                // console.log(commonCount);
                commonCount++;
              }
            }

            // Update bestUser if this one is better
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