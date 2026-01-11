# Site Maintenance Guide

Complete guide to maintaining, backing up, and keeping your portfolio site running smoothly.

## Table of Contents

1. [Regular Maintenance Tasks](#regular-maintenance-tasks)
2. [Backup Procedures](#backup-procedures)
3. [Content Updates](#content-updates)
4. [Security Updates](#security-updates)
5. [Performance Monitoring](#performance-monitoring)
6. [Troubleshooting](#troubleshooting)
7. [Emergency Procedures](#emergency-procedures)

---

## Regular Maintenance Tasks

### Daily Tasks

**Check for Issues** (2 minutes)
- [ ] Visit site to verify it's online
- [ ] Check realtime analytics for traffic
- [ ] Quickly scan Netlify dashboard for errors
- [ ] Check email for form submissions

**Respond to Users** (as needed)
- [ ] Reply to contact form messages
- [ ] Respond to commission inquiries
- [ ] Engage with social media comments
- [ ] Answer questions from potential clients

### Weekly Tasks (15-30 minutes)

**Analytics Review**
- [ ] Check weekly traffic in Google Analytics
- [ ] Review top pages
- [ ] Check conversion rates
- [ ] Identify traffic sources
- [ ] Note any anomalies

**Content Check**
- [ ] Verify all images loading correctly
- [ ] Check for broken links (use [Broken Link Checker](https://www.deadlinkchecker.com/))
- [ ] Ensure forms still submitting
- [ ] Test newsletter signup
- [ ] Verify Instagram feed updating

**SEO Monitoring**
- [ ] Check Google Search Console for errors
- [ ] Review indexing status
- [ ] Check for manual actions or penalties
- [ ] Monitor Core Web Vitals

**Social Media**
- [ ] Post new content (artwork, blog post, behind-the-scenes)
- [ ] Share on Instagram, Twitter, LinkedIn
- [ ] Engage with followers and other artists
- [ ] Cross-promote blog posts

### Monthly Tasks (1-2 hours)

**Full Analytics Review**
- [ ] Comprehensive traffic analysis
- [ ] Conversion funnel review
- [ ] E-commerce performance (sales, products, AOV)
- [ ] User behavior flow
- [ ] Geographic distribution
- [ ] Device breakdown (mobile vs. desktop)
- [ ] Top referral sources

**Content Updates**
- [ ] Publish 1-2 new blog posts
- [ ] Add new artwork to portfolio
- [ ] Update testimonials if you have new ones
- [ ] Add press mentions or awards
- [ ] Refresh homepage featured work
- [ ] Check copyright year (in January)

**Performance Audit**
- [ ] Run PageSpeed Insights on all major pages
- [ ] Check Core Web Vitals in Search Console
- [ ] Review load times
- [ ] Identify slow pages
- [ ] Optimize new images if needed

**Security Check**
- [ ] Run security headers test ([Security Headers](https://securityheaders.com/))
- [ ] Verify SSL certificate valid
- [ ] Check for any WordPress/plugin vulnerabilities (N/A for static site)
- [ ] Review Netlify security logs
- [ ] Update passwords if needed

**Backup**
- [ ] Download all JSON files locally
- [ ] Back up image folder
- [ ] Export analytics data
- [ ] Document any configuration changes
- [ ] Verify Git repository up to date

**Dependency Updates**
- [ ] Check for npm package updates: `npm outdated`
- [ ] Update packages: `npm update`
- [ ] Test site after updates
- [ ] Commit and deploy if everything works

### Quarterly Tasks (2-4 hours)

**Comprehensive Audit**
- [ ] Full site review (all pages, all features)
- [ ] Accessibility audit with WAVE
- [ ] Complete cross-browser testing
- [ ] Mobile device testing (actual devices)
- [ ] Form testing (submit all forms)
- [ ] Checkout flow testing (test mode)

**SEO Deep Dive**
- [ ] Keyword ranking check
- [ ] Competitor analysis
- [ ] Backlink profile review
- [ ] On-page SEO improvements
- [ ] Schema markup validation
- [ ] Update meta descriptions if needed

**Content Strategy**
- [ ] Review blog post performance
- [ ] Plan next quarter's content calendar
- [ ] Identify high-performing topics
- [ ] Brainstorm new blog ideas
- [ ] Update about page if needed
- [ ] Refresh portfolio descriptions

**Business Review**
- [ ] Revenue analysis (sales, commissions)
- [ ] Product performance (which artworks sell)
- [ ] Pricing review (adjust if needed)
- [ ] Commission rate evaluation
- [ ] Newsletter growth tracking
- [ ] Social media metrics

### Annual Tasks (Full day)

**Major Content Refresh**
- [ ] Update about page thoroughly
- [ ] Refresh all artwork descriptions
- [ ] Review and improve all copy
- [ ] Update pricing if needed
- [ ] Add year-in-review blog post
- [ ] Showcase best work from year

**Technical Review**
- [ ] Domain renewal (if applicable)
- [ ] SSL certificate check
- [ ] Review hosting plan (Netlify tier)
- [ ] Audit all third-party services
- [ ] Review analytics setup
- [ ] Check all integrations still working

**Design Refresh** (optional)
- [ ] Review site design relevance
- [ ] Update colors/fonts if needed
- [ ] Improve UX based on user feedback
- [ ] Optimize conversion paths
- [ ] A/B test new layouts

**Strategy Planning**
- [ ] Set goals for next year
- [ ] Review what worked (and what didn't)
- [ ] Plan marketing initiatives
- [ ] Identify growth opportunities
- [ ] Budget for improvements

---

## Backup Procedures

### What to Back Up

Your site is version-controlled with Git, but you should also maintain local backups.

**Critical Files:**
- `/content/artworks.json`
- `/content/blog-posts.json`
- `/content/testimonials.json`
- `/content/press.json`
- `/content/site-config.json`

**Important Assets:**
- `/assets/images/` (entire folder)
- All documentation (*.md files)

**Configuration:**
- `.env` file (if you have one locally)
- `netlify.toml`
- `package.json`

### Automated Git Backups

Your code is automatically backed up every time you commit and push:

```bash
# After making changes
git add .
git commit -m "Descriptive commit message"
git push origin main
```

**Best practices:**
- Commit after every significant change
- Write descriptive commit messages
- Push to remote (GitHub/GitLab) regularly
- Never commit sensitive data (.env files)

### Manual Local Backups

**Monthly backup routine:**

1. Create a backup folder:
```bash
mkdir -p ~/Backups/jolene-site/$(date +%Y-%m-%d)
```

2. Copy critical files:
```bash
# On Windows (PowerShell)
$date = Get-Date -Format "yyyy-MM-dd"
New-Item -Path "~\Backups\jolene-site\$date" -ItemType Directory
Copy-Item -Path "e:\Repos\jolene-site\content\*" -Destination "~\Backups\jolene-site\$date\content\" -Recurse
Copy-Item -Path "e:\Repos\jolene-site\assets\images\*" -Destination "~\Backups\jolene-site\$date\images\" -Recurse

# On Mac/Linux
DATE=$(date +%Y-%m-%d)
mkdir -p ~/Backups/jolene-site/$DATE
cp -R /path/to/jolene-site/content ~/Backups/jolene-site/$DATE/
cp -R /path/to/jolene-site/assets/images ~/Backups/jolene-site/$DATE/
```

3. Compress for archival (optional):
```bash
# Create zip archive
tar -czf ~/Backups/jolene-site-$DATE.tar.gz ~/Backups/jolene-site/$DATE

# Or on Windows
Compress-Archive -Path "~\Backups\jolene-site\$date" -DestinationPath "~\Backups\jolene-site-$date.zip"
```

### Cloud Backups

**Option 1: GitHub (already set up)**
- Your code is already backed up on GitHub
- Free for public repos, free private repos up to certain limits
- Automatic version history
- **Action needed:** Ensure you push regularly

**Option 2: External Services**

Use one of these for additional image backups:
- **Google Drive**: 15GB free
- **Dropbox**: 2GB free
- **OneDrive**: 5GB free
- **Backblaze B2**: $0.005/GB/month

**Setup example (Google Drive):**
1. Install [Google Drive Desktop](https://www.google.com/drive/download/)
2. Create folder: `Jolene Site Backups`
3. Add folder to sync
4. Copy assets to synced folder monthly

### Database Backups (JSON files)

Since your "database" is JSON files, backing up is simple:

**Automated script** (save as `backup-json.sh` or `backup-json.ps1`):

```bash
#!/bin/bash
# backup-json.sh - Run monthly

DATE=$(date +%Y-%m-%d)
BACKUP_DIR=~/Backups/jolene-site-json/$DATE

mkdir -p $BACKUP_DIR
cp content/*.json $BACKUP_DIR/

echo "JSON files backed up to $BACKUP_DIR"
```

Run with:
```bash
chmod +x backup-json.sh
./backup-json.sh
```

### Restore from Backup

**If you need to restore:**

1. **From Git history** (preferred):
```bash
# View commit history
git log

# Restore specific file from a commit
git checkout <commit-hash> -- content/artworks.json

# Or restore entire project to a previous state
git checkout <commit-hash>
```

2. **From local backup:**
```bash
# Copy backed up files back
cp ~/Backups/jolene-site/2025-01-10/content/*.json /path/to/jolene-site/content/
```

3. **Re-deploy** (if needed):
```bash
git add .
git commit -m "Restore from backup"
git push origin main
```

Netlify will automatically re-deploy.

---

## Content Updates

### Adding New Artwork

See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for full instructions.

**Quick steps:**
1. Optimize image (compress, resize, convert to WebP)
2. Upload to `/assets/images/artworks/`
3. Add entry to `content/artworks.json`
4. Commit and push:
```bash
git add content/artworks.json assets/images/artworks/
git commit -m "Add new artwork: [Title]"
git push
```

### Publishing Blog Posts

See [BLOG-GUIDE.md](BLOG-GUIDE.md) for full instructions.

**Quick steps:**
1. Write post content
2. Create featured image (1200×630px)
3. Add entry to `content/blog-posts.json`
4. Commit and push:
```bash
git add content/blog-posts.json assets/images/blog/
git commit -m "Add blog post: [Title]"
git push
```

### Updating Testimonials

**Edit** `content/testimonials.json`:
```json
{
  "id": "testimonial-4",
  "client": "Client Name",
  "role": "Title",
  "project": "Project Name",
  "quote": "Full testimonial text here...",
  "rating": 5,
  "date": "2025-01-15",
  "featured": false,
  "image": null,
  "projectImage": "/assets/images/artworks/project.jpg"
}
```

Commit and deploy:
```bash
git add content/testimonials.json
git commit -m "Add testimonial from [Client]"
git push
```

### Updating Press Mentions

**Edit** `content/press.json`:
```json
{
  "id": "press-4",
  "publication": "Magazine Name",
  "title": "Article Title",
  "url": "https://...",
  "date": "2025-01-15",
  "excerpt": "Brief description...",
  "type": "feature",
  "featured": true
}
```

### Updating Site Configuration

**Edit** `content/site-config.json`:

```json
{
  "commission": {
    "status": "open",  // Change to "closed" when not accepting commissions
    "depositRequired": true,
    "depositPercentage": 50
  }
}
```

Common changes:
- Open/close commissions
- Update email address
- Change social media links
- Modify deposit requirements

---

## Security Updates

### Dependency Updates

Check for outdated packages monthly:

```bash
# View outdated packages
npm outdated

# Update all packages to latest compatible versions
npm update

# Update specific package
npm update stripe

# Update to latest (may break compatibility)
npm install stripe@latest
```

**After updating:**
1. Test locally
2. Verify checkout flow works
3. Test forms submit
4. Check for errors in console
5. If all good, commit and deploy

### Security Monitoring

**Check these regularly:**

1. **Netlify Security:**
   - Monitor deploy logs for warnings
   - Review function logs for anomalies
   - Check form spam submissions

2. **Stripe Security:**
   - Review recent payments for fraud
   - Monitor webhook failures
   - Check for unusual activity
   - Enable Stripe Radar (fraud detection)

3. **Domain Security:**
   - Verify WHOIS privacy enabled
   - Use strong registrar password
   - Enable 2FA on domain account

4. **GitHub Security:**
   - Enable 2FA on GitHub account
   - Review collaborators (if any)
   - Monitor repo access
   - Use SSH keys, not passwords

### Password Management

**Use strong, unique passwords for:**
- Domain registrar
- Netlify account
- GitHub account
- Stripe account
- Email account
- Analytics accounts

**Use a password manager:**
- 1Password
- Bitwarden (free)
- LastPass
- Dashlane

### SSL Certificate

Netlify handles SSL automatically, but verify quarterly:

1. Visit https://www.ssllabs.com/ssltest/
2. Enter your domain
3. Ensure A or A+ rating
4. Check certificate expiration date
5. Netlify auto-renews, but verify it happened

---

## Performance Monitoring

### Page Speed Tracking

**Monthly checks:**

1. Run PageSpeed Insights: https://pagespeed.web.dev/
2. Test these pages:
   - Homepage
   - Portfolio
   - Shop
   - About
   - Blog listing
3. Record scores in spreadsheet
4. Track trends over time

**Target scores:**
- Mobile: 90+
- Desktop: 95+
- Core Web Vitals: All green

### Core Web Vitals Monitoring

Check in Google Search Console monthly:

1. Go to **Experience** > **Core Web Vitals**
2. Review mobile and desktop reports
3. Identify "Poor" or "Needs Improvement" URLs
4. Optimize problem pages (see PERFORMANCE-OPTIMIZATION.md)

### Uptime Monitoring

**Set up UptimeRobot** (free, 5-minute checks):

1. Create account: https://uptimerobot.com/
2. Add monitor:
   - Type: HTTPS
   - URL: https://jolenecasko.netlify.app
   - Interval: 5 minutes
3. Add alert contacts (email, SMS)
4. Monitor status page

**Target uptime:** 99.9%+

### Analytics Monitoring

**Weekly quick check:**
- Realtime users (is anyone on site now?)
- Last 7 days traffic trend
- Conversion rate

**Monthly deep dive:**
- Traffic sources (where visitors come from)
- Top content (what's popular)
- User behavior flow
- Conversion funnel
- E-commerce performance

**Set up email reports:**
1. In Google Analytics, go to **Reports**
2. Click **Share** icon (top right)
3. Select **Schedule email**
4. Choose weekly or monthly
5. Add your email address

---

## Troubleshooting

### Site Down or Not Loading

**Diagnosis:**
1. Check Netlify status: https://www.netlifystatus.com/
2. Check deploy logs in Netlify dashboard
3. Verify DNS settings (use https://dnschecker.org/)
4. Check SSL certificate (browser address bar)

**Solutions:**
- If Netlify is down: Wait, they'll resolve
- If deploy failed: Check error logs, fix code, re-deploy
- If DNS issue: Verify settings with domain registrar
- If SSL expired: Contact Netlify support (auto-renew should work)

### Forms Not Submitting

**Diagnosis:**
1. Check Netlify Forms dashboard for submissions
2. Review Netlify function logs
3. Check spam folder for notifications
4. Test form yourself

**Solutions:**
- Verify `data-netlify="true"` attribute in form
- Check `name` attribute matches Netlify config
- Ensure honeypot field present
- Verify email notification settings

### Checkout Not Working

**Diagnosis:**
1. Check Stripe dashboard for errors
2. Review Netlify function logs (`create-checkout-session`)
3. Test with Stripe test cards
4. Verify webhook receiving events

**Solutions:**
- Check environment variables (API keys)
- Verify Stripe in correct mode (test vs. live)
- Ensure webhook URL correct
- Check CORS settings (shouldn't be issue with Netlify)

### Images Not Loading

**Diagnosis:**
1. Check browser console for 404 errors
2. Verify image paths in JSON files
3. Check if files exist in `/assets/images/`
4. Test on different devices/browsers

**Solutions:**
- Fix file paths (case-sensitive!)
- Re-upload missing images
- Clear browser cache
- Check image file permissions

### Analytics Not Tracking

**Diagnosis:**
1. Check Google Analytics Realtime report
2. View page source, verify tracking code present
3. Check browser console for errors
4. Verify Measurement ID correct

**Solutions:**
- Re-add tracking code to all pages
- Check ad blockers aren't blocking
- Verify Measurement ID matches GA property
- Clear cache and test in incognito

### Slow Page Load

**Diagnosis:**
1. Run PageSpeed Insights
2. Check Core Web Vitals
3. Review Network tab in DevTools
4. Identify largest files

**Solutions:**
- Optimize images (compress, WebP format)
- Minify CSS and JavaScript
- Enable caching (netlify.toml headers)
- Lazy load images
- See PERFORMANCE-OPTIMIZATION.md

---

## Emergency Procedures

### Critical Site Issue

**If site is completely broken:**

1. **Don't panic** - you have backups and Git history

2. **Assess severity:**
   - Is site completely down?
   - Is it just one feature broken?
   - Does it affect all users or just some?

3. **Quick fix or rollback:**

**Option A: Quick fix**
```bash
# Fix the issue in code
# Test locally
# Commit and deploy
git add .
git commit -m "Hotfix: [describe issue]"
git push
```

**Option B: Rollback to previous deploy**
1. Go to Netlify dashboard
2. Click **Deploys**
3. Find last working deploy
4. Click "Publish deploy" on that version
5. Site instantly rolls back

4. **Fix properly:**
   - Identify root cause
   - Fix in development
   - Test thoroughly
   - Re-deploy when ready

### Data Loss

**If you accidentally delete content:**

1. **Check Git history:**
```bash
git log -- content/artworks.json
git checkout <commit-hash> -- content/artworks.json
```

2. **Restore from backup:**
```bash
cp ~/Backups/jolene-site/[date]/content/*.json content/
```

3. **Re-deploy:**
```bash
git add content/
git commit -m "Restore content from backup"
git push
```

### Security Breach

**If you suspect account compromise:**

1. **Immediately change passwords:**
   - Netlify
   - GitHub
   - Domain registrar
   - Stripe
   - Email

2. **Enable 2FA** on all accounts

3. **Review:**
   - Netlify deploy history (unauthorized deploys?)
   - GitHub commit history (unknown changes?)
   - Stripe transactions (fraudulent charges?)
   - Domain DNS settings (unauthorized changes?)

4. **Revoke access:**
   - Regenerate API keys (Stripe)
   - Remove collaborators (GitHub)
   - Clear sessions (Netlify)

5. **Contact support** if needed:
   - Netlify: support@netlify.com
   - Stripe: https://support.stripe.com/
   - GitHub: https://support.github.com/

### Stripe Payment Issue

**If payments failing or webhooks not working:**

1. **Check Stripe status:** https://status.stripe.com/

2. **Review Stripe logs:**
   - Go to Stripe Dashboard > Developers > Logs
   - Look for errors

3. **Verify webhook:**
   - Check webhook endpoint URL
   - Verify signing secret matches environment variable
   - Test webhook manually

4. **Common fixes:**
   - Update webhook URL to production domain
   - Regenerate webhook secret
   - Check API key validity
   - Ensure you're in correct mode (test vs. live)

---

## Maintenance Schedule Template

Copy this to your calendar or task manager:

### Daily
- [ ] Check site is online
- [ ] Respond to form submissions

### Weekly (Monday mornings)
- [ ] Review analytics
- [ ] Check for errors (Netlify, Search Console)
- [ ] Post social media content
- [ ] Test forms

### Monthly (First of month)
- [ ] Full analytics review
- [ ] Publish blog post
- [ ] Update content (artwork, testimonials)
- [ ] Performance audit
- [ ] Security check
- [ ] Backup JSON files and images
- [ ] Update dependencies

### Quarterly (Jan, Apr, Jul, Oct)
- [ ] Comprehensive audit (all pages, all features)
- [ ] SEO deep dive
- [ ] Content strategy review
- [ ] Business metrics review

### Annual (January)
- [ ] Year-in-review blog post
- [ ] Major content refresh
- [ ] Technical review (domain, SSL, hosting)
- [ ] Strategy planning for new year
- [ ] Update copyright year

---

## Contact Information

**For technical issues:**
- Netlify Support: support@netlify.com
- Stripe Support: https://support.stripe.com/
- GitHub Support: https://support.github.com/

**For domain/DNS:**
- Your domain registrar support

**Documentation:**
- Netlify Docs: https://docs.netlify.com/
- Stripe Docs: https://stripe.com/docs
- Google Analytics Help: https://support.google.com/analytics/

---

## Maintenance Log Template

Keep a simple log of maintenance activities:

```
# Maintenance Log

## 2025-01-15
- Added new artwork: "Cosmic Dreams"
- Published blog post: "My Process"
- Updated testimonials (added Sarah M.)
- Ran PageSpeed Insights: 94 mobile, 98 desktop
- Backed up JSON files

## 2025-01-08
- Fixed broken link on about page
- Responded to 3 commission inquiries
- Updated Instagram feed component
- Checked Core Web Vitals: All green

## 2025-01-01
- Updated copyright year to 2025
- Reviewed annual analytics (10k visitors, 50 sales!)
- Planned Q1 content calendar
- Renewed domain (jolene-casko.com, expires 2026-01-01)
```

---

**Remember:** Regular maintenance prevents major issues. Set reminders, follow the schedule, and your site will run smoothly for years!