import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";
import { BRAND, BrandMark } from "@/lib/og/BrandMark";

// Imagen para compartir (Open Graph y Twitter/X). Se genera en el build.
// Solo texto latino: la fuente por defecto de ImageResponse no incluye CJK.
export const alt = `${SITE.name}: aprende idiomas por niveles, con estructura y seguimiento real`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: BRAND.bg,
          color: BRAND.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <BrandMark size={88} radius={22} />
          <div style={{ fontSize: 44, fontWeight: 700 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>
            Aprende idiomas por niveles, con seguimiento real
          </div>
          <div style={{ fontSize: 32, color: BRAND.muted }}>
            Chino Mandarín (HSK 1–6) · Inglés (MCER A1–C2) · Más idiomas próximamente
          </div>
        </div>
        <div style={{ display: "flex", height: 10, width: 220, borderRadius: 5, background: BRAND.accent }} />
      </div>
    ),
    { ...size },
  );
}
