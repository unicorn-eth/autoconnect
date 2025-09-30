// tsup.config.js - Modern bundler configuration
import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point
  entry: ['src/index.js'],
  
  // Output formats
  format: ['cjs', 'esm'],
  
  // Generate TypeScript definitions
  dts: true,
  
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
    'thirdweb',
    'thirdweb/react',
    'thirdweb/chains',
    'thirdweb/wallets',
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