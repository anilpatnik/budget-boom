import { fBlob, FirebaseError, getDownloadURL, ref, uploadBytesResumable } from "./firebase";

// firebase auth errors
export const ErrorCodes: { [key: string]: string } = {
  "auth/user-not-found": "User not found",
  "auth/invalid-email": "Invalid email address",
  "auth/wrong-password": "Incorrect email or password",
  "auth/invalid-credential": "Incorrect email or password",
  "auth/uid-already-exists": "User id is already in use by an existing user",
  "auth/email-already-exists": "Email is already in use by an existing user",
  "auth/invalid-action-code": "The provided link is expired",
  "auth/requires-recent-login": "Session Expired. Please Logout and Login"
};
export const ErrorMessage = (error: FirebaseError | Error) => {
  if (error instanceof FirebaseError) {
    const errorCode = Object.keys(ErrorCodes).find(code => error.code === code);
    return ErrorCodes[errorCode || String.empty];
  }
  return error.message;
};

// firebase storage
export const uploadFile = async (file: File | Blob, filePath: string) =>
  await uploadBytesResumable(ref(fBlob, filePath), file);
export const downloadFile = async (filePath: string) => await getDownloadURL(ref(fBlob, filePath));
