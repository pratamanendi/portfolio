---
title: Building a Scalable Web App Architecture - Frontend to Backend
description: Learn how to architect modern web applications from frontend to backend. Covers API design, state management, caching, and deployment strategies.
pubDate: 2025-01-25
---

## The Big Picture

Scalable = fast, reliable, maintainable. Architecture is 80% of the work.

```
User Browser
     ↓
Frontend (React/Vue/Astro)
     ↓
API Gateway / Load Balancer
     ↓
Backend Services (Microservices)
     ↓
Data Layer (Database, Cache)
```

Let's build this brick-by-brick.

## Frontend Architecture

### Component Structure

Keep components small and focused. Max 200 lines.

```
src/
├── components/
│   ├── common/          # Reusable (Button, Input, Card)
│   ├── features/        # Feature-specific (UserProfile, ProductCard)
│   └── layouts/         # Page layouts
├── hooks/               # Custom React Hooks
├── services/            # API calls, utilities
├── stores/              # State management (Context, Zustand)
└── types/               # TypeScript interfaces
```

### State Management Strategy

**Small app:** React Context + useReducer  
**Medium app:** Zustand or Pinia  
**Large app:** Redux + Redux Toolkit

```jsx
// Zustand store (recommended)
import create from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Use in components
function Profile() {
  const { user, logout } = useUserStore();
  return (
    <div>
      {user?.name}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Data Fetching Pattern

Use React Query (TanStack Query) for server state.

```jsx
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache 5 min
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorAlert error={error} />;
  return users.map(u => <UserCard key={u.id} {...u} />);
}
```

Benefits:
- Automatic caching
- Stale data handling
- Request deduplication
- Optimistic updates

## API Design

### RESTful Endpoints

```
GET    /api/users              # List
POST   /api/users              # Create
GET    /api/users/:id          # Read
PATCH  /api/users/:id          # Update
DELETE /api/users/:id          # Delete
```

### Versioning

```
GET /api/v1/users              # Keep old API alive
GET /api/v2/users              # New API with breaking changes
```

### Response Format

```json
{
  "success": true,
  "data": { "id": 1, "name": "Alice" },
  "error": null,
  "timestamp": "2025-01-25T10:30:00Z"
}
```

### Pagination

```json
GET /api/users?page=2&limit=20

{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 500,
    "pages": 25
  }
}
```

## Backend Architecture

### Microservices Pattern

Split large monolith into services:

```
API Gateway → Auth Service
           → User Service
           → Product Service
           → Order Service
```

Each service owns its database. Communicate via REST/gRPC.

### Database Design

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### Caching Strategy

```
Request
  ↓
Check Cache (Redis) → Hit? Return
  ↓ Miss
Hit Database
  ↓
Store in Cache (TTL: 5 min)
  ↓
Return to Client
```

Example:
```js
async function getUserById(userId) {
  // Check cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  // Miss: fetch from DB
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

  // Store in cache for 5 minutes
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user));

  return user;
}
```

## Infrastructure & Deployment

### Containerization

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .
EXPOSE 3000

CMD ["node", "server.js"]
```

Deploy to Kubernetes or Docker Swarm.

### Load Balancing

```nginx
upstream backend {
  server api1.example.com:3000;
  server api2.example.com:3000;
  server api3.example.com:3000;
}

server {
  location /api {
    proxy_pass http://backend;
  }
}
```

### CDN for Static Assets

```
Client Request
  ↓
CloudFlare/Cloudinary CDN
  ↓ Cache Hit? Return
  ↓ Cache Miss
Origin Server
```

Configure in frontend:
```jsx
function Image({ src }) {
  const cdnUrl = `https://cdn.example.com/${src}`;
  return <img src={cdnUrl} />;
}
```

## Monitoring & Observability

### Logging

```js
// Use structured logging
logger.info('User login', {
  userId: user.id,
  ip: req.ip,
  timestamp: new Date(),
});

logger.error('Database connection failed', {
  error: err.message,
  service: 'user-service',
  severity: 'critical',
});
```

### Metrics

Track:
- API response time (avg, p95, p99)
- Error rates
- Database query times
- Cache hit rates

Use Prometheus + Grafana.

### Alerting

```yaml
# Alert if error rate > 5%
alert: HighErrorRate
  expr: error_rate > 0.05
  for: 5m
  action: notify_slack
```

## Security Best Practices

```
1. Use HTTPS everywhere
2. Implement rate limiting
3. Validate all inputs (SQL injection, XSS)
4. Use secrets management (HashiCorp Vault)
5. Regular security audits
6. CORS policy configured
7. JWT tokens with short expiry
8. Database backups (automated, tested)
```

## Scaling Timeline

**0-10K users:**
- Single server + database
- Cache with Redis optional
- Simple monitoring

**10K-100K users:**
- Load balance API servers (2-4 instances)
- Implement caching layer
- Separate read replicas (database)
- CI/CD pipeline

**100K+ users:**
- Microservices
- Kubernetes orchestration
- Multi-region deployment
- Advanced monitoring (Datadog, New Relic)
- Database sharding

## Checklist

- [ ] Component structure organized
- [ ] State management (Context/Zustand/Redux)
- [ ] API with proper versioning
- [ ] Database with indexes
- [ ] Redis caching layer
- [ ] Load balancing configured
- [ ] Containerized with Docker
- [ ] Monitoring + logging
- [ ] Automated backups
- [ ] Security review done

## Conclusion

Good architecture scales naturally. Start simple, add complexity only when needed.

**Next:** Deep dive into Kubernetes for container orchestration.
