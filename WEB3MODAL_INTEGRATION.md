# Web3Modal v2 Integration Guide

> Drop-in Unicorn wallet support for @web3modal/ethereum v2.7+ projects

## Overview

Since **@web3modal/ethereum v2.7 uses wagmi underneath**, the existing `unicornConnector` works seamlessly with Web3Modal! This guide shows you how to add Unicorn wallet support to your Web3Modal project with minimal code changes.

## Quick Start

### Installation

```bash
npm install @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

### Basic Integration (Zero Code Changes)

**Option 1: Using the helper function (Easiest)**

```javascript
import { createWeb3ModalConfig } from '@unicorn.eth/autoconnect/web3modal';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';
import { base, polygon } from 'wagmi/chains';

// Create config with Unicorn included
const { wagmiConfig, ethereumClient } = await createWeb3ModalConfig({
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
  factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
  defaultChain: 8453, // Base
  chains: [base, polygon],
});

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <YourApp />
      </WagmiConfig>

      <Web3Modal
        projectId="YOUR_WALLETCONNECT_PROJECT_ID"
        ethereumClient={ethereumClient}
      />
    </>
  );
}
```

**Option 2: Manual integration (More control)**

```javascript
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, polygon } from 'wagmi/chains';
import { unicornConnector } from '@unicorn.eth/autoconnect';

// Configure chains
const chains = [base, polygon];
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

const { publicClient } = configureChains(
  chains,
  [w3mProvider({ projectId })]
);

// Create wagmi config with Unicorn connector
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ projectId, chains }),

    // Add Unicorn connector
    unicornConnector({
      clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: 8453,
    }),
  ],
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <YourApp />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
```

## Auto-Connection via URL

Add the `UnicornAutoConnect` component to enable URL-based wallet connection:

```javascript
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';
import { useWeb3Modal } from '@web3modal/react';

function App() {
  const { open } = useWeb3Modal();

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {/* Add this for URL-based auto-connection */}
        <UnicornAutoConnect
          debug={true}
          onConnect={(wallet) => console.log('Unicorn connected!', wallet)}
          onError={(error) => console.error('Connection error:', error)}
        />

        <YourApp />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
```

Now users can connect via URL:
```
https://yourapp.com/?walletId=inApp&authCookie=xxx
```

## Using Standard Wagmi Hooks

Once integrated, use standard wagmi hooks - they work with both Web3Modal wallets AND Unicorn:

```javascript
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';
import { parseEther } from 'viem';

function YourComponent() {
  const { address, isConnected, connector } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();

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
      {isConnected && (
        <>
          <p>Connected: {address}</p>
          <p>Connector: {connector?.name}</p>
          <button onClick={handleSend}>Send ETH</button>
          <button onClick={handleSign}>Sign Message</button>
        </>
      )}
    </div>
  );
}
```

## Complete Example

Here's a full working example:

```javascript
// app.jsx
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, polygon, arbitrum } from 'wagmi/chains';
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

// 1. Configure chains
const chains = [base, polygon, arbitrum];
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID;

const { publicClient } = configureChains(
  chains,
  [w3mProvider({ projectId })]
);

// 2. Create wagmi config with Unicorn
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    unicornConnector({
      clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: 8453,
    }),
  ],
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

// 3. Your app component
function MyDApp() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  return (
    <div>
      <h1>My dApp</h1>
      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={() => sendTransaction({
            to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
            value: parseEther('0.01'),
          })}>
            Send 0.01 ETH
          </button>
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}

// 4. Root component with providers
export default function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <UnicornAutoConnect debug={true} />
        <MyDApp />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
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
  icon?: string;            // Optional: Custom wallet icon URL
}
```

### UnicornAutoConnect Options

```typescript
{
  debug?: boolean;          // Optional: Enable debug logging
  onConnect?: (wallet) => void;  // Optional: Called when wallet connects
  onError?: (error) => void;     // Optional: Called on connection error
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
- Transaction history
- Wallet connection persistence

### ✅ Unicorn-Specific Features

- **Gasless Transactions** - Smart account with sponsored gas
- **Auto-Connection** - URL-based wallet connection
- **Approval Dialogs** - Beautiful UI for transaction confirmation
- **Multi-Chain Support** - Seamless switching between 17+ networks

### ✅ Zero Code Changes

Your existing wagmi hooks continue to work:
- `useSendTransaction`
- `useWriteContract`
- `useSignMessage`
- `useSignTypedData`
- `useSwitchChain`
- All other wagmi hooks!

## Differences from Pure Wagmi Integration

The Web3Modal integration is **identical** to the pure wagmi integration, with one addition:

1. You include `w3mConnectors` alongside `unicornConnector`
2. You wrap your app with Web3Modal's UI components
3. Everything else works the same!

```javascript
// Pure Wagmi (from our main README)
connectors: [
  injected(),
  walletConnect({ projectId }),
  unicornConnector({ ... }),
]

// Web3Modal (this guide)
connectors: [
  ...w3mConnectors({ projectId, chains }),  // Includes WalletConnect + Injected
  unicornConnector({ ... }),                 // Add Unicorn
]
```

## Migration from Web3Modal-Only Setup

If you have an existing Web3Modal setup:

**Before:**
```javascript
const wagmiConfig = createConfig({
  connectors: w3mConnectors({ projectId, chains }),
  // ...
});
```

**After:**
```javascript
import { unicornConnector } from '@unicorn.eth/autoconnect';

const wagmiConfig = createConfig({
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    unicornConnector({
      clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: 8453,
    }),
  ],
  // ...
});
```

That's it! No other changes needed.

## Troubleshooting

### Unicorn wallet doesn't appear in Web3Modal

Make sure you're on Web3Modal v2.7+. Earlier versions may not detect custom connectors properly.

### TypeScript errors with connectors

If you get type errors with the connectors array, you may need to cast:

```typescript
connectors: [
  ...w3mConnectors({ projectId, chains }),
  unicornConnector({ ... }),
] as any
```

This is a known issue with Web3Modal v2.7 TypeScript definitions.

### Auto-connect not working

Make sure:
1. `UnicornAutoConnect` component is rendered inside `WagmiConfig`
2. URL parameters are correctly formatted: `?walletId=inApp&authCookie=xxx`
3. Debug mode is enabled to see connection logs

## Resources

- [Main README](./README.md) - Full documentation
- [Quick Reference](./QUICK_REFERENCE.md) - API reference
- [Wagmi Docs](https://wagmi.sh) - Wagmi documentation
- [Web3Modal Docs](https://docs.walletconnect.com) - Web3Modal documentation

## Support

- GitHub Issues: [Report a bug](https://github.com/unicorn-eth/autoconnect/issues)
- Discord: [Join our community](https://discord.gg/unicorn)

---

**Built with ❤️ by the Unicorn team**

Zero-code Web3Modal integration for Unicorn wallets 🦄✨
