"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { thumbGallery, thumbStrip } from "@/lib/cloudinary";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property, STATUS_LABELS } from "@/types/property";

// ─── re-use all the same rendering logic as the public detail page ────────────
// but fetches regardless of is_published and guards with admin check

const ORIENTATION_LABELS: Record<string, Record<string, string>> = {
  es: { north: "Norte", south: "Sur", east: "Este", west: "Oeste" },
  en: { north: "North", south: "South", east: "East", west: "West" },
  fr: { north: "Nord",  south: "Sud",  east: "Est",  west: "Ouest" },
  de: { north: "Nord",  south: "Süd",  east: "Ost",  west: "West" },
};

const ENERGY_COLORS: Record<string, string> = {
  A: "#1a9e5c", B: "#4cb76e", C: "#b5d13a",
  D: "#f5e12d", E: "#f5a623", F: "#e8651a", G: "#d42b2b",
};

export default function AdminPropertyPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const d = t.propertyDetail;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    async function load() {
      // Guard: must be admin
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) { router.replace("/"); return; }
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", sessionData.session.user.id).single();
      if (!roleData || !["admin", "agent"].includes(roleData.role)) { router.replace("/"); return; }

      // Fetch without is_published filter
      const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
      if (error || !data) { router.replace("/admin/propiedades"); return; }
      setProperty(data as Property);
      setPhotoIndex((data as Property).main_photo_index ?? 0);
      setLoading(false);
    }
    load();
  }, [id, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightboxOpen || !property) return;
      if (e.key === "ArrowRight") setPhotoIndex((i) => (i + 1) % property.photos.length);
      if (e.key === "ArrowLeft") setPhotoIndex((i) => (i - 1 + property.photos.length) % property.photos.length);
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, property]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#bbb", fontFamily: "inherit" }}>Cargando vista previa…</p>
    </div>
  );

  if (!property) return null;
  const p = property;
  const photos = p.photos ?? [];

  const descriptionText =
    (p[`description_${lang}` as keyof Property] as string | null)?.trim() || p.description_es || "";

  const ptMap: Record<string, string> = {
    apartment: d.ptApartment, house: d.ptHouse, studio: d.ptStudio,
    penthouse: d.ptPenthouse, duplex: d.ptDuplex, commercial: d.ptCommercial,
    office: d.ptOffice, land: d.ptLand, garage: d.ptGarage, storage: d.ptStorage,
  };
  const propertyTypeLabel = ptMap[p.property_type] ?? p.property_type;
  const priceLabel = p.operation_type === "sale"
    ? `${p.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`
    : `${p.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €/mes`;

  const locationParts = [p.address, p.neighborhood, p.district, p.city].filter(Boolean);

  const features: [string, boolean][] = [
    [d.fExterior, p.is_exterior], [d.fElevator, p.has_elevator], [d.fAC, p.has_air_conditioning],
    [d.fTerrace, p.has_terrace], [d.fBalcony, p.has_balcony], [d.fWardrobes, p.has_built_in_wardrobes],
    [d.fGarage, p.has_garage], [d.fStorage, p.has_storage], [d.fPool, p.has_pool], [d.fGarden, p.has_garden],
  ];

  return (
    <>
      {/* Preview banner */}
      <div style={banner}>
        <span>👁 Vista previa — Esta propiedad aún no está publicada</span>
        <a href={`/admin/propiedades/${p.id}/editar`} style={bannerLink}>← Volver a editar</a>
      </div>

      <Navbar />

      {lightboxOpen && photos.length > 0 && (
        <div style={ls.lightbox} onClick={() => setLightboxOpen(false)}>
          <button style={ls.lightboxClose} onClick={() => setLightboxOpen(false)}>✕</button>
          <button style={{ ...ls.lightboxNav, left: 16 }} onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i - 1 + photos.length) % photos.length); }}>‹</button>
          <img src={thumbGallery(photos[photoIndex])} alt="" style={ls.lightboxImg} onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()} />
          <button style={{ ...ls.lightboxNav, right: 16 }} onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i + 1) % photos.length); }}>›</button>
          <p style={ls.lightboxCounter}>{photoIndex + 1} / {photos.length}</p>
        </div>
      )}

      <main style={{ background: "var(--off-white)", minHeight: "80vh" }}>
        {photos.length > 0 && (
          <div style={{ background: "var(--black)" }}>
            <div style={{ position: "relative", maxHeight: 520, overflow: "hidden", cursor: "zoom-in", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }} onClick={() => setLightboxOpen(true)}>
              <img src={thumbGallery(photos[photoIndex])} alt="" style={{ width: "100%", maxHeight: 520, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                {photos.length} {d.photos}
              </div>
            </div>
            {photos.length > 1 && (
              <div style={{ display: "flex", gap: 3, background: "#111", padding: "3px 0 0", overflowX: "auto" }}>
                {photos.slice(0, 6).map((url, i) => (
                  <div key={i} style={{ flexShrink: 0, width: 80, height: 56, cursor: "pointer", overflow: "hidden", position: "relative", opacity: i === photoIndex ? 1 : 0.6 }} onClick={() => setPhotoIndex(i)}>
                    <img src={thumbStrip(url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "40px 24px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 13, color: "var(--text-light)", margin: "0 0 16px" }}>
                {p.operation_type === "sale" ? d.buy : d.rent} › {p.city}{p.neighborhood ? ` › ${p.neighborhood}` : ""}
              </p>
              <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, fontFamily: "var(--font-playfair),serif", color: "var(--black)", margin: "0 0 10px", lineHeight: 1.25 }}>
                {d.pageTitle(propertyTypeLabel, p.rooms ?? null, p.neighborhood ?? p.city ?? null)}
              </h1>
              <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: "var(--text-light)", margin: "0 0 24px" }}>
                📍 {locationParts.join(", ")}
              </p>
              {descriptionText && (
                <div style={{ margin: "0 0 36px" }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--black)", margin: "0 0 14px", fontFamily: "var(--font-playfair),serif", paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>{d.sDescription}</h2>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text)", whiteSpace: "pre-line", margin: 0 }}>{descriptionText}</p>
                </div>
              )}
              <div style={{ margin: "0 0 36px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--black)", margin: "0 0 14px", fontFamily: "var(--font-playfair),serif", paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>{d.sFeatures}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "8px 16px" }}>
                  {features.filter(([, v]) => v).map(([label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text)" }}>
                      <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13 }}>✓</span>{label}
                    </div>
                  ))}
                  {p.orientation?.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text)" }}>
                      <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13 }}>✓</span>
                      {p.orientation.map((o) => (ORIENTATION_LABELS[lang] ?? ORIENTATION_LABELS.es)[o]).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ position: "sticky", top: 80 }}>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-playfair),serif" }}>{priceLabel}</div>
                <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, alignSelf: "flex-start", background: "#e8f5e9", color: "#2e7d32" }}>
                  {STATUS_LABELS[p.status]}
                </div>
                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                {p.internal_reference && <p style={{ fontSize: 12, color: "var(--mid-gray)", margin: 0 }}>{d.ref} {p.internal_reference}</p>}
                <button style={{ display: "block", background: "var(--gold)", color: "white", textAlign: "center", padding: 13, borderRadius: 8, fontSize: 15, fontWeight: 600, border: "none", cursor: "default", fontFamily: "inherit" }}>
                  {d.requestInfo}
                </button>
                <p style={{ fontSize: 12, color: "var(--mid-gray)", textAlign: "center", margin: "4px 0 0", lineHeight: 1.5 }}>{d.responseGuarantee}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const banner: React.CSSProperties = {
  background: "#1a1a1a",
  color: "white",
  fontSize: 13,
  fontWeight: 500,
  padding: "10px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  position: "sticky",
  top: 0,
  zIndex: 200,
};
const bannerLink: React.CSSProperties = {
  color: "var(--gold-light, #e8c96a)",
  textDecoration: "none",
  fontSize: 13,
  whiteSpace: "nowrap",
};
const ls: { [k: string]: React.CSSProperties } = {
  lightbox: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  lightboxImg: { maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 4 },
  lightboxClose: { position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer", lineHeight: 1, zIndex: 10 },
  lightboxNav: { position: "absolute", background: "rgba(255,255,255,0.12)", border: "none", color: "white", fontSize: 36, cursor: "pointer", borderRadius: 8, padding: "12px 18px", lineHeight: 1, top: "50%", transform: "translateY(-50%)" },
  lightboxCounter: { position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "inherit" },
};
