// coded lovingly by @cryptowampum and Claude AI
// @unicorn/autoconnect - Main export file
// Clean, simple exports - developers just import and use

export { default as UnicornAutoConnect } from './components/UnicornAutoConnect.jsx';
export { useUniversalWallet } from './hooks/useUniversalWallet.js';

// Export utility functions
export { 
  isUnicornEnvironment,
  getUnicornAuthCookie,
  getChainConfig 
} from './utils/environment.js';

// Export transaction approval utilities
export { default as requestTransactionApproval } from './components/UnicornTransactionApproval.jsx';
export { 
  wrapUnicornWallet,
  isWrappedWallet,
  unwrapWallet 
} from './utils/unicornWalletWrapper.js';

// Re-export types for TypeScript users (future enhancement)
// export type { UniversalWallet, UnicornConfig } from './types';