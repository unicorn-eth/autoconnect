// unicornConnector.js
// Wagmi connector for Unicorn wallet - clean version for zero-impact integration
// The connector just handles connection logic - autoconnect is done by UnicornAutoConnect component

import { createConnector } from 'wagmi';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet } from 'thirdweb/wallets';
import { base, polygon } from 'thirdweb/chains';

// Transaction approval dialog (dynamically imported when needed)
let requestTransactionApproval = null;

// Allow setting the approval handler externally
export function setTransactionApprovalHandler(handler) {
  requestTransactionApproval = handler;
}

// Load the approval UI component dynamically
async function loadApprovalUI() {
  if (!requestTransactionApproval) {
    try {
      const module = await import('./UnicornTransactionApproval.jsx');
      requestTransactionApproval = module.requestTransactionApproval || module.default;
      console.log('[UnicornConnector] Transaction approval UI loaded');
    } catch (error) {
      console.warn('[UnicornConnector] Transaction approval UI not found, transactions will execute without confirmation');
      // Return a pass-through function if approval UI isn't available
      requestTransactionApproval = async () => true;
    }
  }
  return requestTransactionApproval;
}

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

    async signMessage({ message }) {
      console.log('[UnicornConnector] signMessage called:', message);
      
      if (!this.account) {
        throw new Error('No account connected');
      }
      
      try {
        // Use the account's signMessage method
        const signature = await this.account.signMessage({ message });
        console.log('[UnicornConnector] Message signed:', signature.slice(0, 20) + '...');
        return signature;
      } catch (error) {
        console.error('[UnicornConnector] signMessage failed:', error);
        throw error;
      }
    },

    async signTypedData(typedData) {
      console.log('[UnicornConnector] signTypedData called:', typedData);
      
      if (!this.account) {
        throw new Error('No account connected');
      }
      
      try {
        // Use the account's signTypedData method
        const signature = await this.account.signTypedData(typedData);
        console.log('[UnicornConnector] Typed data signed:', signature.slice(0, 20) + '...');
        return signature;
      } catch (error) {
        console.error('[UnicornConnector] signTypedData failed:', error);
        throw error;
      }
    },

    async getProvider() {
      if (!this.eip1193Provider || !this.account) {
        const account = this.account || await this.wallet.getAccount();
        
        if (!account) {
          console.log('[UnicornConnector] No account, returning stub provider');
          return {
            request: async () => {
              throw new Error('Wallet not connected');
            },
            on: () => {},
            removeListener: () => {},
          };
        }
        
        // Try importing EIP1193
        let EIP1193;
        try {
          const module = await import('thirdweb/wallets');
          EIP1193 = module.EIP1193;
          console.log('[UnicornConnector] EIP1193 imported successfully');
        } catch (error) {
          console.error('[UnicornConnector] Failed to import EIP1193:', error);
          throw new Error('Failed to import Thirdweb EIP1193 module');
        }
        
        // Map to Thirdweb chain to ensure proper RPC configuration
        const thirdwebChainMap = {
          8453: base,
          137: polygon,
        };
        
        const currentChainId = account.chain?.id || defaultChain;
        const thirdwebChain = thirdwebChainMap[currentChainId] || base;
        
        console.log('[UnicornConnector] Creating provider for chain:', thirdwebChain.name || thirdwebChain.id);
        console.log('[UnicornConnector] Account object:', {
          hasAddress: !!account.address,
          hasChain: !!account.chain,
          chainId: account.chain?.id,
          hasSendTransaction: !!account.sendTransaction,
        });
        console.log('[UnicornConnector] Client object:', {
          hasClientId: !!this.client.clientId,
          hasSecretKey: !!this.client.secretKey,
        });
        console.log('[UnicornConnector] Chain object:', {
          hasId: !!thirdwebChain.id,
          hasRpc: !!thirdwebChain.rpc,
          hasName: !!thirdwebChain.name,
        });
        
        let baseProvider;
        try {
          baseProvider = await EIP1193.toProvider({
            client: this.client,
            chain: thirdwebChain,
            wallet: this.wallet, // CRITICAL: Pass wallet, not account!
          });
          
          console.log('[UnicornConnector] Base provider created successfully');
          console.log('[UnicornConnector] Provider has subscribe:', !!baseProvider.subscribe);
          
          // Wrap the provider's request method to add logging and handle signing
          const originalRequest = baseProvider.request.bind(baseProvider);
          baseProvider.request = async (args) => {
            console.log('[UnicornConnector] Provider request:', args.method, args.params);
            
            // Intercept wallet_watchAsset - not all RPCs support this
            if (args.method === 'wallet_watchAsset') {
              console.log('[UnicornConnector] Intercepting wallet_watchAsset');
              console.log('[UnicornConnector] Params:', JSON.stringify(args.params, null, 2));
              
              // This is a UI-only feature that tells the wallet to show a token
              // Smart accounts and some wallets don't support this via RPC
              // Return true to indicate "success" (non-blocking)
              console.log('[UnicornConnector] wallet_watchAsset - returning true (feature not required for smart accounts)');
              return true;
            }
            
            // Intercept eth_sendTransaction to show approval dialog
            if (args.method === 'eth_sendTransaction') {
              console.log('[UnicornConnector] Intercepting eth_sendTransaction for approval');
              console.log('[UnicornConnector] Transaction:', args.params[0]);
              
              try {
                // Dynamically load and show approval dialog
                const approvalHandler = await loadApprovalUI();
                
                // Show approval dialog and wait for user confirmation
                await approvalHandler(args.params[0]);
                console.log('[UnicornConnector] Transaction approved by user');
                
                // Continue with the transaction
                const result = await originalRequest(args);
                console.log('[UnicornConnector] Transaction sent:', result);
                return result;
              } catch (error) {
                // User rejected or error occurred
                if (error.message.includes('rejected')) {
                  console.log('[UnicornConnector] Transaction rejected by user');
                } else {
                  console.error('[UnicornConnector] Transaction approval error:', error);
                }
                throw error;
              }
            }
            
            // Intercept signing methods and use account's methods directly
            if (args.method === 'personal_sign' && this.account) {
              try {
                const [message, address] = args.params;
                console.log('[UnicornConnector] Intercepting personal_sign, using account.signMessage');
                console.log('[UnicornConnector] Account has signMessage:', typeof this.account.signMessage);
                console.log('[UnicornConnector] Account keys:', Object.keys(this.account));
                
                const signature = await this.account.signMessage({ message });
                console.log('[UnicornConnector] Signature from account (length:', signature.length, ')');
                console.log('[UnicornConnector] Full signature:', signature);
                
                if (!signature || signature === '0x') {
                  console.warn('[UnicornConnector] Got empty signature');
                  throw new Error('Failed to generate signature');
                }
                
                return signature;
              } catch (error) {
                console.error('[UnicornConnector] personal_sign failed:', error);
                throw error;
              }
            }
            
            if (args.method === 'eth_signTypedData_v4' && this.account) {
              try {
                const [address, dataString] = args.params;
                const typedData = JSON.parse(dataString);
                console.log('[UnicornConnector] Intercepting eth_signTypedData_v4, using account.signTypedData');
                console.log('[UnicornConnector] Account has signTypedData:', typeof this.account.signTypedData);
                
                const signature = await this.account.signTypedData(typedData);
                console.log('[UnicornConnector] Signature from account (length:', signature.length, ')');
                console.log('[UnicornConnector] Full signature:', signature);
                
                if (!signature || signature === '0x') {
                  console.warn('[UnicornConnector] Got empty signature');
                  throw new Error('Failed to generate signature');
                }
                
                return signature;
              } catch (error) {
                console.error('[UnicornConnector] eth_signTypedData_v4 failed:', error);
                throw error;
              }
            }
            
            // For all other methods, use the original provider
            try {
              const result = await originalRequest(args);
              console.log('[UnicornConnector] Provider response:', args.method, '→', result?.slice?.(0, 20) || result);
              return result;
            } catch (error) {
              console.error('[UnicornConnector] Provider request failed:', args.method, error);
              throw error;
            }
          };
        } catch (error) {
          console.error('[UnicornConnector] Failed to create base provider:', error);
          console.error('[UnicornConnector] Error details:', {
            message: error.message,
            stack: error.stack,
          });
          
          // Return a minimal provider that can at least handle basic requests
          console.warn('[UnicornConnector] Returning fallback provider');
          return {
            request: async ({ method, params }) => {
              console.log('[UnicornConnector] Fallback provider request:', method, params);
              // Try to use the account's sendTransaction for eth_sendTransaction
              if (method === 'eth_sendTransaction' && account.sendTransaction) {
                const tx = params[0];
                return account.sendTransaction(tx);
              }
              throw new Error(`Provider method ${method} not supported in fallback mode`);
            },
            on: () => {},
            once: () => {},
            removeListener: () => {},
            off: () => {},
            subscribe: () => ({ unsubscribe: () => {} }),
          };
        }
        
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
        42161: arbitrum,
        10: optimism,
        100: gnosis,
        42220: celo
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