import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/og/BrandMark";

// Icono de la app (pestaña, manifest y logo del JSON-LD). Se genera en el build.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMark size={512} radius={112} />, { ...size });
}
