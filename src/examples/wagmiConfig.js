// Example: How to configure wagmi with the Unicorn connector
// wagmiConfig.ts or wagmiConfig.js

import { createConfig, http } from 'wagmi';
import { base, polygon, mainnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { unicornConnector } from '@unicorn.eth/autoconnect';

export const config = createConfig({
  chains: [base, polygon, mainnet],
  connectors: [
    // Standard connectors
    injected(),
    walletConnect({ 
      projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' 
    }),
    
    // 🦄 Unicorn connector - NOW it works with wagmi!
    unicornConnector({
      chains: [base, polygon, mainnet],
      options: {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
        defaultChain: 'base',
      }
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
});