/**
 * Validation utility functions
 * @module utils/validators
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = phone => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {number} [minLength=1] - Minimum length
 * @returns {boolean}
 */
export const isRequired = (value, minLength = 1) => {
  return value && value.trim().length >= minLength;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidUrl = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string}
 */
export const sanitizeHtml = html => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
