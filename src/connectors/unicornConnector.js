// unicornConnector.js
// Wagmi connector for Unicorn wallet - clean version for zero-impact integration
// The connector just handles connection logic - autoconnect is done by UnicornAutoConnect component

import { createConnector } from 'wagmi';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet } from 'thirdweb/wallets';
import { base, polygon } from 'thirdweb/chains'; // Import Thirdweb chains

/**
 * Unicorn Wallet Connector for Wagmi v2
 * 
 * Standard wagmi connector - works like any other wallet connector.
 * Autoconnect is handled separately by UnicornAutoConnect component.
 * 
 * @param {Object} options - Connector options
 * @param {string} options.clientId - Thirdweb client ID
 * @param {string} options.factoryAddress - Smart account factory address  
 * @param {number} options.defaultChain - Default chain ID (8453 for Base)
 * @param {string} [options.icon] - Optional wallet icon URL
 */
export function unicornConnector(options = {}) {
  const {
    clientId,
    factoryAddress,
    defaultChain,
    icon = 'https://cdn.prod.website-files.com/66530e16a1530eb2c5731631/66532b163a3d036984005867_favicon.png',
  } = options;

  if (!clientId) {
    throw new Error('unicornConnector: clientId is required');
  }

  if (!factoryAddress) {
    throw new Error('unicornConnector: factoryAddress is required');
  }

  return createConnector((config) => ({
    id: 'unicorn',
    name: 'Unicorn Wallet',
    type: 'injected',
    icon,
    rdns: 'eth.unicorn',
    
    // Track setup completion
    setupPromise: null,
    setupComplete: false,
    
    // Connector is always ready since we handle setup async
    get ready() {
      return true;
    },
    
    async setup() {
      // Prevent multiple setups
      if (this.setupPromise) {
        return this.setupPromise;
      }
      
      this.setupPromise = (async () => {
        console.log('[UnicornConnector] Setup started');
        
        // Small delay to ensure any previous disconnect has fully cleared storage
        await new Promise(resolve => setTimeout(resolve, 100));
      
      this.client = createThirdwebClient({ clientId });
      
      // Map wagmi chain ID to Thirdweb chain
      const thirdwebChainMap = {
        8453: base,
        137: polygon,
      };
      
      const thirdwebChain = thirdwebChainMap[defaultChain] || base;
      
      console.log('[UnicornConnector] Using Thirdweb chain:', thirdwebChain.name || thirdwebChain.id);
      
      this.wallet = inAppWallet({
        auth: {
          options: ['email', 'google', 'apple', 'phone']
        },
        smartAccount: {
          chain: thirdwebChain, // Use Thirdweb chain, not wagmi chain
          factoryAddress,
          gasless: true,
        },
      });

      this.account = null;
      this.eip1193Provider = null;
      
      this.setupComplete = true;
      console.log('[UnicornConnector] Setup complete - wallet ready');
      })();
      
      return this.setupPromise;
    },

    async connect({ chainId } = {}) {
      console.log('[UnicornConnector] Connect called');
      
      // CRITICAL: Wait for setup to complete before connecting
      if (!this.setupComplete) {
        console.log('[UnicornConnector] Waiting for setup to complete...');
        await this.setupPromise;
        console.log('[UnicornConnector] Setup complete, proceeding with connect');
      }
      
      // Check for auth cookie in URL
      const params = new URLSearchParams(window?.location?.search || '');
      const authCookie = params.get('authCookie');
      
      if (authCookie && !this.account) {
        console.log('[UnicornConnector] Auth cookie detected in URL');
        
        // CRITICAL: Store the authCookie in localStorage where Thirdweb expects it
        // This mimics what Thirdweb's <AutoConnect> component does
        try {
          // 1. Store the wallet token with client ID
          const storageKey = `walletToken-${clientId}`;
          localStorage.setItem(storageKey, authCookie);
          
          // 2. Set active wallet ID
          localStorage.setItem('thirdweb:active-wallet-id', 'inApp');
          
          // 3. Set connected wallet IDs (as JSON array)
          localStorage.setItem('thirdweb:connected-wallet-ids', JSON.stringify(['inApp']));
          
          console.log('[UnicornConnector] Stored auth data in localStorage');
          console.log('  - walletToken:', storageKey);
          console.log('  - active-wallet-id: inApp');
          console.log('  - connected-wallet-ids: ["inApp"]');
        } catch (error) {
          console.warn('[UnicornConnector] Could not store auth data in localStorage:', error);
        }
        
        console.log('[UnicornConnector] Attempting autoConnect...');
        try {
          this.account = await this.wallet.autoConnect({
            client: this.client,
          });
          console.log('[UnicornConnector] autoConnect successful:', this.account.address);
        } catch (error) {
          console.log('[UnicornConnector] autoConnect failed:', error.message);
          this.account = null;
        }
      }
      
      // If we already have an account (from autoConnect or previous connection), use it
      if (this.account?.address) {
        console.log('[UnicornConnector] Using existing account:', this.account.address);
      } else {
        // Try to get existing account from wallet
        try {
          this.account = await this.wallet.getAccount();
          if (this.account?.address) {
            console.log('[UnicornConnector] Found account via getAccount:', this.account.address);
          }
        } catch (error) {
          console.log('[UnicornConnector] getAccount failed:', error.message);
        }
      }
      
      // If still no account, we can't connect
      if (!this.account?.address) {
        throw new Error('No account available - wallet not authenticated');
      }
      
      // Map wagmi chain ID to Thirdweb chain
      const thirdwebChainMap = {
        8453: base,
        137: polygon,
      };
      
      const targetWagmiChain = config.chains.find(c => c.id === chainId) || 
                               config.chains.find(c => c.id === defaultChain) ||
                               config.chains[0];
      
      const targetThirdwebChain = thirdwebChainMap[targetWagmiChain.id] || base;

      console.log('[UnicornConnector] Target chain:', targetWagmiChain.name);
      console.log('[UnicornConnector] Final connected address:', this.account.address);

      const address = this.account.address;
      const targetChainId = targetWagmiChain.id;

      // CRITICAL FIX: Emit connect event BEFORE returning
      // This ensures wagmi's state updates properly
      config.emitter.emit('connect', { 
        accounts: [address], 
        chainId: targetChainId 
      });

      // CRITICAL FIX: Return 'accounts' (plural) not 'account' (singular)
      // Wagmi v2 expects accounts to be an array
      const returnValue = {
        accounts: [address],  // <-- This was 'account' before, needs to be 'accounts' array
        chainId: targetChainId,
      };
      
      console.log('[UnicornConnector] Returning to wagmi:', returnValue);
      return returnValue;
    },

    async disconnect() {
      console.log('[UnicornConnector] Disconnect - recreating wallet for fresh state');
      
      // Fully disconnect the wallet first
      try {
        await this.wallet.disconnect();
        console.log('[UnicornConnector] Wallet disconnected');
      } catch (error) {
        console.log('[UnicornConnector] Wallet disconnect error:', error.message);
      }
      
      // Clear our local references
      this.account = null;
      this.eip1193Provider = null;
      
      // Reset setup state
      this.setupComplete = false;
      this.setupPromise = null;
      
      // CRITICAL: Recreate the wallet instance to ensure no cached state
      const thirdwebChainMap = { 8453: base, 137: polygon };
      const thirdwebChain = thirdwebChainMap[defaultChain] || base;
      
      this.wallet = inAppWallet({
        auth: {
          options: ['email', 'google', 'apple', 'phone']
        },
        smartAccount: {
          chain: thirdwebChain,
          factoryAddress,
          gasless: true,
        },
      });
      
      console.log('[UnicornConnector] Fresh wallet instance created');
      
      // Wait for everything to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      config.emitter.emit('disconnect');
    },

    async getAccount() {
      if (this.account?.address) {
        return this.account.address;
      }
      
      const account = await this.wallet.getAccount();
      if (account) {
        this.account = account;
        return account.address;
      }
      
      return undefined;
    },

    async getAccounts() {
      const address = await this.getAccount();
      return address ? [address] : [];
    },

    async getChainId() {
      if (this.account?.chain?.id) {
        return this.account.chain.id;
      }
      
      const account = await this.wallet.getAccount();
      if (account?.chain?.id) {
        this.account = account;
        return account.chain.id;
      }
      
      return defaultChain;
    },

    async isAuthorized() {
      const address = await this.getAccount();
      return !!address;
    },

    async getProvider() {
      if (!this.eip1193Provider || !this.account) {
        const { EIP1193 } = await import('thirdweb/wallets');
        const account = this.account || await this.wallet.getAccount();
        
        if (!account) {
          return {
            request: async () => {
              throw new Error('Wallet not connected');
            },
            on: () => {},
            removeListener: () => {},
          };
        }
        
        // Map to Thirdweb chain to ensure proper RPC configuration
        const thirdwebChainMap = {
          8453: base,
          137: polygon,
        };
        
        const currentChainId = account.chain?.id || defaultChain;
        const thirdwebChain = thirdwebChainMap[currentChainId] || base;
        
        console.log('[UnicornConnector] Creating provider for chain:', thirdwebChain.name || thirdwebChain.id);
        
        const baseProvider = await EIP1193.toProvider({
          client: this.client,
          chain: thirdwebChain, // Use proper Thirdweb chain with RPC
          account,
        });
        
        // Ensure provider has event emitter methods and subscription support
        // Wagmi uses subscribe for watching transactions and events
        const subscriptions = new Map();
        
        this.eip1193Provider = {
          ...baseProvider,
          on: baseProvider.on || (() => {}),
          once: baseProvider.once || (() => {}),
          removeListener: baseProvider.removeListener || (() => {}),
          off: baseProvider.off || (() => {}),
          // Subscribe method for wagmi's transaction watching
          subscribe: (subscriptionType, params, callback) => {
            console.log('[UnicornConnector] Provider subscribe called:', subscriptionType, params);
            
            // If base provider has subscribe, use it
            if (baseProvider.subscribe) {
              return baseProvider.subscribe(subscriptionType, params, callback);
            }
            
            // Otherwise, provide a no-op subscription that returns unsubscribe
            const subId = Math.random().toString();
            subscriptions.set(subId, { type: subscriptionType, callback });
            
            return {
              unsubscribe: () => {
                subscriptions.delete(subId);
              }
            };
          },
          unsubscribe: (subscriptionId) => {
            if (baseProvider.unsubscribe) {
              return baseProvider.unsubscribe(subscriptionId);
            }
            return true;
          },
        };
      }
      
      return this.eip1193Provider;
    },

    async switchChain({ chainId }) {
      console.log('[UnicornConnector] switchChain called with chainId:', chainId);
      console.log('[UnicornConnector] Current account:', this.account?.address);
      console.log('[UnicornConnector] Current chain:', this.account?.chain?.id);
      
      const targetWagmiChain = config.chains.find(c => c.id === chainId);
      if (!targetWagmiChain) {
        throw new Error(`Chain ${chainId} not supported`);
      }
      
      // Map to Thirdweb chain
      const thirdwebChainMap = {
        8453: base,
        137: polygon,
      };
      const targetThirdwebChain = thirdwebChainMap[chainId];
      
      if (!targetThirdwebChain) {
        throw new Error(`Thirdweb chain not configured for ${chainId}`);
      }

      console.log('[UnicornConnector] Target Thirdweb chain:', targetThirdwebChain.name || targetThirdwebChain.id);

      // For smart accounts, we can't just "switch" chains like EOAs
      // Instead, update the internal chain reference
      if (this.account) {
        this.account.chain = targetThirdwebChain;
        console.log('[UnicornConnector] Updated account chain reference');
      }
      
      // CRITICAL: Clear provider so it gets recreated with new chain
      this.eip1193Provider = null;
      
      console.log('[UnicornConnector] Chain switch complete');
      
      config.emitter.emit('change', { chainId });
      
      return targetWagmiChain;
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.account = null;
        config.emitter.emit('disconnect');
      } else {
        config.emitter.emit('change', { accounts });
      }
    },

    onChainChanged(chainId) {
      const id = typeof chainId === 'string' ? Number(chainId) : chainId;
      if (this.account) {
        this.account.chain = { id };
      }
      config.emitter.emit('change', { chainId: id });
    },

    onConnect(connectInfo) {
      config.emitter.emit('connect', connectInfo);
    },

    onDisconnect() {
      this.account = null;
      this.eip1193Provider = null;
      config.emitter.emit('disconnect');
    },
  }));
}