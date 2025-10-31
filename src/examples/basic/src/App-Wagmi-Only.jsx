// App-Wagmi-Only.jsx
// Pure wagmi implementation - NO RainbowKit
// Demonstrates minimal AutoConnect integration with standard wagmi hooks

import { useState, useEffect } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon, mainnet, gnosis } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSignMessage,
  useSwitchChain,
  useBalance,
  usePublicClient,
} from 'wagmi';
import { parseEther, formatEther, formatUnits } from 'viem';

// Production imports (for Vercel deployment)
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';

// Development imports (uncomment for local development)
// import { unicornConnector } from '../../../connectors/unicornConnector.js';
// import UnicornAutoConnect from '../../../components/UnicornAutoConnect.jsx';

// Configuration
const RECIPIENT_ADDRESS = '0x7049747E615a1C5C22935D5790a664B7E65D9681';

const config = createConfig({
  chains: [base, polygon, mainnet, gnosis],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'b68c5c018517f32dc678237299644367',
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
    [mainnet.id]: http(),
    [gnosis.id]: http(),
  },
});

const queryClient = new QueryClient();

// Utility function for Alchemy network mapping
const getAlchemyNetwork = (chainId) => {
  const networkMap = {
    8453: 'base-mainnet',
    137: 'polygon-mainnet',
    1: 'eth-mainnet',
    100: 'gnosis-mainnet',
    10: 'opt-mainnet',
    42161: 'arb-mainnet',
  };
  return networkMap[chainId] || 'base-mainnet';
};

// ============================================================================
// COMPONENTS
// ============================================================================

function ConnectWallet() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button onClick={() => disconnect()} style={styles.disconnectButton}>
        Disconnect
      </button>
    );
  }

  return (
    <div style={styles.connectSection}>
      <h3 style={styles.sectionTitle}>Connect Your Wallet</h3>
      <div style={styles.connectorGrid}>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            style={styles.connectorButton}
          >
            {connector.name}
            {connector.id === 'unicorn' && ' 🦄'}
          </button>
        ))}
      </div>
    </div>
  );
}

function WalletInfo() {
  const { address, isConnected, connector, chain } = useAccount();
  const { data: balance } = useBalance({ address, enabled: isConnected });
  const { disconnect } = useDisconnect();

  if (!isConnected) return null;

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Wallet Info</h2>
      <div style={styles.infoGrid}>
        <div style={styles.infoRow}>
          <span style={styles.label}>Address:</span>
          <span style={styles.value}>{address?.slice(0, 10)}...{address?.slice(-8)}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Network:</span>
          <span style={styles.value}>{chain?.name}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Balance:</span>
          <span style={styles.value}>
            {balance ? `${formatEther(balance.value).slice(0, 8)} ${balance.symbol}` : 'Loading...'}
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Wallet:</span>
          <span style={styles.value}>{connector?.name}</span>
        </div>
      </div>
      <button onClick={() => disconnect()} style={styles.disconnectButton}>
        Disconnect Wallet
      </button>
    </div>
  );
}

