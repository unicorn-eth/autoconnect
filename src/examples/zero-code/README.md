# Zero-Code Integration Example

This example demonstrates the **absolute simplest way** to use @unicorn/autoconnect - just import pre-built components and use them!

## 🎯 What This Shows

- ✅ **Pre-built transaction buttons** - No custom transaction logic needed
- ✅ **Pre-built signing buttons** - Message signing with one line
- ✅ **Automatic UI handling** - Loading states, success/error messages built-in
- ✅ **Zero configuration** - Components handle everything internally
- ✅ **Works with both wallet types** - Unicorn and standard wallets

## 🚀 Quick Start

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

## 💡 Key Difference from Other Examples

| Example | Complexity | What You Write |
|---------|-----------|----------------|
| **Zero-Code** | Lowest | Just use pre-built buttons |
| Basic | Low | Display wallet info |
| Advanced | Medium | Custom transaction logic |

## 📦 What's Included

### Pre-Built Components

#### 1. UnicornTransactionButton
```jsx
<UnicornTransactionButton
  transaction={{
    to: '0x...',
    value: '1000000000000000', // 0.001 ETH
    data: '0x...'
  }}
  onSuccess={(result) => console.log('Sent!', result)}
  onError={(error) => console.error('Failed:', error)}
>
  Send Transaction
</UnicornTransactionButton>
```

**Features:**
- ✅ Automatic approval dialog for Unicorn users
- ✅ Standard wallet popup for MetaMask/others
- ✅ Built-in loading states
- ✅ Success/error message display
- ✅ Transaction hash display

#### 2. UnicornSignButton
```jsx
<UnicornSignButton
  message="Sign this to verify ownership"
  onSuccess={(signature) => console.log('Signed!', signature)}
  onError={(error) => console.error('Failed:', error)}
>
  Sign Message
</UnicornSignButton>
```

**Features:**
- ✅ EIP-191 signing support
- ✅ Built-in loading states
- ✅ Signature display
- ✅ Works with both wallet types

### Example Transactions

#### USDC Transfer
```jsx
const usdcTransaction = {
  to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  value: '0',
  data: '0xa9059cbb' + // transfer(address,uint256)
        recipientAddress.padStart(64, '0') +
        amount.toString(16).padStart(64, '0')
};
```

#### ETH Transfer
```jsx
const ethTransaction = {
  to: recipientAddress,
  value: '1000000000000000', // 0.001 ETH in wei
  data: '0x'
};
```

## 🎓 When to Use This Example

Use zero-code integration when you:
- 🚀 Want the absolute quickest setup
- 🎨 Don't need custom transaction UI
- 📦 Just want basic send/sign functionality
- 🎯 Are prototyping or testing

**Next Step**: Check out the `advanced` example if you need custom transaction logic!

## 🔧 Customization

Even with pre-built components, you can customize:

### Button Styling
```jsx
<UnicornTransactionButton
  transaction={tx}
  style={{
    background: '#0ea5e9',
    borderRadius: '12px',
    fontSize: '16px',
    padding: '16px 32px'
  }}
>
  Custom Styled Button
</UnicornTransactionButton>
```

### Button Content
```jsx
<UnicornSignButton message={msg}>
  🔐 Verify Your Identity
</UnicornSignButton>
```

## 🧪 Testing Scenarios

### Scenario 1: Unicorn Wallet (Gasless)
1. Visit with Unicorn URL parameters
2. Click "Send 0.01 USDC"
3. **Approval dialog appears** ✅
4. Click "Confirm"
5. Transaction sent (no gas!)
6. Success message shown

### Scenario 2: MetaMask (Standard)
1. Visit normally
2. Connect MetaMask
3. Click "Send 0.001 ETH"
4. **MetaMask popup appears** ✅
5. Approve in MetaMask
6. Transaction sent (gas required)
7. Success message shown

### Scenario 3: Message Signing
1. Connect any wallet
2. Click "Sign Verification Message"
3. Approve signature request
4. Signature displayed in UI

## 📊 Component Props Reference

### UnicornTransactionButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `transaction` | `object` | Yes | Transaction object with `to`, `value`, `data` |
| `onSuccess` | `function` | No | Called when transaction succeeds |
| `onError` | `function` | No | Called when transaction fails |
| `children` | `ReactNode` | No | Button text/content |
| `style` | `object` | No | Custom button styles |

### UnicornSignButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | Message to sign |
| `onSuccess` | `function` | No | Called with signature on success |
| `onError` | `function` | No | Called with error on failure |
| `children` | `ReactNode` | No | Button text/content |
| `style` | `object` | No | Custom button styles |

## 💡 Pro Tips

1. **Always provide callbacks** - Use `onSuccess` and `onError` to handle results
2. **Test both wallet types** - Make sure your transactions work with standard wallets too
3. **Use appropriate button text** - Make it clear what the button does
4. **Handle errors gracefully** - Display user-friendly error messages
5. **Show transaction hashes** - Let users track their transactions

## 🐛 Troubleshooting

### Button is disabled
- ✅ Check wallet is connected
- ✅ Verify transaction object is valid
- ✅ Wait for any pending transactions

### Approval dialog not showing (Unicorn)
- ✅ Verify `enableTransactionApproval={true}` in UnicornAutoConnect
- ✅ Check console for errors
- ✅ Make sure accessed via Unicorn URL

### MetaMask popup not appearing
- ✅ Check transaction parameters are valid
- ✅ Verify correct network selected
- ✅ Make sure wallet is unlocked

## 📚 What You'll Learn

By studying this example, you'll understand:

1. **How to use pre-built components** - Import and use immediately
2. **Transaction handling** - Both USDC and ETH transfers
3. **Message signing** - EIP-191 signatures
4. **Callback patterns** - Handle success/error cases
5. **Minimal setup** - Get running in minutes

## 🎨 UI Features

The pre-built buttons include:

- **Loading States**: "⏳ Processing..." / "⏳ Signing..."
- **Success Messages**: "✅ Transaction successful!" with hash
- **Error Messages**: "❌ Failed: [reason]"
- **Wallet Type Indicators**: 🦄 for Unicorn, standard for others
- **Disabled States**: Grayed out when wallet not connected

## 🔗 Related Examples

- [Basic Example](../basic/) - Simple wallet connection display
- [Advanced Example](../advanced/) - Custom transaction logic
- [Migration Example](../migration/) - Upgrade from manual files

## 📦 Installation

To use these components in your own app:

```bash
npm install @unicorn/autoconnect
```

```jsx
import {
  UnicornAutoConnect,
  UnicornTransactionButton,
  UnicornSignButton
} from '@unicorn/autoconnect';
```

---

**This is the easiest way to integrate Unicorn!** 🦄