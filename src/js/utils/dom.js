/**
 * DOM utility functions
 * @module utils/dom
 */

/**
 * Safely query a single element
 * @param {string} selector - CSS selector
 * @param {Element} [parent=document] - Parent element to query from
 * @returns {Element|null}
 */
export const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Safely query multiple elements
 * @param {string} selector - CSS selector
 * @param {Element} [parent=document] - Parent element to query from
 * @returns {NodeList}
 */
export const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} [options] - Event listener options
 * @returns {Function} Cleanup function
 */
export const on = (element, event, handler, options = {}) => {
  if (!element) return () => {};
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} [attrs={}] - Element attributes
 * @param {Array|string} [children=[]] - Child elements or text
 * @returns {Element}
 */
export const createElement = (tag, attrs = {}, children = []) => {
  const element = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on')) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });

  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      element.appendChild(child);
    }
  });

  return element;
};

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} [priority='polite'] - ARIA live priority
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = createElement('div', {
    'aria-live': priority,
    'aria-atomic': 'true',
    style: 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden',
  }, message);

  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean}
 */
export const isInViewport = element => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
