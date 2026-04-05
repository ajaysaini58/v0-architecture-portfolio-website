-- ============================================================================
-- DByARCH — SEED DATA FOR ALL TABLES
-- Run this AFTER complete-setup.sql to populate tables with data
-- ============================================================================

-- ============================================================================
-- SEED: ARCHITECTS
-- (using gen_random_uuid() since these aren't tied to real auth.users)
-- ============================================================================

INSERT INTO public.architects (id, name, title, location, image_url, cover_image_url, rating, review_count, project_count, bio, featured, hourly_rate, minimum_project_budget, email, phone, specialties, instagram_url, linkedin_url, website_url, twitter_url) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'Sarah Chen',
  'Principal Architect',
  'San Francisco, CA',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  4.9, 127, 48,
  'Award-winning architect with 15+ years of experience in sustainable residential design. My philosophy centers on creating spaces that harmonize with their environment while meeting the unique needs of each client.',
  true, 250, 75000,
  'sarah.chen@architure.com',
  '+1 (415) 555-0123',
  ARRAY['Modern Residential', 'Sustainable Design', 'Interior'],
  'https://instagram.com/sarahchenarch',
  'https://linkedin.com/in/sarahchen',
  'https://sarahchenarchitecture.com',
  'https://twitter.com/sarahchenarch'
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Marcus Weber',
  'Design Director',
  'New York, NY',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  4.8, 89, 62,
  'Specializing in commercial and mixed-use developments, I bring a unique perspective that balances aesthetic innovation with functional excellence.',
  true, 300, 150000,
  'marcus.weber@architure.com',
  '+1 (212) 555-0456',
  ARRAY['Commercial', 'Urban Planning', 'Mixed-Use'],
  'https://instagram.com/marcusweberdesign',
  'https://linkedin.com/in/marcusweber',
  'https://marcusweberdesign.com',
  'https://twitter.com/marcusweber'
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Elena Rodriguez',
  'Senior Architect',
  'Los Angeles, CA',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  4.9, 156, 73,
  'With a passion for blending old and new, I specialize in thoughtful renovations and luxury residential projects that honor architectural heritage while embracing modern living.',
  true, 275, 100000,
  'elena.rodriguez@architure.com',
  '+1 (310) 555-0789',
  ARRAY['Luxury Residential', 'Renovation', 'Historic Preservation'],
  'https://instagram.com/elenarodriguezarch',
  'https://linkedin.com/in/elenarod',
  'https://elenaarchitecture.com',
  'https://twitter.com/elenarod'
),
(
  'a1000000-0000-0000-0000-000000000004',
  'James Okonkwo',
  'Founding Partner',
  'Chicago, IL',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
  4.7, 94, 55,
  'Dedicated to creating spaces that serve communities, my work focuses on public buildings, educational facilities, and spaces that bring people together.',
  false, 225, 125000,
  'james.okonkwo@architure.com',
  '+1 (312) 555-0321',
  ARRAY['Public Buildings', 'Educational', 'Community Spaces'],
  'https://instagram.com/jamesokonkwo',
  'https://linkedin.com/in/james-okonkwo',
  'https://jamesokonkwoarch.com',
  'https://twitter.com/jokonkwo'
),
(
  'a1000000-0000-0000-0000-000000000005',
  'Ana Silva',
  'Lead Architect',
  'Miami, FL',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600573472591-ee6c563aaec8?w=800&h=600&fit=crop',
  4.8, 78, 41,
  'Inspired by coastal landscapes and tropical environments, I create architecture that celebrates natural light, ocean views, and indoor-outdoor living.',
  false, 260, 85000,
  'ana.silva@architure.com',
  '+1 (305) 555-0654',
  ARRAY['Coastal Architecture', 'Resort Design', 'Landscape'],
  'https://instagram.com/anasilvaarch',
  'https://linkedin.com/in/ana-silva',
  'https://anasilva.com',
  'https://twitter.com/anasilva'
),
(
  'a1000000-0000-0000-0000-000000000006',
  'David Kim',
  'Principal Designer',
  'Seattle, WA',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
  4.9, 112, 67,
  'At the intersection of technology and design, I create spaces that embrace innovation while maintaining warmth and human connection.',
  true, 280, 95000,
  'david.kim@architure.com',
  '+1 (206) 555-0987',
  ARRAY['Tech Offices', 'Minimalist', 'Smart Homes'],
  'https://instagram.com/davidkimarch',
  'https://linkedin.com/in/david-kim',
  'https://davidkimdesign.com',
  'https://twitter.com/davidkim'
);

