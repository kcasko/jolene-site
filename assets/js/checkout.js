/**
 * Stripe Checkout Integration
 *
 * Handles the purchase flow for artwork:
 * 1. User clicks "Purchase" button
 * 2. Modal shows variant selection (digital/print sizes)
 * 3. Calls Netlify function to create Stripe session
 * 4. Redirects to Stripe Checkout
 */

(function() {
  'use strict';

  // State
  let selectedArtwork = null;

  /**
   * Initialize checkout functionality
   */
  function init() {
    // Add event listeners to all purchase buttons
    document.addEventListener('click', handlePurchaseClick);
  }

  /**
   * Handle click on purchase button
   */
  function handlePurchaseClick(e) {
    const purchaseBtn = e.target.closest('.btn-buy');
    if (!purchaseBtn) return;

    e.preventDefault();

    const productCard = purchaseBtn.closest('[data-product-id]');
    if (!productCard) {
      console.error('Product card not found');
      return;
    }

    const artworkId = productCard.dataset.productId;
    showVariantModal(artworkId);
  }

  /**
   * Show modal for selecting product variant
   */
  function showVariantModal(artworkId) {
    // Find artwork data
    if (!window.artworkData || !window.artworkData.artworks) {
      console.error('Artwork data not loaded');
      alert('Unable to load product information. Please refresh the page.');
      return;
    }

    const artwork = window.artworkData.artworks.find(art => art.id === artworkId);
    if (!artwork) {
      console.error('Artwork not found:', artworkId);
      return;
    }

    selectedArtwork = artwork;

    // Create modal HTML
    const modalHtml = `
      <div class="checkout-modal-overlay" id="checkoutModal">
        <div class="checkout-modal">
          <button class="modal-close" aria-label="Close">&times;</button>

          <div class="modal-header">
            <h2>${artwork.title}</h2>
            <p class="modal-subtitle">Select your preferred option</p>
          </div>

          <div class="modal-body">
            <div class="variant-options">
              ${buildVariantOptions(artwork)}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" id="modalCancel">Cancel</button>
          </div>
        </div>
      </div>
    `;

    // Insert modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Add event listeners
    const modal = document.getElementById('checkoutModal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = document.getElementById('modalCancel');
    const variantBtns = modal.querySelectorAll('.variant-option-btn');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    variantBtns.forEach(btn => {
      btn.addEventListener('click', () => handleVariantSelect(btn.dataset.variant));
    });
  }

  /**
   * Build HTML for variant options
   */
  function buildVariantOptions(artwork) {
    const variants = [];
    const variantInfo = {
      digital: { name: 'Digital Download', icon: '💾', desc: 'High-resolution file, instant delivery' },
      print8x10: { name: '8"×10" Print', icon: '🖼️', desc: 'Premium archival paper, shipped in 5-7 days' },
      print16x20: { name: '16"×20" Print', icon: '🖼️', desc: 'Premium archival paper, shipped in 5-7 days' },
      print24x36: { name: '24"×36" Print', icon: '🖼️', desc: 'Premium archival paper, shipped in 5-7 days' }
    };

    for (const [variant, price] of Object.entries(artwork.pricing)) {
      if (price === null || price === undefined) continue;

      const info = variantInfo[variant];
      variants.push(`
        <button class="variant-option-btn" data-variant="${variant}">
          <span class="variant-icon">${info.icon}</span>
          <div class="variant-details">
            <div class="variant-name">${info.name}</div>
            <div class="variant-desc">${info.desc}</div>
          </div>
          <div class="variant-price">$${price}</div>
        </button>
      `);
    }

    return variants.join('');
  }

  /**
   * Handle variant selection and initiate checkout
   */
  async function handleVariantSelect(variant) {
    if (!selectedArtwork) {
      console.error('No artwork selected');
      return;
    }

    // Show loading state
    const modal = document.getElementById('checkoutModal');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Redirecting to secure checkout...</p>
      </div>
    `;

    try {
      // Call Netlify function to create Stripe session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artworkId: selectedArtwork.id,
          variant: variant
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;

    } catch (error) {
      console.error('Checkout error:', error);

      modalBody.innerHTML = `
        <div class="error-state">
          <p class="error-message">⚠️ Unable to process checkout</p>
          <p class="error-details">${error.message}</p>
          <button class="btn-primary" onclick="location.reload()">Try Again</button>
        </div>
      `;
    }
  }

  /**
   * Close modal
   */
  function closeModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.remove();
    }
    selectedArtwork = null;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
