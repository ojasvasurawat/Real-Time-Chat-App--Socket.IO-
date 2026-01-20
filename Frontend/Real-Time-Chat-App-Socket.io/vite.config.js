import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
    build: {
      outDir: 'dist', // Ensure your build outputs to the 'dist' directory
    },
    base: '/', // This sets the base path for your app. Adjust if necessary.
    plugins: [
      react(),
      tailwindcss(),],
      resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), 
      },
    },
  }
})
