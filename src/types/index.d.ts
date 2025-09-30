// Type definitions for @unicorn/autoconnect
import { ReactNode } from 'react';
import type { Account } from 'wagmi';

/**
 * Supported blockchain networks
 */
export type SupportedChain = 
  | 'base' 
  | 'polygon' 
  | 'ethereum' 
  | 'mainnet'
  | 'arbitrum' 
  | 'optimism';

/**
 * Configuration for UnicornAutoConnect component
 */
export interface UnicornAutoConnectProps {
  /**
   * Your Thirdweb client ID
   * @required
   */
  clientId: string;

  /**
   * Smart account factory address for gasless transactions
   * @required
   */
  factoryAddress: string;

  /**
   * Default blockchain network
   * @default 'base'
   */
  defaultChain?: SupportedChain;

  /**
   * Connection timeout in milliseconds
   * @default 5000
   */
  timeout?: number;

  /**
   * Enable debug logging to console
   * @default false
   */
  debug?: boolean;

  /**
   * Callback fired when Unicorn wallet successfully connects
   */
  onConnect?: (wallet: any) => void;

  /**
   * Callback fired when AutoConnect fails
   * Note: Failure is silent to users, other wallets continue to work
   */
  onError?: (error: Error) => void;
}

/**
 * Wallet connector information
 */
export interface WalletConnector {
  /** Connector name (e.g., "MetaMask", "Unicorn") */
  name: string;
  
  /** Connector ID */
  id: string;
}

/**
 * Universal wallet interface that works with both Unicorn and standard wallets
 */
export interface UniversalWallet {
  /**
   * Whether any wallet is connected (Unicorn or standard)
   */
  isConnected: boolean;

  /**
   * Connected wallet address
   */
  address: string | undefined;

  /**
   * Wallet connector information
   */
  connector: WalletConnector | null;

  /**
   * True if using Unicorn wallet (gasless transactions available)
   */
  isUnicorn: boolean;

  /**
   * True if using standard wallet (MetaMask, Rainbow, etc.)
   */
  isStandard: boolean;

  /**
   * Raw Wagmi account object (for standard wallets)
   */
  wagmiAccount: Account;

  /**
   * Raw Unicorn wallet object (for Unicorn wallet)
   */
  unicornWallet: any | null;

  /**
   * Disconnect the currently connected wallet
   */
  disconnect: () => void;

  /**
   * Send a transaction (use with caution - prefer Wagmi hooks for standard wallets)
   * @throws {Error} If using standard wallet (use useSendTransaction hook instead)
   */
  sendTransaction?: (params: any) => Promise<any>;
}

/**
 * Hook that provides unified interface for both Unicorn and standard wallets
 * 
 * @example
 * ```tsx
 * import { useUniversalWallet } from '@unicorn/autoconnect';
 * 
 * function MyComponent() {
 *   const wallet = useUniversalWallet();
 *   
 *   if (!wallet.isConnected) {
 *     return <ConnectButton />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Address: {wallet.address}</p>
 *       {wallet.isUnicorn && <p>⚡ Gasless enabled</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUniversalWallet(): UniversalWallet;

/**
 * UnicornAutoConnect component - Add Unicorn wallet support to your app
 * 
 * @example
 * ```tsx
 * import { UnicornAutoConnect } from '@unicorn/autoconnect';
 * 
 * function App() {
 *   return (
 *     <WagmiProvider config={config}>
 *       <YourApp />
 *       <UnicornAutoConnect
 *         clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
 *         factoryAddress="0xD771615c873ba5a2149D5312448cE01D677Ee48A"
 *         defaultChain="base"
 *       />
 *     </WagmiProvider>
 *   );
 * }
 * ```
 */
export function UnicornAutoConnect(props: UnicornAutoConnectProps): ReactNode;

/**
 * Check if the app is running in Unicorn environment
 * @returns True if accessed via Unicorn portal
 * 
 * @example
 * ```ts
 * import { isUnicornEnvironment } from '@unicorn/autoconnect';
 * 
 * if (isUnicornEnvironment()) {
 *   console.log('Running in Unicorn portal');
 * }
 * ```
 */
export function isUnicornEnvironment(): boolean;

/**
 * Get Unicorn auth cookie from URL parameters
 * @returns Auth cookie string or null if not present
 */
export function getUnicornAuthCookie(): string | null;

/**
 * Get chain configuration
 * @param chainName - Name of the blockchain
 * @returns Chain configuration object
 */
export function getChainConfig(chainName: SupportedChain): any;

// Default export
declare const _default: {
  UnicornAutoConnect: typeof UnicornAutoConnect;
  useUniversalWallet: typeof useUniversalWallet;
  isUnicornEnvironment: typeof isUnicornEnvironment;
  getUnicornAuthCookie: typeof getUnicornAuthCookie;
  getChainConfig: typeof getChainConfig;
};

export default _default;