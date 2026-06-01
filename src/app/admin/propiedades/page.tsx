"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Property,
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  STATUS_LABELS,
} from "@/types/property";

export default function AdminPropiedadesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/?auth=required");
    });
  }, [router]);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProperties(data as Property[]);
    }
    setLoading(false);
  }

  async function togglePublish(property: Property) {
    setTogglingId(property.id);
    const newValue = !property.is_published;
    const { error } = await supabase
      .from("properties")
      .update({
        is_published: newValue,
        published_at: newValue ? new Date().toISOString() : null,
      })
      .eq("id", property.id);

    if (!error) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id
            ? { ...p, is_published: newValue, published_at: newValue ? new Date().toISOString() : null }
            : p
        )
      );
    }
    setTogglingId(null);
  }

  async function deleteProperty(id: string) {
    if (!confirm("¿Seguro que quieres eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Error al eliminar: " + error.message);
    }
    setDeletingId(null);
  }

  const filtered = properties.filter((p) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && p.is_published) ||
      (filter === "unpublished" && !p.is_published);

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.city.toLowerCase().includes(q) ||
      (p.address ?? "").toLowerCase().includes(q) ||
      (p.internal_reference ?? "").toLowerCase().includes(q) ||
      (p.description_es ?? "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <img src="/brand/monograma-negro-transparente.svg" alt="Korner" style={{ width: 28, height: 28 }} />
          <span style={styles.topBarTitle}>Panel de administración</span>
        </div>
        <div style={styles.topBarRight}>
          <Link href="/" style={styles.topLink}>← Web pública</Link>
        </div>
      </div>

      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.h1}>Propiedades</h1>
            <p style={styles.subtitle}>{properties.length} propiedades en total</p>
          </div>
          <Link href="/admin/propiedades/nueva" style={styles.btnNew}>
            + Nueva propiedad
          </Link>
        </div>

        {/* Filters & search */}
        <div style={styles.toolbar}>
          <div style={styles.filterTabs}>
            {(["all", "published", "unpublished"] as const).map((f) => (
              <button
                key={f}
                style={{ ...styles.filterTab, ...(filter === f ? styles.filterTabActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Todas" : f === "published" ? "Publicadas" : "No publicadas"}
                <span style={styles.filterCount}>
                  {f === "all"
                    ? properties.length
                    : f === "published"
                    ? properties.filter((p) => p.is_published).length
                    : properties.filter((p) => !p.is_published).length}
                </span>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar por dirección, ciudad, referencia…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Cargando propiedades…</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <p style={styles.errorText}>Error: {error}</p>
            <button style={styles.btnRetry} onClick={fetchProperties}>Reintentar</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            {properties.length === 0 ? (
              <>
                <p style={styles.emptyTitle}>Sin propiedades aún</p>
                <p style={styles.emptyText}>Crea tu primera propiedad para empezar.</p>
                <Link href="/admin/propiedades/nueva" style={{ ...styles.btnNew, marginTop: 16 }}>
                  + Crear primera propiedad
                </Link>
              </>
            ) : (
              <p style={styles.emptyText}>No hay propiedades que coincidan con la búsqueda.</p>
            )}
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: 60 }}>Foto</th>
                  <th style={styles.th}>Propiedad</th>
                  <th style={styles.th}>Tipo / Operación</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Publicada</th>
                  <th style={{ ...styles.th, width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    {/* Thumbnail */}
                    <td style={styles.td}>
                      {p.photos?.length > 0 ? (
                        <img
                          src={p.photos[p.main_photo_index ?? 0] ?? p.photos[0]}
                          alt=""
                          style={styles.thumbnail}
                        />
                      ) : (
                        <div style={styles.noPhoto}>–</div>
                      )}
                    </td>

                    {/* Address */}
                    <td style={styles.td}>
                      <div style={styles.propAddress}>
                        {p.address ? `${p.address}, ` : ""}{p.city}
                      </div>
                      {p.internal_reference && (
                        <div style={styles.propRef}>Ref: {p.internal_reference}</div>
                      )}
                      {p.floor != null && (
                        <div style={styles.propRef}>Planta {p.floor}{p.is_top_floor ? " (ático)" : ""}</div>
                      )}
                    </td>

                    {/* Type */}
                    <td style={styles.td}>
                      <div style={styles.propType}>{PROPERTY_TYPE_LABELS[p.property_type]}</div>
                      <div style={styles.propRef}>{OPERATION_TYPE_LABELS[p.operation_type]}</div>
                    </td>

                    {/* Price */}
                    <td style={styles.td}>
                      <div style={styles.price}>
                        {p.price.toLocaleString("es-ES")} €
                        {p.operation_type !== "sale" && <span style={styles.pricePer}>/mes</span>}
                      </div>
                      {p.size_m2 && (
                        <div style={styles.propRef}>{p.size_m2} m²</div>
                      )}
                    </td>

                    {/* Status */}
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, ...statusColors[p.status] }}>
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>

                    {/* Published toggle */}
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.toggleBtn,
                          ...(p.is_published ? styles.toggleOn : styles.toggleOff),
                          opacity: togglingId === p.id ? 0.5 : 1,
                        }}
                        disabled={togglingId === p.id}
                        onClick={() => togglePublish(p)}
                        title={p.is_published ? "Clic para despublicar" : "Clic para publicar"}
                      >
                        {togglingId === p.id ? "…" : p.is_published ? "Sí" : "No"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link href={`/admin/propiedades/${p.id}/editar`} style={styles.btnEdit}>
                          Editar
                        </Link>

                        {/* Preview — only for unpublished drafts */}
                        {!p.is_published && (
                          <Link
                            href={`/admin/propiedades/${p.id}/preview`}
                            style={styles.btnPreview}
                            target="_blank"
                          >
                            Vista previa
                          </Link>
                        )}

                        {/* Unpublish for published / Delete for drafts */}
                        {p.is_published ? (
                          <button
                            style={{
                              ...styles.btnUnpublish,
                              opacity: togglingId === p.id ? 0.5 : 1,
                            }}
                            disabled={togglingId === p.id}
                            onClick={() => togglePublish(p)}
                          >
                            {togglingId === p.id ? "…" : "Despublicar"}
                          </button>
                        ) : (
                          <button
                            style={{
                              ...styles.btnDelete,
                              opacity: deletingId === p.id ? 0.5 : 1,
                            }}
                            disabled={deletingId === p.id}
                            onClick={() => deleteProperty(p.id)}
                          >
                            {deletingId === p.id ? "…" : "Eliminar"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const statusColors: Record<string, React.CSSProperties> = {
  available: { background: "#e8f5e9", color: "#2e7d32" },
  reserved: { background: "#fff8e1", color: "#f57f17" },
  rented: { background: "#e3f2fd", color: "#1565c0" },
  sold: { background: "#fce4ec", color: "#c62828" },
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f5",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  topBar: {
    background: "white",
    borderBottom: "1px solid #e8e8e8",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  topBarTitle: {
    fontWeight: 600,
    fontSize: 15,
    color: "#1a1a1a",
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  topLink: {
    fontSize: 13,
    color: "#666",
    textDecoration: "none",
    fontFamily: "inherit",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 24px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 16,
    flexWrap: "wrap" as const,
  },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 4px",
    fontFamily: "var(--font-playfair), serif",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    margin: 0,
  },
  btnNew: {
    background: "var(--gold, #b8973a)",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
    display: "inline-block",
    whiteSpace: "nowrap" as const,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap" as const,
  },
  filterTabs: {
    display: "flex",
    gap: 4,
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    background: "none",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "#666",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  filterTabActive: {
    background: "#1a1a1a",
    color: "white",
  },
  filterCount: {
    background: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    padding: "1px 7px",
    fontSize: 11,
  },
  searchInput: {
    border: "1px solid #e8e8e8",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#1a1a1a",
    background: "white",
    outline: "none",
    width: 300,
    maxWidth: "100%",
  },
  tableWrapper: {
    background: "white",
    borderRadius: 12,
    border: "1px solid #e8e8e8",
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap" as const,
  },
  tr: {
    borderBottom: "1px solid #f7f7f5",
  },
  td: {
    padding: "14px 16px",
    verticalAlign: "middle" as const,
  },
  thumbnail: {
    width: 48,
    height: 36,
    objectFit: "cover" as const,
    borderRadius: 6,
    display: "block",
  },
  noPhoto: {
    width: 48,
    height: 36,
    background: "#f0f0f0",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#bbb",
    fontSize: 16,
  },
  propAddress: {
    fontWeight: 500,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  propRef: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 2,
  },
  propType: {
    fontWeight: 500,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  price: {
    fontWeight: 600,
    color: "#1a1a1a",
  },
  pricePer: {
    fontWeight: 400,
    color: "#888",
    fontSize: 11,
    marginLeft: 2,
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },
  toggleBtn: {
    border: "none",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  toggleOn: {
    background: "#e8f5e9",
    color: "#2e7d32",
  },
  toggleOff: {
    background: "#f0f0f0",
    color: "#999",
  },
  actions: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap" as const,
  },
  btnEdit: {
    background: "#f0f0f0",
    color: "#1a1a1a",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
    display: "inline-block",
  },
  btnDelete: {
    background: "#fff0f0",
    color: "#c62828",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnUnpublish: {
    background: "#fff8e1",
    color: "#e65100",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnPreview: {
    background: "#e8f0fe",
    color: "#1a56db",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
    display: "inline-block",
  },
  emptyState: {
    background: "white",
    borderRadius: 12,
    border: "1px solid #e8e8e8",
    padding: "64px 24px",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: "#1a1a1a",
    margin: 0,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
    margin: 0,
  },
  errorState: {
    background: "white",
    borderRadius: 12,
    border: "1px solid #fce4ec",
    padding: "32px 24px",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    margin: 0,
  },
  btnRetry: {
    background: "#f0f0f0",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
