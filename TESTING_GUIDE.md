# Testing Guide for Web3Modal Integration

This guide will help you test the Web3Modal integration locally before publishing to npm.

## Prerequisites

You'll need:
1. **WalletConnect Project ID** - Get one at [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. **Thirdweb Client ID** - Get one at [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
3. A wallet with some testnet tokens (e.g., Base Sepolia ETH)

## Option 1: Test the Example Project (Recommended)

### Step 1: Set Up Environment Variables

```bash
cd src/examples/web3modal
cp .env.example .env
```

Edit `.env` and add your credentials:
```bash
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

### Step 2: Install Dependencies

```bash
npm install
```

Note: If you get peer dependency warnings, use:
```bash
npm install --legacy-peer-deps
```

### Step 3: Run the Development Server

```bash
npm run dev
```

Visit http://localhost:5173

### Step 4: Test Different Wallets

1. **Test with MetaMask**
   - Click "Connect Wallet"
   - Select "MetaMask" from the Web3Modal
   - Approve connection
   - Try sending a transaction
   - Try signing a message
   - Try switching networks

2. **Test with WalletConnect**
   - Click "Connect Wallet"
   - Select "WalletConnect"
   - Scan QR code with your mobile wallet
   - Try the same actions

3. **Test with Unicorn (Simulated)**
   - Open: http://localhost:5173/?walletId=inApp&authCookie=test123
   - Check browser console for auto-connect logs
   - Note: Real Unicorn auth requires valid authCookie from Unicorn portal

### Step 5: What to Check

- ✅ All wallet options appear in Web3Modal
- ✅ Connection works for each wallet type
- ✅ Account address and balance display correctly
- ✅ Transactions can be sent
- ✅ Messages can be signed
- ✅ Networks can be switched
- ✅ No console errors (except for invalid Unicorn authCookie)

## Option 2: Test with npm link (Test Package Integration)

This tests the package as if it were installed from npm.

### Step 1: Link the Package

From the autoconnect root directory:
```bash
npm run build  # Build the package first
npm link       # Create global symlink
```

### Step 2: Create a Test Project

```bash
mkdir test-web3modal-integration
cd test-web3modal-integration
npm init -y
npm install @web3modal/ethereum@^2.7.1 @web3modal/react@^2.7.1 wagmi@^1.4.0 viem@^1.0.0 react@^18.2.0 react-dom@^18.2.0
npm install --save-dev vite @vitejs/plugin-react
```

### Step 3: Link Your Local Package

```bash
npm link @unicorn.eth/autoconnect
```

### Step 4: Create Test Files

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test Web3Modal Integration</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Create `src/main.jsx` - copy from the example project.

### Step 5: Test

```bash
npm run dev
```

## Option 3: Unit Testing (For CI/CD)

### Test the Integration Helper

Create `test/web3modal.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { unicornConnector } from '../src/connectors/unicornConnector.js';

describe('Web3Modal Integration', () => {
  it('should create unicorn connector with correct options', () => {
    const connector = unicornConnector({
      clientId: 'test-client-id',
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: 8453,
    });

    expect(connector).toBeDefined();
  });

  it('should be compatible with wagmi createConfig', async () => {
    // Test that connector can be used in wagmi config
    const { createConfig } = await import('wagmi');

    const config = createConfig({
      connectors: [
        unicornConnector({
          clientId: 'test',
          factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
          defaultChain: 8453,
        }),
      ],
    });

    expect(config.connectors).toHaveLength(1);
  });
});
```

## Option 4: Manual Integration Test

### Create a Minimal Test Case

Create a new file `test-integration.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Web3Modal + Unicorn Test</title>
  <script type="module">
    import { createConfig } from 'wagmi';
    import { w3mConnectors } from '@web3modal/ethereum';

    // This should work without errors
    const testImport = async () => {
      try {
        const { unicornConnector } = await import('./src/connectors/unicornConnector.js');
        console.log('✅ Import successful:', unicornConnector);

        // Test connector creation
        const connector = unicornConnector({
          clientId: 'test',
          factoryAddress: '0xtest',
          defaultChain: 8453,
        });
        console.log('✅ Connector created:', connector);

        // Test that it can be used with w3mConnectors
        const allConnectors = [
          ...w3mConnectors({ projectId: 'test', chains: [] }),
          connector,
        ];
        console.log('✅ Combined with w3mConnectors:', allConnectors.length);

      } catch (error) {
        console.error('❌ Error:', error);
      }
    };

    testImport();
  </script>
</head>
<body>
  <h1>Check browser console for results</h1>
</body>
</html>
```

## Troubleshooting

### Issue: "Cannot find module '@unicorn.eth/autoconnect/web3modal'"

**Solution:** Make sure you've built the package:
```bash
npm run build
```

Or use the source directly in the vite.config.js alias (already configured in example).

### Issue: Peer dependency conflicts

**Solution:** Use `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

### Issue: Web3Modal v2 vs v3 confusion

**Solution:** Make sure you're using the correct versions:
```json
{
  "@web3modal/ethereum": "^2.7.1",
  "@web3modal/react": "^2.7.1",
  "wagmi": "^1.4.0"
}
```

Note: Web3Modal v3+ (now called AppKit) is different and may require adjustment.

### Issue: Unicorn connector doesn't appear

**Solution:**
1. Check that connector is in the connectors array
2. Verify no errors in browser console
3. Make sure wagmi config is properly passed to WagmiConfig provider

### Issue: Auto-connect not working

**Solution:**
1. Verify `UnicornAutoConnect` component is inside `WagmiConfig`
2. Check URL has correct parameters: `?walletId=inApp&authCookie=xxx`
3. Enable debug mode: `<UnicornAutoConnect debug={true} />`

## Testing Checklist

Before publishing, verify:

- [ ] Example project runs without errors
- [ ] Can connect with MetaMask
- [ ] Can connect with WalletConnect
- [ ] Can send transactions
- [ ] Can sign messages
- [ ] Can switch networks
- [ ] Auto-connect logs appear (with URL params)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Package builds successfully (`npm run build`)
- [ ] Documentation is accurate
- [ ] All imports work correctly

## Getting Credentials for Testing

### WalletConnect Project ID
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up / log in
3. Create a new project
4. Copy the Project ID

### Thirdweb Client ID
1. Go to [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Sign up / log in
3. Create a new project
4. Go to Settings → API Keys
5. Copy the Client ID

### Get Testnet Tokens
- **Base Sepolia**: [base-sepolia-faucet](https://www.alchemy.com/faucets/base-sepolia)
- **Polygon Amoy**: [polygon-faucet](https://faucet.polygon.technology/)

## Next Steps

After successful testing:

1. **Update version** (already done - v1.4.0)
2. **Create git commit**:
   ```bash
   git add .
   git commit -m "feat: Add Web3Modal v2 integration support"
   ```
3. **Create git tag**:
   ```bash
   git tag v1.4.0
   git push origin v1.4.0
   ```
4. **Publish to npm**:
   ```bash
   npm publish
   ```

## Support

If you encounter issues during testing:
- Check the [Web3Modal Integration Guide](./WEB3MODAL_INTEGRATION.md)
- Review the [example project](./src/examples/web3modal/)
- Open an issue on GitHub

---

Happy testing! 🧪🦄
