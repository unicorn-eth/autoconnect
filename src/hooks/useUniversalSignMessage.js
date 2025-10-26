// src/hooks/useUniversalSignMessage.js
// Universal signing hook that works with BOTH Unicorn and standard wallets
import { useSignMessage, useSignTypedData } from 'wagmi';
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
      // For standard wallets, use viem directly
      const { verifyMessage: viemVerify } = await import('viem');
      return await viemVerify({
        address: wallet.address,
        message: params.message,
        signature: params.signature,
      });
    }
  };

  return {
    // Async functions
    signMessage,
    signMessageAsync: signMessage,
    signTypedData,
    signTypedDataAsync: signTypedData,
    verifyMessage,

    // State (combine from both sources)
    isPending: isUnicorn ? unicornSign.isPending : (wagmiSign.isPending || wagmiTypedData.isPending),
    isLoading: isUnicorn ? unicornSign.isLoading : (wagmiSign.isPending || wagmiTypedData.isPending),
    error: isUnicorn ? unicornSign.error : (wagmiSign.error || wagmiTypedData.error),
    data: isUnicorn ? unicornSign.data : (wagmiSign.data || wagmiTypedData.data),
    signature: isUnicorn ? unicornSign.signature : (wagmiSign.data || wagmiTypedData.data),
    isError: isUnicorn ? unicornSign.isError : (wagmiSign.isError || wagmiTypedData.isError),
    isSuccess: isUnicorn ? unicornSign.isSuccess : (wagmiSign.isSuccess || wagmiTypedData.isSuccess),

    // Helpers
    reset: isUnicorn ? unicornSign.reset : () => {
      wagmiSign.reset();
      wagmiTypedData.reset();
    },

    // Metadata
    isUnicorn,
  };
};