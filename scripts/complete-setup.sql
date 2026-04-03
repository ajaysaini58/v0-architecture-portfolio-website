-- ============================================================================
-- DByARCH - COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor to create ALL tables
-- ============================================================================

-- ============================================================================
-- UTILITY FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USERS & AUTHENTICATION (extends Supabase auth.users)
-- ============================================================================

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
  updated_at TIMESTAMP DEFAULT NOW()
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
-- REVIEWS
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
-- CONTACT MESSAGES
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
-- VACANCIES (Job Listings)
-- ============================================================================

CREATE TABLE public.vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary_min INTEGER,
  salary_max INTEGER,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  description TEXT NOT NULL,
  requirements TEXT,
  apply_url VARCHAR(500),
  apply_email VARCHAR(255),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
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
CREATE INDEX idx_vacancies_status ON vacancies(status);
CREATE INDEX idx_vacancies_job_type ON vacancies(job_type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

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
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- User Profiles
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Architects (public read)
CREATE POLICY "Anyone can view architects" ON architects
  FOR SELECT USING (true);
CREATE POLICY "Architects can update own profile" ON architects
  FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio Projects (public read)
CREATE POLICY "Anyone can view portfolio projects" ON portfolio_projects
  FOR SELECT USING (true);

-- Blog Posts
CREATE POLICY "Anyone can read approved blog posts" ON blog_posts
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Authenticated users can create blog posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own blog posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Blog Comments (public read, authenticated write)
CREATE POLICY "Anyone can view blog comments" ON blog_comments
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

-- Project Bids (public read — anyone can browse projects)
CREATE POLICY "Anyone can view project bids" ON project_bids
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create project bids" ON project_bids
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own project bids" ON project_bids
  FOR UPDATE USING (auth.uid() = user_id);

-- Architect Bids
CREATE POLICY "Relevant users can see architect bids" ON architect_bids
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM project_bids WHERE id = project_bid_id) OR
    auth.uid() = (SELECT user_id FROM architects WHERE id = architect_id)
  );
CREATE POLICY "Architects can submit bids" ON architect_bids
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Bid owners can update" ON architect_bids
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM project_bids WHERE id = project_bid_id)
  );

-- Reviews (public read)
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Messages
CREATE POLICY "Users can see own messages" ON direct_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON direct_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Contact Messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Vacancies (public read for approved)
CREATE POLICY "Anyone can view approved vacancies" ON vacancies
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Authenticated users can post vacancies" ON vacancies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own vacancies" ON vacancies
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

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
CREATE TRIGGER update_vacancies_timestamp BEFORE UPDATE ON vacancies
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- SEED DATA: Vacancies
-- ============================================================================

INSERT INTO public.vacancies (title, company, location, salary_min, salary_max, job_type, description, requirements, apply_url, apply_email, status) VALUES
(
  'Senior Architect',
  'Chen Architecture Studio',
  'San Francisco, CA',
  120000, 160000,
  'full-time',
  E'We are looking for a Senior Architect with 8+ years of experience in sustainable residential design. You will lead a team of 4 designers and manage projects from concept to completion.\n\nResponsibilities:\n- Lead design development for residential projects\n- Manage client relationships and presentations\n- Mentor junior architects and interns\n- Oversee construction documentation',
  E'- Licensed Architect (RA) required\n- 8+ years of professional experience\n- Proficiency in Revit, AutoCAD, and SketchUp\n- LEED accreditation preferred\n- Strong portfolio of residential projects',
  'https://example.com/careers/senior-architect',
  'careers@chenarchitecture.com',
  'approved'
),
(
  'Interior Design Associate',
  'Weber Design Group',
  'New York, NY',
  75000, 95000,
  'full-time',
  E'Join our award-winning interior design team in Manhattan. We specialize in high-end commercial interiors for tech companies and creative agencies.\n\nYou will work alongside our Design Director to create innovative workspace solutions that inspire creativity and collaboration.',
  E'- Bachelors degree in Interior Design or Architecture\n- 3-5 years of commercial interior design experience\n- Expertise in 3ds Max, V-Ray, and Adobe Creative Suite\n- Knowledge of building codes and ADA compliance',
  NULL,
  'hr@weberdesign.com',
  'approved'
),
(
  'Architecture Intern',
  'Rodriguez & Partners',
  'Los Angeles, CA',
  45000, 55000,
  'internship',
  E'6-month paid internship opportunity for architecture students or recent graduates. Gain hands-on experience in luxury residential design and historic preservation projects.\n\nYou will be exposed to all phases of design, from schematic concepts to construction administration.',
  E'- Currently enrolled in or recently graduated from an accredited Architecture program\n- Strong hand-sketching and digital rendering skills\n- Familiarity with Revit and Rhino\n- Passion for historic preservation',
  'https://example.com/internships',
  NULL,
  'approved'
),
(
  'Freelance Landscape Architect',
  'Silva Coastal Design',
  'Miami, FL (Remote OK)',
  80, 120,
  'contract',
  E'We need a freelance landscape architect for a luxury resort project in South Florida. The contract is for approximately 4 months with possibility of extension.\n\nThe project involves designing outdoor spaces, pool areas, and tropical gardens for a boutique hotel.',
  E'- Licensed Landscape Architect\n- Experience with tropical/coastal landscape design\n- Portfolio of resort or hospitality projects\n- Available to start within 2 weeks',
  NULL,
  'projects@silvacoastal.com',
  'approved'
);
