---
title: "Astro Portfolio Tutorial: Build a Developer Portfolio in 2026"
description: "Step-by-step tutorial to build a fast, SEO-optimized developer portfolio with Astro in 2026. Includes project showcase, blog, dark mode, and deployment to Vercel."
pubDate: "2026-05-31"
heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600"
---

## TL;DR
- **What**: Build a complete developer portfolio with Astro static site generator
- **Why**: Astro delivers near-zero JS, fastest Core Web Vitals, and built-in Markdown/MDX blogging
- **How**: Scaffold → add pages → blog collection → deploy to Vercel
- **Stack**: Astro 5, React components, Tailwind CSS, Markdown blog
- **Result**: Portfolio that scores 95+ Lighthouse on mobile

> 💡 **Part of the [AI for Frontend Developers: Complete Guide](/blog/ai-frontend-developers-guide/) — your central resource for AI-powered frontend development.**

---

## Why Astro for Your Portfolio in 2026

Astro has become the go-to framework for content-driven websites. For developer portfolios specifically, it offers:

- **Zero JS by default** — pages load instantly, no framework runtime
- **Built-in Markdown/MDX** — blog posts as simple `.md` files
- **Islands architecture** — interactive React/Vue components only where needed
- **Automatic sitemap** — SEO out of the box with `@astrojs/sitemap`
- **Image optimization** — `@astrojs/image` for responsive images
- **RSS feed** — built-in RSS generation for your blog

Compare with other frameworks in [React vs Next.js vs Vue vs Astro: Framework Guide](/blog/react-nextjs-vue-astro-comparison/).

## Step 1: Scaffold the Project

```bash
# Create Astro project
npm create astro@latest my-portfolio -- --template basics

# Add essential integrations
npx astro add react tailwind sitemap

# Install dev dependencies
npm install -D @astrojs/mdx
```

## Step 2: Project Structure

```
src/
  content/
    blog/          # Markdown blog posts
  components/      # Reusable components (Nav, Footer, Card)
  layouts/         # Layout.astro, BlogPost.astro
  pages/           # Route pages (index, blog, projects)
  styles/          # Global CSS
public/            # Static assets (favicon, robots.txt)
astro.config.mjs   # Astro configuration
```

For a real-world example, check out the [source of this portfolio](https://github.com/nendicandra/portfolio).

## Step 3: Create the Blog Collection

Blog posts in Astro are just Markdown files with frontmatter:

```markdown
---
title: "My First Post"
description: "Short description for SEO and card preview"
pubDate: "2026-05-31"
heroImage: "https://images.unsplash.com/photo-..."
---

## Post content here
```

Astro automatically generates collection types. Access posts with `getCollection("blog")` — see [Astro + AI: Building Intelligent Static Sites](/blog/astro-ai-integration/) for advanced patterns.

## Step 4: SEO Configuration

Every portfolio needs solid SEO:

- **Layout.astro** with dynamic `<title>` and `<meta name="description">`
- **Canonical URLs** via `Astro.url`
- **Open Graph** meta tags for social sharing
- **JSON-LD schema** (Person + WebSite)
- **robots.txt** with sitemap reference
- **RSS feed** via `@astrojs/rss`

For full SEO details, see the [SEO checklist used by nendi-candra.vercel.app](/blog/ai-frontend-developers-guide/).

## Step 5: Add Interactive Components

Use Astro islands for interactive parts:

```astro
<!-- React component with client:load -->
<ProjectCarousel client:load />
```

Keep most of the page static. Only hydrate what's interactive. For Three.js backgrounds or animations, use `client:visible` to lazy-load.

## Step 6: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (zero config — Astro auto-detected)
vercel --prod
```

Vercel automatically:
- Builds with `astro build`
- Serves from edge CDN
- Provides HTTPS + custom domain
- Generates deploy previews per branch

## Portfolio Must-Haves Checklist

| Feature | Why | Implementation |
|---------|-----|----------------|
| Hero section | First impression, shows your role | Animated title + CTA |
| Projects grid | Proof of work | Cards with tech tags |
| Blog | SEO + authority | Markdown collection |
| Contact | Lead generation | Form or email link |
| Dark/light mode | User preference | CSS variables + toggle |
| Performance | Google ranking | Astro SSG + image optimization |

## Conclusion

Astro is the perfect choice for a developer portfolio in 2026. Fast, SEO-friendly, and easy to maintain. Start with the scaffold above, customize the design, and deploy in under an hour.

For more advanced topics like adding AI features to your Astro site, read [Astro + AI: Building Intelligent Static Sites](/blog/astro-ai-integration/).
