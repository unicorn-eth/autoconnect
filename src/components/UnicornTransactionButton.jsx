//Coded lovingly by @cryptowampum and Claude AI
// UnicornTransactionButton.jsx - Pre-built transaction button
import React, { useState } from 'react';
import { useUnicornTransaction } from '../hooks/useUnicornTransaction';

/**
 * Pre-built transaction button that handles both Unicorn and standard wallets
 * Shows loading states, success/error messages automatically
 * 
 * @param {Object} props
 * @param {Object} props.transaction - Transaction object {to, value, data}
 * @param {Function} props.onSuccess - Called when transaction succeeds
 * @param {Function} props.onError - Called when transaction fails
 * @param {React.ReactNode} props.children - Button text/content
 * @param {Object} props.style - Custom button styles
 */
export const UnicornTransactionButton = ({ 
  transaction, 
  onSuccess, 
  onError,
  children = 'Send Transaction',
  style = {},
  ...props 
}) => {
  const { sendTransaction, isLoading, hash, error, isConnected, isUnicorn } = useUnicornTransaction();
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    try {
      setStatus('');
      const result = await sendTransaction(transaction);
      setStatus('✅ Transaction successful!');
      onSuccess?.(result);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
      onError?.(err);
    }
  };

  const defaultStyle = {
    background: isConnected ? (isUnicorn ? '#8b5cf6' : '#0ea5e9') : '#94a3b8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isConnected && !isLoading ? 'pointer' : 'not-allowed',
    opacity: isLoading ? 0.7 : 1,
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={!isConnected || isLoading}
        style={defaultStyle}
        {...props}
      >
        {isLoading ? '⏳ Processing...' : 
         isUnicorn ? `🦄 ${children}` : 
         children}
      </button>
      
      {hash && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: '#dcfce7',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#166534',
        }}>
          ✅ Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
        </div>
      )}
      
      {status && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: status.includes('✅') ? '#dcfce7' : '#fee2e2',
          borderRadius: '6px',
          fontSize: '12px',
          color: status.includes('✅') ? '#166534' : '#991b1b',
        }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default UnicornTransactionButton;