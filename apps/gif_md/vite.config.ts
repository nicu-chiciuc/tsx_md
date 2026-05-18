import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  preview: {
    host: "127.0.0.1",
    port: 3021,
  },
  server: {
    host: "127.0.0.1",
    port: 3021,
  },
});
