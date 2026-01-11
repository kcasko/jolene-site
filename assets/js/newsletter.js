/**
 * Newsletter Signup Component
 *
 * Handles newsletter subscription forms throughout the site
 */

(function() {
  'use strict';

  /**
   * Initialize newsletter forms
   */
  function init() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
      form.addEventListener('submit', handleSubmit);
    });
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const firstNameInput = form.querySelector('input[name="firstName"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = form.querySelector('.newsletter-message') || createMessageDiv(form);

    if (!emailInput || !emailInput.value) {
      showMessage(messageDiv, 'Please enter your email address', 'error');
      return;
    }

    // Disable form during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Subscribing...';

    try {
      const response = await fetch('/.netlify/functions/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailInput.value,
          firstName: firstNameInput ? firstNameInput.value : '',
          source: form.dataset.source || 'website'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage(messageDiv, data.message || 'Thank you for subscribing!', 'success');
        form.reset();

        // Track conversion (if analytics available)
        if (window.gtag) {
          gtag('event', 'newsletter_signup', {
            'event_category': 'engagement',
            'event_label': form.dataset.source || 'website'
          });
        }
      } else {
        showMessage(messageDiv, data.error || 'Subscription failed', 'error');
      }

    } catch (error) {
      console.error('Newsletter signup error:', error);
      showMessage(messageDiv, 'Something went wrong. Please try again.', 'error');
    } finally {
      // Re-enable form
      submitButton.disabled = false;
      submitButton.textContent = 'Subscribe';
    }
  }

  /**
   * Create message div if it doesn't exist
   */
  function createMessageDiv(form) {
    const div = document.createElement('div');
    div.className = 'newsletter-message';
    form.appendChild(div);
    return div;
  }

  /**
   * Show message to user
   */
  function showMessage(messageDiv, text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `newsletter-message newsletter-message-${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
