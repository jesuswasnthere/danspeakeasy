"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Layers, Target, Users } from "lucide-react";
import { SITE } from "@/config/site";
import { LANGUAGES, levelsFor } from "@/data/levels";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useLearningStore } from "@/store/useLearningStore";
import { Badge, Button } from "@/components/ui/primitives";
import type { LanguageCode, LevelCode } from "@/types/learning";

const AVATARS = ["🧑‍🎓", "🐼", "🦊", "🐉", "🌸", "🚀", "🎧", "📚", "🍵", "🌊"];
const STEPS = ["Idioma", "Nivel", "Perfil"] as const;

export function Onboarding() {
  const completeOnboarding = useLearningStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<LanguageCode>("zh");
  const [level, setLevel] = useState<LevelCode>("HSK2");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const chooseLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setLevel(code === "zh" ? "HSK2" : "B1");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-ink">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Bienvenido a {SITE.name}</h1>
            <p className="text-sm text-muted">{SITE.tagline}</p>
          </div>
        </div>

        <ol className="mb-6 flex gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <div className={cn("h-1.5 rounded-full", i <= step ? "bg-accent" : "bg-line")} />
              <p className={cn("mt-1.5 text-xs", i === step ? "font-medium text-ink" : "text-muted")}>
                {i + 1}. {label}
              </p>
            </li>
          ))}
        </ol>

        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold">¿Qué idioma quieres estudiar?</h2>
              <p className="mt-1 text-sm text-muted">Puedes estudiar los dos; tu progreso se guarda por separado.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => {
                  const l = LANGUAGES[code];
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => chooseLanguage(code)}
                      className={cn(
                        "rounded-2xl border-2 p-5 text-left transition",
                        language === code ? "border-accent bg-accent-soft" : "border-line hover:border-ink/20",
                      )}
                    >
                      <span className="text-3xl">{l.flag}</span>
                      <p className="mt-3 font-semibold">{l.name}</p>
                      <p className={cn("text-sm text-muted", code === "zh" && "font-cjk")}>
                        {l.nativeName} · niveles {l.framework}
                      </p>
                    </button>
                  );
                })}
              </div>
              <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-3">
                <li className="flex gap-2"><Layers size={16} className="mt-0.5 shrink-0 text-accent" /> Libro de clase guiado, unidad a unidad.</li>
                <li className="flex gap-2"><Target size={16} className="mt-0.5 shrink-0 text-accent" /> Seguimiento de errores y repaso espaciado.</li>
                <li className="flex gap-2"><Users size={16} className="mt-0.5 shrink-0 text-accent" /> Aula solo con compañeros de tu nivel.</li>
              </ul>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold">¿Cuál es tu nivel actual?</h2>
              <p className="mt-1 text-sm text-muted">
                Todo el contenido y el aula se filtran por este nivel, para que nunca estudies mezclado con niveles muy distintos.
                Puedes cambiarlo cuando quieras.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {levelsFor(language).map((lvl) => {
                  const units = content.getCourse(lvl.code).units;
                  const available = units.some((u) => u.status === "available");
                  return (
                    <button
                      key={lvl.code}
                      type="button"
                      onClick={() => setLevel(lvl.code)}
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 text-left transition",
                        level === lvl.code ? "border-accent bg-accent-soft" : "border-line hover:border-ink/20",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">
                          {lvl.label} <span className="font-normal text-muted">· {lvl.name}</span>
                        </span>
                        {available ? <Badge tone="success">Con lecciones</Badge> : <Badge>Próximamente</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted">{lvl.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold">¿Cómo te verán tus compañeros?</h2>
              <p className="mt-1 text-sm text-muted">Tu nombre aparecerá en el aula de tu nivel.</p>
              <label className="mt-5 block text-sm font-medium" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                placeholder="p. ej. Daniela"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-accent"
              />
              <p className="mt-5 text-sm font-medium">Avatar</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border-2 text-xl transition",
                      avatar === a ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              <ArrowLeft size={16} /> Atrás
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continuar <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={() => completeOnboarding({ name, avatar, language, level })} disabled={!name.trim()}>
                <Check size={16} /> Empezar a estudiar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
