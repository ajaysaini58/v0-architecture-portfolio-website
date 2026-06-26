# ArchConnect - Professional Architecture Networking Platform
## Complete Implementation Guide

---

## Project Overview

ArchConnect is a comprehensive full-stack platform connecting architects with clients, featuring role-based authentication, portfolio management, project bidding, blogging, and direct messaging capabilities.

### Key Features Implemented

#### 1. **Multi-Role Registration System**
- **5 User Roles**: Architect, Client, Company HR, Student, Admin
- **Smart Role-Based Signup Flow**: 3-step process with role-specific fields
- **Progressive Profiling**: Basic info → Role details → Confirmation
- **Data Validation**: Zod schemas for all form inputs

#### 2. **Comprehensive Database Schema**
- **17 Core Tables**: Users, profiles (architect/client/student/hr), portfolios, blog posts, projects, bids, messages, reviews, connections
- **Row Level Security (RLS)**: Fine-grained access control for all tables
- **Automatic Timestamps**: `updated_at` triggers for data integrity
- **Performance Indexes**: Optimized queries for all common filters

#### 3. **Professional Authentication**
- **Supabase Auth Integration**: Email + password authentication
- **Auth Context Provider**: Centralized user state management
- **Protected Routes**: Role-based access control with custom hooks
- **Auth Guards**: `useRequireAuth()` and `useRequireRole()` hooks

#### 4. **Modern UI/UX Design**
- **Color System**: Deep navy primary + warm gold accents
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Professional Components**: Card-based, gradient accents, smooth transitions
- **Consistent Typography**: Inter (sans-serif) + DM Serif Display (serif)

#### 5. **Core APIs**
- **Authentication**: `/api/auth/verify` - Verify user sessions
- **Projects**: `/api/projects` - Create and list projects (GET/POST)
- **Portfolios**: `/api/portfolios` - Manage architect portfolios
- **Blog Posts**: `/api/blog/posts` - Publish blog articles
- **All APIs include**: Input validation, auth checks, error handling

---

## Setup Instructions

### 1. Environment Variables

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Setup

Execute the migration SQL:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a **New Query**
4. Copy entire contents of `supabase/migrations/001_init_schema.sql`
5. Execute the query

This creates:
- All 17 tables with proper relationships
- Row Level Security policies
- Automatic timestamp triggers
- Performance indexes

### 3. Verify Installation

Run this SQL to confirm all tables created:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 20+ tables including:
- users, architect_profiles, client_profiles, student_profiles, hr_profiles
- portfolios, blog_posts, blog_comments, blog_likes
- projects, bids, messages, conversations
- reviews, connections, portfolio_likes

---

## File Structure

```
/app
  /api
    /auth/verify              # Auth verification endpoint
    /projects                 # Project CRUD operations
    /portfolios               # Portfolio management
    /blog/posts              # Blog post operations
  /signup                     # Multi-role signup flow (3-step)
  /signin                     # Professional sign-in page
  /dashboard                  # Role-based user dashboard
  page.tsx                    # Modern homepage
  layout.tsx                  # Root layout with fonts
  globals.css                 # Design system + color tokens

/components
  /ui                         # shadcn/ui components
  auth-provider.tsx           # Auth context + hooks
  navigation.tsx              # Top navigation bar
  footer.tsx                  # Footer component

/lib
  types.ts                    # 375+ lines of TypeScript interfaces
  supabase.ts                 # 620+ lines of helper functions
  validation.ts               # Zod schemas for all forms
  
/supabase/migrations
  001_init_schema.sql         # Complete database schema
```

---

## Database Schema Overview

### User Tables

**users**
- Extends Supabase auth.users
- Stores: full_name, email, role, avatar_url, bio, phone, location, verified status

**architect_profiles**
- Specialties array, experience_years, hourly_rate, portfolio_count, rating
- verified_badge, is_available, website_url

**client_profiles**
- company_name, company_type, industry, company_website
- Response rate, total budget spent

**student_profiles**
- University, degree, graduation_year, interests array
- Seeking internship/mentorship flags

**hr_profiles**
- Company info, department, job posting count, hire count

### Content Tables

**portfolios**
- Architect portfolio items with images array and tags
- featured flag, views, likes counters

**blog_posts**
- Full content, excerpt, featured_image, status (draft/published/archived)
- Category, tags, published_at timestamp

**blog_comments**
- Comments on blog posts with author_id and likes

**blog_likes**
- Tracking likes on individual blog posts (unique per user/post)

### Project & Bidding

