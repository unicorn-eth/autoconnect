# @unicorn.eth/autoconnect - Zero-Code Quick Reference

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

**Need help?** Check the [troubleshooting section](#-troubleshooting) or ask in [Discord](https://discord.gg/unicorn).