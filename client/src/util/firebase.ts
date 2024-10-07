import { FirebaseError, initializeApp } from "firebase/app";
import {
  UserCredential,
  GoogleAuthProvider,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  verifyPasswordResetCode
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_PROJECT_ID
} from "./config";

const authDomain =
  process.env.NODE_ENV !== "production"
    ? `${VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`
    : window.location.origin;

const defaultAppConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: `${VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID
};
const defaultApp = initializeApp(defaultAppConfig);
const fAuth = getAuth(defaultApp);
const fBlob = getStorage(defaultApp);
const fSignOut = () => signOut(fAuth);

export {
  fAuth,
  fBlob,
  FirebaseError,
  GoogleAuthProvider,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  fSignOut,
  getDownloadURL,
  ref,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile,
  uploadBytesResumable,
  verifyPasswordResetCode
};

export type { UserCredential };
