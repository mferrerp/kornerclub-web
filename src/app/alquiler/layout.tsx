import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pisos en alquiler en Madrid | Korner Club",
  description:
    "Pisos, estudios y casas en alquiler en Madrid. Contratos transparentes, propiedades verificadas y acompañamiento completo. Encuentra tu hogar sin estrés.",
  openGraph: {
    title: "Pisos en alquiler en Madrid | Korner Club",
    description:
      "Alquila con Korner Club en Madrid. Propiedades verificadas y asesoramiento experto.",
    url: "https://kornerclub.es/alquiler",
  },
};

export default function AlquilerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
