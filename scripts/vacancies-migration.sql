-- ============================================================================
-- VACANCIES TABLE (Add to existing schema)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vacancies (
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_job_type ON vacancies(job_type);

-- RLS
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- Public read for approved vacancies
CREATE POLICY "Anyone can view approved vacancies" ON vacancies
  FOR SELECT USING (status = 'approved');

-- Authenticated users can insert
CREATE POLICY "Authenticated users can post vacancies" ON vacancies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update own vacancies
CREATE POLICY "Users can update own vacancies" ON vacancies
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin can manage all (using service role key, bypasses RLS)

-- Timestamp trigger
CREATE TRIGGER update_vacancies_timestamp BEFORE UPDATE ON vacancies
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- FIX: Make project_bids publicly readable
-- ============================================================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can see own project bids" ON project_bids;

-- Allow anyone to view open project bids
CREATE POLICY "Anyone can view project bids" ON project_bids
  FOR SELECT USING (true);

-- Authenticated users can create project bids
CREATE POLICY "Authenticated users can create project bids" ON project_bids
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update own project bids
CREATE POLICY "Users can update own project bids" ON project_bids
  FOR UPDATE USING (auth.uid() = user_id);

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
  E'Join our award-winning interior design team in Manhattan. We specialize in high-end commercial interiors for tech companies and creative agencies.\n\nYou''ll work alongside our Design Director to create innovative workspace solutions that inspire creativity and collaboration.',
  E'- Bachelor''s degree in Interior Design or Architecture\n- 3-5 years of commercial interior design experience\n- Expertise in 3ds Max, V-Ray, and Adobe Creative Suite\n- Knowledge of building codes and ADA compliance',
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
  E'6-month paid internship opportunity for architecture students or recent graduates. Gain hands-on experience in luxury residential design and historic preservation projects.\n\nYou''ll be exposed to all phases of design, from schematic concepts to construction administration.',
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
