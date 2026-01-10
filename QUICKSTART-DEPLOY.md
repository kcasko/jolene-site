# Quick Start Deployment Guide

Follow these steps in order to deploy your site with full commerce functionality.

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account with jolene-site repository access
- [ ] A valid email address (jolenecasko@gmail.com)
- [ ] Business information for Stripe account setup

---

## Step 1: Create Netlify Account (5 minutes)

### Action Items:

1. **Go to Netlify**
   - Visit: https://netlify.com
   - Click "Sign up" in top right

2. **Sign up with GitHub**
   - Click "GitHub" button
   - Authorize Netlify to access your repositories
   - You'll be redirected back to Netlify dashboard

3. **Verify email**
   - Check your email for Netlify verification
   - Click verification link

### ✅ Checkpoint:
You should now see the Netlify dashboard with "Add new site" button visible.

---

## Step 2: Import Your Repository (5 minutes)

### Action Items:

1. **Start site import**
   - Click "Add new site" → "Import an existing project"
   - Click "Deploy with GitHub"

2. **Authorize repository access**
   - If prompted, authorize Netlify to access your repos
   - Search for "jolene-site"
   - Click on the repository

3. **Configure build settings**
   - **Site name**: Choose something (e.g., `jolene-portfolio`)
   - **Branch to deploy**: `master`
   - **Base directory**: Leave EMPTY
   - **Build command**: Leave EMPTY
   - **Publish directory**: `.` (just a period)
   - Click "Deploy site"

4. **Wait for initial deploy**
   - Netlify will build and deploy your site (1-2 minutes)
   - You'll see a random URL like `https://random-name-123.netlify.app`

### ✅ Checkpoint:
Visit your temporary Netlify URL. The site should load (but checkout won't work yet - that's expected).

---

## Step 3: Set Up Custom Domain (10 minutes)

### Action Items:

1. **Add custom domain**
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain"
   - Enter: `jolene.taurustech.me`
   - Click "Verify"

2. **Configure DNS**
   - Netlify will show DNS instructions
   - You need to add a CNAME record in your DNS provider

   **If using Cloudflare/your DNS provider:**
   - Type: `CNAME`
   - Name: `jolene` (or `@` if using root)
   - Value: `your-site.netlify.app`
   - TTL: Auto or 1 hour

3. **Wait for DNS propagation**
   - Can take 5 minutes to 48 hours
   - Usually works in 10-15 minutes

4. **Enable HTTPS**
   - Once DNS is verified, Netlify auto-provisions SSL
   - This is automatic with Let's Encrypt
   - Takes 1-2 minutes

### ✅ Checkpoint:
Visit https://jolene.taurustech.me - site should load with HTTPS (green padlock).

---

## Step 4: Create Stripe Account (15 minutes)

### Action Items:

1. **Sign up for Stripe**
   - Visit: https://stripe.com
   - Click "Start now"
   - Use email: `jolenecasko@gmail.com`

2. **Complete account setup**
   - Business type: Individual
   - Business name: Jolene Casko Digital Collage Art
   - Industry: Creative services
   - Website: https://jolene.taurustech.me

3. **Verify email**
   - Check email for Stripe verification
   - Click verification link

4. **Stay in TEST mode**
   - **IMPORTANT**: Don't activate live payments yet
   - We'll test first, then switch to live mode
   - Top of dashboard should say "TEST MODE" with a toggle

### ✅ Checkpoint:
You should see the Stripe dashboard with "TEST MODE" indicator at the top.

---

## Step 5: Get Stripe API Keys (5 minutes)

### Action Items:

1. **Navigate to API keys**
   - In Stripe dashboard, click "Developers" (top right)
   - Click "API keys"
   - You should see "TEST MODE" at the top

2. **Copy test keys**

   Open a text editor and copy these keys:

   **Publishable key** (starts with `pk_test_`):
   ```
   Click "Reveal test key" if hidden
   Copy the entire key
   ```

   **Secret key** (starts with `sk_test_`):
   ```
   Click "Reveal test key" if hidden
   Copy the entire key
   ```

   **IMPORTANT**: Keep these keys handy for Step 6. Never share them publicly.

