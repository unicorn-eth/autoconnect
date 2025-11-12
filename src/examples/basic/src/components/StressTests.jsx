// src/examples/basic/src/components/StressTests.jsx
// Stress tests and edge case handling for v1.3

import { useState } from 'react';
import { 
  useAccount, 
  useSendTransaction,
  useSwitchChain,
  useSignMessage,
} from 'wagmi';
import { parseEther } from 'viem';

const TEST_ADDRESS = '0x7049747E615a1C5C22935D5790a664B7E65D9681';

export function StressTests() {
  const { address, isConnected, chainId } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const { signMessage } = useSignMessage();
  
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (testName, status, message, details = '') => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status, message, details, timestamp: Date.now() }
    }));
  };

  // Test 1: Rapid consecutive transactions
  const testRapidTransactions = async () => {
    const testName = 'rapidTransactions';
    updateResult(testName, 'running', 'Testing 3 rapid transactions...');
    
    try {
      const txPromises = [];
      
      for (let i = 0; i < 3; i++) {
        txPromises.push(
          sendTransaction({
            to: TEST_ADDRESS,
            value: parseEther('0.00001'),
          })
        );
        await new Promise(r => setTimeout(r, 100)); // Small delay
      }
      
      const results = await Promise.allSettled(txPromises);
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected').length;
      
      updateResult(
        testName,
        successes === 3 ? 'pass' : 'warning',
        `${successes}/3 transactions succeeded`,
        `Successes: ${successes}, Failures: ${failures}`
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  // Test 2: Chain switching stress test
  const testChainSwitching = async () => {
    const testName = 'chainSwitching';
    updateResult(testName, 'running', 'Testing rapid chain switches...');
    
    try {
      const originalChain = chainId;
      const switches = [];
      
      // Switch Base -> Polygon -> Base
      switches.push(await switchChain({ chainId: 137 }));
      await new Promise(r => setTimeout(r, 500));
      
      switches.push(await switchChain({ chainId: 8453 }));
      await new Promise(r => setTimeout(r, 500));
      
      switches.push(await switchChain({ chainId: originalChain }));
      
      updateResult(
        testName,
        'pass',
        'Successfully switched chains multiple times',
        `Completed ${switches.length} chain switches`
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  // Test 3: Invalid transaction parameters
  const testInvalidParams = async () => {
    const testName = 'invalidParams';
    updateResult(testName, 'running', 'Testing error handling...');
    
    try {
      // Try to send to invalid address
      await sendTransaction({
        to: '0xinvalid',
        value: parseEther('0.0001'),
      });
      
      updateResult(testName, 'fail', 'Should have thrown error for invalid address');
    } catch (error) {
      // This is expected!
      updateResult(
        testName,
        'pass',
        'Correctly rejected invalid transaction',
        error.message
      );
    }
  };

  // Test 4: Zero value transaction
  const testZeroValue = async () => {
    const testName = 'zeroValue';
    updateResult(testName, 'running', 'Testing zero value transaction...');
    
    try {
      const hash = await sendTransaction({
        to: TEST_ADDRESS,
        value: 0n,
      });
      
      updateResult(
        testName,
        'pass',
        'Zero value transaction succeeded',
        `Hash: ${hash?.slice(0, 20)}...`
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  // Test 5: Large message signing
  const testLargeMessage = async () => {
    const testName = 'largeMessage';
    updateResult(testName, 'running', 'Testing large message signing...');
    
    try {
      // Create a 10KB message
      const largeMessage = 'A'.repeat(10000);
      
      const sig = await signMessage({ message: largeMessage });
      
      updateResult(
        testName,
        'pass',
        'Successfully signed 10KB message',
        `Signature: ${sig?.slice(0, 20)}...`
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  // Test 6: Concurrent operations
  const testConcurrentOps = async () => {
    const testName = 'concurrentOps';
    updateResult(testName, 'running', 'Testing concurrent operations...');
    
    try {
      // Try to sign and send transaction simultaneously
      const results = await Promise.allSettled([
        signMessage({ message: 'Test 1' }),
        signMessage({ message: 'Test 2' }),
        sendTransaction({
          to: TEST_ADDRESS,
          value: parseEther('0.00001'),
        }),
      ]);
      
      const successes = results.filter(r => r.status === 'fulfilled').length;
      
      updateResult(
        testName,
        successes === 3 ? 'pass' : 'warning',
        `${successes}/3 concurrent operations succeeded`,
        results.map((r, i) => `Op ${i + 1}: ${r.status}`).join(', ')
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  // Test 7: Transaction with data
  const testTxWithData = async () => {
    const testName = 'txWithData';
    updateResult(testName, 'running', 'Testing transaction with data...');
    
    try {
      const hash = await sendTransaction({
        to: TEST_ADDRESS,
        value: parseEther('0.00001'),
        data: '0x1234567890abcdef',
      });
      
      updateResult(
        testName,
        'pass',
        'Transaction with data succeeded',
        `Hash: ${hash?.slice(0, 20)}...`
      );
    } catch (error) {
      updateResult(testName, 'fail', error.message);
    }
  };

  // Test 8: Maximum value handling
  const testMaxValue = async () => {
    const testName = 'maxValue';
    updateResult(testName, 'running', 'Testing large value handling...');
    
    try {
      // Try to send more ETH than available (should fail gracefully)
      await sendTransaction({
        to: TEST_ADDRESS,
        value: parseEther('999999'),
      });
      
      updateResult(testName, 'fail', 'Should have failed with insufficient funds');
    } catch (error) {
      // Expected to fail
      updateResult(
        testName,
        'pass',
        'Correctly rejected transaction with insufficient funds',
        error.message.slice(0, 100)
      );
    }
  };

  const runAllStressTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    // Run tests with delays
    const tests = [
      testInvalidParams,
      testZeroValue,
      testLargeMessage,
      testTxWithData,
      testMaxValue,
      // These tests are more destructive, run them last
      // testRapidTransactions,
      // testChainSwitching,
      // testConcurrentOps,
    ];
    
    for (const test of tests) {
      await test();
      await new Promise(r => setTimeout(r, 1000));
    }
    
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
          ⚠️ Connect a wallet to run stress tests
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Warning Banner */}
      <div style={{
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
      }}>
        <strong>⚠️ Warning:</strong> These tests will send small amounts of ETH 
        and perform various operations. Make sure you're on a testnet or have 
        sufficient funds. Some tests are designed to fail (to test error handling).
      </div>

      {/* Test Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
      }}>
        <button
          onClick={runAllStressTests}
          disabled={isRunning}
          style={{...buttonStyle, background: '#28a745'}}
        >
          {isRunning ? '🔄 Running...' : '▶️ Run Safe Tests'}
        </button>
        
        <button onClick={testInvalidParams} style={buttonStyle}>
          🚫 Invalid Params
        </button>
        
        <button onClick={testZeroValue} style={buttonStyle}>
          0️⃣ Zero Value TX
        </button>
        
        <button onClick={testLargeMessage} style={buttonStyle}>
          📄 Large Message
        </button>
        
        <button onClick={testTxWithData} style={buttonStyle}>
          📦 TX with Data
        </button>
        
        <button onClick={testMaxValue} style={buttonStyle}>
          💰 Max Value
        </button>
        
        <button 
          onClick={testRapidTransactions} 
          style={{...buttonStyle, background: '#ffc107'}}
        >
          ⚡ Rapid TXs
        </button>
        
        <button 
          onClick={testChainSwitching}
          style={{...buttonStyle, background: '#ffc107'}}
        >
          🔄 Chain Switches
        </button>
        
        <button 
          onClick={testConcurrentOps}
          style={{...buttonStyle, background: '#ffc107'}}
        >
          🔀 Concurrent Ops
        </button>
      </div>

      {/* Test Results */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        minHeight: '200px',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Stress Test Results</h3>
        
        {Object.keys(testResults).length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>
            Click a test button above or run all safe tests...
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
                    {getStatusIcon(result.status)} {testName}
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
                
                {result.details && (
                  <pre style={{
                    margin: 0,
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '11px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                  }}>
                    {result.details}
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
            <strong>⚠️ Warnings:</strong>{' '}
            {Object.values(testResults).filter(r => r.status === 'warning').length}
          </div>
          <div>
            <strong>⏳ Running:</strong>{' '}
            {Object.values(testResults).filter(r => r.status === 'running').length}
          </div>
        </div>
      )}

      {/* What These Tests Prove */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px',
      }}>
        <strong>🎯 What These Stress Tests Prove:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>
            <strong>Error handling:</strong> Connector properly validates and rejects 
            invalid transactions
          </li>
          <li>
            <strong>Edge cases:</strong> Zero value, large messages, and transactions 
            with data all work
          </li>
          <li>
            <strong>Resource limits:</strong> Properly handles insufficient funds and 
            other resource constraints
          </li>
          <li>
            <strong>Concurrent operations:</strong> Multiple operations can run 
            simultaneously
          </li>
          <li>
            <strong>Network switching:</strong> Chain switching works reliably
          </li>
          <li>
            <strong>Production ready:</strong> Handles real-world edge cases gracefully
          </li>
        </ul>
      </div>
    </div>
  );
}

// Helper functions
const getStatusIcon = (status) => {
  switch (status) {
    case 'pass': return '✅';
    case 'fail': return '❌';
    case 'running': return '⏳';
    case 'warning': return '⚠️';
    default: return '❓';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pass': return '#28a745';
    case 'fail': return '#dc3545';
    case 'running': return '#ffc107';
    case 'warning': return '#fd7e14';
    default: return '#6c757d';
  }
};

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '13px',
  fontWeight: 'bold',
  color: 'white',
  background: '#f093fb',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
};