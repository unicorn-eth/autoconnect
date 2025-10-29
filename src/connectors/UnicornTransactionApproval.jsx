// Coded lovingly by @cryptowampum and Claude AI
// UnicornTransactionApproval.jsx - Transaction approval UI for Unicorn wallet
// Shows confirmation dialog before executing gasless transactions

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Transaction approval modal component
const ApprovalModal = ({ transaction, onApprove, onReject }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleApprove = () => {
    setIsVisible(false);
    setTimeout(() => onApprove(), 200); // Wait for fade out
  };

  const handleReject = () => {
    setIsVisible(false);
    setTimeout(() => onReject(), 200); // Wait for fade out
  };

  // Format value for display
  const formatValue = (value) => {
    if (!value || value === '0' || value === '0x0') return '0';
    try {
      // Try to convert from wei to eth
      const num = BigInt(value);
      const eth = Number(num) / 1e18;
      return eth.toFixed(6);
    } catch {
      return value;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      }}
      onClick={handleReject}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '480px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.2s ease-in-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}>
            🦄
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1f2937' }}>
              {transaction.method === 'personal_sign' ? 'Sign Message' :
               transaction.method === 'eth_signTypedData_v4' ? 'Sign Typed Data' :
               'Confirm Transaction'}
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              Unicorn Smart Wallet
            </p>
          </div>
        </div>

        {/* Transaction/Signing Details */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          {/* Show message for signing operations */}
          {transaction.method === 'personal_sign' && transaction.message && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Message
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1f2937',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                maxHeight: '120px',
                overflow: 'auto',
                padding: '8px',
                background: 'white',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}>
                {transaction.message}
              </div>
            </div>
          )}

          {/* Show typed data for eth_signTypedData_v4 */}
          {transaction.method === 'eth_signTypedData_v4' && transaction.typedData && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Typed Data
              </div>
              <div style={{
                fontSize: '12px',
                color: '#1f2937',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                maxHeight: '120px',
                overflow: 'auto',
                padding: '8px',
                background: 'white',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}>
                <pre style={{ margin: 0, fontSize: '11px' }}>
                  {JSON.stringify(transaction.typedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Show "From" for signing operations */}
          {(transaction.method === 'personal_sign' || transaction.method === 'eth_signTypedData_v4') && transaction.from && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Signing With
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1f2937',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}>
                {transaction.from}
              </div>
            </div>
          )}

          {/* Show "To" for transactions */}
          {!transaction.method && transaction.to && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                To
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1f2937',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}>
                {transaction.to}
              </div>
            </div>
          )}

          {!transaction.method && transaction.value && transaction.value !== '0' && transaction.value !== '0x0' && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Value
              </div>
              <div style={{
                fontSize: '18px',
                color: '#1f2937',
                fontWeight: '600',
              }}>
                {formatValue(transaction.value)} ETH
              </div>
            </div>
          )}

          {!transaction.method && transaction.data && transaction.data !== '0x' && (
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Data
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                maxHeight: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {transaction.data.slice(0, 66)}...
              </div>
            </div>
          )}
        </div>

        {/* Gasless Badge - show for transactions, different badge for signing */}
        {!transaction.method ? (
          <div style={{
            background: '#dcfce7',
            border: '1px solid #16a34a',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>
                Gasless Transaction
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>
                No gas fees required
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '20px' }}>✍️</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
                Signature Request
              </div>
              <div style={{ fontSize: '12px', color: '#92400e' }}>
                This signature proves account ownership
              </div>
            </div>
          </div>
        )}

        {/* Gasless Badge */}
        <div style={{
          background: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          display: 'none', // Hidden - replaced by conditional badge above
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>
              Gasless Transaction
            </div>
            <div style={{ fontSize: '12px', color: '#166534' }}>
              No gas fees required
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          <button
            onClick={handleReject}
            style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f9fafb';
              e.target.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#e5e7eb';
            }}
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
            }}
          >
            Confirm
          </button>
        </div>

        {/* Warning */}
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#9ca3af',
          textAlign: 'center',
        }}>
          Only confirm transactions you trust
        </div>
      </div>
    </div>
  );
};

// Transaction approval manager
class TransactionApprovalManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.container = null;
    this.root = null;
  }

  // Request approval for a transaction
  requestApproval(transaction) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        transaction,
        resolve,
        reject,
      });

      if (!this.isProcessing) {
        this.processNext();
      }
    });
  }

  // Process next transaction in queue
  processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      this.cleanup();
      return;
    }

    this.isProcessing = true;
    const { transaction, resolve, reject } = this.queue[0];

    // Create modal
    this.showModal(transaction, resolve, reject);
  }

  // Show approval modal
  showModal(transaction, resolve, reject) {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'unicorn-tx-approval-root';
      document.body.appendChild(this.container);
      this.root = ReactDOM.createRoot(this.container);
    }

    const handleApprove = () => {
      this.queue.shift(); // Remove from queue
      this.cleanup();
      resolve(true);
      this.processNext();
    };

    const handleReject = () => {
      this.queue.shift(); // Remove from queue
      this.cleanup();
      reject(new Error('Transaction rejected by user'));
      this.processNext();
    };

    this.root.render(
      <ApprovalModal
        transaction={transaction}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  // Cleanup modal
  cleanup() {
    if (this.root && this.container) {
      this.root.unmount();
      if (document.body.contains(this.container)) {
        document.body.removeChild(this.container);
      }
      this.container = null;
      this.root = null;
    }
  }
}

// Global instance
const approvalManager = new TransactionApprovalManager();

// Export the approval function
export const requestTransactionApproval = (transaction) => {
  return approvalManager.requestApproval(transaction);
};

export default requestTransactionApproval;