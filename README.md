# @unicorn.eth/autoconnect

[![npm version](https://img.shields.io/npm/v/@unicorn.eth/autoconnect.svg)](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Drop-in Unicorn wallet integration for React/Wagmi apps - zero breaking changes

Add gasless, smart account functionality to your dApp in 2 minutes. Works alongside your existing wallet setup (RainbowKit, Wagmi) as a standard Wagmi connector.

## ✨ Features

- 🔌 **Standard Wagmi Connector** - Works like any other wallet (MetaMask, WalletConnect, etc.)
- 🎯 **Universal Hooks** - One hook works with ALL wallet types
- 🆓 **Gasless Transactions** - Automatic for Unicorn users
- 🔐 **Smart Account Support** - Proper ERC-1271 signature handling
- 🚀 **Zero Breaking Changes** - Existing wallets keep working
- ⚡ **2-Minute Setup** - Just add the connector
- 📦 **TypeScript Support** - Full type definitions
- 🎨 **RainbowKit Compatible** - Shows in wallet list automatically

## 🆕 What's New in v1.2.0

- 🎯 **Universal Hooks** - `useUniversalTransaction` and `useUniversalSignMessage` work with both wallet types
- 🔐 **Structured Verification** - Smart account signature handling with full context
- ⚡ **Improved Delegation** - Proper transaction approval dialogs
- 🐛 **Bug Fixes** - Fixed chain validation, read operations, and more

**⚠️ Breaking Change:** `verifyMessage` now returns structured object. [See migration guide](#-migration-from-v11x)

## 📦 Installation

```bash
npm install @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

## 🚀 Quick Start

### 1. Add the Connector

```jsx
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// Create wagmi config
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

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 2. Add Environment Variables

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

### 3. Use Universal Hooks (Recommended)

```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
import { parseEther } from 'viem';

function SendETH() {
  const tx = useUniversalTransaction();
  
  const handleSend = async () => {
    await tx.sendTransactionAsync({
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      value: parseEther('0.001'),
    });
  };
  
  return (
    <button onClick={handleSend} disabled={tx.isPending}>
      {tx.isPending ? '⏳ Sending...' : '💸 Send 0.001 ETH'}
    </button>
  );
}
```

**That's it!** Your app now supports Unicorn wallets alongside all your existing wallets.

## 📖 Documentation

### Configuration

#### unicornConnector Options

```typescript
interface UnicornConnectorOptions {
  // Required: Your Thirdweb client ID
  clientId: string;
  
  // Required: Smart account factory address
  factoryAddress: string;
  
  // Optional: Default chain (default: 'base')
  defaultChain?: 'base' | 'polygon' | 'ethereum' | 'arbitrum' | 'optimism';
  
  // Optional: Connection timeout in ms (default: 5000)
  timeout?: number;
  
  // Optional: Enable debug logging (default: false)
  debug?: boolean;
  
  // Optional: Enable transaction approval dialogs (default: true)
  enableTransactionApproval?: boolean;
}
```

#### Full Configuration Example

```jsx
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet, arbitrum, optimism],
    options: {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
      timeout: 10000,
      debug: process.env.NODE_ENV === 'development',
      enableTransactionApproval: true,
    }
  })
);
```

### Universal Hooks

#### useUniversalTransaction

Send transactions that work with **any wallet type**:

```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

const tx = useUniversalTransaction();

// Send ETH
await tx.sendTransactionAsync({
  to: '0x...',
  value: parseEther('0.01'),
});

// Write to contract
await tx.writeContractAsync({
  address: '0x...',
  abi: [...],
  functionName: 'transfer',
  args: ['0x...', 1000000],
});

// Read from contract
const balance = await tx.readContractAsync({
  address: '0x...',
  abi: [...],
  functionName: 'balanceOf',
  args: ['0x...'],
});
```

**API:**
```typescript
interface UniversalTransaction {
  sendTransactionAsync: (params) => Promise<TransactionResult>;
  writeContractAsync: (params) => Promise<TransactionResult>;
  readContractAsync: (params) => Promise<any>;
  isPending: boolean;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}
```

#### useUniversalSignMessage

Sign messages and verify signatures with **any wallet type**:

```jsx
import { useUniversalSignMessage } from '@unicorn.eth/autoconnect';

const sign = useUniversalSignMessage();

// Sign message
const signature = await sign.signMessageAsync({
  message: 'Hello Web3!',
});

// Sign typed data (EIP-712)
const typedSig = await sign.signTypedDataAsync({
  domain: { name: 'My dApp', version: '1', chainId: 8453 },
  types: { Person: [{ name: 'name', type: 'string' }] },
  primaryType: 'Person',
  message: { name: 'Alice' },
});

// Verify signature (NEW in v1.2.0!)
const result = await sign.verifyMessage({ message, signature });

if (result.isSmartAccount) {
  console.log('Smart account signature (ERC-1271)');
  console.log('Cannot verify client-side, but IS valid on-chain');
} else if (result.isValid) {
  console.log('Valid EOA signature!');
}
```

**API:**
```typescript
interface UniversalSignMessage {
  signMessageAsync: (params) => Promise<string>;
  signTypedDataAsync: (params) => Promise<string>;
  verifyMessage: (params) => Promise<VerificationResult>;
  isPending: boolean;
  signature: string | null;
  error: Error | null;
  reset: () => void;
}
```

**Verification Response (v1.2.0):**
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

#### useUniversalWallet

Get wallet information for **any connected wallet**:

```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

const wallet = useUniversalWallet();

console.log(wallet.address);         // Current address
console.log(wallet.isConnected);     // Connection status
console.log(wallet.isUnicorn);       // True if Unicorn wallet
console.log(wallet.chainId);         // Current chain ID
console.log(wallet.connector?.name); // Connector name
```

**API:**
```typescript
interface UniversalWallet {
  isConnected: boolean;
  address: string | undefined;
  chain: string | undefined;
  chainId: number | undefined;
  isUnicorn: boolean;
  isStandard: boolean;
  connector: { name: string; id: string } | null;
  wagmiAccount: Account;
  unicornWallet: any;
  disconnect: () => void;
}
```

## 💡 Common Patterns

### Conditional UI Based on Wallet Type

```jsx
function ConditionalFeatures() {
  const wallet = useUniversalWallet();
  
  if (!wallet.isConnected) {
    return <ConnectButton />;
  }
  
  return (
    <div>
      <p>Address: {wallet.address}</p>
      
      {wallet.isUnicorn && (
        <p style={{ color: 'green' }}>⚡ Gasless transactions enabled!</p>
      )}
      
      {wallet.isStandard && (
        <p style={{ color: 'orange' }}>⚠️ Gas fees apply</p>
      )}
    </div>
  );
}
```

### ERC20 Token Transfer

```jsx
function SendUSDC() {
  const tx = useUniversalTransaction();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base
  
  const sendToken = async () => {
    await tx.writeContractAsync({
      address: USDC,
      abi: [{
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
      }],
      functionName: 'transfer',
      args: ['0x...', 1000000], // 1 USDC (6 decimals)
    });
  };
  
  return (
    <button onClick={sendToken} disabled={tx.isPending}>
      Send 1 USDC
    </button>
  );
}
```

### NFT Minting

```jsx
function MintNFT() {
  const tx = useUniversalTransaction();
  
  const mint = async () => {
    await tx.writeContractAsync({
      address: '0xYourNFTContract',
      abi: [{
        name: 'mint',
        type: 'function',
        inputs: [{ name: 'quantity', type: 'uint256' }],
        stateMutability: 'payable',
      }],
      functionName: 'mint',
      args: [1],
      value: parseEther('0.05'),
    });
  };
  
  return (
    <button onClick={mint} disabled={tx.isPending}>
      {tx.isPending ? '⏳ Minting...' : '🎨 Mint NFT'}
    </button>
  );
}
```

## 🔧 How It Works

### Standard Wagmi Connector

The `unicornConnector` is a **standard Wagmi connector** - just like MetaMask or WalletConnect:

1. **Detects Unicorn Environment** - Only activates when accessed via Unicorn portal
2. **Registers as Connector** - Shows up in RainbowKit wallet list automatically
3. **Works with Wagmi** - All standard Wagmi hooks work normally
4. **Zero Conflicts** - No provider conflicts or React warnings

### Environment Detection

The connector only activates when accessed via Unicorn portal:

```
Normal:  https://yourapp.com
         → Standard wallets only

Unicorn: https://yourapp.com/?walletId=inApp&authCookie=...
         → Unicorn + standard wallets
```

In normal mode, your app works exactly as before.

## 🧪 Testing

### Test Normal Mode
```bash
http://localhost:3000
```
**Expected:** Only standard wallets (MetaMask, WalletConnect, etc.) appear

### Test Unicorn Mode
```bash
http://localhost:3000/?walletId=inApp&authCookie=test
```
**Expected:** Unicorn wallet appears in the wallet list alongside others

### Test All Features

```jsx
// 1. Connect wallet (Unicorn or standard)
// 2. Send ETH
await tx.sendTransactionAsync({ to: '0x...', value: parseEther('0.001') });

// 3. Read contract
const balance = await tx.readContractAsync({ address: USDC, ... });

// 4. Write contract
await tx.writeContractAsync({ address: USDC, ... });

// 5. Sign message
const sig = await sign.signMessageAsync({ message: 'Hello!' });

// 6. Verify signature
const result = await sign.verifyMessage({ message, signature: sig });
```

## 📚 Migration from v1.1.x

### ⚠️ Breaking Change: Verification Response

**Before (v1.1.x):**
```jsx
const isValid = await sign.verifyMessage({ message, signature });

if (isValid) {
  console.log('Valid!');
}
```

**After (v1.2.0):**
```jsx
const result = await sign.verifyMessage({ message, signature });

if (result.isSmartAccount) {
  console.log('Smart account - cannot verify client-side');
} else if (result.isValid) {
  console.log('Valid EOA signature!');
}
```

### Migration Steps

1. **Update package:**
   ```bash
   npm install @unicorn.eth/autoconnect@1.2.0
   ```

2. **Search for `verifyMessage` in your code**

3. **Update response handling:**
   - Change `if (isValid)` to `if (result.isValid)`
   - Add handling for `result.isSmartAccount` (optional but recommended)

4. **Test with both wallet types**

See [RELEASE_NOTES.md](./RELEASE_NOTES.md) for complete migration guide.

## 🐛 Troubleshooting

### Unicorn Connector Not Appearing

**Problem:** Unicorn doesn't show in wallet list

**Solution:** Make sure you added the connector:
```jsx
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet],
    options: { ... }
  })
);
```

### Transaction Fails with "invalid chain" Error

**Fixed in v1.2.0!** Update to latest version.

### Signature Shows as Invalid for Unicorn Wallets

**This is expected!** Smart account signatures use ERC-1271:
- Standard ECDSA verification doesn't work
- Returns `isValid: false` with explanation
- The signature **IS valid on-chain**
- Check `result.isSmartAccount` in the response

### TypeScript Errors

Make sure you have the correct peer dependencies:
```bash
npm install --save-dev @types/react @types/react-dom
```

## 📦 Peer Dependencies

This package requires:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "wagmi": "^2.0.0",
  "viem": "^2.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@rainbow-me/rainbowkit": "^2.0.0"
}
```

## 🎯 Best Practices

1. ✅ **Use unicornConnector** - Standard Wagmi connector approach
2. ✅ **Use Universal Hooks** - They handle wallet detection automatically
3. ✅ **Handle Smart Account Signatures** - Check `result.isSmartAccount` when verifying
4. ✅ **Enable Approval Dialogs** - Better UX for Unicorn users
5. ✅ **Error Handling** - Always wrap in try-catch
6. ✅ **Loading States** - Use `isPending` to show feedback
7. ✅ **Test Both Wallet Types** - Test with Unicorn AND MetaMask

## 📖 Additional Resources

- 📄 [Quick Reference](./QUICK_REFERENCE.md) - Comprehensive API documentation
- 📝 [Release Notes](./RELEASE_NOTES.md) - What's new in v1.2.0
- 🔧 [Examples](./examples/) - Working code examples
- 💬 [Discord](https://discord.gg/unicorn) - Community support
- 🐛 [Issues](https://github.com/MyUnicornAccount/autoconnect/issues) - Bug reports

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repo
git clone https://github.com/MyUnicornAccount/autoconnect.git
cd autoconnect

# Install dependencies
npm install

# Build
npm run build

# Run examples
cd examples/basic
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

**Built with ❤️ by [@cryptowampum](https://github.com/cryptowampum) and Claude AI**

Enhance your existing dApps without breaking anything 🦄✨