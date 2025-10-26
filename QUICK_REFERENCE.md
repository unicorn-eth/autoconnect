# @unicorn.eth/autoconnect v1.2.0

> Add Unicorn AutoConnect to your dApp in 2 minutes - zero breaking changes

Drop-in Unicorn wallet integration for existing web3 apps. Works alongside your existing wallet setup (RainbowKit, Wagmi, etc.) without modifying any code.

## Features

- ✅ **Zero breaking changes** - existing wallets keep working
- ✅ **2-minute setup** - just import and configure
- ✅ **Universal hooks** - one hook works for ALL wallet types (NEW!)
- ✅ **Smart account support** - proper ERC-1271 signature handling (NEW!)
- ✅ **Gasless transactions** - automatic for Unicorn users
- ✅ **TypeScript support** - full type definitions
- ✅ **Production ready** - battle-tested isolation pattern

## What's New in v1.2.0

- 🎯 **Universal Hooks** - `useUniversalTransaction` and `useUniversalSignMessage` work with both wallet types
- 🔐 **Structured Verification** - `verifyMessage` returns detailed context about smart account signatures
- ⚡ **Improved Delegation** - All transactions properly use `unicornWalletWrapper` for approval dialogs
- 🐛 **Bug Fixes** - Fixed chain validation, read operations, and verification issues

## Installation

```bash
npm install @unicorn.eth/autoconnect
# or
yarn add @unicorn.eth/autoconnect
# or
pnpm add @unicorn.eth/autoconnect
```

## Quick Start

### Basic Setup

```jsx
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <YourExistingApp />
          
          {/* Add this one component */}
          <UnicornAutoConnect
            clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
            factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
            defaultChain="base"
            enableTransactionApproval={true}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Add environment variables

```bash
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

**That's it!** Your app now supports both Unicorn and standard wallets.

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
    return <p>Please connect wallet</p>;
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

## Advanced Features

### Contract Interactions

**Read from contracts:**

```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

function TokenBalance() {
  const tx = useUniversalTransaction();
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

### Signature Verification (NEW!)

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

### Full Configuration Example

```jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="base"
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

### Send ETH with Error Handling

```jsx
function SendWithErrorHandling() {
  const tx = useUniversalTransaction();
  const [txHash, setTxHash] = useState('');
  
  const handleSend = async () => {
    try {
      const result = await tx.sendTransactionAsync({
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        value: parseEther('0.001'),
      });
      setTxHash(result.hash || result.transactionHash);
      alert(`✅ Sent! TX: ${result.hash}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert(`❌ Failed: ${error.message}`);
    }
  };
  
  return (
    <div>
      <button onClick={handleSend} disabled={tx.isPending}>
        {tx.isPending ? '⏳ Processing...' : 'Send 0.001 ETH'}
      </button>
      {txHash && <p>Transaction: {txHash}</p>}
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

## How It Works

### Isolated React Root Pattern

The package uses an **isolated React root** to avoid conflicts:

1. Creates a separate React tree for Thirdweb providers
2. Communicates via custom events (no React state conflicts)
3. Zero interference with existing wallet providers
4. No React warnings or errors

### Transaction Delegation

All transaction methods properly delegate to `unicornWalletWrapper.js`:

```javascript
// Inside useUniversalTransaction for Unicorn wallets:
const result = await wallet.unicornWallet.sendTransaction(tx);

// The wrapper handles:
// 1. Approval dialogs (if enabled)
// 2. Thirdweb prepareTransaction
// 3. Proper client and chain setup
// 4. Transaction execution
```

### Environment Detection

AutoConnect only runs when accessed via Unicorn portal:

```
Normal: https://yourapp.com
Unicorn: https://yourapp.com/?walletId=inApp&authCookie=...
```

In normal mode, your existing wallets work exactly as before.

## Troubleshooting

### Transaction Fails with "invalid chain" Error

**Fixed in v1.2.0!** If you see this with older versions:
- Update to v1.2.0
- Ensure you're not passing chain objects in transaction params

### Read Contract Fails with "account.call is not a function"

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
} else if (result.isValid) {
  console.log('EOA signature verified!');
}
```

### Approval Dialog Not Showing

Verify your config:
```jsx
<UnicornAutoConnect
  enableTransactionApproval={true}  // Must be true!
  clientId={...}
  factoryAddress={...}
/>
```

## Migration from v1.0.x

### What Changed

1. **New Universal Hooks** - Use `useUniversalTransaction` and `useUniversalSignMessage`
2. **Structured Verification** - `verifyMessage` returns an object (not boolean)
3. **Bug Fixes** - Chain validation, read operations, and delegation

### Migration Steps

**Before (v1.0.x):**
```jsx
import { useUnicornTransaction } from '@unicorn.eth/autoconnect';
import { useSendTransaction } from 'wagmi';

const unicornTx = useUnicornTransaction();
const wagmiTx = useSendTransaction();

// Had to check wallet type manually
if (wallet.isUnicorn) {
  await unicornTx.sendTransaction(tx);
} else {
  await wagmiTx.sendTransactionAsync(tx);
}
```

**After (v1.2.0):**
```jsx
import { useUniversalTransaction } from '@unicorn.eth/autoconnect';

const tx = useUniversalTransaction();

// Works with both wallet types automatically!
await tx.sendTransactionAsync(tx);
```

**Verification Before:**
```jsx
const isValid = await verifyMessage({ message, signature });
if (isValid) {
  console.log('Valid!');
}
```

**Verification After (v1.2.0):**
```jsx
const result = await verifyMessage({ message, signature });
if (result.isSmartAccount) {
  console.log('Smart account signature');
} else if (result.isValid) {
  console.log('Valid EOA signature!');
}
```

## Best Practices

1. **Always use Universal Hooks** - They handle wallet detection for you
2. **Handle Smart Account Signatures** - Check `result.isSmartAccount` when verifying
3. **Enable Approval Dialogs** - Set `enableTransactionApproval={true}` for better UX
4. **Error Handling** - Always wrap in try-catch and show error messages
5. **Loading States** - Use `isPending` to disable buttons and show feedback
6. **Test Both Wallet Types** - Test with Unicorn AND MetaMask

## Examples

- **Basic Example**: Simple wallet connection and display
- **Advanced Example**: Custom transaction logic with all features
- **Zero-Code Example**: Pre-built components (buttons)
- **Migration Example**: Upgrading from v1.0.x

View all examples: [GitHub Repository](https://github.com/YOUR_USERNAME/autoconnect/tree/main/examples)

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