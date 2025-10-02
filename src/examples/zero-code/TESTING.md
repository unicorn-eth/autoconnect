# Zero-Code Example - Testing Guide

Complete testing checklist for the zero-code implementation.

## 🚀 Quick Start

```bash
cd examples/zero-code
pnpm install
cp .env.example .env
# Edit .env with your credentials
pnpm run dev
```

## ✅ Pre-Flight Checklist

### 1. Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] `VITE_THIRDWEB_CLIENT_ID` set
- [ ] `VITE_THIRDWEB_FACTORY_ADDRESS` set
- [ ] `VITE_WALLETCONNECT_PROJECT_ID` set
- [ ] Dependencies installed (`pnpm install`)

### 2. Build Verification
- [ ] `pnpm run build` completes without errors
- [ ] `dist/` folder created
- [ ] No TypeScript errors
- [ ] No React warnings in build output

### 3. Dev Server
- [ ] `pnpm run dev` starts successfully
- [ ] Opens browser automatically
- [ ] No console errors on page load
- [ ] Page renders correctly

---

## 🧪 Test Scenarios

### Scenario 1: Standard Wallet (MetaMask) - Complete Flow

#### Setup
1. Open http://localhost:3000 (no URL parameters)
2. Open browser console (F12)
3. Have MetaMask installed and unlocked

#### Test: Wallet Connection
- [ ] Page loads without errors
- [ ] "Connect Wallet" button visible
- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] Select account and connect
- [ ] **Expected**: Wallet info displays:
  - ✅ Connected via [Wallet Name]
  - Address shows (0x...1234)
  - 💼 Icon displays (not 🦄)
  - NO "Gasless enabled" message

#### Test: ETH Transaction
- [ ] "Send 0.001 ETH" button enabled (not grayed out)
- [ ] Button shows "💸 Send Demo Transaction" text
- [ ] Click the button
- [ ] **Expected**: MetaMask popup appears
- [ ] Approve transaction in MetaMask
- [ ] **Expected**: 
  - Button changes to "⏳ Processing..."
  - Success message appears: "✅ Transaction successful!"
  - Transaction hash displays (truncated)
- [ ] Click hash to verify on block explorer

#### Test: USDC Transaction
- [ ] "Send 0.01 USDC" button enabled
- [ ] Click the button
- [ ] **Expected**: MetaMask popup appears
- [ ] Approve transaction
- [ ] **Expected**:
  - Success message appears
  - USDC transaction completes
  - Hash displays

#### Test: Message Signing
- [ ] "Sign Verification Message" button enabled
- [ ] Button shows "💼 Sign Message (MetaMask)" text
- [ ] Click button
- [ ] **Expected**: MetaMask sign request appears
- [ ] Sign the message
- [ ] **Expected**:
  - Success message: "✅ Message signed!"
  - Signature displays (truncated)
  - Signature format: "Sig: 0x..."

#### Test: Disconnect
- [ ] Click "Disconnect" in ConnectButton
- [ ] **Expected**:
  - Wallet info disappears
  - All buttons become disabled/grayed out
  - Can reconnect successfully

---

### Scenario 2: Unicorn Wallet - Complete Flow

#### Setup
1. Open http://localhost:3000/?walletId=inApp&authCookie=test
2. Open browser console
3. Watch for auto-connect messages

#### Test: Auto-Connect
- [ ] **Console**: Look for debug messages:
  - "🦄 UnicornAutoConnect: Creating isolated React root"
  - "🦄 IsolatedAutoConnect: Configuration"
  - "🦄 IsolatedAutoConnect: Success!"
  - "🦄 Event dispatched: unicorn-wallet-connected"
- [ ] **Expected UI**:
  - Wallet info displays automatically
  - ✅ Connected via Unicorn
  - 🦄 Icon displays
  - Address shows
  - ⚡ "Gasless transactions enabled" message shows

#### Test: USDC Transaction with Approval
- [ ] "Send 0.01 USDC" button enabled
- [ ] Button shows "🦄 Send 0.01 USDC" text
- [ ] Click the button
- [ ] **Expected**: Approval dialog appears with:
  - 🦄 Unicorn Smart Wallet header
  - "To: 0x833..." (USDC contract)
  - Data section showing function call
  - ⚡ "Gasless Transaction" badge
  - "Reject" and "Confirm" buttons
