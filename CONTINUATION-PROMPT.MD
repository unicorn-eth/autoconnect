# Continuation Prompt for @unicorn.eth/autoconnect v1.3.0

## Project Context

I'm working on **@unicorn.eth/autoconnect v1.3.0**, an NPM package that provides true zero-code Unicorn wallet integration for existing dApps. v1.3 achieves native wagmi integration - developers can copy/paste standard wagmi tutorial code and it works identically with Unicorn wallets, MetaMask, and other connectors.

### Core Architecture
- **Wagmi v2 Connector**: `unicornConnector` - Standard wagmi connector following `createConnector()` pattern
- **Provider Wrapping**: Intercepts `provider.request()` to show approval dialogs for transactions/signing
- **Auto-Connect**: `UnicornAutoConnect.jsx` - Automatic connection via URL parameters
- **Approval Dialog**: `UnicornTransactionApproval.jsx` - Beautiful UI for transaction confirmation

### Tech Stack
- Wagmi v2 + Viem v2
- RainbowKit v2
- Thirdweb SDK v5
- React 18
- Base + Polygon + Ethereum (extensible to other chains)

## Current Status (v1.3.0) ✅

### Working Features
1. ✅ **Native Wagmi Integration** - All standard wagmi hooks work with Unicorn wallets
2. ✅ **Provider Wrapping** - Intercepts requests for approval dialogs
3. ✅ **Auto-Connect** - URL parameter detection and automatic connection
4. ✅ **State Synchronization** - Proper localStorage + wagmi event emission
5. ✅ **Chain Switching** - Smart account chain switching without full reconnection
6. ✅ **Transaction Approval** - Beautiful dialog with transaction details
7. ✅ **Message Signing** - Both personal_sign and EIP-712 typed data
8. ✅ **Gasless Transactions** - Built into connector via Thirdweb
9. ✅ **Multi-Chain Support** - Centralized THIRDWEB_CHAIN_MAP configuration

### Key Implementation Details

#### 1. Wagmi v2 Connector Pattern
```javascript
export function unicornConnector(parameters) {
  return createConnector((config) => ({
    id: 'unicorn',
    name: 'Unicorn',
    type: 'injected',
    
    // Standard connector interface
    async connect({ chainId }) { ... },
    async disconnect() { ... },
    async getAccounts() { ... },
    async getChainId() { ... },
    async isAuthorized() { ... },
    async switchChain({ chainId }) { ... },
    
    // Provider with wrapped request method
    async getProvider() {
      return {
        request: async (args) => {
          // Intercept specific methods
          if (args.method === 'eth_sendTransaction') {
            // Show approval, execute via Thirdweb
          }
          // Pass through everything else
        }
      };
    },
    
    // Event handlers
    onAccountsChanged(accounts) { ... },
    onChainChanged(chainId) { ... },
    onConnect(connectInfo) { ... },
    onDisconnect() { ... },
  }));
}
```

#### 2. Provider Wrapping Strategy
All transaction/signing methods are intercepted:
- `eth_sendTransaction` → Show approval → Execute via Thirdweb
- `eth_sign` → Show approval → Sign via Thirdweb
- `eth_signTypedData_v4` → Show approval → Sign via Thirdweb
- `personal_sign` → Show approval → Sign via Thirdweb
- Everything else passes through to original provider

#### 3. Chain Configuration
Centralized in `THIRDWEB_CHAIN_MAP`:
```javascript
const THIRDWEB_CHAIN_MAP = {
  8453: { name: 'base', wagmiChain: base },
  137: { name: 'polygon', wagmiChain: polygon },
  1: { name: 'mainnet', wagmiChain: mainnet },
  // ... more chains
};
```

#### 4. State Synchronization
Three critical localStorage entries for reconnection:
```javascript
// Set on connection
localStorage.setItem(`walletToken-${clientId}`, authCookie);
localStorage.setItem('thirdweb:active-wallet-id', 'inApp');
localStorage.setItem('thirdweb:connected-wallet-ids', JSON.stringify(['inApp']));

// Plus emit wagmi events
config.emitter.emit('connect', { accounts, chainId });
```

