// Supabase client configuration and utility functions
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialize Supabase client
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables: Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
    // Attempt to initialize with dummy strings only so UI doesn't crash statically,
    // but subsequent queries will correctly log/fail rather than silently returning 'failed to fetch'
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// ============================================================================
// AUTH HELPERS
// ============================================================================

export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ============================================================================
// USER PROFILE QUERIES
// ============================================================================

export async function createUserProfile(profile: {
  user_id: string
  user_type: 'architect' | 'client' | 'hr' | 'admin'
  first_name: string
  last_name: string
  company_name?: string
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserProfile(supabaseClient: any, userId: string) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(
  supabaseClient: any,
  userId: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// ARCHITECT QUERIES
// ============================================================================

export async function createArchitectProfile(profile: {
  user_id: string
  name: string
  title?: string
  location: string
  email: string
  bio?: string
  specialties?: string[]
  hourly_rate?: number
  minimum_project_budget?: number
  image_url?: string
  instagram_url?: string
  linkedin_url?: string
  website_url?: string
  twitter_url?: string
}) {
  const { data, error } = await supabase
    .from('architects')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getArchitects(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('architects')
    .select('*')
    .eq('featured', true)
    .limit(10)
  
  if (error) throw error
  return data
}

export async function getArchitectById(supabaseClient: any, id: string) {
  const { data, error } = await supabaseClient
    .from('architects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getArchitectByUserId(userId: string) {
  const { data, error } = await supabase
    .from('architects')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateArchitectProfile(
  userId: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from('architects')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function searchArchitects(
  supabaseClient: any,
  filters: {
    specialty?: string
    minRating?: number
    maxRate?: number
    location?: string
  }
) {
  let query = supabaseClient.from('architects').select('*')
  
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

export async function getPortfolioProjects(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .select('*, architects(name)')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPortfolioProjectsByArchitect(
  supabaseClient: any,
  architectId: string
) {
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .select('*')
    .eq('architect_id', architectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPortfolioProjectById(supabaseClient: any, id: string) {
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function addPortfolioProject(project: {
  title: string
  architect_id: string
  category?: string
  location?: string
  year?: number
  image_url?: string
  description?: string
}) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePortfolioProject(projectId: string) {
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error
}

// ============================================================================
// IMAGE UPLOAD (Supabase Storage)
// ============================================================================

export async function uploadImage(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function uploadPortfolioImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${ext}`
  return uploadImage('portfolio-images', fileName, file)
}

export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${ext}`
  return uploadImage('avatars', fileName, file)
}

// ============================================================================
// BLOG QUERIES
// ============================================================================

export async function getBlogPosts(
  supabaseClient: any,
  options?: { status?: string; category?: string; limit?: number }
) {
  let query = supabaseClient
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (options?.status) {
    query = query.eq('status', options.status)
  } else {
    query = query.eq('status', 'approved')
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

export async function getBlogPostById(supabaseClient: any, id: string) {
  const { data, error } = await supabaseClient
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
  supabaseClient: any,
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
  } = await supabaseClient.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .insert({
      user_id: user.id,
      ...post,
      status: 'pending',
      published_date: null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateBlogPostStatus(
  supabaseClient: any,
  id: string,
  status: string
) {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function addBlogComment(
  supabaseClient: any,
  blogPostId: string,
  comment: { author: string; content: string }
) {
  const { data, error } = await supabaseClient
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

export async function getProjectBids(supabaseClient: any, userId?: string) {
  let query = supabaseClient.from('project_bids').select('*')
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query.order('posted_date', { ascending: false })
  if (error) throw error
  return data
}

export async function getProjectBidById(supabaseClient: any, id: string) {
  const { data, error } = await supabaseClient
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
  supabaseClient: any,
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
  } = await supabaseClient.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabaseClient
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
  supabaseClient: any,
  projectBidId: string
) {
  const { data, error } = await supabaseClient
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
  supabaseClient: any,
  bid: {
    project_bid_id: string
    proposed_budget: string
    proposed_timeline: string
    message: string
  }
) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data: architect } = await supabaseClient
    .from('architects')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (!architect) throw new Error('Architect profile not found')
  
  const { data, error } = await supabaseClient
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

export async function getArchitectReviews(supabaseClient: any, architectId: string) {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*')
    .eq('architect_id', architectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createReview(
  supabaseClient: any,
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
  } = await supabaseClient.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabaseClient
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

export async function getConversations(supabaseClient: any, userId: string) {
  const { data, error } = await supabaseClient
    .from('conversations')
    .select('*')
    .contains('participant_ids', [userId])
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getConversationMessages(
  supabaseClient: any,
  conversationId: string
) {
  const { data, error } = await supabaseClient
    .from('direct_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function sendDirectMessage(
  supabaseClient: any,
  message: {
    conversation_id: string
    recipient_id: string
    content: string
  }
) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabaseClient
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
  supabaseClient: any,
  message: {
    sender_name: string
    sender_email: string
    subject: string
    message: string
  }
) {
  const { data, error } = await supabaseClient
    .from('contact_messages')
    .insert(message)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// LIKES AND ENGAGEMENT
// ============================================================================

export async function incrementProjectLikes(supabaseClient: any, projectId: string) {
  const { data: project } = await supabaseClient
    .from('portfolio_projects')
    .select('likes')
    .eq('id', projectId)
    .single()
  
  const newLikes = (project?.likes || 0) + 1
  
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .update({ likes: newLikes })
    .eq('id', projectId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function incrementBlogLikes(supabaseClient: any, postId: string) {
  const { data: post } = await supabaseClient
    .from('blog_posts')
    .select('likes')
    .eq('id', postId)
    .single()
  
  const newLikes = (post?.likes || 0) + 1
  
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .update({ likes: newLikes })
    .eq('id', postId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================================================
// VACANCY QUERIES
// ============================================================================

export async function getVacancies(supabaseClient: any, status = 'approved') {
  const { data, error } = await supabaseClient
    .from('vacancies')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVacancyById(supabaseClient: any, id: string) {
  const { data, error } = await supabaseClient
    .from('vacancies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createVacancy(supabaseClient: any, vacancy: {
  user_id: string
  title: string
  company: string
  location?: string
  salary_min?: number
  salary_max?: number
  job_type: string
  description: string
  requirements?: string
  apply_url?: string
  apply_email?: string
}) {
  const { data, error } = await supabaseClient
    .from('vacancies')
    .insert({ ...vacancy, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateVacancyStatus(supabaseClient: any, id: string, status: string) {
  const { data, error } = await supabaseClient
    .from('vacancies')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
