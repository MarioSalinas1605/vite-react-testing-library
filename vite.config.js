import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Most hosts serve from the domain root. Hosts that serve from a subfolder
  // (GitHub Pages project sites: /<repo>/) set BASE_PATH at build time.
  base: process.env.BASE_PATH || '/',
  plugins: [tailwindcss(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
