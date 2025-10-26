// src/index.js
// @unicorn.eth/autoconnect v1.1.2
// Enhanced with full transaction and signing support

// Core component
export { default as UnicornAutoConnect } from './components/UnicornAutoConnect';

// Pre-built UI components (v1.1.0+)
export { UnicornTransactionButton } from './components/UnicornTransactionButton';
export { UnicornSignButton } from './components/UnicornSignButton';

// Core hooks
export { useUniversalWallet } from './hooks/useUniversalWallet';

// Transaction hooks (v1.1.2 - NEW/ENHANCED)
export { useUnicornTransaction } from './hooks/useUnicornTransaction';
export { useUniversalTransaction } from './hooks/useUniversalTransaction';

// Signing hooks (v1.1.2 - NEW/ENHANCED)
export { useUnicornSignMessage } from './hooks/useUnicornSignMessage';
export { useUniversalSignMessage } from './hooks/useUniversalSignMessage';

// Utility functions (if any)
// export { ... } from './utils';