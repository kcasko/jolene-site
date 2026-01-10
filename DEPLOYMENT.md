# Deployment & Setup Guide

This guide walks through deploying your portfolio site to Netlify with full Stripe commerce integration.

## Prerequisites

Before deploying, you'll need accounts with:

1. **GitHub** - Your code repository (already set up)
2. **Netlify** - Free hosting platform (https://netlify.com)
3. **Stripe** - Payment processing (https://stripe.com)
4. **Mailchimp** (Optional) - Newsletter management (https://mailchimp.com)

## Part 1: Netlify Deployment

### Initial Setup

1. **Sign up for Netlify**
   - Go to https://netlify.com
   - Click "Sign up" and choose "Sign up with GitHub"
   - Authorize Netlify to access your GitHub repositories

2. **Import Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Search for and select `jolene-site` repository
   - Configure build settings:
     - **Base directory**: Leave empty
     - **Build command**: Leave empty (static site)
     - **Publish directory**: `.` (root directory)
   - Click "Deploy site"

3. **Set Up Custom Domain**
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain"
   - Enter `jolene.taurustech.me`
   - Follow DNS configuration instructions provided by Netlify
   - Enable HTTPS (automatic with Let's Encrypt)

### Install Dependencies

Your serverless functions require Node.js packages. Netlify will automatically install them during deployment if `package.json` exists (already created).

## Part 2: Stripe Configuration

### Create Stripe Account

1. **Sign up at https://stripe.com**
   - Use `jolenecasko@gmail.com` for account
   - Complete business verification
   - Enable "Customer Portal" in Stripe Dashboard

2. **Get API Keys**
   - Go to Stripe Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_`)
   - Copy your **Secret key** (starts with `sk_`)
   - **Important**: Start with TEST mode keys for development

3. **Set Up Webhook**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://jolene.taurustech.me/.netlify/functions/stripe-webhook`
   - Events to send:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)

### Configure Environment Variables in Netlify

1. In Netlify dashboard, go to **Site settings** → **Environment variables**

2. Add the following variables:

   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   CONTACT_EMAIL=jolenecasko@gmail.com
   URL=https://jolene.taurustech.me
   ```

3. Click "Save"

4. **Redeploy** the site for changes to take effect

### Testing Stripe Integration

1. **Test Purchase Flow**
   - Visit https://jolene.taurustech.me/shop.html
   - Click "Purchase" on any artwork
   - Select a variant
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date and CVC
   - Complete purchase

2. **Verify in Stripe Dashboard**
   - Check Stripe Dashboard → Payments
   - Confirm test payment appears

3. **When Ready for Production**
   - Switch to LIVE mode in Stripe Dashboard
   - Copy LIVE API keys (start with `pk_live_` and `sk_live_`)
   - Update environment variables in Netlify
   - Create new webhook endpoint for production
   - Redeploy

## Part 3: Netlify Forms Configuration

Forms are already configured with `data-netlify="true"` attribute.

### Enable Form Notifications

1. In Netlify dashboard → **Site settings** → **Forms**
2. Click "Form notifications"
3. Add email notification:
   - **Email to notify**: `jolenecasko@gmail.com`
   - **Event**: New form submission
   - **Form**: commission
4. Save settings

### Test Commission Form

1. Visit https://jolene.taurustech.me/commissions.html
2. Fill out and submit form
3. Check email for notification
4. Check Netlify dashboard → Forms for submission

## Part 4: Optional Integrations

### Mailchimp Newsletter (Phase 4)

1. Sign up at https://mailchimp.com
2. Create an Audience (mailing list)
3. Get API key: Account → Extras → API keys
4. Get List ID: Audience → Settings → Audience name and defaults
5. Add to Netlify environment variables:
   ```
   MAILCHIMP_API_KEY=xxxxx
   MAILCHIMP_LIST_ID=xxxxx
   ```

### Google Analytics (Phase 4)

Add to `<head>` of all HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Or use Plausible Analytics (privacy-friendly alternative):

```html
<script defer data-domain="jolene.taurustech.me" src="https://plausible.io/js/script.js"></script>
```

## Part 5: Content Management

### Adding New Artwork

After deployment, managing content is simple:

1. **Edit `content/artworks.json`** locally
2. Add new artwork entry (see CONTENT-GUIDE.md)
3. Save image to `assets/images/artworks/`
4. Commit and push to GitHub:
   ```bash
   git add content/artworks.json assets/images/artworks/new-image.jpg
   git commit -m "Add new artwork: Title"
   git push
   ```
5. Netlify automatically deploys changes (2-3 minutes)

### Updating Site Configuration

Edit `content/site-config.json` to change:
- Commission status (open/closed)
- Social media links
- Site metadata

Commit and push to deploy.

## Part 6: Monitoring & Maintenance

### Check Site Health

1. **Netlify Dashboard** - Deploy status, form submissions
2. **Stripe Dashboard** - Payments, customers, refunds
3. **Analytics** - Traffic, popular artworks, conversion rates

### Regular Tasks

- **Weekly**: Check form submissions, respond to commissions
- **Monthly**: Review sales, update featured artwork
- **Quarterly**: Add new artwork, update pricing

### Troubleshooting

#### Serverless Functions Not Working

1. Check Netlify Functions logs: Site → Functions
2. Verify environment variables are set
3. Redeploy after changing env vars

#### Stripe Checkout Failing

1. Check Stripe Dashboard → Logs for errors
2. Verify API keys are correct (test vs. live)
3. Ensure webhook endpoint is active
4. Check browser console for JavaScript errors

#### Forms Not Submitting

1. Verify `data-netlify="true"` attribute exists
2. Check Netlify → Forms for submissions
3. Ensure form has `name` attribute
4. Check spam folder for email notifications

#### Images Not Loading

1. Verify image paths start with `/assets/images/`
2. Check filename matches exactly (case-sensitive)
3. Clear browser cache
4. Check Netlify deploy log for missing files

## Part 7: Going Live Checklist

Before announcing your site:

- [ ] Test all pages load correctly
- [ ] Test purchase flow end-to-end (use test mode first)
- [ ] Submit and verify commission form works
- [ ] Verify email notifications are received
- [ ] Test on mobile devices (iPhone, Android)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Check all links work (footer, navigation, CTAs)
- [ ] Verify social media links are correct
- [ ] Enable SSL/HTTPS (automatic with Netlify)
- [ ] Set up 301 redirects if migrating from old site
- [ ] Submit sitemap to Google Search Console
- [ ] Test payment with real card in Stripe LIVE mode
- [ ] Update any hardcoded URLs to production domain
- [ ] Review legal pages (Privacy, Terms, Cookies)
- [ ] Set up backup/snapshot of repository

## Part 8: Performance Optimization

Your site is already optimized, but additional improvements:

### Image Optimization

Consider using a CDN like Cloudinary for images:
1. Sign up at https://cloudinary.com (free tier available)
2. Upload artwork images
3. Use Cloudinary URLs in `artworks.json`
4. Benefit: automatic resizing, lazy loading, WebP conversion

### Netlify Optimizations

Enable in Site settings → Build & deploy → Post processing:
- Asset optimization
- Pretty URLs (already enabled)
- Form detection (already enabled)

## Support & Resources

### Documentation

- **Netlify Docs**: https://docs.netlify.com
- **Stripe Docs**: https://stripe.com/docs
- **Netlify Forms**: https://docs.netlify.com/forms/setup/

### Getting Help

- **Netlify Support**: https://answers.netlify.com
- **Stripe Support**: https://support.stripe.com
- **Your Developer**: Contact for custom modifications

## Cost Breakdown

### Free Tier (Adequate for Most)

- **Netlify**: Free (100GB bandwidth, 300 build minutes/month)
- **Stripe**: Free (2.9% + $0.30 per transaction)
- **GitHub**: Free (for public/private repos)

### Paid Options (If Needed)

- **Netlify Pro**: $19/month (400GB bandwidth, analytics)
- **Cloudinary**: $0-99/month (image optimization)
- **Mailchimp**: Free up to 500 subscribers, then $13+/month
- **Plausible Analytics**: $9/month (privacy-friendly analytics)

---

**Next Steps**: See CONTENT-GUIDE.md for managing artwork and site content.
