---
title: "Next.js + AI: Full-Stack Intelligence"
description: "Build complete AI applications with Next.js - from API routes to streaming responses and edge functions. Full-stack guide."
pubDate: "2026-05-14"
heroImage: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&q=80&w=1200&h=600"
---


Next.js is the perfect framework for building full-stack AI applications. API routes, middleware, and edge functions give you everything you need to build intelligent applications at scale.

## Architecture

```
Frontend (React)
    ↓
API Routes (/api/*)
    ↓
AI Service (Claude, GPT-4, etc.)
    ↓
Database
```

## Building an AI API Route

```javascript
// pages/api/generate.js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    res.status(200).json({ content: message.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Streaming Responses

```javascript
// pages/api/stream.js
export default async function handler(req, res) {
  const { prompt } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify(chunk.delta)}\n\n`);
    }
  }

  res.end();
}
```

## Frontend Integration

```jsx
// components/AIGenerator.jsx
import { useState } from 'react';

export function AIGenerator() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (prompt) => {
    setLoading(true);
    setOutput('');

    const response = await fetch('/api/stream', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            setOutput(prev => prev + data.text);
          }
        }
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => handleGenerate('Write a poem')}>Generate</button>
      <div className="output">{output}</div>
    </div>
  );
}
```

Next.js makes it incredibly easy to build full-stack AI applications that scale.
