import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: { port: 4173 },
  build: {
    target: 'es2020',
    // Hidden source maps: uploadable to an error tracker, not served to users.
    sourcemap: 'hidden',
    rolldownOptions: {
      output: {
        // Stable vendor chunks: cached across deploys, downloaded in parallel.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router', test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            { name: 'query', test: /node_modules[\\/](@tanstack|axios)[\\/]/ },
            { name: 'i18n', test: /node_modules[\\/](i18next|react-i18next)[\\/]/ },
            { name: 'zod', test: /node_modules[\\/]zod[\\/]/ },
          ],
        },
      },
    },
  },
});
