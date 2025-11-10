# Portal Setup & App Center Submission Guide

**Getting Your dApp Listed in Unicorn Portals**

---

## Overview

Once you've integrated AutoConnect into your dApp, the next step is getting discovered by users through Unicorn portals like:
- **app.ethdenver.com** - ETHDenver community
- **app.polygon.ac** - Polygon ecosystem
- **app.mylink.fun** - MyLink community

This guide walks you through:
1. Creating a test community for local development
2. Using Live Preview to validate your integration
3. Submitting to App Center for portal listing

---

## Part 1: Create Your Test Community

### Step 1: Access the Admin Portal

1. Go to **https://admin.myunicornaccount.com/login**
2. Create a free starter account if you don't have one
3. Log in to your dashboard

### Step 2: Add Your dApp

1. Navigate to **"My Community"** in the sidebar
2. Click **"Add an app"**
3. Scroll to the bottom and click **"Add a custom dApp"**

### Step 3: Enter dApp Details

You'll be asked to complete the integration checkbox:

**"Yes, I've finished the Integration?"**
- ✅ Check this box (even if still testing - this enables the testing workflow)

Click **"Next"** to proceed.

### Step 4: Fill in dApp Information

Provide the following details:

**dApp URL:**
- For local testing: `http://localhost:5173` (or your dev server port)
- For staging: `https://staging.yourapp.com`
- For production: `https://yourapp.com`

**Application Title:**
- The name of your dApp as it will appear in portals
- Example: "SporkDAO Patronage Claims"

**Description:**
- Brief description of what your dApp does
- Users will see this when browsing portals
- Example: "Claim your SporkDAO patronage rewards gaslessly"

**Logo:**
- Upload your dApp logo
- Recommended: 512x512px PNG with transparent background
- This appears in portal listings

Click **"Submit"** or **"Save"** to create your test community entry.

---

## Part 2: Test with Live Preview

### What is Live Preview?

Live Preview is a testing feature that lets you validate your AutoConnect integration before submitting to App Center. It generates the proper URL parameters that Unicorn portals use to launch your dApp.

### How to Access Live Preview

1. After adding your dApp, you'll see it listed in your "My Community" page
2. Look for the **Live Preview** link on the right side of your dApp entry
3. Click **"Live Preview"** to test your integration

### What Happens When You Click Live Preview?

Live Preview will:
1. Generate a URL like: `http://localhost:5173/?walletId=inApp&authCookie=eyJhbGci...`
2. Open your dApp in a new tab/window
3. Automatically trigger the `UnicornAutoConnect` component
4. Connect the user's wallet without any manual steps

### Testing Checklist

Use Live Preview to verify:

- [ ] **Auto-Connection Works**
  - Page loads with URL parameters
  - `UnicornAutoConnect` component detects them
  - Wallet connects automatically
  - No errors in console

- [ ] **Wallet Address Displays**
  - User's address appears in your UI
  - `useAccount()` hook returns connected state
  - Account info is accessible

- [ ] **Transactions Work**
  - `useSendTransaction` executes successfully
  - Approval dialog appears (Unicorn UI)
  - Transaction completes gaslessly
  - Success state updates correctly

- [ ] **Error Handling Works**
  - Connection errors display properly
  - Transaction errors are caught
  - User sees helpful error messages

- [ ] **Chain Switching Works** (if multi-chain)
  - `useSwitchChain` functions correctly
  - Wallet switches to requested chain
  - UI updates to reflect new chain

### Troubleshooting Live Preview Issues

**Issue: Auto-connect doesn't work**
- ✅ Verify `<UnicornAutoConnect />` component is rendered
- ✅ Check component is inside `<WagmiProvider>`
- ✅ Ensure `unicornConnector` is in your wagmi config
- ✅ Check browser console for errors

**Issue: Transactions fail**
- ✅ Verify gas sponsorship is configured (Thirdweb dashboard)
- ✅ Check you're using supported network (17 networks available)
- ✅ Ensure smart account has minimal funds for deployment (first tx only)

**Issue: "Invalid authCookie" error**
- ✅ Make sure you're clicking from Live Preview link (don't manually construct URL)
- ✅ Try logging out and back into admin portal
- ✅ Recreate your test community entry

---

## Part 3: Submit to App Center

