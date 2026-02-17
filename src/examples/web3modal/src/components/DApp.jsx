import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSignMessage,
  useSwitchChain,
  useConfig,
} from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

export default function DApp() {
  const { open } = useWeb3Modal();
  const { address, isConnected, connector, chain } = useAccount();
  const { chains } = useConfig();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const {
    sendTransaction,
    isPending: isSending,
    data: txData,
    isSuccess: txSuccess,
  } = useSendTransaction();

  const {
    signMessage,
    isPending: isSigning,
    data: sigData,
    isSuccess: sigSuccess,
  } = useSignMessage();

  const [txHash, setTxHash] = useState('');
  const [signature, setSignature] = useState('');

  // Watch for transaction success
  useEffect(() => {
    if (txSuccess && txData) {
      console.log('Transaction successful:', txData);
      setTxHash(txData);
    }
  }, [txSuccess, txData]);

  // Watch for signature success
  useEffect(() => {
    if (sigSuccess && sigData) {
      console.log('Message signed:', sigData);
      setSignature(sigData);
    }
  }, [sigSuccess, sigData]);

  const handleSendETH = async () => {
    try {
      console.log('=== DEBUG: Send Transaction ===');
      console.log('Connector:', connector);
      console.log('Connector ID:', connector?.id);

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
            <button onClick={() => open()} className="btn btn-primary">
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
              <button onClick={() => open()} className="btn btn-secondary">
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
                      onClick={() => switchChain?.({ chainId: c.id })}
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
