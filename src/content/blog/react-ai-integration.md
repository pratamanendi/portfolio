---
title: "Building AI-Powered React Applications"
description: "Practical patterns for integrating AI capabilities into React apps - from chat interfaces to intelligent forms. Production-ready examples."
pubDate: "2026-05-19"
heroImage: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&q=80&w=1200&h=600"
---

# Building AI-Powered React Applications

## TL;DR
- **What**: Patterns for integrating AI into React applications
- **Key Patterns**: Chat components, smart forms, streaming responses
- **Performance**: Debounce, cache, lazy load, use streaming
- **Best Practices**: Error handling, loading states, user feedback
- **Tools**: Claude API, OpenRouter, streaming endpoints

---

React is the perfect framework for building AI-powered applications. Its component model, state management, and ecosystem make it ideal for creating intelligent, responsive UIs.

## Core Patterns

### 1. AI Chat Component
```jsx
import { useState, useRef, useEffect } from 'react';

export function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
```

### 2. AI-Powered Form Validation
```jsx
export function SmartForm() {
  const [formData, setFormData] = useState({});
  const [suggestions, setSuggestions] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Get AI suggestions for the field
    const response = await fetch('/api/suggest', {
      method: 'POST',
      body: JSON.stringify({ field: name, value }),
    });

    const data = await response.json();
    setSuggestions(prev => ({ ...prev, [name]: data.suggestion }));
  };

  return (
    <form>
      <input name="email" onChange={handleChange} />
      {suggestions.email && <p className="suggestion">{suggestions.email}</p>}
    </form>
  );
}
```

### 3. Real-Time AI Streaming
```jsx
export function StreamingResponse() {
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);

  const handleStream = async (prompt) => {
    setStreaming(true);
    setResponse('');

    const response = await fetch('/api/stream', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setResponse(prev => prev + chunk);
    }

    setStreaming(false);
  };

  return (
    <div>
      <button onClick={() => handleStream('Write a poem')}>Generate</button>
      <div className="response">{response}</div>
    </div>
  );
}
```

## Performance Optimization

1. **Debounce AI calls** — Don't call the API on every keystroke
2. **Cache responses** — Store common queries
3. **Use streaming** — Show results as they arrive
4. **Implement loading states** — Keep users informed

## Error Handling

Always handle API failures gracefully:
```jsx
try {
  const response = await fetch('/api/ai');
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
} catch (error) {
  setError('Failed to get AI response. Please try again.');
}
```

## Conclusion

AI-powered React applications are no longer science fiction. With the right patterns and tools, you can build intelligent, responsive UIs that delight users.

Start small, iterate, and scale. The future of web development is AI-augmented.
