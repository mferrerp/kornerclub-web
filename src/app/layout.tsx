import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Libre_Franklin } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Korner Club | Inmobiliaria en Madrid — Compra, Venta y Alquiler",
  description:
    "Inmobiliaria digital en Madrid. Especialistas en acompañar a recién llegados en su proceso de instalación y búsqueda de vivienda. Tu barrio, tu Korner.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  metadataBase: new URL("https://kornerclub.es"),
  openGraph: {
    title: "Korner Club | Inmobiliaria en Madrid",
    description: "Inmobiliaria digital en Madrid. Especialistas en acompañar a recién llegados. Tu barrio, tu Korner.",
    url: "https://kornerclub.es",
    siteName: "Korner Club",
    locale: "es_ES",
    type: "website",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  name: "Korner Club",
  description:
    "Inmobiliaria digital en Madrid. Especialistas en acompañar a recién llegados en su proceso de instalación y búsqueda de vivienda.",
  url: "https://kornerclub.es",
  email: "hola@kornerclub.es",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Madrid",
    addressRegion: "Comunidad de Madrid",
    addressCountry: "ES",
  },
  areaServed: {
    "@type": "City",
    name: "Madrid",
  },
  priceRange: "€€€",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "19:00",
  },
  sameAs: ["https://kornerclub.es"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} ${libreFranklin.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
