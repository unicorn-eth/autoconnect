# AppKit (Web3Modal v3+) Research - Context Update

**Date:** 2025-11-12
**Status:** Option 1 Selected - Creating AppKit Integration

## Decision

User selected Option 1: Guide users to AppKit (Web3Modal v3+) which uses wagmi v2, where our existing connector works perfectly with zero code changes.

## Key Discovery

**Web3Modal has been rebranded to "Reown AppKit"**

- Official docs: https://docs.reown.com/appkit/
- Migration guide: https://docs.reown.com/appkit/upgrade/to-reown-appkit-web
- React wagmi docs: https://docs.reown.com/appkit/react/core/installation
- Uses wagmi v2 and viem v2 (perfect for our existing connector!)

## Why This Solves Our Problem

### Web3Modal v2 Issue
- Uses wagmi v1
- Hooks have closure issue - can't see dynamically connected connectors
- Architectural limitation preventing zero-code-change integration

### AppKit (Web3Modal v3+) Solution
- Uses wagmi v2
- Our existing `unicornConnector` (wagmi v2 version) works perfectly
- True zero code changes - just add connector to config
- All standard wagmi hooks work identically
- No workarounds needed

## What We Need to Do

1. **Research AppKit Setup**
   - Package: `@reown/appkit` (or `@web3modal/wagmi` - need to verify current package name)
   - Configuration with wagmi v2
   - How to add custom connectors
   - Initialization with `createAppKit()`

2. **Test Our Connector**
   - Create AppKit example project
   - Use our existing `unicornConnector` from `src/connectors/unicornConnector.js`
   - Test that all features work:
     - Auto-connection via URL
     - Transactions with approval dialogs
     - Message signing with smart accounts
     - Network switching
     - Standard wagmi hooks

3. **Create Documentation**
   - New `APPKIT_INTEGRATION.md` guide
   - Update main README to recommend AppKit
   - Keep `WEB3MODAL_INTEGRATION.md` as legacy reference

4. **Update Package**
   - Add AppKit integration exports
   - Update documentation
   - Publish as v1.4.0 (or v1.5.0 if significant)

## Current State

### What We Have
- ✅ Working wagmi v2 connector (`src/connectors/unicornConnector.js`)
- ✅ Working wagmi v1 connector (`src/connectors/unicornConnector.v1.js`) for Web3Modal v2
- ✅ UnicornAutoConnect component
- ✅ Transaction approval dialogs
- ✅ Smart account signing (ERC-1271)
- ✅ Multi-chain support (17+ networks)

### What We're Building
- 🔄 AppKit integration guide
- 🔄 AppKit example project
- 🔄 Testing with AppKit + wagmi v2

### What Works Already
Our existing connector should work out of the box with AppKit because:
- It's built for wagmi v2 ✅
- Uses `createConnector()` API ✅
- Properly implements all connector methods ✅
- Has approval dialogs integrated ✅
- Has smart account signing ✅

## Package Name Changes

Based on search results:
- Old: `@web3modal/ethereum`, `@web3modal/react`
- New: `@reown/appkit` or `@web3modal/wagmi`
- Need to verify current official package names

## Network Property Change

AppKit uses `networks` instead of `chains`:
- Import from `@reown/appkit/networks` instead of wagmi/chains
- Need to verify if this affects our connector integration

## Next Actions

1. **Verify Current Packages**
   - Check npm for official AppKit packages
   - Confirm wagmi v2 compatibility
   - Get latest version numbers

2. **Create AppKit Example**
   - New directory: `src/examples/appkit/`
   - Install AppKit packages
   - Configure with our existing unicornConnector
   - Test all features

3. **Write Integration Guide**
   - Step-by-step setup
   - Code examples
   - Migration from Web3Modal v2
   - Comparison showing zero changes

4. **Update Main Documentation**
   - Recommend AppKit as primary Web3Modal solution
   - Keep v2 docs as legacy

## Timeline

- **Immediate**: Research AppKit setup and packages
- **Next**: Create working AppKit example
- **Then**: Write documentation
- **Finally**: Publish package update

## Notes

- User interrupted WebFetch to docs.reown.com - may want to provide their own research or has privacy preferences
- Web3Modal v2 work is not wasted - still valuable for legacy dApps
- This approach gives users two options:
  - Modern: AppKit (zero changes)
  - Legacy: Web3Modal v2 (with documented workarounds)

---

**Status:** Ready to proceed with AppKit integration research and testing
