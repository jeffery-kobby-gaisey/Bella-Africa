// Performance and Error Handling Utilities
const DEBUG = false;

function log(message, type = 'info') {
    if (DEBUG) {
        console.log(`[Bella Africa] ${type.toUpperCase()}: ${message}`);
    }
}

function handleError(error, context) {
    log(`Error in ${context}: ${error.message}`, 'error');
    if (DEBUG) {
        console.error(error);
    }
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                log('ServiceWorker registration successful', 'success');
            })
            .catch(error => {
                log(`ServiceWorker registration failed: ${error}`, 'error');
            });
    });
}

// DOM Content Loaded with Error Handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        log('Initializing Bella Africa website...');
        
        // Initialize all functionality with error handling
        const initializers = [
            { name: 'Mobile Menu', fn: initMobileMenu },
            { name: 'Navbar Scroll', fn: initNavbarScroll },
            { name: 'Smooth Scrolling', fn: initSmoothScrolling },
            { name: 'Carousel', fn: initCarousel },
            { name: 'Gallery Slider', fn: initGallerySlider },
            { name: 'About Tabs', fn: initAboutTabs },
            { name: 'Scroll Animations', fn: initScrollAnimations },
            { name: 'Contact Form', fn: initContactForm },
            { name: 'Donation Buttons', fn: initDonationButtons }
        ];

        initializers.forEach(({ name, fn }) => {
            try {
                fn();
                log(`${name} initialized successfully`);
            } catch (error) {
                handleError(error, name);
            }
        });

        log('Website initialization completed');
        
        // Report Core Web Vitals
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    log(`Page load time: ${loadTime}ms`, 'performance');
                }, 0);
            });
        }
    } catch (error) {
        handleError(error, 'Main initialization');
    }
});

// Mobile Menu Toggle with Accessibility
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    if (!mobileMenu || !navMenu) {
        log('Mobile menu elements not found', 'warning');
        return;
    }

    mobileMenu.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        // Update ARIA attributes
        mobileMenu.setAttribute('aria-expanded', newState.toString());
        
        // Toggle menu visibility
        navMenu.classList.toggle('active');
        
        // Show navbar when mobile menu is open (disable hide on scroll)
        if (navbar && newState) {
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('menu-open');
        } else if (navbar) {
            navbar.classList.remove('menu-open');
        }
        
        // Animate hamburger menu
        const spans = mobileMenu.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (newState) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });

        // Announce menu state to screen readers
        const announcement = newState ? 'Menu opened' : 'Menu closed';
        announceToScreenReader(announcement);
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', 'false');
        const spans = mobileMenu.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
        // Remove menu-open class when closing
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.remove('menu-open');
        }
    }
}

// Screen reader announcement utility
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Navbar scroll effect with hide on scroll
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 100;
    let ticking = false;
    let scrollDelta = 10; // Minimum scroll distance to trigger hide/show
    
    function updateNavbar() {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        
        // Don't hide navbar when mobile menu is open
        if (navbar.classList.contains('menu-open')) {
            ticking = false;
            return;
        }
        
        // Add/remove scrolled class for styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Only process hide/show after passing threshold
        if (currentScroll > scrollThreshold) {
            // Check if scroll distance is significant enough
            if (Math.abs(currentScroll - lastScrollTop) > scrollDelta) {
                if (currentScroll > lastScrollTop) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('nav-hidden');
                } else {
                    // Scrolling up - show navbar
                    navbar.classList.remove('nav-hidden');
                }
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }
        } else {
            // At top of page - always show navbar
            navbar.classList.remove('nav-hidden');
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Carousel functionality with Accessibility
function initCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let autoSlideInterval;

    if (totalSlides === 0) {
        log('No carousel slides found', 'warning');
        return;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            const isActive = i === index;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', (!isActive).toString());
            
            // Update slide counter for screen readers
            const slideCounter = slide.querySelector('.slide-counter');
            if (slideCounter) {
                slideCounter.textContent = `Slide ${index + 1} of ${totalSlides}`;
            }
        });

        // Update navigation buttons
        updateCarouselNavigation();
        
        // Announce slide change to screen readers
        const currentSlideElement = slides[index];
        const altText = currentSlideElement.querySelector('img')?.alt || `Slide ${index + 1}`;
        announceToScreenReader(`Now showing: ${altText}`);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    function updateCarouselNavigation() {
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', `Previous image (${currentSlide === 0 ? totalSlides : currentSlide} of ${totalSlides})`);
        }
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', `Next image (${currentSlide === totalSlides - 1 ? 1 : currentSlide + 2} of ${totalSlides})`);
        }
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto-advance slides with pause on hover
    startAutoSlide();

    // Pause auto-slide on hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        carousel.addEventListener('focusin', stopAutoSlide);
        carousel.addEventListener('focusout', startAutoSlide);
    }

    // Navigation buttons
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000); // Resume after 3 seconds
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000); // Resume after 3 seconds
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        }
    }

    // Initialize first slide
    showSlide(currentSlide);
}

