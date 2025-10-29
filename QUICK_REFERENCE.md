# @unicorn.eth/autoconnect v1.3.0

> True zero-code integration - use standard wagmi hooks everywhere

Drop-in Unicorn wallet integration for existing web3 apps. v1.3 achieves the holy grail: **copy/paste any wagmi tutorial code and it just works** with Unicorn wallets.

## Features

- ✅ **Zero code changes** - Standard wagmi hooks work natively
- ✅ **True wagmi integration** - Unicorn is just another connector
- ✅ **No custom hooks needed** - Use `useSendTransaction`, `useSignMessage`, etc.
- ✅ **Automatic approval dialogs** - Beautiful UI for transaction confirmation
- ✅ **Gasless transactions** - Built into the connector
- ✅ **Works with RainbowKit** - Shows up in wallet list automatically
- ✅ **TypeScript support** - Full type definitions
- ✅ **Production ready** - Battle-tested pattern

## What's New in v1.3.0

### 🎯 True Wagmi Integration

**v1.2 and earlier:**
```jsx
// Had to use custom hooks
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
const tx = useUniversalTransaction();
```

**v1.3:**
```jsx
// Just use standard wagmi!
import { useSendTransaction } from 'wagmi';
const { sendTransaction } = useSendTransaction();
```

### Key Changes

- 🔌 **Native Connector** - `unicornConnector` is a proper wagmi v2 connector
- ⚡ **Provider Wrapping** - Intercepts requests for approval dialogs
- 🗺️ **Centralized Chain Config** - Single source of truth for all chains
- 🔄 **Proper State Sync** - localStorage + wagmi events for reconnection
- 🎨 **Better UX** - Approval dialogs with transaction details

**Breaking Changes:** See [Migration Guide](#migration-from-v12x) below

## Installation

```bash
npm install @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

## Quick Start

### Step 1: Add Unicorn Connector

```jsx
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet } from 'wagmi/chains';

// Create wagmi config with RainbowKit
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
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
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

### Step 2: Add Environment Variables

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

### Step 3: Use Standard Wagmi Hooks

```jsx
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';
import { parseEther } from 'viem';

function MyDapp() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();
  
  // That's it! Works with Unicorn, MetaMask, WalletConnect, etc.
  
  if (!isConnected) return <ConnectButton />;
  
  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={() => sendTransaction({
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        value: parseEther('0.001')
      })}>
        Send ETH
      </button>
      <button onClick={() => signMessage({ message: 'Hello!' })}>
        Sign Message
      </button>
    </div>
  );
}
```

**That's it!** No Unicorn-specific code needed. Copy/paste from any wagmi tutorial.

## How It Works

### The Magic: Provider Wrapping

```
User clicks "Send" → wagmi calls provider.request()
                   ↓
            unicornConnector intercepts
                   ↓
         Shows approval dialog 📱
                   ↓
         User approves/rejects
                   ↓
       Executes via Thirdweb (gasless)
                   ↓
        Returns result to wagmi
                   ↓
           Your code continues
```

**Key insight:** We wrap `provider.request()` to intercept specific methods (`eth_sendTransaction`, `eth_sign`, etc.) while letting everything else pass through normally.

### Supported Networks

All chains configured in `THIRDWEB_CHAIN_MAP`:

- ✅ Base (8453)
- ✅ Polygon (137)
- ✅ Ethereum Mainnet (1)
- ✅ Arbitrum (42161)
- ✅ Optimism (10)
- ✅ Sepolia (11155111)
- ✅ Base Sepolia (84532)

Add more chains by updating the map in `unicornConnector.js`.

## Standard Wagmi Hooks

All standard wagmi hooks work with Unicorn wallets:

### useAccount

```jsx
import { useAccount } from 'wagmi';

function Profile() {
  const { address, isConnected, connector } = useAccount();
  
  return (
    <div>
      {isConnected ? (
        <>
          <p>Address: {address}</p>
          <p>Connector: {connector?.name}</p>
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
```

### useSendTransaction

```jsx
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

function SendETH() {
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  
  return (
    <button 
      onClick={() => sendTransaction({
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        value: parseEther('0.001')
      })}
      disabled={isPending}
    >
      {isPending ? 'Sending...' : 'Send 0.001 ETH'}
    </button>
  );
}
```

