import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7190',
        changeOrigin: true,
        secure: false, // self-signed sertifikalar için
      },
    },
  },
});
