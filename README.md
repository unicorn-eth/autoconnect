# @unicorn.eth/autoconnect

> Add Unicorn AutoConnect to your dApp in 2 minutes - zero breaking changes

Drop-in Unicorn wallet integration for existing web3 apps. Works alongside your existing wallet setup (RainbowKit, Wagmi, etc.) without modifying any code.

## Features

- ✅ **Zero breaking changes** - existing wallets keep working
- ✅ **2-minute setup** - just import and configure
- ✅ **Unified interface** - one hook for all wallet types
- ✅ **Gasless transactions** - automatic for Unicorn users
- ✅ **TypeScript support** - full type definitions
- ✅ **Production ready** - battle-tested isolation pattern

## Installation

```bash
npm install @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

## Quick Start

### 1. Add to your App component

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <YourExistingApp />
        
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

### 2. Update your components (optional but recommended)

```jsx
// Before:
import { useAccount } from 'wagmi';
const { address, isConnected } = useAccount();

// After:
import { useUniversalWallet } from '@unicorn.eth/autoconnect';
const wallet = useUniversalWallet();
// Now works with both Unicorn and standard wallets!
```

### 3. Add environment variables

```bash
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

**That's it!** Your app now supports Unicorn AutoConnect.

## Configuration

### UnicornAutoConnect Props

```typescript
interface UnicornAutoConnectProps {
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
  
  // Optional: Callback when wallet connects
  onConnect?: (wallet: any) => void;
  
  // Optional: Callback when connection fails
  onError?: (error: Error) => void;
}
```

### Usage Example with All Options

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="polygon"
  timeout={10000}
  debug={true}
  onConnect={(wallet) => {
    console.log('Unicorn connected!', wallet);
  }}
  onError={(error) => {
    console.log('AutoConnect failed, but other wallets still work');
  }}
/>
```

## useUniversalWallet Hook

The `useUniversalWallet` hook provides a unified interface for both Unicorn and standard wallets.

```typescript
interface UniversalWallet {
  // Connection state
  isConnected: boolean;
  address: string | undefined;
  
  // Wallet info
  connector: { name: string; id: string } | null;
  isUnicorn: boolean;    // True if using Unicorn (gasless)
  isStandard: boolean;   // True if using standard wallet
  
  // Raw wallet objects
  wagmiAccount: Account;
  unicornWallet: any;
  
  // Methods
  disconnect: () => void;
}
```

### Example Usage

```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';
import { useSendTransaction } from 'wagmi';

function MyComponent() {
  const wallet = useUniversalWallet();
  const { sendTransaction } = useSendTransaction();
  
  const handleTransaction = async () => {
    if (!wallet.isConnected) {
      alert('Please connect wallet');
      return;
    }
    
    const tx = {
      to: '0x...',
      value: parseEther('0.01'),
    };
    
    if (wallet.isUnicorn) {
      // Unicorn wallet - gasless
      await wallet.unicornWallet.sendTransaction(tx);
    } else {
      // Standard wallet - requires gas
      await sendTransaction(tx);
    }
  };
  
  return (
    <div>
      {wallet.isConnected ? (
        <div>
          <p>Connected: {wallet.address}</p>
          {wallet.isUnicorn && <p>⚡ Gasless enabled</p>}
          <button onClick={handleTransaction}>
            Send Transaction
          </button>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
```

## How It Works

### Isolated React Root Pattern

The package uses an **isolated React root** to avoid conflicts:

1. Creates a separate React tree for Thirdweb providers
2. Communicates via custom events (no React state conflicts)
3. Zero interference with existing wallet providers
4. No React warnings or errors

### Environment Detection

AutoConnect only runs when accessed via Unicorn portal:

```
Normal: https://yourapp.com
Unicorn: https://yourapp.com/?walletId=inApp&authCookie=...
```

In normal mode, your existing wallets work exactly as before.

## Testing

### Test Normal Mode
```
http://localhost:3000
```
Expected: Existing wallet connections work normally

### Test Unicorn Mode
```
http://localhost:3000/?walletId=inApp&authCookie=test
```
Expected: AutoConnect attempts in background

## Migration Guide

### From Manual Integration

If you previously copied the files manually:

```jsx
// Remove these files:
// - src/components/UnicornAutoConnect.jsx
// - src/hooks/useUniversalWallet.js

// Install package instead:
npm install @unicorn.eth/autoconnect

// Update imports:
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';

// Everything else stays the same!
```

## Peer Dependencies

This package requires:
- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `thirdweb` >= 5.60.0
- `wagmi` >= 2.0.0

These should already be in your project.

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { UniversalWallet, UnicornConfig } from '@unicorn.eth/autoconnect';
```

## Troubleshooting

### AutoConnect not running?
Check URL parameters - must have `?walletId=inApp&authCookie=...`

### React warnings?
The isolated root pattern should prevent these. If you see warnings, please open an issue.

### Transactions not working?
- **Unicorn**: Check Thirdweb configuration
- **Standard**: Use Wagmi's `useSendTransaction` hook

## Support

- **GitHub Issues**: [Report bugs](https://github.com/MyUnicornAccount/autoconnect/issues)
- **Discord**: [Join #developers](https://discord.gg/unicorn)
- **Docs**: [Full documentation](https://docs.unicorn.eth)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License - see [LICENSE](LICENSE)

---

**Built by Unicorn.eth - Enhance existing apps without breaking anything.**
