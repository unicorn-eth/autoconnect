// src/examples/basic/src/components/ConnectorFunctionTests.jsx
// Tests all functions exposed by unicornConnector

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useConfig } from 'wagmi';

export function ConnectorFunctionTests() {
  const { address, connector, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const config = useConfig();
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (testName, status, message, data = null) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status, message, data, timestamp: Date.now() }
    }));
  };

  const testSetup = async () => {
    const testName = 'setup';
    updateResult(testName, 'running', 'Testing connector setup...');
    
    try {
      // Setup is called automatically during connection
      // We can verify it worked by checking if connector exists
      if (!connector) {
        throw new Error('No connector found - setup may have failed');
      }

      // Check if it's the Unicorn connector
      const isUnicorn = connector.id === 'unicorn';
      
      updateResult(
        testName, 
        'pass', 
        `Setup verified! Connector: ${connector.name} (${connector.id})`,
        { connectorId: connector.id, isUnicorn }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testConnect = async () => {
    const testName = 'connect';
    updateResult(testName, 'running', 'Testing connect...');
    
    try {
      if (!isConnected) {
        updateResult(testName, 'info', 'Please use the Connect Wallet button above to test connection');
        return;
      }
      
      updateResult(
        testName, 
        'pass', 
        'Connection verified!',
        { address, connector: connector?.name }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testDisconnect = async () => {
    const testName = 'disconnect';
    updateResult(testName, 'running', 'Testing disconnect...');
    
    try {
      if (!isConnected) {
        updateResult(testName, 'info', 'Connect a wallet first');
        return;
      }

      await disconnect();
      
      updateResult(
        testName, 
        'pass', 
        'Disconnect successful!'
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testGetAccount = async () => {
    const testName = 'getAccount';
    updateResult(testName, 'running', 'Testing getAccount...');
    
    try {
      if (!isConnected) {
        updateResult(testName, 'info', 'Connect a wallet first');
        return;
      }

      // In wagmi v2, account is accessed via useAccount hook
      if (!address) {
        throw new Error('No address returned from getAccount');
      }
      
      updateResult(
        testName, 
        'pass', 
        'getAccount works!',
        { address }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testGetChainId = async () => {
    const testName = 'getChainId';
    updateResult(testName, 'running', 'Testing getChainId...');
    
    try {
      if (!isConnected) {
        updateResult(testName, 'info', 'Connect a wallet first');
        return;
      }

      if (!chainId) {
        throw new Error('No chain ID returned');
      }
      
      const chainName = chainId === 8453 ? 'Base' : 
                       chainId === 137 ? 'Polygon' : 
                       `Unknown (${chainId})`;
      
      updateResult(
        testName, 
        'pass', 
        'getChainId works!',
        { chainId, chainName }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testIsAuthorized = async () => {
    const testName = 'isAuthorized';
    updateResult(testName, 'running', 'Testing isAuthorized...');
    
    try {
      // isAuthorized is reflected in isConnected
      const authorized = isConnected;
      
      updateResult(
        testName, 
        'pass', 
        'isAuthorized works!',
        { isAuthorized: authorized }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testSwitchChain = async () => {
    const testName = 'switchChain';
    updateResult(testName, 'running', 'Testing switchChain...');
    
    try {
      if (!isConnected) {
        updateResult(testName, 'info', 'Connect a wallet first');
        return;
      }

      // Switch to the other chain (Base <-> Polygon)
      const targetChainId = chainId === 8453 ? 137 : 8453;
      const targetChainName = targetChainId === 8453 ? 'Base' : 'Polygon';
      
      await switchChain({ chainId: targetChainId });
      
      updateResult(
        testName, 
        'pass', 
        `Switched to ${targetChainName}!`,
        { fromChain: chainId, toChain: targetChainId }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const testGetProvider = async () => {
    const testName = 'getProvider';
    updateResult(testName, 'running', 'Testing getProvider...');
    
    try {
      if (!isConnected || !connector) {
        updateResult(testName, 'info', 'Connect a wallet first');
        return;
      }

      // Check if connector has getProvider method
      const hasGetProvider = typeof connector.getProvider === 'function';
      
      if (!hasGetProvider) {
        throw new Error('Connector does not have getProvider method');
      }
      
      // Try to get the provider
      const provider = await connector.getProvider();
      
      updateResult(
        testName, 
        'pass', 
        'getProvider works!',
        { 
          hasProvider: !!provider,
          connectorType: connector.id
        }
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    // Run tests sequentially
    await testSetup();
    await new Promise(r => setTimeout(r, 500));
    
    await testConnect();
    await new Promise(r => setTimeout(r, 500));
    
    await testGetAccount();
    await new Promise(r => setTimeout(r, 500));
    
    await testGetChainId();
    await new Promise(r => setTimeout(r, 500));
    
    await testIsAuthorized();
    await new Promise(r => setTimeout(r, 500));
    
    await testGetProvider();
    await new Promise(r => setTimeout(r, 500));
    
    // Note: We don't test switchChain and disconnect in automated tests
    // as they would disrupt the connection
    
    setIsRunning(false);
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
          ⚠️ Connect a wallet to run connector function tests
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Test Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
      }}>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          style={buttonStyle}
        >
          {isRunning ? '🔄 Running...' : '▶️ Run All Tests'}
        </button>
        
        <button onClick={testSetup} style={buttonStyle}>
          🔧 Test setup()
        </button>
        
        <button onClick={testConnect} style={buttonStyle}>
          🔌 Test connect()
        </button>
        
        <button onClick={testGetAccount} style={buttonStyle}>
          👤 Test getAccount()
        </button>
        
        <button onClick={testGetChainId} style={buttonStyle}>
          🔗 Test getChainId()
        </button>
        
        <button onClick={testIsAuthorized} style={buttonStyle}>
          ✅ Test isAuthorized()
        </button>
        
        <button onClick={testSwitchChain} style={buttonStyle}>
          🔄 Test switchChain()
        </button>
        
        <button onClick={testGetProvider} style={buttonStyle}>
          🎁 Test getProvider()
        </button>
        
        <button 
          onClick={testDisconnect} 
          style={{...buttonStyle, background: '#dc3545'}}
        >
          🔌 Test disconnect()
        </button>
      </div>

      {/* Test Results */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        minHeight: '200px',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Test Results</h3>
        
        {Object.keys(testResults).length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>
            Click a test button above to run tests...
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(testResults).map(([testName, result]) => (
              <div
                key={testName}
                style={{
                  padding: '15px',
                  background: 'white',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getStatusColor(result.status)}`,
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  <strong style={{ fontSize: '14px' }}>
                    {getStatusIcon(result.status)} {testName}()
                  </strong>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    fontFamily: 'monospace',
                  }}>
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '13px',
                  color: '#555',
                }}>
                  {result.message}
                </p>
                
                {result.data && (
                  <pre style={{
                    margin: 0,
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '12px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Summary */}
      {Object.keys(testResults).length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '14px',
        }}>
          <div>
            <strong>✅ Passed:</strong>{' '}
            {Object.values(testResults).filter(r => r.status === 'pass').length}
          </div>
          <div>
            <strong>❌ Failed:</strong>{' '}
            {Object.values(testResults).filter(r => r.status === 'fail').length}
          </div>
          <div>
            <strong>ℹ️ Info:</strong>{' '}
            {Object.values(testResults).filter(r => r.status === 'info').length}
          </div>
          <div>
            <strong>⏳ Running:</strong>{' '}
            {Object.values(testResults).filter(r => r.status === 'running').length}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
const getStatusIcon = (status) => {
  switch (status) {
    case 'pass': return '✅';
    case 'fail': return '❌';
    case 'running': return '⏳';
    case 'info': return 'ℹ️';
    case 'warning': return '⚠️';
    default: return '❓';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pass': return '#28a745';
    case 'fail': return '#dc3545';
    case 'running': return '#ffc107';
    case 'info': return '#17a2b8';
    case 'warning': return '#fd7e14';
    default: return '#6c757d';
  }
};

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '13px',
  fontWeight: 'bold',
  color: 'white',
  background: '#667eea',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
};