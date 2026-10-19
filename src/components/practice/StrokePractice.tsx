"use client";

import { useEffect, useRef, useState } from "react";
import type HanziWriter from "hanzi-writer";
import { ArrowRight, Check, Eye, EyeOff, Lightbulb, Loader2, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";
import { loadCharacterData, strokeNamesFor, type StrokeNames } from "@/lib/strokes";
import { useSpeech } from "@/hooks/useSpeech";
import { preloadSpeech, speakText, type Playback } from "@/lib/tts";
import { useLearningStore, XP } from "@/store/useLearningStore";
import type { PracticeCharacter } from "@/types/learning";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Badge, Button } from "@/components/ui/primitives";

type Mode = "demo" | "guided" | "memory";

const MODES: { id: Mode; label: string; hint: string; icon: typeof Play }[] = [
  { id: "demo", label: "Ver trazos", hint: "Animación trazo a trazo con su nombre", icon: Play },
  { id: "guided", label: "Trazar con guía", hint: "Escribe sobre el contorno", icon: Eye },
  { id: "memory", label: "De memoria", hint: "Sin contorno: solo tú y el orden de trazos", icon: EyeOff },
];

const SIZE = 300;
/** Pausa entre trazos en la animación, después de que acaben el dibujo y el nombre. */
const STROKE_PAUSE_MS = 450;

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Práctica de escritura de un hanzi: muestra el nombre de cada trazo (横, 竖, 撇…)
 * mientras se anima o mientras el alumno lo escribe, hasta completar el carácter.
 * Usar con `key={char}` para reiniciar al cambiar de carácter.
 */
