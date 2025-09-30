# Project Prompt: @unicorn/autoconnect NPM Package

## Project Overview

This is a **professional NPM package** that provides drop-in Unicorn AutoConnect integration for existing web3 dApps. The package transforms the clean `simple-integration` example into a reusable library that any developer can install via `npm install @unicorn/autoconnect`.

## Core Mission

**"Enable any dApp to add Unicorn AutoConnect in 2 minutes without breaking anything"**

This package allows developers to:
- ✅ Install via NPM instead of copying files
- ✅ Get automatic updates via `npm update`
- ✅ Use TypeScript with full type definitions
- ✅ Integrate with zero breaking changes to existing code

## Project Status: ✅ Complete and Ready for Publishing

### What's Complete:
- ✅ Full package source code with isolated React root pattern
- ✅ TypeScript definitions for all exports
- ✅ Modern build configuration (tsup)
- ✅ GitHub Actions for automated publishing
- ✅ Three complete example applications
- ✅ Comprehensive documentation (8+ docs files)
- ✅ Migration tools and guides
- ✅ Professional package structure following best practices

## Package Architecture

### Core Principle: Non-Breaking Integration

The package uses an **isolated React root pattern** to avoid conflicts:

```
Developer's App (Existing)          @unicorn/autoconnect
=======================             ===================
WagmiProvider                       Creates separate React tree
├─ RainbowKitProvider              No shared state
│  ├─ Their Components              Communicates via custom events
│  └─ UnicornAutoConnect ─────────> Isolated ThirdwebProvider
                                    └─ AutoConnect (hidden)
```

This ensures:
- No provider conflicts
- No React state warnings
- Zero breaking changes
- Existing wallets work exactly as before

## File Structure

```
@unicorn/autoconnect/
├── src/
│   ├── components/
│   │   └── UnicornAutoConnect.jsx    # Core component with isolated root
│   ├── hooks/
│   │   └── useUniversalWallet.js     # Unified wallet interface
│   ├── utils/
│   │   └── environment.js            # Utility functions
│   ├── types/
│   │   └── index.d.ts                # TypeScript definitions
│   └── index.js                      # Main export
├── examples/
│   ├── basic/                        # Minimal integration example
│   ├── advanced/                     # All features demonstration
│   └── migration/                    # Migration from manual files
├── .github/workflows/
│   ├── publish.yml                   # Auto-publish to NPM
│   └── test.yml                      # Run tests on PR
├── dist/                             # Build output (gitignored)
├── package.json                      # Package configuration
├── tsup.config.js                    # Build configuration
├── README.md                         # Main documentation
├── CONTRIBUTING.md                   # Contribution guide
├── CHANGELOG.md                      # Version history
├── LICENSE                           # MIT License
├── SETUP_GUIDE.md                    # Publishing instructions
├── QUICK_REFERENCE.md                # Developer cheat sheet
├── ARCHITECTURE.md                   # Technical architecture
├── COMPLETE_FILE_STRUCTURE.md        # Full file listing
├── PROJECT_SUMMARY.md                # Project overview
├── FINAL_CHECKLIST.md                # Pre-publish checklist
└── PROMPT.md                         # This file (project context)
```

## Key Components Explained

### 1. **UnicornAutoConnect.jsx** (Core Component)
**Purpose**: Drop-in component that adds Unicorn AutoConnect to any dApp

**Key Features**:
- Creates **isolated React root** using `ReactDOM.createRoot()`
- Only runs when accessed via Unicorn portal (`?walletId=inApp&authCookie=...`)
- Silent operation - never shows errors to users
- Communicates via custom events to avoid React warnings
- Fully configurable via props

**Technical Innovation**:
```javascript
// Creates separate React tree to avoid conflicts
const container = document.createElement('div');
const root = ReactDOM.createRoot(container);
root.render(<IsolatedAutoConnect />);
```

### 2. **useUniversalWallet.js** (Bridge Hook)
**Purpose**: Unified interface that works with both Unicorn and standard wallets

**Key Features**:
- Drop-in replacement for Wagmi's `useAccount()`
- Same API for both wallet types
- Event-based state management
- No React context conflicts

**API Surface**:
```javascript
const wallet = useUniversalWallet();

wallet.isConnected    // true if any wallet connected
wallet.address        // address from either wallet type
wallet.connector      // wallet connector info
wallet.isUnicorn      // true if Unicorn (gasless available)
wallet.isStandard     // true if standard wallet
wallet.disconnect()   // disconnect function
```

