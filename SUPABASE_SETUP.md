# Architect Networking Platform - Supabase Setup Guide

Complete guide for setting up the professional architect networking platform with Supabase.

## Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Next.js 16+ project
- Environment variables ready to configure

## Step 1: Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from your Supabase project:
- Settings > API > Project URL
- Settings > API > Project API Keys > anon (public)
- Settings > API > Project API Keys > service_role (keep secret - server only)

## Step 2: Create Database Schema

1. Go to your Supabase project SQL editor
2. Copy the entire contents of `supabase/migrations/001_init_schema.sql`
3. Create a new query and paste the contents
4. Execute the query

This creates all tables, enums, indexes, triggers, and Row Level Security policies.

## Step 3: Verify Installation

Run this query to verify all tables were created:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```

You should see 20+ tables created.

## Database Schema Overview

### Core Tables

**Users Table** (`users`)
- Extends Supabase auth.users
- Stores: email, full_name, role, avatar, bio, phone, location, verified status
- Roles: architect, client, company_hr, student, admin

**Architect Profiles** (`architect_profiles`)
- Specialties, experience, hourly rates, portfolio count, ratings, availability

**Client Profiles** (`client_profiles`)
- Company info, company type, industry, website, spending history

**Student Profiles** (`student_profiles`)
- University, degree, interests, internship/mentorship seeking

**HR Profiles** (`hr_profiles`)
- Company recruiting info, job postings, hiring history

**Content Tables**
- `portfolios` - Architect portfolio items with images and tags
- `blog_posts` - Blog articles with draft/published workflow
- `blog_comments` - Comments on blog posts
- `blog_likes` - Likes tracking for blog posts

**Project & Bidding**
- `projects` - Project postings by clients
- `bids` - Architect proposals on projects
- `reviews` - Ratings and reviews for architects

**Communication**
- `messages` - Direct messages between users
- `conversations` - Conversation threads
- `connections` - User follows/connections

### Indexes for Performance

All frequently-queried columns have indexes:
- User role and email lookups
- Status and category filters on projects/blogs
- User relationship queries

### Row Level Security (RLS)

Every table has RLS enabled:
- **Public data**: Users, architects, clients, portfolios, published blog posts, projects
- **Private data**: Messages, bids, draft content only visible to owner/participants
- **Owner-only modifications**: Users can only modify their own data

## Usage Examples

### Fetching Architects

```typescript
import { createSupabaseClient } from '@/lib/supabase'
import { getArchitects } from '@/lib/supabase'

const supabase = createSupabaseClient()
const architects = await getArchitects(supabase)
```

### Searching Architects

```typescript
import { searchArchitects } from '@/lib/supabase'

const results = await searchArchitects(supabase, {
  specialty: 'Residential',
  minRating: 4.5,
  maxRate: 300,
  location: 'San Francisco'
})
```

### Creating a Blog Post

```typescript
import { createBlogPost } from '@/lib/supabase'

const post = await createBlogPost(supabase, {
  title: 'My Architecture Insights',
  excerpt: 'Exploring sustainable design...',
  content: 'Full article content...',
  category: 'Sustainability',
  image_url: 'https://...'
})
// Note: Post status is 'pending' until admin approval
```

### Getting Blog Post with Comments

```typescript
import { getBlogPostById } from '@/lib/supabase'

const post = await getBlogPostById(supabase, 'blog-post-id')
// Returns post with nested comments array
```

### Submitting an Architect Bid

```typescript
import { submitArchitectBid } from '@/lib/supabase'

const bid = await submitArchitectBid(supabase, {
  project_bid_id: 'project-123',
  proposed_budget: '$95,000',
  proposed_timeline: '14 months',
  message: 'I would love to work on this project...'
})
```

### Posting a Project

```typescript
import { createProjectBid } from '@/lib/supabase'

const project = await createProjectBid(supabase, {
  project_title: 'Modern Family Home',
  project_type: 'Residential',
  budget_min: 850000,
  budget_max: 1200000,
  timeline_min: 12,
  timeline_max: 18,
  timeline_unit: 'months',
  location: 'Palo Alto, CA',
  description: 'Looking for an architect to design a 4-bedroom...',
  deadline: '2024-02-15'
})
```

### Adding a Blog Comment

```typescript
import { addBlogComment } from '@/lib/supabase'

const comment = await addBlogComment(supabase, 'blog-1', {
  author: 'John Doe',
  content: 'Great insights on sustainable design!'
})
```

## Row Level Security (RLS)

The schema includes comprehensive RLS policies:
- Users can only see their own profiles
- Architects can update their own profiles
- Blog posts require approval status for public viewing
- Messages are private to participants
- Project bids are visible to creator and bidders

To modify RLS policies, go to your Supabase project:
1. Click "Authentication" > "Policies"
2. Select the table and edit policies as needed

## Authentication Flow

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'architect@example.com',
  password: 'secure-password',
  options: {
    data: {
      user_type: 'architect', // or 'client'
    }
  }
})

// Then create user profile
if (data.user) {
  await supabase.from('user_profiles').insert({
    user_id: data.user.id,
    user_type: 'architect',
    first_name: 'John',
    last_name: 'Doe'
  })
}
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'architect@example.com',
  password: 'secure-password'
})
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## Storage for Images

To enable image uploads (profile photos, project images):

1. Go to Supabase project > Storage
2. Create new buckets:
   - `architect-profiles` (for profile images)
   - `portfolio-images` (for project images)
   - `blog-images` (for blog post images)

3. Set bucket policies:
```typescript
// Make portfolios public
supabase.storage
  .from('portfolio-images')
  .upload('path/to/image.jpg', file, {
    cacheControl: '3600',
    upsert: false
  })
```

## Real-time Subscriptions

Listen for changes in real-time:

```typescript
// Listen for new blog posts
const subscription = supabase
  .channel('blog-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'blog_posts',
      filter: 'status=eq.approved'
    },
    (payload) => {
      console.log('New blog post:', payload.new)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

## Best Practices

1. **Always authenticate before mutations** - Check `auth.getUser()` before insert/update/delete
2. **Use indexed columns in filters** - The schema includes indexes on commonly filtered columns
3. **Cache frequently accessed data** - Use SWR or React Query to cache architect and project listings
4. **Validate on both client and server** - Never trust client-side validation alone
5. **Use the service role key only on the server** - Never expose it to the client
6. **Monitor RLS policies** - Ensure your policies match your security requirements

## Troubleshooting

### "Relation does not exist"
- Ensure you ran the entire SQL schema script
- Check that tables were created successfully in the Supabase dashboard

### "Permission denied" errors
- Check RLS policies match your use case
- Verify user authentication with `auth.getUser()`
- Ensure user_id in row matches current auth user

### "Invalid API key"
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly
- Check they match your Supabase project settings

### Images not uploading
- Ensure storage buckets exist and have proper permissions
- Check file size limits in Supabase project settings
- Verify CORS settings allow your domain

## Next Steps

1. Connect the frontend to Supabase by updating data fetching calls
2. Implement authentication pages using Supabase Auth
3. Set up email notifications for project bids
4. Create admin dashboard for blog post approvals
5. Implement search functionality using full-text search
6. Add analytics dashboard for architects

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
