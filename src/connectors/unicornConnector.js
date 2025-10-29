// src/connectors/unicornConnector.js
// Wagmi connector for Unicorn wallet integration - why is this so weird??
import { createConnector } from 'wagmi';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet } from 'thirdweb/wallets';

/**
 * Unicorn Wallet Connector for Wagmi v2
 * 
 * Creates a wagmi-compatible connector that wraps Thirdweb's inAppWallet
 * for seamless integration with existing wagmi setups.
 * 
 * @param {Object} options - Connector options
 * @param {string} options.clientId - Thirdweb client ID
 * @param {string} options.factoryAddress - Smart account factory address
 * @param {number} options.defaultChain - Default chain ID (e.g., 137 for Polygon)
 * @returns {Function} Wagmi connector function
 */
export function unicornConnector(options = {}) {
  const {
    clientId,
    factoryAddress,
    defaultChain,
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
    
    async setup() {
      console.log('[unicornConnector] setup() called');

      // Initialize Thirdweb client
      this.client = createThirdwebClient({ clientId });

      // Check if there's already a connected wallet from AutoConnect
      if (typeof window !== 'undefined' && window.__THIRDWEB_CONNECTED_WALLET__) {
        console.log('[unicornConnector] Using already-connected wallet from AutoConnect');
        this.wallet = window.__THIRDWEB_CONNECTED_WALLET__;
      } else {
        console.log('[unicornConnector] Creating new in-app wallet instance');
        // Create in-app wallet instance
        this.wallet = inAppWallet({
          auth: {
            options: ['email', 'google', 'apple', 'phone'],
          },
          smartAccount: {
            chain: config.chains.find(c => c.id === defaultChain) || config.chains[0],
            factoryAddress,
            gasless: true,
          },
        });
      }
    },

    async connect({ chainId } = {}) {
      try {
        console.log('[unicornConnector] connect() called with chainId:', chainId);

        const targetChain = config.chains.find(c => c.id === chainId) ||
                           config.chains.find(c => c.id === defaultChain) ||
                           config.chains[0];

        console.log('[unicornConnector] Target chain:', targetChain.name, targetChain.id);

        // Check if we have an already-connected account from AutoConnect
        if (typeof window !== 'undefined' && window.__THIRDWEB_ACCOUNT__) {
          const account = window.__THIRDWEB_ACCOUNT__;
          console.log('[unicornConnector] Using account from global state:', account.address);

          const address = account.address;
          const chain = { id: account?.chain?.id || targetChain.id, unsupported: false };

          console.log('[unicornConnector] connect() returning from global state:', { account: address, chain });

          return {
            account: address,
            chain,
          };
        }

        // Check if wallet instance has an existing account
        let account;
        try {
          if (this.wallet && typeof this.wallet.getAccount === 'function') {
            account = await this.wallet.getAccount();
            console.log('[unicornConnector] Existing account from wallet:', account?.address);
          }
        } catch (e) {
          console.log('[unicornConnector] No existing account in wallet');
        }

        // If we have an account, use it
        if (account?.address) {
          console.log('[unicornConnector] Using existing connected wallet');
          const address = account.address;
          const chain = { id: account?.chain?.id || targetChain.id, unsupported: false };

          console.log('[unicornConnector] connect() returning:', { account: address, chain });

          return {
            account: address,
            chain,
          };
        }

        // Otherwise, try to connect fresh (for manual connections via RainbowKit)
        console.log('[unicornConnector] No existing connection, attempting fresh connect...');

        // Make sure we have a wallet instance
        if (!this.wallet || typeof this.wallet.connect !== 'function') {
          console.log('[unicornConnector] Creating new wallet instance');
          this.wallet = inAppWallet({
            auth: {
              options: ['email', 'google', 'apple', 'phone'],
            },
            smartAccount: {
              chain: targetChain,
              factoryAddress,
              gasless: true,
            },
          });
        }

        account = await this.wallet.connect({
          client: this.client,
          chain: targetChain,
        });
        console.log('[unicornConnector] Wallet connected:', account.address);

        const address = account.address;
        const chain = { id: account?.chain?.id || targetChain.id, unsupported: false };

        console.log('[unicornConnector] connect() returning:', { account: address, chain });

        return {
          account: address,
          chain,
        };
      } catch (error) {
        console.error('[unicornConnector] Connection failed', error);
        console.error('[unicornConnector] Error stack:', error.stack);
        throw error;
      }
    },

    async disconnect() {
      try {
        console.log('[unicornConnector] disconnect() called');
        await this.wallet.disconnect();
        console.log('[unicornConnector] Disconnected successfully');
      } catch (error) {
        console.error('[unicornConnector] Disconnect failed', error);
      }
    },

    async getAccount() {
      try {
        // First check global state for AutoConnect
        if (typeof window !== 'undefined' && window.__THIRDWEB_ACCOUNT__) {
          const address = window.__THIRDWEB_ACCOUNT__.address;
          console.log('[unicornConnector] getAccount() returning from global state:', address);
          return address;
        }

        // Otherwise check the wallet instance
        const account = await this.wallet.getAccount();
        const address = account?.address;
        console.log('[unicornConnector] getAccount() returning:', address);
        return address;
      } catch (error) {
        console.log('[unicornConnector] getAccount() error:', error);
        return undefined;
      }
    },

    async getChainId() {
      try {
        // First check global state for AutoConnect
        if (typeof window !== 'undefined' && window.__THIRDWEB_ACCOUNT__) {
          const chainId = window.__THIRDWEB_ACCOUNT__.chain?.id || defaultChain;
          console.log('[unicornConnector] getChainId() returning from global state:', chainId);
          return chainId;
        }

        // Otherwise check the wallet instance
        const account = await this.wallet.getAccount();
        const chainId = account?.chain?.id || defaultChain;
        console.log('[unicornConnector] getChainId() returning:', chainId);
        return chainId;
      } catch (error) {
        console.log('[unicornConnector] getChainId() error, returning default:', defaultChain);
        return defaultChain;
      }
    },

    async isAuthorized() {
      try {
        // First check global state for AutoConnect
        if (typeof window !== 'undefined' && window.__THIRDWEB_ACCOUNT__) {
          const account = window.__THIRDWEB_ACCOUNT__;
          console.log('[unicornConnector] isAuthorized() found account in global state:', account.address);
          return true;
        }

        // Otherwise check the wallet instance
        const account = await this.wallet.getAccount();
        const authorized = !!account?.address;
        console.log('[unicornConnector] isAuthorized() returning:', authorized, 'for address:', account?.address);
        return authorized;
      } catch (error) {
        console.log('[unicornConnector] isAuthorized() error:', error);
        return false;
      }
    },

    async switchChain({ chainId }) {
      try {
        const targetChain = config.chains.find(c => c.id === chainId);
        if (!targetChain) {
          throw new Error(`Chain ${chainId} not supported`);
        }

        await this.wallet.switchChain(targetChain);
        return targetChain;
      } catch (error) {
        console.error('Unicorn connector: Chain switch failed', error);
        throw error;
      }
    },

    async getProvider() {
      return this.wallet;
    },

    onAccountsChanged() {
      // Handle account changes
    },

    onChainChanged() {
      // Handle chain changes
    },

    onDisconnect() {
      // Handle disconnect
    },
  }));
}