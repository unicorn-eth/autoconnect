# Examples Comparison Guide

Choose the right example for your use case!

## 📊 Quick Comparison

| Feature | Zero-Code | Basic | Advanced | Migration |
|---------|-----------|-------|----------|-----------|
| **Setup Time** | 5 minutes | 10 minutes | 20 minutes | 15 minutes |
| **Complexity** | ⭐ Lowest | ⭐⭐ Low | ⭐⭐⭐ Medium | ⭐⭐ Low |
| **Customization** | Limited | Some | Full | N/A |
| **Best For** | Quick prototypes | Simple apps | Production apps | Upgrades |

## 🎯 Example Details

### Zero-Code Example
**Path**: `examples/zero-code/`

**What it shows:**
- ✅ Pre-built transaction buttons
- ✅ Pre-built signing buttons
- ✅ Automatic UI handling
- ✅ Zero custom logic needed

**Use when:**
- 🚀 You want the absolute quickest setup
- 📦 You just need basic send/sign functionality
- 🎨 You're okay with default UI
- 🎯 You're prototyping or testing

**Code example:**
```jsx
import { 
  UnicornTransactionButton,
  UnicornSignButton 
} from '@unicorn/autoconnect';

// That's it!
<UnicornTransactionButton transaction={tx}>
  Send Transaction
</UnicornTransactionButton>

<UnicornSignButton message={msg}>
  Sign Message
</UnicornSignButton>
```

---

### Basic Example
**Path**: `examples/basic/`

**What it shows:**
- ✅ Minimal integration (one line)
- ✅ Simple wallet display
- ✅ Using useUniversalWallet hook
- ✅ Zero breaking changes

**Use when:**
- 🆕 You're new to @unicorn/autoconnect
- 📱 You only need wallet connection display
- ⚡ You want simplest possible setup
- 🎓 You're learning the basics

**Code example:**
```jsx
import { useUniversalWallet } from '@unicorn/autoconnect';

const wallet = useUniversalWallet();

{wallet.isConnected ? (
  <div>
    Connected: {wallet.address}
    {wallet.isUnicorn && <p>⚡ Gasless!</p>}
  </div>
) : (
  <ConnectButton />
)}
```

---

### Advanced Example
**Path**: `examples/advanced/`

**What it shows:**
- ✅ Custom transaction logic
- ✅ Multi-chain support
- ✅ Callbacks and logging
- ✅ Debug mode
- ✅ Custom UI/UX
- ✅ Full control

**Use when:**
- 🏗️ Building production app
- 🎨 Need custom transaction UI
- 🌐 Supporting multiple chains
- 🔧 Need debugging capabilities
- 💼 Professional development

**Code example:**
```jsx
import { useUniversalWallet } from '@unicorn/autoconnect';

const wallet = useUniversalWallet();
const { sendTransaction } = useSendTransaction();

const handleTx = async () => {
  if (wallet.isUnicorn) {
    // Custom gasless logic
    await wallet.unicornWallet.sendTransaction(tx);
  } else {
    // Custom standard wallet logic
    await sendTransaction(tx);
  }
};
```

---

### Migration Example
**Path**: `examples/migration/`

**What it shows:**
- ✅ Before/after comparison
- ✅ Migration helper script
- ✅ Step-by-step upgrade guide
- ✅ What changed (imports only!)

**Use when:**
- 🔄 Upgrading from manual file copying
- 📂 You have existing integration
- 🎓 Learning what changed
- 🛠️ Need migration tools

**Shows:**
```jsx
// Before: Manual files
import UnicornAutoConnect from './components/UnicornAutoConnect';

// After: NPM package
import { UnicornAutoConnect } from '@unicorn/autoconnect';
```

---

## 🚦 Decision Tree