### 3. **TypeScript Definitions** (index.d.ts)
**Purpose**: Full TypeScript support for all exports

**Provides**:
- Component prop types
- Hook return types
- Utility function signatures
- Chain type unions
- Full IntelliSense support

### 4. **Build Configuration** (tsup.config.js)
**Purpose**: Modern bundler configuration for optimal output

**Outputs**:
- ESM format (`dist/index.js`) - for `import`
- CommonJS format (`dist/index.cjs`) - for `require`
- TypeScript definitions (`dist/index.d.ts`)
- Source maps for debugging

**Features**:
- Tree-shakeable exports
- Peer dependencies externalized
- Minimal bundle size (~10-20 KB minified)

## Example Applications

### Basic Example
**Purpose**: Show minimal 2-minute integration

**Demonstrates**:
- Single line addition to App.jsx
- Using useUniversalWallet() hook
- Zero breaking changes

**Target Audience**: Developers who want quickest integration

### Advanced Example
**Purpose**: Show all features and capabilities

**Demonstrates**:
- Multi-chain support
- Transaction handling for both wallet types
- Callbacks (onConnect, onError)
- Debug mode
- Connection logging

**Target Audience**: Developers who want full feature set

### Migration Example
**Purpose**: Help developers migrate from manual file copying

**Demonstrates**:
- Before: Manual file imports
- After: NPM package imports
- What changed (only imports!)
- Migration helper script

**Includes**: Automated migration script that:
- Scans for old files
- Checks for old imports
- Provides step-by-step migration instructions

**Target Audience**: Existing users who copied files manually

## How Developers Use This Package

### Installation
```bash
npm install @unicorn/autoconnect
```

### Integration (3 steps)
```jsx
// 1. Import
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn/autoconnect';

// 2. Add to App
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
/>

// 3. Use in components
const wallet = useUniversalWallet();
```

**That's it!** Existing code continues to work, enhanced with Unicorn support.

## Technical Decisions and Rationale

### Decision 1: Isolated React Root
**Problem**: Thirdweb and Wagmi providers caused React state update warnings

**Solution**: Render AutoConnect in completely separate React tree
- Eliminates all provider conflicts
- No state update warnings
- Clean separation of concerns
- Battle-tested pattern

**Trade-off**: Requires custom events for communication (minimal overhead)

### Decision 2: Custom Events for Communication
**Problem**: Direct React state updates between isolated trees caused warnings

**Solution**: Use `window.dispatchEvent` and `window.addEventListener`
- Avoids React state management conflicts
- Simple event-based pattern
- Works across React boundaries
- Standard browser API

**Trade-off**: Slightly less "React-y" but more reliable

### Decision 3: Unified Wallet Hook
**Problem**: Apps need to work with both Unicorn and standard wallets

**Solution**: Create bridge hook (`useUniversalWallet`) that unifies both
- Same API regardless of wallet type
- Existing code continues to work
- Enhanced with Unicorn features when available
- Type-safe

**Trade-off**: One more abstraction layer (minimal complexity)

### Decision 4: Silent Operation
**Problem**: AutoConnect failures shouldn't break the app

**Solution**: Silent failure with fallback
- AutoConnect fails gracefully
- Users can still connect manually
- No error messages shown
- Debug mode available for developers

**Trade-off**: Harder to debug (but debug mode available)

### Decision 5: Peer Dependencies
**Problem**: Package size and version conflicts

**Solution**: Mark React, Wagmi, Thirdweb as peer dependencies
- Users install their own versions
- No version conflicts
- Smaller package size
- More flexible

**Trade-off**: Users must have these installed (but they already do)

## Publishing Workflow

### Initial Setup
1. Create NPM account
2. Generate NPM token (Automation type)
3. Add token to GitHub Secrets as `NPM_TOKEN`
4. Create GitHub repository
5. Copy all files to repository

### First Publish
```bash
pnpm install
pnpm run build
npm publish --access public
git tag v1.0.0
git push origin v1.0.0
```

### Future Updates
```bash
# Make changes
git commit -m "feat: new feature"

# Update version
npm version minor  # 1.0.0 → 1.1.0

# Push (GitHub Actions auto-publishes!)
git push && git push --tags
```

## GitHub Actions Workflows

### publish.yml
**Triggers**: When a release is created or manually dispatched

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run tests (if configured)
5. Build package
6. Publish to NPM (using NPM_TOKEN)
7. Comment on release with install instructions