### useWriteContract

```jsx
import { useWriteContract } from 'wagmi';

function TransferToken() {
  const { writeContract } = useWriteContract();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const ERC20_ABI = [{
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
  }];
  
  return (
    <button onClick={() => writeContract({
      address: USDC,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: ['0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 1000000]
    })}>
      Send 1 USDC
    </button>
  );
}
```

### useSignMessage

```jsx
import { useSignMessage } from 'wagmi';

function SignMessage() {
  const { signMessage, data: signature } = useSignMessage();
  
  return (
    <div>
      <button onClick={() => signMessage({ message: 'Hello World!' })}>
        Sign Message
      </button>
      {signature && <p>Signature: {signature.slice(0, 20)}...</p>}
    </div>
  );
}
```

### useSignTypedData

```jsx
import { useSignTypedData } from 'wagmi';

function SignTypedData() {
  const { signTypedData } = useSignTypedData();
  
  const domain = {
    name: 'My dApp',
    version: '1',
    chainId: 8453,
    verifyingContract: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  };
  
  const types = {
    Message: [
      { name: 'content', type: 'string' }
    ]
  };
  
  const message = {
    content: 'Hello, World!'
  };
  
  return (
    <button onClick={() => signTypedData({ domain, types, message, primaryType: 'Message' })}>
      Sign Typed Data
    </button>
  );
}
```

### useReadContract

```jsx
import { useReadContract } from 'wagmi';

function TokenBalance() {
  const { address } = useAccount();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const ERC20_ABI = [{
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  }];
  
  const { data: balance } = useReadContract({
    address: USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  });
  
  return <p>Balance: {balance?.toString()} USDC</p>;
}
```

### useSwitchChain

```jsx
import { useSwitchChain } from 'wagmi';
import { base, polygon } from 'wagmi/chains';

function ChainSwitcher() {
  const { switchChain } = useSwitchChain();
  
  return (
    <div>
      <button onClick={() => switchChain({ chainId: base.id })}>
        Switch to Base
      </button>
      <button onClick={() => switchChain({ chainId: polygon.id })}>
        Switch to Polygon
      </button>
    </div>
  );
}
```

### useWatchAsset

```jsx
import { useWatchAsset } from 'wagmi';

function AddToken() {
  const { watchAsset } = useWatchAsset();
  
  return (
    <button onClick={() => watchAsset({
      type: 'ERC20',
      options: {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'USDC',
        decimals: 6,
      }
    })}>
      Add USDC to Wallet
    </button>
  );
}
```

## Configuration

### unicornConnector Options

```typescript
interface UnicornConnectorOptions {
  // Required: Your Thirdweb client ID
  clientId: string;
  
  // Required: Smart account factory address
  factoryAddress: string;
  
  // Optional: Default chain (default: 'base')
  defaultChain?: 'base' | 'polygon' | 'ethereum' | 'arbitrum' | 'optimism';
  
  // Optional: Enable debug logging (default: false)
  debug?: boolean;
}
```

### Full Configuration Example

```jsx
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet, arbitrum, optimism } from 'wagmi/chains';

config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet, arbitrum, optimism],

      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
      debug: process.env.NODE_ENV === 'development',

  })
);
```

## Auto-Connect Component

For automatic connection via URL parameters:

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UnicornAutoConnect 
            onSuccess={() => console.log('Auto-connected!')}
            onError={(err) => console.error('Auto-connect failed:', err)}
          />
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**URL format:**
```
https://yourapp.com/?walletId=inApp&authCookie=YOUR_AUTH_COOKIE
```

## Migration from v1.2.x

### Breaking Changes

v1.3 removes custom hooks in favor of standard wagmi hooks:

**v1.2.x (OLD):**
```jsx
import { useUniversalTransaction, useUniversalSignMessage } from '@unicorn.eth/autoconnect';

const tx = useUniversalTransaction();
const sign = useUniversalSignMessage();

await tx.sendTransactionAsync({ to, value });
await sign.signMessageAsync({ message });
```

**v1.3.0 (NEW):**
```jsx
import { useSendTransaction, useSignMessage } from 'wagmi';

const { sendTransaction } = useSendTransaction();
const { signMessage } = useSignMessage();

await sendTransaction({ to, value });
await signMessage({ message });
```

