import { z } from 'zod';

// ============================================================================
// BASIC VALIDATION SCHEMAS
// ============================================================================

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long');
const phoneSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number').optional();

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const baseSignupSchema = z
  .object({
    email: emailSchema,
    full_name: nameSchema,
    password: passwordSchema,
    confirm_password: z.string(),
    phone: phoneSchema,
    role: z.enum(['architect', 'client', 'company_hr', 'student', 'admin']),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

// ============================================================================
// ARCHITECT SIGNUP SCHEMA
// ============================================================================

export const architectSignupSchema = baseSignupSchema.extend({
  role: z.literal('architect'),
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  experience_years: z.coerce.number().int().min(0, 'Invalid years').optional(),
  hourly_rate: z.coerce.number().min(0, 'Invalid rate').optional(),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type ArchitectSignupInput = z.infer<typeof architectSignupSchema>;

// ============================================================================
// CLIENT SIGNUP SCHEMA
// ============================================================================

export const clientSignupSchema = baseSignupSchema.extend({
  role: z.literal('client'),
  company_name: z.string().max(100).optional().or(z.literal('')),
  company_type: z.enum(['individual', 'company', 'startup', 'government']).optional(),
  industry: z.string().max(50).optional().or(z.literal('')),
});

export type ClientSignupInput = z.infer<typeof clientSignupSchema>;

// ============================================================================
// STUDENT SIGNUP SCHEMA
// ============================================================================

export const studentSignupSchema = baseSignupSchema.extend({
  role: z.literal('student'),
  university: z.string().max(100).optional().or(z.literal('')),
  degree: z.string().max(100).optional().or(z.literal('')),
  graduation_year: z.coerce.number().int().min(2000).max(2100).optional(),
  interests: z.array(z.string()).optional(),
});

export type StudentSignupInput = z.infer<typeof studentSignupSchema>;

// ============================================================================
// HR SIGNUP SCHEMA
// ============================================================================

export const hrSignupSchema = baseSignupSchema.extend({
  role: z.literal('company_hr'),
  company_name: z.string().min(2, 'Company name is required').max(100),
  department: z.string().max(50).optional().or(z.literal('')),
});

export type HRSignupInput = z.infer<typeof hrSignupSchema>;

// ============================================================================
// PROFILE UPDATE SCHEMAS
// ============================================================================

export const updateProfileSchema = z.object({
  full_name: nameSchema.optional(),
  bio: z.string().max(500).optional().or(z.literal('')),
  phone: phoneSchema,
  location: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateArchitectProfileSchema = z.object({
  specialties: z.array(z.string()).optional(),
  experience_years: z.coerce.number().int().min(0).optional(),
  hourly_rate: z.coerce.number().min(0).optional(),
  bio_detailed: z.string().max(2000).optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  is_available: z.boolean().optional(),
});

export type UpdateArchitectProfileInput = z.infer<typeof updateArchitectProfileSchema>;

export const updateClientProfileSchema = z.object({
  company_name: z.string().max(100).optional().or(z.literal('')),
  company_type: z.enum(['individual', 'company', 'startup', 'government']).optional(),
  industry: z.string().max(50).optional().or(z.literal('')),
  company_website: z.string().url().optional().or(z.literal('')),
  company_logo_url: z.string().url().optional().or(z.literal('')),
});

export type UpdateClientProfileInput = z.infer<typeof updateClientProfileSchema>;

// ============================================================================
// PORTFOLIO SCHEMAS
// ============================================================================

export const createPortfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1, 'Select a category'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  tags: z.array(z.string()).optional(),
  project_duration: z.string().optional().or(z.literal('')),
  budget_range: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  featured: z.boolean().optional(),
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;

// ============================================================================
// BLOG POST SCHEMAS
// ============================================================================

export const createBlogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  category: z.string().min(1, 'Select a category'),
  tags: z.array(z.string()).optional(),
  featured_image: z.string().url().optional().or(z.literal('')),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export const createBlogCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
});

export type CreateBlogCommentInput = z.infer<typeof createBlogCommentSchema>;

// ============================================================================
// PROJECT SCHEMAS
// ============================================================================

export const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters').max(3000),
  category: z.string().min(1, 'Select a category'),
  budget_min: z.coerce.number().positive('Invalid budget').optional(),
  budget_max: z.coerce.number().positive('Invalid budget').optional(),
  budget_type: z.enum(['fixed', 'hourly']).default('fixed'),
  specialties_required: z.array(z.string()).min(1, 'Select at least one specialty'),
  timeline: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  deadline: z.coerce.date().optional(),
  attachments: z.array(z.string().url()).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ============================================================================
// BID SCHEMAS
// ============================================================================

export const submitBidSchema = z.object({
  bid_amount: z.coerce.number().positive('Bid amount must be positive'),
  proposal: z.string().min(50, 'Proposal must be at least 50 characters').max(2000),
  timeline_days: z.coerce.number().int().positive('Invalid timeline').optional(),
});

export type SubmitBidInput = z.infer<typeof submitBidSchema>;

// ============================================================================
// MESSAGE SCHEMAS
// ============================================================================

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const submitReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(1000).optional().or(z.literal('')),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

// ============================================================================
// HELPER FUNCTION
// ============================================================================

export const parseFormData = async (schema: z.ZodSchema, data: unknown) => {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { success: false, errors: fieldErrors };
    }
    return { success: false, errors: { _form: ['An unknown error occurred'] } };
  }
};
