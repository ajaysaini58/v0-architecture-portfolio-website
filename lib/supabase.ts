// Supabase client configuration and utility functions
import { createBrowserClient } from '@supabase/ssr'

// Initialize Supabase client
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

export const supabase = createSupabaseClient()

// ============================================================================
// ARCHITECT QUERIES
// ============================================================================

export async function getArchitects(supabase: any) {
  const { data, error } = await supabase
    .from('architects')
    .select('*')
    .eq('featured', true)
    .limit(10)
  
  if (error) throw error
  return data
}

export async function getArchitectById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('architects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function searchArchitects(
  supabase: any,
  filters: {
    specialty?: string
    minRating?: number
    maxRate?: number
    location?: string
  }
) {
  let query = supabase.from('architects').select('*')
  
  if (filters.specialty) {
    query = query.contains('specialties', [filters.specialty])
  }
  if (filters.minRating) {
    query = query.gte('rating', filters.minRating)
  }
  if (filters.maxRate) {
    query = query.lte('hourly_rate', filters.maxRate)
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================================================
// PORTFOLIO QUERIES
// ============================================================================

export async function getPortfolioProjects(supabase: any) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPortfolioProjectsByArchitect(
  supabase: any,
  architectId: string
) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('architect_id', architectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPortfolioProjectById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// BLOG QUERIES
// ============================================================================

export async function getBlogPosts(
  supabase: any,
  options?: { status?: string; category?: string; limit?: number }
) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (options?.status) {
    query = query.eq('status', options.status)
  } else {
    query = query.eq('status', 'approved') // Default to approved
  }
  
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getBlogPostById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_comments(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createBlogPost(
  supabase: any,
  post: {
    title: string
    excerpt: string
    content: string
    category: string
    image_url?: string
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      user_id: user.id,
      ...post,
      status: 'pending', // Posts require admin approval
      published_date: null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function addBlogComment(
  supabase: any,
  blogPostId: string,
  comment: { author: string; content: string }
) {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      blog_post_id: blogPostId,
      ...comment,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// PROJECT BID QUERIES
// ============================================================================

export async function getProjectBids(supabase: any, userId?: string) {
  let query = supabase.from('project_bids').select('*')
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query.order('posted_date', { ascending: false })
  if (error) throw error
  return data
}

export async function getProjectBidById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('project_bids')
    .select(`
      *,
      architect_bids(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createProjectBid(
  supabase: any,
  bid: {
    project_title: string
    project_type: string
    client_name?: string
    budget_min: number
    budget_max: number
    timeline_min: number
    timeline_max: number
    timeline_unit: 'weeks' | 'months' | 'years'
    location: string
    description: string
    deadline: string
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('project_bids')
    .insert({
      user_id: user.id,
      ...bid,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// ARCHITECT BID QUERIES
// ============================================================================

export async function getArchitectBidsForProject(
  supabase: any,
  projectBidId: string
) {
  const { data, error } = await supabase
    .from('architect_bids')
    .select(`
      *,
      architects(*)
    `)
    .eq('project_bid_id', projectBidId)
    .order('submitted_date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function submitArchitectBid(
  supabase: any,
  bid: {
    project_bid_id: string
    proposed_budget: string
    proposed_timeline: string
    message: string
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  // Get architect ID for current user
  const { data: architect } = await supabase
    .from('architects')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (!architect) throw new Error('Architect profile not found')
  
  const { data, error } = await supabase
    .from('architect_bids')
    .insert({
      architect_id: architect.id,
      ...bid,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// REVIEW QUERIES
// ============================================================================

export async function getArchitectReviews(supabase: any, architectId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('architect_id', architectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createReview(
  supabase: any,
  review: {
    architect_id: string
    rating: number
    title: string
    content: string
    project_bid_id?: string
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      client_id: user.id,
      ...review,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// MESSAGING QUERIES
// ============================================================================

export async function getConversations(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .contains('participant_ids', [userId])
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getConversationMessages(
  supabase: any,
  conversationId: string
) {
  const { data, error } = await supabase
    .from('direct_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function sendDirectMessage(
  supabase: any,
  message: {
    conversation_id: string
    recipient_id: string
    content: string
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('direct_messages')
    .insert({
      sender_id: user.id,
      ...message,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// CONTACT FORM QUERIES
// ============================================================================

export async function submitContactMessage(
  supabase: any,
  message: {
    sender_name: string
    sender_email: string
    subject: string
    message: string
  }
) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// USER PROFILE QUERIES
// ============================================================================

export async function getUserProfile(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(
  supabase: any,
  userId: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// LIKES AND ENGAGEMENT
// ============================================================================

export async function incrementProjectLikes(supabase: any, projectId: string) {
  const { data: project } = await supabase
    .from('portfolio_projects')
    .select('likes')
    .eq('id', projectId)
    .single()
  
  const newLikes = (project?.likes || 0) + 1
  
  const { data, error } = await supabase
    .from('portfolio_projects')
    .update({ likes: newLikes })
    .eq('id', projectId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function incrementBlogLikes(supabase: any, postId: string) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('likes')
    .eq('id', postId)
    .single()
  
  const newLikes = (post?.likes || 0) + 1
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ likes: newLikes })
    .eq('id', postId)
    .select()
    .single()
  
  if (error) throw error
  return data
}
