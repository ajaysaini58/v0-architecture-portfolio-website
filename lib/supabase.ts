// Supabase client configuration and utility functions
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  User,
  ArchitectProfile,
  ClientProfile,
  StudentProfile,
  HRProfile,
  Portfolio,
  BlogPost,
  BlogComment,
  Project,
  Bid,
  Message,
  Review,
  ArchitectSearchFilters,
  ProjectSearchFilters,
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const missingKeys = [];
    if (!supabaseUrl) missingKeys.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missingKeys.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    const errorMsg = `Missing Supabase Environment Variables: ${missingKeys.join(', ')}. Please set them in your .env.local or Vercel settings.`;
    console.error(errorMsg);

    return createBrowserClient('https://zzzz-missing-supabase-config.supabase.co', 'missing-key');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// ============================================================================
// AUTH HELPERS
// ============================================================================

export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// ============================================================================
// USER PROFILE HELPERS
// ============================================================================

export async function createUserProfile(
  userId: string,
  email: string,
  full_name: string,
  role: string
) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      full_name,
      role,
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// ============================================================================
// ARCHITECT PROFILE HELPERS
// ============================================================================

export async function createArchitectProfile(
  userId: string,
  specialties: string[],
  experience_years?: number,
  hourly_rate?: number,
  website_url?: string
) {
  const { data, error } = await supabase
    .from('architect_profiles')
    .insert({
      user_id: userId,
      specialties,
      experience_years,
      hourly_rate,
      website_url,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ArchitectProfile;
}

export async function getArchitectProfile(userId: string) {
  const { data, error } = await supabase
    .from('architect_profiles')
    .select('*, user:users(*)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as ArchitectProfile;
}

export async function updateArchitectProfile(
  userId: string,
  updates: Partial<ArchitectProfile>
) {
  const { data, error } = await supabase
    .from('architect_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as ArchitectProfile;
}

export async function searchArchitects(filters: ArchitectSearchFilters) {
  let query = supabase
    .from('architect_profiles')
    .select('*, user:users(*)')
    .eq('is_available', true);

  if (filters.min_rating) {
    query = query.gte('rating', filters.min_rating);
  }

  if (filters.max_hourly_rate) {
    query = query.lte('hourly_rate', filters.max_hourly_rate);
  }

  if (filters.specialties && filters.specialties.length > 0) {
    // Using overlaps operator for array columns
    query = query.or(
      filters.specialties.map(s => `specialties.cs.{${s}}`).join(',')
    );
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) throw error;
  return data as ArchitectProfile[];
}

export async function getFeaturedArchitects(limit = 6) {
  const { data, error } = await supabase
    .from('architect_profiles')
    .select('*, user:users(*)')
    .eq('is_available', true)
    .eq('verified_badge', true)
    .gte('rating', 4.5)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ArchitectProfile[];
}

export async function getArchitectById(supabaseClient: any, architectId: string) {
  const { data, error } = await supabaseClient
    .from('architect_profiles')
    .select('*, user:users(*)')
    .eq('user_id', architectId)
    .single();

  if (error) throw error;
  return data as ArchitectProfile;
}

// ============================================================================
// CLIENT PROFILE HELPERS
// ============================================================================

export async function createClientProfile(
  userId: string,
  company_name?: string,
  company_type?: string,
  industry?: string
) {
  const { data, error } = await supabase
    .from('client_profiles')
    .insert({
      user_id: userId,
      company_name,
      company_type,
      industry,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ClientProfile;
}

export async function getClientProfile(userId: string) {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*, user:users(*)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as ClientProfile;
}

// ============================================================================
// STUDENT PROFILE HELPERS
// ============================================================================

export async function createStudentProfile(
  userId: string,
  university?: string,
  degree?: string,
  graduation_year?: number,
  interests: string[] = []
) {
  const { data, error } = await supabase
    .from('student_profiles')
    .insert({
      user_id: userId,
      university,
      degree,
      graduation_year,
      interests,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StudentProfile;
}

// ============================================================================
// HR PROFILE HELPERS
// ============================================================================

export async function createHRProfile(
  userId: string,
  company_name: string,
  department?: string
) {
  const { data, error } = await supabase
    .from('hr_profiles')
    .insert({
      user_id: userId,
      company_name,
      department,
    })
    .select()
    .single();

  if (error) throw error;
  return data as HRProfile;
}

// ============================================================================
// PORTFOLIO HELPERS
// ============================================================================

export async function createPortfolioItem(
  architectId: string,
  title: string,
  description: string,
  category: string,
  images: string[],
  tags: string[] = []
) {
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      architect_id: architectId,
      title,
      description,
      category,
      images,
      tags,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Portfolio;
}

export async function getArchitectPortfolio(architectId: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('architect_id', architectId)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Portfolio[];
}

export async function getPortfolioProjectsByArchitect(supabaseClient: any, architectId: string) {
  const { data, error } = await supabaseClient
    .from('portfolios')
    .select('*')
    .eq('architect_id', architectId)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Portfolio[];
}

// ============================================================================
// BLOG POST HELPERS
// ============================================================================

export async function createBlogPost(
  authorId: string,
  title: string,
  slug: string,
  content: string,
  category: string,
  tags: string[] = [],
  featured_image?: string,
  excerpt?: string
) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      author_id: authorId,
      title,
      slug,
      content,
      category,
      tags,
      featured_image,
      excerpt,
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function getPublishedBlogPosts(limit = 10) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, author:users(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, author:users(*), comments:blog_comments(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function addBlogComment(
  postId: string,
  authorId: string,
  content: string
) {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as BlogComment;
}

// ============================================================================
// PROJECT HELPERS
// ============================================================================

export async function createProject(
  clientId: string,
  userId: string,
  title: string,
  description: string,
  category: string,
  budget_min?: number,
  budget_max?: number,
  specialties_required: string[] = [],
  timeline?: string,
  deadline?: string
) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      posted_by_user_id: userId,
      title,
      description,
      category,
      budget_min,
      budget_max,
      budget_type: 'fixed',
      specialties_required,
      timeline,
      deadline,
      status: 'open',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function getOpenProjects(filters?: ProjectSearchFilters, limit = 20) {
  let query = supabase
    .from('projects')
    .select('*, client:client_profiles(*), posted_by:users(*)')
    .eq('status', 'open');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.min_budget) {
    query = query.gte('budget_max', filters.min_budget);
  }

  if (filters?.max_budget) {
    query = query.lte('budget_min', filters.max_budget);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Project[];
}

export async function getProjectById(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:client_profiles(*), posted_by:users(*), bids:bids(*)')
    .eq('id', projectId)
    .single();

  if (error) throw error;
  return data as Project;
}

// ============================================================================
// BID HELPERS
// ============================================================================

export async function submitBid(
  projectId: string,
  architectId: string,
  bid_amount: number,
  proposal: string,
  timeline_days?: number
) {
  const { data, error } = await supabase
    .from('bids')
    .insert({
      project_id: projectId,
      architect_id: architectId,
      bid_amount,
      proposal,
      timeline_days,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Bid;
}

export async function getProjectBids(projectId: string) {
  const { data, error } = await supabase
    .from('bids')
    .select('*, architect:architect_profiles(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Bid[];
}

export async function getArchitectBids(architectId: string) {
  const { data, error } = await supabase
    .from('bids')
    .select('*, project:projects(*)')
    .eq('architect_id', architectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Bid[];
}

// ============================================================================
// MESSAGE HELPERS
// ============================================================================

export async function sendMessage(
  senderId: string,
  recipientId: string,
  content: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function getConversationMessages(
  userId1: string,
  userId2: string,
  limit = 50
) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users(*), recipient:users(*)')
    .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Message[];
}

// ============================================================================
// REVIEW HELPERS
// ============================================================================

export async function submitReview(
  reviewerId: string,
  architectId: string,
  rating: number,
  comment?: string,
  projectId?: string
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      reviewer_id: reviewerId,
      architect_id: architectId,
      rating,
      comment,
      project_id: projectId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function getArchitectReviews(architectId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:users(*)')
    .eq('architect_id', architectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Review[];
}
