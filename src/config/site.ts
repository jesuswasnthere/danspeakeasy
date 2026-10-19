import type { LevelCode } from "@/types/learning";

/**
 * URL pública canónica del sitio (sin barra final). Se usa para `metadataBase`,
 * canonical, sitemap, robots y JSON-LD. Configúrala en Vercel con
 * `NEXT_PUBLIC_SITE_URL` (ver docs/DEPLOYMENT.md). En previews de Vercel cae a la
 * URL del despliegue y, en local, a localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "DanSpeakeasy",
  url: resolveSiteUrl(),
  tagline: "Aprende idiomas por niveles, con estructura y seguimiento real.",
  description:
    "Plataforma para aprender idiomas por niveles con libro de clase interactivo, práctica de pronunciación, escritura de hanzi, repaso espaciado y un aula por nivel. Hoy: Chino Mandarín (HSK 1–6) e Inglés (MCER A1–C2).",
} as const;

/** Prefijo de la aplicación del alumno (no indexable). La landing pública vive en `/`. */
export const APP_HOME = "/app";

export type NavIcon = "dashboard" | "book" | "phonetics" | "practice" | "review" | "classroom";

/** `levels`: si existe, el enlace solo se muestra en esos niveles. */
export const NAV: readonly { href: string; label: string; icon: NavIcon; levels?: readonly LevelCode[] }[] = [
  { href: "/app", label: "Progreso", icon: "dashboard" },
  { href: "/app/libro", label: "Libro de clase", icon: "book" },
  { href: "/app/fonetica", label: "Fonética", icon: "phonetics", levels: ["HSK1", "HSK2"] },
  { href: "/app/practica", label: "Práctica", icon: "practice" },
  { href: "/app/repaso", label: "Repaso", icon: "review" },
  { href: "/app/aula", label: "Aula", icon: "classroom" },
];
