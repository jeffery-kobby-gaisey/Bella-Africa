/**
 * Scroll Animations component - Intersection Observer based animations
 * @module components/ScrollAnimations
 */

import { $$, on } from '../utils/dom.js';
import { log, LogLevel } from '../utils/logger.js';

export class ScrollAnimations {
  constructor() {
    this.sections = $$('.section');
    this.counters = $$('.stat-number, .impact-number');
    this.hasAnimated = new WeakSet();

    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.init();
  }

  /**
   * Initialize scroll animations
   */
  init() {
    if (!('IntersectionObserver' in window)) {
      log('IntersectionObserver not supported', LogLevel.WARN);
      return;
    }

    this.initSectionObserver();
    log('Scroll animations initialized', LogLevel.SUCCESS);
  }

  /**
   * Initialize section observer
   */
  initSectionObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Trigger counter animation if section has counters
          if (entry.target.classList.contains('about') && !this.hasAnimated.has(entry.target)) {
            this.animateCounters();
            this.hasAnimated.add(entry.target);
          }
        }
      });
    }, this.observerOptions);

    this.sections.forEach(section => observer.observe(section));
  }

  /**
   * Animate counter numbers
   */
  animateCounters() {
    this.counters.forEach(counter => {
      const text = counter.textContent;
      const number = parseInt(text.replace(/[^\d]/g, ''));
      const suffix = text.replace(/[\d]/g, '');

      if (isNaN(number)) return;

      const duration = 2000;
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      const increment = number / totalFrames;

      let currentFrame = 0;

      const animate = () => {
        currentFrame++;
        const currentValue = Math.min(Math.floor(increment * currentFrame), number);
        counter.textContent = currentValue.toLocaleString() + suffix;

        if (currentFrame < totalFrames) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }
}