- [ ] Click "Confirm"
- [ ] **Expected**:
  - Dialog closes
  - Button shows "⏳ Processing..."
  - Transaction completes
  - Success message: "✅ USDC sent!"
  - Hash displays

#### Test: Approval Rejection
- [ ] Click "Send 0.01 USDC" again
- [ ] Approval dialog appears
- [ ] Click "Reject"
- [ ] **Expected**:
  - Dialog closes
  - Error message: "❌ Transaction rejected by user"
  - Can try again

#### Test: ETH Transaction
- [ ] Click "Send 0.001 ETH" button
- [ ] **Expected**: Approval dialog appears
- [ ] Confirm transaction
- [ ] **Expected**: Transaction completes successfully

#### Test: Message Signing
- [ ] Click "Sign Verification Message"
- [ ] Button shows "🦄 Sign Message (EIP-191)"
- [ ] **Expected**: NO popup (direct signing)
- [ ] **Expected**:
  - Success message appears
  - Signature displays
  - Format: "Sig: 0x..."

#### Test: Disconnect and Reconnect
- [ ] Click "Disconnect & Test Standard Wallets" button
- [ ] **Expected**:
  - Redirects to URL without parameters
  - Wallet disconnects
  - Can connect standard wallet now
- [ ] Navigate back to Unicorn URL
- [ ] **Expected**: Auto-connects again

---

### Scenario 3: Wallet Switching

#### Test: Switch from Standard to Unicorn
1. Connect MetaMask normally
2. Verify it works
3. Open new tab with Unicorn URL
4. **Expected**: Unicorn auto-connects, MetaMask still works in other tab

#### Test: Switch from Unicorn to Standard
1. Start with Unicorn connected
2. Click disconnect button
3. Connect MetaMask
4. **Expected**: Standard wallet works correctly

---

### Scenario 4: Error Handling

#### Test: No Wallet Installed
1. Disable/remove MetaMask
2. Try to connect
3. **Expected**: Appropriate error message from RainbowKit

#### Test: Network Mismatch
1. Connect wallet on wrong network (e.g., Ethereum mainnet)
2. Try transaction
3. **Expected**: Error message about network

#### Test: Insufficient Funds
1. Use wallet with no ETH/USDC
2. Try transaction
3. **Expected**: Error message about insufficient funds

#### Test: Transaction Failure
1. Send transaction that will fail (e.g., to invalid address)
2. **Expected**: Error message displays clearly

---

## 🐛 Common Issues and Solutions

### Issue: Buttons Always Disabled
**Symptoms**: All transaction/sign buttons grayed out even when connected

**Check**:
- [ ] Console for wallet connection confirmation
- [ ] `wallet.isConnected` is true (check with React DevTools)
- [ ] No React errors in console

**Solution**: Verify `useUniversalWallet()` is receiving connection events

### Issue: Approval Dialog Not Showing (Unicorn)
**Symptoms**: Transaction sends without approval dialog

**Check**:
- [ ] `enableTransactionApproval={true}` in UnicornAutoConnect
- [ ] Console for wrapper messages
- [ ] Wallet is properly wrapped

**Solution**: Verify `wrapUnicornWallet` is being called in onConnect

### Issue: MetaMask Popup Not Appearing
**Symptoms**: Click button, nothing happens

**Check**:
- [ ] Console for errors
- [ ] MetaMask is unlocked
- [ ] Correct network selected
- [ ] Transaction object is valid

**Solution**: Check transaction parameters, ensure Wagmi hooks configured correctly

### Issue: Auto-Connect Not Working (Unicorn)
**Symptoms**: Visit Unicorn URL, wallet doesn't connect

**Check**:
- [ ] URL has both `walletId=inApp` AND `authCookie=test`
- [ ] Console shows UnicornAutoConnect debug messages
- [ ] ThirdWeb credentials correct
- [ ] No console errors

**Solution**: Enable debug mode, check console for specific error

### Issue: Signature Format Wrong
**Symptoms**: Signature doesn't look right or fails validation

