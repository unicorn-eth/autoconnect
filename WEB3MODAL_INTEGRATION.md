# Web3Modal v3 Integration Guide

> Drop-in Unicorn wallet support for Web3Modal v3 + wagmi v2 projects

## Overview

Web3Modal v3 uses wagmi v2 underneath, so the `unicornConnector` works seamlessly! This guide shows you how to add Unicorn wallet support to your Web3Modal project with minimal code changes.

## Quick Start

### Installation

```bash
npm install @unicorn.eth/autoconnect @web3modal/wagmi @tanstack/react-query wagmi viem
```

### Basic Integration

```javascript
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon, arbitrum, optimism } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';

// 1. Get your IDs
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';
const clientId = 'YOUR_THIRDWEB_CLIENT_ID';
const factoryAddress = '0xD771615c873ba5a2149D5312448cE01D677Ee48A';

// 2. Configure chains
const chains = [base, polygon, arbitrum, optimism];

// 3. Create wagmi config with Unicorn connector
const wagmiConfig = createConfig({
  chains,
  connectors: [
    walletConnect({ projectId }),
    injected(),
    coinbaseWallet({ appName: 'My dApp' }),

    // Add Unicorn connector for gasless transactions
    unicornConnector({
      clientId,
      factoryAddress,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});

// 4. Create Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
});

// 5. Create query client
const queryClient = new QueryClient();

// 6. App component
export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Auto-connect for URL-based connection */}
        <UnicornAutoConnect debug={true} />

        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Auto-Connection via URL

The `UnicornAutoConnect` component enables URL-based wallet connection from Unicorn Portals:

```javascript
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <UnicornAutoConnect
          debug={true}
          onConnect={(wallet) => console.log('Connected!', wallet)}
          onError={(error) => console.error('Error:', error)}
        />
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

Users can connect via URL:
```
https://yourapp.com/?walletId=inApp&authCookie=xxx
```

## Using Standard Wagmi Hooks

Once integrated, use standard wagmi v2 hooks - they work with both Web3Modal wallets AND Unicorn:

```javascript
import { useAccount, useSendTransaction, useSignMessage, useSwitchChain } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { parseEther } from 'viem';

function YourComponent() {
  const { open } = useWeb3Modal();
  const { address, isConnected, connector, chain } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const { signMessage } = useSignMessage();
  const { switchChain } = useSwitchChain();

  const handleSend = () => {
    sendTransaction({
      to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
      value: parseEther('0.001'),
    });
  };

  const handleSign = () => {
    signMessage({ message: 'Hello Web3!' });
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => open()}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <p>Connector: {connector?.name}</p>
          <p>Network: {chain?.name}</p>
          <button onClick={handleSend} disabled={isPending}>
            {isPending ? 'Sending...' : 'Send ETH'}
          </button>
          <button onClick={handleSign}>Sign Message</button>
          <button onClick={() => switchChain({ chainId: 137 })}>
            Switch to Polygon
          </button>
        </>
      )}
    </div>
  );
}
```

## Environment Variables

Add these to your `.env` file:

```bash
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Thirdweb Client ID (get from https://thirdweb.com/dashboard)
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Smart Account Factory Address (use this for production)
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

## Configuration Options

### unicornConnector Options

```typescript
{
  clientId: string;          // Required: Thirdweb client ID
  factoryAddress: string;    // Required: Smart account factory address
  defaultChain: number;      // Required: Default chain ID (e.g., 8453 for Base)
  icon?: string;             // Optional: Custom wallet icon URL
}
```

### UnicornAutoConnect Options

```typescript
{
  debug?: boolean;                    // Optional: Enable debug logging
  onConnect?: (wallet) => void;       // Optional: Called when wallet connects
  onError?: (error) => void;          // Optional: Called on connection error
}
```

## Supported Networks

All 17 networks are supported out of the box:

**Mainnets:** Ethereum, Base, Polygon, Arbitrum, Optimism, Gnosis, Celo, Avalanche, BNB Chain, zkSync, Scroll, Zora

**Testnets:** Sepolia, Base Sepolia, Polygon Amoy, Arbitrum Sepolia, Optimism Sepolia

## Features

### ✅ Works With All Web3Modal Features

- Standard wallet connection modal
- Account modal and management
- Network switching
- Wallet connection persistence

### ✅ Unicorn-Specific Features

- **Gasless Transactions** - Smart account with sponsored gas
- **Auto-Connection** - URL-based wallet connection from Unicorn Portals
- **Approval Dialogs** - Beautiful UI for transaction confirmation
- **Multi-Chain Support** - Seamless switching between 17+ networks

### ✅ Standard Wagmi v2 Hooks

Your existing wagmi hooks continue to work:
- `useSendTransaction`
- `useWriteContract`
- `useSignMessage`
- `useSignTypedData`
- `useSwitchChain`
- All other wagmi v2 hooks!

## Migration from Web3Modal v2

If you're upgrading from Web3Modal v2 (wagmi v1):

**Before (v2):**
```javascript
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
```

**After (v3):**
```javascript
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { walletConnect, injected } from 'wagmi/connectors';
```

Key changes:
- `WagmiConfig` → `WagmiProvider`
- `configureChains` → `transports` in config
- `w3mConnectors` → individual connectors (`walletConnect`, `injected`, etc.)
- `EthereumClient` + `Web3Modal` component → `createWeb3Modal()` function
- Add `QueryClientProvider` for React Query

## Troubleshooting

### Wallet doesn't appear

Make sure all connectors are in the `connectors` array and the config is passed to `createWeb3Modal`.

### Auto-connect not working

Make sure:
1. `UnicornAutoConnect` is inside `WagmiProvider` and `QueryClientProvider`
2. URL parameters are correct: `?walletId=inApp&authCookie=xxx`
3. Debug mode is enabled to see logs

### Network switching issues

Ensure all chains have transports configured:
```javascript
transports: {
  [base.id]: http(),
  [polygon.id]: http(),
  // ... all your chains
},
```

## Example Project

See the full working example at `src/examples/web3modal/` in this repository.

## Resources

- [Main README](./README.md) - Full documentation
- [Quick Reference](./QUICK_REFERENCE.md) - API reference
- [Testing Guide](./TESTING_GUIDE.md) - How to test with Live Preview
- [Wagmi v2 Docs](https://wagmi.sh) - Wagmi documentation
- [Web3Modal v3 Docs](https://docs.walletconnect.com/web3modal/about) - Web3Modal documentation

## Support

- GitHub Issues: [Report a bug](https://github.com/unicorn-eth/autoconnect/issues)
- Discord: [Join our community](https://discord.gg/unicorn)

---

**Built with ❤️ by the Unicorn team**

Zero-code Web3Modal integration for Unicorn wallets 🦄✨
