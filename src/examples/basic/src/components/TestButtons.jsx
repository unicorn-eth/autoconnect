// src/examples/basic/src/components/TestButtons.jsx
// Test suite component for AutoConnect functionality

import { useState } from 'react';
import { parseEther } from 'viem';
import {
  useUniversalWallet
} from '../../../../hooks/useUniversalWallet.js';
import {
  useUniversalTransaction
} from '../../../../hooks/useUniversalTransaction.js';
import {
  useUniversalSignMessage
} from '../../../../hooks/useUniversalSignMessage.js';

const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const TEST_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

export function TestButtons() {
  const wallet = useUniversalWallet();
  const tx = useUniversalTransaction();
  const sign = useUniversalSignMessage();

  const [lastResult, setLastResult] = useState('');
  const [signature, setSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState('');

  const handleSendETH = async () => {
    try {
      setLastResult('Sending 0.0001 ETH...');
      const result = await tx.sendTransactionAsync({
        to: TEST_ADDRESS,
        value: parseEther('0.0001'),
      });
      setLastResult(`✅ Sent! TX: ${result.transactionHash || result.hash || 'completed'}`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Send ETH error:', err);
    }
  };

  const handleReadBalance = async () => {
    try {
      setLastResult('Reading USDC balance...');
      const bal = await tx.readContractAsync({
        address: USDC_BASE,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [wallet.address],
      });
      const formatted = (Number(bal) / 1e6).toFixed(2);
      setLastResult(`✅ Balance: ${formatted} USDC`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Read balance error:', err);
    }
  };

  const handleSignMessage = async () => {
    const message = 'Testing AutoConnect v1.2.0!';
    try {
      setLastResult('Signing message...');
      const sig = await sign.signMessageAsync({ message });
      setSignature(sig);
      setSignedMessage(message);
      setLastResult(`✅ Signed! Sig: ${sig.slice(0, 20)}...`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Sign message error:', err);
    }
  };

  const handleVerifySignature = async () => {
    if (!signature || !signedMessage) {
      setLastResult('❌ Sign a message first!');
      return;
    }
    try {
      setLastResult('Verifying signature...');
      const result = await sign.verifyMessage({
        message: signedMessage,
        signature,
      });
      
      if (typeof result === 'object') {
        if (result.isSmartAccount) {
          setLastResult(
            `⚠️ Smart Account Signature (${result.standard})\n` +
            `Cannot verify client-side. ${result.message}\n` +
            `Note: Signature IS valid on-chain via ERC-1271.`
          );
        } else if (result.isValid) {
          setLastResult(`✅ Signature is valid! (${result.standard} - EOA)`);
        } else {
          setLastResult(`❌ ${result.message}`);
        }
      } else {
        setLastResult(result ? '✅ Signature is valid!' : '❌ Signature is invalid!');
      }
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Verify signature error:', err);
    }
  };

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
      setSignedMessage(JSON.stringify(message));
      setLastResult(`✅ Typed data signed! Sig: ${sig.slice(0, 20)}...`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Sign typed data error:', err);
    }
  };

  if (!wallet.isConnected) {
    return null;
  }

  return (
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
          {sign.isPending ? '⏳...' : '✏️ Sign Message'}
        </button>

        <button
          onClick={handleVerifySignature}
          disabled={!signature}
          style={{...buttonStyle, opacity: !signature ? 0.5 : 1}}
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
          <pre style={{ 
            margin: 0, 
            wordBreak: 'break-all', 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            {lastResult}
          </pre>
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
          <li><strong>Universal hooks work with ALL wallet types</strong> - same code for EOA and smart accounts</li>
          <li>Send ETH test sends to: <code>{TEST_ADDRESS.slice(0, 10)}...{TEST_ADDRESS.slice(-8)}</code></li>
          <li>USDC contract on Base: <code>{USDC_BASE.slice(0, 10)}...</code></li>
          <li>Make sure you're on <strong>Base network</strong> (chain ID: 8453)</li>
          <li>All operations use minimal amounts (0.0001 ETH)</li>
          <li>🦄 Unicorn wallets = gasless transactions</li>
          <li>🦊 Standard wallets = normal gas fees apply</li>
        </ul>
      </div>
    </>
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
  transition: 'opacity 0.2s',
};
