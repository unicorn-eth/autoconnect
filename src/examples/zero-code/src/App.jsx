//Coded lovingly by @cryptowampum and Claude AI
// examples/zero-code/App.jsx
// ULTRA SIMPLE - Just use pre-built components!

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

// Import from the package - that's it!
import { 
  UnicornAutoConnect,
  UnicornTransactionButton,
  UnicornSignButton,
  useUniversalWallet
} from '@unicorn/autoconnect';

const config = getDefaultConfig({
  appName: 'Zero Code Example',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base],
  ssr: false,
});

const queryClient = new QueryClient();

// Simple wallet info display
function WalletInfo() {
  const wallet = useUniversalWallet();

  if (!wallet.isConnected) {
    return (
      <div style={{
        padding: '20px',
        background: '#f3f4f6',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Connect your wallet to get started
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: wallet.isUnicorn ? '#f0f9ff' : '#f3f4f6',
      border: `2px solid ${wallet.isUnicorn ? '#0ea5e9' : '#d1d5db'}`,
      borderRadius: '12px',
      marginBottom: '30px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>
          {wallet.isUnicorn ? '🦄' : '💼'}
        </span>
        <div>
          <p style={{ 
            margin: 0, 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {wallet.connector?.name || 'Unknown'}
          </p>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            color: '#6b7280',
            fontFamily: 'monospace'
          }}>
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </p>
        </div>
      </div>
      
      {wallet.isUnicorn && (
        <div style={{
          padding: '8px 12px',
          background: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⚡</span>
          <span>Gasless transactions enabled</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // USDC transfer transaction (0.01 USDC on Base)
  const usdcTransaction = {
    to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    value: '0',
    data: '0xa9059cbb' + // transfer function signature
          '7049747E615a1C5C22935D5790a664B7E65D9681'.padStart(64, '0') + // recipient
          parseInt('10000').toString(16).padStart(64, '0'), // 0.01 USDC (6 decimals)
  };

  // ETH transfer transaction (0.001 ETH)
  const ethTransaction = {
    to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
    value: '1000000000000000', // 0.001 ETH in wei
    data: '0x',
  };

  // Sign message
  const message = "Welcome to my dApp!\n\nSign to verify ownership.\n\nTimestamp: " + Date.now();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
          }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              color: 'white',
              marginBottom: '40px'
            }}>
              <h1 style={{ 
                fontSize: '36px', 
                margin: '0 0 10px 0',
                fontWeight: '700'
              }}>
                🦄 Zero-Code Integration
              </h1>
              <p style={{ 
                margin: 0,
                fontSize: '18px',
                opacity: 0.9
              }}>
                Pre-built components • No custom code needed
              </p>
            </div>

            {/* Main Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              {/* Standard connect button */}
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <ConnectButton />
              </div>

              {/* Wallet info display */}
              <WalletInfo />

              {/* Transaction Buttons Section */}
              <div style={{
                padding: '24px',
                background: '#f9fafb',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  📤 Send Transactions
                </h3>

                {/* USDC Transaction */}
                <div style={{ marginBottom: '12px' }}>
                  <UnicornTransactionButton
                    transaction={usdcTransaction}
                    onSuccess={(result) => {
                      console.log('USDC transaction sent!', result);
                    }}
                    onError={(error) => {
                      console.error('Transaction failed:', error);
                    }}
                    style={{ width: '100%' }}
                  >
                    Send 0.01 USDC
                  </UnicornTransactionButton>
                </div>

                {/* ETH Transaction */}
                <div>
                  <UnicornTransactionButton
                    transaction={ethTransaction}
                    onSuccess={(result) => {
                      console.log('ETH transaction sent!', result);
                    }}
                    onError={(error) => {
                      console.error('Transaction failed:', error);
                    }}
                    style={{ width: '100%', background: '#0ea5e9' }}
                  >
                    Send 0.001 ETH
                  </UnicornTransactionButton>
                </div>
              </div>

              {/* Signing Section */}
              <div style={{
                padding: '24px',
                background: '#faf5ff',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  ✍️ Sign Message
                </h3>
                
                <UnicornSignButton
                  message={message}
                  onSuccess={(signature) => {
                    console.log('Message signed!', signature);
                  }}
                  onError={(error) => {
                    console.error('Signing failed:', error);
                  }}
                  style={{ width: '100%' }}
                >
                  Sign Verification Message
                </UnicornSignButton>
              </div>

              {/* Info Box */}
              <div style={{
                padding: '20px',
                background: '#f0f9ff',
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <p style={{ 
                  margin: '0 0 12px 0', 
                  fontWeight: '600', 
                  color: '#0c4a6e',
                  fontSize: '15px'
                }}>
                  ✨ Zero configuration needed!
                </p>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px', 
                  color: '#0c4a6e' 
                }}>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Unicorn users</strong>: Approval dialogs + gasless transactions
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Standard wallets</strong>: Normal wallet popups (MetaMask, etc.)
                  </li>
                  <li>
                    <strong>Works automatically</strong> with both wallet types!
                  </li>
                </ul>
              </div>

              {/* Code Sample */}
              <details style={{ marginTop: '20px' }}>
                <summary style={{
                  cursor: 'pointer',
                  padding: '12px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  📝 Show me the code
                </summary>
                <pre style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: '#1f2937',
                  color: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  overflow: 'auto',
                  lineHeight: '1.5'
                }}>
{`// Just import and use!
import {
  UnicornAutoConnect,
  UnicornTransactionButton,
  UnicornSignButton
} from '@unicorn/autoconnect';

// Add AutoConnect
<UnicornAutoConnect
  clientId={env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={env.VITE_THIRDWEB_FACTORY_ADDRESS}
  enableTransactionApproval={true}
/>

// Use pre-built buttons
<UnicornTransactionButton
  transaction={tx}
  onSuccess={(result) => console.log(result)}
>
  Send Transaction
</UnicornTransactionButton>

<UnicornSignButton
  message="Sign this"
  onSuccess={(sig) => console.log(sig)}
>
  Sign Message
</UnicornSignButton>`}
                </pre>
              </details>
            </div>

            {/* AutoConnect - just add this */}
            <UnicornAutoConnect
              clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || "4e8c81182c3709ee441e30d776223354"}
              factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS || "0xD771615c873ba5a2149D5312448cE01D677Ee48A"}
              enableTransactionApproval={true}
              debug={true}
            />

            {/* Footer */}
            <div style={{
              textAlign: 'center',
              marginTop: '40px',
              color: 'white',
              opacity: 0.8,
              fontSize: '14px'
            }}>
              <p style={{ margin: 0 }}>
                Built with @unicorn/autoconnect • Zero breaking changes
              </p>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}