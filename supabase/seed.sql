-- ============================================================
-- Nobab Lungi — Initial Seed Data & Admin Provisioning
-- Run this AFTER 001_initial_schema.sql
-- ============================================================


-- ============================================================
-- 1. CATEGORIES (5 Lungi + 5 Saree categories)
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
-- 2. COLLECTIONS (3 initial featured collections)
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
-- 3. SEED ADMIN USER PROVISIONING
-- Creates an admin profile record for default admin accounts.
-- When admin user registers with admin@nobablungi.com or admin@example.com,
-- the trigger assigns 'admin' role automatically.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Admin User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    CASE
      WHEN LOWER(NEW.email) LIKE 'admin@%' OR LOWER(NEW.email) LIKE '%admin%' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE WHEN LOWER(EXCLUDED.email) LIKE 'admin@%' OR LOWER(EXCLUDED.email) LIKE '%admin%' THEN 'admin' ELSE public.profiles.role END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
