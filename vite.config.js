import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/svg-editor/', // GitHub Pages: https://<user>.github.io/svg-editor/
  plugins: [react()],
})
