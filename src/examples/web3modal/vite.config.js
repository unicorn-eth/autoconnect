import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync('../../package.json', 'utf-8'));

// Generate public/version.json at config load time
mkdirSync('public', { recursive: true });
writeFileSync('public/version.json', JSON.stringify({
  service: pkg.name,
  version: pkg.version,
}, null, 2));

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      // Use Web3Modal integration which exports v1 connector
      '@unicorn.eth/autoconnect': path.resolve(__dirname, '../../integrations/web3modal/index.js'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wagmi', 'viem'],
  },
});
