# AutoConnect v1.3.4 Release Notes

## 🎉 Major Enhancement: Zero-Code RainbowKit Integration

AutoConnect v1.3.4 eliminates the need for wrapper components! The `UnicornAutoConnect` component now includes automatic wagmi state synchronization, making it truly zero-configuration for both basic wagmi and RainbowKit setups.

---

## ✨ What's New

### 1. Automatic Wagmi State Sync for RainbowKit

The `UnicornAutoConnect` component now automatically detects when wagmi state needs manual synchronization and handles it internally. This means:

- ✅ **No wrapper component needed** for RainbowKit apps
- ✅ **True drop-in integration** - just add `<UnicornAutoConnect />`
- ✅ **Works with both** basic wagmi and RainbowKit setups
- ✅ **Backward compatible** - all existing integrations continue to work

**Before v1.3.4** (RainbowKit apps needed a wrapper):
```tsx
// Had to create custom wrapper component
<UnicornAutoConnectWrapper />
```

**After v1.3.4** (works everywhere):
```tsx
<WagmiProvider config={config}>
  <RainbowKitProvider>
    <UnicornAutoConnect />  {/* That's it! */}
    <YourApp />
  </RainbowKitProvider>
</WagmiProvider>
```

### 2. Enhanced TypeScript Support

- Added `UnicornConnectorOptions` interface for better type safety
- Made `clientId` and `factoryAddress` optional in `UnicornAutoConnectProps`
- All TypeScript definitions now match actual implementation

### 3. Improved Build Configuration

- ✅ Removed platform-specific `@rollup/rollup-linux-x64-gnu` dependency
- ✅ Added `typescript` as devDependency (required by tsup)
- ✅ Fixed wagmi import resolution in example apps
- ✅ Now builds successfully on all platforms (macOS ARM64, Linux, Windows)

### 4. Conditional Connector Loading Pattern

Added example pattern for graceful handling of missing environment variables:

```typescript
const connectors = [
  injected({ target: 'metaMask' }),
  walletConnect({ projectId: WC_PROJECT_ID }),
];

// Only add Unicorn connector if environment variables are set
if (process.env.THIRDWEB_CLIENT_ID) {
  connectors.push(
    unicornConnector({
      clientId: process.env.THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.THIRDWEB_FACTORY_ADDRESS,
    })
  );
}
```

This prevents build failures in production when Thirdweb credentials aren't configured.

### 5. React 18 & 19 Compatibility

- ✅ Full support for both React 18 and React 19
- ✅ Updated README with installation guidance for React 19 users
- ✅ Added troubleshooting section for peer dependency warnings

**For React 19 users:**
```bash
npm install @unicorn.eth/autoconnect --legacy-peer-deps
```

---

## 🔧 Technical Details

### How Automatic Wagmi State Sync Works

The enhanced `UnicornAutoConnect` component now:

1. Connects via wagmi's `connectAsync()`
2. Waits for wagmi state to propagate (100ms)
3. **Checks if wagmi state is properly synced**
4. **If not synced, manually updates wagmi state**
5. Calls your `onConnect` callback (if provided)

```javascript
// NEW: Automatic state sync detection
const currentState = config.getState();
const isProperlyConnected = currentState.status === 'connected' &&
                           currentState.current === unicornConnector.uid;

if (!isProperlyConnected) {
  // Automatically sync wagmi state for RainbowKit compatibility
  const provider = await unicornConnector.getProvider?.();
  const account = await provider.getAccount?.();

  await config.setState((state) => {
    const newConnections = new Map(state.connections);
    newConnections.set(unicornConnector.uid, {
      accounts: [account.address],
      chainId: account.chain?.id || chainId,
      connector: unicornConnector,
    });

    return {
      ...state,
      connections: newConnections,
      current: unicornConnector.uid,
      status: 'connected',
    };
  });
}
```

### Callback Props Still Work

