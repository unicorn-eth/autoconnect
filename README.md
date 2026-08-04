# @unicorn.eth/autoconnect v1.5.3

[![npm version](https://img.shields.io/npm/v/@unicorn.eth/autoconnect.svg)](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> True seamless Wagmi integration - Use standard wagmi hooks with Unicorn wallets

AutoConnect v1.5.3 is a **standard Wagmi v2/v3 connector** that enables gasless smart account transactions through the familiar wagmi interface you already know. No custom hooks required.

## ✨ What's New in v1.5.3

- ⬆️ **Wagmi v3 Support** - Now supports wagmi 2.x and 3.x
- 🔐 **SIWE Adapter** - Server-side SIWE verification for smart contract wallets (`@unicorn.eth/autoconnect/siwe`)
- 🔧 **EIP-1193 Fix** - personal_sign correctly decodes hex-encoded messages
- ⬆️ **Thirdweb 5.120.1** - Updated thirdweb peer dependency

## ⬆️ Upgrading to v1.5.3

```bash
npm install @unicorn.eth/autoconnect@latest
# or
pnpm add @unicorn.eth/autoconnect@latest
```

No breaking changes — existing wagmi v2 configs, `unicornConnector()`, and `<UnicornAutoConnect />` usage all continue to work unchanged. Wagmi v3 support is additive (see [wagmi v3 migration notes](./INTEGRATION_GUIDE.md#using-wagmi-v3) if you're also upgrading your app's wagmi version), and the SIWE adapter is a new opt-in import (`@unicorn.eth/autoconnect/siwe`).

The `thirdweb` peer dependency floor is now `^5.120.1` (up from `^5.118.0`) — if your app pins an older thirdweb version, bump it too: `npm install thirdweb@latest`.

One behavior change to be aware of: `personal_sign` now correctly decodes hex-encoded messages before signing. If you'd previously added a workaround for malformed signatures from smart account wallets, remove it — this fix addresses that at the source.

## ✨ What's New in v1.5.2

- ⚛️ **React 19 Support** - Now supports React 18.x and 19.x
- 📦 **Optional React** - React is now optional for connector-only usage (no UI components)
- ⬆️ **Thirdweb 5.118.0** - Updated to latest thirdweb SDK

## ✨ What's New in v1.5.0

- 🔧 **Wagmi v2 Only** - Removed wagmi v1 code to fix bundling conflicts with wagmi v2 projects
- 📦 **Smaller Bundle** - Cleaner build without legacy connector code

> **Using wagmi v1?** Install the legacy version: `npm install @unicorn.eth/autoconnect@legacy`

## ✨ What's New in v1.4

- 🌐 **Web3Modal v2 Support** - Official support for `@web3modal/ethereum` and `@web3modal/react` v2.7+
- 🔧 **New Integration Helper** - `createWeb3ModalConfig()` for the easiest possible Web3Modal setup
- 📦 **New Export Path** - Import from `@unicorn.eth/autoconnect/web3modal` for Web3Modal helpers
- 📚 **New Example Project** - Full working Web3Modal example in `src/examples/web3modal/`

See [Release Notes v1.4.0](./RELEASE_NOTES_v1.4.0.md) for full details.

## ✨ What's New in v1.3.6

- 🐛 **Wagmi v2 Compatibility Fix** - Fixed `config.getState is not a function` error
- ✅ **UnicornAutoConnect Component Fixed** - Auto-connection now works properly with wagmi v2
- 🔧 **State Access Updated** - Uses correct `config.state` property instead of deprecated method

## ✨ What's New in v1.3.5

- 🌐 **17 Networks Supported** - All major EVM chains including Ethereum, Avalanche, BNB Chain, zkSync, Scroll, and Zora
- 🧪 **Interactive Demo Switcher** - Three demo modes (UX, Technical, Pure Wagmi) with one-click switching
- 🎨 **Enhanced Examples** - Token balances, NFT galleries, and network-agnostic components
- ✅ **Ethereum Mainnet Fixed** - Added missing support for chain ID 1

## ✨ What's New in v1.3

- 🎯 **Zero-Code-Change Integration** - Use standard `useSendTransaction`, `useSignMessage`, etc.
- 🔌 **Standard Wagmi Connector** - Works like MetaMask, WalletConnect, or any other connector
- ⚡ **Transaction Approval Dialogs** - Beautiful UI for gasless transaction confirmation
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
```

## 🌐 Works With Your Existing Setup

AutoConnect is framework-agnostic and works with:

- ✅ **Pure Wagmi** - Standard wagmi configuration
- ✅ **RainbowKit** - Popular wallet connection UI
- ✅ **Web3Modal** - WalletConnect's modal library
- ✅ **Any wagmi-based setup** - Works as a standard connector

### Using Web3Modal?

If you're using `@web3modal/ethereum` or `@web3modal/react`, see our [Web3Modal Integration Guide](./WEB3MODAL_INTEGRATION.md) for a drop-in solution:

```javascript
import { w3mConnectors } from '@web3modal/ethereum';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const wagmiConfig = createConfig({
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    unicornConnector({ clientId, factoryAddress, defaultChain }), // Add this line!
  ],
});
```

That's it! Your Web3Modal now supports Unicorn wallets with zero code changes. 🎉

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

Note: debug, onConnect, and onError are optional

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
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
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
      to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
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

**v1.3.5 now supports 17 networks!** All major EVM chains are included out of the box:

### Production Mainnets (12 networks)
| Chain | Chain ID | Use Case |
|-------|----------|----------|
| Ethereum | 1 | L1 - Main network |
| Base | 8453 | L2 - Coinbase, low fees |
| Polygon | 137 | Popular sidechain |
| Arbitrum One | 42161 | L2 - Low fees |
| Optimism | 10 | L2 - Low fees |
| Gnosis Chain | 100 | Stable coin gas |
| Celo | 42220 | Mobile-first |
| Avalanche C-Chain | 43114 | Alternative L1 |
| BNB Smart Chain | 56 | Alternative L1 |
| zkSync Era | 324 | ZK Rollup |
| Scroll | 534352 | ZK Rollup |
| Zora | 7777777 | NFT-focused |

### Testnets (5 networks)
| Chain | Chain ID | Use Case |
|-------|----------|----------|
| Sepolia | 11155111 | Ethereum testnet |
| Base Sepolia | 84532 | Base testnet |
| Polygon Amoy | 80002 | Polygon testnet |
| Arbitrum Sepolia | 421614 | Arbitrum testnet |
| Optimism Sepolia | 11155420 | Optimism testnet |

### Adding to Your App

All these networks work automatically - just add them to your wagmi config:

```javascript
import { createConfig } from 'wagmi';
import { ethereum, base, polygon, avalanche, zkSync } from 'wagmi/chains';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [ethereum, base, polygon, avalanche, zkSync],
  connectors: [
    unicornConnector({
      clientId: 'your-client-id',
      factoryAddress: 'your-factory-address',
    }),
  ],
});
```

No additional configuration needed - the connector handles everything automatically!

See [Release Notes v1.3.5](./RELEASE_NOTES_v1.3.5.md) for details on the network expansion.

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

## 🎮 Interactive Demo

The [basic example](./src/examples/basic/) includes **three interactive demos** with a built-in switcher:

### 1. **UX Demo** - Product Showcase
- Beautiful RainbowKit UI
- Token balance display (all ERC-20s)
- NFT gallery with thumbnails
- Network switching (Base, Polygon, Ethereum, Gnosis)
- Perfect for stakeholder demos

### 2. **Technical Test Suite** - Developer Testing
- Comprehensive 9-test suite
- All wagmi hooks tested
- Contract interactions
- Detailed console logging
- Perfect for QA and integration testing

### 3. **Pure Wagmi** - Minimal Integration
- No RainbowKit dependency
- Standard wagmi hooks only
- Manual connector buttons
- Perfect for understanding the core integration

**Try it now:**
```bash
cd src/examples/basic
npm install --legacy-peer-deps
npm run dev
```

Visit http://localhost:3000 and use the interactive switcher to explore all three demos!

## 🧪 Testing

### Testing with Unicorn Portal (Live Preview)

AutoConnect is designed to be invoked **from within a Unicorn Portal**. The portal passes authentication to your dApp via URL parameters. To test the real Unicorn flow:

1. **Log in** to [admin.myunicornaccount.com](https://admin.myunicornaccount.com/login) (free starter account)
2. Go to **"My Community"** → **"Add an app"** → **"Add a custom dApp"**
3. Check **"Yes, I've finished the Integration"** and click **"Next"**
4. Enter your dApp URL (localhost works!), title, description, and logo
5. Click **"Live Preview"** to test with real authentication

The portal will open your dApp with valid `?walletId=inApp&authCookie=...` parameters, and `UnicornAutoConnect` will automatically connect the wallet.

See the [Testing Guide](./TESTING_GUIDE.md) for complete details.

### Test with Different Wallets

```bash
# Normal mode - Standard wallets only
http://localhost:3000

# Unicorn mode - Auto-connects Unicorn wallet (requires valid authCookie from Live Preview)
http://localhost:3000/?walletId=inApp&authCookie=eyJhbGci...
```

### Complete Test Suite

The Technical Test Suite demo includes all these tests:

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

### Signatures Show as Invalid / SIWE Verification Fails

**Note:** This is expected for smart accounts!

Smart account signatures use **ERC-1271** (on-chain verification) instead of standard ECDSA. The signatures **ARE valid** but require on-chain verification.

**For SIWE (Sign-In with Ethereum):** Use viem's `verifyMessage` on the server, which handles both EOA and smart contract wallets automatically:

```javascript
const isValid = await publicClient.verifyMessage({
  address: siweMessage.address,
  message,
  signature,
});
```

Or pass a `provider` to the `siwe` library's `.verify()` method:

```javascript
const result = await siweMessage.verify({ signature }, { provider });
```

See the [Integration Guide — SIWE section](./INTEGRATION_GUIDE.md#sign-in-with-ethereum-siwe) for complete examples.

## 🎯 Best Practices

1. ✅ **Use Standard Wagmi Hooks** - No custom wrappers needed
2. ✅ **Handle Both Wallet Types** - Test with Unicorn AND MetaMask
3. ✅ **Enable Debug Mode** - Use `debug={true}` during development
4. ✅ **Error Handling** - Always wrap async calls in try-catch
5. ✅ **Loading States** - Use `isPending` from wagmi hooks
6. ✅ **Chain Configuration** - Add all chains you support to both maps
7. ✅ **Test URL Parameters** - Test both normal and Unicorn modes

## 🌟 Next Step: Get Discovered

Once you've integrated AutoConnect, get your dApp listed in Unicorn portals to reach thousands of users!

### What are Unicorn Portals?

Portals are community-specific app directories where users discover and launch dApps with one click:
- **app.ethdenver.com** - ETHDenver community
- **app.polygon.ac** - Polygon ecosystem
- **app.mylink.fun** - MyLink community
- And many more...

### How It Works

1. 🧪 **Test locally** - Create a test community and use Live Preview
2. 🚀 **Deploy** - Push your dApp to production
3. 📝 **Submit** - Fill out the App Center submission form
4. ✅ **Get approved** - Team reviews (1-2 weeks)
5. 🎉 **Get discovered** - Users find your dApp in portals

### Get Started

See the complete [Portal Setup Guide](./PORTAL_SETUP_GUIDE.md) for:
- Creating test communities
- Using Live Preview to validate integration
- Submitting to App Center
- Getting listed in multiple portals
- Tracking portal performance

**Result:** Your dApp appears in established portals where users already browse for apps, with seamless one-click gasless onboarding. That's distribution. 🦄

## 📖 Additional Resources

- 📄 [Quick Reference](./QUICK_REFERENCE.md) - Complete API documentation
- 🚀 [Integration Guide](./INTEGRATION_GUIDE.md) - Step-by-step integration instructions
- 🔐 [SIWE Integration](./INTEGRATION_GUIDE.md#sign-in-with-ethereum-siwe) - Sign-In with Ethereum for smart accounts
- 🌐 [Web3Modal Integration](./WEB3MODAL_INTEGRATION.md) - Web3Modal v3 setup guide
- 🌐 [Portal Setup Guide](./PORTAL_SETUP_GUIDE.md) - Get your dApp listed in Unicorn portals
- 🔍 [Visual Explanation](./VISUAL-EXPLANATION.md) - Architecture diagrams
- 🔄 [Continuation Prompt](./CONTINUATION-PROMPT.md) - For development handoff
- 📋 [Release Notes v1.5.3](./RELEASE_NOTES_v1.5.3.md) - Latest release details
- 📋 [Release Notes v1.5.2](./RELEASE_NOTES_v1.5.2.md) - Prior release details
- 📋 [Changelog](./CHANGELOG.md) - Full version history
- 💬 [Discord](https://discord.gg/unicorn) - Community support
- 🐛 [Issues](https://github.com/MyUnicornAccount/autoconnect/issues) - Bug reports

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

**Built with ❤️ by [@cryptowampum](https://github.com/cryptowampum) and Claude AI**

Enhance your existing dApps without breaking anything 🦄✨
