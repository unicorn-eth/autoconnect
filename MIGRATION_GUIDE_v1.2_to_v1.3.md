# Migration Guide: v1.2.x → v1.3.0

**Estimated Time:** 30-60 minutes  
**Difficulty:** Medium  
**Breaking Changes:** Yes

## Overview

Version 1.3.0 represents a fundamental shift from custom hooks to native wagmi integration. This guide will walk you through migrating your existing v1.2.x code to v1.3.0.

### What's Changing?

**Core Philosophy Change:**
- **v1.2.x:** Custom hooks (`useUniversalTransaction`, etc.) that wrap both wallet types
- **v1.3.0:** Standard wagmi hooks that work natively with Unicorn connector

**Why This Change?**
- ✅ Simpler API - use standard wagmi patterns
- ✅ Better performance - single state system
- ✅ Easier debugging - standard wagmi DevTools work
- ✅ Future-proof - follows wagmi best practices
- ✅ Copy/paste friendly - works with any wagmi tutorial

## Pre-Migration Checklist

Before starting migration:

- [ ] Backup your code (commit to git)
- [ ] Document all current Unicorn integrations
- [ ] Update to latest v1.2.x (if not already): `npm install @unicorn.eth/autoconnect@1.2.0`
- [ ] Test current functionality
- [ ] Plan downtime (if production app)
- [ ] Read this entire guide

## Step 1: Update Package

```bash
# Update to v1.3.0
npm install @unicorn.eth/autoconnect@1.3.0

# Or with yarn
yarn add @unicorn.eth/autoconnect@1.3.0

# Or with pnpm
pnpm add @unicorn.eth/autoconnect@1.3.0
```

## Step 2: Update Imports

### Hook Imports

**Before (v1.2.x):**
```jsx
import { 
  useUniversalTransaction, 
  useUniversalSignMessage,
  useUniversalWallet 
} from '@unicorn.eth/autoconnect';
```

**After (v1.3.0):**
```jsx
// Remove custom hooks, use standard wagmi hooks
import { 
  useAccount,
  useSendTransaction,
  useWriteContract,
  useReadContract,
  useSignMessage,
  useSignTypedData,
  useSwitchChain,
  useWatchAsset
} from 'wagmi';
```

### Connector Import

**No change - still the same:**
```jsx
import { unicornConnector } from '@unicorn.eth/autoconnect';
```

### Component Imports

**No change - still available:**
```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';
```

## Step 3: Update Hook Usage

### 3.1 Wallet Connection Info

**Before (v1.2.x):**
```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

function WalletInfo() {
  const wallet = useUniversalWallet();
  
  return (
    <div>
      <p>Connected: {wallet.isConnected ? 'Yes' : 'No'}</p>
      <p>Address: {wallet.address}</p>
      <p>Chain: {wallet.chain}</p>
      <p>Type: {wallet.isUnicorn ? 'Unicorn' : 'Standard'}</p>
    </div>
  );
}
```

**After (v1.3.0):**
```jsx
import { useAccount } from 'wagmi';

function WalletInfo() {
  const { address, isConnected, connector, chain } = useAccount();
  const isUnicorn = connector?.id === 'unicorn';
  
  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Address: {address}</p>
      <p>Chain: {chain?.name}</p>
      <p>Type: {isUnicorn ? 'Unicorn' : 'Standard'}</p>
    </div>
  );
}
```

**Key Changes:**
- `useUniversalWallet()` → `useAccount()`
- `wallet.isConnected` → `isConnected`
- `wallet.address` → `address`
- `wallet.chain` → `chain?.name`
- `wallet.isUnicorn` → `connector?.id === 'unicorn'`

### 3.2 Send ETH Transaction

**Before (v1.2.x):**
```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
import { parseEther } from 'viem';

function SendETH() {
  const tx = useUniversalTransaction();
  
  const handleSend = async () => {
    try {
      const result = await tx.sendTransactionAsync({
        to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
        value: parseEther('0.001'),
      });
      console.log('Transaction hash:', result.hash);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <button onClick={handleSend} disabled={tx.isPending}>
      {tx.isPending ? 'Sending...' : 'Send 0.001 ETH'}
    </button>
  );
}
```

