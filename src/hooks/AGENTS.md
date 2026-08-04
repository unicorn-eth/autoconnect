<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# hooks

## Purpose

React hooks for wallet state, transactions, and message signing. Split into
"universal" hooks (recommended for consumers — work regardless of which wallet is
connected) and "Unicorn" hooks (Unicorn-specific, used internally by the universal
hooks and available directly for advanced use).

## Key Files

| File | Description |
|------|--------------|
| `useUniversalWallet.js` | Wallet state bridge; recommended entry point. Uses a **module-level singleton store** (`unicornWalletStore`) with a pub/sub listener `Set` instead of React context — deliberate fix for a past cross-instance state-consistency bug. Preserve the singleton pattern here. |
| `useUniversalTransaction.js` | Routes to `useUnicornTransaction` or wagmi's `useSendTransaction`/`useWriteContract` depending on `wallet.isUnicorn` |
| `useUniversalSignMessage.js` | Same routing pattern, for `signMessage`/`signTypedData`/`verifyMessage` |
| `useUnicornTransaction.js` | Unicorn-specific transaction hook; `sendTransaction`/`writeContract` go through `wallet.unicornWallet.sendTransaction` — i.e. through `utils/unicornWalletWrapper.js`'s approval-gated wrapper, not a raw thirdweb call |
| `useUnicornSignMessage.js` | Unicorn-specific signing hook. `verifyMessage` returns a structured `{isValid, isSmartAccount, requiresOnChainVerification, standard}` object — smart-account signatures always report `isValid: false` client-side and require ERC-1271 on-chain verification (see `src/siwe/`) |

## For AI Agents

### Working In This Directory
- All `use*Async` aliases (`signMessageAsync`, `sendTransactionAsync`, etc.) exist
  purely for drop-in API parity with wagmi's hooks — keep both the bare and `Async`
  names in sync if changing a return shape.
- `useUnicornTransaction.readContract`'s public client is hardcoded to `base` (viem
  chain) with a `// TODO: Make this dynamic based on wallet.chainId` — known limitation,
  not an oversight to "helpfully" work around without checking whether fixing it is
  in scope.

<!-- MANUAL: -->
