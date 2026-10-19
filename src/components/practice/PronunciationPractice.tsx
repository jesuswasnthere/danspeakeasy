"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Headphones, Mic, MicOff, Square } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { bestAlternative, feedbackFor } from "@/lib/pronunciation";
import { getTone, isRichTokens, syllables, TONE_LABELS, type Tone } from "@/lib/richText";
import { useVoiceRecorder, type MicIssue } from "@/hooks/useVoiceRecorder";
import { PRONUNCIATION_PASS, useLearningStore } from "@/store/useLearningStore";
import type { LanguageCode, PronunciationItem } from "@/types/learning";
import { RichTextView, ToneColoredTerm } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Badge, Button, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";

type Filter = "palabra" | "frase";

export function PronunciationPractice() {
  const { language, level, stats } = useLearningStore(
    useShallow((s) => ({ language: s.language, level: s.level, stats: s.practice.pronunciation })),
  );
  const all = useMemo(() => content.getPronunciationItems(level), [level]);
  const [filter, setFilter] = useState<Filter>("palabra");
  const items = all.filter((i) => i.kind === filter);
  const [index, setIndex] = useState(0);
  const item = items[Math.min(index, items.length - 1)];
  const passed = items.filter((i) => (stats[i.id]?.bestScore ?? 0) >= PRONUNCIATION_PASS).length;

  if (!all.length) {
    return (
      <Card>
        <EmptyState icon={<Mic size={22} />} title="Aún no hay contenido de pronunciación" body="Este nivel todavía no tiene lecciones disponibles." />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-surface-2 p-1">
          {(["palabra", "frase"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setIndex(0);
              }}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium transition",
                filter === f ? "bg-surface shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {f === "palabra" ? "Palabras" : "Frases"} ({all.filter((i) => i.kind === f).length})
            </button>
          ))}
        </div>
        <div className="flex min-w-48 items-center gap-2 text-sm text-muted">
          <ProgressBar value={items.length ? passed / items.length : 0} tone="success" />
          <span className="shrink-0 tabular-nums">
            {passed}/{items.length} superadas
          </span>
        </div>
      </div>

      {item && (
        <PronunciationCard
          key={item.id}
          item={item}
          language={language}
          position={`${Math.min(index, items.length - 1) + 1} / ${items.length}`}
          onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
          onNext={index < items.length - 1 ? () => setIndex((i) => i + 1) : undefined}
        />
      )}
    </div>
  );
}

/** Barras que se mueven con el volumen: confirman que llega audio del micrófono. */
function LevelMeter({ level }: { level: number }) {
  const bars = 14;
  return (
    <div className="flex h-8 items-end gap-1" aria-label="Nivel del micrófono">
      {Array.from({ length: bars }, (_, i) => {
        const threshold = (i + 1) / bars;
        const on = level >= threshold * 0.9;
        return (
          <span
            key={i}
            className={cn("w-1.5 rounded-full transition-all duration-75", on ? (i > bars * 0.75 ? "bg-warning" : "bg-success") : "bg-line")}
            style={{ height: `${30 + threshold * 70}%` }}
          />
        );
      })}
    </div>
  );
}

type Recorder = ReturnType<typeof useVoiceRecorder>;