**projects**
- Title, description, budget_min/max, budget_type
- Status: open|in_progress|completed|cancelled
- Specialties required, location, timeline, deadline

**bids**
- Architect bids on projects with bid_amount, proposal, timeline
- Status: pending|accepted|rejected|withdrawn

### Communication

**messages**
- Direct messages with sender/recipient, read status
- read_at timestamp for tracking

**conversations**
- Conversation threads between two users
- last_message_at for sorting

### Additional

**reviews** - Architect ratings (1-5) with comments
**connections** - User follows/connections network
**portfolio_likes** - Likes on portfolio items

---

## Key Type Definitions

All types are in `/lib/types.ts` (375 lines):

```typescript
// User types
User, UserRole ('architect' | 'client' | 'company_hr' | 'student' | 'admin')

// Profile types
ArchitectProfile, ClientProfile, StudentProfile, HRProfile

// Content types
Portfolio, BlogPost, BlogComment, BlogLike

// Project types
Project, Bid
ProjectStatus ('open' | 'in_progress' | 'completed' | 'cancelled')
BidStatus ('pending' | 'accepted' | 'rejected' | 'withdrawn')

// Communication
Message, Conversation, Connection

// Form inputs
ArchitectSignupInput, ClientSignupInput, StudentSignupInput, HRSignupInput
CreateProjectInput, CreatePortfolioInput, CreateBlogPostInput, SubmitBidInput

// API responses
ApiResponse<T>, PaginatedResponse<T>
```

---

## Authentication Flow

### Signup (3 Steps)

**Step 1: Role Selection**
- Choose from 4 roles: Architect, Client, HR, Student
- Visual cards with descriptions

**Step 2: Basic Information**
- Email, password, full name, phone
- Validation: 8+ char password, email format
- Error handling with toast messages

**Step 3: Role-Specific Details**
- Architect: Specialties (checkboxes), experience, hourly rate, website
- Client: Company type, name, industry
- Student: University, degree, graduation year, seeking flags
- HR: Company name, department

**Confirmation**
- Review all entered information
- Create account with Supabase Auth
- Create user profile in `users` table
- Create role-specific profile (architect_profiles, client_profiles, etc.)
- Success message → Auto-redirect to signin

### Signin

- Email + password authentication
- "Forgot Password" link (ready to implement)
- Redirect to dashboard on success
- Error handling with specific messages

### Protected Routes

```typescript
// In page.tsx
'use client';
import { useRequireAuth } from '@/components/auth-provider';

export default function ProtectedPage() {
  useRequireAuth(); // Redirects to /signin if not authenticated
  // Component code...
}

// With role requirement
import { useRequireRole } from '@/components/auth-provider';

export default function ArchitectOnlyPage() {
  useRequireRole('architect'); // Redirects if user not architect
  // Component code...
}
```

---

## Validation & Error Handling

### Form Validation (Zod Schemas)

```typescript
// All schemas are in /lib/validation.ts

// Login
loginSchema

// Signup (base + role-specific)
baseSignupSchema
architectSignupSchema
clientSignupSchema
studentSignupSchema
hrSignupSchema

// Content creation
createPortfolioSchema
createBlogPostSchema
createProjectSchema
submitBidSchema

// Profile updates
updateProfileSchema
updateArchitectProfileSchema
updateClientProfileSchema

// Each schema includes field-level validation with error messages
```

### API Error Handling

All API routes include:
- Authentication verification
- Input validation against schemas
- Specific error messages
- Proper HTTP status codes (400, 401, 404, 500)
- Server-side security checks

---

## Color System

### Design Tokens (in globals.css)

```css
--primary: 217 100% 15%;           /* Deep Navy Blue */
--primary-foreground: 0 0% 100%;   /* White text on primary */

--secondary: 39 89% 49%;           /* Warm Gold */
--secondary-foreground: 217 100% 15%;  /* Navy text on gold */

--background: 210 40% 98%;         /* Soft Off-white */
--foreground: 217 40% 18%;         /* Navy text on background */

--accent: 39 89% 49%;              /* Gold accent */

--muted: 210 20% 93%;              /* Light Gray */
--muted-foreground: 217 20% 48%;   /* Medium Gray text */

--destructive: 0 84% 60%;          /* Red for errors */
--success: 142 71% 45%;            /* Green for success */
--warning: 38 92% 50%;             /* Yellow for warnings */
```

### Usage in Components

```tsx
// Using semantic tokens
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-background text-foreground">Background</div>
<div className="border border-border rounded-lg">Card</div>

// Hover states
<div className="hover:bg-primary/10">Hover</div>
<div className="hover:text-accent">Link Hover</div>

// Status colors
<div className="text-success">Success</div>
<div className="text-warning">Warning</div>
<div className="text-destructive">Error</div>
```

