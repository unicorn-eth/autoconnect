// App-UX-Demo.jsx
// UX-friendly demo for non-technical users
// Mobile responsive with clear, simple language

import { useState, useEffect } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon, mainnet, gnosis } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useDisconnect,
  useBalance,
  useSwitchChain,
  useReadContract,
  usePublicClient,
} from 'wagmi';
import { parseEther, formatEther, formatUnits, erc20Abi, erc721Abi } from 'viem';

import { unicornConnector } from '../../../connectors/unicornConnector.js';
import UnicornAutoConnect from '../../../components/UnicornAutoConnect.jsx';

// Configuration
const RECIPIENT_ADDRESS = '0x7049747E615a1C5C22935D5790a664B7E65D9681';

// Common token addresses on Base
const TOKENS_BASE = [
  { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
  { symbol: 'USDbC', address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', decimals: 6 },
  { symbol: 'DAI', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18 },
  { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18 },
];

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Map chain ID to Alchemy network name (used by both Token and NFT components)
const getAlchemyNetwork = (chainId) => {
  const networkMap = {
    8453: 'base-mainnet',     // Base
    137: 'polygon-mainnet',   // Polygon
    1: 'eth-mainnet',         // Ethereum Mainnet
    100: 'gnosis-mainnet',    // Gnosis
    10: 'opt-mainnet',        // Optimism
    42161: 'arb-mainnet',     // Arbitrum
  };
  return networkMap[chainId] || 'base-mainnet';
};

// ============================================================================
// COMPONENTS
// ============================================================================

function Hero() {
  const { isConnected, connector } = useAccount();

  return (
    <div style={styles.hero}>
      <h1 style={styles.title}>Unicorn Wallet Demo</h1>
      <p style={styles.subtitle}>
        Experience seamless wallet integration with zero gas fees
      </p>

      {!isConnected && (
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>What is this?</h3>
          <ul style={styles.infoList}>
            <li>Connect your wallet to get started</li>
            <li>Send transactions without paying gas fees</li>
            <li>Sign messages securely</li>
            <li>Works on any device</li>
          </ul>
        </div>
      )}

      {isConnected && connector?.id === 'unicorn' && (
        <div style={styles.unicornBadge}>
          <span style={styles.unicornEmoji}>🦄</span>
          <span>Using Unicorn - All transactions are free!</span>
        </div>
      )}

      <div style={styles.connectButtonWrapper}>
        <ConnectButton />
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
      <h2 style={styles.cardTitle}>Your Wallet</h2>

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Address</span>
          <span style={styles.infoValue}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Network</span>
          <span style={styles.infoValue}>{chain?.name}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Balance</span>
          <span style={styles.infoValue}>
            {balance ? `${formatEther(balance.value).slice(0, 8)} ETH` : '...'}
          </span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Wallet Type</span>
          <span style={styles.infoValue}>
            {connector?.id === 'unicorn' ? '🦄 Unicorn' : connector?.name}
          </span>
        </div>
      </div>

      <button onClick={() => disconnect()} style={styles.secondaryButton}>
        Disconnect
      </button>
    </div>
  );
}

function SendMoneyDemo() {
  const { isConnected, connector } = useAccount();
  const { sendTransaction, isPending, isSuccess, isError, error, data: txHash } = useSendTransaction();
  const [errorMessage, setErrorMessage] = useState('');

  // Watch for transaction success/error
  useEffect(() => {
    if (isSuccess && txHash) {
      console.log('✅ Transaction successful:', txHash);
    }
  }, [isSuccess, txHash]);

  useEffect(() => {
    if (isError && error) {
      console.error('❌ Transaction error:', error);
      // Extract user-friendly error message
      let message = error.message || 'Transaction failed';

      // Parse common error messages
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
      // Error will be caught by useEffect above
    }
  };

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Send Money</h2>
        <p style={styles.disabledText}>Connect your wallet to send transactions</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Send Money</h2>
      <p style={styles.cardDescription}>
        Send a small test transaction (0.0001 ETH)
      </p>

      {connector?.id === 'unicorn' && (
        <div style={styles.tipBox}>
          <strong>💡 Tip:</strong> With Unicorn wallet, you won't pay any gas fees!
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={isPending}
        style={{
          ...styles.primaryButton,
          ...(isPending && styles.buttonDisabled)
        }}
      >
        {isPending ? '⏳ Sending...' : '💸 Send 0.0001 ETH'}
      </button>

      {isPending && !isError && (
        <div style={styles.statusBox}>
          <p>⏳ Please confirm the transaction in your wallet...</p>
        </div>
      )}

      {isSuccess && txHash && (
        <div style={styles.successBox}>
          <p>✅ Transaction sent successfully!</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px', wordBreak: 'break-all' }}>
            TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </p>
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

function SignMessageDemo() {
  const { isConnected, connector } = useAccount();
  const { signMessage, isPending, data: signature } = useSignMessage();
  const [message] = useState('Hello from Unicorn Wallet!');

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
        <h2 style={styles.cardTitle}>Sign a Message</h2>
        <p style={styles.disabledText}>Connect your wallet to sign messages</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Sign a Message</h2>
      <p style={styles.cardDescription}>
        Digitally sign a message to prove it's from you
      </p>

      <div style={styles.messageBox}>
        <span style={styles.messageLabel}>Message to sign:</span>
        <p style={styles.messageText}>"{message}"</p>
      </div>

      <button
        onClick={handleSign}
        disabled={isPending}
        style={{
          ...styles.primaryButton,
          ...(isPending && styles.buttonDisabled)
        }}
      >
        {isPending ? '⏳ Signing...' : '✍️ Sign Message'}
      </button>

      {signature && (
        <div style={styles.successBox}>
          <p>✅ Message signed!</p>
          <details style={styles.details}>
            <summary style={styles.detailsSummary}>View signature</summary>
            <p style={styles.signatureText}>
              {signature.slice(0, 30)}...{signature.slice(-30)}
            </p>
          </details>
        </div>
      )}
    </div>
  );
}

function TokenBalanceDemo() {
  const { address, isConnected, chain } = useAccount();
  const [tokenBalances, setTokenBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get ALL token balances using Alchemy API
  const checkBalances = async () => {
    console.log('[TokenBalance] Starting check...', { address, chainId: chain?.id });

    if (!address) {
      console.log('[TokenBalance] No address');
      return;
    }

    if (!chain) {
      console.log('[TokenBalance] No chain');
      return;
    }

    const alchemyKey = import.meta.env.VITE_ALCHEMY_ID;
    console.log('[TokenBalance] Alchemy key present:', !!alchemyKey);

    if (!alchemyKey) {
      setError('Token balance feature requires Alchemy API key. Add VITE_ALCHEMY_ID to your .env file.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const alchemyNetwork = getAlchemyNetwork(chain.id);
      const url = `https://${alchemyNetwork}.g.alchemy.com/v2/${alchemyKey}`;

      console.log('[TokenBalance] Fetching from Alchemy network:', alchemyNetwork);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address, 'erc20'],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[TokenBalance] Alchemy response:', data);

      if (data.result && data.result.tokenBalances) {
        const balances = [];

        for (const tokenData of data.result.tokenBalances) {
          const balance = BigInt(tokenData.tokenBalance || '0');

          if (balance > 0n) {
            // Get token metadata
            try {
              const metadataResponse = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
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
                address: tokenData.contractAddress,
                decimals: metadata.decimals || 18,
                balance: formatted,
                name: metadata.name,
              });

              console.log(`[TokenBalance] Found ${metadata.symbol}:`, formatted);
            } catch (metaErr) {
              console.error('[TokenBalance] Error fetching metadata:', metaErr);
            }
          }
        }

        console.log('[TokenBalance] Final balances:', balances);
        setTokenBalances(balances);
      } else {
        setTokenBalances([]);
      }
    } catch (err) {
      console.error('[TokenBalance] Error fetching balances:', err);
      setError(`Unable to fetch token balances: ${err.message}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log('[TokenBalance] Effect triggered', { isConnected, chainId: chain?.id });
    if (isConnected && chain) {
      checkBalances();
    }
  }, [isConnected, address, chain]);

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💰 Token Balances</h2>
        <p style={styles.disabledText}>Connect your wallet to see token balances</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>💰 Token Balances</h2>
      <p style={styles.cardDescription}>
        View all tokens in your wallet
      </p>

      <button
        onClick={checkBalances}
        disabled={loading}
        style={{
          ...styles.primaryButton,
          ...(loading && styles.buttonDisabled)
        }}
      >
        {loading ? '⏳ Loading...' : '🔄 Refresh Balances'}
      </button>

      {tokenBalances.length > 0 ? (
        <div style={styles.tokenList}>
          {tokenBalances.map((token) => (
            <div key={token.address} style={styles.tokenItem}>
              <span style={styles.tokenSymbol}>{token.symbol}</span>
              <span style={styles.tokenBalance}>
                {parseFloat(token.balance).toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      ) : loading ? (
        <p style={styles.statusBox}>⏳ Checking balances...</p>
      ) : (
        <p style={styles.statusBox}>No tokens found (or balances are zero)</p>
      )}
    </div>
  );
}

function NFTListDemo() {
  const { address, isConnected, chain } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNFTs = async () => {
    console.log('[NFT] Starting fetch...', { address, chainId: chain?.id });

    if (!address) {
      console.log('[NFT] No address');
      return;
    }

    if (!chain) {
      console.log('[NFT] No chain');
      return;
    }

    setLoading(true);
    setError('');

    const alchemyKey = import.meta.env.VITE_ALCHEMY_ID;
    console.log('[NFT] Alchemy key present:', !!alchemyKey);

    if (!alchemyKey) {
      setError('NFT feature requires Alchemy API key. Add VITE_ALCHEMY_ID to your .env file.');
      setLoading(false);
      return;
    }

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
      setError(`Unable to fetch NFTs: ${err.message}`);
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
        <h2 style={styles.cardTitle}>🖼️ Your NFTs</h2>
        <p style={styles.disabledText}>Connect your wallet to see your NFTs</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>🖼️ Your NFTs</h2>
      <p style={styles.cardDescription}>
        View all NFTs (collectibles) in your wallet
      </p>

      <button
        onClick={fetchNFTs}
        disabled={loading}
        style={{
          ...styles.primaryButton,
          ...(loading && styles.buttonDisabled)
        }}
      >
        {loading ? '⏳ Loading...' : '🔄 Refresh NFTs'}
      </button>

      {error && (
        <div style={styles.errorBox}>
          <p>{error}</p>
          {!import.meta.env.VITE_ALCHEMY_ID && (
            <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
              <p><strong>How to get an API key:</strong></p>
              <ol style={{ marginLeft: '20px', marginTop: '8px' }}>
                <li>Visit <a href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>alchemy.com</a></li>
                <li>Sign up for a free account</li>
                <li>Create a new app on Base network</li>
                <li>Copy your API key and add VITE_ALCHEMY_ID to .env file</li>
              </ol>
            </div>
          )}
        </div>
      )}

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
        <p style={styles.statusBox}>No NFTs found in your wallet</p>
      )}
    </div>
  );
}

function ChangeNetworkDemo() {
  const { chain, isConnected } = useAccount();
  const { chains, switchChain, isPending, isSuccess, isError, error } = useSwitchChain();

  if (!isConnected) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔄 Change Network</h2>
        <p style={styles.disabledText}>Connect your wallet to switch networks</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>🔄 Change Network</h2>
      <p style={styles.cardDescription}>
        Switch between different blockchain networks
      </p>

      <div style={styles.currentNetwork}>
        <span style={styles.networkLabel}>Current Network:</span>
        <span style={styles.networkName}>{chain?.name || 'Unknown'}</span>
      </div>

      <div style={styles.networkButtons}>
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => switchChain({ chainId: c.id })}
            disabled={isPending || c.id === chain?.id}
            style={{
              ...styles.networkButton,
              ...(c.id === chain?.id && styles.networkButtonActive),
              ...(isPending && styles.buttonDisabled),
            }}
          >
            {c.id === chain?.id ? '✓ ' : ''}{c.name}
          </button>
        ))}
      </div>

      {isPending && (
        <p style={styles.statusBox}>⏳ Switching network...</p>
      )}

      {isSuccess && (
        <div style={styles.successBox}>
          <p>✅ Network switched successfully!</p>
        </div>
      )}

      {isError && error && (
        <div style={styles.errorBox}>
          <p>❌ {error.message || 'Failed to switch network'}</p>
        </div>
      )}
    </div>
  );
}

function InfoFooter() {
  return (
    <div style={styles.footer}>
      <h3 style={styles.footerTitle}>About Confirmations</h3>
      <p style={styles.footerText}>
        When you send transactions or sign messages, you'll see a confirmation dialog.
        This is your wallet asking for permission before taking any action.
      </p>

      <div style={styles.footerGrid}>
        <div style={styles.footerCard}>
          <h4 style={styles.footerCardTitle}>🦄 Unicorn Wallet</h4>
          <p style={styles.footerCardText}>
            Shows a clean confirmation page with transaction details.
            All transactions are gasless (free)!
          </p>
        </div>

        <div style={styles.footerCard}>
          <h4 style={styles.footerCardTitle}>🦊 MetaMask & Others</h4>
          <p style={styles.footerCardText}>
            Opens a browser extension popup to approve transactions.
            You'll pay a small gas fee.
          </p>
        </div>
      </div>

      <div style={styles.customizationNote}>
        <h4 style={styles.footerCardTitle}>🎨 Customization</h4>
        <p style={styles.footerCardText}>
          <strong>For Developers:</strong> Unicorn confirmation pages can be customized through the Thirdweb SDK configuration:
        </p>
        <ul style={styles.customizationList}>
          <li>Brand colors and logos</li>
          <li>Custom messaging</li>
          <li>Transaction preview styling</li>
          <li>Multi-language support</li>
        </ul>
        <p style={styles.footerCardText}>
          Contact your development team to discuss customization options.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

function DemoApp() {
  return (
    <div style={styles.container}>
      <Hero />

      <div style={styles.grid}>
        <WalletInfo />
        <ChangeNetworkDemo />
        <SendMoneyDemo />
        <SignMessageDemo />
        <TokenBalanceDemo />
        <NFTListDemo />
      </div>

      <InfoFooter />
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UnicornAutoConnect
            debug={true}
            onConnect={(wallet) => console.log('✅ Wallet connected!', wallet)}
            onError={(error) => console.error('❌ Connection failed:', error)}
          />
          <DemoApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ============================================================================
// RESPONSIVE STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  hero: {
    textAlign: 'center',
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
  },

  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)', // Responsive font size
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 16px 0',
  },

  subtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.25rem)', // Responsive font size
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0 0 32px 0',
  },

  infoBox: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    textAlign: 'left',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  infoTitle: {
    margin: '0 0 16px 0',
    fontSize: '1.25rem',
    color: '#333',
  },

  infoList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.8',
  },

  unicornBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px 20px',
    borderRadius: '24px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  unicornEmoji: {
    fontSize: '1.5rem',
  },

  connectButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },

  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', // Responsive grid
    gap: '20px',
    padding: '0 0 40px 0',
  },

  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  cardTitle: {
    margin: '0 0 12px 0',
    fontSize: '1.5rem',
    color: '#333',
  },

  cardDescription: {
    margin: '0 0 20px 0',
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },

  disabledText: {
    color: '#999',
    fontSize: '0.95rem',
    margin: 0,
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', // Responsive grid
    gap: '16px',
    marginBottom: '20px',
  },

  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  infoLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
  },

  infoValue: {
    fontSize: '1rem',
    color: '#333',
    fontWeight: '600',
    wordBreak: 'break-all', // Prevent overflow on mobile
  },

  primaryButton: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s',
  },

  secondaryButton: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#666',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
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
    wordBreak: 'break-word', // Prevent overflow on mobile
  },

  messageBox: {
    background: '#f3f4f6',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },

  messageLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
  },

  messageText: {
    margin: '8px 0 0 0',
    fontSize: '1rem',
    color: '#333',
    fontStyle: 'italic',
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

  signatureText: {
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    margin: '8px 0 0 0',
    color: '#166534',
  },

  footer: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '32px 24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  footerTitle: {
    margin: '0 0 12px 0',
    fontSize: '1.5rem',
    color: '#333',
  },

  footerText: {
    margin: '0 0 24px 0',
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
  },

  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', // Responsive grid
    gap: '20px',
    marginBottom: '24px',
  },

  footerCard: {
    background: '#f3f4f6',
    borderRadius: '12px',
    padding: '20px',
  },

  footerCardTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    color: '#333',
  },

  footerCardText: {
    margin: 0,
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },

  customizationNote: {
    background: '#e3f2fd',
    border: '2px solid #2196f3',
    borderRadius: '12px',
    padding: '20px',
  },

  customizationList: {
    margin: '12px 0',
    paddingLeft: '20px',
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },

  warningText: {
    color: '#f59e0b',
    fontSize: '0.95rem',
    margin: 0,
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
    alignItems: 'center',
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

  currentNetwork: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f3f4f6',
    borderRadius: '8px',
    marginBottom: '16px',
  },

  networkLabel: {
    fontSize: '0.9rem',
    color: '#666',
  },

  networkName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#667eea',
  },

  networkButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  networkButton: {
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
    background: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  networkButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent',
  },
};
