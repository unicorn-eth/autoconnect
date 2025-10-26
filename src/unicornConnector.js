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
    },

    async connect({ chainId } = {}) {
      try {
        const targetChain = config.chains.find(c => c.id === chainId) || 
                           config.chains.find(c => c.id === defaultChain) ||
                           config.chains[0];

        // Connect the wallet
        const account = await this.wallet.connect({
          client: this.client,
          chain: targetChain,
        });

        const address = account.address;
        const chain = { id: targetChain.id, unsupported: false };

        return {
          account: address,
          chain,
        };
      } catch (error) {
        console.error('Unicorn connector: Connection failed', error);
        throw error;
      }
    },

    async disconnect() {
      try {
        await this.wallet.disconnect();
      } catch (error) {
        console.error('Unicorn connector: Disconnect failed', error);
      }
    },

    async getAccount() {
      try {
        const account = await this.wallet.getAccount();
        return account?.address;
      } catch (error) {
        return undefined;
      }
    },

    async getChainId() {
      try {
        const account = await this.wallet.getAccount();
        return account?.chain?.id || defaultChain;
      } catch (error) {
        return defaultChain;
      }
    },

    async isAuthorized() {
      try {
        const account = await this.wallet.getAccount();
        return !!account?.address;
      } catch (error) {
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