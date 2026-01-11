# Performance Optimization Guide

This guide covers optimizations to improve your site's speed, Core Web Vitals, and user experience.

## Quick Wins (Implement First)

### 1. Image Optimization

Your site's biggest performance impact comes from images. Optimize them immediately.

#### Compress All Images

Use one of these tools:
- **TinyPNG** (https://tinypng.com/) - Drag and drop, free
- **Squoosh** (https://squoosh.app/) - Google's web app
- **ImageOptim** (Mac only) - Desktop app
- **RIOT** (Windows) - Desktop app

**Target sizes:**
- Thumbnails/cards: 50-150 KB
- Full artwork images: 200-400 KB
- Blog featured images: 100-200 KB
- Hero images: 150-300 KB

#### Convert to WebP

WebP images are 25-35% smaller than JPEG with same quality.

**Convert existing images:**
```bash
# Install cwebp (one-time)
# Mac: brew install webp
# Windows: Download from https://developers.google.com/speed/webp/download

# Convert a single image
cwebp -q 85 input.jpg -o output.webp

# Batch convert all JPGs in a folder
for file in *.jpg; do cwebp -q 85 "$file" -o "${file%.jpg}.webp"; done
```

**Update HTML to use WebP with fallback:**
```html
<picture>
  <source srcset="/assets/images/artworks/lunar-dreams.webp" type="image/webp">
  <img src="/assets/images/artworks/lunar-dreams.jpg"
       alt="Lunar Dreams digital collage"
       loading="lazy">
</picture>
```

#### Resize Oversized Images

Don't serve 4000px images when you display them at 800px.

**Recommended sizes:**
- Gallery thumbnails: 600×800px max
- Full artwork view: 1200×1600px max
- Blog images: 1200×630px (social sharing optimal)
- Hero backgrounds: 1920×1080px max

**Resize using ImageMagick:**
```bash
# Install ImageMagick
# Mac: brew install imagemagick
# Windows: https://imagemagick.org/script/download.php

# Resize maintaining aspect ratio
magick input.jpg -resize 1200x1600 output.jpg

# Batch resize
magick mogrify -resize 1200x1600 *.jpg
```

### 2. Implement Resource Hints

Add these to `<head>` on critical pages to preload/prefetch resources.

#### On Homepage (index.html)

```html
<!-- Preload critical resources -->
<link rel="preload" href="/assets/css/main.css" as="style">
<link rel="preload" href="/assets/js/content-loader.js" as="script">
<link rel="preload" href="/content/artworks.json" as="fetch" crossorigin>

<!-- Prefetch next likely page -->
<link rel="prefetch" href="/portfolio.html">

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### On Shop Page (shop.html)

```html
<!-- Preconnect to Stripe -->
<link rel="preconnect" href="https://checkout.stripe.com">
<link rel="dns-prefetch" href="https://js.stripe.com">
```

### 3. Optimize Font Loading

Fonts can block rendering. Load them efficiently.

#### Update Font Loading in CSS

```css
/* In main.css, update @import to: */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');

/* Add font-display for fallback */
body {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### Self-Host Fonts (Advanced)

For maximum performance, download and host fonts yourself:

1. Download from Google Fonts
2. Place in `/assets/fonts/`
3. Update CSS:

```css
@font-face {
  font-family: 'Montserrat';
  src: url('/assets/fonts/montserrat-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Playfair Display';
  src: url('/assets/fonts/playfair-display-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### 4. Enable Caching

Update your [netlify.toml](netlify.toml) to include aggressive caching:

```toml
# Add to existing netlify.toml

[[headers]]
  for = "/assets/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/content/*.json"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

**What this does:**
- Static assets (CSS, JS, images, fonts): cached for 1 year
- JSON content: cached for 1 hour (allows updates)
- HTML pages: always check for updates

### 5. Minify CSS and JavaScript

#### CSS Minification

Install cssnano:
```bash
npm install -D cssnano cssnano-cli
```

Add script to `package.json`:
```json
{
  "scripts": {
    "minify-css": "cssnano assets/css/*.css assets/css/min/"
  }
}
```

Or use online tool: https://cssnano.co/playground/

**Before deployment, minify:**
```bash
npm run minify-css
```

Then update HTML to reference minified versions:
```html
<link rel="stylesheet" href="/assets/css/min/main.min.css">
```

#### JavaScript Minification

Install Terser:
```bash
npm install -D terser
```

Add script to `package.json`:
```json
{
  "scripts": {
    "minify-js": "terser assets/js/*.js -o assets/js/min/ --compress --mangle"
  }
}
```

Or use online tool: https://terser.org/repl

**Update HTML:**
```html
<script src="/assets/js/min/content-loader.min.js"></script>
```

## Intermediate Optimizations

### 6. Lazy Load Images

Already implemented with `loading="lazy"` attribute, but you can enhance it.

#### Add Intersection Observer (Progressive Enhancement)

Create `/assets/js/lazy-load.js`:

```javascript
/**
 * Progressive lazy loading with Intersection Observer
 * Provides better control than native loading="lazy"
 */

(function() {
  'use strict';

  // Only run if browser doesn't support native lazy loading
  if ('loading' in HTMLImageElement.prototype) return;

  const images = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before entering viewport
    threshold: 0.01
  });

  images.forEach(img => imageObserver.observe(img));
})();
```

Add to pages with many images:
```html
<script src="/assets/js/lazy-load.js" defer></script>
```

### 7. Implement Critical CSS

Extract above-the-fold CSS and inline it in `<head>` for faster first paint.

#### Identify Critical CSS

Use one of these tools:
- **Critical** (CLI): https://github.com/addyosmani/critical
- **Penthouse** (CLI): https://github.com/pocketjoso/penthouse
- **Critical Path CSS Generator**: https://www.sitelocity.com/critical-path-css-generator

#### Example for Homepage

1. Extract critical CSS (header, hero, above-fold)
2. Inline it:

```html
<!-- In index.html <head> -->
<style>
  /* Critical CSS - inline for fastest render */
  body { margin: 0; font-family: 'Montserrat', sans-serif; }
  .header { background: #2a1a40; padding: 20px; }
  .hero { min-height: 60vh; background: linear-gradient(...); }
  /* ... more critical styles ... */
</style>

<!-- Load full CSS asynchronously -->
<link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/css/main.css"></noscript>
```

### 8. Optimize JSON Loading

Your JSON files load asynchronously, but you can optimize further.

#### Add Compression

Netlify automatically gzips assets over 1KB, but verify:

```toml
# In netlify.toml
[[headers]]
  for = "*.json"
  [headers.values]
    Content-Encoding = "gzip"
```

#### Implement Stale-While-Revalidate

Update content-loader.js to cache JSON in localStorage:

```javascript
// Enhanced loadArtworkData with caching
async function loadArtworkData() {
  const cacheKey = 'artworkData';
  const cacheTimestamp = 'artworkDataTimestamp';
  const cacheExpiry = 60 * 60 * 1000; // 1 hour

  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  const timestamp = localStorage.getItem(cacheTimestamp);

  if (cached && timestamp && (Date.now() - timestamp < cacheExpiry)) {
    artworkData = JSON.parse(cached);
    return artworkData;
  }

  // Fetch fresh data
  const response = await fetch('/content/artworks.json');
  if (!response.ok) throw new Error('Failed to load artwork data');
  const data = await response.json();

  // Update cache
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(cacheTimestamp, Date.now().toString());

  artworkData = data;
  return data;
}
```

### 9. Defer Non-Critical JavaScript

Move non-essential scripts to load after page render.

#### Update Script Tags

Change from:
```html
<script src="/assets/js/instagram.js"></script>
```

To:
```html
<script src="/assets/js/instagram.js" defer></script>
```

Or even better, load async for non-dependent scripts:
```html
<script src="/assets/js/newsletter.js" async></script>
```

**Rule of thumb:**
- Critical scripts (content-loader): No defer/async
- Order-dependent scripts: `defer`
- Independent scripts: `async`

### 10. Optimize Third-Party Scripts

#### Google Analytics (if using)

Load asynchronously:
```html
<!-- Modern GA4 snippet (already async) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Or use Partytown for better performance:
https://partytown.builder.io/

#### Stripe

Only load on shop/checkout pages:

```html
<!-- Only in shop.html, not site-wide -->
<script src="https://js.stripe.com/v3/" defer></script>
```

## Advanced Optimizations

### 11. Implement Service Worker

Cache assets for offline access and faster repeat visits.

Create `/sw.js` in root:

```javascript
const CACHE_NAME = 'jolene-casko-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/portfolio.html',
  '/shop.html',
  '/about.html',
  '/assets/css/main.css',
  '/assets/css/navigation.css',
  '/assets/js/content-loader.js',
  '/content/artworks.json'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Update cache when new version deployed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

Register in main HTML files:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
</script>
```

### 12. Code Splitting

Split large JavaScript files into smaller chunks loaded on demand.

#### Example: Split Checkout Code

Instead of loading all checkout code upfront, load it when user clicks "Buy Now":

```javascript
// In shop.html
async function loadCheckout() {
  if (!window.checkoutLoaded) {
    const script = document.createElement('script');
    script.src = '/assets/js/checkout.js';
    document.body.appendChild(script);
    window.checkoutLoaded = true;
  }
}

// Trigger on first "Buy Now" click
document.querySelectorAll('.buy-now-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    await loadCheckout();
    // Then proceed with checkout
  }, { once: true });
});
```

### 13. Optimize CSS Delivery

Remove unused CSS with PurgeCSS.

#### Install PurgeCSS

```bash
npm install -D @fullhuman/postcss-purgecss
```

#### Create `postcss.config.js`:

```javascript
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./**/*.html', './assets/js/**/*.js'],
      safelist: ['active', 'show', 'modal-open', 'featured'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
```

#### Run PurgeCSS:

```bash
npx purgecss --css assets/css/*.css --content '**/*.html' 'assets/js/**/*.js' --output assets/css/purged/
```

This can reduce CSS file size by 70-90%!

### 14. Implement Image Placeholders

Show low-quality placeholders while full images load (LQIP technique).

#### Generate Tiny Placeholders

```bash
# Create 20px wide blurred placeholder
magick input.jpg -resize 20x -blur 0x2 placeholder.jpg
```

#### Use with Blur-Up Effect

```html
<div class="artwork-card" style="background-image: url('/assets/images/placeholders/lunar-dreams-tiny.jpg');">
  <img src="/assets/images/artworks/lunar-dreams.jpg"
       alt="Lunar Dreams"
       loading="lazy"
       onload="this.parentElement.classList.add('loaded')">
</div>
```

```css
.artwork-card {
  background-size: cover;
  filter: blur(10px);
  transition: filter 0.3s ease;
}

.artwork-card.loaded {
  filter: blur(0);
}
```

### 15. Preload LCP Image

Identify and preload your Largest Contentful Paint image.

Use Lighthouse to find LCP element, then:

```html
<!-- In <head> of homepage -->
<link rel="preload"
      as="image"
      href="/assets/images/artworks/featured-hero.jpg"
      imagesrcset="/assets/images/artworks/featured-hero-800.jpg 800w,
                   /assets/images/artworks/featured-hero-1200.jpg 1200w"
      imagesizes="100vw">
```

## Performance Monitoring

### Set Up Monitoring

#### 1. Real User Monitoring (RUM)

Use Google Analytics 4 to track Core Web Vitals:

```html
<script>
  // After GA4 initialization
  gtag('config', 'G-XXXXXXXXXX', {
    'custom_map': {
      'metric1': 'LCP',
      'metric2': 'FID',
      'metric3': 'CLS'
    }
  });

  // Report Core Web Vitals
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      gtag('event', 'web_vitals', {
        'metric_name': entry.name,
        'metric_value': entry.value,
        'metric_id': entry.id
      });
    }
  }).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