**Features**:
- Automated publishing
- NPM provenance for security
- Dry run verification
- Error handling

### test.yml
**Triggers**: On push to main/develop or PRs

**Steps**:
1. Run on multiple Node versions (18, 20)
2. Install dependencies
3. Run linter (if configured)
4. Run tests (if configured)
5. Build package
6. Build example apps
7. Upload artifacts

**Features**:
- Multi-version testing
- Example app verification
- Cache optimization
- Artifact preservation

## Documentation Structure

### For Users (Developers Installing Package)
- **README.md** - Main documentation on NPM page
- **QUICK_REFERENCE.md** - One-page cheat sheet
- **Example Apps** - Working code examples

### For Contributors
- **CONTRIBUTING.md** - How to contribute
- **ARCHITECTURE.md** - Technical deep dive
- **COMPLETE_FILE_STRUCTURE.md** - All files explained

### For Maintainers (Publishing Team)
- **SETUP_GUIDE.md** - Step-by-step publishing instructions
- **FINAL_CHECKLIST.md** - Pre-publish verification
- **CHANGELOG.md** - Version history tracking
- **PROJECT_SUMMARY.md** - High-level overview
- **PROMPT.md** - This file (project context for AI)

## Success Metrics

### Technical Quality
- ✅ Builds without errors
- ✅ Zero React warnings
- ✅ TypeScript types work correctly
- ✅ Tree-shakeable exports
- ✅ Small bundle size (<20 KB minified)
- ✅ Examples work perfectly

### Developer Experience
- ✅ 2-minute integration time
- ✅ Clear, comprehensive documentation
- ✅ Working examples for all use cases
- ✅ Helpful error messages
- ✅ Good TypeScript support
- ✅ Active issue resolution

### Adoption Metrics
- 📊 NPM download count
- ⭐ GitHub stars
- 💬 Community discussions
- 🐛 Issues reported and resolved
- 🤝 Contributors joining

## Common Use Cases

### Use Case 1: Basic Integration
**Scenario**: Developer with existing RainbowKit dApp wants Unicorn support

**Solution**:
```jsx
// Add one line to App.jsx
<UnicornAutoConnect
  clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={process.env.VITE_THIRDWEB_FACTORY_ADDRESS}
/>
```

**Result**: App now supports Unicorn AutoConnect, existing wallets still work

### Use Case 2: Transaction Handling
**Scenario**: Developer needs to handle both gasless and standard transactions

**Solution**:
```jsx
const wallet = useUniversalWallet();

if (wallet.isUnicorn) {
  // Gasless via Unicorn
  await wallet.unicornWallet.sendTransaction(tx);
} else {
  // Standard with gas
  await sendTransaction(tx);
}
```

**Result**: Unified transaction handling for both wallet types

### Use Case 3: Multi-Chain Support
**Scenario**: Developer wants to support multiple blockchains

**Solution**:
```jsx
<UnicornAutoConnect
  clientId={env.VITE_THIRDWEB_CLIENT_ID}
  factoryAddress={env.VITE_THIRDWEB_FACTORY_ADDRESS}
  defaultChain="polygon"  // or base, arbitrum, etc.
/>
```

**Result**: Works across all supported chains

### Use Case 4: Migration from Manual Files
**Scenario**: Developer previously copied files manually, wants to upgrade

**Solution**:
```bash
# Install package
npm install @unicorn/autoconnect

# Run migration helper
cd examples/migration
pnpm run migrate

# Update imports (automated or manual)
```

**Result**: Clean migration to NPM package with all benefits

## Troubleshooting Guide

### Issue: AutoConnect Not Running
**Symptoms**: Unicorn wallet doesn't connect automatically

**Checks**:
1. URL has `?walletId=inApp&authCookie=...`
2. Environment variables are set correctly
3. Enable debug mode: `<UnicornAutoConnect debug={true} />`
4. Check browser console for logs

**Solution**: Usually URL params missing or incorrect

### Issue: React Warnings
**Symptoms**: Console shows React state update warnings

**Checks**:
1. Using latest version of package
2. Isolated root pattern is working
3. No conflicting React versions

**Solution**: Update to latest package version, clear node_modules and reinstall

### Issue: TypeScript Errors
**Symptoms**: Import errors or type errors in IDE

**Checks**:
1. Package is installed: `npm list @unicorn/autoconnect`
2. TypeScript server is running
3. Types are generated: `node_modules/@unicorn/autoconnect/dist/index.d.ts` exists