**After (v1.3.0):**
```jsx
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

function SendETH() {
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  
  const handleSend = async () => {
    try {
      sendTransaction({
        to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
        value: parseEther('0.001'),
      });
      // Note: Don't await - wagmi handles state updates
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send 0.001 ETH'}
    </button>
  );
}
```

**Key Changes:**
- `useUniversalTransaction()` → `useSendTransaction()`
- `tx.sendTransactionAsync()` → `sendTransaction()`
- Don't await `sendTransaction()` - let wagmi handle state
- `tx.isPending` → `isPending`
- `result.hash` available via wagmi state

### 3.3 Write to Contract

**Before (v1.2.x):**
```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

function TransferToken() {
  const tx = useUniversalTransaction();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const ERC20_ABI = [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }],
    }
  ];
  
  const transfer = async () => {
    await tx.writeContractAsync({
      address: USDC,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: ['0x7049747E615a1C5C22935D5790a664B7E65D9681', 1000000],
    });
  };
  
  return (
    <button onClick={transfer} disabled={tx.isPending}>
      Send 1 USDC
    </button>
  );
}
```

**After (v1.3.0):**
```jsx
import { useWriteContract } from 'wagmi';

function TransferToken() {
  const { writeContract, isPending } = useWriteContract();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const ERC20_ABI = [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }],
    }
  ];
  
  const transfer = () => {
    writeContract({
      address: USDC,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: ['0x7049747E615a1C5C22935D5790a664B7E65D9681', 1000000],
    });
  };
  
  return (
    <button onClick={transfer} disabled={isPending}>
      Send 1 USDC
    </button>
  );
}
```

**Key Changes:**
- `useUniversalTransaction()` → `useWriteContract()`
- `tx.writeContractAsync()` → `writeContract()`
- Don't use `await` - not needed
- `tx.isPending` → `isPending`

### 3.4 Read from Contract

**Before (v1.2.x):**
```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
import { formatUnits } from 'viem';

function TokenBalance() {
  const tx = useUniversalTransaction();
  const wallet = useUniversalWallet();
  const [balance, setBalance] = useState('0');
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const ERC20_ABI = [{
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  }];
  
  const checkBalance = async () => {
    const bal = await tx.readContractAsync({
      address: USDC,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [wallet.address],
    });
    setBalance(formatUnits(bal, 6));
  };
  
  return (
    <div>
      <button onClick={checkBalance}>Check Balance</button>
      <p>Balance: {balance} USDC</p>
    </div>
  );
}
```

**After (v1.3.0):**
```jsx
import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';

function TokenBalance() {
  const { address } = useAccount();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const ERC20_ABI = [{
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  }];
  
  const { data: balance } = useReadContract({
    address: USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  });
  
  return (
    <p>Balance: {balance ? formatUnits(balance, 6) : '0'} USDC</p>
  );
}
```

**Key Changes:**
- `useUniversalTransaction()` → `useReadContract()`
- Automatic fetching - no button needed
- `data` returned directly from hook
- More efficient - wagmi caches results

### 3.5 Sign Message

**Before (v1.2.x):**
```jsx
import { useUniversalSignMessage } from '@unicorn.eth/autoconnect';

function SignMessage() {
  const sign = useUniversalSignMessage();
  const [signature, setSignature] = useState('');
  
  const handleSign = async () => {
    try {
      const sig = await sign.signMessageAsync({
        message: 'Sign to verify ownership',
      });
      setSignature(sig);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleSign} disabled={sign.isPending}>
        Sign Message
      </button>
      {signature && <p>Signature: {signature.slice(0, 20)}...</p>}
    </div>
  );
}
```

**After (v1.3.0):**
```jsx
import { useSignMessage } from 'wagmi';

function SignMessage() {
  const { signMessage, data: signature, isPending } = useSignMessage();
  
  const handleSign = () => {
    signMessage({
      message: 'Sign to verify ownership',
    });
  };
  
  return (
    <div>
      <button onClick={handleSign} disabled={isPending}>
        Sign Message
      </button>
      {signature && <p>Signature: {signature.slice(0, 20)}...</p>}
    </div>
  );
}
```

