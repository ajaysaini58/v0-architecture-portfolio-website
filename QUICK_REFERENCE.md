# ArchConnect - Developer Quick Reference

## 🚀 Getting Started (2 Minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Add environment variables to .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# 3. Run Supabase migration (in Supabase SQL Editor)
# Copy contents of: supabase/migrations/001_init_schema.sql

# 4. Start dev server
pnpm dev

# 5. Open http://localhost:3000
```

---

## 📂 File Quick Links

| What | Where |
|------|-------|
| Types | `/lib/types.ts` |
| Validation | `/lib/validation.ts` |
| Supabase Helpers | `/lib/supabase.ts` |
| Auth Provider | `/components/auth-provider.tsx` |
| Homepage | `/app/page.tsx` |
| Signup | `/app/signup/page.tsx` |
| Signin | `/app/signin/page.tsx` |
| Dashboard | `/app/dashboard/page.tsx` |
| API - Auth Verify | `/api/auth/verify/route.ts` |
| API - Projects | `/api/projects/route.ts` |
| API - Portfolios | `/api/portfolios/route.ts` |
| API - Blog | `/api/blog/posts/route.ts` |
| Styles | `/app/globals.css` |
| Setup Docs | `SUPABASE_SETUP.md` |
| Full Guide | `IMPLEMENTATION_GUIDE.md` |
| README | `README_NEW.md` |

---

## 🔐 Authentication

### Check if User is Logged In
```typescript
'use client';
import { useAuth } from '@/components/auth-provider';

