import type { Metadata } from "next";
import { ReviewCenter } from "@/components/review/ReviewCenter";

export const metadata: Metadata = { title: "Repaso" };

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/layout.tsx.
export const instant = false;

export default function ReviewPage() {
  return <ReviewCenter />;
}
