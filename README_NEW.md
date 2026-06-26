# ArchConnect - Professional Architecture Networking Platform

A modern, full-stack web application connecting architects with clients, featuring portfolio showcase, project bidding, blogging, and direct messaging.

## 🎯 Features

### For Architects
- ✨ Showcase stunning portfolios with galleries
- 💼 Browse and bid on projects
- 💬 Direct messaging with clients
- ⭐ Build verified reputation through reviews
- 📊 Manage your professional profile

### For Clients
- 🔍 Browse verified architect portfolios
- 📋 Post projects and receive competitive bids
- 💭 Direct communication with architects
- 📊 Project tracking and budget management
- ⭐ Rate and review architects

### For Students & HR
- 🎓 Students: Find internships and mentorship
- 💼 HR: Post job opportunities
- 🤝 Build professional networks
- 📚 Access industry insights and blogs

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (free tier available)
- Modern web browser

### 1. Clone & Install

```bash
git clone <repo>
cd <project>
pnpm install  # or npm install
```

### 2. Setup Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from your Supabase project:
1. Go to Settings → API
2. Copy Project URL and keys

### 3. Setup Database

1. Go to your Supabase project
2. Open SQL Editor
3. Create new query
4. Copy entire contents from `supabase/migrations/001_init_schema.sql`
5. Execute

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

### 5. Test Features

- **Homepage**: Browse platform features
- **Sign Up**: Create account with different roles
- **Sign In**: Login with test account
- **Dashboard**: Role-based dashboard with quick actions

---

## 📁 Project Structure

```
ArchConnect/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/verify/
│   │   ├── projects/
│   │   ├── portfolios/
│   │   └── blog/posts/
│   ├── signup/                 # Multi-role signup (3-step)
│   ├── signin/                 # Sign in page
│   ├── dashboard/              # User dashboard
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Design system
│   └── page.tsx                # Homepage
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── auth-provider.tsx       # Auth context & hooks
│   ├── navigation.tsx
│   └── footer.tsx
│
├── lib/
│   ├── types.ts                # TypeScript types (375 lines)
│   ├── supabase.ts             # Supabase helpers (620 lines)
│   └── validation.ts           # Zod schemas
│
├── supabase/
│   └── migrations/
│       └── 001_init_schema.sql # Database setup (400 lines)
│
├── public/                     # Static assets
└── package.json
```

---

## 🗄️ Database Schema

### Core Tables (17 total)

**User Tables**
- `users` - User accounts with role
- `architect_profiles` - Architect-specific data
- `client_profiles` - Client/company data
- `student_profiles` - Student-specific data
- `hr_profiles` - HR/recruiter data

**Content Tables**
- `portfolios` - Architect portfolio items
- `blog_posts` - Blog articles
- `blog_comments` - Blog post comments
- `blog_likes` - Blog post likes

**Project & Bidding**
- `projects` - Project listings
- `bids` - Architect bids on projects
- `reviews` - Architect reviews & ratings

**Communication**
- `messages` - Direct messages
- `conversations` - Message threads
- `connections` - User follows/connections
- `portfolio_likes` - Portfolio item likes

### Features
✅ Row Level Security (RLS) on all tables
✅ Automatic timestamp triggers
✅ Performance indexes
✅ Referential integrity

---

## 🔐 Authentication & Authorization

### User Roles
- **Architect**: Portfolio showcase, project bidding, messaging
- **Client**: Project posting, architect search, team hiring
- **Student**: Internship discovery, mentorship seeking
- **HR/Recruiter**: Job posting, talent recruitment
- **Admin**: Content moderation, system management

### Protected Routes

```typescript
// Require authentication
'use client';
import { useRequireAuth } from '@/components/auth-provider';

export default function ProtectedPage() {
  useRequireAuth(); // Redirects if not authenticated
  return <div>Protected content</div>;
}

// Require specific role
import { useRequireRole } from '@/components/auth-provider';

export default function ArchitectPage() {
  useRequireRole('architect'); // Redirects if wrong role
  return <div>Architect only content</div>;
}
```

