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
        name: "Personal Expense Manager",
        short_name: "PEM",
        description: "track, analyze, and manage your income and expenses",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#2d89ef",
        icons: [
          { src: "web-app-manifest-192x192.png", sizes: "196x196", type: "image/png" },
          { src: "web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // Allow 10MB
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
