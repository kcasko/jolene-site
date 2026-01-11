/**
 * Netlify Serverless Function: Generate Dynamic Sitemap
 *
 * Generates sitemap.xml dynamically from artworks.json
 * This ensures search engines always have the latest artwork URLs
 *
 * URL: /.netlify/functions/generate-sitemap
 */

const artworks = require('../../content/artworks.json');

exports.handler = async (event, context) => {
  const baseUrl = process.env.URL || 'https://jolene.taurustech.me';
  const today = new Date().toISOString().split('T')[0];

  // Static pages with priorities
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/portfolio.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/shop.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/about.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/commissions.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact.html', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog.html', priority: '0.7', changefreq: 'weekly' },
    { url: '/press.html', priority: '0.6', changefreq: 'monthly' },
  ];

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add dynamic artwork pages (for future individual artwork pages)
  artworks.artworks.forEach(artwork => {
    if (artwork.available) {
      xml += `  <url>
    <loc>${baseUrl}/artwork/${artwork.slug}</loc>
    <lastmod>${artwork.dateCreated || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${baseUrl}${artwork.images.full}</image:loc>
      <image:title>${artwork.title}</image:title>
      <image:caption>${artwork.seo.altText}</image:caption>
    </image:image>
  </url>
`;
    }
  });

  xml += `</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    },
    body: xml
  };
};
