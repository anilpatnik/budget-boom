import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";
import { ENVIRONMENT, errorHandler, helper } from "./util";
import { apiRouter } from "./routes";

const api: Application = express();

api.use(helmet());
api.use(express.json());
api.use(cors({ origin: "*" }));
api.use(helper.limiter);
api.use("/api", apiRouter);
api.use(errorHandler);

const httpsOptions = { key: fs.readFileSync("../ssl.key"), cert: fs.readFileSync("../ssl.pem") };
const httpsServer = https.createServer(httpsOptions, api);
const apiPort: number = 44455;
httpsServer.listen(apiPort, () =>
  console.log(`${ENVIRONMENT} server: https://localhost:${apiPort}`)
);
