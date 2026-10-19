import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/og/BrandMark";

// Icono para iOS (pantalla de inicio). Sin esquinas redondeadas: iOS ya las aplica.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={180} radius={0} />, { ...size });
}
