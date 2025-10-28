// unicornConnector.js
// Wagmi connector for Unicorn wallet - clean version for zero-impact integration
// The connector just handles connection logic - autoconnect is done by UnicornAutoConnect component

import { createConnector } from 'wagmi';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet } from 'thirdweb/wallets';

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
    
    async setup() {
      console.log('[UnicornConnector] Setup');
      
      this.client = createThirdwebClient({ clientId });
      
      this.wallet = inAppWallet({
        auth: {
          options: ['email', 'google', 'apple', 'phone']
        },
        smartAccount: {
          chain: config.chains.find(c => c.id === defaultChain) || config.chains[0],
          factoryAddress,
          gasless: true,
        },
      });

      this.account = null;
      this.eip1193Provider = null;

      // NOTE: No autoconnect here!
      // Autoconnect is handled by UnicornAutoConnect component
      // which calls connect() through wagmi's state management
    },

    async connect({ chainId } = {}) {
      console.log('[UnicornConnector] Connect called ');
      
      const targetChain = config.chains.find(c => c.id === chainId) || 
                         config.chains.find(c => c.id === defaultChain) ||
                         config.chains[0];

      console.log('[UnicornConnector] Target chain:', targetChain);

      this.account = await this.wallet.connect({
        client: this.client,
        chain: targetChain,
      });

      console.log('[UnicornConnector] Connected:', this.account.address);

      const address = this.account.address;

      config.emitter.emit('connect', { 
        accounts: [address], 
        chainId: targetChain.id 
      });

      return {
        account: address,
        chain: { id: targetChain.id, unsupported: false },
      };
    },

    async disconnect() {
      console.log('[UnicornConnector] Disconnect');
      await this.wallet.disconnect();
      this.account = null;
      this.eip1193Provider = null;
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
      if (!this.eip1193Provider) {
        const { EIP1193 } = await import('thirdweb/wallets');
        const account = this.account || await this.wallet.getAccount();
        
        if (!account) {
          return {
            request: async () => {
              throw new Error('Wallet not connected');
            },
          };
        }
        
        this.eip1193Provider = await EIP1193.toProvider({
          client: this.client,
          chain: account.chain,
          account,
        });
      }
      
      return this.eip1193Provider;
    },

    async switchChain({ chainId }) {
      console.log('[UnicornConnector] Switch chain:', chainId);
      
      const targetChain = config.chains.find(c => c.id === chainId);
      if (!targetChain) {
        throw new Error(`Chain ${chainId} not supported`);
      }

      this.account = await this.wallet.connect({
        client: this.client,
        chain: targetChain,
      });
      
      this.eip1193Provider = null;
      config.emitter.emit('change', { chainId });
      
      return targetChain;
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