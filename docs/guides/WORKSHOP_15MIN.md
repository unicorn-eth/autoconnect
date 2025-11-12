# AutoConnect Workshop (15 Minutes)
## Using Unicorn.eth to Supercharge Your dApp

**Target Audience:** New developers building web3 apps
**Duration:** 15 minutes
**Goal:** Get developers excited about gasless transactions and jumpstart their dApp distribution

---

## Workshop Structure

### Part 1: The Problem (2 minutes)

**The real problem isn't just onboarding - it's ACTIVATION**

> "Lots of companies can help you 'onboard' users - get them connected to your dApp. But here's the dirty secret: **connection ≠ activation.**
>
> Your user connects... then what? They try to interact with your app and hit a wall:
> - Need ETH for gas? Go buy some.
> - Don't understand gas fees? Learn blockchain economics.
> - Want to try one feature? Pay $5-50 first.
>
> **Result: They connected, but they never USED your product. That's not activation.**"

**The two-stage problem:**

1. **Onboarding friction** (what everyone talks about):
   - ❌ Wallet installation required
   - ❌ Seed phrase complexity
   - ❌ Multi-step setup process

2. **Activation friction** (what actually kills your product):
   - ❌ Users need crypto for EVERY transaction
   - ❌ Gas fees make experimentation expensive
   - ❌ Wallet popups interrupt the flow
   - ❌ Users leave before experiencing your core value

**The harsh truth:**
> "Getting someone in the door is worthless if they can't actually USE your product. Activation is the metric that matters."

---

### Part 2: The Solution - AutoConnect + Unicorn.eth (3 minutes)

**Unicorn solves BOTH onboarding AND activation:**

> "What if your user could click a link, immediately start using your dApp, AND complete transactions without ever thinking about gas?"

**The complete flow comparison:**

**Other "Onboarding" Solutions:**
```
User clicks link → Connected ✓ → Tries to transact →
"You need ETH" → User leaves ❌
```

**Unicorn.eth Flow:**
```
User clicks link → Connected ✓ → Transacts freely ✓ →
Experiences your value ✓ → Activated! ✨
```

**Why Unicorn is Different:**

1. **🎯 Frictionless Distribution** - URL-based connection (onboarding solved)
2. **⚡ Gasless Transactions** - Users transact without ETH (activation solved)
3. **🔁 Continuous Engagement** - Every transaction is smooth, not just the first
4. **🦄 Smart Accounts** - Account abstraction enables the magic
5. **🔌 Standard Wagmi** - No custom code, works with existing hooks
6. **🌐 17 Networks** - Works across all major chains

**The Unicorn.eth Difference:**
- **Other solutions**: Get users TO your app
- **Unicorn.eth**: Get users USING your app

