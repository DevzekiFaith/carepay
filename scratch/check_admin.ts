import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmin() {
  const email = 'unovaconsultingfirstafrica@gmail.com';
  console.log(`Checking admin status for: ${email}`);
  
  // This is a browser-side check, we can't easily query auth.users from here without admin key
  // But we can check the profiles table if RLS allows
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .limit(1); // Just checking connectivity
    
  if (error) console.error("Connectivity error:", error.message);
  else console.log("Database connectivity OK.");
}

checkAdmin();
