//Coded lovingly by @cryptowampum and Claude AI
// useUnicornTransaction.js - Universal transaction hook for both wallet types
import { useState, useCallback } from 'react';
import { useSendTransaction } from 'wagmi';
import { useUniversalWallet } from './useUniversalWallet';

/**
 * Universal transaction hook that works with both Unicorn and standard wallets
 * Handles approval dialogs automatically for Unicorn wallets
 * 
 * @returns {Object} Transaction state and send function
 */
export const useUnicornTransaction = () => {
  const wallet = useUniversalWallet();
  const { sendTransaction: wagmiSendTx, isPending: isWagmiPending, data: wagmiHash, error: wagmiError } = useSendTransaction();
  
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const sendTransaction = useCallback(async (transaction) => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      if (!wallet.isConnected) {
        throw new Error('Wallet not connected');
      }

      if (wallet.isUnicorn) {
        // Unicorn wallet - uses wrapped sendTransaction with approval
        console.log('🦄 Sending transaction via Unicorn...');
        
        if (!wallet.unicornWallet?.sendTransaction) {
          throw new Error('Unicorn wallet not properly initialized');
        }

        const result = await wallet.unicornWallet.sendTransaction(transaction);
        const hash = result.transactionHash || result.hash;
        
        setTxHash(hash);
        setIsLoading(false);
        
        return { hash, result };
        
      } else if (wallet.isStandard) {
        // Standard wallet - uses Wagmi
        console.log('💼 Sending transaction via standard wallet...');
        
        const result = await wagmiSendTx(transaction);
        
        // Wagmi result will be picked up by the hook's data property
        setIsLoading(false);
        
        return result;
      }
      
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err);
      setIsLoading(false);
      throw err;
    }
  }, [wallet, wagmiSendTx]);

  return {
    sendTransaction,
    isLoading: isLoading || isWagmiPending,
    hash: txHash || wagmiHash,
    error: error || wagmiError,
    isUnicorn: wallet.isUnicorn,
    isStandard: wallet.isStandard,
    isConnected: wallet.isConnected,
  };
};