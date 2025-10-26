// src/examples/basic/src/components/WalletStatus.jsx
// Wallet connection status display

import { useUniversalWallet } from '../../../../hooks/useUniversalWallet.js';

export function WalletStatus() {
  const wallet = useUniversalWallet();

  return (
    <div style={{
      padding: '20px',
      background: wallet.isConnected ? '#d4edda' : '#f8d7da',
      borderRadius: '8px',
      marginBottom: '20px',
    }}>
      <h2>Wallet Status</h2>
      {wallet.isConnected ? (
        <>
          <p>✅ Connected</p>
          <p>
            <strong>Type:</strong> {wallet.isUnicorn ? '🦄 Unicorn (Gasless)' : '🦊 Standard EOA'}
          </p>
          <p>
            <strong>Address:</strong>{' '}
            <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {wallet.address}
            </code>
          </p>
          <p><strong>Chain ID:</strong> {wallet.chainId}</p>
          <p><strong>Connector:</strong> {wallet.connector?.name || 'Unknown'}</p>
          
          {wallet.isUnicorn && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#fff3cd',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              ⚡ <strong>Gasless transactions enabled!</strong> No gas fees for transactions.
            </div>
          )}
        </>
      ) : (
        <div>
          <p>❌ Not connected</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Click "Connect Wallet" to manually connect, or access via Unicorn portal for autoconnect.
          </p>
        </div>
      )}
    </div>
  );
}