function NetworkSwitcher() {
  const { chain, isConnected } = useAccount();
  const { chains, switchChain, isPending } = useSwitchChain();

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Switch Network</h2>
        <p style={styles.disabledText}>Connect wallet to switch networks</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Switch Network</h2>
      <p style={styles.currentNetwork}>Current: <strong>{chain?.name}</strong></p>
      <div style={styles.networkGrid}>
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => switchChain({ chainId: c.id })}
            disabled={isPending || c.id === chain?.id}
            style={{
              ...styles.networkButton,
              ...(c.id === chain?.id && styles.networkButtonActive),
            }}
          >
            {c.id === chain?.id ? '✓ ' : ''}{c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SendTransaction() {
  const { isConnected, connector } = useAccount();
  const { sendTransaction, isPending, isSuccess, isError, error, data: txHash } = useSendTransaction();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isSuccess && txHash) {
      console.log('✅ Transaction successful:', txHash);
    }
  }, [isSuccess, txHash]);

  useEffect(() => {
    if (isError && error) {
      console.error('❌ Transaction error:', error);
      let message = error.message || 'Transaction failed';
      if (message.includes('insufficient funds')) {
        message = 'Insufficient funds. You need more ETH in your wallet.';
      } else if (message.includes('User rejected')) {
        message = 'Transaction was rejected by user.';
      } else if (message.includes('Execution Reverted')) {
        message = 'Transaction failed: Not enough ETH to cover gas fees.';
      }
      setErrorMessage(message);
    }
  }, [isError, error]);

  const handleSend = async () => {
    try {
      setErrorMessage('');
      await sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: parseEther('0.0001'),
      });
    } catch (err) {
      console.error('Send transaction error:', err);
    }
  };

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Send Transaction</h2>
        <p style={styles.disabledText}>Connect wallet to send transactions</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Send Transaction</h2>
      <p style={styles.description}>Send 0.0001 ETH to test address</p>

      {connector?.id === 'unicorn' && (
        <div style={styles.tipBox}>
          💡 Unicorn wallet = gasless transaction!
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={isPending}
        style={{
          ...styles.primaryButton,
          ...(isPending && styles.buttonDisabled),
        }}
      >
        {isPending ? '⏳ Sending...' : '💸 Send 0.0001 ETH'}
      </button>

      {isPending && !isError && (
        <p style={styles.statusBox}>⏳ Confirm in your wallet...</p>
      )}

      {isSuccess && txHash && (
        <div style={styles.successBox}>
          <p>✅ Transaction sent!</p>
          <p style={styles.txHash}>TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
        </div>
      )}

      {isError && errorMessage && (
        <div style={styles.errorBox}>
          <p>❌ {errorMessage}</p>
        </div>
      )}
    </div>
  );
}

function SignMessage() {
  const { isConnected } = useAccount();
  const { signMessage, isPending, data: signature } = useSignMessage();
  const [message] = useState('Hello from wagmi + AutoConnect!');

  const handleSign = async () => {
    try {
      await signMessage({ message });
    } catch (err) {
      console.error('Sign error:', err);
    }
  };

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Sign Message</h2>
        <p style={styles.disabledText}>Connect wallet to sign messages</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Sign Message</h2>
      <p style={styles.description}>Message: "{message}"</p>

      <button
        onClick={handleSign}
        disabled={isPending}
        style={{
          ...styles.primaryButton,
          ...(isPending && styles.buttonDisabled),
        }}
      >
        {isPending ? '⏳ Signing...' : '✍️ Sign Message'}
      </button>

      {signature && (
        <div style={styles.successBox}>
          <p>✅ Message signed!</p>
          <details style={styles.details}>
            <summary style={styles.detailsSummary}>View signature</summary>
            <p style={styles.signature}>
              {signature.slice(0, 30)}...{signature.slice(-30)}
            </p>
          </details>
        </div>
      )}
    </div>
  );
}

function TokenBalances() {
  const { address, isConnected, chain } = useAccount();
  const [tokenBalances, setTokenBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkBalances = async () => {
    console.log('[TokenBalance] Starting check...', { address, chainId: chain?.id });

    if (!address || !chain) return;

    const alchemyKey = import.meta.env.VITE_ALCHEMY_ID;
    console.log('[TokenBalance] Alchemy key present:', !!alchemyKey);

    if (!alchemyKey) {
      setError('Requires VITE_ALCHEMY_ID in .env file');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const alchemyNetwork = getAlchemyNetwork(chain.id);
      const url = `https://${alchemyNetwork}.g.alchemy.com/v2/${alchemyKey}`;

      console.log('[TokenBalance] Fetching from:', alchemyNetwork);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address, 'erc20'],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      console.log('[TokenBalance] Response:', data);

      if (data.result?.tokenBalances) {
        const balances = [];

        for (const tokenData of data.result.tokenBalances) {
          const balance = BigInt(tokenData.tokenBalance || '0');

          if (balance > 0n) {
            try {
              const metadataResponse = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'alchemy_getTokenMetadata',
                  params: [tokenData.contractAddress],
                  id: 1,
                }),
              });

              const metadataData = await metadataResponse.json();
              const metadata = metadataData.result;
              const formatted = formatUnits(balance, metadata.decimals || 18);

              balances.push({
                symbol: metadata.symbol || 'UNKNOWN',
                balance: formatted,
              });

              console.log(`[TokenBalance] Found ${metadata.symbol}:`, formatted);
            } catch (metaErr) {
              console.error('[TokenBalance] Error fetching metadata:', metaErr);
            }
          }
        }

        setTokenBalances(balances);
      } else {
        setTokenBalances([]);
      }
    } catch (err) {
      console.error('[TokenBalance] Error:', err);
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isConnected && chain) {
      checkBalances();
    }
  }, [isConnected, address, chain]);

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Token Balances</h2>
        <p style={styles.disabledText}>Connect wallet to view tokens</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Token Balances</h2>

      <button
        onClick={checkBalances}
        disabled={loading}
        style={{
          ...styles.primaryButton,
          ...(loading && styles.buttonDisabled),
        }}
      >
        {loading ? '⏳ Loading...' : '🔄 Refresh Balances'}
      </button>

      {error && <p style={styles.errorBox}>{error}</p>}

      {tokenBalances.length > 0 ? (
        <div style={styles.tokenList}>
          {tokenBalances.map((token, idx) => (
            <div key={idx} style={styles.tokenItem}>
              <span style={styles.tokenSymbol}>{token.symbol}</span>
              <span style={styles.tokenBalance}>{parseFloat(token.balance).toFixed(4)}</span>
            </div>
          ))}
        </div>
      ) : loading ? (
        <p style={styles.statusBox}>⏳ Checking balances...</p>
      ) : (
        <p style={styles.statusBox}>No tokens found</p>
      )}
    </div>
  );
}

