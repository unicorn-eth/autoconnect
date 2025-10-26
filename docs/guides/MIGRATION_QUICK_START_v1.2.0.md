# Quick Migration: v1.1.x → v1.2.0

## 🎯 TL;DR

**The Big Change:** Replace `<UnicornAutoConnect />` component with `unicornConnector()` in your wagmi config.

## ⚡ 3-Step Migration

### 1. Update Package
```bash
npm install @unicorn.eth/autoconnect@1.2.0
```

### 2. Remove Component, Add Connector

**❌ DELETE from your App.jsx:**
```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="base"
/>
```

**✅ ADD to your wagmi config:**
```jsx
import { unicornConnector } from '@unicorn.eth/autoconnect';

// After creating your wagmi config:
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet],
    options: {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
    }
  })
);
```

### 3. Update Verification (If You Use It)

**Before:**
```jsx
const isValid = await verifyMessage({ message, signature });
if (isValid) { ... }
```

**After:**
```jsx
const result = await verifyMessage({ message, signature });
if (result.isValid) { ... }
```

## ✅ That's It!

Your app now uses the standard Wagmi connector pattern. Unicorn will show up in your RainbowKit wallet list automatically.

## 🎁 Bonus: Use Universal Hooks

Instead of manually checking wallet types:

**Before (still works, but verbose):**
```jsx
const wallet = useUniversalWallet();
const unicornTx = useUnicornTransaction();
const wagmiTx = useSendTransaction();

if (wallet.isUnicorn) {
  await unicornTx.sendTransaction(tx);
} else {
  await wagmiTx.sendTransactionAsync(tx);
}
```

**After (recommended):**
```jsx
const tx = useUniversalTransaction();

// Works with both automatically!
await tx.sendTransactionAsync(tx);
```

## 📚 Full Documentation

- [Complete Release Notes](./RELEASE_NOTES_v1.2.0.md)
- [Quick Reference](./QUICK_REFERENCE_v1.2.0.md)
- [README](./README.md)

---

**Questions?** Open an issue or join our [Discord](https://discord.gg/unicorn) 🦄
