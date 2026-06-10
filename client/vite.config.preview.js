// Сборка standalone-превью: один HTML-файл со всем внутри.
// Запуск: npm run build:preview  → ../preview.html
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-preview',
    assetsInlineLimit: 100000000, // вшивать все ассеты (карту) в base64
    rollupOptions: {
      input: 'preview-entry.html',
    },
  },
});
