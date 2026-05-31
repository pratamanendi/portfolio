# AGENTS.md — AI Instructions for This Project

> Dibaca oleh AI (Hermes, Claude Code, Codex, dll) SEBELUM ngerjain apapun.

## Project Identity
- **Site:** https://nendi-candra.vercel.app — Portfolio Nendi Candra
- **Developer:** Nendi Candra — Frontend Engineer, prefers Indonesian (santai/ringkas)
- **Style:** Dark brutalist aesthetic, bold typography, lime/cyan accents, grid bg

## Critical Rules
1. **LOJIK:** Always explain WHY, not just WHAT. Nendi wants to understand.
2. **TIDAK ADA magic numbers:** Semua constant, spacing, color ada CSS vars di `:root`.
3. **SEMUA perubahan CSS** harus di `global.css`, jangan inline style (kecuali truly one-off).
4. **GSAP + ScrollTrigger** → pake `NavScroll.jsx`, jangan bikin ScrollTrigger baru di komponen lain.
5. **Mobile-first:** Cek tampilan mobile dulu sebelum desktop.
6. **Tanya kalo ragu:** Jangan asal implement — minta konfirmasi Nendi.
7. **File paths:** relative ke `~/Desktop/projects/web-portfolio/portfolio/`

## Tech Stack Reference
- Astro 5 (SSG), React islands for interactivity
- Three.js for background particles (`ThreeParticles.jsx`)
- GSAP + Lenis for smooth scroll
- Pure CSS (no Tailwind)
- Vercel deploy: `npm run build && vercel --prod`

## What NOT To Do
- ❌ Jangan tambah library baru tanpa diskusi
- ❌ Jangan ubah file di luar `src/` tanpa konfirmasi
- ❌ Jangan pake inline `<style>` di Astro (kecuali urgent)
- ❌ Jangan remove CSS vars
- ❌ Jangan commit langsung ke main (Nendi handle deploy)

## Development Workflow
1. Read requirements from user
2. If complex, write plan first → show Nendi
3. Implement task by task
4. After each task: explain what changed and why
5. Before deploy: `npm run build` — verify no errors
6. Deploy via `vercel --prod`, share URL
