import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCactoGYTEBZ1ap1SAkjo2iuxgEKdAGI1A",
  authDomain: "vesta-messenger-5337e.firebaseapp.com",
  projectId: "vesta-messenger-5337e",
  storageBucket: "vesta-messenger-5337e.firebasestorage.app",
  messagingSenderId: "590499217282",
  appId: "1:590499217282:web:12bf0d7c30f9dd2f6e199b",
  measurementId: "G-VQ38TVL6XL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();