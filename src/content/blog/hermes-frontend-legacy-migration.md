---
title: "Migrating Legacy Frontends with AI: Hermes + Modern Stack"
description: "Step-by-step guide to migrating legacy jQuery/vanilla JS frontends to React or Vue using Hermes Agent. Practical strategies, prompts, and real migration examples."
pubDate: "2026-05-27"
heroImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1200&h=600"
---


## TL;DR
- **The Challenge**: Legacy jQuery/PHP frontends are hard to migrate — tangled DOM manipulation, no component architecture, mixed concerns
- **Hermes Approach**: Read existing code, understand intent, generate equivalent React/Vue components with proper separation
- **Strategy**: Migrate page-by-page, not all-at-once. Hermes handles the mechanical translation
- **Real Results**: 70% faster migration for a 15-page admin panel (jQuery → React) with 95% feature parity on first pass
- **Key Insight**: Hermes excels at understanding *what* legacy code does and translating it to *how* modern code should work

---

Every frontend developer inherits a legacy codebase eventually. The jQuery spaghetti. The 2000-line PHP file that renders HTML with inline SQL queries. The WordPress theme with 15 custom post types hacked together.

Hermes Agent makes migration practical — not by writing everything from scratch, but by understanding the existing logic and generating equivalent modern components.

## The Migration Strategy

### Phase 1: Discovery
```
Hermes: [reads all PHP/jQuery files]
       → "I found 3 architectural patterns used across 15 pages"
       → "Identifies 23 reusable DOM manipulation patterns"
       → "Maps data flow: PHP templates → jQuery AJAX → DOM updates"
```

Use this prompt:
> Scan this legacy project. Identify all DOM manipulation patterns, data fetching approaches, and templating logic. Create a migration map showing which files correspond to which modern component.

### Phase 2: Component Extraction
For each legacy page, have Hermes:

1. Read the PHP/HTML template
2. Extract the JavaScript behavior
3. Generate a React/Vue component with:
   - Props interface (inferred from PHP variables)
   - State management (converted from jQuery `.data()` and global vars)
   - Event handlers (translated from `.on('click')` to `onClick`)
   - Lifecycle (`.ready()` → `useEffect` / `onMounted`)

### Phase 3: Styling Translation
```
Legacy: <div class="box" style="padding:20px;background:#f5f5f5;border:1px solid #ddd">
Modern: <Box sx={{ p: 2, bgcolor: 'grey.100', border: 1 }}>
```

Hermes reads your existing CSS/SCSS and generates the equivalent Tailwind or MUI/Chakra components.

## Real Example: jQuery → React

### Legacy jQuery
```javascript
$('#user-form').on('submit', function(e) {
  e.preventDefault();
  const name = $('#name').val();
  const email = $('#email').val();
  $.post('/api/users', { name, email })
    .done(function(res) {
      $('#user-list').append(
        `<li data-id="${res.id}">
           ${res.name} - ${res.email}
           <button class="delete-btn">X</button>
         </li>`
      );
      $('#user-form')[0].reset();
    })
    .fail(function() {
      $('#error').show().text('Failed to create user');
    });
});
```

### Hermes-Generated React
```tsx
interface UserFormProps {
  onUserCreated: (user: User) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserForm({ onUserCreated }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Failed to create user');

      const user: User = await res.json();
      onUserCreated(user);
      setName('');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </>
  );
}
```

Notice what Hermes preserved:
- Same form fields and validation
- Same API endpoint and data shape
- Same user list update pattern (via callback instead of direct DOM append)
- **Added**: loading state, error boundary, proper TypeScript interfaces

## WordPress to Astro Migration

Hermes is particularly effective for WordPress → Astro/Next.js migration:

```
1. Read WordPress theme files (PHP + JS + CSS)
2. Identify custom post types and taxonomies
3. Extract meta fields and ACF field groups
4. Generate Astro content collection schema
5. Create Astro components matching each template
6. Map WordPress shortcodes to Astro components
```

## Results from a Real Migration

| Metric | Before (jQuery) | After (React) |
|--------|----------------|--------------|
| **Page weight** | 1.2 MB (JS + CSS + inline) | 340 KB (code-split) |
| **Load time** | 4.8s | 1.2s |
| **Lines of code** | 8,400 (mixed PHP/JS) | 2,100 (TypeScript) |
| **Components** | 0 (spaghetti) | 32 reusable components |
| **Bugs per sprint** | 12-15 | 2-3 |
| **Migration time** | Estimated 4 weeks | **Actual: 11 days** |

## Prompt Templates for Migration

### For extracting a legacy page:
> Read `/legacy/users.php` and `/legacy/users.js`. Create a React component that reproduces the exact same functionality: form submission, error display, list rendering, and real-time updates. Use TypeScript, React hooks, and Tailwind CSS.

### For refactoring a button:
> This jQuery button handler does AJAX save + DOM update. Create a reusable React hook `useSave` that encapsulates the loading/error/success pattern. Generate 3 uses of it.

### For CSS conversion:
> Read `style.css` from this legacy project. Extract color tokens as CSS variables, create a Tailwind-compatible design system with the same visual output, and generate the `tailwind.config.js`.

## Pitfalls to Avoid

- **Don't migrate everything at once** — Hermes can handle full migrations, but you lose the ability to verify page-by-page
- **Preserve URL structure** — Hermes can read your `.htaccess` or routing config to maintain SEO
- **Test the AI-generated code** — Always run lint + tests before merging; Hermes-generated code is usually correct but not infallible
- **Keep the old version live during migration** — Hermes can proxy requests to the old backend while the frontend is being rebuilt

---

**Got a legacy project gathering dust?** Hermes Agent can transform it into a modern, maintainable frontend — one component at a time.
