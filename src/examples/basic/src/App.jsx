// coded lovingly by @cryptowampum and Claude AI
// examples/basic/App.jsx
// Minimal integration example - shows simplest possible setup

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Import from the package
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';

// Your existing Wagmi config
const config = getDefaultConfig({
  appName: 'Basic Example',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base],
  ssr: false,
});

const queryClient = new QueryClient();

// Simple component showing wallet connection
function WalletInfo() {
  const wallet = useUniversalWallet();

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '600px',
      margin: '20px auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2>Wallet Status</h2>
      
      {wallet.isConnected ? (
        <div>
          <p>✅ Connected</p>
          <p>Address: {wallet.address}</p>
          <p>Connector: {wallet.connector?.name}</p>
          {wallet.isUnicorn && (
            <p style={{ color: '#8b5cf6' }}>⚡ Gasless transactions enabled</p>
          )}
        </div>
      ) : (
        <p>Not connected</p>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <ConnectButton />
      </div>
    </div>
  );
}

// Main App - just add UnicornAutoConnect!
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white',
              marginBottom: '40px'
            }}>
              <h1>🦄 Basic Integration Example</h1>
              <p>Minimal setup - existing app + one line</p>
            </div>

            <WalletInfo />

            {/* 
              ✨ ADD JUST THIS ONE LINE TO YOUR EXISTING APP ✨
              Everything else stays exactly the same!
            */}
            <UnicornAutoConnect
              clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID }
              factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS }
              defaultChain={import.meta.env.VITE_DEFAULT_CHAIN }
              debug={true}
              onConnect={(wallet) => {
                console.log('🦄 Unicorn connected!');
              }}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}