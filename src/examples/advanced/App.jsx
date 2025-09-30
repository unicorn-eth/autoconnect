//Coded lovingly by @cryptowampum and Claude AI
// examples/advanced/App.jsx
// Advanced integration example - shows all features

import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, polygon, arbitrum } from 'wagmi/chains';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

// Import from the package
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn/autoconnect';

// Multi-chain Wagmi config
const config = getDefaultConfig({
  appName: 'Advanced Example',
  projectId: 'demo-project-id',
  chains: [base, polygon, arbitrum],
});

const queryClient = new QueryClient();

// Transaction component showing real usage
function TransactionDemo() {
  const wallet = useUniversalWallet();
  const { sendTransaction, isPending } = useSendTransaction();
  const [txStatus, setTxStatus] = useState('');

  const handleTransaction = async () => {
    if (!wallet.isConnected) {
      setTxStatus('❌ Please connect wallet');
      return;
    }

    setTxStatus('⏳ Processing...');

    try {
      if (wallet.isUnicorn) {
        // Unicorn wallet - gasless transaction
        console.log('🦄 Using Unicorn gasless transaction');
        // In real app: await wallet.unicornWallet.sendTransaction(tx)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTxStatus('✅ Gasless transaction complete!');
        
      } else if (wallet.isStandard) {
        // Standard wallet - real transaction
        await sendTransaction({
          to: wallet.address,
          value: parseEther('0.001'),
        });
        setTxStatus('✅ Transaction submitted!');
      }
    } catch (error) {
      setTxStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '20px'
    }}>
      <h3>Transaction Example</h3>
      <p style={{ color: '#64748b', fontSize: '14px' }}>
        {wallet.isUnicorn 
          ? '⚡ Gasless transactions enabled' 
          : '💸 Standard transactions (gas required)'}
      </p>

      <button
        onClick={handleTransaction}
        disabled={!wallet.isConnected || isPending}
        style={{
          background: wallet.isUnicorn ? '#8b5cf6' : '#0ea5e9',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: wallet.isConnected ? 'pointer' : 'not-allowed',
          marginTop: '16px'
        }}
      >
        {isPending ? '⏳ Processing...' : 'Send Demo Transaction'}
      </button>

      {txStatus && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: txStatus.includes('✅') ? '#dcfce7' : '#fee2e2',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {txStatus}
        </div>
      )}
    </div>
  );
}

// Wallet details component
function WalletDetails() {
  const wallet = useUniversalWallet();

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2>Advanced Integration Example</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '20px'
      }}>
        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4>Connection</h4>
          <p>{wallet.isConnected ? '✅ Connected' : '⚪ Disconnected'}</p>
        </div>

        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4>Wallet Type</h4>
          <p>
            {wallet.isUnicorn && '🦄 Unicorn'}
            {wallet.isStandard && '👛 Standard'}
            {!wallet.isConnected && 'None'}
          </p>
        </div>

        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4>Connector</h4>
          <p>{wallet.connector?.name || 'None'}</p>
        </div>
      </div>

      {wallet.isConnected && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <strong>Address:</strong><br/>
          {wallet.address}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <ConnectButton />
      </div>

      <TransactionDemo />
    </div>
  );
}

// Main App with all features
export default function App() {
  const [connectionLog, setConnectionLog] = useState([]);

  const logConnection = (message) => {
    setConnectionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message
    }]);
  };

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
              <h1>🦄 Advanced Integration Example</h1>
              <p>All features: Multi-chain, transactions, callbacks, debugging</p>
            </div>

            <WalletDetails />

            {/* Connection log */}
            {connectionLog.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '800px',
                margin: '20px auto'
              }}>
                <h3>Connection Log</h3>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {connectionLog.map((log, i) => (
                    <div key={i} style={{ padding: '4px 0' }}>
                      <span style={{ color: '#64748b' }}>[{log.time}]</span>{' '}
                      {log.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UnicornAutoConnect with all options */}
            <UnicornAutoConnect
              clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || "4e8c81182c3709ee441e30d776223354"}
              factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS || "0xD771615c873ba5a2149D5312448cE01D677Ee48A"}
              defaultChain="base"
              timeout={10000}
              debug={true}
              onConnect={(wallet) => {
                logConnection('✅ Unicorn wallet connected successfully');
                console.log('Wallet object:', wallet);
              }}
              onError={(error) => {
                logConnection(`❌ AutoConnect failed: ${error.message}`);
                console.error('Connection error:', error);
              }}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}