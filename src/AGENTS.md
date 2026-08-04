<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# src

## Purpose

All publishable library source. `index.js` is a re-export barrel for the root package
export; it contains no logic of its own. Two subpaths (`integrations/web3modal`,
`siwe`) are exported straight from source (unbundled) rather than through the root
build — see `package.json` `exports` map.

## Key Files

| File | Description |
|------|--------------|
| `index.js` | Root export barrel — re-exports connector, hooks, and components. Comment at top notes wagmi v1 support was removed in v1.5.0; don't re-add it here (use `unicornConnector.v1.js` via the `web3modal` subpath instead) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `connectors/` | Wagmi connector implementations (v2/v3 current, v1 legacy) — see `connectors/AGENTS.md` |
| `components/` | Pre-built React UI (buttons, legacy autoconnect component, approval modal) — see `components/AGENTS.md` |
| `hooks/` | React hooks — universal (wallet-agnostic) and Unicorn-specific — see `hooks/AGENTS.md` |
| `integrations/` | Third-party integration helpers (currently Web3Modal v2) — see `integrations/AGENTS.md` |
| `siwe/` | Sign-In-With-Ethereum verification, incl. ERC-1271 smart-contract wallets — see `siwe/AGENTS.md` |
| `types/` | Hand-written TypeScript declarations — see `types/AGENTS.md` |
| `utils/` | Environment detection + wallet-wrapping utilities — see `utils/AGENTS.md` |
| `examples/` | Example consumer apps (Vite + React), not part of the published package — see `examples/AGENTS.md` |

## For AI Agents

### Working In This Directory
- Two components share the filename `UnicornTransactionApproval.jsx` in different
  directories (`components/` and `connectors/`) — **they are not duplicates to
  deduplicate**. They've diverged and back two separate approval-dialog code paths.
  See `components/AGENTS.md` and `connectors/AGENTS.md` for which connector generation
  uses which file before touching either.
- `utils/unicornConnectorWrapper.ts` is a 0-byte empty file — appears unused/abandoned,
  confirm before assuming it needs content.

### Testing Requirements
See root `AGENTS.md` — no automated tests; verify via `examples/`.

### Common Patterns
- Chain-ID → chain-object maps are hand-maintained per file (`connectors/unicornConnector.js`,
  `siwe/verifySiweMessage.js`) rather than shared from one module.
- Several files carry the header comment "Coded lovingly by @cryptowampum and Claude
  AI" — an authorship convention in this codebase, not boilerplate to strip.

<!-- MANUAL: -->
