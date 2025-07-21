import https from "https";
import fs from "fs";
import app from "./app";

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
} else {
  const PORT: number = 8080;
  app.listen(PORT, () =>
    console.log(`${process.env.ENVIRONMENT} server: https://localhost:${PORT}`)
  );
}
