"use client";

import { useState } from "react";
import Link from "next/link";
import { Property, PROPERTY_TYPE_LABELS } from "@/types/property";
import { thumbCard } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property: p }: PropertyCardProps) {
  const { t } = useLanguage();
  const [favorited, setFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

  const photo = p.photos?.length > 0
    ? (p.photos[p.main_photo_index ?? 0] ?? p.photos[0])
    : null;

  const formatPrice = (n: number) =>
    n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const priceLabel = p.operation_type === "sale"
    ? `${formatPrice(p.price)} €`
    : `${formatPrice(p.price)} €/mes`;

  const locationLine = [p.neighborhood, p.district, p.city]
    .filter(Boolean)
    .join(", ");

  // Same title logic as the detail page
  const d = t.propertyDetail;
  const ptMap: Record<string, string> = {
    apartment: d.ptApartment, house: d.ptHouse, studio: d.ptStudio,
    penthouse: d.ptPenthouse, duplex: d.ptDuplex, commercial: d.ptCommercial,
    office: d.ptOffice, land: d.ptLand, garage: d.ptGarage, storage: d.ptStorage,
  };
  const typeLabel = ptMap[p.property_type] ?? PROPERTY_TYPE_LABELS[p.property_type];
  const cardTitle = d.pageTitle(typeLabel, p.rooms ?? null, p.neighborhood ?? p.city ?? null);

  const details = [
    p.rooms != null ? `${p.rooms} hab.` : null,
    p.bathrooms != null ? `${p.bathrooms} baño${p.bathrooms !== 1 ? "s" : ""}` : null,
    p.size_m2 != null ? `${p.size_m2} m²` : null,
    p.floor != null ? `Planta ${p.floor}` : null,
  ].filter(Boolean);

  const features = [
    p.has_elevator && "Ascensor",
    p.has_terrace && "Terraza",
    p.has_balcony && "Balcón",
    p.has_air_conditioning && "A/C",
    p.has_garage && "Garaje",
    p.has_pool && "Piscina",
  ].filter(Boolean) as string[];

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/propiedades/${p.id}`
    : `/propiedades/${p.id}`;

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const data = {
      title: `${PROPERTY_TYPE_LABELS[p.property_type]} · ${locationLine || p.city}`,
      text: `${priceLabel} — ${locationLine || p.city}`,
      url,
    };
    if (navigator.share) {
      await navigator.share(data).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.dispatchEvent(new CustomEvent("open-auth-modal"));
      return;
    }
    setFavorited((f) => !f);
  }

  return (
    <Link href={`/propiedades/${p.id}`} style={cardStyles.wrapper}>
      {/* Photo */}
      <div style={cardStyles.photoWrap}>
        {photo ? (
          <img src={thumbCard(photo)} alt={locationLine} style={cardStyles.photo} />
        ) : (
          <div style={cardStyles.noPhoto}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div style={cardStyles.badges}>
          {p.is_featured && (
            <span style={{ ...cardStyles.badge, ...cardStyles.badgeFeatured }}>Destacado</span>
          )}
          {p.status !== "available" && (
            <span style={{ ...cardStyles.badge, ...statusBadge[p.status] }}>
              {p.status === "reserved" ? "Reservado" : p.status === "rented" ? "Alquilado" : "Vendido"}
            </span>
          )}
        </div>

        {/* Action buttons — top right */}
        <div style={cardStyles.actions}>
          {/* Share */}
          <button
            style={cardStyles.actionBtn}
            onClick={handleShare}
            title={copied ? "¡Enlace copiado!" : "Compartir"}
            aria-label="Compartir propiedad"
          >
            {copied ? (
              // Checkmark when copied
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6"  cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
              </svg>
            )}
          </button>

          {/* Favorite */}
          <button
            style={{
              ...cardStyles.actionBtn,
              color: favorited ? "#c9a227" : "currentColor",
            }}
            onClick={handleFavorite}
            title={favorited ? "Quitar de favoritos" : "Añadir a favoritos"}
            aria-label={favorited ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              fill={favorited ? "#c9a227" : "none"}
              stroke={favorited ? "#c9a227" : "currentColor"}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={cardStyles.body}>
        <p style={cardStyles.title}>{cardTitle}</p>
        <p style={cardStyles.price}>{priceLabel}</p>
        <p style={cardStyles.location}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {locationLine || p.city}
        </p>
        {details.length > 0 && (
          <div style={cardStyles.details}>
            {details.map((d) => (
              <span key={d} style={cardStyles.detail}>{d}</span>
            ))}
          </div>
        )}
        {features.length > 0 && (
          <div style={cardStyles.features}>
            {features.slice(0, 4).map((f) => (
              <span key={f} style={cardStyles.feature}>{f}</span>
            ))}
            {features.length > 4 && (
              <span style={cardStyles.feature}>+{features.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

const statusBadge: Record<string, React.CSSProperties> = {
  reserved: { background: "rgba(245,158,11,0.9)", color: "white" },
  rented:   { background: "rgba(59,130,246,0.9)",  color: "white" },
  sold:     { background: "rgba(239,68,68,0.9)",   color: "white" },
};

const cardStyles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid var(--border)",
    textDecoration: "none",
    color: "inherit",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "pointer",
  },
  photoWrap: {
    position: "relative",
    aspectRatio: "4/3",
    background: "#f0ede8",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s",
  },
  noPhoto: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badges: {
    position: "absolute",
    top: 10,
    left: 10,
    display: "flex",
    gap: 6,
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 20,
    letterSpacing: "0.02em",
  },
  badgeFeatured: {
    background: "var(--gold)",
    color: "white",
  },
  // Action buttons container — top right of photo
  actions: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(4px)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1a1a1a",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
    transition: "background 0.15s, transform 0.15s",
    flexShrink: 0,
  },
  body: {
    padding: "16px 18px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--black)",
    margin: 0,
    lineHeight: 1.35,
    fontFamily: "var(--font-playfair), serif",
  },
  price: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--black)",
    margin: 0,
    fontFamily: "var(--font-playfair), serif",
  },
  location: {
    fontSize: 13,
    color: "var(--text-light)",
    margin: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: 4,
  },
  details: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 2,
  },
  detail: {
    fontSize: 13,
    color: "var(--text)",
    fontWeight: 500,
  },
  features: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 4,
  },
  feature: {
    fontSize: 11,
    color: "var(--text-light)",
    background: "var(--warm-gray)",
    padding: "3px 8px",
    borderRadius: 20,
  },
};
