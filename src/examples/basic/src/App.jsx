// src/examples/v1.1.2-test/src/App.jsx
// Comprehensive test for @unicorn.eth/autoconnect v1.1.2

import { useState } from 'react';
import { parseEther, formatEther } from 'viem';
import {
  useUniversalWallet,
  useUniversalTransaction,
  useUniversalSignMessage,
  UnicornAutoConnect,
} from '@unicorn.eth/autoconnect';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Wagmi config
const config = getDefaultConfig({
  appName: 'AutoConnect v1.1.2 Test',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base, polygon],
});

const queryClient = new QueryClient();

// Test token addresses on Base
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const WETH_BASE = '0x4200000000000000000000000000000000000006';

const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
];

function TestApp() {
  const wallet = useUniversalWallet();
  const tx = useUniversalTransaction();
  const sign = useUniversalSignMessage();

  const [testAddress] = useState('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [balance, setBalance] = useState(null);
  const [signature, setSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState(''); // Store the actual message signed
  const [lastResult, setLastResult] = useState('');

  // Test 1: Send ETH
  const handleSendETH = async () => {
    try {
      setLastResult('Sending 0.0001 ETH...');
      const result = await tx.sendTransactionAsync({
        to: testAddress,
        value: parseEther('0.0001'),
      });
      setLastResult(`✅ Sent! TX: ${result.transactionHash || result.hash}`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
    }
  };

  // Test 2: Read Token Balance
  const handleReadBalance = async () => {
    try {
      setLastResult('Reading USDC balance...');
      const bal = await tx.readContractAsync({
        address: USDC_BASE,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [wallet.address],
      });
      setBalance(formatEther(bal));
      setLastResult(`✅ Balance: ${formatEther(bal)} USDC`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
    }
  };

  // Test 3: Sign Message
  const handleSignMessage = async () => {
    const message = 'Testing AutoConnect v1.1.2!';
    try {
      setLastResult('Signing message...');
      const sig = await sign.signMessageAsync({ message });
      setSignature(sig);
      setSignedMessage(message); // Store for verification
      setLastResult(`✅ Signed! Sig: ${sig.slice(0, 20)}...`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
    }
  };

  // Test 4: Verify Signature
  const handleVerifySignature = async () => {
    if (!signature || !signedMessage) {
      setLastResult('❌ Sign a message first!');
      return;
    }
    try {
      setLastResult('Verifying signature...');
      const result = await sign.verifyMessage({
        message: signedMessage, // Use the stored message
        signature,
      });
      
      // Handle structured response (Option 4)
      if (typeof result === 'object') {
        if (result.isSmartAccount) {
          setLastResult(
            `⚠️ Smart Account Signature (${result.standard})\n` +
            `Cannot verify client-side. ${result.message}\n` +
            `Note: Signature IS valid on-chain.`
          );
        } else if (result.isValid) {
          setLastResult(`✅ Signature is valid! (${result.standard})`);
        } else {
          setLastResult(`❌ ${result.message}`);
        }
      } else {
        // Fallback for simple boolean response
        setLastResult(result ? '✅ Signature is valid!' : '❌ Signature is invalid!');
      }
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
    }
  };

  // Test 5: Sign Typed Data
  const handleSignTypedData = async () => {
    const message = {
      name: 'Test User',
      wallet: wallet.address,
    };
    try {
      setLastResult('Signing typed data...');
      const sig = await sign.signTypedDataAsync({
        domain: {
          name: 'Test App',
          version: '1',
          chainId: 8453, // Base
          verifyingContract: '0x0000000000000000000000000000000000000000',
        },
        types: {
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
        },
        primaryType: 'Person',
        message,
      });
      setSignature(sig);
      setSignedMessage(JSON.stringify(message)); // Store for reference
      setLastResult(`✅ Typed data signed! Sig: ${sig.slice(0, 20)}...`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🦄 AutoConnect v1.1.2 Test Suite</h1>

      {/* Wallet Status */}
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
            <p><strong>Type:</strong> {wallet.isUnicorn ? '🦄 Unicorn' : '🦊 Standard'}</p>
            <p><strong>Address:</strong> <code>{wallet.address}</code></p>
            <p><strong>Chain:</strong> {wallet.chain} (ID: {wallet.chainId})</p>
          </>
        ) : (
          <p>❌ Not connected. Please connect your wallet.</p>
        )}
      </div>

      {wallet.isConnected && (
        <>
          {/* Test Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
          }}>
            <button
              onClick={handleSendETH}
              disabled={tx.isPending}
              style={buttonStyle}
            >
              {tx.isPending ? '⏳...' : '💸 Send 0.0001 ETH'}
            </button>

            <button
              onClick={handleReadBalance}
              disabled={tx.isPending}
              style={buttonStyle}
            >
              {tx.isPending ? '⏳...' : '📖 Read USDC Balance'}
            </button>

            <button
              onClick={handleSignMessage}
              disabled={sign.isPending}
              style={buttonStyle}
            >
              {sign.isPending ? '⏳...' : '✍️ Sign Message'}
            </button>

            <button
              onClick={handleVerifySignature}
              disabled={!signature}
              style={buttonStyle}
            >
              ✅ Verify Signature
            </button>

            <button
              onClick={handleSignTypedData}
              disabled={sign.isPending}
              style={buttonStyle}
            >
              {sign.isPending ? '⏳...' : '📝 Sign Typed Data'}
            </button>
          </div>

          {/* Results */}
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            minHeight: '100px',
          }}>
            <h3>Results</h3>
            {lastResult ? (
              <p style={{ margin: 0, wordBreak: 'break-all' }}>{lastResult}</p>
            ) : (
              <p style={{ margin: 0, color: '#666' }}>Click a button above to test...</p>
            )}
          </div>

          {/* Test Info */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#fff3cd',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            <h4>ℹ️ Test Information</h4>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>Tests work with BOTH Unicorn and standard wallets</li>
              <li>Send ETH sends to: {testAddress.slice(0, 10)}...</li>
              <li>USDC contract: {USDC_BASE}</li>
              <li>Make sure you're on Base network</li>
              <li>All operations use minimal amounts</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: 'white',
  background: '#007bff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

// Main App with Providers
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TestApp />
          
          <UnicornAutoConnect
            clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
            factoryAddress={import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS}
            defaultChain="base"
            debug={true}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}