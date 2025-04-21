import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis'
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // địa chỉ backend Spring Boot
        changeOrigin: true, // cần thiết để xử lý cross-origin
        // KHÔNG cần rewrite nếu Spring Boot dùng @RequestMapping("/api")
      }
    }
  }
});