// Gallery Slider functionality
function initGallerySlider() {
    const track = document.querySelector('.gallery-track');
    const items = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const itemWidth = 300 + 16; // item width + margin
    const maxIndex = items.length - Math.floor(track.offsetWidth / itemWidth);
    let autoSlideInterval;

    function updateSlider() {
        const translateX = -currentIndex * itemWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }

    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            // Loop back to the beginning for continuous auto-slide
            currentIndex = 0;
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            // Loop to the end for continuous auto-slide
            currentIndex = maxIndex;
        }
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000); // Auto-slide every 4 seconds
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Manual navigation with auto-slide pause/resume
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide(); // Resume auto-slide after manual interaction
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide(); // Resume auto-slide after manual interaction
        });
    }

    // Touch/swipe support with auto-slide pause/resume
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide(); // Pause auto-slide on touch
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            nextSlide();
        } else if (endX - startX > 50) {
            prevSlide();
        }
        startAutoSlide(); // Resume auto-slide after touch interaction
    });

    // Pause auto-slide on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Initialize slider
    updateSlider();

    // Start auto-slide
    startAutoSlide();

    // Add lightbox functionality to gallery items
    items.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        setTimeout(updateSlider, 100);
    });
}

// About Tabs functionality
function initAboutTabs() {
    const tabButtons = document.querySelectorAll('.about-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.about-tabs .tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes in this section
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Updates Tabs functionality
    const updatesTabButtons = document.querySelectorAll('.updates-tabs .tab-btn');
    const updatesTabPanes = document.querySelectorAll('.updates-tabs .tab-pane');

    updatesTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes in updates section
            updatesTabButtons.forEach(btn => btn.classList.remove('active'));
            updatesTabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if it's a stats section
                if (entry.target.classList.contains('about')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .impact-number');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        
        if (isNaN(number)) return;
        
        const duration = 2000; // 2 seconds
        const step = number / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= number) {
                counter.textContent = number.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, 16);
    });
}

