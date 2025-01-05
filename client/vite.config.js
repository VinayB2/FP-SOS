import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.mp4', '**/*.mjpeg'],
  server: {
    proxy: {
      '/api': 'https://fp-sos.onrender.com',
      // '/api': 'http://localhost:5000',
    },
  },
})
