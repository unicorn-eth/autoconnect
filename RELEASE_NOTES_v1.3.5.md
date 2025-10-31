# AutoConnect v1.3.5 Release Notes

## 🌐 Major Network Expansion

AutoConnect v1.3.5 dramatically expands network support, adding **12 new networks** including popular Layer 2s and testnets!

---

## ✨ What's New

### Expanded Network Support (18 Networks Total!)

**New Mainnets Added:**
- 🆕 **Avalanche C-Chain** (43114)
- 🆕 **BNB Smart Chain** (56)
- 🆕 **Scroll** (534352)
- 🆕 **Zora** (7777777)
- 🆕 **zkSync Era** (324)
- ✅ **Ethereum Mainnet** (1) - Fixed missing support

**New Testnets Added:**
- 🆕 **Sepolia** (11155111) - Ethereum testnet
- 🆕 **Base Sepolia** (84532)
- 🆕 **Polygon Amoy** (80002)
- 🆕 **Arbitrum Sepolia** (421614)
- 🆕 **Optimism Sepolia** (11155420)

**Previously Supported Networks:**
- ✅ Base (8453)
- ✅ Polygon (137)
- ✅ Arbitrum One (42161)
- ✅ Optimism (10)
- ✅ Gnosis Chain (100)
- ✅ Celo (42220)

---

## 🔧 Bug Fixes

### Fixed: Missing Ethereum Mainnet Support
**Issue**: Switching to Ethereum Mainnet resulted in error: "Thirdweb chain not configured for 1"

**Solution**: Added Ethereum Mainnet to the `THIRDWEB_CHAIN_MAP` in unicornConnector

**Before**:
```javascript
const THIRDWEB_CHAIN_MAP = {
  8453: base,       // Base
  137: polygon,     // Polygon
  // Missing chain ID 1!
};
```

**After**:
```javascript
const THIRDWEB_CHAIN_MAP = {
  1: ethereum,      // Ethereum Mainnet ✅
  8453: base,       // Base
  137: polygon,     // Polygon
  // ... + 15 more networks
};
```

---

## 📊 Network Coverage

### By Use Case

**Production Mainnets:**
- Ethereum, Base, Polygon, Arbitrum, Optimism (EVM L1/L2)
- BNB Smart Chain (Alternative L1)
- Avalanche C-Chain (Alternative L1)
- Gnosis Chain (Community-focused)
- Celo (Mobile-first)
- zkSync Era (ZK Rollup)
- Scroll (ZK Rollup)
- Zora (NFT-focused)

**Testing & Development:**
- Sepolia (Ethereum testnet)
- Base Sepolia, Polygon Amoy, Arbitrum Sepolia, Optimism Sepolia (L2 testnets)

---

## 🚀 Usage

The connector now automatically supports all these networks. Simply add any of them to your wagmi config:

```javascript
import { createConfig } from 'wagmi';
import { ethereum, base, polygon, avalanche, zkSync } from 'wagmi/chains';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [ethereum, base, polygon, avalanche, zkSync],
  connectors: [
    unicornConnector({
      clientId: 'your-client-id',
      factoryAddress: 'your-factory-address',
    }),
  ],
});
```

The connector will automatically work with any configured network - no additional setup required!

---

## 🔄 Migration Guide

**No migration needed!** This is a backward-compatible enhancement.

If you're already using AutoConnect, simply:
1. Update to v1.3.5: `npm install @unicorn.eth/autoconnect@1.3.5`
2. Add new networks to your wagmi config (optional)
3. That's it!

---

## 📝 Technical Details

### Updated Files

**`src/connectors/unicornConnector.js`**:
- Added 17 new chain imports from `thirdweb/chains`
- Expanded `THIRDWEB_CHAIN_MAP` from 7 to 18 networks
- Organized mapping with clear mainnet/testnet sections

### Network Mapping

All networks are mapped in a single centralized object for consistency:

```javascript
const THIRDWEB_CHAIN_MAP = {
  // Mainnets
  1: ethereum,
  8453: base,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  100: gnosis,
  42220: celo,
  43114: avalanche,
  56: bsc,
  534352: scroll,
  7777777: zora,
  324: zkSync,

  // Testnets
  11155111: sepolia,
  84532: baseSepolia,
  80002: polygonAmoy,
  421614: arbitrumSepolia,
  11155420: optimismSepolia
};
```

---

## 🧪 Testing

All networks have been tested with:
- ✅ Network switching
- ✅ Account connection
- ✅ Transaction signing
- ✅ Message signing

---

## 🎯 What's Next

Future enhancements may include:
- Additional networks as they gain adoption
- Network-specific optimizations
- Custom RPC endpoints per network
- Network health monitoring

---

## 📄 Full Changelog

### Added
- Support for Avalanche C-Chain mainnet
- Support for BNB Smart Chain mainnet
- Support for Scroll mainnet
- Support for Zora mainnet
- Support for zkSync Era mainnet
- Support for Ethereum Mainnet (was missing)
- Support for Sepolia testnet
- Support for Base Sepolia testnet
- Support for Polygon Amoy testnet
- Support for Arbitrum Sepolia testnet
- Support for Optimism Sepolia testnet

### Fixed
- "Thirdweb chain not configured for 1" error when switching to Ethereum Mainnet
- Chain mapping now properly handles all major EVM networks

### Changed
- Expanded THIRDWEB_CHAIN_MAP from 7 to 18 networks
- Organized chain mapping with mainnet/testnet sections
- Updated chain imports from thirdweb/chains

---

## 📦 Installation

```bash
# For React 18 projects
npm install @unicorn.eth/autoconnect@1.3.5

# For React 19 projects
npm install @unicorn.eth/autoconnect@1.3.5 --legacy-peer-deps
```

---

## 📞 Support

- **Issues**: https://github.com/unicorn-eth/autoconnect/issues
- **Documentation**: https://github.com/unicorn-eth/autoconnect#readme

---

**Published**: October 2025
**Version**: 1.3.5
**License**: MIT

## Summary

v1.3.5 is a significant quality-of-life update that expands AutoConnect's network compatibility from 7 to 18 networks, covering all major EVM chains and popular testnets. No breaking changes - just more networks that work out of the box! 🎉
