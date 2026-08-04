# Release Notes v1.5.3

## Wagmi v3 Support, SIWE Verification & EIP-1193 Fix

**Release Date:** August 2026
**Version:** 1.5.3

### What's New

#### Wagmi v3 Support

AutoConnect now supports both wagmi v2 and v3. `unicornConnector()` and `<UnicornAutoConnect />` detect whichever hook API your app's wagmi version exposes and adapt automatically — no config changes needed on your end.

```json
"peerDependencies": {
  "wagmi": "^2.0.0 || ^3.0.0"
}
```

If you're also upgrading your own app to wagmi v3, wagmi renamed several hooks (`useAccount` → `useConnection`, `useConnectors` split out from `useConnect`, etc.) — see the [wagmi v3 migration notes](./INTEGRATION_GUIDE.md#using-wagmi-v3) in the Integration Guide. AutoConnect itself needs no changes either way.

#### SIWE (Sign-In with Ethereum) Verification Adapter

New `@unicorn.eth/autoconnect/siwe` subpath for verifying SIWE signatures from Unicorn smart contract wallets, which sign via **ERC-1271** (on-chain verification) rather than standard ECDSA — something most SIWE libraries don't handle out of the box.

```javascript
import { verifySiweMessage } from '@unicorn.eth/autoconnect/siwe';

const isValid = await verifySiweMessage({ address, message, signature, chainId });
```

For a reusable verifier with configurable RPC URLs, use `createSiweVerifier()`. There's also a drop-in [BetterAuth integration](./INTEGRATION_GUIDE.md#using-with-betterauth):

```javascript
import { betterAuth } from "better-auth";
import { siwe } from "better-auth/plugins";
import { verifySiweMessage } from "@unicorn.eth/autoconnect/siwe";

export const auth = betterAuth({
  plugins: [
    siwe({
      domain: "yourdomain.com",
      getNonce: async () => generateNonce(),
      verifyMessage: async ({ message, signature, address, chainId }) => {
        // Handles both EOA (ecrecover) and smart contract (ERC-1271) wallets
        return verifySiweMessage({ address, message, signature, chainId });
      },
    }),
  ],
});
```

#### EIP-1193 `personal_sign` Fix

`personal_sign` now correctly decodes hex-encoded messages before signing. Previously, hex-encoded messages could produce signatures that failed verification (including SIWE / ERC-1271 checks) — this fixes that at the source.

**If you'd added your own workaround for malformed signatures from smart account wallets, remove it.**

#### Thirdweb SDK Update

Updated thirdweb peer dependency to `^5.120.1`.

### Updated Peer Dependencies

| Dependency | Old | New |
|------------|-----|-----|
| wagmi | `^2.0.0` | `^2.0.0 \|\| ^3.0.0` |
| thirdweb | `^5.118.0` | `^5.120.1` |

### Migration

No breaking changes. Just update:

```bash
npm install @unicorn.eth/autoconnect@1.5.3
```

If your app pins an older thirdweb version, bump that too:

```bash
npm install thirdweb@latest
```

The SIWE adapter is a new opt-in import (`@unicorn.eth/autoconnect/siwe`) — nothing to change unless you want to use it.

### Full Changelog

#### Added
- Wagmi v3 support — peer dependency now accepts `^2.0.0 || ^3.0.0`
- SIWE verification adapter (`@unicorn.eth/autoconnect/siwe`): `verifySiweMessage()` and `createSiweVerifier()`
- SIWE and BetterAuth documentation in the Integration Guide
- `/version.json` endpoint on example apps

#### Changed
- Updated thirdweb peer dependency to `^5.120.1`

#### Fixed
- EIP-1193 `personal_sign` now decodes hex-encoded messages before signing (fixes ERC-1271 / SIWE verification)
- `.npmrc` auth token variable mismatch (`NPM_TOKEN` → `NODE_AUTH_TOKEN`) that prevented CI publishing

See the [full Changelog](./CHANGELOG.md) for complete details.

---

**Questions?** Open an issue on [GitHub](https://github.com/unicorn-eth/autoconnect/issues)
