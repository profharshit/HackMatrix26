import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const GATEWAY_URL = 'http://127.0.0.1:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: GATEWAY_URL, changeOrigin: true },
      '/health': { target: GATEWAY_URL, changeOrigin: true },
    },
  },
});