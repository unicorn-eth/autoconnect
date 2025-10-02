# Basic Integration Example

This is the **simplest possible integration** of @unicorn.eth/autoconnect into an existing dApp.

## 🎯 What This Shows

- ✅ Minimal 2-minute setup
- ✅ Single line addition to App.jsx
- ✅ Basic wallet connection display
- ✅ Zero breaking changes to existing code

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run the example
pnpm run dev
```

Visit:
- **Normal mode**: http://localhost:3000
- **Unicorn mode**: http://localhost:3000/?walletId=inApp&authCookie=test

## 📝 What's Included

### Minimal Configuration

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="base"
/>
```

### Simple Wallet Display

```jsx
const wallet = useUniversalWallet();

{wallet.isConnected ? (
  <div>
    <p>✅ Connected</p>
    <p>Address: {wallet.address}</p>
    {wallet.isUnicorn && <p>⚡ Gasless enabled</p>}
  </div>
) : (
  <ConnectButton />
)}
```

## 🎓 Learning Path

Start here if you:
- 🆕 Are new to @unicorn.eth/autoconnect
- ⚡ Want the quickest integration
- 📦 Just need basic wallet connection
- 🎯 Are building a proof of concept

**Next Step**: Check out the `advanced` example for transactions and more features!

## 📦 Environment Variables

Create a `.env` file:

```bash
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🎯 Key Takeaways

1. **One line addition**: Just add `<UnicornAutoConnect />` to your App
2. **Use the hook**: Replace `useAccount()` with `useUniversalWallet()`
3. **Everything works**: Existing wallets continue to work normally

That's it! Your app now supports Unicorn AutoConnect.

## 📚 Learn More

- [Advanced Example](../advanced/) - See all features
- [Migration Example](../migration/) - Upgrade from manual files
- [Documentation](../../README.md) - Full package docs