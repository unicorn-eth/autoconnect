import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, polygon, arbitrum, optimism } from 'wagmi/chains';
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';
import DApp from './components/DApp';

// 1. Get environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const factoryAddress = import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS;

if (!projectId) {
  console.error('Missing VITE_WALLETCONNECT_PROJECT_ID');
}
if (!clientId) {
  console.error('Missing VITE_THIRDWEB_CLIENT_ID');
}

// 2. Configure chains
const chains = [base, polygon, arbitrum, optimism];

const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [w3mProvider({ projectId })]
);

// 3. Create wagmi config with Unicorn connector
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    // Web3Modal connectors (WalletConnect, Injected wallets, etc.)
    ...w3mConnectors({ projectId, chains }),

    // Unicorn connector - this is the only line you need to add!
    // Note: wagmi v1 syntax requires chains and options objects
    unicornConnector({
      chains,
      options: {
        clientId,
        factoryAddress,
        defaultChain: 8453, // Base
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// 4. Create Ethereum client for Web3Modal
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// 5. Main App component
export default function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {/* Auto-connect component for URL-based connection */}
        <UnicornAutoConnect
          debug={true}
          onConnect={(wallet) => {
            console.log('Unicorn wallet connected!', wallet);
          }}
          onError={(error) => {
            console.error('Connection error:', error);
          }}
        />

        {/* Your dApp */}
        <DApp />
      </WagmiConfig>

      {/* Web3Modal component */}
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
