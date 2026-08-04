<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# basic

## Purpose

Vite + React example app demonstrating `unicornConnector` alongside RainbowKit and
plain wagmi. Depends on `@unicorn.eth/autoconnect` as a normal npm dependency (not a
workspace symlink unless pnpm resolves the `pnpm-workspace.yaml` mismatch noted in
`src/examples/AGENTS.md`) — reinstall/relink after building the library if changes to
`src/` aren't showing up here.

## Key Files

| File | Description |
|------|--------------|
| `package.json` | `dev`/`build`/`preview` via Vite |
| `src/App.jsx` | Comprehensive test-suite app — uses standard wagmi hooks only (no custom hooks), imports `unicornConnector`/`UnicornAutoConnect` directly |
| `src/App-Wagmi-Only.jsx`, `src/App-UX-Demo.jsx` | Alternate App entry points for different manual-test scenarios — check `main.jsx`/Vite config for which is actually wired as the active entry before assuming `App.jsx` is the only one in use |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | App source — see `src/AGENTS.md` |

## For AI Agents

### Working In This Directory
This app is one of the two manual verification surfaces for the whole library (see
root `AGENTS.md`) — `pnpm dev` here and exercise the autoconnect URL-param flow after
any change to `src/connectors/` or `src/hooks/`.

<!-- MANUAL: -->
