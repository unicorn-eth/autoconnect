<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# connectors

## Purpose

Wagmi `Connector` implementations that back the Unicorn (Thirdweb `inAppWallet`)
smart-account wallet.

## Key Files

| File | Description |
|------|--------------|
| `unicornConnector.js` | **Current/primary connector**, wagmi v2 and v3 compatible (`createConnector`). Exported from `src/index.js`. Owns `THIRDWEB_CHAIN_MAP` (wagmi chain id → Thirdweb chain object) and `setTransactionApprovalHandler()`. |
| `unicornConnector.v1.js` | Legacy wagmi v1 connector (`Connector` class API). Root export dropped wagmi v1 support in v1.5.0 — this file is kept only for `src/integrations/web3modal` (Web3Modal v2 requires wagmi v1). Don't wire it into `src/index.js`. |
| `UnicornTransactionApproval.jsx` | Transaction/message-approval modal, loaded **dynamically** by `unicornConnector.js` via `import('./UnicornTransactionApproval.jsx')` inside `loadApprovalUI()`, with a silent `async () => true` (auto-approve) fallback if the dynamic import fails. **Not a duplicate** of `src/components/UnicornTransactionApproval.jsx` — see that file's AGENTS.md entry for the full picture of which connector generation uses which approval file. |

## For AI Agents

### Working In This Directory
- `THIRDWEB_CHAIN_MAP` here and the equivalent `CHAIN_MAP` in
  `src/siwe/verifySiweMessage.js` are maintained independently. Adding chain support
  requires updating both, not just one.
- `unicornConnector.v1.js` loads its approval UI from `../components/UnicornTransactionApproval.jsx`
  (the *components* version), while `unicornConnector.js` loads its own local
  `./UnicornTransactionApproval.jsx` (the *connectors* version) — this asymmetry is
  intentional given the two connectors' different call sites, not a bug to unify without
  checking both flows still work.
- If a dynamic `import('./UnicornTransactionApproval.jsx')` fails to resolve (e.g. bundler
  config issue), transactions silently execute **without** user confirmation
  (`requestTransactionApproval = async () => true`) rather than erroring — be aware of
  this fail-open behavior when debugging "approval dialog doesn't show" reports.

<!-- MANUAL: -->
