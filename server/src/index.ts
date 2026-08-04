import app from "./app";

if (process.env.ENVIRONMENT !== "production") {
  const PORT: number = 44455;
  app.listen(PORT, () =>
    console.log(`${process.env.ENVIRONMENT} server: http://localhost:${PORT}`)
  );
} else {
  const PORT: number = 8080;
  app.listen(PORT, () =>
    console.log(`${process.env.ENVIRONMENT} server listening on port ${PORT}`)
  );
}
