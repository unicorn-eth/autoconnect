// unicornConnector.v1.js
// Wagmi v1 connector for Unicorn wallet - compatible with Web3Modal v2
// This is the wagmi v1 compatible version

import { Connector } from 'wagmi';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet } from 'thirdweb/wallets';
import {
  ethereum,
  base,
  baseSepolia,
  polygon,
  polygonAmoy,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  gnosis,
  celo,
  avalanche,
  bsc,
  sepolia,
  scroll,
  zora,
  zkSync
} from 'thirdweb/chains';

// Transaction approval dialog (dynamically imported when needed)
let requestTransactionApproval = null;

// Load the approval UI component dynamically
async function loadApprovalUI() {
  if (!requestTransactionApproval) {
    try {
      const module = await import('../components/UnicornTransactionApproval.jsx');
      requestTransactionApproval = module.requestTransactionApproval || module.default;
      console.log('[UnicornConnector v1] Transaction approval UI loaded');
    } catch (error) {
      console.warn('[UnicornConnector v1] Transaction approval UI not found');
      requestTransactionApproval = async () => true;
    }
  }
  return requestTransactionApproval;
}

// Centralized mapping of wagmi chain IDs to Thirdweb chain objects
const THIRDWEB_CHAIN_MAP = {
  // Mainnets
  1: ethereum,
  8453: base,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  100: gnosis,
  42220: celo,
  43114: avalanche,
  56: bsc,
  534352: scroll,
  7777777: zora,
  324: zkSync,
  // Testnets
  11155111: sepolia,
  84532: baseSepolia,
  80002: polygonAmoy,
  421614: arbitrumSepolia,
  11155420: optimismSepolia
};

/**
 * Unicorn Wallet Connector for Wagmi v1 (Web3Modal v2 compatible)
 */
export class UnicornConnector extends Connector {
  constructor(config) {
    const chains = config.chains;
    const options = config.options || {};

    super({
      chains,
      options,
    });

    this.id = 'unicorn';
    this.name = 'Unicorn Wallet';
    this.ready = true;

    this.clientId = options.clientId;
    this.factoryAddress = options.factoryAddress;
    this.defaultChain = options.defaultChain || 8453;
    this.icon = options.icon || 'https://cdn.prod.website-files.com/66530e16a1530eb2c5731631/66532b163a3d036984005867_favicon.png';

    if (!this.clientId) {
      throw new Error('unicornConnector: clientId is required');
    }
    if (!this.factoryAddress) {
      throw new Error('unicornConnector: factoryAddress is required');
    }

    this.client = null;
    this.wallet = null;
    this.account = null;
    this.provider = null;
  }

  async connect({ chainId } = {}) {
    try {
      await this.setupIfNeeded();

      // Check for auth cookie in URL
      const params = new URLSearchParams(window?.location?.search || '');
      const authCookie = params.get('authCookie');

      if (authCookie && !this.account) {
        console.log('[UnicornConnector v1] Auth cookie detected, attempting autoConnect');

        // Store auth data in localStorage
        try {
          localStorage.setItem(`walletToken-${this.clientId}`, authCookie);
          localStorage.setItem('thirdweb:active-wallet-id', 'inApp');
          localStorage.setItem('thirdweb:connected-wallet-ids', JSON.stringify(['inApp']));
        } catch (error) {
          console.warn('[UnicornConnector v1] Could not store auth data:', error);
        }

        try {
          this.account = await this.wallet.autoConnect({ client: this.client });
          console.log('[UnicornConnector v1] AutoConnect successful:', this.account.address);
        } catch (error) {
          console.log('[UnicornConnector v1] AutoConnect failed:', error.message);
        }
      }

      // If no account yet, try to get existing
      if (!this.account?.address) {
        try {
          this.account = await this.wallet.getAccount();
        } catch (error) {
          throw new Error('No account available - wallet not authenticated');
        }
      }

      if (!this.account?.address) {
        throw new Error('No account available - wallet not authenticated');
      }

      const address = this.account.address;
      const targetChainId = chainId || this.defaultChain;

      this.emit('connect', { account: address, chain: { id: targetChainId, unsupported: false } });

      return {
        account: address,
        chain: { id: targetChainId, unsupported: false },
        provider: await this.getProvider(),
      };
    } catch (error) {
      console.error('[UnicornConnector v1] Connect error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.wallet) {
        await this.wallet.disconnect();
      }
      this.account = null;
      this.provider = null;

      // Reset wallet
      await this.setupIfNeeded();

      this.emit('disconnect');
    } catch (error) {
      console.error('[UnicornConnector v1] Disconnect error:', error);
    }
  }

  async getAccount() {
    if (this.account?.address) {
      return this.account.address;
    }
    return null;
  }

  async getChainId() {
    if (this.account?.chain?.id) {
      return this.account.chain.id;
    }
    return this.defaultChain;
  }

