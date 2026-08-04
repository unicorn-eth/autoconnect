<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# technical

## Purpose

Deeper implementation writeups: smart-account signature handling, a Claude prompt used
for past autoconnect work (`CLAUDE_AUTOCONNECT_PROMPT.md`), delegation analysis, and
v1.3.0 release notes.

## Key Files

| File | Description |
|------|--------------|
| `SMART_ACCOUNT_SIGNATURES.md` | Background on ERC-1271 vs ECDSA signature handling — relevant reading before touching `src/siwe/` or the `verifyMessage` paths in `src/hooks/useUnicornSignMessage.js` |
| `CLAUDE_AUTOCONNECT_PROMPT.md` | A prompt used in a prior AI-assisted session, kept as a record — not a template to re-run verbatim without reviewing it against current code first |

## For AI Agents

### Working In This Directory
Most useful of the `docs/` subdirectories for understanding *why* the ERC-1271/smart-
account handling looks the way it does — read before modifying signature-verification
code, but still verify claims against current `src/siwe/verifySiweMessage.js`.

<!-- MANUAL: -->
