// src/connectors/unicornConnector.js
// Wagmi connector for Unicorn wallet integration - FIXED for proper state sync
import { createConnector } from 'wagmi';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet } from 'thirdweb/wallets';
import { SwitchChainError, getAddress } from 'viem';

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
      console.log('🦄 unicornConnector: setup() called');
      
      // Initialize Thirdweb client
      this.client = createThirdwebClient({ clientId });
      
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

      console.log('🦄 unicornConnector: setup complete');
    },

    async connect({ chainId } = {}) {
      console.log('🦄 unicornConnector: connect() called', { chainId });
      
      try {
        // Ensure setup is called
        if (!this.client || !this.wallet) {
          await this.setup();
        }

        const targetChain = config.chains.find(c => c.id === chainId) || 
                           config.chains.find(c => c.id === defaultChain) ||
                           config.chains[0];

        console.log('🦄 unicornConnector: Connecting to chain', targetChain);

        // Check if already connected via autoconnect
        let account;
        try {
          account = this.wallet.getAccount();
          if (account?.address) {
            console.log('🦄 unicornConnector: Already connected via autoconnect!', account.address);
            
            const address = getAddress(account.address);
            const chain = { id: targetChain.id, unsupported: false };

            return {
              accounts: [address],
              chainId: targetChain.id,
            };
          }
        } catch (e) {
          console.log('🦄 unicornConnector: Not yet connected, proceeding with connection');
        }

        // Connect the wallet
        account = await this.wallet.connect({
          client: this.client,
          chain: targetChain,
        });

        console.log('🦄 unicornConnector: Connected!', account.address);

        const address = getAddress(account.address);
        const chain = { id: targetChain.id, unsupported: false };

        // Store for future reference
        this._currentAccount = account;
        this._currentChainId = targetChain.id;

        return {
          accounts: [address],
          chainId: targetChain.id,
        };
      } catch (error) {
        console.error('🦄 unicornConnector: Connection failed', error);
        throw error;
      }
    },

    async disconnect() {
      console.log('🦄 unicornConnector: disconnect() called');
      
      try {
        if (this.wallet) {
          await this.wallet.disconnect();
        }
        
        this._currentAccount = null;
        this._currentChainId = null;
        
        console.log('🦄 unicornConnector: Disconnected');
      } catch (error) {
        console.error('🦄 unicornConnector: Disconnect failed', error);
      }
    },

    async getAccounts() {
      console.log('🦄 unicornConnector: getAccounts() called');
      
      try {
        const account = this.wallet?.getAccount();
        if (account?.address) {
          const address = getAddress(account.address);
          console.log('🦄 unicornConnector: getAccounts returning', [address]);
          return [address];
        }
        
        console.log('🦄 unicornConnector: getAccounts returning []');
        return [];
      } catch (error) {
        console.log('🦄 unicornConnector: getAccounts error', error);
        return [];
      }
    },

    async getChainId() {
      console.log('🦄 unicornConnector: getChainId() called');
      
      try {
        const account = this.wallet?.getAccount();
        const chainId = account?.chain?.id || this._currentChainId || defaultChain;
        console.log('🦄 unicornConnector: getChainId returning', chainId);
        return chainId;
      } catch (error) {
        console.log('🦄 unicornConnector: getChainId error, returning default', defaultChain);
        return defaultChain;
      }
    },

    async isAuthorized() {
      console.log('🦄 unicornConnector: isAuthorized() called');
      
      try {
        const account = this.wallet?.getAccount();
        const authorized = !!account?.address;
        console.log('🦄 unicornConnector: isAuthorized returning', authorized);
        return authorized;
      } catch (error) {
        console.log('🦄 unicornConnector: isAuthorized error', error);
        return false;
      }
    },

    async switchChain({ chainId }) {
      console.log('🦄 unicornConnector: switchChain() called', { chainId });
      
      try {
        const targetChain = config.chains.find(c => c.id === chainId);
        if (!targetChain) {
          throw new SwitchChainError(new Error(`Chain ${chainId} not supported`));
        }

        await this.wallet.switchChain(targetChain);
        this._currentChainId = chainId;
        
        console.log('🦄 unicornConnector: switchChain complete');
        return targetChain;
      } catch (error) {
        console.error('🦄 unicornConnector: Chain switch failed', error);
        throw new SwitchChainError(error);
      }
    },

    async getProvider() {
      console.log('🦄 unicornConnector: getProvider() called');
      return this.wallet;
    },

    onAccountsChanged(accounts) {
      console.log('🦄 unicornConnector: onAccountsChanged', accounts);
      if (accounts.length === 0) {
        this.onDisconnect();
      } else {
        config.emitter.emit('change', { accounts: accounts.map(getAddress) });
      }
    },

    onChainChanged(chainId) {
      console.log('🦄 unicornConnector: onChainChanged', chainId);
      const id = Number(chainId);
      this._currentChainId = id;
      config.emitter.emit('change', { chainId: id });
    },

    onDisconnect(error) {
      console.log('🦄 unicornConnector: onDisconnect', error);
      config.emitter.emit('disconnect');
      this._currentAccount = null;
      this._currentChainId = null;
    },
  }));
}