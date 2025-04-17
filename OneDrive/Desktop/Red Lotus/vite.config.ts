import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.JPEG', '**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg'],
  // Handle @vercel/blob imports better in development
  optimizeDeps: {
    exclude: ['@vercel/blob'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Prevent errors with @vercel/blob module
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  // Add server options for API mocking
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
