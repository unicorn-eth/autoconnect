# Release Notes v1.5.0

## 🔧 Wagmi v2 Only Release

**Release Date:** January 2026
**Version:** 1.5.0

### Breaking Changes

#### Wagmi v1 Support Removed

This release removes the bundled wagmi v1 connector (`unicornConnectorV1`, `UnicornConnector`) from the main package. This was necessary because:

- The v1 connector imports `Connector` from `wagmi`, which doesn't exist in wagmi v2
- Bundling both v1 and v2 code caused import errors for wagmi v2 users
- Most projects have migrated to wagmi v2

### Migration Guide

**If you're using wagmi v2 (most users):** No changes needed! Just update to v1.5.0.

**If you're still using wagmi v1:** Install the legacy version:

```bash
npm install @unicorn.eth/autoconnect@legacy
```

The `legacy` dist-tag points to the last version with wagmi v1 support.

### What's Changed

#### Removed
- `unicornConnectorV1` export (wagmi v1 connector)
- `UnicornConnector` class export (wagmi v1)
- `src/connectors/unicornConnector.v1.js` is no longer bundled

#### Unchanged
- `unicornConnector` (wagmi v2) - works exactly the same
- `UnicornAutoConnect` component
- All hooks (`useUniversalWallet`, `useUniversalTransaction`, etc.)
- All UI components
- Web3Modal integration helpers

### Benefits

- **Smaller bundle size** - No unused v1 code
- **No import errors** - Clean wagmi v2 compatibility
- **Simpler maintenance** - Single connector to support

### Checking Your Wagmi Version

Not sure which wagmi version you're using? Check your `package.json`:

```bash
npm list wagmi
```

- `wagmi@2.x.x` → Use `@unicorn.eth/autoconnect@latest` (v1.5.0+)
- `wagmi@1.x.x` → Use `@unicorn.eth/autoconnect@legacy`

### Full Changelog

#### Added
- Clear documentation about wagmi version requirements

#### Changed
- Package now targets wagmi v2 exclusively
- Updated package description

#### Removed
- Wagmi v1 connector exports from main entry point

#### Fixed
- Import errors when using with wagmi v2 projects

---

**Questions?** Open an issue on [GitHub](https://github.com/unicorn-eth/autoconnect/issues)