/** Prueba del micrófono: medidor en vivo, selector de dispositivo y diagnóstico. */
function MicCheck({ rec }: { rec: Recorder }) {
  const testing = rec.status === "testing";
  const [open, setOpen] = useState(false);
  const show = open || testing || (rec.status === "error" && !rec.heardByRecognizer);
  const verdict =
    rec.peak > 0.55 ? (
      <span className="text-success">✓ El micrófono funciona: se oye bien.</span>
    ) : rec.peak > 0.3 ? (
      <span className="text-warning">Se oye, pero bajo: acércate al micrófono o sube su volumen en Windows.</span>
    ) : (
      <span className="text-danger">
        No llega sonido de este micrófono. Elige otro en la lista o revisa que no esté silenciado (Windows → Configuración → Sistema → Sonido →
        Entrada).
      </span>
    );

  if (!show) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-muted underline hover:text-ink">
        ¿Problemas con el micrófono? Probar micrófono
      </button>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-line bg-surface-2 p-4 text-sm">
      <p className="font-medium">Prueba de micrófono</p>
      {rec.devices.length > 0 && (
        <label className="flex w-full flex-col gap-1 text-xs text-muted">
          Micrófono para grabar
          <select
            value={rec.deviceId}
            onChange={(e) => {
              rec.setDeviceId(e.target.value);
              if (testing) rec.stopTest();
            }}
            className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
          >
            <option value="">Predeterminado del sistema</option>
            {rec.devices.map((d, i) => (
              <option key={d.deviceId || i} value={d.deviceId}>
                {d.label || `Micrófono ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
      )}
      {testing ? (
        <>
          <LevelMeter level={rec.level} />
          <p className="text-xs text-muted">Di algo en voz alta: las barras deben moverse.</p>
          <Button size="sm" variant="secondary" onClick={rec.stopTest}>
            Terminar prueba
          </Button>
        </>
      ) : (
        <Button size="sm" onClick={() => void rec.startTest()}>
          <Mic size={14} /> Probar micrófono
        </Button>
      )}
      {!testing && rec.peak > 0 && <p className="text-center text-xs">{verdict}</p>}
      <p className="text-center text-xs text-muted">
        El reconocimiento de voz usa siempre el micrófono <b>predeterminado del navegador</b>. Si el bueno no es el predeterminado, cámbialo en el
        icono del candado junto a la dirección (o en <span className="font-mono">chrome://settings/content/microphone</span> /{" "}
        <span className="font-mono">edge://settings/content/microphone</span>).
      </p>
    </div>
  );
}

function MicIssueBanner({ issue, recognitionSupported }: { issue: MicIssue; recognitionSupported: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!issue && recognitionSupported) return null;

  const copy = () => {
    void navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true));
  };

  const content =
    issue === "embedded" ? (
      <>
        <p className="font-medium">Este navegador integrado no permite usar el micrófono.</p>
        <p>Abre esta página en Chrome o Edge para practicar la pronunciación.</p>
      </>
    ) : issue === "denied" ? (
      <>
        <p className="font-medium">El micrófono está bloqueado para esta página.</p>
        <p>
          Pulsa el icono del candado junto a la dirección → <b>Micrófono: Permitir</b> → recarga la página.
        </p>
      </>
    ) : (
      <>
        <p className="font-medium">Este navegador no tiene reconocimiento de voz.</p>
        <p>Para obtener puntuación usa Chrome o Edge. Aquí aún puedes grabarte y comparar tu voz con el modelo.</p>
      </>
    );

  return (
    <div className="flex max-w-lg flex-col items-center gap-2 rounded-xl border border-warning/30 bg-warning-soft p-3 text-center text-sm">
      {content}
      {issue === "embedded" && (
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? "¡Enlace copiado!" : "Copiar enlace para Chrome / Edge"}
        </Button>
      )}
    </div>
  );
}

function PronunciationCard({
  item,
  language,
  position,
  onPrev,
  onNext,
}: {
  item: PronunciationItem;
  language: LanguageCode;
  position: string;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const showTranslation = useLearningStore((s) => s.preferences.showTranslation);
  const showPinyin = useLearningStore((s) => s.preferences.showPinyin);
  const best = useLearningStore((s) => s.practice.pronunciation[item.id]?.bestScore);
  const recordPronunciation = useLearningStore((s) => s.recordPronunciation);
  const rec = useVoiceRecorder();
  const result = useMemo(
    () => (rec.status === "done" && rec.alternatives.length ? bestAlternative(language, item.plain, rec.alternatives) : null),
    [rec.status, rec.alternatives, language, item.plain],
  );

  // Registrar cada intento una sola vez (cada resultado nuevo es un objeto nuevo).
  const recorded = useRef<unknown>(null);
  useEffect(() => {
    if (!result || recorded.current === result) return;
    recorded.current = result;
    recordPronunciation(item.id, result.score);
  }, [result, item.id, recordPronunciation]);

  const fb = result ? feedbackFor(result.score) : null;
  const listening = rec.status === "listening";

  // Pinyin de cada carácter del objetivo, para dar pistas de tono en los fallos.
  const charHints = useMemo(() => {
    const map: { char: string; syl: string; tone?: number }[] = [];
    if (language !== "zh") return map;
    if (isRichTokens(item.text)) {
      for (const t of item.text) {
        const chars = Array.from(t.text);
        const syls = t.pinyin ? syllables(t.pinyin) : [];
        chars.forEach((c, i) => {
          if (!/[㐀-鿿]/.test(c)) return;
          const syl = syls.length === chars.length ? syls[i] : "";
          map.push({ char: c, syl, tone: syl ? getTone(syl) : undefined });
        });
      }
    } else {
      Array.from(item.plain).forEach((c, i) => map.push({ char: c, syl: "", tone: item.tones?.[i] }));
    }
    return map;
  }, [item.text, item.plain, item.tones, language]);

  const missedHints = result && language === "zh" ? result.target.map((t, i) => (!t.matched ? charHints[i] : null)).filter(Boolean) : [];

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>{item.source}</span>
        <span className="flex items-center gap-2">
          {best !== undefined && <Badge tone={best >= PRONUNCIATION_PASS ? "success" : "neutral"}>mejor: {best}%</Badge>}
          {position}
        </span>
      </div>

      <div className="py-8 text-center">
        {item.kind === "palabra" && language === "zh" ? (
          <>
            <ToneColoredTerm term={item.plain} tones={item.tones} className="text-7xl" />
            {showPinyin && item.pinyin && <p className="mt-2 text-2xl font-medium text-muted">{item.pinyin}</p>}
          </>
        ) : item.kind === "palabra" ? (
          <>
            <p className="text-5xl font-semibold">{item.plain}</p>
            {item.ipa && <p className="mt-2 font-mono text-muted">{item.ipa}</p>}
          </>
        ) : (
          <RichTextView text={item.text} size="xl" className={language === "en" ? "text-2xl font-medium" : ""} />
        )}
        {showTranslation && <p className="mt-3 text-muted">{item.translation}</p>}
        <div className="mt-5 flex justify-center gap-2">
          <SpeakButton text={item.plain} language={language} label="Escuchar" />
          <SpeakButton text={item.plain} language={language} label="Lento" slow />
        </div>
      </div>

      {/* Micrófono */}
      <div className="flex flex-col items-center gap-3">
        <MicIssueBanner issue={rec.issue} recognitionSupported={rec.recognitionSupported} />
        <button
          type="button"
          onClick={() => (listening ? rec.stop() : rec.start(language))}
          disabled={rec.issue === "embedded" || (!rec.recordingSupported && !rec.recognitionSupported)}
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition disabled:opacity-40",
            listening ? "speaking bg-danger" : "bg-accent hover:scale-105",
          )}
          aria-label={listening ? "Detener" : "Hablar"}
        >
          {listening ? <Square size={28} /> : <Mic size={30} />}
        </button>
        {listening && <LevelMeter level={rec.level} />}
        <p className="text-sm text-muted">
          {listening ? (
            rec.interim ? (
              <span className="font-cjk text-ink">«{rec.interim}»</span>
            ) : (
              "Te escucho… habla ahora (pulsa ■ al terminar)"
            )
          ) : (
            "Pulsa el micrófono y lee en voz alta"
          )}
        </p>
        {rec.error && (
          <p className="flex max-w-md items-start gap-1.5 text-center text-sm text-danger">
            <MicOff size={14} className="mt-0.5 shrink-0" /> {rec.error}
          </p>
        )}
        {rec.issue !== "embedded" && <MicCheck rec={rec} />}
      </div>

      {/* Resultado */}
      {(result || (rec.status === "done" && rec.audioUrl)) && (
        <div className={cn("mt-6 rounded-2xl border p-5", fb ? (fb.tone === "success" ? "border-success/30 bg-success-soft" : fb.tone === "warning" ? "border-warning/30 bg-warning-soft" : "border-danger/30 bg-danger-soft") : "border-line")}>
          {result && fb && (
            <>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-semibold tabular-nums">{result.score}%</span>
                <div>
                  <p className="font-semibold">{fb.title}</p>
                  <p className="text-sm text-muted">{fb.body}</p>
                </div>
              </div>
              <div className={cn("mt-4 flex flex-wrap gap-1", language === "zh" ? "font-cjk text-3xl" : "text-xl")}>
                {result.target.map((t, i) => (
                  <span key={i} className={cn("rounded px-0.5", t.matched ? "text-success" : "bg-danger/10 text-danger underline decoration-wavy")}>
                    {t.unit}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">
                Entendí: <span className="font-cjk text-ink">«{result.heard || "—"}»</span>
              </p>
              {missedHints.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {missedHints.map((h, i) =>
                    h && h.tone ? (
                      <li key={i} className="rounded-lg bg-surface px-2 py-1">
                        <span className="font-cjk">{h.char}</span> {h.syl} · {TONE_LABELS[h.tone as Tone]}
                      </li>
                    ) : null,
                  )}
                </ul>
              )}
            </>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {rec.audioUrl && (
              <Button variant="secondary" size="sm" onClick={rec.playRecording}>
                <Headphones size={14} /> Escuchar mi voz
              </Button>
            )}
            <SpeakButton text={item.plain} language={language} label="Modelo" />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={onPrev} disabled={!onPrev}>
          <ArrowLeft size={15} /> Anterior
        </Button>
        <Button variant="secondary" onClick={onNext} disabled={!onNext}>
          Siguiente <ArrowRight size={15} />
        </Button>
      </div>
    </Card>
  );
}
