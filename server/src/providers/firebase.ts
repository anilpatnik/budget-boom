import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth, UserInfo, CreateRequest, UpdateRequest } from "firebase-admin/auth";
import { GOOGLE_CREDENTIALS } from "../utils/configs";

const defaultApp = initializeApp({
  credential: GOOGLE_CREDENTIALS
    ? cert(JSON.parse(Buffer.from(GOOGLE_CREDENTIALS, "base64").toString("utf-8")))
    : applicationDefault()
});

const firebaseAuth = getAuth(defaultApp);

export { firebaseAuth, UserInfo, CreateRequest, UpdateRequest };
