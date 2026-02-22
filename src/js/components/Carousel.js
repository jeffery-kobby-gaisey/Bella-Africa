/**
 * Carousel component - Hero image carousel with accessibility
 * @module components/Carousel
 */

import { $, $$, on } from '../utils/dom.js';
import { announceToScreenReader } from '../utils/dom.js';
import { log, LogLevel } from '../utils/logger.js';

export class Carousel {
  constructor(selector = '.carousel') {
    this.carousel = $(selector);
    if (!this.carousel) return;

    this.slides = $$('.carousel-slide', this.carousel);
    this.prevBtn = $('.carousel-prev', this.carousel);
    this.nextBtn = $('.carousel-next', this.carousel);

    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000;

    this.touchStartX = 0;
    this.touchEndX = 0;

    if (this.totalSlides === 0) {
      log('No carousel slides found', LogLevel.WARN);
      return;
    }

    this.init();
  }

  /**
   * Initialize carousel
   */
  init() {
    this.showSlide(this.currentSlide);
    this.initControls();
    this.initKeyboard();
    this.initTouch();
    this.initAutoSlide();
    log('Carousel initialized', LogLevel.SUCCESS);
  }

  /**
   * Show specific slide
   * @param {number} index - Slide index
   */
  showSlide(index) {
    this.slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', (!isActive).toString());
    });

    this.updateNavigation();

    // Announce to screen readers
    const currentSlideElement = this.slides[index];
    const altText = currentSlideElement.querySelector('img')?.alt || `Slide ${index + 1}`;
    announceToScreenReader(`Now showing: ${altText}`);
  }

  /**
   * Navigate to next slide
   */
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.showSlide(this.currentSlide);
  }

  /**
   * Navigate to previous slide
   */
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(this.currentSlide);
  }

  /**
   * Update navigation button labels
   */
  updateNavigation() {
    if (this.prevBtn) {
      const prevIndex = this.currentSlide === 0 ? this.totalSlides : this.currentSlide;
      this.prevBtn.setAttribute(
        'aria-label',
        `Previous image (${prevIndex} of ${this.totalSlides})`
      );
    }

    if (this.nextBtn) {
      const nextIndex =
        this.currentSlide === this.totalSlides - 1 ? 1 : this.currentSlide + 2;
      this.nextBtn.setAttribute(
        'aria-label',
        `Next image (${nextIndex} of ${this.totalSlides})`
      );
    }
  }

  /**
   * Initialize control buttons
   */
  initControls() {
    if (this.prevBtn) {
      on(this.prevBtn, 'click', e => {
        e.preventDefault();
        this.prevSlide();
        this.resetAutoSlide();
      });
    }

    if (this.nextBtn) {
      on(this.nextBtn, 'click', e => {
        e.preventDefault();
        this.nextSlide();
        this.resetAutoSlide();
      });
    }
  }

  /**
   * Initialize keyboard navigation
   */
  initKeyboard() {
    on(document, 'keydown', e => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
        this.resetAutoSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
        this.resetAutoSlide();
      }
    });
  }

  /**
   * Initialize touch/swipe support
   */
  initTouch() {
    on(this.carousel, 'touchstart', e => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    on(this.carousel, 'touchend', e => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }

  /**
   * Handle swipe gesture
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
      this.resetAutoSlide();
    }
  }

  /**
   * Initialize auto-slide functionality
   */
  initAutoSlide() {
    this.startAutoSlide();

    // Pause on hover/focus
    on(this.carousel, 'mouseenter', () => this.stopAutoSlide());
    on(this.carousel, 'mouseleave', () => this.startAutoSlide());
    on(this.carousel, 'focusin', () => this.stopAutoSlide());
    on(this.carousel, 'focusout', () => this.startAutoSlide());
  }

  /**
   * Start auto-slide
   */
  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
  }

  /**
   * Stop auto-slide
   */
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  /**
   * Reset auto-slide timer
   */
  resetAutoSlide() {
    this.stopAutoSlide();
    setTimeout(() => this.startAutoSlide(), 3000);
  }
}
