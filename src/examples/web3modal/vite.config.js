import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
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
