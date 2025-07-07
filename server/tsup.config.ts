import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "backend",
  target: "node18",
  format: ["esm", "cjs"],
  // remove all code where ENVIRONMENT !== "production"
  define: {
    "process.env.ENVIRONMENT": '"production"'
  },
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  dts: false // set to true if you want type definitions
});
