# Site Monitoring Setup Guide

Complete guide to monitoring your portfolio site's uptime, performance, errors, and user behavior.

## Why Monitor?

Monitoring helps you:
- **Catch downtime** before users complain
- **Identify errors** in realtime
- **Track performance** degradation
- **Understand** user behavior
- **Prevent** revenue loss from outages
- **Improve** continuously based on data

---

## 1. Uptime Monitoring

### UptimeRobot (Recommended - Free)

**What it does:** Checks if your site is online every 5 minutes, alerts you if down.

#### Setup Steps

1. **Create account:** https://uptimerobot.com/signUp

2. **Add monitor:**
   - Click **+ Add New Monitor**
   - Monitor Type: **HTTPS**
   - Friendly Name: "Jolene Casko Portfolio"
   - URL: `https://jolenecasko.netlify.app`
   - Monitoring Interval: **5 minutes** (free tier)
   - Monitor Timeout: 30 seconds
   - Click **Create Monitor**

3. **Add more monitors** (optional but recommended):
   - Shop page: `https://jolenecasko.netlify.app/shop.html`
   - Blog: `https://jolenecasko.netlify.app/blog.html`
   - Portfolio: `https://jolenecasko.netlify.app/portfolio.html`

4. **Set up alerts:**
   - Click **My Settings**
   - Add email address under **Alert Contacts**
   - Verify email
   - Optional: Add phone number for SMS alerts (may require paid plan)
   - Optional: Add Slack webhook for team notifications

5. **Create status page** (optional):
   - Click **Public Status Pages**
   - Create new status page
   - Share URL with clients/team
   - Example: `https://stats.uptimerobot.com/abc123`

#### Alert Settings

Configure when you want to be notified:

- **When to alert:** Down, Up again (recovery)
- **Don't alert:** During scheduled maintenance
- **Frequency:** Every 5 minutes while down
- **Contacts:** Your email, SMS (if configured)

### Alternative: Pingdom

**Free tier:** 1 check every 5 minutes

1. Create account: https://www.pingdom.com/
2. Add uptime check (same process as UptimeRobot)
3. Advantages: More detailed reporting, RUM (Real User Monitoring)
4. Disadvantages: Only 1 free monitor (vs. 50 with UptimeRobot)

### Netlify Built-in Monitoring

Netlify shows deploy status and basic uptime:

1. Go to Netlify dashboard
2. Navigate to your site
3. Check **Deploys** tab for build status
4. Check **Analytics** (paid feature, $9/month) for traffic and uptime

---

## 2. Error Tracking

### Sentry (Recommended)

**What it does:** Captures JavaScript errors, tracks performance issues, provides stack traces.

#### Setup Steps

1. **Create account:** https://sentry.io/signup/ (free tier: 5,000 errors/month)

2. **Create project:**
   - Platform: **JavaScript**
   - Project name: "jolene-casko-portfolio"
   - Alert frequency: Real-time

3. **Install SDK:**

   Add to bottom of `<body>` on all pages:

   ```html
   <!-- Sentry Error Tracking -->
   <script
     src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"
     integrity="..."
     crossorigin="anonymous"
   ></script>
   <script>
     Sentry.init({
       dsn: 'https://YOUR_DSN_HERE@sentry.io/YOUR_PROJECT_ID',
       environment: 'production',
       integrations: [
         new Sentry.BrowserTracing(),
         new Sentry.Replay()
       ],
       // Performance monitoring
       tracesSampleRate: 1.0, // 100% of transactions
       // Session replay
       replaysSessionSampleRate: 0.1, // 10% of sessions
       replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
     });
   </script>
   ```

4. **Test error tracking:**

   Add test button temporarily:
   ```html
   <button onclick="Sentry.captureException(new Error('Test error'))">
     Test Sentry
   </button>
   ```

   Click it, check Sentry dashboard for error.

5. **Configure alerts:**
   - Go to **Alerts** > **Create Alert Rule**
   - Condition: Any new issue
   - Action: Send email notification
   - Frequency: Immediately

#### What Sentry Catches

- JavaScript errors (undefined variables, etc.)
- Failed API calls (Stripe, Netlify functions)
- Performance bottlenecks
- Unhandled promise rejections
- Browser compatibility issues

### Alternative: LogRocket

**What it does:** Session replay + error tracking (see exactly what user saw)

- Free tier: 1,000 sessions/month
- Setup: https://logrocket.com/
- Similar to Sentry but with video replay of user sessions
- More expensive ($99/month for production use)

