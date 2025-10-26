# @unicorn.eth/autoconnect v1.2.0

> Add Unicorn AutoConnect to your dApp in 2 minutes - zero breaking changes

Drop-in Unicorn wallet integration for existing web3 apps. Works alongside your existing wallet setup (RainbowKit, Wagmi, etc.) as a standard Wagmi connector.

## Features

- ✅ **Zero breaking changes** - existing wallets keep working
- ✅ **2-minute setup** - just add the connector
- ✅ **Standard Wagmi connector** - works like any other wallet
- ✅ **Universal hooks** - one hook works for ALL wallet types
- ✅ **Smart account support** - proper ERC-1271 signature handling
- ✅ **Gasless transactions** - automatic for Unicorn users
- ✅ **TypeScript support** - full type definitions
- ✅ **Production ready** - battle-tested pattern

## What's New in v1.2.0

- 🎯 **Universal Hooks** - `useUniversalTransaction` and `useUniversalSignMessage` work with both wallet types
- 🔐 **Structured Verification** - `verifyMessage` returns detailed context about smart account signatures
- ⚡ **Improved Delegation** - All transactions properly use `unicornWalletWrapper` for approval dialogs
- 🐛 **Bug Fixes** - Fixed chain validation, read operations, and verification issues

**⚠️ Breaking Changes:** See [Migration Guide](#migration-from-v11x) below

## Installation

```bash
npm install @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

## Quick Start

### Step 1: Add Unicorn Connector

```jsx
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { unicornConnector } from '@unicorn.eth/autoconnect';
import { base, polygon, mainnet } from 'wagmi/chains';

// Create wagmi config with RainbowKit
const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base, polygon, mainnet],
  ssr: true,
});

// Add Unicorn connector to the config
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet],
    options: {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
    }
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

### Step 2: Add Environment Variables

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

**That's it!** Your app now supports Unicorn wallets alongside all your existing wallets.

## How It Works

### Wagmi Connector Pattern

The `unicornConnector` is a **standard Wagmi connector** - just like MetaMask or WalletConnect:

1. **Detects Unicorn Environment** - Only activates when accessed via Unicorn portal
2. **Registers as Connector** - Shows up in RainbowKit wallet list automatically
3. **Works with Wagmi** - All standard Wagmi hooks work normally
4. **Zero Conflicts** - No provider conflicts or React warnings

### Environment Detection

The connector only activates when accessed via Unicorn portal:

```
Normal: https://yourapp.com
        → Standard wallets only

Unicorn: https://yourapp.com/?walletId=inApp&authCookie=...
         → Unicorn + standard wallets
```

In normal mode, your app works exactly as before.

## Universal Hooks (Recommended!)

The `useUniversal*` hooks automatically detect wallet type and handle everything for you.

### useUniversalTransaction

**Send transactions that work with ANY wallet type:**

```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';
import { parseEther } from 'viem';

function SendETH() {
  const tx = useUniversalTransaction();
  
  const handleSend = async () => {
    try {
      const result = await tx.sendTransactionAsync({
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        value: parseEther('0.001'),
      });
      console.log('Transaction sent!', result.hash);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <button onClick={handleSend} disabled={tx.isPending}>
      {tx.isPending ? '⏳ Sending...' : '💸 Send 0.001 ETH'}
    </button>
  );
}
```

**Features:**
- ✅ Automatic wallet type detection
- ✅ Works with Unicorn (gasless) AND MetaMask/WalletConnect
- ✅ Approval dialogs for Unicorn users
- ✅ Standard wallet popups for others
- ✅ Loading states built-in
- ✅ Error handling

### useUniversalSignMessage

**Sign messages with ANY wallet type:**

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
      console.log('Signed!', sig);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleSign} disabled={sign.isPending}>
        {sign.isPending ? '⏳ Signing...' : '✍️ Sign Message'}
      </button>
      {signature && <p>Signature: {signature.slice(0, 20)}...</p>}
    </div>
  );
}
```

**Supports:**
- ✅ EIP-191 personal_sign
- ✅ EIP-712 typed data signing
- ✅ Both EOA and smart account signatures

### useUniversalWallet

**Get wallet information for ANY connected wallet:**

```jsx
import { useUniversalWallet } from '@unicorn.eth/autoconnect';

