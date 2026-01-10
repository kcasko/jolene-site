// Portfolio Gallery Filter System

(function() {
    'use strict';

    let artworkData = [];
    let activeFilter = 'all';

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', initGallery);

    function initGallery() {
        const filterButtons = document.querySelectorAll('.filter-button');

        // Set up filter button listeners
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });

        // Keyboard navigation for filters
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) {
            filterControls.addEventListener('keydown', handleFilterKeyboard);
        }

        // Initialize with 'all' filter active
        setActiveFilter('all');
    }

    function handleFilterClick(e) {
        const button = e.currentTarget;
        const filter = button.dataset.filter;

        setActiveFilter(filter);
        filterArtwork(filter);
    }

    function handleFilterKeyboard(e) {
        const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
        const currentIndex = filterButtons.indexOf(document.activeElement);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % filterButtons.length;
            filterButtons[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + filterButtons.length) % filterButtons.length;
            filterButtons[prevIndex].focus();
        }
    }

    function setActiveFilter(filter) {
        activeFilter = filter;

        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            if (button.dataset.filter === filter) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    function filterArtwork(filter) {
        const artworkCards = document.querySelectorAll('.artwork-card');
        let visibleCount = 0;

        artworkCards.forEach(card => {
            const cardTags = (card.dataset.tags || '').split(',').map(t => t.trim());
            const cardCategory = card.dataset.category;

            let shouldShow = false;

            if (filter === 'all') {
                shouldShow = true;
            } else if (filter === 'featured') {
                shouldShow = card.classList.contains('featured');
            } else {
                // Check if filter matches category or any tag
                shouldShow = cardCategory === filter || cardTags.includes(filter);
            }

            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.animation = `fadeIn 0.5s ease ${visibleCount * 0.05}s both`;
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Update filter counts
        updateFilterCounts();

        // Show empty state if no results
        showEmptyState(visibleCount === 0);

        // Announce to screen readers
        announceFilterResults(visibleCount, filter);
    }

    function updateFilterCounts() {
        const filterButtons = document.querySelectorAll('.filter-button');
        const artworkCards = document.querySelectorAll('.artwork-card');

        filterButtons.forEach(button => {
            const filter = button.dataset.filter;
            const countEl = button.querySelector('.count');

            if (!countEl) return;

            let count = 0;

            if (filter === 'all') {
                count = artworkCards.length;
            } else if (filter === 'featured') {
                count = document.querySelectorAll('.artwork-card.featured').length;
            } else {
                artworkCards.forEach(card => {
                    const cardTags = (card.dataset.tags || '').split(',').map(t => t.trim());
                    const cardCategory = card.dataset.category;

                    if (cardCategory === filter || cardTags.includes(filter)) {
                        count++;
                    }
                });
            }

            countEl.textContent = `(${count})`;
        });
    }

    function showEmptyState(show) {
        let emptyState = document.querySelector('.gallery-empty');

        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'gallery-empty';
            emptyState.innerHTML = `
                <p>No artwork found for this filter.</p>
                <p>Try selecting a different category.</p>
            `;
            const grid = document.querySelector('.artwork-grid');
            if (grid) {
                grid.parentNode.insertBefore(emptyState, grid.nextSibling);
            }
        } else if (!show && emptyState) {
            emptyState.remove();
        }
    }

    function announceFilterResults(count, filter) {
        // Create or update screen reader announcement
        let announcer = document.getElementById('filter-announcer');

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'filter-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }

        const filterName = filter === 'all' ? 'all artwork' : filter;
        announcer.textContent = `Showing ${count} ${count === 1 ? 'piece' : 'pieces'} in ${filterName}`;
    }

    // Expose filter function globally for external use
    window.portfolioFilter = {
        filter: filterArtwork,
        setActive: setActiveFilter,
        updateCounts: updateFilterCounts
    };

})();

// Add CSS for screen reader only content
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);
