# @unicorn/autoconnect - Quick Reference

> **One-page guide for developers integrating Unicorn AutoConnect**

## 🚀 Installation

```bash
npm install @unicorn/autoconnect
# or
yarn add @unicorn/autoconnect
# or
pnpm add @unicorn/autoconnect
```

## ⚡ Quick Setup (2 minutes)

### 1. Add to your App

```jsx
import { UnicornAutoConnect } from '@unicorn/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <YourApp />
        
        {/* Add this one line */}
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

### 2. Update your components

```jsx
// Before:
import { useAccount } from 'wagmi';
const { address, isConnected } = useAccount();

// After:
import { useUniversalWallet } from '@unicorn/autoconnect';
const wallet = useUniversalWallet();
```

### 3. Environment Variables

```env
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

**Done!** Your app now supports Unicorn AutoConnect.

---

## 📖 API Reference

### UnicornAutoConnect Component

```tsx
<UnicornAutoConnect
  clientId="required"           // Your Thirdweb client ID
  factoryAddress="required"     // Smart account factory address
  defaultChain="base"           // Optional: 'base' | 'polygon' | 'ethereum' | 'arbitrum' | 'optimism'
  timeout={5000}                // Optional: Connection timeout (ms)
  debug={false}                 // Optional: Enable debug logging
  onConnect={(wallet) => {}}    // Optional: Success callback
  onError={(error) => {}}       // Optional: Error callback
/>
```

### useUniversalWallet Hook

```tsx
const wallet = useUniversalWallet();

// Properties:
wallet.isConnected    // boolean - Any wallet connected?
wallet.address        // string - Connected address
wallet.connector      // object - Wallet connector info
wallet.isUnicorn      // boolean - Using Unicorn? (gasless)
wallet.isStandard     // boolean - Using standard wallet?
wallet.disconnect()   // function - Disconnect wallet

// Advanced:
wallet.wagmiAccount   // Raw Wagmi account object
wallet.unicornWallet  // Raw Unicorn wallet object
```

### Utility Functions

```tsx
import { isUnicornEnvironment, getUnicornAuthCookie } from '@unicorn/autoconnect';

// Check if running in Unicorn portal
if (isUnicornEnvironment()) {
  console.log('Running in Unicorn mode');
}

// Get auth cookie from URL
const authCookie = getUnicornAuthCookie();
```

---

## 💡 Common Use Cases

### Basic Wallet Connection

```jsx
import { useUniversalWallet } from '@unicorn/autoconnect';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function MyComponent() {
  const wallet = useUniversalWallet();
  
  if (!wallet.isConnected) {
    return <ConnectButton />;
  }
  
  return (
    <div>
      <p>Connected: {wallet.address}</p>
      {wallet.isUnicorn && <p>⚡ Gasless enabled</p>}
    </div>
  );
}
```

### Handling Transactions

```jsx
import { useUniversalWallet } from '@unicorn/autoconnect';
import { useSendTransaction } from 'wagmi';

function TransactionButton() {
  const wallet = useUniversalWallet();
  const { sendTransaction } = useSendTransaction();
  
  const handleClick = async () => {
    const tx = { to: '0x...', value: parseEther('0.01') };
    
    if (wallet.isUnicorn) {
      // Gasless transaction via Unicorn
      await wallet.unicornWallet.sendTransaction(tx);
    } else {
      // Standard transaction (requires gas)
      await sendTransaction(tx);
    }
  };
  
  return (
    <button onClick={handleClick}>
      {wallet.isUnicorn ? 'Send (Gasless)' : 'Send (Gas Required)'}
    </button>
  );
}
```

### Multi-Chain Support

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="polygon"  // Switch to Polygon
/>
```

Supported chains:
- `base` - Base (default)
- `polygon` - Polygon
- `ethereum` - Ethereum mainnet
- `arbitrum` - Arbitrum
- `optimism` - Optimism

### Debug Mode

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  debug={true}  // Enable debug logging
  onConnect={(wallet) => {
    console.log('Connected:', wallet);
  }}
  onError={(error) => {
    console.error('Failed:', error);
  }}
/>
```

### Conditional Features

```jsx
function FeatureButton() {
  const wallet = useUniversalWallet();
  
  return (
    <button disabled={!wallet.isConnected}>
      {wallet.isUnicorn && '⚡ '}
      Execute Action
      {!wallet.isConnected && ' (Connect First)'}
    </button>
  );
}
```

---

## 🧪 Testing

### Test Normal Mode
```
http://localhost:3000
```
- Your existing wallet connections should work normally
- Connect with MetaMask, Rainbow, etc.
- Real transactions with gas

### Test Unicorn Mode
```
http://localhost:3000/?walletId=inApp&authCookie=test
```
- AutoConnect should attempt in background
- If successful: Unicorn wallet connects
- Gasless transactions available

---

## 🐛 Troubleshooting

### AutoConnect not running?
✅ Check URL has `?walletId=inApp&authCookie=...`
✅ Verify environment variables are set
✅ Enable debug mode to see logs

### React warnings?
✅ Update to latest version
✅ Make sure using isolated root pattern
✅ Check for conflicting providers

### TypeScript errors?
✅ Restart TypeScript server
✅ Check `@unicorn/autoconnect` is installed
✅ Import types: `import type { UniversalWallet } from '@unicorn/autoconnect'`

### Transactions not working?
✅ **Unicorn**: Check Thirdweb configuration
✅ **Standard**: Use Wagmi's `useSendTransaction` hook
✅ Check wallet is actually connected

---

## 📚 Resources

- **NPM**: https://www.npmjs.com/package/@unicorn/autoconnect
- **GitHub**: https://github.com/MyUnicornAccount/autoconnect
- **Issues**: https://github.com/MyUnicornAccount/autoconnect/issues
- **Discord**: https://discord.gg/unicorn

---

## 📦 Package Info

- **Size**: ~10-20 KB (minified)
- **Dependencies**: React 18+, Wagmi 2+, Thirdweb 5+
- **License**: MIT
- **TypeScript**: Full type definitions included

---

## 🔄 Migration from Manual Files

```bash
# 1. Install package
npm install @unicorn/autoconnect

# 2. Update imports
# From: import ... from './components/UnicornAutoConnect'
# To:   import { ... } from '@unicorn/autoconnect'

# 3. Delete old files
rm src/components/UnicornAutoConnect.jsx
rm src/hooks/useUniversalWallet.js

# 4. Test
npm run dev
```

See `examples/migration/` for detailed guide.

---

## ⚡ Pro Tips

1. **Always check wallet.isConnected** before transactions
2. **Use wallet.isUnicorn** to show gasless UI indicators
3. **Enable debug mode** during development
4. **Test both wallet types** before deploying
5. **Keep environment variables secure**

---

## 🎯 Example Projects

- **Basic**: Minimal integration
- **Advanced**: All features (multi-chain, callbacks, etc.)
- **Migration**: Upgrading from manual files

See `examples/` directory in GitHub repo.

---

**Need help?** Open an issue or join our Discord! 🦄