export default function MyComponent() {
  const { user, role, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  return <div>Welcome {user?.full_name}</div>;
}
```

### Protect a Route
```typescript
'use client';
import { useRequireAuth } from '@/components/auth-provider';

export default function ProtectedPage() {
  useRequireAuth(); // Auto-redirects to /signin
  return <div>Protected content</div>;
}
```

### Protect by Role
```typescript
'use client';
import { useRequireRole } from '@/components/auth-provider';

export default function ArchitectOnly() {
  useRequireRole('architect'); // Only architects can see this
  return <div>Architect content</div>;
}
```

### Sign Out
```typescript
const { signOut } = useAuth();

<button onClick={signOut}>Sign Out</button>
```

---

## 💾 Database Operations

### Query Data
```typescript
import { supabase } from '@/lib/supabase';

// Get all published blog posts
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published')
  .order('published_at', { ascending: false });

// Get single project
const { data: project } = await supabase
  .from('projects')
  .select('*, client:client_profiles(*)')
  .eq('id', projectId)
  .single();
```

### Use Helper Functions
```typescript
import { 
  getArchitects, 
  searchArchitects, 
  getOpenProjects,
  createPortfolioItem 
} from '@/lib/supabase';

// Get featured architects
const architects = await getFeaturedArchitects(6);

// Search with filters
const results = await searchArchitects({
  specialties: ['Residential Design'],
  min_rating: 4.5,
  max_hourly_rate: 200
});

// Get open projects
const projects = await getOpenProjects({ category: 'Commercial' });

// Create portfolio item
const portfolio = await createPortfolioItem(
  architectId,
  'Project Title',
  'Description...',
  'Commercial',
  ['image1.jpg', 'image2.jpg'],
  ['Modern', 'Sustainable']
);
```

---

## ✓ Form Validation

### Import Schema
```typescript
import { 
  architectSignupSchema,
  clientSignupSchema,
  createProjectSchema,
  submitBidSchema
} from '@/lib/validation';

import type {
  ArchitectSignupInput,
  CreateProjectInput
} from '@/lib/validation';
```

### Validate Form Data
```typescript
const result = architectSignupSchema.safeParse(formData);

if (!result.success) {
  const errors = result.error.flatten().fieldErrors;
  // Handle errors
} else {
  const validData = result.data;
  // Use validated data
}
```

### Validate in API Route
```typescript
import { createProjectSchema } from '@/lib/validation';

const body = await request.json();
const validation = createProjectSchema.safeParse(body);

if (!validation.success) {
  return NextResponse.json(
    { error: 'Validation error', details: validation.error.flatten() },
    { status: 400 }
  );
}

// Use validated data
const { title, description } = validation.data;
```

---

## 🎨 Styling Quick Tips

### Colors
```tsx
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-accent">Accent</div>
<div className="bg-background text-foreground">Background</div>
<div className="text-success">Success</div>
<div className="text-warning">Warning</div>
<div className="text-destructive">Error</div>
```

### Common Patterns
```tsx
// Button styles
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
  Click me
</button>

// Card
<div className="bg-card border border-border rounded-lg p-6">
  Card content
</div>

// Grid responsive
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// Hover effects
<div className="hover:shadow-lg hover:border-primary transition-all">
  Hover me
</div>
```

---

## 📡 API Endpoints

### Verify Auth
```bash
GET http://localhost:3000/api/auth/verify
# Returns: { authenticated: true, user, profile }
```

### List Projects
```bash
GET http://localhost:3000/api/projects?status=open&limit=20&offset=0
# Returns: { data, total, page, per_page, total_pages }
```

### Create Project
```bash
POST http://localhost:3000/api/projects
Content-Type: application/json

{
  "title": "Project Name",
  "description": "...",
  "category": "Commercial",
  "budget_min": 50000,
  "budget_max": 100000,
  "specialties_required": ["Commercial Design"],
  "timeline": "6 months"
}
```

### List Portfolios
```bash
GET http://localhost:3000/api/portfolios?architect_id=xyz&limit=20
```

### List Blog Posts
```bash
GET http://localhost:3000/api/blog/posts?status=published&limit=10
```

---

## 🔗 User Roles

```
architect     → Portfolio, bid on projects, messaging
client        → Post projects, find architects, messaging
student       → Find internships, mentorship, messaging
company_hr    → Post jobs, manage hiring, messaging
admin         → Content moderation, user management
```

---

## 🗂️ Table Reference

### Users
```
id (uuid), email, full_name, role, avatar_url, bio, phone, 
location, country, verified, verified_at, created_at, updated_at
```

### Architect Profiles
```
id, user_id, specialties[], experience_years, hourly_rate, 
bio_detailed, website_url, portfolio_count, rating, total_projects,
response_time_hours, verified_badge, is_available
```

### Client Profiles
```
id, user_id, company_name, company_type, industry, company_size,
company_website, company_logo_url, total_projects_posted, 
response_rate, total_budget_spent
```

### Projects
```
id, client_id, posted_by_user_id, title, description,
budget_min, budget_max, budget_type, status, category,
specialties_required[], location, timeline, attachments[],
views, bid_count, selected_architect_id, deadline
```

### Portfolios
```
id, architect_id, title, description, category, images[],
project_duration, budget_range, location, tags[], featured,
views, likes
```

### Blog Posts
```
id, author_id, title, slug, content, excerpt, featured_image,
status, category, tags[], published_at, views
```

### Messages
```
id, sender_id, recipient_id, content, read, read_at, created_at
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Supabase env vars missing" | Add to `.env.local` |
| "Permission denied" | Check RLS policies in Supabase |
| "Signup not saving" | Verify migrations executed, check RLS |
| "API returns 401" | Verify user auth session, check role |
| Dev server won't start | `rm -rf .next && pnpm dev` |
| Types not working | Make sure to run `pnpm install` |
| Database connection error | Check Supabase project is active |

---

## 📚 Key Imports

```typescript
// Auth
import { useAuth, useRequireAuth, useRequireRole } from '@/components/auth-provider';

// Database helpers
import { supabase, getArchitects, createPortfolioItem, getOpenProjects } from '@/lib/supabase';

// Types
import type { User, UserRole, ArchitectProfile, Project, Bid } from '@/lib/types';

// Validation
import { architectSignupSchema, createProjectSchema } from '@/lib/validation';
import type { ArchitectSignupInput, CreateProjectInput } from '@/lib/validation';

// Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

---

## ⚡ Performance Tips

- Use `useAuth()` for current user info (cached)
- Pre-fetch data server-side when possible
- Cache API responses with SWR or React Query
- Use indexed columns for filtering
- Limit results to 20-50 per page

---

## 📞 Need Help?

1. Check `IMPLEMENTATION_GUIDE.md` for detailed docs
2. Check `README_NEW.md` for setup guide
3. Check Supabase dashboard for errors
4. Check browser DevTools → Console
5. Check Network tab for API responses

---

**Last Updated**: June 2026 | Status: Ready for Development
