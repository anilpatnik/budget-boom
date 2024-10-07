import { App, applicationDefault, initializeApp } from "firebase-admin/app";
import { CreateRequest, getAuth, UpdateRequest, UserInfo } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { ENVIRONMENT } from "./config";
import { EnvType } from "./enums";

let defaultApp: App;
if (ENVIRONMENT !== EnvType.Prod) {
  defaultApp = initializeApp({ credential: applicationDefault() });
} else defaultApp = initializeApp();

const fAuth = getAuth(defaultApp);
const fStore = getStorage(defaultApp);

export { fAuth, fStore, CreateRequest, UpdateRequest, UserInfo };
