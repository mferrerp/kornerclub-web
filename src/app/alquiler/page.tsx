"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property, OperationType, PropertyType, PROPERTY_TYPE_LABELS } from "@/types/property";

const RENT_TYPES: OperationType[] = ["rent_permanent", "rent_temporary", "rent_room", "rent_seasonal"];

const RENT_TYPE_LABELS: Record<string, string> = {
  all: "Todos",
  rent_permanent: "Vivienda habitual",
  rent_temporary: "Temporal",
  rent_room: "Habitación",
  rent_seasonal: "Vacacional",
};

const PROPERTY_TYPE_OPTIONS: [PropertyType | "all", string][] = [
  ["all", "Todos"],
  ["apartment", "Piso"],
  ["house", "Casa / Chalet"],
  ["penthouse", "Ático"],
  ["duplex", "Dúplex"],
  ["studio", "Estudio"],
  ["room", "Habitación"],
];

export default function AlquilerPage() {
  return (
    <Suspense>
      <AlquilerPageContent />
    </Suspense>
  );
}

function AlquilerPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters — seeded from URL query params
  const [rentType, setRentType] = useState<string>(searchParams.get("rentType") ?? "all");
  const [propType, setPropType] = useState<string>(searchParams.get("type") ?? "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "newest">("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .in("operation_type", RENT_TYPES)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      setProperties((data as Property[]) ?? []);
      setLoading(false);
    }
    fetchProperties();
  }, []);

  const filtered = properties
    .filter((p) => rentType === "all" || p.operation_type === rentType)
    .filter((p) => propType === "all" || p.property_type === propType)
    .filter((p) => !minPrice || p.price >= parseFloat(minPrice))
    .filter((p) => !maxPrice || p.price <= parseFloat(maxPrice))
    .filter((p) => !minRooms || (p.rooms ?? 0) >= parseInt(minRooms))
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const hasFilters = rentType !== "all" || propType !== "all" || minPrice || maxPrice || minRooms;

  function clearFilters() {
    setRentType("all");
    setPropType("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRooms("");
  }

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        {/* Page header */}
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <p style={styles.heroEyebrow}>Alquiler en Madrid</p>
            <h1 style={styles.heroTitle}>Encuentra tu próximo hogar</h1>
            <p style={styles.heroSub}>
              Pisos, casas, estudios y habitaciones — seleccionados por nuestro equipo.
            </p>
          </div>
        </div>

        <div style={styles.container}>
          {/* Toolbar */}
          <div style={styles.toolbar}>
            {/* Rent type chips */}
            <div style={styles.chips}>
              {Object.entries(RENT_TYPE_LABELS).map(([v, l]) => (
                <button
                  key={v}
                  style={{ ...styles.chip, ...(rentType === v ? styles.chipActive : {}) }}
                  onClick={() => setRentType(v)}
                >
                  {l}
                </button>
              ))}
            </div>

            <div style={styles.toolbarRight}>
              {hasFilters && (
                <button style={styles.clearBtn} onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
              <button
                style={{ ...styles.filterToggle, ...(showFilters ? styles.filterToggleActive : {}) }}
                onClick={() => setShowFilters((s) => !s)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filtros
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={styles.sortSelect}
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Expanded filters panel */}
          {showFilters && (
            <div style={styles.filtersPanel}>
              <div style={styles.filtersGrid}>
                <div style={styles.filterField}>
                  <label style={styles.filterLabel}>Tipo de inmueble</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    style={styles.filterSelect}
                  >
                    {PROPERTY_TYPE_OPTIONS.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.filterField}>
                  <label style={styles.filterLabel}>Precio mínimo (€/mes)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Sin mínimo"
                    style={styles.filterInput}
                  />
                </div>
                <div style={styles.filterField}>
                  <label style={styles.filterLabel}>Precio máximo (€/mes)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Sin máximo"
                    style={styles.filterInput}
                  />
                </div>
                <div style={styles.filterField}>
                  <label style={styles.filterLabel}>Habitaciones mínimas</label>
                  <select
                    value={minRooms}
                    onChange={(e) => setMinRooms(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="">Sin mínimo</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <p style={styles.resultsCount}>
            {loading ? "Cargando…" : `${filtered.length} propiedad${filtered.length !== 1 ? "es" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
          </p>

          {/* Grid */}
          {loading ? (
            <div style={styles.loadingGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={styles.skeleton} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>No hay propiedades disponibles</p>
              <p style={styles.emptySub}>
                {hasFilters
                  ? "Prueba a ampliar los filtros de búsqueda."
                  : "Estamos ampliando nuestra cartera. Vuelve pronto."}
              </p>
              {hasFilters && (
                <button style={styles.emptyBtn} onClick={clearFilters}>
                  Ver todas las propiedades
                </button>
              )}
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    background: "var(--off-white)",
  },
  hero: {
    background: "var(--black)",
    color: "white",
    padding: "56px 24px 52px",
  },
  heroInner: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--gold)",
    margin: "0 0 12px",
  },
  heroTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 700,
    fontFamily: "var(--font-playfair), serif",
    margin: "0 0 12px",
    lineHeight: 1.15,
  },
  heroSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.65)",
    margin: 0,
    maxWidth: 500,
    lineHeight: 1.6,
  },
  container: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
    padding: "32px 24px 64px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap" as const,
  },
  chips: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap" as const,
  },
  chip: {
    border: "1.5px solid var(--border)",
    background: "white",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    color: "var(--text)",
    fontFamily: "inherit",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  chipActive: {
    background: "var(--black)",
    borderColor: "var(--black)",
    color: "white",
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  clearBtn: {
    background: "none",
    border: "none",
    fontSize: 13,
    color: "var(--gold-dark)",
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
    padding: "6px 4px",
  },
  filterToggle: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1.5px solid var(--border)",
    background: "white",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--text)",
  },
  filterToggleActive: {
    background: "var(--black)",
    borderColor: "var(--black)",
    color: "white",
  },
  sortSelect: {
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "var(--text)",
    background: "white",
    cursor: "pointer",
  },
  filtersPanel: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
    marginTop: 12,
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  filterField: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--mid-gray)",
  },
  filterSelect: {
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "var(--text)",
    background: "white",
  },
  filterInput: {
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "var(--text)",
    background: "white",
  },
  resultsCount: {
    fontSize: 13,
    color: "var(--text-light)",
    margin: "12px 0 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },
  skeleton: {
    background: "white",
    borderRadius: 12,
    height: 340,
    border: "1px solid var(--border)",
    opacity: 0.6,
  },
  empty: {
    textAlign: "center",
    padding: "80px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "var(--black)",
    fontFamily: "var(--font-playfair), serif",
    margin: 0,
  },
  emptySub: {
    fontSize: 14,
    color: "var(--text-light)",
    margin: 0,
    maxWidth: 360,
    lineHeight: 1.6,
  },
  emptyBtn: {
    marginTop: 8,
    background: "var(--black)",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
