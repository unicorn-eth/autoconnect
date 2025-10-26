// src/index.js
// @unicorn.eth/autoconnect v1.2.0
// Wagmi connector-based approach for seamless integration

// Wagmi Connector (NEW in v1.2.0 - recommended approach)
export { unicornConnector } from './unicornConnector';

// Universal Hooks (use these in your components)
export { useUniversalWallet } from './hooks/useUniversalWallet';
export { useUniversalTransaction } from './hooks/useUniversalTransaction';
export { useUniversalSignMessage } from './hooks/useUniversalSignMessage';

// Unicorn-specific Hooks (optional, for advanced use)
export { useUnicornTransaction } from './hooks/useUnicornTransaction';
export { useUnicornSignMessage } from './hooks/useUnicornSignMessage';

// Pre-built UI components (optional)
export { UnicornTransactionButton } from './components/UnicornTransactionButton';
export { UnicornSignButton } from './components/UnicornSignButton';

// Legacy component (deprecated in v1.2.0, use unicornConnector instead)
export { default as UnicornAutoConnect } from './components/UnicornAutoConnect';