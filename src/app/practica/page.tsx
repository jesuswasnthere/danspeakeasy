import type { Metadata } from "next";
import { PracticeHub } from "@/components/practice/PracticeHub";

export const metadata: Metadata = { title: "Práctica" };

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/layout.tsx.
export const instant = false;

export default function PracticePage() {
  return <PracticeHub />;
}
