import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon, arbitrum, optimism } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
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

// 3. Create wagmi config with Unicorn connector
const wagmiConfig = createConfig({
  chains,
  connectors: [
    // Standard connectors
    walletConnect({ projectId }),
    injected(),
    coinbaseWallet({ appName: 'Unicorn Web3Modal Example' }),

    // Unicorn connector - enables gasless transactions
    unicornConnector({
      clientId,
      factoryAddress,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});

// 4. Create Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  enableAnalytics: false,
});

// 5. Create query client for React Query
const queryClient = new QueryClient();

// 6. Main App component
export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  );
}
