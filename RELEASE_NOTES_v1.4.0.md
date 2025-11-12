# Release Notes v1.4.0

## 🌐 Web3Modal Integration Support

**Release Date:** TBD
**Version:** 1.4.0

### What's New

#### ✨ Web3Modal v2 Support

AutoConnect now officially supports **@web3modal/ethereum** and **@web3modal/react** v2.7+! Since Web3Modal v2 uses wagmi underneath, our existing `unicornConnector` works seamlessly with it.

**Key Benefits:**
- ✅ Zero-code-change integration
- ✅ Works alongside all Web3Modal wallets
- ✅ Same gasless transaction experience
- ✅ Auto-connection via URL still works
- ✅ All 17 networks supported

#### 🔧 New Integration Helper

Added `createWeb3ModalConfig()` helper function for the easiest possible integration:

```javascript
import { createWeb3ModalConfig } from '@unicorn.eth/autoconnect/web3modal';

const { wagmiConfig, ethereumClient } = await createWeb3ModalConfig({
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
  factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
  defaultChain: 8453,
  chains: [base, polygon],
});
```

#### 📚 Comprehensive Documentation

- **[Web3Modal Integration Guide](./WEB3MODAL_INTEGRATION.md)** - Complete setup guide
- **Example Project** - Full working example in `src/examples/web3modal/`
- **Updated README** - Web3Modal quick start section

#### 📦 Package Updates

- Updated `package.json` exports to include `/web3modal` entry point
- Added Web3Modal keywords for better discoverability
- Updated description to highlight Web3Modal compatibility

### Migration Guide

If you're already using AutoConnect with pure wagmi, **no changes needed**! This release is fully backward compatible.

If you want to use the new Web3Modal integration:

**Before (Web3Modal only):**
```javascript
import { w3mConnectors } from '@web3modal/ethereum';

const wagmiConfig = createConfig({
  connectors: w3mConnectors({ projectId, chains }),
});
```

**After (Web3Modal + Unicorn):**
```javascript
import { w3mConnectors } from '@web3modal/ethereum';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const wagmiConfig = createConfig({
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    unicornConnector({ clientId, factoryAddress, defaultChain }),
  ],
});
```

### How It Works

Web3Modal v2 uses wagmi under the hood, specifically:
- `w3mConnectors` - Provides WalletConnect and Injected connectors
- Standard wagmi `createConfig` and hooks
- Wagmi's connector architecture

Since `unicornConnector` is a standard wagmi connector built with `createConnector()`, it integrates seamlessly with Web3Modal's setup. No special adapter or wrapper needed!

### What Hasn't Changed

- ✅ All existing wagmi/RainbowKit integrations work the same
- ✅ Same connector options
- ✅ Same auto-connect behavior
- ✅ Same approval dialogs
- ✅ Same network support

### Example Projects

Two full working examples are now available:

1. **Pure Wagmi** - `src/examples/basic/` (existing)
2. **Web3Modal** - `src/examples/web3modal/` (new)

Both demonstrate:
- Wallet connection
- Sending transactions
- Signing messages
- Network switching
- Token balances

### Developer Experience

**Installation** (unchanged):
```bash
npm install @unicorn.eth/autoconnect wagmi viem
```

**Import Options:**

```javascript
// Main package (for pure wagmi)
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';

// Web3Modal helpers
import { createWeb3ModalConfig, addUnicornConnector } from '@unicorn.eth/autoconnect/web3modal';
```

### Framework Support Matrix

| Framework | Supported | Guide |
|-----------|-----------|-------|
| Pure Wagmi | ✅ | [README](./README.md) |
| RainbowKit | ✅ | [README](./README.md) |
| Web3Modal v2 | ✅ | [Web3Modal Guide](./WEB3MODAL_INTEGRATION.md) |
| Web3Modal v3+ | ⚠️ | Uses wagmi, should work (untested) |
| Custom wagmi setup | ✅ | [README](./README.md) |

### Testing

The Web3Modal integration has been tested with:
- ✅ Multiple wallet types (MetaMask, WalletConnect, Unicorn)
- ✅ Transaction sending
- ✅ Message signing
- ✅ Network switching
- ✅ Auto-connection via URL
- ✅ All 17 supported networks

### Known Limitations

1. **Web3Modal v2.7+ Required** - Earlier versions may not properly detect custom connectors
2. **TypeScript Definitions** - Web3Modal v2 has some type issues with custom connectors (use `as any` if needed)
3. **Peer Dependencies** - Make sure you have compatible wagmi and viem versions installed

### Breaking Changes

None! This is a fully backward-compatible release.

### Upgrade Instructions

1. Update to v1.4.0:
   ```bash
   npm install @unicorn.eth/autoconnect@1.4.0
   ```

2. (Optional) If using Web3Modal, follow the [Web3Modal Integration Guide](./WEB3MODAL_INTEGRATION.md)

3. (Optional) Explore the new example project:
   ```bash
   cd src/examples/web3modal
   npm install
   npm run dev
   ```

### Future Plans

- 🔄 Test Web3Modal v3+ (AppKit) compatibility
- 📱 Mobile wallet integration examples
- 🎨 Custom connector UI themes
- 🧪 Additional test coverage

### Feedback

We'd love to hear about your Web3Modal integration experience!

- 🐛 [Report bugs](https://github.com/unicorn-eth/autoconnect/issues)
- 💡 [Request features](https://github.com/unicorn-eth/autoconnect/issues)
- 💬 [Join Discord](https://discord.gg/unicorn)

### Contributors

Built with ❤️ by the Unicorn team and Claude AI

---

## Full Changelog

### Added
- Web3Modal integration helper (`createWeb3ModalConfig`)
- Web3Modal example project
- Web3Modal integration guide
- `/web3modal` package export path
- Web3Modal keywords to package.json

### Changed
- Updated package description to mention Web3Modal
- Updated main README with Web3Modal section
- Added Web3Modal to Additional Resources

### Fixed
- None

### Deprecated
- None

### Removed
- None

### Security
- None

---

**Ready to integrate?** Check out the [Web3Modal Integration Guide](./WEB3MODAL_INTEGRATION.md)!

🦄✨ Zero-code Web3Modal integration - just add one line!
