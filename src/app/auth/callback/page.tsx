"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase detects hash tokens automatically (detectSessionInUrl: true).
    // We just listen for the SIGNED_IN event and redirect home.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.replace("/");
      }
    });

    // Fallback: if session already exists (e.g. page reloaded), go home now.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 12 }}>
      <img src="/brand/monograma-negro-transparente.svg" alt="" style={{ width: 40, opacity: 0.3 }} />
      <p style={{ color: "var(--text-light)", fontFamily: "inherit", fontSize: 14 }}>Iniciando sesión…</p>
    </div>
  );
}
