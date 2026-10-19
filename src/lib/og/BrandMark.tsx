/**
 * Marca de DanSpeakeasy para imágenes generadas con `ImageResponse` (icono, OG).
 * Satori solo admite estilos en línea y un subconjunto de CSS: nada de clases.
 * El trazo es el icono GraduationCap de lucide (ISC), igual que en la app.
 */
export const BRAND = { accent: "#4f46e5", ink: "#1d1d1b", bg: "#f7f7f5", muted: "#6b6b66" } as const;

export function BrandMark({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: BRAND.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
    </div>
  );
}
