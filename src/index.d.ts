// src/types/index.d.ts
// TypeScript definitions for @unicorn.eth/autoconnect v1.3.0

import { ReactNode } from 'react';
import type { Address, Hash, Hex, Chain } from 'viem';
import type { CreateConnectorFn } from 'wagmi';

// ============================================
// Connector Types (NEW in v1.3.0)
// ============================================

export interface UnicornConnectorOptions {
  /**
   * Thirdweb client ID (required)
   * Get yours at: https://thirdweb.com/dashboard
   */
  clientId: string;

  /**
   * Smart account factory address (required)
   * Default: 0xD771615c873ba5a2149D5312448cE01D677Ee48A
   */
  factoryAddress: string;

  /**
   * Default chain ID to connect to
   * Examples: 8453 (Base), 137 (Polygon), 1 (Ethereum)
   * @default 8453
   */
  defaultChain?: number;

  /**
   * Optional wallet icon URL
   * @default Unicorn logo
   */
  icon?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Unicorn Wallet Connector for Wagmi v2
 * 
 * Standard wagmi connector - works like any other wallet connector (MetaMask, WalletConnect, etc.)
 * 
 * @example
 * ```ts
 * import { unicornConnector } from '@unicorn.eth/autoconnect';
 * import { createConfig } from 'wagmi';
 * import { base, polygon } from 'wagmi/chains';
 * 
 * const config = createConfig({
 *   chains: [base, polygon],
 *   connectors: [
 *     unicornConnector({
 *       clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
 *       factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
 *       defaultChain: 8453, // Base
 *     })
 *   ],
 * });
 * ```
 */
export function unicornConnector(options: UnicornConnectorOptions): CreateConnectorFn;

// ============================================
// Core Types
// ============================================

export interface UniversalWalletState {
  isConnected: boolean;
  address: Address | null;
  chain: string | null;
  chainId: number | null;
  connector: { name: string; id: string } | null;
  isUnicorn: boolean;
  isStandard: boolean;
  wagmiAccount: any;
  unicornWallet: any;
  sendTransaction: (params: SendTransactionParams) => Promise<any>;
  disconnect: () => void;
}

export interface SendTransactionParams {
  to: Address;
  value?: bigint | string;
  data?: Hex;
}

// ============================================
// Transaction Hooks
// ============================================

export interface TransactionState {
  isPending: boolean;
  isLoading: boolean;
  error: Error | null;
  data: any;
  isError: boolean;
  isSuccess: boolean;
}

export interface WriteContractParams {
  address: Address;
  abi: any[];
  functionName: string;
  args?: any[];
  value?: bigint | string;
}

export interface ReadContractParams {
  address: Address;
  abi: any[];
  functionName: string;
  args?: any[];
}

export interface UseUnicornTransactionReturn extends TransactionState {
  sendTransaction: (params: SendTransactionParams) => Promise<any>;
  sendTransactionAsync: (params: SendTransactionParams) => Promise<any>;
  writeContract: (params: WriteContractParams) => Promise<any>;
  writeContractAsync: (params: WriteContractParams) => Promise<any>;
  readContract: (params: ReadContractParams) => Promise<any>;
  readContractAsync: (params: ReadContractParams) => Promise<any>;
  reset: () => void;
}

export interface UseUniversalTransactionReturn extends TransactionState {
  sendTransaction: (params: SendTransactionParams) => Promise<any>;
  sendTransactionAsync: (params: SendTransactionParams) => Promise<any>;
  writeContract: (params: WriteContractParams) => Promise<any>;
  writeContractAsync: (params: WriteContractParams) => Promise<any>;
  readContract: (params: ReadContractParams) => Promise<any>;
  readContractAsync: (params: ReadContractParams) => Promise<any>;
  reset: () => void;
  isUnicorn: boolean;
}

// ============================================
// Signing Hooks
// ============================================

export interface SignMessageParams {
  message: string | { raw: string };
}

export interface SignTypedDataParams {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  };
  types: Record<string, Array<{ name: string; type: string }>>;
  primaryType: string;
  message: Record<string, any>;
}

export interface VerifyMessageParams {
  message: string | { raw: string };
  signature: Hex;
}

export interface SignatureState {
  isPending: boolean;
  isLoading: boolean;
  error: Error | null;
  data: Hex | null;
  signature: Hex | null;
  isError: boolean;
  isSuccess: boolean;
}

export interface UseUnicornSignMessageReturn extends SignatureState {
  signMessage: (params: SignMessageParams) => Promise<Hex>;
  signMessageAsync: (params: SignMessageParams) => Promise<Hex>;
  signTypedData: (params: SignTypedDataParams) => Promise<Hex>;
  signTypedDataAsync: (params: SignTypedDataParams) => Promise<Hex>;
  verifyMessage: (params: VerifyMessageParams) => Promise<boolean>;
  reset: () => void;
}

export interface UseUniversalSignMessageReturn extends SignatureState {
  signMessage: (params: SignMessageParams) => Promise<Hex>;
  signMessageAsync: (params: SignMessageParams) => Promise<Hex>;
  signTypedData: (params: SignTypedDataParams) => Promise<Hex>;
  signTypedDataAsync: (params: SignTypedDataParams) => Promise<Hex>;
  verifyMessage: (params: VerifyMessageParams) => Promise<boolean>;
  reset: () => void;
  isUnicorn: boolean;
}

