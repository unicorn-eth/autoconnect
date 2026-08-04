<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# integrations

## Purpose

Third-party wallet-modal integration helpers, exported as their own npm subpath
(`@unicorn.eth/autoconnect/<name>`) rather than bundled into the root export.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `web3modal/` | Web3Modal v2/wagmi v1 config helper — see `web3modal/AGENTS.md` |

## For AI Agents

### Working In This Directory
- This directory (and its subpath exports) ship as **raw source**, not through the
  `tsup` build — `package.json`'s `exports["./web3modal"]` points straight at
  `src/integrations/web3modal/index.js`. Don't assume changes here need `pnpm build`
  to take effect for consumers of the subpath (they do still need it for the root
  export if this code is also re-exported there — check `src/index.js` first).

<!-- MANUAL: -->
