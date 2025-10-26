// src/hooks/useUniversalTransaction.js
// Universal transaction hook that works with BOTH Unicorn and standard wallets
import { useSendTransaction, useWriteContract, useConfig, usePublicClient } from 'wagmi';
import { readContract as viemReadContract } from 'viem/actions';
import { useUnicornTransaction } from './useUnicornTransaction';
import { useUniversalWallet } from './useUniversalWallet';

export const useUniversalTransaction = () => {
  const wallet = useUniversalWallet();
  const wagmiSend = useSendTransaction();
  const wagmiWrite = useWriteContract();
  const unicornTx = useUnicornTransaction();
  const config = useConfig();
  const publicClient = usePublicClient();

  // Determine which wallet is active
  const isUnicorn = wallet.isUnicorn;

  // Send transaction
  const sendTransaction = async (params) => {
    if (isUnicorn) {
      return await unicornTx.sendTransaction(params);
    } else {
      return await wagmiSend.sendTransactionAsync(params);
    }
  };

  // Write to contract
  const writeContract = async (params) => {
    if (isUnicorn) {
      return await unicornTx.writeContractAsync(params);
    } else {
      return await wagmiWrite.writeContractAsync(params);
    }
  };

  // Read from contract
  const readContract = async (params) => {
    if (isUnicorn) {
      return await unicornTx.readContractAsync(params);
    } else {
      // For standard wallets, use viem's readContract action with publicClient
      if (!publicClient) {
        throw new Error('No public client available');
      }
      return await viemReadContract(publicClient, {
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      });
    }
  };

  return {
    // Async functions
    sendTransaction,
    sendTransactionAsync: sendTransaction,
    writeContract,
    writeContractAsync: writeContract,
    readContract,
    readContractAsync: readContract,
    
    // Loading states
    isPending: isUnicorn ? unicornTx.isPending : (wagmiSend.isPending || wagmiWrite.isPending),
    isLoading: isUnicorn ? unicornTx.isLoading : (wagmiSend.isPending || wagmiWrite.isPending),
    
    // Error handling
    error: isUnicorn ? unicornTx.error : (wagmiSend.error || wagmiWrite.error),
    
    // Reset
    reset: () => {
      if (isUnicorn) {
        unicornTx.reset();
      } else {
        wagmiSend.reset();
        wagmiWrite.reset();
      }
    },
  };
};