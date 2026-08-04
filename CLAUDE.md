# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

## What this is

`@unicorn.eth/autoconnect` — a drop-in wallet-integration library that lets existing
web3 dApps (Wagmi, RainbowKit, Web3Modal) auto-connect the Unicorn smart-account wallet
via URL params, with **no changes to the host app's existing wallet code**. Published to
npm; consumed by other projects, not run standalone.

## Entry points / package exports

Three public import paths, each with its own concerns:

| Import | Source | Purpose |
|---|---|---|
| `@unicorn.eth/autoconnect` | `src/index.js` → built to `dist/` | Main API: connector, hooks, components |
| `@unicorn.eth/autoconnect/web3modal` | `src/integrations/web3modal/index.js` (unbuilt, shipped as source) | Web3Modal v2/wagmi v1 config helper |
| `@unicorn.eth/autoconnect/siwe` | `src/siwe/index.js` (unbuilt, shipped as source) | Sign-In-With-Ethereum verification, incl. ERC-1271 smart-contract wallets |

Only the root export is bundled by tsup; the `web3modal` and `siwe` subpaths ship as raw
source and resolve straight from `src/` — don't assume they go through the build step.

## Architecture

- `src/connectors/unicornConnector.js` — Wagmi v2/v3 `createConnector` implementation.
  Talks to Thirdweb's `inAppWallet`. `THIRDWEB_CHAIN_MAP` is the canonical wagmi-chain-id →
  Thirdweb-chain-object mapping; extend it here if adding chain support, don't duplicate
  the mapping elsewhere.
  - `unicornConnector.v1.js` is a separate legacy connector kept only for the
    `web3modal` integration path (wagmi v1). The root export dropped wagmi v1 support in
    v1.5.0 — don't wire `v1.js` into `src/index.js`.
- `src/components/UnicornAutoConnect.jsx` — legacy autoconnect component (deprecated
  since v1.2.0 in favor of the connector-based approach). Still exported for backwards
  compatibility; new integration work should go through `unicornConnector`, not this.
- `src/hooks/` — `useUniversalWallet`/`useUniversalTransaction`/`useUniversalSignMessage`
  are the recommended consumer-facing hooks (work regardless of underlying wallet).
  `useUnicorn*` variants are Unicorn-specific/advanced.
  - `useUniversalWallet.js` uses a module-level singleton store
    (`unicornWalletStore`) with a pub/sub listener set to keep multiple hook instances in
    sync — this is a deliberate fix for a past state-consistency bug, not an accident.
    Preserve the singleton pattern if touching this file.
- `src/utils/environment.js` — detects Unicorn context via `?walletId=inApp&authCookie=...`
  URL params. This is the trigger condition the whole autoconnect flow hinges on.
- Code must support **wagmi v2 and v3 simultaneously**: look for the
  `wagmiExports.useConnection || wagmiExports.useAccount` and
  `wagmiExports.useConnectors || (() => null)` fallback pattern — v3 renamed/moved these
  APIs. Preserve dual-version fallbacks when editing hooks/components that touch wagmi.

## Build

```
pnpm build   # tsup src/index.js --format cjs,esm --external react,react-dom,wagmi,thirdweb
```