---

## 📡 API Routes

### Authentication
```
GET  /api/auth/verify        # Verify user session
```

### Projects
```
GET  /api/projects           # List projects (paginated)
POST /api/projects           # Create project (auth required)
```

### Portfolios
```
GET  /api/portfolios         # List portfolios
POST /api/portfolios         # Create portfolio (architect auth)
```

### Blog
```
GET  /api/blog/posts         # List blog posts
POST /api/blog/posts         # Create blog post (auth)
```

All APIs include:
✅ Authentication checks
✅ Input validation (Zod schemas)
✅ Error handling
✅ Proper HTTP status codes

---

## 🎨 Design System

### Colors
- **Primary**: Deep Navy Blue (#0D1B2E)
- **Secondary**: Warm Gold (#D49C3D)
- **Background**: Soft Off-white (#F8F8FB)
- **Accent**: Warm Gold
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red

### Typography
- **Headings**: DM Serif Display (serif)
- **Body**: Inter (sans-serif)
- **Line Height**: 1.5 (leading-relaxed)

### Components
- Responsive grid layouts (mobile-first)
- Card-based UI with hover effects
- Smooth transitions and animations
- Accessibility-focused (ARIA labels, semantic HTML)

---

## 📝 Form Validation

All forms use **Zod** for runtime validation:

```typescript
// Signup forms include validation for:
// - Email format
// - Password strength (8+ chars)
// - Matching passwords
// - Role-specific fields

// Example:
import { architectSignupSchema } from '@/lib/validation';

const result = architectSignupSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.flatten()); // Field errors
}
```

---

## 🔧 Key Technologies

- **Frontend**: React 19, Next.js 16, Tailwind CSS v4
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

---

## 📚 Type Safety

Strong TypeScript implementation with 375+ lines of type definitions:

```typescript
// Complete type coverage for:
User, UserRole, ArchitectProfile, ClientProfile, StudentProfile, HRProfile
Portfolio, BlogPost, BlogComment, Project, Bid, Message, Conversation
Review, Connection, ApiResponse, PaginatedResponse

// Form input types with full validation:
ArchitectSignupInput, ClientSignupInput, StudentSignupInput, HRSignupInput
CreateProjectInput, CreatePortfolioInput, CreateBlogPostInput, SubmitBidInput
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo
vercel link

# Deploy
vercel deploy

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Manual Deployment

1. Build: `pnpm build`
2. Start: `pnpm start`
3. Set environment variables
4. Database must be accessible from your server

---

## 🛠️ Development

### Run Tests
```bash
pnpm test
```

### Type Check
```bash
pnpm type-check
```

### Lint
```bash
pnpm lint
```

### Format
```bash
pnpm format
```

---

## 📖 Full Documentation

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for:
- Detailed setup instructions
- Database schema documentation
- Complete API documentation
- Authentication flow
- Troubleshooting guide
- Next steps for feature development

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Database connection error
- Verify environment variables in `.env.local`
- Check Supabase project is active
- Verify SQL migrations executed successfully

### Signup not saving data
- Check browser console for errors
- Verify Supabase RLS policies
- Check API response: `/api/auth/verify`

### Pages not loading after login
- Verify auth session: Browser DevTools → Application → Cookies
- Check user role in Supabase `users` table
- Verify RLS policies allow access

---

## 📞 Support

- Check documentation: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Review Supabase logs: Project → Logs
- Check browser console: DevTools → Console
- Review server logs: Terminal output

---

## 📄 License

Proprietary - ArchConnect Platform

---

## 🎉 What's Next?

After setup, implement:
1. ✅ Architect profile pages
2. ✅ Client project detail pages
3. ✅ Blog post display
4. ✅ Real-time messaging
5. ✅ Payment processing
6. ✅ Admin dashboard
7. ✅ Email notifications

---

**Happy coding! 🚀**

For detailed implementation guidance, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