**Key Changes:**
- `useUniversalSignMessage()` → `useSignMessage()`
- `sign.signMessageAsync()` → `signMessage()`
- Don't use `await` - not needed
- `data` contains signature automatically
- `sign.isPending` → `isPending`

### 3.6 Sign Typed Data

**Before (v1.2.x):**
```jsx
import { useUniversalSignMessage } from '@unicorn.eth/autoconnect';

function SignTypedData() {
  const sign = useUniversalSignMessage();
  
  const domain = {
    name: 'My dApp',
    version: '1',
    chainId: 8453,
    verifyingContract: '0x7049747E615a1C5C22935D5790a664B7E65D9681'
  };
  
  const types = {
    Message: [{ name: 'content', type: 'string' }]
  };
  
  const message = { content: 'Hello, World!' };
  
  const handleSign = async () => {
    await sign.signTypedDataAsync({
      domain,
      types,
      message,
      primaryType: 'Message',
    });
  };
  
  return (
    <button onClick={handleSign} disabled={sign.isPending}>
      Sign Typed Data
    </button>
  );
}
```

**After (v1.3.0):**
```jsx
import { useSignTypedData } from 'wagmi';

function SignTypedData() {
  const { signTypedData, isPending } = useSignTypedData();
  
  const domain = {
    name: 'My dApp',
    version: '1',
    chainId: 8453,
    verifyingContract: '0x7049747E615a1C5C22935D5790a664B7E65D9681'
  };
  
  const types = {
    Message: [{ name: 'content', type: 'string' }]
  };
  
  const message = { content: 'Hello, World!' };
  
  const handleSign = () => {
    signTypedData({
      domain,
      types,
      message,
      primaryType: 'Message',
    });
  };
  
  return (
    <button onClick={handleSign} disabled={isPending}>
      Sign Typed Data
    </button>
  );
}
```

**Key Changes:**
- `useUniversalSignMessage()` → `useSignTypedData()`
- `sign.signTypedDataAsync()` → `signTypedData()`
- Don't use `await` - not needed
- `sign.isPending` → `isPending`

## Step 4: Update Configuration

**No changes needed!** Your existing wagmi + RainbowKit config remains the same:

```jsx
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base, polygon, mainnet],
  ssr: true,
});

// Add Unicorn connector - same as before
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet],
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
    defaultChain: 'base',
  })
);

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Step 5: Update Auto-Connect (If Used)

**No changes needed!** `UnicornAutoConnect` component still works the same:

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UnicornAutoConnect 
            onSuccess={() => console.log('Connected!')}
            onError={(err) => console.error('Failed:', err)}
          />
          <YourApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Step 6: Testing

### 6.1 Test Checklist

- [ ] **Connect Unicorn wallet**
  - Via URL parameters (auto-connect)
  - Via manual button click
  - Check `useAccount()` shows connected state

- [ ] **Connect standard wallet (MetaMask)**
  - Via RainbowKit button
  - Check connection works normally
  - Verify no conflicts with Unicorn

- [ ] **Send ETH transaction**
  - With Unicorn (should show approval dialog)
  - With MetaMask (should show MetaMask popup)
  - Verify transaction completes

- [ ] **Contract interactions**
  - Read contract (both wallets)
  - Write contract (both wallets)
  - Verify results match expected

- [ ] **Message signing**
  - Sign message (both wallets)
  - Sign typed data (both wallets)
  - Verify signatures generated

- [ ] **Chain switching**
  - Switch chains (both wallets)
  - Verify chain updates in UI
  - Verify transactions work on new chain

- [ ] **Disconnect**
  - Disconnect each wallet type
  - Verify clean disconnection
  - Verify reconnection works

- [ ] **Browser refresh**
  - Refresh page while connected
  - Verify reconnection (Unicorn)
  - Verify state preserved

### 6.2 Common Migration Issues

**Issue 1: "Hook not found" errors**

```
Error: useUniversalTransaction is not a function
```

**Solution:** You forgot to replace custom hook with wagmi hook:
```jsx
// Remove this
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

