/**
 * Main application entry point
 * @module main
 */

import { Navigation } from './components/Navigation.js';
import { Carousel } from './components/Carousel.js';
import { ContactForm } from './components/ContactForm.js';
import { ScrollAnimations } from './components/ScrollAnimations.js';
import { ServiceWorkerManager } from './services/ServiceWorker.js';
import { Analytics } from './services/Analytics.js';
import { log, LogLevel, handleError } from './utils/logger.js';
import { on } from './utils/dom.js';

/**
 * Application class - Main application controller
 */
class BellaAfricaApp {
  constructor() {
    this.components = new Map();
    this.services = new Map();
  }

  /**
   * Initialize application
   */
  async init() {
    try {
      log('Initializing Bella Africa website...', LogLevel.INFO);

      // Initialize services
      await this.initServices();

      // Initialize components
      this.initComponents();

      // Setup global event listeners
      this.setupGlobalListeners();

      log('Website initialization completed', LogLevel.SUCCESS);
    } catch (error) {
      handleError(error, 'Application initialization');
    }
  }

  /**
   * Initialize services
   */
  async initServices() {
    // Service Worker
    const swManager = new ServiceWorkerManager();
    await swManager.register();
    this.services.set('serviceWorker', swManager);

    // Analytics
    const analytics = new Analytics();
    analytics.init();
    this.services.set('analytics', analytics);
  }

  /**
   * Initialize components
   */
  initComponents() {
    const componentConfigs = [
      { name: 'Navigation', Component: Navigation },
      { name: 'Carousel', Component: Carousel },
      { name: 'ContactForm', Component: ContactForm },
      { name: 'ScrollAnimations', Component: ScrollAnimations },
    ];

    componentConfigs.forEach(({ name, Component }) => {
      try {
        const instance = new Component();
        this.components.set(name, instance);
        log(`${name} initialized`, LogLevel.SUCCESS);
      } catch (error) {
        handleError(error, `${name} initialization`);
      }
    });
  }

  /**
   * Setup global event listeners
   */
  setupGlobalListeners() {
    // Smooth scrolling for anchor links
    this.initSmoothScrolling();

    // Keyboard navigation accessibility
    this.initKeyboardNavigation();

    // Image lazy loading fallback
    this.initLazyLoading();
  }

  /**
   * Initialize smooth scrolling
   */
  initSmoothScrolling() {
    on(document, 'click', e => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  }

  /**
   * Initialize keyboard navigation
   */
  initKeyboardNavigation() {
    on(document, 'keydown', e => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    on(document, 'mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 2px solid #2c5aa0;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize lazy loading for images
   */
  initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      log('IntersectionObserver not supported, skipping lazy loading', LogLevel.WARN);
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Get component instance
   * @param {string} name - Component name
   * @returns {Object|null}
   */
  getComponent(name) {
    return this.components.get(name) || null;
  }

  /**
   * Get service instance
   * @param {string} name - Service name
   * @returns {Object|null}
   */
  getService(name) {
    return this.services.get(name) || null;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bellaAfricaApp = new BellaAfricaApp();
    window.bellaAfricaApp.init();
  });
} else {
  window.bellaAfricaApp = new BellaAfricaApp();
  window.bellaAfricaApp.init();
}

export default BellaAfricaApp;
