import type { Metadata } from "next";
import { RadicalsCenter } from "@/components/radicals/RadicalsCenter";

export const metadata: Metadata = { title: "Radicales" };

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/app/layout.tsx.
export const instant = false;

export default function RadicalsPage() {
  return <RadicalsCenter />;
}
