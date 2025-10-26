// _app.tsx - Proper setup with RainbowKit + Unicorn
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, polygon, mainnet } from 'wagmi/chains';
import { unicornConnector } from '@unicorn.eth/autoconnect';

// Create wagmi config with Unicorn connector
const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base, polygon, mainnet],
  ssr: true,
});

// Add Unicorn connector to the config
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet],
    options: {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
    }
  })
);

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ✅ THAT'S IT! No more:
// - ❌ UnicornAutoConnect component
// - ❌ useUniversalWallet hook
// - ❌ Custom transaction hooks
// - ❌ Separate React roots
// - ❌ Event listeners
// - ❌ Manual state management

// Now just use standard wagmi hooks everywhere! 🎉