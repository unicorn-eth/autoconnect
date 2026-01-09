// Web3Modal v2 Integration for Unicorn Connector
// Makes it easy to add Unicorn wallet to @web3modal/ethereum projects

// Use v1 connector for Web3Modal v2 compatibility (wagmi v1)
import { unicornConnector } from '../../connectors/unicornConnector.v1.js';

/**
 * Creates a Web3Modal-compatible wagmi config with Unicorn connector
 *
 * @param {Object} options - Configuration options
 * @param {string} options.projectId - WalletConnect project ID
 * @param {string} options.clientId - Thirdweb client ID for Unicorn
 * @param {string} options.factoryAddress - Smart account factory address
 * @param {number} options.defaultChain - Default chain ID (e.g., 8453 for Base)
 * @param {Array} options.chains - Array of wagmi chain objects
 * @param {string} [options.icon] - Optional custom icon URL
 * @returns {Object} Wagmi config with Unicorn connector included
 *
 * @example
 * import { createWeb3ModalConfig } from '@unicorn.eth/autoconnect/web3modal';
 * import { base, polygon } from 'wagmi/chains';
 *
 * const config = createWeb3ModalConfig({
 *   projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
 *   clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
 *   factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
 *   defaultChain: 8453,
 *   chains: [base, polygon],
 * });
 */
export async function createWeb3ModalConfig(options) {
  const {
    projectId,
    clientId,
    factoryAddress,
    defaultChain,
    chains,
    icon,
  } = options;

  // Validate required options
  if (!projectId) {
    throw new Error('createWeb3ModalConfig: projectId is required');
  }
  if (!clientId) {
    throw new Error('createWeb3ModalConfig: clientId (Thirdweb) is required');
  }
  if (!factoryAddress) {
    throw new Error('createWeb3ModalConfig: factoryAddress is required');
  }
  if (!defaultChain) {
    throw new Error('createWeb3ModalConfig: defaultChain is required');
  }
  if (!chains || !Array.isArray(chains)) {
    throw new Error('createWeb3ModalConfig: chains array is required');
  }

  // Import Web3Modal and wagmi dependencies
  const { EthereumClient, w3mConnectors, w3mProvider } = await import('@web3modal/ethereum');
  const { configureChains, createConfig } = await import('wagmi');

  // Configure chains with Web3Modal provider
  const { publicClient, webSocketPublicClient } = configureChains(
    chains,
    [w3mProvider({ projectId })]
  );

  // Create wagmi config with both Web3Modal connectors AND Unicorn connector
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      // Web3Modal connectors (WalletConnect, Injected, etc.)
      ...w3mConnectors({ projectId, chains }),

      // Unicorn connector (wagmi v1 compatible)
      unicornConnector({
        chains,
        options: {
          clientId,
          factoryAddress,
          defaultChain,
          icon,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  // Create Ethereum client for Web3Modal
  const ethereumClient = new EthereumClient(wagmiConfig, chains);

  return {
    wagmiConfig,
    ethereumClient,
    chains,
  };
}

/**
 * Helper to add Unicorn connector to existing Web3Modal setup
 * Use this if you already have a wagmi config and just want to add Unicorn
 *
 * @param {Array} existingConnectors - Array of existing wagmi connectors
 * @param {Object} unicornOptions - Unicorn connector options
 * @returns {Array} Connectors array with Unicorn added
 *
 * @example
 * import { w3mConnectors } from '@web3modal/ethereum';
 * import { addUnicornConnector } from '@unicorn.eth/autoconnect/web3modal';
 *
 * const connectors = addUnicornConnector(
 *   w3mConnectors({ projectId, chains }),
 *   {
 *     clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
 *     factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
 *     defaultChain: 8453,
 *   }
 * );
 */
export function addUnicornConnector(existingConnectors, chains, unicornOptions) {
  return [
    ...existingConnectors,
    unicornConnector({
      chains,
      options: unicornOptions,
    }),
  ];
}

// Re-export the v1 connector for convenience
export { unicornConnector } from '../../connectors/unicornConnector.v1.js';

// Re-export the AutoConnect component for URL-based connection
export { default as UnicornAutoConnect } from '../../components/UnicornAutoConnect.jsx';
