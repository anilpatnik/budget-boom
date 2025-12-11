import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import fs from "node:fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "myBudgetezy",
        short_name: "myBudgetezy",
        description: "track, analyze, and manage your income and expenses",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#2d89ef",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        screenshots: [
          {
            src: "screenshot1.jpg",
            sizes: "902x790",
            type: "image/jpg",
            form_factor: "wide"
          },
          {
            src: "screenshot2.jpg",
            sizes: "373x824",
            type: "image/jpg",
            form_factor: "narrow"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // Allow 10MB
      },
      devOptions: { enabled: true }
    }),
    tailwindcss()
  ],
  build: { outDir: "frontend" },
  server: {
    host: "0.0.0.0",
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
