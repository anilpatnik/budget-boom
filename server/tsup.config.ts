import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs"],
  target: "node20",
  define: {
    // remove all code where ENVIRONMENT !== "production"
    "process.env.ENVIRONMENT": '"production"'
  },
  sourcemap: true,
  clean: true,
  dts: true
});
