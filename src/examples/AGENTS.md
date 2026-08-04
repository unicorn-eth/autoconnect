<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# examples

## Purpose

Example consumer apps used to manually smoke-test the library (see root `AGENTS.md` —
there is no automated test suite, so these apps are the actual verification mechanism).
Not part of the published npm package (`.npmignore` excludes `examples/`, though note
the actual directory is `src/examples/` — see below).

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `basic/` | RainbowKit + wagmi v2 example, multiple test-harness App variants — see `basic/AGENTS.md` |
| `web3modal/` | Web3Modal v3 + wagmi v2 example — see `web3modal/AGENTS.md` |

## For AI Agents

### Working In This Directory
- Root `pnpm-workspace.yaml` declares `packages: ['examples/*']`, but these apps live at
  `src/examples/*`, not `examples/*`. Confirm whether pnpm is actually picking these up
  as workspace packages before relying on workspace-level commands (`pnpm -r`, etc.) to
  reach them — running `pnpm dev`/`pnpm build` directly inside each example's directory
  is the reliable way to use them.
- `_app.tsx` at `src/examples/` (one level up from `basic/`/`web3modal/`) is a
  free-standing snippet, not part of either app — don't assume it's wired into a build.

<!-- MANUAL: -->
