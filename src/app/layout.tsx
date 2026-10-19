import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import { SITE } from "@/config/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Fuente CJK: sin precarga (es pesada); se sirve por subconjuntos unicode.
const notoSC = Noto_Sans_SC({ variable: "--font-noto-sc", weight: ["400", "500", "700"], preload: false });

/**
 * Layout raíz compartido por la landing pública (`/`, prerenderizada en servidor)
 * y la app del alumno (`/app/*`, ver app/app/layout.tsx). No monta <AppShell>: la
 * hidratación desde localStorage solo ocurre dentro de /app.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} · Aprende idiomas por niveles`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${notoSC.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