---

## 3. Performance Monitoring

### Google Search Console (Free)

**What it monitors:** Core Web Vitals, mobile usability, indexing

#### Setup Steps

1. **Add property:**
   - Go to https://search.google.com/search-console
   - Click **Add Property**
   - Enter URL: `jolenecasko.netlify.app`

2. **Verify ownership:**

   **Option A: HTML file** (easier)
   - Download verification file (e.g., `google1234567890abcdef.html`)
   - Upload to site root
   - Commit and push:
     ```bash
     git add google1234567890abcdef.html
     git commit -m "Add Search Console verification"
     git push
     ```
   - Click **Verify** in Search Console

   **Option B: Meta tag**
   - Copy meta tag provided
   - Add to `<head>` of index.html:
     ```html
     <meta name="google-site-verification" content="YOUR_CODE_HERE" />
     ```
   - Commit, push, verify

3. **Submit sitemap:**
   - Click **Sitemaps** in left menu
   - Add new sitemap: `https://jolenecasko.netlify.app/sitemap.xml`
   - Click **Submit**

4. **Enable email reports:**
   - Click settings (gear icon)
   - **Email notifications**: Enable all
   - You'll get weekly reports on issues

#### What to Monitor

Check weekly:
- **Coverage:** Are all pages indexed?
- **Core Web Vitals:** Are scores good?
- **Mobile Usability:** Any issues?
- **Manual Actions:** Any penalties? (should be none)

### PageSpeed Insights API

Automate performance checks:

```bash
# Create a script to check performance weekly
# Save as check-performance.sh

#!/bin/bash

URL="https://jolenecasko.netlify.app"
API_KEY="YOUR_PAGESPEED_API_KEY"  # Get from Google Cloud Console

# Check mobile performance
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$URL&strategy=mobile&key=$API_KEY" \
  | jq '.lighthouseResult.categories.performance.score'

# Check desktop performance
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$URL&strategy=desktop&key=$API_KEY" \
  | jq '.lighthouseResult.categories.performance.score'
```

Run weekly with cron:
```bash
# Run every Monday at 9am
0 9 * * 1 /path/to/check-performance.sh
```

### Lighthouse CI

Run Lighthouse automatically on every deploy:

1. Install: `npm install -g @lhci/cli`

2. Create `lighthouserc.json`:
   ```json
   {
     "ci": {
       "collect": {
         "url": ["https://jolenecasko.netlify.app/"],
         "numberOfRuns": 3
       },
       "assert": {
         "assertions": {
           "categories:performance": ["error", {"minScore": 0.9}],
           "categories:accessibility": ["error", {"minScore": 0.9}],
           "categories:seo": ["error", {"minScore": 0.9}]
         }
       }
     }
   }
   ```

3. Add to CI/CD (GitHub Actions or Netlify build):
   ```bash
   npm run build
   lhci autorun
   ```

---

## 4. Analytics Monitoring

### Google Analytics 4 (Free)

See [ANALYTICS-GUIDE.md](ANALYTICS-GUIDE.md) for full setup.

#### Key Alerts to Set Up

1. **Traffic drop alert:**
   - Go to **Admin** > **Custom Alerts** (if available)
   - Or use third-party: https://www.ga4alerts.com/
   - Alert when: Sessions drop > 50% week-over-week

2. **Conversion tracking:**
   - Ensure you're tracking purchases, contact forms, commissions
   - Set up conversion goals
   - Monitor in **Reports** > **Conversions**

3. **Error pages:**
   - Create custom report for 404 visits
   - Filter: Page path contains "404"
   - Get weekly digest

#### Weekly Check

Review these metrics every Monday:

- **Sessions:** Total traffic (is it growing?)
- **Conversion rate:** Purchases / sessions
- **Top pages:** What's popular?
- **Traffic sources:** Where do visitors come from?
- **Bounce rate:** Are people engaging?

### Alternative: Plausible Analytics

Privacy-focused, simpler than GA4:

- $9/month (up to 10k pageviews)
- No cookies, GDPR compliant
- Clean, easy-to-read dashboard
- Email weekly reports
- Setup: https://plausible.io/

---

## 5. Security Monitoring

### Netlify Security

Monitor for suspicious activity:

1. **Check build logs regularly:**
   - Go to Netlify dashboard > Deploys
   - Review recent builds for errors
   - Ensure no unauthorized deploys

