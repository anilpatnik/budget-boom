import * as functions from "firebase-functions";
import https from "https";
import fs from "fs";
import app from "./app";

exports.api = functions.https.onRequest(app);

if (process.env.ENVIRONMENT !== "production") {
  const options = {
    key: fs.readFileSync("../ssl.key"),
    cert: fs.readFileSync("../ssl.pem")
  };
  const httpsServer = https.createServer(options, app);
  const PORT: number = 44455;
  httpsServer.listen(PORT, () =>
    console.log(`${process.env.ENVIRONMENT} server: https://localhost:${PORT}`)
  );
}