// Add this
import { useSendTransaction } from 'wagmi';
```

---

**Issue 2: Await errors on wagmi hooks**

```
Error: Cannot read properties of undefined
```

**Solution:** Don't await wagmi hooks - they handle state internally:
```jsx
// DON'T do this
await sendTransaction({ to, value });

// DO this
sendTransaction({ to, value });
```

---

**Issue 3: Connector not recognized**

```
connector?.id is undefined
```

**Solution:** Check that you're using `useAccount()` hook:
```jsx
const { connector } = useAccount();
const isUnicorn = connector?.id === 'unicorn';
```

---

**Issue 4: Transaction doesn't complete**

**Solution:** Make sure you're using wagmi state to track completion:
```jsx
const { sendTransaction, isSuccess, isError, error } = useSendTransaction();

useEffect(() => {
  if (isSuccess) console.log('Transaction succeeded!');
  if (isError) console.error('Transaction failed:', error);
}, [isSuccess, isError, error]);
```

## Step 7: Update Tests (If Applicable)

If you have automated tests, update them to use wagmi hooks:

**Before (v1.2.x):**
```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

test('sends ETH transaction', async () => {
  const { result } = renderHook(() => useUniversalTransaction());
  
  await act(async () => {
    await result.current.sendTransactionAsync({ to, value });
  });
  
  expect(result.current.isSuccess).toBe(true);
});
```

**After (v1.3.0):**
```jsx
import { useSendTransaction } from 'wagmi';

test('sends ETH transaction', async () => {
  const { result } = renderHook(() => useSendTransaction());
  
  act(() => {
    result.current.sendTransaction({ to, value });
  });
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## Post-Migration Checklist

After completing migration:

- [ ] All custom hooks replaced with wagmi hooks
- [ ] All `Async` method calls updated (removed async/await pattern)
- [ ] All components tested with Unicorn wallet
- [ ] All components tested with MetaMask
- [ ] Auto-connect working (if used)
- [ ] Chain switching working
- [ ] Approval dialogs appearing for Unicorn
- [ ] No console errors
- [ ] No React warnings
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Team notified of changes

## Rollback Plan

If you encounter critical issues:

```bash
# Rollback to v1.2.x
npm install @unicorn.eth/autoconnect@1.2.0

# Restore from git
git checkout HEAD -- src/
```

**Then:**
1. File a bug report with details
2. Join Discord for support
3. Wait for fix or guidance

## Getting Help

**Migration Support:**
- 💬 Discord: [Join Community](https://discord.gg/unicorn)
- 🐛 GitHub Issues: [Report Problems](https://github.com/YOUR_USERNAME/autoconnect/issues)
- 📧 Email: support@unicorn.eth

**Include in support requests:**
- Current version (v1.2.x specific version)
- Error messages (full stack trace)
- Code snippets showing the issue
- What you've tried

## Summary

**Main Changes:**
1. Remove custom hooks (`useUniversalTransaction`, etc.)
2. Add standard wagmi hooks (`useSendTransaction`, etc.)
3. Remove `Async` suffix from method calls
4. Don't await hook methods (except where wagmi docs say to)
5. Use wagmi state (`isPending`, `isSuccess`, etc.)

**Benefits:**
- ✅ Simpler code - fewer imports, less boilerplate
- ✅ Standard patterns - works like every other wagmi app
- ✅ Better performance - single state system
- ✅ Future-proof - follows wagmi best practices
- ✅ Copy/paste friendly - use any wagmi tutorial

**Time Investment:**
- Small apps: ~30 minutes
- Medium apps: ~1 hour
- Large apps: ~2-3 hours

**Worth it?** Absolutely! v1.3.0's native wagmi integration is a game-changer.

---

**Happy Migrating!** 🦄✨

Questions? Join our Discord or open a GitHub issue. We're here to help!