- Bundler is **tsup** (`tsup.config.js`), not the root-level `rollup` devDependency (that's
  a leftover/unused — don't assume rollup config applies).
- `react`, `react-dom`, `wagmi`, `viem`, `thirdweb`, `@tanstack/react-query`,
  `@rainbow-me/rainbowkit` (and all their subpaths) **must stay external**. This is called
  out as critical in `tsup.config.js` — bundling any of them breaks consumers with
  duplicate-instance/hook errors. If you add a new peer-scoped import, add it to both the
  `external` array and `esbuildOptions.external`.
- Types are hand-written at `src/types/index.d.ts` and copied to `dist/index.d.ts` post-build
  (`dts: false` in tsup config) — update that file manually when changing the public API,
  it is not generated from JSDoc/TS.
- `dist/` is committed-adjacent build output checked into the repo tree shown by `git
  status`; regenerate with `pnpm build` rather than hand-editing.

## Examples workspace

`pnpm-workspace.yaml` points at `src/examples/*`, where the actual example apps live:
`src/examples/basic` and `src/examples/web3modal` (Vite + React, each with its own
`dev`/`build`/`preview`). Run `pnpm dev` inside one of those directories to smoke-test
changes against a real Wagmi/RainbowKit or Web3Modal app. `src/examples/_app.tsx` is a
free-standing snippet, not part of either app.

### Testing local changes before publishing

Don't hand-edit an example's `package.json`/`vite.config.js` to point at local source —
use the pack/link scripts instead, which test against the *real packed tarball* (same
`files`/`exports` shape npm would ship), not a live symlink into `src/`:

```
pnpm run local:link     # pack the root package + link it into both examples
pnpm run local:unlink   # revert both examples to the published npm version
```

Iterating on further changes: rerun `pnpm run local:pack` (or `local:link` again) after
each edit — both examples' `node_modules/@unicorn.eth/autoconnect` symlink to
`.local-pkg/package/`, a `git`-ignored directory, so a repack alone is picked up without
reinstalling. Once satisfied, publish to npm, then run `pnpm run local:unlink` (uses
`pnpm add @unicorn.eth/autoconnect@latest`) to point both examples back at the deployed
package for a final "as published" check.

Deliberately does **not** use `pnpm link`/`yalc`: `pnpm link` in a pnpm workspace rewrites
a workspace-wide `overrides` entry in `pnpm-workspace.yaml` (and even added a nonsensical
self-dependency to the root `package.json` when tried) instead of scoping to one package;
`yalc publish`/`pnpm pack` both hang trying to walk `files: ["src"]`, which includes the
two examples' own multi-hundred-MB `node_modules` since they live under `src/examples/`
— `.npmignore` excludes `src/` for real `npm publish`/`pnpm pack` output (confirmed via
`npm pack --dry-run`), but neither yalc's nor pnpm's own packer respects that exclusion
for `files`-allow-listed directories in this pnpm version. `local:pack` uses `npm pack`
directly, which does respect it.

Known pre-existing gap: `src/examples/web3modal/vite.config.js` aliases the bare
`@unicorn.eth/autoconnect` specifier straight to `src/integrations/web3modal/index.js`
(bypassing whatever's installed in `node_modules` entirely, local or npm), and that file
has a dynamic `import('@web3modal/ethereum')` for legacy wagmi v1 support that isn't a
declared dependency of the example — `pnpm build` in that example fails on that import
regardless of the local/npm toggle. Not caused by the pack/link setup; unfixed as of this
writing.

## Testing

There is no automated test suite (no `test` script, no `*.test.js`/`*.spec.js` files).
`test-web3modal.sh` at the repo root is a manual/manual-check script, not part of CI.
Verify changes by running one of the example apps and exercising the autoconnect flow
(append `?walletId=inApp&authCookie=...` to the example app's URL) — see
`docs/technical/` and `TESTING_GUIDE.md` for the manual test flow currently in use.

## Docs landscape (context, not instructions)

The repo root and `docs/` accumulate a lot of dated, session-generated context: files like
`CONTEXT_2025_10_31.md`, `CONTEXT_2025_11_11.md`, `CONTINUATION-PROMPT.MD`,
`WORKING_SOLUTION_CONTEXT.md`, and versioned `RELEASE_NOTES_v1.x.x.md` /
`MIGRATION_GUIDE_*.md` files are handoff notes from past work sessions, not living
documentation. Treat them as historical reference (useful for "why does this code look
like this" archaeology) rather than current guidance — this file is the source of truth
for how to work in the repo today. Prefer updating `CHANGELOG.md` and this file over
adding new root-level context dumps.

- `README.md` / `INTEGRATION_GUIDE.md` / `QUICK_REFERENCE.md` — consumer-facing
  integration docs, kept in sync with the published API.
- `docs/technical/` — deeper implementation notes (smart-account signatures, delegation).
- `docs/fixes/`, `docs/guides/` — historical bug-fix and migration writeups.

## Versioning

Semver in `package.json`, no `test`/`lint` gate wired into `prepublishOnly` — it only runs
`pnpm run build`. Bump the version and add a `CHANGELOG.md` entry as part of any
publish-worthy change.
