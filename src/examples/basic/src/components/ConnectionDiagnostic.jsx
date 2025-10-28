// src/examples/basic/src/components/ConnectionDiagnostic.jsx
// Diagnostic component to debug connection state issues

import { useEffect, useState } from 'react';
import { useAccount, useConnections } from 'wagmi';
import { useUniversalWallet } from '../../../../hooks/useUniversalWallet.js';

export function ConnectionDiagnostic() {
  const wagmiAccount = useAccount();
  const connections = useConnections();
  const universalWallet = useUniversalWallet();
  const [globalState, setGlobalState] = useState(null);
  const [eventLog, setEventLog] = useState([]);

  // Check global state
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__UNICORN_WALLET_STATE__) {
      setGlobalState(window.__UNICORN_WALLET_STATE__);
    }
  }, []);

  // Listen for connection events
  useEffect(() => {
    const handleConnect = (e) => {
      setEventLog(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        event: 'unicorn-wallet-connected',
        detail: e.detail,
      }]);
      
      // Force check global state
      if (window.__UNICORN_WALLET_STATE__) {
        setGlobalState(window.__UNICORN_WALLET_STATE__);
      }
    };

    const handleDisconnect = () => {
      setEventLog(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        event: 'unicorn-wallet-disconnected',
      }]);
      setGlobalState(null);
    };

    window.addEventListener('unicorn-wallet-connected', handleConnect);
    window.addEventListener('unicorn-wallet-disconnected', handleDisconnect);

    return () => {
      window.removeEventListener('unicorn-wallet-connected', handleConnect);
      window.removeEventListener('unicorn-wallet-disconnected', handleDisconnect);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '600px',
      overflow: 'auto',
      background: 'white',
      border: '2px solid #667eea',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '12px',
      zIndex: 9999,
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
        🔍 Connection Diagnostic
      </h3>

      {/* Wagmi Account State */}
      <div style={{ marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
        <strong>Wagmi Account:</strong>
        <pre style={{ margin: '5px 0 0 0', fontSize: '11px', overflow: 'auto' }}>
          {JSON.stringify({
            isConnected: wagmiAccount.isConnected,
            address: wagmiAccount.address,
            chainId: wagmiAccount.chainId,
            connector: wagmiAccount.connector?.name,
            status: wagmiAccount.status,
          }, null, 2)}
        </pre>
      </div>

      {/* Universal Wallet State */}
      <div style={{ marginBottom: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
        <strong>Universal Wallet:</strong>
        <pre style={{ margin: '5px 0 0 0', fontSize: '11px', overflow: 'auto' }}>
          {JSON.stringify({
            isConnected: universalWallet.isConnected,
            address: universalWallet.address,
            chainId: universalWallet.chainId,
            chain: universalWallet.chain,
            isUnicorn: universalWallet.isUnicorn,
            isStandard: universalWallet.isStandard,
            connector: universalWallet.connector?.name,
          }, null, 2)}
        </pre>
      </div>

      {/* Global State */}
      {globalState && (
        <div style={{ marginBottom: '15px', padding: '10px', background: '#fff3cd', borderRadius: '4px' }}>
          <strong>Global State (window.__UNICORN_WALLET_STATE__):</strong>
          <pre style={{ margin: '5px 0 0 0', fontSize: '11px', overflow: 'auto' }}>
            {JSON.stringify({
              address: globalState.address,
              chain: globalState.chain,
              chainId: globalState.chainId,
            }, null, 2)}
          </pre>
        </div>
      )}

      {/* Connections */}
      {connections.length > 0 && (
        <div style={{ marginBottom: '15px', padding: '10px', background: '#d4edda', borderRadius: '4px' }}>
          <strong>Active Connections ({connections.length}):</strong>
          {connections.map((conn, i) => (
            <pre key={i} style={{ margin: '5px 0 0 0', fontSize: '11px', overflow: 'auto' }}>
              {JSON.stringify({
                connector: conn.connector.name,
                chainId: conn.chainId,
                accounts: conn.accounts,
              }, null, 2)}
            </pre>
          ))}
        </div>
      )}

      {/* Event Log */}
      <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
        <strong>Event Log:</strong>
        {eventLog.length === 0 ? (
          <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666' }}>
            No events captured yet
          </p>
        ) : (
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            {eventLog.map((log, i) => (
              <div key={i} style={{ 
                margin: '5px 0',
                padding: '5px',
                background: 'white',
                borderRadius: '3px',
                fontSize: '11px',
              }}>
                <div><strong>{log.time}</strong> - {log.event}</div>
                {log.detail && (
                  <pre style={{ margin: '3px 0 0 0', fontSize: '10px' }}>
                    {JSON.stringify({
                      address: log.detail.address,
                      chain: log.detail.chain,
                      chainId: log.detail.chainId,
                    }, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diagnosis */}
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: universalWallet.isConnected ? '#d4edda' : '#f8d7da',
        borderRadius: '4px',
      }}>
        <strong>🔬 Diagnosis:</strong>
        <div style={{ marginTop: '5px', fontSize: '11px' }}>
          {universalWallet.isConnected ? (
            <>
              ✅ Connection is working properly!
              <br />
              {universalWallet.isUnicorn && '🦄 Unicorn wallet detected'}
              {universalWallet.isStandard && '🦊 Standard wallet detected'}
            </>
          ) : wagmiAccount.isConnected ? (
            <>
              ⚠️ Wagmi is connected but Universal Wallet hook is not synced
              <br />
              <small>This suggests a state propagation issue</small>
            </>
          ) : globalState ? (
            <>
              ⚠️ Global state exists but not connected
              <br />
              <small>The connection event may have fired before hooks mounted</small>
              <br />
              <button 
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '5px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                🔄 Reload Page
              </button>
            </>
          ) : (
            <>
              ℹ️ No wallet connected yet
              <br />
              <small>Connect via RainbowKit or access through Unicorn portal</small>
            </>
          )}
        </div>
      </div>
    </div>
  );
}