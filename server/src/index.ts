import { https as firebase } from "firebase-functions";
import app from "./app";

exports.api = firebase.onRequest(app);