  async getProvider() {
    if (!this.provider) {
      await this.setupIfNeeded();

      if (!this.account) {
        throw new Error('No account connected');
      }

      // Import EIP1193
      const { EIP1193 } = await import('thirdweb/wallets');

      const currentChainId = this.account.chain?.id || this.defaultChain;
      const thirdwebChain = THIRDWEB_CHAIN_MAP[currentChainId] || base;

      const baseProvider = await EIP1193.toProvider({
        client: this.client,
        chain: thirdwebChain,
        wallet: this.wallet,
      });

      // Wrap provider to intercept methods
      const originalRequest = baseProvider.request.bind(baseProvider);
      this.provider = {
        ...baseProvider,
        request: async (args) => {
          console.log('[UnicornConnector v1] Provider request:', args.method);

          // Handle wallet_watchAsset
          if (args.method === 'wallet_watchAsset') {
            return true;
          }

          // Handle eth_sendTransaction with approval dialog
          if (args.method === 'eth_sendTransaction') {
            console.log('[UnicornConnector v1] Intercepting eth_sendTransaction for approval');
            console.log('[UnicornConnector v1] Transaction:', args.params[0]);

            try {
              // Load and show approval dialog
              const approvalHandler = await loadApprovalUI();
              await approvalHandler(args.params[0]);
              console.log('[UnicornConnector v1] Transaction approved by user');

              // Continue with the transaction
              const result = await originalRequest(args);
              console.log('[UnicornConnector v1] Transaction sent:', result);
              return result;
            } catch (error) {
              if (error.message.includes('rejected')) {
                console.log('[UnicornConnector v1] Transaction rejected by user');
              } else {
                console.error('[UnicornConnector v1] Transaction approval error:', error);
              }
              throw error;
            }
          }

          // Intercept personal_sign and use account's signMessage directly
          if (args.method === 'personal_sign' && this.account) {
            try {
              const [message, address] = args.params;
              console.log('[UnicornConnector v1] Intercepting personal_sign, using account.signMessage');
              console.log('[UnicornConnector v1] Message to sign:', message);

              // Show approval dialog for signing
              const approvalHandler = await loadApprovalUI();
              await approvalHandler({
                method: 'personal_sign',
                message: message,
                from: address,
                data: message,
              });
              console.log('[UnicornConnector v1] Message signing approved by user');

              // Use account's signMessage for smart account signing
              const signature = await this.account.signMessage({ message });
              console.log('[UnicornConnector v1] Signature from account:', signature);

              if (!signature || signature === '0x') {
                throw new Error('Failed to generate signature');
              }

              return signature;
            } catch (error) {
              if (error.message.includes('rejected')) {
                console.log('[UnicornConnector v1] Message signing rejected by user');
              } else {
                console.error('[UnicornConnector v1] personal_sign failed:', error);
              }
              throw error;
            }
          }

          return originalRequest(args);
        },
      };
    }

    return this.provider;
  }

  async getSigner() {
    const provider = await this.getProvider();
    const account = await this.getAccount();

    if (!provider || !account) {
      throw new Error('Not connected');
    }

    // Create a signer-like object for wagmi v1
    // This will use the intercepted provider methods which show approval dialogs
    return {
      ...provider,
      getAddress: async () => account,
      signMessage: async (message) => {
        // This will trigger the provider's personal_sign interception
        // which shows approval dialog and uses smart account signing
        return provider.request({
          method: 'personal_sign',
          params: [message, account],
        });
      },
      signTransaction: async (transaction) => {
        return provider.request({
          method: 'eth_signTransaction',
          params: [transaction],
        });
      },
      sendTransaction: async (transaction) => {
        // This will trigger the provider's eth_sendTransaction interception
        // which shows approval dialog
        return provider.request({
          method: 'eth_sendTransaction',
          params: [transaction],
        });
      },
    };
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  async switchChain(chainId) {
    const thirdwebChain = THIRDWEB_CHAIN_MAP[chainId];

    if (!thirdwebChain) {
      throw new Error(`Chain ${chainId} not supported`);
    }

    if (this.account) {
      this.account.chain = thirdwebChain;
    }

    this.provider = null; // Reset provider

    this.emit('change', { chain: { id: chainId, unsupported: false } });

    return thirdwebChain;
  }

  async setupIfNeeded() {
    if (this.client && this.wallet) {
      return;
    }

    console.log('[UnicornConnector v1] Setting up...');

    this.client = createThirdwebClient({ clientId: this.clientId });

    const thirdwebChain = THIRDWEB_CHAIN_MAP[this.defaultChain] || base;

    this.wallet = inAppWallet({
      auth: {
        options: ['email', 'google', 'apple', 'phone']
      },
      smartAccount: {
        chain: thirdwebChain,
        factoryAddress: this.factoryAddress,
        gasless: true,
      },
    });

    console.log('[UnicornConnector v1] Setup complete');
  }
}

/**
 * Factory function to create Unicorn connector (wagmi v1 style)
 */
export function unicornConnector({ chains, options }) {
  return new UnicornConnector({
    chains,
    options,
  });
}
