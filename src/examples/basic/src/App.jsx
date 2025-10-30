// TestApp-v1.3-Complete.jsx
// Comprehensive test suite for @unicorn.eth/autoconnect v1.3
// Tests BOTH unicornConnector functions AND seamless wagmi integration
// Coded lovingly by @cryptowampum and Claude AI

import { useState, useEffect } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Standard Wagmi hooks - NO custom hooks!
import { 
  useAccount, 
  useSendTransaction, 
  useSignMessage,
  useSignTypedData,
  useSwitchChain,
  useDisconnect,
  useBalance,
  useReadContract,
  useWriteContract,
  useWatchAsset
} from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Import connector and component
import { unicornConnector } from '../../../connectors/unicornConnector.js';
import UnicornAutoConnect from '../../../components/UnicornAutoConnect.jsx';

// Test constants
const TEST_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

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
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
  }
];
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const factoryAddress = import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS; 
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
console.debug('WALLETCONNECT_PROJECT_ID:', walletConnectProjectId);
console.debug('THIRDWEB_CLIENT_ID:', clientId);
console.debug('THIRDWEB_FACTORY_ADDRESS:', factoryAddress);

// Wagmi config
const config = createConfig({
  chains: [base, polygon],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: walletConnectProjectId|| 'b68c5c018517f32dc678237299644367',
    }),
    unicornConnector({
      clientId: clientId,
      factoryAddress: factoryAddress,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

// ============================================================================
// TEST COMPONENTS - Each tests a specific wagmi hook
// ============================================================================

function WalletStatus() {
  const { address, isConnected, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div style={cardStyle}>
      <h3>🎯 Test 1: Wallet Connection (useAccount)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.connect(), connector.getAccount(), connector.getChainId()</p>
        <p><strong>Expected:</strong> Should auto-connect via URL params, show Unicorn wallet info</p>
      </div>
      {isConnected ? (
        <div style={successStyle}>
          <p>✅ Connected: {address?.slice(0, 10)}...{address?.slice(-8)}</p>
          <p>🔗 Chain: {chain?.name} (ID: {chain?.id})</p>
          <p>🔌 Connector: {connector?.name}</p>
          <p>🦄 Is Unicorn: {connector?.id === 'unicorn' ? 'Yes' : 'No'}</p>
          <button onClick={() => disconnect()} style={buttonStyle}>
            Disconnect
          </button>
        </div>
      ) : (
        <div style={warningStyle}>
          <p>❌ Not connected</p>
          <p>Use ConnectButton or add URL params: ?walletId=inApp&authCookie=test</p>
        </div>
      )}
    </div>
  );
}



function BalanceTest() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading, refetch } = useBalance({
    address,
    enabled: isConnected,
  });

  return (
    <div style={cardStyle}>
      <h3>💰 Test 2: Balance Check (useBalance)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.getProvider() for RPC calls</p>
        <p><strong>Expected:</strong> Should fetch ETH balance seamlessly</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : isLoading ? (
        <p>⏳ Loading balance...</p>
      ) : (
        <div style={successStyle}>
          <p>✅ Balance: {formatEther(balance?.value || 0n)} {balance?.symbol}</p>
          <button onClick={() => refetch()} style={buttonStyle}>
            Refresh Balance
          </button>
        </div>
      )}
    </div>
  );
}

