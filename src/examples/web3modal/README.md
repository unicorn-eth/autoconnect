# Unicorn + Web3Modal Example

This example demonstrates how to integrate Unicorn wallet with Web3Modal v2 in a React application.

## Features

- ✅ Web3Modal v2 integration
- ✅ Unicorn wallet support (gasless transactions)
- ✅ Multiple wallet options (MetaMask, WalletConnect, Coinbase, etc.)
- ✅ Auto-connection via URL parameters
- ✅ Standard wagmi hooks
- ✅ Multi-chain support (Base, Polygon, Arbitrum, Optimism)
- ✅ Beautiful UI with transaction testing

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
# Get from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Get from https://thirdweb.com/dashboard
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Use this for production
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

### 3. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## How It Works

This example shows the **simplest possible integration** of Unicorn with Web3Modal:

### App.jsx - The Magic

```javascript
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { w3mConnectors } from '@web3modal/ethereum';

const wagmiConfig = createConfig({
  connectors: [
    ...w3mConnectors({ projectId, chains }),

    // Add Unicorn - that's it!
    unicornConnector({
      clientId,
      factoryAddress,
      defaultChain: 8453,
    }),
  ],
  // ... rest of config
});
```

That's literally all you need to add Unicorn support!

### Using Standard Wagmi Hooks

Once integrated, use standard wagmi hooks that work with ALL wallets:

```javascript
import { useSendTransaction, useSignMessage } from 'wagmi';

function MyComponent() {
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();

  // Works with MetaMask, WalletConnect, Coinbase, AND Unicorn!
  const handleSend = () => {
    sendTransaction({ to: '0x...', value: parseEther('0.01') });
  };
}
```

## Testing

### Test with Different Wallets

1. **MetaMask/Coinbase** - Click "Connect Wallet" and select your wallet
2. **WalletConnect** - Click "Connect Wallet" and scan QR code
3. **Unicorn** - Use URL parameters: `http://localhost:5173/?walletId=inApp&authCookie=xxx`

### What to Try

- ✅ Send a transaction (0.001 ETH)
- ✅ Sign a message
- ✅ Switch networks
- ✅ Check wallet balance
- ✅ Disconnect and reconnect

## Project Structure

```
web3modal/
├── src/
│   ├── components/
│   │   └── DApp.jsx          # Main dApp UI
│   ├── App.jsx                # Web3Modal + wagmi setup
│   ├── main.jsx               # React entry point
│   └── index.css              # Styles
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## Key Integration Points

### 1. Connector Setup (App.jsx)

The connector setup combines Web3Modal's connectors with Unicorn:

```javascript
connectors: [
  ...w3mConnectors({ projectId, chains }),  // WalletConnect + Injected
  unicornConnector({ clientId, factoryAddress, defaultChain }),  // Unicorn
]
```

### 2. Auto-Connect Component (App.jsx)

For URL-based connection:

```javascript
<UnicornAutoConnect
  debug={true}
  onConnect={(wallet) => console.log('Connected!', wallet)}
  onError={(error) => console.error('Error:', error)}
/>
```

### 3. Standard Hooks (DApp.jsx)

All standard wagmi hooks work:

- `useAccount()` - Get connected account
- `useBalance()` - Get balance
- `useSendTransaction()` - Send transactions
- `useSignMessage()` - Sign messages
- `useNetwork()` - Get current network
- `useSwitchNetwork()` - Switch networks

## Migration from Web3Modal-Only

If you have an existing Web3Modal project, here's what changes:

**Before:**
```javascript
const wagmiConfig = createConfig({
  connectors: w3mConnectors({ projectId, chains }),
});
```

**After:**
```javascript
import { unicornConnector } from '@unicorn.eth/autoconnect';

const wagmiConfig = createConfig({
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    unicornConnector({ clientId, factoryAddress, defaultChain }),
  ],
});
```

That's it! Everything else stays the same.

## Learn More

- [Web3Modal Integration Guide](../../WEB3MODAL_INTEGRATION.md) - Complete guide
- [Main README](../../../README.md) - Full documentation
- [Wagmi Docs](https://wagmi.sh) - Wagmi documentation
- [Web3Modal Docs](https://docs.walletconnect.com) - Web3Modal documentation

## Support

- GitHub Issues: [Report a bug](https://github.com/unicorn-eth/autoconnect/issues)
- Discord: [Join our community](https://discord.gg/unicorn)

---

**Built with ❤️ by the Unicorn team**

Zero-code Web3Modal integration 🦄✨
