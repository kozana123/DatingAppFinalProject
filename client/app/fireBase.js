// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 


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
