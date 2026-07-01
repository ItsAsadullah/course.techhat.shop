import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

export function useSession() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  
  useEffect(() => {
    const supabase = createBrowserClient();
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setData({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || "User",
            image: session.user.user_metadata?.avatar_url,
          }
        });
        setStatus("authenticated");
      } else {
        setData(null);
        setStatus("unauthenticated");
      }
    });

    // Listen for changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setData({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || "User",
            image: session.user.user_metadata?.avatar_url,
          }
        });
        setStatus("authenticated");
      } else {
        setData(null);
        setStatus("unauthenticated");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { data, status };
}

export function signOut(options?: { callbackUrl?: string }) {
  const supabase = createBrowserClient();
  return supabase.auth.signOut().then(() => {
    window.location.href = options?.callbackUrl || "/";
  });
}
