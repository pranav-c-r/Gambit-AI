import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
    plugins: () => [
      {
        name: 'configure-stockfish',
        async transform(code, id) {
          if (id.includes('stockfish.js')) {
            return {
              code: code.replace('new URL(', 'new self.URL('),
              map: null
            };
          }
        }
      }
    ]
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});