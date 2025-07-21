import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRouter } from "./routes";
import { securityMiddleware, errorMiddleware, swaggerMiddleware } from "./middlewares";

const app: Application = express();

// security
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(securityMiddleware);
// routes
app.use("/api", apiRouter);
if (process.env.ENVIRONMENT !== "production") {
  // swagger
  app.use(swaggerMiddleware);
}
// error handler
app.use(errorMiddleware);

export default app;
