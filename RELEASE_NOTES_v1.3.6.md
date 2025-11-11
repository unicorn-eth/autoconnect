# AutoConnect v1.3.6 Release Notes

## 🐛 Critical Wagmi v2 Compatibility Fix

AutoConnect v1.3.6 fixes a critical bug that prevented the `UnicornAutoConnect` component from working with wagmi v2, resolving the `config.getState is not a function` error.

---

## ✨ What's Fixed

### Wagmi v2 State Access Compatibility

**Issue**: The `UnicornAutoConnect` component crashed with the error:
```
TypeError: config.getState is not a function
```

**Root Cause**: The component was calling `config.getState()` which doesn't exist in wagmi v2. In wagmi v2, state is accessed as a property (`config.state`), not a method.

**Solution**: Updated the component to use the correct wagmi v2 API:

**Before (Broken)**:
```javascript
const currentState = config.getState();  // ❌ Method doesn't exist in wagmi v2
const isProperlyConnected = currentState.status === 'connected';
```

**After (Fixed)**:
```javascript
const currentState = config.state;  // ✅ Correct property access in wagmi v2
const isProperlyConnected = currentState.status === 'connected';
```

---

## 🔧 Technical Details

### Updated Files

**`src/components/UnicornAutoConnect.jsx`** (Line 140):
- Changed `config.getState()` to `config.state`
- Maintains all existing functionality for state validation
- Preserves RainbowKit compatibility logic

### Why This Matters

The `UnicornAutoConnect` component performs critical state validation to ensure proper connection with RainbowKit and other wagmi-based tools. This fix:

1. ✅ Restores auto-connection functionality for Unicorn wallet URLs
2. ✅ Fixes state synchronization with wagmi v2
3. ✅ Maintains compatibility with `config.setState()` for manual state updates
4. ✅ Preserves all existing features from v1.3.5

---

## 🚀 Usage

No changes to your implementation required! Simply update to v1.3.6:

```bash
npm install @unicorn.eth/autoconnect@1.3.6
```

If you were working around this bug by not using `UnicornAutoConnect`, you can now use it as intended:

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UnicornAutoConnect debug={true} />  {/* ✅ Now works! */}
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## 🔄 Migration Guide

**No migration needed!** This is a backward-compatible bug fix.

If you're using v1.3.5 or earlier:
1. Update to v1.3.6: `npm install @unicorn.eth/autoconnect@1.3.6`
2. If you created workarounds for the `getState` error, you can remove them
3. The `UnicornAutoConnect` component now works as documented

---

## 📄 Full Changelog

### Fixed
- `config.getState is not a function` error in `UnicornAutoConnect` component
- Wagmi v2 compatibility for state access
- Auto-connection now works properly with wagmi v2

### Changed
- Updated state access from `config.getState()` to `config.state` property
- Updated documentation to reflect the fix

### Maintained
- All 17 network support from v1.3.5
- RainbowKit compatibility
- Manual state synchronization logic
- All existing features and functionality

---

## 🧪 Testing

Verified with:
- ✅ Wagmi v2.17.0+
- ✅ URL-based auto-connection
- ✅ RainbowKit integration
- ✅ Manual connector usage
- ✅ All 17 supported networks

---

## 📦 Installation

```bash
# For React 18 projects
npm install @unicorn.eth/autoconnect@1.3.6

# For React 19 projects
npm install @unicorn.eth/autoconnect@1.3.6 --legacy-peer-deps
```

---

## 📞 Support

- **Issues**: https://github.com/unicorn-eth/autoconnect/issues
- **Documentation**: https://github.com/unicorn-eth/autoconnect#readme

---

**Published**: November 2025
**Version**: 1.3.6
**License**: MIT

## Summary

v1.3.6 is a critical bug fix release that resolves wagmi v2 compatibility issues in the `UnicornAutoConnect` component. If you experienced `config.getState is not a function` errors, this update fixes that completely. Update now for full wagmi v2 support! 🎉
