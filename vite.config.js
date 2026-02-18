
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  ssr: {
    noExternal: ['framer-motion', 'lucide-react', 'react-helmet-async', 'react-hot-toast', 'goober'],
  },
}))
