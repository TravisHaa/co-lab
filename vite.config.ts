import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Tailwind CSS Vite plugin
  ],
  // Ensure single React instance to avoid "React Element from older version" errors
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
