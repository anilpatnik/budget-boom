import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import fs from "node:fs";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Deal On",
        short_name: "Deal On",
        description: "Marketplace Deals and Beyond",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#2d89ef",
        icons: [{ src: "android-chrome.png", sizes: "144x144", type: "image/png" }]
      }
    })
  ],
  build: { outDir: "web-build" },
  server: {
    port: 44454,
    https: {
      key: fs.readFileSync("../ssl.key"),
      cert: fs.readFileSync("../ssl.pem")
    }
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  }
});
