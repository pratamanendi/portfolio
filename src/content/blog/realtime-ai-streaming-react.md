---
title: "Real‑time AI Streaming in React"
description: "Patterns for streaming LLM responses (SSE, WebSockets) and updating React UI incrementally."
pubDate: "2026-07-30"
heroImage: "https://images.unsplash.com/photo-1677442d019cecf8978b4fab7a1ee3d28b13fb3e?auto=format&fit=crop&q=80&w=1200&h=600"
---


## TL;DR
- **Apa**: Teknik untuk mengalirkan respons dari model bahasa secara real‑time ke UI React menggunakan Server‑Sent Events (SSE) atau WebSocket.
- **Mengapa**: Menambah responsivitas, memperlihatkan progres generasi, dan menciptakan pengalaman serupa chatbot modern.
- **Cara**: Buat endpoint backend yang menghasilkan token satu per satu, gunakan EventSource atau pustaka WebSocket di React, dan tampilkan hasil secara incremental dengan useState/useRef.
- **Poin Penting**:
  - SSE lebih mudah diimplementasi untuk alur satu‑arah (server → klien).
  - WebSocket cocok bila diperlukan komunikasi dua arah (mis. perintah dari klien ke model).
  - Tambahkan mekanisme putus‑koneksi dan retry otomatis.
  - Batasi ukuran chunk dan gunakan debounce bila perlu untuk mengurangi re‑render.
  - Pertimbangkan menggunakan pustaka seperti `ai/react` dari Vercel SDK untuk menangani stream secara otomatis.
- **Pro Tip**: Gunakan `AbortController` untuk membatalkan request ketika komponen un‑mount atau pengguna mengetik ulang.

## 1. Memilih Transport: SSE vs WebSocket
### Server‑Sent Events (SSE)
- HTTP berbasis, mengirimkan teks dari server ke klien.
- Didukung secara native oleh browser melalui `EventSource`.
- Otomatis melakukan reconnect ketika koneksi terputus.
- Cocok untuk use‑case seperti streaming respons chat.

### WebSocket
- Protokol duplex, memungkinkan klien mengirim pesan ke server dan menerima balasan.
- Lebih kompleks (butuh handle handshake, heartbeat, dll.).
- Pilih bila aplikasi Anda perlu mengirim perintah seperti “stop”, “regenerate”, atau mengubah parameter model tengah‑jalan.

## 2. Membangun Endpoint Streaming di Backend
### Contoh dengan Node.js + Express (Route `/api/ai/stream`)
```js
import express from 'express';
import { OpenAIStream, StreamingTextResponse } from 'ai'; // Vercel AI SDK
// atau implementasi manual dengan modul openai

const router = express.Router();

router.post('/api/ai/stream', async (req, res) => {
  const { prompt, model = 'NousResearch/Hermes-3-Llama-3-8B' } = req.body;

  // Buat stream dari model (misalnya menggunakan HuggingFace Inference API atau llama.cpp server)
  const stream = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 256, temperature: 0.7, stream: true },
    }),
  });

  // Alihkan respons langsung ke respons HTTP dengan proper header
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const reader = stream.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // HuggingFace mengembalikan teks biasa; kita format sebagai SSE
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
  } finally {
    reader.cancel();
    res.end();
  }
});

export default router;
```

### Contoh dengan Vercel AI SDK (lebih mudah)
```js
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY });
const openai = new OpenAIApi(configuration);

export const runtime = 'edge'; // atau 'nodejs' jika Anda pakai Node server

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

## 3. Mengkonsumsi Stream di React
### Menggunakan EventSource (SSE)
```tsx
import { useEffect, useState, useRef } from 'react';

export default function AIChat() {
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;

    // Jika ada stream yang aktif, tutup dulu
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setResponse('');
    setIsStreaming(true);

    // Buat AbortController untuk membatalkan ketika diperlukan
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.body) throw new Error('No readable body');

      const encoder = new TextDecoder('utf-8');
      let buffer = '';

      const reader = res.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += encoder.decode(value, { stream: true });

        // Parse SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // sisa yang belum lengkap

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const json = JSON.parse(data);
              setResponse((prev) => prev + (json.text ?? ''));
            } catch {
              // ignore invalid JSON
            }
          }
        }
      }

      reader.cancel();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Stream error:', err);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsStreaming(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          placeholder="Tanyakan sesuatu..."
          rows={3}
          required
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          {isStreaming ? 'Berhenti...' : 'Kirim'}
        </button>
        <button type="button" onClick={handleStop} disabled={!isStreaming}>
          Stop
        </button>
      </form>

      {isStreaming && <p>Sedang menghasilkan respons…</p>}
      <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
        {response || 'Respons akan muncul di sini...'}
      </div>
    </div>
  );
}
```

### Menggunakan pustaka `ai/react` (Vercel)
```tsx
import { useCompletion } from 'ai/react';

