// @unicorn/autoconnect - Main export file
// Clean, simple exports - developers just import and use

export { default as UnicornAutoConnect } from './components/UnicornAutoConnect';
export { useUniversalWallet } from './hooks/useUniversalWallet';

// Optional: Export utility functions if needed
export { isUnicornEnvironment } from './utils/environment';

// Re-export types for TypeScript users (future enhancement)
// export type { UniversalWallet, UnicornConfig } from './types';