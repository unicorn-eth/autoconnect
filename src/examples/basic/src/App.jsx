// src/examples/basic/src/App.jsx
// Comprehensive test app for @unicorn.eth/autoconnect v1.3.0
// Tests ALL unicornConnector functions + seamless wagmi compatibility

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Import from source code
import { unicornConnector } from '../../../connectors/unicornConnector.js';
import UnicornAutoConnect from '../../../components/UnicornAutoConnect.jsx';

// Import test components
import { WalletStatus } from './components/WalletStatus.jsx';
import { ConnectorFunctionTests } from './components/ConnectorFunctionTests.jsx';
import { SeamlessWagmiTests } from './components/SeamlessWagmiTests.jsx';
import { StressTests } from './components/StressTests.jsx';

// Wagmi config with unicornConnector
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
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '20px', 
      fontFamily: 'sans-serif' 
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
      }}>
        <h1 style={{ margin: 0, fontSize: '32px' }}>
          🦄 AutoConnect v1.3 - Comprehensive Test Suite
        </h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Testing all unicornConnector functions + seamless wagmi compatibility
        </p>
      </div>
      
      {/* Connect Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div>
          <strong style={{ fontSize: '18px' }}>🔌 Connect Wallet</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Test with MetaMask, Coinbase Wallet, or Unicorn
          </p>
        </div>
        <ConnectButton />
      </div>

      {/* Test Info Banner */}
      <div style={{
        padding: '20px',
        background: '#e3f2fd',
        borderRadius: '12px',
        marginBottom: '30px',
        fontSize: '14px',
        lineHeight: '1.6',
      }}>
        <strong style={{ fontSize: '16px' }}>✨ v1.3 Test Coverage</strong>
        <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>🔧 Connector Functions:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '13px' }}>
              <li>setup() - Initialize Thirdweb client</li>
              <li>connect() - Connect wallet</li>
              <li>disconnect() - Disconnect wallet</li>
              <li>getAccount() - Get address</li>
              <li>getChainId() - Get chain ID</li>
              <li>isAuthorized() - Check auth status</li>
              <li>switchChain() - Change network</li>
              <li>getProvider() - Get wallet instance</li>
            </ul>
          </div>
          <div>
            <strong>🔄 Seamless Wagmi Tests:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '13px' }}>
              <li>useSendTransaction (native wagmi)</li>
              <li>useWriteContract (native wagmi)</li>
              <li>useReadContract (native wagmi)</li>
              <li>useSignMessage (native wagmi)</li>
              <li>useSignTypedData (native wagmi)</li>
              <li>useAccount (connection state)</li>
              <li>useSwitchChain (network switching)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Wallet Status */}
      <WalletStatus />

      {/* Test Sections */}
      <div style={{
        display: 'grid',
        gap: '30px',
        marginTop: '30px',
      }}>
        {/* Section 1: Connector Function Tests */}
        <div style={{
          padding: '25px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '24px',
            color: '#667eea',
            borderBottom: '2px solid #667eea',
            paddingBottom: '10px',
          }}>
            🔧 Connector Function Tests
          </h2>
          <ConnectorFunctionTests />
        </div>

        {/* Section 2: Seamless Wagmi Compatibility Tests */}
        <div style={{
          padding: '25px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '24px',
            color: '#764ba2',
            borderBottom: '2px solid #764ba2',
            paddingBottom: '10px',
          }}>
            🔄 Seamless Wagmi Tests
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            These tests use <strong>native wagmi hooks</strong> directly - no wrapper hooks!
            This proves the connector works seamlessly with existing wagmi code.
          </p>
          <SeamlessWagmiTests />
        </div>

        {/* Section 3: Stress Tests */}
        <div style={{
          padding: '25px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '24px',
            color: '#f093fb',
            borderBottom: '2px solid #f093fb',
            paddingBottom: '10px',
          }}>
            🔥 Stress & Edge Case Tests
          </h2>
          <StressTests />
        </div>
      </div>

      {/* Technical Comparison */}
      <div style={{
        marginTop: '30px',
        padding: '25px',
        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
        borderRadius: '12px',
        fontSize: '14px',
      }}>
        <h3 style={{ marginTop: 0 }}>💡 EOA vs Smart Account Technical Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <strong style={{ fontSize: '16px' }}>🦊 EOA (MetaMask, etc.)</strong>
            <ul style={{ margin: '15px 0 0 0', paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
              <li><strong>Type:</strong> Externally Owned Account</li>
              <li><strong>Control:</strong> Private key (secp256k1)</li>
              <li><strong>Signatures:</strong> ECDSA (recoverable)</li>
              <li><strong>Verification:</strong> Client-side ✅</li>
              <li><strong>Gas:</strong> User pays 💰</li>
              <li><strong>Wagmi:</strong> Native support 🎯</li>
              <li><strong>Security:</strong> Key = full control</li>
            </ul>
          </div>
          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <strong style={{ fontSize: '16px' }}>🦄 Unicorn (Smart Account)</strong>
            <ul style={{ margin: '15px 0 0 0', paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
              <li><strong>Type:</strong> Smart Contract (ERC-4337)</li>
              <li><strong>Control:</strong> Contract logic + key</li>
              <li><strong>Signatures:</strong> ERC-1271 (on-chain)</li>
              <li><strong>Verification:</strong> On-chain required 🔗</li>
              <li><strong>Gas:</strong> Sponsored (gasless!) ⚡</li>
              <li><strong>Wagmi:</strong> Via connector 🔌</li>
              <li><strong>Security:</strong> Programmable rules 🛡️</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Results Legend */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '12px',
        fontSize: '14px',
      }}>
        <h4 style={{ margin: '0 0 15px 0' }}>📊 Test Results Legend</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div><strong>✅ Pass:</strong> Function works correctly</div>
          <div><strong>❌ Fail:</strong> Function error or unexpected result</div>
          <div><strong>⏳ Pending:</strong> Test in progress</div>
          <div><strong>⚠️ Warning:</strong> Works but with caveats</div>
          <div><strong>ℹ️ Info:</strong> Additional context provided</div>
          <div><strong>🔄 Testing:</strong> Automated test running</div>
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
          
          {/* Autoconnect component for Unicorn portal */}
          <UnicornAutoConnect
            clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
            factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS}
            defaultChain="base"
            debug={true}
            onConnect={(wallet) => {
              console.log('✅ Unicorn autoconnected via component!', wallet);
            }}
            onError={(error) => {
              console.error('❌ Autoconnect failed:', error);
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}