The `onConnect` and `onError` callback props are fully functional and backward compatible:

```tsx
<UnicornAutoConnect
  debug={true}
  onConnect={(provider) => {
    console.log('Connected!', provider);
    // Your custom logic here
  }}
  onError={(error) => {
    console.error('Connection failed:', error);
    // Your error handling here
  }}
/>
```

---

## 🐛 Bug Fixes

- Fixed TypeScript type errors with wagmi v2 Connection type (tuple arrays)
- Fixed `chainId` implicit any type errors
- Fixed platform-specific build dependency issues on macOS ARM64
- Fixed Vite module resolution for local file dependencies
- Fixed production build failures when environment variables not set

---

## 📚 Updated Documentation

- **README.md**: Added React version compatibility section
- **README.md**: Added comprehensive troubleshooting guide
- **WORKING_SOLUTION_CONTEXT.md**: Documented all October 2025 fixes
- **Example apps**: Updated with conditional connector loading pattern

---

## 🧪 Testing

All tests passed successfully:

- ✅ Basic wagmi example (no RainbowKit)
- ✅ SporkDAO app (with RainbowKit)
- ✅ onConnect/onError callbacks work correctly
- ✅ Builds succeed on all platforms
- ✅ Production deployments work with missing env vars

---

## 📦 Installation

```bash
# For React 18 projects
npm install @unicorn.eth/autoconnect

# For React 19 projects
npm install @unicorn.eth/autoconnect --legacy-peer-deps
```

---

## 🚀 Migration Guide

### If you're using the wrapper pattern (v1.3.3 and earlier):

**You can now remove your wrapper component!**

**Old code:**
```tsx
// UnicornAutoConnectWrapper.tsx
const handleConnect = async (provider: any) => {
  // Manual wagmi state sync code...
  await config.setState(...);
};

return (
  <UnicornAutoConnect
    onConnect={handleConnect}
  />
);
```

**New code:**
```tsx
// Just use UnicornAutoConnect directly!
<UnicornAutoConnect debug={true} />
```

The manual state sync is now built-in. If you have custom logic in your `onConnect` callback (analytics, logging, etc.), you can still provide it:

```tsx
<UnicornAutoConnect
  debug={true}
  onConnect={(provider) => {
    // Your custom analytics/logging here
    analytics.track('wallet_connected');
  }}
/>
```

---

## 🎯 What's Next

This release achieves the goal documented in WORKING_SOLUTION_CONTEXT.md:

> "Build manual wagmi state sync INTO the `UnicornAutoConnect.jsx` component to eliminate need for wrapper component in RainbowKit apps."

✅ **Goal achieved!** AutoConnect now provides true zero-code integration for both basic wagmi and RainbowKit applications.

---

## 📄 Full Changelog

### Added
- Automatic wagmi state synchronization in UnicornAutoConnect component
- UnicornConnectorOptions TypeScript interface
- Conditional connector loading pattern in examples
- React 18/19 compatibility documentation
- Comprehensive troubleshooting guide in README

### Changed
- Enhanced UnicornAutoConnect to detect and fix wagmi state sync issues
- Made clientId and factoryAddress optional in UnicornAutoConnectProps
- Updated package.json to version 1.3.4
- Updated all documentation with latest patterns

### Fixed
- TypeScript tuple type errors with wagmi v2 Connection type
- Platform-specific rollup dependency issues on macOS ARM64
- Missing typescript devDependency
- Vite module resolution issues with local dependencies
- Production build failures with missing environment variables

### Removed
- Platform-specific @rollup/rollup-linux-x64-gnu dependency
- Need for UnicornAutoConnectWrapper in RainbowKit apps

---

## 📞 Support

- **Issues**: https://github.com/unicorn-eth/autoconnect/issues
- **Documentation**: https://github.com/unicorn-eth/autoconnect#readme

---

**Published**: October 2025
**Version**: 1.3.4
**License**: MIT
