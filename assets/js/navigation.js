// Navigation System - Sticky header, mobile menu, scroll effects

(function() {
    'use strict';

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', initNavigation);

    function initNavigation() {
        const header = document.querySelector('.site-header');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect for header
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        // Mobile menu toggle
        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', () => {
                const isOpen = mainNav.classList.contains('mobile-open');

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
        }

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!e.target.closest('.site-header')) {
                    closeMenu();
                }
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
                closeMenu();
                mobileToggle.focus();
            }
        });

        // Set active link based on current page
        setActiveLink();

        // Update on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && mainNav.classList.contains('mobile-open')) {
                    closeMenu();
                }
            }, 250);
        });

        function openMenu() {
            mainNav.classList.add('mobile-open');
            mobileToggle.setAttribute('aria-expanded', 'true');
            mobileToggle.innerHTML = '✕';

            // Trap focus in menu
            const firstLink = mainNav.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }

        function closeMenu() {
            mainNav.classList.remove('mobile-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '☰';
        }

        function setActiveLink() {
            const currentPath = window.location.pathname;
            const fileName = currentPath.split('/').pop() || 'index.html';

            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');

                // Handle both root and file-based paths
                if (linkPath === fileName ||
                    (fileName === '' && linkPath === 'index.html') ||
                    (fileName === '/' && linkPath === 'index.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href').slice(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, `#${targetId}`);
    });

})();
