// src/types/index.d.ts
// TypeScript definitions for @unicorn.eth/autoconnect v1.1.2

import { ReactNode } from 'react';
import type { Address, Hash, Hex } from 'viem';

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
  clientId?: string;
  factoryAddress?: string;
  defaultChain?: string;
  timeout?: number;
  debug?: boolean;
  enableTransactionApproval?: boolean;
  onConnect?: (wallet: any) => void;
  onError?: (error: Error) => void;
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

export function useUniversalWallet(): UniversalWalletState;

export function useUnicornTransaction(): UseUnicornTransactionReturn;

export function useUniversalTransaction(): UseUniversalTransactionReturn;

export function useUnicornSignMessage(): UseUnicornSignMessageReturn;

export function useUniversalSignMessage(): UseUniversalSignMessageReturn;

// ============================================
// Component Exports
// ============================================

export const UnicornAutoConnect: React.FC<UnicornAutoConnectProps>;

export const UnicornTransactionButton: React.FC<UnicornTransactionButtonProps>;

export const UnicornSignButton: React.FC<UnicornSignButtonProps>;

// ============================================
// Utility Types
// ============================================

export type { Address, Hash, Hex } from 'viem';