Once you've validated everything works with Live Preview, you're ready to submit for official listing.

### Prerequisites for Submission

Before submitting, ensure:

**✅ Integration Complete:**
- AutoConnect is fully integrated
- All wagmi hooks work correctly
- Error handling is robust
- No console errors

**✅ Publicly Deployed:**
- dApp is deployed to a public URL (not localhost)
- URL is accessible from anywhere
- SSL certificate is valid (HTTPS)

**✅ Production Ready:**
- Tested on multiple devices
- Mobile responsive (recommended)
- Loading states work
- User experience is polished

**✅ Documentation Ready:**
- Clear description of functionality
- Logo is high quality
- Any special instructions documented

### Submission Process

**Step 1: Complete the Submission Form**

Submit your dApp through the official form:
**https://forms.gle/3kyuEce2fZtd7Umy9**

**Step 2: Information Required**

The form will ask for:

**Basic Information:**
- dApp name
- Production URL
- Contact email
- Project description

**Integration Details:**
- Confirmation of AutoConnect integration
- Supported networks/chains
- Gas sponsorship configuration

**Visuals:**
- Logo (512x512px recommended)
- Screenshots of your dApp (optional but helpful)
- Demo video link (optional)

**Additional Info:**
- Target audience/community
- Special features or requirements
- Preferred portal categories

**Step 3: Review Timeline**

- **Submission:** Form submitted
- **Review:** Typically 1-2 weeks
- **Testing:** Team validates integration
- **Approval:** You'll receive notification via email
- **Listing:** dApp appears in relevant portals

### After Approval

Once approved, your dApp will be listed in:

**Community Portals:**
- app.ethdenver.com (if relevant to ETHDenver)
- app.polygon.ac (if built on Polygon)
- app.mylink.fun (general community portal)
- Other relevant community portals

**Your Listing Includes:**
- dApp name and logo
- Description
- "Launch" button (generates authCookie dynamically)
- Categories/tags

**Users Will:**
1. Browse the portal
2. See your dApp in listings
3. Click "Launch"
4. Land on your dApp with `?walletId=inApp&authCookie=...`
5. Auto-connect and start transacting

---

## Part 4: Testing Manually (Advanced)

If you want to test the auto-connect flow without Live Preview, you can manually construct the URL:

### Manual URL Construction

```
http://localhost:5173/?walletId=inApp&authCookie=test_cookie_value
```

**Note:** This may not work with full authentication, but it will trigger the `UnicornAutoConnect` component and let you test the detection logic.

### Testing in Production

Before submitting, test your production URL:

```
https://yourapp.com/?walletId=inApp&authCookie=test_cookie_value
```

Verify:
- URL parameters are preserved
- Component detects Unicorn environment
- No CORS or security issues
- HTTPS works correctly

---

## Part 5: Post-Launch Tracking

### Monitor Your Portal Performance

After getting listed, track:

**Portal Traffic:**
- Which portals drive the most users?
- What time of day sees most traffic?
- Which communities engage most?

**Conversion Metrics:**
- Portal click → dApp load rate
- dApp load → wallet connect rate
- Wallet connect → first transaction rate
- Overall portal → transaction conversion

**User Behavior:**
- What do users do first in your dApp?
- Where do they drop off?
- What features are most used?

### Analytics Implementation

Add tracking to measure portal-specific performance:

```javascript
// In your app, detect referral from portal
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const walletId = params.get('walletId');
  const referrer = document.referrer;

  if (walletId === 'inApp') {
    // Track portal entry
    analytics.track('Portal Entry', {
      referrer: referrer,
      portal: extractPortalName(referrer), // e.g., 'ethdenver'
      timestamp: new Date(),
    });
  }
}, []);
```

### Iterate Based on Data

Use portal performance data to:
- Request listing in similar portals
- Optimize for high-converting portals
- Improve features users discover via portals
- Adjust gas sponsorship based on portal traffic

---

## Frequently Asked Questions

### About Testing

**Q: Can I test on localhost?**
A: Yes! Live Preview works with localhost URLs. Perfect for development.

**Q: Do I need to deploy before testing?**
A: No, test locally first. Only deploy for App Center submission.

**Q: How many test communities can I create?**
A: No limit. Create as many as needed for different testing scenarios.

