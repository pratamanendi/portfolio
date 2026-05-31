---
title: "AI‑Powered Accessibility Testing"
description: "Using LLMs to audit color contrast, keyboard navigation, ARIA labels, and suggest fixes."
pubDate: "2026-08-08"
heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200&h=600"
---


## TL;DR
- **Apa**: Menggunakan model bahasa besar untuk menganalisis kode frontend (HTML, CSS, JS) dan melaporkan masalah aksesibilitas seperti kontras warna, navigasi keyboard, label ARIA, dan_role yang tidak sesuai.
- **Mengapa**: Pengujian aksesibilitas manual memakan waktu dan mudah terlewat; AI dapat menyaring kode besar secara konsisten dan memberikan perbaikan yang dapat ditindaklanjuti.
- **Cara**: Siapkan promtan yang meminta model untuk menjalankan periset aturan WCAG 2.2, berikan kode komponen atau halaman, terima laporan terstruktur dengan tingkat keparahan dan contoh perbaikan.
- **Poin Penting**:
  - Model dapat menginterpretasikan konteks visual dari kode (mis., menghitung kontras warna dari nilai CSS).
  - Hasil biasanya dalam bentuk JSON atau markdown yang mudah di‑integrasikan ke dalam CI.
  - Tambahkan contoh few‑shot yang menunjukkan format laporan yang diinginkan.
  - Selalu validasi saran AI dengan alat khusus seperti axe-core atau Lighthouse untuk memastikan akurasi.
  - Gunakan dalam alur kerja pull request sehingga setiap perubahan menjalankan AI audit sebelum menggabungkan.
- **Pro Tip**: Bangun wrapper kecil yang menjalankan AI audit sebagai tindakan lint khusus dan tambahkan ke `.husky/pre-commit` atau GitHub Actions.

## 1. Mengapa Menggunakan AI untuk Aksesibilitas?
### Keunggulan AI
- **Skala**: mampu menganalisis ratusan komponen dalam hitungan detik.
- **Konteks**: memahami maksud komponen (mis., tombol seharusnya mempunyai label yang jelas) dan dapat menyarankan teks yang sesuai.
- **Konsistensi**: menerapkan aturan secara sama untuk setiap kode, mengurangi variasi penguji manusia.
- **Saran Perbaikan**: tidak hanya melaporkan masalah tetapi juga memberikan contoh kode yang sudah diperbaiki.

### Batasan
- Model mungkin menghilangkan konteks visual yang kompleks (mis., gambar yang menyampaikan informasi).
- Perlu dijadikan sebagai pendamping, bukan pengganti alat estable seperti axe, Lighthouse, atau pa11y.

## 2. Membangun Prompt Audit Aksesibilitas
### Struktur Prompt Umum
```
Anda adalah ahli aksesibilitas web yang paham WCAG 2.2 Tingkat AA.
Berikut ini adalah kode komponen React (misalnya, JSX dan CSS terkait).
Tugas Anda:
1. Identifikasi setiap pelanggaran aksesibilitas.
2. Untuk setiap pelanggaran, berikan:
   - kode contoh yang bermasalah (singkat)
   - penjelasan mengapa ini tidak accesible (merujuk kriteria WCAG)
   - saran perbaikan kode yang konkreat
   - tingkat keparahan (ringan, sedang, berat) berdasarkan dampak pada pengguna disabilitas
3. Format output sebagai array JSON objek dengan fields: type, location, description, wcag, severity, suggestion.

Kode:
<<<KOMPONEN>>> 
```

