<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# siwe

## Purpose

Sign-In-With-Ethereum (SIWE) signature verification that supports both EOA (ECDSA) and
smart-contract wallets (ERC-1271) — needed because Unicorn wallets are smart accounts
and standard client-side ECDSA verification always fails for them (see
`src/hooks/useUnicornSignMessage.js`'s `verifyMessage`). Exported as
`@unicorn.eth/autoconnect/siwe`, intended for server-side use.

## Key Files

| File | Description |
|------|--------------|
| `index.js` | Subpath export barrel — re-exports `verifySiweMessage`, `createSiweVerifier` |
| `verifySiweMessage.js` | Implementation. Delegates EOA-vs-ERC-1271 branching to viem's `publicClient.verifyMessage`, rather than reimplementing ERC-1271 checks by hand. Owns its own `CHAIN_MAP` (wagmi/viem chain id → viem chain object). |

## For AI Agents

### Working In This Directory
- `CHAIN_MAP` here is maintained separately from `THIRDWEB_CHAIN_MAP` in
  `src/connectors/unicornConnector.js` — same chain ids, different chain-object source
  (`viem/chains` here vs `thirdweb/chains` there). Update both when adding chain support.
- This module ships as raw source (see `src/integrations/AGENTS.md` note on subpath
  exports) — it's meant to run server-side (Node), don't introduce browser-only APIs.

<!-- MANUAL: -->
