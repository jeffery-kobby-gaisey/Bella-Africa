# Bella Africa Website - Refactored & Modernized

> A modern, performant, and maintainable website for Bella Africa nonprofit organization.

## 🚀 What's New

This refactored version implements modern web development best practices:

- ✅ **ES6+ Modular JavaScript** - Clean, maintainable code architecture
- ✅ **CSS Custom Properties** - Consistent design system with variables
- ✅ **Performance Optimized** - Lazy loading, code splitting, Web Vitals tracking
- ✅ **Accessibility First** - WCAG 2.1 AA compliant
- ✅ **Modern Build Tools** - Vite for lightning-fast development
- ✅ **Type-Safe** - JSDoc comments for better IDE support
- ✅ **Production Ready** - Optimized builds with minification

## 📁 Project Structure

```
bella-africa-v2/
├── src/
│   ├── js/
│   │   ├── components/       # UI Components
│   │   │   ├── Navigation.js
│   │   │   ├── Carousel.js
│   │   │   ├── ContactForm.js
│   │   │   └── ScrollAnimations.js
│   │   ├── services/         # Business Logic
│   │   │   ├── ServiceWorker.js
│   │   │   └── Analytics.js
│   │   ├── utils/            # Utilities
│   │   │   ├── logger.js
│   │   │   ├── dom.js
│   │   │   └── validators.js
│   │   └── main.js           # Entry Point
│   └── css/
│       ├── variables.css     # Design Tokens
│       ├── base.css          # Base Styles
│       └── components/       # Component Styles
├── images/                   # Static Assets
├── *.html                    # HTML Pages
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 16+ and npm

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Alternative (No Build Tools)

If you prefer not to use build tools, you can still use the refactored code:

```html
<!-- Add to your HTML -->
<script type="module" src="src/js/main.js"></script>

<!-- Fallback for older browsers -->
<script nomodule src="script.js"></script>
```

## 📚 Component Usage

### Navigation

Handles mobile menu and navbar scroll behavior automatically.

```javascript
import { Navigation } from './components/Navigation.js';

const nav = new Navigation();
// Auto-initializes on construction
```

### Carousel

Hero image carousel with accessibility and touch support.

```javascript
import { Carousel } from './components/Carousel.js';

const carousel = new Carousel('.carousel');
// Supports keyboard, touch, and auto-slide
```

### Contact Form

Form validation and submission with real-time feedback.

```javascript
import { ContactForm } from './components/ContactForm.js';

const form = new ContactForm('#contactForm');
// Handles validation, submission, and error display
```

### Scroll Animations

Intersection Observer-based animations and counter effects.

```javascript
import { ScrollAnimations } from './components/ScrollAnimations.js';

const animations = new ScrollAnimations();
// Animates elements as they enter viewport
```

## 🎨 CSS Variables

All design tokens are centralized in `src/css/variables.css`:

```css
:root {
  --color-primary: #ff4757;
  --color-secondary: #2ed573;
  --spacing-md: 1rem;
  --radius-lg: 0.75rem;
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

Use them anywhere in your CSS:

```css
.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}
```

## 🔧 Configuration Files

### package.json
Defines project dependencies and scripts.

### vite.config.js
Build configuration for development and production.

### .eslintrc.json
Code quality rules and linting configuration.

### .prettierrc
Code formatting rules for consistency.

### .editorconfig
Editor settings for consistent code style.

## 📊 Performance Features

### Lazy Loading
Images load only when visible in viewport:

```html
<img data-src="image.jpg" alt="Description" class="lazy">
```

### Code Splitting
Modules loaded on-demand, reducing initial bundle size.

### Web Vitals Tracking
Monitors LCP, FID, and CLS for performance insights.

### Service Worker
Caches assets for offline functionality and faster loads.

## ♿ Accessibility Features

- **ARIA Labels** - Proper semantic markup
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Announcements for dynamic content
- **Focus Management** - Visible focus indicators
- **Reduced Motion** - Respects user preferences

## 🧪 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Type Checking
JSDoc comments provide type information:

```javascript
/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = email => { ... }
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed images
- Source maps for debugging

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 📖 Migration Guide

See [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) for detailed migration instructions.

### Quick Migration Steps

1. **Keep existing files** - Old code still works
2. **Add new structure** - Create `src/` directory
3. **Update HTML** - Add module script tag
4. **Test thoroughly** - Verify all functionality
5. **Remove old code** - Once confident in new version

## 🤝 Contributing

1. Follow existing code style
2. Run linter before committing
3. Add JSDoc comments for new functions
4. Test across browsers
5. Update documentation

## 📝 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Developer

**Jeffery Kobby Gaisey**

---

## 🆘 Troubleshooting

### Module not found errors
Ensure you're using a development server (not file:// protocol):
```bash
npm run dev
```

### Styles not loading
Check that CSS files are properly linked in HTML:
```html
<link rel="stylesheet" href="src/css/variables.css">
<link rel="stylesheet" href="src/css/base.css">
```

### Old JavaScript still running
Clear browser cache or use incognito mode for testing.

## 📚 Additional Resources

- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Vite Documentation](https://vitejs.dev/)
- [Web Vitals](https://web.dev/vitals/)

---

**Last Updated:** February 2026
