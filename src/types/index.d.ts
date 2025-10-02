// Type definitions for @unicorn.eth/autoconnect
import { ReactNode, ReactElement, CSSProperties } from 'react';
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
   * Enable transaction approval dialogs for Unicorn wallet
   * @default false
   */
  enableTransactionApproval?: boolean;

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
 * Transaction object structure
 */
export interface Transaction {
  /** Recipient address */
  to: string;
  
  /** Value in wei (as string) */
  value: string;
  
  /** Transaction data (hex string) */
  data: string;
}

/**
 * Props for UnicornTransactionButton component
 */
export interface UnicornTransactionButtonProps {
  /**
   * Transaction object to send
   * @required
   */
  transaction: Transaction;

  /**
   * Callback fired when transaction succeeds
   */
  onSuccess?: (result: any) => void;

  /**
   * Callback fired when transaction fails
   */
  onError?: (error: Error) => void;

  /**
   * Button content (text or elements)
   */
  children?: ReactNode;

  /**
   * Custom button styles
   */
  style?: CSSProperties;
}

/**
 * Props for UnicornSignButton component
 */
export interface UnicornSignButtonProps {
  /**
   * Message to sign
   * @required
   */
  message: string;

  /**
   * Callback fired when signing succeeds
   */
  onSuccess?: (signature: string) => void;

  /**
   * Callback fired when signing fails
   */
  onError?: (error: Error) => void;

  /**
   * Button content (text or elements)
   */
  children?: ReactNode;

  /**
   * Custom button styles
   */
  style?: CSSProperties;
}

/**
 * Return type for useUnicornTransaction hook
 */
export interface UseUnicornTransactionReturn {
  /**
   * Function to send a transaction
   */
  sendTransaction: (transaction: Transaction) => Promise<any>;

  /**
   * Whether a transaction is currently being processed
   */
  isLoading: boolean;

  /**
   * Transaction hash (if available)
   */
  hash: string | null;

  /**
   * Error object (if transaction failed)
   */
  error: Error | null;

  /**
   * True if using Unicorn wallet
   */
  isUnicorn: boolean;

  /**
   * True if using standard wallet
   */
  isStandard: boolean;

  /**
   * True if any wallet is connected
   */
  isConnected: boolean;
}

/**
 * Return type for useUnicornSignMessage hook
 */
export interface UseUnicornSignMessageReturn {
  /**
   * Function to sign a message
   */
  signMessage: (message: string) => Promise<string>;

  /**
   * Whether a signing operation is in progress
   */
  isLoading: boolean;

  /**
   * Signature string (if available)
   */
  signature: string | null;

  /**
   * Error object (if signing failed)
   */
  error: Error | null;

  /**
   * True if using Unicorn wallet
   */
  isUnicorn: boolean;

  /**
   * True if using standard wallet
   */
  isStandard: boolean;

  /**
   * True if any wallet is connected
   */
  isConnected: boolean;
}

/**
 * Hook that provides unified interface for both Unicorn and standard wallets
 * 
 * @example
 * ```tsx
 * import { useUniversalWallet } from '@unicorn.eth/autoconnect';
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
 * Universal transaction hook that works with both Unicorn and standard wallets
 * Handles approval dialogs automatically for Unicorn wallets
 * 
 * @example
 * ```tsx
 * import { useUnicornTransaction } from '@unicorn.eth/autoconnect';
 * 
 * function MyComponent() {
 *   const { sendTransaction, isLoading, hash } = useUnicornTransaction();
 *   
 *   const handleSend = async () => {
 *     await sendTransaction({
 *       to: '0x...',
 *       value: '1000000000000000',
 *       data: '0x'
 *     });
 *   };
 *   
 *   return (
 *     <button onClick={handleSend} disabled={isLoading}>
 *       {isLoading ? 'Sending...' : 'Send Transaction'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useUnicornTransaction(): UseUnicornTransactionReturn;

/**
 * Universal message signing hook that works with both Unicorn and standard wallets
 * 
 * @example
 * ```tsx
 * import { useUnicornSignMessage } from '@unicorn.eth/autoconnect';
 * 
 * function MyComponent() {
 *   const { signMessage, signature, isLoading } = useUnicornSignMessage();
 *   
 *   const handleSign = async () => {
 *     const sig = await signMessage('Sign this message');
 *     console.log('Signature:', sig);
 *   };
 *   
 *   return (
 *     <button onClick={handleSign} disabled={isLoading}>
 *       {isLoading ? 'Signing...' : 'Sign Message'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useUnicornSignMessage(): UseUnicornSignMessageReturn;

/**
 * UnicornAutoConnect component - Add Unicorn wallet support to your app
 * 
 * @example
 * ```tsx
 * import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';
 * 
 * function App() {
 *   return (
 *     <WagmiProvider config={config}>
 *       <YourApp />
 *       <UnicornAutoConnect
 *         clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
 *         factoryAddress="0xD771615c873ba5a2149D5312448cE01D677Ee48A"
 *         defaultChain="base"
 *         enableTransactionApproval={true}
 *       />
 *     </WagmiProvider>
 *   );
 * }
 * ```
 */
