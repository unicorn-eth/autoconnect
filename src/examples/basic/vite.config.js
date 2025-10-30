import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'wagmi', 'viem', 'thirdweb'],
  },
  optimizeDeps: {
    include: ['wagmi', 'viem', 'thirdweb'],
  },
  server: {
    port: 3001,
    open: true,
  }
})