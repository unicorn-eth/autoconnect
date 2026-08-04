<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# autoconnect

## Purpose

`@unicorn.eth/autoconnect` — an npm library that drops Unicorn smart-account wallet
support into existing web3 dApps (Wagmi, RainbowKit, Web3Modal) with no changes to the
host app's existing wallet code. This repo *is* the published package plus its example
apps and docs; it is not an application that gets deployed itself.

See `CLAUDE.md` for the narrative developer-guidance version of this file (build
gotchas, wagmi-version-compat requirements, etc.) — kept here in the hierarchical
AGENTS.md form for tooling that reads that convention instead.

## Key Files

| File | Description |
|------|--------------|
| `package.json` | 3 public exports: `.` (bundled), `./web3modal`, `./siwe` (shipped as raw source) |
| `tsup.config.js` | Build config — see "For AI Agents" below, externals are load-bearing |
| `pnpm-workspace.yaml` | Declares `examples/*` as a workspace, but the example apps actually live at `src/examples/*` (path mismatch, not a typo to "fix" without checking pnpm behavior first) |
| `CLAUDE.md` | Primary agent-facing guidance document |
| `CHANGELOG.md` | Canonical version history (prefer updating this over adding new root `RELEASE_NOTES_*.md` files) |
| `.npmignore` | Controls what ships to npm — `src/` and `dist/` both ship (subpath exports resolve into `src/`) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | All library source (see `src/AGENTS.md`) |
| `docs/` | Mostly historical/dated context docs, not living documentation (see `docs/AGENTS.md`) |
| `.github/` | CI workflows (see `.github/AGENTS.md`) |
| `dist/` | Generated build output of the root export — regenerate with `pnpm build`, don't hand-edit |

## For AI Agents

### Working In This Directory
- Build with `pnpm build` (tsup). The `external` list in `tsup.config.js` (react,
  react-dom, wagmi, viem, thirdweb, `@tanstack/react-query`, `@rainbow-me/rainbowkit`,
  and their subpaths) must stay external — bundling any of them breaks consumers with
  duplicate-instance errors. Add new peer-scoped imports to both `external` and
  `esbuildOptions.external`.
- Code must support wagmi v2 *and* v3 at the same time (v3 renamed/moved several hooks).
  See `src/AGENTS.md` for the fallback pattern in use.
- `src/types/index.d.ts` is hand-written, not generated, and is copied to
  `dist/index.d.ts` post-build. Update it manually when the public API changes.
- Root has many dated, session-generated markdown files (`CONTEXT_*.md`,
  `CONTINUATION-PROMPT.MD`, `RELEASE_NOTES_v*.md` duplicated across root and
  `docs/fixes`/`docs/guides`). Treat these as historical archive, not current guidance.
  Don't add new ones for session handoff — extend `CLAUDE.md`/this file or
  `CHANGELOG.md` instead.

### Testing Requirements
No automated test suite exists (no `test`/`lint`/`type-check` npm scripts, no
`*.test.js` files). `.github/workflows/test.yml` runs `pnpm lint`/`pnpm type-check`/
`pnpm test` but each is piped through `|| echo "... not configured yet"`, so CI passes
green regardless of whether these actually catch anything — don't read a green check as
proof of correctness. Verify changes by running one of the example apps under
`src/examples/` and exercising the autoconnect flow (`?walletId=inApp&authCookie=...`
URL params).

### Common Patterns
- Dual wagmi v2/v3 support via optional-chaining fallbacks, e.g.
  `wagmiExports.useConnection || wagmiExports.useAccount`.
- A module-level singleton store with pub/sub (see `src/hooks/AGENTS.md`) is used
  instead of React context in one place — deliberate fix for a past cross-instance state
  bug, not an oversight.
- Chain support is defined via a wagmi-chain-id → Thirdweb/viem-chain-object map,
  duplicated (not shared) between `src/connectors/unicornConnector.js` and
  `src/siwe/verifySiweMessage.js` — when adding chain support, update both.

## Dependencies

### External
- `wagmi` (v2 and v3), `thirdweb` (`inAppWallet`), `viem`, `react`/`react-dom`
  (optional peer deps — connector-only usage doesn't require React).

<!-- MANUAL: -->