**Real activation features:**
- **Sponsored Transactions**: You control who pays gas (remove the #1 activation blocker)
- **Seamless UX**: No wallet popups, no gas estimation, no interruptions
- **Smart Account Features**: Batch transactions, social recovery, session keys
- **Zero Learning Curve**: Users don't need to understand blockchain to USE it

---

### Part 3: Live Coding - Integration (5 minutes)

**"Let me show you how easy this is - 3 steps, 5 minutes"**

#### Step 1: Install (30 seconds)

```bash
npm install @unicorn.eth/autoconnect wagmi viem
```

#### Step 2: Add the Connector (2 minutes)

```javascript
import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { unicornConnector } from '@unicorn.eth/autoconnect';

const config = createConfig({
  chains: [base],
  connectors: [
    // Your existing connectors...
    unicornConnector({
      clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: base.id,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});
```

**Environment variables:**
```bash
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
```

Get your keys at: https://thirdweb.com/dashboard

#### Step 3: Add Auto-Connect Component (1 minute)

```javascript
import { UnicornAutoConnect } from '@unicorn.eth/autoconnect';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UnicornAutoConnect debug={true} />
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

#### Step 4: Use Standard Wagmi (1.5 minutes)

**This is the beautiful part - NO custom code!**

```javascript
import { useSendTransaction, useSignMessage } from 'wagmi';

function MyComponent() {
  const { sendTransaction } = useSendTransaction();

  // For Unicorn users: Gasless transaction, approval dialog
  // For MetaMask users: Normal wallet popup
  const handleSend = () => {
    sendTransaction({
      to: '0x...',
      value: parseEther('0.01'),
    });
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

**That's it!** Your app now supports:
- ✅ Gasless transactions for Unicorn users
- ✅ URL-based auto-connection
- ✅ Beautiful approval dialogs
- ✅ Works alongside MetaMask, WalletConnect, etc.

---

### Part 4: The Distribution Model (3 minutes)

**"Now here's where it gets really powerful..."**

#### URL-Based Distribution

Share magic links that auto-connect users:
```
https://yourapp.com/?walletId=inApp&authCookie=user_session_token
```

**Use Cases:**

1. **Email Campaigns**
   - Send personalized links
   - Users click and are immediately connected
   - No wallet setup required

2. **Social Media**
   - Share links on Twitter, Discord, Telegram
   - Users onboard in one click
   - Track distribution analytics

3. **Referral Programs**
   - Each user gets a unique link
   - Track who brought new users
   - Reward top referrers

4. **QR Codes at Events**
   - Conference booth demo
   - Scan → Connected → Using your dApp
   - Collect email for follow-up

#### Sponsored Transactions - The Business Model

**Control who pays gas:**

```javascript
// Option 1: You sponsor everything (user acquisition mode)
// User transactions are FREE - you pay gas
// Great for: demos, trials, onboarding

// Option 2: Conditional sponsorship
// Sponsor first 5 transactions, then user pays
// Great for: freemium models

// Option 3: Third-party sponsors
// Partners sponsor transactions for their users
// Great for: B2B partnerships
```

**Example Business Models:**

1. **Freemium**
   - Free tier: 10 gasless transactions
   - Paid tier: Unlimited gasless transactions
   - Convert 15-20% of free users

2. **Partner-Sponsored**
   - Protocol sponsors transactions for their token holders
   - "Hold 100 XYZ tokens, get gasless transactions"
   - Drive token utility

3. **Ad-Supported**
   - Watch an ad, get 5 gasless transactions
   - Monetize attention instead of charging users

---

### Part 5: Demo Time (2 minutes)

**Show the live example:**

```bash
cd src/examples/basic
npm install --legacy-peer-deps
npm run dev
```

**Navigate the demo:**

1. **Connect without URL params**
   - Shows Unicorn in RainbowKit
   - Manual connection flow

2. **Connect with URL params**
   - Add `?walletId=inApp&authCookie=test`
   - Auto-connects immediately
   - Show the magic!

3. **Send a transaction**
   - Beautiful approval dialog
   - Gasless execution
   - Transaction succeeds without user having ETH

4. **Sign a message**
   - Smart account signatures (ERC-1271)
   - Works seamlessly

**Highlight the key insight:**
> "Notice: I'm using the EXACT same `useSendTransaction` hook as I would for MetaMask. No custom code. That's the power of v1.3 - it's just a connector."

---

## Part 6: Next Steps & Resources (< 1 minute)

**Quick resources:**

- **Docs:** README.md and INTEGRATION_GUIDE.md in the repo
- **API Reference:** QUICK_REFERENCE.md
- **Live Examples:** `src/examples/basic/` - 3 demo modes
- **Support:** GitHub Issues

**Challenge for attendees:**

> "Your homework: Take your existing dApp and add AutoConnect in the next 30 minutes. It's literally 3 steps. Then share your 'one-click demo link' in our Discord - and watch how many users actually COMPLETE transactions instead of just connecting."

**The pitch:**

> "Here's the truth: **Onboarding doesn't matter if users can't activate.**
>
> You can get users connected with a dozen different solutions. But if they can't transact without buying ETH and paying gas, they're going to leave before experiencing your product's value.
>
> AutoConnect solves the complete problem:
> - **Distribution**: URL-based connections get users IN
> - **Activation**: Gasless transactions get users USING your product
> - **Retention**: Frictionless UX keeps them coming back
>
> In web2, users click a link and immediately use your product. AutoConnect brings that same activation rate to web3.
>
> Stop measuring vanity metrics like 'wallet connections.' Start measuring what matters: activated users who complete transactions.
>
> **Onboarding gets them to the door. Unicorn gets them through it.**"

---

## Workshop Materials Needed

### Live Demo Setup
- [ ] Example app running locally
- [ ] Two browser windows (one normal, one with URL params)
- [ ] MetaMask installed for comparison
- [ ] Base network configured with test funds

### Handouts/Resources
- [ ] QR code to example app
- [ ] Link to GitHub repo
- [ ] Thirdweb dashboard signup link
- [ ] One-page "Integration Cheat Sheet"

### Visual Aids
- [ ] Activation funnel comparison (Traditional vs Unicorn)
  - Show dropoff rates at each stage
  - Highlight where users abandon in traditional flow
  - Show Unicorn's higher activation rate
- [ ] Before/After user flow diagram
- [ ] Architecture diagram (show where connector fits)
- [ ] Supported networks list
- [ ] Business model examples
- [ ] "Connection ≠ Activation" slide with metrics

---

## Speaker Notes

### Key Messages to Hammer Home

1. **"Activation, not just onboarding"**
   - Other solutions get users connected - Unicorn gets users TRANSACTING
   - Connection is step 1, activation is the goal
   - Every transaction needs to be frictionless, not just the first connection
   - "Connected users who can't transact = 0% activation"

2. **"Just a connector"**
   - Emphasize it works like MetaMask/WalletConnect
   - No framework lock-in
   - Use standard wagmi hooks

3. **"Distribution, not just tech"**
   - This is a user acquisition AND activation tool
   - Think links that lead to transactions, not just connections
   - Reduce friction = more activated users

4. **"Sponsored transactions = activation enabler"**
   - Control who pays gas (remove the #1 activation blocker)
   - Freemium possibilities
   - Partner opportunities
   - Let users experience value before asking for payment

5. **"5 minutes to integrate"**
   - Prove it live
   - Show it's not scary
   - Minimal changes to existing code

### Common Questions to Anticipate

**Q: How is this different from [other embedded wallet solution]?**
A: Great question! Many solutions help with onboarding - getting users connected. Unicorn focuses on ACTIVATION - getting users to actually USE your product. With gasless transactions, users can interact with your dApp without ever needing ETH. Connection without the ability to transact isn't activation.

**Q: Does this only work for Unicorn wallets?**
A: No! It's a connector that works alongside MetaMask, WalletConnect, etc. Users choose which wallet to use.

**Q: What if my user already has MetaMask?**
A: Perfect! They can use MetaMask. AutoConnect adds Unicorn as an OPTION, doesn't replace anything. MetaMask users get the standard experience, Unicorn users get gasless transactions.

**Q: How much does gas sponsorship cost?**
A: Depends on the network. On Base, transactions cost ~$0.001-0.01. Budget accordingly. Think of it as CAC (customer acquisition cost) - spending pennies to activate users who experience your product's value.

**Q: Is this production-ready?**
A: Yes! Version 1.3.5 is stable. Currently supports 17 networks including mainnet Ethereum, Base, Polygon, Arbitrum, and more.

**Q: Can I customize the approval dialog?**
A: Currently it's styled by the library. Customization options are on the roadmap.

**Q: What about security?**
A: Smart accounts use audited contracts (Thirdweb). Same security model as existing account abstraction solutions.

**Q: Can users still pay their own gas if they want?**
A: Yes! You have full control over sponsorship logic. You can sponsor all transactions, some transactions, or none - it's configurable per your business model.

---

## Post-Workshop Follow-Up

**Send attendees:**

1. **Integration checklist email**
   - Step-by-step setup
   - Link to docs
   - Support channels

2. **Example "magic link" template**
   - Show them how to construct URLs
   - Parameter reference
   - Analytics tracking ideas

3. **Invite to community**
   - Discord for support
   - Show & tell channel for demos
   - Feature requests

4. **Activation metrics framework**
   - Track connection rate vs activation rate
   - Measure transactions completed, not just wallets connected
   - A/B test: users with Unicorn vs traditional wallet
   - Calculate ROI: gas sponsorship cost vs activated user value

5. **Business model brainstorm**
   - How could they use sponsored transactions?
   - What's their user acquisition AND activation strategy?
   - Partnership opportunities

---

## Success Metrics

**A successful workshop means:**

- [ ] At least 80% understand the difference between onboarding and activation
- [ ] At least 50% can articulate why gasless transactions matter for activation
- [ ] At least 30% commit to trying integration this week
- [ ] At least 10% share a demo link with completed transactions within 7 days
- [ ] Zero attendees think "this is just another embedded wallet"
- [ ] Zero attendees think "this sounds complicated"

**Key takeaway:**

> "Unicorn doesn't just get users connected - it gets them activated. One click, and your users are transacting."

---

## Appendix: Quick Code Snippets

### Complete Minimal Example

```javascript
// App.jsx
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { unicornConnector, UnicornAutoConnect } from '@unicorn.eth/autoconnect';
import { useSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';

const config = createConfig({
  chains: [base],
  connectors: [
    unicornConnector({
      clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
      factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
      defaultChain: base.id,
    }),
  ],
  transports: { [base.id]: http() },
});

const queryClient = new QueryClient();

function SendButton() {
  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();

  if (!isConnected) return <p>Connect wallet first</p>;

  return (
    <button
      onClick={() => sendTransaction({
        to: '0x7049747E615a1C5C22935D5790a664B7E65D9681',
        value: parseEther('0.01'),
      })}
      disabled={isPending}
    >
      {isPending ? 'Sending...' : 'Send 0.01 ETH'}
    </button>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UnicornAutoConnect debug={true} />
        <SendButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### URL Construction

```javascript
// Generate magic links for users
function generateMagicLink(userId, sessionToken) {
  const baseUrl = 'https://yourapp.com';
  const params = new URLSearchParams({
    walletId: 'inApp',
    authCookie: sessionToken,
    // Optional: add your own params
    userId: userId,
    source: 'email_campaign',
  });

  return `${baseUrl}?${params.toString()}`;
}

// Example
const link = generateMagicLink('user123', 'session_abc');
// https://yourapp.com?walletId=inApp&authCookie=session_abc&userId=user123&source=email_campaign
```

### Supported Networks Quick Reference

```javascript
import {
  mainnet,     // Ethereum (1)
  base,        // Base (8453) - Recommended
  polygon,     // Polygon (137)
  arbitrum,    // Arbitrum (42161)
  optimism,    // Optimism (10)
  gnosis,      // Gnosis (100)
  avalanche,   // Avalanche (43114)
  bsc,         // BNB Chain (56)
  zkSync,      // zkSync Era (324)
  scroll,      // Scroll (534352)
  zora,        // Zora (7777777)
} from 'wagmi/chains';
```

---

**Good luck with your workshop! 🦄**
