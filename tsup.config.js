// tsup.config.js - Modern bundler configuration
import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point
  entry: ['src/index.js'],
  
  // Output formats
  format: ['esm','cjs'],
  
  // Don't auto-generate TypeScript definitions from JSX
  // We have manually created types in src/types/index.d.ts
  dts: false,
  
  // Code splitting for better tree-shaking
  splitting: false,
  
  // Source maps for debugging
  sourcemap: true,
  
  // Clean output directory before build
  clean: true,
  
  // External dependencies (not bundled)
  external: [
    'react',
    'react-dom',
    'wagmi',
    'wagmi/actions',
    'viem',
    'viem/actions',
    'viem/chains',  // ← ADD THIS for chain imports
    'thirdweb',
    'thirdweb/react',
    'thirdweb/chains',
    'thirdweb/wallets',
    '@tanstack/react-query',
    '@rainbow-me/rainbowkit',
  ],
  
  // Don't bundle node_modules
  noExternal: [],
  
  // Output directory
  outDir: 'dist',
  
  // Minification
  minify: false, // Keep readable for debugging
  
  // Target environment
  target: 'es2020',
  
  // Bundle configuration
  bundle: true,
  
  // Preserve JSX for React
  jsx: 'preserve',
  
  // Banner for CommonJS compatibility
  banner: {
    js: '"use client";',
  },
});