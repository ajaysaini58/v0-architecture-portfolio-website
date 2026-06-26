// TypeScript Types for Architect Networking Platform
// Complete type definitions for all database tables and entities

// ============================================================================
// AUTH & USER TYPES
// ============================================================================

export type UserRole = 'architect' | 'client' | 'company_hr' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  country: string | null;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ARCHITECT TYPES
// ============================================================================

export interface ArchitectProfile {
  id: string;
  user_id: string;
  specialties: string[];
  experience_years: number | null;
  hourly_rate: number | null;
  bio_detailed: string | null;
  website_url: string | null;
  portfolio_count: number;
  rating: number;
  total_projects: number;
  response_time_hours: number | null;
  verified_badge: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  // Related user data
  user?: User;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface ClientProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  company_type: 'individual' | 'company' | 'startup' | 'government' | null;
  industry: string | null;
  company_size: string | null;
  company_website: string | null;
  company_logo_url: string | null;
  total_projects_posted: number;
  response_rate: number;
  total_budget_spent: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

// ============================================================================
// STUDENT TYPES
// ============================================================================

export interface StudentProfile {
  id: string;
  user_id: string;
  university: string | null;
  degree: string | null;
  graduation_year: number | null;
  interests: string[];
  portfolio_url: string | null;
  seeking_internship: boolean;
  seeking_mentorship: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

// ============================================================================
// HR TYPES
// ============================================================================

export interface HRProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_logo_url: string | null;
  department: string | null;
  job_postings_count: number;
  total_hires: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

// ============================================================================
// PORTFOLIO TYPES
// ============================================================================

export interface Portfolio {
  id: string;
  architect_id: string;
  title: string;
  description: string | null;
  category: string | null;
  images: string[];
  project_duration: string | null;
  budget_range: string | null;
  location: string | null;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BLOG TYPES
// ============================================================================

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: BlogStatus;
  category: string | null;
  tags: string[];
  published_at: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  author?: User;
  comments?: BlogComment[];
  likes?: number;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface BlogLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// ============================================================================
// PROJECT & BIDDING TYPES
// ============================================================================

export type ProjectStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Project {
  id: string;
  client_id: string;
  posted_by_user_id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: 'fixed' | 'hourly';
  status: ProjectStatus;
  category: string;
  specialties_required: string[];
  location: string | null;
  timeline: string | null;
  attachments: string[];
  views: number;
  bid_count: number;
  selected_architect_id: string | null;
  created_at: string;
  updated_at: string;
  deadline: string | null;
  client?: ClientProfile;
  posted_by?: User;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  project_id: string;
  architect_id: string;
  bid_amount: number;
  proposal: string;
  timeline_days: number | null;
  status: BidStatus;
  created_at: string;
  updated_at: string;
  architect?: ArchitectProfile;
  project?: Project;
}

// ============================================================================
// MESSAGING TYPES
// ============================================================================

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
  sender?: User;
  recipient?: User;
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string;
  created_at: string;
  participant_1?: User;
  participant_2?: User;
  messages?: Message[];
}

// ============================================================================
// CONNECTION TYPES
// ============================================================================

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: User;
  following?: User;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface Review {
  id: string;
  reviewer_id: string;
  architect_id: string;
  project_id: string | null;
  rating: number; // 1-5
  comment: string | null;
  created_at: string;
  updated_at: string;
  reviewer?: User;
  architect?: ArchitectProfile;
}

// ============================================================================
// PORTFOLIO LIKE TYPES
// ============================================================================

export interface PortfolioLike {
  id: string;
  portfolio_id: string;
  user_id: string;
  created_at: string;
}

// ============================================================================
// FORM & REQUEST TYPES
// ============================================================================

export interface SignupFormData {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface ArchitectSignupData extends SignupFormData {
  role: 'architect';
  specialties: string[];
  experience_years?: number;
  hourly_rate?: number;
  website_url?: string;
}

export interface ClientSignupData extends SignupFormData {
  role: 'client';
  company_name?: string;
  company_type?: 'individual' | 'company' | 'startup' | 'government';
  industry?: string;
}

export interface StudentSignupData extends SignupFormData {
  role: 'student';
  university?: string;
  degree?: string;
  graduation_year?: number;
  interests?: string[];
}

export interface HRSignupData extends SignupFormData {
  role: 'company_hr';
  company_name: string;
  department?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface ArchitectSearchFilters {
  specialties?: string[];
  min_rating?: number;
  max_hourly_rate?: number;
  location?: string;
  available_only?: boolean;
}

export interface ProjectSearchFilters {
  status?: ProjectStatus;
  category?: string;
  min_budget?: number;
  max_budget?: number;
  location?: string;
}

export interface BlogSearchFilters {
  category?: string;
  tags?: string[];
  author_id?: string;
  status?: BlogStatus;
}
