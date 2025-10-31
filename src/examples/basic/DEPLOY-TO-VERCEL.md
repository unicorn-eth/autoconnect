# Deploy to Vercel - Quick Guide

## What's Ready

✅ **UX-friendly demo** is now the default (set in `src/main.jsx`)
✅ **Fully responsive** - works on mobile, tablet, desktop
✅ **Clear language** - no technical jargon
✅ **Documented customization** - confirmation dialog options explained

---

## Quick Deploy Steps

### 1. Navigate to project
```bash
cd /Users/russellcastagnaro/Documents/source/autoconnect/src/examples/basic
```

### 2. Test locally (optional)
```bash
npm run dev
# Opens on http://localhost:3001
# Test on mobile using your computer's IP: http://YOUR_IP:3001
```

### 3. Build to verify
```bash
npm run build
# Should complete without errors
```

### 4. Deploy to Vercel
```bash
vercel

# First time? Run:
vercel --prod
```

---

## Vercel Configuration

### Build Settings (if prompted)

**Framework**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install --legacy-peer-deps`

### Environment Variables (REQUIRED)

Add these in Vercel dashboard → Your Project → Settings → Environment Variables:

```
VITE_THIRDWEB_CLIENT_ID=4e8c81182c3709ee441e30d776223354
VITE_THIRDWEB_FACTORY_ADDRESS=0xD771615c873ba5a2149D5312448cE01D677Ee48A
VITE_WALLETCONNECT_PROJECT_ID=b68c5c018517f32dc678237299644367
```

⚠️ **Important**: These must start with `VITE_` prefix for Vite to expose them to the browser.

---

## Testing the Deployed App

### Desktop Testing
1. Open the Vercel URL in Chrome
2. Click "Connect Wallet"
3. Connect MetaMask or use Unicorn URL params
4. Test "Send Money" - watch for confirmation dialog
5. Test "Sign a Message" - watch for signature dialog

### Mobile Testing
1. Open Vercel URL on your phone
2. Check if layout adapts properly
3. Connect wallet (should work smoothly)
4. Send a transaction - note how confirmation looks
5. Test both portrait and landscape

### Confirmation Dialog Testing

**To trigger Unicorn wallet confirmation**:
Add URL params: `?walletId=inApp&authCookie=YOUR_AUTH_COOKIE`

**What to look for**:
- Does the dialog fit the viewport?
- Is text readable on mobile?
- Are buttons easily tappable?
- Does "gasless" messaging make sense?

---

## Sharing with UX Team

### Email Template

```
Hi [UX Team],

I've deployed the Unicorn Wallet demo for your review:

🔗 Demo URL: https://[your-app].vercel.app

Please review these aspects:
1. **Responsive design** - Test on mobile, tablet, desktop
2. **Confirmation dialogs** - What you see when sending transactions
3. **Language** - Does it make sense to non-crypto users?
4. **Customization opportunities** - Where would you add branding?

Testing instructions:
- Connect any wallet (MetaMask recommended for initial testing)
- Try "Send Money" (uses test amounts, safe to try)
- Try "Sign a Message"
- Note: Scroll to bottom for customization documentation

Looking for feedback on:
- Confusing language
- Mobile usability issues
- Customization suggestions
- Overall UX impressions

Thanks!
```

---

## Switching Between Demos

Currently set to: **UX Demo** ✅

To switch to technical test suite, edit `src/main.jsx`:

```javascript
const USE_UX_DEMO = false  // Changes to technical test suite
```

Then rebuild and redeploy:
```bash
npm run build
vercel --prod
```

---

## Mobile Device Testing

### Test URLs on Real Devices

1. **Get your Vercel URL** (after deploying)
2. **Open on phone/tablet** using:
   - QR code (generate at qr-code-generator.com)
   - Text/email the link to yourself
   - Vercel dashboard has a built-in QR code

### Chrome DevTools Responsive Testing

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Cmd/Ctrl + Shift + M)
3. Select device presets or enter custom dimensions
4. Test these viewports:
   - iPhone SE (375px)
   - iPhone 14 Pro (390px)
   - iPad (768px)
   - Desktop (1440px)

---

## Troubleshooting

### Build fails with "cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Environment variables not working
- Make sure they start with `VITE_` prefix
- Redeploy after adding env vars (they're not applied until redeploy)
- Check Vercel dashboard → Deployments → Your deployment → Environment Variables

### Mobile layout broken
- The UX demo uses responsive CSS Grid
- Should adapt automatically
- If issues persist, check browser console for errors

### Confirmation dialogs not showing
- Only shows when transactions/signatures are requested
- Unicorn wallet needs proper env vars set
- Try with MetaMask first to verify app works

---

## Files Overview

**Demo Files**:
- `src/App-UX-Demo.jsx` - UX-friendly demo (currently active)
- `src/App.jsx` - Technical test suite (preserved)
- `src/main.jsx` - Demo switcher

**Documentation**:
- `README-UX-DEMO.md` - Demo comparison and switching guide
- `UX-IMPROVEMENTS.md` - What was improved and why
- `DEPLOY-TO-VERCEL.md` - This file

---

## Next Steps After UX Review

Based on feedback, you might want to:

1. **Customize branding** - Update colors, add logo
2. **Adjust language** - Change wording based on feedback
3. **Add features** - Additional user-requested functionality
4. **Improve confirmations** - Work with dev team on Thirdweb config

All changes can be made in `App-UX-Demo.jsx` without affecting the technical test suite!

---

## Questions?

- **Deployment issues**: Check Vercel docs or your DevOps team
- **Code changes**: Modify `App-UX-Demo.jsx` and redeploy
- **Customization**: See `README-UX-DEMO.md` for Thirdweb options
- **UX feedback**: Collect in your preferred format (Notion, Figma, etc.)

Ready to deploy! 🚀
