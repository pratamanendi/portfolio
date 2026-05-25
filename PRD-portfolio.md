# PRD: Portfolio Nendi — Smooth Scrolling Upgrade

## 1. Tujuan
Perkaya portfolio dengan pengalaman scroll sinematik menggunakan Lenis + GSAP. Pertahankan konten existing (blog static MDX, i18n, framer-motion). Fokus pada animasi interaktif halus tanpa mengganggu performa.

## 2. Inspirasi
- Tidak ada situs spesifik — desain minimalis bersih, animasi halus.
- Scroll feel premium (Lenis) + reveal animasi (GSAP).
- Referensi: lavadental.lv hanya untuk feel scroll, bukan desain.

## 3. Lingkup (✅ apa yang boleh, ❌ apa yang tidak)

### ✅ Masuk scope
- Smooth scroll via Lenis
- GSAP ScrollTrigger untuk fade‑in section, stagger card, parallax hero
- Scroll progress bar
- Navbar → solid saat discroll (belum ada)
- Micro‑animasi: hover effects, smooth anchor scroll
- Loading screen minimal (opsional)

### ❌ Tidak masuk scope
- AI chatbot / integrasi AI
- CMS Cockpit — blog tetap static MDX
- Perubahan konten blog
- Fitur baru selain animasi & scroll

## 4. Struktur Halaman (tetap)
```
/ (id|en)        → Hero
/about           → Bio + timeline
/projects        → Grid project
/blog            → Static MDX
/blog/[slug]     → Artikel detail
/contact         → Form
```

## 5. Tech Stack

| Layer | Existing | Tambahan |
|-------|----------|----------|
| Framework | Astro 6 | — |
| Animasi | framer-motion | **Lenis** + **GSAP** |
| CSS | Tailwind (via style) | — |
| i18n | Astro i18n | — |
| Blog | Static MDX | — |

## 6. Animasi Detail

### 6.1 Lenis Smooth Scroll
- Instal `@studio-freight/lenis` via npm
- Init di `layout.astro` atau `client:only` component
- Easing: `easeOutCubic`
- Custom: wrapper `.lenis-wrapper { overflow: hidden; }`
- Test touch/mobile — CSS `touch-action: manipulation`

### 6.2 GSAP ScrollTrigger
- Instal `gsap` via npm
- `ScrollTrigger` plugin — init setelah Lenis
- **Hero section**: fade‑in dari opacity 0 → 1
- **Project grid**: stagger cards masuk satu per satu
- **Number counter** di stats section (bila ada)
- **Parallax** pada hero image/bg (opsional)
- **Section reveal**: tiap section baru muncul dengan translateY + opacity

### 6.3 Micro‑actions
- Nav link hover: underline slide
- Card project hover: image zoom + overlay
- Scroll progress bar (fixed top)
- Smooth anchor scroll (Lenis built‑in)

## 7. Integrasi dengan Existing Code

### Yang perlu dimodifikasi:
- `src/layouts/` — inject Lenis + GSAP (client:only, wrapped di useEffect)
- `src/components/ScrollReveal.jsx` — upgrade atau ganti dengan GSAP
- `src/components/HeroSection.jsx` — tambah GSAP reveal
- `src/components/ProjectShowcase.jsx` — tambah stagger animasi

### Yang tidak boleh diubah:
- Semua konten blog MDX
- i18n files dan routing
- SEO meta, sitemap, RSS

## 8. Performance & SEO

| Target | Nilai |
|--------|-------|
| Lighthouse Performance | tetap ≥ 90 (jangan turun drastis) |
| FCP | < 2s |
| JS bundle tambahan | < 30 kb (Lenis + GSAP) |
| Code splitting | Lenis + GSAP load only di route `/` |

- Lenis & GSAP: lazy load, deffered (tidak blocking render)
- Gunakan `client:only` untuk React component wrapper
- Cek CLS tidak naik signifikan

## 9. Task List

### Phase 1: Setup
- [ ] Instal `@studio-freight/lenis` + `gsap`
- [ ] Buat `SmoothScrollWrapper.jsx` (Lenis init + GSAP ScrollTrigger link)
- [ ] Inject di layout global (`client:only`)

### Phase 2: Landing Page Animations
- [ ] Hero: GSAP fade‑in pada teks + CTA
- [ ] Section reveal: tiap section punya trigger ScrollTrigger
- [ ] Project grid: stagger cards
- [ ] Scroll progress bar component

### Phase 3: Enhancement
- [ ] Navbar → solid background saat scroll melewati hero
- [ ] Hover micro‑animations (card, nav, button)
- [ ] Parallax efek pada hero image (opsional)

### Phase 4: Polish
- [ ] Test di Safari iOS (touch scroll Lenis)
- [ ] Test performa (Lighthouse)
- [ ] Fallback untuk native scroll bila Lenis gagal load
- [ ] Deploy ke Vercel

## 10. Success Criteria
- Lenis smooth scroll aktif di semua halaman
- GSAP reveal animations running (fade, stagger, parallax)
- Lighthouse ≥ 90, tidak ada regression
- Mobile responsive, touch scroll mulus
- Semua konten existing tetap utuh (no broken pages)

## 11. Risks & Mitigasi

| Risk | Mitigasi |
|------|----------|
| Lenis konflik framer-motion | Lenis handle smooth scroll, framer-motion handle component animasi — tidak overlap |
| iOS Safari scroll glitch | CSS `touch-action: manual` di wrapper, test fisik |
| GSAP blocking render | import dinamis, `client:only`, deferred load |
| CLS meningkat | Set fixed height untuk section, hindari layout shift saat animasi |

---
File: `/Users/macbook/Desktop/projects/web-portfolio/portfolio/PRD-portfolio.md`