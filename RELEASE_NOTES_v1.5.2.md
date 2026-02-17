# Release Notes v1.5.2

## Dependency Updates & React 19 Support

**Release Date:** January 2026
**Version:** 1.5.2

### What's New

#### React 19 Support

AutoConnect now officially supports React 19 alongside React 18:

```json
"peerDependencies": {
  "react": "^18.2.0 || ^19.0.0",
  "react-dom": "^18.2.0 || ^19.0.0"
}
```

#### Optional React Dependencies

React and React-DOM are now marked as optional peer dependencies. This means:

- **Connector-only users**: No React warning if you only use `unicornConnector` without the UI components
- **Full integration users**: Install React as usual if you use `UnicornAutoConnect` or other UI components

```json
"peerDependenciesMeta": {
  "react": { "optional": true },
  "react-dom": { "optional": true }
}
```

#### Thirdweb SDK Update

Updated thirdweb SDK requirement to ^5.118.0 for latest features and fixes.

### Updated Peer Dependencies

| Dependency | Old | New |
|------------|-----|-----|
| react | ^18.2.0 | ^18.2.0 \|\| ^19.0.0 (optional) |
| react-dom | ^18.2.0 | ^18.2.0 \|\| ^19.0.0 (optional) |
| thirdweb | ^5.68.0 | ^5.118.0 |
| wagmi | ^2.17.0 | ^2.0.0 |

### Migration

No code changes required. Just update:

```bash
npm install @unicorn.eth/autoconnect@1.5.2
```

### Full Changelog

#### Changed
- Widened React peer dependency to support both v18 and v19
- Made React/React-DOM optional peer dependencies
- Updated thirdweb SDK to ^5.118.0
- Widened wagmi peer dependency to ^2.0.0

---

**Questions?** Open an issue on [GitHub](https://github.com/unicorn-eth/autoconnect/issues)
