"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { thumbAdmin } from "@/lib/cloudinary";
import {
  Property,
  OperationType,
  PropertyType,
  PropertyStatus,
  AddressVisibility,
  KitchenEquipment,
  HeatingType,
  HeatingFuel,
  EnergyClass,
  Condition,
  Orientation,
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  STATUS_LABELS,
} from "@/types/property";

// ─── Cloudinary upload ───────────────────────────────────────────────────────
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const isPdf = file.type === "application/pdf";
  const resourceType = isPdf ? "raw" : "image";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "kornerclub_properties");
  formData.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Error subiendo archivo a Cloudinary");
  const data = await res.json();
  return data.secure_url as string;
}

// ─── Types ───────────────────────────────────────────────────────────────────
type PhotoItem = { url: string; file?: File; preview?: string };

interface FormState {
  cadastral_reference: string;
  idealista_id: string;
  idealista_url: string;
  internal_reference: string;
  operation_type: OperationType;
  property_type: PropertyType;
  status: PropertyStatus;
  is_attic: boolean;
  is_studio: boolean;
  is_duplex: boolean;
  is_bank_property: boolean;
  price: string;
  community_fees: string;
  deposit: string;
  max_tenants: string;
  children_friendly: boolean;
  allows_pets: boolean;
  address: string;
  block_staircase: string;
  door: string;
  urbanization_name: string;
  neighborhood: string;
  district: string;
  city: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  address_visibility: AddressVisibility;
  floor: string;
  is_top_floor: boolean;
  size_m2: string;
  useful_size_m2: string;
  rooms: string;
  bathrooms: string;
  is_exterior: boolean;
  has_elevator: boolean;
  orientation: Orientation[];
  has_air_conditioning: boolean;
  has_terrace: boolean;
  has_balcony: boolean;
  has_built_in_wardrobes: boolean;
  has_garage: boolean;
  has_storage: boolean;
  has_pool: boolean;
  has_garden: boolean;
  accessible_exterior: boolean;
  accessible_interior: boolean;
  kitchen_equipment: KitchenEquipment | "";
  heating_type: HeatingType | "";
  heating_fuel: HeatingFuel | "";
  construction_year: string;
  energy_certificate: EnergyClass | "";
  energy_consumption: string;
  emissions_certificate: EnergyClass | "";
  emissions_value: string;
  condition: Condition | "";
  description_es: string;
  description_en: string;
  description_fr: string;
  description_de: string;
  website_url: string;
  video_url: string;
  virtual_tour_url: string;
  capturing_agent: string;
  selling_agent: string;
  private_notes: string;
  is_published: boolean;
  is_featured: boolean;
}

const defaultForm: FormState = {
  cadastral_reference: "",
  idealista_id: "",
  idealista_url: "",
  internal_reference: "",
  operation_type: "rent_permanent",
  property_type: "apartment",
  status: "available",
  is_attic: false,
  is_studio: false,
  is_duplex: false,
  is_bank_property: false,
  price: "",
  community_fees: "",
  deposit: "",
  max_tenants: "",
  children_friendly: true,
  allows_pets: false,
  address: "",
  block_staircase: "",
  door: "",
  urbanization_name: "",
  neighborhood: "",
  district: "",
  city: "Madrid",
  postal_code: "",
  latitude: "",
  longitude: "",
  address_visibility: "street_only",
  floor: "",
  is_top_floor: false,
  size_m2: "",
  useful_size_m2: "",
  rooms: "",
  bathrooms: "",
  is_exterior: true,
  has_elevator: false,
  orientation: [],
  has_air_conditioning: false,
  has_terrace: false,
  has_balcony: false,
  has_built_in_wardrobes: false,
  has_garage: false,
  has_storage: false,
  has_pool: false,
  has_garden: false,
  accessible_exterior: false,
  accessible_interior: false,
  kitchen_equipment: "",
  heating_type: "",
  heating_fuel: "",
  construction_year: "",
  energy_certificate: "",
  energy_consumption: "",
  emissions_certificate: "",
  emissions_value: "",
  condition: "",
  description_es: "",
  description_en: "",
  description_fr: "",
  description_de: "",
  website_url: "",
  video_url: "",
  virtual_tour_url: "",
  capturing_agent: "",
  selling_agent: "",
  private_notes: "",
  is_published: false,
  is_featured: false,
};

