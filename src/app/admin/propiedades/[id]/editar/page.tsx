"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types/property";
import PropertyForm from "@/components/PropertyForm";

export default function EditarPropiedadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProperty(data as Property);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", flexDirection: "column", gap: 12,
        fontFamily: "system-ui, sans-serif", background: "#f7f7f5",
      }}>
        <img src="/brand/monograma-negro-transparente.svg" alt="" style={{ width: 36, opacity: 0.2 }} />
        <p style={{ color: "#bbb", fontSize: 14, margin: 0 }}>Cargando propiedad…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
        <p style={{ color: "#c62828", marginBottom: 16 }}>Propiedad no encontrada.</p>
        <button
          onClick={() => router.push("/admin/propiedades")}
          style={{ background: "#1a1a1a", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}
        >
          ← Volver al listado
        </button>
      </div>
    );
  }

  return <PropertyForm mode="edit" initialProperty={property!} />;
}
