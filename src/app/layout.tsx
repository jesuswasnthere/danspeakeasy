import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import { SITE } from "@/config/site";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Fuente CJK: sin precarga (es pesada); se sirve por subconjuntos unicode.
const notoSC = Noto_Sans_SC({ variable: "--font-noto-sc", weight: ["400", "500", "700"], preload: false });

/**
 * Fase 1: el estado del alumno vive en localStorage, así que <AppShell> no
 * renderiza las páginas en el servidor (evita parpadeos y desajustes de
 * hidratación). Por eso desactivamos la validación de "instant navigation" de
 * Cache Components. En la Fase 2 (estado en BD + sesión) se puede reactivar.
 */
export const instant = false;

export const metadata: Metadata = {
  title: { default: `${SITE.name} · Chino e Inglés por niveles`, template: `%s · ${SITE.name}` },
  description: SITE.tagline,
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
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
