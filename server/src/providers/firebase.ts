import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth, UserInfo, CreateRequest, UpdateRequest } from "firebase-admin/auth";

const defaultApp = initializeApp({ credential: applicationDefault() });
const firebaseAuth = getAuth(defaultApp);

export { firebaseAuth, UserInfo, CreateRequest, UpdateRequest };
