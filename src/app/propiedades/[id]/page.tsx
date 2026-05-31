"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { thumbGallery, thumbStrip } from "@/lib/cloudinary";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property, STATUS_LABELS } from "@/types/property";

// Orientation labels per language
const ORIENTATION_LABELS: Record<string, Record<string, string>> = {
  es: { north: "Norte", south: "Sur", east: "Este", west: "Oeste" },
  en: { north: "North", south: "South", east: "East", west: "West" },
  fr: { north: "Nord",  south: "Sud",  east: "Est",  west: "Ouest" },
  de: { north: "Nord",  south: "Süd",  east: "Ost",  west: "West" },
};

const ENERGY_COLORS: Record<string, string> = {
  A: "#1a9e5c", B: "#4cb76e", C: "#b5d13a",
  D: "#f5e12d", E: "#f5a623", F: "#e8651a", G: "#d42b2b",
  exempt: "#888", in_progress: "#888",
};

export default function PropiedadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const d = t.propertyDetail;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.replace("/"); return; }
        setProperty(data as Property);
        setPhotoIndex((data as Property).main_photo_index ?? 0);
        setLoading(false);
      });
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
          <img src="/brand/monograma-negro-transparente.svg" alt="" style={{ width: 36, opacity: 0.2 }} />
          <p style={{ color: "#bbb", fontSize: 14, fontFamily: "inherit" }}>{d.loading}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) return null;

  const p = property;
  const photos = p.photos ?? [];
  const hasPhotos = photos.length > 0;

  // Description: show the field matching the current language, fall back to ES
  const descriptionText =
    (p[`description_${lang}` as keyof Property] as string | null)?.trim() ||
    p.description_es || "";

  // Property type label in current language
  const ptMap: Record<string, string> = {
    apartment: d.ptApartment, house: d.ptHouse, studio: d.ptStudio,
    penthouse: d.ptPenthouse, duplex: d.ptDuplex, commercial: d.ptCommercial,
    office: d.ptOffice, land: d.ptLand, garage: d.ptGarage, storage: d.ptStorage,
  };
  const propertyTypeLabel = ptMap[p.property_type] ?? p.property_type;

  const formatPrice = (n: number) =>
    n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const priceLabel = p.operation_type === "sale"
    ? `${formatPrice(p.price)} €`
    : `${formatPrice(p.price)} €/mes`;

  // Address visibility
  const streetOnly = p.address
    ? p.address.replace(/,?\s*\d+[a-zA-Z]?\s*$/, "").trim()
    : null;

  const visibleAddress =
    p.address_visibility === "exact" ? p.address
    : p.address_visibility === "street_only" ? streetOnly
    : null;

  const locationParts = [visibleAddress, p.neighborhood, p.district, p.city].filter(Boolean);
  const showPostalCode = p.address_visibility === "exact" && p.postal_code;

  const features: [string, boolean][] = [
    [d.fExterior, p.is_exterior],
    [d.fElevator, p.has_elevator],
    [d.fAC, p.has_air_conditioning],
    [d.fTerrace, p.has_terrace],
    [d.fBalcony, p.has_balcony],
    [d.fWardrobes, p.has_built_in_wardrobes],
    [d.fGarage, p.has_garage],
    [d.fStorage, p.has_storage],
    [d.fPool, p.has_pool],
    [d.fGarden, p.has_garden],
    [d.fAccessibleExt, p.accessible_exterior],
    [d.fAccessibleInt, p.accessible_interior],
  ];

  return (
    <>
      <Navbar />

      {/* Lightbox */}
      {lightboxOpen && hasPhotos && (
        <div
          style={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
        >
          <button style={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>✕</button>
          <button
            style={{ ...styles.lightboxNav, left: 16 }}
            onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i - 1 + photos.length) % photos.length); }}
          >‹</button>
          <img
            src={photos[photoIndex]}
            alt=""
            style={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            style={{ ...styles.lightboxNav, right: 16 }}
            onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i + 1) % photos.length); }}
          >›</button>
          <p style={styles.lightboxCounter}>{photoIndex + 1} / {photos.length}</p>
        </div>
      )}

      <main style={styles.main}>
        {/* Photo gallery */}
        {hasPhotos && (
          <div style={styles.gallery}>
            {/* Main photo */}
            <div
              style={styles.galleryMain}
              onClick={() => setLightboxOpen(true)}
            >
              <img src={thumbGallery(photos[photoIndex])} alt="" style={styles.galleryMainImg} />
              <div style={styles.photoCount}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
                {photos.length} {d.photos}
              </div>
            </div>
            {/* Thumbnails */}
            {photos.length > 1 && (
              <div style={styles.thumbRow}>
                {photos.slice(0, 6).map((url, i) => (
                  <div
                    key={i}
                    style={{ ...styles.thumb, ...(i === photoIndex ? styles.thumbActive : {}) }}
                    onClick={() => setPhotoIndex(i)}
                  >
                    <img src={thumbStrip(url)} alt="" style={styles.thumbImg} />
                    {i === 5 && photos.length > 6 && (
                      <div style={styles.thumbMore}>+{photos.length - 6}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={styles.container}>
          <div style={styles.layout}>
            {/* Left: details */}
            <div style={styles.left}>
              {/* Breadcrumb */}
              <p style={styles.breadcrumb}>
                <a href={p.operation_type === "sale" ? "/comprar" : "/alquiler"} style={styles.breadcrumbLink}>
                  {p.operation_type === "sale" ? d.buy : d.rent}
                </a>
                {" › "}
                {p.city}
                {p.neighborhood ? ` › ${p.neighborhood}` : ""}
              </p>

              {/* Title block */}
              <h1 style={styles.title}>
                {d.pageTitle(
                  propertyTypeLabel,
                  p.rooms ?? null,
                  p.neighborhood ?? p.city ?? null
                )}
              </h1>

              <p style={styles.locationLine}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {locationParts.join(", ")}
                {showPostalCode ? ` · ${p.postal_code}` : ""}
              </p>

              {/* Key metrics */}
              <div style={styles.metrics}>
                {p.size_m2 && <MetricBadge icon="📐" label={`${p.size_m2} m²`} sub={d.sqmBuilt} />}
                {p.useful_size_m2 && <MetricBadge icon="📐" label={`${p.useful_size_m2} m²`} sub={d.sqmUseful} />}
                {p.rooms != null && <MetricBadge icon="🛏" label={`${p.rooms}`} sub={p.rooms === 1 ? d.roomSingular : d.roomPlural} />}
                {p.bathrooms != null && <MetricBadge icon="🚿" label={`${p.bathrooms}`} sub={p.bathrooms === 1 ? d.bathSingular : d.bathPlural} />}
                {p.floor != null && <MetricBadge icon="🏢" label={`${d.floorPrefix} ${p.floor}`} sub={p.is_top_floor ? d.lastFloor : ""} />}
                {p.construction_year && <MetricBadge icon="🏗" label={`${p.construction_year}`} sub={d.yearBuilt} />}
              </div>

              {/* Description */}
              {descriptionText && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>{d.sDescription}</h2>
                  <p style={styles.description}>{descriptionText}</p>
                </div>
              )}

              {/* Features */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>{d.sFeatures}</h2>
                <div style={styles.featureGrid}>
                  {features.filter(([, v]) => v).map(([label]) => (
                    <div key={label} style={styles.featureItem}>
                      <span style={styles.featureCheck}>✓</span>
                      {label}
                    </div>
                  ))}
                  {p.orientation.length > 0 && (
                    <div style={styles.featureItem}>
                      <span style={styles.featureCheck}>✓</span>
                      {p.orientation.map((o) => (ORIENTATION_LABELS[lang] ?? ORIENTATION_LABELS.es)[o]).join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment & heating */}
              {(p.kitchen_equipment || p.heating_type) && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>{d.sEquipment}</h2>
                  <div style={styles.detailList}>
                    {p.kitchen_equipment && (
                      <DetailRow label={d.lKitchen} value={
                        p.kitchen_equipment === "fully_equipped_furnished" ? d.kFullFurnished
                        : p.kitchen_equipment === "fully_equipped_unfurnished" ? d.kFullUnfurnished
                        : p.kitchen_equipment === "empty_unfurnished" ? d.kEmpty
                        : d.kEmpty
                      } />
                    )}
                    {p.heating_type && (
                      <DetailRow label={d.lHeating} value={
                        (p.heating_type === "central" ? d.hCentral : p.heating_type === "individual" ? d.hIndividual : d.hNone)
                        + (p.heating_fuel ? ` (${p.heating_fuel === "gas" ? d.fuelGas : p.heating_fuel === "electric" ? d.fuelElectric : p.heating_fuel === "gasoil" ? d.fuelGasoil : d.fuelOther})` : "")
                      } />
                    )}
                    {p.condition && (
                      <DetailRow label={d.lCondition} value={
                        p.condition === "new" ? d.condNew
                        : p.condition === "good" ? d.condGood
                        : d.condRenovation
                      } />
                    )}
                  </div>
                </div>
              )}

              {/* Energy */}
              {(p.energy_certificate || p.emissions_certificate) && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>{d.sEnergy}</h2>
                  <div style={styles.energyRow}>
                    {p.energy_certificate && p.energy_certificate !== "exempt" && p.energy_certificate !== "in_progress" && (
                      <EnergyBadge label="Energía" grade={p.energy_certificate} value={p.energy_consumption ? `${p.energy_consumption} kWh/m²` : undefined} />
                    )}
                    {p.emissions_certificate && p.emissions_certificate !== "exempt" && p.emissions_certificate !== "in_progress" && (
                      <EnergyBadge label="Emisiones" grade={p.emissions_certificate} value={p.emissions_value ? `${p.emissions_value} kg CO₂/m²` : undefined} />
                    )}
                  </div>
                </div>
              )}

              {/* Floor plans */}
              {p.floor_plan_photos?.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>{d.sFloorPlans}</h2>
                  <div style={styles.floorPlanGrid}>
                    {p.floor_plan_photos.map((url, i) => {
                      const isPdf = url.includes("/raw/upload/") || url.toLowerCase().endsWith(".pdf");
                      return isPdf ? (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.pdfCard}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="9" y1="13" x2="15" y2="13" />
                            <line x1="9" y1="17" x2="12" y2="17" />
                          </svg>
                          <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>Plano {i + 1}</span>
                          <span style={{ fontSize: 11, color: "var(--gold-dark)", fontWeight: 600 }}>Ver PDF →</span>
                        </a>
                      ) : (
                        <img key={i} src={url} alt={`Plano ${i + 1}`} style={styles.floorPlanImg} />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Video / virtual tour */}
              {(p.video_url || p.virtual_tour_url) && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>{d.sMultimedia}</h2>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                    {p.video_url && (
                      <a href={p.video_url} target="_blank" rel="noopener noreferrer" style={styles.mediaLink}>
                        {d.watchVideo}
                      </a>
                    )}
                    {p.virtual_tour_url && (
                      <a href={p.virtual_tour_url} target="_blank" rel="noopener noreferrer" style={styles.mediaLink}>
                        {d.virtualTour}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: sticky contact card */}
            <div style={styles.right}>
              <div style={styles.contactCard}>
                {/* Price */}
                <div style={styles.cardPrice}>{priceLabel}</div>

                {/* Status */}
                <div style={{ ...styles.statusBadge, ...statusColor[p.status] }}>
                  {STATUS_LABELS[p.status]}
                </div>

                <hr style={styles.divider} />

                {/* Ref */}
                {p.internal_reference && (
                  <p style={styles.cardRef}>{d.ref} {p.internal_reference}</p>
                )}

                {/* CTA */}
                <button
                  onClick={() => {
                    const ref = p.internal_reference ?? p.id.slice(0, 8);
                    window.dispatchEvent(new CustomEvent("open-contact-modal", {
                      detail: { lockedPurpose: t.agent.purposeProperty.replace("{ref}", ref) },
                    }));
                  }}
                  style={{ ...styles.ctaBtn, border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "center" as const }}
                >
                  {d.requestInfo}
                </button>

                <p style={styles.cardNote}>
                  {d.responseGuarantee}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricBadge({ icon, label, sub }: { icon: string; label: string; sub?: string }) {
  return (
    <div style={subStyles.metricBadge}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <div style={subStyles.metricLabel}>{label}</div>
        {sub && <div style={subStyles.metricSub}>{sub}</div>}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={subStyles.detailRow}>
      <span style={subStyles.detailLabel}>{label}</span>
      <span style={subStyles.detailValue}>{value}</span>
    </div>
  );
}

function EnergyBadge({ label, grade, value }: { label: string; grade: string; value?: string }) {
  return (
    <div style={subStyles.energyBadge}>
      <div style={{ fontSize: 11, color: "var(--mid-gray)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 6 }}>{label}</div>
      <div style={{ ...subStyles.energyGrade, background: ENERGY_COLORS[grade] ?? "#888" }}>{grade}</div>
      {value && <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 6 }}>{value}</div>}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const statusColor: Record<string, React.CSSProperties> = {
  available: { background: "#e8f5e9", color: "#2e7d32" },
  reserved:  { background: "#fff8e1", color: "#f57f17" },
  rented:    { background: "#e3f2fd", color: "#1565c0" },
  sold:      { background: "#fce4ec", color: "#c62828" },
};

const styles: { [key: string]: React.CSSProperties } = {
  main: { background: "var(--off-white)", minHeight: "80vh" },
  gallery: {
    background: "var(--black)",
    padding: "0",
  },
  galleryMain: {
    position: "relative",
    maxHeight: 520,
    overflow: "hidden",
    cursor: "zoom-in",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
  },
  galleryMainImg: {
    width: "100%",
    maxHeight: 520,
    objectFit: "cover",
    display: "block",
  },
  photoCount: {
    position: "absolute",
    bottom: 14,
    right: 14,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  thumbRow: {
    display: "flex",
    gap: 3,
    background: "#111",
    padding: "3px 0 0",
    overflowX: "auto",
  },
  thumb: {
    flexShrink: 0,
    width: 80,
    height: 56,
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
    opacity: 0.6,
    transition: "opacity 0.15s",
  },
  thumbActive: {
    opacity: 1,
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  thumbMore: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
  },
  container: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
    padding: "40px 24px 80px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 48,
    alignItems: "start",
  },
  left: {},
  right: {
    position: "sticky",
    top: 80,
  },
  breadcrumb: {
    fontSize: 13,
    color: "var(--text-light)",
    margin: "0 0 16px",
  },
  breadcrumbLink: {
    color: "var(--gold-dark)",
    textDecoration: "none",
    fontFamily: "inherit",
  },
  title: {
    fontSize: "clamp(22px, 3vw, 32px)",
    fontWeight: 700,
    fontFamily: "var(--font-playfair), serif",
    color: "var(--black)",
    margin: "0 0 10px",
    lineHeight: 1.25,
  },
  locationLine: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 14,
    color: "var(--text-light)",
    margin: "0 0 24px",
  },
  metrics: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap" as const,
    margin: "0 0 32px",
  },
  section: {
    margin: "0 0 36px",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--black)",
    margin: "0 0 14px",
    fontFamily: "var(--font-playfair), serif",
    paddingBottom: 10,
    borderBottom: "1px solid var(--border)",
  },
  description: {
    fontSize: 15,
    lineHeight: 1.75,
    color: "var(--text)",
    whiteSpace: "pre-line",
    margin: 0,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "8px 16px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "var(--text)",
  },
  featureCheck: {
    color: "var(--gold)",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },
  detailList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
  },
  energyRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap" as const,
  },
  floorPlanGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
  },
  floorPlanImg: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid var(--border)",
  },
  pdfCard: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "24px 16px",
    background: "#fff5f5",
    border: "1px solid #fcd5d5",
    borderRadius: 8,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  mediaLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--black)",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    fontFamily: "inherit",
  },
  // Contact card
  contactCard: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  cardPrice: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "var(--font-playfair), serif",
    color: "var(--black)",
    margin: 0,
  },
  cardPriceSub: {
    fontSize: 13,
    color: "var(--text-light)",
    margin: 0,
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    alignSelf: "flex-start",
  },
  divider: {
    border: "none",
    borderTop: "1px solid var(--border)",
    margin: "4px 0",
  },
  cardRef: {
    fontSize: 12,
    color: "var(--mid-gray)",
    margin: 0,
  },
  ctaBtn: {
    display: "block",
    background: "var(--gold)",
    color: "white",
    textAlign: "center" as const,
    padding: "13px",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    fontFamily: "inherit",
  },
  ctaBtnSecondary: {
    display: "block",
    background: "white",
    color: "var(--black)",
    textAlign: "center" as const,
    padding: "12px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    fontFamily: "inherit",
    border: "1.5px solid var(--border)",
  },
  cardNote: {
    fontSize: 12,
    color: "var(--mid-gray)",
    textAlign: "center" as const,
    margin: "4px 0 0",
    lineHeight: 1.5,
  },
  // Lightbox
  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.93)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxImg: {
    maxWidth: "90vw",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: 4,
  },
  lightboxClose: {
    position: "absolute",
    top: 20,
    right: 24,
    background: "none",
    border: "none",
    color: "white",
    fontSize: 24,
    cursor: "pointer",
    lineHeight: 1,
    zIndex: 10,
  },
  lightboxNav: {
    position: "absolute",
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "white",
    fontSize: 36,
    cursor: "pointer",
    borderRadius: 8,
    padding: "12px 18px",
    lineHeight: 1,
    top: "50%",
    transform: "translateY(-50%)",
  },
  lightboxCounter: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontFamily: "inherit",
  },
};

const subStyles: { [key: string]: React.CSSProperties } = {
  metricBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    minWidth: 80,
  },
  metricLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: "var(--black)",
    lineHeight: 1.2,
  },
  metricSub: {
    fontSize: 11,
    color: "var(--mid-gray)",
    marginTop: 1,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
    fontSize: 14,
    gap: 12,
  },
  detailLabel: {
    color: "var(--text-light)",
    flexShrink: 0,
  },
  detailValue: {
    color: "var(--black)",
    fontWeight: 500,
    textAlign: "right" as const,
  },
  energyBadge: {
    textAlign: "center" as const,
    minWidth: 80,
  },
  energyGrade: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "50%",
    color: "white",
    fontWeight: 700,
    fontSize: 20,
    fontFamily: "var(--font-playfair), serif",
  },
};
