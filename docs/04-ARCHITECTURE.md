# Architecture & Data Flow

## Component Tree
```
Layout.astro
├── ThreeParticles.jsx        (3D bg, fixed z-0)
├── nav.main-nav              (fixed, z-100)
│   ├── NavScroll.jsx         (GSAP hide/show on scroll)
│   ├── .nav-links-desktop    (desktop only)
│   └── #menuToggle           (hamburger button)
├── #navLinksMobile           (mobile overlay, body level)
├── <slot />                  (page content)
│   ├── / → index.astro      (Hero + About + Projects + Contact)
│   └── /blog/*.astro        (Blog index + posts)
├── footer
└── LenisInit.jsx             (smooth scroll)
```

## Data Flow: Blog
```
Astro Content Collections (src/content/blog/)
  → Astro generates static pages at build time
  → /blog/index.astro uses paginated JSON API (/api/posts/[page].json)
    → Client-side JS fetches via fetch() with in-memory cache
    → Load-more pattern (IntersectionObserver)
  → Each blog post: /blog/[slug].astro
```

## CSS Layers
1. `global.css` — tokens (CSS vars), reset, typography, utilities
2. Page-specific CSS → inline in `.astro` frontmatter `<style>`
3. Component CSS → inline in `.jsx` or scoped in Astro

## Three.js Particles
- Runs in `ThreeParticles.jsx` via @react-three/fiber
- Fixed position, pointer-events: none, z-index: 0
- Opacity: 0.6 desktop, 0.3 mobile

## Nav System
- Desktop: inline `.nav-links-desktop` (flex, visible >768px)
- Mobile: body-level `.nav-links-mobile` overlay (fixed, visible <768px)
- Toggle via hamburger (#menuToggle)
- Scroll hide/show via NavScroll.jsx (GSAP + ScrollTrigger)
- NOT using `transform` for nav scroll (was causing mobile overlay issues)
