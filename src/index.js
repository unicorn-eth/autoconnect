// coded lovingly by @cryptowampum and Claude AI
// @unicorn.eth/autoconnect - Main export file
// Clean, simple exports - developers just import and use

// Core components
export { default as UnicornAutoConnect } from './components/UnicornAutoConnect.jsx';

// Hooks
export { useUniversalWallet } from './hooks/useUniversalWallet.js';
export { useUnicornTransaction } from './hooks/useUnicornTransaction.js';
export { useUnicornSignMessage } from './hooks/useUnicornSignMessage.js';

// Pre-built components
export { default as UnicornTransactionButton } from './components/UnicornTransactionButton.jsx';
export { default as UnicornSignButton } from './components/UnicornSignButton.jsx';

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