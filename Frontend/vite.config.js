import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // listen on 0.0.0.0 so Docker exposes it
    port: 5173,
    watch: {
      usePolling: true, // required on Windows for hot-reload inside Docker
    },
  },
})
