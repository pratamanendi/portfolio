# Tech Stack & Conventions

## Stack
| Layer | Choice |
|---|---|
| Framework | Astro 5 (SSG) |
| UI | Astro components + React islands (JSX) |
| Styling | Global CSS (no framework) |
| Animation | GSAP + ScrollTrigger, Lenis |
| 3D | Three.js via @react-three/fiber |
| Font | Outfit (display) + Space Mono (mono) |
| Icons | SVG inline, no icon library |
| Hosting | Vercel (prod: nendi-candra.vercel.app) |

## CSS Conventions
- BEM-like: `.block-element`
- Utility classes: `.text-lime`, `.mono-text`, `.container`
- CSS custom properties in `:root`
- Mobile-first: `@media (max-width: 768px)`
- No Tailwind, no CSS-in-JS

## File Structure
```
src/
  components/    # React/JSX components
  layouts/       # Astro layouts
  pages/         # Routes (file-based)
  styles/        # Global CSS
  content/       # Blog content (Astro content collections)
```

## Naming
- `.astro` — page/layout files
- `.jsx` — React interactive components
- `.css` — global styles
- Kebab-case: `nav-scroll.jsx`, `three-particles.jsx`

## Git
- Branch: `main`
- Commit: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Deploy: auto via `vercel --prod`
