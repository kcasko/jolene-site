// Content Loader - Dynamically renders artwork from JSON
// This eliminates the need to edit HTML when adding new artwork

(function() {
    'use strict';

    let artworkData = null;
    let siteConfig = null;

    // Initialize content loading
    document.addEventListener('DOMContentLoaded', initContentLoader);

    async function initContentLoader() {
        try {
            // Load data files
            await Promise.all([
                loadArtworkData(),
                loadSiteConfig()
            ]);

            // Determine which page we're on and render appropriate content
            const currentPage = getCurrentPage();

            switch(currentPage) {
                case 'index':
                    renderHomepageContent();
                    break;
                case 'portfolio':
                    renderPortfolioContent();
                    break;
                case 'shop':
                    renderShopContent();
                    break;
            }

            // Update SEO metadata on all pages
            updateSEOMetadata();

        } catch (error) {
            console.error('Error loading content:', error);
            showLoadingError();
        }
    }

    async function loadArtworkData() {
        try {
            const response = await fetch('/content/artworks.json');
            if (!response.ok) throw new Error('Failed to load artwork data');
            const data = await response.json();
            artworkData = data;
            return data;
        } catch (error) {
            console.error('Error loading artworks:', error);
            throw error;
        }
    }

    async function loadSiteConfig() {
        try {
            const response = await fetch('/content/site-config.json');
            if (!response.ok) throw new Error('Failed to load site config');
            const data = await response.json();
            siteConfig = data;
            return data;
        } catch (error) {
            console.error('Error loading config:', error);
            throw error;
        }
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    // ========================================
    // HOMEPAGE RENDERING
    // ========================================

    function renderHomepageContent() {
        const gallery = document.querySelector('.gallery');
        if (!gallery) return;

        // Clear existing content
        gallery.innerHTML = '';

        // Get featured artworks
        const featuredArtworks = artworkData.artworks.filter(art => art.featured);

        // Render each featured artwork
        featuredArtworks.forEach(artwork => {
            const card = createArtworkCard(artwork);
            gallery.appendChild(card);
        });

        console.log(`Homepage: Rendered ${featuredArtworks.length} featured artworks`);
    }

    // ========================================
    // PORTFOLIO RENDERING
    // ========================================

    function renderPortfolioContent() {
        const grid = document.querySelector('.artwork-grid');
        if (!grid) return;

        // Clear existing content
        grid.innerHTML = '';

        // Render all artworks
        artworkData.artworks.forEach(artwork => {
            const card = createPortfolioCard(artwork);
            grid.appendChild(card);
        });

        // Update filter counts
        updateFilterCounts();

        console.log(`Portfolio: Rendered ${artworkData.artworks.length} artworks`);
    }

    function createPortfolioCard(artwork) {
        const card = document.createElement('div');
        card.className = 'artwork-card' + (artwork.featured ? ' featured' : '');
        card.setAttribute('data-artwork-id', artwork.id);
        card.setAttribute('data-category', artwork.category);
        card.setAttribute('data-tags', artwork.tags.join(', '));
        card.setAttribute('data-description', artwork.description);
        card.setAttribute('data-date', formatDate(artwork.dateCreated));
        card.setAttribute('data-type', 'Digital Collage');
        card.setAttribute('data-available', artwork.available);
        card.setAttribute('tabindex', '0');

        // Add pricing data attributes
        if (artwork.pricing.digital) card.setAttribute('data-price-digital', artwork.pricing.digital);
        if (artwork.pricing.print8x10) card.setAttribute('data-price-print8x10', artwork.pricing.print8x10);
        if (artwork.pricing.print16x20) card.setAttribute('data-price-print16x20', artwork.pricing.print16x20);
        if (artwork.pricing.print24x36) card.setAttribute('data-price-print24x36', artwork.pricing.print24x36);

        card.innerHTML = `
            <div class="artwork-image-container">
                <img src="${artwork.images.thumbnail}"
                     alt="${artwork.seo.altText}"
                     class="artwork-image">
            </div>
            <div class="artwork-overlay">
                <div class="artwork-title">${artwork.title}</div>
                <div class="artwork-category">${getCategoryName(artwork.category)}</div>
                <div class="artwork-tags">
                    ${artwork.tags.map(tag => `<span class="artwork-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        return card;
    }

    // ========================================
    // SHOP RENDERING
    // ========================================

    function renderShopContent() {
        const grid = document.querySelector('.product-grid');
        if (!grid) return;

        // Clear existing content
        grid.innerHTML = '';

        // Render available artworks as products
        artworkData.artworks.forEach(artwork => {
            const card = createProductCard(artwork);
            grid.appendChild(card);
        });

        console.log(`Shop: Rendered ${artworkData.artworks.length} products`);
    }

    function createProductCard(artwork) {
        const article = document.createElement('article');
        article.className = 'product-card' + (artwork.available ? '' : ' sold-out');
        article.setAttribute('data-product-id', artwork.id);

        const badge = artwork.available
            ? (artwork.featured ? '<span class="product-badge featured">Featured</span>' : '')
            : '<span class="product-badge">Sold Out</span>';

        const priceOptions = generatePriceOptions(artwork.pricing);

        article.innerHTML = `
            <div class="product-image-container">
                ${badge}
                <img src="${artwork.images.thumbnail}"
                     alt="${artwork.title} print"
                     class="product-image">
            </div>
            <div class="product-info">
                <h2 class="product-title">${artwork.title}</h2>
                <div class="product-category">${getCategoryName(artwork.category)} • ${artwork.tags[0]}</div>
                <p class="product-description">${truncateText(artwork.description, 120)}</p>
                <div class="product-options">
                    ${priceOptions}
                </div>
                <div class="product-actions">
                    ${artwork.available
                        ? `<a href="#" class="btn-buy" data-product="${artwork.id}">Purchase</a>`
                        : `<button class="btn-buy" disabled>Sold Out</button>`
                    }
                </div>
            </div>
        `;

        return article;
    }

    function generatePriceOptions(pricing) {
        const options = [];

        if (pricing.digital) {
            options.push(`
                <div class="product-option">
                    <span class="option-label">Digital Download</span>
                    <span class="option-price">$${pricing.digital}</span>
                </div>
            `);
        }
        if (pricing.print8x10) {
            options.push(`
                <div class="product-option">
                    <span class="option-label">8"×10" Print</span>
                    <span class="option-price">$${pricing.print8x10}</span>
                </div>
            `);
        }
        if (pricing.print16x20) {
            options.push(`
                <div class="product-option">
                    <span class="option-label">16"×20" Print</span>
                    <span class="option-price">$${pricing.print16x20}</span>
                </div>
            `);
        }
        if (pricing.print24x36) {
            options.push(`
                <div class="product-option">
                    <span class="option-label">24"×36" Print</span>
                    <span class="option-price">$${pricing.print24x36}</span>
                </div>
            `);
        }

        return options.join('');
    }

    // ========================================
    // ARTWORK CARD (for homepage)
    // ========================================

    function createArtworkCard(artwork) {
        const div = document.createElement('div');
        div.className = 'gallery-item artwork-card' + (artwork.featured ? ' featured' : '');
        div.setAttribute('data-artwork-id', artwork.id);
        div.setAttribute('data-category', artwork.category);
        div.setAttribute('data-tags', artwork.tags.join(', '));
        div.setAttribute('data-description', artwork.description);
        div.setAttribute('data-date', formatDate(artwork.dateCreated));
        div.setAttribute('data-type', 'Digital Collage');
        div.setAttribute('data-available', artwork.available);

        // Add pricing data attributes
        if (artwork.pricing.digital) div.setAttribute('data-price-digital', artwork.pricing.digital);
        if (artwork.pricing.print8x10) div.setAttribute('data-price-print8x10', artwork.pricing.print8x10);
        if (artwork.pricing.print16x20) div.setAttribute('data-price-print16x20', artwork.pricing.print16x20);
        if (artwork.pricing.print24x36) div.setAttribute('data-price-print24x36', artwork.pricing.print24x36);

        div.innerHTML = `
            <img src="${artwork.images.thumbnail}"
                 alt="${artwork.seo.altText}"
                 class="artwork-image">
            <div class="gallery-caption artwork-overlay">
                <div class="artwork-title">${artwork.title}</div>
                <div class="artwork-category">${getCategoryName(artwork.category)}</div>
            </div>
        `;

        return div;
    }

    // ========================================
    // SEO METADATA
    // ========================================

    function updateSEOMetadata() {
        if (!siteConfig) return;

        const currentPage = getCurrentPage();

        // Update page-specific metadata
        // This is a basic implementation - can be expanded
        const metaTags = {
            'og:site_name': siteConfig.site.title,
            'twitter:site': siteConfig.seo.twitterHandle
        };

        Object.entries(metaTags).forEach(([property, content]) => {
            updateMetaTag(property, content);
        });
    }

    function updateMetaTag(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.querySelector(`meta[name="${property}"]`);
        }
        if (meta) {
            meta.setAttribute('content', content);
        }
    }

    // ========================================
    // FILTER COUNTS
    // ========================================

    function updateFilterCounts() {
        const filterButtons = document.querySelectorAll('.filter-button');

        filterButtons.forEach(button => {
            const filter = button.dataset.filter;
            const countEl = button.querySelector('.count');
            if (!countEl) return;

            let count = 0;

            if (filter === 'all') {
                count = artworkData.artworks.length;
            } else if (filter === 'featured') {
                count = artworkData.artworks.filter(art => art.featured).length;
            } else {
                count = artworkData.artworks.filter(art =>
                    art.category === filter || art.tags.includes(filter)
                ).length;
            }

            countEl.textContent = `(${count})`;
        });
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function getCategoryName(categorySlug) {
        if (!artworkData || !artworkData.categories) return categorySlug;
        return artworkData.categories[categorySlug]?.name || categorySlug;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    function showLoadingError() {
        const containers = ['.gallery', '.artwork-grid', '.product-grid'];

        containers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; color: #d9cbe5;">
                        <h3 style="color: #fffacd; margin-bottom: 15px;">Unable to Load Content</h3>
                        <p>There was an error loading artwork data. Please refresh the page or try again later.</p>
                    </div>
                `;
            }
        });
    }

    // Expose functions for external use
    window.contentLoader = {
        getArtworkData: () => artworkData,
        getSiteConfig: () => siteConfig,
        reload: initContentLoader
    };

})();
