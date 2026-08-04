<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# src

## Purpose

App source for the `basic` example. Multiple `App*.jsx` variants exist side by side for
different manual-test scenarios (full RainbowKit suite, wagmi-only, UX demo) rather than
one canonical app — check `main.jsx` to see which is actually rendered before assuming.

## Key Files

| File | Description |
|------|--------------|
| `main.jsx` | Vite entry point — check which `App*.jsx` it imports |
| `App.jsx` | Comprehensive RainbowKit + wagmi test suite |
| `App-Wagmi-Only.jsx` | Pure wagmi variant, no RainbowKit |
| `App-UX-Demo.jsx` | UX-focused demo variant |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Test-harness components (diagnostics, stress tests, connector function tests) — see `components/AGENTS.md` |
| `styles/` | Global CSS — see `styles/AGENTS.md` |

<!-- MANUAL: -->
