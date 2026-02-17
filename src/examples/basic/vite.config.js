import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const pkg = JSON.parse(readFileSync('../../package.json', 'utf-8'))

// Generate public/version.json at config load time
mkdirSync('public', { recursive: true })
writeFileSync('public/version.json', JSON.stringify({
  service: pkg.name,
  version: pkg.version,
}, null, 2))

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    __APP_VERSION__: JSON.stringify(pkg.version),
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
