// Coded lovingly by @cryptowampum and Claude AI
// useUnicornSignMessage.js - Universal signing hook for both wallet types
import { useState, useCallback, useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import { useUniversalWallet } from './useUniversalWallet';

/**
 * Universal message signing hook that works with both Unicorn and standard wallets
 * 
 * @returns {Object} Signing state and sign function
 */
export const useUnicornSignMessage = () => {
  const wallet = useUniversalWallet();
  const { signMessage: wagmiSignMessage, data: wagmiSignature, isPending: isWagmiPending, error: wagmiError } = useSignMessage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);

  // Watch for Wagmi signature result
  useEffect(() => {
    if (wagmiSignature) {
      setSignature(wagmiSignature);
      setIsLoading(false);
    }
  }, [wagmiSignature]);

  // Watch for Wagmi error
  useEffect(() => {
    if (wagmiError) {
      setError(wagmiError);
      setIsLoading(false);
    }
  }, [wagmiError]);

  const signMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);
    setSignature(null);

    try {
      if (!wallet.isConnected) {
        throw new Error('Wallet not connected');
      }

      if (wallet.isUnicorn) {
        // Unicorn wallet - uses smart wallet signing
        console.log('🦄 Signing message via Unicorn...');
        
        const account = wallet.unicornWallet.getAccount?.();
        
        if (!account || !account.signMessage) {
          throw new Error('Smart wallet does not support message signing');
        }

        const sig = await account.signMessage({ message });
        
        setSignature(sig);
        setIsLoading(false);
        
        return sig;
        
      } else if (wallet.isStandard) {
        // Standard wallet - uses Wagmi
        console.log('💼 Signing message via standard wallet...');
        
        wagmiSignMessage({ message });
        // Result will be picked up by useEffect watching wagmiSignature
        
        // Return a promise that resolves when signature is received
        return new Promise((resolve, reject) => {
          const checkInterval = setInterval(() => {
            if (wagmiSignature) {
              clearInterval(checkInterval);
              resolve(wagmiSignature);
            }
            if (wagmiError) {
              clearInterval(checkInterval);
              reject(wagmiError);
            }
          }, 100);
          
          // Timeout after 60 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('Signing timeout'));
          }, 60000);
        });
      }
      
    } catch (err) {
      console.error('Signing error:', err);
      setError(err);
      setIsLoading(false);
      throw err;
    }
  }, [wallet, wagmiSignMessage, wagmiSignature, wagmiError]);

  return {
    signMessage,
    isLoading: isLoading || isWagmiPending,
    signature,
    error,
    isUnicorn: wallet.isUnicorn,
    isStandard: wallet.isStandard,
    isConnected: wallet.isConnected,
  };
};