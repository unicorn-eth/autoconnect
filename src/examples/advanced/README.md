# Advanced Integration Example

This example demonstrates **all features and capabilities** of @unicorn.eth/autoconnect.

## 🚀 What This Shows

- ✅ Everything from basic example, PLUS:
- ✅ Transaction handling (both wallet types)
- ✅ Multi-chain support (Base, Polygon, Arbitrum)
- ✅ Callbacks (onConnect, onError)
- ✅ Connection logging
- ✅ Debug mode
- ✅ Custom timeout
- ✅ Transaction status UI
- ✅ Loading states
- ✅ Error handling

## 🎯 Quick Start

```bash
# Install dependencies
pnpm install

# Run the example
pnpm run dev

# Or run in Unicorn mode directly
pnpm run dev:unicorn
```

Visit:
- **Normal mode**: http://localhost:3000
- **Unicorn mode**: http://localhost:3000/?walletId=inApp&authCookie=test

## 📝 What's Included

### Full Configuration

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="base"
  timeout={10000}
  debug={true}
  onConnect={(wallet) => {
    logConnection('✅ Unicorn wallet connected');
    console.log('Wallet object:', wallet);
  }}
  onError={(error) => {
    logConnection(`❌ AutoConnect failed: ${error.message}`);
  }}
/>
```

### Transaction Handling

```jsx
const handleTransaction = async () => {
  if (wallet.isUnicorn) {
    // Gasless transaction via Unicorn
    await wallet.unicornWallet.sendTransaction(tx);
  } else if (wallet.isStandard) {
    // Standard transaction with MetaMask
    await sendTransaction(tx);
  }
};
```

### Multi-Chain Configuration

```jsx
const config = getDefaultConfig({
  appName: 'Advanced Example',
  projectId: 'demo-project-id',
  chains: [base, polygon, arbitrum], // Multiple chains!
});
```

## 🎓 Learning Path

Use this example if you:
- 🔧 Need transaction handling
- 🌐 Want multi-chain support
- 📊 Need callbacks and logging
- 🐛 Are debugging integration
- 🏗️ Building production app

**Previous Step**: Check out the `basic` example first if you're new!

## 📦 Environment Variables

Create a `.env` file:

```bash
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🎯 Key Features Demonstrated

### 1. Transaction Handling

Shows how to handle transactions for both wallet types:

**Unicorn Wallet (Gasless)**:
```jsx
if (wallet.isUnicorn) {
  // No popup, no gas fees
  await wallet.unicornWallet.sendTransaction(tx);
}
```

**Standard Wallet (Gas Required)**:
```jsx
if (wallet.isStandard) {
  // MetaMask popup appears
  await sendTransaction(tx);
}
```

### 2. Callbacks

Track connection status:

```jsx
onConnect={(wallet) => {
  // Do something when Unicorn connects
  console.log('Connected:', wallet);
}}

onError={(error) => {
  // Handle errors gracefully
  console.log('Failed:', error);
}}
```

### 3. Debug Mode

See what's happening under the hood:

```jsx
<UnicornAutoConnect debug={true} />
```

This logs:
- Configuration details
- Connection attempts
- Success/failure messages
- Wallet details

### 4. Connection Logging

Live log display showing:
- When wallet connects
- Any errors that occur
- Wallet type and address
- Timestamps

### 5. Transaction Status UI

Shows:
- Loading states while processing
- Success messages with transaction hash
- Error messages if failed
- Different UI for gasless vs. gas-required

## 🧪 Testing Scenarios

### Scenario 1: Standard Wallet (MetaMask)
1. Visit `http://localhost:3000`
2. Click "Connect Wallet"
3. Choose MetaMask
4. Click "Send Demo Transaction"
5. **MetaMask popup appears** ✅
6. Approve transaction
7. Transaction sent on-chain

### Scenario 2: Unicorn Wallet (Gasless)
1. Visit `http://localhost:3000/?walletId=inApp&authCookie=test`
2. Wallet auto-connects (check logs)
3. Click "Send Demo Transaction"
4. **No popup** ✅
5. Transaction completes instantly
6. Gasless!

### Scenario 3: Multi-Chain
1. Switch networks in your wallet
2. App continues to work
3. Transactions work on all supported chains

### Scenario 4: Error Handling
1. Visit Unicorn URL with invalid cookie
2. AutoConnect fails silently
3. No error shown to user
4. Manual connection still available

## 📊 What You'll Learn

By studying this example, you'll understand:

1. **How to configure all options** - Every prop and parameter
2. **How to handle transactions** - Both wallet types
3. **How to use callbacks** - Track connection state
4. **How to debug** - Enable debug mode
5. **How to build production UI** - Loading, errors, success
6. **How to support multi-chain** - Multiple networks

## 🎨 UI Components

The example includes:

- **WalletDetails**: Shows connection info in a grid
- **TransactionDemo**: Interactive transaction testing
- **ConnectionLog**: Live log of connection events
- **Status Cards**: Visual wallet status indicators

All components use `useUniversalWallet()` for unified wallet access.

## 🔧 Customization

This example is fully customizable. You can:

- Change chains in Wagmi config
- Adjust timeout values
- Modify callback behavior
- Style components differently
- Add more features

## 📚 Learn More

- [Basic Example](../basic/) - Start here if new
- [Migration Example](../migration/) - Upgrade from manual files
- [Documentation](../../README.md) - Full package docs
- [GitHub](https://github.com/YOUR_USERNAME/autoconnect) - Source code

## 💡 Pro Tips

1. **Always check `wallet.isConnected`** before transactions
2. **Use `wallet.isUnicorn`** to show gasless UI indicators
3. **Enable debug mode** during development
4. **Test both wallet types** before deploying
5. **Handle errors gracefully** - don't break user experience

## 🐛 Common Issues

### Transaction doesn't execute
- Check wallet is connected: `wallet.isConnected`
- Verify network/chain is correct
- Check browser console for errors

### MetaMask popup doesn't appear
- Make sure using `useSendTransaction` from Wagmi
- Check transaction params are valid
- Verify wallet is connected

### Callbacks not firing
- Check callback functions are defined
- Enable debug mode to see what's happening
- Verify event listeners are set up correctly

---

**Ready for production?** This example shows you everything you need! 🚀