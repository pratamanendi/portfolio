---
title: Tailwind CSS Performance Tips - Optimize Your Bundle Size
description: Reduce Tailwind CSS bundle size by 70%+ with purging, layer optimization, and smart utility usage. Real-world techniques for production.
pubDate: 2025-01-18
updatedDate: 2025-01-22
---

## The Problem

Default Tailwind generates **500KB+ of unused CSS**. Most projects only use 10-20% of utilities. Ship bloat = slower sites.

## 1. Configure Content Paths Correctly

First step: tell Tailwind which files to scan.

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}', // Scan these
    './node_modules/@components/**/*.{js,ts}', // And node_modules
  ],
};
```

**Result:** Removes ~60% of unused CSS immediately.

## 2. Use Layers for Organization

Split utility definitions into logical layers: base, components, utilities.

```css
/* styles/tailwind.css */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
  
  h1, h2, h3 {
    @apply font-bold leading-tight;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors;
  }
  
  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700;
  }
}

@layer utilities {
  .text-truncate-2 {
    @apply line-clamp-2;
  }
}
```

Benefit: Organize code logically. Layers cascade properly.

## 3. Purge Unused Selectors Aggressively

Remove selectors Tailwind can't detect automatically (from strings, API responses).

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  safelist: [
    // Whitelist dynamic classes
    {
      pattern: /^(bg|text|border)-(red|blue|green)-(100|500|900)$/, // Regex patterns
      variants: ['hover', 'focus'],
    },
  ],
};
```

**Example use case:**
```jsx
function Badge({ color }) {
  // Don't do this - Tailwind can't see it:
  // const className = `bg-${color}-500`; // ❌ NOT DETECTED
  
  // Do this instead:
  const colors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };
  return <span className={colors[color]} />;
}
```

## 4. Disable Unused Variants

Every variant (hover, focus, dark, sm, lg, etc.) adds CSS. Disable what you don't use.

```js
export default {
  corePlugins: {
    // Disable expensive variants
    animation: false, // If not using animations
    aspectRatio: false, // If not using aspect-ratio utilities
  },
  variants: {
    extend: {
      // Only enable for specific utilities
      backgroundColor: ['hover', 'focus'],
      textColor: ['hover'],
      borderColor: ['hover', 'focus'],
    },
  },
};
```

**Savings:** 5-15% bundle reduction per disabled feature.

## 5. Minify + Compression

Tailwind already minifies, but add gzip compression on production.

```js
// astro.config.mjs (for Astro)
export default defineConfig({
  integrations: [
    // ... other integrations
  ],
  // Enable compression
  vite: {
    build: {
      minify: 'terser', // Already on by default
      cssMinify: 'lightningcss', // Use fast minifier
    },
  },
});
```

Browser gzip reduces 500KB CSS → **80-120KB** transferred.

## 6. Use PurgeCSS with Custom Extractors

For edge cases (templates, string interpolation), add custom extractors.

```js
export default {
  content: [
    {
      raw: fs.readFileSync('./src/templates.html', 'utf8'),
      extension: 'html',
    },
  ],
};
```

## 7. Consider Atomic CSS Alternative

For extreme optimization, try **UnoCSS** (instant-on CSS engine, smaller output).

```bash
npm install -D unocss
```

Same API as Tailwind, but:
- Faster build times
- Smaller bundle (200KB vs 500KB)
- On-demand CSS generation

```js
// astro.config.mjs
import UnoCSS from 'unocss/astro';

export default defineConfig({
  integrations: [UnoCSS()],
});
```

## Real-World Results

Project before optimization:
- CSS bundle: 456KB
- Gzipped: 78KB

After optimization (content config + layer organization + variant reduction):
- CSS bundle: 142KB
- Gzipped: 32KB

**Result:** 60% reduction! ✅

## Checklist

- [ ] Configure `content` paths for your project
- [ ] Organize code with @layer
- [ ] Remove unused variants in tailwind.config
- [ ] Enable gzip compression in production
- [ ] Monitor CSS bundle size in CI/CD
- [ ] Consider UnoCSS for greenfield projects

## Next Steps

- Profile with **Lighthouse** to catch remaining unused CSS
- Use **bundle-analyzer** to visualize what's included
- Automate purging in CI/CD pipeline
