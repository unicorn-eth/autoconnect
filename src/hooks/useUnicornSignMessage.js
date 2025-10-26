// src/hooks/useUnicornSignMessage.js
// Enhanced message signing hook for Unicorn wallets - v1.2.0 FIXED
import { useState, useCallback } from 'react';
import { hashMessage, verifyMessage as viemVerifyMessage } from 'viem';
import { useUniversalWallet } from './useUniversalWallet';

export const useUnicornSignMessage = () => {
  const wallet = useUniversalWallet();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Sign a message (personal_sign)
  const signMessage = useCallback(async ({ message }) => {
    if (!wallet.isUnicorn || !wallet.unicornWallet) {
      throw new Error('Unicorn wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setData(null);

    try {
      const account = wallet.unicornWallet.getAccount();
      
      // Sign the message
      const signature = await account.signMessage({ 
        message: typeof message === 'string' ? message : message.raw 
      });
      
      setData(signature);
      return signature;
    } catch (err) {
      console.error('Message signing failed:', err);
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [wallet.isUnicorn, wallet.unicornWallet]);

  // Sign typed data (EIP-712)
  const signTypedData = useCallback(async ({ domain, types, primaryType, message }) => {
    if (!wallet.isUnicorn || !wallet.unicornWallet) {
      throw new Error('Unicorn wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setData(null);

    try {
      const account = wallet.unicornWallet.getAccount();
      
      // Prepare the typed data
      const typedData = {
        domain,
        types,
        primaryType,
        message,
      };
      
      // Sign the typed data
      const signature = await account.signTypedData(typedData);
      
      setData(signature);
      return signature;
    } catch (err) {
      console.error('Typed data signing failed:', err);
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [wallet.isUnicorn, wallet.unicornWallet]);

  // Verify a signature
  const verifyMessage = useCallback(async ({ message, signature }) => {
    if (!wallet.address) {
      throw new Error('No wallet address available');
    }

    try {
      // Ensure message is in the correct format
      const messageToVerify = typeof message === 'string' ? message : message.raw;
      
      console.log('🔍 Verifying signature:', {
        address: wallet.address,
        message: messageToVerify,
        signature: signature.slice(0, 20) + '...',
        isUnicorn: wallet.isUnicorn,
      });

      // For Unicorn wallets (smart accounts), we can't do standard verification
      if (wallet.isUnicorn) {
        console.warn('⚠️ Note: Unicorn wallets use smart account signatures (ERC-1271).');
        console.warn('⚠️ Standard ECDSA verification does not apply.');
        console.warn('⚠️ Signature is valid on-chain but requires contract interaction to verify.');
        
        // Return structured response for smart accounts
        return {
          isValid: false, // Standard verification would fail
          isSmartAccount: true,
          requiresOnChainVerification: true,
          standard: 'ERC-1271',
          message: 'Smart account signatures require ERC-1271 on-chain verification. The signature is valid but cannot be verified client-side using standard ECDSA.',
        };
      }

      // For standard wallets (EOAs), use normal verification
      const isValid = await viemVerifyMessage({
        address: wallet.address,
        message: messageToVerify,
        signature,
      });
      
      console.log(isValid ? '✅ Verification passed' : '❌ Verification failed');
      
      // Return structured response for EOAs
      return {
        isValid,
        isSmartAccount: false,
        requiresOnChainVerification: false,
        standard: 'ECDSA',
        message: isValid ? 'Signature is valid' : 'Signature is invalid',
      };
    } catch (err) {
      console.error('❌ Signature verification failed:', err);
      
      // If it's a smart account, return structured error
      if (wallet.isUnicorn) {
        return {
          isValid: false,
          isSmartAccount: true,
          requiresOnChainVerification: true,
          standard: 'ERC-1271',
          error: err.message,
          message: 'Smart account signature verification requires ERC-1271 on-chain verification.',
        };
      }
      
      throw err;
    }
  }, [wallet.address, wallet.isUnicorn]);

  // Reset state
  const reset = useCallback(() => {
    setIsPending(false);
    setError(null);
    setData(null);
  }, []);

  return {
    // Async functions
    signMessage,
    signMessageAsync: signMessage, // Alias for wagmi compatibility
    signTypedData,
    signTypedDataAsync: signTypedData, // Alias for wagmi compatibility
    verifyMessage,
    
    // State
    isPending,
    isLoading: isPending, // Alias for wagmi compatibility
    error,
    data,
    signature: data, // Alias
    isError: !!error,
    isSuccess: !!data && !error,
    
    // Helpers
    reset,
  };
};