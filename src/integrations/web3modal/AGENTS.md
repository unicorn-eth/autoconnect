<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# web3modal

## Purpose

Web3Modal v2 (wagmi v1) integration helper, exported as `@unicorn.eth/autoconnect/web3modal`.

## Key Files

| File | Description |
|------|--------------|
| `index.js` | `createWeb3ModalConfig({ projectId, clientId, factoryAddress, defaultChain, chains, icon })` — builds a wagmi v1 config with the Unicorn connector pre-added. Imports `unicornConnector` from `../../connectors/unicornConnector.v1.js` specifically (the legacy connector), not the current `unicornConnector.js`. |

## For AI Agents

### Working In This Directory
- This helper is inherently tied to wagmi v1 via `unicornConnector.v1.js`. If asked to
  "modernize" this to wagmi v2, that's a bigger change than editing this file alone —
  Web3Modal v2 itself only supports wagmi v1; check whether the ask is really about
  Web3Modal v3+ (which the `src/examples/web3modal` example app actually demonstrates,
  using the current v2/v3 connector) before assuming this file is stale/wrong.

<!-- MANUAL: -->
