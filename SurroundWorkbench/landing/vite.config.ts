import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` produces a fully relative build so it works whether you serve
// the site at the root of a domain (Netlify, custom domain) OR under a sub-path
// like `https://<user>.github.io/<repo>/` (default GitHub Pages layout).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: '127.0.0.1', port: 4174 },
  preview: { host: '127.0.0.1', port: 4173 },
})