### ✅ Checkpoint:
You should have two keys copied:
- Publishable key: `pk_test_...`
- Secret key: `sk_test_...`

---

## Step 6: Configure Environment Variables (5 minutes)

### Action Items:

1. **Go to Netlify environment variables**
   - In Netlify dashboard, click your site
   - Go to "Site settings" → "Environment variables"
   - Click "Add a variable"

2. **Add Stripe Secret Key**
   - Key: `STRIPE_SECRET_KEY`
   - Value: Paste your `sk_test_...` key
   - Click "Create variable"

3. **Add Stripe Publishable Key**
   - Click "Add a variable"
   - Key: `STRIPE_PUBLISHABLE_KEY`
   - Value: Paste your `pk_test_...` key
   - Click "Create variable"

4. **Add other required variables**

   Add each of these one by one:

   | Key | Value |
   |-----|-------|
   | `CONTACT_EMAIL` | `jolenecasko@gmail.com` |
   | `URL` | `https://jolene.taurustech.me` |

5. **Trigger redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for deploy to complete (1-2 minutes)

### ✅ Checkpoint:
Under Environment variables, you should see 4 variables listed (values will be hidden).

---

## Step 7: Set Up Stripe Webhook (10 minutes)

### Action Items:

1. **Get your webhook URL**
   - Your webhook URL is:
   ```
   https://jolene.taurustech.me/.netlify/functions/stripe-webhook
   ```
   - Copy this URL

2. **Create webhook in Stripe**
   - In Stripe dashboard, go to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - Paste webhook URL
   - Click "Select events"

3. **Select events to listen for**

   Select these three events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

   Click "Add events"

4. **Save webhook**
   - Click "Add endpoint"
   - Webhook is now created

5. **Get webhook signing secret**
   - Click on the webhook you just created
   - Under "Signing secret", click "Reveal"
   - Copy the secret (starts with `whsec_`)

6. **Add to Netlify environment variables**
   - Go back to Netlify → Environment variables
   - Click "Add a variable"
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: Paste your `whsec_...` secret
   - Click "Create variable"

7. **Trigger another redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for completion

### ✅ Checkpoint:
In Stripe webhooks section, you should see your endpoint with status "Enabled".

---

## Step 8: Test Purchase Flow (10 minutes)

### Action Items:

1. **Visit your shop**
   - Go to: https://jolene.taurustech.me/shop.html
   - Click "Purchase" on any artwork
   - Modal should appear with variant options

2. **Select a variant**
   - Click any option (e.g., "Digital Download - $25")
   - You should be redirected to Stripe Checkout

3. **Use Stripe test card**

   Use these test details:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits (e.g., 123)
   - **Name**: Your name
   - **Email**: Your email
   - **Country**: United States
   - **ZIP**: Any 5 digits (e.g., 12345)

4. **Complete purchase**
   - Click "Pay"
   - Should redirect to success page

5. **Verify in Stripe**
   - Go to Stripe dashboard → Payments
   - You should see your test payment

### ✅ Checkpoint:
- Success page loads at https://jolene.taurustech.me/shop/success
- Payment appears in Stripe dashboard
- Webhook shows as "Succeeded" in Stripe → Webhooks → your endpoint

### Common Issues:

**Modal doesn't appear:**
- Check browser console (F12) for errors
- Verify content-loader.js loaded artwork data

**"Unable to process checkout" error:**
- Check Netlify Functions logs: Site → Functions → create-checkout-session
- Verify environment variables are set correctly

**Redirects but Stripe checkout fails:**
- Verify STRIPE_SECRET_KEY is correct
- Check you're using test key (pk_test_... and sk_test_...)

---

## Step 9: Test Commission Form (5 minutes)

### Action Items:

1. **Visit commissions page**
   - Go to: https://jolene.taurustech.me/commissions.html

2. **Fill out form**
   - Enter your details
   - Fill all required fields
   - Click "Submit Request"

3. **Check for confirmation**
   - You should see a success message
   - Check your email for notification

4. **Verify in Netlify**
   - Go to Netlify dashboard
   - Click "Forms" in left sidebar
   - You should see your submission under "commission" form

