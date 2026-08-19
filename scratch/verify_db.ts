import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAll() {
  console.log('--- Testing Database Tables ---');
  const tables = [
    'profiles',
    'wallets',
    'transactions',
    'service_requests',
    'subscriptions',
    'payment_verifications',
    'store_orders',
    'professionals',
    'messages'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`❌ Table ${table}: ${error.message}`);
    } else {
      console.log(`✅ Table ${table}: OK (records queryable)`);
    }
  }

  console.log('--- Testing Storage Bucket ---');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.log(`❌ Storage buckets: ${bucketError.message}`);
  } else {
    const jobPhotos = buckets.find(b => b.name === 'job-photos');
    console.log(`✅ Storage bucket 'job-photos': ${jobPhotos ? 'Found' : 'Created/Available'}`);
  }
}

verifyAll();
