import { initializeCheckout } from "@/app/actions/payment";
import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { getSettingsByGroup } from "@/lib/actions/settings.actions";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center text-red-500">Please log in first.</div>;
  }

  // Use admin client to bypass RLS for reading orders
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Load order with course name via course_translations
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*, courses!inner(course_translations(name, lang), course_media(thumbnail_url))")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    console.error("Checkout order error:", orderError);
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  if (order.order_status === "PAID") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">পেমেন্ট সফল!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">আপনার পেমেন্ট সফলভাবে যাচাই করা হয়েছে।</p>
          <a href="/dashboard/courses" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors">
            কোর্স শুরু করুন
          </a>
        </div>
      </div>
    );
  }

  const { data: session } = await supabaseAdmin
    .from("payment_sessions")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (!session) {
    return <div className="p-8 text-center text-red-500">Payment session not found. Please try enrolling again.</div>;
  }

  // Extract course name from nested translations
  const translations = (order as any).courses?.course_translations || [];
  const courseName = translations.find((t: any) => t.lang === 'en')?.name || 
                     translations.find((t: any) => t.lang === 'bn')?.name || "কোর্স";

  // Extract thumbnail
  let courseThumbnail = null;
  const media = (order as any).courses?.course_media;
  if (Array.isArray(media)) {
    courseThumbnail = media[0]?.thumbnail_url;
  } else if (media) {
    courseThumbnail = media.thumbnail_url;
  }

  const orderForClient = {
    ...order,
    courseName,
    courseThumbnail,
  };

  // Fetch payment settings
  const paymentSettingsGroup = await getSettingsByGroup('payments');
  const settingsObj: Record<string, string> = {};
  if (paymentSettingsGroup) {
    paymentSettingsGroup.settings.forEach(s => {
      settingsObj[s.key] = s.value || '';
    });
  }

  let avatarUrl = user.user_metadata?.avatar_url || null;

  if (user.user_metadata?.student_id && !avatarUrl) {
    const { data: photoDoc } = await supabaseAdmin
      .from('student_documents')
      .select('file_url')
      .eq('student_id', user.user_metadata.student_id)
      .eq('document_type', 'photo')
      .single();
    
    if (photoDoc) {
      avatarUrl = photoDoc.file_url;
    }
  }

  const userInfo = {
    name: user.user_metadata?.full_name || "User",
    avatar: avatarUrl,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CheckoutClient 
          session={session} 
          order={orderForClient} 
          paymentSettings={settingsObj}
          user={userInfo}
        />
      </div>
      <Footer />
    </div>
  );
}
