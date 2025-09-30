# Migration Example

This example shows how to migrate from manual file copying to using the NPM package.

## Before: Manual Integration

```jsx
// Old way - copying files manually
import UnicornAutoConnect from './components/UnicornAutoConnect';
import { useUniversalWallet } from './hooks/useUniversalWallet';
```

**Problems:**
- 😰 Need to copy/paste files
- 😰 Manual updates when bugs are fixed
- 😰 No version control
- 😰 Missing TypeScript definitions

## After: NPM Package

```jsx
// New way - install from NPM
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn/autoconnect';
```

**Benefits:**
- ✅ `npm install` - done!
- ✅ `npm update` gets latest fixes
- ✅ Semantic versioning
- ✅ Full TypeScript support

## Step-by-Step Migration

### 1. Install the package

```bash
npm install @unicorn/autoconnect
# or
yarn add @unicorn/autoconnect
# or
pnpm add @unicorn/autoconnect
```

### 2. Remove old files

Delete these files from your project:
```
src/
├── components/
│   └── UnicornAutoConnect.jsx  ❌ DELETE
└── hooks/
    └── useUniversalWallet.js   ❌ DELETE
```

### 3. Update imports

```diff
// In your App.jsx
- import UnicornAutoConnect from './components/UnicornAutoConnect';
+ import { UnicornAutoConnect } from '@unicorn/autoconnect';

// In your components
- import { useUniversalWallet } from './hooks/useUniversalWallet';
+ import { useUniversalWallet } from '@unicorn/autoconnect';
```

### 4. Update your code (if needed)

The API is identical, but if you were using environment detection:

```diff
- import { isUnicornEnvironment } from './utils/environment';
+ import { isUnicornEnvironment } from '@unicorn/autoconnect';
```

### 5. Test

```bash
npm run dev
```

Visit these URLs to test:
- Normal: `http://localhost:3000`
- Unicorn: `http://localhost:3000/?walletId=inApp&authCookie=test`

### 6. Done! 🎉

Your app now uses the official package. Future updates are just:

```bash
npm update @unicorn/autoconnect
```

## What Stays the Same

✅ All your existing code works unchanged
✅ Same component props
✅ Same hook API
✅ Same behavior
✅ Zero breaking changes

## What Gets Better

✨ Automatic updates via NPM
✨ TypeScript definitions included
✨ Bug fixes without manual file copying
✨ Smaller bundle size (better tree-shaking)
✨ Official support

## Troubleshooting

### Import errors after migration?

Make sure you installed the package:
```bash
npm install @unicorn/autoconnect
```

### TypeScript errors?

The package includes types. Restart your TypeScript server:
- VS Code: `Cmd+Shift+P` → "Restart TS Server"

### Still using old imports?

Search your codebase for old imports:
```bash
grep -r "from './components/UnicornAutoConnect'" src/
grep -r "from './hooks/useUniversalWallet'" src/
```

Replace all with package imports.

## Example: Before & After

### Before (Manual Files)

```jsx
// App.jsx
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import UnicornAutoConnect from './components/UnicornAutoConnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <MyApp />
        <UnicornAutoConnect
          clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
          factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
        />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
```

```jsx
// MyComponent.jsx
import { useUniversalWallet } from './hooks/useUniversalWallet';

function MyComponent() {
  const wallet = useUniversalWallet();
  // ...
}
```

### After (NPM Package)

```jsx
// App.jsx
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { UnicornAutoConnect } from '@unicorn/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <MyApp />
        <UnicornAutoConnect
          clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
          factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
        />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
```

```jsx
// MyComponent.jsx
import { useUniversalWallet } from '@unicorn/autoconnect';

function MyComponent() {
  const wallet = useUniversalWallet();
  // ...
}
```

**That's it!** Just change the imports. Everything else stays identical.

## Questions?

- **GitHub Issues**: [Report problems](https://github.com/MyUnicornAccount/autoconnect/issues)
- **Discord**: [Get help](https://discord.gg/unicorn)
- **Documentation**: [Read the docs](https://docs.unicorn.eth)