// Contact form handling with enhanced validation and accessibility
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        log('Contact form not found', 'warning');
        return;
    }

    // Add real-time validation and accessibility
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
        
        // Add ARIA attributes for better accessibility
        if (input.hasAttribute('required')) {
            input.setAttribute('aria-required', 'true');
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        
        // Simulate form submission with better UX
        setTimeout(() => {
            showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.setAttribute('aria-busy', 'false');
            
            // Track form submission for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            }
        }, 1500);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            if (!value) {
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
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    field.parentNode.appendChild(errorDiv);
    
    // Announce error to screen reader
    announceToScreenReader(`Error in ${field.name}: ${message}`);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
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
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Donation buttons functionality
function initDonationButtons() {
    const donationBtns = document.querySelectorAll('.donation-btn');
    const donateSecurelyBtn = document.querySelector('.donate-content .btn-primary');
    
    donationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            donationBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
        });
    });
    
    if (donateSecurelyBtn) {
        donateSecurelyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const activeBtn = document.querySelector('.donation-btn.active');
            const amount = activeBtn ? activeBtn.getAttribute('data-amount') : '25';
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = donateSecurelyBtn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            `;
            
            donateSecurelyBtn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Simulate donation redirect
            setTimeout(() => {
                showNotification(`Redirecting to secure donation page for $${amount}...`, 'success');
            }, 300);
        });
    }
}

// Add hover effect to glass cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        card.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
});

// Social media link tracking
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className;
            let platformName = '';
            
            if (platform.includes('facebook')) platformName = 'Facebook';
            else if (platform.includes('linkedin')) platformName = 'LinkedIn';
            else if (platform.includes('tiktok')) platformName = 'TikTok';
            
            showNotification(`Opening ${platformName} page...`, 'info');
            
            // In a real scenario, you would open the URL
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 1000);
        });
    });
});

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #2c5aa0;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardStyle);

// Lightbox functionality
function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox on click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Volunteer and Partnership Form Functions
function openVolunteerForm() {
    const formHTML = `
        <div class="modal-overlay" id="volunteerModal">
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Apply to Volunteer</h3>
                    <button class="modal-close" onclick="closeModal('volunteerModal')">&times;</button>
                </div>
                <form id="volunteerForm">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Phone Number">
                    </div>
                    <div class="form-group">
                        <select name="volunteerType" required>
                            <option value="">Select Volunteer Type</option>
                            <option value="field">Field Work in Ghana</option>
                            <option value="remote">Remote Support</option>
                            <option value="training">Skills Training</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="Tell us about your skills and why you want to volunteer" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Application</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    document.getElementById('volunteerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for your volunteer application! We will contact you soon.', 'success');
        closeModal('volunteerModal');
    });
}

function openPartnershipForm() {
    const formHTML = `
        <div class="modal-overlay" id="partnershipModal">
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Partnership Inquiry</h3>
                    <button class="modal-close" onclick="closeModal('partnershipModal')">&times;</button>
                </div>
                <form id="partnershipForm">
                    <div class="form-group">
                        <input type="text" name="organization" placeholder="Organization Name" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="contact" placeholder="Contact Person" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <select name="partnershipType" required>
                            <option value="">Select Partnership Type</option>
                            <option value="corporate">Corporate Partnership</option>
                            <option value="ngo">NGO Collaboration</option>
                            <option value="academic">Academic Partnership</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea name="proposal" placeholder="Describe your partnership proposal" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Proposal</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    document.getElementById('partnershipForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for your partnership inquiry! We will review and respond soon.', 'success');
        closeModal('partnershipModal');
    });
}

function openNewsletterSignup() {
    const formHTML = `
        <div class="modal-overlay" id="newsletterModal">
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Stay Updated</h3>
                    <button class="modal-close" onclick="closeModal('newsletterModal')">&times;</button>
                </div>
                <form id="newsletterForm">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="updates" checked>
                            Receive project updates and success stories
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="volunteer">
                            Notify me about volunteer opportunities
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary">Subscribe</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for subscribing! You will receive updates about Bella Africa.', 'success');
        closeModal('newsletterModal');
    });
}

function openVideoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <div class="modal-header">
                <h3><i class="fas fa-play-circle"></i> Bella Africa Story</h3>
                <button class="modal-close" onclick="closeModal('videoModal')">&times;</button>
            </div>
            <div class="video-container">
                <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/SH1gXEJ3GvA?autoplay=1" 
                    title="Bella Africa - School Renovation Project" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            <div class="video-description">
                <h4>School Renovation Project</h4>
                <p>Watch how Bella Africa renovated schools in rural Ghana to create better learning environments for children.</p>
            </div>
        </div>
    `;
    modal.id = 'videoModal';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('videoModal');
        }
    });
}

function openCustomDonation() {
    const formHTML = `
        <div class="modal-overlay" id="customDonationModal">
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Custom Donation</h3>
                    <button class="modal-close" onclick="closeModal('customDonationModal')">&times;</button>
                </div>
                <form id="customDonationForm">
                    <div class="form-group">
                        <label for="custom-amount">Donation Amount ($) *</label>
                        <input type="number" id="custom-amount" name="amount" min="1" step="1" required placeholder="Enter amount">
                    </div>
                    <div class="form-group">
                        <label for="donation-purpose">Purpose (Optional)</label>
                        <select id="donation-purpose" name="purpose">
                            <option value="">General Support</option>
                            <option value="sewing">Sewing Machine Initiative</option>
                            <option value="education">School Renovation</option>
                            <option value="cassava">Cassava Processing</option>
                            <option value="medical">Medical Assistance</option>
                            <option value="shelter">Shelter Support</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="donor-name">Your Name (Optional)</label>
                        <input type="text" id="donor-name" name="name" placeholder="Anonymous">
                    </div>
                    <div class="form-group">
                        <label for="donor-email">Email Address (Optional)</label>
                        <input type="email" id="donor-email" name="email" placeholder="For donation receipt">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="anonymous" checked>
                            Make this donation anonymous
                        </label>
                    </div>
                    <div class="form-actions">
                        <a href="https://www.paypal.com/donate/?hosted_button_id=DPHU82NS86SSL" target="_blank" class="btn btn-primary">
                            <i class="fas fa-heart"></i> Donate via PayPal
                        </a>
                        <button type="button" class="btn btn-outline" onclick="closeModal('customDonationModal')">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    document.getElementById('customDonationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = document.getElementById('custom-amount').value;
        const purpose = document.getElementById('donation-purpose').value;
        
        // Redirect to PayPal with custom amount
        let paypalUrl = 'https://www.paypal.com/donate/?hosted_button_id=DPHU82NS86SSL';
        if (amount) {
            paypalUrl += `&amount=${amount}`;
        }
        
        showNotification(`Thank you for your $${amount} donation! Redirecting to PayPal...`, 'success');
        setTimeout(() => {
            window.open(paypalUrl, '_blank');
            closeModal('customDonationModal');
        }, 1500);
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function showMoMoDetails() {
    const modalHTML = `
        <div class="modal-overlay" id="momoModal">
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3><i class="fas fa-mobile-alt"></i> MTN Mobile Money (MoMo)</h3>
                    <button class="modal-close" onclick="closeModal('momoModal')">&times;</button>
                </div>
                <div class="momo-details">
                    <div class="momo-info">
                        <div class="momo-number">
                            <h4>MTN Mobile Money Number:</h4>
                            <div class="phone-display">
                                <i class="fas fa-phone"></i>
                                <span class="phone-number">0538 790 779</span>
                                <button class="copy-btn" onclick="copyToClipboard('0538 790 779')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                        <div class="momo-instructions">
                            <h4>How to Send Money:</h4>
                            <ol>
                                <li>Dial <strong>*170#</strong> on your phone</li>
                                <li>Select <strong>Option 1 .
                                .
                                00000</strong> (Send Money)</li>
                                <li>Enter the number: <strong>0538 790 779</strong></li>
                                <li>Enter the amount you wish to donate</li>
                                <li>Enter your MoMo PIN to confirm</li>
                                <li>You'll receive a confirmation message</li>
                            </ol>
                        </div>
                        <div class="momo-note">
                            <p><i class="fas fa-info-circle"></i> <strong>Note:</strong> Please include your name in the reference/description when sending money so we can acknowledge your donation.</p>
                        </div>
                    </div>
                    <div class="momo-actions">
                        <button class="btn btn-primary" onclick="copyToClipboard('0538 790 779')">
                            <i class="fas fa-copy"></i> Copy Number
                        </button>
                        <button class="btn btn-secondary" onclick="closeModal('momoModal')">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    const modal = document.getElementById('momoModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('momoModal');
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Number copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Number copied to clipboard!', 'success');
    });
}

// Lightbox close functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightboxClose = document.querySelector('.lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            closeLightbox();
        });
    }
});

// Console log for successful loading
console.log('Bella Africa website loaded successfully! 🌍❤️'); 



const images = [
  "images/12.png",
  "images/13.png",
  "images/14.png",
  "images/15.png"
];

let index = 0;
const section = document.getElementById("charity-partners");

function changeBackground() {
  section.style.backgroundImage = `url('${images[index]}')`;
  index = (index + 1) % images.length;
}

changeBackground();
setInterval(changeBackground, 3000); // change every 3s