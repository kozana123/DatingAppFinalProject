// firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore';
import { collection, doc, setDoc, getDocs, orderBy, query, addDoc, serverTimestamp, onSnapshot, deleteDoc, limit  } from "firebase/firestore";


// const firebaseConfig = {
//   apiKey: "AIzaSyD1q0YiEoLM1_IfF94Lx9aqKb0H8gT2laY",
//   authDomain: "datingapppro-56b0f.firebaseapp.com",
//   projectId: "datingapppro-56b0f",
//   storageBucket: "datingapppro-56b0f.firebasestorage.app",
//   messagingSenderId: "547809912482",
//   appId: "1:547809912482:web:b7b30e2b7f714c25b859fb",
//   measurementId: "G-51QY924BFX"
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);

const db = firestore();

export async function createChat() {
  try {
    // Create a new doc with random ID inside "chats"
    // const newChatRef = doc(collection(db, "chats"));
    const newChatRef = db.collection('chats').doc();
    // Just create it empty
    await newChatRef.set({});

    console.log("Chat created with ID:", newChatRef.id);

    return newChatRef.id; // return the unique ID
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export async function addMessage(chatId, senderId, text) {
  try {
    const messagesRef = db.collection('chats').doc(chatId).collection('messages');

    const docRef = await messagesRef.add({
      senderId,
      text,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log("Message added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

export const listenToMessages = (chatId, callback) => {

  const messagesRef = db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc'); // messages in order

  // Real-time listener
  const unsubscribe = messagesRef.onSnapshot(snapshot => {
    const msgs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        text: data.text,
      };
    });
    callback(msgs);
  });

  return unsubscribe; // allows caller to unsubscribe when needed
};

export async function deleteChat(chatId) {
  try {
    // Step 1: delete all messages in subcollection
    const messagesRef = db.collection('chats').doc(chatId).collection('messages');

    const messagesSnapshot = await messagesRef.get();
    console.log(`try to delete Chat ${messagesSnapshot}`);

    const deletePromises = messagesSnapshot.docs.map(doc => doc.ref.delete());

    await Promise.all(deletePromises);

    // Step 2: delete the chat document
    const chatRef = db.collection('chats').doc(chatId);
    await chatRef.delete();

    console.log(`Chat ${chatId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}

export async function getLastMessage(chatId) {
  try {

    const messagesRef = db.collection('chats').doc(chatId).collection('messages');
    const querySnapshot = await messagesRef.orderBy('createdAt', 'desc').limit(1).get();

    // const chatDocRef = doc(db, "chats", chatId);
    // const messagesRef = collection(chatDocRef, "messages");
    // const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

    // const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // no messages yet
    }

    const lastMessageDoc = querySnapshot.docs[0];
    const data = lastMessageDoc.data();

    return {
      text: data.text,
      senderId: data.senderId,
      timeAgo: formatTimeAgo(data.createdAt),
    };
  } catch (error) {
    console.error("Error fetching last message:", error);
    throw error;
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";

  const now = new Date();
  const messageDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = now - messageDate;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMinutes < 1) return `Now`;
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} h ago`;
  return `${diffDays} d ago`;
}
