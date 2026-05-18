import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(currentDir, "./src"),
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 3022,
  },
  server: {
    host: "127.0.0.1",
    port: 3022,
  },
  test: {
    environment: "jsdom",
  },
});
