# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Support for more blockchain networks
- Enhanced transaction approval UI
- Analytics integration
- Deep linking support
- Mobile SDK

## [1.0.0] - 2025-01-XX

### Added
- 🎉 Initial release of @unicorn.eth/autoconnect
- ✨ `UnicornAutoConnect` component for drop-in integration
- ✨ `useUniversalWallet` hook for unified wallet interface
- ✨ Isolated React root pattern to prevent provider conflicts
- ✨ Environment detection for Unicorn portal
- ✨ Support for Base, Polygon, Ethereum, Arbitrum, Optimism
- ✨ TypeScript definitions included
- ✨ Automatic gasless transactions for Unicorn users
- ✨ Debug mode for development
- ✨ Callback support (onConnect, onError)
- 📚 Complete documentation and examples
- 📦 Three example apps (basic, advanced, migration)
- 🤖 GitHub Actions for automated testing and publishing

### Features
- Zero breaking changes to existing dApps
- Works alongside RainbowKit, Wagmi, and other wallet providers
- Silent operation - no user-facing errors
- Configurable timeout and chain selection
- Full peer dependency support

### Technical Details
- Built with tsup for optimal bundle size
- Tree-shakeable exports
- CommonJS and ESM support
- React 18+ compatible
- Wagmi v2 compatible
- Thirdweb SDK v5 compatible

## Version History

### How to Read Version Numbers

Given a version number MAJOR.MINOR.PATCH (e.g., 1.2.3):

- **MAJOR** (1.x.x): Breaking changes - may require code updates
- **MINOR** (x.2.x): New features - backward compatible
- **PATCH** (x.x.3): Bug fixes - backward compatible

### Migration Guide

When upgrading between versions:

#### Patch Updates (1.0.x → 1.0.y)
```bash
npm update @unicorn.eth/autoconnect
```
No code changes needed.

#### Minor Updates (1.x.0 → 1.y.0)
```bash
npm install @unicorn.eth/autoconnect@latest
```
New features available, existing code continues to work.

#### Major Updates (1.x.x → 2.x.x)
```bash
npm install @unicorn.eth/autoconnect@2
```
Check migration guide in release notes for breaking changes.

## Release Notes Format

Each release includes:

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed soon
- **Removed**: Features that were removed
- **Fixed**: Bug fixes
- **Security**: Security fixes or improvements

## Upgrade Examples

### From Manual Integration to v1.0.0

**Before (Manual Files):**
```jsx
import UnicornAutoConnect from './components/UnicornAutoConnect';
import { useUniversalWallet } from './hooks/useUniversalWallet';
```

**After (NPM Package v1.0.0):**
```bash
npm install @unicorn.eth/autoconnect
```

```jsx
import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';
```

Everything else stays the same!

## Support

- **Bug Reports**: [GitHub Issues](https://github.com/MyUnicornAccount/autoconnect/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/MyUnicornAccount/autoconnect/discussions)
- **Security Issues**: security@unicorn.eth

## Links

- [NPM Package](https://www.npmjs.com/package/@unicorn.eth/autoconnect)
- [GitHub Repository](https://github.com/MyUnicornAccount/autoconnect)
- [Documentation](https://docs.unicorn.eth)
- [Discord Community](https://discord.gg/unicorn)