#### 5. Auto-Connect Flow
```javascript
// In UnicornAutoConnect.jsx
const params = new URLSearchParams(window.location.search);
const walletId = params.get('walletId');
const authCookie = params.get('authCookie');

if (walletId === 'inApp' && authCookie) {
  // Set localStorage entries
  // Wait for connector setup
  // Call wagmi's connectAsync
}
```

### File Structure
```
@unicorn.eth/autoconnect/
│
├── src/
│   ├── connectors/
│   │   └── unicornConnector.js      # ~300 lines - Core connector
│   │
│   ├── components/
│   │   ├── UnicornAutoConnect.jsx   # ~150 lines - Auto-connect
│   │   └── UnicornTransactionApproval.jsx  # ~350 lines - Approval UI
│   │
│   └── index.js                      # Exports
│
└── examples/
    └── test-app/
        └── App.jsx                   # Complete test suite
```

## Known Limitations

1. **Smart Account Signatures**: No client-side ERC-1271 verification yet
   - Signatures are valid on-chain
   - Client verification shows as invalid
   - Need to add on-chain verification support

2. **Chain Support**: Currently supports 7 chains
   - Easy to add more via THIRDWEB_CHAIN_MAP
   - Need to ensure Thirdweb supports the chain

3. **Provider Methods**: Some advanced methods may not be intercepted
   - Current coverage: transactions, signing, chain switching
   - May need to add more as use cases emerge

## If You Need To Continue Working On This:

### Common Tasks

**Add a new chain:**
1. Update `THIRDWEB_CHAIN_MAP` in `unicornConnector.js`
2. Add to wagmi config chains array
3. Test connection and transactions on new chain

**Add ERC-1271 verification:**
```javascript
// In verification logic
const ERC1271_ABI = [{
  name: 'isValidSignature',
  type: 'function',
  stateMutability: 'view',
  inputs: [
    { name: 'hash', type: 'bytes32' },
    { name: 'signature', type: 'bytes' }
  ],
  outputs: [{ name: '', type: 'bytes4' }],
}];

const isValid = await publicClient.readContract({
  address: wallet.address,
  abi: ERC1271_ABI,
  functionName: 'isValidSignature',
  args: [hashMessage(message), signature]
});

return isValid === '0x1626ba7e'; // ERC-1271 magic value
```

**Debug connection issues:**
```javascript
// Add to connector options
debug: true

// Check console for:
// [UnicornConnector] logs - connection flow
// [UnicornAutoConnect] logs - auto-connect flow
// localStorage entries - should have walletToken-*, thirdweb:active-wallet-id, thirdweb:connected-wallet-ids
```

**Add new intercepted method:**
```javascript
// In getProvider() wrappedRequest function
if (args.method === 'your_new_method') {
  // Show approval dialog
  const result = await showApprovalDialog({
    type: 'custom',
    data: args.params
  });
  
  // Execute via Thirdweb
  const txResult = await this.wallet.customMethod(args.params);
  return txResult;
}
```

### Testing

**Build and test locally:**
```bash
# In package directory
npm run build

# Link locally
npm link

# In test app
npm link @unicorn.eth/autoconnect
npm run dev
```

**Test checklist:**
- [ ] Connect Unicorn wallet (manual + auto-connect)
- [ ] Connect MetaMask
- [ ] Send ETH (both wallets)
- [ ] Write contract (both wallets)
- [ ] Sign message (both wallets)
- [ ] Sign typed data (both wallets)
- [ ] Switch chain (both wallets)
- [ ] Watch asset (both wallets)
- [ ] Disconnect and reconnect
- [ ] Test with fresh browser (no localStorage)
- [ ] Test cross-browser with same authCookie