2. **Form spam monitoring:**
   - Check Netlify Forms dashboard
   - Look for spam submissions
   - Adjust honeypot if needed

3. **Function logs:**
   - Go to Netlify > Functions
   - Check logs for errors
   - Monitor Stripe function calls

### GitHub Security

Enable security features:

1. **Dependabot:**
   - Auto-enabled on GitHub
   - Alerts you to vulnerable dependencies
   - Can auto-create PRs to update

2. **Security alerts:**
   - Go to repo > Settings > Security & analysis
   - Enable:
     - ✅ Dependency graph
     - ✅ Dependabot alerts
     - ✅ Dependabot security updates

3. **Code scanning** (optional):
   - Enable CodeQL analysis
   - Scans for security vulnerabilities

### Stripe Monitoring

Check Stripe dashboard weekly:

- **Recent payments:** Any unusual activity?
- **Failed payments:** Why are they failing?
- **Webhooks:** Are they succeeding?
- **Radar** (Stripe's fraud detection): Any blocks?

Enable Stripe alerts:
- Go to Stripe > Settings > Notifications
- Enable email for:
  - Failed payments
  - Chargebacks
  - Radar blocks
  - Webhook failures

---

## 6. Comprehensive Monitoring Dashboard

### Option 1: Cronitor

All-in-one monitoring platform:

1. **Create account:** https://cronitor.io/
2. **Features:**
   - Uptime monitoring
   - Cron job monitoring (if you add scheduled tasks)
   - SSL certificate expiration
   - Status page
3. **Free tier:** 5 monitors

### Option 2: Better Uptime

Modern alternative to UptimeRobot:

- https://betteruptime.com/
- Free: 10 monitors
- Features:
  - Call routing (phone alerts)
  - Status page
  - Incident management
  - Integrations (Slack, PagerDuty)

### Option 3: Checkly

Monitor with real browsers:

- https://www.checklyhq.com/
- Free tier available
- Tests: Click buttons, fill forms, check checkout flow
- Advanced: Run Playwright scripts to test user flows

---

## 7. Custom Monitoring Scripts

### Site Health Check Script

Create `scripts/health-check.js`:

```javascript
/**
 * Comprehensive site health check
 * Run daily with cron or GitHub Actions
 */

const https = require('https');

const checks = [
  { name: 'Homepage', url: 'https://jolenecasko.netlify.app/' },
  { name: 'Portfolio', url: 'https://jolenecasko.netlify.app/portfolio.html' },
  { name: 'Shop', url: 'https://jolenecasko.netlify.app/shop.html' },
  { name: 'Blog', url: 'https://jolenecasko.netlify.app/blog.html' },
  { name: 'Sitemap', url: 'https://jolenecasko.netlify.app/sitemap.xml' },
  { name: 'Artworks JSON', url: 'https://jolenecasko.netlify.app/content/artworks.json' }
];

async function checkUrl(check) {
  return new Promise((resolve) => {
    const start = Date.now();

    https.get(check.url, (res) => {
      const duration = Date.now() - start;

      resolve({
        name: check.name,
        status: res.statusCode,
        ok: res.statusCode === 200,
        duration: `${duration}ms`
      });
    }).on('error', (err) => {
      resolve({
        name: check.name,
        status: 'ERROR',
        ok: false,
        error: err.message
      });
    });
  });
}

async function runHealthCheck() {
  console.log('Running site health check...\n');

  const results = await Promise.all(checks.map(checkUrl));

  results.forEach(result => {
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status} (${result.duration || result.error})`);
  });

  const allOk = results.every(r => r.ok);

  console.log('\n' + (allOk ? '✅ All checks passed!' : '❌ Some checks failed!'));

  process.exit(allOk ? 0 : 1);
}

runHealthCheck();
```

**Run manually:**
```bash
node scripts/health-check.js
```

**Automate with GitHub Actions** (.github/workflows/health-check.yml):
```yaml
name: Daily Health Check

