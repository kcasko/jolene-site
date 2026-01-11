/**
 * Testimonials Component
 *
 * Loads and displays client testimonials from testimonials.json
 * Works on homepage, about page, and dedicated testimonials section
 */

(function() {
  'use strict';

  let testimonialsData = null;

  /**
   * Initialize testimonials
   */
  async function init() {
    try {
      await loadTestimonialsData();

      // Render testimonials on different pages
      const testimonialsContainer = document.querySelector('.testimonials-section');
      if (testimonialsContainer) {
        renderTestimonials(testimonialsContainer);
      }

      const testimonialsCarousel = document.querySelector('.testimonials-carousel');
      if (testimonialsCarousel) {
        renderCarousel(testimonialsCarousel);
      }
    } catch (error) {
      console.error('Testimonials loader error:', error);
    }
  }

  /**
   * Load testimonials data
   */
  async function loadTestimonialsData() {
    const response = await fetch('/content/testimonials.json');
    if (!response.ok) throw new Error('Failed to load testimonials');
    const data = await response.json();
    testimonialsData = data;
    window.testimonialsData = data;
    return data;
  }

  /**
   * Render testimonials grid
   */
  function renderTestimonials(container) {
    if (!testimonialsData || !testimonialsData.testimonials) return;

    const testimonials = testimonialsData.testimonials;

    container.innerHTML = `
      <h2>What Clients Say</h2>
      <div class="testimonials-grid">
        ${testimonials.map(t => createTestimonialCard(t)).join('')}
      </div>
    `;
  }

  /**
   * Render testimonials carousel (for homepage)
   */
  function renderCarousel(container) {
    if (!testimonialsData || !testimonialsData.testimonials) return;

    // Show only featured testimonials
    const featured = testimonialsData.testimonials.filter(t => t.featured);

    if (featured.length === 0) return;

    container.innerHTML = `
      <div class="testimonials-carousel-inner">
        ${featured.map((t, index) => createCarouselSlide(t, index)).join('')}
      </div>
      ${featured.length > 1 ? `
        <div class="carousel-controls">
          <button class="carousel-prev" aria-label="Previous testimonial">‹</button>
          <div class="carousel-dots">
            ${featured.map((_, i) => `
              <button class="carousel-dot ${i === 0 ? 'active' : ''}"
                      data-slide="${i}"
                      aria-label="Go to testimonial ${i + 1}"></button>
            `).join('')}
          </div>
          <button class="carousel-next" aria-label="Next testimonial">›</button>
        </div>
      ` : ''}
    `;

    // Initialize carousel if multiple slides
    if (featured.length > 1) {
      initializeCarousel(container, featured.length);
    }
  }

  /**
   * Create testimonial card
   */
  function createTestimonialCard(testimonial) {
    const stars = '★'.repeat(testimonial.rating);
    const date = new Date(testimonial.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });

    return `
      <div class="testimonial-card ${testimonial.featured ? 'featured' : ''}">
        ${testimonial.projectImage ? `
          <div class="testimonial-project-image">
            <img src="${testimonial.projectImage}"
                 alt="${testimonial.project}"
                 loading="lazy">
          </div>
        ` : ''}
        <div class="testimonial-content">
          <div class="testimonial-stars">${stars}</div>
          <blockquote class="testimonial-quote">
            "${testimonial.quote}"
          </blockquote>
          <div class="testimonial-author">
            ${testimonial.image ? `
              <img src="${testimonial.image.url}"
                   alt="${testimonial.image.alt}"
                   class="testimonial-avatar">
            ` : ''}
            <div class="testimonial-author-info">
              <div class="testimonial-client">${testimonial.client}</div>
              <div class="testimonial-role">${testimonial.role}</div>
              <div class="testimonial-project">${testimonial.project}</div>
            </div>
          </div>
          <div class="testimonial-date">${date}</div>
        </div>
      </div>
    `;
  }

  /**
   * Create carousel slide
   */
  function createCarouselSlide(testimonial, index) {
    const stars = '★'.repeat(testimonial.rating);

    return `
      <div class="carousel-slide ${index === 0 ? 'active' : ''}"
           data-slide="${index}">
        <div class="carousel-quote-mark">"</div>
        <blockquote class="carousel-quote">
          ${testimonial.quote}
        </blockquote>
        <div class="carousel-stars">${stars}</div>
        <div class="carousel-author">
          <div class="carousel-client">${testimonial.client}</div>
          <div class="carousel-role">${testimonial.role}</div>
          <div class="carousel-project">${testimonial.project}</div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize carousel controls
   */
  function initializeCarousel(container, slideCount) {
    let currentSlide = 0;

    const slides = container.querySelectorAll('.carousel-slide');
    const dots = container.querySelectorAll('.carousel-dot');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');

    function showSlide(index) {
      // Wrap around
      if (index >= slideCount) index = 0;
      if (index < 0) index = slideCount - 1;

      currentSlide = index;

      // Update slides
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
      });

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    // Previous button
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });

    // Next button
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
      });
    });

    // Auto-advance every 8 seconds
    setInterval(() => {
      showSlide(currentSlide + 1);
    }, 8000);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
