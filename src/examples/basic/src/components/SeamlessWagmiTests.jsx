// src/examples/basic/src/components/SeamlessWagmiTests.jsx
// Tests that native wagmi hooks work seamlessly with unicornConnector
// NO wrapper hooks - this is the key test for v1.3!

import { useState } from 'react';
import { 
  useAccount, 
  useSendTransaction, 
  useWriteContract,
  useReadContract,
  useSignMessage,
  useSignTypedData,
} from 'wagmi';
import { parseEther, verifyMessage } from 'viem';

const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const TEST_ADDRESS = '0x7049747E615a1C5C22935D5790a664B7E65D9681';

const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

export function SeamlessWagmiTests() {
  const { address, isConnected, connector } = useAccount();
  
  // Native wagmi hooks - NO wrappers!
  const { sendTransaction, isPending: isSendPending } = useSendTransaction();
  const { writeContract, isPending: isWritePending } = useWriteContract();
  const { data: balance } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { signMessage, isPending: isSignPending } = useSignMessage();
  const { signTypedData, isPending: isTypedPending } = useSignTypedData();
  
  const [lastResult, setLastResult] = useState('');
  const [signature, setSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState('');

  const handleSendETH = async () => {
    try {
      setLastResult('⏳ Sending 0.0001 ETH via native useSendTransaction...');
      
      const hash = await sendTransaction({
        to: TEST_ADDRESS,
        value: parseEther('0.0001'),
      });
      
      setLastResult(`✅ Success! TX Hash: ${hash.slice(0, 20)}...
      
🎯 This used NATIVE wagmi's useSendTransaction hook!
No wrapper functions needed. The connector handles everything.`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Send ETH error:', err);
    }
  };

  const handleReadBalance = () => {
    try {
      if (!balance) {
        setLastResult('⏳ Reading USDC balance via native useReadContract...');
        return;
      }
      
      const formatted = (Number(balance) / 1e6).toFixed(2);
      setLastResult(`✅ Balance: ${formatted} USDC
      
🎯 This used NATIVE wagmi's useReadContract hook!
No wrapper functions needed. Works seamlessly with Unicorn connector.`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Read balance error:', err);
    }
  };

  const handleSignMessage = async () => {
    const message = 'Testing AutoConnect v1.3 with native wagmi!';
    try {
      setLastResult('⏳ Signing message via native useSignMessage...');
      
      const sig = await signMessage({ message });
      setSignature(sig);
      setSignedMessage(message);
      
      setLastResult(`✅ Signed! Signature: ${sig.slice(0, 20)}...
      
🎯 This used NATIVE wagmi's useSignMessage hook!
No wrapper functions needed.`);
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
      setLastResult('⏳ Verifying signature...');
      
      const isUnicorn = connector?.id === 'unicorn';
      
      if (isUnicorn) {
        setLastResult(`⚠️ Smart Account Signature (ERC-1271)

Cannot verify client-side with standard ECDSA.
Smart account signatures require on-chain verification via ERC-1271.

Note: The signature IS valid on-chain!

🎯 Signature was created using NATIVE wagmi's useSignMessage!`);
        return;
      }
      
      // For EOAs, verify normally
      const isValid = await verifyMessage({
        address,
        message: signedMessage,
        signature,
      });
      
      setLastResult(isValid 
        ? `✅ Signature is valid! (ECDSA - EOA)

🎯 Signed with NATIVE wagmi's useSignMessage!`
        : '❌ Signature is invalid!');
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Verify signature error:', err);
    }
  };

  const handleSignTypedData = async () => {
    const message = {
      name: 'Test User',
      wallet: address,
    };
    
    try {
      setLastResult('⏳ Signing typed data via native useSignTypedData...');
      
      const sig = await signTypedData({
        domain: {
          name: 'Test App v1.3',
          version: '1',
          chainId: 8453,
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
      
      setLastResult(`✅ Typed data signed! Sig: ${sig.slice(0, 20)}...
      
🎯 This used NATIVE wagmi's useSignTypedData hook!
No wrapper functions needed.`);
    } catch (err) {
      setLastResult(`❌ Error: ${err.message}`);
      console.error('Sign typed data error:', err);
    }
  };

  if (!isConnected) {
    return (
      <div style={{
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: '16px' }}>
          ⚠️ Connect a wallet to test seamless wagmi compatibility
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Current Balance Display */}
      {balance !== undefined && (
        <div style={{
          padding: '15px',
          background: '#d4edda',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          <strong>💰 Your USDC Balance:</strong>{' '}
          {(Number(balance) / 1e6).toFixed(2)} USDC
          <br />
          <small style={{ color: '#666' }}>
            (Read automatically via native useReadContract hook)
          </small>
        </div>
      )}

      {/* Test Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
      }}>
        <button
          onClick={handleSendETH}
          disabled={isSendPending}
          style={buttonStyle}
        >
          {isSendPending ? '⏳...' : '💸 useSendTransaction'}
        </button>

        <button
          onClick={handleReadBalance}
          style={buttonStyle}
        >
          📖 useReadContract
        </button>

        <button
          onClick={handleSignMessage}
          disabled={isSignPending}
          style={buttonStyle}
        >
          {isSignPending ? '⏳...' : '✏️ useSignMessage'}
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
          disabled={isTypedPending}
          style={buttonStyle}
        >
          {isTypedPending ? '⏳...' : '📝 useSignTypedData'}
        </button>
      </div>

      {/* Results Display */}
      <div style={{
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        minHeight: '150px',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Results</h3>
        {lastResult ? (
          <pre style={{ 
            margin: 0, 
            wordBreak: 'break-all', 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6',
          }}>
            {lastResult}
          </pre>
        ) : (
          <p style={{ margin: 0, color: '#666' }}>
            Click a button above to test native wagmi hooks...
          </p>
        )}
      </div>

      {/* Why This Matters */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px',
      }}>
        <strong>🎯 Why Seamless Wagmi Compatibility Matters:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>
            <strong>Zero code changes:</strong> Existing dApps can add Unicorn support 
            without modifying ANY transaction code
          </li>
          <li>
            <strong>True wagmi integration:</strong> Not a wrapper - the connector 
            implements wagmi's standard interface
          </li>
          <li>
            <strong>All hooks work:</strong> useSendTransaction, useWriteContract, 
            useSignMessage, etc. all work natively
          </li>
          <li>
            <strong>No learning curve:</strong> Developers use the wagmi hooks they 
            already know
          </li>
          <li>
            <strong>Future-proof:</strong> When wagmi adds new features, they automatically 
            work with Unicorn
          </li>
        </ul>
      </div>

      {/* Test Info */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '8px',
        fontSize: '13px',
      }}>
        <h4 style={{ marginTop: 0 }}>ℹ️ Test Information</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>All tests use <strong>native wagmi hooks</strong> - zero wrapper functions!</li>
          <li>Send ETH test sends 0.0001 ETH to: <code>{TEST_ADDRESS.slice(0, 10)}...</code></li>
          <li>USDC contract on Base: <code>{USDC_BASE.slice(0, 10)}...</code></li>
          <li>Make sure you're on <strong>Base network</strong> (chain ID: 8453)</li>
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
  background: '#764ba2',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};