on:
  schedule:
    - cron: '0 9 * * *'  # 9am daily
  workflow_dispatch:  # Manual trigger

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node scripts/health-check.js
```

---

## 8. Monitoring Checklist

### Initial Setup (One-Time)
- [ ] UptimeRobot account created
- [ ] Uptime monitors added (homepage, shop, blog)
- [ ] Email/SMS alerts configured
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Search Console
- [ ] Google Analytics installed
- [ ] Sentry error tracking installed (optional)
- [ ] Stripe notifications enabled
- [ ] GitHub Dependabot enabled

### Daily Checks (Automated)
- [ ] UptimeRobot checks site every 5 min
- [ ] Sentry captures errors realtime
- [ ] Stripe monitors payments
- [ ] Google Analytics tracks visitors

### Weekly Review (15 minutes)
- [ ] Check UptimeRobot uptime % (target: 99.9%+)
- [ ] Review Google Analytics (traffic, conversions)
- [ ] Check Search Console (indexing, Core Web Vitals)
- [ ] Review Sentry errors (if any)
- [ ] Check Netlify function logs
- [ ] Verify forms still submitting
- [ ] Check Stripe dashboard (payments, webhooks)

### Monthly Audit (30 minutes)
- [ ] Full analytics review
- [ ] Performance check (PageSpeed Insights)
- [ ] Security check (dependencies, SSL)
- [ ] Backup verification (Git up to date)
- [ ] Review and dismiss old alerts
- [ ] Update monitoring if site changes

---

## 9. Incident Response Plan

### If Site Goes Down

**Step 1: Verify**
- Is it really down? Check from https://downforeveryoneorjustme.com/
- Check Netlify status: https://www.netlifystatus.com/

**Step 2: Diagnose**
- Check Netlify deploy logs
- Check DNS (use https://dnschecker.org/)
- Check SSL certificate

**Step 3: Fix**
- If build failed: Fix code, re-deploy
- If Netlify is down: Wait (rare, but happens)
- If DNS issue: Check domain registrar settings
- If SSL expired: Contact Netlify support

**Step 4: Communicate**
- If extended outage, update social media
- Email any pending customers
- Post to status page (if you created one)

**Step 5: Prevent Recurrence**
- Document what happened
- Implement fix to prevent future occurrence
- Update monitoring if needed

### If Payments Failing

**Step 1: Check Stripe**
- Go to Stripe dashboard > Developers > Logs
- Look for errors

**Step 2: Check Webhooks**
- Verify webhook endpoint URL correct
- Check webhook secret matches env variable
- Test webhook manually in Stripe dashboard

**Step 3: Check Netlify Function**
- Review function logs
- Ensure environment variables set
- Test locally if possible

**Step 4: Rollback if Needed**
- If recent deploy broke it, rollback in Netlify
- Fix issue, re-deploy

---

## 10. Monitoring Tools Summary

| Tool | Purpose | Cost | Priority |
|------|---------|------|----------|
| **UptimeRobot** | Uptime monitoring | Free | 🔴 Essential |
| **Google Analytics** | Traffic & behavior | Free | 🔴 Essential |
| **Google Search Console** | SEO & indexing | Free | 🔴 Essential |
| **Netlify Dashboard** | Deploys & functions | Free | 🔴 Essential |
| **Stripe Dashboard** | Payment monitoring | Free | 🔴 Essential |
| **Sentry** | Error tracking | Free tier | 🟡 Recommended |
| **PageSpeed Insights** | Performance | Free | 🟡 Recommended |
| **GitHub Dependabot** | Security alerts | Free | 🟡 Recommended |
| **Lighthouse CI** | Automated audits | Free | 🟢 Optional |
| **Better Uptime** | Advanced uptime | Free tier | 🟢 Optional |
| **LogRocket** | Session replay | Paid | 🟢 Optional |

---

## 11. Monitoring Automation

### Set Up Email Digests

**UptimeRobot:**
- Settings > Alert Contacts > Monthly Reports: Enabled

**Google Analytics:**
- Admin > Property > Email Reports
- Schedule weekly/monthly summaries

**Google Search Console:**
- Settings > Email Notifications: All enabled

### Create a Dashboard

Combine all metrics in one place:

**Option 1: Google Data Studio** (free)
- Connect GA4, Search Console
- Create custom dashboard
- Share with team

**Option 2: Geckoboard** (paid)
- Combines multiple sources
- TV-friendly displays

**Option 3: Custom Dashboard**
- Build with HTML + APIs
- Host on separate page

---

## 12. Success Metrics

**Your site is healthy when:**
- ✅ Uptime: 99.9%+
- ✅ Page load time: < 3 seconds
- ✅ Core Web Vitals: All "Good"
- ✅ Error rate: < 0.1%
- ✅ Conversion rate: Stable or increasing
- ✅ Zero critical security issues
- ✅ All pages indexed in Google
- ✅ Payments processing successfully

---

**Remember:** Monitoring is insurance—you hope you don't need it, but you'll be glad you have it when something goes wrong!