</script>
```

#### 2. Synthetic Monitoring

Set up automated performance checks:

- **Google Search Console**: Monitor Core Web Vitals
- **Lighthouse CI**: Automated Lighthouse runs on deploy
- **WebPageTest**: Schedule weekly tests

#### 3. Budget Alerts

Set performance budgets in Lighthouse CI:

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

## Performance Checklist

### Before Launch
- [ ] All images compressed and optimized
- [ ] WebP format used with fallbacks
- [ ] Images resized to appropriate dimensions
- [ ] Lazy loading implemented
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Fonts optimized (font-display: swap)
- [ ] Resource hints added (preload, prefetch, preconnect)
- [ ] Caching headers configured
- [ ] Critical CSS inlined (optional)
- [ ] Service worker registered (optional)
- [ ] Third-party scripts defer/async
- [ ] LCP image preloaded

### Performance Targets

Aim for these scores on Google PageSpeed Insights:

**Mobile:**
- Performance: 90+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

**Desktop:**
- Performance: 95+
- LCP: < 2.0s
- FID: < 50ms
- CLS: < 0.1

### Regular Maintenance

Monthly:
- [ ] Run PageSpeed Insights on all pages
- [ ] Check Core Web Vitals in Search Console
- [ ] Review analytics for slow pages
- [ ] Update dependencies (npm update)
- [ ] Optimize new images before uploading
- [ ] Remove unused code

Quarterly:
- [ ] Full Lighthouse audit
- [ ] Purge unused CSS
- [ ] Review and update service worker cache
- [ ] Test on new devices/browsers
- [ ] Benchmark against competitors

## Quick Reference: Image Optimization Workflow

Every time you add new artwork:

1. **Export from design tool** at appropriate size (1200×1600px max)
2. **Compress** with TinyPNG (or similar)
3. **Convert to WebP** (optional but recommended)
4. **Add to site** with appropriate alt text and loading="lazy"
5. **Test** on mobile to verify quality
6. **Update JSON** with image paths

**Batch process:**
```bash
# Compress all new images
for file in *.jpg; do
  # Compress
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done

# Resize if needed
magick mogrify -resize 1200x1600 *.jpg
```

## Resources

- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebP Converter**: https://squoosh.app/
- **TinyPNG**: https://tinypng.com/
- **ImageOptim**: https://imageoptim.com/
- **PurgeCSS**: https://purgecss.com/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci
- **web.dev Performance**: https://web.dev/performance/

---

**Remember**: Performance is not one-time—it's ongoing. Every image, script, and feature impacts load time. Optimize as you go!
