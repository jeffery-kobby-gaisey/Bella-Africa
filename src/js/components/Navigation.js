/**
 * Navigation component - Handles mobile menu and navbar scroll behavior
 * @module components/Navigation
 */

import { $, $$, on, throttle } from '../utils/dom.js';
import { announceToScreenReader } from '../utils/dom.js';
import { log, LogLevel } from '../utils/logger.js';

export class Navigation {
  constructor() {
    this.navbar = $('#navbar');
    this.mobileMenuBtn = $('#mobile-menu');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav-link');

    this.isMenuOpen = false;
    this.lastScrollTop = 0;
    this.scrollThreshold = 100;
    this.scrollDelta = 10;

    this.init();
  }

  /**
   * Initialize navigation functionality
   */
  init() {
    if (!this.navbar) {
      log('Navbar element not found', LogLevel.WARN);
      return;
    }

    this.initMobileMenu();
    this.initScrollBehavior();
    log('Navigation initialized', LogLevel.SUCCESS);
  }

  /**
   * Initialize mobile menu functionality
   */
  initMobileMenu() {
    if (!this.mobileMenuBtn || !this.navMenu) {
      log('Mobile menu elements not found', LogLevel.WARN);
      return;
    }

    // Toggle menu on button click
    on(this.mobileMenuBtn, 'click', e => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      on(link, 'click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    on(document, 'click', e => {
      if (
        this.isMenuOpen &&
        !this.mobileMenuBtn.contains(e.target) &&
        !this.navMenu.contains(e.target)
      ) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    on(document, 'keydown', e => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Toggle mobile menu state
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // Update ARIA attributes
    this.mobileMenuBtn.setAttribute('aria-expanded', this.isMenuOpen.toString());

    // Toggle menu visibility
    this.navMenu.classList.toggle('active', this.isMenuOpen);
    this.navbar.classList.toggle('menu-open', this.isMenuOpen);

    // Animate hamburger icon
    this.animateHamburger(this.isMenuOpen);

    // Announce to screen readers
    announceToScreenReader(this.isMenuOpen ? 'Menu opened' : 'Menu closed');
  }

  /**
   * Close mobile menu
   */
  closeMenu() {
    if (!this.isMenuOpen) return;

    this.isMenuOpen = false;
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    this.navMenu.classList.remove('active');
    this.navbar.classList.remove('menu-open');
    this.animateHamburger(false);
  }

  /**
   * Animate hamburger menu icon
   * @param {boolean} isOpen - Whether menu is open
   */
  animateHamburger(isOpen) {
    const spans = $$('span', this.mobileMenuBtn);
    spans.forEach((span, index) => {
      if (isOpen) {
        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        span.style.transform = 'none';
        span.style.opacity = '1';
      }
    });
  }

  /**
   * Initialize scroll behavior (hide/show navbar)
   */
  initScrollBehavior() {
    const updateNavbar = throttle(() => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      // Don't hide navbar when mobile menu is open
      if (this.navbar.classList.contains('menu-open')) return;

      // Add/remove scrolled class for styling
      this.navbar.classList.toggle('scrolled', currentScroll > 50);

      // Hide/show navbar based on scroll direction
      if (currentScroll > this.scrollThreshold) {
        if (Math.abs(currentScroll - this.lastScrollTop) > this.scrollDelta) {
          this.navbar.classList.toggle('nav-hidden', currentScroll > this.lastScrollTop);
          this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
      } else {
        this.navbar.classList.remove('nav-hidden');
        this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      }
    }, 100);

    on(window, 'scroll', updateNavbar, { passive: true });
  }
}
