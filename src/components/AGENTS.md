<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# components

## Purpose

Pre-built React UI: two "batteries included" action buttons, a legacy autoconnect
component, and a transaction-approval modal.

## Key Files

| File | Description |
|------|--------------|
| `UnicornAutoConnect.jsx` | **Deprecated since v1.2.0.** Legacy autoconnect component kept only for backwards compatibility; still exported from `src/index.js`. New integration work should use `unicornConnector` (`src/connectors/`) instead. |
| `UnicornSignButton.jsx` | Pre-built message-signing button, wraps `useUnicornSignMessage` |
| `UnicornTransactionButton.jsx` | Pre-built transaction button, wraps `useUnicornTransaction` |
| `UnicornTransactionApproval.jsx` | Transaction-approval modal + `requestTransactionApproval()` export. **This is the older of two approval-dialog implementations** — see "For AI Agents" below |

## For AI Agents

### Working In This Directory
- `UnicornTransactionApproval.jsx` here is imported **statically** by
  `src/utils/unicornWalletWrapper.js` (used by `useUnicornTransaction`/the hooks-based
  send path) and dynamically by `src/connectors/unicornConnector.v1.js` (legacy wagmi
  v1 connector). It only renders a generic "Confirm Transaction" dialog — it does not
  render distinct copy for `personal_sign` / `eth_signTypedData_v4`.
- A second, functionally different file with the exact same name lives at
  `src/connectors/UnicornTransactionApproval.jsx`. That one *does* render
  method-specific copy (sign message / sign typed data / confirm transaction) and is
  loaded dynamically by the current `unicornConnector.js` (wagmi v2/v3). **Editing the
  wrong one is a real risk** — check which consumer you're actually fixing:
  - Bug reported via `useUnicornTransaction`/`useUniversalTransaction` hooks → this file.
  - Bug reported via the raw `unicornConnector` (wagmi v2/v3) EIP-1193 provider flow →
    `src/connectors/UnicornTransactionApproval.jsx` instead.
- `UnicornSignButton.jsx` / `UnicornTransactionButton.jsx` inline all styles as JS
  objects (no CSS modules/classnames) — follow that convention for consistency if
  adding another pre-built component here.

<!-- MANUAL: -->