function NFTBalances() {
  const { address, isConnected, chain } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNFTs = async () => {
    console.log('[NFT] Starting fetch...', { address, chainId: chain?.id });

    if (!address || !chain) return;

    const alchemyKey = import.meta.env.VITE_ALCHEMY_ID;
    console.log('[NFT] Alchemy key present:', !!alchemyKey);

    if (!alchemyKey) {
      setError('Requires VITE_ALCHEMY_ID in .env file');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const alchemyNetwork = getAlchemyNetwork(chain.id);
      const url = `https://${alchemyNetwork}.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=20`;
      console.log('[NFT] Fetching from network:', alchemyNetwork);

      const response = await fetch(url);
      console.log('[NFT] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[NFT] Alchemy API error:', errorText);
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[NFT] Response data:', data);

      if (data.ownedNfts && Array.isArray(data.ownedNfts)) {
        console.log('[NFT] Found NFTs:', data.ownedNfts.length);
        setNfts(data.ownedNfts);
      } else {
        console.log('[NFT] No NFTs in response');
        setNfts([]);
      }
    } catch (err) {
      console.error('[NFT] Error fetching NFTs:', err);
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log('[NFT] Effect triggered', { isConnected, chainId: chain?.id });
    if (isConnected && chain) {
      fetchNFTs();
    }
  }, [isConnected, address, chain]);

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Your NFTs</h2>
        <p style={styles.disabledText}>Connect wallet to view NFTs</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Your NFTs</h2>

      <button
        onClick={fetchNFTs}
        disabled={loading}
        style={{
          ...styles.primaryButton,
          ...(loading && styles.buttonDisabled),
        }}
      >
        {loading ? '⏳ Loading...' : '🔄 Refresh NFTs'}
      </button>

      {error && <p style={styles.errorBox}>{error}</p>}

      {nfts.length > 0 ? (
        <div style={styles.nftGrid}>
          {nfts.slice(0, 6).map((nft, index) => (
            <div key={index} style={styles.nftCard}>
              {nft.image?.thumbnailUrl && (
                <img
                  src={nft.image.thumbnailUrl}
                  alt={nft.name || 'NFT'}
                  style={styles.nftImage}
                />
              )}
              <p style={styles.nftName}>{nft.name || nft.contract?.name || 'Unnamed NFT'}</p>
              <p style={styles.nftId}>#{nft.tokenId?.slice(0, 6)}...</p>
            </div>
          ))}
          {nfts.length > 6 && (
            <p style={styles.nftMore}>+{nfts.length - 6} more</p>
          )}
        </div>
      ) : loading ? (
        <p style={styles.statusBox}>⏳ Loading NFTs...</p>
      ) : (
        <p style={styles.statusBox}>No NFTs found</p>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

function WagmiDemo() {
  const { isConnected } = useAccount();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>AutoConnect + Pure Wagmi</h1>
        <p style={styles.subtitle}>
          Zero RainbowKit dependencies - just wagmi hooks + AutoConnect
        </p>
      </header>

      {!isConnected && <ConnectWallet />}

      {isConnected && (
        <>
          <div style={styles.grid}>
            <WalletInfo />
            <NetworkSwitcher />
            <SendTransaction />
            <SignMessage />
            <TokenBalances />
            <NFTBalances />
          </div>
        </>
      )}

      <footer style={styles.footer}>
        <h3>📚 What This Demo Shows</h3>
        <ul style={styles.featureList}>
          <li>✅ Pure wagmi hooks (no RainbowKit)</li>
          <li>✅ Manual connector buttons</li>
          <li>✅ useConnect, useAccount, useSendTransaction, etc.</li>
          <li>✅ UnicornAutoConnect for URL-based connection</li>
          <li>✅ Works with MetaMask, WalletConnect, Unicorn</li>
        </ul>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UnicornAutoConnect
          debug={true}
          onConnect={(wallet) => console.log('✅ Wallet connected!', wallet)}
          onError={(error) => console.error('❌ Connection failed:', error)}
        />
        <WagmiDemo />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  header: {
    textAlign: 'center',
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
  },

  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 16px 0',
  },

  subtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  },

  connectSection: {
    maxWidth: '600px',
    margin: '0 auto 40px',
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.5rem',
    color: '#333',
    textAlign: 'center',
  },

  connectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },

  connectorButton: {
    padding: '16px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },

  disconnectButton: {
    display: 'block',
    margin: '0 auto 40px',
    padding: '12px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#666',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
    gap: '20px',
    paddingBottom: '40px',
  },

  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '1.5rem',
    color: '#333',
  },

  description: {
    margin: '0 0 16px 0',
    color: '#666',
    fontSize: '0.95rem',
  },

  disabledText: {
    color: '#999',
    fontSize: '0.95rem',
    margin: 0,
  },

  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    background: '#f3f4f6',
    borderRadius: '6px',
  },

  label: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },

  value: {
    fontSize: '0.95rem',
    color: '#333',
    fontWeight: '600',
    wordBreak: 'break-all',
  },

  currentNetwork: {
    margin: '0 0 16px 0',
    fontSize: '0.95rem',
    color: '#666',
  },

  networkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
  },

  networkButton: {
    padding: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    background: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  networkButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent',
  },

  primaryButton: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  tipBox: {
    background: '#fef3c7',
    border: '2px solid #fbbf24',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '0.9rem',
    color: '#92400e',
  },

  statusBox: {
    background: '#f3f4f6',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '12px',
    fontSize: '0.9rem',
    color: '#666',
  },

  successBox: {
    background: '#dcfce7',
    border: '2px solid #16a34a',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '12px',
    fontSize: '0.9rem',
    color: '#166534',
  },

  errorBox: {
    background: '#fee2e2',
    border: '2px solid #dc2626',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '12px',
    fontSize: '0.9rem',
    color: '#991b1b',
    wordBreak: 'break-word',
  },

  txHash: {
    fontSize: '0.85rem',
    marginTop: '8px',
    wordBreak: 'break-all',
  },

  details: {
    marginTop: '12px',
  },

  detailsSummary: {
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: '600',
  },

  signature: {
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    margin: '8px 0 0 0',
  },

  tokenList: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  tokenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f3f4f6',
    borderRadius: '8px',
  },

  tokenSymbol: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
  },

  tokenBalance: {
    fontSize: '1rem',
    color: '#667eea',
    fontWeight: '600',
  },

  footer: {
    maxWidth: '800px',
    margin: '40px auto 0',
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  featureList: {
    margin: '16px 0 0 0',
    paddingLeft: '20px',
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.8',
  },

  nftGrid: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
  },

  nftCard: {
    background: '#f3f4f6',
    borderRadius: '8px',
    padding: '8px',
    textAlign: 'center',
  },

  nftImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '8px',
  },

  nftName: {
    margin: '4px 0',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  nftId: {
    margin: '4px 0 0 0',
    fontSize: '0.75rem',
    color: '#666',
  },

  nftMore: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: '600',
    padding: '12px',
  },
};
