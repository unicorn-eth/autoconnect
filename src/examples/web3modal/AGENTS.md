<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# web3modal

## Purpose

Vite + React example demonstrating the Unicorn connector with **Web3Modal v3**
(`@web3modal/wagmi`) and wagmi v2 — this is a different (newer) integration than the
`src/integrations/web3modal` helper, which targets Web3Modal v2/wagmi v1. Don't
conflate the two when asked to update "the web3modal integration."

## Key Files

| File | Description |
|------|--------------|
| `src/App.jsx` | Wires `createWeb3Modal` + wagmi `createConfig` with `unicornConnector` (the current v2/v3 connector, imported straight from `@unicorn.eth/autoconnect`) and `UnicornAutoConnect` |
| `src/components/DApp.jsx` | The actual demo UI |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | App source — see `src/AGENTS.md` |

## For AI Agents

### Working In This Directory
Requires `VITE_WALLETCONNECT_PROJECT_ID`, `VITE_THIRDWEB_CLIENT_ID`, and
`VITE_THIRDWEB_FACTORY_ADDRESS` env vars (`.env.example` documents them); `App.jsx`
logs errors to console but doesn't hard-fail if they're missing.

<!-- MANUAL: -->
