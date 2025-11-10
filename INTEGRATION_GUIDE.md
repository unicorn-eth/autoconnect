# Unicorn AutoConnect Integration Guide

> A comprehensive guide for integrating Unicorn wallet support into your existing dApp or creating a new integration from scratch.

**Version:** 1.3.5
**Last Updated:** November 10, 2025

---

## 📋 Table of Contents

1. [What is AutoConnect?](#what-is-autoconnect)
2. [Prerequisites](#prerequisites)
3. [Quick Start (5 Minutes)](#quick-start-5-minutes)
4. [Framework-Specific Setup](#framework-specific-setup)
5. [Configuration Options](#configuration-options)
6. [Testing Your Integration](#testing-your-integration)
7. [Network Support](#network-support)
8. [Troubleshooting](#troubleshooting)
9. [Migration from Older Versions](#migration-from-older-versions)
10. [Examples & Templates](#examples--templates)
11. [Next Steps: Get Discovered](#next-steps-get-discovered)

---

## What is AutoConnect?

**Unicorn AutoConnect** is a standard Wagmi connector that adds gasless smart account transactions to your existing dApp. It works alongside your current wallet setup (MetaMask, WalletConnect, etc.) **without breaking anything**.

### Key Benefits:
- ✅ **Gasless Transactions** - Users don't need ETH for gas
- ✅ **Smart Account Support** - Account abstraction built-in
- ✅ **Zero Code Changes** - Use standard wagmi hooks
- ✅ **URL Auto-Connection** - Seamless onboarding via URL parameters
- ✅ **17 Networks Supported** - Works on all major EVM chains
- ✅ **Works with RainbowKit** - Or without it

### What Gets Added:
```javascript
// 1. Add ONE connector to your wagmi config
unicornConnector({ clientId, factoryAddress, defaultChain })

// 2. Add ONE component to your app
<UnicornAutoConnect />

// 3. That's it! Everything else stays the same.
```

---

## Prerequisites

Before integrating, ensure you have:

### Required Dependencies:
```json
{
  "wagmi": "^2.0.0",
  "viem": "^2.0.0",
  "thirdweb": "^5.68.0",
  "@tanstack/react-query": "^5.0.0"
}
```

### Required Environment Variables:
```bash
# Get from https://thirdweb.com/dashboard
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id

# Smart account factory address (use default or deploy your own)
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A

# For WalletConnect (if using)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Get Your API Keys:
1. **Thirdweb Client ID**: https://thirdweb.com/dashboard/settings/api-keys
2. **WalletConnect Project ID**: https://cloud.walletconnect.com

---

## Quick Start (5 Minutes)

### Step 1: Install the Package

```bash
npm install @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
```

### Step 2: Add the Connector to Your Wagmi Config

```javascript
import { createConfig, http } from 'wagmi';
import { base, polygon, mainnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [base, polygon, mainnet],
  connectors: [
    // Your existing connectors
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    }),

    // Add Unicorn connector
    unicornConnector({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: base.id, // Your preferred default chain
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
});
```

### Step 3: Add the AutoConnect Component

Note: that debug, onConnect, and onError are not required.

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* Add this component - it handles URL-based auto-connection */}
          <UnicornAutoConnect
            debug={true}
            onConnect={(wallet) => console.log('✅ Unicorn connected:', wallet)}
            onError={(error) => console.error('❌ Error:', error)}
          />

          {/* Your existing app */}
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Step 4: That's It for Code!

Your app now supports Unicorn wallets! Use standard wagmi hooks:

```javascript
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';

function MyComponent() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();

  // For Unicorn users: Shows approval dialog, executes gaslessly
  // For other wallets: Works normally
  const handleSend = () => {
    sendTransaction({
      to: '0x...',
      value: parseEther('0.01'),
    });
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

### Step 5: Get Discovered in Portals (Optional but Recommended)

Now that your integration is complete, get your dApp listed in Unicorn portals to reach thousands of users!

**What are portals?** Community-specific app directories where users discover and launch dApps with one click.

**Examples:**
- app.ethdenver.com - ETHDenver community
- app.polygon.ac - Polygon ecosystem
- app.mylink.fun - MyLink community

**Next Steps:**
1. Create a test community in the admin portal
2. Use Live Preview to validate your integration
3. Deploy to production
4. Submit to App Center for approval
5. Get listed and discovered by users

See the complete [**Portal Setup Guide**](./PORTAL_SETUP_GUIDE.md) for detailed instructions on:
- Creating test communities for local testing
- Using Live Preview to validate integration
- Submitting to App Center
- Getting approved and listed
- Tracking portal performance

**Result:** Your dApp appears where users already browse for apps, with seamless one-click gasless onboarding. 🦄

## Framework-Specific Setup

### React + Vite

**Standard setup (no special configuration needed):**

```javascript
// main.jsx
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <UnicornAutoConnect debug={true} />
      <App />
    </QueryClientProvider>
  </WagmiProvider>
);
```

---

### Next.js (Pages Router or App Router)

**Important:** Next.js requires dynamic imports due to SSR.

#### Option 1: Dynamic Import (Recommended)

```typescript
// pages/_app.tsx or app/layout.tsx
import dynamic from 'next/dynamic';
import { unicornConnector } from '@unicorn.eth/autoconnect';

// Import UnicornAutoConnect dynamically to avoid SSR issues
const UnicornAutoConnect = dynamic(
  () => import('@unicorn.eth/autoconnect').then(mod => mod.UnicornAutoConnect),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UnicornAutoConnect
            debug={true}
            onConnect={(wallet) => console.log('Connected:', wallet)}
            onError={(error) => console.error('Error:', error)}
          />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

#### Option 2: Create a Client Component (Next.js 13+ App Router)

```typescript
// components/UnicornAutoConnectClient.tsx
'use client';

import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

export function UnicornAutoConnectClient() {
  return (
    <UnicornAutoConnect
      debug={true}
      onConnect={(wallet) => console.log('Connected:', wallet)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

Then use it:
```typescript
// app/layout.tsx
import { UnicornAutoConnectClient } from '@/components/UnicornAutoConnectClient';

export default function RootLayout({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UnicornAutoConnectClient />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**Wagmi Config with SSR:**
```typescript
const config = createConfig({
  chains: [base, polygon],
  connectors: [/* ... */],
  transports: {/* ... */},
  ssr: true, // ← Important for Next.js!
});
```

---

### With RainbowKit

```javascript
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'My dApp',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  }
);

// Add Unicorn connector to the array
const config = createConfig({
  chains: [base],
  connectors: [
    ...connectors,
    unicornConnector({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});
```

**RainbowKit UI will automatically show Unicorn as a wallet option!**

---

### Without RainbowKit (Pure Wagmi)

```javascript
import { useConnect, useAccount, useDisconnect } from 'wagmi';

function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return <button onClick={() => disconnect()}>Disconnect</button>;
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {connector.id === 'unicorn' && ' 🦄'}
        </button>
      ))}
    </div>
  );
}
```

---

## Configuration Options

### UnicornConnector Options

```typescript
interface UnicornConnectorOptions {
  // Required: Thirdweb client ID from dashboard
  clientId: string;

  // Required: Smart account factory address
  // Default: '0xD771615c873ba5a2149D5312448cE01D677Ee48A'
  factoryAddress: string;

  // Required: Default chain ID (e.g., 8453 for Base)
  defaultChain: number;

  // Optional: Custom icon URL for wallet UI
  icon?: string;
}
```

**Example:**
```javascript
unicornConnector({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
  defaultChain: 8453, // Base
  icon: 'https://yourdomain.com/unicorn-icon.png',
})
```

### UnicornAutoConnect Props

```typescript
interface UnicornAutoConnectProps {
  // Optional: Enable debug logging
  debug?: boolean;

  // Optional: Callback when wallet connects successfully
  onConnect?: (wallet: any) => void;

  // Optional: Callback when connection fails
  onError?: (error: Error) => void;
}
```

**Example:**
```jsx
<UnicornAutoConnect
  debug={process.env.NODE_ENV === 'development'}
  onConnect={(wallet) => {
    console.log('Unicorn wallet connected!');
    // Track analytics, show notification, etc.
  }}
  onError={(error) => {
    console.error('Connection failed:', error);
    // Show error message to user
  }}
/>
```

---

## Testing Your Integration

### 1. Test Standard Connection

Visit your app normally:
```
http://localhost:3000
```

**Expected:**
- See Unicorn as a wallet option in your connect UI
- Can connect with MetaMask, WalletConnect, etc. as before
- Click "Unicorn" to test connection flow

### 2. Test URL-Based Auto-Connection

Visit with Unicorn URL parameters:
```
http://localhost:3000/?walletId=inApp&authCookie=test_cookie_value
```

**Expected:**
- App automatically connects to Unicorn wallet
- No need to click "Connect" button
- User sees connected state immediately

### 3. Test Transactions

Once connected with Unicorn:

```javascript
// Send a transaction
const { sendTransaction } = useSendTransaction();

sendTransaction({
  to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  value: parseEther('0.001'),
});
```

**Expected for Unicorn users:**
- Beautiful approval dialog appears
- Shows transaction details
- User can approve or reject
- Transaction executes gaslessly (no ETH needed for gas)

**Expected for other wallets:**
- Standard wallet popup (MetaMask, WalletConnect)
- User pays gas normally

### 4. Test Message Signing

```javascript
const { signMessage } = useSignMessage();

signMessage({ message: 'Hello from Unicorn!' });
```

**Expected:**
- Unicorn users: Approval dialog for signature
- Other wallets: Standard signature popup

### 5. Test Network Switching

```javascript
const { switchChain } = useSwitchChain();

switchChain({ chainId: 137 }); // Switch to Polygon
```

**Expected:**
- Works seamlessly with all wallets
- Unicorn users: Instant switch (smart account works on all chains)
- Other wallets: Standard network switch popup

---

## Network Support

### Supported Networks (17 Total)

AutoConnect v1.3.5 supports **17 networks out of the box**. Just add them to your wagmi config:

#### Production Mainnets (12)
```javascript
import {
  mainnet,      // Ethereum (1)
  base,         // Base (8453)
  polygon,      // Polygon (137)
  arbitrum,     // Arbitrum One (42161)
  optimism,     // Optimism (10)
  gnosis,       // Gnosis Chain (100)
  celo,         // Celo (42220)
  avalanche,    // Avalanche C-Chain (43114)
  bsc,          // BNB Smart Chain (56)
  zkSync,       // zkSync Era (324)
  scroll,       // Scroll (534352)
  zora,         // Zora (7777777)
} from 'wagmi/chains';
```

#### Testnets (5)
```javascript
import {
  sepolia,          // Sepolia (11155111)
  baseSepolia,      // Base Sepolia (84532)
  polygonAmoy,      // Polygon Amoy (80002)
  arbitrumSepolia,  // Arbitrum Sepolia (421614)
  optimismSepolia,  // Optimism Sepolia (11155420)
} from 'wagmi/chains';
```

### Adding Networks to Your Config

```javascript
const config = createConfig({
  chains: [
    mainnet,
    base,
    polygon,
    arbitrum,
    optimism,
    // Add as many as you need
  ],
  connectors: [
    unicornConnector({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: base.id, // Your preferred default
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    // Add transports for all your chains
  },
});
```

**That's it!** The Unicorn connector automatically supports all these networks.

---

## Troubleshooting

### Issue 1: "config.getState is not a function" (Next.js)

**Problem:** SSR tries to access wagmi config before it's ready

**Solution:** Use dynamic imports (see [Next.js setup](#nextjs-pages-router-or-app-router))

```typescript
const UnicornAutoConnect = dynamic(
  () => import('@unicorn.eth/autoconnect').then(mod => mod.UnicornAutoConnect),
  { ssr: false }
);
```

---

### Issue 2: Unicorn Connector Not Showing in RainbowKit

**Problem:** Connector not appearing in wallet list

**Solution:** Ensure connector is added to config:
```javascript
const config = createConfig({
  connectors: [
    ...rainbowKitConnectors,
    unicornConnector({ ... }), // Must be here!
  ],
});
```

---

### Issue 3: "Thirdweb chain not configured for X"

**Problem:** Chain not supported by connector

**Supported Chains:** 1, 8453, 137, 42161, 10, 100, 42220, 43114, 56, 324, 534352, 7777777, 11155111, 84532, 80002, 421614, 11155420

**Solution:** Use a supported chain or request support for additional chains

---

### Issue 4: Auto-Connect Not Working

**Problem:** URL parameters present but wallet doesn't connect

**Checklist:**
1. ✅ `UnicornAutoConnect` component is rendered
2. ✅ Component is inside `WagmiProvider`
3. ✅ URL has `?walletId=inApp&authCookie=xxx` parameters
4. ✅ `unicornConnector` is in wagmi config
5. ✅ Environment variables are set correctly

**Debug:**
```jsx
<UnicornAutoConnect debug={true} /> // Enable logging
```

Check console for `[UnicornAutoConnect]` messages.

---

### Issue 5: Transactions Fail with "Insufficient Funds"

**Problem:** User doesn't have enough ETH for gas

**This is normal!** Even with gasless transactions:
- Smart accounts need minimal ETH for deployment (first transaction only)
- Some networks require gas even with sponsorship

**Solutions:**
- Fund the smart account with small amount of native token
- Configure gas sponsorship on Thirdweb dashboard
- Use faucets for testnets

---

### Issue 6: TypeScript Errors

**Problem:** Missing type definitions

**Solution:** Create a `types.d.ts` file:
```typescript
declare module '@unicorn.eth/autoconnect' {
  export interface UnicornConnectorOptions {
    clientId: string;
    factoryAddress: string;
    defaultChain: number;
    icon?: string;
  }

  export interface UnicornAutoConnectProps {
    debug?: boolean;
    onConnect?: (wallet: any) => void;
    onError?: (error: Error) => void;
  }

  export function unicornConnector(options: UnicornConnectorOptions): any;
  export function UnicornAutoConnect(props?: UnicornAutoConnectProps): JSX.Element | null;
}
```

---

## Migration from Older Versions

### From v1.2 to v1.3+

**Breaking Change:** Custom hooks removed in favor of standard wagmi hooks

**Before (v1.2):**
```javascript
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

const tx = useUniversalTransaction();
await tx.sendTransactionAsync({ to, value });
```

**After (v1.3+):**
```javascript
import { useSendTransaction } from 'wagmi';

const { sendTransaction } = useSendTransaction();
sendTransaction({ to, value });
```

**Migration Steps:**
1. Replace `useUniversalTransaction` → `useSendTransaction`
2. Replace `useUniversalSignMessage` → `useSignMessage`
3. Replace `useUniversalAccount` → `useAccount`
4. Remove all `Universal*` hooks from imports
5. Test thoroughly with both Unicorn and standard wallets

**No changes needed to:**
- Connector configuration
- AutoConnect component
- Environment variables
- Existing wallet integrations

---

### From v1.3.4 to v1.3.5

**No breaking changes!** This is a feature release.

**What's New:**
- 12 new networks added (18 total)
- Ethereum Mainnet support fixed
- Enhanced demo examples

**Migration:**
1. Update package: `npm install @unicorn.eth/autoconnect@1.3.5`
2. That's it! Everything is backward compatible.

**Optional:** Add new networks to your config if desired.

---

## Examples & Templates

### Minimal Example (Vite + React)

```javascript
// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';
import { injected } from 'wagmi/connectors';

const config = createConfig({
  chains: [base],
  connectors: [
    injected({ target: 'metaMask' }),
    unicornConnector({
      clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UnicornAutoConnect debug={true} />
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
```

---

### Complete Example (Next.js + RainbowKit)

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, polygon, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import dynamic from 'next/dynamic';
import '@rainbow-me/rainbowkit/styles.css';

// Dynamic import for UnicornAutoConnect (SSR workaround)
const UnicornAutoConnect = dynamic(
  () => import('@unicorn.eth/autoconnect').then(mod => mod.UnicornAutoConnect),
  { ssr: false }
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  { appName: 'My dApp', projectId }
);

const config = createConfig({
  chains: [base, polygon, mainnet],
  connectors: [
    ...connectors,
    unicornConnector({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS!,
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <UnicornAutoConnect debug={true} />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

### Transaction Example

```typescript
import { useSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

function SendETH() {
  const { address, isConnected } = useAccount();
  const { sendTransaction, isPending, isSuccess, isError, error } = useSendTransaction();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isSuccess) {
      console.log('✅ Transaction successful!');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      let message = error.message || 'Transaction failed';
      if (message.includes('insufficient funds')) {
        message = 'Insufficient funds. You need more ETH in your wallet.';
      }
      setErrorMessage(message);
    }
  }, [isError, error]);

  const handleSend = () => {
    sendTransaction({
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      value: parseEther('0.001'),
    });
  };

  if (!isConnected) {
    return <p>Connect your wallet first</p>;
  }

  return (
    <div>
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? '⏳ Sending...' : '💸 Send 0.001 ETH'}
      </button>
      {isSuccess && <p>✅ Transaction sent successfully!</p>}
      {errorMessage && <p>❌ {errorMessage}</p>}
    </div>
  );
}
```

---

### Sign Message Example

```typescript
import { useSignMessage } from 'wagmi';
import { useState } from 'react';

function SignMessageDemo() {
  const { signMessage, isPending, isSuccess, data: signature } = useSignMessage();
  const [message, setMessage] = useState('Hello from Unicorn!');

  const handleSign = () => {
    signMessage({ message });
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message to sign"
      />
      <button onClick={handleSign} disabled={isPending}>
        {isPending ? '⏳ Signing...' : '✍️ Sign Message'}
      </button>
      {isSuccess && (
        <div>
          <p>✅ Signature:</p>
          <code>{signature}</code>
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Error Handling
Always handle errors gracefully:
```javascript
const { sendTransaction, isError, error } = useSendTransaction();

useEffect(() => {
  if (isError) {
    // Show user-friendly error message
    console.error('Transaction failed:', error);
  }
}, [isError, error]);
```

### 2. Loading States
Use `isPending` to show loading indicators:
```javascript
const { sendTransaction, isPending } = useSendTransaction();

return (
  <button disabled={isPending}>
    {isPending ? 'Processing...' : 'Send Transaction'}
  </button>
);
```

### 3. Debug Mode
Enable debug mode during development:
```jsx
<UnicornAutoConnect
  debug={process.env.NODE_ENV === 'development'}
/>
```

### 4. Environment Variables
Never commit secrets to version control:
```bash
# .env.local (gitignored)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=abc123
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0x...
```

### 5. Test Both Wallet Types
Always test your app with:
- ✅ Unicorn wallet (URL parameters)
- ✅ MetaMask or other standard wallet
- ✅ Ensure both flows work correctly

---

## Next Steps: Get Discovered

Congratulations! Your AutoConnect integration is complete. Now it's time to get your dApp discovered by thousands of users through Unicorn portals.

### What are Unicorn Portals?

Portals are community-specific app directories where users discover and launch dApps with seamless one-click onboarding:

**Popular Portals:**
- **app.ethdenver.com** - ETHDenver community
- **app.polygon.ac** - Polygon ecosystem
- **app.mylink.fun** - MyLink community
- And many more community-specific portals

### Why Get Listed?

✅ **Instant Distribution** - Reach thousands of existing portal users
✅ **Zero Friction** - Users launch your dApp with one click
✅ **Gasless Onboarding** - No wallet setup friction for new users
✅ **Community Discovery** - Appear where users actively browse for dApps
✅ **Free Marketing** - Get exposure in established ecosystems

### How to Get Listed

**1. Create a Test Community**
- Log in to https://admin.myunicornaccount.com/login
- Add your dApp to "My Community"
- Use Live Preview to test locally

**2. Validate Your Integration**
- Test auto-connection with URL parameters
- Verify transactions work gaslessly
- Check error handling
- Test on multiple devices

**3. Deploy to Production**
- Push your dApp to a public URL
- Ensure HTTPS is configured
- Verify all features work in production

**4. Submit to App Center**
- Fill out: https://forms.gle/3kyuEce2fZtd7Umy9
- Provide dApp details and screenshots
- Wait 1-2 weeks for review

**5. Get Approved & Listed**
- Team validates your integration
- Your dApp appears in relevant portals
- Users discover and use your dApp!

### Complete Portal Setup Guide

For detailed step-by-step instructions, see the **[Portal Setup Guide](./PORTAL_SETUP_GUIDE.md)**, which covers:

- Creating test communities for local development
- Using Live Preview to validate integration
- Troubleshooting common portal issues
- Submitting to App Center
- Getting approved for portal listing
- Tracking portal performance and analytics
- Best practices for portal optimization

**The result:** Your dApp appears in established portals where users already browse for apps, with seamless one-click gasless onboarding. That's distribution. 🦄

---

## Resources

### Documentation
- **AutoConnect Repo:** https://github.com/unicorn-eth/autoconnect
- **Wagmi Docs:** https://wagmi.sh
- **Viem Docs:** https://viem.sh
- **Thirdweb Docs:** https://portal.thirdweb.com

### Examples
- **Basic Example:** `src/examples/basic` in the repo
- **Live Demos:** Run `npm run dev` in examples folder

### Support
- **GitHub Issues:** https://github.com/unicorn-eth/autoconnect/issues
- **Discord:** [Your Discord link]
- **Twitter:** [Your Twitter handle]

### Get API Keys
- **Thirdweb:** https://thirdweb.com/dashboard
- **WalletConnect:** https://cloud.walletconnect.com

---

## Quick Checklist

Before deploying, ensure:

- [ ] Installed `@unicorn.eth/autoconnect` package
- [ ] Added `unicornConnector` to wagmi config
- [ ] Added `UnicornAutoConnect` component to app
- [ ] Set required environment variables
- [ ] Tested with URL parameters: `?walletId=inApp&authCookie=test`
- [ ] Tested transactions with Unicorn wallet
- [ ] Tested with standard wallets (MetaMask, etc.)
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Next.js: Used dynamic imports for SSR
- [ ] Documentation reviewed
- [ ] Team trained on new wallet option

---

## Summary

**You just added Unicorn support in 3 steps:**

1. ✅ **Add connector** to wagmi config
2. ✅ **Add component** to your app
3. ✅ **Use standard wagmi hooks** (no changes needed!)

**Users get:**
- Gasless transactions
- Smart account features
- Seamless URL-based onboarding
- Support for 17 networks

**Your existing setup:**
- Still works exactly the same
- MetaMask, WalletConnect, etc. unchanged
- No breaking changes to your code

---

**Questions or need help?** Open an issue on GitHub or contact the team!

**Happy integrating! 🦄**

---

*Last updated: November 10, 2025*
*AutoConnect Version: 1.3.5*
*License: MIT*
