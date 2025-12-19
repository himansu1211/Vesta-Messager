import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=vesta-messenger-5337e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vesta-messenger-5337e
VITE_FIREBASE_STORAGE_BUCKET=vesta-messenger-5337e.firebasestorage.app
VITE_FIREBASE_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_id
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
