/**
 * Blog Content Loader
 *
 * Dynamically loads and renders blog posts from blog-posts.json
 * Handles blog listing page and individual post pages
 */

(function() {
  'use strict';

  let blogData = null;

  /**
   * Initialize blog loader
   */
  async function init() {
    try {
      await loadBlogData();

      const path = window.location.pathname;

      if (path.includes('blog.html') || path.endsWith('/blog')) {
        renderBlogListing();
      } else if (path.includes('/blog/')) {
        renderBlogPost();
      }
    } catch (error) {
      console.error('Blog loader error:', error);
      showError();
    }
  }

  /**
   * Load blog posts data
   */
  async function loadBlogData() {
    const response = await fetch('/content/blog-posts.json');
    if (!response.ok) throw new Error('Failed to load blog data');
    const data = await response.json();
    blogData = data;
    window.blogData = data; // Make available globally
    return data;
  }

  /**
   * Render blog listing page
   */
  function renderBlogListing() {
    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!blogData || !blogData.posts || blogData.posts.length === 0) {
      grid.innerHTML = `
        <div class="blog-empty">
          <h2>No Posts Yet</h2>
          <p>Check back soon for articles about the creative process and artistic inspiration.</p>
        </div>
      `;
      return;
    }

    // Sort by date (newest first)
    const sortedPosts = [...blogData.posts].sort((a, b) =>
      new Date(b.datePublished) - new Date(a.datePublished)
    );

    sortedPosts.forEach(post => {
      const card = createBlogCard(post);
      grid.appendChild(card);
    });
  }

  /**
   * Create blog post card
   */
  function createBlogCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-post-card';
    if (post.featured) article.classList.add('featured');

    const date = formatDate(post.datePublished);

    article.innerHTML = `
      ${post.image ? `
        <a href="blog/${post.slug}.html" class="blog-featured-image-link">
          <img src="${post.image.url}"
               alt="${post.image.alt}"
               class="blog-featured-image"
               loading="lazy">
        </a>
      ` : ''}
      <div class="blog-post-content">
        <div class="blog-post-meta">
          <span class="blog-post-date">📅 ${date}</span>
          ${post.readTime ? `<span class="blog-post-read-time">⏱️ ${post.readTime} min read</span>` : ''}
          ${post.category ? `<span class="blog-post-category">${post.category}</span>` : ''}
        </div>
        <h2 class="blog-post-title">
          <a href="blog/${post.slug}.html">${post.title}</a>
        </h2>
        <p class="blog-post-excerpt">${post.excerpt}</p>
        ${post.tags && post.tags.length > 0 ? `
          <div class="blog-post-tags">
            ${post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        <a href="blog/${post.slug}.html" class="blog-read-more">
          Read More →
        </a>
      </div>
    `;

    return article;
  }

  /**
   * Render individual blog post page
   */
  function renderBlogPost() {
    const slug = window.location.pathname.split('/').pop().replace('.html', '');
    const post = blogData.posts.find(p => p.slug === slug);

    if (!post) {
      window.location.href = '/blog.html';
      return;
    }

    // Update page title and meta
    document.title = post.seo.metaTitle || `${post.title} - Jolene Casko`;
    updateMetaTags(post);

    // Render post content
    const main = document.querySelector('#main-content .container');
    if (!main) return;

    const date = formatDate(post.datePublished);

    main.innerHTML = `
      <article class="blog-post-single">
        <header class="blog-post-header">
          <div class="blog-post-meta">
            <span class="blog-post-date">📅 ${date}</span>
            ${post.readTime ? `<span class="blog-post-read-time">⏱️ ${post.readTime} min read</span>` : ''}
            ${post.category ? `<span class="blog-post-category">${post.category}</span>` : ''}
          </div>
          <h1 class="blog-post-title">${post.title}</h1>
          <p class="blog-post-author">By ${post.author}</p>
        </header>

        ${post.image ? `
          <div class="blog-post-featured-image">
            <img src="${post.image.url}" alt="${post.image.alt}">
          </div>
        ` : ''}

        <div class="blog-post-body">
          ${formatPostContent(post.content)}
        </div>

        ${post.tags && post.tags.length > 0 ? `
          <footer class="blog-post-footer">
            <div class="blog-post-tags">
              ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
          </footer>
        ` : ''}

        <div class="blog-post-share">
          <h3>Share this post</h3>
          <div class="share-buttons">
            <a href="${getShareUrl('twitter', post)}" target="_blank" rel="noopener" class="share-button share-twitter">
              Twitter
            </a>
            <a href="${getShareUrl('facebook', post)}" target="_blank" rel="noopener" class="share-button share-facebook">
              Facebook
            </a>
            <a href="${getShareUrl('linkedin', post)}" target="_blank" rel="noopener" class="share-button share-linkedin">
              LinkedIn
            </a>
            <a href="${getShareUrl('email', post)}" class="share-button share-email">
              Email
            </a>
          </div>
        </div>

        <div class="blog-post-nav">
          <a href="/blog.html" class="back-to-blog">← Back to Blog</a>
        </div>
      </article>
    `;

    // Render related posts if available
    renderRelatedPosts(post);
  }

  /**
   * Format post content (convert line breaks to paragraphs)
   */
  function formatPostContent(content) {
    return content
      .split('\n\n')
      .filter(para => para.trim())
      .map(para => `<p>${para.trim()}</p>`)
      .join('\n');
  }

  /**
   * Update meta tags for SEO
   */
  function updateMetaTags(post) {
    // Update or create meta tags
    updateOrCreateMeta('description', post.seo.metaDescription);
    updateOrCreateMeta('og:title', post.seo.metaTitle, 'property');
    updateOrCreateMeta('og:description', post.seo.metaDescription, 'property');
    updateOrCreateMeta('og:type', 'article', 'property');

    if (post.image) {
      updateOrCreateMeta('og:image', post.image.url, 'property');
    }

    updateOrCreateMeta('twitter:title', post.seo.metaTitle, 'name');
    updateOrCreateMeta('twitter:description', post.seo.metaDescription, 'name');

    if (post.image) {
      updateOrCreateMeta('twitter:image', post.image.url, 'name');
    }
  }

  /**
   * Update or create meta tag
   */
  function updateOrCreateMeta(key, value, attribute = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, key);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', value);
  }

  /**
   * Render related posts
   */
  function renderRelatedPosts(currentPost) {
    const related = blogData.posts
      .filter(p => p.id !== currentPost.id)
      .filter(p => p.tags.some(tag => currentPost.tags.includes(tag)))
      .slice(0, 3);

    if (related.length === 0) return;

    const main = document.querySelector('#main-content .container');
    const relatedSection = document.createElement('section');
    relatedSection.className = 'related-posts-section';
    relatedSection.innerHTML = `
      <h2>Related Posts</h2>
      <div class="related-posts-grid">
        ${related.map(post => `
          <article class="related-post-card">
            <a href="/blog/${post.slug}.html">
              <h3>${post.title}</h3>
              <p>${post.excerpt}</p>
            </a>
          </article>
        `).join('')}
      </div>
    `;
    main.appendChild(relatedSection);
  }

  /**
   * Get share URL for different platforms
   */
  function getShareUrl(platform, post) {
    const url = encodeURIComponent(`${window.location.origin}/blog/${post.slug}.html`);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=jolenecasko`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`
    };

    return urls[platform] || url;
  }

  /**
   * Format date
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Show error message
   */
  function showError() {
    const grid = document.querySelector('.blog-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="blog-error">
          <p>Unable to load blog posts. Please try again later.</p>
        </div>
      `;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
