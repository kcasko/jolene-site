// Commission Form Handler - Basic validation and submission
// Full Stripe integration and email notifications will be added in Phase 3

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initCommissionForm);

    function initCommissionForm() {
        const form = document.getElementById('commission-form');
        if (!form) return;

        form.addEventListener('submit', handleSubmit);

        // Add real-time validation
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
        });
    }

    function handleSubmit(e) {
        // Netlify Forms will handle the actual submission
        // This is just for client-side validation and UX

        const form = e.target;
        const submitButton = form.querySelector('.form-submit');

        // Validate all fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Please fill out all required fields correctly.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Netlify will handle the rest
        // After submission, user will see Netlify's success page
        // In Phase 3, we'll add custom success handling and email notifications
    }

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return true;

        // Remove previous error
        formGroup.classList.remove('error');
        const existingError = formGroup.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Check validity
        if (field.hasAttribute('required') && !field.value.trim()) {
            showError(formGroup, 'This field is required');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showError(formGroup, 'Please enter a valid email address');
                return false;
            }
        }

        return true;
    }

    function showError(formGroup, message) {
        formGroup.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'form-error';
        errorSpan.textContent = message;
        formGroup.appendChild(errorSpan);
    }

})();
