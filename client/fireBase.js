// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDocs, orderBy, query, addDoc, serverTimestamp, onSnapshot, deleteDoc, limit  } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD1q0YiEoLM1_IfF94Lx9aqKb0H8gT2laY",
  authDomain: "datingapppro-56b0f.firebaseapp.com",
  projectId: "datingapppro-56b0f",
  storageBucket: "datingapppro-56b0f.firebasestorage.app",
  messagingSenderId: "547809912482",
  appId: "1:547809912482:web:b7b30e2b7f714c25b859fb",
  measurementId: "G-51QY924BFX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


export async function createChat() {
  try {
    // Create a new doc with random ID inside "chats"
    const newChatRef = doc(collection(db, "chats"));

    // Just create it empty
    await setDoc(newChatRef, {});

    console.log("Chat created with ID:", newChatRef.id);

    return newChatRef.id; // return the unique ID
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

// export async function getMessages(chatId) {
//   try {
//     const messagesRef = collection(db, "chats", chatId, "messages");
//     const q = query(messagesRef, orderBy("createdAt", "asc"));

//     const querySnapshot = await getDocs(q);

//     const messages = querySnapshot.docs.map(doc => {
//       const data = doc.data();
//       console.log(data);
      
//       return {
//         senderId: data.senderId,
//         text: data.text,
//       };
//     });

//     return messages; // array of messages
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     throw error;
//   }
// }

export async function addMessage(chatId, senderId, text) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");

    const docRef = await addDoc(messagesRef, {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });

    console.log("Message added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

export const listenToMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc") // messages in order
  );

  // Real-time listener
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, 
        senderId: data.senderId,
        text: data.text,
      };
    });
    callback(msgs);
  });
};

export async function deleteChat(chatId) {
  try {
    // Step 1: delete all messages in subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesSnapshot = await getDocs(messagesRef);
    console.log(`try to delete Chat ${messagesSnapshot}`);

    const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
      deleteDoc(messageDoc.ref)
    );

    await Promise.all(deletePromises);

    // Step 2: delete the chat document
    const chatRef = doc(db, "chats", chatId);
    await deleteDoc(chatRef);

    console.log(`Chat ${chatId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting chat:", error);
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

export async function getLastMessage(chatId) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

    const querySnapshot = await getDocs(q);

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