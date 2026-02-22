/**
 * Analytics service - Google Analytics and performance tracking
 * @module services/Analytics
 */

import { log, LogLevel, logPerformance } from '../utils/logger.js';

export class Analytics {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize analytics
   */
  init() {
    this.trackPerformance();
    this.trackCoreWebVitals();
    this.isInitialized = true;
    log('Analytics initialized', LogLevel.SUCCESS);
  }

  /**
   * Track page performance
   */
  trackPerformance() {
    if (!('performance' in window)) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          logPerformance('Page Load Time', loadTime);

          // Send to Google Analytics if available
          this.trackEvent('performance', 'page_load', {
            value: Math.round(loadTime),
          });
        }
      }, 0);
    });
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logPerformance('LCP', lastEntry.renderTime || lastEntry.loadTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      log(`LCP observation failed: ${error.message}`, LogLevel.WARN);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          logPerformance('FID', entry.processingStart - entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      log(`FID observation failed: ${error.message}`, LogLevel.WARN);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsScore = 0;
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        }
        logPerformance('CLS', clsScore);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      log(`CLS observation failed: ${error.message}`, LogLevel.WARN);
    }
  }

  /**
   * Track custom event
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {Object} [params={}] - Additional parameters
   */
  trackEvent(category, action, params = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        ...params,
      });
    }
  }

  /**
   * Track page view
   * @param {string} path - Page path
   * @param {string} title - Page title
   */
  trackPageView(path, title) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title,
      });
    }
  }
}
