import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Handle redirect result on page load (in case popup failed and we used redirect)
getRedirectResult(auth).catch((error) => {
  console.error('Redirect sign-in error:', error);
});

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the login popup');
      return null;
    }
    // If popup was blocked or failed, fall back to redirect
    if (error.code === 'auth/popup-blocked' || 
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/internal-error') {
      console.log('Popup blocked, falling back to redirect...');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error('Error signing in with Google:', error);
    throw error;
  }
};
