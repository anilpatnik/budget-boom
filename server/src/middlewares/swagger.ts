import express, { Router } from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

export const swaggerMiddleware: Router = express.Router();

if (process.env.ENVIRONMENT !== "production") {
  const swaggerPath = path.join(__dirname, "../docs/swagger.json");
  const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
  swaggerMiddleware.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      explorer: true,
      swaggerOptions: {
        defaultModelsExpandDepth: -1, // hides Schemas section
        defaultModelExpandDepth: 1, // expand model detail when used in responses
        persistAuthorization: true
      },
      customCss: ".topbar { display: none }" // hides the search bar
    })
  );
}
