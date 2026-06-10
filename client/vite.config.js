import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Прокси /api → Express (порт 3001), чтобы в коде использовать относительные пути
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
