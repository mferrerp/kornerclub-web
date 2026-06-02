import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pisos y casas en venta en Madrid | Korner Club",
  description:
    "Encuentra pisos, áticos, dúplex y casas en venta en Madrid. Acceso a propiedades exclusivas antes de salir al mercado. Asesoramiento personalizado en cada paso.",
  openGraph: {
    title: "Pisos y casas en venta en Madrid | Korner Club",
    description:
      "Acceso a propiedades exclusivas en Madrid. Compra con Korner Club, tu inmobiliaria de confianza.",
    url: "https://kornerclub.es/comprar",
  },
};

export default function ComprarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
