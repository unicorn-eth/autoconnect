// tsup.config.js - Modern bundler configuration
import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point
  entry: ['src/index.js'],
  
  // Output formats
  format: ['esm', 'cjs'],
  
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
  // CRITICAL: These MUST be marked as external for library packages
  external: [
    // React
    'react',
    'react-dom',
    
    // Wagmi and subpaths
    'wagmi',
    'wagmi/actions',
    'wagmi/chains',
    
    // Viem and ALL subpaths - CRITICAL FOR BUILD
    'viem',
    'viem/actions',
    'viem/chains',
    'viem/utils',
    'viem/accounts',
    
    // Thirdweb and subpaths
    'thirdweb',
    'thirdweb/react',
    'thirdweb/chains',
    'thirdweb/wallets',
    
    // Other peer dependencies
    '@tanstack/react-query',
    '@rainbow-me/rainbowkit',
  ],
  
  // Explicitly allow nothing to be bundled from node_modules except our own code
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
  
  // Additional esbuild options to ensure externals work
  esbuildOptions(options) {
    options.external = [
      ...options.external || [],
      'react',
      'react-dom',
      'wagmi',
      'wagmi/*',
      'viem',
      'viem/*',
      'thirdweb',
      'thirdweb/*',
      '@tanstack/*',
      '@rainbow-me/*',
    ];
  },
});