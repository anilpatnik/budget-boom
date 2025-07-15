import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth, UserInfo, CreateRequest, UpdateRequest } from "firebase-admin/auth";
import { GOOGLE_APPLICATION_CREDENTIALS } from "../utils/configs";

/*** 
const base64 = GOOGLE_APPLICATION_CREDENTIALS;
if (!base64) throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS in .env");

// decode base64 string to get the JSON credentials
const jsonString = Buffer.from(base64, "base64").toString("utf-8");
const serviceAccount = JSON.parse(jsonString);

const defaultApp = initializeApp({ credential: cert(serviceAccount) });
***/

const defaultApp = initializeApp({ credential: applicationDefault() });
const firebaseAuth = getAuth(defaultApp);

export { firebaseAuth, UserInfo, CreateRequest, UpdateRequest };
