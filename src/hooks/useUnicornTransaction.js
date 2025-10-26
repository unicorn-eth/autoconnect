// src/hooks/useUnicornTransaction.js
// Enhanced transaction hook for Unicorn wallets - v1.2.0 FIXED
import { useState, useCallback } from 'react';
import { parseEther, encodeFunctionData, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { useUniversalWallet } from './useUniversalWallet';

export const useUnicornTransaction = () => {
  const wallet = useUniversalWallet();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Send a simple ETH transfer
  const sendTransaction = useCallback(async ({ to, value, data: txData }) => {
    if (!wallet.isUnicorn || !wallet.unicornWallet) {
      throw new Error('Unicorn wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setData(null);

    try {
      // Prepare transaction object
      const tx = {
        to,
        value: typeof value === 'string' ? parseEther(value) : (value || 0n),
      };
      
      // Only add data if explicitly provided
      if (txData) {
        tx.data = txData;
      }

      console.log('🦄 Sending transaction via wrapped wallet:', JSON.stringify(tx, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));

      // Use the WRAPPED wallet's sendTransaction (which has the approval flow)
      // This method is defined in unicornWalletWrapper.js
      const result = await wallet.unicornWallet.sendTransaction(tx);
      
      console.log('🦄 Transaction result:', result);
      
      setData(result);
      return result;
    } catch (err) {
      console.error('🦄 Transaction failed:', err);
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [wallet.isUnicorn, wallet.unicornWallet]);

  // Write to a contract (like useWriteContract in wagmi)
  const writeContract = useCallback(async ({ 
    address, 
    abi, 
    functionName, 
    args = [],
    value,
  }) => {
    if (!wallet.isUnicorn || !wallet.unicornWallet) {
      throw new Error('Unicorn wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setData(null);

    try {
      // Find the function in the ABI
      const functionAbi = abi.find(
        item => item.type === 'function' && item.name === functionName
      );

      if (!functionAbi) {
        throw new Error(`Function ${functionName} not found in ABI`);
      }

      // Encode the function call
      const data = encodeFunctionData({
        abi: [functionAbi],
        functionName,
        args,
      });

      // Prepare transaction
      const tx = {
        to: address,
        data,
        value: value ? (typeof value === 'string' ? parseEther(value) : value) : 0n,
      };

      console.log('🦄 Writing to contract via wrapped wallet:', {
        address,
        functionName,
        args,
        value: tx.value.toString(),
      });

      // Use the WRAPPED wallet's sendTransaction (which has the approval flow)
      const result = await wallet.unicornWallet.sendTransaction(tx);
      
      console.log('🦄 Contract write result:', result);
      
      setData(result);
      return result;
    } catch (err) {
      console.error('🦄 Contract write failed:', err);
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [wallet.isUnicorn, wallet.unicornWallet]);

  // Read from a contract (like useReadContract in wagmi)
  const readContract = useCallback(async ({
    address,
    abi,
    functionName,
    args = [],
  }) => {
    if (!wallet.unicornWallet) {
      throw new Error('Wallet not connected');
    }

    try {
      // Create a public client for the current chain
      const publicClient = createPublicClient({
        chain: base, // TODO: Make this dynamic based on wallet.chainId
        transport: http(),
      });
      
      // Find the function in the ABI
      const functionAbi = abi.find(
        item => item.type === 'function' && item.name === functionName
      );

      if (!functionAbi) {
        throw new Error(`Function ${functionName} not found in ABI`);
      }

      // Read from contract using viem
      const result = await publicClient.readContract({
        address,
        abi: [functionAbi],
        functionName,
        args,
      });

      return result;
    } catch (err) {
      console.error('Contract read failed:', err);
      throw err;
    }
  }, [wallet.unicornWallet, wallet.chainId]);

  // Reset state
  const reset = useCallback(() => {
    setIsPending(false);
    setError(null);
    setData(null);
  }, []);

  return {
    // Async functions
    sendTransaction,
    sendTransactionAsync: sendTransaction, // Alias for wagmi compatibility
    writeContract,
    writeContractAsync: writeContract, // Alias for wagmi compatibility
    readContract,
    readContractAsync: readContract, // Alias for wagmi compatibility
    
    // State
    isPending,
    isLoading: isPending, // Alias for wagmi compatibility
    error,
    data,
    isError: !!error,
    isSuccess: !!data && !error,
    
    // Helpers
    reset,
  };
};