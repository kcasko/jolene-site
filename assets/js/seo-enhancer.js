/**
 * SEO Enhancer
 *
 * Automatically adds:
 * - JSON-LD structured data for Google Rich Results
 * - Enhanced Open Graph tags
 * - Twitter Card meta tags
 * - Schema.org markup for artworks
 */

(function() {
  'use strict';

  // Configuration
  const siteConfig = {
    name: 'Jolene Casko',
    url: 'https://jolene.taurustech.me',
    description: 'Surreal digital collages inspired by music, poetry, and emotion. Specializing in album art for musicians.',
    author: 'Jolene Casko',
    email: 'jolenecasko@gmail.com',
    social: {
      instagram: 'https://www.instagram.com/jolenecasko/',
      twitter: '@jolenecasko'
    }
  };

  /**
   * Initialize SEO enhancements
   */
  function init() {
    addOrganizationSchema();
    addBreadcrumbSchema();
    enhanceOpenGraph();
    addTwitterCards();

    // Add artwork-specific schema if on portfolio/shop
    if (window.artworkData && window.artworkData.artworks) {
      addArtworkCollectionSchema();
    }
  }

  /**
   * Add Organization Schema (JSON-LD)
   */
  function addOrganizationSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": siteConfig.name,
      "url": siteConfig.url,
      "email": siteConfig.email,
      "jobTitle": "Digital Collage Artist",
      "description": siteConfig.description,
      "sameAs": [
        siteConfig.social.instagram,
        "https://www.behance.net/jolenecasko",
        "https://foundation.app/@jolenecasko"
      ],
      "knowsAbout": [
        "Digital Collage",
        "Album Art",
        "Surreal Art",
        "Visual Art",
        "Graphic Design"
      ],
      "makesOffer": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Digital Collage Commission",
          "description": "Custom artwork for album covers, singles, and personal projects"
        }
      }
    };

    insertJsonLd(schema, 'organization-schema');
  }

  /**
   * Add Breadcrumb Schema
   */
  function addBreadcrumbSchema() {
    const path = window.location.pathname;
    const breadcrumbs = [];

    // Home
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteConfig.url
    });

    // Determine current page
    if (path.includes('portfolio')) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Portfolio",
        "item": `${siteConfig.url}/portfolio.html`
      });
    } else if (path.includes('shop')) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${siteConfig.url}/shop.html`
      });
    } else if (path.includes('commissions')) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Commissions",
        "item": `${siteConfig.url}/commissions.html`
      });
    } else if (path.includes('about')) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": `${siteConfig.url}/about.html`
      });
    }

    if (breadcrumbs.length > 1) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs
      };

      insertJsonLd(schema, 'breadcrumb-schema');
    }
  }

  /**
   * Add Artwork Collection Schema for Portfolio/Shop pages
   */
  function addArtworkCollectionSchema() {
    if (!window.artworkData) return;

    const artworks = window.artworkData.artworks.map(artwork => ({
      "@type": "CreativeWork",
      "@id": `${siteConfig.url}/artwork/${artwork.slug}`,
      "name": artwork.title,
      "description": artwork.description,
      "image": `${siteConfig.url}${artwork.images.full}`,
      "creator": {
        "@type": "Person",
        "name": siteConfig.name
      },
      "dateCreated": artwork.dateCreated,
      "genre": artwork.category,
      "keywords": artwork.tags.join(', '),
      "offers": artwork.available ? {
        "@type": "Offer",
        "price": artwork.pricing.digital || artwork.pricing.print8x10,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `${siteConfig.url}/shop.html`
      } : undefined
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Digital Collage Portfolio",
      "description": "Collection of surreal digital collages by Jolene Casko",
      "numberOfItems": artworks.length,
      "itemListElement": artworks.map((artwork, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": artwork
      }))
    };

    insertJsonLd(schema, 'artwork-collection-schema');
  }

  /**
   * Enhance Open Graph tags
   */
  function enhanceOpenGraph() {
    // Add missing OG tags
    ensureMetaTag('og:site_name', siteConfig.name);
    ensureMetaTag('og:locale', 'en_US');

    // Add article tags for blog posts (when implemented)
    if (window.location.pathname.includes('blog')) {
      ensureMetaTag('og:type', 'article');
      ensureMetaTag('article:author', siteConfig.name);
    }
  }

  /**
   * Add Twitter Card meta tags
   */
  function addTwitterCards() {
    ensureMetaTag('twitter:card', 'summary_large_image', 'name');
    ensureMetaTag('twitter:site', siteConfig.social.twitter, 'name');
    ensureMetaTag('twitter:creator', siteConfig.social.twitter, 'name');

    // Copy OG tags to Twitter if not set
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (ogTitle) ensureMetaTag('twitter:title', ogTitle.content, 'name');
    if (ogDesc) ensureMetaTag('twitter:description', ogDesc.content, 'name');
    if (ogImage) ensureMetaTag('twitter:image', ogImage.content, 'name');
  }

  /**
   * Insert JSON-LD script into page
   */
  function insertJsonLd(schema, id) {
    // Remove existing if present
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Ensure meta tag exists, create if missing
   */
  function ensureMetaTag(property, content, attribute = 'property') {
    let meta = document.querySelector(`meta[${attribute}="${property}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, property);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    } else if (!meta.content) {
      meta.setAttribute('content', content);
    }
  }

  /**
   * Generate social sharing URLs
   */
  window.generateShareUrl = function(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=jolenecasko`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=Check out this artwork: ${url}`
    };

    return urls[platform] || url;
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
