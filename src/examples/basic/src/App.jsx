// src/examples/basic/src/App.jsx
// Clean example app for @unicorn.eth/autoconnect v1.2.0+

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Import from source code
import { unicornConnector } from '../../../connectors/unicornConnector.js';
import UnicornAutoConnect from '../../../components/UnicornAutoConnect.jsx';

// Import our components
import { WalletStatus } from './components/WalletStatus.jsx';
import { TestButtons } from './components/TestButtons.jsx';

// Wagmi config with all wallet types
const config = createConfig({
  chains: [base, polygon],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    }),
    unicornConnector({
      clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

function TestApp() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px', 
      fontFamily: 'sans-serif' 
    }}>
      <h1>🦄 AutoConnect v1.2 Example</h1>
      
      {/* Connect Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
      }}>
        <div>
          <strong>Connect your wallet to test:</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Works with MetaMask, WalletConnect, Coinbase, Unicorn, and more!
          </p>
        </div>
        <ConnectButton />
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
      }}>
        <strong>✨ v1.2 Hybrid Approach</strong>
        <p style={{ margin: '10px 0 0 0' }}>
          • Connector: For manual wallet selection<br />
          • Component: For automatic connection via Unicorn portal
        </p>
      </div>

      {/* Wallet Status */}
      <WalletStatus />

      {/* Test Buttons */}
      <TestButtons />

      {/* Wallet Comparison */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e7f3ff',
        borderRadius: '8px',
        fontSize: '14px',
      }}>
        <h4>💡 EOA vs Smart Account</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <strong>🦊 EOA (MetaMask, etc.)</strong>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '13px' }}>
              <li>Externally Owned Account</li>
              <li>Controlled by private key</li>
              <li>ECDSA signatures</li>
              <li>Client-side verification ✅</li>
              <li>Gas required 💰</li>
            </ul>
          </div>
          <div>
            <strong>🦄 Unicorn (Smart Account)</strong>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '13px' }}>
              <li>Smart Contract (ERC-4337)</li>
              <li>Controlled by logic + key</li>
              <li>ERC-1271 signatures</li>
              <li>On-chain verification 🔗</li>
              <li>Gasless transactions! ⚡</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App with Providers
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TestApp />
          
          {/* Autoconnect component for background connection */}
          <UnicornAutoConnect
            clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
            factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS}
            defaultChain="base"
            debug={true}
            onConnect={(wallet) => console.log('✅ Unicorn autoconnected!', wallet)}
            onError={(error) => console.error('❌ Autoconnect failed:', error)}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}