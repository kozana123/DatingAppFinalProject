import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  // ... other config values
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };