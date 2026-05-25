---
title: React Hooks Best Practices in 2025
description: Master React Hooks with proven patterns, performance optimization, and common pitfalls to avoid when building scalable applications.
pubDate: 2025-01-15
updatedDate: 2025-01-20
---

## Introduction

React Hooks revolutionized how we write components. Five years in, patterns have crystallized. Let's explore battle-tested best practices for building maintainable, performant React apps with Hooks.

## 1. Custom Hooks for Logic Reuse

Extract complex logic into custom Hooks instead of wrapping components in HOCs.

```jsx
// ✅ Good: Reusable custom Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Use across multiple components
function UserProfile({ userId }) {
  const { data: user, loading } = useFetch(`/api/users/${userId}`);
  return loading ? <Spinner /> : <div>{user.name}</div>;
}
```

## 2. Optimize Dependencies in useEffect

Missing or incorrect dependencies cause bugs. Use ESLint plugin to catch them.

```jsx
// ❌ Bad: Missing dependency
useEffect(() => {
  console.log(userId);
  fetchData(userId);
}, []); // userId missing!

// ✅ Good: Correct dependencies
useEffect(() => {
  console.log(userId);
  fetchData(userId);
}, [userId]);

// ✅ Better: Memoize callback to avoid re-runs
const handleFetch = useCallback(() => {
  fetchData(userId);
}, [userId]);

useEffect(() => {
  handleFetch();
}, [handleFetch]);
```

## 3. useContext + useReducer for State Management

For medium complexity, combine Context + Reducer. Beats Redux for small-to-medium projects.

```jsx
const AppContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, { user: null });
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be inside AppProvider');
  return context;
}
```

## 4. Memoize Expensive Components

Use `memo` to prevent unnecessary re-renders of child components.

```jsx
// ✅ Memoize heavy components
const ExpensiveList = memo(({ items }) => {
  return items.map(item => <ComplexItem key={item.id} {...item} />);
}, (prev, next) => {
  // Custom comparison: only re-render if items changed
  return prev.items === next.items;
});

// Use with useCallback for stable callbacks
function Parent() {
  const [count, setCount] = useState(0);
  const handleItemClick = useCallback((id) => {
    console.log(id);
  }, []); // Stable reference

  return <ExpensiveList items={items} onItemClick={handleItemClick} />;
}
```

## 5. Performance: useTransition for UI Updates

For state updates that don't need immediate visual feedback, use `useTransition` to keep UI responsive.

```jsx
function SearchResults() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const value = e.target.value;
    setInput(value); // Update input immediately (urgent)
    
    startTransition(() => {
      // Filter results in background (non-urgent)
      const filtered = database.search(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={input} onChange={handleSearch} />
      {isPending && <Spinner />}
      {results.map(r => <Result key={r.id} {...r} />)}
    </div>
  );
}
```

## 6. Avoid Props Drilling with Context

For deeply nested props, use Context instead of passing through 10 intermediate components.

```jsx
// ❌ Props drilling hell
<Page theme={theme}>
  <Header theme={theme}>
    <Nav theme={theme}>
      <Link theme={theme} />
    </Nav>
  </Header>
</Page>

// ✅ Context solution
const ThemeContext = createContext();

function Page({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

function Link() {
  const theme = useContext(ThemeContext); // Direct access!
  return <a style={{ color: theme === 'dark' ? '#fff' : '#000' }} />;
}
```

## 7. Clean Up Side Effects

Always return a cleanup function from useEffect to prevent memory leaks.

```jsx
useEffect(() => {
  const subscription = eventBus.subscribe('update', handleUpdate);
  const timer = setTimeout(doSomething, 5000);
  
  // Cleanup function runs before effect runs again or component unmounts
  return () => {
    subscription.unsubscribe();
    clearTimeout(timer);
  };
}, []);
```

## Conclusion

Master these patterns and your React code will be cleaner, faster, and easier to maintain. Hooks are powerful—use them wisely.

**Next:** Explore concurrent features like `useDeferredValue` for advanced optimization.
