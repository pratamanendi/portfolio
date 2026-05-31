# Docs — Panduan

Semua file dokumentasi project.

## File Index

| File | Isi | Dibaca Oleh |
|---|---|---|
| `01-PROJECT-BRIEF.md` | Why, what, who, how | **Lo** — before starting anything |
| `02-TECH-STACK.md` | Stack, conventions, file structure | **Lo + AI** — reference |
| `03-AGENTS.md` | Rules buat AI helper | **AI (wajib dibaca)** |
| `04-ARCHITECTURE.md` | Component tree, data flow | **Lo + AI** — understanding |
| `05-PLAN-TEMPLATE.md` | Template rencana fitur baru | **Lo** — copy tiap mulai fitur |

## Flow Kerja Setiap Fitur Baru

```
1. Baca 01-PROJECT-BRIEF.md        ← inget lagi tujuan project
2. Copy 05-PLAN-TEMPLATE.md         ← buat plan untuk fitur ini
3. Isi Analysis section             ← KENAPA & APA yang mau dibangun
4. Breakdown ke tasks kecil         ← per file, perubahannya apa
5. Load 03-AGENTS.md ke AI         ← biar AI tau aturan main
6. Execute task by task             ← AI ngerjain, lo review
7. Build + verify                  ← npm run build
8. Update docs kalo ada perubahan  ← doc is never "done"
```
