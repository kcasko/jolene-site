# Jolene Casko Site - Complete Architecture Plan

## Project Overview
Transform jolene.taurustech.me from a single-page portfolio into a fully automated commerce-enabled portfolio site while maintaining static HTML/CSS/JS architecture with serverless automation.

## Technology Stack

### Core Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Content Management**: Local JSON files (version-controlled)
- **Hosting**: Netlify (with serverless functions)
- **Commerce**: Stripe Checkout + Payment Links
- **Email**: Mailchimp (newsletter) + Stripe email confirmations
- **Analytics**: Plausible (privacy-respecting, lightweight)

### Design System
- Maintain existing cosmic/celestial aesthetic
- Color palette: Deep purples (#0f1419, #1a1529, #2d1b3d), cream yellows (#fffacd), aged tones
- Typography: Georgia serif for body, custom headers
- Animations: Floating celestial elements, fade-ins, subtle glows

## File Structure

```
jolene-site/
├── index.html                      # Home page
├── portfolio.html                  # Filterable gallery
├── about.html                      # About page
├── commissions.html                # Commission intake + pricing
├── shop.html                       # Shop with Stripe integration
├── blog.html                       # Blog index
├── blog/                           # Individual blog posts
│   ├── post-template.html
│   └── [slug].html
├── contact.html                    # Contact form
├── press.html                      # Press and features
├── legal/                          # Legal pages
│   ├── privacy.html
│   ├── terms.html
│   └── cookies.html
├── assets/
│   ├── css/
│   │   ├── main.css               # Global styles (from current style.css)
│   │   ├── navigation.css         # Navigation system
│   │   ├── gallery.css            # Portfolio gallery styles
│   │   ├── lightbox.css           # Lightbox modal
│   │   ├── commerce.css           # Shop and checkout styles
│   │   └── blog.css               # Blog styles
│   ├── js/
│   │   ├── navigation.js          # Nav and mobile menu
│   │   ├── content-loader.js      # Loads JSON and renders content
│   │   ├── gallery-filter.js      # Portfolio filtering
│   │   ├── lightbox.js            # Artwork modal viewer
│   │   ├── stripe-checkout.js     # Stripe integration
│   │   ├── commission-form.js     # Commission intake
│   │   ├── instagram-feed.js      # Instagram API integration
│   │   └── analytics.js           # Plausible tracking
│   └── images/                     # All artwork and assets
├── content/
│   ├── artworks.json              # Master artwork database
│   ├── products.json              # Shop products (links to artworks)
│   ├── blog-posts.json            # Blog metadata
│   ├── testimonials.json          # Client testimonials
│   ├── press.json                 # Press mentions
│   └── site-config.json           # Global site settings
├── functions/                      # Netlify serverless functions
│   ├── stripe-webhook.js          # Handle Stripe events
│   ├── send-commission-email.js   # Commission notifications
│   ├── digital-delivery.js        # Generate secure download links
│   └── newsletter-signup.js       # Mailchimp integration
├── _redirects                      # Netlify redirects
├── netlify.toml                    # Netlify configuration
└── README.md                       # Complete documentation

```

## Content Data Model

### Artwork Entry (artworks.json)
```json
{
  "id": "lunar-dreams-001",
  "title": "Lunar Dreams",
  "description": "A surreal exploration of celestial bodies and vintage portraiture...",
  "image": "/assets/images/lunar-dreams.jpg",
  "thumbnail": "/assets/images/lunar-dreams-thumb.jpg",
  "tags": ["album-art", "celestial", "commissioned"],
  "category": "album-art",
  "dateCreated": "2024-11-15",
  "featured": true,
  "available": true,
  "productType": "print",
  "pricing": {
    "digital": 25,
    "print8x10": 45,
    "print16x20": 85,
    "print24x36": 150
  },
  "stripeProductId": "prod_XXX",
  "stripePriceIds": {
    "digital": "price_XXX",
    "print8x10": "price_XXX"
  },
  "seo": {
    "metaTitle": "Lunar Dreams - Surreal Digital Collage by Jolene Casko",
    "metaDescription": "A dreamlike celestial collage featuring...",
    "ogImage": "/assets/images/lunar-dreams-og.jpg",
    "altText": "Vintage portrait surrounded by moons and stars in purple hues"
  }
}
```

### Product Entry (products.json)
```json
{
  "id": "lunar-dreams-print-16x20",
  "artworkId": "lunar-dreams-001",
  "productType": "print",
  "size": "16x20",
  "material": "premium-matte",
  "price": 85,
  "stock": "made-to-order",
  "stripeProductId": "prod_XXX",
  "stripePriceId": "price_XXX",
  "deliveryType": "physical",
  "shippingProfile": "standard-print"
}
```

### Blog Post Entry (blog-posts.json)
```json
{
  "id": "creating-album-art-process",
  "title": "How I Create Album Art: From First Listen to Final Piece",
  "slug": "creating-album-art-process",
  "excerpt": "An inside look at my creative process when working with musicians...",
  "content": "Path to markdown file or HTML",
  "featuredImage": "/assets/images/blog/album-art-process.jpg",
  "author": "Jolene Casko",
  "publishDate": "2024-12-01",
  "tags": ["process", "album-art", "music"],
  "seo": {
    "metaTitle": "Creating Album Art: My Process | Jolene Casko",
    "metaDescription": "An inside look at how I translate music into visual art..."
  }
}
```

## Phase-by-Phase Implementation Plan

### PHASE 1: Structure and UI (Days 1-2)

#### Deliverables
1. **Site Map**: Complete navigation structure
2. **Navigation System**: Sticky header with mobile hamburger menu
3. **Page Templates**: HTML templates for all pages
4. **Portfolio Layout**: Filterable grid with tags
5. **Lightbox**: Modal viewer for artwork

#### Files Created
- All HTML page templates
- `assets/css/navigation.css`
- `assets/css/gallery.css`
- `assets/css/lightbox.css`
- `assets/js/navigation.js`
- `assets/js/gallery-filter.js`
- `assets/js/lightbox.js`

#### Key Features
- Responsive navigation (desktop: horizontal, mobile: hamburger)
- Sticky header with scroll effect
- Portfolio filtering by tags (album-art, collage, experimental, commissions)
- Keyboard-accessible navigation (Tab, Enter, Escape)
- Lightbox with prev/next navigation and purchase CTAs

---

### PHASE 2: Content Automation Foundation (Days 3-4)

#### Deliverables
1. **Content Schema**: JSON structure for all content types
2. **Content Loader**: JavaScript that reads JSON and renders pages
3. **Sample Data**: Complete sample artwork entries
4. **Dynamic Rendering**: Gallery, shop, and portfolio auto-generated from JSON

#### Files Created
- `content/artworks.json` (master database)
- `content/products.json`
- `content/site-config.json`
- `assets/js/content-loader.js`

#### Key Features
- Single source of truth for all artwork data
- Automatic gallery rendering from JSON
- Automatic SEO metadata generation
- No HTML editing required to add new artwork

---

### PHASE 3: Commerce and Commissions (Days 5-7)

#### Deliverables
1. **Stripe Setup Guide**: Product creation and API integration
2. **Shop Page**: Product grid with checkout buttons
3. **Checkout Flow**: Stripe Checkout integration
4. **Digital Delivery**: Secure download link generation
5. **Commission Form**: Intake form with Stripe deposit

#### Files Created
- `shop.html`
- `commissions.html`
- `assets/js/stripe-checkout.js`
- `assets/js/commission-form.js`
- `functions/stripe-webhook.js`
- `functions/digital-delivery.js`
- `functions/send-commission-email.js`

#### Stripe Integration Details
- **Products**: Each artwork size/variant as separate Stripe product
- **Checkout**: Client-side redirect to Stripe Checkout
- **Webhooks**: `checkout.session.completed` triggers delivery
- **Digital Downloads**: Time-limited signed URLs (24hr expiry)
- **Commission Deposits**: Stripe Payment Links with custom amount

#### Commission Form Fields
- Name, Email, Phone (optional)
- Project Type (album art, personal commission, editorial, other)
- Budget Tier (select ranges or custom)
- Timeline (no rush, moderate, urgent)
- Description (detailed project brief)
- Reference Links (mood boards, music links)
- File Upload (optional reference images)
- Legal Consent (usage rights, payment terms)

---

### PHASE 4: Engagement and SEO (Days 8-9)

#### Deliverables
1. **SEO Meta Tags**: Dynamic generation for all pages
2. **Newsletter Form**: Enhanced Mailchimp integration
3. **Instagram Feed**: Auto-updating feed via API
4. **Analytics**: Plausible integration
5. **Social Sharing**: OpenGraph and Twitter Card tags

#### Files Created
- `assets/js/instagram-feed.js`
- `assets/js/analytics.js`
- `functions/newsletter-signup.js`
- SEO templates in `content-loader.js`

#### SEO Implementation
- **Page Titles**: `{Title} | Jolene Casko - Digital Collage Artist`
- **Meta Descriptions**: Auto-generated from content
- **OpenGraph Tags**: Image, title, description for social sharing
- **Alt Text**: From artwork JSON entries
- **Structured Data**: JSON-LD for artwork and artist info

#### Instagram Integration
- Use Instagram Basic Display API
- Fetch latest 12 posts
- Display with thumbnails and captions
- Link to Instagram profile
- Cached for 1 hour to avoid rate limits

---

### PHASE 5: Blog and Content Growth (Days 10-11)

#### Deliverables
1. **Blog Templates**: Index and individual post pages
2. **Blog Rendering**: Dynamic post generation from JSON/Markdown
3. **Tag System**: Filterable blog posts
4. **Featured Posts**: Homepage blog preview
5. **RSS Feed**: Auto-generated from blog JSON

#### Files Created
- `blog.html`
- `blog/post-template.html`
- `content/blog-posts.json`
- `assets/css/blog.css`
- `assets/js/blog-loader.js`
- `feed.xml` (RSS)

#### Blog Features
- Markdown or HTML content support
- Featured images and excerpts
- Tag-based filtering
- Related posts suggestions
- Social sharing buttons
- Estimated read time

---

### PHASE 6: Professional Credibility (Days 12-13)

#### Deliverables
1. **Testimonials Section**: Display client reviews
2. **Press Page**: Media mentions and features
3. **Legal Pages**: Privacy, Terms, Cookies
4. **Footer Enhancement**: Legal links and site map

#### Files Created
- `press.html`
- `legal/privacy.html`
- `legal/terms.html`
- `legal/cookies.html`
- `content/testimonials.json`
- `content/press.json`

#### Legal Pages Content
- **Privacy Policy**: GDPR-compliant, covers newsletter, analytics, cookies
- **Terms of Service**: Commission terms, print sales, usage rights
- **Cookie Notice**: Analytics and essential cookies only

#### Testimonials Schema
```json
{
  "id": "testimonial-001",
  "clientName": "Artist Name",
  "projectType": "Album Art",
  "rating": 5,
  "quote": "Working with Jolene was transformative...",
  "featured": true,
  "date": "2024-10-15"
}
```

---

### PHASE 7: Final Polish and Automation (Days 14-15)

#### Deliverables
1. **End-to-End Testing**: Complete purchase and commission flow
2. **Email Templates**: Order confirmations, commission notifications
3. **Documentation**: Complete user guide for managing site
4. **Performance Optimization**: Image optimization, lazy loading
5. **Deployment Guide**: Netlify setup instructions

#### Verification Checklist
- [ ] Add new artwork → appears in gallery, shop, SEO updated
- [ ] Purchase print → Stripe checkout, email confirmation sent
- [ ] Purchase digital → Download link delivered automatically
- [ ] Submit commission → Notification email sent, Stripe deposit processed
- [ ] Newsletter signup → Double opt-in confirmation sent
- [ ] Blog post added → Appears on blog index, RSS updated
- [ ] Instagram feed updates automatically every hour
- [ ] All SEO tags rendering correctly
- [ ] Mobile navigation works perfectly
- [ ] Legal pages accessible from footer

---

## Automation Workflows

### New Artwork Addition
1. Add entry to `content/artworks.json`
2. Upload image to `assets/images/`
3. Commit and push to GitHub
4. Netlify auto-deploys
5. **Automatic Results**:
   - Appears in portfolio gallery
   - Available in shop (if pricing set)
   - SEO metadata generated
   - Social preview image configured

### Purchase Flow (Print)
1. Customer clicks "Buy Print" on shop
2. Redirected to Stripe Checkout
3. Customer completes payment
4. **Automatic Results**:
   - Stripe webhook hits `functions/stripe-webhook.js`
   - Order confirmation email sent (Stripe)
   - Internal notification email sent to Jolene
   - Order details logged for fulfillment

### Purchase Flow (Digital)
1. Customer clicks "Buy Digital"
2. Redirected to Stripe Checkout
3. Customer completes payment
4. **Automatic Results**:
   - Webhook triggers `functions/digital-delivery.js`
   - Secure time-limited download link generated
   - Email sent with download link (expires in 24 hours)
   - Customer can re-download during validity period

### Commission Submission
1. Customer fills out commission form
2. Form validates all required fields
3. Customer clicks "Request Commission"
4. **Automatic Results**:
   - Form data sent to `functions/send-commission-email.js`
   - Notification email sent to jolenecasko@gmail.com with all details
   - Customer receives confirmation email with next steps
   - (Optional) Stripe Payment Link sent for deposit

### Newsletter Signup
1. Visitor enters email in newsletter form
2. Form submits to `functions/newsletter-signup.js`
3. **Automatic Results**:
   - Contact added to Mailchimp list
   - Double opt-in email sent
   - User confirms subscription
   - Added to appropriate interest groups

---

## Configuration Requirements

### Environment Variables (Netlify)
```
STRIPE_SECRET_KEY=sk_live_XXX
STRIPE_WEBHOOK_SECRET=whsec_XXX
STRIPE_PUBLISHABLE_KEY=pk_live_XXX
MAILCHIMP_API_KEY=XXX
MAILCHIMP_AUDIENCE_ID=XXX
INSTAGRAM_ACCESS_TOKEN=XXX
PLAUSIBLE_DOMAIN=jolene.taurustech.me
SMTP_HOST=smtp.gmail.com (or Mailchimp transactional)
SMTP_USER=XXX
SMTP_PASSWORD=XXX
```

### Stripe Setup Steps
1. Create Stripe account
2. Create products for each artwork variant
3. Set up webhook endpoint: `https://jolene.taurustech.me/.netlify/functions/stripe-webhook`
4. Add webhook secret to environment variables
5. Enable checkout sessions
6. Configure email receipts

### Mailchimp Setup Steps
1. Create Mailchimp account
2. Create audience list
3. Set up interest groups: Prints, Commissions, Blog Updates
4. Create double opt-in automation
5. Get API key and Audience ID
6. (Optional) Set up Mailchimp Transactional for custom emails

### Instagram Setup Steps
1. Create Facebook Developer account
2. Create App with Instagram Basic Display
3. Authorize app for Jolene's Instagram account
4. Get long-lived access token (60 days, can refresh)
5. Add token to environment variables

### Analytics Setup
1. Create Plausible account (or self-host)
2. Add domain: jolene.taurustech.me
3. Add script tag to all pages
4. Configure goals: Newsletter signup, Purchase, Commission request

---

## Performance Optimization

### Image Strategy
- **Original artwork**: High-res in `assets/images/originals/`
- **Thumbnails**: 400x400px for gallery grids
- **Lightbox**: 1200px wide for modal viewer
- **OpenGraph**: 1200x630px for social sharing
- **Format**: WebP with JPEG fallback
- **Lazy loading**: Native `loading="lazy"` attribute

### JavaScript Loading
- Inline critical navigation JS
- Defer non-critical scripts
- Use ES modules for modern browsers
- Minify for production

### CSS Loading
- Inline critical CSS in `<head>`
- Load non-critical CSS asynchronously
- Minify and combine for production

### Caching Strategy
- Static assets: 1 year cache
- HTML: No cache (always fresh)
- Instagram feed: 1 hour cache in localStorage
- Content JSON: No cache (version-controlled)

---

## Security Considerations

### API Keys
- Never expose secret keys in client-side code
- Use Netlify environment variables
- Use publishable Stripe key for client-side

### Form Protection
- Honeypot fields for spam prevention
- Rate limiting on serverless functions
- CSRF protection via Netlify Forms
- Input validation and sanitization

### Digital Delivery
- Time-limited download URLs
- Signed URLs that can't be guessed
- One-time use or 24-hour expiry
- No direct file access

### Payment Security
- All payment processing via Stripe (PCI compliant)
- No credit card data touches your server
- Webhook signature verification
- HTTPS enforced everywhere

---

## Maintenance and Content Updates

### Adding New Artwork
1. Edit `content/artworks.json`
2. Add entry with all fields
3. Upload image to `assets/images/`
4. Commit and push to GitHub
5. Site auto-updates in ~1 minute

### Adding Blog Post
1. Edit `content/blog-posts.json`
2. Add metadata entry
3. Create `blog/{slug}.html` or Markdown file
4. Upload featured image
5. Commit and push

### Updating Prices
1. Update Stripe product prices
2. Update `content/artworks.json` pricing fields
3. Update `stripePriceIds` if needed
4. Commit and push

### Managing Testimonials
1. Edit `content/testimonials.json`
2. Add new testimonial entry
3. Set `featured: true` for homepage display
4. Commit and push

### Managing Press Mentions
1. Edit `content/press.json`
2. Add press entry with logo, quote, link
3. Upload publication logo to `assets/images/press/`
4. Commit and push

---

## Browser Support

### Target Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 13+)
- Mobile Chrome (Android 8+)

### Polyfills Needed
- None (using only modern baseline features)
- CSS Grid (98%+ support)
- Fetch API (96%+ support)
- ES6 modules (95%+ support)

### Graceful Degradation
- No JavaScript: Content still visible, forms use Netlify Forms
- No CSS Grid: Fallback to flexbox
- Older browsers: Show notification to upgrade

---

## Future Enhancements (Post-Launch)

### Phase 8+ Ideas
1. **Print Lab Integration**: Auto-fulfill orders via Printful API
2. **Advanced Analytics**: Custom event tracking, conversion funnels
3. **A/B Testing**: Test different portfolio layouts
4. **Client Portal**: Commission progress tracking
5. **Augmented Reality**: AR preview of prints on walls
6. **Limited Editions**: Numbered edition tracking
7. **Gift Cards**: Stripe-powered gift card system
8. **Referral Program**: Discount codes for referrals
9. **Multi-language**: i18n for international clients
10. **Advanced Search**: Full-text search across all content

---

## Success Metrics

### Key Performance Indicators
- **Traffic**: 10,000+ monthly visitors (6 months post-launch)
- **Conversion Rate**: 2%+ visitor-to-purchaser
- **Newsletter Growth**: 500+ subscribers (6 months)
- **Commission Requests**: 10+ quality leads per month
- **Average Order Value**: $75+
- **Page Load Time**: <2 seconds
- **Mobile Traffic**: 60%+ of total traffic

### Analytics Events to Track
- Page views
- Time on site
- Portfolio artwork views
- Lightbox opens
- Filter interactions
- Add to cart (Stripe checkout initiated)
- Purchase completed
- Newsletter signups
- Commission form submissions
- Instagram feed clicks
- Social sharing clicks

---

## Documentation Deliverables

### User Documentation
1. **Content Management Guide**: How to add artwork, blog posts, etc.
2. **Stripe Setup Guide**: Step-by-step product creation
3. **Email Templates Guide**: Customizing automated emails
4. **SEO Best Practices**: Optimizing metadata for each artwork
5. **Troubleshooting Guide**: Common issues and solutions

### Developer Documentation
1. **Architecture Overview**: This document
2. **API Reference**: Serverless function documentation
3. **Content Schema Reference**: JSON structure docs
4. **Deployment Guide**: Netlify setup and environment variables
5. **Contributing Guide**: How to modify and extend

---

## Timeline Estimate

### Development Phases
- **Phase 1**: 2 days (Structure and UI)
- **Phase 2**: 2 days (Content automation)
- **Phase 3**: 3 days (Commerce and commissions)
- **Phase 4**: 2 days (SEO and engagement)
- **Phase 5**: 2 days (Blog system)
- **Phase 6**: 2 days (Professional credibility)
- **Phase 7**: 2 days (Testing and polish)

**Total Development**: 15 days

### Additional Time
- **Content Creation**: 3-5 days (writing copy, preparing images)
- **Stripe Setup**: 1 day (product creation, testing)
- **API Setup**: 1 day (Mailchimp, Instagram, Plausible)
- **Testing**: 2 days (end-to-end testing)
- **Launch**: 1 day (DNS, final deployment)

**Total Project**: 20-25 days end-to-end

---

## Risk Mitigation

### Potential Risks
1. **Instagram API deprecation**: Have fallback to manual curation
2. **Stripe webhook failures**: Implement retry logic and monitoring
3. **Image hosting limits**: Use Cloudinary or Imgix if needed
4. **High traffic spikes**: Netlify free tier limits (100GB/month)
5. **Spam submissions**: Implement captcha if needed

### Backup Plans
- Version control for all content (Git)
- Daily automated backups of content files
- Stripe data as source of truth for orders
- Mailchimp backup of subscriber list
- Local copies of all images

---

## Compliance and Legal

### GDPR Compliance
- Cookie consent notice
- Privacy policy with data processing details
- Newsletter double opt-in
- Right to unsubscribe
- Data deletion upon request

### E-commerce Legal Requirements
- Clear pricing and shipping information
- Return and refund policy
- Terms of service for commissions
- Copyright and usage rights clearly stated
- Business information in footer

### Accessibility (WCAG 2.1 AA)
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios
- Alt text for all images
- Screen reader friendly

---

## Contact and Support

### Implementation Support Needed
1. **Stripe Account Setup**: Jolene to create and configure
2. **Mailchimp Account**: Jolene to create and provide API credentials
3. **Instagram Access Token**: Jolene to authorize app
4. **Content Writing**: Jolene to provide text for About, Legal pages
5. **Image Assets**: Jolene to provide high-res artwork images
6. **Testimonials**: Jolene to provide real client testimonials (if available)

### Post-Launch Support
- Documentation for self-service updates
- Optional: Monthly maintenance retainer
- Optional: Content update service
- Optional: Analytics review and optimization

---

*Last Updated: January 10, 2026*
*Version: 1.0*
