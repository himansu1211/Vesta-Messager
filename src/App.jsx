import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, googleProvider } from './firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import ChatMain from './components/ChatMain';
import LoadingSpinner from './components/LoadingSpinner';
import WelcomePage from './components/WelcomePage';

function App() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      // Create user profile in Firestore
      const userRef = doc(db, "users", user.email);
      setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    }
  }, [user]);

  const handleLogin = () => signInWithPopup(auth, googleProvider);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {user ? <ChatMain user={user} /> : <WelcomePage />}
    </div>
  );
}

export default App;
