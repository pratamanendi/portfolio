---
title: "Serverless AI Functions with Vercel"
description: "Deploying AI endpoints as Vercel Serverless Functions, handling cold starts, and caching results."
pubDate: "2026-08-02"
heroImage: "https://images.unsplash.com/photo-1677442d019cecf8978b4fab7a1ee3d28b13fb3e?auto=format&fit=crop&q=80&w=1200&h=600"
---

# Serverless AI Functions with Vercel

## TL;DR
- **Apa**: Menjalankan model inferensi AI sebagai fungsi serverless di Vercel.
- **Mengapa**: Skalabilitas otomatis, tidak perlu mengelola server, dan integrasi mudah dengan frontend Next.js.
- **Cara**: Buat API route yang menerima prompt, memanggil model (through HuggingFace API, self‑hosted llama.cpp server, atau layanan seperti Replicate), dan mengembalikan hasil.
- **Poin Penting**:
  - Cold start dapat menambah latensi beberapa detik; gunakan Edge Functions atau mantapkan dengan Vercel Cron Jobs.
  - Cache hasil respons untuk prompt yang sering diulang (misalnya, autocomplete atau FAQ).
  - Batasi ukuran respons dan gunakan streaming bila memungkinkan untuk UX yang lebih baik.
  - Simpan rahasia API key di Vercel Environment Variables dan hindari mengeksposnya ke client.
- **Pro Tip**: Gunakan Vercel Edge Functions dengan runtime Node.js untuk inference model yang sudah di‑quantize dan kecil (<50MB) agar cold start hampir tidak terasa.

## 1. Mengapa Memilih Vercel Serverless untuk AI?
### Manfaat
- **Skala ke nol**: Tidak dikenai biaya ketika tidak ada traffic.
- **Deploy cepat**: `git push` otomatis menghasilkan produksi.
- **Integrasi dengan Next.js**: API routes berada dalam proyek yang sama, memudahkan pengembangan full‑stack.
- **Edge Network**: Vercel menjalankan fungsi di lokasi terdekat dengan pengguna, mengurangi round‑trip time.

### Keterbatasan
- **Durasi maksimal**: 10 detik untuk Serverless Functions, 30 detik untuk Edge Functions (bisa diperpanjang dengan pageload).
- **Ukuran bundle**: Batas 250 MB (termasuk node_modules); model besar perlu di‑externalisasi.
- **Cold start**: Saat fungsi dipanggil setelah periode idle, ada penundaan inisialisasi.

## 2. Strategi Mengatasi Keterbatasan
### Mengurangi Ukuran Bundle
- Externalisasikan model besar dengan memanggil API pihak ketiga (HuggingFace Inference API, Replicate, atau layanan self‑hosted di luar Vercel).
- Jika ingin menjalankan model di dalam fungsi, gunakan model yang sudah di‑quantize ke GGUF dan ukuran < 30 MB, maka dapat dimasukkan langsung.

### Menangani Cold Start
- **Edge Functions**: berjalan di V8 isolate, memiliki waktu mulai yang jauh lebih cepat (< 100 ms).
- **Keep‑alive dengan Cron**: Vercel Cron Jobs dapat memicu fungsi setiap 5‑10 menit untuk menjaga container tetap hangus.
- **Lazy Load**: Muat model hanya ketika diperlukan pertama kali dan simpan dalam variabel global fungsi agar pemanggilan berikutnya reuse.

### Menggunakan Cache
- Vercel menyediakan Edge Cache dan também kamu dapat menggunakan KV atau Redis untuk menyimpan hasil inferensi.
- Key cache bisa berbasis hash dari prompt + parameter model.
- Set TTP (time‑to‑live) sesuai dengan volatilitas data (mis., 1 jam untuk fakta statis, 5 menit untuk data yang berubah‑ubah).

## 3. Membuat API Route di Vercel (Next.js Pages)
### Struktur File
```
/pages
  /api
    /ai
      generate.ts
```

### Contoh Menggunakan HuggingFace Inference API
```ts
// pages/api/ai/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model = 'NousResearch/Hermes-3-Llama-3-8B' } = req.body as {
    prompt?: string;
    model?: string;
  };

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 256, temperature: 0.7, return_full_text: false },
        }),
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`HuggingFace error: ${hfResponse.statusText}`);
    }

    const result = await hfResponse.json();
    // HuggingFace biasanya mengembalikan array [{ generated_text: '...' }]
    const generatedText = Array.isArray(result) && result[0]?.generated_text
      ? result[0].generated_text
      : typeof result === 'string' ? result : JSON.stringify(result);

    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}
```

### Contoh Menggunakan Model Lokal di dalam Fungsi (untuk model kecil)
```ts
// pages/api/ai/generate-local.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// Asumsikan kamu telah men-copy model GGUF ke dalam repo dan mengkompilasi llama.cpp binding.
// Untuk contoh ini, kita假設 ada fungsi `runLlamaCpp` yang ada dari suatu native addon atau melalui WASM.
import { runLlamaCpp } from '@/lib/llamaCppBinding';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body as { prompt?: string };

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const output = await runLlamaCpp({
      modelPath: '/tmp/hermes-3-llama-3-8b.q4_0.gguf', // path di dalam fungsi Vercel (jika sudah di‑upload)
      prompt,
      params: {
        max_tokens: 256,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    res.status(200).json({ text: output });
  } catch (err) {
    console.error('Local inference error:', err);
    res.status(500).json({ error: 'Failed to run local model' });
  }
}
```

