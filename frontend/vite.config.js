import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Base configuration
  const config = {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      open: true,
      proxy: {
        '/api': {
          // Forward API requests to your Render backend
          // This URL is now read from a non-VITE prefixed env variable
          // to avoid being exposed in the frontend build.
          target: env.BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'esbuild',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios'],
          },
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    }
  };

  // Only include test configuration in test mode
  if (mode === 'test') {
    config.test = {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.js'],
      globals: true,
      coverage: {
        reporter: ['text', 'json', 'html'],
      }
    };
  }

  return config;
});