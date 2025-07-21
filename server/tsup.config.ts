import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "backend",
  format: ["esm", "cjs"],
  target: "node20",
  define: {
    // remove all code where ENVIRONMENT !== "production"
    "process.env.ENVIRONMENT": '"production"'
  },
  dts: false, // not needed for backend apps
  treeshake: true, // remove unused code
  minify: true, // minify the output
  sourcemap: true, // good for debugging
  clean: true, // clean before each build
  splitting: false, // single file output
  shims: false // don't shim Node globals
});
