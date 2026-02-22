import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'images',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        goals: resolve(__dirname, 'goals.html'),
        projects: resolve(__dirname, 'projects.html'),
        impact: resolve(__dirname, 'impact.html'),
        volunteer: resolve(__dirname, 'volunteer.html'),
        education: resolve(__dirname, 'education.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
        donate: resolve(__dirname, 'donate.html'),
      },
      output: {
        manualChunks: {
          vendor: ['intersection-observer'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  preview: {
    port: 8080,
  },
  optimizeDeps: {
    include: [],
  },
});
