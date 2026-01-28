// src/index.js
// @unicorn.eth/autoconnect v1.5.0
// Wagmi v2 connector-based approach for seamless integration

// Wagmi v2 Connector (for wagmi v2+ / RainbowKit / Web3Modal v3+ / pure wagmi)
export { unicornConnector } from './connectors/unicornConnector';

// NOTE: Wagmi v1 support has been removed in v1.5.0 to fix bundling conflicts.
// If you need wagmi v1 support, install the legacy version:
//   npm install @unicorn.eth/autoconnect@legacy

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