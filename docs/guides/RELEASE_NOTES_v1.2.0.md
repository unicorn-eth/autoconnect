# Release Notes: v1.2.0

## 🎉 What's New

### Universal Hooks (Major Feature!)
- ✅ `useUniversalTransaction` - One hook for all wallet types
- ✅ `useUniversalSignMessage` - Unified signing for all wallets
- ✅ `useUniversalWallet` - Universal wallet information

### Smart Account Support
- ✅ Proper ERC-1271 signature handling
- ✅ Structured verification responses
- ✅ Clear smart account vs EOA distinction

### Bug Fixes
- ✅ Fixed "invalid chain" errors in transactions
- ✅ Fixed "account.call is not a function" in contract reads
- ✅ Fixed transaction delegation to use wrapper properly
- ✅ Fixed dependency version conflicts

## 🚨 Breaking Changes

### 1. Architecture Change: Component → Connector (BREAKING)

**The biggest change in v1.2.0 is how you integrate Unicorn into your app.**

**Before (v1.1.x) - Component Approach:**
```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <YourApp />
        
        {/* Old approach - separate component */}
        <UnicornAutoConnect
          clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
          factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
          defaultChain="base"
        />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
```

**After (v1.2.0) - Connector Approach:**
```jsx
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet } from 'wagmi/chains';

// Create config
const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base, polygon, mainnet],
  ssr: true,
});

// Add Unicorn as a standard connector
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

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <YourApp />
          {/* No component needed! */}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**Why this change:**
- ✅ Standard Wagmi connector pattern (like MetaMask, WalletConnect)
- ✅ Shows up in RainbowKit wallet list automatically
- ✅ No separate React root needed
- ✅ Cleaner architecture
- ✅ No provider conflicts

**Migration:** Remove `<UnicornAutoConnect />` component and add `unicornConnector()` to your wagmi config.

### 2. Signature Verification Response (BREAKING)

**Before (v1.1.x):**
```javascript
const isValid = await sign.verifyMessage({ message, signature });

if (isValid) {
  console.log('Valid signature!');
} else {
  console.log('Invalid signature');
}
```

**After (v1.2.0):**
```javascript
const result = await sign.verifyMessage({ message, signature });

if (result.isSmartAccount) {
  console.log('Smart account signature');
  console.log('Cannot verify client-side:', result.message);
} else if (result.isValid) {
  console.log('Valid EOA signature!');
} else {
  console.log('Invalid signature');
}
```

**New Response Structure:**
```typescript
interface VerificationResult {
  isValid: boolean;
  isSmartAccount: boolean;
  requiresOnChainVerification: boolean;
  standard: 'ECDSA' | 'ERC-1271';
  message: string;
  error?: string;
}
```

**Why:** Smart accounts (Unicorn wallets) use ERC-1271, which cannot be verified client-side like EOA signatures. The new response provides full context.

### 3. Contract Read Operations (Internal Change)

**Impact:** Low - Most users won't notice

**What Changed:**
- Now uses `publicClient.readContract()` instead of `account.call()`
- Different error messages
- More reliable for read-only operations

**Migration:** No code changes needed unless you're catching specific error types.

### 4. Transaction Delegation (Internal Change)

**Impact:** Low - Most users won't notice

**What Changed:**
- `sendTransaction` and `writeContract` now use `wallet.unicornWallet.sendTransaction()` 
- Previously used `wallet.unicornWallet.getAccount().sendTransaction()`
- Ensures proper approval dialogs and Thirdweb integration

**Migration:** No code changes needed for normal usage.

## 📦 Migration Guide

### For v1.1.x Users

#### Step 1: Update Package

```bash
npm install @unicorn.eth/autoconnect@1.2.0
```

#### Step 2: Replace Component with Connector (MOST IMPORTANT!)

This is the biggest change - you need to switch from the component approach to the connector approach.

**Remove the component from your App:**

```jsx
// ❌ DELETE THIS:
<UnicornAutoConnect
  clientId={...}
  factoryAddress={...}
  defaultChain="base"
/>
```

**Add the connector to your wagmi config:**

```jsx
// ✅ ADD THIS to your config file:
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base, polygon, mainnet],
  ssr: true,
});

// Add Unicorn connector
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

export { config };
```

**Update environment variable names (if needed):**
- `VITE_THIRDWEB_CLIENT_ID` → `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` (or keep VITE_ if using Vite)
- `VITE_THIRDWEB_FACTORY_ADDRESS` → `NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS` (or keep VITE_ if using Vite)

#### Step 3: Update Verification Code

Search your codebase for `verifyMessage` and update the response handling:

**Find:**
```javascript
const isValid = await verifyMessage(...)
if (isValid) { ... }
```

**Replace with:**
```javascript
const result = await verifyMessage(...)
if (result.isValid) { ... }