**Standard wagmi hooks to verify:**
```jsx
// All these should work with Unicorn wallets
useAccount()          // ✅ Connection state
useBalance()          // ✅ ETH/token balance
useSendTransaction()  // ✅ Send ETH
useWriteContract()    // ✅ Contract interactions
useReadContract()     // ✅ Read contract state
useSignMessage()      // ✅ Sign messages
useSignTypedData()    // ✅ EIP-712 signatures
useSwitchChain()      // ✅ Network switching
useWatchAsset()       // ✅ Add token to wallet
```

## Questions to Ask Me

"I'm continuing work on @unicorn.eth/autoconnect v1.3.0. [paste relevant context from above]

I need help with:
- [your specific task/issue]
- [any error messages with full stack trace]
- [what you've tried]
- [which file(s) you're working in]"

## Important Files to Reference

**Core connector:**
- `src/connectors/unicornConnector.js` - Main connector logic

**Components:**
- `src/components/UnicornAutoConnect.jsx` - Auto-connect component
- `src/components/UnicornTransactionApproval.jsx` - Approval dialog

**Examples:**
- `examples/test-app/App.jsx` - Complete test suite with all wagmi hooks

**Documentation:**
- `docs/QUICK_REFERENCE.md` - API reference
- `docs/MIGRATION_GUIDE_v1.2_to_v1.3.md` - Migration instructions
- `docs/technical/RELEASE_NOTES_v1.3.0.md` - Release notes

## Recent Changes (v1.3.0 Session Summary)

1. **Achieved native wagmi integration** - Removed custom hooks, all standard wagmi hooks work
2. **Implemented provider wrapping** - Intercepts requests for approval dialogs
3. **Fixed state synchronization** - Proper localStorage entries + wagmi event emission
4. **Fixed chain switching** - Smart account chain switching without reconnection
5. **Centralized chain config** - Single THIRDWEB_CHAIN_MAP for all chain references
6. **Added subscribe/unsubscribe** - Proper provider event handling for wagmi
7. **Created comprehensive test suite** - 9 tests covering all connector functions

### Key Debugging Insights

**localStorage is critical:**
Without these three entries, Thirdweb's AutoConnect fails:
- `walletToken-{clientId}`: The authCookie value
- `thirdweb:active-wallet-id`: Set to 'inApp'
- `thirdweb:connected-wallet-ids`: JSON array `["inApp"]`

**Wagmi v2 connector format:**
Must return `{ accounts: [address], chainId }` not `{ account, chain }`

**Chain switching:**
Use `this.account.chain = THIRDWEB_CHAIN_MAP[chainId].wagmiChain` instead of full reconnection

**Provider wrapping pattern:**
Store original `request` method, wrap it, intercept specific methods, pass through others

---

## v1.3.0 Architecture Summary

```
Standard Wagmi Hook Call
        ↓
   Wagmi Provider
        ↓
unicornConnector.getProvider()
        ↓
  wrappedRequest()
        ↓
   [Intercept?]
   /           \
 YES            NO
  ↓              ↓
Show Approval   Pass Through
  ↓
Execute via Thirdweb
  ↓
Return to Wagmi
  ↓
Your Code Continues
```

**The beauty:** Standard wagmi patterns work everywhere. Copy/paste from tutorials. Zero Unicorn-specific code needed.

---

**Copy this entire prompt when you want to continue!** 🚀

---

## Quick Commands Reference

```bash
# Development
npm run build              # Build package
npm run dev               # Watch mode
npm link                  # Link locally

# Testing
cd examples/test-app
npm run dev              # Run test app

# Publishing
npm version patch        # 1.3.0 → 1.3.1
npm version minor        # 1.3.0 → 1.4.0
npm version major        # 1.3.0 → 2.0.0
git push && git push --tags  # Trigger GitHub Actions

# Debugging
# Set debug: true in connector options
# Check browser console for [UnicornConnector] logs
# Check localStorage for walletToken-*, thirdweb:* entries
# Use React DevTools to inspect wagmi state
```

---