import { createClient } from "@/lib/admin/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "আপনাকে প্রথমে techhat.shop@gmail.com দিয়ে ওয়েবসাইটে লগইন করতে হবে!" }, { status: 401 });
  }

  if (user.email !== "techhat.shop@gmail.com") {
    return NextResponse.json({ error: "দুঃখিত! শুধুমাত্র techhat.shop@gmail.com অ্যাকাউন্টটি এই স্ক্রিপ্ট দিয়ে অ্যাডমিন হতে পারবে। আপনি বর্তমানে লগইন আছেন: " + user.email }, { status: 403 });
  }

  // Update user_metadata to set role as admin
  const { error } = await supabase.auth.updateUser({
    data: { role: "admin" }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: "অভিনন্দন! techhat.shop@gmail.com এখন অ্যাডমিন। দয়া করে একবার ওয়েবসাইট থেকে লগআউট করে আবার লগইন করুন, তাহলে অ্যাডমিন ড্যাশবোর্ড পেয়ে যাবেন।" 
  });
}