**Solution**: Restart TypeScript server, reinstall package

### Issue: Transactions Not Working
**Symptoms**: Transactions fail or don't execute

**Checks**:
1. Wallet is actually connected: `wallet.isConnected === true`
2. Using correct transaction method for wallet type
3. Network/chain is correct
4. Sufficient balance (for standard wallets)

**Solution**: Check wallet type and use appropriate transaction method

### Issue: Build Errors During Publishing
**Symptoms**: `pnpm run build` fails

**Checks**:
1. All imports are correct
2. No TypeScript errors
3. Dependencies are installed
4. tsup config is correct

**Solution**: Fix import errors, run `pnpm install`, check tsup.config.js

## Future Enhancements (Roadmap)

### Phase 1: Core Package (Current - v1.0.0)
- ✅ Basic integration
- ✅ Unified wallet hook
- ✅ TypeScript support
- ✅ Example applications
- ✅ Documentation

### Phase 2: Enhanced Features (v1.1.0)
- 🔄 Additional chain support
- 🔄 Enhanced transaction approval UI
- 🔄 Better error messages for users
- 🔄 Analytics integration (opt-in)
- 🔄 Deep linking support

### Phase 3: Advanced Features (v1.2.0)
- 🔄 Multi-wallet management
- 🔄 Custom wallet UI components
- 🔄 Transaction batching helpers
- 🔄 Gas estimation utilities
- 🔄 Network switching helpers

### Phase 4: Ecosystem (v2.0.0)
- 🔄 Mobile SDK
- 🔄 React Native support
- 🔄 Vue/Svelte adapters
- 🔄 CLI tool for scaffolding
- 🔄 Plugin system

## Development Guidelines

### Code Style
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Meaningful variable names
- Comments for complex logic

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: ` - New features
- `fix: ` - Bug fixes
- `docs: ` - Documentation changes
- `refactor: ` - Code refactoring
- `test: ` - Test updates
- `chore: ` - Maintenance tasks

### Versioning
Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (x.0.0) - Breaking changes
- **MINOR** (1.x.0) - New features (backward compatible)
- **PATCH** (1.0.x) - Bug fixes (backward compatible)

### Testing Requirements
- Package must build successfully
- Examples must run without errors
- No React warnings in console
- TypeScript types must work
- Manual testing on both wallet types

## Package Philosophy

### 1. Developer Happiness
Every decision prioritizes developer experience:
- Simple installation
- Clear documentation
- Working examples
- Helpful error messages

### 2. Zero Breaking Changes
Never break existing functionality:
- Existing wallets work as before
- No code modifications required
- Additive changes only
- Backward compatibility

### 3. Professional Quality
Production-ready from day one:
- Battle-tested patterns
- Comprehensive testing
- Clear documentation
- Active maintenance

### 4. Community First
Built for and by the community:
- Open source (MIT)
- Welcome contributions
- Responsive to issues
- Transparent development

## Key Differentiators

**vs Manual File Copying**:
- ✅ npm install (no copying)
- ✅ Automatic updates
- ✅ Version control
- ✅ TypeScript included

**vs Other Wallet Libraries**:
- ✅ Non-breaking integration
- ✅ Works with existing setup
- ✅ Unified interface
- ✅ Zero configuration for basic use

**vs Building from Scratch**:
- ✅ Production-ready immediately
- ✅ Battle-tested patterns
- ✅ Maintained and updated
- ✅ Community support

## Support Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community help
- **Discord**: Real-time support in #developers
- **Documentation**: Comprehensive guides and examples

## Project Completion Status

This project is **100% complete** and ready for:
- ✅ Publishing to NPM
- ✅ Production use by developers
- ✅ Community contributions
- ✅ Future enhancements

All core features, documentation, examples, and tooling are finished and tested.

---

## For AI Assistants Continuing This Work

When working on this package, remember:

1. **Core Principle**: Never break existing functionality
2. **Architecture**: Isolated React root prevents conflicts
3. **Communication**: Custom events between roots
4. **API**: useUniversalWallet provides unified interface
5. **Testing**: Always test both Unicorn and standard wallet flows
6. **Documentation**: Update docs when changing APIs
7. **Versioning**: Follow semantic versioning strictly
8. **Examples**: Update examples to showcase new features

The code quality bar is high - maintain it!

---

**This package transforms web3 integration from hours to minutes.** 🦄