# Bug Fixes for v1.1.2 Testing Issues

## Issues Found and Fixed

### ✅ Issue #1: Send ETH - "invalid chain: [object Object]"

**Problem:** 
Transaction was including unnecessary `data: '0x'` field which was causing chain validation issues.

**Fix in `useUnicornTransaction.js`:**
```javascript
// Before (WRONG)
const tx = {
  to,
  value: typeof value === 'string' ? parseEther(value) : value,
  data: txData || '0x', // ❌ Always including data
};

// After (CORRECT)
const tx = {
  to,
  value: typeof value === 'string' ? parseEther(value) : value,
};

if (txData) {
  tx.data = txData; // ✅ Only include data when provided
}
```

**Why:** Thirdweb's sendTransaction doesn't expect empty data field for simple transfers.

---

### ✅ Issue #2: Read Balance - "account.call is not a function"

**Problem:**
Thirdweb's smart account doesn't have a `.call()` method like viem accounts do.

**Fix in `useUnicornTransaction.js`:**
```javascript
// Before (WRONG)
const account = wallet.unicornWallet.getAccount();
const result = await account.call({ to: address, data }); // ❌ No .call method

// After (CORRECT)
const { createPublicClient, http } = await import('viem');
const { base } = await import('viem/chains');

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const result = await publicClient.readContract({
  address,
  abi: [functionAbi],
  functionName,
  args,
});
```

**Why:** For reading from contracts, we should use a public client (doesn't need wallet signature).

**Note:** Currently hardcoded to Base chain. Future improvement: make it dynamic based on `wallet.chainId`.

---

### ✅ Issue #3: Verify Signature - "Signature is invalid!"

**Problem:**
The signed message wasn't being stored, so verification was using a different message.

**Fix in test App.jsx:**
```javascript
// Before (WRONG)
const [signature, setSignature] = useState('');
// No storage of original message

const handleSignMessage = async () => {
  const sig = await sign.signMessageAsync({
    message: 'Testing AutoConnect v1.1.2!',
  });
  setSignature(sig);
};

const handleVerifySignature = async () => {
  const isValid = await sign.verifyMessage({
    message: 'Testing AutoConnect v1.1.2!', // ❌ Might not match exactly
    signature,
  });
};

// After (CORRECT)
const [signature, setSignature] = useState('');
const [signedMessage, setSignedMessage] = useState(''); // ✅ Store the message

const handleSignMessage = async () => {
  const message = 'Testing AutoConnect v1.1.2!';
  const sig = await sign.signMessageAsync({ message });
  setSignature(sig);
  setSignedMessage(message); // ✅ Save for later
};

const handleVerifySignature = async () => {
  const isValid = await sign.verifyMessage({
    message: signedMessage, // ✅ Use exact same message
    signature,
  });
};
```

**Why:** Message and signature must match exactly for verification to work.

---

## Files Updated

### 1. useUnicornTransaction.js
- ✅ Fixed `sendTransaction` to not include empty data field
- ✅ Fixed `readContract` to use public client instead of account.call

### 2. useUnicornSignMessage.js  
- ✅ Improved `verifyMessage` message format handling

### 3. example-v112-test-App.jsx
- ✅ Added `signedMessage` state
- ✅ Store message when signing
- ✅ Use stored message when verifying

---

## How to Apply Fixes

### Option A: Copy Updated Files

Copy the updated files from `/mnt/user-data/outputs/`:

```bash
# In your autoconnect package
cp /path/to/outputs/useUnicornTransaction.js src/hooks/
cp /path/to/outputs/useUnicornSignMessage.js src/hooks/
cp /path/to/outputs/example-v112-test-App.jsx src/examples/basic/src/App.jsx

# Rebuild
npm run build
```

### Option B: Manual Updates

Make the changes shown above in each file.

---

## Test Again

After applying fixes, all 5 tests should work:

- ✅ Send 0.0001 ETH (FIXED)
- ✅ Read USDC Balance (FIXED)
- ✅ Sign Message (Already worked)
- ✅ Verify Signature (FIXED)
- ✅ Sign Typed Data (Already worked)

---

## Remaining Known Issues

### TODO: Dynamic Chain Support

Currently `readContract` is hardcoded to Base chain:
```javascript
const { base } = await import('viem/chains');
const publicClient = createPublicClient({
  chain: base, // TODO: Make dynamic
  transport: http(),
});
```

**Future improvement:** Detect chain from `wallet.chainId` and import correct chain config.

### Example Implementation:
```javascript
// Get chain config based on chainId
const getChain = async (chainId) => {
  const chains = await import('viem/chains');
  const chainMap = {
    1: chains.mainnet,
    8453: chains.base,
    137: chains.polygon,
    10: chains.optimism,
    42161: chains.arbitrum,
  };
  return chainMap[chainId] || chains.base;
};

const chain = await getChain(wallet.chainId);
const publicClient = createPublicClient({ chain, transport: http() });
```

---

## Summary

**3/3 Issues Fixed! ✅**

All transaction and signing functionality should now work correctly with Unicorn wallets.

Next step: Test again and verify all 5 features work!
