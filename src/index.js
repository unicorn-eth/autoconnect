// src/index.js
// @unicorn.eth/autoconnect v1.4.0
// Wagmi connector-based approach for seamless integration

// Wagmi v2 Connector (for wagmi v2+ / RainbowKit / pure wagmi)
export { unicornConnector } from './connectors/unicornConnector';

// Wagmi v1 Connector (for Web3Modal v2 / wagmi v1.x)
export { unicornConnector as unicornConnectorV1, UnicornConnector } from './connectors/unicornConnector.v1';

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