## 4. Menggunakan Vercel Edge Functions untuk Latensi Rendah
### Mengubah ke Edge
- Ganti `export const config = { runtime: 'experimental-edge' };`
- Gunakan fetch yang didukung di Edge (sama seperti di atas).
- Pastikan semua dependencies kompatibel dengan Edge (no native Node-only modules).

```ts
// pages/api/ai/generate-edge.ts
export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // sama seperti contoh HF di atas, tapi menggunakan fetch global Edge
  const hfResponse = await fetch(
    `https://api-inference.huggingface.co/models/NousResearch/Hermes-3-Llama-3-8B`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 256, temperature: 0.7 },
      }),
    }
  );

  if (!hfResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'AI service error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await hfResponse.json();
  const generatedText = Array.isArray(result) && result[0]?.generated_text
    ? result[0].generated_text
    : JSON.stringify(result);

  return new Response(JSON.stringify({ text: generatedText }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## 5. Mengimplementasikan Cache dengan Vercel KV (Opsional)
### Menyimpan dan Mengambil dari KV
```ts
import { kv } from '@vercel/kv';

// dalam handler setelah mendapatkan prompt:
const cacheKey = `ai:${Buffer.from(prompt).toString('base64')}`;
const cached = await kv.get<string>(cacheKey);
if (cached) {
  return res.status(200).json({ text: cached, fromCache: true });
}

// setelah mendapatkan hasil dari model:
await kv.set(cacheKey, generatedText, { ex: 60 * 60 }); // TTL 1 jam
```

### Alternatif: Gunakan Edge Cache dengan `Cache-Control` Header
- Untuk respons yang bisa dioleh kembali (mis., fakta statis), set header:
```js
res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
```
- Vercel akan menyiapkan hasil di CDN edge.

## 6. Pertimbangkan Streaming untuk UX yang Lebih Baik
### Menggunakan `StreamingTextResponse` dari `ai/react`
Jika Anda menggunakan Vercel AI SDK:
```ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY });
const openai = new OpenAIApi(configuration);

export const config = { runtime: 'edge' };

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await openai.createCompletion({
    model: 'gpt-4o-turbo',
    prompt: prompt,
    stream: true,
    max_tokens: 256,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```
Di React, gunakan `useCompletion` dari `ai/react` untuk menangani stream secara otomatis.

## 7. Keamanan dan Praktik Terbaik
### Menyimpan Rahasia
- Simpan HF API key, OpenAI key, atau kunci lain di Vercel Settings → Environment Variables.
- Hindari mengeksposnya ke client-side code.

### Membatasi Ukuran Request
- Periksa panjang prompt; batasi sampai beberapa ribu karakter untuk mencegah abus.
```ts
if (prompt.length > 2000) {
  return res.status(400).json({ error: 'Prompt too long' });
}
```

### Rate Sederhana
- Implementasi sederhana menggunakan KV atau Redis untuk menghitung jumlah permintaan per IP per menit.
- Atau gunakan layanan pihak ketiga seperti Upstash Rate Limit.

### Menangani Error dan Fallback
- Jika layanan AI gagal, kembalikan pesan yang informatif dan beri pengguna opsi untuk mencoba lagi atau menggunakan versi statis.
- Log error secarainternal (ke Vercel Logs atau layanan seperti Sentry) tanpa mengungkapkan detail ke pengguna.

## 8. Deployment dan Monitoring
### Langkah Deploy
```bash
# Pastikan kamu berada di direktori proyek Vercel
vercel        # preview
vercel --prod # produksi
```

### Memantau Performa
- Gunakan Vercel Analytics untuk melihat duration dan error rate.
- Set up alert jika rata‑rata duration > 2 detik atau error rate > 5%.

### Skala dan Biaya
- Estimasi biaya berdasarkan invocasi dan duration.
- Manfaatkan paket Hobby atau Pro terlebih dahulu, lalu ke Enterprise bila diperlukan.

## Kesimpulan
Vercel Serverless (dan Edge Functions) menyediakan platform yang powerful untuk menjalankan AI inference tanpa harus mengelola infrastruktur tradizional. Dengan memahami batasan—seperti ukuran bundle, durasi maksimum, dan cold start—and menerapkan strategi seperti externalisasi model, caching, dan edge deployment, Anda dapat membangun fitur AI yang:
- Responsif: latensi rendah terutama dengan Edge Functions.
- Skalabel: otomatis menaik bersama traffic.
- Efisien: biaya hanya sesuai dengan penggunaan nyata.
- Aman: rahasia terlindungi dan audit trail tersedia.

Selanjutnya, coba integrasikan fungsi ini ke dalam fitur produk Anda—misalnya generator deskripsi produk, asisten penulisan kode dalam editor, atau chatbot dukungan yang bersifat kontekstual. Dengan fondasi yang baik, Anda bisa fokus pada menciptakan pengalaman yang berguna bagi pengguna, bukan menangani server.

Selamat mendeploy!