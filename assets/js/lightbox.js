// Lightbox Modal System - Full artwork viewer with navigation

(function() {
    'use strict';

    let currentIndex = 0;
    let artworkItems = [];
    let lightboxOverlay = null;

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', initLightbox);

    function initLightbox() {
        // Create lightbox HTML structure
        createLightboxStructure();

        // Get reference to overlay
        lightboxOverlay = document.getElementById('artwork-lightbox');

        // Set up event listeners
        setupEventListeners();

        // Set up artwork card clicks
        document.addEventListener('click', handleArtworkClick);
    }

    function createLightboxStructure() {
        const lightboxHTML = `
            <div id="artwork-lightbox" class="lightbox-overlay" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
                <div class="lightbox-container">
                    <div class="lightbox-content">
                        <button class="lightbox-close" aria-label="Close lightbox">✕</button>

                        <div class="lightbox-image-section">
                            <img id="lightbox-image" class="lightbox-image" src="" alt="" />
                            <button class="lightbox-nav lightbox-prev" aria-label="Previous artwork">‹</button>
                            <button class="lightbox-nav lightbox-next" aria-label="Next artwork">›</button>
                        </div>

                        <div class="lightbox-info">
                            <div class="lightbox-header">
                                <h2 id="lightbox-title"></h2>
                                <div class="lightbox-category"></div>
                                <div class="lightbox-tags"></div>
                            </div>

                            <div class="lightbox-description"></div>

                            <div class="lightbox-metadata">
                                <div class="metadata-item">
                                    <span class="metadata-label">Created</span>
                                    <span class="metadata-value" id="lightbox-date"></span>
                                </div>
                                <div class="metadata-item">
                                    <span class="metadata-label">Type</span>
                                    <span class="metadata-value" id="lightbox-type"></span>
                                </div>
                            </div>

                            <div class="lightbox-purchase">
                                <div id="lightbox-availability"></div>
                                <h3 class="purchase-title">Available Options</h3>
                                <div class="purchase-options" id="lightbox-options"></div>
                                <div class="purchase-actions">
                                    <button class="btn-primary" id="lightbox-buy-btn">Purchase</button>
                                    <button class="btn-secondary" id="lightbox-commission-btn">Commission Similar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    function setupEventListeners() {
        const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
        const prevBtn = lightboxOverlay.querySelector('.lightbox-prev');
        const nextBtn = lightboxOverlay.querySelector('.lightbox-next');
        const buyBtn = lightboxOverlay.querySelector('#lightbox-buy-btn');
        const commissionBtn = lightboxOverlay.querySelector('#lightbox-commission-btn');

        // Close button
        closeBtn.addEventListener('click', closeLightbox);

        // Navigation buttons
        prevBtn.addEventListener('click', showPrevious);
        nextBtn.addEventListener('click', showNext);

        // Purchase buttons
        buyBtn.addEventListener('click', handlePurchase);
        commissionBtn.addEventListener('click', () => {
            window.location.href = 'commissions.html';
        });

        // Click outside to close
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    function handleArtworkClick(e) {
        const artworkCard = e.target.closest('.artwork-card');
        if (!artworkCard) return;

        e.preventDefault();

        // Get all visible artwork cards
        artworkItems = Array.from(document.querySelectorAll('.artwork-card:not(.hidden)'));

        // Find index of clicked card
        currentIndex = artworkItems.indexOf(artworkCard);

        // Open lightbox
        openLightbox();
    }

    function openLightbox() {
        updateLightboxContent();
        lightboxOverlay.classList.add('active');
        document.body.classList.add('lightbox-open');

        // Focus close button for accessibility
        setTimeout(() => {
            const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
            closeBtn.focus();
        }, 100);
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.classList.remove('lightbox-open');

        // Return focus to clicked card if possible
        if (artworkItems[currentIndex]) {
            artworkItems[currentIndex].focus();
        }
    }

    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxContent();
        }
    }

    function showNext() {
        if (currentIndex < artworkItems.length - 1) {
            currentIndex++;
            updateLightboxContent();
        }
    }

    function updateLightboxContent() {
        if (!artworkItems[currentIndex]) return;

        const card = artworkItems[currentIndex];
        const image = card.querySelector('.artwork-image');
        const title = card.querySelector('.artwork-title')?.textContent || 'Untitled';
        const category = card.querySelector('.artwork-category')?.textContent || '';
        const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];

        // Update image
        const lightboxImage = lightboxOverlay.querySelector('#lightbox-image');
        lightboxImage.src = image.src.replace('-thumb', ''); // Use full-size image
        lightboxImage.alt = image.alt;

        // Update title and category
        lightboxOverlay.querySelector('#lightbox-title').textContent = title;
        lightboxOverlay.querySelector('.lightbox-category').textContent = category;

        // Update tags
        const tagsContainer = lightboxOverlay.querySelector('.lightbox-tags');
        tagsContainer.innerHTML = tags.map(tag =>
            `<span class="lightbox-tag">${tag.trim()}</span>`
        ).join('');

        // Update description (from data attribute or default)
        const description = card.dataset.description ||
            'A surreal digital collage inspired by music, poetry, and the emotions they stir.';
        lightboxOverlay.querySelector('.lightbox-description').textContent = description;

        // Update metadata
        const date = card.dataset.date || 'Recent';
        const type = card.dataset.type || 'Digital Collage';
        lightboxOverlay.querySelector('#lightbox-date').textContent = date;
        lightboxOverlay.querySelector('#lightbox-type').textContent = type;

        // Update availability
        const available = card.dataset.available !== 'false';
        const availabilityHTML = available ?
            '<span class="availability-badge available">Available for Purchase</span>' :
            '<span class="availability-badge sold-out">Sold Out</span>';
        lightboxOverlay.querySelector('#lightbox-availability').innerHTML = availabilityHTML;

        // Update purchase options
        updatePurchaseOptions(card);

        // Update navigation buttons
        updateNavButtons();

        // Update buy button state
        const buyBtn = lightboxOverlay.querySelector('#lightbox-buy-btn');
        if (available) {
            buyBtn.disabled = false;
            buyBtn.textContent = 'Purchase';
        } else {
            buyBtn.disabled = true;
            buyBtn.textContent = 'Sold Out';
        }
    }

    function updatePurchaseOptions(card) {
        const optionsContainer = lightboxOverlay.querySelector('#lightbox-options');

        // Parse pricing from data attributes
        const pricing = {
            digital: card.dataset.priceDigital,
            print8x10: card.dataset.pricePrint8x10,
            print16x20: card.dataset.pricePrint16x20,
            print24x36: card.dataset.pricePrint24x36
        };

        const options = [];

        if (pricing.digital) {
            options.push({ name: 'Digital Download', price: pricing.digital });
        }
        if (pricing.print8x10) {
            options.push({ name: 'Print 8"×10"', price: pricing.print8x10 });
        }
        if (pricing.print16x20) {
            options.push({ name: 'Print 16"×20"', price: pricing.print16x20 });
        }
        if (pricing.print24x36) {
            options.push({ name: 'Print 24"×36"', price: pricing.print24x36 });
        }

        if (options.length === 0) {
            optionsContainer.innerHTML = '<p style="color: #b8a9c9; font-style: italic;">Contact for pricing</p>';
        } else {
            optionsContainer.innerHTML = options.map(opt =>
                `<div class="purchase-option">
                    <span class="option-name">${opt.name}</span>
                    <span class="option-price">$${opt.price}</span>
                </div>`
            ).join('');
        }
    }

    function updateNavButtons() {
        const prevBtn = lightboxOverlay.querySelector('.lightbox-prev');
        const nextBtn = lightboxOverlay.querySelector('.lightbox-next');

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === artworkItems.length - 1;
    }

    function handlePurchase() {
        const card = artworkItems[currentIndex];
        const artworkId = card.dataset.artworkId;
        const title = card.querySelector('.artwork-title')?.textContent;

        // Redirect to shop page with artwork selected
        if (artworkId) {
            window.location.href = `shop.html?artwork=${artworkId}`;
        } else {
            // Fallback to general shop
            window.location.href = 'shop.html';
        }

        console.log('Purchase initiated for:', title);
    }

    function handleKeyboard(e) {
        if (!lightboxOverlay.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) showPrevious();
                break;
            case 'ArrowRight':
                if (currentIndex < artworkItems.length - 1) showNext();
                break;
        }
    }

    // Expose lightbox functions globally
    window.artworkLightbox = {
        open: openLightbox,
        close: closeLightbox,
        next: showNext,
        prev: showPrevious
    };

})();