// ============================================
// Component Props
// ============================================

export interface UnicornAutoConnectProps {
  /**
   * Thirdweb client ID
   * If not provided, will use the one from unicornConnector
   */
  clientId?: string;

  /**
   * Smart account factory address
   * If not provided, will use the one from unicornConnector
   */
  factoryAddress?: string;

  /**
   * Default chain ID
   * @default 8453 (Base)
   */
  defaultChain?: number;

  /**
   * Connection timeout in milliseconds
   * @default 10000
   */
  timeout?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Enable transaction approval dialogs
   * @default true
   */
  enableTransactionApproval?: boolean;

  /**
   * Callback when wallet connects successfully
   */
  onConnect?: (wallet: any) => void;

  /**
   * Callback when connection fails
   */
  onError?: (error: Error) => void;

  /**
   * Callback when auto-connect succeeds
   * (NEW in v1.3.0)
   */
  onSuccess?: () => void;
}

export interface UnicornTransactionButtonProps {
  children: ReactNode;
  to: Address;
  value?: bigint | string;
  data?: Hex;
  onSuccess?: (tx: any) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

export interface UnicornSignButtonProps {
  children: ReactNode;
  message: string;
  onSuccess?: (signature: Hex) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

// ============================================
// Hook Exports
// ============================================

/**
 * Hook to get current wallet state
 * Works with both Unicorn wallets and standard wallets (MetaMask, etc.)
 */
export function useUniversalWallet(): UniversalWalletState;

/**
 * Hook for Unicorn-specific transaction operations
 * @deprecated Use standard wagmi hooks in v1.3.0+
 */
export function useUnicornTransaction(): UseUnicornTransactionReturn;

/**
 * Hook for universal transaction operations
 * Works with both Unicorn and standard wallets
 * @deprecated Use standard wagmi hooks (useSendTransaction, useWriteContract) in v1.3.0+
 */
export function useUniversalTransaction(): UseUniversalTransactionReturn;

/**
 * Hook for Unicorn-specific message signing
 * @deprecated Use standard wagmi hooks in v1.3.0+
 */
export function useUnicornSignMessage(): UseUnicornSignMessageReturn;

/**
 * Hook for universal message signing
 * Works with both Unicorn and standard wallets
 * @deprecated Use standard wagmi hooks (useSignMessage, useSignTypedData) in v1.3.0+
 */
export function useUniversalSignMessage(): UseUniversalSignMessageReturn;

// ============================================
// Component Exports
// ============================================

/**
 * Auto-connect component for Unicorn wallets
 * Detects URL parameters and automatically connects via wagmi
 * 
 * @example
 * ```tsx
 * import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';
 * 
 * function App() {
 *   return (
 *     <WagmiProvider config={config}>
 *       <UnicornAutoConnect 
 *         onSuccess={() => console.log('Connected!')}
 *         onError={(err) => console.error(err)}
 *       />
 *       <YourApp />
 *     </WagmiProvider>
 *   );
 * }
 * ```
 */
export const UnicornAutoConnect: React.FC<UnicornAutoConnectProps>;

/**
 * Pre-built button component for Unicorn transactions
 * @deprecated Use standard wagmi hooks with your own UI in v1.3.0+
 */
export const UnicornTransactionButton: React.FC<UnicornTransactionButtonProps>;

/**
 * Pre-built button component for Unicorn message signing
 * @deprecated Use standard wagmi hooks with your own UI in v1.3.0+
 */
export const UnicornSignButton: React.FC<UnicornSignButtonProps>;

// ============================================
// Utility Types
// ============================================

export type { Address, Hash, Hex, Chain } from 'viem';

// ============================================
// Version Info
// ============================================

/**
 * Package version
 */
export const VERSION: string;

// ============================================
// Migration Notes for v1.3.0
// ============================================

/**
 * MIGRATION FROM v1.2.x to v1.3.0:
 * 
 * v1.3.0 achieves true zero-code integration with wagmi.
 * You can now use standard wagmi hooks everywhere!
 * 
 * BREAKING CHANGES:
 * - Custom hooks (useUniversalTransaction, useUniversalSignMessage) are deprecated
 * - Use standard wagmi hooks instead:
 *   - useUniversalTransaction → useSendTransaction, useWriteContract
 *   - useUniversalSignMessage → useSignMessage, useSignTypedData
 * 
 * WHAT'S NEW:
 * - Native wagmi integration - all standard hooks work
 * - Provider wrapping for approval dialogs
 * - Better state synchronization
 * - Improved chain switching
 * 
 * MIGRATION EXAMPLE:
 * 
 * // v1.2.x (OLD)
 * import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
 * const tx = useUniversalTransaction();
 * await tx.sendTransactionAsync({ to, value });
 * 
 * // v1.3.0 (NEW)
 * import { useSendTransaction } from 'wagmi';
 * const { sendTransaction } = useSendTransaction();
 * await sendTransaction({ to, value });
 * 
 * See MIGRATION_GUIDE_v1.2_to_v1.3.md for complete migration instructions.
 */