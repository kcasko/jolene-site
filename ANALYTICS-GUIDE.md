# Analytics Integration Guide

Complete guide to setting up Google Analytics 4, tracking conversions, and measuring your portfolio site's success.

## Table of Contents

1. [Google Analytics 4 Setup](#google-analytics-4-setup)
2. [Event Tracking](#event-tracking)
3. [E-Commerce Tracking](#e-commerce-tracking)
4. [Conversion Goals](#conversion-goals)
5. [Custom Dashboards](#custom-dashboards)
6. [Privacy & Compliance](#privacy--compliance)
7. [Alternative Analytics](#alternative-analytics)

---

## Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to https://analytics.google.com/
2. Click **Admin** (gear icon, bottom left)
3. Under **Account**, click **Create Account**
4. Account name: "Jolene Casko Portfolio"
5. Check relevant data sharing settings
6. Click **Next**
7. Property name: "Jolene Casko Website"
8. Time zone: Your time zone
9. Currency: USD
10. Click **Next**
11. Business details: Select appropriate options
12. Click **Create** and accept Terms of Service

### Step 2: Get Measurement ID

1. In Admin > Property > Data Streams
2. Click **Add stream** > **Web**
3. Website URL: `https://jolenecasko.netlify.app`
4. Stream name: "Main Website"
5. Click **Create stream**
6. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### Step 3: Install Tracking Code

Add this code to the `<head>` section of every HTML page:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Files to update:**
- index.html
- portfolio.html
- shop.html
- about.html
- contact.html
- commissions.html
- blog.html
- blog/welcome-to-my-digital-collage-journey.html

### Step 4: Verify Installation

1. Visit your site
2. In GA4, go to **Reports** > **Realtime**
3. You should see yourself as an active user
4. Navigate between pages to verify tracking

---

## Event Tracking

Track specific user actions to understand engagement.

### Core Events to Track

#### 1. Newsletter Signups

Update `/assets/js/newsletter.js`:

```javascript
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value.trim();

  try {
    const response = await fetch('/.netlify/functions/newsletter-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      // Track newsletter signup
      if (typeof gtag === 'function') {
        gtag('event', 'newsletter_signup', {
          'event_category': 'engagement',
          'event_label': 'footer_form'
        });
      }

      showMessage(messageDiv, 'Thank you for subscribing!', 'success');
    }
  } catch (error) {
    console.error('Newsletter signup error:', error);
  }
}
```

#### 2. Contact Form Submissions

Update `/assets/js/forms.js` or create tracking in contact.html:

```javascript
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
  // Track before submission
  if (typeof gtag === 'function') {
    gtag('event', 'contact_form_submit', {
      'event_category': 'lead_generation',
      'event_label': 'contact_page'
    });
  }
});
```

#### 3. Commission Request Submissions

Update commissions.html:

```javascript
const commissionForm = document.getElementById('commission-form');

commissionForm.addEventListener('submit', function(e) {
  // Track commission request
  if (typeof gtag === 'function') {
    const budget = document.getElementById('budget').value;
    const timeline = document.getElementById('timeline').value;

    gtag('event', 'commission_request', {
      'event_category': 'conversion',
      'event_label': 'commission_form',
      'value': budget,
      'timeline': timeline
    });
  }
});
```

#### 4. Artwork Views

Update `/assets/js/content-loader.js` to track when users view individual artworks:

```javascript
function createArtworkCard(artwork) {
  const card = document.createElement('div');
  card.className = 'artwork-card';

  // Add click tracking
  card.addEventListener('click', function() {
    if (typeof gtag === 'function') {
      gtag('event', 'view_artwork', {
        'event_category': 'engagement',
        'event_label': artwork.title,
        'artwork_id': artwork.id,
        'artwork_category': artwork.category
      });
    }
  });

  // ... rest of card creation
  return card;
}
```

#### 5. Social Link Clicks

Add tracking to social media links (in all pages):

```javascript
// Add this script before </body>
document.querySelectorAll('a[href*="instagram.com"], a[href*="twitter.com"], a[href*="linkedin.com"]').forEach(link => {
  link.addEventListener('click', function(e) {
    if (typeof gtag === 'function') {
      const platform = this.href.includes('instagram') ? 'Instagram' :
                      this.href.includes('twitter') ? 'Twitter' : 'LinkedIn';

      gtag('event', 'social_click', {
        'event_category': 'engagement',
        'event_label': platform,
        'link_url': this.href
      });
    }
  });
});
```

#### 6. Blog Post Engagement

Update `/assets/js/blog-loader.js`:

```javascript
function renderBlogPost() {
  const slug = window.location.pathname.split('/').pop().replace('.html', '');
  const post = blogData.posts.find(p => p.slug === slug);

  if (!post) return;

  // Track blog post view
  if (typeof gtag === 'function') {
    gtag('event', 'view_blog_post', {
      'event_category': 'content',
      'event_label': post.title,
      'post_id': post.id,
      'post_category': post.category
    });
  }

  // Track reading time
  setTimeout(() => {
    if (typeof gtag === 'function') {
      gtag('event', 'blog_post_read', {
        'event_category': 'engagement',
        'event_label': post.title,
        'read_time': post.readTime
      });
    }
  }, post.readTime * 60 * 1000); // Track after estimated read time

  // ... rest of rendering
}
```

#### 7. External Link Clicks

Track when users click outbound links:

```javascript
// Add to main.js or inline in footer
document.querySelectorAll('a[href^="http"]').forEach(link => {
  // Skip own domain
  if (link.href.includes(window.location.hostname)) return;

  link.addEventListener('click', function(e) {
    if (typeof gtag === 'function') {
      gtag('event', 'click', {
        'event_category': 'outbound_link',
        'event_label': this.href,
        'transport_type': 'beacon'
      });
    }
  });
});
```

---

## E-Commerce Tracking

Track purchases and product interactions for shop insights.

### Enhanced E-Commerce Setup

#### 1. Enable E-Commerce in GA4

1. Go to Admin > Property > Data Streams
2. Click your web stream
3. Scroll to **Enhanced measurement**
4. Turn on **File downloads** and **Outbound clicks**
5. In Admin > Property > E-commerce Settings
6. Enable E-commerce reporting

#### 2. Track Product Views

Update `/assets/js/content-loader.js` for shop page:

```javascript
function renderShopContent() {
  const productGrid = document.querySelector('.product-grid');

  artworkData.artworks.forEach(artwork => {
    const card = createProductCard(artwork);
    productGrid.appendChild(card);

    // Track product impression
    if (typeof gtag === 'function') {
      gtag('event', 'view_item', {
        'currency': 'USD',
        'value': artwork.pricing.digital,
        'items': [{
          'item_id': artwork.id,
          'item_name': artwork.title,
          'item_category': artwork.category,
          'price': artwork.pricing.digital
        }]
      });
    }
  });
}
```

#### 3. Track Add to Cart (Variant Selection)

Update `/assets/js/checkout.js`:

```javascript
function showVariantModal(artworkId) {
  const artwork = window.artworkData.artworks.find(art => art.id === artworkId);

  // Track product detail view
  if (typeof gtag === 'function') {
    gtag('event', 'view_item', {
      'currency': 'USD',
      'value': artwork.pricing.digital,
      'items': [{
        'item_id': artwork.id,
        'item_name': artwork.title,
        'item_category': artwork.category,
        'price': artwork.pricing.digital
      }]
    });
  }

  // ... show modal
}

async function handleVariantSelect(variant) {
  const price = selectedArtwork.pricing[variant];

  // Track add to cart
  if (typeof gtag === 'function') {
    gtag('event', 'add_to_cart', {
      'currency': 'USD',
      'value': price,
      'items': [{
        'item_id': selectedArtwork.id,
        'item_name': selectedArtwork.title,
        'item_variant': variant,
        'price': price,
        'quantity': 1
      }]
    });
  }

  // Create checkout session
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artworkId: selectedArtwork.id, variant })
  });

  const { url } = await response.json();

  // Track begin checkout
  if (typeof gtag === 'function') {
    gtag('event', 'begin_checkout', {
      'currency': 'USD',
      'value': price,
      'items': [{
        'item_id': selectedArtwork.id,
        'item_name': selectedArtwork.title,
        'item_variant': variant,
        'price': price,
        'quantity': 1
      }]
    });
  }

  window.location.href = url;
}
```

#### 4. Track Completed Purchases

Update `/netlify/functions/stripe-webhook.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    // Extract purchase data from metadata
    const { artworkId, variant, artworkTitle, price } = session.metadata;

    // Log purchase to analytics
    // Note: Server-side GA4 tracking requires Measurement Protocol
    // For now, track on client-side success page (see below)

    console.log('Purchase completed:', { artworkId, variant, price });
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
```

Create `/shop/success.html` for post-purchase tracking:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Complete - Jolene Casko</title>
  <link rel="stylesheet" href="/assets/css/main.css">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');

    // Track purchase on page load
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Fetch session details from Stripe
      fetch(`/.netlify/functions/get-session-details?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          gtag('event', 'purchase', {
            'transaction_id': sessionId,
            'value': data.amount_total / 100,
            'currency': 'USD',
            'items': [{
              'item_id': data.metadata.artworkId,
              'item_name': data.metadata.artworkTitle,
              'item_variant': data.metadata.variant,
              'price': data.amount_total / 100,
              'quantity': 1
            }]
          });
        });
    }
  </script>
</head>
<body>
  <div class="success-container">
    <h1>Thank You for Your Purchase!</h1>
    <p>Your order has been received and will be processed shortly.</p>
    <p>You'll receive an email confirmation with details.</p>
    <a href="/shop.html" class="button">Continue Shopping</a>
    <a href="/" class="button secondary">Return Home</a>
  </div>
</body>
</html>
```

Create `/netlify/functions/get-session-details.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const { session_id } = event.queryStringParameters;

  if (!session_id) {
    return { statusCode: 400, body: 'Missing session_id' };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount_total: session.amount_total,
        metadata: session.metadata
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

---

## Conversion Goals

Define what success looks like and track it.

### Key Conversions to Track

1. **Primary Conversions:**
   - Purchases (tracked above)
   - Commission requests
   - Contact form submissions

2. **Secondary Conversions:**
   - Newsletter signups
   - Social media follows
   - Blog post reads
   - Portfolio downloads (if offering)

3. **Micro-Conversions:**
   - Artwork views
   - Blog post views
   - Time on site > 2 minutes
   - Multiple page visits

### Set Up Conversions in GA4

1. Go to **Admin** > **Events**
2. Click **Create event**
3. For each conversion (e.g., `purchase`, `commission_request`, `newsletter_signup`):
   - Click **Mark as conversion**
4. Conversions will now appear in **Reports** > **Engagement** > **Conversions**

### Assign Monetary Values

Estimate value for non-purchase conversions:

```javascript
// Commission request (estimated value)
gtag('event', 'commission_request', {
  'event_category': 'conversion',
  'value': 500, // Average commission value
  'currency': 'USD'
});

// Newsletter signup (lifetime value estimate)
gtag('event', 'newsletter_signup', {
  'event_category': 'engagement',
  'value': 10, // Estimated LTV of subscriber
  'currency': 'USD'
});
```

---

## Custom Dashboards

Create focused views for quick insights.

### Dashboard 1: Portfolio Performance

**Metrics to include:**
- Total sessions
- New vs. returning visitors
- Top artwork views
- Average session duration
- Bounce rate
- Geographic distribution

**How to create:**
1. Go to **Explore** > **Blank**
2. Add dimensions: Page title, Country, Device category
3. Add metrics: Sessions, Users, Engagement rate
4. Create visualizations (line chart, bar chart, geo map)
5. Save as "Portfolio Performance"

### Dashboard 2: E-Commerce Overview

**Metrics to include:**
- Total revenue
- Conversion rate
- Average order value
- Top-selling artworks
- Abandoned checkouts
- Revenue by product variant

**Create custom report:**
1. **Explore** > **Blank**
2. Dimensions: Item name, Item variant
3. Metrics: Purchase revenue, Add to carts, Purchases
4. Filter: Event name = purchase, add_to_cart
5. Save as "E-Commerce Overview"

### Dashboard 3: Content Engagement

**Metrics to include:**
- Blog post views
- Average read time
- Social shares
- Top blog posts
- Newsletter signups from blog
- Blog-to-shop conversion

**Setup:**
1. **Explore** > **Blank**
2. Dimensions: Page path, Event name
3. Metrics: Views, Engagement rate, Conversions
4. Filter: Page path contains "/blog/"
5. Save as "Content Performance"

### Dashboard 4: Conversion Funnel

Track the journey from visitor to customer:

**Funnel steps:**
1. Homepage visit
2. Portfolio or Shop view
3. Artwork view
4. Variant selection (add_to_cart)
5. Checkout begin
6. Purchase complete

**Create funnel:**
1. **Explore** > **Funnel exploration**
2. Add steps:
   - Step 1: page_view (path contains "/")
   - Step 2: page_view (path contains "/shop")
   - Step 3: view_item
   - Step 4: add_to_cart
   - Step 5: begin_checkout
   - Step 6: purchase
3. Save as "Purchase Funnel"

---

## Privacy & Compliance

Respect user privacy and comply with regulations.

### GDPR Compliance (if serving EU visitors)

#### 1. Create Privacy Policy

Create `/privacy.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Privacy Policy - Jolene Casko</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <div class="container">
    <h1>Privacy Policy</h1>
    <p><em>Last updated: [Date]</em></p>

    <h2>Information We Collect</h2>
    <p>We collect information you provide directly (contact forms, newsletter signup) and automatically (Google Analytics cookies).</p>

    <h2>How We Use Your Information</h2>
    <ul>
      <li>Process orders and commissions</li>
      <li>Send newsletters (with your consent)</li>
      <li>Improve website experience</li>
      <li>Analyze website traffic</li>
    </ul>

    <h2>Cookies</h2>
    <p>We use Google Analytics cookies to understand how visitors use our site. You can opt out using browser settings or Google Analytics Opt-out Browser Add-on.</p>

    <h2>Third-Party Services</h2>
    <ul>
      <li><strong>Google Analytics</strong>: Website analytics</li>
      <li><strong>Stripe</strong>: Payment processing</li>
      <li><strong>Netlify</strong>: Hosting and forms</li>
    </ul>

    <h2>Your Rights</h2>
    <p>You have the right to access, correct, or delete your personal data. Contact us at jolenecasko@gmail.com.</p>

    <h2>Contact</h2>
    <p>For privacy inquiries: jolenecasko@gmail.com</p>
  </div>
</body>
</html>
```

#### 2. Add Cookie Consent (Simple Version)

Add to all pages:

```html
<div id="cookie-notice" style="display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(42, 26, 64, 0.95); padding: 20px; text-align: center; z-index: 9999;">
  <p style="color: #fffacd; margin: 0 0 10px;">We use cookies to improve your experience and analyze site traffic. <a href="/privacy.html" style="color: #fffacd; text-decoration: underline;">Learn more</a></p>
  <button onclick="acceptCookies()" style="background: #8b7aa8; color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px;">Accept</button>
</div>

<script>
  function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.getElementById('cookie-notice').style.display = 'none';
  }

  if (!localStorage.getItem('cookieConsent')) {
    document.getElementById('cookie-notice').style.display = 'block';
  }
</script>
```

#### 3. Anonymize IP Addresses

Update GA4 config:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true,
  'allow_google_signals': false, // Disable advertising features
  'allow_ad_personalization_signals': false
});
```

### Do Not Track (DNT) Respect

```javascript
// Respect DNT browser setting
if (navigator.doNotTrack === '1') {
  // Don't load analytics
  console.log('DNT enabled, analytics disabled');
} else {
  // Load Google Analytics
  (function() {
    // GA code here
  })();
}
```

---

## Alternative Analytics

Privacy-focused alternatives to Google Analytics.

### Option 1: Plausible Analytics

**Pros:**
- GDPR compliant by default
- No cookies
- Lightweight (< 1KB)
- Simple dashboard
- $9/month

**Setup:**
```html
<script defer data-domain="jolenecasko.netlify.app" src="https://plausible.io/js/script.js"></script>
```

### Option 2: Fathom Analytics

**Pros:**
- Privacy-first
- No cookies
- GDPR/CCPA compliant
- Beautiful UI
- $14/month

**Setup:**
```html
<script src="https://cdn.usefathom.com/script.js" data-site="ABCDEFGH" defer></script>
```

### Option 3: Simple Analytics

**Pros:**
- No cookies
- Fully compliant
- Events tracking
- API access
- $19/month

**Setup:**
```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```

### Option 4: Self-Hosted Matomo

**Pros:**
- Full data ownership
- All features
- GDPR friendly
- Free (self-hosted)

**Cons:**
- Requires server management
- More complex setup

---

## Analytics Checklist

### Initial Setup
- [ ] Create GA4 property
- [ ] Install tracking code on all pages
- [ ] Verify tracking in Realtime report
- [ ] Enable enhanced measurement
- [ ] Set up e-commerce tracking
- [ ] Create custom events
- [ ] Mark conversions
- [ ] Set up conversion values

### Ongoing Monitoring
- [ ] Check weekly for traffic trends
- [ ] Review top-performing content monthly
- [ ] Analyze conversion funnels
- [ ] Track product performance
- [ ] Monitor bounce rate and engagement
- [ ] Review geographic data
- [ ] Check mobile vs. desktop usage
- [ ] Identify top referral sources

### Optimization
- [ ] A/B test call-to-action buttons
- [ ] Optimize high-bounce pages
- [ ] Improve low-performing content
- [ ] Streamline conversion funnels
- [ ] Test pricing and variants
- [ ] Experiment with blog topics
- [ ] Adjust based on user behavior

---

## Key Metrics to Watch

### Traffic Metrics
- **Sessions**: Total site visits
- **Users**: Unique visitors
- **New vs. Returning**: Growth indicator
- **Traffic Sources**: Where visitors come from

### Engagement Metrics
- **Bounce Rate**: < 60% is good
- **Average Session Duration**: > 2 minutes ideal
- **Pages per Session**: > 2.5 target
- **Engagement Rate**: > 50% is excellent

### Conversion Metrics
- **Conversion Rate**: Purchases / Sessions (target: 1-3%)
- **Form Completion Rate**: Submissions / Form Views
- **Email Capture Rate**: Signups / Visitors (target: 2-5%)
- **Commission Request Rate**: Requests / Sessions

### E-Commerce Metrics
- **Revenue**: Total sales
- **Average Order Value**: Revenue / Orders
- **Product Views to Purchase**: Purchase Rate
- **Cart Abandonment Rate**: < 70% is good

### Content Metrics
- **Blog Post Views**: Total views per post
- **Average Read Time**: Engagement indicator
- **Social Shares**: Virality metric
- **Blog-to-Conversion Rate**: Blog visitors who convert

---

**Remember**: Analytics are only useful if you act on them. Review monthly, identify trends, and make data-driven improvements!
