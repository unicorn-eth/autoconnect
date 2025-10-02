# @unicorn.eth/autoconnect

> Add Unicorn AutoConnect to your dApp in 2 minutes - zero breaking changes

Drop-in Unicorn wallet integration for existing web3 apps. Works alongside your existing wallet setup (RainbowKit, Wagmi, etc.) without modifying any code.

## Features

- ✅ **Zero breaking changes** - existing wallets keep working
- ✅ **2-minute setup** - just import and configure
- ✅ **Zero-code option** - pre-built transaction and signing buttons (NEW!)
- ✅ **Unified interface** - one hook for all wallet types
- ✅ **Gasless transactions** - automatic for Unicorn users
- ✅ **TypeScript support** - full type definitions
- ✅ **Production ready** - battle-tested isolation pattern

## Installation

```bash
npm install @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

## Quick Start

### Option 1: Zero-Code Integration (Simplest!)

```jsx
import { 
  UnicornAutoConnect,
  UnicornTransactionButton,
  UnicornSignButton 
} from '@unicorn.eth/autoconnect';

function App() {
  const tx = { to: '0x...', value: '1000', data: '0x' };
  const message = "Sign to verify ownership";

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <YourExistingApp />
        
        {/* Pre-built transaction button - that's it! */}
        <UnicornTransactionButton transaction={tx}>
          Send Transaction
        </UnicornTransactionButton>
        
        {/* Pre-built sign button - that's it! */}
        <UnicornSignButton message={message}>
          Sign Message
        </UnicornSignButton>
        
        {/* Add AutoConnect once */}
        <UnicornAutoConnect
          clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
          factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
          enableTransactionApproval={true}
        />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
```

**That's it!** Full Unicorn support in ~3 lines per feature.

### Option 2: Custom Integration

```jsx
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <YourExistingApp />
        
        {/* Add this one line */}
        <UnicornAutoConnect
          clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
          factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
          defaultChain="base"
        />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

// Use in your components (optional but recommended)
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

function MyComponent() {
  const wallet = useUniversalWallet();
  // Now works with both Unicorn and standard wallets!
}
```

### Add environment variables

```bash
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

**That's it!** Your app now supports Unicorn AutoConnect.

## Pre-Built Components (NEW!)

For the simplest integration, use our pre-built components that handle everything automatically.

### UnicornTransactionButton

Send transactions with automatic loading states, success/error messages, and approval dialogs:

```jsx
import { UnicornTransactionButton } from '@unicorn.eth/autoconnect';

<UnicornTransactionButton
  transaction={{
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    value: '1000000000000000', // 0.001 ETH
    data: '0x'
  }}
  onSuccess={(result) => console.log('Transaction sent!', result)}
  onError={(error) => console.error('Failed:', error)}
  style={{ /* custom styles */ }}
>
  Send 0.001 ETH
</UnicornTransactionButton>
```

**Features:**
- ✅ Automatic loading states ("⏳ Processing...")
- ✅ Success messages with transaction hash
- ✅ Error message display
- ✅ Approval dialogs for Unicorn users
- ✅ Standard wallet popups for MetaMask/others
- ✅ Customizable styling

### UnicornSignButton

Sign messages with automatic handling:

```jsx
import { UnicornSignButton } from '@unicorn.eth/autoconnect';

<UnicornSignButton
  message="Sign to verify ownership"
  onSuccess={(signature) => console.log('Signed!', signature)}
  onError={(error) => console.error('Failed:', error)}
  style={{ /* custom styles */ }}
>
  Sign Message
</UnicornSignButton>
```

**Features:**
- ✅ EIP-191 message signing
- ✅ Automatic loading states
- ✅ Signature display
- ✅ Works with both wallet types
- ✅ Customizable styling

See the [Zero-Code Example](./examples/zero-code/) for complete implementation.

## Configuration

### UnicornAutoConnect Props

```typescript
interface UnicornAutoConnectProps {
  // Required: Your Thirdweb client ID
  clientId: string;
  
  // Required: Smart account factory address
  factoryAddress: string;
  
  // Optional: Default chain (default: 'base')
  defaultChain?: 'base' | 'polygon' | 'ethereum' | 'arbitrum' | 'optimism';
  
  // Optional: Connection timeout in ms (default: 5000)
  timeout?: number;
  
  // Optional: Enable debug logging (default: false)
  debug?: boolean;
  
  // Optional: Enable transaction approval dialogs (default: false)
  enableTransactionApproval?: boolean;
  
  // Optional: Callback when wallet connects
  onConnect?: (wallet: any) => void;
  
  // Optional: Callback when connection fails
  onError?: (error: Error) => void;
}
```

### Usage Example with All Options

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="polygon"
  timeout={10000}
  debug={true}
  enableTransactionApproval={true}
  onConnect={(wallet) => {
    console.log('Unicorn connected!', wallet);
  }}
  onError={(error) => {
    console.log('AutoConnect failed, but other wallets still work');
  }}
/>
```

## useUniversalWallet Hook

The `useUniversalWallet` hook provides a unified interface for both Unicorn and standard wallets.

```typescript
interface UniversalWallet {
  // Connection state
  isConnected: boolean;
  address: string | undefined;
  
  // Wallet info
  connector: { name: string; id: string } | null;
  isUnicorn: boolean;    // True if using Unicorn (gasless)
  isStandard: boolean;   // True if using standard wallet
  
  // Raw wallet objects
  wagmiAccount: Account;
  unicornWallet: any;
  
  // Methods
  disconnect: () => void;
}
```

### Example Usage

```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';
import { useSendTransaction } from 'wagmi';

function MyComponent() {
  const wallet = useUniversalWallet();
  const { sendTransaction } = useSendTransaction();
  
  const handleTransaction = async () => {
    if (!wallet.isConnected) {
      alert('Please connect wallet');
      return;
    }
    
    const tx = {
      to: '0x...',
      value: parseEther('0.01'),
    };
    
    if (wallet.isUnicorn) {
      // Unicorn wallet - gasless
      await wallet.unicornWallet.sendTransaction(tx);
    } else {
      // Standard wallet - requires gas
      await sendTransaction(tx);
    }
  };
  
  return (
    <div>
      {wallet.isConnected ? (
        <div>
          <p>Connected: {wallet.address}</p>
          {wallet.isUnicorn && <p>⚡ Gasless enabled</p>}
          <button onClick={handleTransaction}>
            Send Transaction
          </button>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
```

## Universal Hooks (NEW!)

For custom transaction and signing logic with automatic wallet type handling:

### useUnicornTransaction

```jsx
import { useUnicornTransaction } from '@unicorn.eth/autoconnect';

const { sendTransaction, isLoading, hash, error } = useUnicornTransaction();

await sendTransaction({
  to: '0x...',
  value: '1000',
  data: '0x'
});
```

### useUnicornSignMessage

```jsx
import { useUnicornSignMessage } from '@unicorn.eth/autoconnect';

const { signMessage, signature, isLoading } = useUnicornSignMessage();

const sig = await signMessage("Sign this message");
```

## How It Works

### Isolated React Root Pattern

The package uses an **isolated React root** to avoid conflicts:

1. Creates a separate React tree for Thirdweb providers
2. Communicates via custom events (no React state conflicts)
3. Zero interference with existing wallet providers
4. No React warnings or errors

### Environment Detection

AutoConnect only runs when accessed via Unicorn portal:

```
Normal: https://yourapp.com
Unicorn: https://yourapp.com/?walletId=inApp&authCookie=...
```

In normal mode, your existing wallets work exactly as before.

## Examples

### Zero-Code Example (NEW!)
The simplest possible integration using pre-built components.
- [View Example](./examples/zero-code/)
- Setup time: 2-5 minutes
- Perfect for: Quick prototypes, simple apps

### Basic Example
Minimal integration showing wallet connection.
- [View Example](./examples/basic/)
- Setup time: 10 minutes
- Perfect for: Learning the basics

### Advanced Example
Full featured demonstration with custom transaction logic.
- [View Example](./examples/advanced/)
- Setup time: 20 minutes
- Perfect for: Production apps, complex use cases

### Migration Example
Guide for upgrading from manual file integration.
- [View Example](./examples/migration/)
- Setup time: 15 minutes
- Perfect for: Existing users upgrading to NPM package

## Testing

### Test Normal Mode
```
http://localhost:3000
```
Expected: Existing wallet connections work normally

### Test Unicorn Mode
```
http://localhost:3000/?walletId=inApp&authCookie=test
```
Expected: AutoConnect attempts in background

## Migration Guide

### From Manual Integration

If you previously copied the files manually:

```jsx
// Remove these files:
// - src/components/UnicornAutoConnect.jsx
// - src/hooks/useUniversalWallet.js

// Install package instead:
npm install @unicorn.eth/autoconnect

// Update imports:
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';

// Everything else stays the same!
```

## Peer Dependencies

This package requires:
- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `thirdweb` >= 5.60.0
- `wagmi` >= 2.0.0

These should already be in your project.

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { 
  UniversalWallet, 
  UnicornConfig,
  UnicornTransactionButtonProps,
  UnicornSignButtonProps
} from '@unicorn.eth/autoconnect';
```

## Troubleshooting

### AutoConnect not running?
Check URL parameters - must have `?walletId=inApp&authCookie=...`

### React warnings?
The isolated root pattern should prevent these. If you see warnings, please open an issue.

### Transactions not working?
- **Unicorn**: Check Thirdweb configuration
- **Standard**: Use Wagmi's `useSendTransaction` hook

### Pre-built buttons disabled?
- Check wallet is connected: `wallet.isConnected`
- Verify transaction object is valid
- Ensure message string is provided for signing

### Approval dialog not showing?
- Set `enableTransactionApproval={true}` in UnicornAutoConnect
- Check console for errors
- Enable debug mode

## Support

- **GitHub Issues**: [Report bugs](https://github.com/MyUnicornAccount/autoconnect/issues)
- **Discord**: [Join #developers](https://discord.gg/unicorn)
- **Docs**: [Full documentation](https://docs.unicorn.eth)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License - see [LICENSE](LICENSE)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

**Built by Unicorn.eth - Enhance existing apps without breaking anything.** 🦄# @unicorn.eth/autoconnect - Zero-Code Quick Reference

## 🚀 Installation

```bash
npm install @unicorn.eth/autoconnect
```

## ⚡ 3-Line Transaction

```jsx
import { UnicornTransactionButton } from '@unicorn.eth/autoconnect';

<UnicornTransactionButton transaction={{ to: '0x...', value: '1000', data: '0x' }}>
  Send
</UnicornTransactionButton>
```

## ✍️ 3-Line Signing

```jsx
import { UnicornSignButton } from '@unicorn.eth/autoconnect';

<UnicornSignButton message="Sign this">
  Sign
</UnicornSignButton>
```

## 📦 Full Setup

```jsx
import { 
  UnicornAutoConnect,
  UnicornTransactionButton,
  UnicornSignButton 
} from '@unicorn.eth/autoconnect';

// Your existing app stays the same!
<YourApp>
  {/* Add pre-built buttons anywhere */}
  <UnicornTransactionButton transaction={tx}>Send</UnicornTransactionButton>
  <UnicornSignButton message={msg}>Sign</UnicornSignButton>
  
  {/* Add AutoConnect once */}
  <UnicornAutoConnect
    clientId="your_id"
    factoryAddress="0x..."
    enableTransactionApproval={true}
  />
</YourApp>
```

## 🎯 Props Reference

### UnicornTransactionButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `transaction` | `{to, value, data}` | ✅ | Transaction object |
| `onSuccess` | `function` | ❌ | Called with result |
| `onError` | `function` | ❌ | Called with error |
| `children` | `ReactNode` | ❌ | Button text |
| `style` | `object` | ❌ | Custom styles |

### UnicornSignButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | ✅ | Message to sign |
| `onSuccess` | `function` | ❌ | Called with signature |
| `onError` | `function` | ❌ | Called with error |
| `children` | `ReactNode` | ❌ | Button text |
| `style` | `object` | ❌ | Custom styles |

## 💡 Examples

### Send ETH

```jsx
<UnicornTransactionButton
  transaction={{
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    value: '1000000000000000', // 0.001 ETH
    data: '0x'
  }}
  onSuccess={(result) => console.log('Sent!', result)}
>
  Send 0.001 ETH
</UnicornTransactionButton>
```

### Send USDC

```jsx
<UnicornTransactionButton
  transaction={{
    to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    value: '0',
    data: '0xa9059cbb' + // transfer(address,uint256)
          recipientAddress.slice(2).padStart(64, '0') +
          amount.toString(16).padStart(64, '0')
  }}
>
  Send USDC
</UnicornTransactionButton>
```

### Sign Message

```jsx
<UnicornSignButton
  message={`Welcome to my dApp!\n\nSign to verify ownership.\n\nTimestamp: ${Date.now()}`}
  onSuccess={(signature) => console.log('Signature:', signature)}
>
  Verify Ownership
</UnicornSignButton>
```

### Custom Styling

```jsx
<UnicornTransactionButton
  transaction={tx}
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600'
  }}
>
  ✨ Custom Styled Button
</UnicornTransactionButton>
```

## 🎨 Built-in Features

### Automatic UI States

- **Idle**: Ready to click
- **Loading**: "⏳ Processing..." or "⏳ Signing..."
- **Success**: "✅ Transaction successful!" + hash
- **Error**: "❌ Failed: [reason]"

### Wallet Type Indicators

- 🦄 = Unicorn wallet (gasless)
- 💼 = Standard wallet (MetaMask, etc.)

### Automatic Behavior

**For Unicorn Users:**
- Shows approval dialog
- Gasless transactions
- No MetaMask popup

**For Standard Wallet Users:**
- Shows MetaMask popup
- Normal gas payment
- Standard wallet flow

## 🔧 Advanced Usage

### With Callbacks

```jsx
<UnicornTransactionButton
  transaction={tx}
  onSuccess={(result) => {
    console.log('Transaction hash:', result.hash);
    // Update your app state
    // Show custom success message
    // Navigate to success page
  }}
  onError={(error) => {
    console.error('Transaction failed:', error);
    // Log to analytics
    // Show custom error message
    // Handle specific error types
  }}
>
  Send Transaction
</UnicornTransactionButton>
```

### With State Management

```jsx
function MyComponent() {
  const [txResults, setTxResults] = useState([]);
  
  const handleSuccess = (result) => {
    setTxResults(prev => [...prev, result]);
  };
  
  return (
    <div>
      <UnicornTransactionButton
        transaction={tx}
        onSuccess={handleSuccess}
      >
        Send
      </UnicornTransactionButton>
      
      {txResults.map(r => (
        <div key={r.hash}>✅ {r.hash}</div>
      ))}
    </div>
  );
}
```

### Multiple Transactions

```jsx
function MultiTransaction() {
  const transactions = [
    { to: '0x...', value: '1000', data: '0x' },
    { to: '0x...', value: '2000', data: '0x' },
    { to: '0x...', value: '3000', data: '0x' }
  ];
  
  return (
    <div>
      {transactions.map((tx, i) => (
        <UnicornTransactionButton
          key={i}
          transaction={tx}
          onSuccess={(r) => console.log(`TX ${i} sent:`, r)}
        >
          Send Transaction {i + 1}
        </UnicornTransactionButton>
      ))}
    </div>
  );
}
```

### Conditional Rendering

```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

function ConditionalButton() {
  const wallet = useUniversalWallet();
  
  return (
    <div>
      {wallet.isConnected ? (
        <UnicornTransactionButton transaction={tx}>
          {wallet.isUnicorn ? '🦄 Send (Free)' : '💰 Send (Gas Required)'}
        </UnicornTransactionButton>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
```

## 🎯 Common Patterns

### ERC20 Token Transfer

```jsx
function sendERC20(tokenAddress, recipient, amount) {
  const data = '0xa9059cbb' + // transfer(address,uint256)
               recipient.slice(2).padStart(64, '0') +
               amount.toString(16).padStart(64, '0');
  
  return {
    to: tokenAddress,
    value: '0',
    data: data
  };
}

<UnicornTransactionButton 
  transaction={sendERC20(
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    10000 // 0.01 USDC (6 decimals)
  )}
>
  Send USDC
</UnicornTransactionButton>
```

### Contract Interaction

```jsx
function callContract(contractAddress, methodData) {
  return {
    to: contractAddress,
    value: '0',
    data: methodData // encoded function call
  };
}

<UnicornTransactionButton
  transaction={callContract(
    '0x...', 
    '0x...' // your encoded method call
  )}
>
  Call Contract
</UnicornTransactionButton>
```

### NFT Minting

```jsx
const mintNFT = {
  to: NFT_CONTRACT_ADDRESS,
  value: parseEther('0.05'), // mint price
  data: encodeFunctionData({
    abi: contractAbi,
    functionName: 'mint',
    args: [1] // quantity
  })
};

<UnicornTransactionButton transaction={mintNFT}>
  Mint NFT
</UnicornTransactionButton>
```

## 🐛 Troubleshooting

### Button Always Disabled

**Problem**: Button is grayed out even when wallet connected

**Solution**: 
```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

const wallet = useUniversalWallet();
console.log('Connected:', wallet.isConnected);
console.log('Address:', wallet.address);
```

### Approval Dialog Not Showing

**Problem**: Unicorn transactions send without approval

**Solution**: Verify AutoConnect config:
```jsx
<UnicornAutoConnect
  clientId={...}
  factoryAddress={...}
  enableTransactionApproval={true}  // Must be true!
/>
```

### Transaction Fails Silently

**Problem**: No error message displayed

**Solution**: Add error callback:
```jsx
<UnicornTransactionButton
  transaction={tx}
  onError={(error) => {
    console.error('Error:', error);
    alert(`Failed: ${error.message}`);
  }}
>
  Send
</UnicornTransactionButton>
```

### Signature Invalid

**Problem**: Signature doesn't validate

**Check**:
- Message format (must be exact)
- EIP-191 standard used
- Address matches signer

## 📱 Mobile Considerations

### Touch-Friendly Buttons

```jsx
<UnicornTransactionButton
  transaction={tx}
  style={{
    padding: '16px 32px',    // Larger touch target
    fontSize: '16px',        // Readable on mobile
    width: '100%',           // Full width on mobile
    minHeight: '48px'        // iOS minimum
  }}
>
  Send Transaction
</UnicornTransactionButton>
```

### Responsive Layout

```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px'
}}>
  <UnicornTransactionButton transaction={tx1}>
    Send ETH
  </UnicornTransactionButton>
  <UnicornTransactionButton transaction={tx2}>
    Send USDC
  </UnicornTransactionButton>
</div>
```

## 🎨 Styling Examples

### Gradient Button

```jsx
<UnicornTransactionButton
  transaction={tx}
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
  }}
>
  ✨ Send Transaction
</UnicornTransactionButton>
```

### Outlined Button

```jsx
<UnicornSignButton
  message={msg}
  style={{
    background: 'transparent',
    border: '2px solid #8b5cf6',
    borderRadius: '8px',
    color: '#8b5cf6',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600'
  }}
>
  🔐 Sign Message
</UnicornSignButton>
```

### Icon Button

```jsx
<UnicornTransactionButton
  transaction={tx}
  style={{
    background: '#10b981',
    border: 'none',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
  }}
>
  📤
</UnicornTransactionButton>
```

## 🔗 Related Hooks

### useUnicornTransaction

For custom transaction logic:

```jsx
import { useUnicornTransaction } from '@unicorn.eth/autoconnect';

const { sendTransaction, isLoading, hash, error } = useUnicornTransaction();

const handleClick = async () => {
  await sendTransaction({
    to: '0x...',
    value: '1000',
    data: '0x'
  });
};
```

### useUnicornSignMessage

For custom signing logic:

```jsx
import { useUnicornSignMessage } from '@unicorn.eth/autoconnect';

const { signMessage, signature, isLoading } = useUnicornSignMessage();

const handleClick = async () => {
  const sig = await signMessage("Sign this");
  console.log('Signature:', sig);
};
```

### useUniversalWallet

For wallet information:

```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

const wallet = useUniversalWallet();

console.log('Connected:', wallet.isConnected);
console.log('Address:', wallet.address);
console.log('Is Unicorn:', wallet.isUnicorn);
console.log('Connector:', wallet.connector?.name);
```

## 📚 Resources

- **Examples**: [View Examples](https://github.com/YOUR_USERNAME/autoconnect/tree/main/examples)
- **Full Docs**: [Documentation](https://github.com/YOUR_USERNAME/autoconnect#readme)
- **NPM Package**: [@unicorn.eth/autoconnect](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
- **Discord**: [Join Community](https://discord.gg/unicorn)

## 🎓 Learning Path

1. **Start Here**: Zero-code example (this guide)
2. **Next**: [Basic example](../examples/basic/) - Wallet display
3. **Then**: [Advanced example](../examples/advanced/) - Custom logic
4. **Finally**: Build your own app!

## ⚡ Quick Tips

1. Always provide `onSuccess` and `onError` callbacks
2. Use `wallet.isUnicorn` to show gasless indicators
3. Test with both Unicorn and standard wallets
4. Enable `debug={true}` during development
5. Style buttons to match your app's design

## 🎉 That's It!

You now have everything you need for zero-code Unicorn integration.

**Happy Building!** 🦄

---

**Need help?** Check the [troubleshooting section](#-troubleshooting) 