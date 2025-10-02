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
import { useSendTransaction, useSignMessage } from 'wagmi';
import { parseEther } from 'viem';

// Import from the package
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';

// Multi-chain Wagmi config
const config = getDefaultConfig({
  appName: 'Advanced Example',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base, polygon, arbitrum],
  ssr: false,
});

const queryClient = new QueryClient();

// Main content component showing unified wallet integration
function ExistingAppContent() {
  const wallet = useUniversalWallet();
  const { sendTransaction, isPending, data: hash, error } = useSendTransaction();
  const { signMessage: wagmiSignMessage, data: signatureData, isPending: isSignPending } = useSignMessage();
  
  return (
    <div className="content">
      <h2>Your Existing dApp</h2>
      
      <WalletStatusCard wallet={wallet} />
      <ExistingAppFeatures 
        wallet={wallet} 
        sendTransaction={sendTransaction}
        isPending={isPending}
        hash={hash}
        error={error}
        wagmiSignMessage={wagmiSignMessage}
        signatureData={signatureData}
        isSignPending={isSignPending}
      />
      <WalletConnectionControls wallet={wallet} />
    </div>
  );
}

// Wallet status display component
function WalletStatusCard({ wallet }) {
  return (
    <div style={{
      background: '#f0f9ff',
      border: '2px solid #0ea5e9',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h3>Wallet Status</h3>
      {wallet.isConnected ? (
        <div>
          <p>✅ Connected via {wallet.connector?.name}</p>
          <p style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </p>
          {wallet.isUnicorn && (
            <p style={{ color: '#8b5cf6', fontSize: '14px' }}>⚡ Gasless transactions enabled</p>
          )}
        </div>
      ) : (
        <p>⚪ Not connected</p>
      )}
    </div>
  );
}

// Example app functionality with transaction and signing demo
function ExistingAppFeatures({ wallet, sendTransaction, isPending, hash, error, wagmiSignMessage, signatureData, isSignPending }) {
  const [txStatus, setTxStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signStatus, setSignStatus] = useState('');
  const [isSigningLoading, setIsSigningLoading] = useState(false);

  // Watch for signature result from Wagmi
  React.useEffect(() => {
    if (signatureData) {
      setSignStatus(`✅ Message signed!\n\nSignature: ${signatureData.slice(0, 20)}...${signatureData.slice(-10)}`);
      setIsSigningLoading(false);
    }
  }, [signatureData]);

  const handleSignMessage = async () => {
    if (!wallet.isConnected) {
      setSignStatus('❌ Please connect a wallet first');
      return;
    }

    setIsSigningLoading(true);
    setSignStatus('');

    try {
      const message = "Sign this message to verify your wallet ownership.\n\nTimestamp: " + Date.now();
      
      console.log('📝 Signing message:', message);

      if (wallet.isUnicorn) {
        console.log('🦄 Attempting to sign with Unicorn wallet...');
        
        // Get the account
        const account = wallet.unicornWallet.getAccount?.();
        
        if (!account || !account.signMessage) {
          throw new Error('Account does not support message signing');
        }

        console.log('Account:', account);
        
        // Sign the message
        const signature = await account.signMessage({ message });
        
        console.log('✅ Signature:', signature);
        setSignStatus(`✅ Message signed!\n\nSignature: ${signature.slice(0, 20)}...${signature.slice(-10)}`);
        setIsSigningLoading(false);
        
      } else if (wallet.isStandard) {
        console.log('💼 Signing with standard wallet via Wagmi...');
        
        // Use Wagmi's signMessage hook for standard wallets
        wagmiSignMessage({ message });
        // Result will be handled by useEffect watching signatureData
      }
      
    } catch (error) {
      console.error('Signing error:', error);
      setSignStatus(`❌ Signing failed: ${error.message}`);
      setIsSigningLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!wallet.isConnected) {
      setTxStatus('❌ Please connect a wallet first');
      return;
    }

    setIsLoading(true);
    setTxStatus('Processing...');

    try {
      if (wallet.isUnicorn) {
        console.log('🦄 Sending USDC transaction...');

        // USDC contract on Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
        // ERC20 transfer function signature
        const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
        const RECIPIENT = '0x7049747E615a1C5C22935D5790a664B7E65D9681';
        const AMOUNT = '10000'; // 0.01 USDC (6 decimals)
        
        // ERC20 transfer(address,uint256) function signature
        const transferSignature = '0xa9059cbb';
        
        // Encode recipient address (padded to 32 bytes)
        const recipientEncoded = RECIPIENT.slice(2).padStart(64, '0');
        
        // Encode amount (padded to 32 bytes)
        const amountHex = parseInt(AMOUNT).toString(16).padStart(64, '0');
        
        // Complete calldata
        const data = transferSignature + recipientEncoded + amountHex;

        const tx = {
          to: USDC_ADDRESS,
          value: '0', // No ETH being sent
          data: data, // ERC20 transfer calldata
        };
        
        console.log('📤 Transaction:', tx);
        
        try {
          const result = await wallet.unicornWallet.sendTransaction(tx);
          console.log('✅ Transaction result:', result);
          setTxStatus(`✅ USDC sent! Hash: ${result.transactionHash || result.hash || 'pending'}`);
        } catch (txError) {
          console.error('Transaction error:', txError);
          if (txError.message.includes('rejected')) {
            setTxStatus('❌ Transaction rejected by user');
          } else {
            setTxStatus(`❌ Error: ${txError.message}`);
          }
        }
        
      } else if (wallet.isStandard) {
        // Standard wallet - real transaction
        console.log('💸 Using standard wallet');
        await sendTransaction({
          to: wallet.address,
          value: parseEther('0.001'),
        });
        setTxStatus('✅ Transaction submitted!');
      }
    } catch (error) {
      console.error('Top-level error:', error);
      setTxStatus(`❌ Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h3>Transaction & Signing Demo</h3>
      
      {/* Transaction Button */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>Send Transaction</h4>
        <button
          onClick={handleTransaction}
          disabled={!wallet.isConnected || isLoading || isPending}
          style={{
            background: wallet.isConnected ? '#0ea5e9' : '#94a3b8',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: wallet.isConnected ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {isLoading || isPending ? '⏳ Processing...' : 
            wallet.isUnicorn ? '🦄 Send 0.01 USDC (With Approval)' : 
            wallet.isStandard ? '💸 Send Demo Transaction' :
            'Connect Wallet First'}
        </button>

        {txStatus && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: txStatus.includes('✅') ? '#dcfce7' : '#fee2e2',
            borderRadius: '6px',
            fontSize: '14px',
            whiteSpace: 'pre-wrap'
          }}>
            {txStatus}
          </div>
        )}
      </div>

      {/* Signing Button */}
      <div style={{
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <h4 style={{ marginBottom: '10px' }}>Sign Message</h4>
        <button
          onClick={handleSignMessage}
          disabled={!wallet.isConnected || isSigningLoading || isSignPending}
          style={{
            background: wallet.isConnected ? '#8b5cf6' : '#94a3b8',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: wallet.isConnected ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {(isSigningLoading || isSignPending) ? '⏳ Signing...' : 
            wallet.isUnicorn ? '🦄 Sign Message (EIP-191)' : 
            wallet.isStandard ? '💼 Sign Message (MetaMask)' :
            'Connect Wallet First'}
        </button>

        {signStatus && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: signStatus.includes('✅') ? '#dcfce7' : '#fee2e2',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: signStatus.includes('Signature:') ? 'monospace' : 'inherit',
            whiteSpace: 'pre-wrap'
          }}>
            {signStatus}
          </div>
        )}
      </div>
    </div>
  );
}

// Wallet connection controls
function WalletConnectionControls({ wallet }) {
  const handleDisconnectUnicorn = () => {
    window.dispatchEvent(new CustomEvent('unicorn-wallet-disconnected'));
    window.location.href = window.location.pathname;
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {wallet.isUnicorn ? (
        <button
          onClick={handleDisconnectUnicorn}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Disconnect & Test Standard Wallets
        </button>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}

// Main App component
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
              <h1>🦄 Advanced Example</h1>
              <p>Transaction approval testing</p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <ExistingAppContent />
            </div>

            <UnicornAutoConnect
              clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || "4e8c81182c3709ee441e30d776223354"}
              factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS || "0xD771615c873ba5a2149D5312448cE01D677Ee48A"}
              defaultChain="base"
              enableTransactionApproval={true}
              debug={true}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}