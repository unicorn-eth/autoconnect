<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# utils

## Purpose

Environment detection and wallet-wrapping helpers shared across hooks/components.

## Key Files

| File | Description |
|------|--------------|
| `environment.js` | `isUnicornEnvironment()` — detects the `?walletId=inApp&authCookie=...` URL params that trigger the whole autoconnect flow. This is the root trigger condition for the library; treat changes here as high-blast-radius. |
| `unicornWalletWrapper.js` | `wrapUnicornWallet()` — wraps a raw Unicorn/thirdweb wallet so `sendTransaction` shows an approval dialog first (imports `requestTransactionApproval` from `src/components/UnicornTransactionApproval.jsx` — see that directory's AGENTS.md for why it's *that* file specifically, not the similarly-named one in `src/connectors/`). Used by `useUnicornTransaction`. |
| `unicornConnectorWrapper.ts` | **Empty file (0 bytes).** Appears unused/abandoned — confirm with git history/blame before writing to it, don't assume it's a stub waiting to be filled without checking why it's empty. |

## For AI Agents

### Working In This Directory
- `wrapUnicornWallet` spreads `...wallet` and then overrides `sendTransaction` — if the
  underlying wallet shape changes upstream (thirdweb SDK update), verify the spread
  still captures everything callers expect before assuming this wrapper is unaffected.

<!-- MANUAL: -->
