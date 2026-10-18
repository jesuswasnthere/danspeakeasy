"use client";

import { useEffect, useState, type ReactNode } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { SITE } from "@/config/site";
import { LANGUAGES, LEVELS } from "@/data/levels";
import { useLearningStore } from "@/store/useLearningStore";
import { useHydrated } from "@/store/selectors";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { MissionWatcher } from "@/components/classroom/LevelClassroom";
import { Sidebar } from "./Sidebar";

/**
 * Carcasa de la app: hidrata el store desde localStorage, muestra el onboarding
 * la primera vez y, después, la barra lateral + contenido.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const onboarded = useLearningStore((s) => s.onboarded);
  const language = useLearningStore((s) => s.language);
  const level = useLearningStore((s) => s.level);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    void useLearningStore.persist.rehydrate();
  }, []);

  if (!hydrated) return <ShellSkeleton />;
  if (!onboarded) return <Onboarding />;

  return (
    <div className="flex min-h-dvh">
      <MissionWatcher />
      <div className="sticky top-0 hidden h-dvh lg:block">
        <Sidebar />
      </div>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 shadow-xl">
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setDrawer((d) => !d)} className="rounded-lg p-1.5 hover:bg-surface-2" aria-label="Menú">
            {drawer ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="flex items-center gap-2 font-semibold">
            <GraduationCap size={18} className="text-accent" /> {SITE.name}
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
            {LANGUAGES[language].flag} {LEVELS[level].label}
          </span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex items-center gap-3 text-muted">
        <span className="h-2 w-2 animate-ping rounded-full bg-accent" />
        <span className="text-sm">Cargando tu aula…</span>
      </div>
    </div>
  );
}
