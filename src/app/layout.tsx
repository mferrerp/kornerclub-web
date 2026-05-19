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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${dmSans.variable} ${libreFranklin.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
