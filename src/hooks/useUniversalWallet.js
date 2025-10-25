// Coded lovingly by @cryptowampum and Claude AI
// src/hooks/useUniversalWallet.js - Bridge Unicorn wallet to work with existing Wagmi code
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

// 🔥 GLOBAL STORE - Shared across all hook instances
// This is the key fix for the state consistency bug
const unicornWalletStore = {
  wallet: null,
  address: null,
  chain: null,
  chainId: null,
  listeners: new Set(),
  
  // Update state and notify all subscribers
  setState(wallet, address, chain, chainId) {
    this.wallet = wallet;
    this.address = address;
    this.chain = chain;
    this.chainId = chainId;
    
    // Notify all subscribed components of the state change
    this.listeners.forEach(listener => {
      listener({ wallet, address, chain, chainId });
    });
  },
  
  // Subscribe a component to state updates
  subscribe(listener) {
    this.listeners.add(listener);
    
    // Immediately provide current state to new subscribers
    // This ensures late-mounting components get the current state
    listener({ 
      wallet: this.wallet, 
      address: this.address,
      chain: this.chain,
      chainId: this.chainId
    });
    
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  },
  
  // Get current state (for initialization)
  getState() {
    return { 
      wallet: this.wallet, 
      address: this.address,
      chain: this.chain,
      chainId: this.chainId
    };
  },
  
  // Clear all state
  clear() {
    this.setState(null, null, null, null);
  }
};

export const useUniversalWallet = () => {
  const wagmiAccount = useAccount();
  
  // Use shared store instead of isolated component state
  // Initialize with current store state
  const [unicornState, setUnicornState] = useState(() => unicornWalletStore.getState());
  
  const { wallet: unicornWallet, address: unicornAddress, chain: unicornChain, chainId: unicornChainId } = unicornState;

  // Subscribe to global store updates
  // This ensures THIS component re-renders when ANY component updates the store
  useEffect(() => {
    return unicornWalletStore.subscribe(setUnicornState);
  }, []);

  // Listen for Unicorn wallet events (global listener)
  useEffect(() => {
    const handleUnicornConnect = (event) => {
      console.log('🦄 useUniversalWallet: Unicorn connected', event.detail);
      
      // Update global store (this will notify ALL components)
      unicornWalletStore.setState(
        event.detail.wallet,
        event.detail.address,
        event.detail.chain,
        event.detail.chainId
      );
    };

    const handleUnicornDisconnect = () => {
      console.log('🦄 useUniversalWallet: Unicorn disconnected');
      
      // Clear global store (this will notify ALL components)
      unicornWalletStore.clear();
    };

    window.addEventListener('unicorn-wallet-connected', handleUnicornConnect);
    window.addEventListener('unicorn-wallet-disconnected', handleUnicornDisconnect);

    // 🔥 CRITICAL: Check if there's already a connected wallet
    // This handles components that mount AFTER the connection event fired
    if (window.__UNICORN_WALLET_STATE__) {
      const state = window.__UNICORN_WALLET_STATE__;
      console.log('🦄 useUniversalWallet: Found existing connection state', state);
      
      unicornWalletStore.setState(
        state.wallet,
        state.address,
        state.chain,
        state.chainId
      );
    }

    return () => {
      window.removeEventListener('unicorn-wallet-connected', handleUnicornConnect);
      window.removeEventListener('unicorn-wallet-disconnected', handleUnicornDisconnect);
    };
  }, []); // Run only once on mount

  // Create a unified wallet interface that existing app code can use
  const unifiedWallet = {
    // Connection state - prioritize Wagmi, fallback to Unicorn
    isConnected: wagmiAccount.isConnected || !!unicornWallet,
    address: wagmiAccount.address || unicornAddress,
    
    // Chain info
    chain: wagmiAccount.chain?.name || unicornChain,
    chainId: wagmiAccount.chainId || unicornChainId,
    
    // Wallet info
    connector: wagmiAccount.connector || (unicornWallet ? { name: 'Unicorn', id: 'unicorn' } : null),
    isUnicorn: !!unicornWallet && !wagmiAccount.isConnected,
    isStandard: wagmiAccount.isConnected,
    
    // Raw wallet objects for advanced usage
    wagmiAccount,
    unicornWallet,
    
    // Send transaction function that works with both
    sendTransaction: async (txParams) => {
      if (wagmiAccount.isConnected) {
        // Use existing Wagmi transaction flow
        throw new Error('Use wagmi useSendTransaction hook for standard wallets');
      } else if (unicornWallet) {
        // Use Unicorn wallet
        return await unicornWallet.sendTransaction(txParams);
      } else {
        throw new Error('No wallet connected');
      }
    },
    
    // Disconnect function that works with both wallet types
    disconnect: () => {
      if (wagmiAccount.isConnected) {
        // Use existing Wagmi disconnect
        if (wagmiAccount.connector?.disconnect) {
          wagmiAccount.connector.disconnect();
        }
      } else if (unicornWallet) {
        // Disconnect Unicorn wallet
        unicornWalletStore.clear();
        
        // Clear global state
        if (typeof window !== 'undefined') {
          delete window.__UNICORN_WALLET_STATE__;
        }
        
        // Dispatch disconnect event
        window.dispatchEvent(new CustomEvent('unicorn-wallet-disconnected'));
      }
    }
  };

  return unifiedWallet;
};