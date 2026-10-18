import type { Metadata } from "next";
import { InteractiveTextbook } from "@/components/textbook/InteractiveTextbook";

export const metadata: Metadata = { title: "Libro de clase" };

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/layout.tsx.
export const instant = false;

export default function TextbookPage() {
  return <InteractiveTextbook />;
}