**Check**:
- [ ] EIP-191 format used
- [ ] Message string is correct
- [ ] Account.signMessage called (not wallet.signMessage)

**Solution**: Verify signing logic in useUnicornSignMessage hook

---

## 📊 Success Criteria

### Functional Requirements
- [ ] All buttons work with MetaMask
- [ ] All buttons work with Unicorn
- [ ] Approval dialog shows for Unicorn transactions
- [ ] Loading states display correctly
- [ ] Success messages show with hashes/signatures
- [ ] Error messages show when things fail
- [ ] Can switch between wallet types
- [ ] No console errors during normal operation

### UI/UX Requirements
- [ ] Buttons clearly indicate wallet type (🦄 or 💼)
- [ ] Disabled state obvious when not connected
- [ ] Loading states show activity ("⏳ Processing...")
- [ ] Success messages are clear and positive (green)
- [ ] Error messages are clear and helpful (red)
- [ ] Transaction hashes/signatures display correctly
- [ ] Gasless indicator shows for Unicorn (⚡)
- [ ] Approval dialog is visually appealing
- [ ] All text is readable and properly formatted
- [ ] Responsive design works on mobile

### Performance Requirements
- [ ] Page loads in < 3 seconds
- [ ] Buttons respond immediately to clicks
- [ ] No lag when showing/hiding dialogs
- [ ] State updates are instant
- [ ] No memory leaks (check DevTools Memory)

---

## 🔍 Debug Mode Testing

Enable debug mode to see detailed logs:

```jsx
<UnicornAutoConnect
  // ... other props
  debug={true}
/>
```

### Expected Console Messages

#### On Page Load
```
🦄 UnicornAutoConnect: Creating isolated React root for AutoConnect
🦄 UnicornAutoConnect: Rendering isolated AutoConnect
🦄 IsolatedAutoConnect: Configuration
  clientId: "4e8c8118..."
  factoryAddress: "0xD771615..."
  chain: base
  timeout: 5000
```

#### On Auto-Connect Success
```
🦄 IsolatedAutoConnect: Success!
Chain: base
Address: 0x1234...5678
Transaction Approval: Enabled
Wallet object: {...}
🦄 Event dispatched: unicorn-wallet-connected
```

#### On Transaction
```
🔥 Wrapped sendTransaction called! {...}
📋 Requesting user approval...
✅ Approved! Sending transaction...
📤 Preparing transaction with Thirdweb...
Prepared transaction: {...}
Sending transaction...
✅ Transaction sent! {...}
```

#### On Signing
```
📝 Signing message: Welcome to my dApp!...
🦄 Attempting to sign with Unicorn wallet...
Account: {...}
✅ Signature: 0x1234...
```

---

## 📱 Mobile Testing

### iOS Safari
- [ ] Page loads correctly
- [ ] Can connect WalletConnect
- [ ] Transactions work via mobile wallet
- [ ] Approval dialog displays properly
- [ ] Touch interactions work smoothly
- [ ] No layout issues

### Android Chrome
- [ ] Page loads correctly
- [ ] Can connect WalletConnect
- [ ] Transactions work via mobile wallet
- [ ] Approval dialog displays properly
- [ ] Touch interactions work smoothly
- [ ] No layout issues

### Mobile Browser Specific Tests
- [ ] Modal dialogs don't get stuck
- [ ] Can scroll within approval dialog
- [ ] Buttons are large enough to tap
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling needed

---

## 🎯 Edge Cases

### Edge Case 1: Rapid Clicking
- [ ] Click transaction button multiple times quickly
- [ ] **Expected**: Only one transaction sends
- [ ] Button shows loading state
- [ ] Previous transaction completes before new one

### Edge Case 2: Wallet Locked
- [ ] Lock MetaMask mid-session
- [ ] Try to send transaction
- [ ] **Expected**: Appropriate error message
- [ ] Can retry after unlocking

### Edge Case 3: Network Switch
- [ ] Start on Base network
- [ ] Switch to different network mid-transaction
- [ ] **Expected**: Error message or prompt to switch back

