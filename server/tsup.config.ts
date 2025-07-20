import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "backend",
  format: ["esm"],
  target: "node20",
  define: {
    // remove all code where ENVIRONMENT !== "production"
    "process.env.ENVIRONMENT": '"production"'
  },
  dts: false, // not needed for backend apps
  sourcemap: true, // good for debugging
  clean: true, // clean before each build
  splitting: false, // single file output
  shims: false // don't shim Node globals
});
