// examples/migration/App.jsx
// This shows what your code looks like AFTER migrating to the NPM package
// Notice: ONLY the imports changed!

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, polygon } from 'wagmi/chains';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ✅ NEW WAY - NPM package import
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn/autoconnect';

const config = getDefaultConfig({
  appName: 'Migration Example - After',
  projectId: 'demo-project-id',
  chains: [base, polygon],
});

const queryClient = new QueryClient();

function WalletInfo() {
  // ✅ NEW WAY - Same hook, cleaner import
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
      <h2>After Migration</h2>
      <div style={{
        background: '#dcfce7',
        border: '2px solid #16a34a',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: 0, color: '#166534' }}>
          ✅ Using NPM package:<br/>
          npm install @unicorn/autoconnect
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
        background: '#f0f9ff',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <strong>Benefits of NPM package:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>✅ npm install - done!</li>
          <li>✅ Automatic updates with npm update</li>
          <li>✅ Semantic versioning</li>
          <li>✅ Full TypeScript support</li>
          <li>✅ Better tree-shaking</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px'
      }}>
        <strong style={{ color: '#92400e' }}>What Changed?</strong>
        <div style={{
          marginTop: '12px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#78350f'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#dc2626' }}>- import ... from './components/...'</span>
          </div>
          <div>
            <span style={{ color: '#16a34a' }}>+ import ... from '@unicorn/autoconnect'</span>
          </div>
        </div>
        <p style={{ marginTop: '12px', marginBottom: 0, color: '#92400e', fontSize: '14px' }}>
          That's it! Everything else stays identical.
        </p>
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
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            padding: '40px 20px'
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white',
              marginBottom: '40px'
            }}>
              <h1>✅ After Migration</h1>
              <p>Clean NPM package approach</p>
            </div>

            <WalletInfo />

            {/* ✅ NEW WAY - Same component, cleaner import */}
            <UnicornAutoConnect
              clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || "4e8c81182c3709ee441e30d776223354"}
              factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS || "0xD771615c873ba5a2149D5312448cE01D677Ee48A"}
              defaultChain="base"
              debug={true}
              onConnect={(wallet) => {
                console.log('🦄 Unicorn connected via NPM package!');
              }}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}