# Basic Integration Example

This example demonstrates **three different approaches** to integrating @unicorn.eth/autoconnect into your dApp.

## 🎯 Three Demo Modes

### 1. **UX Demo** (`App-UX-Demo.jsx`)
User-friendly demo with RainbowKit integration
- ✅ Beautiful RainbowKit UI
- ✅ 6 comprehensive features
- ✅ Token balance display (all ERC-20s via Alchemy)
- ✅ NFT gallery (via Alchemy NFT API)
- ✅ Network switching (Base, Polygon, Ethereum, Gnosis)
- ✅ Send ETH with proper error handling
- ✅ Sign messages

**Best for:** Product demos, UX team review, non-technical stakeholders

### 2. **Technical Test Suite** (`App.jsx`)
Comprehensive 9-test suite with RainbowKit
- ✅ All wagmi hooks tested
- ✅ Transaction testing
- ✅ Contract read/write operations
- ✅ Message signing (personal_sign + eth_signTypedData_v4)
- ✅ Chain switching
- ✅ Asset watching

**Best for:** Developers, QA testing, integration verification

### 3. **Pure Wagmi** (`App-Wagmi-Only.jsx`)
Minimal integration without RainbowKit
- ✅ Standard wagmi hooks only
- ✅ Manual connector buttons (MetaMask, WalletConnect, Unicorn)
- ✅ Shows minimal integration requirements
- ✅ Same features as UX Demo but without RainbowKit UI
- ✅ Perfect for understanding the core integration

**Best for:** Understanding the connector, minimal setups, custom UI implementations

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run the example
npm run dev
```

Visit **http://localhost:3000** and use the demo switcher at the top to toggle between modes!

### Test URLs:
- **Normal mode**: http://localhost:3000
- **Unicorn auto-connect**: http://localhost:3000/?walletId=inApp&authCookie=test

## 🎨 Demo Switcher UI

The demo now includes an **interactive switcher** that lets you instantly switch between all three demos without editing code:

```jsx
// src/main.jsx - No code changes needed!
// Just click the buttons at the top of the page
```

Features:
- Sticky header that stays visible while scrolling
- One-click switching between demo modes
- No page reload required
- Clear descriptions of each mode

## 📝 What Each Demo Includes

### UX Demo Features
1. **Wallet Info** - Address, network, balance, disconnect button
2. **Network Switcher** - Switch between 4 networks with visual feedback
3. **Send ETH** - Transaction with proper error handling
4. **Sign Message** - Message signing with verification
5. **Token Balances** - All ERC-20 tokens in wallet (via Alchemy bulk API)
6. **NFT Gallery** - Display all NFTs with thumbnails (via Alchemy NFT API)

### Technical Test Suite Features
1. **Connection Test** - Verify connector and account info
2. **Send Transaction** - ETH transfers
3. **Read Contract** - USDC balance check
4. **Write Contract** - USDC transfer
5. **Sign Message** - personal_sign
6. **Sign Typed Data** - eth_signTypedData_v4
7. **Switch Chain** - Multi-chain testing
8. **Watch Asset** - Add token to wallet
9. **Comprehensive logging** - Detailed console output

### Pure Wagmi Features
Same as UX Demo but with:
- Manual connector selection (no RainbowKit UI)
- Standard wagmi hooks only
- Minimal dependencies
- Custom styled components

## 🎓 Learning Path

**Start with:** UX Demo (default) - See the polished user experience

**Then explore:** Pure Wagmi - Understand the minimal integration

**Finally test:** Technical Suite - Verify all functionality works

## 📦 Environment Variables

Create a `.env` file:

```bash
# Required for Unicorn connector
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A

# Required for WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional - Required for Token Balances and NFT features
VITE_ALCHEMY_ID=your_alchemy_api_key
```

### Getting API Keys

- **Thirdweb Client ID**: Get from [thirdweb.com](https://thirdweb.com/dashboard)
- **WalletConnect Project ID**: Get from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- **Alchemy API Key**: Get from [alchemy.com](https://www.alchemy.com) (needed for token/NFT features)

## 🌐 Supported Networks

All demos support 4 networks out of the box:
- **Base** (Chain ID: 8453) - Default
- **Polygon** (Chain ID: 137)
- **Ethereum Mainnet** (Chain ID: 1)
- **Gnosis** (Chain ID: 100)

The connector itself supports **18 total networks** including testnets. See [Release Notes v1.3.5](../../../RELEASE_NOTES_v1.3.5.md) for the full list.

## 🔧 Key Features Across All Demos

### Network-Agnostic Components
All token and NFT components automatically work on any configured network:
- Detect current chain
- Map to appropriate Alchemy endpoint
- Display assets for the connected network

### Proper Error Handling
Transaction errors are caught and displayed with user-friendly messages:
- Insufficient funds detection
- Gas estimation failures
- User rejection handling

### Multi-Network Support
Switch between networks seamlessly:
- Automatic chain detection
- Smart account support on all chains
- Consistent behavior across networks

## 🎯 Key Takeaways

1. **Standard Wagmi Integration**: Use normal wagmi hooks (`useSendTransaction`, `useSignMessage`, etc.)
2. **Three Demo Options**: Choose the demo that fits your use case
3. **Interactive Switcher**: No code changes needed to explore different demos
4. **Network Agnostic**: All features work across Base, Polygon, Ethereum, and Gnosis
5. **Optional RainbowKit**: Pure Wagmi demo shows you can use AutoConnect without RainbowKit

## 📁 File Structure

```
src/
├── App.jsx                    # Technical Test Suite (9 tests)
├── App-UX-Demo.jsx           # UX Demo (6 features)
├── App-Wagmi-Only.jsx        # Pure Wagmi (no RainbowKit)
├── main.jsx                  # Demo switcher UI
└── components/
    └── UnicornAutoConnectWrapper.tsx  # AutoConnect wrapper
```

## 🎨 Customization

### Switching Default Demo

The demo defaults to UX mode. To change this, edit `main.jsx`:

```javascript
const [mode, setMode] = useState('ux')  // Change to 'technical' or 'wagmi-only'
```

### Adding More Networks

Edit the wagmi config in your chosen demo file:

```javascript
import { avalanche } from 'wagmi/chains';

const config = createConfig({
  chains: [base, polygon, ethereum, gnosis, avalanche],  // Add here
  // ...
});
```

Make sure the network is also supported in `unicornConnector.js`.

## 🧪 Testing Checklist

When testing any demo mode:

- [ ] Connect with MetaMask
- [ ] Connect with WalletConnect
- [ ] Connect with Unicorn (add `?walletId=inApp&authCookie=test` to URL)
- [ ] Switch between all 4 networks
- [ ] Send a transaction (will fail without funds, but should show proper error)
- [ ] Sign a message
- [ ] View token balances (requires Alchemy API key)
- [ ] View NFTs (requires Alchemy API key)
- [ ] Disconnect and reconnect

## 📚 Learn More

- [Main Documentation](../../../README.md) - Full package docs
- [Release Notes v1.3.5](../../../RELEASE_NOTES_v1.3.5.md) - Network expansion details
- [Connector Source](../../../src/connectors/unicornConnector.js) - Core connector implementation