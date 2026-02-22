/**
 * Contact Form component - Form validation and submission
 * @module components/ContactForm
 */

import { $, $$, on, createElement } from '../utils/dom.js';
import { announceToScreenReader } from '../utils/dom.js';
import { isValidEmail, isValidPhone, isRequired } from '../utils/validators.js';
import { log, LogLevel } from '../utils/logger.js';

export class ContactForm {
  constructor(selector = '#contactForm') {
    this.form = $(selector);
    if (!this.form) {
      log('Contact form not found', LogLevel.WARN);
      return;
    }

    this.inputs = $$('input, textarea, select', this.form);
    this.submitBtn = $('button[type="submit"]', this.form);

    this.init();
  }

  /**
   * Initialize form
   */
  init() {
    this.setupValidation();
    this.setupSubmission();
    log('Contact form initialized', LogLevel.SUCCESS);
  }

  /**
   * Setup real-time validation
   */
  setupValidation() {
    this.inputs.forEach(input => {
      // Add ARIA attributes
      if (input.hasAttribute('required')) {
        input.setAttribute('aria-required', 'true');
      }

      // Validate on blur
      on(input, 'blur', () => this.validateField(input));

      // Clear errors on input
      on(input, 'input', () => this.clearFieldError(input));
    });
  }

  /**
   * Setup form submission
   */
  setupSubmission() {
    on(this.form, 'submit', e => {
      e.preventDefault();

      if (!this.validateForm()) {
        return;
      }

      this.submitForm();
    });
  }

  /**
   * Validate single field
   * @param {HTMLElement} field - Field to validate
   * @returns {boolean}
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    this.clearFieldError(field);

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (!isRequired(value, 2)) {
          isValid = false;
          errorMessage = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!isRequired(value)) {
          isValid = false;
          errorMessage = 'Email is required';
        } else if (!isValidEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (value && !isValidPhone(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;

      case 'message':
        if (!isRequired(value, 10)) {
          isValid = false;
          errorMessage = 'Message must be at least 10 characters';
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  /**
   * Validate entire form
   * @returns {boolean}
   */
  validateForm() {
    const requiredFields = $$('[required]', this.form);
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Show field error
   * @param {HTMLElement} field - Field element
   * @param {string} message - Error message
   */
  showFieldError(field, message) {
    const errorDiv = createElement(
      'div',
      {
        className: 'field-error',
        role: 'alert',
        'aria-live': 'polite',
      },
      message
    );

    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    field.parentNode.appendChild(errorDiv);

    announceToScreenReader(`Error in ${field.name}: ${message}`);
  }

  /**
   * Clear field error
   * @param {HTMLElement} field - Field element
   */
  clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');

    const errorDiv = $('.field-error', field.parentNode);
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  /**
   * Submit form
   */
  async submitForm() {
    const formData = new FormData(this.form);
    const originalText = this.submitBtn.textContent;

    // Show loading state
    this.submitBtn.textContent = 'Sending...';
    this.submitBtn.disabled = true;
    this.submitBtn.setAttribute('aria-busy', 'true');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      this.showNotification(
        'Thank you for your message! We will get back to you within 24 hours.',
        'success'
      );
      this.form.reset();

      // Track submission
      this.trackFormSubmission(formData);
    } catch (error) {
      this.showNotification('An error occurred. Please try again.', 'error');
      log(`Form submission error: ${error.message}`, LogLevel.ERROR);
    } finally {
      this.submitBtn.textContent = originalText;
      this.submitBtn.disabled = false;
      this.submitBtn.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   */
  showNotification(message, type = 'info') {
    const colors = {
      success: '#27ae60',
      error: '#e74c3c',
      info: '#3498db',
    };

    const notification = createElement(
      'div',
      {
        className: `notification notification-${type}`,
        style: `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 2rem;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          background: ${colors[type] || colors.info};
        `,
      },
      message
    );

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Track form submission for analytics
   * @param {FormData} formData - Form data
   */
  trackFormSubmission(formData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'Contact',
        event_label: 'Contact Form',
      });
    }
  }
}
