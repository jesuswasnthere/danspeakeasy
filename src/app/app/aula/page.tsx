import type { Metadata } from "next";
import { LevelClassroom } from "@/components/classroom/LevelClassroom";

export const metadata: Metadata = { title: "Aula" };

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/app/layout.tsx.
export const instant = false;

export default function ClassroomPage() {
  return <LevelClassroom />;
}