### Contoh Prompt untuk Komponen Button
```text
Anda adalah ahli aksesibilitas web yang paham WCAG 2.2 Tingkat AA.
Berikut ini adalah kode komponen React Button beserta styling CSS-nya.
Tugas Anda:
1. Identifikasi setiap pelanggaran aksesibilitas.
2. Untuk setiap pelanggaran, berikan:
   - kode contoh yang bermasalah (singkat)
   - penjelasan mengapa ini tidak accesible (merujuk kriteria WCAG)
   - saran perbaikan kode yang konkreat
   - tingkat keparahan (ringan, sedang, berat) berdasarkan dampak pada pengguna disabilitas
3. Format output sebagai array JSON objek dengan fields: type, location, description, wcag, severity, suggestion.

Kode:
const Button = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={cn('btn', variant === 'primary' && 'btn-primary', variant === 'secondary' && 'btn-secondary')} {...props}>
      {children}
    </button>
  );
};

.btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
.btn-primary {
  background-color: #0066ff;
  color: white;
  border: none;
}
.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #999;
}
```
### Output yang Diharapkan (contoh)
```json
[
  {
    "type": "missing-accessible-name",
    "location": "Button component",
    "description": "The button does not have an accessible name. When variant prop is not 'primary' or 'secondary', the button may render with only visual styling and no text.",
    "wcag": "4.1.2 Name, Role, Value",
    "severity": "medium",
    "suggestion": "Add aria-label or ensure children prop is always provided. Example: <button aria-label=\"Submit\">...</button> or enforce children via PropTypes."
  },
  {
    "type": "insufficient-contrast",
    "location": ".btn-secondary",
    "description": "The background color #e0e0e0 with text color #333 has a contrast ratio of 3.2:1, which is below the WCAG AA minimum of 4.5:1 for normal text.",
    "wcag": "1.4.3 Contrast (Minimum)",
    "severity": "medium",
    "suggestion": "Increase text color darkness or lighten background. Example: change color to #222 or background to #bdbdbd."
  }
]
```

## 3. Mengintegrasikan AI Audit ke dalam Alur Kerja Pengembangan
### Skrip Wrapper (Node.js)
```js
// scripts/a11y-ai-audit.js
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
  return output.trim().split('\n').filter(f => f.match(/\.(js|jsx|ts|tsx|vue|html)$/));
}

function buildPrompt(filePath, content) {
  return `Anda adalah ahli aksesibilitas web yang paham WCAG 2.2 Tingkat AA.
Berikut ini adalah kode dari ${filePath}.
Tugas Anda:
1. Identifikasi setiap pelanggaran aksesibilitas.
2. Untuk setiap pelanggaran, berikan:
   - kode contoh yang bermasalah (singkat)
   - penjelasan mengapa ini tidak accesible (merujuk kriteria WCAG)
   - saran perbaikan kode yang konkreat
   - tingkat keparahan (ringan, sedang, berat) berdasarkan dampak pada pengguna disabilitas
3. Format output sebagai array JSON objek dengan fields: type, location, description, wcag, severity, suggestion.

