# Testing Checklist

This comprehensive checklist ensures your portfolio site is ready for launch. Test each item thoroughly before going live.

## Pre-Launch Testing Phases

### Phase 1: Functionality Testing

#### Navigation & Links
- [ ] All navigation menu links work correctly
- [ ] Footer links navigate to correct pages
- [ ] Social media links open in new tabs
- [ ] Logo/home link returns to homepage
- [ ] Back button works as expected
- [ ] All internal links use correct paths (no 404s)
- [ ] External links open in new tabs with rel="noopener"

#### Content Loading
- [ ] Homepage gallery loads featured artworks
- [ ] Portfolio page displays all artworks
- [ ] Shop page shows products with prices
- [ ] Blog listing loads all posts
- [ ] Individual blog posts load correctly
- [ ] Testimonials carousel appears on homepage
- [ ] Press mentions display on About page
- [ ] All images load without broken links
- [ ] JSON data loads successfully (check Network tab)

#### Filter & Search
- [ ] Portfolio filters work (All, Album Art, Digital Collage, etc.)
- [ ] Filter counts update correctly
- [ ] Clicking "All" shows all artworks
- [ ] Category filters show correct artworks
- [ ] Blog category filtering works (if implemented)
- [ ] Tag filtering on blog posts works

#### Forms
- [ ] Contact form submits successfully
- [ ] Commission form submits to Netlify
- [ ] Newsletter signup works
- [ ] Form validation prevents empty submissions
- [ ] Required fields are enforced
- [ ] Email validation works (rejects invalid formats)
- [ ] Success messages appear after submission
- [ ] Form data appears in Netlify dashboard
- [ ] Email notifications arrive (check spam folder)
- [ ] Honeypot spam protection is hidden

### Phase 2: E-Commerce Testing

#### Stripe Integration
- [ ] "Buy Now" buttons appear on products
- [ ] Clicking "Buy Now" opens variant modal
- [ ] All variant options display correctly
- [ ] Disabled variants are grayed out
- [ ] Prices show correctly for each variant
- [ ] Stripe checkout session creates successfully
- [ ] Redirect to Stripe Checkout works
- [ ] Can complete test purchase with test card
- [ ] Success page displays after purchase
- [ ] Cancel returns to shop page
- [ ] Webhook receives payment confirmation (check Netlify logs)

#### Test Cards (Stripe Test Mode)
Test with these cards:
- [ ] **Success**: 4242 4242 4242 4242 (any CVC, future date)
- [ ] **Decline**: 4000 0000 0000 0002
- [ ] **3D Secure**: 4000 0025 0000 3155
- [ ] **Insufficient funds**: 4000 0000 0000 9995

#### Purchase Flow
- [ ] Digital download option available
- [ ] Print options (8x10, 16x20, 24x36) available where applicable
- [ ] Correct pricing for each variant
- [ ] Product descriptions clear
- [ ] Customer receives order confirmation email
- [ ] Fulfillment data captured in Stripe dashboard

### Phase 3: Cross-Browser Testing

Test on these browsers (latest versions):

#### Desktop Browsers
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac only)
- [ ] Edge (Windows)
- [ ] Opera

#### Mobile Browsers
- [ ] Chrome (Android)
- [ ] Safari (iOS)
- [ ] Firefox (Android)
- [ ] Samsung Internet (Android)

#### What to Check
- [ ] Layout renders correctly
- [ ] Images display properly
- [ ] Navigation menu works
- [ ] Mobile menu (hamburger) functions
- [ ] Forms submit successfully
- [ ] Checkout flow completes
- [ ] CSS animations work
- [ ] JavaScript features load
- [ ] No console errors

### Phase 4: Mobile Responsiveness

Test on these device sizes:

#### Phone Sizes
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S20 (360px)
- [ ] Google Pixel 7 (412px)

#### Tablet Sizes
- [ ] iPad Mini (768px)
- [ ] iPad Air (820px)
- [ ] iPad Pro (1024px)
- [ ] Samsung Galaxy Tab (800px)

#### Desktop Sizes
- [ ] 1366px (small laptop)
- [ ] 1920px (full HD)
- [ ] 2560px (2K)
- [ ] 3840px (4K)

#### Responsive Checks
- [ ] Navigation adapts to screen size
- [ ] Gallery/grid layouts reflow correctly
- [ ] Images scale without distortion
- [ ] Text remains readable (no tiny fonts)
- [ ] Buttons/links are tappable (min 44px)
- [ ] Forms are usable on mobile
- [ ] Modal windows fit on small screens
- [ ] Footer stacks appropriately
- [ ] No horizontal scrolling (unless intended)

