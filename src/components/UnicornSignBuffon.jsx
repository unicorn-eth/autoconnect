//Coded lovingly by @cryptowampum and Claude AI
// UnicornSignButton.jsx - Pre-built signing button
import React, { useState } from 'react';
import { useUnicornSignMessage } from '../hooks/useUnicornSignMessage';

/**
 * Pre-built signing button that handles both Unicorn and standard wallets
 * Shows loading states, signature results automatically
 * 
 * @param {Object} props
 * @param {string} props.message - Message to sign
 * @param {Function} props.onSuccess - Called when signing succeeds
 * @param {Function} props.onError - Called when signing fails
 * @param {React.ReactNode} props.children - Button text/content
 * @param {Object} props.style - Custom button styles
 */
export const UnicornSignButton = ({ 
  message, 
  onSuccess, 
  onError,
  children = 'Sign Message',
  style = {},
  ...props 
}) => {
  const { signMessage, isLoading, signature, error, isConnected, isUnicorn } = useUnicornSignMessage();
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    try {
      setStatus('');
      const sig = await signMessage(message);
      setStatus('✅ Message signed!');
      onSuccess?.(sig);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
      onError?.(err);
    }
  };

  const defaultStyle = {
    background: isConnected ? '#8b5cf6' : '#94a3b8',
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
        {isLoading ? '⏳ Signing...' : 
         isUnicorn ? `🦄 ${children}` : 
         children}
      </button>
      
      {signature && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: '#dcfce7',
          borderRadius: '6px',
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#166534',
          wordBreak: 'break-all',
        }}>
          Sig: {signature.slice(0, 20)}...{signature.slice(-10)}
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

export default UnicornSignButton;