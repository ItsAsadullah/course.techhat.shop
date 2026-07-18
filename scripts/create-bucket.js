import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createBucket() {
  console.log("Creating 'public' bucket...");
  
  const { data, error } = await supabase.storage.createBucket('public', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'],
    fileSizeLimit: 5242880 // 5MB
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
      console.log("Bucket already exists. Updating to ensure it is public...");
      await supabase.storage.updateBucket('public', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 5242880
      });
      console.log("Bucket updated.");
    } else {
      console.error("Error creating bucket:", error);
    }
  } else {
    console.log("Bucket created successfully:", data);
  }
}

createBucket();
