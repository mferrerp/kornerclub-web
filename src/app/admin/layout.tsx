"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/?auth=required");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (!roleData || !["admin", "agent"].includes(roleData.role)) {
        router.replace("/?auth=unauthorized");
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    checkAccess();
  }, [router]);

  if (checking) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: 12,
        fontFamily: "system-ui, sans-serif",
        background: "#f7f7f5",
      }}>
        <img
          src="/brand/monograma-negro-transparente.svg"
          alt=""
          style={{ width: 36, opacity: 0.2 }}
        />
        <p style={{ color: "#bbb", fontSize: 14, margin: 0 }}>Verificando acceso…</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