**START HERE** → Do you already have Unicorn integration?
- **YES** → Use [Migration Example](#migration-example)
- **NO** → Continue...

Do you need custom transaction logic?
- **NO** → Use [Zero-Code Example](#zero-code-example) ✨
- **YES** → Continue...

Are you new to @unicorn/autoconnect?
- **YES** → Start with [Basic Example](#basic-example), then [Advanced Example](#advanced-example)
- **NO** → Jump to [Advanced Example](#advanced-example) 🚀

---

## 📚 Learning Path

### Path 1: Complete Beginner
1. **Basic** (10 min) - Learn the fundamentals
2. **Zero-Code** (5 min) - See pre-built components
3. **Advanced** (20 min) - Build custom logic

### Path 2: Experienced Developer
1. **Advanced** (20 min) - See everything at once
2. **Zero-Code** (5 min) - Quick reference for pre-built components

### Path 3: Existing User
1. **Migration** (15 min) - Upgrade to NPM package
2. **Advanced** (optional) - See new features

---

## 🎨 Feature Matrix

| Feature | Zero-Code | Basic | Advanced |
|---------|-----------|-------|----------|
| **Wallet Connection** | ✅ | ✅ | ✅ |
| **Wallet Display** | ✅ | ✅ | ✅ |
| **Pre-built TX Buttons** | ✅ | ❌ | ❌ |
| **Pre-built Sign Buttons** | ✅ | ❌ | ❌ |
| **Custom TX Logic** | ❌ | ❌ | ✅ |
| **Multi-Chain** | ❌ | ❌ | ✅ |
| **Debug Mode** | ✅ | ✅ | ✅ |
| **Callbacks** | ✅ | ❌ | ✅ |
| **Custom UI** | Limited | ❌ | ✅ |

---

## 💡 Use Case Examples

### Use Case: NFT Minting dApp
**Recommended**: Zero-Code or Advanced

**Why**: You need transaction buttons, and zero-code gives you that immediately. Use Advanced if you want custom minting UI.

### Use Case: Token Dashboard
**Recommended**: Basic

**Why**: You just need to display wallet info and balances. No transactions needed.

### Use Case: DeFi Protocol
**Recommended**: Advanced

**Why**: Complex transaction flows, multiple chains, custom approval logic.

### Use Case: Social dApp
**Recommended**: Zero-Code

**Why**: Just need signing for authentication. Pre-built sign button is perfect.

### Use Case: Portfolio Tracker
**Recommended**: Basic

**Why**: Read-only wallet info. No transactions needed.

---

## 🔧 Customization Levels

### Zero-Code
**Customization**: Low
- ✅ Button styling
- ✅ Button text
- ✅ Callbacks
- ❌ Transaction logic
- ❌ UI layout

### Basic
**Customization**: Medium
- ✅ Display layout
- ✅ Styling
- ❌ Transaction handling
- ❌ Multi-chain

### Advanced
**Customization**: High
- ✅ Everything!
- ✅ Full control over transactions
- ✅ Custom UI/UX
- ✅ Multi-chain logic
- ✅ Error handling

---

## 📝 Code Complexity Comparison

### Zero-Code (Simplest)
```jsx
// Total code: ~10 lines
<UnicornTransactionButton
  transaction={tx}
  onSuccess={handleSuccess}
>
  Send
</UnicornTransactionButton>
```

### Basic (Simple)
```jsx
// Total code: ~30 lines
const wallet = useUniversalWallet();

return (
  <div>
    {wallet.isConnected ? (
      <p>Connected: {wallet.address}</p>
    ) : (
      <ConnectButton />
    )}
  </div>
);
```

### Advanced (Complex)
```jsx
// Total code: ~100+ lines
const wallet = useUniversalWallet();
const { sendTransaction } = useSendTransaction();
const [status, setStatus] = useState('');

const handleTx = async () => {
  setStatus('Processing...');
  try {
    if (wallet.isUnicorn) {
      const result = await wallet.unicornWallet.sendTransaction(tx);
      setStatus('Success!');
    } else {
      await sendTransaction(tx);
    }
  } catch (error) {
    setStatus('Failed: ' + error.message);
  }
};

return (
  <div>
    <button onClick={handleTx}>Send</button>
    {status && <p>{status}</p>}
  </div>
);
```

---

## 🎯 Quick Start Commands

### Zero-Code
```bash
cd examples/zero-code
pnpm install
pnpm run dev
```

### Basic
```bash
cd examples/basic
pnpm install
pnpm run dev
```

### Advanced
```bash
cd examples/advanced
pnpm install
pnpm run dev
```

### Test in Unicorn Mode
```bash
pnpm run dev:unicorn
```

---

## 🚀 Production Readiness

| Example | Production Ready? | Notes |
|---------|------------------|-------|
| **Zero-Code** | ✅ Yes | Perfect for simple apps |
| **Basic** | ✅ Yes | Great for read-only apps |
| **Advanced** | ✅ Yes | Recommended for complex apps |
| **Migration** | ❌ No | Learning tool only |

---

## 🎓 What You'll Learn

### From Zero-Code
- How to use pre-built components
- Transaction approval flow
- Message signing
- Minimal setup

### From Basic
- How to integrate in 2 minutes
- Using useUniversalWallet hook
- Displaying wallet info
- Zero breaking changes principle

### From Advanced
- Custom transaction logic
- Multi-chain support
- Debug mode usage
- Callback patterns
- Production patterns

### From Migration
- Upgrading from manual files
- What changed (imports)
- Migration tools
- Best practices

---

## 🔗 Navigation

- [Zero-Code Example →](./zero-code/README.md)
- [Basic Example →](./basic/README.md)
- [Advanced Example →](./advanced/README.md)
- [Migration Example →](./migration/README.md)
- [Main Documentation →](../../README.md)

---

## 💬 Still Not Sure?

### Quick Questions

**Q: I just want to send transactions quickly**
**A:** Use [Zero-Code Example](#zero-code-example) ✨

**Q: I'm brand new to this package**
**A:** Start with [Basic Example](#basic-example) 🎓

**Q: I need full control over my UI**
**A:** Use [Advanced Example](#advanced-example) 🔧

**Q: I already integrated manually**
**A:** Use [Migration Example](#migration-example) 🔄

**Q: I want to see everything**
**A:** Check all examples in order! 📚

---

**Choose your path and start building!** 🦄