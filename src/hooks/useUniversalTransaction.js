// src/hooks/useUniversalTransaction.js
// Universal transaction hook that works with BOTH Unicorn and standard wallets
import { useSendTransaction, useWriteContract } from 'wagmi';
import { useUnicornTransaction } from './useUnicornTransaction';
import { useUniversalWallet } from './useUniversalWallet';

export const useUniversalTransaction = () => {
  const wallet = useUniversalWallet();
  const wagmiSend = useSendTransaction();
  const wagmiWrite = useWriteContract();
  const unicornTx = useUnicornTransaction();

  // Determine which wallet is active
  const isUnicorn = wallet.isUnicorn;

  // Send simple transaction
  const sendTransaction = async (params) => {
    if (isUnicorn) {
      return await unicornTx.sendTransactionAsync(params);
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
      // For standard wallets, use viem directly
      const { readContract: viemRead } = await import('viem');
      const { publicClient } = await import('wagmi/actions');
      return await viemRead(params);
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

    // State (combine from both sources)
    isPending: isUnicorn ? unicornTx.isPending : (wagmiSend.isPending || wagmiWrite.isPending),
    isLoading: isUnicorn ? unicornTx.isLoading : (wagmiSend.isPending || wagmiWrite.isPending),
    error: isUnicorn ? unicornTx.error : (wagmiSend.error || wagmiWrite.error),
    data: isUnicorn ? unicornTx.data : (wagmiSend.data || wagmiWrite.data),
    isError: isUnicorn ? unicornTx.isError : (wagmiSend.isError || wagmiWrite.isError),
    isSuccess: isUnicorn ? unicornTx.isSuccess : (wagmiSend.isSuccess || wagmiWrite.isSuccess),

    // Helpers
    reset: isUnicorn ? unicornTx.reset : () => {
      wagmiSend.reset();
      wagmiWrite.reset();
    },

    // Metadata
    isUnicorn,
  };
};