### ✅ Checkpoint:
- Form submits successfully
- You receive email notification
- Submission appears in Netlify Forms dashboard

---

## Step 10: Configure Email Notifications (5 minutes)

### Action Items:

1. **Set up form notifications**
   - In Netlify dashboard, go to "Site settings" → "Forms"
   - Click "Form notifications"
   - Click "Add notification"

2. **Add email notification**
   - Notification type: "Email notification"
   - Event to notify: "New form submission"
   - Email to notify: `jolenecasko@gmail.com`
   - Form: Select "commission"
   - Click "Save"

3. **Test again**
   - Submit another test commission
   - Check email inbox

### ✅ Checkpoint:
You receive an email every time someone submits the commission form.

---

## Step 11: Final Verification (10 minutes)

### Test everything works:

- [ ] Homepage loads: https://jolene.taurustech.me
- [ ] Portfolio page loads and filters work
- [ ] Shop page loads with all products
- [ ] Purchase flow works (test card)
- [ ] Success page displays after purchase
- [ ] Commission form submits successfully
- [ ] Email notifications received
- [ ] Site loads on mobile
- [ ] HTTPS is enabled (green padlock)
- [ ] All images load correctly

### ✅ Checkpoint:
Everything above works correctly.

---

## Step 12: Switch to Live Mode (When Ready)

**ONLY do this when you're ready to accept real payments.**

### Action Items:

1. **Complete Stripe account verification**
   - Stripe will ask for business verification
   - Provide tax information
   - Link bank account for payouts

2. **Switch to LIVE mode in Stripe**
   - Toggle from "TEST MODE" to "LIVE MODE" in Stripe dashboard

3. **Get LIVE API keys**
   - Go to Developers → API keys (in LIVE mode)
   - Copy Publishable key (starts with `pk_live_`)
   - Copy Secret key (starts with `sk_live_`)

4. **Create LIVE webhook**
   - Go to Developers → Webhooks (in LIVE mode)
   - Add endpoint: `https://jolene.taurustech.me/.netlify/functions/stripe-webhook`
   - Select same events as before
   - Copy signing secret (starts with `whsec_`)

5. **Update Netlify environment variables**
   - Replace `STRIPE_SECRET_KEY` with live key
   - Replace `STRIPE_PUBLISHABLE_KEY` with live key
   - Replace `STRIPE_WEBHOOK_SECRET` with live webhook secret

6. **Trigger final deploy**
   - Redeploy site in Netlify
   - Test with real credit card (use small amount)

### ✅ You're LIVE!
Your site now accepts real payments.

---

## Troubleshooting

### Deployment fails in Netlify
- Check build logs in Netlify → Deploys
- Ensure package.json exists
- Verify netlify.toml is committed

### Checkout button does nothing
- Open browser console (F12)
- Check for JavaScript errors
- Verify checkout.js loaded
- Check if artworkData is defined

### Stripe checkout fails
- Verify environment variables are correct
- Check Netlify Functions logs
- Ensure using test keys in test mode
- Check STRIPE_SECRET_KEY matches test/live mode

### Webhook not receiving events
- Verify webhook URL is correct
- Check webhook signing secret matches
- Test webhook from Stripe dashboard
- Check Netlify Functions logs

### Forms not submitting
- Ensure `data-netlify="true"` attribute exists
- Verify form has `name` attribute
- Check Netlify Forms dashboard
- Look for bot filtering (add honeypot if needed)

### Email notifications not working
- Check spam folder
- Verify email address in Netlify settings
- Check notification is enabled for correct form
- Test with different email address

---

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Stripe Docs**: https://stripe.com/docs
- **Netlify Support**: https://answers.netlify.com
- **Stripe Support**: https://support.stripe.com

---

## Next Steps After Deployment

1. **Add more artwork**: Edit content/artworks.json
2. **Monitor sales**: Check Stripe dashboard daily
3. **Respond to commissions**: Check email and Netlify Forms
4. **Share your site**: Post on social media
5. **Phase 4**: SEO optimization, newsletter, Instagram integration

---

**You've successfully deployed a fully functional e-commerce portfolio!** 🎉
