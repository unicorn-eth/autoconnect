# Complete Setup Guide for @unicorn.eth/autoconnect

This guide walks you through setting up and publishing the NPM package from scratch.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ or 20+ installed
- ✅ Git installed
- ✅ NPM account (create at https://www.npmjs.com/signup)
- ✅ GitHub account
- ✅ Text editor (VS Code recommended)

## 🚀 Step 1: Initial Setup

### 1.1 Create NPM Account (if you don't have one)

```bash
# Visit https://www.npmjs.com/signup
# Choose username: unicorn-eth (or similar)
# Verify your email
```

### 1.2 Login to NPM

```bash
npm login
# Enter your NPM credentials
```

### 1.3 Create GitHub Repository

```bash
# On GitHub:
# 1. Click "New Repository"
# 2. Name: autoconnect
# 3. Description: "Drop-in Unicorn AutoConnect for existing dApps"
# 4. Public
# 5. Add README: No (we'll create our own)
# 6. Create repository
```

### 1.4 Clone and Initialize

```bash
# Clone your new repo
git clone https://github.com/YOUR_USERNAME/autoconnect.git
cd autoconnect

# Initialize pnpm
npm install -g pnpm
pnpm init
```

## 📁 Step 2: Create Package Structure

### 2.1 Create Directory Structure

```bash
mkdir -p src/components src/hooks src/utils src/types
mkdir -p examples/basic/src examples/advanced/src examples/migration
mkdir -p .github/workflows
```

### 2.2 Copy Files from simple-integration

Copy these files from your `simple-integration` example:

```bash
# Source files
cp ../simple-integration/src/components/UnicornAutoConnect.jsx src/components/
cp ../simple-integration/src/hooks/useUniversalWallet.js src/hooks/

# Create utility file (extract from UnicornAutoConnect.jsx)
# We'll create this in next step
```

### 2.3 Create Main Export File

Create `src/index.js`:

```javascript
// @unicorn.eth/autoconnect - Main export file
export { default as UnicornAutoConnect } from './components/UnicornAutoConnect';
export { useUniversalWallet } from './hooks/useUniversalWallet';
export { 
  isUnicornEnvironment,
  getUnicornAuthCookie,
  getChainConfig 
} from './utils/environment';
```

### 2.4 Create Utility File

Create `src/utils/environment.js`:

```javascript
export const isUnicornEnvironment = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const walletId = params.get('walletId');
  const authCookie = params.get('authCookie');
  return walletId === 'inApp' && !!authCookie;
};

export const getUnicornAuthCookie = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('authCookie');
};

export const getChainConfig = (chainName) => {
  return { name: chainName || 'base' };
};
```

## 📦 Step 3: Configure Package

### 3.1 Create/Update package.json

Use the package.json from the artifacts above, or create manually:

```json
{
  "name": "@unicorn.eth/autoconnect",
  "version": "1.0.0",
  "description": "Drop-in Unicorn AutoConnect for existing dApps - zero breaking changes",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup src/index.js --format cjs,esm --dts --external react,react-dom,wagmi,thirdweb",
    "dev": "tsup src/index.js --format esm --watch",
    "prepublishOnly": "pnpm run build"
  },
  "keywords": [
    "unicorn",
    "web3",
    "wallet",
    "autoconnect",
    "thirdweb",
    "wagmi",
    "account-abstraction",
    "gasless"
  ],
  "author": "Unicorn.eth",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/autoconnect"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "thirdweb": "^5.60.0",
    "wagmi": "^2.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "thirdweb": "^5.68.0",
    "wagmi": "^2.17.1"
  }
}
```

### 3.2 Create tsup.config.js

(Use the config from artifacts above)

### 3.3 Create Configuration Files

Copy these files from the artifacts:
- `.gitignore`
- `.npmignore`
- `tsup.config.js`
- `src/types/index.d.ts`

## 🔧 Step 4: Setup GitHub Actions

### 4.1 Create NPM Token

```bash
# On npmjs.com:
# 1. Click your profile → Access Tokens
# 2. Generate New Token → Classic Token
# 3. Type: Automation
# 4. Copy the token (you won't see it again!)
```

### 4.2 Add Token to GitHub

```bash
# On GitHub:
# 1. Go to your repository
# 2. Settings → Secrets and variables → Actions
# 3. New repository secret
# 4. Name: NPM_TOKEN
# 5. Value: (paste your NPM token)
# 6. Add secret
```

### 4.3 Create Workflow Files

Copy these files from artifacts to `.github/workflows/`:
- `publish.yml`
- `test.yml`

## 📚 Step 5: Add Documentation

### 5.1 Create Documentation Files

Copy from artifacts:
- `README.md` (package README)
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `LICENSE`

### 5.2 Update Repository URLs

In all files, replace:
- `YOUR_USERNAME` with your GitHub username
- Update any other placeholder text

## 🧪 Step 6: Test Locally

### 6.1 Install Dependencies

```bash
pnpm install
```

### 6.2 Build the Package

```bash
pnpm run build
```

You should see `dist/` folder created with:
- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (TypeScript definitions)

### 6.3 Test with Link

```bash
# In package directory
pnpm link

# Create a test app or use existing one
cd /path/to/test-app
pnpm link @unicorn.eth/autoconnect

# Test import
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';
```

### 6.4 Verify Package Contents

```bash
npm pack --dry-run
```

This shows what will be published. Verify:
- ✅ dist/ files are included
- ✅ README.md is included
- ✅ LICENSE is included
- ❌ src/ is NOT included (only dist)
- ❌ examples/ are NOT included

## 📤 Step 7: Publish to NPM

### 7.1 First Time Setup

```bash
# Make sure you're logged in
npm whoami

# If not logged in
npm login
```

### 7.2 Verify Package is Ready

```bash
# Check version
cat package.json | grep version

# Dry run - see what will be published
npm pack --dry-run

# Build one more time
pnpm run build

# Check dist/ exists and has files
ls -la dist/
```

### 7.3 Publish!

```bash
# Publish to NPM
npm publish --access public

# You should see:
# + @unicorn.eth/autoconnect@1.0.0
```

### 7.4 Verify Publication

```bash
# Check on NPM
# Visit: https://www.npmjs.com/package/@unicorn.eth/autoconnect

# Try installing in a test project
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install @unicorn.eth/autoconnect

# Should install successfully!
```

## 🏷️ Step 8: Create GitHub Release

### 8.1 Commit and Push

```bash
git add .
git commit -m "chore: initial release v1.0.0"
git push origin main
```

### 8.2 Create Git Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 8.3 Create GitHub Release

```bash
# On GitHub:
# 1. Go to your repository
# 2. Click "Releases" → "Create a new release"
# 3. Choose tag: v1.0.0
# 4. Release title: v1.0.0 - Initial Release
# 5. Description: Copy from CHANGELOG.md
# 6. Publish release
```

This will trigger the GitHub Action to publish to NPM automatically!

## 🔄 Step 9: Setup Examples

### 9.1 Create Example Apps

For each example (basic, advanced, migration):

```bash
cd examples/basic

# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    open: true,
  },
})
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Basic Example - @unicorn.eth/autoconnect</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Create src/main.jsx
mkdir -p src
cat > src/main.jsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@rainbow-me/rainbowkit/styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# Install dependencies
pnpm install

# Test
pnpm run dev
```

Repeat for `advanced` and `migration` examples.

## ✅ Step 10: Final Verification

### 10.1 Test Installation

```bash
# In a completely fresh project
mkdir test-unicorn-package
cd test-unicorn-package
npm init -y
npm install react react-dom wagmi thirdweb @rainbow-me/rainbowkit
npm install @unicorn.eth/autoconnect

# Create test file
cat > test.js << 'EOF'
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';
console.log('✅ Package imports work!');
EOF

node test.js
```

### 10.2 Test TypeScript

```bash
# Create TypeScript test
cat > test.ts << 'EOF'
import { UnicornAutoConnect, useUniversalWallet, type UniversalWallet } from '@unicorn.eth/autoconnect';

const wallet: UniversalWallet = useUniversalWallet();
console.log('✅ TypeScript types work!');
EOF

# Check types (should have no errors)
npx tsc --noEmit test.ts
```

### 10.3 Verify All Checklist Items

- ✅ Package published to NPM
- ✅ GitHub repository created
- ✅ GitHub Actions configured
- ✅ Documentation complete
- ✅ Examples working
- ✅ TypeScript definitions included
- ✅ Package installs correctly
- ✅ Imports work from package
- ✅ Types work correctly

## 🎉 You're Done!

Your package is now live! 

### Share it:

```bash
# NPM page
https://www.npmjs.com/package/@unicorn.eth/autoconnect

# GitHub repo
https://github.com/YOUR_USERNAME/autoconnect

# Installation command
npm install @unicorn.eth/autoconnect
```

## 📊 Post-Publication

### Monitor Usage

- **NPM downloads**: https://www.npmjs.com/package/@unicorn.eth/autoconnect
- **GitHub stars**: Watch your repo grow!
- **Issues**: Respond to user questions

### Future Updates

When you need to publish updates:

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"

# Update version
npm version patch  # 1.0.0 → 1.0.1 (bug fixes)
npm version minor  # 1.0.0 → 1.1.0 (new features)
npm version major  # 1.0.0 → 2.0.0 (breaking changes)

# Push changes and tag
git push && git push --tags

# GitHub Actions will auto-publish!
```

### Getting Help

- **Issues**: Use GitHub Issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Real-time help from community

## 🚨 Troubleshooting

### "Package name already taken"

Choose a different name in package.json:
- `@unicorn-eth/autoconnect`
- `@myunicornaccount/autoconnect`
- `unicorn-autoconnect-sdk`

### "Permission denied" on NPM publish

Make sure you're logged in:
```bash
npm logout
npm login
npm publish --access public
```

### GitHub Actions failing

Check:
- NPM_TOKEN is set correctly in GitHub Secrets
- Token has "Automation" permission
- package.json version is correct

### TypeScript errors in package

Make sure tsup generated .d.ts files:
```bash
ls dist/*.d.ts  # Should exist
```

---

**Congratulations! Your NPM package is live!** 🎉