# Content Management Guide

This guide explains how to manage content on your portfolio site without touching HTML files.

## Overview

All artwork content is managed through a single JSON file: `content/artworks.json`. When you add, edit, or remove artwork in this file, the changes automatically appear across your entire site:

- **Homepage** - Featured artworks in the gallery
- **Portfolio Page** - Complete artwork grid with filtering
- **Shop Page** - Product cards with pricing

## Adding New Artwork

### Step 1: Prepare Your Image

1. Save your artwork image in `assets/images/artworks/`
2. Use a descriptive filename (e.g., `cosmic-ocean.jpg`)
3. Recommended size: 1200-2000px on the longest side
4. Format: JPG or PNG

### Step 2: Add Artwork Entry to JSON

Open `content/artworks.json` and add a new entry to the `artworks` array:

```json
{
  "id": "your-artwork-id",
  "title": "Your Artwork Title",
  "slug": "your-artwork-slug",
  "description": "A detailed description of your artwork...",
  "category": "album-art",
  "tags": ["album-art", "celestial", "commissioned"],
  "dateCreated": "2025-01-15",
  "featured": true,
  "available": true,
  "images": {
    "thumbnail": "/assets/images/artworks/your-image.jpg",
    "full": "/assets/images/artworks/your-image.jpg",
    "og": "/assets/images/artworks/your-image.jpg"
  },
  "pricing": {
    "digital": 25,
    "print8x10": 45,
    "print16x20": 85,
    "print24x36": null
  },
  "stripe": {
    "productId": "",
    "priceIds": {
      "digital": "",
      "print8x10": "",
      "print16x20": "",
      "print24x36": ""
    }
  },
  "seo": {
    "metaTitle": "Your Artwork - Surreal Digital Collage by Jolene Casko",
    "metaDescription": "Description for search engines and social media...",
    "altText": "Detailed description for screen readers and SEO..."
  }
}
```

### Step 3: Field Reference

#### Required Fields

- **id**: Unique identifier (lowercase, hyphens, no spaces)
- **title**: Display name of the artwork
- **slug**: URL-friendly version (usually same as id)
- **description**: Full description (shown on product/portfolio pages)
- **category**: Primary category (`album-art`, `collage`, `experimental`)
- **tags**: Array of tags for filtering
- **dateCreated**: ISO date format (YYYY-MM-DD)
- **featured**: Boolean - show on homepage? (true/false)
- **available**: Boolean - can it be purchased? (true/false)

#### Image Paths

All three image fields typically use the same path:
- **thumbnail**: Used in grid views
- **full**: Used in lightbox/detail views
- **og**: Used for social media sharing (Open Graph)

#### Pricing

Set prices for each format. Use `null` for unavailable sizes:
- **digital**: Digital download price
- **print8x10**: 8"×10" print price
- **print16x20**: 16"×20" print price
- **print24x36**: 24"×36" print price (or null if not offered)

#### Stripe Integration (Phase 3)

Leave these empty for now. They'll be populated when Stripe is integrated:
- **productId**: Stripe product ID
- **priceIds**: Object mapping size to Stripe price ID

#### SEO Metadata

Optimizes your artwork for search engines and social sharing:
- **metaTitle**: Page title for search results (include your name and "digital collage")
- **metaDescription**: Description for search snippets and social cards
- **altText**: Descriptive text for screen readers and image search

### Step 4: Commit Your Changes

After editing `artworks.json`, commit to Git:

```bash
git add content/artworks.json assets/images/artworks/your-image.jpg
git commit -m "Add new artwork: Your Artwork Title"
git push
```

The changes will automatically deploy to your live site.

## Editing Existing Artwork

1. Open `content/artworks.json`
2. Find the artwork entry by its `id`
3. Edit any field (title, description, pricing, etc.)
4. Save the file
5. Commit and push to deploy

## Removing Artwork

### Mark as Unavailable (Recommended)

Change `available` to `false`. The artwork will:
- Still appear in portfolio
- Show as "Sold Out" in shop
- Not be purchasable

```json
{
  "id": "artwork-name",
  "available": false,
  ...
}
```

