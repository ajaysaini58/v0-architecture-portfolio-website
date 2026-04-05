# DByARCH Platform - Supabase Integration Guide

This guide walks you through setting up the DByARCH platform with Supabase database integration.

## Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Next.js project with environment variables configured
- Node.js and npm/pnpm installed

## Step 1: Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from your Supabase project settings:
- Go to Settings > API
- Copy the Project URL and anon key
- Copy the service role key (keep this secret, only for server-side operations)

## Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Step 3: Create Database Schema

1. Go to your Supabase project SQL editor
2. Execute the SQL from `scripts/supabase-schema.sql`
3. This creates all necessary tables, indexes, and RLS policies

## File Structure

### TypeScript Interfaces (`lib/types.ts`)

Contains all TypeScript interfaces matching your data structure:
- `Architect` - Architect profiles with social links and pricing
- `PortfolioProject` - Portfolio projects
- `BlogPost` - Blog posts with comments
- `ProjectBid` - Project listings from clients
- `ArchitectBid` - Architect proposals
- `User` - User profiles
- `Review` - Client reviews
- `ContactMessage` - Public contact form submissions

### Database Schema (`scripts/supabase-schema.sql`)

Complete SQL schema including:
- `architects` - Architect profiles
- `portfolio_projects` - Project portfolios
- `blog_posts` - Blog articles
- `blog_comments` - Blog post comments
- `project_bids` - Client project listings
- `architect_bids` - Architect proposals
- `reviews` - Client reviews
- `conversations` - Message conversations
- `direct_messages` - Private messages
- `contact_messages` - Public contact form
- `user_profiles` - User account info

### Utilities (`lib/supabase.ts`)

Helper functions for common queries:
- `getArchitects()` - Fetch featured architects
- `getArchitectById()` - Get specific architect
- `searchArchitects()` - Search with filters
- `getPortfolioProjects()` - Fetch all projects
- `getBlogPosts()` - Fetch approved blog posts
- `getProjectBids()` - Fetch project listings
- `getArchitectBidsForProject()` - Get proposals for a project
- `submitArchitectBid()` - Submit a proposal
- And many more...

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
