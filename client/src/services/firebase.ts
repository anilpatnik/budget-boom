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
} from "@/utils/configs";

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
const firebaseAuth = getAuth(defaultApp);
const firebaseBlob = getStorage(defaultApp);
const firebaseSignOut = () => signOut(firebaseAuth);

export {
  firebaseAuth,
  firebaseBlob,
  FirebaseError,
  GoogleAuthProvider,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  getDownloadURL,
  ref as firebaseRef,
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

// firebase auth errors
export const ErrorCodes: Record<string, string> = {
  "auth/user-not-found": "User not found.",
  "auth/invalid-email": "Invalid email address.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/uid-already-exists": "User ID is already in use by another user.",
  "auth/email-already-exists": "Email is already in use by another user.",
  "auth/email-already-in-use": "Email is already registered.",
  "auth/invalid-action-code": "The provided link is expired or invalid.",
  "auth/requires-recent-login": "Session expired. Please log out and log in again."
};
export function ErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return ErrorCodes[error.code] || "An unexpected error occurred. Please try again.";
  }
  if (error instanceof Error) {
    return error.message || "An unknown error occurred.";
  }
  return "An unknown error occurred.";
}

// firebase storage
export async function uploadFile(file: File | Blob, filePath: string) {
  return await uploadBytesResumable(ref(firebaseBlob, filePath), file);
}
export async function downloadFile(filePath: string) {
  return await getDownloadURL(ref(firebaseBlob, filePath));
}
