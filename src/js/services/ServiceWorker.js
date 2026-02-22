/**
 * Service Worker registration and management
 * @module services/ServiceWorker
 */

import { log, LogLevel } from '../utils/logger.js';

export class ServiceWorkerManager {
  constructor(swPath = '/sw.js') {
    this.swPath = swPath;
    this.registration = null;
  }

  /**
   * Register service worker
   * @returns {Promise<ServiceWorkerRegistration|null>}
   */
  async register() {
    if (!('serviceWorker' in navigator)) {
      log('Service Worker not supported', LogLevel.WARN);
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(this.swPath);
      log('Service Worker registered successfully', LogLevel.SUCCESS);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.notifyUpdate();
          }
        });
      });

      return this.registration;
    } catch (error) {
      log(`Service Worker registration failed: ${error.message}`, LogLevel.ERROR);
      return null;
    }
  }

  /**
   * Notify user of available update
   */
  notifyUpdate() {
    if (confirm('A new version is available. Reload to update?')) {
      window.location.reload();
    }
  }

  /**
   * Unregister service worker
   * @returns {Promise<boolean>}
   */
  async unregister() {
    if (!this.registration) return false;

    try {
      const success = await this.registration.unregister();
      log('Service Worker unregistered', LogLevel.INFO);
      return success;
    } catch (error) {
      log(`Service Worker unregistration failed: ${error.message}`, LogLevel.ERROR);
      return false;
    }
  }
}
