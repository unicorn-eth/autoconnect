import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Find the root package.json by walking up from cwd
function findRootPackageJson() {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, 'package.json');
    if (existsSync(candidate)) {
      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
      if (pkg.name === '@unicorn.eth/autoconnect') return pkg;
    }
    dir = path.dirname(dir);
  }
  return { name: 'autoconnect', version: '0.0.0' };
}

const pkg = findRootPackageJson();

// Generate public/version.json at config load time
const publicDir = path.resolve(process.cwd(), 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(path.join(publicDir, 'version.json'), JSON.stringify({
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
      '@unicorn.eth/autoconnect': path.resolve(__dirname, '../../integrations/web3modal/index.js'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wagmi', 'viem'],
  },
});
