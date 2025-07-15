// import { https as firebase } from "firebase-functions";
import app from "./app";

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`${process.env.ENVIRONMENT} server: https://localhost:${PORT}`));

// exports.api = firebase.onRequest(app);
