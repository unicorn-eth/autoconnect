# Contributing to @unicorn.eth/autoconnect

Thank you for considering contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+ (recommended) or npm/yarn
- Git

### Getting Started

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/autoconnect.git
cd autoconnect
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Build the package**

```bash
pnpm run build
```

4. **Link for local development**

```bash
pnpm link
```

5. **Test in an example app**

```bash
cd examples/basic
pnpm install
pnpm link @unicorn.eth/autoconnect
pnpm run dev
```

## Project Structure

```
@unicorn.eth/autoconnect/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/              # React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript definitions
│   └── index.js            # Main export
├── examples/               # Example apps
├── .github/workflows/      # CI/CD
└── dist/                   # Build output (gitignored)
```

## Making Changes

### Branch Naming

- `feature/your-feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-you-changed` - Documentation
- `refactor/what-you-refactored` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for additional chains
fix: resolve wallet disconnect issue
docs: update README with new examples
refactor: simplify environment detection
```

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic
- Keep functions small and focused

### Testing Your Changes

1. **Build the package**
```bash
pnpm run build
```

2. **Test in basic example**
```bash
cd examples/basic
pnpm run dev
```

3. **Test in advanced example**
```bash
cd examples/advanced
pnpm run dev
```

4. **Test both modes**
- Normal: `http://localhost:3000`
- Unicorn: `http://localhost:3000/?walletId=inApp&authCookie=test`

## Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write clear, commented code
- Update documentation if needed
- Add examples if adding new features

3. **Test thoroughly**
- Build the package
- Test in example apps
- Check for console errors
- Test both Unicorn and standard wallet flows

4. **Commit your changes**
```bash
git add .
git commit -m "feat: description of your changes"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
- Go to GitHub
- Click "New Pull Request"
- Describe your changes
- Reference any related issues

### PR Checklist

Before submitting, ensure:

- [ ] Code builds successfully (`pnpm run build`)
- [ ] Examples work correctly
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)
- [ ] TypeScript definitions updated (if needed)
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

## Types of Contributions

### 🐛 Bug Fixes

Found a bug? Great!

1. Check if an issue exists
2. If not, create one describing the bug
3. Fork, fix, and submit a PR
4. Reference the issue in your PR

### ✨ New Features

Have an idea for a new feature?

1. Open an issue to discuss it first
2. Wait for maintainer feedback
3. If approved, fork and implement
4. Submit PR with examples and docs

### 📚 Documentation

Documentation improvements are always welcome!

- Fix typos
- Clarify confusing sections
- Add examples
- Improve API documentation

### 🎨 Examples

More examples help users understand the package:

- Add new integration scenarios
- Show advanced use cases
- Demonstrate best practices

## Adding a New Chain

To add support for a new blockchain:

1. **Update chain imports** in `src/components/UnicornAutoConnect.jsx`:

```javascript
import { base, polygon, newChain } from 'thirdweb/chains';

const getChainByName = (chainName) => {
  const chains = {
    'base': base,
    'polygon': polygon,
    'newChain': newChain, // Add here
  };
  return chains[chainName?.toLowerCase()] || base;
};
```

2. **Update TypeScript types** in `src/types/index.d.ts`:

```typescript
export type SupportedChain = 
  | 'base' 
  | 'polygon'
  | 'newChain'; // Add here
```

3. **Update documentation** in README.md

4. **Add example** showing the new chain

5. **Test thoroughly** with the new chain

## Debugging Tips

### Enable Debug Mode

```jsx
<UnicornAutoConnect debug={true} />
```

This logs helpful information to the console.

### Common Issues

**Wallet not connecting?**
- Check URL parameters
- Verify environment variables
- Check browser console

**React warnings?**
- Check for state updates in unmounted components
- Verify isolated React root is working

**TypeScript errors?**
- Restart TypeScript server
- Check type definitions are correct
- Run `pnpm run build` to regenerate types

## Release Process

(For maintainers only)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -m "chore: release v1.x.x"`
4. Tag: `git tag v1.x.x`
5. Push: `git push && git push --tags`
6. GitHub Actions will automatically publish to NPM

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- Keep discussions on-topic

## Questions?

- **GitHub Discussions**: Ask questions
- **Discord**: Real-time help in #developers
- **GitHub Issues**: Report bugs or request features

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to @unicorn.eth/autoconnect! 🦄