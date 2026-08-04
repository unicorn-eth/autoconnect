<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# components

## Purpose

Manual test-harness components for the `basic` example app: connection diagnostics,
wallet status display, connector function tests, seamless-wagmi tests, and stress
tests.

## Key Files

| File | Description |
|------|--------------|
| `ConnectionDiagnostic.jsx` | Surfaces connector/connection state for debugging |
| `WalletStatus.jsx` | Displays current wallet/account state |
| `ConnectorFunctionTests.jsx` | Exercises connector methods directly |
| `SeamlessWagmiTests.jsx` | Exercises standard wagmi hooks against the Unicorn connector |
| `StressTests.jsx` | Repeated-action / edge-case testing |
| `TestButtons.jsx` | Generic action buttons for manual testing |

## For AI Agents

### Working In This Directory
These exist specifically to manually verify library behavior (there's no automated
suite — see root `AGENTS.md`). When fixing a bug in `src/connectors/` or `src/hooks/`
at the repo root, check whether one of these components already exercises the affected
path before writing a new one.

<!-- MANUAL: -->
