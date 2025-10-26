# Option 4: Structured Verification Response

## Implementation

The `verifyMessage` function now returns a **structured object** instead of a simple boolean, providing full context about the verification result.

## Return Type

```typescript
interface VerificationResult {
  isValid: boolean;                    // Whether signature is valid
  isSmartAccount: boolean;             // Whether this is a smart account
  requiresOnChainVerification: boolean; // Whether on-chain verification is needed
  standard: 'ECDSA' | 'ERC-1271';     // Which signature standard
  message: string;                     // Human-readable explanation
  error?: string;                      // Optional error details
}
```

## Response Examples

### For Standard Wallets (EOA) - Valid Signature
```javascript
{
  isValid: true,
  isSmartAccount: false,
  requiresOnChainVerification: false,
  standard: 'ECDSA',
  message: 'Signature is valid'
}
```

### For Standard Wallets (EOA) - Invalid Signature
```javascript
{
  isValid: false,
  isSmartAccount: false,
  requiresOnChainVerification: false,
  standard: 'ECDSA',
  message: 'Signature is invalid'
}
```

### For Smart Accounts (Unicorn)
```javascript
{
  isValid: false,  // Standard verification fails (expected)
  isSmartAccount: true,
  requiresOnChainVerification: true,
  standard: 'ERC-1271',
  message: 'Smart account signatures require ERC-1271 on-chain verification. The signature is valid but cannot be verified client-side using standard ECDSA.'
}
```

## Usage in Application

### Simple Check (Backwards Compatible)
```javascript
const result = await verifyMessage({ message, signature });

if (result.isValid) {
  console.log('Signature verified!');
}
```

### Smart Account Aware
```javascript
const result = await verifyMessage({ message, signature });

if (result.isSmartAccount) {
  // Handle smart account differently
  showWarning(result.message);
  // Signature is valid on-chain, just can't verify client-side
} else if (result.isValid) {
  // Standard wallet with valid signature
  showSuccess('Signature verified!');
} else {
  // Standard wallet with invalid signature
  showError('Invalid signature');
}
```

### Full Context Handling
```javascript
const result = await verifyMessage({ message, signature });

console.log(`Standard: ${result.standard}`);
console.log(`Needs on-chain verification: ${result.requiresOnChainVerification}`);
console.log(`Message: ${result.message}`);

if (result.isSmartAccount) {
  // Could implement ERC-1271 verification here
  const onChainValid = await verifyERC1271(
    result.address,
    message,
    signature
  );
}
```

## Test App Display

The test app now shows appropriate messages:

### For Unicorn Wallets:
```
⚠️ Smart Account Signature (ERC-1271)
Cannot verify client-side. Smart account signatures require ERC-1271 on-chain verification. The signature is valid but cannot be verified client-side using standard ECDSA.
Note: Signature IS valid on-chain.
```

### For Standard Wallets (Valid):
```
✅ Signature is valid! (ECDSA)
```

### For Standard Wallets (Invalid):
```
❌ Signature is invalid
```

## Benefits of Option 4

### ✅ Transparency
- Clearly indicates smart account vs EOA
- Explains why verification fails for smart accounts
- Provides actionable information

### ✅ Developer-Friendly
- Structured data is easy to handle programmatically
- No surprises - developers see exactly what's happening
- Can build proper UI around different cases

### ✅ Future-Proof
- Easy to add new fields (e.g., `chainId`, `verificationMethod`)
- Can add proper ERC-1271 verification later
- Compatible with both simple and complex use cases

### ✅ Honest
- Doesn't lie about verification status
- Provides context for why it can't verify
- Makes limitations clear

## Backward Compatibility

For simple boolean checks, you can still do:
```javascript
const result = await verifyMessage({ message, signature });
if (result.isValid) {
  // Handle valid signature
}
```

This works for EOAs. For smart accounts, you'll see `isValid: false` but can check `result.isSmartAccount` to understand why.

## Future Enhancement: ERC-1271 Verification

In a future version, we can add actual on-chain verification:

```javascript
const verifyMessage = async ({ message, signature }) => {
  // ... existing code ...
  
  if (wallet.isSmartAccount) {
    // Attempt ERC-1271 verification
    const publicClient = createPublicClient({ chain, transport: http() });
    
    try {
      const isValid = await publicClient.readContract({
        address: wallet.address,
        abi: ERC1271_ABI,
        functionName: 'isValidSignature',
        args: [hashMessage(message), signature]
      });
      
      return {
        isValid: isValid === '0x1626ba7e', // ERC-1271 magic value
        isSmartAccount: true,
        requiresOnChainVerification: true,
        standard: 'ERC-1271',
        verificationMethod: 'on-chain',
        message: 'Verified using ERC-1271 on-chain',
      };
    } catch (err) {
      return {
        isValid: false,
        isSmartAccount: true,
        requiresOnChainVerification: true,
        standard: 'ERC-1271',
        error: err.message,
        message: 'Could not verify on-chain',
      };
    }
  }
  
  // ... EOA verification ...
};
```

## Files Updated

1. **useUnicornSignMessage.js** - Returns structured object
2. **example-v112-test-App.jsx** - Handles structured response

## Apply the Changes

```bash
cp /path/to/outputs/useUnicornSignMessage.js src/hooks/
cp /path/to/outputs/example-v112-test-App.jsx src/examples/basic/src/App.jsx
npm run build
cd src/examples/basic
npm run dev
```

## Test Results

After applying:

### With Unicorn Wallet:
1. Sign Message → ✅ Works
2. Verify Signature → ⚠️ Shows smart account warning with explanation

### With MetaMask:
1. Sign Message → ✅ Works
2. Verify Signature → ✅ Shows "Signature is valid! (ECDSA)"

**Both cases now provide clear, actionable information!** 🎉
