-- ============================================================
-- Nobab Lungi — Initial Seed Data
-- Run this AFTER schema.sql, functions.sql, and rls-policies.sql
-- ============================================================


-- ============================================================
-- CATEGORIES
-- 5 Lungi + 5 Saree categories from PROJECT_SPEC.md
-- slug format: kebab-case, prefixed with parent type
-- ============================================================

INSERT INTO public.categories (name, slug, description, parent_type, sort_order) VALUES
  -- Lungi categories
  ('Premium Cotton Lungi',  'lungi-premium-cotton',  'Finest quality cotton lungis crafted for comfort and durability.',                 'lungi', 1),
  ('Export Quality Lungi',  'lungi-export-quality',  'Lungis meeting international export standards with superior finish.',              'lungi', 2),
  ('Check Lungi',           'lungi-check',           'Classic check-pattern lungis, a timeless Bangladeshi tradition.',                  'lungi', 3),
  ('Printed Lungi',         'lungi-printed',         'Vibrant printed lungis with modern and traditional patterns.',                    'lungi', 4),
  ('Handloom Lungi',        'lungi-handloom',        'Authentic handwoven lungis crafted by skilled artisans.',                         'lungi', 5),

  -- Saree categories
  ('Cotton Saree',          'saree-cotton',          'Lightweight and breathable cotton sarees for everyday elegance.',                  'saree', 1),
  ('Jamdani Saree',         'saree-jamdani',         'UNESCO heritage Jamdani sarees — intricate motifs on fine muslin.',               'saree', 2),
  ('Silk Saree',            'saree-silk',            'Luxurious silk sarees for special occasions and celebrations.',                   'saree', 3),
  ('Printed Saree',         'saree-printed',         'Contemporary printed sarees blending modern art with traditional draping.',       'saree', 4),
  ('Handloom Saree',        'saree-handloom',        'Hand-woven sarees celebrating the rich textile heritage of Bangladesh.',          'saree', 5)

ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- COLLECTIONS
-- 3 initial featured collections
-- ============================================================

INSERT INTO public.collections (name, slug, description, is_featured, sort_order) VALUES
  (
    'Eid Special',
    'eid-special',
    'Celebrate Eid in style with our exclusive collection of premium lungis and sarees, perfect for the festive season.',
    TRUE,
    1
  ),
  (
    'Summer Collection',
    'summer-collection',
    'Beat the heat with our lightweight, breathable summer fabrics — carefully selected for comfort in the Bangladeshi climate.',
    TRUE,
    2
  ),
  (
    'New Arrivals',
    'new-arrivals',
    'Discover our latest additions — freshly crafted lungis and sarees with the newest patterns and designs.',
    TRUE,
    3
  )

ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- NOTE: No products, banners, or users are seeded here.
-- Products should be created via the Admin Dashboard with
-- real images uploaded to Cloudinary.
-- 
-- To set the first admin, run this in Supabase SQL Editor:
--   ALTER DATABASE postgres SET app.admin_email = 'your@email.com';
-- Then sign up with that email address.
-- ============================================================