export function UnicornAutoConnect(props: UnicornAutoConnectProps): ReactNode;

/**
 * Pre-built transaction button that handles both Unicorn and standard wallets
 * Shows loading states, success/error messages, and approval dialogs automatically
 * 
 * @example
 * ```tsx
 * import { UnicornTransactionButton } from '@unicorn.eth/autoconnect';
 * 
 * function MyComponent() {
 *   const transaction = {
 *     to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *     value: '1000000000000000', // 0.001 ETH
 *     data: '0x'
 *   };
 *   
 *   return (
 *     <UnicornTransactionButton
 *       transaction={transaction}
 *       onSuccess={(result) => console.log('Sent!', result)}
 *       onError={(error) => console.error('Failed:', error)}
 *     >
 *       Send 0.001 ETH
 *     </UnicornTransactionButton>
 *   );
 * }
 * ```
 */
export function UnicornTransactionButton(
  props: UnicornTransactionButtonProps
): ReactElement;

/**
 * Pre-built message signing button that handles both Unicorn and standard wallets
 * Shows loading states and signature display automatically
 * 
 * @example
 * ```tsx
 * import { UnicornSignButton } from '@unicorn.eth/autoconnect';
 * 
 * function MyComponent() {
 *   return (
 *     <UnicornSignButton
 *       message="Sign to verify ownership"
 *       onSuccess={(signature) => console.log('Signed!', signature)}
 *       onError={(error) => console.error('Failed:', error)}
 *     >
 *       Sign Message
 *     </UnicornSignButton>
 *   );
 * }
 * ```
 */
export function UnicornSignButton(
  props: UnicornSignButtonProps
): ReactElement;

/**
 * Check if the app is running in Unicorn environment
 * @returns True if accessed via Unicorn portal
 * 
 * @example
 * ```ts
 * import { isUnicornEnvironment } from '@unicorn.eth/autoconnect';
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

/**
 * Request transaction approval from user (used internally)
 * Shows approval dialog for Unicorn transactions
 */
export function requestTransactionApproval(transaction: Transaction): Promise<boolean>;

/**
 * Wrap a Unicorn wallet to add transaction approval functionality
 * @param wallet - The Unicorn wallet instance
 * @param requireApproval - Whether to require approval (default: true)
 * @param client - Thirdweb client instance
 * @param chain - Thirdweb chain object
 * @returns Wrapped wallet with approval flow
 */
export function wrapUnicornWallet(
  wallet: any,
  requireApproval?: boolean,
  client?: any,
  chain?: any
): any;

/**
 * Check if a wallet is already wrapped with approval functionality
 * @param wallet - Wallet to check
 * @returns True if wrapped
 */
export function isWrappedWallet(wallet: any): boolean;

/**
 * Get original wallet from wrapped wallet
 * @param wallet - Wrapped wallet
 * @returns Original wallet
 */
export function unwrapWallet(wallet: any): any;

// Default export
declare const _default: {
  UnicornAutoConnect: typeof UnicornAutoConnect;
  UnicornTransactionButton: typeof UnicornTransactionButton;
  UnicornSignButton: typeof UnicornSignButton;
  useUniversalWallet: typeof useUniversalWallet;
  useUnicornTransaction: typeof useUnicornTransaction;
  useUnicornSignMessage: typeof useUnicornSignMessage;
  isUnicornEnvironment: typeof isUnicornEnvironment;
  getUnicornAuthCookie: typeof getUnicornAuthCookie;
  getChainConfig: typeof getChainConfig;
  requestTransactionApproval: typeof requestTransactionApproval;
  wrapUnicornWallet: typeof wrapUnicornWallet;
  isWrappedWallet: typeof isWrappedWallet;
  unwrapWallet: typeof unwrapWallet;
};

export default _default;