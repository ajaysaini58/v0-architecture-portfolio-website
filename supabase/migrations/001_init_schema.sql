-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum types for user roles
CREATE TYPE user_role AS ENUM ('architect', 'client', 'company_hr', 'student', 'admin');
CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  country TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Architect profiles
CREATE TABLE architect_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER,
  hourly_rate DECIMAL(10, 2),
  bio_detailed TEXT,
  website_url TEXT,
  portfolio_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  response_time_hours INTEGER,
  verified_badge BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client/Company profiles
CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  company_type TEXT, -- 'individual', 'company', 'startup', 'government'
  industry TEXT,
  company_size TEXT,
  company_website TEXT,
  company_logo_url TEXT,
  total_projects_posted INTEGER DEFAULT 0,
  response_rate DECIMAL(3, 2) DEFAULT 0,
  total_budget_spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  university TEXT,
  degree TEXT,
  graduation_year INTEGER,
  interests TEXT[] NOT NULL DEFAULT '{}',
  portfolio_url TEXT,
  seeking_internship BOOLEAN DEFAULT TRUE,
  seeking_mentorship BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- HR/Company profiles
CREATE TABLE hr_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  department TEXT,
  job_postings_count INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio items
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  architect_id UUID NOT NULL REFERENCES architect_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  project_duration TEXT,
  budget_range TEXT,
  location TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status blog_status DEFAULT 'draft',
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMP,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog comments
CREATE TABLE blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog likes
CREATE TABLE blog_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Projects posted by clients
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  posted_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  budget_type TEXT DEFAULT 'fixed', -- 'fixed' or 'hourly'
  status project_status DEFAULT 'open',
  category TEXT NOT NULL,
  specialties_required TEXT[] NOT NULL DEFAULT '{}',
  location TEXT,
  timeline TEXT,
  attachments TEXT[] NOT NULL DEFAULT '{}',
  views INTEGER DEFAULT 0,
  bid_count INTEGER DEFAULT 0,
  selected_architect_id UUID REFERENCES architect_profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deadline TIMESTAMP
);

-- Bids on projects
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  architect_id UUID NOT NULL REFERENCES architect_profiles(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10, 2) NOT NULL,
  proposal TEXT NOT NULL,
  timeline_days INTEGER,
  status bid_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, architect_id)
);

-- Direct messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Message conversations (for grouping)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Portfolio likes
CREATE TABLE portfolio_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(portfolio_id, user_id)
);

-- Connections/Follows
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Reviews/Ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  architect_id UUID NOT NULL REFERENCES architect_profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_architect_profiles_user_id ON architect_profiles(user_id);
CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_portfolios_architect_id ON portfolios(architect_id);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_bids_project_id ON bids(project_id);
CREATE INDEX idx_bids_architect_id ON bids(architect_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_conversations_participants ON conversations(participant_1_id, participant_2_id);
CREATE INDEX idx_reviews_architect_id ON reviews(architect_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE architect_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (public read, owner write)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for architect_profiles (public read, owner write)
CREATE POLICY "Architect profiles are public" ON architect_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Architects can update own profile" ON architect_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Architects can insert own profile" ON architect_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for client_profiles (public read, owner write)
CREATE POLICY "Client profiles are public" ON client_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Clients can update own profile" ON client_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Clients can insert own profile" ON client_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for portfolios (public read, owner write)
CREATE POLICY "Portfolios are public" ON portfolios
  FOR SELECT USING (TRUE);

CREATE POLICY "Architects can manage own portfolios" ON portfolios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM architect_profiles ap
      WHERE ap.id = portfolios.architect_id AND ap.user_id = auth.uid()
    )
  );

-- RLS Policies for blog_posts
CREATE POLICY "Published blog posts are public" ON blog_posts
  FOR SELECT USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY "Authors can manage own posts" ON blog_posts
  FOR ALL USING (author_id = auth.uid());

-- RLS Policies for blog_comments
CREATE POLICY "Comments on published posts are public" ON blog_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts bp
      WHERE bp.id = blog_comments.post_id AND (bp.status = 'published' OR bp.author_id = auth.uid())
    )
  );

CREATE POLICY "Users can add comments" ON blog_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- RLS Policies for projects
CREATE POLICY "Projects are public" ON projects
  FOR SELECT USING (TRUE);

CREATE POLICY "Clients can manage own projects" ON projects
  FOR ALL USING (posted_by_user_id = auth.uid());

-- RLS Policies for bids
CREATE POLICY "Bids are viewable by project client or bidder" ON bids
  FOR SELECT USING (
    auth.uid() IN (
      SELECT posted_by_user_id FROM projects WHERE id = project_id
    ) OR
    EXISTS (
      SELECT 1 FROM architect_profiles ap
      WHERE ap.id = architect_id AND ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Architects can create bids" ON bids
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM architect_profiles ap
      WHERE ap.id = architect_id AND ap.user_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_architect_profiles_updated_at BEFORE UPDATE ON architect_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
