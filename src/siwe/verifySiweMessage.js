// verifySiweMessage.js
// SIWE (Sign-In with Ethereum) verification adapter for smart contract wallets
// Handles both EOA (ecrecover) and ERC-1271 (smart contract) signature verification

import { createPublicClient, http } from 'viem';
import {
  mainnet, base, polygon, arbitrum, optimism,
  gnosis, celo, avalanche, bsc, zkSync, scroll, zora,
  sepolia, baseSepolia, polygonAmoy, arbitrumSepolia, optimismSepolia
} from 'viem/chains';

const CHAIN_MAP = {
  1: mainnet,
  8453: base,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  100: gnosis,
  42220: celo,
  43114: avalanche,
  56: bsc,
  324: zkSync,
  534352: scroll,
  7777777: zora,
  11155111: sepolia,
  84532: baseSepolia,
  80002: polygonAmoy,
  421614: arbitrumSepolia,
  11155420: optimismSepolia,
};

/**
 * Verify a SIWE signature from any wallet type (EOA or smart contract).
 *
 * Uses viem's verifyMessage which automatically handles:
 * - Standard ECDSA recovery (EOA wallets like MetaMask)
 * - ERC-1271 on-chain verification (smart contract wallets like Unicorn)
 *
 * @param {Object} options
 * @param {string} options.address - The address that claims to have signed
 * @param {string} options.message - The raw SIWE message string
 * @param {string} options.signature - The signature hex string
 * @param {number} options.chainId - The chain ID to verify on
 * @param {string} [options.rpcUrl] - Optional custom RPC URL
 * @returns {Promise<boolean>} Whether the signature is valid
 *
 * @example
 * ```js
 * import { verifySiweMessage } from '@unicorn.eth/autoconnect/siwe';
 *
 * const isValid = await verifySiweMessage({
 *   address: '0x1234...',
 *   message: siweMessage.prepareMessage(),
 *   signature: '0xabcd...',
 *   chainId: 8453,
 * });
 * ```
 */
export async function verifySiweMessage({ address, message, signature, chainId, rpcUrl }) {
  const chain = CHAIN_MAP[chainId];
  if (!chain) {
    throw new Error(
      `Unsupported chain ID: ${chainId}. Supported: ${Object.keys(CHAIN_MAP).join(', ')}`
    );
  }

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  return client.verifyMessage({ address, message, signature });
}

/**
 * Create a reusable SIWE verifier with pre-configured RPC URLs.
 *
 * @param {Object} [config]
 * @param {Object} [config.rpcUrls] - Map of chain ID to RPC URL
 * @returns {{ verify: (options: { address: string, message: string, signature: string, chainId: number }) => Promise<boolean> }}
 *
 * @example
 * ```js
 * import { createSiweVerifier } from '@unicorn.eth/autoconnect/siwe';
 *
 * const verifier = createSiweVerifier({
 *   rpcUrls: {
 *     8453: 'https://mainnet.base.org',
 *     137: 'https://polygon-rpc.com',
 *   },
 * });
 *
 * const isValid = await verifier.verify({
 *   address: '0x1234...',
 *   message: siweMessage.prepareMessage(),
 *   signature: '0xabcd...',
 *   chainId: 8453,
 * });
 * ```
 */
export function createSiweVerifier(config = {}) {
  const { rpcUrls = {} } = config;

  return {
    verify({ address, message, signature, chainId }) {
      return verifySiweMessage({
        address,
        message,
        signature,
        chainId,
        rpcUrl: rpcUrls[chainId],
      });
    },
  };
}
