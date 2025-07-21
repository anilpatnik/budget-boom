import { initializeApp, applicationDefault, cert, Credential } from "firebase-admin/app";
import { getAuth, UserInfo, CreateRequest, UpdateRequest } from "firebase-admin/auth";
import { GOOGLE_CREDENTIALS } from "../utils/configs";

let credential: Credential;
try {
  credential = GOOGLE_CREDENTIALS
    ? cert(JSON.parse(Buffer.from(GOOGLE_CREDENTIALS, "base64").toString("utf-8")))
    : applicationDefault();
} catch (err) {
  console.error("🔥 Failed to parse GOOGLE_CREDENTIALS:", err);
  credential = applicationDefault();
}

const defaultApp = initializeApp({ credential });
const firebaseAuth = getAuth(defaultApp);

export { firebaseAuth, UserInfo, CreateRequest, UpdateRequest };