### About Submission

**Q: How long does approval take?**
A: Typically 1-2 weeks. Complex integrations may take longer.

**Q: What if my submission is rejected?**
A: You'll receive feedback and can resubmit after addressing issues.

**Q: Can I update my dApp after listing?**
A: Yes! Update details in the admin portal anytime. URL changes may require re-review.

**Q: Is there a cost to get listed?**
A: No listing fee. You only pay for gas sponsorship (optional).

### About Gas Sponsorship

**Q: Do I have to sponsor gas?**
A: No, it's optional. But it's the key value proposition for portal users.

**Q: How much does gas sponsorship cost?**
A: On Base: ~$0.001-0.01 per transaction. Configure limits in Thirdweb dashboard.

**Q: Can I sponsor only certain users?**
A: Yes! Configure conditional sponsorship (e.g., first 10 transactions, token holders only).

### About Portals

**Q: Which portals will my dApp appear in?**
A: Depends on your dApp's category, target audience, and networks supported. Team decides during review.

**Q: Can I request specific portals?**
A: Yes, mention preferences in submission form.

**Q: What if I only want to be in one portal?**
A: Specify in submission form. You control where you're listed.

---

## Troubleshooting Guide

### Common Issues During Testing

**Issue: Live Preview link doesn't work**

**Solutions:**
1. Ensure dApp is running (`npm run dev`)
2. Check URL in test community matches dev server
3. Verify firewall isn't blocking localhost
4. Try different browser
5. Clear browser cache and cookies

**Issue: Auto-connect triggers but fails**

**Solutions:**
1. Check `unicornConnector` is in wagmi config
2. Verify Thirdweb client ID is set
3. Ensure factory address is correct
4. Check network is supported (17 networks available)
5. Look for errors in browser console

**Issue: Transactions fail with "insufficient funds"**

**Solutions:**
1. Configure gas sponsorship in Thirdweb dashboard
2. Add small amount of native token to smart account (for deployment)
3. Verify you're on a supported network
4. Check sponsorship rules/limits

### Common Issues During Submission

**Issue: Form submission fails**

**Solutions:**
1. Ensure all required fields are filled
2. Verify production URL is accessible
3. Check logo file size (< 5MB recommended)
4. Try different browser
5. Contact support if issue persists

**Issue: Approval is delayed**

**Actions:**
1. Be patient - reviews take 1-2 weeks
2. Check spam folder for emails
3. Ensure contact email is correct
4. Follow up after 2 weeks if no response

---

## Next Steps

After getting listed in portals:

1. **Announce it!**
   - Tell your community
   - Share on social media
   - Mention which portals you're on

2. **Monitor performance**
   - Track portal-specific metrics
   - Identify best-converting portals
   - Optimize based on data

3. **Get more listings**
   - Request additional portals
   - Partner with communities
   - Grow your distribution

4. **Improve the experience**
   - Iterate based on user feedback
   - Add features users request
   - Optimize conversion funnel

---

## Resources

**Admin Portal:**
- https://admin.myunicornaccount.com/login

**Submission Form:**
- https://forms.gle/3kyuEce2fZtd7Umy9

**Example Portals:**
- app.ethdenver.com
- app.polygon.ac
- app.mylink.fun

**Documentation:**
- Integration Guide: `INTEGRATION_GUIDE.md`
- Quick Reference: `QUICK_REFERENCE.md`
- Workshop Talk: `WORKSHOP_10MIN.md`

**Support:**
- GitHub Issues: [your repo link]
- Discord: [your discord link]
- Email: [support email]

---

## Summary

**Getting listed in Unicorn portals:**

1. ✅ **Integrate AutoConnect** (10 minutes of code)
2. ✅ **Create test community** (5 minutes)
3. ✅ **Test with Live Preview** (validate everything works)
4. ✅ **Deploy to production** (public URL)
5. ✅ **Submit to App Center** (fill out form)
6. ✅ **Wait for approval** (1-2 weeks)
7. ✅ **Get discovered** (users find you in portals!)

**The result:** Thousands of users discover your dApp in established portals where they already browse for apps, and can use it gaslessly with one click.

That's distribution. 🦄

---

*Last updated: November 2025*
*For questions or issues, open a GitHub issue or contact support.*
