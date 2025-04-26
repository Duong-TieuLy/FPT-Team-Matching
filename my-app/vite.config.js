import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Địa chỉ backend Spring Boot
        changeOrigin: true, // Cần thiết để xử lý cross-origin
      }
    }
  }
});
