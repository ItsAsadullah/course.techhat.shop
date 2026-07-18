import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin() {
  console.log("Logging in as techhat.shop@gmail.com...");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'techhat.shop@gmail.com',
    password: 'TechHat@321'
  });

  if (error) {
    console.error("Login failed:", error.message);
    process.exit(1);
  }

  console.log("Login successful! Updating metadata...");

  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    data: { role: 'admin' }
  });

  if (updateError) {
    console.error("Failed to update user:", updateError.message);
    process.exit(1);
  }

  console.log("User successfully updated to ADMIN!");
  process.exit(0);
}

makeAdmin();
