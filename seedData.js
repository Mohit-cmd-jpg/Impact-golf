require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {  
  console.error('Missing Supabase URL or Service Role Key.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const charities = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Water For All',
    description: 'Providing clean drinking water and sanitation to underserved communities across Africa. With every subscription, you help build wells and water purification systems that transform lives.',
    website: 'https://example.org/water',
    category: 'environment',
    image_url: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070',
    is_featured: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Green Tee Scholars',
    description: 'Funding educational scholarships for underprivileged youth through the game of golf. We believe education is the key to unlocking true potential.',
    website: 'https://example.org/scholars',
    category: 'education',
    image_url: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070',
    is_featured: false,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Fairway Health',
    description: 'Connecting medical professionals with remote communities. Providing vital healthcare services, medications, and health education.',
    website: 'https://example.org/health',
    category: 'health',
    image_url: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070',
    is_featured: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Youth Golf Foundation',
    description: 'Introducing the game of golf to inner-city youth, providing equipment, coaching, and mentorship programs.',
    website: 'https://example.org/youth',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070',
    is_featured: false,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Wildlife Conservation Trust',
    description: 'Protecting endangered species and preserving natural habitats around the world for future generations.',
    website: 'https://example.org/wildlife',
    category: 'environment',
    image_url: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070',
    is_featured: false,
  }
];

async function seed() {
  console.log('Seeding charities...');
  const { data, error } = await supabase.from('charities').upsert(charities, { onConflict: 'id' });
  
  if (error) {
    console.error('\\nError seeding data:', error.message);
  } else {
    console.log('\\nSuccessfully seeded data!');
  }
}

seed();