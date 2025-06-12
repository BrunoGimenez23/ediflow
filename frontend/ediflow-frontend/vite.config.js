import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // o '0.0.0.0' si lo vas a acceder desde otro dispositivo
    port: 5173,
    proxy: {
      "/buildings": "http://localhost:8080",
      "/auth": "http://localhost:8080",
      "/admin/buildings": "http://localhost:8080",
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});