export default function Chat() {
  const { completion, isLoading, stop } = useCompletion({
    api: '/api/ai/stream',
    // optional: body: (initial: { prompt: string }) => ({ prompt: initial.prompt }),
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          // useCompletion akan otomatis memulai stream ketika prompt berubah
        }}
      >
        <input
          name="prompt"
          placeholder="Ketik pertanyaan..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Menghentikan...' : 'Kirim'}
        </button>
        <button type="button" onClick={stop} disabled={!isLoading}>
          Stop
        </button>
      </form>

      <div style={{ whiteSpace: 'pre-wrap' }}>{completion}</div>
    </div>
  );
}
```

## 4. Pertimbangan Performa dan UX
### Debounce dan Throttling
- Jika pengguna mengetik cepat, Anda mungkin tidak ingin memulai stream di setiap perubahan.
- Gunakan debounce pada input sebelum memanggil endpoint.

### Menangani Potongan Terlalu Besar
- Beberapa model mengirimkan chunk yang cukup besar (mis. 20 token sekaligus).
- Jika re‑render terasa berat, akumulasi beberapa chunk sebelum memperbarui state, atau gunakan `useRef` untuk menyimpan teks mentah dan hanya memperbarui UI setiap 100ms.

### Menangani Kesalahan dan Timeout
- Tambahkan timeout pada fetch (mis. menggunakan `AbortController` dengan `setTimeout`).
- Tampilkan pesan kesalahan dan tombol “Coba lagi”.

### Memori dan Garbage Collection
- Jika stream sangat panjang (ribuan token), pertimbangkan untuk membatasi panjang respons yang ditampilkan (mis. hanya terakhir 2000 karakter) atau menyimpan ke virtualized list.

## 5. Kasus Penggunaan Lanjutan
### Streaming dengan Konteks Percakapan
- Kirim seluruh riwayat chat sebagai bagian dari prompt, atau gunakan endpoint yang memori percakapan di sisi server.
- Tampilkan pesan pengguna dan AI secara bergantian.

### Fitur “Stop” dan “Regenerate”
- Tombol Stop mengirim sinyal abort ke fetch.
- Tombol Regenerate dapat membatalkan stream saat ini dan memulai baru dengan parameter yang sama atau berbeda (mis. meningkatkan temperature).

### Integrasi dengan UI Tiruan Penulis
- Tambahkan kursor berkedip di akhir teks yang sedang di‑stream untuk efek mengetik.
- Gunakan animasi CSS untuk memberikan rasa hidup.

## 6. Deployment
### Vercel (Node.js atau Edge)
- Letakkan route API di `/app/api/ai/stream/route.ts` (untuk Next.js 13+ App Router) atau `/pages/api/ai/stream.ts` (Pages).
- Vercel Edge Functions ideal untuk streaming dengan latensi rendah.

### Docker / Self‑hosted
- Jalankan server Node.js atau Python yang menyediakan endpoint `/api/ai/stream`.
- Letakkan di belakang nginx atau CORS‑enabled reverse proxy.

### Skalabilitas
- Gunakan sistem antrian (mis. Redis BullMQ) jika banyak permintaan simultan agar satu model tidak kelebihan beban.
- Untuk skala tinggi, pertimbangkan menggunakan layanan inference terkelola seperti HuggingFace Inference Endpoints atau TensorRT-LLM.

## Kesimpulan
Streaming respons AI ke React tidak lagi hanya demonstrasi teknis—ini menjadi harapan pengguna untuk aplikasi interaktif modern. Dengan memilih transport yang sesuai (SSE untuk satu‑arah, WebSocket untuk dua‑arah), membangun endpoint yang mengeluarkan token per token, dan mengonsumsi stream dengan cara yang efisien dan responsif, Anda dapat menciptakan pengalaman yang:
- Responsif: pengguna melihat progres secara real‑time.
- Fleksibel: mudah ditambahkan fitur seperti stop, regenerate, atau perintah tengah‑jalan.
- Skalabel: dapat dijalankan di serverless, edge, atau infrastruktur mandiri.

Selanjutnya, coba integrasikan pola ini ke dalam fitur yang Anda bangun—misalnya asisten penulisan dokumen, generator kode inline, atau chatbot dukungan pelanggan. Teknik dasar sama; hanya perlu menyesuaikan prompt dan cara Anda menampilkan hasil.

Selamat bersตรีam!