-- ============================================================================
-- SEED: PORTFOLIO PROJECTS
-- ============================================================================

INSERT INTO public.portfolio_projects (title, architect_id, category, location, year, image_url, likes, views, description) VALUES
('Coastal Retreat', 'a1000000-0000-0000-0000-000000000001', 'Residential', 'Malibu, CA', 2024, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', 1284, 15420, 'A stunning oceanfront residence that seamlessly blends indoor and outdoor living spaces.'),
('Urban Loft Conversion', 'a1000000-0000-0000-0000-000000000002', 'Interior', 'Brooklyn, NY', 2024, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', 892, 11230, 'An industrial warehouse transformed into a sophisticated living space with modern amenities.'),
('Hillside Villa', 'a1000000-0000-0000-0000-000000000003', 'Residential', 'Los Angeles, CA', 2023, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop', 2156, 28940, 'A luxurious hillside residence featuring panoramic views and sustainable design elements.'),
('Innovation Campus', 'a1000000-0000-0000-0000-000000000006', 'Commercial', 'Seattle, WA', 2024, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 1567, 19870, 'A forward-thinking tech campus designed to foster collaboration and innovation.'),
('Community Arts Center', 'a1000000-0000-0000-0000-000000000004', 'Public', 'Chicago, IL', 2023, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', 743, 8920, 'A vibrant community space that brings together art, education, and social gathering.'),
('Tropical Beach House', 'a1000000-0000-0000-0000-000000000005', 'Residential', 'Miami, FL', 2024, 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec8?w=800&h=600&fit=crop', 1823, 22450, 'A tropical paradise featuring open-air living and seamless beach access.'),
('Boutique Hotel', 'a1000000-0000-0000-0000-000000000003', 'Commercial', 'Santa Barbara, CA', 2023, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 1456, 17890, 'A boutique hotel that captures the essence of California coastal elegance.'),
('Minimalist Sanctuary', 'a1000000-0000-0000-0000-000000000006', 'Residential', 'Portland, OR', 2024, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop', 2089, 25670, 'A serene minimalist home designed for mindful living and connection with nature.'),
('Garden Terrace House', 'a1000000-0000-0000-0000-000000000001', 'Renovation', 'San Francisco, CA', 2023, 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop', 967, 12340, 'A thoughtful renovation that transforms a Victorian home with modern garden spaces.'),
('Lakeside Cabin', 'a1000000-0000-0000-0000-000000000002', 'Residential', 'Lake Tahoe, CA', 2024, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', 1678, 20150, 'A modern interpretation of the classic mountain cabin with stunning lake views.'),
('Urban Pocket Park', 'a1000000-0000-0000-0000-000000000004', 'Landscape', 'Chicago, IL', 2024, 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&h=600&fit=crop', 534, 6780, 'A small urban park that provides a green oasis in a dense city neighborhood.'),
('Wellness Spa Resort', 'a1000000-0000-0000-0000-000000000005', 'Commercial', 'Palm Beach, FL', 2023, 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop', 1234, 15670, 'A luxury wellness spa designed to promote relaxation and rejuvenation.');

-- ============================================================================
-- SEED: BLOG POSTS (no user_id since these are seed data without auth users)
-- We use a placeholder UUID for user_id
-- ============================================================================

-- Note: blog_posts requires user_id referencing auth.users.
-- For seed data, we skip blog_posts since we can't reference auth.users.
-- The app already has mock blog data via lib/data.ts.

-- ============================================================================
-- SEED: PROJECT BIDS (same issue — user_id references auth.users)
-- We skip these too; mock data in lib/data.ts covers them.
-- ============================================================================

-- Done! After running this, all main tables will have data.
