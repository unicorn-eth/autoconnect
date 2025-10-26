# Unicorn AutoConnect v1.2 - CORRECT Integration Guide

## ✅ v1.2 Uses Wagmi Connector Approach

In v1.2, we moved from a component-based approach to a **wagmi connector** for better integration.

## Installation

```bash
npm install @unicorn.eth/autoconnect@1.2.0
# or
pnpm add @unicorn.eth/autoconnect@1.2.0
```

## Integration Steps

### Step 1: Add Unicorn Connector to Wagmi Config

```typescript
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [polygon, base],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_WC_PROJECT_ID' }),
    // Add Unicorn connector
    unicornConnector({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: polygon.id, // Chain ID as number (e.g., 137)
    }),
  ],
  transports: {
    [polygon.id]: http(),
    [base.id]: http(),
  },
});
```

**Key Points:**
- ✅ `unicornConnector` is a function that creates a wagmi connector
- ✅ `defaultChain` is a **number** (chain ID), not a string
- ✅ Works alongside other connectors (MetaMask, WalletConnect, etc.)
- ✅ No component needed!

### Step 2: Use Universal Hooks in Components

```typescript
import { 
  useUniversalWallet,
  useUniversalTransaction,
  useUniversalSignMessage 
} from '@unicorn.eth/autoconnect';

function MyComponent() {
  const wallet = useUniversalWallet();
  const { sendTransaction, isPending } = useUniversalTransaction();
  const { signMessage } = useUniversalSignMessage();

  const handleSend = async () => {
    await sendTransaction({
      to: '0x...',
      value: '0.1', // in ETH
    });
  };

  return (
    <div>
      <p>Address: {wallet.address}</p>
      <p>Type: {wallet.isUnicorn ? '🦄 Unicorn' : '👛 Standard'}</p>
      <button onClick={handleSend} disabled={isPending}>
        Send Transaction
      </button>
    </div>
  );
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0xYourFactoryAddress
```

## Complete Example

```typescript
// config/wagmi.ts
import { createConfig, http } from 'wagmi';
import { polygon, base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { unicornConnector } from '@unicorn.eth/autoconnect';

export const wagmiConfig = createConfig({
  chains: [polygon, base],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID 
    }),
    unicornConnector({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS!,
      defaultChain: polygon.id, // 137
    }),
  ],
  transports: {
    [polygon.id]: http(),
    [base.id]: http(),
  },
});
```

```typescript
// App.tsx
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/wagmi';

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

```typescript
// components/SendTransaction.tsx
import { 
  useUniversalWallet,
  useUniversalTransaction 
} from '@unicorn.eth/autoconnect';

export function SendTransaction() {
  const wallet = useUniversalWallet();
  const { sendTransaction, isPending, error } = useUniversalTransaction();

  const handleSend = async () => {
    try {
      const result = await sendTransaction({
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        value: '0.01',
      });
      console.log('Transaction sent:', result);
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  if (!wallet.isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div>
      <p>Connected: {wallet.address}</p>
      {wallet.isUnicorn && <p>⚡ Gasless enabled</p>}
      
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send 0.01 ETH'}
      </button>
      
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## API Reference

### unicornConnector(options)

Creates a wagmi connector for Unicorn wallets.

**Options:**
```typescript
{
  clientId: string;         // Required: Thirdweb client ID
  factoryAddress: string;   // Required: Smart account factory address  
  defaultChain: number;     // Required: Default chain ID (e.g., 137)
}
```

### useUniversalWallet()

Returns unified wallet information for both Unicorn and standard wallets.

```typescript
{
  address: string | undefined;
  isConnected: boolean;
  isUnicorn: boolean;       // true if Unicorn wallet
  chainId: number | undefined;
  connector: { name: string; id: string } | null;
  unicornWallet: any;       // Raw Thirdweb wallet (if Unicorn)
}
```

### useUniversalTransaction()

Unified transaction interface.

```typescript
{
  sendTransaction: (params) => Promise<any>;
  writeContract: (params) => Promise<any>;
  readContract: (params) => Promise<any>;
  isPending: boolean;
  error: Error | null;
}
```

### useUniversalSignMessage()

Unified signing interface.

```typescript
{
  signMessage: (params) => Promise<string>;
  signTypedData: (params) => Promise<string>;
  verifyMessage: (params) => Promise<VerificationResult>;
  isPending: boolean;
  error: Error | null;
  signature: string | null;
}
```

## Migration from v1.1 Component Approach

If you were using the component approach:

**Before (v1.1):**
```jsx
<UnicornAutoConnect
  clientId={...}
  factoryAddress={...}
  defaultChain="polygon"
/>
```

**After (v1.2):**
```typescript
// In wagmi config
unicornConnector({
  clientId: ...,
  factoryAddress: ...,
  defaultChain: 137, // Number, not string!
})
```

## Why Connector Approach is Better

1. ✅ **Native wagmi integration** - Works like any other connector
2. ✅ **Better TypeScript support** - Full type safety
3. ✅ **Simpler setup** - No extra components needed
4. ✅ **Standard patterns** - Follows wagmi conventions
5. ✅ **Easier testing** - Standard wagmi testing approaches work

## Troubleshooting

### "unicornConnector is not a function"
- Make sure you're using v1.2.0+
- Check that you're importing from the correct package

### Transactions not working
- Verify environment variables are set
- Check that defaultChain matches one of your configured chains
- Ensure Thirdweb factory address is correct

### TypeScript errors
- Update to latest @unicorn.eth/autoconnect
- Ensure wagmi v2+ and viem v2+ are installed

---

**v1.2 uses the connector approach - no component needed!** 🎉