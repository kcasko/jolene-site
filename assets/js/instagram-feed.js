/**
 * Instagram Feed Integration
 *
 * Displays recent Instagram posts
 * Uses Instagram Basic Display API or falls back to static display
 *
 * Note: Instagram Basic Display API requires:
 * 1. Facebook Developer account
 * 2. Instagram Business/Creator account
 * 3. Access token (long-lived, 60 days)
 *
 * For now, this provides the structure. Full implementation requires:
 * - Setting up Instagram Basic Display API
 * - Creating serverless function to handle token refresh
 * - Storing tokens securely in environment variables
 */

(function() {
  'use strict';

  const INSTAGRAM_HANDLE = 'jolenecasko';
  const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

  /**
   * Initialize Instagram feed
   */
  async function init() {
    const feedContainer = document.querySelector('.instagram-feed');
    if (!feedContainer) return;

    try {
      // Try to load from API
      await loadFromAPI(feedContainer);
    } catch (error) {
      console.log('Instagram API not configured, using fallback');
      loadFallback(feedContainer);
    }
  }

  /**
   * Load Instagram posts from API
   */
  async function loadFromAPI(container) {
    // Check if serverless function is available
    const response = await fetch('/.netlify/functions/instagram-feed');

    if (!response.ok) {
      throw new Error('Instagram API not available');
    }

    const data = await response.json();

    if (!data.posts || data.posts.length === 0) {
      throw new Error('No posts available');
    }

    renderPosts(container, data.posts);
  }

  /**
   * Fallback: Show static Instagram link
   */
  function loadFallback(container) {
    container.innerHTML = `
      <div class="instagram-fallback">
        <div class="instagram-header">
          <span class="instagram-icon">📸</span>
          <h3>Follow on Instagram</h3>
        </div>
        <p>See my latest artwork and works in progress</p>
        <a href="${INSTAGRAM_URL}"
           target="_blank"
           rel="noopener noreferrer"
           class="instagram-follow-button">
          @${INSTAGRAM_HANDLE}
        </a>
        <div class="instagram-preview-grid">
          ${generatePlaceholderPosts()}
        </div>
      </div>
    `;
  }

  /**
   * Render Instagram posts
   */
  function renderPosts(container, posts) {
    const postsHTML = posts.slice(0, 6).map(post => `
      <a href="${post.permalink}"
         target="_blank"
         rel="noopener noreferrer"
         class="instagram-post">
        <img src="${post.thumbnail || post.media_url}"
             alt="${post.caption ? post.caption.substring(0, 100) : 'Instagram post'}"
             loading="lazy">
        <div class="instagram-post-overlay">
          <span class="instagram-likes">❤️ ${formatNumber(post.like_count)}</span>
          <span class="instagram-comments">💬 ${formatNumber(post.comments_count)}</span>
        </div>
      </a>
    `).join('');

    container.innerHTML = `
      <div class="instagram-header">
        <span class="instagram-icon">📸</span>
        <h3>Latest from Instagram</h3>
        <a href="${INSTAGRAM_URL}"
           target="_blank"
           rel="noopener noreferrer"
           class="instagram-follow-link">
          @${INSTAGRAM_HANDLE}
        </a>
      </div>
      <div class="instagram-grid">
        ${postsHTML}
      </div>
      <a href="${INSTAGRAM_URL}"
         target="_blank"
         rel="noopener noreferrer"
         class="instagram-view-more">
        View More on Instagram →
      </a>
    `;
  }

  /**
   * Generate placeholder posts for fallback
   */
  function generatePlaceholderPosts() {
    // You can replace these with actual recent post URLs
    // Or leave as placeholders linking to Instagram profile
    return Array(6).fill(0).map(() => `
      <a href="${INSTAGRAM_URL}"
         target="_blank"
         rel="noopener noreferrer"
         class="instagram-placeholder">
        <div class="instagram-placeholder-content">
          <span>🎨</span>
        </div>
      </a>
    `).join('');
  }

  /**
   * Format numbers with K/M suffix
   */
  function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
