"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Gauge, GraduationCap, PenTool, Repeat2, RotateCcw, Users } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { APP_HOME, NAV, SITE } from "@/config/site";
import { LANGUAGES, levelsFor } from "@/data/levels";
import { cn } from "@/lib/cn";
import { useLearningStore } from "@/store/useLearningStore";
import { useOpenMistakes, useVocabStats } from "@/store/selectors";
import { Switch } from "@/components/ui/primitives";
import type { LanguageCode } from "@/types/learning";

const ICONS = { dashboard: Gauge, book: BookOpen, practice: PenTool, review: Repeat2, classroom: Users } as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const s = useLearningStore(
    useShallow((st) => ({
      language: st.language,
      level: st.level,
      prefs: st.preferences,
      profile: st.profile,
      setLanguage: st.setLanguage,
      setLevel: st.setLevel,
      togglePinyin: st.togglePinyin,
      toggleTranslation: st.toggleTranslation,
      toggleToneColors: st.toggleToneColors,
      setSpeechRate: st.setSpeechRate,
      resetProgress: st.resetProgress,
    })),
  );
  const due = useVocabStats().due.length;
  const mistakes = useOpenMistakes().open.length;
  const badges: Record<string, number> = { "/app/repaso": due + mistakes };

  return (
    <aside className="flex h-full w-72 flex-col gap-5 overflow-y-auto border-r border-line bg-surface px-4 py-5">
      <Link href={APP_HOME} onClick={onNavigate} className="flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-ink">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="font-semibold leading-tight">{SITE.name}</p>
          <p className="text-xs text-muted">Fase 1 · MVP</p>
        </div>
      </Link>

      {/* Idioma */}
      <section>
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted">Idioma</p>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
          {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => s.setLanguage(code)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition",
                s.language === code ? "bg-surface shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              <span>{LANGUAGES[code].flag}</span>
              {code === "zh" ? "Chino" : "Inglés"}
            </button>
          ))}
        </div>
      </section>

      {/* Nivel */}
      <section>
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted">
          Nivel {LANGUAGES[s.language].framework}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {levelsFor(s.language).map((lvl) => (
            <button
              key={lvl.code}
              type="button"
              title={`${lvl.label} · ${lvl.name}`}
              onClick={() => s.setLevel(lvl.code)}
              className={cn(
                "rounded-lg border py-1.5 text-sm font-medium transition",
                s.level === lvl.code
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </section>

      {/* Navegación */}
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.href === APP_HOME ? pathname === APP_HOME : pathname.startsWith(item.href);
          const badge = badges[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition",
                active ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <Icon size={18} />
              <span className="flex-1">{item.href === "/app/aula" ? `Aula ${s.level.replace("HSK", "HSK ")}` : item.label}</span>
              {!!badge && (
                <span className="rounded-full bg-danger-soft px-1.5 text-xs font-semibold text-danger">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Preferencias de estudio */}
      <section className="rounded-xl border border-line p-2">
        <p className="mb-1 px-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted">Visualización</p>
        {s.language === "zh" && (
          <>
            <Switch
              checked={s.prefs.showPinyin}
              onChange={s.togglePinyin}
              label="Pinyin"
              description={<span className="font-cjk">拼音 sobre el hanzi</span>}
            />
            <Switch checked={s.prefs.toneColors} onChange={s.toggleToneColors} label="Colores de tono" />
          </>
        )}
        <Switch checked={s.prefs.showTranslation} onChange={s.toggleTranslation} label="Traducción" description="Español bajo cada frase" />
        <div className="px-2 py-2">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">Velocidad de audio</span>
            <span className="tabular-nums text-muted">{s.prefs.speechRate.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.1}
            value={s.prefs.speechRate}
            onChange={(e) => s.setSpeechRate(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
            aria-label="Velocidad de audio"
          />
        </div>
      </section>

      <div className="mt-auto flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-xl">{s.profile.avatar}</span>
          <span className="truncate text-sm font-medium">{s.profile.name}</span>
        </div>
        <button
          type="button"
          title="Reiniciar progreso"
          onClick={() => {
            if (confirm("¿Borrar todo tu progreso local y volver al onboarding?")) s.resetProgress();
          }}
          className="rounded-md p-1 text-muted hover:text-danger"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </aside>
  );
}