Kode:
${content}
`;
}

async function callAIModel(prompt) {
  // Ganti dengan pemanggilan ke model Anda (mis., HuggingFace Inference API, atau endpoint lokal)
  const resp = await fetch('https://api-inference.huggingface.co/models/NousResearch/Hermes-3-Llama-3-8B', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1024, temperature: 0.2 } })
  });
  if (!resp.ok) throw new Error(`AI error: ${resp.statusText}`);
  const json = await resp.json();
  // Asumsikan kembalian berupa teks yang berisi JSON array
  const text = Array.isArray(json) ? json[0].generated_text : json.generated_text || '';
  // Ekstrak JSON dari teks (bisa pakai regex sederhana)
  const match = text.match(/\[\s*\{.*\}\s*\]/s);
  if (!match) throw new Error('Could not parse JSON from AI response');
  return JSON.parse(match[0]);
}

async function main() {
  const files = getStagedFiles();
  let hasIssues = false;
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const prompt = buildPrompt(file, content);
    try {
      const issues = await callAIModel(prompt);
      if (issues.length > 0) {
        console.error(`\n🔍 Aksesibilitas issues found in ${file}:`);
        issues.forEach(issue => {
          console.error(`  - [${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}`);
          console.error(`    WCAG: ${issue.wcag}`);
          console.error(`    Saran: ${issue.suggestion}`);
        });
        hasIssues = true;
      }
    } catch (err) {
      console.error(`Failed to audit ${file}:`, err.message);
    }
  }
  if (hasIssues) {
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
```

### Menambahkan ke Husky pre-commit
```bash
npm install --save-dev husky
npx husky add .husky/pre-commit "node scripts/a11y-ai-audit.js"
```

### Contoh GitHub Actions
```yaml
name: AI Accessibility Audit
on: [pull_request]
jobs:
  a11y-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Install deps
        run: npm ci
      - name: Run AI audit
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: node scripts/a11y-ai-audit.js
```

## 4. Menguji dan Menyesuaikan Prompt
### Teknik Few‑Shot
Tambahkan contoh input/output yang benar ke dalam prompt agar model lebih mengikuti format.
```text
Contoh Input:
<button onClick={handleClick}>Click me</button>

Contoh Output JSON:
[
  {
    "type": "missing-accessible-name",
    "location": "button element",
    "description": "The button has visible text but no accessible name for screen readers when used in isolation.",
    "wcag": "4.1.2 Name, Role, Value",
    "severity": "low",
    "suggestion": "Ensure the button has discernible text. The current text 'Click me' is fine; if this were an icon-only button, add aria-label."
  }
]
```
Letakkan contoh di awal prompt sebelum "Kode:".

### Mengukur Akurasi
- Bandingkan output AI dengan hasil dari axe-core pada contoh kode yang sama.
- Hitung metrik seperti precision dan recall untuk tiap jenis pelanggaran.
- Atur suhu model dan panjang maksimal token untuk mendapatkan jawaban yang lebih fokus dan terformat.

## 5. Mengembangkan Capabilities Lanjutan
### Memeriksa Kontras Warna Secara Otomatis
- Ekstrak nilai warna dari CSS (mis., menggunakan library seperti `color` atau `tinycolor2` dalam Node sebelum memanggil AI).
- Sertakan nilai kontras yang dihitung dalam prompt agar AI hanya perlu memverifikasi atau memberikan saran jika kurang.

### Mengaudit Komponen Interaktif
- Untuk komponen yang memiliki 상태 (mis., menu dropdown, modal), berikan contoh kode yang menunjukkan keadaan terbuka dan tertutup.
- Minta AI untuk memeriksa fokus terkapan, penangguhan pintu tab, dan kembali ke elemen pemicu setelah penutupan.

### Membuat Dashboard Raportasi
- Simpan hasil AI audit setiap build ke dalam file JSON.
- Gunakan skrip untuk menghasilkan laporan tren (mis., penurunan jumlah issues berat seiring waktu).
- Tampilkan di internal wiki atau sebagai komentar pada pull request melalui GitHub API.

## 6. Kesimpulan
AI‑powered accessibility testing memberikan cara yang cepat dan konsisten untuk menemukan dan memperbaiki masalah aksesibilitas dalam kode frontend. Dengan merancang prompt yang jelas, mengintegrasikan ke dalam alur kerja CI/CD, dan selalu memvalidasi dengan alat khusus, tim dapat:
- Mengurangi beban pengujian manual sambil meningkatkan cakupan.
- Mendapatkan saran perbaikan yang spesifik dan dapat ditindaklanjuti.
- Memastikan bahwa setiap perubahan kode memenuhi standar aksesibilitas sebelum mencapai produksi.

Selanjutnya, coba mulai dengan satu tipe file (mis., komponen React) dan bangun wrapper auditnya. Setelah proses tersebut stabil, luaskan ke halaman penuh, file Markdown, atau bahkan desain sistem yang diwakili oleh token JSON. Ingat: aksesibilitas bukan sekadar checklist, tetapi komitmen inklusivitas yang harus ditanamkan sejak awal pengembangan—and AI bisa menjadi alat yang sangat membantu dalam upaya itu.

Semoga sukses membuat web yang lebih dapat diakses oleh semua orang!