export function StrokePractice({ item, onNext }: { item: PracticeCharacter; onNext?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const { speak } = useSpeech();
  const speechRate = useLearningStore((s) => s.preferences.speechRate);
  const recordCharacterWriting = useLearningStore((s) => s.recordCharacterWriting);
  const stats = useLearningStore((s) => s.practice.strokes[item.char]);

  const [names, setNames] = useState<StrokeNames | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("demo");
  const [run, setRun] = useState(0);
  const [current, setCurrent] = useState(0);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [flash, setFlash] = useState<{ text: string; ok: boolean } | null>(null);
  const [result, setResult] = useState<{ totalMistakes: number } | null>(null);
  const [voice, setVoice] = useState(true);
  const voiceRef = useRef(voice);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const sayStroke = (name: string) => {
    if (voiceRef.current) speak(name, "zh", { track: false });
  };

  // Precargar el audio de los nombres para que suene a la vez que se dibuja el trazo.
  useEffect(() => {
    if (names) preloadSpeech([...new Set(names.strokes.map((s) => s.name))], "zh");
  }, [names]);

  // 1) Cargar datos y crear el escritor.
  useEffect(() => {
    let alive = true;
    const host = hostRef.current;
    if (!host) return;
    (async () => {
      try {
        const [{ default: HW }, data] = await Promise.all([import("hanzi-writer"), loadCharacterData(item.char)]);
        if (!alive) return;
        writerRef.current = HW.create(host, item.char, {
          width: SIZE,
          height: SIZE,
          padding: 18,
          showCharacter: false,
          showOutline: true,
          // Más lento que el valor por defecto: da tiempo a seguir el trazo con la vista.
          strokeAnimationSpeed: 0.55,
          delayBetweenStrokes: 250,
          strokeColor: cssVar("--ink", "#1d1d1b"),
          radicalColor: cssVar("--accent", "#4f46e5"),
          outlineColor: cssVar("--line", "#e6e6e2"),
          drawingColor: cssVar("--accent", "#4f46e5"),
          highlightColor: cssVar("--warning", "#a16207"),
          drawingWidth: 22,
          charDataLoader: (char, onLoad, onError) => {
            loadCharacterData(char).then(onLoad, onError);
          },
        });
        setNames(strokeNamesFor(item.char, data));
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "No se pudieron cargar los trazos.");
      }
    })();
    return () => {
      alive = false;
      writerRef.current?.cancelQuiz();
      writerRef.current = null;
      host.innerHTML = "";
    };
  }, [item.char]);

  // 2) Ejecutar el modo activo.
  useEffect(() => {
    const w = writerRef.current;
    if (!w || !names) return;
    const total = names.strokes.length;
    let cancelled = false;
    w.cancelQuiz();

    if (mode === "demo") {
      w.showOutline();
      w.hideCharacter();
      let playback: Playback | null = null;
      (async () => {
        await sleep(300);
        for (let i = 0; i < total && !cancelled; i++) {
          setCurrent(i);
          // El trazo y su nombre van a la par: el siguiente no empieza hasta que
          // terminan ambos (animación y audio).
          const animation = new Promise<void>((res) => w.animateStroke(i, { onComplete: () => res() }));
          playback = voiceRef.current ? speakText(names.strokes[i].name, "zh", speechRate) : null;
          await Promise.all([animation, playback?.done.catch(() => {})]);
          if (cancelled) return;
          await sleep(STROKE_PAUSE_MS);
        }
        if (!cancelled) setCurrent(total);
      })();
      return () => {
        cancelled = true;
        playback?.stop();
      };
    } else {
      w.hideCharacter();
      if (mode === "guided") w.showOutline();
      else w.hideOutline();
      void w.quiz({
        showHintAfterMisses: mode === "guided" ? 2 : 3,
        leniency: 1.1,
        highlightOnComplete: true,
        onCorrectStroke: (d) => {
          const s = names.strokes[d.strokeNum];
          setCurrent(d.strokeNum + 1);
          setFlash({ text: `✓ ${s.name} ${s.pinyin}`, ok: true });
          sayStroke(s.name);
        },
        onMistake: (d) => {
          const s = names.strokes[d.strokeNum];
          setMistakes((m) => {
            const next = [...m];
            next[d.strokeNum] = (next[d.strokeNum] ?? 0) + 1;
            return next;
          });
          setFlash({
            text: d.mistakesOnStroke >= (mode === "guided" ? 2 : 3) ? `Mira la pista: es un ${s.name}` : `Ese no es: ahora va un ${s.name} (${s.es})`,
            ok: false,
          });
        },
        onComplete: ({ totalMistakes }) => {
          setResult({ totalMistakes });
          recordCharacterWriting(item.char, totalMistakes);
        },
      });
    }
    return () => {
      cancelled = true;
      w.cancelQuiz();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reiniciar solo al cambiar modo/intento o al cargar
  }, [names, mode, run]);

  const start = (m: Mode) => {
    setMode(m);
    setRun((r) => r + 1);
    setCurrent(0);
    setMistakes([]);
    setFlash(null);
    setResult(null);
  };

  const total = names?.strokes.length ?? 0;
  const currentStroke = names?.strokes[Math.min(current, total - 1)];
  const finished = mode === "demo" ? current >= total && total > 0 : !!result;
  const weak = names?.strokes
    .map((s, i) => ({ s, i, n: mistakes[i] ?? 0 }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      {/* Lienzo */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative rounded-2xl border border-line bg-surface" style={{ width: SIZE, height: SIZE }}>
          <svg className="pointer-events-none absolute inset-0 text-line" width={SIZE} height={SIZE} aria-hidden>
            <rect x="1" y="1" width={SIZE - 2} height={SIZE - 2} fill="none" stroke="currentColor" />
            <g stroke="currentColor" strokeDasharray="6 6">
              <line x1={SIZE / 2} y1="0" x2={SIZE / 2} y2={SIZE} />
              <line x1="0" y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} />
              <line x1="0" y1="0" x2={SIZE} y2={SIZE} />
              <line x1={SIZE} y1="0" x2="0" y2={SIZE} />
            </g>
          </svg>
          <div ref={hostRef} className="relative touch-none" />
          {!names && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-muted">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {error && <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-danger">{error}</p>}
          {flash && !finished && (
            <div
              key={flash.text + current}
              className={cn(
                "absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium shadow",
                flash.ok ? "bg-success text-white" : "bg-danger text-white",
              )}
            >
              <span className="font-cjk">{flash.text}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-1 rounded-xl bg-surface-2 p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              title={m.hint}
              onClick={() => start(m.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                mode === m.id ? "bg-surface shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => start(mode)}>
            <RotateCcw size={14} /> Reiniciar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setVoice((v) => !v)} title="Decir el nombre de cada trazo en voz alta">
            {voice ? <Volume2 size={14} /> : <VolumeX size={14} />} Nombres en voz alta
          </Button>
        </div>
      </div>

      {/* Información y trazos */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-start gap-4">
          <span lang="zh-CN" className="font-cjk text-6xl leading-none">
            {item.char}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {item.pinyin && <span className="text-xl font-medium">{item.pinyin}</span>}
              <SpeakButton text={item.char} language="zh" size="sm" />
              {total > 0 && <Badge>{total} trazos</Badge>}
              {names && !names.verified && <Badge tone="warning">nombres aproximados</Badge>}
              {stats && (
                <Badge tone="success">
                  <Check size={12} /> escrito {stats.completions}× · mejor: {stats.bestMistakes} fallos
                </Badge>
              )}
            </div>
            {item.meaning && <p className="mt-1 text-sm text-muted">{item.meaning}</p>}
            {item.words.length > 0 && (
              <p className="mt-1 text-sm text-muted">
                Aparece en: <span className="font-cjk text-ink">{item.words.join("、")}</span>
              </p>
            )}
            {item.breakdown && (
              <p className="mt-1 text-sm text-muted">
                Radical <span className="font-cjk text-ink">{item.breakdown.radical.char}</span> · {item.breakdown.radical.meaning}
              </p>
            )}
          </div>
        </div>

        {/* Trazo actual */}
        {currentStroke && !finished && (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-accent/30 bg-accent-soft p-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface font-cjk text-3xl text-accent">
              {currentStroke.glyph}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Trazo {Math.min(current + 1, total)} de {total}
              </p>
              <p className="text-lg font-semibold">
                <span className="font-cjk">{currentStroke.name}</span> <span className="font-normal text-muted">{currentStroke.pinyin}</span>
              </p>
              <p className="text-sm text-muted">{currentStroke.es}</p>
            </div>
            {mode !== "demo" && (
              <Button
                variant="secondary"
                size="sm"
                className="ml-auto"
                onClick={() => writerRef.current?.highlightStroke(current)}
                title="Muestra cómo va este trazo"
              >
                <Lightbulb size={14} /> Pista
              </Button>
            )}
          </div>
        )}

        {/* Resultado */}
        {finished && (
          <div className="mt-5 rounded-2xl border border-success/30 bg-success-soft p-4">
            {mode === "demo" ? (
              <p className="font-medium">Animación completa. Ahora prueba a escribirlo con guía.</p>
            ) : (
              <>
                <p className="font-semibold text-success">
                  {result!.totalMistakes === 0 ? "¡Perfecto, sin fallos!" : `¡Carácter completado con ${result!.totalMistakes} ${result!.totalMistakes === 1 ? "fallo" : "fallos"}!`}
                </p>
                <p className="text-sm text-muted">
                  +{XP.characterWritten + (result!.totalMistakes === 0 ? XP.characterPerfect : 0)} XP
                </p>
                {weak && weak.length > 0 && (
                  <p className="mt-2 text-sm">
                    Repasa:{" "}
                    {weak.map((w) => (
                      <span key={w.i} className="mr-2 font-cjk">
                        #{w.i + 1} {w.s.name} ({w.n})
                      </span>
                    ))}
                  </p>
                )}
              </>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {mode === "demo" ? (
                <Button size="sm" onClick={() => start("guided")}>
                  <Eye size={14} /> Trazar con guía
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="secondary" onClick={() => start(mode)}>
                    <RotateCcw size={14} /> Otra vez
                  </Button>
                  {mode === "guided" && (
                    <Button size="sm" variant="secondary" onClick={() => start("memory")}>
                      <EyeOff size={14} /> De memoria
                    </Button>
                  )}
                </>
              )}
              {onNext && (
                <Button size="sm" onClick={onNext}>
                  Siguiente carácter <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Lista de trazos */}
        {names && (
          <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            {names.strokes.map((s, i) => {
              const done = i < current || finished;
              const active = i === current && !finished;
              const hidden = mode === "memory" && !done && !active;
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-2.5 py-2 text-sm transition",
                    active && "border-accent bg-accent-soft",
                    done && !active && "border-success/30 bg-success-soft",
                    !done && !active && "border-line",
                  )}
                >
                  <span className="w-5 text-xs tabular-nums text-muted">{i + 1}</span>
                  <span className={cn("font-cjk text-xl", active ? "text-accent" : done ? "text-success" : "text-muted")}>
                    {hidden ? "?" : s.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-cjk font-medium">{hidden ? "···" : s.name}</span>
                    <span className="block truncate text-xs text-muted">{hidden ? "" : s.pinyin}</span>
                  </span>
                  {(mistakes[i] ?? 0) > 0 && <span className="ml-auto text-xs text-danger">×{mistakes[i]}</span>}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
