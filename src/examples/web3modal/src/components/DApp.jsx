import { useWeb3Modal } from '@web3modal/react';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSignMessage,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import { parseEther } from 'viem';
import { useState } from 'react';

export default function DApp() {
  const { open } = useWeb3Modal();
  const { address, isConnected, connector } = useAccount();
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { data: balance } = useBalance({ address });
  const { sendTransaction, isLoading: isSending, data: txData } = useSendTransaction({
    onSuccess: (data) => {
      console.log('Transaction successful:', data);
      if (data?.hash) {
        setTxHash(data.hash);
      }
    },
    onError: (error) => {
      console.error('Send failed -', error);
    },
  });
  const { signMessage, isLoading: isSigning, data: sigData } = useSignMessage({
    onSuccess: (data) => {
      console.log('Message signed:', data);
      if (data) {
        setSignature(data);
      }
    },
    onError: (error) => {
      console.error('Sign failed -', error);
    },
  });

  const [txHash, setTxHash] = useState('');
  const [signature, setSignature] = useState('');

  const handleSendETH = async () => {
    try {
      console.log('=== DEBUG: Send Transaction ===');
      console.log('Connector:', connector);
      console.log('Connector ID:', connector?.id);
      console.log('Connector ready:', connector?.ready);
      console.log('Has getSigner:', typeof connector?.getSigner);
      console.log('Has getProvider:', typeof connector?.getProvider);

      // Check wagmi config state
      const config = useConfig();
      console.log('Wagmi config:', config);
      console.log('Config connectors:', config.connectors);
      console.log('Config state:', config.state);

      sendTransaction({
        to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
        value: parseEther('0.001'),
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const handleSignMessage = async () => {
    try {
      console.log('Signing message...');

      // Try wagmi hooks
      signMessage({
        message: 'Hello from Unicorn + Web3Modal!',
      });
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🦄 Unicorn + Web3Modal</h1>
        <p className="subtitle">Drop-in integration example</p>
      </header>

      <div className="card">
        {!isConnected ? (
          <div className="connect-section">
            <h2>Get Started</h2>
            <p>Connect your wallet to interact with the dApp</p>
            <button onClick={open} className="btn btn-primary">
              Connect Wallet
            </button>
            <p className="hint">
              Works with MetaMask, WalletConnect, Coinbase Wallet, and Unicorn!
            </p>
          </div>
        ) : (
          <div className="connected-section">
            <div className="account-info">
              <h3>Connected Account</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Wallet:</span>
                  <span className="value">{connector?.name || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Network:</span>
                  <span className="value">{chain?.name || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Balance:</span>
                  <span className="value">
                    {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '...'}
                  </span>
                </div>
              </div>
              <button onClick={open} className="btn btn-secondary">
                Account Settings
              </button>
            </div>

            <div className="actions">
              <h3>Actions</h3>

              <div className="action-section">
                <h4>Send Transaction</h4>
                <p>Send 0.001 ETH to a test address</p>
                <button
                  onClick={handleSendETH}
                  disabled={isSending}
                  className="btn btn-primary"
                >
                  {isSending ? 'Sending...' : 'Send 0.001 ETH'}
                </button>
                {txHash && (
                  <p className="success">
                    ✓ Transaction sent: <span className="mono">{txHash.slice(0, 10)}...</span>
                  </p>
                )}
              </div>

              <div className="action-section">
                <h4>Sign Message</h4>
                <p>Sign a test message with your wallet</p>
                <button
                  onClick={handleSignMessage}
                  disabled={isSigning}
                  className="btn btn-primary"
                >
                  {isSigning ? 'Signing...' : 'Sign Message'}
                </button>
                {signature && (
                  <p className="success">
                    ✓ Message signed: <span className="mono">{signature.slice(0, 10)}...</span>
                  </p>
                )}
              </div>

              <div className="action-section">
                <h4>Switch Network</h4>
                <p>Switch between supported chains</p>
                <div className="network-buttons">
                  {chains?.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => switchNetwork?.(c.id)}
                      disabled={c.id === chain?.id}
                      className={`btn ${c.id === chain?.id ? 'btn-active' : 'btn-secondary'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="features">
              <h3>✨ Features</h3>
              <ul>
                <li>✅ Works with all Web3Modal wallets</li>
                <li>✅ Unicorn wallet with gasless transactions</li>
                <li>✅ URL-based auto-connection</li>
                <li>✅ Standard wagmi hooks</li>
                <li>✅ Multi-chain support</li>
                <li>✅ Zero code changes needed</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>
          Built with <a href="https://www.npmjs.com/package/@unicorn.eth/autoconnect">@unicorn.eth/autoconnect</a>
          {' + '}
          <a href="https://docs.walletconnect.com/web3modal/about">Web3Modal</a>
        </p>
      </footer>
    </div>
  );
}
