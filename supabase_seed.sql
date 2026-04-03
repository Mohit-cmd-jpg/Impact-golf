-- Seed data for charities
INSERT INTO public.charities (id, name, description, website, category, image_url, is_featured)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Water For All', 'Providing clean drinking water and sanitation to underserved communities across Africa. With every subscription, you help build wells and water purification systems that transform lives.', 'https://example.org/water', 'environment', 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070', true),
  ('22222222-2222-2222-2222-222222222222', 'Green Tee Scholars', 'Funding educational scholarships for underprivileged youth through the game of golf. We believe education is the key to unlocking true potential.', 'https://example.org/scholars', 'education', 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070', false),
  ('33333333-3333-3333-3333-333333333333', 'Fairway Health', 'Connecting medical professionals with remote communities. Providing vital healthcare services, medications, and health education.', 'https://example.org/health', 'health', 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070', true),
  ('44444444-4444-4444-4444-444444444444', 'Youth Golf Foundation', 'Introducing the game of golf to inner-city youth, providing equipment, coaching, and mentorship programs.', 'https://example.org/youth', 'sports', 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070', false),
  ('55555555-5555-5555-5555-555555555555', 'Wildlife Conservation Trust', 'Protecting endangered species and preserving natural habitats around the world for future generations.', 'https://example.org/wildlife', 'environment', 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070', false)
ON CONFLICT (id) DO NOTHING;
