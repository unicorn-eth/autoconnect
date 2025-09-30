// Coded lovingly by @cryptowampum and Claude AI
// unicornWalletWrapper.js - Wraps Unicorn wallet to add transaction approval
import { requestTransactionApproval } from '../components/UnicornTransactionApproval';
import { prepareTransaction, sendTransaction as thirdwebSendTransaction } from 'thirdweb';

/**
 * Wraps a Unicorn wallet to add transaction approval dialogs
 * @param {Object} wallet - The Unicorn wallet instance
 * @param {boolean} requireApproval - Whether to require approval (default: true)
 * @param {Object} client - Thirdweb client instance
 * @param {Object} chain - Thirdweb chain object
 * @returns {Object} Wrapped wallet with approval flow
 */
export const wrapUnicornWallet = (wallet, requireApproval = true, client = null, chain = null) => {
  if (!wallet) return null;

  // Get the account from the wallet
  let account = null;
  try {
    account = wallet.getAccount?.();
  } catch (e) {
    console.warn('Could not get account from wallet:', e);
  }

  // Create a wrapped wallet object with approval functionality
  const wrappedWallet = {
    // Copy all original wallet properties and methods
    ...wallet,
    
    // Add custom sendTransaction that shows approval dialog
    sendTransaction: async (transaction) => {
      console.log('🔥 Wrapped sendTransaction called!', transaction);
      
      try {
        // Always show approval dialog
        if (requireApproval) {
          console.log('📋 Requesting user approval...');
          await requestTransactionApproval(transaction);
          console.log('✅ Approved! Sending transaction...');
        }
        
        // Get the account if not already available
        if (!account) {
          account = wallet.getAccount?.();
        }
        
        if (!account) {
          throw new Error('No account available to send transaction');
        }

        if (!client || !chain) {
          throw new Error('Client and chain are required for transactions');
        }

        console.log('📤 Preparing transaction with Thirdweb...');
        
        // Prepare the transaction with proper Thirdweb format
        const preparedTx = await prepareTransaction({
          to: transaction.to,
          value: transaction.value || 0n,
          data: transaction.data || '0x',
          chain: chain,
          client: client,
        });
        
        console.log('Prepared transaction:', preparedTx);
        
        // Send the transaction using Thirdweb's sendTransaction
        console.log('Sending transaction...');
        const result = await thirdwebSendTransaction({
          transaction: preparedTx,
          account: account,
        });
        
        console.log('✅ Transaction sent!', result);
        
        return result;
        
      } catch (error) {
        console.log('❌ Transaction failed:', error.message, error);
        throw error;
      }
    },

    // Store client and chain for reference
    _client: client,
    _chain: chain,
    _isWrapped: true,
    _originalWallet: wallet,
    _requireApproval: requireApproval,
  };

  return wrappedWallet;
};

/**
 * Check if a wallet is already wrapped
 * @param {Object} wallet - Wallet to check
 * @returns {boolean} True if wrapped
 */
export const isWrappedWallet = (wallet) => {
  return wallet?._isWrapped === true;
};

/**
 * Get original wallet from wrapped wallet
 * @param {Object} wallet - Wrapped wallet
 * @returns {Object} Original wallet
 */
export const unwrapWallet = (wallet) => {
  return wallet?._originalWallet || wallet;
};