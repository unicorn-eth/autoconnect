# @unicorn.eth/autoconnect v1.3

[![npm version](https://img.shields.io/npm/v/@unicorn.eth/autoconnect.svg)](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> True seamless Wagmi integration - Use standard wagmi hooks with Unicorn wallets

AutoConnect v1.3 is a **standard Wagmi connector** that enables gasless smart account transactions through the familiar wagmi interface you already know. No custom hooks required.

## ✨ What's New in v1.3

- 🎯 **Zero-Code-Change Integration** - Use standard `useSendTransaction`, `useSignMessage`, etc.
- 🔌 **Standard Wagmi Connector** - Works like MetaMask, WalletConnect, or any other connector
- ⚡ **Transaction Approval Dialogs** - Beautiful UI for gasless transaction confirmation
- 🌐 **Multi-Chain Support** - Base, Polygon, Arbitrum, Optimism, Gnosis, Celo
- 🔐 **Full Signature Support** - personal_sign and eth_signTypedData_v4 with approval dialogs
- 📱 **Auto-Connection** - Seamless connection via URL parameters

## 🆕 v1.3 Architecture

**The Big Change:** No more custom hooks! Just use standard wagmi:

```javascript
// v1.2 (OLD) - Required custom hooks
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
const tx = useUniversalTransaction();

// v1.3 (NEW) - Use standard wagmi hooks!
import { useSendTransaction } from 'wagmi';
const { sendTransaction } = useSendTransaction();
```

AutoConnect v1.3 is now a **pure Wagmi connector** - it works exactly like any other wallet connector, but adds gasless transaction support automatically.

## 📦 Installation

```bash
npm install @unicorn.eth/autoconnect wagmi viem
# or
pnpm add @unicorn.eth/autoconnect wagmi viem
# or
yarn add @unicorn.eth/autoconnect wagmi viem
```

### React Version Compatibility

**Supports React 18 and React 19**

This package is compatible with both React 18 and React 19. If you're using React 19, you may see peer dependency warnings during installation. This is expected and harmless - the package works correctly with React 19.

**For React 19 users**, use one of these installation methods:

```bash
# Option 1: Use --legacy-peer-deps flag
npm install @unicorn.eth/autoconnect --legacy-peer-deps

# Option 2: Use --force flag
npm install @unicorn.eth/autoconnect --force

# Option 3: Add to .npmrc file
echo "legacy-peer-deps=true" >> .npmrc
npm install @unicorn.eth/autoconnect
```

**Why the warning?** We specify React 18 in `peerDependencies` to ensure compatibility with the widest range of projects. React 19 is backward compatible with React 18 APIs, so everything works perfectly.

## 🚀 Quick Start

### 1. Add the Connector to Your Wagmi Config

```jsx
import { createConfig, http } from 'wagmi';
import { base, polygon } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [base, polygon],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    
    // Add Unicorn connector
    unicornConnector({
      clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.VITE_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
  },
});
```

### 2. Add AutoConnect Component (Optional)

For URL-based auto-connection:

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          
          {/* Add this for URL-based auto-connection */}
          <UnicornAutoConnect
            debug={true}
            onConnect={(wallet) => console.log('Connected!', wallet)}
            onError={(error) => console.error('Error:', error)}
          />
          
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 2. Add Environment Variables

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=4e8c81182c3709ee441e30d776223354
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

### 3. Use Universal Hooks (Recommended)

```jsx
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

function SendETH() {
  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  
  const handleSend = () => {
    sendTransaction({
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      value: parseEther('0.001'),
    });
  };
  
  if (!isConnected) return <ConnectButton />;
  
  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? '⏳ Sending...' : '💸 Send 0.001 ETH'}
    </button>
  );
}
```

**For Unicorn wallets:** Transaction approval dialog shows automatically! ⚡  
**For standard wallets:** Normal wallet popup shows as usual 🦊

## 🎯 The Power of v1.3

### No Custom Hooks Required

All these **standard wagmi hooks** work seamlessly:

```jsx
// ✅ Send transactions
import { useSendTransaction } from 'wagmi';

// ✅ Contract interactions
import { useReadContract, useWriteContract } from 'wagmi';

// ✅ Sign messages
import { useSignMessage, useSignTypedData } from 'wagmi';

// ✅ Account info
import { useAccount, useBalance } from 'wagmi';

// ✅ Chain management
import { useSwitchChain } from 'wagmi';

// ✅ Asset management
import { useWatchAsset } from 'wagmi';
```

### Automatic Transaction Approval

For Unicorn wallets, AutoConnect shows a beautiful approval dialog:

```jsx
// Just call sendTransaction like normal
sendTransaction({ to: '0x...', value: parseEther('0.01') });

// For Unicorn users: Beautiful approval dialog appears
// For MetaMask users: Normal wallet popup appears
// You write the same code for both!
```

## 📖 Core Features

### 1. Standard Wagmi Hooks

```jsx
import { useSendTransaction, useWriteContract } from 'wagmi';

function MyComponent() {
  const { sendTransaction } = useSendTransaction();
  const { writeContract } = useWriteContract();
  
  // Send ETH
  const sendETH = () => {
    sendTransaction({
      to: '0x...',
      value: parseEther('0.01'),
    });
  };
  
  // Call contract
  const transfer = () => {
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: ['0x...', 1000000],
    });
  };
  
  return (
    <>
      <button onClick={sendETH}>Send ETH</button>
      <button onClick={transfer}>Transfer USDC</button>
    </>
  );
}
```

### 2. Signing with Approval Dialogs

```jsx
import { useSignMessage, useSignTypedData } from 'wagmi';

function SigningComponent() {
  const { signMessage } = useSignMessage();
  const { signTypedData } = useSignTypedData();
  
  const signMsg = async () => {
    // For Unicorn: Shows approval dialog
    // For others: Shows wallet popup
    const signature = await signMessage({
      message: 'Hello Web3!',
    });
  };
  
  const signTyped = async () => {
    const signature = await signTypedData({
      domain: { name: 'My dApp', chainId: 8453 },
      types: { Person: [{ name: 'name', type: 'string' }] },
      primaryType: 'Person',
      message: { name: 'Alice' },
    });
  };
  
  return (
    <>
      <button onClick={signMsg}>Sign Message</button>
      <button onClick={signTyped}>Sign Typed Data</button>
    </>
  );
}
```

### 3. Multi-Chain Support

```jsx
import { useSwitchChain } from 'wagmi';
import { base, polygon, arbitrum } from 'wagmi/chains';

function ChainSwitcher() {
  const { switchChain } = useSwitchChain();
  
  return (
    <>
      <button onClick={() => switchChain({ chainId: base.id })}>
        Switch to Base
      </button>
      <button onClick={() => switchChain({ chainId: polygon.id })}>
        Switch to Polygon
      </button>
      <button onClick={() => switchChain({ chainId: arbitrum.id })}>
        Switch to Arbitrum
      </button>
    </>
  );
}
```

## 🔧 Configuration

### Connector Options

```typescript
interface UnicornConnectorOptions {
  // Required: Thirdweb client ID
  clientId: string;
  
  // Required: Smart account factory address
  factoryAddress: string;
  
  // Required: Default chain ID (e.g., 8453 for Base)
  defaultChain: number;
  
  // Optional: Wallet icon URL
  icon?: string;
}
```

### AutoConnect Options

```typescript
interface UnicornAutoConnectProps {
  // Optional: Enable debug logging
  debug?: boolean;
  
  // Optional: Callback when wallet connects
  onConnect?: (wallet: any) => void;
  
  // Optional: Callback on connection error
  onError?: (error: Error) => void;
}
```

### Full Configuration Example

```jsx
import { createConfig, http } from 'wagmi';
import { base, polygon, arbitrum, optimism, gnosis, celo } from 'wagmi/chains';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [base, polygon, arbitrum, optimism, gnosis, celo],
  connectors: [
    // ... other connectors
    unicornConnector({
      clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: base.id,
      icon: 'https://unicorn.eth/icon.png',
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [gnosis.id]: http(),
    [celo.id]: http(),
  },
});
```

## 🌐 Supported Chains

| Chain | Chain ID | Notes |
|-------|----------|-------|
| Base | 8453 | L2 - Low fees |
| Polygon | 137 | Popular sidechain |
| Arbitrum | 42161 | L2 - Low fees |
| Optimism | 10 | L2 - Low fees |
| Gnosis Chain | 100 | Stable coin gas |
| Celo | 42220 | Mobile-first |

To add more chains, just import from `thirdweb/chains` and `wagmi/chains`:

```javascript
import { avalanche } from 'thirdweb/chains';
import { avalanche as wagmiAvalanche } from 'wagmi/chains';

// Add to connector
// Add to wagmi config chains
// Add transport
```

## 💡 How It Works

### Architecture

```
User Code (Standard Wagmi)
          ↓
    useSendTransaction()
          ↓
    Wagmi Core Layer
          ↓
   unicornConnector
          ↓
 ┌─────────────────┐
 │  Is Unicorn?    │
 └─────────────────┘
    Yes ↓    ↓ No
        ↓    ↓
 Show Dialog │
        ↓    │
   Thirdweb  │
   (Gasless) │
        ↓    ↓
    Transaction Sent
```

### Key Components

1. **unicornConnector.js** - Standard Wagmi connector implementation
   - Implements all required connector methods
   - Intercepts transactions/signing for approval dialogs
   - Wraps Thirdweb's inApp wallet with smart account support

2. **UnicornAutoConnect.jsx** - Auto-connection component
   - Detects URL parameters (`?walletId=inApp&authCookie=...`)
   - Connects through wagmi's connection system
   - Optional component for URL-based workflows

3. **UnicornTransactionApproval.jsx** - Approval dialog UI
   - Shows transaction details before execution
   - Different UI for transactions vs. signatures
   - Supports user rejection

## 🧪 Testing

### Test with Different Wallets

```bash
# Normal mode - Standard wallets only
http://localhost:3000

# Unicorn mode - Auto-connects Unicorn wallet
http://localhost:3000/?walletId=inApp&authCookie=test
```

### Complete Test Suite

```jsx
// Test 1: Connection
const { isConnected, address, connector } = useAccount();

// Test 2: Send ETH
const { sendTransaction } = useSendTransaction();
await sendTransaction({ to: '0x...', value: parseEther('0.001') });

// Test 3: Read Contract
const { data } = useReadContract({
  address: USDC,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [address],
});

// Test 4: Write Contract
const { writeContract } = useWriteContract();
await writeContract({
  address: USDC,
  abi: ERC20_ABI,
  functionName: 'transfer',
  args: ['0x...', 1000000],
});

// Test 5: Sign Message
const { signMessage } = useSignMessage();
await signMessage({ message: 'Hello!' });

// Test 6: Sign Typed Data
const { signTypedData } = useSignTypedData();
await signTypedData({ domain, types, primaryType, message });

// Test 7: Switch Chain
const { switchChain } = useSwitchChain();
await switchChain({ chainId: polygon.id });

// Test 8: Watch Asset
const { watchAsset } = useWatchAsset();
await watchAsset({ type: 'ERC20', options: { address: USDC, symbol: 'USDC' } });
```

## 📚 Migration from v1.2

### Major Changes

**v1.2 (Old Approach):**
```javascript
// Custom hooks required
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
const tx = useUniversalTransaction();
await tx.sendTransactionAsync({ ... });
```

**v1.3 (New Approach):**
```javascript
// Standard wagmi hooks
import { useSendTransaction } from 'wagmi';
const { sendTransaction } = useSendTransaction();
sendTransaction({ ... });
```

### Migration Steps

1. **Remove custom hook imports:**
   ```diff
   - import { useUniversalTransaction, useUniversalSignMessage } from '@unicorn.eth/autoconnect';
   + import { useSendTransaction, useSignMessage } from 'wagmi';
   ```

2. **Update hook usage:**
   ```diff
   - const tx = useUniversalTransaction();
   - await tx.sendTransactionAsync({ to, value });
   + const { sendTransaction } = useSendTransaction();
   + sendTransaction({ to, value });
   ```

3. **Update connector setup:**
   ```diff
   - config.connectors.push(unicornConnector({ chains: [...], options: {...} }));
   + const config = createConfig({
   +   connectors: [unicornConnector({ clientId, factoryAddress, defaultChain })],
   + });
   ```

4. **Test thoroughly** with both Unicorn and standard wallets

## 🛠 Troubleshooting

### Approval Dialog Not Showing

**Issue:** Transactions execute without showing approval dialog

**Solution:** Make sure `UnicornTransactionApproval.jsx` is in the same directory as `unicornConnector.js`, or the connector can import it:

```javascript
// In unicornConnector.js
const module = await import('./UnicornTransactionApproval.jsx');
```

### Connector Not Appearing in RainbowKit

**Issue:** Unicorn wallet doesn't show in wallet list

**Solution:** Make sure the connector is added to wagmi config:

```javascript
const config = createConfig({
  connectors: [
    // ... other connectors
    unicornConnector({ ... }), // Must be here!
  ],
});
```

### Chain Switching Not Working

**Issue:** `switchChain` throws error about unsupported chain

**Solution:** Make sure the chain is:
1. Imported in `unicornConnector.js` from `thirdweb/chains`
2. Added to `THIRDWEB_CHAIN_MAP`
3. Added to wagmi config `chains` array
4. Has a transport configured

### Signatures Show as Invalid

**Note:** This is expected for smart accounts!

Smart account signatures use ERC-1271 and require on-chain verification. The signatures **ARE valid** but cannot be verified client-side using standard ECDSA verification.

## 🎯 Best Practices

1. ✅ **Use Standard Wagmi Hooks** - No custom wrappers needed
2. ✅ **Handle Both Wallet Types** - Test with Unicorn AND MetaMask
3. ✅ **Enable Debug Mode** - Use `debug={true}` during development
4. ✅ **Error Handling** - Always wrap async calls in try-catch
5. ✅ **Loading States** - Use `isPending` from wagmi hooks
6. ✅ **Chain Configuration** - Add all chains you support to both maps
7. ✅ **Test URL Parameters** - Test both normal and Unicorn modes

## 🔧 Troubleshooting

### React 19 Peer Dependency Warnings

**Symptom:** Installation warnings about React peer dependencies

**Solution:** This is expected and harmless. Use `--legacy-peer-deps`:
```bash
npm install @unicorn.eth/autoconnect --legacy-peer-deps
```

### Build Fails with "clientId is required"

**Symptom:** Production builds fail with connector initialization error

**Solution:** Conditionally add the connector only when env vars are set:
```typescript
const connectors = [injected(), walletConnect()];

// Only add Unicorn if credentials exist
if (process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  connectors.push(unicornConnector({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
  }));
}
```

### Connector Not Found Error

**Symptom:** "Unicorn connector not found" in console

**Solution:** Ensure `unicornConnector()` is in your wagmi config's `connectors` array

### RainbowKit Doesn't Show Connection

**Symptom:** AutoConnect logs success but RainbowKit still shows "Connect Wallet"

**Solution (v1.3.4+):** The component now auto-syncs wagmi state. Enable debug mode to see:
```tsx
<UnicornAutoConnect debug={true} />
```

### Vite Build Errors with Wagmi Imports

**Symptom:** "Cannot resolve module 'wagmi'" in examples

**Solution:** Add to `vite.config.js`:
```javascript
export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'wagmi', 'viem', 'thirdweb'],
  },
  optimizeDeps: {
    include: ['wagmi', 'viem', 'thirdweb'],
  },
});
```

## 📖 Additional Resources

- 📄 [Quick Reference](./QUICK_REFERENCE.md) - Complete API documentation
- 🔍 [Visual Explanation](./VISUAL-EXPLANATION.md) - Architecture diagrams
- 🔄 [Continuation Prompt](./CONTINUATION-PROMPT.md) - For development handoff
- 💬 [Discord](https://discord.gg/unicorn) - Community support
- 🐛 [Issues](https://github.com/MyUnicornAccount/autoconnect/issues) - Bug reports

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

**Built with ❤️ by [@cryptowampum](https://github.com/cryptowampum) and Claude AI**

Enhance your existing dApps without breaking anything 🦄✨
