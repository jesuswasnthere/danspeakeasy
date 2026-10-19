import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard";

// Se renderiza solo en cliente (estado en localStorage): ver nota en app/app/layout.tsx.
export const instant = false;

export default function DashboardPage() {
  return <ProgressDashboard />;
}