### Phase 5: Performance Testing

#### Page Speed
Use Google PageSpeed Insights (https://pagespeed.web.dev/):
- [ ] Homepage scores 90+ on mobile
- [ ] Homepage scores 95+ on desktop
- [ ] Portfolio page scores 85+ on mobile
- [ ] Shop page scores 85+ on mobile
- [ ] Blog page scores 90+ on mobile

#### Core Web Vitals
Target scores:
- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **FID** (First Input Delay): < 100ms
- [ ] **CLS** (Cumulative Layout Shift): < 0.1

#### Image Optimization
- [ ] All images compressed (use TinyPNG or similar)
- [ ] Images use appropriate formats (WebP preferred)
- [ ] Images have correct dimensions (not oversized)
- [ ] Lazy loading implemented (loading="lazy")
- [ ] Critical images preloaded
- [ ] No images over 500KB
- [ ] Thumbnails separate from full-size images

#### Asset Optimization
- [ ] CSS files minified (use cssnano or similar)
- [ ] JavaScript files minified (use Terser)
- [ ] Remove unused CSS
- [ ] Combine similar CSS files
- [ ] No render-blocking resources
- [ ] Fonts loaded efficiently (font-display: swap)

#### Caching
- [ ] Static assets have cache headers
- [ ] Browser caching configured in netlify.toml
- [ ] CDN caching working (check response headers)

### Phase 6: SEO Verification

#### Meta Tags
Check on every page:
- [ ] Title tag present and unique (50-60 characters)
- [ ] Meta description present (150-160 characters)
- [ ] Keywords include target terms
- [ ] Canonical URL set correctly
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags present
- [ ] Favicon displays correctly

#### Structured Data
Use Google Rich Results Test (https://search.google.com/test/rich-results):
- [ ] Organization schema validates
- [ ] Person schema validates (About page)
- [ ] CreativeWork schemas validate (artworks)
- [ ] Article schemas validate (blog posts)
- [ ] BreadcrumbList schema validates
- [ ] No errors in structured data

#### Search Console
- [ ] Site verified in Google Search Console
- [ ] Sitemap submitted (sitemap.xml)
- [ ] No crawl errors
- [ ] Mobile usability: no issues
- [ ] Core Web Vitals: good scores
- [ ] Index coverage: all pages indexed

#### On-Page SEO
- [ ] H1 tag on every page (one per page)
- [ ] Heading hierarchy logical (H1 > H2 > H3)
- [ ] Image alt text descriptive
- [ ] Internal linking between pages
- [ ] URLs descriptive and clean
- [ ] No broken links (use Broken Link Checker)
- [ ] robots.txt allows crawling
- [ ] No duplicate content issues

### Phase 7: Accessibility Testing

#### Automated Testing
Use WAVE (https://wave.webaim.org/):
- [ ] No errors on any page
- [ ] Contrast ratios pass (4.5:1 for text)
- [ ] All images have alt text
- [ ] Form labels associated correctly
- [ ] Heading structure logical
- [ ] ARIA landmarks used appropriately

#### Keyboard Navigation
- [ ] Tab key navigates through all interactive elements
- [ ] Focus indicators visible
- [ ] Modal can be closed with Escape key
- [ ] Carousel can be controlled with arrow keys
- [ ] No keyboard traps
- [ ] Skip to content link works (if present)
- [ ] All functionality accessible without mouse

#### Screen Reader Testing
Test with NVDA (Windows) or VoiceOver (Mac):
- [ ] All content announced correctly
- [ ] Form fields labeled clearly
- [ ] Buttons/links have descriptive text
- [ ] Images have meaningful alt text
- [ ] Navigation landmarks announced
- [ ] Error messages read aloud
- [ ] Dynamic content updates announced

#### WCAG 2.1 AA Compliance
- [ ] Color contrast sufficient
- [ ] Text resizable to 200% without loss of content
- [ ] No content flashes more than 3 times per second
- [ ] Link text descriptive (no "click here")
- [ ] Forms have clear error identification
- [ ] Time limits can be extended (if any)

### Phase 8: Security Testing

#### HTTPS & SSL
- [ ] Site loads over HTTPS
- [ ] SSL certificate valid and trusted
- [ ] No mixed content warnings
- [ ] HSTS header present
- [ ] Redirects HTTP to HTTPS automatically

#### Security Headers
Check with Security Headers (https://securityheaders.com/):
- [ ] Content-Security-Policy configured
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy set
- [ ] Permissions-Policy configured
- [ ] Target grade: A or A+

#### Form Security
- [ ] Honeypot fields prevent spam
- [ ] Netlify spam filtering enabled
- [ ] No sensitive data in URLs
- [ ] CSRF protection via Netlify Forms
- [ ] Email validation prevents injection
- [ ] File upload restrictions (if applicable)

#### Stripe Security
- [ ] Using Stripe Checkout (PCI compliant)
- [ ] API keys environment variables (not hardcoded)
- [ ] Secret key never exposed to client
- [ ] Webhook signatures verified
- [ ] Test mode clearly indicated during development

### Phase 9: Content Quality

#### Copy & Grammar
- [ ] All text proofread
- [ ] No spelling errors
- [ ] Grammar correct
- [ ] Consistent tone and voice
- [ ] Professional language throughout
- [ ] No placeholder text (Lorem ipsum)
- [ ] Copyright year current
- [ ] Contact information accurate

#### Images & Media
- [ ] All artwork images high quality
- [ ] No pixelated or blurry images
- [ ] Consistent image style/treatment
- [ ] Social media icons display correctly
- [ ] Logo crisp on all devices
- [ ] Favicon shows in browser tabs
- [ ] Open Graph images correct dimensions (1200×630)

#### Data Accuracy
- [ ] Artwork descriptions accurate
- [ ] Prices correct for all products
- [ ] Commission rates match pricing
- [ ] Blog post dates accurate
- [ ] Testimonials properly attributed
- [ ] Press mentions verified
- [ ] Social media links point to correct profiles

### Phase 10: Analytics & Tracking

#### Analytics Setup
- [ ] Google Analytics 4 installed
- [ ] Tracking code on all pages
- [ ] Goals/conversions configured
- [ ] E-commerce tracking enabled
- [ ] Events tracking configured:
  - [ ] Newsletter signups
  - [ ] Form submissions
  - [ ] Purchase completions
  - [ ] Artwork views
  - [ ] Social link clicks
- [ ] Privacy policy mentions tracking
- [ ] Cookie consent implemented (if required by region)

#### Testing Analytics
- [ ] Real-time tracking shows visitors
- [ ] Page views recorded correctly
- [ ] Events fire when triggered
- [ ] E-commerce transactions tracked
- [ ] Conversion funnels work
- [ ] UTM parameters captured

### Phase 11: Email & Notifications

#### Email Deliverability
- [ ] Contact form emails arrive
- [ ] Commission form emails arrive
- [ ] Newsletter signup confirmation works
- [ ] Stripe order confirmations send
- [ ] Emails not marked as spam
- [ ] Reply-to addresses correct
- [ ] Email templates professional

#### Notification Settings
- [ ] Netlify form notifications configured
- [ ] Email addresses correct in settings
- [ ] Slack/webhook integrations work (if used)
- [ ] Email frequency appropriate

### Phase 12: Backup & Recovery

#### Data Backup
- [ ] artworks.json backed up
- [ ] blog-posts.json backed up
- [ ] testimonials.json backed up
- [ ] press.json backed up
- [ ] site-config.json backed up
- [ ] All JSON files in version control (Git)
- [ ] Image assets backed up locally
- [ ] Database export created (if applicable)

#### Version Control
- [ ] All code committed to Git
- [ ] .gitignore excludes node_modules
- [ ] .gitignore excludes .env files
- [ ] Repository pushed to GitHub/GitLab
- [ ] Commit messages descriptive
- [ ] No sensitive data in commits

#### Netlify Backup
- [ ] Site configuration documented
- [ ] Environment variables documented
- [ ] DNS settings documented
- [ ] Build settings noted
- [ ] Deploy contexts configured

### Phase 13: Legal & Compliance

#### Legal Pages
- [ ] Privacy Policy page created
- [ ] Terms of Service page created
- [ ] Refund/Return policy (for shop)
- [ ] Commission agreement terms clear
- [ ] Copyright notices present
- [ ] Attribution for third-party assets

#### GDPR Compliance (if serving EU)
- [ ] Cookie consent banner (if tracking)
- [ ] Privacy policy covers data collection
- [ ] User can opt out of analytics
- [ ] Email unsubscribe link works
- [ ] Data processing documented

#### Stripe Legal
- [ ] Terms of sale clear
- [ ] Refund policy stated
- [ ] Digital download terms explicit
- [ ] Physical product shipping terms
- [ ] Tax collection configured (if required)

### Phase 14: Launch Preparation

#### Domain & DNS
- [ ] Custom domain purchased
- [ ] DNS configured correctly
- [ ] Domain points to Netlify
- [ ] SSL certificate issued
- [ ] www redirects to non-www (or vice versa)
- [ ] Domain propagated globally (check via DNS Checker)

#### Final Configuration
- [ ] Environment variables set (production)
- [ ] Stripe in live mode (not test mode)
- [ ] Google Analytics in production mode
- [ ] Debug mode/console.logs removed
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] 404 page customized
- [ ] 500 error page customized

#### Pre-Launch Review
- [ ] All documentation reviewed
- [ ] README.md up to date
- [ ] CONTENT-GUIDE.md accessible
- [ ] BLOG-GUIDE.md ready for use
- [ ] DEPLOYMENT.md accurate
- [ ] Team/client trained on content updates

#### Launch Checklist
- [ ] Announce launch date
- [ ] Prepare social media posts
- [ ] Draft email to mailing list
- [ ] Press release written (if applicable)
- [ ] Portfolio/project page updated elsewhere
- [ ] LinkedIn/resume updated with site link
- [ ] Business cards updated with URL
- [ ] Google My Business updated (if applicable)

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor uptime (UptimeRobot, Pingdom)
- [ ] Check analytics for traffic
- [ ] Review error logs in Netlify
- [ ] Test forms again
- [ ] Verify checkout flow
- [ ] Monitor Stripe dashboard
- [ ] Check email deliverability
- [ ] Social media engagement

### First Week
- [ ] Google Search Console for indexing
- [ ] Analytics review (top pages, bounce rate)
- [ ] Conversion rate tracking
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Mobile usage patterns
- [ ] Geographic distribution

### First Month
- [ ] SEO ranking check
- [ ] Content performance analysis
- [ ] E-commerce metrics review
- [ ] Newsletter growth tracking
- [ ] Blog post engagement
- [ ] Adjust based on data

## Testing Tools

### Performance
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/
- **Lighthouse**: Built into Chrome DevTools

### SEO
- **Google Search Console**: https://search.google.com/search-console
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- **Screaming Frog**: https://www.screamingfrog.co.uk/seo-spider/

### Accessibility
- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: Browser extension
- **Lighthouse**: Accessibility audit in Chrome DevTools
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (Mac)

### Security
- **Security Headers**: https://securityheaders.com/
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Mozilla Observatory**: https://observatory.mozilla.org/

### Cross-Browser
- **BrowserStack**: https://www.browserstack.com/ (paid)
- **LambdaTest**: https://www.lambdatest.com/ (free tier)
- **Browser DevTools**: Built-in responsive mode

### Validation
- **W3C HTML Validator**: https://validator.w3.org/
- **W3C CSS Validator**: https://jigsaw.w3.org/css-validator/
- **JSON Validator**: https://jsonlint.com/

### Misc
- **Broken Link Checker**: https://www.deadlinkchecker.com/
- **DNS Checker**: https://dnschecker.org/
- **Pingdom**: https://tools.pingdom.com/
- **UptimeRobot**: https://uptimerobot.com/

## Test Data

### Test Stripe Cards
- **Visa Success**: 4242 4242 4242 4242
- **Visa Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155
- **Insufficient Funds**: 4000 0000 0000 9995
- **Expired**: 4000 0000 0000 0069
- **CVC**: Any 3 digits
- **Date**: Any future date
- **ZIP**: Any 5 digits

### Test Email Addresses
Use "plus addressing" to test without creating new accounts:
- youremail+test1@gmail.com
- youremail+test2@gmail.com
- youremail+newsletter@gmail.com

(All deliver to youremail@gmail.com)

## Success Criteria

Site is ready to launch when:
- ✅ All Phase 1-14 checkboxes completed
- ✅ No critical bugs or errors
- ✅ Performance scores meet targets
- ✅ SEO fundamentals in place
- ✅ Accessibility standards met
- ✅ Security headers configured
- ✅ Analytics tracking verified
- ✅ E-commerce tested thoroughly
- ✅ All content proofread and accurate
- ✅ Domain and SSL configured
- ✅ Client/stakeholder approval received

---

**Remember**: Testing is ongoing. Continue monitoring and improving after launch!
