import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const TYPE_LABELS: Record<string, string> = {
  apartment: "Piso", house: "Casa", studio: "Estudio",
  penthouse: "Ático", duplex: "Dúplex", commercial: "Local comercial",
  office: "Oficina", land: "Terreno", garage: "Garaje", storage: "Trastero",
};

const formatPrice = (n: number) =>
  n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: p } = await supabase
    .from("properties")
    .select("property_type, rooms, neighborhood, city, price, operation_type, description_es, photos, main_photo_index")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!p) return {};

  const typeLabel = TYPE_LABELS[p.property_type] ?? "Propiedad";
  const rooms = p.rooms ? ` de ${p.rooms} habitación${p.rooms === 1 ? "" : "es"}` : "";
  const location = p.neighborhood ?? p.city ?? "Madrid";
  const price = `${formatPrice(p.price)} €${p.operation_type !== "sale" ? "/mes" : ""}`;

  const title = `${typeLabel}${rooms} en ${location} — ${price} | Korner Club`;
  const description =
    p.description_es?.slice(0, 155).trim() ??
    `${typeLabel}${rooms} en ${location}. ${price}. Inmobiliaria Korner Club Madrid.`;

  const photo = p.photos?.[p.main_photo_index ?? 0] ?? p.photos?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kornerclub.es/propiedades/${id}`,
      type: "website",
      ...(photo ? { images: [{ url: photo, width: 1200, height: 800 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(photo ? { images: [photo] } : {}),
    },
  };
}

export default function PropiedadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
