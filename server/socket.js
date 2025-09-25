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
      // console.log(userDetails);
      
      users.delete(targetId);
      usersInCall.set(targeUser.callerId, {socketId: targeUser.socketId, userDetails: targeUser.user, ready: false})
      usersInCall.set(callerId, { socketId: socket.id, userDetails: userDetails, ready: false})
      console.log(`Amount of users: ${usersInCall.size}`);
      console.log(`Amount of usersInCall: ${usersInCall.size}`);
      // console.log(usersInCall);

      console.log(`🚀 Triggering offer from ${initiatorId} to ${targetId}`);

      io.to(initiatorSocketId).emit('found-partner', {
        targetId: targetId,
        targetSocketId: targeUser.socketId,
        targetUserId: targeUser.user.userId
      });
      io.to(targeUser.socketId).emit('found-partner', {
        targetId: callerId,
        targetSocketId: initiatorSocketId,
        targetUserId: userDetails.userId
      });
    }
    else{
      users.set(callerId, { socketId: socket.id, userDetails: userDetails});
    }
    console.log(`Amount of users: ${users.size}`);
    console.log(`Amount of usersInCall: ${usersInCall.size}`);
    
  });

  socket.on('check-ready', ({ senderId, targetId}) => {
    // console.log(senderId);
    const sender = usersInCall.get(senderId);
    const target = usersInCall.get(targetId);

    if (sender) {
      sender.ready = true
      // console.log(sender.socketId);
      if(target.ready == true){
        io.to(sender.socketId).emit('initiate-offer', {});
      }
    }
  });

  socket.on('not-ready', ({senderId, targetId}) => {
    console.log(targetId);
    const target = usersInCall.get(targetId);
    usersInCall.delete(targetId);
    usersInCall.delete(senderId);
    users.set(targetId, target);

    io.to(target.socketId).emit('not-ready', {});

  });

  socket.on('offer', ({ targetSocketId, offer,}) => {

    if (targetSocketId) {
      console.log(`✅ Sent offer from ${socket.id} to ${targetSocketId}`);
      io.to(targetSocketId).emit('offer', { offer,});
    }
  });

  socket.on('answer', ({ targetSocketId, answer }) => {

    console.log('📥 Incoming answer - looking up:', '=>', targetSocketId);
    if (targetSocketId) {
      // console.log(`✅ the answer: ${answer}`);
      io.to(targetSocketId).emit('answer', answer,);
    }
    else {
    console.log('❌ Could not find target socket for answer:', targetSocketId);
    }
  });

  socket.on("start-call", ({ targetSocketId, startTimestamp }) => {

    if (targetSocketId) {
      io.to(targetSocketId).emit("start-call", { startTimestamp });
    }
  });

  socket.on('ice-candidate', ({ targetSocketId, candidate }) => {

    if (targetSocketId) {
      io.to(targetSocketId).emit('ice-candidate', {candidate});
    }
    
  });

  socket.on('like', ({ targetSocketId,}) => {
    // const target = usersInCall.get(targetId);
    // console.log(targetId, senderId);
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('liked');
    }
  });

  socket.on('dislike', ({ targetSocketId }) => {
    // const target = usersInCall.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('disliked');
    }
  });

  socket.on('like-response', ({ targetSocketId, response }) => {
    // const target = usersInCall.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('like-response', {response});
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