function propertyToForm(p: Property): FormState {
  return {
    cadastral_reference: p.cadastral_reference ?? "",
    idealista_id: p.idealista_id ?? "",
    idealista_url: p.idealista_url ?? "",
    internal_reference: p.internal_reference ?? "",
    operation_type: p.operation_type,
    property_type: p.property_type,
    status: p.status,
    is_attic: p.is_attic,
    is_studio: p.is_studio,
    is_duplex: p.is_duplex,
    is_bank_property: p.is_bank_property,
    price: p.price?.toString() ?? "",
    community_fees: p.community_fees?.toString() ?? "",
    deposit: p.deposit?.toString() ?? "",
    max_tenants: p.max_tenants?.toString() ?? "",
    children_friendly: p.children_friendly,
    allows_pets: p.allows_pets,
    address: p.address ?? "",
    block_staircase: p.block_staircase ?? "",
    door: p.door ?? "",
    urbanization_name: p.urbanization_name ?? "",
    neighborhood: p.neighborhood ?? "",
    district: p.district ?? "",
    city: p.city,
    postal_code: p.postal_code ?? "",
    latitude: p.latitude?.toString() ?? "",
    longitude: p.longitude?.toString() ?? "",
    address_visibility: p.address_visibility,
    floor: p.floor?.toString() ?? "",
    is_top_floor: p.is_top_floor,
    size_m2: p.size_m2?.toString() ?? "",
    useful_size_m2: p.useful_size_m2?.toString() ?? "",
    rooms: p.rooms?.toString() ?? "",
    bathrooms: p.bathrooms?.toString() ?? "",
    is_exterior: p.is_exterior,
    has_elevator: p.has_elevator,
    orientation: p.orientation ?? [],
    has_air_conditioning: p.has_air_conditioning,
    has_terrace: p.has_terrace,
    has_balcony: p.has_balcony,
    has_built_in_wardrobes: p.has_built_in_wardrobes,
    has_garage: p.has_garage,
    has_storage: p.has_storage,
    has_pool: p.has_pool,
    has_garden: p.has_garden,
    accessible_exterior: p.accessible_exterior,
    accessible_interior: p.accessible_interior,
    kitchen_equipment: p.kitchen_equipment ?? "",
    heating_type: p.heating_type ?? "",
    heating_fuel: p.heating_fuel ?? "",
    construction_year: p.construction_year?.toString() ?? "",
    energy_certificate: p.energy_certificate ?? "",
    energy_consumption: p.energy_consumption?.toString() ?? "",
    emissions_certificate: p.emissions_certificate ?? "",
    emissions_value: p.emissions_value?.toString() ?? "",
    condition: p.condition ?? "",
    description_es: p.description_es ?? "",
    description_en: p.description_en ?? "",
    description_fr: p.description_fr ?? "",
    description_de: p.description_de ?? "",
    website_url: p.website_url ?? "",
    video_url: p.video_url ?? "",
    virtual_tour_url: p.virtual_tour_url ?? "",
    capturing_agent: p.capturing_agent ?? "",
    selling_agent: p.selling_agent ?? "",
    private_notes: p.private_notes ?? "",
    is_published: p.is_published,
    is_featured: p.is_featured,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface PropertyFormProps {
  mode: "create" | "edit";
  initialProperty?: Property;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PropertyForm({ mode, initialProperty }: PropertyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    initialProperty ? propertyToForm(initialProperty) : defaultForm
  );
  const [photos, setPhotos] = useState<PhotoItem[]>(
    initialProperty?.photos?.map((url) => ({ url })) ?? []
  );
  const [floorPlanPhotos, setFloorPlanPhotos] = useState<PhotoItem[]>(
    initialProperty?.floor_plan_photos?.map((url) => ({ url })) ?? []
  );
  const [mainPhotoIndex, setMainPhotoIndex] = useState(initialProperty?.main_photo_index ?? 0);
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tipo");
  const [translateSource, setTranslateSource] = useState<"es" | "en" | "fr" | "de">("es");
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [orderingPhotos, setOrderingPhotos] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [fetchingCatastro, setFetchingCatastro] = useState(false);
  const [catastroMsg, setCatastroMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [portals, setPortals] = useState<string[]>(
    (initialProperty as any)?.portals ?? []
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleOrientation(o: Orientation) {
    setForm((prev) => ({
      ...prev,
      orientation: prev.orientation.includes(o)
        ? prev.orientation.filter((x) => x !== o)
        : [...prev.orientation, o],
    }));
  }

  function handlePhotoFiles(files: FileList, isFloorPlan: boolean) {
    const items: PhotoItem[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/") || (isFloorPlan && f.type === "application/pdf"))
      .map((file) => ({
        file,
        url: "",
        preview: file.type === "application/pdf" ? "__pdf__" : URL.createObjectURL(file),
      }));
    if (isFloorPlan) setFloorPlanPhotos((p) => [...p, ...items]);
    else setPhotos((p) => [...p, ...items]);
  }

  function removePhoto(index: number, isFloorPlan: boolean) {
    if (isFloorPlan) {
      setFloorPlanPhotos((p) => p.filter((_, i) => i !== index));
    } else {
      setPhotos((p) => p.filter((_, i) => i !== index));
      if (index === mainPhotoIndex) setMainPhotoIndex(0);
      else if (index < mainPhotoIndex) setMainPhotoIndex((i) => i - 1);
    }
  }

  function setAsMain(index: number) {
    // Move selected photo to position 0 and mark as main
    setPhotos((prev) => {
      const arr = [...prev];
      const [photo] = arr.splice(index, 1);
      return [photo, ...arr];
    });
    setMainPhotoIndex(0);
  }

  function onPhotoDragStart(index: number) {
    setDragIndex(index);
  }

  function onPhotoDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOver(index);
  }

  function onPhotoDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOver(null);
      return;
    }
    setPhotos((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex, 1);
      arr.splice(targetIndex, 0, moved);
      return arr;
    });
    // Keep mainPhotoIndex pointing to the same photo after reorder
    setMainPhotoIndex((prev) => {
      if (dragIndex === prev) return targetIndex;
      if (dragIndex < prev && targetIndex >= prev) return prev - 1;
      if (dragIndex > prev && targetIndex <= prev) return prev + 1;
      return prev;
    });
    setDragIndex(null);
    setDragOver(null);
  }

  function onFloorPlanDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onFloorPlanDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOver(null);
      return;
    }
    setFloorPlanPhotos((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex, 1);
      arr.splice(targetIndex, 0, moved);
      return arr;
    });
    setDragIndex(null);
    setDragOver(null);
  }

  async function handleTranslate() {
    const sourceKey = `description_${translateSource}` as keyof FormState;
    const sourceText = (form[sourceKey] as string).trim();
    if (!sourceText) {
      setTranslateError("El campo de origen está vacío. Escribe la descripción antes de traducir.");
      return;
    }
    const ALL_LANGS = ["es", "en", "fr", "de"] as const;
    const targetLangs = ALL_LANGS.filter((l) => l !== translateSource);

    setTranslating(true);
    setTranslateError(null);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, sourceLang: translateSource, targetLangs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      const { translations } = data as { translations: Record<string, string> };
      for (const lang of targetLangs) {
        if (translations[lang]) set(`description_${lang}` as keyof FormState, translations[lang]);
      }
    } catch (e) {
      setTranslateError(e instanceof Error ? e.message : "Error al traducir.");
    } finally {
      setTranslating(false);
    }
  }

  async function handleSave(publish: boolean) {
    if (!form.price) { setError("El precio es obligatorio."); return; }
    if (!form.city) { setError("La ciudad es obligatoria."); return; }
    setSaving(true);
    setError(null);
    try {
      setUploadingPhotos(true);
      const refSlug = form.internal_reference || (initialProperty?.id ?? Date.now().toString());
      const folder = `kornerclub/properties/${refSlug}`;

      const uploadedPhotos: string[] = [];
      for (const item of photos) {
        if (item.file) {
          uploadedPhotos.push(await uploadToCloudinary(item.file, folder));
        } else if (item.url) {
          uploadedPhotos.push(item.url);
        }
      }
      const uploadedFloorPlans: string[] = [];
      for (const item of floorPlanPhotos) {
        if (item.file) {
          uploadedFloorPlans.push(await uploadToCloudinary(item.file, `${folder}/planos`));
        } else if (item.url) {
          uploadedFloorPlans.push(item.url);
        }
      }
      setUploadingPhotos(false);

      const wasPublished = initialProperty?.is_published ?? false;

      const row = {
        cadastral_reference: form.cadastral_reference || null,
        idealista_id: form.idealista_id || null,
        idealista_url: form.idealista_url || null,
        internal_reference: form.internal_reference || null,
        operation_type: form.operation_type,
        property_type: form.property_type,
        status: form.status,
        is_attic: form.is_attic,
        is_studio: form.is_studio,
        is_duplex: form.is_duplex,
        is_bank_property: form.is_bank_property,
        price: parseFloat(form.price),
        community_fees: form.community_fees ? parseFloat(form.community_fees) : null,
        deposit: form.deposit ? parseFloat(form.deposit) : null,
        max_tenants: form.max_tenants ? parseInt(form.max_tenants) : null,
        children_friendly: form.children_friendly,
        allows_pets: form.allows_pets,
        address: form.address || null,
        block_staircase: form.block_staircase || null,
        door: form.door || null,
        urbanization_name: form.urbanization_name || null,
        neighborhood: form.neighborhood || null,
        district: form.district || null,
        city: form.city,
        postal_code: form.postal_code || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        address_visibility: form.address_visibility,
        floor: form.floor !== "" ? parseInt(form.floor) : null,
        is_top_floor: form.is_top_floor,
        size_m2: form.size_m2 ? parseFloat(form.size_m2) : null,
        useful_size_m2: form.useful_size_m2 ? parseFloat(form.useful_size_m2) : null,
        rooms: form.rooms ? parseInt(form.rooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        is_exterior: form.is_exterior,
        has_elevator: form.has_elevator,
        orientation: form.orientation,
        has_air_conditioning: form.has_air_conditioning,
        has_terrace: form.has_terrace,
        has_balcony: form.has_balcony,
        has_built_in_wardrobes: form.has_built_in_wardrobes,
        has_garage: form.has_garage,
        has_storage: form.has_storage,
        has_pool: form.has_pool,
        has_garden: form.has_garden,
        accessible_exterior: form.accessible_exterior,
        accessible_interior: form.accessible_interior,
        kitchen_equipment: form.kitchen_equipment || null,
        heating_type: form.heating_type || null,
        heating_fuel: form.heating_fuel || null,
        construction_year: form.construction_year ? parseInt(form.construction_year) : null,
        energy_certificate: form.energy_certificate || null,
        energy_consumption: form.energy_consumption ? parseFloat(form.energy_consumption) : null,
        emissions_certificate: form.emissions_certificate || null,
        emissions_value: form.emissions_value ? parseFloat(form.emissions_value) : null,
        condition: form.condition || null,
        description_es: form.description_es || null,
        description_en: form.description_en || null,
        description_fr: form.description_fr || null,
        description_de: form.description_de || null,
        website_url: form.website_url || null,
        photos: uploadedPhotos,
        main_photo_index: mainPhotoIndex,
        floor_plan_photos: uploadedFloorPlans,
        video_url: form.video_url || null,
        virtual_tour_url: form.virtual_tour_url || null,
        capturing_agent: form.capturing_agent || null,
        selling_agent: form.selling_agent || null,
        private_notes: form.private_notes || null,
        is_published: publish,
        is_featured: form.is_featured,
        // Only set published_at when newly publishing
        published_at: publish
          ? (wasPublished ? initialProperty?.published_at : new Date().toISOString())
          : null,
      };

      if (mode === "create") {
        const { error: dbError } = await supabase.from("properties").insert(row);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("properties")
          .update(row)
          .eq("id", initialProperty!.id);
        if (dbError) throw dbError;
      }

      router.push("/admin/propiedades");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar la propiedad.");
      setUploadingPhotos(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleFetchCatastro() {
    const rc = form.cadastral_reference.trim();
    if (!rc) return;
    setFetchingCatastro(true);
    setCatastroMsg(null);
    try {
      const res = await fetch(`/api/catastro?rc=${encodeURIComponent(rc)}`);
      const data = await res.json();
      if (!res.ok) {
        setCatastroMsg({ type: "error", text: data.error ?? "Error al consultar el Catastro." });
        return;
      }
      // Pre-fill available fields (only if currently empty to avoid overwriting)
      const updates: Partial<FormState> = {};
      if (data.sizem2 && !form.size_m2)           updates.size_m2 = String(data.sizem2);
      if (data.constructionYear && !form.construction_year)
        updates.construction_year = String(data.constructionYear);

      const count = Object.keys(updates).length;
      if (count > 0) {
        Object.entries(updates).forEach(([k, v]) => set(k as keyof FormState, v as string));
        const filled = [
          updates.size_m2 && `superficie ${data.sizem2} m²`,
          updates.construction_year && `año ${data.constructionYear}`,
        ].filter(Boolean).join(", ");
        setCatastroMsg({ type: "ok", text: `✓ Importado: ${filled}.` });
      } else {
        setCatastroMsg({ type: "ok", text: "✓ Los campos ya estaban rellenados. Sin cambios." });
      }
    } catch {
      setCatastroMsg({ type: "error", text: "Error de conexión al consultar el Catastro." });
    } finally {
      setFetchingCatastro(false);
    }
  }

  async function handleOrderPhotos() {
    const uploadedPhotos = photos.filter((p) => p.url.includes("res.cloudinary.com"));
    if (uploadedPhotos.length < 2) {
      setOrderError("Necesitas al menos 2 fotos ya guardadas para usar el orden automático. Guarda primero el borrador.");
      return;
    }
    setOrderError(null);
    setOrderingPhotos(true);
    try {
      const urls = uploadedPhotos.map((p) => p.url);
      const res = await fetch("/api/ai/order-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!res.ok) { setOrderError(data.error ?? "Error al ordenar fotos."); return; }
      // Rebuild photos array in the new order (non-uploaded photos appended at end)
      if (!Array.isArray(data.orderedUrls) || data.orderedUrls.length === 0) {
        setOrderError("La IA no devolvió un orden válido. Las fotos no se han modificado.");
        return;
      }

      const newOrder = (data.orderedUrls as string[])
        .map((url: string) => photos.find((p) => p?.url === url))
        .filter(Boolean) as typeof photos;
      const pending = photos.filter((p) => !p?.url?.includes("res.cloudinary.com"));

      // Safety: only apply if we recovered at least as many photos as we sent
      if (newOrder.length < uploadedPhotos.length) {
        setOrderError(
          `Error: la IA devolvió ${newOrder.length} de ${uploadedPhotos.length} fotos. ` +
          "El orden no se ha cambiado."
        );
        return;
      }

      setPhotos([...newOrder, ...pending]);
      setMainPhotoIndex(0);
    } catch {
      setOrderError("Error de conexión al ordenar fotos.");
    } finally {
      setOrderingPhotos(false);
    }
  }

  const isEdit = mode === "edit";
  const isPublished = initialProperty?.is_published ?? false;
  const tabs = [
    { id: "tipo", label: "Tipo" },
    { id: "precio", label: "Precio" },
    { id: "ubicacion", label: "Ubicación" },
    { id: "tamano", label: "Tamaño" },
    { id: "caracteristicas", label: "Características" },
    { id: "descripcion", label: "Descripción" },
    { id: "fotos", label: "Fotos" },
    { id: "internos", label: "Datos internos" },
  ];

  const savingLabel = uploadingPhotos ? "Subiendo fotos…" : isEdit ? "Guardando…" : "Publicando…";

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <img src="/brand/monograma-negro-transparente.svg" alt="Korner" style={{ width: 28, height: 28 }} />
          <span style={styles.topBarBreadcrumb}>
            <Link href="/admin/propiedades" style={styles.breadcrumbLink}>Propiedades</Link>
            <span style={{ color: "#bbb", margin: "0 6px" }}>›</span>
            <span>{isEdit ? (initialProperty?.address ?? initialProperty?.internal_reference ?? "Editar propiedad") : "Nueva propiedad"}</span>
          </span>
        </div>
        <div style={styles.topBarRight}>
          <Link href="/admin/propiedades" style={styles.btnCancel}>Cancelar</Link>
          {isPublished ? (
            <>
              <button style={{ ...styles.btnSave, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => handleSave(true)}>
                {saving ? savingLabel : "Actualizar publicación"}
              </button>
              <button style={{ ...styles.btnPublish, opacity: 0.4, cursor: "not-allowed" }} disabled title="Integración con portales próximamente">
                Publicar en portales
              </button>
            </>
          ) : (
            <>
              <button style={{ ...styles.btnSave, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => handleSave(false)}>
                {saving ? savingLabel : "Guardar borrador"}
              </button>
              <button style={{ ...styles.btnPublish, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => handleSave(true)}>
                {saving ? savingLabel : isEdit ? "Guardar y publicar" : "Publicar"}
              </button>
            </>
          )}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Sidebar */}
        <nav style={styles.sidebar}>
          {tabs.map((t) => (
            <button
              key={t.id}
              style={{ ...styles.sidebarTab, ...(activeTab === t.id ? styles.sidebarTabActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Form */}
        <div style={styles.formArea}>
          {error && (
            <div style={styles.errorBanner}>
              {error}
              <button onClick={() => setError(null)} style={styles.errorClose}>✕</button>
            </div>
          )}

          {/* TIPO */}
          {activeTab === "tipo" && (
            <Section title="Tipo de propiedad">
              <Row>
                <Field label="Tipo de operación" required>
                  <Select value={form.operation_type} onChange={(v) => set("operation_type", v as OperationType)} options={Object.entries(OPERATION_TYPE_LABELS)} />
                </Field>
                <Field label="Tipo de inmueble" required>
                  <Select value={form.property_type} onChange={(v) => set("property_type", v as PropertyType)} options={Object.entries(PROPERTY_TYPE_LABELS)} />
                </Field>
                <Field label="Estado">
                  <Select value={form.status} onChange={(v) => set("status", v as PropertyStatus)} options={Object.entries(STATUS_LABELS)} />
                </Field>
              </Row>
              <Row>
                <Field label="Referencia interna">
                  <TextInput value={form.internal_reference} onChange={(v) => set("internal_reference", v)} placeholder="KC-001" />
                </Field>
                <Field label="Referencia catastral">
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        value={form.cadastral_reference}
                        onChange={(v) => { set("cadastral_reference", v); setCatastroMsg(null); }}
                        placeholder="7836214VK4773H0001WA"
                      />
                    </div>
                    <button
                      type="button"
                      title="Importar superficie construida y año de construcción desde el Catastro"
                      style={{
                        flexShrink: 0,
                        background: form.cadastral_reference.trim().length >= 14 ? "var(--gold, #b8973a)" : "#e8e8e8",
                        color: form.cadastral_reference.trim().length >= 14 ? "white" : "#aaa",
                        border: "none",
                        borderRadius: 8,
                        padding: "9px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: form.cadastral_reference.trim().length >= 14 ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                        transition: "background 0.15s",
                      }}
                      disabled={form.cadastral_reference.trim().length < 14 || fetchingCatastro}
                      onClick={handleFetchCatastro}
                    >
                      {fetchingCatastro ? "Consultando…" : "↓ Catastro"}
                    </button>
                  </div>
                  {catastroMsg && (
                    <p style={{
                      fontSize: 12,
                      margin: "4px 0 0",
                      color: catastroMsg.type === "ok" ? "#2e7d32" : "#c62828",
                      lineHeight: 1.4,
                    }}>
                      {catastroMsg.text}
                    </p>
                  )}
                </Field>
              </Row>
              <Row>
                <Field label="ID Idealista">
                  <TextInput value={form.idealista_id} onChange={(v) => set("idealista_id", v)} placeholder="Para sincronización futura" />
                </Field>
                <Field label="URL Idealista">
                  <TextInput value={form.idealista_url} onChange={(v) => set("idealista_url", v)} placeholder="https://www.idealista.com/inmueble/…" />
                </Field>
              </Row>
              <CheckboxGroup label="Subtipo">
                <Check label="Es ático" checked={form.is_attic} onChange={(v) => set("is_attic", v)} />
                <Check label="Es estudio" checked={form.is_studio} onChange={(v) => set("is_studio", v)} />
                <Check label="Es dúplex" checked={form.is_duplex} onChange={(v) => set("is_duplex", v)} />
                <Check label="Inmueble de banco" checked={form.is_bank_property} onChange={(v) => set("is_bank_property", v)} />
                <Check label="Destacado" checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
              </CheckboxGroup>
            </Section>
          )}

          {/* PRECIO */}
          {activeTab === "precio" && (
            <Section title="Precio">
              <Row>
                <Field label="Precio (€)" required>
                  <NumberInput value={form.price} onChange={(v) => set("price", v)} placeholder="1.200" />
                </Field>
                <Field label="Gastos de comunidad (€/mes)">
                  <NumberInput value={form.community_fees} onChange={(v) => set("community_fees", v)} placeholder="80" />
                </Field>
                <Field label="Fianza (€)">
                  <NumberInput value={form.deposit} onChange={(v) => set("deposit", v)} placeholder="2.400" />
                </Field>
              </Row>
              <SectionDivider label="Inquilinos" />
              <Row>
                <Field label="Máximo de inquilinos">
                  <NumberInput value={form.max_tenants} onChange={(v) => set("max_tenants", v)} placeholder="3" />
                </Field>
              </Row>
              <CheckboxGroup>
                <Check label="Apto para niños" checked={form.children_friendly} onChange={(v) => set("children_friendly", v)} />
                <Check label="Acepta mascotas" checked={form.allows_pets} onChange={(v) => set("allows_pets", v)} />
              </CheckboxGroup>
            </Section>
          )}

          {/* UBICACIÓN */}
          {activeTab === "ubicacion" && (
            <Section title="Ubicación">
              <Row>
                <Field label="Dirección" wide>
                  <TextInput value={form.address} onChange={(v) => set("address", v)} placeholder="Calle Gran Vía, 28" />
                </Field>
                <Field label="Bloque / Escalera">
                  <TextInput value={form.block_staircase} onChange={(v) => set("block_staircase", v)} placeholder="Escalera B" />
                </Field>
                <Field label="Puerta">
                  <TextInput value={form.door} onChange={(v) => set("door", v)} placeholder="3º 2ª" />
                </Field>
              </Row>
              <Row>
                <Field label="Urbanización">
                  <TextInput value={form.urbanization_name} onChange={(v) => set("urbanization_name", v)} />
                </Field>
                <Field label="Barrio">
                  <TextInput value={form.neighborhood} onChange={(v) => set("neighborhood", v)} placeholder="Malasaña" />
                </Field>
                <Field label="Distrito">
                  <TextInput value={form.district} onChange={(v) => set("district", v)} placeholder="Centro" />
                </Field>
              </Row>
              <Row>
                <Field label="Ciudad" required>
                  <TextInput value={form.city} onChange={(v) => set("city", v)} placeholder="Madrid" />
                </Field>
                <Field label="Código postal">
                  <TextInput value={form.postal_code} onChange={(v) => set("postal_code", v)} placeholder="28013" />
                </Field>
              </Row>
              <Row>
                <Field label="Latitud">
                  <NumberInput value={form.latitude} onChange={(v) => set("latitude", v)} placeholder="40.41650" />
                </Field>
                <Field label="Longitud">
                  <NumberInput value={form.longitude} onChange={(v) => set("longitude", v)} placeholder="-3.70340" />
                </Field>
                <Field label="Visibilidad de la dirección">
                  <Select value={form.address_visibility} onChange={(v) => set("address_visibility", v as AddressVisibility)} options={[["exact","Dirección exacta"],["street_only","Solo calle"],["hidden","Oculta"]]} />
                </Field>
              </Row>
              <SectionDivider label="Planta" />
              <Row>
                <Field label="Planta">
                  <NumberInput value={form.floor} onChange={(v) => set("floor", v)} placeholder="3" />
                </Field>
              </Row>
              <CheckboxGroup>
                <Check label="Última planta / ático" checked={form.is_top_floor} onChange={(v) => set("is_top_floor", v)} />
              </CheckboxGroup>
            </Section>
          )}

          {/* TAMAÑO */}
          {activeTab === "tamano" && (
            <Section title="Tamaño">
              <Row>
                <Field label="Superficie construida (m²)">
                  <NumberInput value={form.size_m2} onChange={(v) => set("size_m2", v)} placeholder="80" />
                </Field>
                <Field label="Superficie útil (m²)">
                  <NumberInput value={form.useful_size_m2} onChange={(v) => set("useful_size_m2", v)} placeholder="72" />
                </Field>
                <Field label="Habitaciones">
                  <NumberInput value={form.rooms} onChange={(v) => set("rooms", v)} placeholder="3" />
                </Field>
                <Field label="Baños">
                  <NumberInput value={form.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="1" />
                </Field>
              </Row>
              <SectionDivider label="Edificio" />
              <Row>
                <Field label="Año de construcción">
                  <NumberInput value={form.construction_year} onChange={(v) => set("construction_year", v)} placeholder="1985" />
                </Field>
                <Field label="Estado del inmueble">
                  <Select value={form.condition} onChange={(v) => set("condition", v as Condition | "")} options={[["","— Sin especificar —"],["new","Obra nueva"],["good","Buen estado"],["needs_renovation","A reformar"]]} />
                </Field>
              </Row>
            </Section>
          )}

          {/* CARACTERÍSTICAS */}
          {activeTab === "caracteristicas" && (
            <Section title="Características">
              <Row>
                <Field label="Equipamiento de cocina">
                  <Select value={form.kitchen_equipment} onChange={(v) => set("kitchen_equipment", v as KitchenEquipment | "")} options={[["","— Sin especificar —"],["fully_equipped_furnished","Cocina equipada y amueblada"],["fully_equipped_unfurnished","Cocina equipada, sin amueblar"],["empty_unfurnished","Cocina vacía, sin amueblar"],["unknown","No lo sé"]]} />
                </Field>
                <Field label="Tipo de calefacción">
                  <Select value={form.heating_type} onChange={(v) => set("heating_type", v as HeatingType | "")} options={[["","— Sin especificar —"],["central","Central"],["individual","Individual"],["none","Sin calefacción"]]} />
                </Field>
                <Field label="Combustible calefacción">
                  <Select value={form.heating_fuel} onChange={(v) => set("heating_fuel", v as HeatingFuel | "")} options={[["","— Sin especificar —"],["gas","Gas"],["electric","Eléctrico"],["gasoil","Gasóleo"],["other","Otro"]]} />
                </Field>
              </Row>
              <SectionDivider label="Orientación" />
              <CheckboxGroup>
                {(["north","south","east","west"] as Orientation[]).map((o) => (
                  <Check key={o} label={o==="north"?"Norte":o==="south"?"Sur":o==="east"?"Este":"Oeste"} checked={form.orientation.includes(o)} onChange={() => toggleOrientation(o)} />
                ))}
              </CheckboxGroup>
              <SectionDivider label="Características generales" />
              <CheckboxGroup>
                <Check label="Exterior" checked={form.is_exterior} onChange={(v) => set("is_exterior", v)} />
                <Check label="Ascensor" checked={form.has_elevator} onChange={(v) => set("has_elevator", v)} />
                <Check label="Aire acondicionado" checked={form.has_air_conditioning} onChange={(v) => set("has_air_conditioning", v)} />
                <Check label="Terraza" checked={form.has_terrace} onChange={(v) => set("has_terrace", v)} />
                <Check label="Balcón" checked={form.has_balcony} onChange={(v) => set("has_balcony", v)} />
                <Check label="Armarios empotrados" checked={form.has_built_in_wardrobes} onChange={(v) => set("has_built_in_wardrobes", v)} />
                <Check label="Garaje incluido" checked={form.has_garage} onChange={(v) => set("has_garage", v)} />
                <Check label="Trastero" checked={form.has_storage} onChange={(v) => set("has_storage", v)} />
                <Check label="Piscina" checked={form.has_pool} onChange={(v) => set("has_pool", v)} />
                <Check label="Jardín" checked={form.has_garden} onChange={(v) => set("has_garden", v)} />
                <Check label="Acceso exterior adaptado" checked={form.accessible_exterior} onChange={(v) => set("accessible_exterior", v)} />
                <Check label="Acceso interior adaptado" checked={form.accessible_interior} onChange={(v) => set("accessible_interior", v)} />
              </CheckboxGroup>
              <SectionDivider label="Certificado energético" />
              <Row>
                <Field label="Clase energética">
                  <Select value={form.energy_certificate} onChange={(v) => set("energy_certificate", v as EnergyClass | "")} options={[["","— Sin especificar —"],...["A","B","C","D","E","F","G","exempt","in_progress"].map((c):[string,string]=>[c,c==="exempt"?"Exento":c==="in_progress"?"En trámite":c])]} />
                </Field>
                <Field label="Consumo energético (kWh/m²/año)">
                  <NumberInput value={form.energy_consumption} onChange={(v) => set("energy_consumption", v)} placeholder="120" />
                </Field>
                <Field label="Clase emisiones CO₂">
                  <Select value={form.emissions_certificate} onChange={(v) => set("emissions_certificate", v as EnergyClass | "")} options={[["","— Sin especificar —"],...["A","B","C","D","E","F","G","exempt","in_progress"].map((c):[string,string]=>[c,c==="exempt"?"Exento":c==="in_progress"?"En trámite":c])]} />
                </Field>
                <Field label="Emisiones CO₂ (kg CO₂/m²/año)">
                  <NumberInput value={form.emissions_value} onChange={(v) => set("emissions_value", v)} placeholder="28" />
                </Field>
              </Row>
            </Section>
          )}

          {/* DESCRIPCIÓN */}
          {activeTab === "descripcion" && (
            <Section title="Descripción y enlaces">
              {/* ── AI translation strip ── */}
              <div style={styles.aiStrip}>
                <span style={styles.aiLabel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Traducir con IA desde:
                </span>
                <select
                  value={translateSource}
                  onChange={(e) => setTranslateSource(e.target.value as "es" | "en" | "fr" | "de")}
                  style={styles.aiSelect}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
                <button
                  type="button"
                  style={{
                    ...styles.aiBtn,
                    opacity: translating ? 0.6 : 1,
                    cursor: translating ? "not-allowed" : "pointer",
                  }}
                  disabled={translating}
                  onClick={handleTranslate}
                >
                  {translating ? (
                    <>
                      <span style={styles.aiSpinner} />
                      Traduciendo…
                    </>
                  ) : (
                    "Traducir al resto →"
                  )}
                </button>
              </div>
              {translateError && (
                <div style={styles.aiError}>
                  {translateError}
                  <button onClick={() => setTranslateError(null)} style={styles.errorClose}>✕</button>
                </div>
              )}

              <Field label="Descripción (Español)" wide>
                <Textarea value={form.description_es} onChange={(v) => set("description_es", v)} rows={6} placeholder="Descripción en español…" />
              </Field>
              <Field label="Description (English)" wide>
                <Textarea value={form.description_en} onChange={(v) => set("description_en", v)} rows={4} placeholder="Description in English…" />
              </Field>
              <Field label="Description (Français)" wide>
                <Textarea value={form.description_fr} onChange={(v) => set("description_fr", v)} rows={4} placeholder="Description en français…" />
              </Field>
              <Field label="Beschreibung (Deutsch)" wide>
                <Textarea value={form.description_de} onChange={(v) => set("description_de", v)} rows={4} placeholder="Beschreibung auf Deutsch…" />
              </Field>
              <Row>
                <Field label="URL de la página web" wide>
                  <TextInput value={form.website_url} onChange={(v) => set("website_url", v)} placeholder="https://kornerclub.es/propiedades/…" />
                </Field>
              </Row>
              <Row>
                <Field label="URL vídeo">
                  <TextInput value={form.video_url} onChange={(v) => set("video_url", v)} placeholder="https://youtube.com/watch?v=…" />
                </Field>
                <Field label="URL visita virtual">
                  <TextInput value={form.virtual_tour_url} onChange={(v) => set("virtual_tour_url", v)} placeholder="https://my.matterport.com/…" />
                </Field>
              </Row>
            </Section>
          )}

          {/* FOTOS */}
          {activeTab === "fotos" && (
            <Section title="Fotos">
              <p style={styles.photoHint}>
                Las fotos ya subidas se conservan. Añade nuevas o elimina las que no quieras.
                Haz clic en una foto para marcarla como principal.
                Los planos admiten imagen (JPG, PNG…) o <strong>PDF</strong>.
              </p>

              {/* ── AI photo ordering strip ── */}
              <div style={styles.aiStrip}>
                <span style={styles.aiLabel}>
                  ✦ Orden IA
                </span>
                <span style={{ fontSize: 12, color: "#666", flex: 1 }}>
                  Claude analiza cada foto y las ordena según las best practices de portales inmobiliarios españoles (Idealista, Fotocasa).
                </span>
                <button
                  style={{
                    ...styles.aiBtn,
                    opacity: (photos.filter(p => p?.url?.includes("res.cloudinary.com")).length < 2 || orderingPhotos) ? 0.45 : 1,
                    cursor: (photos.filter(p => p?.url?.includes("res.cloudinary.com")).length < 2 || orderingPhotos) ? "not-allowed" : "pointer",
                  }}
                  disabled={photos.filter(p => p?.url?.includes("res.cloudinary.com")).length < 2 || orderingPhotos}
                  onClick={handleOrderPhotos}
                >
                  {orderingPhotos ? (
                    <><span style={styles.aiSpinner} />Analizando…</>
                  ) : "Ordenar con IA →"}
                </button>
              </div>
              {orderError && <p style={styles.aiError}>{orderError}</p>}

              <SectionDivider label="Fotos de la propiedad" />
              <p style={{ fontSize: 12, color: "#aaa", margin: "-4px 0 4px" }}>
                Arrastra para reordenar · Clic para marcar como principal (se moverá a la primera posición)
              </p>
              <div style={styles.photoGrid}>
                {photos.map((p, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => onPhotoDragStart(i)}
                    onDragOver={(e) => onPhotoDragOver(e, i)}
                    onDrop={() => onPhotoDrop(i)}
                    onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
                    style={{
                      ...styles.photoCard,
                      ...(i === mainPhotoIndex ? styles.photoCardMain : {}),
                      ...(dragOver === i && dragIndex !== i ? styles.photoCardDragOver : {}),
                      opacity: dragIndex === i ? 0.4 : 1,
                      cursor: "grab",
                    }}
                    onClick={() => setAsMain(i)}
                    title="Clic para marcar como principal · Arrastra para reordenar"
                  >
                    <img src={p.preview || thumbAdmin(p.url)} alt="" style={styles.photoImg} />
                    {i === mainPhotoIndex && <span style={styles.mainBadge}>Principal</span>}
                    <button style={styles.removePhotoBtn} onClick={(e) => { e.stopPropagation(); removePhoto(i, false); }}>✕</button>
                  </div>
                ))}
                <button style={styles.addPhotoBtn} onClick={() => photoInputRef.current?.click()}>
                  <span style={{ fontSize: 24, color: "#bbb" }}>+</span>
                  <span style={{ fontSize: 12, color: "#999" }}>Añadir fotos</span>
                </button>
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => e.target.files && handlePhotoFiles(e.target.files, false)} />

              <SectionDivider label="Planos" />
              <div style={styles.photoGrid}>
                {floorPlanPhotos.map((p, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => onPhotoDragStart(i)}
                    onDragOver={onFloorPlanDragOver}
                    onDrop={() => onFloorPlanDrop(i)}
                    onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
                    style={{ ...styles.photoCard, opacity: dragIndex === i ? 0.4 : 1, cursor: "grab" }}
                  >
                    {(p.preview === "__pdf__" || p.url.endsWith(".pdf") || p.url.includes("/raw/upload/")) ? (
                      <div style={styles.pdfThumb}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span style={styles.pdfLabel}>{p.file?.name ?? "Plano PDF"}</span>
                      </div>
                    ) : (
                      <img src={p.preview || thumbAdmin(p.url)} alt="" style={styles.photoImg} />
                    )}
                    <button style={styles.removePhotoBtn} onClick={() => removePhoto(i, true)}>✕</button>
                  </div>
                ))}
                <button style={styles.addPhotoBtn} onClick={() => floorPlanInputRef.current?.click()}>
                  <span style={{ fontSize: 24, color: "#bbb" }}>+</span>
                  <span style={{ fontSize: 12, color: "#999" }}>Añadir planos</span>
                </button>
              </div>
              <input ref={floorPlanInputRef} type="file" accept="image/*,application/pdf" multiple style={{ display: "none" }} onChange={(e) => e.target.files && handlePhotoFiles(e.target.files, true)} />
            </Section>
          )}

          {/* DATOS INTERNOS */}
          {activeTab === "internos" && (
            <Section title="Datos internos">
              <Row>
                <Field label="Agente captador">
                  <TextInput value={form.capturing_agent} onChange={(v) => set("capturing_agent", v)} placeholder="Nombre del agente" />
                </Field>
                <Field label="Agente comercializador">
                  <TextInput value={form.selling_agent} onChange={(v) => set("selling_agent", v)} placeholder="Nombre del agente" />
                </Field>
              </Row>
              <Field label="Notas privadas" wide>
                <Textarea value={form.private_notes} onChange={(v) => set("private_notes", v)} rows={4} placeholder="Notas internas, no visibles en la web pública…" />
              </Field>

              {/* Portal publishing */}
              <SectionDivider label="Publicación en portales" />
              <Field label="Selecciona los portales donde publicar" wide>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {[
                    { id: "idealista", label: "Idealista", url: "idealista.com" },
                    { id: "fotocasa", label: "Fotocasa", url: "fotocasa.es" },
                    { id: "habitaclia", label: "Habitaclia", url: "habitaclia.com" },
                  ].map((portal) => (
                    <label key={portal.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#1a1a1a" }}>
                      <input
                        type="checkbox"
                        checked={portals.includes(portal.id)}
                        onChange={(e) =>
                          setPortals((prev) =>
                            e.target.checked ? [...prev, portal.id] : prev.filter((p) => p !== portal.id)
                          )
                        }
                        style={{ width: 16, height: 16, accentColor: "var(--gold)", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: 500 }}>{portal.label}</span>
                      <span style={{ fontSize: 12, color: "#aaa" }}>{portal.url}</span>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#aaa", margin: "8px 0 0", lineHeight: 1.5 }}>
                  La publicación automática en portales estará disponible próximamente. Por ahora esta selección se guarda para cuando se active la integración.
                </p>
              </Field>
            </Section>
          )}

          {/* Bottom bar */}
          <div style={styles.bottomBar}>
            {error && <span style={styles.bottomError}>{error}</span>}
            {isPublished ? (
              <>
                <button style={{ ...styles.btnSave, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => handleSave(true)}>
                  {saving ? savingLabel : "Actualizar publicación"}
                </button>
                <button style={{ ...styles.btnPublish, opacity: 0.4, cursor: "not-allowed" }} disabled title="Integración con portales próximamente">
                  Publicar en portales
                </button>
              </>
            ) : (
              <>
                <button style={{ ...styles.btnSave, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => handleSave(false)}>
                  {saving ? savingLabel : "Guardar borrador"}
                </button>
                <button style={{ ...styles.btnPublish, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => handleSave(true)}>
                  {saving ? savingLabel : isEdit ? "Guardar y publicar" : "Publicar"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={sectionStyles.wrapper}>
      <h2 style={sectionStyles.title}>{title}</h2>
      <div style={sectionStyles.body}>{children}</div>
    </div>
  );
}
function SectionDivider({ label }: { label: string }) {
  return (
    <div style={sectionStyles.divider}>
      <span style={sectionStyles.dividerText}>{label}</span>
      <span style={sectionStyles.dividerLine} />
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={sectionStyles.row}>{children}</div>;
}
function Field({ label, children, required, wide }: { label: string; children: React.ReactNode; required?: boolean; wide?: boolean }) {
  return (
    <div style={{ ...sectionStyles.field, ...(wide ? { gridColumn: "1 / -1" } : {}) }}>
      <label style={sectionStyles.label}>{label}{required && <span style={{ color: "#c62828", marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}
function CheckboxGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label style={{ ...sectionStyles.label, marginBottom: 8, display: "block" }}>{label}</label>}
      <div style={sectionStyles.checkGroup}>{children}</div>
    </div>
  );
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={sectionStyles.checkLabel}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ accentColor: "var(--gold, #b8973a)", width: 15, height: 15 }} />
      {label}
    </label>
  );
}
function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={sectionStyles.input} />;
}
function NumberInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={sectionStyles.input} />;
}
function Textarea({ value, onChange, rows, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 3} placeholder={placeholder} style={{ ...sectionStyles.input, resize: "vertical", lineHeight: 1.6 }} />;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={sectionStyles.input}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: { minHeight: "100vh", background: "#f7f7f5", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" },
  topBar: { background: "white", borderBottom: "1px solid #e8e8e8", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, gap: 16, flexWrap: "wrap" as const },
  topBarLeft: { display: "flex", alignItems: "center", gap: 10 },
  topBarBreadcrumb: { fontSize: 14, color: "#1a1a1a", fontWeight: 500 },
  breadcrumbLink: { color: "#888", textDecoration: "none", fontFamily: "inherit" },
  topBarRight: { display: "flex", alignItems: "center", gap: 8 },
  btnCancel: { background: "none", border: "1px solid #e8e8e8", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", textDecoration: "none", color: "#666", fontFamily: "inherit", display: "inline-block" },
  btnSave: { background: "white", border: "1.5px solid #e8e8e8", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#1a1a1a", fontFamily: "inherit" },
  btnPublish: { background: "var(--gold, #b8973a)", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "white", fontFamily: "inherit" },
  layout: { display: "flex", maxWidth: 1100, margin: "0 auto", padding: "24px", gap: 24, alignItems: "flex-start" },
  sidebar: { width: 180, flexShrink: 0, background: "white", borderRadius: 12, border: "1px solid #e8e8e8", padding: 8, display: "flex", flexDirection: "column" as const, gap: 2, position: "sticky", top: 68 },
  sidebarTab: { background: "none", border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#555", cursor: "pointer", textAlign: "left" as const, fontFamily: "inherit", transition: "all 0.15s" },
  sidebarTabActive: { background: "#1a1a1a", color: "white" },
  formArea: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" as const, gap: 20 },
  errorBanner: { background: "#fff0f0", border: "1px solid #fcd5d5", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#c62828", display: "flex", justifyContent: "space-between", alignItems: "center" },
  errorClose: { background: "none", border: "none", cursor: "pointer", color: "#c62828", fontSize: 16, lineHeight: 1, padding: 0 },
  photoHint: { fontSize: 13, color: "#888", margin: "0 0 8px", lineHeight: 1.6 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 8 },
  photoCard: { position: "relative", aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", border: "2px solid transparent", cursor: "pointer" },
  photoCardMain: { border: "2px solid var(--gold, #b8973a)" },
  photoCardDragOver: { border: "2px dashed #666", background: "#f5f5f5" },
  photoImg: { width: "100%", height: "100%", objectFit: "cover" as const, display: "block" },
  mainBadge: { position: "absolute", bottom: 4, left: 4, background: "var(--gold, #b8973a)", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 },
  removePhotoBtn: { position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.55)", color: "white", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  addPhotoBtn: { aspectRatio: "4/3", border: "2px dashed #e8e8e8", borderRadius: 8, background: "white", cursor: "pointer", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "inherit" },
  pdfThumb: { width: "100%", height: "100%", background: "#fff5f5", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 4px" },
  pdfLabel: { fontSize: 10, color: "#c62828", textAlign: "center" as const, wordBreak: "break-all" as const, lineHeight: 1.3, maxWidth: "90%", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const },
  bottomBar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "20px 0 8px", flexWrap: "wrap" as const },
  bottomError: { fontSize: 13, color: "#c62828", marginRight: "auto" },
  // AI translation strip
  aiStrip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f9f6ef",
    border: "1px solid #e8dfc8",
    borderRadius: 8,
    padding: "10px 14px",
    flexWrap: "wrap" as const,
  },
  aiLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#7a5c1e",
    whiteSpace: "nowrap" as const,
  },
  aiSelect: {
    border: "1px solid #e0d4b8",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    fontFamily: "inherit",
    background: "white",
    color: "#1a1a1a",
    outline: "none",
    cursor: "pointer",
  },
  aiBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "var(--gold, #b8973a)",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
  aiSpinner: {
    display: "inline-block",
    width: 12,
    height: 12,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  aiError: {
    background: "#fff0f0",
    border: "1px solid #fcd5d5",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#c62828",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
};

const sectionStyles: { [key: string]: React.CSSProperties } = {
  wrapper: { background: "white", borderRadius: 12, border: "1px solid #e8e8e8", overflow: "hidden" },
  title: { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: 0, padding: "18px 24px", borderBottom: "1px solid #f0f0f0", fontFamily: "var(--font-playfair), serif" },
  body: { padding: "20px 24px", display: "flex", flexDirection: "column" as const, gap: 18 },
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, alignItems: "start" },
  field: { display: "flex", flexDirection: "column" as const, gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.04em" },
  input: { border: "1.5px solid #e8e8e8", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", color: "#1a1a1a", outline: "none", background: "white", width: "100%", boxSizing: "border-box" as const },
  checkGroup: { display: "flex", flexWrap: "wrap" as const, gap: "10px 20px" },
  checkLabel: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#333", cursor: "pointer", fontFamily: "inherit" },
  divider: { display: "flex", alignItems: "center", gap: 10, margin: "4px 0" },
  dividerText: { fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.06em", whiteSpace: "nowrap" as const },
  dividerLine: { flex: 1, height: 1, background: "#f0f0f0", display: "block" },
};
