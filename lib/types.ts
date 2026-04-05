// TypeScript Interfaces for Architure Platform - Supabase Database Integration
// These interfaces match the data structures used throughout the application

// ============================================================================
// ARCHITECT PROFILE & SOCIAL MEDIA
// ============================================================================

export interface SocialLinks {
  instagram: string
  linkedin: string
  website: string
  twitter: string
}

export interface Architect {
  id: string
  name: string
  title: string
  location: string
  image: string
  coverImage: string
  rating: number
  reviewCount: number
  projectCount: number
  specialties: string[]
  bio: string
  featured: boolean
  hourlyRate: number
  minimumProjectBudget: number
  email: string
  phone: string
  social: SocialLinks
  // Supabase metadata
  createdAt?: string
  updatedAt?: string
  userId?: string
}

// ============================================================================
// PORTFOLIO & PROJECTS
// ============================================================================

export interface PortfolioProject {
  id: string
  title: string
  architect: string
  architectId: string
  category: string
  location: string
  year: string
  image: string
  likes: number
  views: number
  description: string
  // Supabase metadata
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// BLOG & COMMENTS
// ============================================================================

export interface BlogComment {
  id: string
  author: string
  content: string
  date: string
  likes: number
  // Supabase metadata
  createdAt?: string
  updatedAt?: string
  userId?: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorId: string
  authorImage: string
  publishedDate: string
  status: 'pending' | 'approved' | 'rejected'
  category: string
  image: string
  likes: number
  comments: BlogComment[]
  // Supabase metadata
  createdAt?: string
  updatedAt?: string
  userId?: string
}

// ============================================================================
// PROJECT BIDDING & PROPOSALS
// ============================================================================

export interface ProjectBid {
  id: string
  projectTitle: string
  projectType: string
  client: string
  budget: string
  timeline: string
  location: string
  description: string
  postedDate: string
  deadline: string
  bidsReceived: number
  status: 'Open' | 'Under Review' | 'Closed' | 'Awarded'
  // Supabase metadata
  createdAt?: string
  updatedAt?: string
  userId?: string
  clientId?: string
}

export interface ArchitectBid {
  id: string
  projectId: string
  architectId: string
  architect: string
  architectImage: string
  proposedBudget: string
  proposedTimeline: string
  submittedDate: string
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Shortlisted'
  message: string
  rating: number
  projectsCompleted: number
  // Supabase metadata
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User {
  id: string
  email: string
  password?: string // Only on client during registration, never stored
  userType: 'architect' | 'client' | 'admin' | 'hr'
  profile: UserProfile
  // Supabase auth metadata
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  company?: string
  phone?: string
  location?: string
  // For architects
  architectData?: Architect
  // For clients
  clientData?: ClientProfile
}

export interface ClientProfile {
  id: string
  userId: string
  companyName: string
  industry?: string
  website?: string
  projectsPosted: number
  totalSpent: number
  rating: number
}

// ============================================================================
// REVIEW & RATINGS
// ============================================================================

export interface Review {
  id: string
  architectId: string
  clientId: string
  clientName: string
  rating: number
  title: string
  content: string
  projectId?: string
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// CONTACT & MESSAGES
// ============================================================================

export interface ContactMessage {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  message: string
  createdAt?: string
  read?: boolean
  response?: string
  respondedAt?: string
}

export interface DirectMessage {
  id: string
  senderId: string
  recipientId: string
  senderName: string
  senderImage?: string
  content: string
  createdAt?: string
  read: boolean
  conversationId: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  lastMessage?: string
  lastMessageAt?: string
  createdAt?: string
}

// ============================================================================
// FORM DATA (For submissions)
// ============================================================================

export interface ProjectPostFormData {
  projectTitle: string
  projectType: string
  description: string
  budget: {
    min: number
    max: number
  }
  timeline: {
    min: number
    max: number
    unit: 'weeks' | 'months' | 'years'
  }
  location: string
  deadline: string
  preferredArchitects?: string[]
  attachments?: string[]
}

export interface BlogPostFormData {
  title: string
  excerpt: string
  content: string
  category: string
  image?: string
  tags?: string[]
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  userType: 'architect' | 'client'
  // For architects
  architectName?: string
  architectTitle?: string
  specialties?: string[]
  // For clients
  clientName?: string
  clientCompany?: string
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

export interface ArchitectFilters {
  specialties?: string[]
  minRating?: number
  maxHourlyRate?: number
  minHourlyRate?: number
  location?: string
  featured?: boolean
  searchQuery?: string
}

export interface ProjectFilters {
  projectType?: string
  minBudget?: number
  maxBudget?: number
  location?: string
  status?: string
  searchQuery?: string
}

export interface BlogFilters {
  category?: string
  status?: 'pending' | 'approved' | 'rejected'
  authorId?: string
  searchQuery?: string
}