// Optionally handle smart accounts:
if (result.isSmartAccount) {
  // Show warning that verification requires ERC-1271
}
```

#### Step 4: Test

Test your app with both wallet types:
- ✅ Standard wallet (MetaMask, etc.)
- ✅ Unicorn wallet

Pay special attention to:
- Transaction sending
- Message signing
- Signature verification

#### Step 5: Update Error Handling (Optional)

If you're catching specific errors, update them:

**Before:**
```javascript
try {
  const balance = await readContract(...);
} catch (error) {
  if (error.message.includes('call')) {
    // Handle call error
  }
}
```

**After:**
```javascript
try {
  const balance = await readContract(...);
} catch (error) {
  if (error.message.includes('readContract')) {
    // Handle readContract error
  }
}
```

## ⚡ Quick Migration Checklist

- [ ] Update to v1.2.0: `npm install @unicorn.eth/autoconnect@1.2.0`
- [ ] **Remove `<UnicornAutoConnect />` component from your App**
- [ ] **Add `unicornConnector()` to your wagmi config**
- [ ] Update import: `import { unicornConnector } from '@unicorn.eth/autoconnect'`
- [ ] Search for `verifyMessage` in your code
- [ ] Update verification response handling from boolean to object
- [ ] Add `result.isValid` instead of just checking truthiness
- [ ] (Optional) Handle `result.isSmartAccount` for better UX
- [ ] Test with both wallet types
- [ ] Check that approval dialogs still work
- [ ] Verify Unicorn appears in RainbowKit wallet list

## 🎯 Recommended Updates (Not Breaking)

While not required, we recommend:

### 1. Switch to Universal Hooks

**Before (still works):**
```javascript
import { useUnicornTransaction } from '@unicorn.eth/autoconnect';
import { useSendTransaction } from 'wagmi';

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
```javascript
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

const tx = useUniversalTransaction();

// Works with both automatically!
await tx.sendTransactionAsync(tx);
```

### 2. Improve Smart Account UX

```javascript
const result = await sign.verifyMessage({ message, signature });

if (result.isSmartAccount) {
  // Show helpful message
  showMessage(
    '⚠️ Smart Account Signature',
    'This signature is valid on-chain but cannot be verified client-side. ' +
    'Smart accounts use ERC-1271 which requires contract interaction to verify.'
  );
} else if (result.isValid) {
  showMessage('✅ Verified!', 'Signature is valid');
} else {
  showMessage('❌ Invalid', 'Signature verification failed');
}
```

## 📊 Version Comparison

| Aspect | v1.1.x | v1.2.0 |
|--------|--------|--------|
| **Integration** | `<UnicornAutoConnect />` component | `unicornConnector()` in config |
| **Architecture** | Separate React root | Standard Wagmi connector |
| **RainbowKit** | Separate from wallet list | Shows in wallet list |
| **Universal Hooks** | ❌ | ✅ |
| **Verification Response** | Boolean | Structured Object |
| **Smart Account Context** | ❌ | ✅ |
| **Transaction Delegation** | Buggy | Fixed |
| **Contract Reads** | account.call | publicClient |
| **Chain Validation** | Broken | Fixed |

## 📸 Visual Comparison

### v1.1.x Structure
```
Your App
├── WagmiProvider
│   ├── RainbowKitProvider
│   │   ├── YourApp
│   │   └── <UnicornAutoConnect />  ← Separate component
│   │       └── (Creates isolated React root)
```

### v1.2.0 Structure  
```
Your App
├── WagmiProvider (with unicornConnector)  ← Built into config
│   ├── QueryClientProvider
│   │   └── RainbowKitProvider
│   │       └── YourApp
```

**Result:** Cleaner, more standard, better integrated! 🎉

## 🐛 Bug Fixes in Detail

### Fixed: "invalid chain: [object Object]"
**Issue:** Transactions failed with chain validation error
**Fix:** Removed unnecessary chain object from transaction params
**Impact:** Transactions now work reliably

### Fixed: "account.call is not a function"
**Issue:** Contract reads failed with method error
**Fix:** Use publicClient.readContract instead of account.call
**Impact:** Contract reads now work for all users

### Fixed: Transaction Approval Dialogs
**Issue:** Approval dialogs didn't show consistently
**Fix:** Proper delegation to unicornWalletWrapper
**Impact:** Approval flow works as expected

### Fixed: Dependency Conflicts
**Issue:** wagmi/viem version mismatches caused build errors
**Fix:** Use broad peerDependency ranges (^2.0.0)
**Impact:** Package installs cleanly with different versions

## 🔄 Rollback Plan

If you need to rollback to v1.1.x:

```bash
npm install @unicorn.eth/autoconnect@1.1.2
```

**Note:** You'll lose the smart account signature context, but basic functionality will work.

## 🆘 Need Help?

- 🐛 **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/autoconnect/issues)
- 💬 **Discord**: [Community](https://discord.gg/unicorn)
- 📧 **Email**: support@unicorn.eth

## 📝 Changelog

### [1.2.0] - 2025-XX-XX

#### Added
- Universal hooks: `useUniversalTransaction`, `useUniversalSignMessage`
- Structured verification response with smart account context
- Smart account signature documentation
- Migration guide from v1.1.x

#### Changed
- **BREAKING:** `verifyMessage` now returns structured object instead of boolean
- Transaction methods now use wrapper delegation properly
- Contract reads use publicClient instead of account.call
- Improved error messages

#### Fixed
- "invalid chain" error in transactions
- "account.call is not a function" in contract reads
- Transaction approval dialog consistency
- Dependency version conflicts (wagmi/viem)

### [1.1.2] - 2025-XX-XX
- Bug fixes and improvements

### [1.1.1] - 2025-XX-XX
- Initial stable release

---

**Thank you for using @unicorn.eth/autoconnect!** 🦄

Please report any issues or questions in our GitHub repository.