function WalletInfo() {
  const wallet = useUniversalWallet();
  
  if (!wallet.isConnected) {
    return <ConnectButton />;
  }
  
  return (
    <div>
      <p>Address: {wallet.address}</p>
      <p>Network: {wallet.chain} (ID: {wallet.chainId})</p>
      <p>Type: {wallet.isUnicorn ? '🦄 Unicorn (Gasless)' : '🦊 Standard'}</p>
      <p>Connector: {wallet.connector?.name}</p>
    </div>
  );
}
```

## Configuration

### unicornConnector Options

```typescript
interface UnicornConnectorOptions {
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
  
  // Optional: Enable transaction approval dialogs (default: true)
  enableTransactionApproval?: boolean;
}
```

### Full Configuration Example

```jsx
import { unicornConnector } from '@unicorn.eth/autoconnect';

config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet, arbitrum, optimism],
    options: {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
      defaultChain: 'base',
      timeout: 10000,
      debug: process.env.NODE_ENV === 'development',
      enableTransactionApproval: true,
    }
  })
);
```

## Advanced Features

### Contract Interactions

**Read from contracts:**

```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

function TokenBalance() {
  const tx = useUniversalTransaction();
  const wallet = useUniversalWallet();
  const [balance, setBalance] = useState('0');
  
  const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base
  
  const ERC20_ABI = [{
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  }];
  
  const checkBalance = async () => {
    const bal = await tx.readContractAsync({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [wallet.address],
    });
    setBalance(formatUnits(bal, 6)); // USDC has 6 decimals
  };
  
  return (
    <div>
      <button onClick={checkBalance}>Check USDC Balance</button>
      <p>Balance: {balance} USDC</p>
    </div>
  );
}
```

**Write to contracts:**

```jsx
function TransferToken() {
  const tx = useUniversalTransaction();
  
  const transferUSDC = async () => {
    await tx.writeContractAsync({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: ['0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 1000000], // 1 USDC
    });
  };
  
  return (
    <button onClick={transferUSDC} disabled={tx.isPending}>
      {tx.isPending ? '⏳ Sending...' : 'Send 1 USDC'}
    </button>
  );
}
```

### Signature Verification (NEW in v1.2.0!)

**v1.2.0 returns structured verification results:**

```jsx
import { useUniversalSignMessage } from '@unicorn.eth/autoconnect';

function VerifySignature() {
  const sign = useUniversalSignMessage();
  const [message] = useState('Hello Web3!');
  const [signature, setSignature] = useState('');
  
  const handleSign = async () => {
    const sig = await sign.signMessageAsync({ message });
    setSignature(sig);
  };
  
  const handleVerify = async () => {
    const result = await sign.verifyMessage({ message, signature });
    
    // NEW: Structured response with full context
    if (result.isSmartAccount) {
      console.log('Smart Account (ERC-1271)');
      console.log('Cannot verify client-side');
      console.log('Signature IS valid on-chain');
      alert(`⚠️ ${result.message}`);
    } else if (result.isValid) {
      console.log('EOA signature verified!');
      alert('✅ Signature is valid!');
    } else {
      console.log('Invalid signature');
      alert('❌ Signature is invalid');
    }
  };
  
  return (
    <div>
      <button onClick={handleSign}>Sign Message</button>
      {signature && (
        <button onClick={handleVerify}>Verify Signature</button>
      )}
    </div>
  );
}
```

**Verification Response Structure:**

```typescript
interface VerificationResult {
  isValid: boolean;                    // True if signature is valid
  isSmartAccount: boolean;             // True for Unicorn/smart accounts
  requiresOnChainVerification: boolean; // True if ERC-1271 needed
  standard: 'ECDSA' | 'ERC-1271';     // Signature standard used
  message: string;                     // Human-readable explanation
  error?: string;                      // Optional error details
}
```

**Why smart accounts return `isValid: false`:**
- Smart accounts use **ERC-1271** standard (not ECDSA)
- Verification requires calling a contract (on-chain)
- Cannot be verified client-side like EOA signatures
- The signature IS valid, just can't verify it locally

### Typed Data Signing (EIP-712)

```jsx
function SignTypedData() {
  const sign = useUniversalSignMessage();
  const wallet = useUniversalWallet();
  
  const handleSign = async () => {
    const signature = await sign.signTypedDataAsync({
      domain: {
        name: 'My dApp',
        version: '1',
        chainId: 8453, // Base
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      types: {
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
      },
      primaryType: 'Person',
      message: {
        name: 'Alice',
        wallet: wallet.address,
      },
    });
    
    console.log('Typed data signed:', signature);
  };
  
  return <button onClick={handleSign}>Sign Typed Data</button>;
}
```

## Hook APIs

### useUniversalTransaction

```typescript
interface UniversalTransaction {
  // Send simple ETH transfer
  sendTransactionAsync: (params: {
    to: string;
    value: bigint | string;
    data?: string;
  }) => Promise<TransactionResult>;
  
  // Write to contract
  writeContractAsync: (params: {
    address: string;
    abi: any[];
    functionName: string;
    args?: any[];
    value?: bigint;
  }) => Promise<TransactionResult>;
  
  // Read from contract
  readContractAsync: (params: {
    address: string;
    abi: any[];
    functionName: string;
    args?: any[];
  }) => Promise<any>;
  
  // State
  isPending: boolean;
  isLoading: boolean;
  error: Error | null;
  data: TransactionResult | null;
  isError: boolean;
  isSuccess: boolean;
  
  // Methods
  reset: () => void;
}
```

### useUniversalSignMessage

```typescript
interface UniversalSignMessage {
  // Sign message
  signMessageAsync: (params: {
    message: string;
  }) => Promise<string>;
  
  // Sign typed data (EIP-712)
  signTypedDataAsync: (params: {
    domain: TypedDataDomain;
    types: Record<string, TypedDataField[]>;
    primaryType: string;
    message: Record<string, any>;
  }) => Promise<string>;
  
  // Verify signature (NEW in v1.2.0!)
  verifyMessage: (params: {
    message: string;
    signature: string;
  }) => Promise<VerificationResult>;
  
  // State
  isPending: boolean;
  isLoading: boolean;
  error: Error | null;
  data: string | null;
  signature: string | null;
  isError: boolean;
  isSuccess: boolean;
  
  // Methods
  reset: () => void;
}
```

### useUniversalWallet

```typescript
interface UniversalWallet {
  // Connection state
  isConnected: boolean;
  address: string | undefined;
  chain: string | undefined;
  chainId: number | undefined;
  
  // Wallet type
  isUnicorn: boolean;    // True if using Unicorn (gasless)
  isStandard: boolean;   // True if using standard wallet
  
  // Connector info
  connector: {
    name: string;
    id: string;
  } | null;
  
  // Raw wallet objects
  wagmiAccount: Account;
  unicornWallet: any;
  
  // Methods
  disconnect: () => void;
}
```

## Common Patterns

### Conditional UI Based on Wallet Type

```jsx
function ConditionalFeatures() {
  const wallet = useUniversalWallet();
  const tx = useUniversalTransaction();
  
  if (!wallet.isConnected) {
    return <ConnectButton />;
  }
  
  return (
    <div>
      <h3>Connected: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</h3>
      
      {wallet.isUnicorn && (
        <p style={{ color: 'green' }}>
          ⚡ Gasless transactions enabled!
        </p>
      )}
      
      {wallet.isStandard && (
        <p style={{ color: 'orange' }}>
          ⚠️ Gas fees apply
        </p>
      )}
      
      <button onClick={() => sendTransaction()} disabled={tx.isPending}>
        {wallet.isUnicorn ? '🦄 Send (Free)' : '💰 Send (Pay Gas)'}
      </button>
    </div>
  );
}
```

### ERC20 Token Transfer

```jsx
function SendUSDC() {
  const tx = useUniversalTransaction();
  const wallet = useUniversalWallet();
  
  const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base
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
  
  const sendUSDC = async () => {
    await tx.writeContractAsync({
      address: USDC,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [
        '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        1000000 // 1 USDC (6 decimals)
      ],
    });
  };
  
  return (
    <button onClick={sendUSDC} disabled={tx.isPending}>
      Send 1 USDC
    </button>
  );
}
```

### NFT Minting

```jsx
function MintNFT() {
  const tx = useUniversalTransaction();
  
  const NFT_ABI = [{
    name: 'mint',
    type: 'function',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable',
  }];
  
  const mint = async () => {
    await tx.writeContractAsync({
      address: '0xYourNFTContract',
      abi: NFT_ABI,
      functionName: 'mint',
      args: [1],
      value: parseEther('0.05'), // Mint price
    });
  };
  
  return (
    <button onClick={mint} disabled={tx.isPending}>
      {tx.isPending ? '⏳ Minting...' : '🎨 Mint NFT (0.05 ETH)'}
    </button>
  );
}
```

## Migration from v1.1.x

### ⚠️ Breaking Change: Verification Response

The `verifyMessage` function now returns a structured object instead of a boolean.

### Migration Steps

**Before (v1.1.x):**
```jsx
const isValid = await sign.verifyMessage({ message, signature });

if (isValid) {
  console.log('Valid!');
} else {
  console.log('Invalid');
}
```

**After (v1.2.0):**
```jsx
const result = await sign.verifyMessage({ message, signature });

if (result.isSmartAccount) {
  console.log('Smart account signature');
  console.log('Cannot verify client-side');
} else if (result.isValid) {
  console.log('Valid EOA signature!');
} else {
  console.log('Invalid');
}
```

**Full Migration Checklist:**
- [ ] Update package: `npm install @unicorn.eth/autoconnect@1.2.0`
- [ ] Search for `verifyMessage` calls in your code
- [ ] Change `if (isValid)` to `if (result.isValid)`
- [ ] Add handling for `result.isSmartAccount` (optional but recommended)
- [ ] Test with both wallet types

See [Release Notes](./RELEASE_NOTES_v1.2.0.md) for complete migration guide.

## Troubleshooting

### Unicorn Connector Not Appearing

**Problem**: Unicorn doesn't show in wallet list

**Solution**: Make sure you added the connector:
```jsx
config.connectors.push(
  unicornConnector({
    chains: [base, polygon, mainnet],
    options: { ... }
  })
);
```

### Transaction Fails with "invalid chain" Error

**Fixed in v1.2.0!** If you see this with older versions, update to v1.2.0.

### Read Contract Fails

**Fixed in v1.2.0!** The hook now uses `publicClient.readContract()` instead.

### Signature Shows as Invalid for Unicorn Wallets

**This is expected!** Smart account signatures use ERC-1271:
- Standard ECDSA verification doesn't work
- Returns `isValid: false` with explanation
- The signature IS valid on-chain
- Check `result.isSmartAccount` in the response

```jsx
const result = await sign.verifyMessage({ message, signature });

if (result.isSmartAccount) {
  console.log('Smart account - cannot verify client-side');
  console.log('Signature is valid on-chain via ERC-1271');
}
```

## Best Practices

1. **Use unicornConnector** - Standard Wagmi connector approach
2. **Use Universal Hooks** - They handle wallet detection for you
3. **Handle Smart Account Signatures** - Check `result.isSmartAccount` when verifying
4. **Enable Approval Dialogs** - Better UX for Unicorn users
5. **Error Handling** - Always wrap in try-catch and show error messages
6. **Loading States** - Use `isPending` to disable buttons and show feedback
7. **Test Both Wallet Types** - Test with Unicorn AND MetaMask

## Resources

- **NPM Package**: [@unicorn.eth/autoconnect](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
- **GitHub**: [Source Code](https://github.com/YOUR_USERNAME/autoconnect)
- **Documentation**: [Full Docs](https://github.com/YOUR_USERNAME/autoconnect#readme)
- **Discord**: [Join Community](https://discord.gg/unicorn)

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/YOUR_USERNAME/autoconnect/issues)
- 💬 **Questions**: [Discord Community](https://discord.gg/unicorn)
- 📧 **Email**: support@unicorn.eth

## License

MIT © [Your Name]

---

**Happy Building!** 🦄✨

Built with ❤️ for the Web3 community