---

## API Routes

### /api/auth/verify

**GET** - Verify current user session

```bash
curl http://localhost:3000/api/auth/verify
```

Response:
```json
{
  "authenticated": true,
  "user": { /* Supabase user */ },
  "profile": { /* User profile from users table */ }
}
```

### /api/projects

**GET** - List projects with pagination

```bash
curl "http://localhost:3000/api/projects?status=open&limit=20&offset=0"
```

Response:
```json
{
  "data": [ /* projects array */ ],
  "total": 150,
  "page": 0,
  "per_page": 20,
  "total_pages": 8
}
```

**POST** - Create new project (auth required)

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d {
    "title": "Modern Office Design",
    "description": "Looking for...",
    "category": "Commercial",
    "budget_min": 50000,
    "budget_max": 100000,
    "specialties_required": ["Commercial Design"],
    "timeline": "6 months",
    "location": "New York, NY"
  }
```

### /api/portfolios

**GET** - List portfolios (public)

```bash
curl "http://localhost:3000/api/portfolios?architect_id=xyz"
```

**POST** - Create portfolio item (architect auth required)

### /api/blog/posts

**GET** - List published blog posts

```bash
curl "http://localhost:3000/api/blog/posts?status=published&limit=10"
```

**POST** - Create blog post (auth required)

---

## Next Steps to Complete

### Phase 4: Core Feature Pages
- [ ] Architect profile page
- [ ] Client profile page
- [ ] Project detail page with bidding
- [ ] Portfolio showcase page
- [ ] Blog post display page
- [ ] Search & filter pages

### Phase 5: Messaging System
- [ ] Message list page
- [ ] Conversation detail page
- [ ] Real-time message sync (Supabase subscriptions)
- [ ] Message notifications

### Phase 6: Advanced Features
- [ ] Admin dashboard for blog approval
- [ ] Review & rating system
- [ ] File uploads for portfolios
- [ ] Project contract templates
- [ ] Payment integration

### Phase 7: Deployment
- [ ] Environment setup for production
- [ ] Supabase production database
- [ ] Vercel deployment
- [ ] Performance monitoring
- [ ] Email notifications (SendGrid/Postmark)

---

## Common Tasks

### Add a New Field to User Profile

1. Update database schema (migration SQL)
2. Update TypeScript types in `/lib/types.ts`
3. Update Zod validation in `/lib/validation.ts`
4. Update form component to include field
5. Update API to save/return field

### Create a New Protected Route

```typescript
'use client';

import { useRequireRole } from '@/components/auth-provider';

export default function ArchitectPage() {
  useRequireRole('architect');
  // Component code...
}
```

### Add New Validation Schema

```typescript
// In /lib/validation.ts
export const mySchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive(),
});

export type MyInput = z.infer<typeof mySchema>;

// In API route
const validation = mySchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    { error: 'Validation error', details: validation.error.flatten() },
    { status: 400 }
  );
}
```

### Query Data with Supabase

```typescript
import { supabase, getArchitects, searchArchitects } from '@/lib/supabase';

// Pre-built helper functions
const architects = await getArchitects();
const featured = await getFeaturedArchitects(6);
const results = await searchArchitects({
  specialties: ['Residential Design'],
  min_rating: 4.5,
});

// Direct query
const { data, error } = await supabase
  .from('projects')
  .select('*, bids(*)')
  .eq('id', projectId)
  .single();
```

---

## Troubleshooting

### "Supabase environment variables missing"

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### "Permission denied" errors on data

Check RLS policies:
1. Go to Supabase dashboard → Authentication → Policies
2. Verify user is authenticated: `auth.uid()`
3. Check row-level restrictions match your query

### Signup not saving to database

1. Verify all migrations executed successfully
2. Check user role is valid: architect|client|company_hr|student|admin
3. Ensure correct user_id in request
4. Check RLS policies allow INSERT

### API returning 401 Unauthorized

1. Verify user session: `/api/auth/verify`
2. Check auth token in request headers
3. Ensure user has correct role for endpoint
4. Verify user has Supabase auth session

---

## Documentation Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zod Validation](https://zod.dev)

---

## Support

For issues or questions:
1. Check this guide and README files
2. Review Supabase dashboard for errors
3. Check browser console for client errors
4. Check server logs for API errors
5. Verify environment variables are set correctly

---

**Platform Status**: ✅ Phase 3 Complete - Authentication & Access Control ready
**Last Updated**: June 2026