### Remove Completely

Delete the entire JSON object from the `artworks` array. The artwork will disappear from all pages.

## Managing Featured Artwork

Featured artwork appears on the homepage. To feature/unfeature:

```json
{
  "id": "artwork-name",
  "featured": true,  // Show on homepage
  ...
}
```

Aim for 4-6 featured pieces to keep the homepage curated.

## Categories and Tags

### Available Categories

- `album-art` - Album Art
- `collage` - Collage
- `experimental` - Experimental

### Tag Best Practices

- Use lowercase, no special characters
- Be consistent (check existing tags first)
- Common tags: `celestial`, `nature`, `portrait`, `commissioned`, `abstract`, `vintage`, `flowers`, `ocean`, `music`
- Tags enable portfolio filtering

## SEO Optimization Tips

### Meta Titles
- Include artwork name + your name + "Digital Collage"
- Example: "Lunar Dreams - Surreal Digital Collage by Jolene Casko"
- Keep under 60 characters

### Meta Descriptions
- Write compelling 1-2 sentence description
- Include keywords: digital collage, surreal, album art
- Keep under 160 characters
- Example: "A dreamlike celestial collage featuring vintage portraiture surrounded by lunar phases. Commissioned album art blending cosmic wonder with emotional depth."

### Alt Text
- Describe what's visually in the image
- Help search engines and screen readers understand the content
- Be specific but concise
- Example: "Vintage portrait of a woman surrounded by multiple moon phases and stars against a dark cosmic background"

## Updating Site Configuration

Global site settings are in `content/site-config.json`:

### Commission Status

```json
{
  "commission": {
    "status": "open",              // or "closed"
    "statusText": "COMMISSIONS OPEN",
    "depositRequired": true,
    "depositPercentage": 50,
    "typicalTurnaround": "3-6 weeks"
  }
}
```

### Social Links

```json
{
  "social": {
    "instagram": "https://www.instagram.com/jolenecasko/",
    "behance": "https://www.behance.net/jolenecasko",
    ...
  }
}
```

## Testing Changes Locally

Before pushing to production:

1. Open the HTML files in your browser locally
2. Check that artwork appears correctly
3. Test portfolio filters
4. Verify pricing displays properly
5. Check console for JavaScript errors (F12 → Console)

## Troubleshooting

### Artwork not appearing

- Check JSON syntax (use JSONLint.com to validate)
- Verify image path is correct
- Check browser console for errors
- Ensure `available: true` if it should appear in shop

### Filters not working

- Verify `category` matches one of the valid categories
- Check that `tags` is an array: `["tag1", "tag2"]`
- Clear browser cache

### Images broken

- Verify image exists in `assets/images/artworks/`
- Check path starts with `/assets/` (absolute path)
- Ensure filename matches exactly (case-sensitive)

## Future Enhancements

**Phase 3** will add:
- Stripe integration for automated payments
- Automatic product/price creation in Stripe
- Shopping cart functionality

**Phase 4** will add:
- Automated Instagram feed of new artwork
- SEO sitemap generation
- Newsletter automation

Until then, the JSON-based system gives you complete control over your content with simple file edits.

## Quick Reference

### Add Artwork Checklist

- [ ] Save image to `assets/images/artworks/`
- [ ] Add entry to `content/artworks.json`
- [ ] Set `featured: true` if it should appear on homepage
- [ ] Set `available: true` if it's for sale
- [ ] Fill in pricing for available formats
- [ ] Write SEO metadata (title, description, alt text)
- [ ] Add relevant tags for filtering
- [ ] Validate JSON syntax
- [ ] Test locally
- [ ] Commit and push to deploy

### Common Tasks

| Task | File to Edit | Field |
|------|--------------|-------|
| Change price | `artworks.json` | `pricing.print8x10` |
| Mark sold out | `artworks.json` | `available: false` |
| Feature on homepage | `artworks.json` | `featured: true` |
| Close commissions | `site-config.json` | `commission.status: "closed"` |
| Update social link | `site-config.json` | `social.instagram` |

---

**Questions?** Refer to `ARCHITECTURE.md` for technical details or contact your developer.