### Edge Case 4: Browser Refresh
- [ ] Connect wallet
- [ ] Refresh page (F5)
- [ ] **Expected**: 
  - Standard wallet: Disconnected (normal behavior)
  - Unicorn: Auto-connects again (if URL preserved)

### Edge Case 5: Multiple Tabs
- [ ] Open app in two tabs
- [ ] Connect in tab 1
- [ ] Switch to tab 2
- [ ] **Expected**: Tab 2 doesn't automatically reflect connection
- [ ] Each tab independent

### Edge Case 6: Long Messages
- [ ] Sign a very long message (>1000 characters)
- [ ] **Expected**: Message displays properly in UI
- [ ] Signing still works

### Edge Case 7: Invalid Transaction
- [ ] Create transaction with invalid address
- [ ] Try to send
- [ ] **Expected**: Clear error message
- [ ] Can try again with valid transaction

---

## 📈 Performance Profiling

### Memory Usage
1. Open DevTools → Performance → Memory
2. Click "Heap snapshot"
3. Connect wallet
4. Send transactions
5. Take another snapshot
6. **Check**: No significant memory increase (< 10MB)

### React Render Count
1. Install React DevTools
2. Open Profiler
3. Start recording
4. Connect wallet and send transaction
5. Stop recording
6. **Check**: Minimal re-renders (< 10 total)

### Network Requests
1. Open DevTools → Network
2. Connect wallet
3. Send transaction
4. **Check**:
   - Reasonable number of requests
   - No failed requests
   - RPC calls succeed

---

## 🎓 Comparison Testing

### Compare with Advanced Example

Run both examples side-by-side:

| Feature | Zero-Code | Advanced |
|---------|-----------|----------|
| Button clicks to transaction | 1 | 1 |
| Code lines for transaction | 3 | 30+ |
| UI feedback | Automatic | Manual |
| Loading states | Built-in | Custom |
| Error handling | Built-in | Custom |

**Verify**: Zero-code provides same functionality with less code

---

## ✅ Final Verification Checklist

### Code Quality
- [ ] No console errors
- [ ] No React warnings
- [ ] No TypeScript errors
- [ ] All imports resolve correctly
- [ ] Build completes successfully
- [ ] Bundle size reasonable (< 1MB)

### Documentation
- [ ] README.md is complete
- [ ] .env.example exists
- [ ] Code comments are clear
- [ ] Example transactions documented

### User Experience
- [ ] First-time setup is clear
- [ ] Error messages are helpful
- [ ] Success states are encouraging
- [ ] Loading states are obvious
- [ ] UI is intuitive

### Functionality
- [ ] All buttons work
- [ ] Both wallet types supported
- [ ] Transactions complete successfully
- [ ] Signing works correctly
- [ ] Approval dialog functions properly
- [ ] State updates correctly

### Browser Compatibility
- [ ] Chrome/Chromium ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅
- [ ] Mobile browsers ✅

---

## 🚀 Ready to Ship

Once all items above are checked:

1. **Tag the example**:
   ```bash
   git add examples/zero-code
   git commit -m "feat: add zero-code example with pre-built components"
   git push
   ```

2. **Update main documentation**:
   - Add zero-code section to main README
   - Update QUICK_REFERENCE with pre-built components
   - Add to examples comparison guide

3. **Announce**:
   - Create demo video
   - Write blog post
   - Share on Discord/Twitter
   - Update package documentation

---

## 📞 Support

If you encounter issues during testing:

1. **Check Console**: Most issues show errors in console
2. **Enable Debug Mode**: Set `debug={true}` in UnicornAutoConnect
3. **Verify Environment**: Double-check .env variables
4. **Review Logs**: Look for specific error messages
5. **Compare with Advanced**: See if issue exists there too

### Getting Help
- GitHub Issues: [Report bugs](https://github.com/MyUnicornAccount/autoconnect/issues)
- Discord: [Join #developers](https://discord.gg/unicorn)
- Documentation: [Read the docs](../../README.md)

---

## 🎉 Testing Complete!

Once all tests pass, the zero-code example is:
- ✅ **Fully functional**
- ✅ **Production ready**
- ✅ **Well documented**
- ✅ **Easy to use**

**Ship it!** 🚀