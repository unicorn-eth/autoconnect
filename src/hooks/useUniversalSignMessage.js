// src/hooks/useUniversalSignMessage.js
// Universal signing hook that works with BOTH Unicorn and standard wallets
import { useSignMessage, useSignTypedData } from 'wagmi';
import { verifyMessage as viemVerifyMessage } from 'viem';
import { useUnicornSignMessage } from './useUnicornSignMessage';
import { useUniversalWallet } from './useUniversalWallet';

export const useUniversalSignMessage = () => {
  const wallet = useUniversalWallet();
  const wagmiSign = useSignMessage();
  const wagmiTypedData = useSignTypedData();
  const unicornSign = useUnicornSignMessage();

  // Determine which wallet is active
  const isUnicorn = wallet.isUnicorn;

  // Sign message
  const signMessage = async (params) => {
    if (isUnicorn) {
      return await unicornSign.signMessageAsync(params);
    } else {
      return await wagmiSign.signMessageAsync(params);
    }
  };

  // Sign typed data
  const signTypedData = async (params) => {
    if (isUnicorn) {
      return await unicornSign.signTypedDataAsync(params);
    } else {
      return await wagmiTypedData.signTypedDataAsync(params);
    }
  };

  // Verify message
  const verifyMessage = async (params) => {
    if (isUnicorn) {
      return await unicornSign.verifyMessage(params);
    } else {
      // For standard wallets, use viem's verifyMessage directly
      const isValid = await viemVerifyMessage({
        address: wallet.address,
        message: params.message,
        signature: params.signature,
      });
      
      // Return in the same structured format as Unicorn
      return {
        isValid,
        isSmartAccount: false,
        requiresOnChainVerification: false,
        standard: 'ECDSA',
        message: isValid ? 'Valid ECDSA signature' : 'Invalid signature',
      };
    }
  };

  return {
    // Async functions
    signMessage,
    signMessageAsync: signMessage,
    signTypedData,
    signTypedDataAsync: signTypedData,
    verifyMessage,
    
    // Loading states
    isPending: isUnicorn ? unicornSign.isPending : (wagmiSign.isPending || wagmiTypedData.isPending),
    
    // Signature (from wagmi or unicorn)
    signature: isUnicorn ? unicornSign.signature : (wagmiSign.data || wagmiTypedData.data),
    
    // Error handling
    error: isUnicorn ? unicornSign.error : (wagmiSign.error || wagmiTypedData.error),
    
    // Reset
    reset: () => {
      if (isUnicorn) {
        unicornSign.reset();
      } else {
        wagmiSign.reset();
        wagmiTypedData.reset();
      }
    },
  };
};