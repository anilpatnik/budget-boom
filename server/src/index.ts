import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { https } from "firebase-functions";
import { errorHandler, helper } from "./util";
import { apiRouter } from "./routes";

const api: Application = express();

api.use(helmet());
api.use(express.json());
api.use(cors({ origin: "*" }));
api.use(helper.limiter);
api.use("/api", apiRouter);
api.use(errorHandler);

exports.api = https.onRequest(api);