function SendTransactionTest() {
  const { isConnected, connector } = useAccount();
  const { sendTransaction, isPending, isSuccess, isError, data, error } = useSendTransaction();
  const [lastTx, setLastTx] = useState('');

  // Watch for transaction success/error and update display
  useEffect(() => {
    if (isSuccess && data) {
      setLastTx(`✅ Success! TX: ${data}`);
    }
    if (isError && error) {
      setLastTx(`❌ Error: ${error.message}`);
    }
  }, [isSuccess, isError, data, error]);

  const handleSend = async () => {
    try {
      setLastTx('⏳ Waiting for approval...');
      await sendTransaction({
        to: TEST_ADDRESS,
        value: parseEther('0.0001'),
      });
      // Don't set success here - the useEffect above will handle it
    } catch (err) {
      // This catches user rejection before the transaction is sent
      setLastTx(`❌ ${err.message}`);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>💸 Test 3: Send Transaction (useSendTransaction)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.sendTransaction() with approval dialog</p>
        <p><strong>Expected:</strong> Should show approval dialog for Unicorn, wallet popup for others</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : (
        <>
          <button 
            onClick={handleSend} 
            disabled={isPending}
            style={buttonStyle}
          >
            {isPending ? '⏳ Sending...' : '💸 Send 0.0001 ETH'}
          </button>
          {connector?.id === 'unicorn' && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              ⚡ Unicorn: Gasless transaction - approval dialog will show
            </p>
          )}
          {lastTx && (
            <div style={{ 
              marginTop: '12px', 
              fontSize: '14px',
              padding: '12px',
              background: lastTx.includes('✅') ? '#dcfce7' : lastTx.includes('❌') ? '#fee2e2' : '#f3f4f6',
              borderRadius: '8px',
              border: `2px solid ${lastTx.includes('✅') ? '#16a34a' : lastTx.includes('❌') ? '#dc2626' : '#d1d5db'}`,
            }}>
              <pre style={{ 
                wordBreak: 'break-all', 
                whiteSpace: 'pre-wrap',
                margin: 0,
                color: lastTx.includes('✅') ? '#166534' : lastTx.includes('❌') ? '#991b1b' : '#374151',
              }}>
                {lastTx}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReadContractTest() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading, refetch, isError, error } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!address,
  });

  return (
    <div style={cardStyle}>
      <h3>📖 Test 4: Read Contract (useReadContract)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.getProvider() for contract reads</p>
        <p><strong>Expected:</strong> Should read USDC balance without issues</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : isLoading ? (
        <p>⏳ Reading contract...</p>
      ) : isError ? (
        <div style={errorStyle}>
          Error: {error?.message}
        </div>
      ) : (
        <div style={successStyle}>
          <p>✅ USDC Balance: {(Number(balance || 0n) / 1e6).toFixed(2)} USDC</p>
          <button onClick={() => refetch()} style={buttonStyle}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

function WriteContractTest() {
  const { isConnected, connector } = useAccount();
  const { writeContract, isPending, isSuccess, isError, error, data } = useWriteContract();
  const [lastResult, setLastResult] = useState('');

  // Watch for transaction success/error and update display
  useEffect(() => {
    if (isSuccess && data) {
      setLastResult(`✅ Success! TX: ${data}`);
    }
    if (isError && error) {
      setLastResult(`❌ Error: ${error.message}`);
    }
  }, [isSuccess, isError, data, error]);

  const handleWrite = async () => {
    try {
      setLastResult('⏳ Waiting for approval...');
      await writeContract({
        address: USDC_BASE,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [TEST_ADDRESS, 1000000], // 1 USDC (6 decimals)
      });
      // Don't set success here - the useEffect above will handle it
    } catch (err) {
      // This catches user rejection before the transaction is sent
      setLastResult(`❌ ${err.message}`);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>✏️ Test 5: Write Contract (useWriteContract)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.sendTransaction() for contract calls</p>
        <p><strong>Expected:</strong> Should encode function data and send transaction</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : (
        <>
          <button 
            onClick={handleWrite} 
            disabled={isPending}
            style={buttonStyle}
          >
            {isPending ? '⏳ Writing...' : '✏️ Transfer 1 USDC'}
          </button>
          {connector?.id === 'unicorn' && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              ⚡ Unicorn: Gasless transaction
            </p>
          )}
          {lastResult && (
            <div style={{ 
              marginTop: '12px', 
              fontSize: '14px',
              padding: '12px',
              background: lastResult.includes('✅') ? '#dcfce7' : lastResult.includes('❌') ? '#fee2e2' : '#f3f4f6',
              borderRadius: '8px',
              border: `2px solid ${lastResult.includes('✅') ? '#16a34a' : lastResult.includes('❌') ? '#dc2626' : '#d1d5db'}`,
            }}>
              <pre style={{ 
                wordBreak: 'break-all', 
                whiteSpace: 'pre-wrap',
                margin: 0,
                color: lastResult.includes('✅') ? '#166534' : lastResult.includes('❌') ? '#991b1b' : '#374151',
              }}>
                {lastResult}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SignMessageTest() {
  const { isConnected, connector } = useAccount();
  const { signMessage, isPending, isSuccess, data, error, isError } = useSignMessage();
  const [message] = useState('Testing AutoConnect v1.3!');
  const [signature, setSignature] = useState('');

  const handleSign = async () => {
    try {
      const sig = await signMessage({ message });
      setSignature(sig);
    } catch (err) {
      console.error('Sign error:', err);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>✍️ Test 6: Sign Message (useSignMessage)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.signMessage()</p>
        <p><strong>Expected:</strong> Should sign with ERC-1271 for Unicorn, ECDSA for others</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : (
        <>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>
            Message: "{message}"
          </p>
          <button 
            onClick={handleSign} 
            disabled={isPending}
            style={buttonStyle}
          >
            {isPending ? '⏳ Signing...' : '✍️ Sign Message'}
          </button>
          {signature && (
            <div style={successStyle}>
              <p>✅ Signed!</p>
              <p style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {signature.slice(0, 20)}...{signature.slice(-20)}
              </p>
              {connector?.id === 'unicorn' && (
                <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '8px' }}>
                  ⚠️ Smart Account: Uses ERC-1271 (on-chain verification required)
                </p>
              )}
            </div>
          )}
          {isError && (
            <div style={errorStyle}>
              Error: {error?.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SignTypedDataTest() {
  const { address, isConnected, connector } = useAccount();
  const { signTypedData, isPending, data, isError, error } = useSignTypedData();
  const [signature, setSignature] = useState('');

  const handleSign = async () => {
    try {
      const sig = await signTypedData({
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
        message: {
          name: 'Test User',
          wallet: address,
        },
      });
      setSignature(sig);
    } catch (err) {
      console.error('Sign typed data error:', err);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>📝 Test 7: Sign Typed Data (useSignTypedData)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.signTypedData()</p>
        <p><strong>Expected:</strong> Should sign EIP-712 typed data</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : (
        <>
          <button 
            onClick={handleSign} 
            disabled={isPending}
            style={buttonStyle}
          >
            {isPending ? '⏳ Signing...' : '📝 Sign Typed Data'}
          </button>
          {signature && (
            <div style={successStyle}>
              <p>✅ Signed!</p>
              <p style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {signature.slice(0, 20)}...{signature.slice(-20)}
              </p>
            </div>
          )}
          {isError && (
            <div style={errorStyle}>
              Error: {error?.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SwitchChainTest() {
  const { chain, isConnected, connector } = useAccount();
  const { chains, switchChain, isPending, isSuccess, isError, error } = useSwitchChain();

  return (
    <div style={cardStyle}>
      <h3>🔄 Test 8: Switch Chain (useSwitchChain)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.switchChain()</p>
        <p><strong>Expected:</strong> Should switch between Base and Polygon</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : (
        <>
          <p style={{ marginBottom: '12px' }}>
            Current Chain: <strong>{chain?.name}</strong> (ID: {chain?.id})
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {chains.map((c) => (
              <button
                key={c.id}
                onClick={() => switchChain({ chainId: c.id })}
                disabled={isPending || c.id === chain?.id}
                style={{
                  ...buttonStyle,
                  opacity: c.id === chain?.id ? 0.5 : 1,
                }}
              >
                {isPending ? '⏳...' : `Switch to ${c.name}`}
              </button>
            ))}
          </div>
          {isError && (
            <div style={errorStyle}>
              Error: {error?.message}
            </div>
          )}
          {isSuccess && (
            <p style={successStyle}>✅ Chain switched successfully!</p>
          )}
        </>
      )}
    </div>
  );
}

function WatchAssetTest() {
  const { isConnected } = useAccount();
  const { watchAsset, isPending, isSuccess, isError, error } = useWatchAsset();

  const handleWatch = async () => {
    try {
      await watchAsset({
        type: 'ERC20',
        options: {
          address: USDC_BASE,
          symbol: 'USDC',
          decimals: 6,
        },
      });
    } catch (err) {
      console.error('Watch asset error:', err);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>👁️ Test 9: Watch Asset (useWatchAsset)</h3>
      <div style={testInfoStyle}>
        <p><strong>Tests:</strong> connector.watchAsset()</p>
        <p><strong>Expected:</strong> Should add USDC to wallet (if supported)</p>
      </div>
      {!isConnected ? (
        <p style={warningStyle}>⚠️ Connect wallet first</p>
      ) : (
        <>
          <button 
            onClick={handleWatch} 
            disabled={isPending}
            style={buttonStyle}
          >
            {isPending ? '⏳ Adding...' : '👁️ Add USDC to Wallet'}
          </button>
          {isSuccess && (
            <p style={successStyle}>✅ Asset added (or already exists)</p>
          )}
          {isError && (
            <div style={errorStyle}>
              Error: {error?.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN TEST APP
// ============================================================================

function TestApp() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>🦄 AutoConnect v1.3 - Complete Test Suite</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Tests ALL connector functions using standard Wagmi hooks - zero custom code!
        </p>
      </header>

      {/* Connect Section */}
      <div style={{ ...cardStyle, background: '#e3f2fd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>🔌 Connect Wallet</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              Use RainbowKit or URL params: <code>?walletId=inApp&authCookie=test</code>
            </p>
          </div>
          <ConnectButton />
        </div>
      </div>

      {/* Core Tests */}
      <div style={{ marginTop: '20px' }}>
        <h2>🎯 Core Functionality Tests</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <WalletStatus />
          <BalanceTest />
          <SendTransactionTest />
          <ReadContractTest />
          <WriteContractTest />
        </div>
      </div>

      {/* Advanced Tests */}
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ ...buttonStyle, width: '100%' }}
        >
          {showAdvanced ? '▼' : '▶'} Advanced Tests (Signing & Chain Management)
        </button>
        {showAdvanced && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
            <SignMessageTest />
            <SignTypedDataTest />
            <SwitchChainTest />
            <WatchAssetTest />
          </div>
        )}
      </div>

      {/* Test Info */}
      <div style={{ ...cardStyle, background: '#fff3cd', marginTop: '30px' }}>
        <h3>ℹ️ Test Information</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '14px' }}>
          <li><strong>Zero custom code:</strong> All tests use standard <code>wagmi</code> hooks</li>
          <li><strong>Seamless integration:</strong> Unicorn wallet works exactly like MetaMask</li>
          <li><strong>Approval dialogs:</strong> Unicorn shows approval UI, others use native popups</li>
          <li><strong>Gasless transactions:</strong> All Unicorn transactions are gasless</li>
          <li><strong>Smart account signatures:</strong> Uses ERC-1271 (requires on-chain verification)</li>
          <li>Test on <strong>Base network</strong> (chain ID: 8453)</li>
          <li>All tests send minimal amounts (0.0001 ETH, 1 USDC)</li>
        </ul>
      </div>

      {/* Architecture Comparison */}
      <div style={{ ...cardStyle, background: '#d4edda', marginTop: '20px' }}>
        <h3>✅ v1.3 Architecture Success</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          <div>
            <h4>❌ Old Approach (v1.2)</h4>
            <pre style={{ background: '#fee', padding: '10px', borderRadius: '4px' }}>
{`import { useUniversalTransaction } from '@unicorn/autoconnect';

const tx = useUniversalTransaction();
await tx.sendTransaction(...);
// ^ Custom hook required`}
            </pre>
          </div>
          <div>
            <h4>✅ New Approach (v1.3)</h4>
            <pre style={{ background: '#efe', padding: '10px', borderRadius: '4px' }}>
{`import { useSendTransaction } from 'wagmi';

const { sendTransaction } = useSendTransaction();
await sendTransaction(...);
// ^ Standard wagmi hook!`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// APP WRAPPER WITH PROVIDERS
// ============================================================================

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* AutoConnect component for URL-based connection */}
          <UnicornAutoConnect
            debug={true}
            onConnect={(wallet) => console.log('✅ Unicorn autoconnected!', wallet)}
            onError={(error) => console.error('❌ Autoconnect failed:', error)}
          />
          <TestApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const cardStyle = {
  padding: '20px',
  background: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: '15px',
};

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

const successStyle = {
  padding: '12px',
  background: '#d4edda',
  borderRadius: '6px',
  marginTop: '12px',
  fontSize: '14px',
};

const warningStyle = {
  padding: '12px',
  background: '#fff3cd',
  borderRadius: '6px',
  marginTop: '12px',
  fontSize: '14px',
  color: '#856404',
};

const errorStyle = {
  padding: '12px',
  background: '#f8d7da',
  borderRadius: '6px',
  marginTop: '12px',
  fontSize: '14px',
  color: '#721c24',
};

const testInfoStyle = {
  padding: '10px',
  background: '#e3f2fd',
  borderRadius: '4px',
  marginBottom: '12px',
  fontSize: '13px',
  color: '#1565c0',
};