### Migration Steps

1. **Update package:**
   ```bash
   npm install @unicorn.eth/autoconnect@1.3.0
   ```

2. **Replace custom hooks with wagmi hooks:**
   - `useUniversalTransaction` → `useSendTransaction`, `useWriteContract`
   - `useUniversalSignMessage` → `useSignMessage`, `useSignTypedData`
   - `useUniversalWallet` → `useAccount`

3. **Update imports:**
   ```jsx
   // Remove these
   import { useUniversalTransaction, useUniversalSignMessage, useUniversalWallet } from '@unicorn.eth/autoconnect';
   
   // Add these
   import { useAccount, useSendTransaction, useWriteContract, useSignMessage } from 'wagmi';
   ```

4. **Update method calls:**
   ```jsx
   // OLD
   await tx.sendTransactionAsync({ to, value });
   
   // NEW
   await sendTransaction({ to, value });
   ```

5. **Test with both Unicorn and standard wallets**

See [MIGRATION_GUIDE_v1.2_to_v1.3.md](./docs/MIGRATION_GUIDE_v1.2_to_v1.3.md) for detailed examples.

## Architecture

### Core Components

1. **unicornConnector.js** (300 lines)
   - Wagmi v2 connector implementation
   - Provider request interceptor
   - Chain configuration map
   - Approval dialog integration

2. **UnicornAutoConnect.jsx** (150 lines)
   - URL parameter detection
   - Automatic connection via wagmi
   - Zero UI component

3. **UnicornTransactionApproval.jsx** (350 lines)
   - Beautiful approval dialog
   - Transaction details display
   - Message/TypedData formatting
   - Responsive design

### How Provider Wrapping Works

```javascript
// Wrap the provider's request method
const wrappedRequest = async (args) => {
  const { method, params } = args;
  
  // Intercept specific methods
  if (method === 'eth_sendTransaction') {
    // Show approval dialog
    const approved = await showApprovalDialog(params[0]);
    if (!approved) throw new Error('User rejected');
    
    // Execute via Thirdweb (gasless)
    const result = await this.wallet.sendTransaction(params[0]);
    return result.transactionHash;
  }
  
  // Pass through everything else
  return this.originalRequest(args);
};
```

## Troubleshooting

### Connector Not Appearing in RainbowKit

**Problem:** Unicorn doesn't show in wallet list

**Solution:** Make sure you're pushing the connector to the config:
```jsx
config.connectors.push(unicornConnector({ ... }));
```

### "Cannot read properties of undefined (reading 'subscribe')"

**Problem:** Provider missing subscribe method

**Solution:** Update to v1.3.0 - we added proper subscribe/unsubscribe methods

### Auto-Connect Not Working

**Problem:** URL has authCookie but connection fails

**Solution:** Check these:
1. AuthCookie is valid (not expired)
2. ClientId and factoryAddress are correct
3. Check console for error messages
4. Try clearing localStorage and reconnecting

### Wagmi Hooks Show Disconnected

**Problem:** Connector connects but hooks show disconnected

**Solution:** This was fixed in v1.3.0 by properly setting localStorage entries and emitting wagmi events

## Best Practices

1. **Use Standard Wagmi Hooks** - No need for custom hooks anymore
2. **Test Both Wallet Types** - Test with Unicorn AND MetaMask
3. **Handle Errors** - Always wrap in try-catch
4. **Loading States** - Use `isPending` from hooks
5. **Chain Validation** - Ensure user is on correct chain
6. **Debug Mode** - Enable during development: `debug: true`

## Resources

- **NPM Package**: [@unicorn.eth/autoconnect](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
- **GitHub**: [Source Code](https://github.com/unicorn-eth/autoconnect)
- **Examples**: [Test App](./examples/basic/)
- **Wagmi Docs**: [wagmi.sh](https://wagmi.sh)

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/unicorn-eth/autoconnect/issues)
- 📧 **Email**: support@unicorn.eth

## License

MIT © Unicorn.eth

---

**v1.3: True Zero-Code Integration** 🦄✨

Copy from any wagmi tutorial. It just works.