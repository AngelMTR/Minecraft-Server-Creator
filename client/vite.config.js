import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import preact from '@preact/preset-vite'
import path from 'path'

export default defineConfig({
  plugins: [
      preact(),
      tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
