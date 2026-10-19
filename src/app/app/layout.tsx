import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SITE } from "@/config/site";

/**
 * Fase 1: el estado del alumno vive en localStorage, así que <AppShell> no
 * renderiza las páginas en el servidor (evita parpadeos y desajustes de
 * hidratación). Por eso desactivamos la validación de "instant navigation" de
 * Cache Components en este segmento (solo la app; la landing sí se prerenderiza).
 * En la Fase 2 (estado en BD + sesión) se puede reactivar.
 */
export const instant = false;

/** La app depende del estado local del alumno: no tiene sentido indexarla. */
export const metadata: Metadata = {
  title: { default: "Progreso", template: `%s · ${SITE.name}` },
  robots: { index: false, follow: false },
};

export default function StudentAppLayout({ children }: LayoutProps<"/app">) {
  return <AppShell>{children}</AppShell>;
}
