import type { Metadata } from "next";
import { PhoneticsCenter } from "@/components/phonetics/PhoneticsCenter";

export const metadata: Metadata = { title: "Fonética" };

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/app/layout.tsx.
export const instant = false;

export default function PhoneticsPage() {
  return <PhoneticsCenter />;
}
