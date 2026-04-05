-- DByARCH Platform - Supabase Database Schema
-- This SQL creates the database structure for the architecture platform
-- Execute these migrations in your Supabase project

-- ============================================================================
-- USERS & AUTHENTICATION (Uses Supabase Auth)
-- ============================================================================

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('architect', 'client', 'admin')),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  company_name VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT user_profiles_user_type_check CHECK (user_type IN ('architect', 'client', 'admin'))
);

-- ============================================================================
-- ARCHITECTS
-- ============================================================================

CREATE TABLE public.architects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  rating NUMERIC(3, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  bio TEXT,
  featured BOOLEAN DEFAULT FALSE,
  hourly_rate INTEGER,
  minimum_project_budget INTEGER,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  specialties TEXT[] DEFAULT '{}',
  -- Social Links
  instagram_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  website_url VARCHAR(500),
  twitter_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PORTFOLIO PROJECTS
-- ============================================================================

CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  architect_id UUID NOT NULL REFERENCES architects(id) ON DELETE CASCADE,
  category VARCHAR(100),
  location VARCHAR(255),
  year INTEGER,
  image_url VARCHAR(500),
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- BLOG POSTS & COMMENTS
-- ============================================================================

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  likes INTEGER DEFAULT 0,
  published_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PROJECT BIDDING
-- ============================================================================

CREATE TABLE public.project_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_title VARCHAR(255) NOT NULL,
  project_type VARCHAR(100),
  client_name VARCHAR(255),
  budget_min INTEGER,
  budget_max INTEGER,
  timeline_min INTEGER,
  timeline_max INTEGER,
  timeline_unit TEXT CHECK (timeline_unit IN ('weeks', 'months', 'years')),
  location VARCHAR(255),
  description TEXT,
  deadline TIMESTAMP,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Closed', 'Awarded')),
  bids_received INTEGER DEFAULT 0,
  posted_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.architect_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_bid_id UUID NOT NULL REFERENCES project_bids(id) ON DELETE CASCADE,
  architect_id UUID NOT NULL REFERENCES architects(id) ON DELETE CASCADE,
  proposed_budget VARCHAR(50),
  proposed_timeline VARCHAR(50),
  message TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Shortlisted')),
  submitted_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS & RATINGS
-- ============================================================================

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architect_id UUID NOT NULL REFERENCES architects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name VARCHAR(255),
  rating NUMERIC(2, 1) CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  project_bid_id UUID REFERENCES project_bids(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- MESSAGING
-- ============================================================================

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CONTACT MESSAGES (Public Contact Form)
-- ============================================================================

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  response TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_architects_featured ON architects(featured);
CREATE INDEX idx_architects_rating ON architects(rating DESC);
CREATE INDEX idx_architects_user_id ON architects(user_id);
CREATE INDEX idx_portfolio_projects_architect_id ON portfolio_projects(architect_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_comments_post_id ON blog_comments(blog_post_id);
CREATE INDEX idx_project_bids_user_id ON project_bids(user_id);
CREATE INDEX idx_project_bids_status ON project_bids(status);
CREATE INDEX idx_architect_bids_project_id ON architect_bids(project_bid_id);
CREATE INDEX idx_architect_bids_architect_id ON architect_bids(architect_id);
CREATE INDEX idx_reviews_architect_id ON reviews(architect_id);
CREATE INDEX idx_direct_messages_conversation_id ON direct_messages(conversation_id);
CREATE INDEX idx_direct_messages_sender_id ON direct_messages(sender_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architect_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- User Profiles - Users can read their own profile and public architect profiles
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Architects - Public read access, users can update their own
CREATE POLICY "Anyone can view architects" ON architects
  FOR SELECT USING (true);

CREATE POLICY "Architects can update own profile" ON architects
  FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio Projects - Public read access
CREATE POLICY "Anyone can view portfolio projects" ON portfolio_projects
  FOR SELECT USING (true);

-- Blog Posts - Everyone can read approved posts, authors can read own
CREATE POLICY "Anyone can read approved blog posts" ON blog_posts
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Authors can update own blog posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Blog Comments - Anyone can view and insert
CREATE POLICY "Anyone can view blog comments" ON blog_comments
  FOR SELECT USING (true);

-- Project Bids - Users can see their own bids
CREATE POLICY "Users can see own project bids" ON project_bids
  FOR SELECT USING (auth.uid() = user_id);

-- Architect Bids - Architects and bid creators can see
CREATE POLICY "Architects can see bids on their projects" ON architect_bids
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM project_bids WHERE id = project_bid_id) OR
    auth.uid() = (SELECT user_id FROM architects WHERE id = architect_id)
  );

-- Direct Messages - Participants can see their messages
CREATE POLICY "Users can see own messages" ON direct_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- ============================================================================
-- AUDIT TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_timestamp BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_architects_timestamp BEFORE UPDATE ON architects
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_portfolio_projects_timestamp BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_blog_posts_timestamp BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_blog_comments_timestamp BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_project_bids_timestamp BEFORE UPDATE ON project_bids
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_architect_bids_timestamp BEFORE UPDATE ON architect_bids
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reviews_timestamp BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_conversations_timestamp BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
