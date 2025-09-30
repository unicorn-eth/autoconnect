// examples/migration/App.before.jsx
// This shows what your code looked like BEFORE migrating to the NPM package
// (When you were copying files manually)

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, polygon } from 'wagmi/chains';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ❌ OLD WAY - Manual file imports
import UnicornAutoConnect from './components/UnicornAutoConnect'; // Manual file copy
import { useUniversalWallet } from './hooks/useUniversalWallet'; // Manual file copy

const config = getDefaultConfig({
  appName: 'Migration Example - Before',
  projectId: 'demo-project-id',
  chains: [base, polygon],
});

const queryClient = new QueryClient();

function WalletInfo() {
  // ❌ OLD WAY - Import from local files
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
      <h2>Before Migration</h2>
      <div style={{
        background: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: 0, color: '#92400e' }}>
          ⚠️ Using manual file copies:<br/>
          - src/components/UnicornAutoConnect.jsx<br/>
          - src/hooks/useUniversalWallet.js
        </p>
      </div>

      {wallet.isConnected ? (
        <div>
          <p>✅ Connected</p>
          <p>Address: {wallet.address}</p>
          <p>Connector: {wallet.connector?.name}</p>
          {wallet.isUnicorn && (
            <p style={{ color: '#8b5cf6' }}>⚡ Gasless enabled</p>
          )}
        </div>
      ) : (
        <p>Not connected</p>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <ConnectButton />
      </div>

      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <strong>Problems with this approach:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Manual file copying required</li>
          <li>No automatic updates</li>
          <li>No version control</li>
          <li>No TypeScript support</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            padding: '40px 20px'
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white',
              marginBottom: '40px'
            }}>
              <h1>❌ Before Migration</h1>
              <p>Manual file copying approach</p>
            </div>

            <WalletInfo />

            {/* ❌ OLD WAY - Manual file component */}
            <UnicornAutoConnect
              clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
              factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS}
              defaultChain="base"
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}