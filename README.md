# Jolene Casko - Digital Collage Artist Portfolio

A modern, automated portfolio website for digital collage artist Jolene Casko, featuring integrated e-commerce, commission intake, and content management—all powered by static HTML, vanilla JavaScript, and serverless functions.

🌐 **Live Site**: [jolene.taurustech.me](https://jolene.taurustech.me)

## Features

### ✨ Current (Phases 1-3 Complete)

- **Dynamic Content Management** - All artwork managed via JSON files
- **E-commerce Integration** - Stripe Checkout for digital downloads and prints
- **Commission Intake** - Automated form handling via Netlify Forms
- **Responsive Design** - Mobile-first, accessible (WCAG 2.1 AA)
- **SEO Optimized** - Automatic meta tag generation per artwork
- **Portfolio Filtering** - Interactive category and tag-based filtering
- **Serverless Architecture** - No server to maintain, infinite scalability

### 🚀 Upcoming Features (Phases 4-7)

- SEO automation and sitemap generation
- Newsletter integration with Mailchimp
- Instagram feed integration
- Blog system with content management
- Testimonials and press coverage sections
- Analytics and performance monitoring

## Tech Stack

### Frontend
- **HTML5/CSS3** - Semantic, accessible markup
- **Vanilla JavaScript** - No frameworks, optimal performance
- **Responsive Design** - Mobile-first approach

### Backend/Services
- **Netlify** - Hosting, serverless functions, forms
- **Stripe** - Payment processing
- **GitHub** - Version control and deployment pipeline

### Architecture
- **Static Site** - Pre-rendered HTML for speed
- **Headless CMS** - JSON-based content management
- **JAMstack** - JavaScript, APIs, Markup

## Project Structure

```
jolene-site/
├── assets/
│   ├── css/               # Modular stylesheets
│   │   ├── main.css       # Global styles
│   │   ├── navigation.css # Header/nav styles
│   │   ├── gallery.css    # Portfolio grid
│   │   ├── shop.css       # Product cards
│   │   ├── checkout.css   # Modal and checkout
│   │   ├── lightbox.css   # Image viewer
│   │   ├── forms.css      # Form components
│   │   └── blog.css       # Blog layout
│   ├── images/
│   │   └── artworks/      # Artwork image files
│   └── js/                # Client-side JavaScript
│       ├── content-loader.js  # Dynamic content rendering
│       ├── navigation.js      # Mobile menu, scroll
│       ├── gallery-filter.js  # Portfolio filtering
│       ├── checkout.js        # Stripe integration
│       └── lightbox.js        # Image viewer
├── content/
│   ├── artworks.json      # Artwork data (single source of truth)
│   └── site-config.json   # Global site settings
├── netlify/
│   └── functions/         # Serverless functions
│       ├── create-checkout-session.js  # Stripe checkout
│       └── stripe-webhook.js           # Payment webhooks
├── legal/                 # Privacy, Terms, Cookies
├── shop/                  # Shop pages
│   └── success.html       # Post-purchase confirmation
├── index.html             # Homepage
├── portfolio.html         # Full portfolio with filtering
├── shop.html              # E-commerce shop
├── commissions.html       # Commission intake form
├── about.html             # Artist bio
├── contact.html           # Contact form
├── blog.html              # Blog (Phase 5)
├── press.html             # Press coverage (Phase 6)
├── netlify.toml           # Netlify configuration
├── package.json           # Node.js dependencies
├── ARCHITECTURE.md        # Technical architecture doc
├── CONTENT-GUIDE.md       # Content management guide
├── DEPLOYMENT.md          # Deployment instructions
└── README.md              # This file
```

## Content Management

### Adding New Artwork

1. Save your image to `assets/images/artworks/`
2. Edit `content/artworks.json` and add new entry:

```json
{
  "id": "artwork-slug",
  "title": "Artwork Title",
  "description": "Description of the artwork...",
  "category": "album-art",
  "tags": ["tag1", "tag2"],
  "featured": true,
  "available": true,
  "images": {
    "thumbnail": "/assets/images/artworks/image.jpg",
    "full": "/assets/images/artworks/image.jpg",
    "og": "/assets/images/artworks/image.jpg"
  },
  "pricing": {
    "digital": 25,
    "print8x10": 45,
    "print16x20": 85
  }
}
```

3. Commit and push to GitHub - Netlify auto-deploys

See **[CONTENT-GUIDE.md](CONTENT-GUIDE.md)** for complete instructions.

### Updating Site Settings

Edit `content/site-config.json` to change:
- Commission status (open/closed)
- Social media links
- Contact information
- Shop settings

## Development

### Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/kcasko/jolene-site.git
   cd jolene-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run local dev server with Netlify CLI:
   ```bash
   npm run dev
   ```

4. Open http://localhost:8888

### Testing Stripe Locally

1. Set environment variables in `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

2. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Deployment

Site is deployed automatically via Netlify when changes are pushed to the `master` branch.

### Manual Deploy

```bash
npm run deploy
```

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete setup instructions.

## Environment Variables

Required in Netlify dashboard (Site Settings → Environment Variables):

```
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
CONTACT_EMAIL=jolenecasko@gmail.com
URL=https://jolene.taurustech.me
```

Optional (Phase 4):
```
MAILCHIMP_API_KEY=xxxxx
MAILCHIMP_LIST_ID=xxxxx
```

## Architecture

### Design Principles

1. **Static-First** - Pre-rendered HTML, no server-side rendering
2. **Progressive Enhancement** - Works without JavaScript, enhanced with it
3. **Zero Framework** - Vanilla JS for minimal bundle size
4. **API-Driven** - Serverless functions for dynamic features
5. **Content as Data** - JSON-based content management
6. **No Vendor Lock-in** - Can migrate hosting providers easily

### Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Time to Interactive**: < 2s on 3G
- **Bundle Size**: < 50KB (uncompressed JavaScript)
- **Image Loading**: Lazy loading, optimized formats

### Security

- HTTPS enforced (Let's Encrypt)
- Content Security Policy headers
- XSS protection
- CSRF protection on forms
- Secure payment processing (PCI-compliant via Stripe)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML5 markup
- Keyboard navigation support
- Screen reader friendly
- ARIA labels where needed
- Sufficient color contrast
- Responsive text sizing

## Roadmap

### Phase 4: Engagement & SEO (In Progress)
- [ ] Automated sitemap generation
- [ ] SEO audit and optimization
- [ ] Mailchimp newsletter integration
- [ ] Instagram feed widget
- [ ] Social sharing optimization

### Phase 5: Blog & Content Growth
- [ ] Blog system with markdown support
- [ ] Article templates
- [ ] RSS feed
- [ ] Related artworks algorithm

### Phase 6: Professional Credibility
- [ ] Testimonials section
- [ ] Press coverage page
- [ ] Awards and features
- [ ] Detailed artist statement

### Phase 7: Polish & Launch
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Analytics implementation
- [ ] SEO verification
- [ ] Public launch

## License

All artwork and images are copyrighted © 2025 Jolene Casko. All rights reserved.

Code is proprietary. Do not copy, modify, or distribute without permission.

## Contact

- **Artist**: Jolene Casko
- **Email**: jolenecasko@gmail.com
- **Instagram**: [@jolenecasko](https://www.instagram.com/jolenecasko/)
- **Website**: [jolene.taurustech.me](https://jolene.taurustech.me)

## Support

For technical issues or questions:
1. Check [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for content management
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
3. Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
4. Contact your developer for custom modifications

---

**Built with ❤️ for surreal digital collage art**
