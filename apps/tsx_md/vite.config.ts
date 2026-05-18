import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      router: {
        quoteStyle: "double",
        semicolons: true,
        virtualRouteConfig: "./src/routes.ts",
      },
      spa: {
        enabled: true,
        prerender: {
          outputPath: "/index.html",
        },
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(currentDir, "./src"),
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 3020,
  },
  server: {
    host: "127.0.0.1",
    port: 3020,
  },
});
